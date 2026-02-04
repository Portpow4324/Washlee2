#!/usr/bin/env node

require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })
const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, query, where, writeBatch } = require('firebase/firestore')

// Initialize Firebase with config from env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!firebaseConfig.projectId) {
  console.error('❌ Missing Firebase configuration in .env.local')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Generate unique 6-digit employee ID
 */
async function generateUniqueEmployeeId() {
  let employeeId = ''
  let isUnique = false

  while (!isUnique) {
    employeeId = String(Math.floor(Math.random() * 900000) + 100000)
    const q = query(collection(db, 'employees'), where('employeeId', '==', employeeId))
    const snapshot = await getDocs(q)
    isUnique = snapshot.empty
  }

  return employeeId
}

/**
 * Generate employee IDs for all employees without one
 */
async function generateEmployeeIds() {
  console.log('🚀 Starting employee ID generation...\n')

  try {
    // Get all employees
    console.log('📊 Fetching employees from Firestore...')
    const q = collection(db, 'employees')
    const snapshot = await getDocs(q)
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    console.log(`✅ Found ${employees.length} employees\n`)

    // Filter employees without employeeId
    const needsId = employees.filter((emp) => !emp.employeeId)
    console.log(`👥 Employees needing ID: ${needsId.length}\n`)

    if (needsId.length === 0) {
      console.log('✨ All employees already have IDs!')
      process.exit(0)
    }

    // Generate IDs and prepare batch update
    console.log('🔄 Generating unique IDs...')
    const batch = writeBatch(db)
    const generatedIds = []

    for (const employee of needsId) {
      const newId = await generateUniqueEmployeeId()
      generatedIds.push({ uid: employee.id, employeeId: newId, email: employee.email })

      const docRef = require('firebase/firestore').doc(db, 'employees', employee.id)
      batch.update(docRef, { employeeId: newId })

      console.log(`  ✓ ${employee.email}: ${newId}`)
    }

    // Commit batch
    console.log('\n📤 Updating Firestore...')
    await batch.commit()

    console.log('\n✨ Done! Generated employee IDs:\n')
    console.table(generatedIds)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

generateEmployeeIds()
