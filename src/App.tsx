import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { SubjectSelector } from "./components/SubjectSelector";
import { ProgressBar } from "./components/ProgressBar";
import { TopicCard } from "./components/TopicCard";
import { VideoCard } from "./components/VideoCard";
import { QuizCard } from "./components/QuizCard";
import { PaperCard } from "./components/PaperCard";
import { ModelTestCard } from "./components/ModelTestCard";
import { SyllabusCard } from "./components/SyllabusCard";
import { AboutUs } from "./components/AboutUs";
import { ContactUs } from "./components/ContactUs";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsConditions } from "./components/TermsConditions";
import { Disclaimer } from "./components/Disclaimer";
import { BookOpen, CheckSquare, FileText, Award, Layers, Sparkles, AlertCircle, Quote } from "lucide-react";

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedPaper, selectedSubject, getCurrentTopicData } = useApp();
  const currentTopic = getCurrentTopicData();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white antialiased">
      {/* Header component */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6 flex-1 space-y-6">
        
        {/* Active Tab View Router */}
        {activeTab === "home" && (
          <div className="space-y-6" id="home_view_container">
            {/* Elegant Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden" id="hero_section">
              {/* Background glowing decorations */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/4 -mb-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none"></div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left side text column */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 text-white font-bold text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current animate-pulse" />
                    <span>ఆంధ్రప్రదేశ్ ఉపాధ్యాయ అర్హత పరీక్ష (AP TET) ప్రిపరేషన్</span>
                  </span>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                    Prepare for AP TET in Telugu
                  </h1>

                  <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
                    సబ్జెక్టులవారీగా తెలుగు నిపుణుల ఉచిత వీడియోలు, సాధన క్విజ్‌లు, గత ఐదు సంవత్సరాల ప్రశ్నలు మరియు మోడల్ పేపర్స్ లభ్యత. Learn. Practice. Succeed in AP TET.
                  </p>

                  <div className="hidden sm:flex flex-wrap items-center gap-4 text-xs font-bold text-blue-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span>150 MCQs Solved papers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span>Interactive Practice</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span>Bilingual Explanation</span>
                    </div>
                  </div>
                </div>

                {/* Right side search & call to action column */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 space-y-4">
                  <h3 className="font-extrabold text-blue-50 text-sm sm:text-base">సిలబస్ వెతకండి (Syllabus Search)</h3>
                  <p className="text-xs text-blue-200">కీవర్డ్‌లను నమోదు చేయండి మరియు వెంటనే అధ్యయనం ప్రారంభించండి.</p>
                  <div>
                    <SearchBar />
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Navigation Cards Grid (Spec Ceilings only) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="quick_links_panel">
              <button
                onClick={() => handleTabChange("resources")}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 p-5 rounded-2xl text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">వీడియో క్లాసులు (Resources)</h4>
                <p className="text-[10px] text-slate-400">వీడియో లెక్చర్స్ & సబ్ టాపిక్స్</p>
              </button>

              <button
                onClick={() => handleTabChange("quizzes")}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 p-5 rounded-2xl text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
              >
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">టాపిక్ క్విజ్లు (Quizzes)</h4>
                <p className="text-[10px] text-slate-400">ప్రతి సాధన క్లాస్ చివర పరీక్ష</p>
              </button>

              <button
                onClick={() => handleTabChange("previous_papers")}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 p-5 rounded-2xl text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
              >
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">గత ప్రశ్నపత్రాలు (Previous Papers)</h4>
                <p className="text-[10px] text-slate-400">పీడీఎఫ్ డౌన్‌లోడ్లు & కీస్</p>
              </button>

              <button
                onClick={() => handleTabChange("model_papers")}
                className="bg-white hover:bg-slate-50/50 border border-slate-200 p-5 rounded-2xl text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer group"
              >
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">మోడల్ టెస్ట్స్ (Model Papers)</h4>
                <p className="text-[10px] text-slate-400">1000+ ప్రశ్నలతో సాధన టెస్ట్స్</p>
              </button>
            </section>

            {/* Offline Progress Tracker */}
            <ProgressBar />

            {/* Selector panel core engine */}
            <SubjectSelector />

            {/* Split Learning Area (Active topic study sandbox on Home for seamless navigation) */}
            <section className="space-y-6" id="learning_sandbox_grid">
              <div className="flex items-center space-x-2">
                <span className="h-4 w-1 bg-blue-600 rounded-full"></span>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {selectedPaper || "Syllabus Segment"} → {selectedSubject} తరగతి గది (Active Classroom)
                </h3>
              </div>

              {/* Learning flow dynamic widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Topic subtopic checklist */}
                <div className="lg:col-span-1">
                  <TopicCard />
                </div>

                {/* Video lesson streaming and Quiz taking */}
                <div className="lg:col-span-2 space-y-6">
                  <VideoCard />
                  <QuizCard />
                </div>
              </div>
            </section>

            {/* High quality Quote card */}
            <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-xs">
              <div className="p-3 bg-blue-600 text-white rounded-2xl">
                <Quote className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm italic font-medium text-blue-900 leading-normal">
                  "విద్యా బోధన వృత్తి కాదు, అదొక నిరంతర ఆశయ సాధన. AP TET లో ఉత్తమ మార్కులు సాధించి ఉపాధ్యాయులుగా విజయవంతం కావాలని కోరుకుంటున్నాము."
                </p>
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider font-mono">AP TET Telugu Prep Editorial Team</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-6 animate-fadeIn" id="resources_view">
            <SubjectSelector />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TopicCard />
              </div>
              <div className="lg:col-span-2">
                <VideoCard />
              </div>
            </div>
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="space-y-6 animate-fadeIn" id="quizzes_view">
            <SubjectSelector />
            <div className="max-w-3xl mx-auto">
              <QuizCard />
            </div>
          </div>
        )}

        {activeTab === "previous_papers" && (
          <div className="animate-fadeIn" id="previous_papers_view">
            <PaperCard />
          </div>
        )}

        {activeTab === "model_papers" && (
          <div className="animate-fadeIn" id="model_papers_view">
            <ModelTestCard />
          </div>
        )}

        {activeTab === "syllabus" && (
          <div className="animate-fadeIn" id="syllabus_view">
            <SyllabusCard />
          </div>
        )}

        {activeTab === "about_us" && (
          <AboutUs />
        )}

        {activeTab === "contact_us" && (
          <ContactUs />
        )}

        {activeTab === "privacy_policy" && (
          <PrivacyPolicy />
        )}

        {activeTab === "terms_conditions" && (
          <TermsConditions />
        )}

        {activeTab === "disclaimer" && (
          <Disclaimer />
        )}

      </main>

      {/* Simple, interactive footer at the bottom of every page */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800" id="main_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Footer Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-300">
            <button
              onClick={() => handleTabChange("home")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "home" ? "text-blue-400 font-bold" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange("resources")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "resources" ? "text-blue-400 font-bold" : ""}`}
            >
              Resources
            </button>
            <button
              onClick={() => handleTabChange("syllabus")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "syllabus" ? "text-blue-400 font-bold" : ""}`}
            >
              Syllabus
            </button>
            <button
              onClick={() => handleTabChange("previous_papers")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "previous_papers" ? "text-blue-400 font-bold" : ""}`}
            >
              Previous Papers
            </button>
            <button
              onClick={() => handleTabChange("model_papers")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "model_papers" ? "text-blue-400 font-bold" : ""}`}
            >
              Model Papers
            </button>
            <button
              onClick={() => handleTabChange("about_us")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "about_us" ? "text-blue-400 font-bold" : ""}`}
            >
              About Us
            </button>
            <button
              onClick={() => handleTabChange("contact_us")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "contact_us" ? "text-blue-400 font-bold" : ""}`}
            >
              Contact Us
            </button>
            <button
              onClick={() => handleTabChange("privacy_policy")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "privacy_policy" ? "text-blue-400 font-bold" : ""}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleTabChange("disclaimer")}
              className={`hover:text-white transition-colors cursor-pointer ${activeTab === "disclaimer" ? "text-blue-400 font-bold" : ""}`}
            >
              Disclaimer
            </button>
          </div>

          <div className="h-px bg-slate-800/60 max-w-md mx-auto"></div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400">
              Copyright © 2026 AP TET Telugu Prep
            </p>
            <p className="text-[10px] max-w-xl mx-auto leading-relaxed text-slate-500">
              This website is a clean, minimal resource platform created for teachers preparing for AP TET Paper I and Paper II. No advertisement and no registration profiles. All video assets belong to respective creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
