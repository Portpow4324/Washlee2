import admin from 'firebase-admin'
import { getSecondaryAdmin } from './firebaseAdmin'

const FCM_TOPICS = {
  ALL_USERS: 'all_users',
  CUSTOMERS: 'customers',
  PROS: 'pros',
  PROMO_USERS: 'promo_users',
}

interface PushNotification {
  title: string
  body: string
  data?: Record<string, string>
  icon?: string
  image?: string
}

// Send notification to single device
export async function sendToDevice(fcmToken: string, notification: PushNotification): Promise<boolean> {
  try {
    const adminApp = getSecondaryAdmin()
    const messaging = adminApp.messaging()

    const message = {
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      webpush: {
        notification: {
          icon: notification.icon || '/icon-192x192.png',
          image: notification.image,
        },
      },
      android: {
        notification: {
          icon: 'ic_launcher',
          image: notification.image,
        },
      },
    }

    const messageId = await messaging.send(message as any)
    console.log(`[FCM] Notification sent to device. Message ID: ${messageId}`)
    return true
  } catch (error: any) {
    console.error(`[FCM] Failed to send notification:`, error.message)
    return false
  }
}

// Send notification to topic
export async function sendToTopic(topic: string, notification: PushNotification): Promise<boolean> {
  try {
    const adminApp = getSecondaryAdmin()
    const messaging = adminApp.messaging()

    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
    }

    const messageId = await messaging.send(message as any)
    console.log(`[FCM] Notification sent to topic: ${topic}. Message ID: ${messageId}`)
    return true
  } catch (error: any) {
    console.error(`[FCM] Failed to send to topic:`, error.message)
    return false
  }
}

// Subscribe user to topic
export async function subscribeToTopic(fcmTokens: string[], topic: string): Promise<boolean> {
  try {
    const adminApp = getSecondaryAdmin()
    const messaging = adminApp.messaging()

    await messaging.subscribeToTopic(fcmTokens, topic)
    console.log(`[FCM] Subscribed ${fcmTokens.length} devices to topic: ${topic}`)
    return true
  } catch (error: any) {
    console.error(`[FCM] Failed to subscribe to topic:`, error.message)
    return false
  }
}

// Unsubscribe from topic
export async function unsubscribeFromTopic(fcmTokens: string[], topic: string): Promise<boolean> {
  try {
    const adminApp = getSecondaryAdmin()
    const messaging = adminApp.messaging()

    await messaging.unsubscribeFromTopic(fcmTokens, topic)
    console.log(`[FCM] Unsubscribed ${fcmTokens.length} devices from topic: ${topic}`)
    return true
  } catch (error: any) {
    console.error(`[FCM] Failed to unsubscribe from topic:`, error.message)
    return false
  }
}

// Broadcast to all users
export async function broadcastNotification(notification: PushNotification): Promise<boolean> {
  return sendToTopic(FCM_TOPICS.ALL_USERS, notification)
}

// Send promo to all customers
export async function sendPromoToCustomers(notification: PushNotification): Promise<boolean> {
  return sendToTopic(FCM_TOPICS.CUSTOMERS, notification)
}

// Send job alert to all pros
export async function sendJobAlertToPros(notification: PushNotification): Promise<boolean> {
  return sendToTopic(FCM_TOPICS.PROS, notification)
}

export { FCM_TOPICS }
export default {
  sendToDevice,
  sendToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
  broadcastNotification,
  sendPromoToCustomers,
  sendJobAlertToPros,
  FCM_TOPICS,
}
