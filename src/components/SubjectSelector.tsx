import React from "react";
import { useApp } from "../context/AppContext";
import { GraduationCap, BookOpen, Layers, CheckCircle2 } from "lucide-react";

export const SubjectSelector: React.FC = () => {
  const {
    selectedPaper,
    setSelectedPaper,
    selectedSubject,
    setSelectedSubject,
    selectedTopicId,
    setSelectedTopicId,
    getSubjectsForCurrentPaper,
    getTopicsForCurrentSubject,
    completedTopics,
  } = useApp();

  const subjects = getSubjectsForCurrentPaper();
  const topics = getTopicsForCurrentSubject();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md" id="selection_panel">
      <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
        <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">ప్రిపరేషన్ ఎంపిక ప్యానెల్ (Selection Panel)</h2>
          <p className="text-xs text-slate-500">మీ పరీక్ష రకం, సబ్జెక్ట్ మరియు పాఠ్యాంశాన్ని మార్చుకోండి</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dropdown 1: Exam Type */}
        <div className="space-y-1.5">
          <label htmlFor="exam_type_select" className="block text-xs font-bold text-slate-500 tracking-wide uppercase">
            1. పరీక్ష రకం (Exam Type)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <select
              id="exam_type_select"
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="AP TET Paper I (Classes 1–5)">AP TET Paper I (Classes 1–5)</option>
              <option value="AP TET Paper II (Classes 6–8)">AP TET Paper II (Classes 6–8)</option>
            </select>
          </div>
        </div>

        {/* Dropdown 2: Subject */}
        <div className="space-y-1.5">
          <label htmlFor="subject_select" className="block text-xs font-bold text-slate-500 tracking-wide uppercase">
            2. సబ్జెక్ట్ (Subject)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <select
              id="subject_select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropdown 3: Topic */}
        <div className="space-y-1.5">
          <label htmlFor="topic_select" className="block text-xs font-bold text-slate-500 tracking-wide uppercase">
            3. అంశం (Topic)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-600">
              <Layers className="w-5 h-5" />
            </div>
            <select
              id="topic_select"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer overflow-ellipsis"
            >
              {topics.map((t) => {
                const isDone = completedTopics.includes(t.id);
                return (
                  <option key={t.id} value={t.id}>
                    {isDone ? "✓ " : ""} {t.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
