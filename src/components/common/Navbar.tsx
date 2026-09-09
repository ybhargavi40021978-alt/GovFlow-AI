import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGovFlow } from '../../store/GovFlowContext';
import { GovFlowLogo } from './GovFlowLogo';
import { ALL_INDIAN_LANGUAGES } from '../../i18n/translations';
import { LanguageCode } from '../../types';
import { 
  Globe, 
  Accessibility, 
  Bell, 
  Menu, 
  X, 
  User as UserIcon, 
  ChevronDown, 
  ChevronRight,
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut,
  Layers,
  Building2,
  Award,
  Wheat,
  LogIn,
  Search
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser,
    currentRole, 
    currentLanguage, 
    setCurrentLanguage, 
    t, 
    setIsAccessibilityOpen, 
    myNotifications,
    logout
  } = useGovFlow();

  const location = useLocation();
  const navigate = useNavigate();

  // Menu toggles
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  // Refs for click outside handling
  const langMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = myNotifications.filter(n => !n.read).length;
  const currentLangObj = ALL_INDIAN_LANGUAGES.find(l => l.code === currentLanguage) || ALL_INDIAN_LANGUAGES[0];

  // Scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsLangMenuOpen(false);
      setIsCategoriesOpen(false);
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(target)) {
        setIsCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangMenuOpen(false);
        setIsCategoriesOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLangSelect = (code: string) => {
    setCurrentLanguage(code as LanguageCode);
    setIsLangMenuOpen(false);
    setLangSearch('');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#how-it-works');
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = [
    '/services', 
    '/departments', 
    '/certificates', 
    '/agriculture'
  ].includes(location.pathname);

  // Filter languages
  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-slate-200/80 ${
        isScrolled ? 'shadow-md bg-white/98' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px]">
        {/* ==================================================================== */}
        {/* DESKTOP HEADER (lg and up): 3-Column Grid for Zero Layout Shift     */}
        {/* [LEFT: Logo]              [CENTER: Nav]             [RIGHT: Controls] */}
        {/* ==================================================================== */}
        <div className="hidden lg:grid lg:grid-cols-[240px_1fr_240px] xl:grid-cols-[270px_1fr_270px] items-center h-[72px]">
          
          {/* LEFT: GovFlow AI Logo & Simple Symbol */}
          <div className="flex items-center justify-start">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl select-none group"
              aria-label="GovFlow AI Home"
            >
              <GovFlowLogo size="md" variant="horizontal" showTagline={false} />
            </Link>
          </div>

          {/* CENTER: Main Navigation Links */}
          <nav className="flex items-center justify-center gap-6 xl:gap-8 h-full" aria-label="Main Navigation">
            {/* 1. Home */}
            <Link 
              to="/" 
              className={`whitespace-nowrap text-sm font-semibold transition-all py-1.5 px-1 relative ${
                isActive('/') 
                  ? 'text-gov-blue font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gov-blue after:rounded-full' 
                  : 'text-slate-600 hover:text-gov-blue'
              }`}
            >
              {t('nav.home') || 'Home'}
            </Link>

            {/* 2. Services */}
            <Link 
              to="/services" 
              className={`whitespace-nowrap text-sm font-semibold transition-all py-1.5 px-1 relative ${
                isActive('/services') 
                  ? 'text-gov-blue font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gov-blue after:rounded-full' 
                  : 'text-slate-600 hover:text-gov-blue'
              }`}
            >
              {t('nav.services') || 'Services'}
            </Link>

            {/* 3. Categories (Dropdown Menu) */}
            <div 
              ref={categoriesRef}
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button 
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`whitespace-nowrap text-sm font-semibold transition-all py-1.5 px-1 flex items-center gap-1.5 relative focus:outline-none ${
                  isCategoryActive 
                    ? 'text-gov-blue font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gov-blue after:rounded-full' 
                    : 'text-slate-600 hover:text-gov-blue'
                }`}
                aria-expanded={isCategoriesOpen}
                aria-haspopup="true"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180 text-gov-blue' : 'text-slate-400'}`} />
              </button>

              {/* Categories Mega Dropdown */}
              {isCategoriesOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-[60px] w-84 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-3 px-2 z-50 animate-fadeIn"
                  role="menu"
                >
                  <div className="px-3 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Service Directory
                    </span>
                    <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      280+ Services
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/services"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-gov-blue flex items-center gap-1">
                          <span>All 13 Service Categories</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Education, Housing, Healthcare, MSME & Welfare
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/departments"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-gov-blue flex items-center gap-1">
                          <span>Department Directory</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          35 Central, State, District & Municipal departments
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/certificates"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-gov-blue flex items-center gap-1">
                          <span>Statutory Certificates Hub</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          10 State-authorized records: Income, Caste, Domicile
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/agriculture"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Wheat className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-gov-blue flex items-center gap-1">
                          <span>Agriculture & Farmers Hub</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          PM-KISAN, PMFBY, KCC & DBT farmer schemes
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. How It Works */}
            <button 
              type="button"
              onClick={handleHowItWorks}
              className="whitespace-nowrap text-sm font-semibold text-slate-600 hover:text-gov-blue transition-all py-1.5 px-1 focus:outline-none"
            >
              How It Works
            </button>

            {/* 5. Help / Grievances */}
            <Link 
              to="/grievances" 
              className={`whitespace-nowrap text-sm font-semibold transition-all py-1.5 px-1 relative ${
                isActive('/grievances') 
                  ? 'text-gov-blue font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gov-blue after:rounded-full' 
                  : 'text-slate-600 hover:text-gov-blue'
              }`}
            >
              Help
            </Link>
          </nav>

          {/* RIGHT: Action Controls (Consistent Height: h-10, Center-Aligned) */}
          <div className="flex items-center justify-end gap-2.5 xl:gap-3 h-full">
            
            {/* 1. Language Selector Button & Dropdown */}
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsUserMenuOpen(false);
                  setIsCategoriesOpen(false);
                }}
                className="h-10 px-3 rounded-xl border border-slate-200/90 bg-slate-50/90 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                aria-label="Select language"
                aria-expanded={isLangMenuOpen}
                title="Change language"
              >
                <Globe className="w-4 h-4 text-gov-blue flex-shrink-0" />
                <span className="max-w-[70px] truncate">{currentLangObj.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2.5 z-50 animate-fadeIn"
                  role="menu"
                >
                  <div className="px-3 pb-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Select Language (22 Languages)
                    </p>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-blue"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                          lang.code === currentLanguage
                            ? 'bg-blue-50 text-gov-blue font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{lang.name}</span>
                        </div>
                        {lang.code === currentLanguage && (
                          <span className="text-gov-blue text-xs font-bold">✓</span>
                        )}
                      </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                      <div className="px-3.5 py-3 text-center text-xs text-slate-400">
                        No language found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Accessibility Option (Aa / ♿) */}
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="h-10 w-10 rounded-xl border border-slate-200/90 bg-slate-50/90 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
              title="Accessibility Settings (Font size, High Contrast, Reduced Motion)"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-4 h-4 text-gov-blue" />
            </button>

            {/* 3. Authentication State Controls */}
            {currentUser ? (
              /* AUTHENTICATED: Notifications Bell + User Profile Menu */
              <>
                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="h-10 w-10 rounded-xl border border-slate-200/90 bg-slate-50/90 hover:bg-slate-100 text-slate-700 relative flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                  aria-label={`Notifications (${unreadNotifications} unread)`}
                  title="Citizen Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gov-saffron text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Profile Menu Dropdown */}
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsLangMenuOpen(false);
                      setIsCategoriesOpen(false);
                    }}
                    className="h-10 pl-1.5 pr-3 rounded-xl border border-slate-200/90 bg-slate-50/90 hover:bg-blue-50/50 hover:border-blue-300 text-slate-800 flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User account menu"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gov-blue text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[85px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2.5 z-50 animate-fadeIn"
                      role="menu"
                    >
                      {/* Authenticated Real User Header */}
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-100 uppercase tracking-wider">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                      </div>

                      {/* Role-Specific Navigation Links */}
                      <div className="py-1">
                        {currentRole === 'citizen' && (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                              role="menuitem"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gov-blue" />
                              <span>Citizen Dashboard</span>
                            </Link>
                            <Link
                              to="/applications"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                              role="menuitem"
                            >
                              <FileText className="w-4 h-4 text-emerald-600" />
                              <span>My Applications</span>
                            </Link>
                            <Link
                              to="/documents"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                              role="menuitem"
                            >
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              <span>Document Vault</span>
                            </Link>
                            <Link
                              to="/consent"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                              role="menuitem"
                            >
                              <ShieldCheck className="w-4 h-4 text-amber-600" />
                              <span>Consent Management</span>
                            </Link>
                            <Link
                              to="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                              role="menuitem"
                            >
                              <UserIcon className="w-4 h-4 text-slate-500" />
                              <span>Profile & Vault</span>
                            </Link>
                          </>
                        )}

                        {(currentRole === 'officer' || currentRole === 'dept_admin' || currentRole === 'DEPARTMENT_OFFICER') && (
                          <Link
                            to={currentRole === 'dept_admin' ? '/department-admin/dashboard' : '/officer/dashboard'}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                            role="menuitem"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>{currentRole === 'dept_admin' ? 'Dept Admin Dashboard' : 'Officer Dashboard'}</span>
                          </Link>
                        )}

                        {(currentRole === 'sys_admin' || currentRole === 'SYSTEM_ADMIN') && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                            role="menuitem"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>System Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Log Out Action */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Log Out & Clear Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* UNAUTHENTICATED: Sign In Button */
              <Link
                to="/login"
                className="h-10 px-4 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login') || 'Sign In'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MOBILE & TABLET HEADER (< lg): Compact Left Logo + Right Menu Toggle */}
        {/* ==================================================================== */}
        <div className="flex lg:hidden items-center justify-between h-[72px]">
          {/* Logo on Left */}
          <Link 
            to="/" 
            className="inline-flex items-center focus:outline-none select-none"
            aria-label="GovFlow AI Home"
          >
            <GovFlowLogo size="sm" variant="horizontal" showTagline={false} />
          </Link>

          {/* Controls on Right */}
          <div className="flex items-center gap-2">
            {/* Language Picker on Mobile */}
            <button
              type="button"
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsMobileMenuOpen(false);
              }}
              className="h-10 px-2.5 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 focus:outline-none"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-gov-blue" />
              <span className="text-[11px]">{currentLangObj.code.toUpperCase()}</span>
            </button>

            {/* Accessibility Button */}
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="h-10 w-10 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-700 flex items-center justify-center focus:outline-none"
              title="Accessibility Options"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-4 h-4 text-gov-blue" />
            </button>

            {/* Authenticated Bell on Mobile */}
            {currentUser && (
              <Link
                to="/notifications"
                className="h-10 w-10 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-700 relative flex items-center justify-center focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gov-saffron text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsLangMenuOpen(false);
              }}
              className="h-10 w-10 rounded-xl border border-slate-200/90 bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Language Selector Overlay */}
      {isLangMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose Language
            </span>
            <button
              onClick={() => setIsLangMenuOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto">
            {ALL_INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangSelect(lang.code)}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  lang.code === currentLanguage
                    ? 'border-gov-blue bg-blue-50 text-gov-blue font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">{lang.nativeName}</div>
                <div className="text-[10px] text-slate-400">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MOBILE DRAWER MENU: Smooth slide-down, never overlaps header         */}
      {/* ==================================================================== */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden border-t border-slate-200/90 bg-white shadow-2xl animate-fadeIn max-h-[calc(100vh-72px)] overflow-y-auto"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div className="px-4 py-4 space-y-4">
            
            {/* 1. Main Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/') ? 'bg-blue-50 text-gov-blue font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.home') || 'Home'}</span>
                {isActive('/') && <span className="text-gov-blue text-xs font-bold">●</span>}
              </Link>

              <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/services') ? 'bg-blue-50 text-gov-blue font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.services') || 'Services'}</span>
                {isActive('/services') && <span className="text-gov-blue text-xs font-bold">●</span>}
              </Link>

              {/* Categories Section */}
              <div className="pt-1 pb-1">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Categories & Hubs
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1 px-1">
                  <Link
                    to="/departments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 text-left"
                  >
                    <div className="text-xs font-bold text-slate-800">Departments</div>
                    <div className="text-[10px] text-slate-500">35 Directory</div>
                  </Link>

                  <Link
                    to="/certificates"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 text-left"
                  >
                    <div className="text-xs font-bold text-slate-800">Certificates</div>
                    <div className="text-[10px] text-slate-500">10 Statutory</div>
                  </Link>

                  <Link
                    to="/agriculture"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 text-left"
                  >
                    <div className="text-xs font-bold text-slate-800">Agriculture</div>
                    <div className="text-[10px] text-slate-500">Farmers Hub</div>
                  </Link>

                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 text-left"
                  >
                    <div className="text-xs font-bold text-slate-800">13 Categories</div>
                    <div className="text-[10px] text-slate-500">All Services</div>
                  </Link>
                </div>
              </div>

              {/* How It Works */}
              <button
                type="button"
                onClick={(e) => {
                  handleHowItWorks(e);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>How It Works</span>
              </button>

              {/* Help */}
              <Link
                to="/grievances"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/grievances') ? 'bg-blue-50 text-gov-blue font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Help & Grievances</span>
                {isActive('/grievances') && <span className="text-gov-blue text-xs font-bold">●</span>}
              </Link>
            </div>

            {/* 2. Controls & Preferences */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Globe className="w-4 h-4 text-gov-blue" />
                <span>Language: {currentLangObj.name}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccessibilityOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Accessibility className="w-4 h-4 text-gov-blue" />
                <span>Accessibility</span>
              </button>
            </div>

            {/* 3. Authentication Section */}
            <div className="pt-3 border-t border-slate-100">
              {currentUser ? (
                /* Authenticated User in Mobile Menu */
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gov-blue text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-gov-blue uppercase">
                          {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {currentRole === 'citizen' && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 text-center"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/applications"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 text-center"
                        >
                          Applications
                        </Link>
                        <Link
                          to="/documents"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 text-center"
                        >
                          Documents
                        </Link>
                        <Link
                          to="/consent"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 text-center"
                        >
                          Consent Hub
                        </Link>
                      </>
                    )}

                    {(currentRole === 'officer' || currentRole === 'dept_admin' || currentRole === 'DEPARTMENT_OFFICER') && (
                      <Link
                        to={currentRole === 'dept_admin' ? '/department-admin/dashboard' : '/officer/dashboard'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="col-span-2 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 text-center"
                      >
                        {currentRole === 'dept_admin' ? 'Dept Admin Dashboard' : 'Officer Dashboard'}
                      </Link>
                    )}

                    {(currentRole === 'sys_admin' || currentRole === 'SYSTEM_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="col-span-2 py-2 px-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 text-center"
                      >
                        System Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out & Clear Session</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated Sign In in Mobile Menu */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-xs font-bold text-center shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
