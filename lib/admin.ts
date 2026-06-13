export const ADMIN_EMAIL = 'muhammadjonnematov1303@gmail.com'

export function isAdminEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL
}
