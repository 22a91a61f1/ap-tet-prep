import React from "react";
import { BookOpen, Award, CheckSquare, FileText, Layers, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn animate-duration-300" id="about_us_page">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
            Our Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            About AP TET Telugu Prep
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
            Welcome to AP TET Telugu Prep. A free educational platform created to help aspiring teachers succeed.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-4">
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
            AP TET Telugu Prep is a free educational platform created to help aspiring teachers prepare for the Andhra Pradesh Teacher Eligibility Test (AP TET).
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our mission is to make AP TET preparation simple, accessible, and effective by providing high-quality learning resources in one place.
          </p>
        </div>

        {/* Platform Features */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            The platform includes:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl mt-0.5 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Official AP TET syllabus</h4>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive, up-to-date syllabus breakdown.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl mt-0.5 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Topic-wise Telugu YouTube learning resources</h4>
                <p className="text-xs text-slate-500 mt-0.5">Curated high-quality video lessons by top educators.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl mt-0.5 shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Practice quizzes</h4>
                <p className="text-xs text-slate-500 mt-0.5">Interactive multiple-choice tests with detailed answers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl mt-0.5 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Previous year question papers</h4>
                <p className="text-xs text-slate-500 mt-0.5">Authentic past papers organized with answers.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mt-0.5 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Model question papers</h4>
                <p className="text-xs text-slate-500 mt-0.5">Practice materials designed around actual test environments.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl mt-0.5 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Subject-wise preparation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Targeted learning pathways across every required subject.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl mt-0.5 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Paper I and Paper II learning materials</h4>
                <p className="text-xs text-slate-500 mt-0.5">Specially segregated materials mapped for Classes 1–5 and 6–8.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals & Updates block */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Our goal is to help every teacher prepare confidently for the AP TET examination through structured learning and free educational resources.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              This platform is continuously updated according to the latest AP TET syllabus whenever official changes are announced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
