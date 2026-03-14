import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { apiResponse, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar_url: true,
        bio: true,
        created_at: true,
      },
    })

    if (!profile) {
      return apiError('User not found', 404)
    }

    return apiResponse(profile)
  } catch (error: unknown) {
    console.error('Get user error:', error)
    const err = error as Error & { code?: string }
    if (
      err.code === 'P1001' ||
      err.code === 'P1002' ||
      err.message?.includes('connection')
    ) {
      return apiError('Database unavailable', 503)
    }
    return apiError('Internal server error', 500)
  }
})
