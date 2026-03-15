import { NextAuthOptions } from 'next-auth'
import { Auth } from '@auth/core'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import OktaProvider from 'next-auth/providers/okta'
import SAMLProvider from 'next-auth/providers/saml'
import { logger } from '@/lib/logger'
import { DatabaseService } from '@/lib/database-service'
import { SecurityService } from '@/lib/security-service'
import { AuditService } from '@/lib/audit-service'

export interface EnterpriseUser {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
  department?: string
  managerId?: string
  lastLogin?: Date
  mfaEnabled: boolean
  ssoProvider?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  LEAD = 'lead',
  DEVELOPER = 'developer',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

export enum Permission {
  // User Management
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  USER_ROLES = 'user:roles',
  
  // System Administration
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_AUDIT = 'system:audit',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_MONITORING = 'system:monitoring',
  
  // Data Access
  DATA_READ = 'data:read',
  DATA_WRITE = 'data:write',
  DATA_EXPORT = 'data:export',
  DATA_IMPORT = 'data:import',
  
  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',
  ANALYTICS_ADVANCED = 'analytics:advanced',
  
  // Billing
  BILLING_READ = 'billing:read',
  BILLING_WRITE = 'billing:write',
  BILLING_APPROVE = 'billing:approve',
  
  // Security
  SECURITY_MANAGE = 'security:manage',
  SECURITY_AUDIT = 'security:audit',
  SECURITY_POLICIES = 'security:policies'
}

export interface RolePermissions {
  [UserRole]: Permission[]
}

export const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.USER_READ, Permission.USER_WRITE, Permission.USER_DELETE,
    Permission.SYSTEM_CONFIG, Permission.SYSTEM_AUDIT,
    Permission.DATA_READ, Permission.DATA_WRITE,
    Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT,
    Permission.BILLING_READ, Permission.BILLING_WRITE,
    Permission.SECURITY_MANAGE
  ],
  [UserRole.MANAGER]: [
    Permission.USER_READ, Permission.USER_WRITE,
    Permission.DATA_READ, Permission.DATA_WRITE,
    Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT,
    Permission.BILLING_READ
  ],
  [UserRole.LEAD]: [
    Permission.USER_READ,
    Permission.DATA_READ, Permission.DATA_WRITE,
    Permission.ANALYTICS_VIEW
  ],
  [UserRole.DEVELOPER]: [
    Permission.DATA_READ, Permission.DATA_WRITE,
    Permission.ANALYTICS_VIEW
  ],
  [UserRole.ANALYST]: [
    Permission.DATA_READ,
    Permission.ANALYTICS_VIEW
  ],
  [UserRole.VIEWER]: [
    Permission.DATA_READ
  ]
}

export class AuthenticationService {
  private dbService: DatabaseService
  private securityService: SecurityService
  private auditService: AuditService

  constructor() {
    this.dbService = new DatabaseService()
    this.securityService = new SecurityService()
    this.auditService = new AuditService()
  }

  async authenticateUser(credentials: {
    email: string
    password: string
    mfaToken?: string
    ssoToken?: string
  }): Promise<{ user: EnterpriseUser; session: any }> {
    const startTime = Date.now()
    
    try {
      let user: EnterpriseUser | null = null

      // SSO Authentication
      if (credentials.ssoToken) {
        user = await this.authenticateSSO(credentials.ssoToken)
      }
      // Standard Email/Password Authentication
      else {
        user = await this.authenticateEmailPassword(credentials.email, credentials.password)
      }

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // MFA Verification
      if (user.mfaEnabled && !credentials.mfaToken) {
        const mfaChallenge = await this.generateMFAChallenge(user.id)
        logger.info('MFA challenge generated', { userId: user.id }, 'AuthenticationService')
        return {
          user,
          session: { requiresMFA: true, mfaChallenge }
        }
      }

      if (user.mfaEnabled && credentials.mfaToken) {
        const isValid = await this.verifyMFAToken(user.id, credentials.mfaToken)
        if (!isValid) {
          throw new Error('Invalid MFA token')
        }
      }

      // Update last login
      await this.updateLastLogin(user.id)
      
      // Log successful authentication
      await this.auditService.log({
        action: 'AUTH_SUCCESS',
        userId: user.id,
        email: user.email,
        timestamp: new Date(),
        ipAddress: await this.securityService.getClientIP(),
        userAgent: await this.securityService.getUserAgent(),
        duration: Date.now() - startTime
      })

      logger.info('User authenticated successfully', {
        userId: user.id,
        email: user.email,
        role: user.role,
        method: credentials.ssoToken ? 'SSO' : 'EMAIL_PASSWORD'
      }, 'AuthenticationService')

      return {
        user,
        session: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      }
    } catch (error) {
      logger.error('Authentication failed', error as Error, {
        email: credentials.email,
        timestamp: new Date()
      }, 'AuthenticationService')
      
      await this.auditService.log({
        action: 'AUTH_FAILURE',
        email: credentials.email,
        timestamp: new Date(),
        ipAddress: await this.securityService.getClientIP(),
        userAgent: await this.securityService.getUserAgent(),
        error: (error as Error).message
      })

      throw error
    }
  }

  private async authenticateSSO(ssoToken: string): Promise<EnterpriseUser | null> {
    try {
      // Verify SSO token with provider
      const payload = await this.securityService.verifySSOToken(ssoToken)
      if (!payload) {
        return null
      }

      // Find or create user
      let user = await this.dbService.findUserByEmail(payload.email)
      
      if (!user) {
        user = await this.createUserFromSSO(payload)
      } else {
        // Update SSO provider
        user.ssoProvider = payload.provider
        await this.dbService.updateUser(user.id, { ssoProvider: payload.provider })
      }

      return user
    } catch (error) {
      logger.error('SSO authentication failed', error as Error, { ssoToken }, 'AuthenticationService')
      return null
    }
  }

  private async authenticateEmailPassword(email: string, password: string): Promise<EnterpriseUser | null> {
    const user = await this.dbService.findUserByEmail(email)
    if (!user) {
      return null
    }

    const isValidPassword = await this.securityService.verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return null
    }

    return user
  }

  private async createUserFromSSO(payload: any): Promise<EnterpriseUser> {
    const user: Partial<EnterpriseUser> = {
      id: this.generateUserId(),
      email: payload.email,
      name: payload.name,
      role: UserRole.VIEWER, // Default role for SSO users
      permissions: ROLE_PERMISSIONS[UserRole.VIEWER],
      ssoProvider: payload.provider,
      mfaEnabled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await this.dbService.createUser(user as EnterpriseUser)
  }

  async generateMFAChallenge(userId: string): Promise<string> {
    const secret = await this.securityService.generateMFASecret(userId)
    const qrCode = await this.securityService.generateMFAQRCode(secret)
    
    await this.dbService.updateUser(userId, { mfaSecret: secret })
    
    logger.info('MFA challenge generated', { userId }, 'AuthenticationService')
    return qrCode
  }

  async verifyMFAToken(userId: string, token: string): Promise<boolean> {
    const user = await this.dbService.findUserById(userId)
    if (!user || !user.mfaSecret) {
      return false
    }

    return await this.securityService.verifyMFAToken(user.mfaSecret, token)
  }

  async enableMFA(userId: string, token: string): Promise<boolean> {
    const user = await this.dbService.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await this.verifyMFAToken(userId, token)
    if (!isValid) {
      throw new Error('Invalid MFA token')
    }

    await this.dbService.updateUser(userId, { mfaEnabled: true })
    
    await this.auditService.log({
      action: 'MFA_ENABLED',
      userId,
      timestamp: new Date()
    })

    logger.info('MFA enabled for user', { userId }, 'AuthenticationService')
    return true
  }

  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.dbService.findUserById(userId)
    if (!user || !user.isActive) {
      return false
    }

    return user.permissions.includes(permission)
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const user = await this.dbService.findUserById(userId)
    if (!user || !user.isActive) {
      return false
    }

    return user.role === role
  }

  async updateUserRole(userId: string, newRole: UserRole, updatedBy: string): Promise<void> {
    const user = await this.dbService.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Check if updater has permission to change roles
    const hasPermission = await this.hasPermission(updatedBy, Permission.USER_ROLES)
    if (!hasPermission) {
      throw new Error('Insufficient permissions to change user roles')
    }

    const newPermissions = ROLE_PERMISSIONS[newRole]
    await this.dbService.updateUser(userId, { 
      role: newRole, 
      permissions: newPermissions,
      updatedAt: new Date()
    })

    await this.auditService.log({
      action: 'ROLE_CHANGED',
      userId,
      updatedBy,
      oldRole: user.role,
      newRole,
      timestamp: new Date()
    })

    logger.info('User role updated', {
      userId,
      oldRole: user.role,
      newRole,
      updatedBy
    }, 'AuthenticationService')
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await this.dbService.updateUser(userId, { 
      lastLogin: new Date(),
      updatedAt: new Date()
    })
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.dbService.revokeSession(sessionId)
    
    await this.auditService.log({
      action: 'SESSION_REVOKED',
      sessionId,
      timestamp: new Date()
    })

    logger.info('Session revoked', { sessionId }, 'AuthenticationService')
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.dbService.revokeAllUserSessions(userId)
    
    await this.auditService.log({
      action: 'ALL_SESSIONS_REVOKED',
      userId,
      timestamp: new Date()
    })

    logger.info('All user sessions revoked', { userId }, 'AuthenticationService')
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: process.env.OKTA_ISSUER!,
    }),
    SAMLProvider({
      id: 'saml',
      name: 'SAML',
      options: {
        idp: process.env.SAML_IDP!,
        issuer: process.env.SAML_ISSUER!,
        privateKey: process.env.SAML_PRIVATE_KEY!,
        cert: process.env.SAML_CERT!,
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authService = new AuthenticationService()
        const enterpriseUser = await authService.dbService.findUserById(user.id!)
        if (enterpriseUser) {
          token.role = enterpriseUser.role
          token.permissions = enterpriseUser.permissions
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          role: token.role,
          permissions: token.permissions
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
    encryption: true
  }
}

export default AuthenticationService
