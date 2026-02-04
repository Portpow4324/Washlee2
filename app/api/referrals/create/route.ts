import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { refereeName, refereeEmail, referrerCode } = data

    if (!refereeName || !refereeEmail || !referrerCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find referrer by code
    const usersSnapshot = await adminDb
      .collection('users')
      .where('referralCode', '==', referrerCode)
      .limit(1)
      .get()

    if (usersSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    const referrerId = usersSnapshot.docs[0].id

    // Create referral record
    const referralRef = await adminDb.collection('referrals').add({
      referrerId,
      refereeName,
      refereeEmail,
      referralCode: referrerCode,
      status: 'pending',
      reward: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Send welcome email (placeholder)
    console.log(`[EMAIL] Welcome email sent to ${refereeEmail} with referral code ${referrerCode}`)

    return NextResponse.json({
      success: true,
      referralId: referralRef.id,
      message: 'Referral created successfully',
    })
  } catch (error) {
    console.error('Error creating referral:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const referralsSnapshot = await adminDb
      .collection('referrals')
      .where('referrerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const referrals = referralsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.(),
      updatedAt: doc.data().updatedAt?.toDate?.(),
    }))

    return NextResponse.json({ referrals })
  } catch (error) {
    console.error('Error fetching referrals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
