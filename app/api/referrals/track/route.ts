import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { referralId, status, reward } = data

    if (!referralId) {
      return NextResponse.json({ error: 'Missing referralId' }, { status: 400 })
    }

    if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update referral status
    const referralRef = adminDb.collection('referrals').doc(referralId)
    const referralDoc = await referralRef.get()

    if (!referralDoc.exists) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
    }

    const referralData = referralDoc.data()
    const previousStatus = referralData?.status

    // Update referral
    await referralRef.update({
      status,
      reward: reward || 0,
      updatedAt: new Date(),
    })

    // If completed, add reward to referrer's account
    if (status === 'completed' && previousStatus !== 'completed') {
      const referrerId = referralData?.referrerId
      if (referrerId) {
        const rewardAmount = reward || 10
        const referrerRef = adminDb.collection('users').doc(referrerId)
        await referrerRef.update({
          referralEarnings: (referralData?.referralEarnings || 0) + rewardAmount,
          totalRewards: (referralData?.totalRewards || 0) + rewardAmount,
        })

        console.log(`[REWARD] $${rewardAmount} added to referrer ${referrerId}`)
      }
    }

    // If cancelled, remove pending reward
    if (status === 'cancelled' && previousStatus === 'pending') {
      console.log(`[REFERRAL] Referral ${referralId} cancelled`)
    }

    return NextResponse.json({
      success: true,
      referralId,
      newStatus: status,
      message: 'Referral status updated successfully',
    })
  } catch (error) {
    console.error('Error updating referral:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const referralId = request.nextUrl.searchParams.get('referralId')

    if (!referralId) {
      return NextResponse.json({ error: 'Missing referralId' }, { status: 400 })
    }

    const referralDoc = await adminDb.collection('referrals').doc(referralId).get()

    if (!referralDoc.exists) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 })
    }

    const referralData = referralDoc.data()

    return NextResponse.json({
      id: referralDoc.id,
      ...referralData,
      createdAt: referralData?.createdAt?.toDate?.(),
      updatedAt: referralData?.updatedAt?.toDate?.(),
    })
  } catch (error) {
    console.error('Error fetching referral:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
