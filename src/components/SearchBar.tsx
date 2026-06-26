import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, Book, GraduationCap, ArrowRight } from "lucide-react";

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    paper1Syllabus,
    paper2Syllabus,
    setSelectedPaper,
    setSelectedSubject,
    setSelectedTopicId,
    setActiveTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  // Grouped search combinations
  interface SearchResult {
    topicId: string;
    topicName: string;
    subject: string;
    paperType: string;
  }

  const getResults = (): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    // Search Paper 1
    Object.entries(paper1Syllabus).forEach(([subject, topicsVal]) => {
      const topics = topicsVal as any[];
      topics.forEach(topic => {
        if (
          topic.name.toLowerCase().includes(query) ||
          subject.toLowerCase().includes(query) ||
          "AP TET Paper I (Classes 1–5)".toLowerCase().includes(query) ||
          topic.subtopics.some((s: string) => s.toLowerCase().includes(query))
        ) {
          results.push({
            topicId: topic.id,
            topicName: topic.name,
            subject,
            paperType: "AP TET Paper I (Classes 1–5)",
          });
        }
      });
    });

    // Search Paper 2
    Object.entries(paper2Syllabus).forEach(([subject, topicsVal]) => {
      const topics = topicsVal as any[];
      topics.forEach(topic => {
        if (
          topic.name.toLowerCase().includes(query) ||
          subject.toLowerCase().includes(query) ||
          "AP TET Paper II (Classes 6–8)".toLowerCase().includes(query) ||
          topic.subtopics.some((s: string) => s.toLowerCase().includes(query))
        ) {
          results.push({
            topicId: topic.id,
            topicName: topic.name,
            subject,
            paperType: "AP TET Paper II (Classes 6–8)",
          });
        }
      });
    });

    return results.slice(0, 5); // Limit to top 5 results for sleek visual popover
  };

  const results = getResults();

  const handleResultClick = (res: SearchResult) => {
    setSelectedPaper(res.paperType);
    setSelectedSubject(res.subject);
    setSelectedTopicId(res.topicId);
    setActiveTab("resources");
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" id="search_bar_container">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          id="global_search_input"
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base shadow-sm font-sans transition-all"
          placeholder="టాపిక్, సబ్జెక్ట్ లేదా పేపర్ టైప్ శోధించండి..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Instant popover results */}
      {isOpen && searchQuery && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40 max-h-96 overflow-y-auto" id="search_results_popover">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 tracking-wide uppercase px-2">శోధన ఫలితాలు (Matches)</span>
            <span className="text-xs font-mono text-slate-400 px-2">{results.length} found</span>
          </div>

          {results.length > 0 ? (
            <div className="p-1.5 space-y-1">
              {results.map((res) => (
                <button
                  key={res.topicId}
                  onClick={() => handleResultClick(res)}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                      {res.paperType.includes("Paper I") ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Book className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {res.topicName}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-500">{res.subject}</span>
                        <span>•</span>
                        <span>{res.paperType}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              <p className="font-medium">మెరుగైన ఫలితాల కోసం సరియైన అక్షరాలను నమోదు చేయండి.</p>
              <p className="text-xs text-slate-400 mt-1">ఉదాహరణ: "తెలుగు", "సంధులు", "EVS"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
