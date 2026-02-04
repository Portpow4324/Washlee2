import { NextRequest, NextResponse } from 'next/server'
import { sendSMS } from '@/lib/twilio'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, message } = body

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: 'Phone number and message required' }, { status: 400 })
    }

    const success = await sendSMS(phoneNumber, message)

    return NextResponse.json({
      success,
      message: success ? 'SMS sent successfully' : 'Failed to send SMS',
    })
  } catch (error: any) {
    console.error('SMS send error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
