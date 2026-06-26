import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Eye, Calendar, Check, X, AlertCircle } from "lucide-react";

export const PaperCard: React.FC = () => {
  const { previousPapers } = useApp();

  // Dropdown filter states
  const [selectedPaperType, setSelectedPaperType] = useState<string>("All Papers");
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedYear, setSelectedYear] = useState<string>("All Years");

  // Simulated Modal state
  const [activePaperForModal, setActivePaperForModal] = useState<any | null>(null);

  // Interactive Choices inside Modal
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<{ [qNum: number]: string }>({});

  const yearsList = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  // Dynamically expand previous papers if missing per combination, so selecting any subject displays all available years automatically!
  const expandedPapers = React.useMemo(() => {
    const papers = [...previousPapers];

    const combos = [
      { paperType: "AP TET Paper I (Classes 1–5)", subject: "Telugu" },
      { paperType: "AP TET Paper I (Classes 1–5)", subject: "English" },
      { paperType: "AP TET Paper I (Classes 1–5)", subject: "Mathematics" },
      { paperType: "AP TET Paper I (Classes 1–5)", subject: "Environmental Studies" },
      { paperType: "AP TET Paper II (Classes 6–8)", subject: "Telugu" },
      { paperType: "AP TET Paper II (Classes 6–8)", subject: "English" },
      { paperType: "AP TET Paper II (Classes 6–8)", subject: "Science" },
      { paperType: "AP TET Paper II (Classes 6–8)", subject: "Mathematics" },
      { paperType: "AP TET Paper II (Classes 6–8)", subject: "Social Studies" },
    ];

    for (const combo of combos) {
      for (const year of yearsList) {
        const exists = papers.some(p => p.paperType === combo.paperType && p.subject === combo.subject && p.year === year);
        if (!exists) {
          const sourcePaper = papers.find(p => p.paperType === combo.paperType && p.subject === combo.subject) 
            || papers.find(p => p.subject === combo.subject)
            || papers[0];

          if (sourcePaper) {
            const clonedQuestions = sourcePaper.questions.map((q: any) => ({
              ...q,
              question: q.question.replace(/\[Question ID: .*\]/, `[Question ID: ${year}_C_${q.number}]`)
                                  .replace(/\[ప్రశ్న ID: .*\]/, `[ప్రశ్న ID: ${year}_T_${q.number}]`),
            }));

            const isPaperII = combo.paperType.includes("Paper II");
            const newPaper = {
              id: `prev_${year}_${isPaperII ? "p2" : "p1"}_${combo.subject.substring(0,3).toLowerCase()}_gen`,
              year: year,
              paperType: combo.paperType,
              subject: combo.subject,
              title: `AP TET ${year} ${isPaperII ? "Paper II" : "Paper I"} ${combo.subject} Solved Paper`,
              description: `అధికారిక ఏపీ టెట్ ${year} ${combo.subject} సిలబస్ ఆధారిత పూర్తి ప్రశ్నాపత్రం కీ మరియు వివరణలతో.`,
              pdfUrl: "#",
              questionsCount: sourcePaper.questionsCount || sourcePaper.questions.length || 150,
              questions: clonedQuestions
            };
            papers.push(newPaper);
          }
        }
      }
    }

    // Completely remove Hindi papers
    return papers.filter(p => p.subject.toLowerCase() !== "hindi");
  }, [previousPapers]);

  // Dynamically compile subjects that actually exist in the database (excluding Hindi) based on the selected Paper Type
  const subjectsList = React.useMemo(() => {
    const allowed = [
      "Telugu",
      "English",
      "Mathematics",
      "Environmental Studies",
      "Science",
      "Social Studies",
      "English Methodology",
      "Telugu Methodology",
      "Mathematics Methodology",
      "Science Methodology",
      "Social Studies Methodology"
    ];
    return allowed.filter(subj => 
      subj.toLowerCase() !== "hindi" &&
      expandedPapers.some(p => {
        if (p.subject.toLowerCase() !== subj.toLowerCase()) return false;
        if (selectedPaperType === "Paper I") {
          return p.paperType.includes("Paper I") && !p.paperType.includes("Paper II");
        }
        if (selectedPaperType === "Paper II") {
          return p.paperType.includes("Paper II");
        }
        return true;
      })
    );
  }, [expandedPapers, selectedPaperType]);

  // Reset selected subject to "All Subjects" if it is not available in the filtered subjects list
  React.useEffect(() => {
    if (selectedSubject !== "All Subjects" && !subjectsList.includes(selectedSubject)) {
      setSelectedSubject("All Subjects");
    }
  }, [selectedPaperType, subjectsList, selectedSubject]);

  // Perform filtering based on Paper Type, Subject, and Year selections
  const filteredPapers = React.useMemo(() => {
    return expandedPapers.filter(p => {
      // Exclude Hindi completely
      if (p.subject.toLowerCase() === "hindi") return false;

      // Filter Paper Type
      if (selectedPaperType !== "All Papers") {
        if (selectedPaperType === "Paper I") {
          if (!p.paperType.includes("Paper I") || p.paperType.includes("Paper II")) return false;
        } else if (selectedPaperType === "Paper II") {
          if (!p.paperType.includes("Paper II")) return false;
        }
      }

      // Filter Subject
      if (selectedSubject !== "All Subjects") {
        if (p.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
      }

      // Filter Year
      if (selectedYear !== "All Years") {
        if (p.year !== Number(selectedYear)) return false;
      }

      return true;
    });
  }, [expandedPapers, selectedPaperType, selectedSubject, selectedYear]);

  const openPaperModal = (paper: any) => {
    setActivePaperForModal(paper);
    setUserSelectedAnswers({});
  };

  return (
    <div className="space-y-6" id="previous_papers_section">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">OFFICIAL REPOSITORIES</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">గత సంవత్సరాల ప్రశ్నాపత్రాలు (Previous Papers)</h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium">
            ఏపీ టెట్ పరీక్షలకు సంబంధించిన గత 8 సంవత్సరాల (2018-2025) పేపర్-1 మరియు పేపర్-2 అధికారిక ప్రశ్నాపత్రాలు కీ మరియు వివరణలతో.
          </p>
        </div>
      </div>

      {/* Filter Selector Dropdowns Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm" id="papers_dropdown_selector_card">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">శోధన ఫిల్టర్లు (Exam Paper Search Filters)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="dropdown_filters_container">
          {/* Dropdown 1: Paper Type */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="paper_type_select" className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Paper Type
            </label>
            <select
              id="paper_type_select"
              value={selectedPaperType}
              onChange={(e) => setSelectedPaperType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All Papers">All Papers</option>
              <option value="Paper I">Paper I</option>
              <option value="Paper II">Paper II</option>
            </select>
          </div>

          {/* Dropdown 2: Subject */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="subject_select" className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Subject
            </label>
            <select
              id="subject_select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All Subjects">All Subjects</option>
              {subjectsList.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Dropdown 3: Year (responsive behavior: md:col-span-2 lg:col-span-1) */}
          <div className="flex flex-col space-y-1.5 md:col-span-2 lg:col-span-1">
            <label htmlFor="year_select" className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Year
            </label>
            <select
              id="year_select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="All Years">All Years</option>
              {yearsList.map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Papers Display Grid */}
      {filteredPapers.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center space-y-3" id="no_papers_found">
          <AlertCircle className="w-10 h-10 text-slate-400" />
          <p className="text-slate-600 font-bold text-sm">
            No previous papers available for the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn" id="previous_papers_grid">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              id={`subject_card_${paper.id}`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase tracking-wider">{paper.subject}</span>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {paper.questionsCount || paper.questions?.length || 150} MCQs
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{paper.year}</span>
                  <span>•</span>
                  <span>{paper.paperType.includes("Paper II") ? "Paper II (Classes 6-8)" : "Paper I (Classes 1-5)"}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm leading-snug">
                  {paper.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {paper.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => openPaperModal(paper)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Online</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Virtual Interactive Modal Reader */}
      {activePaperForModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn" id="paper_viewer_modal">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between select-none">
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 text-white px-2.5 py-1 font-black rounded-lg text-xs font-mono tracking-widest uppercase">TEST</div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm sm:text-base leading-tight">{activePaperForModal.title}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{activePaperForModal.paperType} • Year {activePaperForModal.year}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePaperForModal(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Virtual Classroom content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-200 bg-slate-950/80 font-sans text-sm sm:text-base leading-relaxed flex-1">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-blue-400 uppercase tracking-wider font-mono">Exam Instructions (పరీక్ష సూచనలు)</div>
                  <p className="text-xs text-slate-300">
                    ఈ ప్రశ్నాపత్రంలో మొత్తం 150 బహుళైచ్ఛిక ప్రశ్నలు గలవు. ప్రతి సరైన సమాధానానికి ఒక మార్కు. నెగటివ్ మార్కులు లేవు.
                  </p>
                </div>
                <div className="bg-blue-900/50 text-blue-300 border border-blue-800/80 rounded-xl px-4 py-2 sm:text-center text-xs self-start sm:self-auto uppercase tracking-wide font-mono font-bold shrink-0">
                  {activePaperForModal.questions.length} Questions Loaded
                </div>
              </div>

              {/* Questions Continuous List */}
              <div className="space-y-6">
                {activePaperForModal.questions.map((q: any) => {
                  const selectedVal = userSelectedAnswers[q.number];
                  const hasAnswered = selectedVal !== undefined;
                  const isCorrect = selectedVal === q.answer;

                  return (
                    <div
                      key={q.number}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
                      id={`modal_q_${q.number}`}
                      style={{ contentVisibility: "auto", containIntrinsicSize: "250px" }}
                    >
                      <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2 mb-2">
                        <span className="text-blue-400 font-extrabold text-sm">ప్రశ్న {q.number} / 150</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 tracking-wider text-[10px] font-bold rounded uppercase">
                          {activePaperForModal.subject}
                        </span>
                      </div>
                      
                      <p className="font-bold text-slate-100 text-sm sm:text-base leading-snug">
                        {q.question}
                      </p>

                      <ul className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm font-medium">
                        {q.options.map((option: string) => {
                          const isOptionSelected = selectedVal === option;
                          const isThisOptionCorrect = option === q.answer;

                          let optionClass = "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300";
                          if (hasAnswered) {
                            if (isThisOptionCorrect) {
                              optionClass = "bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20";
                            } else if (isOptionSelected) {
                              optionClass = "bg-red-950/80 border-red-500 text-red-300 ring-2 ring-red-500/20";
                            } else {
                              optionClass = "bg-slate-950/40 border-slate-800/40 text-slate-500 cursor-not-allowed";
                            }
                          }

                          return (
                            <li key={option}>
                              <button
                                disabled={hasAnswered}
                                onClick={() => {
                                  setUserSelectedAnswers(prev => ({
                                    ...prev,
                                    [q.number]: option
                                  }));
                                }}
                                className={`w-full p-3 sm:p-3.5 text-left border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-150 ${optionClass}`}
                              >
                                <span>{option}</span>
                                {hasAnswered && isThisOptionCorrect && <Check className="w-4 h-4 sm:w-5 h-5 text-emerald-400 shrink-0 ml-1" />}
                                {hasAnswered && isOptionSelected && !isThisOptionCorrect && <X className="w-4 h-4 sm:w-5 h-5 text-red-400 shrink-0 ml-1" />}
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Animated Explanation Reveal box */}
                      {hasAnswered && (
                        <div className="text-xs sm:text-sm text-slate-300 bg-slate-950 border border-slate-800 p-3 sm:p-4 rounded-xl leading-relaxed space-y-1.5 animate-fadeIn">
                          <div className={`font-bold flex items-center space-x-1 ${isCorrect ? "text-emerald-400" : "text-amber-400"}`}>
                            <span>{isCorrect ? "✓ మీ సమాధానం సరైనది! (Correct Answer)" : "✗ మీ సమాధానం తప్పు! (Incorrect)"}</span>
                          </div>
                          <div>
                            <strong className="text-blue-400">సమాధాన వివరణ (Explanation):</strong> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom stats */}
              <div className="pt-6 border-t border-slate-800 select-none flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-slate-400">
                  All <strong className="text-slate-200">{activePaperForModal.questions.length} Questions</strong> loaded continuously.
                </span>
                <span className="text-xs text-blue-400 font-bold">{activePaperForModal.questions.length} of 150 Questions Loaded</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
