import { AppRole, Capability } from '../types/security';

export const ROLE_CAPABILITIES: Record<AppRole, Capability[]> = {
  private_user: [
    'view_public_site',
    'search_catalogue',
    'browse_explore',
    'access_private_features',
    'manage_own_profile',
    'manage_own_watchlist'
  ],
  corporate_user: [
    'view_public_site',
    'search_catalogue',
    'browse_explore',
    'access_private_features',
    'manage_own_profile',
    'manage_own_watchlist',
    'manage_own_corporate_profile',
    'access_corporate_features'
  ],
  editor: [
    'view_public_site',
    'search_catalogue',
    'browse_explore',
    'access_private_features',
    'manage_own_profile',
    'manage_own_watchlist',
    'access_editorial',
    'edit_content',
    'review_content',
    'manage_media',
    'review_data_assertions',
    'review_import_results',
    'access_import_lab'
  ],
  super_admin: [
    'view_public_site',
    'search_catalogue',
    'browse_explore',
    'access_private_features',
    'manage_own_profile',
    'manage_own_watchlist',
    'manage_own_corporate_profile',
    'access_corporate_features',
    'access_editorial',
    'edit_content',
    'review_content',
    'manage_media',
    'review_data_assertions',
    'review_import_results',
    'access_import_lab',
    'access_admin',
    'manage_users',
    'manage_roles',
    'manage_capabilities',
    'manage_system_configuration',
    'manage_editorial_access',
    'view_security_status',
    'view_as_role'
  ]
};

export const hasCapability = (role: AppRole | null | undefined, capability: Capability): boolean => {
  if (!role) return false;
  return ROLE_CAPABILITIES[role]?.includes(capability) || false;
};
