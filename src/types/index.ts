export type CycleCode = 'CO' | 'HUMANITES';

export interface Cycle {
  id: string;
  code: CycleCode;
  name: string;
  description: string;
  duration: number; // 2 or 4
  isActive: boolean;
  createdAt: string;
}

export interface Level {
  id: string;
  cycleId: string;
  name: string; // "7ème", "8ème", "1ère", "2ème", "3ème", "4ème"
  levelOrder: number;
  isTerminal: boolean; // 4ème = true for BAC
  isActive: boolean;
  createdAt: string;
}

export interface Option {
  id: string;
  code: string; // COM, PED, SCI, LIT, TECH
  name: string; // Commerciale et Gestion, Pédagogique, Scientifique, etc.
  description: string;
  isActive: boolean;
  subjects: string[];
  createdAt: string;
}

export interface Promotion {
  id: string;
  academicYearId: string;
  levelId: string;
  optionId?: string | null; // NULL for C.O
  name: string; // "7ème 2026-2027" or "4ème Commerciale 2026-2027"
  code: string; // "7-2026" or "4-COM-2026"
  isActive: boolean;
  createdAt: string;
}

export interface AcademicClass {
  id: string;
  promotionId: string;
  name: string; // "A", "B", "C"
  fullName: string; // "4ème Commerciale et Gestion A"
  capacity: number;
  currentEnrollment?: number;
  teacherId?: string; // Titulaire
  teacherName?: string;
  roomId?: string; // Salle assignée
  roomName?: string;
  isActive: boolean;
  createdAt: string;
}

export type RoomType = 'COURSE' | 'EXAM' | 'LAB' | 'OFFICE' | 'CONFERENCE' | 'OTHER';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLOSED';

export interface Room {
  id: string;
  code: string; // e.g., "SAL-012", "SAL-008", "LAB-015"
  name: string; // "Salle 12", "Salle de conférence"
  building: string; // "Bloc A", "Bâtiment Principal"
  floor: string; // "Rez-de-chaussée", "1er étage", "2ème étage"
  capacity: number;
  roomType: RoomType;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasComputers: boolean;
  hasAirConditioning?: boolean;
  hasWifi?: boolean;
  equipment?: string[];
  status: RoomStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomReservation {
  id: string;
  roomId: string;
  dayOfWeek: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  date?: string; // specific date if one-off
  startTime: string; // "08:00"
  endTime: string; // "10:00"
  classId?: string;
  className: string; // "7ème A", "4ème Commerciale A"
  subject: string; // "Mathématiques", "Comptabilité"
  teacherName: string; // "Prof. KABEYA"
  type: 'COURSE' | 'EXAM' | 'MEETING' | 'EVENT';
  notes?: string;
}

export type EnrollmentStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DROPPED_OUT' | 'GRADUATED';
export type AssignmentDecision = 'NEW_ENROLLMENT' | 'PASSAGE' | 'REDOUBLEMENT' | 'TRANSFERT' | 'SUSPENSION' | 'OTHER';

export interface Enrollment {
  id: string;
  studentId: string;
  academicYear: string; // "2026-2027"
  enrollmentDate: string;
  registrationNumber: string;
  status: EnrollmentStatus;
  statusChangedAt?: string;
  enrolledBy: string;
  validatedBy?: string;
  validatedAt?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassAssignment {
  id: string;
  enrollmentId: string;
  classId: string;
  className: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  decision: AssignmentDecision;
  decisionReason?: string;
  approvedBy: string;
  approvedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  photoUrl?: string;
  avatarUrl?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Student {
  id: string;
  personId: string;
  matricule: string; // "LIS-2023-0123"
  currentClassId: string;
  currentClassName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';
  enrollmentYear: string;
  person?: Person;
  name?: string;
  gender?: 'M' | 'F';
  birthDate?: string;
  birthPlace?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  personId?: string;
  matricule: string; // "ENS-LIS-001"
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  specialty: string; // e.g. "Mathématiques & Sciences", "Comptabilité & Gestion"
  qualification: string; // e.g. "Licencié en Sciences Commerciales", "Agrégé ISP"
  contractType: 'PERMANENT' | 'TEMPORAIRE' | 'VACATAIRE';
  baseSalaryUSD: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'SUSPENDED';
  assignedClasses: string[];
  assignedSubjects: string[];
  hireDate: string;
  photoUrl?: string;
  address?: string;
}

export interface Parent {
  id: string;
  personId?: string;
  matricule?: string; // "PAR-2023-001"
  firstName: string;
  lastName: string;
  fullName: string;
  relationship: 'PERE' | 'MERE' | 'TUTEUR_LEGAL' | 'AUTRE';
  phone: string;
  email: string;
  profession: string;
  address: string;
  linkedStudentIds: string[];
  emergencyContact: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface ParentChildPermissions {
  canViewGrades: boolean;
  canViewAttendance: boolean;
  canViewPayments: boolean;
  canReceiveNotifications: boolean;
  canMessageTeachers: boolean;
  canUpdateProfile: boolean;
}

export interface ParentChildLink {
  id: string;
  parentAccountId: string;
  studentId: string;
  relationship: 'PERE' | 'MERE' | 'TUTEUR_LEGAL' | 'AUTRE';
  isPrimary: boolean;
  isEmergencyContact: boolean;
  priorityOrder: number;
  permissions: ParentChildPermissions;
}

export interface ParentAccount {
  id: string;
  userId: string;
  personId: string;
  isActive: boolean;
}

export type UserStatus = 'PENDING' | 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'DELETED';
export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN';
export type AdminSubRole = 'SUPER_ADMIN' | 'ADMIN_ACADEMIC' | 'ADMIN_FINANCE' | 'ADMIN_USERS' | 'ADMIN_ADMISSIONS' | 'ADMIN_SYSTEM';

export interface UserSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserAccount {
  id: string;
  personId: string;
  personName?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  adminSubRole?: AdminSubRole;
  status: UserStatus;
  studentId?: string;
  teacherId?: string;
  parentAccountId?: string;
  lastLogin?: string;
  lastLoginAt?: string;
  temporaryPassword?: string;
  passwordHash?: string;
  mustChangePassword?: boolean;
  twoFactorEnabled?: boolean;
  invitationSentAt?: string;
  suspensionDaysRemaining?: number;
  suspensionReason?: string;
  sessions?: UserSession[];
  createdAt: string;
  updatedAt: string;
}

export type AdmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ENROLLED';

export interface AdmissionDocument {
  id: string;
  name: string;
  fileName: string;
  status: 'VALID' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
  uploadedAt: string;
}

export interface AdministrativeValidation {
  documentsChecked: boolean;
  paymentsChecked: boolean;
  classCapacityChecked: boolean;
  assignedClassId?: string;
  assignedClassName?: string;
  decisionNotes?: string;
  validatedBy?: string;
  validatedAt?: string;
  isReadyForEnrollment: boolean;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // "ADM-2026-0089"
  candidateFirstName: string;
  candidateLastName: string;
  candidateGender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  targetLevel: string; // "7ème" or "1ère"
  targetOption?: string; // "Commerciale et Gestion"
  previousSchool?: string;
  previousAverage?: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelationship: string;
  status: AdmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documents: AdmissionDocument[];
  adminValidation: AdministrativeValidation;
  generatedMatricule?: string;
}

export interface SubjectGrade {
  id: string;
  studentId: string;
  subjectName: string;
  trimester: 1 | 2 | 3;
  academicYear: string;
  interro: number; // score normalized or raw
  interroMax?: number; // e.g. 10 or 20
  tp: number;
  tpMax?: number; // e.g. 10 or 20
  exam: number;
  examMax?: number; // e.g. 20, 50, 100
  coefficient: number;
  average: number; // calculated /20
  teacherName: string;
  teacherComment?: string;
  isRepechageNeeded?: boolean;
  repechageGrade?: number;
  repechageDate?: string;
  repechageStatus?: 'PENDING' | 'PASSED' | 'FAILED';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  classId: string;
  className: string;
  date: string;
  timeSlot: string;
  courseName: string;
  status: 'PRESENT' | 'ABSENT_JUSTIFIED' | 'ABSENT_UNJUSTIFIED' | 'LATE';
  justification?: string;
  recordedBy: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  academicYear: string;
  trimester: 1 | 2 | 3;
  title: string;
  amountDue: number; // in USD
  amountDueCDF?: number;
  amountPaid: number;
  amountPaidCDF?: number;
  balanceRemaining: number;
  amountCDF?: number;
  currency: 'USD' | 'CDF';
  exchangeRateApplied?: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  dueDate?: string;
  paidDate?: string;
  paymentDate?: string;
  receiptNumber?: string;
  paymentMethod?: string;
  payerPhone?: string;
  payerPhoneNumber?: string;
  transactionRef?: string;
  notes?: string;
}

export interface TeacherCourseAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  courseCode?: string;
  courseName?: string;
  subjectName?: string;
  classId: string;
  className: string;
  promotionName?: string;
  weeklyHours: number;
  coefficient?: number;
  academicYear?: string;
  isTitulaire?: boolean;
}

export interface ScheduleSlot {
  id: string;
  cycleType: 'HUMANITES' | 'CO'; // HUMANITES: 07:30-12:15, CO: 12:30-17:15
  dayOfWeek: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  periodNumber: number; // 1 to 6
  periodName?: string;
  startTime: string; // "07:30", "08:15", etc.
  endTime: string; // "08:15", "09:00", etc.
  classId: string;
  className: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  courseName?: string;
  subject?: string;
  teacherName: string;
  isBreak?: boolean;
}

export interface PromotionFeeSchedule {
  id: string;
  promotionId?: string;
  promotionName: string;
  academicYear?: string;
  cycle?: 'CO' | 'HUMANITES';
  amountUSD?: number;
  amountCDF?: number;
  annualTuitionUSD?: number;
  annualTuitionCDF?: number;
  registrationFeeUSD?: number;
  examFeeUSD?: number;
  firstTrimesterUSD?: number;
  secondTrimesterUSD?: number;
  thirdTrimesterUSD?: number;
  updatedAt?: string;
}

export interface DisciplineSanction {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  academicYear?: string;
  sanctionType?: 'WARNING' | 'TEMPORARY_EXCLUSION' | 'PERMANENT_EXPULSION' | 'DETENTION';
  type?: string;
  severity?: string;
  daysCount?: number;
  durationDays?: number;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  effectiveUntil?: string;
  returnDate?: string;
  status?: 'ACTIVE' | 'RESOLVED' | 'APPEALED';
  isResolved?: boolean;
  parentNotified?: boolean;
}

export interface AcademicHistoryYear {
  academicYear: string;
  className: string;
  levelName: string;
  optionName?: string;
  decision: AssignmentDecision;
  finalAverage: number;
  rank?: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface SchoolSettings {
  id: string;
  name: string;
  shortName: string;
  motto: string;
  city: string;
  province: string;
  country: string;
  address: string;
  phoneNumber: string;
  supportWhatsApp: string;
  supportFacebook: string;
  email: string;
  officialExchangeRate: number; // e.g. 2850 CDF / 1 USD
  academicYear: string; // e.g. "2026-2027"
  logoUrl: string;
  sealUrl?: string;
  currency: 'USD' | 'CDF';
}

export interface FaceVerificationResult {
  isValidFace: boolean;
  isHuman: boolean;
  isSinglePerson: boolean;
  isAppropriate: boolean;
  confidenceScore: number;
  message: string;
  details?: {
    lighting: 'GOOD' | 'POOR' | 'ACCEPTABLE';
    framing: 'GOOD' | 'OFF_CENTER' | 'TOO_FAR' | 'TOO_CLOSE';
    expression: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  performedByName?: string;
  performedByRole?: string;
  targetEntity?: string;
  targetId?: string;
  ipAddress?: string;
}
