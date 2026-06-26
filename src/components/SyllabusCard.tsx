import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Layers, ChevronDown, ChevronUp, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";

export const SyllabusCard: React.FC = () => {
  const { paper1Syllabus, paper2Syllabus, completedTopics } = useApp();
  const [activePaper, setActivePaper] = useState<"Paper I" | "Paper II">("Paper I");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>("tel_p1_t1");

  const syllabus = activePaper === "Paper I" ? paper1Syllabus : paper2Syllabus;

  const toggleExpand = (topicId: string) => {
    if (expandedTopicId === topicId) {
      setExpandedTopicId(null);
    } else {
      setExpandedTopicId(topicId);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6" id="syllabus_directory">
      {/* Selector button bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-50 text-purple-600 p-2 rounded-xl border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">అధికారిక సిలబస్ బ్లూప్రింట్ (Official Syllabus Accordions)</h3>
            <p className="text-sm text-slate-500">AP TET Paper I & Paper II పూర్తి సిలబస్ పట్టిక</p>
          </div>
        </div>

        {/* Paper Toggle switcher buttons */}
        <div className="flex bg-slate-100 rounded-xl p-1 shrink-0" id="syllabus_paper_switcher">
          <button
            onClick={() => {
              setActivePaper("Paper I");
              setExpandedTopicId("tel_p1_t1");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
              activePaper === "Paper I"
                ? "bg-white text-slate-800 shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-current" />
            <span>Paper I (Classes 1–5)</span>
          </button>
          <button
            onClick={() => {
              setActivePaper("Paper II");
              setExpandedTopicId("tel_p2_t1");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
              activePaper === "Paper II"
                ? "bg-white text-slate-800 shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-current" />
            <span>Paper II (Classes 6–8)</span>
          </button>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-4 mt-6" id="syllabus_accordion_list">
        {Object.entries(syllabus).map(([subject, topicsVal]) => {
          const topics = topicsVal as any[];
          return (
            <div key={subject} className="space-y-2">
              {/* Subject heading label */}
              <div className="text-xs font-black text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-lg inline-block uppercase tracking-widest border border-slate-100">
                {subject} (సబ్జెక్ట్)
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {topics.map((topic) => {
                  const isExpanded = expandedTopicId === topic.id;
                  const completedCount = topic.subtopics.filter(sub => completedTopics.includes(topic.id)).length;
                  const totalSubs = topic.subtopics.length;
                  const isTopicChecked = completedTopics.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className={`border rounded-2xl overflow-hidden transition-all ${
                        isExpanded
                          ? "border-blue-600 bg-blue-50/10 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50/50"
                      }`}
                    >
                      {/* Collapsible header */}
                      <button
                        onClick={() => toggleExpand(topic.id)}
                        className="w-full text-left p-4 flex items-center justify-between cursor-pointer focus:outline-none"
                      >
                        <div className="flex items-start space-x-3 pr-4">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isExpanded ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                            {isTopicChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Layers className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div id={`syllabus_title_${topic.id}`} className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug">
                              {topic.name}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {topic.id} • {totalSubs} Subtopics included
                            </p>
                          </div>
                        </div>

                        <div className="text-slate-400 hover:text-slate-600 shrink-0">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Expandable subtopics checklist */}
                      {isExpanded && (
                        <div className="p-4 bg-white/80 border-t border-slate-100 space-y-3 font-sans text-sm animate-fadeIn">
                          <div className="text-xs font-bold text-slate-400 capitalize tracking-wide">
                            ఉప అంశాల జాబితా (Included Syllabus Subsegments):
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {topic.subtopics.map((sub, sidx) => (
                              <li
                                key={sub}
                                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2 text-slate-700 font-medium hover:border-slate-200 hover:bg-slate-100/50 transition-colors"
                              >
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-mono">
                                  {sidx + 1}
                                </span>
                                <span className="text-xs sm:text-sm leading-normal text-slate-600">{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
