import { NextRequest, NextResponse } from 'next/server'
import { sendToDevice } from '@/lib/fcm'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const { fcmToken, title, body, data, icon, image } = requestBody

    if (!fcmToken || !title || !body) {
      return NextResponse.json(
        { error: 'FCM token, title, and body are required' },
        { status: 400 }
      )
    }

    const success = await sendToDevice(fcmToken, {
      title,
      body,
      data,
      icon,
      image,
    })

    return NextResponse.json({
      success,
      message: success ? 'Notification sent' : 'Failed to send notification',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
