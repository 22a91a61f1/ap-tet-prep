import React from "react";
import { ShieldCheck, Info, FileText, Globe, Eye, ShieldAlert, Heart } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn animate-duration-300" id="privacy_policy_page">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
            Safety First
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Privacy Policy
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
            At AP TET Telugu Prep, we respect your privacy and are committed to protecting it.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">Our Privacy Commitment</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
              Your security is our priority. Below we detail the light, anonymous data parameters we observe.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Information We May Collect</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            We do not collect personal identify information. We may process:
          </p>
          <ul className="list-disc pl-12 text-xs sm:text-sm text-slate-600 space-y-1.5">
            <li>Basic browser information</li>
            <li>Device type</li>
            <li>Anonymous usage statistics</li>
            <li>Cookies</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Third-Party Services</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            Our website may use:
          </p>
          <ul className="list-disc pl-12 text-xs sm:text-sm text-slate-600 space-y-1.5">
            <li>Google AdSense</li>
            <li>Google Analytics</li>
            <li>YouTube</li>
          </ul>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            These services may collect anonymous usage information according to their own privacy policies.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Cookies</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            Cookies may be used to improve website performance and user experience. They store configurations such as your syllabus tracking progress and dashboard filters.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Heart className="w-4 h-4 text-blue-600 shrink-0" />
            <span>No Personal Information</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            We do not sell or share users' personal information.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span>External Links</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            Our website contains YouTube links and other educational resources. We are not responsible for third-party websites.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h4 className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Policy Updates</span>
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
            This Privacy Policy may be updated whenever necessary.
          </p>
        </div>
      </div>
    </div>
  );
};
