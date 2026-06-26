import React, { useState } from "react";
import { Mail, Send, AlertCircle } from "lucide-react";

export const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // Simulate backend submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage(
        "Currently, the contact form is for demonstration purposes. Please contact us directly via the email address above."
      );
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn animate-duration-300" id="contact_us_page">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex px-2.5 py-0.5 bg-blue-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
            Get in touch
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Contact Us
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
            We value your feedback and suggestions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl">
              Feedback & Suggestions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              If you find any incorrect information, broken links, missing resources, or have suggestions for improving the AP TET Telugu Prep platform, please contact us.
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-xl shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                Direct Email Support
              </span>
              <a
                href="mailto:rishtagugula489@gmail.com"
                className="text-sm font-bold text-blue-600 hover:text-blue-800 break-all transition-colors"
              >
                rishtagugula489@gmail.com
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-normal border-t border-slate-100 pt-4">
            Note: This email is a placeholder and can be replaced with a real active support email later.
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl mb-4">
            Send a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4" id="contact_form">
            <div>
              <label htmlFor="contact_name" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="contact_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="contact_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_subject" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                type="text"
                id="contact_subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label htmlFor="contact_message" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                id="contact_message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                required
              ></textarea>
            </div>

            {statusMessage && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm animate-fadeIn" id="form_feedback_status">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4.5 h-4.5" />
                  <span>Submit Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
