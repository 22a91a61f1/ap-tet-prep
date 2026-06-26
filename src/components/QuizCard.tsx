import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { HelpCircle, ChevronRight, CheckCircle2, AlertCircle, RefreshCw, XCircle, Trophy } from "lucide-react";

export const QuizCard: React.FC = () => {
  const {
    selectedTopicId,
    quizzes,
    saveQuizScore,
    quizScores,
    getTopicsForCurrentSubject,
    setSelectedTopicId,
  } = useApp();

  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Active quiz pool
  const getSlippedQuestions = (rawQuestions: any[]) => {
    if (!rawQuestions) return [];
    // Display all available questions up to 20 (satisfying >= 10, preferred limit up to 20).
    return rawQuestions.slice(0, 20);
  };

  const rawQuizQuestions = quizzes[selectedTopicId] || quizzes["default"] || [];
  const [quizQuestions, setQuizQuestions] = useState<any[]>(() => getSlippedQuestions(rawQuizQuestions));

  useEffect(() => {
    // Reset state on topic switch
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);

    const baseQuestions = quizzes[selectedTopicId] || quizzes["default"] || [];
    setQuizQuestions(getSlippedQuestions(baseQuestions));
  }, [selectedTopicId, quizzes]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return; // locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Grade the test
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    saveQuizScore(selectedTopicId, correctCount, quizQuestions.length);
  };

  // Move to next topic in syllabus hierarchy
  const handleNextTopic = () => {
    const topics = getTopicsForCurrentSubject();
    const currentIndex = topics.findIndex(t => t.id === selectedTopicId);
    if (currentIndex !== -1 && currentIndex < topics.length - 1) {
      setSelectedTopicId(topics[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("మరిన్ని టాపిక్స్ కోసం వేరే సబ్జెక్టును ఎంచుకోవచ్చు.");
    }
  };

  const isCurrentQuestionAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const lastScoreInfo = quizScores[selectedTopicId];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6" id={`quiz_container_${selectedTopicId}`}>
      {/* Quiz Dashboard / Launcher */}
      {!quizStarted ? (
        <div className="text-center py-8 px-4 space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
              టాపిక్ సాధన క్విజ్ (Topic Practice Quiz)
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              వీడియో క్లాస్ చూసిన తర్వాత ఈ క్రింది ప్రశ్నలతో మిమ్మల్ని మీరు పరీక్షించుకోండి. ప్రతి ప్రశ్నకు వివరణలు అందుబాటులో ఉంటాయి.
            </p>
          </div>

          {/* Previous Score display */}
          {lastScoreInfo && (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl border border-emerald-100 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>చివరి ప్రయత్నం స్కోర్: {lastScoreInfo.score} / {lastScoreInfo.total} ({lastScoreInfo.percentage}%)</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStartQuiz}
              id="start_quiz_btn"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 transition-colors cursor-pointer"
            >
              Start Quiz (క్విజ్ ప్రారంభించండి)
            </button>
            <button
              onClick={handleNextTopic}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:text-slate-900 border border-slate-200 transition-colors"
            >
              Skip Quiz & Next Topic
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz taking Screen */
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                {isSubmitted ? "Quiz Completed Report" : "Practice In Progress"}
              </span>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Answered: {answeredCount}/{quizQuestions.length}</span>
              {isSubmitted && (
                <button
                  onClick={handleStartQuiz}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>

          {/* Quiz Question Box */}
          <div className="space-y-4" id={`question_view_${currentQuestionIndex}`}>
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-relaxed flex items-start space-x-2.5">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <span>{currentQuestion.question}</span>
              </h4>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === opt;
                const isCorrect = opt === currentQuestion.answer;
                
                // Style highlights if submitted
                let bgStyle = "bg-white border-slate-200 hover:border-slate-300";
                let textStyle = "text-slate-700";
                let icon = null;

                if (isSelected) {
                  bgStyle = "bg-blue-50 border-blue-500 ring-2 ring-blue-500/15";
                  textStyle = "text-blue-900";
                }

                if (isSubmitted) {
                  if (isCorrect) {
                     bgStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/10";
                     textStyle = "text-emerald-900 font-bold";
                     icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (isSelected) {
                     bgStyle = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/10";
                     textStyle = "text-rose-900";
                     icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                  } else {
                     bgStyle = "bg-slate-50 opacity-60 border-slate-100 text-slate-400";
                     textStyle = "text-slate-400";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-xl text-left border flex items-center justify-between text-sm sm:text-base font-semibold transition-all ${
                      !isSubmitted ? "cursor-pointer" : ""
                    } ${bgStyle}`}
                  >
                    <span className={textStyle}>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Banner */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5" id="explanation_box">
              <span className="inline-flex items-center space-x-1 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>సమాధాన వివరణ (Explanation)</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 rounded-xl text-xs font-bold transition-all"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === quizQuestions.length - 1}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 rounded-xl text-xs font-bold transition-all"
              >
                Next
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={answeredCount < quizQuestions.length}
                  id="submit_quiz_action"
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                    answeredCount === quizQuestions.length
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 cursor-pointer"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                  title={answeredCount < quizQuestions.length ? "క్విజ్ పూర్తి చేయడానికి అన్ని ప్రశ్నలకు జవాబులు ఇవ్వండి." : ""}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextTopic}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black flex items-center space-x-1 shadow-md shadow-blue-100 transition-all cursor-pointer"
                >
                  <span>Next Topic</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Submission Score Report Display */}
          {isSubmitted && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-4" id="score_report">
              <div className="flex items-center space-x-3.5">
                <div className="text-3xl font-black font-sans text-amber-600 bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center border border-amber-200">
                  {score}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">స్కోరింగ్ రిపోర్ట్ (Scorecard Details)</h4>
                  <p className="text-xs text-slate-500">మీరు {quizQuestions.length} ప్రశ్నలకు గాను {score} సరైన విజయాలు నమోదు చేశారు.</p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <div className="text-xl font-mono font-black text-amber-600">{Math.round((score / quizQuestions.length) * 100)}%</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">చివరి రేటింగ్ (Rating)</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
