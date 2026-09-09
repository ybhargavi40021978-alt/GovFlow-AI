import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  UserRole, 
  AuthAccountType,
  LanguageCode, 
  CitizenProfile, 
  Service, 
  DocumentItem, 
  ConsentItem, 
  Application, 
  AuditLog, 
  ApiIntegration, 
  NotificationItem, 
  CookiePreferences, 
  AccessibilitySettings,
  ApplicationStatus,
  DocumentStatus,
  Department,
  GrievanceRecord,
  ServiceWithdrawalPolicy
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_DEPARTMENTS,
  INITIAL_AUDIT_LOGS, 
  INITIAL_INTEGRATIONS,
  INITIAL_APPLICATIONS,
  SANDBOX_EVALUATION_DATA 
} from './mockData';
import { GovFlowApiService, calculateProfileCompleteness } from '../services/api';
import { translations } from '../i18n/translations';

interface GovFlowContextType {
  // Authentication & Session
  currentUser: User | null;
  currentRole: UserRole | null;
  isVisitor: boolean;
  isAuthenticating: boolean;
  authLoadingMessage: string;
  demoUsers: User[];
  isSandboxMode: boolean;
  toggleSandboxMode: () => void;
  login: (identifier: string, password?: string, accountType?: AuthAccountType) => Promise<{ success: boolean; redirectPath: string; error?: string }>;
  logout: () => void;
  register: (name: string, email: string, phone: string, state: string, category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS', password?: string) => Promise<void>;
  setCurrentRole: (role: UserRole) => void;
  logoutMessage: string | null;
  clearLogoutMessage: () => void;

  // Language & i18n
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Authenticated User Scoped Data (Strict Isolation)
  citizenProfile: CitizenProfile | null;
  updateProfile: (updates: Partial<CitizenProfile>) => void;
  myProfile: CitizenProfile | null;
  updateMyProfile: (updates: Partial<CitizenProfile>) => void;
  applications: Application[];
  documents: DocumentItem[];
  consents: ConsentItem[];
  notifications: NotificationItem[];
  myApplications: Application[];
  myDocuments: DocumentItem[];
  myConsents: ConsentItem[];
  myNotifications: NotificationItem[];
  submitApplication: (serviceId: string, formData: Record<string, any>, attachedDocs: string[]) => Application;
  withdrawApplication: (appId: string, payload: { reason?: string; remarks?: string }) => Promise<{ success: boolean; application: Application; message: string }>;
  deleteDraftApplication: (appId: string) => Promise<{ success: boolean; message: string }>;
  getServiceWithdrawalPolicy: (serviceId: string) => ServiceWithdrawalPolicy;
  refreshApplications: () => Promise<void>;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'userId'>) => DocumentItem;
  updateDocumentStatus: (id: string, status: DocumentStatus, notes?: string) => void;
  pullFromDigiLocker: (docType: string) => void;
  toggleConsentStatus: (id: string, newStatus: 'active' | 'denied') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  recommendedServices: Service[];
  isProfileSufficientForRecommendations: boolean;

  // Public & Universal Data
  services: Service[];
  addService: (newService: Omit<Service, 'id' | 'lastVerified'>) => Service;
  getServiceById: (id: string) => Service | undefined;
  departments: Department[];
  getDepartmentById: (id: string) => Department | undefined;
  grievances: GrievanceRecord[];
  submitGrievance: (grievance: Omit<GrievanceRecord, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'trackingNumber'>) => GrievanceRecord;

  // Department & Admin Authority Scoped Data
  allApplications: Application[];
  allDocuments: DocumentItem[];
  updateApplicationStage: (appId: string, stageIndex: number, newStatus: 'completed' | 'current' | 'pending', note?: string) => void;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus, officerNote?: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  integrations: ApiIntegration[];
  testIntegration: (id: string) => Promise<boolean>;

  // Modals & Settings
  cookiePreferences: CookiePreferences;
  updateCookiePreferences: (prefs: Partial<CookiePreferences>) => void;
  acceptAllCookies: () => void;
  rejectNonEssentialCookies: () => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isAccessibilityOpen: boolean;
  setIsAccessibilityOpen: (open: boolean) => void;
  isCookieModalOpen: boolean;
  setIsCookieModalOpen: (open: boolean) => void;
  resetAllDemoData: () => void;
}

const GovFlowContext = createContext<GovFlowContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'govflow_lang',
  SERVICES: 'govflow_services',
  AUDIT_LOGS: 'govflow_audit_logs',
  INTEGRATIONS: 'govflow_integrations',
  COOKIES: 'govflow_cookie_prefs',
  ACCESSIBILITY: 'govflow_accessibility',
  USERS_DB: 'govflow_db_users',
  PROFILES_DB: 'govflow_db_profiles',
  APPS_DB: 'govflow_db_applications',
  DOCS_DB: 'govflow_db_documents',
  CONSENTS_DB: 'govflow_db_consents',
  NOTIFS_DB: 'govflow_db_notifications',
};

export const GovFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sandbox Environment Mode
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(() => {
    return GovFlowApiService.getEnvironmentMode() === 'sandbox';
  });

  // Current User Session (Verified via GovFlowApiService, strictly null by default)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = GovFlowApiService.getActiveSession();
    return session ? session.user : null;
  });

  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authLoadingMessage, setAuthLoadingMessage] = useState<string>('Preparing your personalized dashboard...');
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  // Users registry (Starts EMPTY [] in clean production mode)
  const [demoUsers, setDemoUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (saved) return JSON.parse(saved);
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.users : [];
  });

  // Citizen Profiles (Starts EMPTY {} in clean production mode)
  const [citizenProfiles, setCitizenProfiles] = useState<Record<string, CitizenProfile>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES_DB);
    if (saved) return JSON.parse(saved);
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.profiles : {};
  });

  // Toggle Sandbox Mode
  const toggleSandboxMode = () => {
    if (isSandboxMode) {
      GovFlowApiService.clearSandboxEvaluationData();
      setIsSandboxMode(false);
      setDemoUsers([]);
      setCitizenProfiles({});
      setAllApplications([]);
      setAllDocuments([]);
      setAllConsents([]);
      setAllNotifications([]);
      setCurrentUser(null);
      setLogoutMessage('Switched to Clean Production Mode (Zero Hardcoded Data).');
    } else {
      GovFlowApiService.loadSandboxEvaluationData();
      setIsSandboxMode(true);
      setDemoUsers(SANDBOX_EVALUATION_DATA.users);
      setCitizenProfiles(SANDBOX_EVALUATION_DATA.profiles);
      setAllApplications(SANDBOX_EVALUATION_DATA.applications);
      setAllDocuments(SANDBOX_EVALUATION_DATA.documents);
      setAllConsents(SANDBOX_EVALUATION_DATA.consents);
      setAllNotifications(SANDBOX_EVALUATION_DATA.notifications);
      setLogoutMessage('Switched to Isolated Sandbox Mode (Demo / SIH Evaluation).');
    }
  };

  // Real-time Login with Visual Transition and Multi-Role Verification
  const login = async (
    identifier: string,
    password?: string,
    accountType?: AuthAccountType
  ): Promise<{ success: boolean; redirectPath: string; error?: string }> => {
    setIsAuthenticating(true);
    setAuthLoadingMessage('Authenticating credentials with GovFlow Identity Broker...');
    try {
      await new Promise(r => setTimeout(r, 400));
      setAuthLoadingMessage('Verifying digital identity & role authorizations...');
      
      const session = await GovFlowApiService.login({
        identifier,
        password,
        requestedRole: accountType || 'citizen'
      });
      
      setAuthLoadingMessage('Establishing secure isolated session data...');
      await new Promise(r => setTimeout(r, 350));

      // Session Switching Protection: Clear any previous user's cached state
      setCitizenProfiles({});
      setAllApplications([]);
      setAllDocuments([]);
      setAllConsents([]);
      setAllNotifications([]);

      setCurrentUser(session.user);
      setLogoutMessage(null);

      // Refresh scoped registries
      const savedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES_DB);
      if (savedProfiles) setCitizenProfiles(JSON.parse(savedProfiles));

      const savedApps = localStorage.getItem(STORAGE_KEYS.APPS_DB);
      if (savedApps && JSON.parse(savedApps).length > 0) {
        setAllApplications(JSON.parse(savedApps));
      } else if (session.user.role === 'officer' || session.user.role === 'dept_admin' || session.user.role === 'DEPARTMENT_OFFICER') {
        setAllApplications(INITIAL_APPLICATIONS);
        localStorage.setItem(STORAGE_KEYS.APPS_DB, JSON.stringify(INITIAL_APPLICATIONS));
      }

      const savedDocs = localStorage.getItem(STORAGE_KEYS.DOCS_DB);
      if (savedDocs) setAllDocuments(JSON.parse(savedDocs));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFS_DB);
      if (savedNotifs) setAllNotifications(JSON.parse(savedNotifs));

      const savedConsents = localStorage.getItem(STORAGE_KEYS.CONSENTS_DB);
      if (savedConsents) setAllConsents(JSON.parse(savedConsents));

      setIsAuthenticating(false);
      return { success: true, redirectPath: session.redirectPath || '/dashboard' };
    } catch (err: any) {
      setIsAuthenticating(false);
      const errorMessage = err?.message || 'Login failed. Please verify your credentials.';
      return { success: false, redirectPath: '/login', error: errorMessage };
    }
  };

  // Real-time Logout with Total Cache Invalidation
  const logout = () => {
    GovFlowApiService.logout();
    setCurrentUser(null);
    setCitizenProfiles({});
    setAllApplications([]);
    setAllDocuments([]);
    setAllConsents([]);
    setAllNotifications([]);
    setLogoutMessage('You have been securely logged out. Session cache destroyed.');
  };

  const clearLogoutMessage = () => setLogoutMessage(null);

  // Register New Citizen (Clean initial 20% completeness)
  const register = async (
    name: string, 
    email: string, 
    phone: string, 
    state: string, 
    category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS',
    password?: string
  ): Promise<void> => {
    setIsAuthenticating(true);
    setAuthLoadingMessage('Generating citizen identity & establishing DPDP consent ledger...');
    try {
      const { session, profile } = await GovFlowApiService.register({
        name,
        email,
        phone,
        state,
        category,
        password,
      });

      setAuthLoadingMessage('Preparing your personalized dashboard...');
      await new Promise(r => setTimeout(r, 400));

      setCurrentUser(session.user);
      setCitizenProfiles(prev => ({ ...prev, [session.user.id]: profile }));
      setDemoUsers(prev => [...prev, session.user]);

      setIsAuthenticating(false);
    } catch (err) {
      setIsAuthenticating(false);
      console.error('Registration failed:', err);
    }
  };

  // User Profile (Strictly scoped to currentUser.id)
  const myProfile = currentUser && currentUser.role === 'citizen'
    ? citizenProfiles[currentUser.id] || null
    : null;

  const updateMyProfile = async (updates: Partial<CitizenProfile>) => {
    if (!currentUser) return;
    const updated = await GovFlowApiService.updateMyProfile(updates);
    setCitizenProfiles(prev => ({ ...prev, [currentUser.id]: updated }));
  };

  // All Documents (Global DB)
  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS_DB);
    if (saved) return JSON.parse(saved);
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.documents : [];
  });

  // User-scoped documents (Strictly private!)
  const myDocuments = currentUser 
    ? allDocuments.filter(d => d.userId === currentUser.id)
    : [];

  const addDocument = (doc: Omit<DocumentItem, 'id' | 'userId'>): DocumentItem => {
    if (!currentUser) throw new Error('Unauthorized');
    const id = `DOC-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = { ...doc, id, userId: currentUser.id };

    setAllDocuments(prev => {
      const next = [newDoc, ...prev];
      localStorage.setItem(STORAGE_KEYS.DOCS_DB, JSON.stringify(next));
      return next;
    });

    // Update profile completeness dynamically
    if (myProfile) {
      const newCompleteness = calculateProfileCompleteness(myProfile, myDocuments.length + 1);
      updateMyProfile({ profileCompleteness: newCompleteness });
    }

    addAuditLog({
      userId: currentUser.id,
      actor: currentUser.name,
      actorRole: 'Citizen',
      action: 'Document Uploaded',
      service: 'GovFlow Document Vault',
      result: 'Success',
      details: `Uploaded ${newDoc.name} (${newDoc.type}).`,
    });

    return newDoc;
  };

  const updateDocumentStatus = (id: string, status: DocumentStatus, notes?: string) => {
    setAllDocuments(prev => {
      const next = prev.map(d => d.id === id ? { ...d, status, notes: notes || d.notes } : d);
      localStorage.setItem(STORAGE_KEYS.DOCS_DB, JSON.stringify(next));
      return next;
    });
  };

  const pullFromDigiLocker = (docType: string) => {
    if (!currentUser) return;
    const existing = myDocuments.find(d => d.type.toLowerCase().includes(docType.toLowerCase()));
    if (existing) {
      updateDocumentStatus(existing.id, 'verified', 'Verified via DigiLocker Sandbox Key Exchange');
    } else {
      addDocument({
        name: docType,
        type: docType,
        status: 'verified',
        issuer: 'National DigiLocker Sandbox',
        issueDate: new Date().toISOString().split('T')[0],
        docNumberMasked: 'DL-' + Math.floor(100000 + Math.random() * 900000),
        source: 'digilocker',
        notes: 'Directly fetched from DigiLocker repository with cryptographic proof.'
      });
    }
  };

  // Consents (Strictly User-scoped)
  const [allConsents, setAllConsents] = useState<ConsentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONSENTS_DB);
    if (saved) return JSON.parse(saved);
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.consents : [];
  });

  const myConsents = currentUser 
    ? allConsents.filter(c => c.userId === currentUser.id)
    : [];

  const toggleConsentStatus = (id: string, newStatus: 'active' | 'denied') => {
    setAllConsents(prev => {
      const next = prev.map(c => c.id === id ? { 
        ...c, 
        status: newStatus, 
        grantedAt: newStatus === 'active' ? new Date().toLocaleString() : undefined 
      } : c);
      localStorage.setItem(STORAGE_KEYS.CONSENTS_DB, JSON.stringify(next));
      return next;
    });
    const target = allConsents.find(c => c.id === id);
    addAuditLog({
      userId: currentUser?.id,
      actor: currentUser?.name || 'Citizen',
      actorRole: 'Citizen',
      action: newStatus === 'active' ? 'Data Sharing Consent Granted' : 'Consent Revoked',
      service: target ? target.serviceName : 'Civic Service',
      result: 'Success',
      details: `Citizen ${newStatus === 'active' ? 'authorized' : 'revoked'} access for ${target?.department}.`,
    });
  };

  // Applications (Strictly User-scoped)
  const [allApplications, setAllApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPS_DB);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    const session = GovFlowApiService.getActiveSession();
    if (session && (session.user.role === 'officer' || session.user.role === 'dept_admin' || session.user.role === 'DEPARTMENT_OFFICER')) {
      return INITIAL_APPLICATIONS;
    }
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.applications : [];
  });

  const myApplications = currentUser 
    ? allApplications.filter(a => a.userId === currentUser.id)
    : [];

  const submitApplication = (serviceId: string, formData: Record<string, any>, attachedDocs: string[]): Application => {
    if (!currentUser) throw new Error('Unauthorized');

    const service = getServiceById(serviceId);
    const id = `GF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString();
    
    const stages = service?.workflowStages.map((stageName, idx) => ({
      name: stageName,
      status: (idx === 0 ? 'completed' : idx === 1 ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
      timestamp: idx === 0 ? now : undefined,
      note: idx === 0 ? 'Submitted with auto-filled verified credentials' : undefined,
    })) || [
      { name: 'Application Submitted', status: 'completed' as const, timestamp: now },
      { name: 'Document Validation', status: 'current' as const },
      { name: 'Department Review', status: 'pending' as const },
      { name: 'Approval', status: 'pending' as const },
    ];

    const newApp: Application = {
      id,
      userId: currentUser.id,
      serviceId,
      serviceName: service?.name || 'Government Scheme',
      department: service?.department || 'Concerned Ministry',
      category: service?.category || 'Identity & Certificates',
      applicantName: currentUser.name,
      submittedAt: now,
      updatedAt: now,
      currentStage: stages[1]?.name || 'Document Validation',
      status: 'under_verification',
      priority: 'Normal',
      stages,
      formData,
      attachedDocuments: attachedDocs,
      officerNotes: 'Automated ingestion complete. Ready for document verification.',
    };

    setAllApplications(prev => {
      const next = [newApp, ...prev];
      localStorage.setItem(STORAGE_KEYS.APPS_DB, JSON.stringify(next));
      return next;
    });

    // Notify citizen
    addNotification({
      title: 'Application Successfully Submitted',
      message: `Your application for "${newApp.serviceName}" has been received with tracking ID ${newApp.id}.`,
      type: 'success',
      link: `/applications/${newApp.id}`,
    });

    addAuditLog({
      userId: newApp.userId,
      actor: newApp.applicantName,
      actorRole: 'Citizen',
      action: 'Application Submission',
      service: newApp.serviceName,
      applicationId: newApp.id,
      result: 'Success',
      details: `Application ${newApp.id} submitted with ${attachedDocs.length} attached documents.`,
    });

    return newApp;
  };

  const updateApplicationStage = (appId: string, stageIndex: number, newStatus: 'completed' | 'current' | 'pending', note?: string) => {
    setAllApplications(prev => {
      const next = prev.map(app => {
        if (app.id !== appId) return app;
        const updatedStages = [...app.stages];
        if (updatedStages[stageIndex]) {
          updatedStages[stageIndex] = {
            ...updatedStages[stageIndex],
            status: newStatus,
            timestamp: newStatus === 'completed' ? new Date().toLocaleString() : updatedStages[stageIndex].timestamp,
            note: note || updatedStages[stageIndex].note,
          };
        }
        const currentActive = updatedStages.find(s => s.status === 'current') || updatedStages[stageIndex];
        return {
          ...app,
          stages: updatedStages,
          currentStage: currentActive?.name || app.currentStage,
          updatedAt: new Date().toLocaleString(),
        };
      });
      localStorage.setItem(STORAGE_KEYS.APPS_DB, JSON.stringify(next));
      return next;
    });
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus, officerNote?: string) => {
    const target = allApplications.find(a => a.id === appId);
    setAllApplications(prev => {
      const next = prev.map(app => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: newStatus,
          officerNotes: officerNote || app.officerNotes,
          updatedAt: new Date().toLocaleString(),
        };
      });
      localStorage.setItem(STORAGE_KEYS.APPS_DB, JSON.stringify(next));
      return next;
    });

    if (target) {
      addNotificationInternal(target.userId, {
        title: `Application Status Updated: ${newStatus.toUpperCase()}`,
        message: `Your application ${appId} for "${target.serviceName}" has been updated to ${newStatus}.`,
        type: newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'alert' : 'info',
        link: `/applications/${appId}`,
      });
    }

    addAuditLog({
      actor: currentUser?.name || 'Department Officer',
      actorRole: currentUser?.role || 'officer',
      action: `Application ${newStatus.toUpperCase()}`,
      service: target?.serviceName || 'Civic Service',
      applicationId: appId,
      result: newStatus === 'approved' ? 'Success' : newStatus === 'rejected' ? 'Error' : 'Manual Review',
      details: officerNote || `Application marked as ${newStatus} by department desk.`,
    });
  };

  const getServiceWithdrawalPolicy = (serviceId: string): ServiceWithdrawalPolicy => {
    const service = getServiceById(serviceId) || services.find(s => s.id === serviceId || (serviceId === 'SRV-REV-002' && s.id === 'SRV-CERT-020'));
    if (service?.withdrawalPolicy) {
      return service.withdrawalPolicy;
    }
    return {
      allowed: true,
      allowedStatuses: ['submitted', 'under_verification', 'department_review', 'under_review', 'draft'],
      reasonRequired: true,
      reasonOptions: [
        'No longer required',
        'Submitted by mistake',
        'Information needs correction',
        'Applying for another service',
        'Other'
      ],
      warningMessage: 'Withdrawal cannot be undone if the service does not support restoration.',
      allowRestoration: false,
      notifyDepartment: true,
    };
  };

  const refreshApplications = async (): Promise<void> => {
    const savedApps = localStorage.getItem(STORAGE_KEYS.APPS_DB);
    if (savedApps) setAllApplications(JSON.parse(savedApps));
    const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFS_DB);
    if (savedNotifs) setAllNotifications(JSON.parse(savedNotifs));
    const savedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
  };

  const withdrawApplication = async (appId: string, payload: { reason?: string; remarks?: string }) => {
    const result = await GovFlowApiService.withdrawApplication(appId, payload);
    await refreshApplications();
    return result;
  };

  const deleteDraftApplication = async (appId: string) => {
    const result = await GovFlowApiService.deleteDraftApplication(appId);
    await refreshApplications();
    return result;
  };

  // Notifications (Strictly User-scoped)
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS_DB);
    if (saved) return JSON.parse(saved);
    return isSandboxMode ? SANDBOX_EVALUATION_DATA.notifications : [];
  });

  const myNotifications = currentUser 
    ? allNotifications.filter(n => n.userId === currentUser.id)
    : [];

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>) => {
    if (!currentUser) return;
    addNotificationInternal(currentUser.id, notif);
  };

  const addNotificationInternal = (userId: string, notif: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      userId,
      timestamp: 'Just now',
      read: false,
    };
    setAllNotifications(prev => {
      const next = [newNotif, ...prev];
      localStorage.setItem(STORAGE_KEYS.NOTIFS_DB, JSON.stringify(next));
      return next;
    });
  };

  const markAsRead = (id: string) => {
    setAllNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFS_DB, JSON.stringify(next));
      return next;
    });
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    setAllNotifications(prev => {
      const next = prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFS_DB, JSON.stringify(next));
      return next;
    });
  };

  // Dynamic Scheme Recommendations (Real profile-driven matching)
  const isProfileSufficientForRecommendations = !!(myProfile && myProfile.profileCompleteness >= 40);

  const recommendedServices: Service[] = React.useMemo(() => {
    if (!currentUser || !myProfile || !isProfileSufficientForRecommendations) {
      return [];
    }

    return INITIAL_SERVICES.filter(service => {
      if (myProfile.category && service.eligibilityRules.some(r => r.label.toLowerCase().includes(myProfile.category.toLowerCase()) || r.explanation.toLowerCase().includes(myProfile.category.toLowerCase()))) {
        return true;
      }
      if (myProfile.employment?.occupation && service.eligibilityRules.some(r => r.label.toLowerCase().includes(myProfile.employment.occupation.toLowerCase()) || r.explanation.toLowerCase().includes(myProfile.employment.occupation.toLowerCase()))) {
        return true;
      }
      if (myProfile.address?.state && (service.department.toLowerCase().includes(myProfile.address.state.toLowerCase()) || service.state === myProfile.address.state)) {
        return true;
      }
      if (myProfile.employment?.annualIncome && myProfile.employment.annualIncome <= 300000 && service.tags.includes('Financial Aid')) {
        return true;
      }
      return false;
    }).slice(0, 3);
  }, [currentUser, myProfile, isProfileSufficientForRecommendations]);

  // Universal Public Services Catalogue
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_SERVICES.length) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  });

  const addService = (newService: Omit<Service, 'id' | 'lastVerified'>): Service => {
    const id = `SRV-CUS-${Date.now().toString().slice(-4)}`;
    const created: Service = { ...newService, id, lastVerified: new Date().toISOString().split('T')[0] };
    setServices(prev => {
      const next = [created, ...prev];
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
      return next;
    });
    return created;
  };

  const getServiceById = (id: string) => services.find(s => s.id === id);

  // Government Departments Directory
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const getDepartmentById = (id: string) => departments.find(d => d.id === id);

  // Government Grievance System
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(() => {
    const saved = localStorage.getItem('govflow_grievances');
    return saved ? JSON.parse(saved) : [];
  });

  const submitGrievance = (item: Omit<GrievanceRecord, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'trackingNumber'>): GrievanceRecord => {
    const newGrievance: GrievanceRecord = {
      ...item,
      id: `GRV-${Date.now()}`,
      trackingNumber: `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGrievances(prev => {
      const next = [newGrievance, ...prev];
      localStorage.setItem('govflow_grievances', JSON.stringify(next));
      return next;
    });
    addAuditLog({
      userId: currentUser?.id,
      actor: item.citizenName || 'Citizen',
      actorRole: 'Citizen',
      action: 'Public Grievance Lodged',
      service: item.department,
      result: 'Success',
      details: `Grievance registered with tracking number ${newGrievance.trackingNumber}.`,
    });
    return newGrievance;
  };

  // Language & i18n
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode) || 'en';
  });

  const setCurrentLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: 'Language Preference Updated',
        service: 'GovFlow i18n Engine',
        result: 'Success',
        details: `Citizen updated preferred language to ${lang.toUpperCase()}.`,
      });
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(next));
      return next;
    });
  };

  // Integrations
  const [integrations, setIntegrations] = useState<ApiIntegration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });

  const testIntegration = async (id: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 500));
    setIntegrations(prev => {
      const next = prev.map(int => int.id === id ? {
        ...int,
        latency: Math.floor(25 + Math.random() * 25),
        lastSync: 'Just now (Ping tested)',
        totalRequests: int.totalRequests + 1,
        health: 'Operational' as const,
      } : int);
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(next));
      return next;
    });
    return true;
  };

  // Cookies
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COOKIES);
    return saved ? JSON.parse(saved) : { essential: true, preferences: true, analytics: false, hasConsented: false };
  });

  const updateCookiePreferences = (prefs: Partial<CookiePreferences>) => {
    setCookiePreferences(prev => {
      const next = { ...prev, ...prefs, essential: true, hasConsented: true };
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(next));
      return next;
    });
  };

  const acceptAllCookies = () => {
    updateCookiePreferences({ essential: true, preferences: true, analytics: true, hasConsented: true });
  };

  const rejectNonEssentialCookies = () => {
    updateCookiePreferences({ essential: true, preferences: false, analytics: false, hasConsented: true });
  };

  // Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
    return saved ? JSON.parse(saved) : { textScale: 'base', highContrast: false, reduceMotion: false };
  });

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => {
      const next = { ...prev, ...settings };
      localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-sm', 'text-scale-base', 'text-scale-lg');
    root.classList.add(`text-scale-${accessibility.textScale}`);
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [accessibility]);

  // Modals
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  const resetAllDemoData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const currentRole = currentUser ? currentUser.role : null;
  const isVisitor = !currentUser;

  const setCurrentRole = (role: UserRole) => {
    const accountType: AuthAccountType = (role === 'sys_admin' || role === 'SYSTEM_ADMIN') ? 'sys_admin' : (role === 'officer' || role === 'dept_admin' || role === 'DEPARTMENT_OFFICER') ? 'officer' : 'citizen';
    const userForRole = demoUsers.find(u => u.role === role);
    if (userForRole) {
      login(userForRole.officialId || userForRole.id, userForRole.password, accountType);
    }
  };

  return (
    <GovFlowContext.Provider value={{
      currentUser,
      currentRole,
      isVisitor,
      isAuthenticating,
      authLoadingMessage,
      demoUsers,
      isSandboxMode,
      toggleSandboxMode,
      login,
      logout,
      register,
      setCurrentRole,
      logoutMessage,
      clearLogoutMessage,
      currentLanguage,
      setCurrentLanguage,
      t,
      // Scoped aliases
      citizenProfile: myProfile,
      updateProfile: updateMyProfile,
      applications: myApplications,
      documents: myDocuments,
      consents: myConsents,
      notifications: myNotifications,
      // Native scoped
      myProfile,
      updateMyProfile,
      myApplications,
      myDocuments,
      myConsents,
      myNotifications,
      submitApplication,
      addDocument,
      updateDocumentStatus,
      pullFromDigiLocker,
      toggleConsentStatus,
      markAsRead,
      markAllAsRead,
      recommendedServices,
      isProfileSufficientForRecommendations,
      services,
      addService,
      getServiceById,
      departments,
      getDepartmentById,
      grievances,
      submitGrievance,
      allApplications,
      allDocuments,
      updateApplicationStage,
      updateApplicationStatus,
      withdrawApplication,
      deleteDraftApplication,
      getServiceWithdrawalPolicy,
      refreshApplications,
      auditLogs,
      addAuditLog,
      integrations,
      testIntegration,
      cookiePreferences,
      updateCookiePreferences,
      acceptAllCookies,
      rejectNonEssentialCookies,
      accessibility,
      updateAccessibility,
      isAssistantOpen,
      setIsAssistantOpen,
      isAccessibilityOpen,
      setIsAccessibilityOpen,
      isCookieModalOpen,
      setIsCookieModalOpen,
      resetAllDemoData,
    }}>
      {children}
    </GovFlowContext.Provider>
  );
};

export const useGovFlow = () => {
  const context = useContext(GovFlowContext);
  if (!context) {
    throw new Error('useGovFlow must be used within a GovFlowProvider');
  }
  return context;
};
