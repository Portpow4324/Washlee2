/**
 * Twilio SMS Service for Washlee
 * Handles SMS notifications for order updates
 * Uses placeholders until real Twilio API key is added
 * Production: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to env
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'placeholder_account_sid'
const authToken = process.env.TWILIO_AUTH_TOKEN || 'placeholder_auth_token'
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890'

const isProduction = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN

// SMS Templates
const SMS_TEMPLATES = {
  ORDER_CONFIRMATION: (orderId: string, pickupTime: string) =>
    `Washlee: Your order ${orderId} is confirmed! Pickup: ${pickupTime}. Reply HELP for support.`,
  
  ORDER_PICKUP_SOON: (proName: string, eta: string) =>
    `Washlee: ${proName} is on the way! ETA: ${eta}. Track live: https://washlee.app/tracking`,
  
  DRIVER_LOCATION_UPDATE: (distance: string, eta: string) =>
    `Washlee: Your Pro is ${distance} away! ETA: ${eta}. See live location in app.`,
  
  ORDER_PICKED_UP: (orderId: string) =>
    `Washlee: Your order ${orderId} has been picked up! Check back soon for updates.`,
  
  ORDER_WASHING: (orderId: string) =>
    `Washlee: Your order ${orderId} is being washed with care. Delivery tomorrow.`,
  
  ORDER_READY_DELIVERY: (orderId: string, eta: string) =>
    `Washlee: Your order ${orderId} is ready! Delivery ${eta}. Track live on app.`,
  
  ORDER_OUT_FOR_DELIVERY: (proName: string, eta: string) =>
    `Washlee: ${proName} is delivering your order! ETA: ${eta}. See live location.`,
  
  ORDER_DELIVERED: (orderId: string) =>
    `Washlee: Your order ${orderId} has been delivered! Rate your experience in the app.`,
  
  DELIVERY_FEEDBACK_REQUEST: (orderId: string) =>
    `Washlee: How was your experience? Rate order ${orderId} in the app to earn points!`,
  
  LOYALTY_POINTS_EARNED: (points: number, total: number) =>
    `Washlee: You earned ${points} points! Total: ${total} points. Redeem rewards in the app.`,
}

// Send SMS function
export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    if (!isProduction) {
      console.warn(`[Twilio] SMS would be sent to ${phoneNumber}: "${message}"`)
      return true // Pretend it was sent for development
    }

    // In production, make API call to Twilio
    // For now, just log (actual Twilio client would be used here)
    console.log(`[Twilio] SMS sent to ${phoneNumber}. Message: "${message}"`)
    return true
  } catch (error: any) {
    console.error(`[Twilio] Failed to send SMS to ${phoneNumber}:`, error.message)
    return false
  }
}

// Send SMS by template
export async function sendSMSTemplate(
  phoneNumber: string,
  templateName: keyof typeof SMS_TEMPLATES,
  ...args: any[]
): Promise<boolean> {
  if (!SMS_TEMPLATES[templateName]) {
    console.error(`[Twilio] Template not found: ${templateName}`)
    return false
  }

  const template = SMS_TEMPLATES[templateName] as any
  const message = template(...args)
  return sendSMS(phoneNumber, message)
}

// Send SMS to user
export async function sendSMSToUser(userId: string, templateName: keyof typeof SMS_TEMPLATES, ...args: any[]): Promise<boolean> {
  try {
    // Get user phone from Firebase
    // This is a placeholder - you'd fetch from your database
    console.log(`[Twilio] Would send SMS to user ${userId} with template ${templateName}`)
    return true
  } catch (error) {
    console.error(`[Twilio] Failed to send SMS to user ${userId}:`, error)
    return false
  }
}

export default {
  sendSMS,
  sendSMSTemplate,
  sendSMSToUser,
  SMS_TEMPLATES,
}
