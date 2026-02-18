export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  TENANT: 'TENANT',
}

export const ALL_ROLES = Object.values(ROLES)
export const REGISTRATION_ROLES = [ROLES.OWNER, ROLES.TENANT]
