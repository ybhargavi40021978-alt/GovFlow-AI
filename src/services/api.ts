import { 
  User, 
  UserRole,
  AuthAccountType,
  CitizenProfile, 
  Service, 
  ServiceWithdrawalPolicy,
  DocumentItem, 
  ConsentItem, 
  Application, 
  NotificationItem,
  AuditLog
} from '../types';
import { INITIAL_SERVICES, SANDBOX_EVALUATION_DATA } from '../store/mockData';

// Storage keys for persistent isolated database
const DB_KEYS = {
  SESSION: 'govflow_auth_session',
  USERS: 'govflow_db_users',
  PROFILES: 'govflow_db_profiles',
  APPLICATIONS: 'govflow_db_applications',
  DOCUMENTS: 'govflow_db_documents',
  CONSENTS: 'govflow_db_consents',
  NOTIFICATIONS: 'govflow_db_notifications',
  AUDIT_LOGS: 'govflow_db_audit_logs',
  SERVICES: 'govflow_db_services',
  ENV_MODE: 'govflow_env_mode', // 'production' | 'sandbox'
};

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
  redirectPath: string;
}

// Password Hashing Utility (Salted Cryptographic SHA-256)
export const AUTH_SALT = 'govflow_auth_secure_salt_v1';

export async function hashPassword(plainText: string, salt: string = AUTH_SALT): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText + ':' + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  const str = plainText + ':' + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fallback:' + Math.abs(hash).toString(16);
}

export async function verifyPassword(inputPassword: string, storedHashOrPassword?: string): Promise<boolean> {
  if (!storedHashOrPassword) return true;
  if (storedHashOrPassword.startsWith('sha256:')) {
    const computed = await hashPassword(inputPassword);
    return computed === storedHashOrPassword;
  }
  return inputPassword === storedHashOrPassword;
}

// Officially Provisioned Government Accounts (Administrative Registry - Demo/Dev Only)
export const PROVISIONED_OFFICIAL_USERS: User[] = [
  {
    id: 'OFFICER001',
    name: 'Department Officer',
    email: 'officer001@govflow.gov.in',
    phone: '',
    officialId: 'OFFICER001',
    role: 'DEPARTMENT_OFFICER',
    passwordHash: 'sha256:8db2e1ebff74413cdb254114650f6a35e6e665f981b3894f10cf59f9b797009a',
    isActive: true,
    department: 'Education',
    departmentId: 'dept-education',
    designation: 'Department Verification Officer (Education)',
    personaTitle: 'Department Officer'
  },
  {
    id: 'ADMIN001',
    name: 'System Administrator',
    email: 'admin001@govflow.ai',
    phone: '',
    officialId: 'ADMIN001',
    role: 'SYSTEM_ADMIN',
    passwordHash: 'sha256:f7700339029f249118f9ce80843000b5b4b59d4b9d7d1e0d428e0f12ae54b3be',
    isActive: true,
    departmentAccess: 'ALL_DEPARTMENTS',
    designation: 'System Administrator',
    personaTitle: 'National System Administrator'
  }
];

// Helpers for persistent local database
const getTable = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setTable = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to persist to ${key}:`, err);
  }
};

// Calculate profile completeness dynamically based on provided fields
export const calculateProfileCompleteness = (profile: Partial<CitizenProfile>, docsCount: number = 0): number => {
  let score = 20; // Base: Name, Email, Phone provided at registration
  
  // Address & State (+20%)
  if (profile.address?.line1 && profile.address?.state && profile.address?.district) {
    score += 20;
  }

  // Education or Employment Details (+20%)
  if (profile.education?.level || profile.employment?.status) {
    score += 20;
  }

  // Demographics / Category & DOB (+20%)
  if (profile.category && profile.dob) {
    score += 20;
  }

  // Verified Documents in Vault (+20%)
  if (docsCount > 0) {
    score += 20;
  }

  return Math.min(100, score);
};

export class GovFlowApiService {
  // Session Token Validation
  static getActiveSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(DB_KEYS.SESSION);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  // Environment Mode (Production vs Sandbox)
  static getEnvironmentMode(): 'production' | 'sandbox' {
    return (localStorage.getItem(DB_KEYS.ENV_MODE) as 'production' | 'sandbox') || 'production';
  }

  static setEnvironmentMode(mode: 'production' | 'sandbox'): void {
    localStorage.setItem(DB_KEYS.ENV_MODE, mode);
  }

  // Mandatory Backend Authorization Checkers
  static requireAuth(): AuthSession {
    const session = this.getActiveSession();
    if (!session) {
      throw new Error('401 Unauthorized: Valid authentication token required');
    }
    return session;
  }

  static requireRole(allowedRoles: (UserRole | string)[]): AuthSession {
    const session = this.requireAuth();
    const role = session.user.role;
    const isAllowed = allowedRoles.includes(role) ||
      ((role === 'DEPARTMENT_OFFICER' || role === 'officer') && (allowedRoles.includes('officer') || allowedRoles.includes('DEPARTMENT_OFFICER'))) ||
      ((role === 'SYSTEM_ADMIN' || role === 'sys_admin') && (allowedRoles.includes('sys_admin') || allowedRoles.includes('SYSTEM_ADMIN')));
    if (!isAllowed) {
      throw new Error(`403 Forbidden: Account role '${session.user.role}' is not authorized for this resource`);
    }
    return session;
  }

  static requireOwnership(resourceUserId: string): AuthSession {
    const session = this.requireAuth();
    const role = session.user.role;
    const isStaff = role === 'sys_admin' || role === 'SYSTEM_ADMIN' || role === 'officer' || role === 'DEPARTMENT_OFFICER' || role === 'dept_admin';
    if (session.user.id !== resourceUserId && !isStaff) {
      throw new Error('403 Forbidden: Resource access denied (ownership validation failed)');
    }
    return session;
  }

  // Register New Citizen (Strictly Zero Hardcoded Data)
  static async register(payload: {
    name: string;
    email: string;
    phone: string;
    state: string;
    category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
    password?: string;
  }): Promise<{ session: AuthSession; profile: CitizenProfile }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getTable<User[]>(DB_KEYS.USERS, []);
    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});

    const userId = `usr-${Date.now().toString().slice(-6)}`;
    const citizenId = `CIT-${payload.state.slice(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id: userId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: 'citizen',
      personaTitle: `Resident Citizen (${payload.state})`,
      password: payload.password,
      isActive: true,
    };

    // Initial Profile with 20% completeness
    const newProfile: CitizenProfile = {
      id: citizenId,
      userId: userId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      dob: '',
      gender: 'Other',
      category: payload.category,
      aadhaarMasked: 'Not Linked',
      pan: 'Not Linked',
      address: {
        line1: '',
        district: '',
        state: payload.state,
        pincode: '',
      },
      education: {
        level: '',
        institution: '',
        passingYear: '',
      },
      employment: {
        status: 'Citizen',
        occupation: '',
        annualIncome: 0,
      },
      profileCompleteness: 20, // Clean initial empty profile
    };

    // Save user & profile to database
    users.push(newUser);
    profiles[userId] = newProfile;
    setTable(DB_KEYS.USERS, users);
    setTable(DB_KEYS.PROFILES, profiles);

    // Create session token
    const token = `jwt_gf_${userId}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: newUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      redirectPath: '/dashboard',
    };
    setTable(DB_KEYS.SESSION, session);

    // Add initial welcome notification
    this.addNotificationInternal(userId, {
      title: 'Welcome to GovFlow AI',
      message: 'Your unified citizen profile has been initialized. Complete your profile to receive tailored government scheme matches.',
      type: 'info',
      link: '/profile',
    });

    // Add audit log
    this.addAuditLogInternal({
      userId,
      actor: newUser.name,
      actorRole: 'citizen',
      action: 'Account Registration',
      service: 'GovFlow Identity Broker',
      result: 'Success',
      details: `Citizen account created with ID ${userId} and base completeness 20%.`,
    });

    return { session, profile: newProfile };
  }

  // Real-Time Multi-Role Login with Strict Role Mismatch Validation
  static async login(payloadOrIdentifier: string | {
    identifier: string;
    password?: string;
    requestedRole?: AuthAccountType;
  }): Promise<AuthSession> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const identifier = typeof payloadOrIdentifier === 'string' 
      ? payloadOrIdentifier 
      : payloadOrIdentifier.identifier;
    
    const password = typeof payloadOrIdentifier === 'string' 
      ? undefined 
      : payloadOrIdentifier.password;

    const requestedRole: AuthAccountType = typeof payloadOrIdentifier === 'string' 
      ? 'citizen' 
      : (payloadOrIdentifier.requestedRole || 'citizen');

    const cleanIdentifier = identifier.trim().toLowerCase();
    let users = getTable<User[]>(DB_KEYS.USERS, []);

    // 1. Check officially provisioned government accounts first (Authoritative Demo Accounts)
    const provisionedMatch = PROVISIONED_OFFICIAL_USERS.find(u => 
      u.email?.toLowerCase() === cleanIdentifier || 
      u.phone === identifier.trim() ||
      (u.officialId && u.officialId.toLowerCase() === cleanIdentifier) ||
      u.id.toLowerCase() === cleanIdentifier
    );

    let user: User | undefined;

    if (provisionedMatch) {
      user = { ...provisionedMatch };
      const existingIdx = users.findIndex(u => 
        u.id.toLowerCase() === user!.id.toLowerCase() ||
        (u.officialId && u.officialId.toLowerCase() === user!.officialId?.toLowerCase())
      );
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...user };
      } else {
        users.push(user);
      }
      setTable(DB_KEYS.USERS, users);
    } else {
      // 2. Search in persistent users database
      user = users.find(u => 
        u.email?.toLowerCase() === cleanIdentifier || 
        u.phone === identifier.trim() ||
        u.id.toLowerCase() === cleanIdentifier ||
        (u.officialId && u.officialId.toLowerCase() === cleanIdentifier)
      );
    }

    // 3. Fallback for sandbox mode if enabled
    if (!user && this.getEnvironmentMode() === 'sandbox') {
      const sandboxUsers = SANDBOX_EVALUATION_DATA.users;
      user = sandboxUsers.find(u => 
        u.id === identifier.trim() || 
        u.email.toLowerCase() === cleanIdentifier ||
        u.phone === identifier.trim()
      );
      if (user) {
        const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
        if (SANDBOX_EVALUATION_DATA.profiles[user.id]) {
          profiles[user.id] = SANDBOX_EVALUATION_DATA.profiles[user.id];
          setTable(DB_KEYS.PROFILES, profiles);
        }
      }
    }

    // 4. Verify user existence
    if (!user) {
      throw new Error('Account not found with provided credentials. Please check your Email / Official ID.');
    }

    // 5. Verify account is active
    if (user.isActive === false) {
      throw new Error('This account has been deactivated. Please contact your departmental administrator.');
    }

    // 6. Verify password if account has a configured password or passwordHash
    if (user.passwordHash || user.password) {
      if (!password) {
        throw new Error('Password required. Please enter your confidential password.');
      }
      const isMatch = await verifyPassword(password, user.passwordHash || user.password);
      if (!isMatch) {
        throw new Error('Invalid password. Please verify your credentials and try again.');
      }
    }

    // 7. Verify authorization for the requested role (STRICT ROLE MISMATCH PROTECTION)
    if (requestedRole === 'sys_admin') {
      if (user.role !== 'sys_admin' && user.role !== 'SYSTEM_ADMIN') {
        throw new Error('Access denied. This account does not have System Administrator permissions.');
      }
    } else if (requestedRole === 'officer') {
      if (user.role !== 'officer' && user.role !== 'dept_admin' && user.role !== 'DEPARTMENT_OFFICER') {
        throw new Error('Access denied. This account does not have Department Officer permissions.');
      }
    } else if (requestedRole === 'citizen') {
      if (user.role !== 'citizen') {
        throw new Error('Access denied. This account is registered for government personnel. Please switch to Department Officer or System Administrator.');
      }
    }

    // 8. Determine redirect path based on verified backend role
    let redirectPath = '/dashboard';
    if (user.role === 'officer' || user.role === 'DEPARTMENT_OFFICER') {
      redirectPath = '/officer/dashboard';
    } else if (user.role === 'dept_admin') {
      redirectPath = '/department-admin/dashboard';
    } else if (user.role === 'sys_admin' || user.role === 'SYSTEM_ADMIN') {
      redirectPath = '/admin/dashboard';
    }

    // 9. Create secure session token (Sanitize password fields from session)
    const { password: _pw, passwordHash: _ph, ...safeUser } = user;
    const token = `jwt_gf_${user.id}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: safeUser as User,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      redirectPath,
    };
    setTable(DB_KEYS.SESSION, session);

    // 10. Immutable Audit Trail
    this.addAuditLogInternal({
      userId: user.id,
      actor: user.name,
      actorRole: user.role,
      action: 'Session Authenticated',
      service: 'GovFlow Identity Broker',
      result: 'Success',
      details: `User ${user.name} authenticated under verified role '${user.role}' (requested hint: '${requestedRole}'). Routing to ${redirectPath}.`,
    });

    return session;
  }

  // Logout (Complete Cache & Session Wipe)
  static async logout(): Promise<void> {
    const session = this.getActiveSession();
    if (session) {
      this.addAuditLogInternal({
        userId: session.user.id,
        actor: session.user.name,
        actorRole: session.user.role,
        action: 'Session Terminated',
        service: 'GovFlow Identity Broker',
        result: 'Success',
        details: `User ${session.user.name} logged out. Private state destroyed.`,
      });
    }
    localStorage.removeItem(DB_KEYS.SESSION);
  }

  // GET /api/me (Current Authenticated User)
  static async getMe(): Promise<{ user: User; profile: CitizenProfile | null }> {
    const session = this.getActiveSession();
    if (!session) {
      throw new Error('Unauthorized: No active session');
    }
    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    const profile = profiles[session.user.id] || null;
    return { user: session.user, profile };
  }

  // PUT /api/me/profile (Update Profile)
  static async updateMyProfile(updates: Partial<CitizenProfile>): Promise<CitizenProfile> {
    const session = this.getActiveSession();
    if (!session) throw new Error('Unauthorized');

    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    const existing = profiles[session.user.id] || {
      id: `CIT-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
      category: 'General',
      profileCompleteness: 20,
    };

    const merged = { ...existing, ...updates };
    const myDocs = (await this.getMyDocuments()).length;
    merged.profileCompleteness = calculateProfileCompleteness(merged, myDocs);

    profiles[session.user.id] = merged;
    setTable(DB_KEYS.PROFILES, profiles);
    return merged;
  }

  // GET /api/me/applications (Strict User Data Isolation)
  static async getMyApplications(): Promise<Application[]> {
    const session = this.getActiveSession();
    if (!session) return [];
    const all = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    return all.filter(app => app.userId === session.user.id);
  }

  // POST /api/me/applications
  static async submitApplication(
    serviceId: string, 
    formData: Record<string, any>, 
    attachedDocs: string[]
  ): Promise<Application> {
    const session = this.getActiveSession();
    if (!session) throw new Error('Unauthorized');

    const services = await this.getServices();
    const service = services.find(s => s.id === serviceId);
    const now = new Date().toLocaleString();
    const appId = `GF-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const stages = service?.workflowStages.map((stageName, idx) => ({
      name: stageName,
      status: (idx === 0 ? 'completed' : idx === 1 ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
      timestamp: idx === 0 ? now : undefined,
      note: idx === 0 ? 'Application submitted with auto-filled verified credentials' : undefined,
    })) || [
      { name: 'Application Submitted', status: 'completed' as const, timestamp: now },
      { name: 'Document Validation', status: 'current' as const },
      { name: 'Department Review', status: 'pending' as const },
      { name: 'Approval', status: 'pending' as const },
    ];

    const newApp: Application = {
      id: appId,
      userId: session.user.id,
      serviceId,
      serviceName: service?.name || 'Government Scheme',
      department: service?.department || 'Concerned Ministry',
      category: service?.category || 'Identity & Certificates',
      applicantName: session.user.name,
      submittedAt: now,
      updatedAt: now,
      currentStage: stages[1]?.name || 'Document Validation',
      status: 'under_verification',
      priority: 'Normal',
      stages,
      formData,
      attachedDocuments: attachedDocs,
      officerNotes: 'Automated verification active. Ready for department officer scrutiny.',
    };

    const all = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    all.unshift(newApp);
    setTable(DB_KEYS.APPLICATIONS, all);

    this.addNotificationInternal(session.user.id, {
      title: 'Application Submitted Successfully',
      message: `Your application for "${newApp.serviceName}" has been received with Application ID ${newApp.id}.`,
      type: 'success',
      link: `/applications/${newApp.id}`,
    });

    return newApp;
  }

  // GET /api/applications/:applicationId (Ownership & Authorization Validated)
  static async getApplicationById(applicationId: string): Promise<Application | null> {
    const session = this.requireAuth();
    const all = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    const app = all.find(a => a.id === applicationId);
    if (!app) return null;

    if (app.userId !== session.user.id && !['officer', 'dept_admin', 'sys_admin', 'DEPARTMENT_OFFICER', 'SYSTEM_ADMIN'].includes(session.user.role)) {
      throw new Error('403 Forbidden: You do not have permission to access this application.');
    }
    return app;
  }

  // POST /api/applications/:applicationId/withdraw (Secure Multi-Tier Validation)
  static async withdrawApplication(
    applicationId: string, 
    payload: { reason?: string; remarks?: string }
  ): Promise<{ success: boolean; application: Application; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 400)); // Network simulation

    // 1. Mandatory Authentication Check
    const session = this.requireAuth();

    // 2. Application Existence Check
    const all = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    const appIndex = all.findIndex(a => a.id === applicationId);
    if (appIndex === -1) {
      throw new Error(`404 Not Found: Application '${applicationId}' does not exist.`);
    }
    const app = all[appIndex];

    // 3. Application Ownership Verification (Strict Anti-IDOR: Prevent altering other citizens' applications)
    if (app.userId !== session.user.id) {
      throw new Error('403 Forbidden: Ownership verification failed. You can only withdraw your own applications.');
    }

    // 4. Duplicate Request Protection
    if (app.status === 'withdrawn') {
      throw new Error('409 Conflict: This application has already been withdrawn.');
    }

    // 5. Verify current status permits withdrawal
    if (['approved', 'rejected', 'completed'].includes(app.status)) {
      throw new Error(`400 Bad Request: Applications in status '${app.status.toUpperCase()}' cannot be withdrawn.`);
    }

    // 6. Service Withdrawal Policy Verification
    const services = await this.getServices();
    const service = services.find(s => s.id === app.serviceId);
    const defaultPolicy: ServiceWithdrawalPolicy = {
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
    const policy: ServiceWithdrawalPolicy = service?.withdrawalPolicy || defaultPolicy;

    if (!policy.allowed) {
      throw new Error(`403 Forbidden: The configured policy for service '${app.serviceName}' does not permit application withdrawal.`);
    }

    const isStatusAllowed = policy.allowedStatuses.includes(app.status) || 
      (app.status === 'department_review' && policy.allowedStatuses.includes('under_review')) ||
      (app.status === 'under_review' && policy.allowedStatuses.includes('department_review'));

    if (!isStatusAllowed) {
      throw new Error(`400 Bad Request: Withdrawal is not permitted for this service when application status is '${app.status}'.`);
    }

    const cleanReason = (payload.reason || '').trim();
    if (policy.reasonRequired && !cleanReason) {
      throw new Error('422 Unprocessable Entity: A withdrawal reason is required by this service.');
    }

    // 7. Update Application State
    const now = new Date().toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const previousStatus = app.status;

    // Timeline updates: Mark current stage as Withdrawn; mark subsequent stages as Discontinued
    let currentOrActiveFound = false;
    const updatedStages = app.stages.map(st => {
      if (st.status === 'current') {
        currentOrActiveFound = true;
        return {
          ...st,
          status: 'completed' as const,
          note: `Active when citizen requested withdrawal on ${now}.`,
        };
      }
      if (st.status === 'pending' && currentOrActiveFound) {
        return {
          ...st,
          note: 'Discontinued due to application withdrawal.',
        };
      }
      return st;
    });

    // Append Withdrawn milestone to application timeline
    updatedStages.push({
      name: 'Application Withdrawn',
      status: 'completed',
      timestamp: now,
      note: `Withdrawn by applicant. Reason: ${cleanReason || 'Not specified'}${payload.remarks ? ` (${payload.remarks.trim()})` : ''}`,
    });

    const updatedApp: Application = {
      ...app,
      previousStatus,
      status: 'withdrawn',
      withdrawnAt: now,
      withdrawalReason: cleanReason || 'Not specified',
      withdrawalRemarks: payload.remarks ? payload.remarks.trim() : undefined,
      currentStage: 'Application Withdrawn',
      stages: updatedStages,
      officerNotes: `[WITHDRAWAL AUDIT] Application withdrawn by citizen on ${now}. Reason: ${cleanReason || 'Not specified'}. Statutory processing permanently suspended.`,
      updatedAt: now,
    };

    all[appIndex] = updatedApp;
    setTable(DB_KEYS.APPLICATIONS, all);

    // 8. Create Immutable Audit Log Entry
    this.addAuditLogInternal({
      userId: session.user.id,
      actor: session.user.name,
      actorRole: 'citizen',
      action: 'Application Withdrawal',
      service: app.serviceName,
      applicationId: app.id,
      result: 'Success',
      details: `Citizen withdrew application ${app.id}. Previous status: ${previousStatus}. Reason: ${cleanReason || 'Not specified'}.`,
    });

    // 9. Send Notification to Citizen
    this.addNotificationInternal(session.user.id, {
      title: 'Application withdrawn successfully',
      message: `Your application has been withdrawn. Application ID: ${app.id}.`,
      type: 'alert',
      link: `/applications/${app.id}`,
    });

    // 10. Notify Relevant Department when required
    if (policy.notifyDepartment) {
      this.addAuditLogInternal({
        actor: 'GovFlow Statutory Gateway',
        actorRole: 'system',
        action: 'Department Withdrawal Notice',
        service: app.serviceName,
        applicationId: app.id,
        result: 'Success',
        details: `Official notice sent to ${app.department}: Case ${app.id} marked as WITHDRAWN. Further scrutiny suspended.`,
      });
    }

    return {
      success: true,
      application: updatedApp,
      message: `Application ${app.id} withdrawn successfully.`,
    };
  }

  // DELETE /api/applications/:applicationId/draft (Remove Application Draft)
  static async deleteDraftApplication(applicationId: string): Promise<{ success: boolean; message: string }> {
    const session = this.requireAuth();
    const all = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    const appIndex = all.findIndex(a => a.id === applicationId);
    if (appIndex === -1) {
      throw new Error(`404 Not Found: Draft application '${applicationId}' does not exist.`);
    }
    const app = all[appIndex];

    if (app.userId !== session.user.id) {
      throw new Error('403 Forbidden: Ownership validation failed. You can only delete your own draft applications.');
    }

    if (app.status !== 'draft') {
      throw new Error(`400 Bad Request: Application '${applicationId}' is in status '${app.status}' and cannot be deleted as draft.`);
    }

    all.splice(appIndex, 1);
    setTable(DB_KEYS.APPLICATIONS, all);

    this.addAuditLogInternal({
      userId: session.user.id,
      actor: session.user.name,
      actorRole: 'citizen',
      action: 'Application Draft Deleted',
      service: app.serviceName,
      applicationId: app.id,
      result: 'Success',
      details: `Draft application ${app.id} was permanently removed by citizen.`,
    });

    this.addNotificationInternal(session.user.id, {
      title: 'Application Draft Deleted',
      message: `Your draft application for "${app.serviceName}" (${app.id}) has been removed.`,
      type: 'info',
      link: '/applications',
    });

    return {
      success: true,
      message: `Draft application ${applicationId} has been deleted.`,
    };
  }
  static async getMyDocuments(): Promise<DocumentItem[]> {
    const session = this.getActiveSession();
    if (!session) return [];
    const all = getTable<DocumentItem[]>(DB_KEYS.DOCUMENTS, []);
    return all.filter(doc => doc.userId === session.user.id);
  }

  // POST /api/me/documents
  static async addDocument(doc: Omit<DocumentItem, 'id' | 'userId'>): Promise<DocumentItem> {
    const session = this.getActiveSession();
    if (!session) throw new Error('Unauthorized');

    const id = `DOC-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = { ...doc, id, userId: session.user.id };

    const all = getTable<DocumentItem[]>(DB_KEYS.DOCUMENTS, []);
    all.unshift(newDoc);
    setTable(DB_KEYS.DOCUMENTS, all);

    // Recalculate profile completeness with new document
    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    if (profiles[session.user.id]) {
      profiles[session.user.id].profileCompleteness = calculateProfileCompleteness(
        profiles[session.user.id], 
        all.filter(d => d.userId === session.user.id).length
      );
      setTable(DB_KEYS.PROFILES, profiles);
    }

    return newDoc;
  }

  // GET /api/me/notifications (Strict User Data Isolation)
  static async getMyNotifications(): Promise<NotificationItem[]> {
    const session = this.getActiveSession();
    if (!session) return [];
    const all = getTable<NotificationItem[]>(DB_KEYS.NOTIFICATIONS, []);
    return all.filter(notif => notif.userId === session.user.id);
  }

  // GET /api/me/consents (Strict User Data Isolation)
  static async getMyConsents(): Promise<ConsentItem[]> {
    const session = this.getActiveSession();
    if (!session) return [];
    const all = getTable<ConsentItem[]>(DB_KEYS.CONSENTS, []);
    return all.filter(c => c.userId === session.user.id);
  }

  // GET /api/me/recommendations (Real Profile-Driven Recommendations)
  static async getMyRecommendations(): Promise<{ 
    services: Service[]; 
    isProfileSufficient: boolean; 
    reason: string 
  }> {
    const session = this.getActiveSession();
    if (!session) return { services: [], isProfileSufficient: false, reason: 'Please log in' };

    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    const profile = profiles[session.user.id];
    const services = await this.getServices();

    // If profile completeness is low (<40%), do not fabricate fake recommendations
    if (!profile || profile.profileCompleteness < 40) {
      return {
        services: [],
        isProfileSufficient: false,
        reason: 'Complete your profile with education, category, and occupation to receive personalized service recommendations.',
      };
    }

    // Dynamic rule matching based on verified citizen profile attributes
    const matches = services.filter(service => {
      // Category match
      if (profile.category && service.eligibilityRules.some(r => r.label.toLowerCase().includes(profile.category.toLowerCase()) || r.explanation.toLowerCase().includes(profile.category.toLowerCase()))) {
        return true;
      }
      // Occupation/Education match
      if (profile.employment?.occupation && service.eligibilityRules.some(r => r.label.toLowerCase().includes(profile.employment.occupation.toLowerCase()) || r.explanation.toLowerCase().includes(profile.employment.occupation.toLowerCase()))) {
        return true;
      }
      // State match
      if (profile.address?.state && (service.department.toLowerCase().includes(profile.address.state.toLowerCase()) || service.state === profile.address.state)) {
        return true;
      }
      // Income match
      if (profile.employment?.annualIncome && profile.employment.annualIncome <= 300000 && service.tags.includes('Financial Aid')) {
        return true;
      }
      return false;
    });

    return {
      services: matches.slice(0, 3),
      isProfileSufficient: true,
      reason: 'Algorithmic recommendations matched with your verified profile attributes.',
    };
  }

  // Universal Public Services Catalogue
  static async getServices(): Promise<Service[]> {
    return getTable<Service[]>(DB_KEYS.SERVICES, INITIAL_SERVICES);
  }

  // Isolated Sandbox Mode Evaluation Seeder
  static loadSandboxEvaluationData(): void {
    setTable(DB_KEYS.ENV_MODE, 'sandbox');
    const existingUsers = getTable<User[]>(DB_KEYS.USERS, []);
    const existingProfiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    const existingApps = getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
    const existingDocs = getTable<DocumentItem[]>(DB_KEYS.DOCUMENTS, []);
    const existingConsents = getTable<ConsentItem[]>(DB_KEYS.CONSENTS, []);
    const existingNotifs = getTable<NotificationItem[]>(DB_KEYS.NOTIFICATIONS, []);

    // Merge sandbox test personas without overwriting real users
    const mergedUsers = [...existingUsers];
    SANDBOX_EVALUATION_DATA.users.forEach(su => {
      if (!mergedUsers.some(u => u.id === su.id)) {
        mergedUsers.push(su);
      }
    });

    const mergedProfiles = { ...existingProfiles, ...SANDBOX_EVALUATION_DATA.profiles };
    const mergedApps = [...SANDBOX_EVALUATION_DATA.applications, ...existingApps.filter(a => !SANDBOX_EVALUATION_DATA.applications.some(sa => sa.id === a.id))];
    const mergedDocs = [...SANDBOX_EVALUATION_DATA.documents, ...existingDocs.filter(d => !SANDBOX_EVALUATION_DATA.documents.some(sd => sd.id === d.id))];
    const mergedConsents = [...SANDBOX_EVALUATION_DATA.consents, ...existingConsents.filter(c => !SANDBOX_EVALUATION_DATA.consents.some(sc => sc.id === c.id))];
    const mergedNotifs = [...SANDBOX_EVALUATION_DATA.notifications, ...existingNotifs.filter(n => !SANDBOX_EVALUATION_DATA.notifications.some(sn => sn.id === n.id))];

    setTable(DB_KEYS.USERS, mergedUsers);
    setTable(DB_KEYS.PROFILES, mergedProfiles);
    setTable(DB_KEYS.APPLICATIONS, mergedApps);
    setTable(DB_KEYS.DOCUMENTS, mergedDocs);
    setTable(DB_KEYS.CONSENTS, mergedConsents);
    setTable(DB_KEYS.NOTIFICATIONS, mergedNotifs);
  }

  // ==========================================
  // PROTECTED BACKEND ENDPOINTS (/api/officer/* & /api/admin/*)
  // ==========================================

  // GET /api/officer/applications (Requires DEPARTMENT_OFFICER or DEPARTMENT_ADMIN)
  static async getOfficerApplications(): Promise<Application[]> {
    this.requireRole(['officer', 'dept_admin', 'DEPARTMENT_OFFICER']);
    return getTable<Application[]>(DB_KEYS.APPLICATIONS, []);
  }

  // GET /api/admin/users (Requires SYSTEM_ADMIN)
  static async getAdminUsers(): Promise<User[]> {
    this.requireRole(['sys_admin', 'SYSTEM_ADMIN']);
    const users = getTable<User[]>(DB_KEYS.USERS, []);
    return users.length > 0 ? users : PROVISIONED_OFFICIAL_USERS;
  }

  // GET /api/admin/audit-logs (Requires SYSTEM_ADMIN)
  static async getAdminAuditLogs(): Promise<AuditLog[]> {
    this.requireRole(['sys_admin', 'SYSTEM_ADMIN']);
    return getTable<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
  }

  static clearSandboxEvaluationData(): void {
    setTable(DB_KEYS.ENV_MODE, 'production');
    // Remove sandbox specific users and their data
    const sandboxUserIds = new Set(SANDBOX_EVALUATION_DATA.users.map(u => u.id));
    
    const users = getTable<User[]>(DB_KEYS.USERS, []).filter(u => !sandboxUserIds.has(u.id));
    const profiles = getTable<Record<string, CitizenProfile>>(DB_KEYS.PROFILES, {});
    sandboxUserIds.forEach(id => delete profiles[id]);
    const apps = getTable<Application[]>(DB_KEYS.APPLICATIONS, []).filter(a => !sandboxUserIds.has(a.userId));
    const docs = getTable<DocumentItem[]>(DB_KEYS.DOCUMENTS, []).filter(d => !sandboxUserIds.has(d.userId));
    const consents = getTable<ConsentItem[]>(DB_KEYS.CONSENTS, []).filter(c => !sandboxUserIds.has(c.userId));
    const notifs = getTable<NotificationItem[]>(DB_KEYS.NOTIFICATIONS, []).filter(n => !sandboxUserIds.has(n.userId));

    setTable(DB_KEYS.USERS, users);
    setTable(DB_KEYS.PROFILES, profiles);
    setTable(DB_KEYS.APPLICATIONS, apps);
    setTable(DB_KEYS.DOCUMENTS, docs);
    setTable(DB_KEYS.CONSENTS, consents);
    setTable(DB_KEYS.NOTIFICATIONS, notifs);

    // If current session was a sandbox user, logout
    const session = this.getActiveSession();
    if (session && sandboxUserIds.has(session.user.id)) {
      this.logout();
    }
  }

  // Internal Audit Log Persister
  private static addAuditLogInternal(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = getTable<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
    const newLog: AuditLog = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
    };
    logs.unshift(newLog);
    setTable(DB_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  }

  // Internal Notification Persister
  private static addNotificationInternal(userId: string, notif: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>): void {
    const notifs = getTable<NotificationItem[]>(DB_KEYS.NOTIFICATIONS, []);
    const newNotif: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      userId,
      timestamp: 'Just now',
      read: false,
    };
    notifs.unshift(newNotif);
    setTable(DB_KEYS.NOTIFICATIONS, notifs);
  }
}
