import React from "react";
import { useApp } from "../context/AppContext";
import { Trophy, CheckCircle, Flame, Calendar } from "lucide-react";

export const ProgressBar: React.FC = () => {
  const {
    completedTopics,
    quizScores,
    paper1Syllabus,
    paper2Syllabus,
    selectedPaper,
  } = useApp();

  // Calculate total topics in current active paper syllabus
  const activeSyllabus = selectedPaper === "AP TET Paper I (Classes 1–5)" ? paper1Syllabus : paper2Syllabus;
  
  let totalTopics = 0;
  const currentPaperTopicIds: string[] = [];

  Object.values(activeSyllabus).forEach((topicsVal) => {
    const topics = topicsVal as any[];
    totalTopics += topics.length;
    topics.forEach(t => currentPaperTopicIds.push(t.id));
  });

  // Filter completed topics that belong to current active paper
  const completedForCurrentPaper = completedTopics.filter(id => currentPaperTopicIds.includes(id));
  const completedCount = completedForCurrentPaper.length;

  const completionPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Calculate Average Quiz Score for current active paper
  let totalScoreQuiz = 0;
  let gradedQuizzesCount = 0;

  Object.entries(quizScores).forEach(([topicId, infoVal]) => {
    const info = infoVal as { score: number; total: number; percentage: number };
    if (currentPaperTopicIds.includes(topicId)) {
      totalScoreQuiz += info.percentage;
      gradedQuizzesCount++;
    }
  });

  const averageScore = gradedQuizzesCount > 0 ? Math.round(totalScoreQuiz / gradedQuizzesCount) : 0;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden" id="dashboard_progress_bar">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-emerald-500 opacity-10 blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full border border-blue-500/30 uppercase tracking-widest font-mono">
            మొత్తం ప్రగతి (Your Progress)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            {selectedPaper}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            రిజిస్ట్రేషన్ అవసరం లేకుండా, మీ పురోగతి ఇక్కడ నిరంతరం భద్రపరచబడుతుంది.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Flame className="w-5 h-5 fill-current" />
            <div>
              <div className="text-xl font-extrabold leading-none">ఆఫ్‌లైన్</div>
              <div className="text-[10px] text-slate-400 font-sans tracking-wide uppercase font-bold">Local Auth</div>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <div className="text-2xl font-black font-sans text-emerald-400">{completionPercentage}%</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">పూర్తయింది (Complete)</div>
          </div>
        </div>
      </div>

      {/* Actual Progress Bar */}
      <div className="mt-6 relative z-10">
        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
          <span>పూర్తయిన టాపిక్స్: {completedCount} / {totalTopics}</span>
          <span className="font-mono">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-px border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-950 p-2 rounded-xl border border-blue-800 text-blue-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold font-sans text-slate-200">{completedCount} టాపిక్స్</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">అధ్యయనం చేశారు</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-amber-950 p-2 rounded-xl border border-amber-800 text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold font-sans text-slate-200">{averageScore}% సగటు</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">క్విజ్ స్కోరు (Avg Quiz)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
