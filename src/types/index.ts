export type UserRole = 'citizen' | 'officer' | 'dept_admin' | 'sys_admin' | 'DEPARTMENT_OFFICER' | 'SYSTEM_ADMIN';

export type AuthAccountType = 'citizen' | 'officer' | 'sys_admin';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'ur';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  personaTitle?: string;
  password?: string;
  passwordHash?: string;
  isActive?: boolean;
  officialId?: string;
  departmentId?: string;
  department?: string;
  departmentAccess?: string;
  designation?: string;
}

export type ServiceCategory = 
  | 'Identity & Certificates'
  | 'Education'
  | 'Employment'
  | 'Healthcare'
  | 'Agriculture'
  | 'Housing'
  | 'Financial Assistance'
  | 'Business & MSME'
  | 'Transport'
  | 'Social Welfare'
  | 'Land & Property'
  | 'Municipal Services'
  | 'Grievance & Citizen Services';

export interface CitizenProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  aadhaarMasked: string;
  pan: string;
  dob: string;
  gender: 'Female' | 'Male' | 'Other';
  address: {
    line1: string;
    district: string;
    state: string;
    pincode: string;
  };
  education: {
    level: string;
    institution: string;
    passingYear: string;
  };
  employment: {
    status: string;
    occupation: string;
    annualIncome: number;
  };
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  profileCompleteness: number;
}

export interface EligibilityRule {
  id: string;
  field: string;
  label: string;
  type: 'number' | 'select' | 'boolean';
  options?: string[];
  min?: number;
  max?: number;
  requiredValue?: string | number | boolean;
  explanation: string;
}

export type IntegrationStatus = 
  | 'Live Integration'
  | 'Sandbox'
  | 'Demo Integration'
  | 'External Official Service'
  | 'Coming Soon';

export interface Department {
  id: string;
  name: string;
  ministry?: string;
  level: 'Central' | 'State' | 'District' | 'Municipal' | 'Agency';
  serviceCount: number;
  categories: ServiceCategory[];
  description: string;
  services: string[];
  applicationMethod: 'Direct Digital Orchestration' | 'API Assisted' | 'Official Portal Routing';
  integrationStatus: IntegrationStatus;
  languages: string[];
  officialSource: string;
  jurisdiction: string;
}

export interface GrievanceRecord {
  id: string;
  userId?: string;
  citizenName: string;
  contactEmail: string;
  contactPhone: string;
  department: string;
  category: string;
  subject: string;
  description: string;
  status: 'Submitted' | 'Under Investigation' | 'Action Taken' | 'Resolved' | 'Escalated';
  submittedAt: string;
  updatedAt: string;
  trackingNumber: string;
  attachedDocs?: string[];
  officerRemarks?: string;
}

export interface ServiceWithdrawalPolicy {
  allowed: boolean;
  allowedStatuses: ApplicationStatus[];
  reasonRequired: boolean;
  reasonOptions: string[];
  warningMessage?: string;
  allowRestoration: boolean;
  notifyDepartment: boolean;
}

export interface Service {
  id: string;
  name: string;
  department: string;
  ministry?: string;
  category: ServiceCategory;
  level: 'Central' | 'State' | 'Local';
  state: string;
  description: string;
  eligibilitySummary: string;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: string[];
  workflowStages: string[];
  expectedTimeline: string;
  fee: string;
  officialSource: string;
  lastVerified: string;
  tags: string[];
  lifeEvents: string[];
  isOnline: boolean;
  languages: string[];
  matchScore?: number;
  applicationMethod?: 'Direct Digital Orchestration' | 'API Assisted' | 'Official Portal Routing';
  integrationStatus?: IntegrationStatus;
  withdrawalPolicy?: ServiceWithdrawalPolicy;
}

export type DocumentStatus = 'verified' | 'expiring_soon' | 'missing' | 'verification_pending';

export interface DocumentItem {
  id: string;
  userId: string;
  name: string;
  type: string;
  status: DocumentStatus;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  docNumberMasked?: string;
  fileUrl?: string;
  source: 'digilocker' | 'manual_upload' | 'api_setu';
  notes?: string;
}

export interface ConsentItem {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  department: string;
  requestedData: string[];
  purpose: string;
  status: 'active' | 'denied' | 'pending';
  grantedAt?: string;
  expiresAt?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted' 
  | 'under_verification' 
  | 'department_review' 
  | 'under_review'
  | 'approved' 
  | 'rejected' 
  | 'completed'
  | 'withdrawn';

export interface WorkflowStepState {
  name: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
  note?: string;
}

export interface Application {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  department: string;
  category: ServiceCategory;
  applicantName: string;
  submittedAt: string;
  updatedAt: string;
  currentStage: string;
  status: ApplicationStatus;
  priority: 'Normal' | 'Urgent' | 'High';
  stages: WorkflowStepState[];
  formData: Record<string, any>;
  attachedDocuments: string[];
  officerNotes?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  withdrawalRemarks?: string;
  previousStatus?: ApplicationStatus;
}

export interface AuditLog {
  id: string;
  userId?: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  service: string;
  applicationId?: string;
  result: 'Success' | 'Warning' | 'Manual Review' | 'Error';
  details: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  status: 'connected' | 'sandbox' | 'not_configured';
  health: 'Operational' | 'Degraded' | 'Offline';
  latency: number;
  lastSync: string;
  totalRequests: number;
  errorRate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  optional?: boolean;
  hasConsented: boolean;
}

export interface AccessibilitySettings {
  textScale: 'sm' | 'base' | 'lg';
  highContrast: boolean;
  reduceMotion: boolean;
}
