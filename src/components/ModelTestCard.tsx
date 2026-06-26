import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Award, Target, Settings, Play, ArrowRight, HelpCircle, Check, X, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { getQuestionPool } from "../lib/questionGenerator";

export const ModelTestCard: React.FC = () => {
  const { modelPapers, selectedPaper } = useApp();

  // Generator Config states
  const [testType, setTestType] = useState<"topic" | "full">("topic");
  const [testSubject, setTestSubject] = useState<string>("Telugu");
  const [testDifficulty, setTestDifficulty] = useState<string>("Medium");
  const [testSize, setTestSize] = useState<number>(20);

  // Active generated test state
  const [testActive, setTestActive] = useState<boolean>(false);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);

  // Exhausted state
  const [allExhausted, setAllExhausted] = useState<boolean>(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Clean and remove question IDs and loop markers
  const cleanQuestionText = (text: string) => {
    if (!text) return "";
    let cleaned = text.replace(/\s*\[(Question ID|ప్రశ్న ID|ప్రశ్న ID\s*):\s*[^\]]+\]/gi, "");
    cleaned = cleaned.replace(/\s*\((వరుస సంఖ్య|అభ్యాసం):\s*\d+\)/gi, "");
    return cleaned.trim();
  };

  const handleGenerateTest = (forceRevision = false) => {
    const rawPool = getQuestionPool(testSubject);
    
    // De-duplicate and clean questions in the raw pool
    const seenTexts = new Set<string>();
    const pool: any[] = [];
    rawPool.forEach(q => {
      const cleaned = cleanQuestionText(q.question);
      if (!seenTexts.has(cleaned)) {
        seenTexts.add(cleaned);
        pool.push({
          ...q,
          question: cleaned
        });
      }
    });

    const attemptedKey = `model_test_attempted_${testSubject.toLowerCase()}`;
    let attempted: string[] = [];
    try {
      attempted = JSON.parse(localStorage.getItem(attemptedKey) || "[]");
    } catch (e) {
      console.error(e);
    }

    const unattempted = pool.filter(q => !attempted.includes(q.id));

    if (unattempted.length === 0 && !forceRevision) {
      setAllExhausted(true);
      return;
    }

    setAllExhausted(false);

    let selectedQuestions: any[] = [];
    if (forceRevision || unattempted.length < testSize) {
      selectedQuestions = [...unattempted];
      const attemptedQuestions = pool.filter(q => attempted.includes(q.id));
      const shuffledAttempted = [...attemptedQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions = [...selectedQuestions, ...shuffledAttempted].slice(0, testSize);
    } else {
      const shuffledUnattempted = [...unattempted].sort(() => 0.5 - Math.random());
      selectedQuestions = shuffledUnattempted.slice(0, testSize);
    }

    // Shuffle options for each selected question
    selectedQuestions = selectedQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));

    // If still empty, fallback to modelPapers
    if (selectedQuestions.length === 0) {
      selectedQuestions = [...modelPapers]
        .filter(q => q.subject.toLowerCase() === testSubject.toLowerCase())
        .map(q => ({
          ...q,
          question: cleanQuestionText(q.question),
          options: [...q.options].sort(() => 0.5 - Math.random())
        }))
        .slice(0, testSize);
    }

    // Record selected questions as attempted immediately to guarantee they won't repeat next time
    try {
      const newAttempted = [...attempted];
      selectedQuestions.forEach(q => {
        if (q.id && !newAttempted.includes(q.id)) {
          newAttempted.push(q.id);
        }
      });
      localStorage.setItem(attemptedKey, JSON.stringify(newAttempted));
    } catch (e) {
      console.error(e);
    }

    setTestQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
    setTestActive(true);

    const totalSeconds = testSize * 90;
    setTimeLeft(totalSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRestartBank = () => {
    const attemptedKey = `model_test_attempted_${testSubject.toLowerCase()}`;
    localStorage.removeItem(attemptedKey);
    setAllExhausted(false);
    setTimeout(() => {
      handleGenerateTest(false);
    }, 100);
  };

  const handleContinueRevision = () => {
    setAllExhausted(false);
    setTimeout(() => {
      handleGenerateTest(true);
    }, 100);
  };

  const handleSelectOption = (opt: string) => {
    if (testSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: opt,
    }));
  };

  const handleSubmitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let scores = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        scores++;
      }
    });

    setTestScore(scores);
    setTestSubmitted(true);
  };

  const handleExitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestActive(false);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const subjectsList = selectedPaper === "AP TET Paper I (Classes 1–5)"
    ? ["Telugu", "English", "Mathematics", "Environmental Studies"]
    : ["Telugu", "English", "Mathematics", "Science", "Social Studies", "Hindi"];

  useEffect(() => {
    if (!subjectsList.includes(testSubject)) {
      setTestSubject(subjectsList[0] || "Telugu");
    }
  }, [selectedPaper, subjectsList, testSubject]);

  const difficultyLevels = ["Easy", "Medium", "Hard", "Random Mix"];
  const sizesList = [20, 30, 50];

  return (
    <div className="space-y-6" id="model_papers_playground">
      {/* Intro Dashboard */}
      {!testActive ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-white/10 blur-xl"></div>
            <div className="relative z-10 max-w-xl space-y-2">
              <span className="inline-flex px-2.5 py-0.5 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">MOCK TESTING LAB</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">నమూనా పత్రాలు & మాక్ టెస్టులు (Model Papers)</h2>
              <p className="text-sm text-emerald-100 leading-relaxed font-semibold">
                విభిన్న కష్ట స్థాయిలతో, ఏపీ టెట్ సిలబస్ లోని అంశాలవారీగా లేదా పూర్తి లెంత్ మాక్ పరీక్షలను రాసి పరీక్షా పరిజ్ఞానాన్ని మెరుగుపరచుకోండి.
              </p>
            </div>
          </div>

          {/* All Exhausted Dialog */}
          {allExhausted ? (
            <div className="bg-white border-2 border-amber-500/20 rounded-3xl p-6 shadow-sm space-y-5 text-center animate-fadeIn" id="exhausted_dialog">
              <div className="w-14 h-14 bg-amber-550/10 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-800">మీరు ఈ అంశంలోని అన్ని ప్రశ్నలను పూర్తి చేశారు. మళ్లీ ప్రారంభించాలా?</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  ఈ సబ్జెక్టుకు సంబంధించిన అన్ని ప్రశ్నలను మీరు విజయవంతంగా పూర్తి చేశారు. కొత్తగా మొదటి నుండి ప్రారంభించాలనుకుంటున్నారా లేదా పునర్విమర్శ చేయాలనుకుంటున్నారా?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartBank}
                  className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all"
                >
                  Restart Question Bank (మళ్లీ ప్రారంభించు)
                </button>
                <button
                  onClick={handleContinueRevision}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 cursor-pointer transition-all"
                >
                  Continue Revision (పునర్విమర్శ చేయండి)
                </button>
              </div>
            </div>
          ) : (
            /* Test Configuration Board */
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6" id="test_creation_setup">
              <h3 className="text-base font-black text-slate-800 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-teal-600" />
                <span>పరీక్ష కాన్ఫిగరేషన్ (Configure Model Test)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selector for Test Type */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">1. పరీక్ష రకం (Test Type)</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => {
                        setTestType("topic");
                        setTestSize(20);
                      }}
                      className={`flex-1 p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                        testType === "topic"
                          ? "border-teal-600 bg-teal-50 text-teal-700 font-extrabold ring-1 ring-teal-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Target className="w-4 h-4 text-current" />
                      <span>Topic-wise Test (లిమిటెడ్)</span>
                    </button>
                    <button
                      onClick={() => {
                        setTestType("full");
                        setTestSize(30);
                      }}
                      className={`flex-1 p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                        testType === "full"
                          ? "border-teal-600 bg-teal-50 text-teal-700 font-extrabold ring-1 ring-teal-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Award className="w-4 h-4 text-current" />
                      <span>Full-Length Mock Test (పూర్తి)</span>
                    </button>
                  </div>
                </div>

                {/* Selector for Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="test_subject_select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">2. సబ్జెక్ట్ (Select Subject)</label>
                  <select
                    id="test_subject_select"
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    className="block w-full p-2.5 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {subjectsList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Selector for Difficulty */}
                <div className="space-y-1.5">
                  <label htmlFor="test_diff_select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">3. కష్ట స్థాయి (Difficulty Level)</label>
                  <select
                    id="test_diff_select"
                    value={testDifficulty}
                    onChange={(e) => setTestDifficulty(e.target.value)}
                    className="block w-full p-2.5 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {difficultyLevels.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Questions counts size */}
                <div className="space-y-1.5">
                  <label htmlFor="test_size_select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">4. ప్రశ్నల సంఖ్య (Number of Questions)</label>
                  <select
                    id="test_size_select"
                    value={testSize}
                    onChange={(e) => setTestSize(Number(e.target.value))}
                    className="block w-full p-2.5 mt-1 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {sizesList.map(sz => (
                      <option key={sz} value={sz}>{sz} Questions (~ {sz * 1.5} mins)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Disclaimer of scaling pool capability */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-normal">
                  మా ప్రశ్నల బ్యాంక్ లో ప్రతి సబ్జెక్టుకూ 500+ చొప్పున మొత్తం వేలకొద్దీ ప్రశ్నలు ఉన్నాయి. మీరు మాక్ టెస్ట్ ప్రారంభించిన ప్రతిసారీ విభిన్నమైన మరియు యాదృచ్ఛికంగా ఎంపిక చేయబడిన ప్రశ్నలు రూపుదాల్చుకుంటాయి.
                </p>
              </div>

              {/* Launch Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleGenerateTest(false)}
                  id="generate_test_action"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  <span>పరీక్ష ప్రారంభించండి (Generate & Start)</span>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Full-Length Live Exam Interface */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]" id="live_test_station">
          {/* Left panel details / progress list */}
          <div className="bg-slate-50 p-5 md:w-64 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between animate-fadeIn">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Mock Test</span>
                <button
                  onClick={handleExitTest}
                  className="text-xs text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer"
                >
                  Exit Test
                </button>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{testSubject}</h4>
                <p className="text-xs text-slate-400 mt-1">{testType === "topic" ? "Topic-wise Practice" : "Full Length Mock"} • {testDifficulty}</p>
              </div>

              {/* Stopwatch countdown */}
              {!testSubmitted && (
                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <span className="flex items-center text-xs text-slate-400 font-medium">
                    <Clock className="w-4 h-4 mr-1 text-teal-400" />
                    Time Remaining:
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wide text-teal-300">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}

              {/* Progress matrix Grid - only clickable if not submitted */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Question Palette</span>
                <div className="grid grid-cols-5 gap-1.5" id="questions_palette_grid">
                  {testQuestions.map((_, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const isActive = currentQuestionIndex === idx;

                    let btnStyle = "bg-white text-slate-600 border-slate-200";
                    if (isAnswered) btnStyle = "bg-teal-500 text-white border-teal-500";
                    if (isActive) btnStyle = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/20";

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`p-1.5 text-xs font-mono font-black border text-center rounded-lg transition-all cursor-pointer ${btnStyle}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grade submit trigger */}
            {!testSubmitted ? (
              <button
                onClick={handleSubmitTest}
                id="submit_live_test_btn"
                className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Submit & Grade Test
              </button>
            ) : (
              <button
                onClick={() => handleGenerateTest(false)}
                className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Retake / New Test
              </button>
            )}
          </div>

          {/* Core active question detail window */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between bg-white whitespace-normal">
            {testSubmitted ? (
              <div className="space-y-8 overflow-y-auto max-h-[80vh] pr-2">
                {/* Score Card Dashboard */}
                <div className="p-5 rounded-2xl bg-teal-50 border-2 border-teal-600/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" id="mock_result_scoring_badge">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-2xl font-black text-white font-sans shadow-md">
                      {testScore}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">పరీక్ష పూర్తయింది! (Graded Scorecard)</h5>
                      <p className="text-xs text-slate-500 mt-0.5">సరియైన సమాధానాలు: {testScore} / {testQuestions.length}</p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-xl font-black text-teal-600 font-mono">{Math.round((testScore / testQuestions.length) * 100)}%</div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TET Success Probability</span>
                  </div>
                </div>

                {/* Questions Review List */}
                <div className="space-y-6">
                  {testQuestions.map((q, qIdx) => {
                    const userAns = userAnswers[qIdx];
                    const hasAnswered = userAns !== undefined;
                    const isCorrect = userAns === q.answer;

                    return (
                      <div key={q.id || qIdx} className="p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm bg-white animate-fadeIn">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold text-slate-500">ప్రశ్న {qIdx + 1} / {testQuestions.length}</span>
                          {hasAnswered ? (
                            isCorrect ? (
                              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg select-none">
                                <Check className="w-3.5 h-3.5 mr-1" /> సరి అయినది (Correct)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg select-none">
                                <X className="w-3.5 h-3.5 mr-1" /> తప్పు (Incorrect)
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg select-none-not">
                              సమాధానం ఇవ్వలేదు (Not Answered)
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-relaxed">{q.question}</h4>
                        </div>

                        {/* Options List Review */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt: string) => {
                            const isSelected = userAns === opt;
                            const isCorrectAnswer = opt === q.answer;

                            let optStyle = "bg-white border-slate-200 opacity-60";
                            let textStyle = "text-slate-500 animate-fadeIn";
                            let checkIcon = null;

                            if (isCorrectAnswer) {
                              optStyle = "bg-emerald-50 border-emerald-500 opacity-100 ring-1 ring-emerald-500/10 shadow-sm";
                              textStyle = "text-emerald-950 font-bold";
                              checkIcon = <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />;
                            } else if (isSelected) {
                              optStyle = "bg-rose-50 border-rose-500 opacity-100 ring-1 ring-rose-500/10 shadow-sm";
                              textStyle = "text-rose-950 font-bold";
                              checkIcon = <X className="w-4.5 h-4.5 text-rose-600 shrink-0" />;
                            }

                            return (
                              <div
                                key={opt}
                                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold select-none transition-all ${optStyle}`}
                              >
                                <span className={textStyle}>{opt}</span>
                                {checkIcon}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation block */}
                        <div className="p-4 bg-teal-50/40 border border-teal-100 rounded-xl space-y-1">
                          <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest flex items-center space-x-1 select-none">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>జవాబు విశ్లేషణ (Bilingual Explanation)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-slate-700 leading-normal font-medium">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Core Active Question Non-Submitted Stepper View */
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-6">
                  {/* Question header progress */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3 font-medium select-none-cur">
                    <span>సమస్య {currentQuestionIndex + 1} / {testQuestions.length}</span>
                    <span>లక్ష్యం: {testDifficulty}</span>
                  </div>

                  {/* Question Text Box */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-fadeIn" id="mock_question_text">
                    <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-relaxed flex items-start space-x-2.5">
                      <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-1" />
                      <span>{testQuestions[currentQuestionIndex]?.question}</span>
                    </h4>
                  </div>

                  {/* Multiple Choice Answers mapping */}
                  <div className="grid grid-cols-1 gap-3 shrink-0" id="mock_question_options">
                    {testQuestions[currentQuestionIndex]?.options.map((opt: string) => {
                      const isSelected = userAnswers[currentQuestionIndex] === opt;

                      let optStyle = "bg-white border-slate-200 hover:border-slate-300";
                      let textStyle = "text-slate-700";

                      if (isSelected) {
                        optStyle = "bg-blue-50 border-blue-500 ring-2 ring-blue-500/10";
                        textStyle = "text-blue-900 font-extrabold";
                      }

                      return (
                        <button
                          key={opt}
                          disabled={testSubmitted}
                          onClick={() => handleSelectOption(opt)}
                          className={`p-4 rounded-xl text-left border flex items-center justify-between text-sm sm:text-base font-semibold transition-all cursor-pointer ${optStyle}`}
                        >
                          <span className={textStyle}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper Footer layout */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between select-none">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 border border-slate-200 text-slate-600 disabled:opacity-30 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Previous Question
                  </button>

                  {currentQuestionIndex < testQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(testQuestions.length - 1, prev + 1))}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                    >
                      Finish Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
