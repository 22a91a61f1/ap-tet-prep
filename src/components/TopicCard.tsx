import React from "react";
import { useApp } from "../context/AppContext";
import { Clock, BookOpen, CheckSquare, Square, ListTodo, Trophy } from "lucide-react";

export const TopicCard: React.FC = () => {
  const {
    selectedSubject,
    completedTopics,
    toggleTopicCompletion,
    getCurrentTopicData,
    quizScores,
  } = useApp();

  const topic = getCurrentTopicData();

  if (!topic) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="font-semibold text-lg">దయచేసి ఎడమవైపున గల ప్యానెల్ లో ఒక టాపిక్ ను ఎంచుకోండి.</p>
      </div>
    );
  }

  const isCompleted = completedTopics.includes(topic.id);
  const scoreInfo = quizScores[topic.id];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-5" id={`topic_card_${topic.id}`}>
      {/* Top Details */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-blue-100">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{selectedSubject}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
            {topic.name}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            ఏపీ టెట్ బ్లూప్రింట్ ఆధారంగా రూపొందించబడిన అధికారిక పాఠ్యాంశం.
          </p>
        </div>

        {/* Completion Action */}
        <button
          onClick={() => toggleTopicCompletion(topic.id)}
          id={`toggle_topic_${topic.id}`}
          className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none ${
            isCompleted
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckSquare className="w-4 h-4 fill-current text-white" />
              <span>పూర్తయింది (Done)</span>
            </>
          ) : (
            <>
              <Square className="w-4 h-4" />
              <span>చదవడం పూర్తయినట్లు మార్క్ చేయండి</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of quick parameters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center space-x-2.5">
          <Clock className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">సమయం (Est. Time)</div>
            <div className="text-sm font-bold text-slate-700">~ 1 - 2 గంటలు</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <ListTodo className="w-5 h-5 text-emerald-500" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">ఉప అంశాలు (Subtopics)</div>
            <div className="text-sm font-bold text-slate-700">{topic.subtopics.length} విభాగాలు</div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 flex items-center space-x-2.5">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">క్విజ్ స్కోర్ (Quiz Status)</div>
            <div className="text-sm font-bold text-slate-700">
              {scoreInfo ? (
                <span className="text-emerald-600 font-bold">{scoreInfo.score}/{scoreInfo.total} ({scoreInfo.percentage}%)</span>
              ) : (
                <span className="text-slate-400 font-medium">ప్రయత్నించలేదు</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Checklist */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <span>సిలబస్ విభాగాలు & సబ్-టాపిక్స్</span>
          <span className="h-px bg-slate-200 flex-1"></span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="subtopics_list">
          {topic.subtopics.map((sub, idx) => (
            <li
              key={sub}
              className="flex items-start space-x-2 p-3 rounded-xl border border-slate-100 bg-white/50 hover:bg-slate-50 hover:border-slate-200 transition-colors"
            >
              <div className="bg-blue-50 text-blue-600 text-xs font-bold font-mono px-2 py-0.5 rounded-md mt-0.5">
                {idx + 1}
              </div>
              <span className="text-sm font-semibold text-slate-700 leading-normal">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
