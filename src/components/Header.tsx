import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { BookOpen, Award, FileText, CheckSquare, Layers, Menu, X, Home as HomeIcon, Info, Mail, Shield, AlertCircle } from "lucide-react";

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "quizzes", label: "Quizzes", icon: CheckSquare },
    { id: "previous_papers", label: "Previous Papers", icon: FileText },
    { id: "model_papers", label: "Model Papers", icon: Award },
    { id: "syllabus", label: "Syllabus", icon: Layers },
    { id: "about_us", label: "About Us", icon: Info },
    { id: "contact_us", label: "Contact Us", icon: Mail },
    { id: "privacy_policy", label: "Privacy Policy", icon: Shield },
    { id: "disclaimer", label: "Disclaimer", icon: AlertCircle },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" id="main_header">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabChange("home")}>
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <span className="font-serif font-black text-xl tracking-tight">TET</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-sans text-slate-800 tracking-tight">
                AP TET <span className="text-blue-600 font-extrabold">Telugu Prep</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                Learn. Practice. Succeed.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-1" id="desktop_nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <div className="xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
              id="mobile_menu_trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 transition-all duration-300" id="mobile_drawer">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile_nav_btn_${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5 text-current" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
