import React from "react";
import { AlertTriangle, ShieldCheck, Globe, Youtube, FileText } from "lucide-react";

export const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn animate-duration-300" id="disclaimer_page">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
            Important
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Disclaimer
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
            Please read this disclaimer carefully regarding the platform's independent operations and affiliations.
          </p>
        </div>
      </div>

      {/* Main Content card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-100">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">Independent Status</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              AP TET Telugu Prep is an independent educational platform created for learning purposes.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Not Affiliated With Official Entities</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            This website is <strong className="text-rose-600">NOT affiliated with</strong>:
          </p>
          <ul className="list-disc pl-12 text-xs sm:text-sm text-slate-600 space-y-1.5 font-semibold">
            <li>Government of Andhra Pradesh</li>
            <li>Department of School Education</li>
            <li>AP DSC</li>
            <li>AP TET Official Board</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Official Government Source Verification</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            All official notifications, syllabus updates, examination schedules, and announcements should always be verified through the official Government websites.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Purpose of Materials</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            Previous question papers, model papers, quizzes, and educational resources are provided only for learning and practice purposes.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Youtube className="w-4 h-4 text-red-600 shrink-0" />
            <span>Third-Party Learning Videos</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            YouTube videos linked on this website belong to their respective owners and creators. We do not claim ownership of third-party educational content.
          </p>
        </div>
      </div>
    </div>
  );
};
