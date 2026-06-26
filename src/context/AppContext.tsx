import React, { createContext, useContext, useState, useEffect } from "react";
import paper1SyllabusData from "../data/paper1_syllabus.json";
import paper2SyllabusData from "../data/paper2_syllabus.json";
import videosData from "../data/videos.json";
import quizzesData from "../data/quizzes.json";
import previousPapersData from "../data/previous_papers.json";
import modelPapersData from "../data/model_papers.json";
import { getDynamicQuizForTopic } from "../lib/questionGenerator";

const filteredPaper1SyllabusData: Syllabus = {};
for (const [subject, topics] of Object.entries(paper1SyllabusData as Syllabus)) {
  if (subject !== "Child Development & Pedagogy") {
    filteredPaper1SyllabusData[subject] = topics;
  }
}

// Shared interfaces
export interface Topic {
  id: string;
  name: string;
  subtopics: string[];
}

export interface Syllabus {
  [subject: string]: Topic[];
}

export interface VideoInfo {
  title: string;
  teacher: string;
  duration: string;
  youtubeId: string;
  views?: string;
}

export interface TopicVideos {
  topicId: string;
  name: string;
  description: string;
  duration: string;
  primaryVideo: VideoInfo;
  additionalVideos: VideoInfo[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  correctAnswer?: number;
  explanation: string;
}

export interface PreviousPaper {
  id: string;
  year: number;
  paperType: string;
  subject: string;
  title: string;
  description: string;
  pdfUrl: string;
  questionsCount: number;
}

export interface ModelQuestion {
  id: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  paperType: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface AppContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Selections
  selectedPaper: string; // "AP TET Paper I (Classes 1–5)" | "AP TET Paper II (Classes 6–8)"
  setSelectedPaper: (paper: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedTopicId: string;
  setSelectedTopicId: (topicId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Progress tracking in Local Storage
  completedTopics: string[];
  toggleTopicCompletion: (topicId: string) => void;
  quizScores: { [topicId: string]: { score: number; total: number; percentage: number } };
  saveQuizScore: (topicId: string, score: number, total: number) => void;

  // Static Data
  paper1Syllabus: Syllabus;
  paper2Syllabus: Syllabus;
  videos: { [topicId: string]: TopicVideos };
  quizzes: { [topicId: string]: QuizQuestion[] };
  previousPapers: PreviousPaper[];
  modelPapers: ModelQuestion[];

  // Helpers
  getSubjectsForCurrentPaper: () => string[];
  getTopicsForCurrentSubject: () => Topic[];
  getCurrentTopicData: () => Topic | undefined;
  getCurrentTopicVideos: () => TopicVideos | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<string>("home");

  // Selection states (Initializing from Local Storage if present)
  const [selectedPaper, setSelectedPaperState] = useState<string>(() => {
    return localStorage.getItem("aptet_selected_paper") || "AP TET Paper I (Classes 1–5)";
  });

  const [selectedSubject, setSelectedSubjectState] = useState<string>(() => {
    return localStorage.getItem("aptet_selected_subject") || "Telugu";
  });

  const [selectedTopicId, setSelectedTopicIdState] = useState<string>(() => {
    return localStorage.getItem("aptet_selected_topic_id") || "tel_p1_t1";
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Progress States (stored in local storage)
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("aptet_completed_topics");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quizScores, setQuizScores] = useState<{ [topicId: string]: { score: number; total: number; percentage: number } }>(() => {
    try {
      const saved = localStorage.getItem("aptet_quiz_scores");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track the changes of paper/subject/topic and persist
  const setSelectedPaper = (paper: string) => {
    setSelectedPaperState(paper);
    localStorage.setItem("aptet_selected_paper", paper);
    // Reset subject and topic on paper change to prevent mismatch
    const defaultSubject = "Telugu";
    setSelectedSubjectState(defaultSubject);
    localStorage.setItem("aptet_selected_subject", defaultSubject);

    const defaultTopic = paper === "AP TET Paper I (Classes 1–5)" ? "tel_p1_t1" : "tel_p2_t1";
    setSelectedTopicIdState(defaultTopic);
    localStorage.setItem("aptet_selected_topic_id", defaultTopic);
  };

  const setSelectedSubject = (subject: string) => {
    setSelectedSubjectState(subject);
    localStorage.setItem("aptet_selected_subject", subject);

    // Pick first topic of this subject
    const topics = getTopicsForSubject(selectedPaper, subject);
    if (topics.length > 0) {
      setSelectedTopicIdState(topics[0].id);
      localStorage.setItem("aptet_selected_topic_id", topics[0].id);
    }
  };

  const setSelectedTopicId = (topicId: string) => {
    setSelectedTopicIdState(topicId);
    localStorage.setItem("aptet_selected_topic_id", topicId);
  };

  // Persist progress states
  useEffect(() => {
    localStorage.setItem("aptet_completed_topics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem("aptet_quiz_scores", JSON.stringify(quizScores));
  }, [quizScores]);

  // Helper functions
  const getTopicsForSubject = (paper: string, subject: string): Topic[] => {
    const syllabus = paper === "AP TET Paper I (Classes 1–5)"
      ? filteredPaper1SyllabusData
      : (paper2SyllabusData as Syllabus);
    return syllabus[subject] || [];
  };

  const getSubjectsForCurrentPaper = (): string[] => {
    const syllabus = selectedPaper === "AP TET Paper I (Classes 1–5)"
      ? filteredPaper1SyllabusData
      : paper2SyllabusData;
    return Object.keys(syllabus);
  };

  const getTopicsForCurrentSubject = (): Topic[] => {
    return getTopicsForSubject(selectedPaper, selectedSubject);
  };

  const getCurrentTopicData = (): Topic | undefined => {
    const topics = getTopicsForCurrentSubject();
    return topics.find(t => t.id === selectedTopicId);
  };

  const getCurrentTopicVideos = (): TopicVideos | undefined => {
    return (videosData as { [topicId: string]: TopicVideos })[selectedTopicId];
  };

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const saveQuizScore = (topicId: string, score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    setQuizScores(prev => ({
      ...prev,
      [topicId]: { score, total, percentage }
    }));
    // Auto-mark topic as completed when quiz is submitted with any progress
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics(prev => [...prev, topicId]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPaper,
        setSelectedPaper,
        selectedSubject,
        setSelectedSubject,
        selectedTopicId,
        setSelectedTopicId,
        searchQuery,
        setSearchQuery,
        completedTopics,
        toggleTopicCompletion,
        quizScores,
        saveQuizScore,
        paper1Syllabus: filteredPaper1SyllabusData,
        paper2Syllabus: paper2SyllabusData as Syllabus,
        videos: videosData as { [topicId: string]: TopicVideos },
        quizzes: (() => {
          const mapped: { [topicId: string]: QuizQuestion[] } = {};
          const data = quizzesData as any;
          for (const key in data) {
            if (data[key] && data[key].questions) {
              mapped[key] = data[key].questions.map((q: any) => ({
                id: q.id.toString(),
                question: q.question,
                options: q.options,
                answer: q.options[q.correctAnswer] || "",
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || ""
              }));
            } else if (Array.isArray(data[key])) {
              mapped[key] = data[key];
            }
          }

          // Dynamically pre-populate any missing topics in the syllabi with high-quality generated quizzes
          const fillMissingQuizzes = (syllabus: any) => {
            for (const [subject, topics] of Object.entries(syllabus)) {
              for (const topic of topics as any[]) {
                if (!mapped[topic.id]) {
                  mapped[topic.id] = getDynamicQuizForTopic(topic.id, topic.name, subject);
                }
              }
            }
          };

          fillMissingQuizzes(paper1SyllabusData);
          fillMissingQuizzes(paper2SyllabusData);

          return mapped;
        })(),
        previousPapers: previousPapersData as PreviousPaper[],
        modelPapers: modelPapersData as ModelQuestion[],
        getSubjectsForCurrentPaper,
        getTopicsForCurrentSubject,
        getCurrentTopicData,
        getCurrentTopicVideos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
