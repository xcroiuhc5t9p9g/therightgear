export type AppRole = 'private_user' | 'corporate_user' | 'editor' | 'super_admin';
export type PreviewRole = 'visitor' | AppRole | null;

export type Capability = 
  // Public (implicitly available to visitor, but listed here for logged-in explicit checks if needed)
  | 'view_public_site'
  | 'search_catalogue'
  | 'browse_explore'
  // Private
  | 'access_private_features'
  | 'manage_own_profile'
  | 'manage_own_watchlist'
  // Corporate
  | 'manage_own_corporate_profile'
  | 'access_corporate_features'
  // Editor
  | 'access_editorial'
  | 'edit_content'
  | 'review_content'
  | 'manage_media'
  | 'review_data_assertions'
  | 'review_import_results'
  | 'access_import_lab'
  // Admin
  | 'access_admin'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_capabilities'
  | 'manage_system_configuration'
  | 'manage_editorial_access'
  | 'view_security_status'
  | 'view_as_role';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: AppRole;
  accountStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  verificationStatus?: 'NOT_REQUESTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED'; // for corporate
  
  // Onboarding / Profile Type properties
  profileType?: 'enthusiast' | 'professional' | null;
  country?: string | null;
  companyName?: string | null;
  professionalActivity?: string | null;
  professionalProfileStatus?: 'unverified' | 'verified' | 'rejected' | null;

  createdAt: string;
  updatedAt: string;
  preferences?: Record<string, any>;
}
