import React from "react";
import { Scale, CheckCircle2, ShieldAlert, AlertTriangle, FileSpreadsheet } from "lucide-react";

export const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn" id="terms_conditions_page">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
            Terms of Use
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Terms & Conditions
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
            ఈ వెబ్‌సైట్ సేవలను వినియోగించుకోవడానికి సంబంధించిన నియమ నిబంధనలు.
          </p>
        </div>
      </div>

      {/* Main Content card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-100">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">Terms & Conditions of Use</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Last updated: June 2026. By utilizing this site, you agree to comply with the educational usage rules described below.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>1. Educational Purpose Only</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            All tools, resources, syllabus metrics, generated practice tests, and model exam simulations provided on AP TET Telugu Prep are offered strictly for **educational and self-learning purposes**. 
            This website is designed as a study supplement to assist aspiring teachers in Andhra Pradesh.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>2. No Guarantee of Success</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            While we strive to maintain high-quality quiz algorithms and accurate previous papers, we provide **no express or implied guarantee** that using these practice components will result in passing the AP TET examination or securing state-level teacher postings. Exam success depends entirely on individual effort and official syllabus compliance.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>3. Official Verification Responsibility</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            Candidates and users are **solely responsible** for verifying examination dates, eligibility rules, official guidelines, syllabus extensions, and application procedures through the officially designated government platforms. We do not represent the official department and are not liable for discrepancies in external notifications.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
            <span>4. Changes to Content</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            The content on this website, including video resource listings, mock test structures, questions, explanations, and these terms of service, may be updated, adjusted, or modified at any time without prior notification.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Scale className="w-4 h-4 text-blue-600 shrink-0" />
            <span>5. Website Usage Rules</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6 text-slate-500">
            By using this website, you agree not to scrape, reverse-engineer, overload, or disrupt site operations. This website is to be accessed normally through standard browser controls. We reserve the right to restrict access to any user found in violation of standard usage patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
