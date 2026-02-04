/**
 * Script to generate 6-digit employee IDs for existing employees
 * 
 * Usage: npx ts-node scripts/generate-employee-ids.ts
 * 
 * This script will:
 * 1. Connect to Firebase
 * 2. Fetch all employees from the 'employees' collection
 * 3. For employees without an employeeId, generate a unique 6-digit code
 * 4. Update their records with the new employeeId
 */

import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  })
}

const db = admin.firestore()

/**
 * Generate a unique 6-digit employee ID
 */
async function generateUniqueEmployeeId(
  existingIds: Set<string>
): Promise<string> {
  let employeeId = ''
  let isUnique = false
  let attempts = 0
  const maxAttempts = 100

  while (!isUnique && attempts < maxAttempts) {
    // Generate random 6-digit number (100000-999999)
    employeeId = String(Math.floor(Math.random() * 900000) + 100000)
    isUnique = !existingIds.has(employeeId)
    attempts++
  }

  if (!isUnique) {
    throw new Error('Could not generate unique employee ID after max attempts')
  }

  return employeeId
}

/**
 * Main script to generate employee IDs
 */
async function generateEmployeeIds() {
  try {
    console.log('🚀 Starting employee ID generation script...\n')

    // Fetch all employees
    console.log('📊 Fetching all employees from Firestore...')
    const employeesSnapshot = await db.collection('employees').get()

    if (employeesSnapshot.empty) {
      console.log('✅ No employees found in the database.')
      process.exit(0)
    }

    console.log(`Found ${employeesSnapshot.size} employees\n`)

    // Collect existing employee IDs
    const existingIds = new Set<string>()
    let employeesWithoutIds = 0
    let employeesWithIds = 0

    employeesSnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.employeeId) {
        existingIds.add(data.employeeId)
        employeesWithIds++
      } else {
        employeesWithoutIds++
      }
    })

    console.log(
      `📈 Statistics:\n` +
      `   - Employees WITH employee ID: ${employeesWithIds}\n` +
      `   - Employees WITHOUT employee ID: ${employeesWithoutIds}\n`
    )

    if (employeesWithoutIds === 0) {
      console.log('✅ All employees already have employee IDs!')
      process.exit(0)
    }

    // Generate IDs for employees that don't have them
    console.log(`🔄 Generating employee IDs for ${employeesWithoutIds} employees...\n`)

    let updated = 0
    let skipped = 0
    const batch = db.batch()

    for (const doc of employeesSnapshot.docs) {
      const data = doc.data()

      if (!data.employeeId) {
        try {
          const employeeId = await generateUniqueEmployeeId(existingIds)
          existingIds.add(employeeId)

          // Update the employee document
          batch.update(doc.ref, {
            employeeId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })

          console.log(
            `✓ Generated ID for ${data.firstName} ${data.lastName}: ${employeeId}`
          )
          updated++
        } catch (error) {
          console.error(
            `✗ Failed to generate ID for ${data.firstName} ${data.lastName}:`,
            error
          )
          skipped++
        }
      }
    }

    // Commit batch update
    if (updated > 0) {
      console.log(`\n💾 Saving ${updated} employee IDs to Firestore...`)
      await batch.commit()
      console.log('✅ Batch update completed!\n')
    }

    // Print summary
    console.log('📊 Summary:')
    console.log(`   ✓ Successfully generated: ${updated} IDs`)
    console.log(`   ✗ Skipped: ${skipped}`)
    console.log(`   Total employees: ${employeesSnapshot.size}\n`)

    console.log('✅ Employee ID generation script completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error in employee ID generation script:', error)
    process.exit(1)
  }
}

// Run the script
generateEmployeeIds()
