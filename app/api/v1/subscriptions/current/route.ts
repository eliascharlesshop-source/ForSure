import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { apiResponse, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = withAuth(async (_request: NextRequest, { user }) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: user.id,
        status: 'ACTIVE',
      },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        tier: true,
        status: true,
        starts_at: true,
        expires_at: true,
      },
    })

    if (!subscription) {
      return apiResponse({ tier: 'FREE', status: 'NONE' })
    }

    return apiResponse(subscription)
  } catch (error: unknown) {
    console.error('Get subscription error:', error)
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
