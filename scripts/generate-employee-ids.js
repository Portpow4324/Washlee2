/**
 * Script to generate 6-digit employee IDs for existing employees
 * Uses Firestore REST API
 */

require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })
const https = require('https')

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

if (!PROJECT_ID || !API_KEY) {
  console.error('❌ Missing Firebase credentials in .env.local')
  process.exit(1)
}

/**
 * Make HTTPS request to Firestore REST API
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      })
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          })
        }
      })
    })

    req.on('error', reject)

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

/**
 * Get all employees using REST API
 */
async function getAllEmployees() {
  const path = `/v1/projects/${PROJECT_ID}/databases/(default)/documents:query?key=${API_KEY}`
  
  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: 'employees' }],
    },
  }

  const response = await makeRequest('POST', path, queryBody)

  if (response.status !== 200) {
    console.error('Response:', response.data)
    throw new Error(`Failed to fetch employees: ${response.status}`)
  }

  const documents = response.data.document || []
  return documents.map((doc) => ({
    id: doc.name.split('/').pop(),
    data: doc.fields || {},
  }))
}

/**
 * Update employee with new ID
 */
async function updateEmployeeId(docId, employeeId) {
  const path = `/v1/projects/${PROJECT_ID}/databases/(default)/documents/employees/${docId}?key=${API_KEY}`
  
  const updateMask = {
    fieldPaths: ['employeeId'],
  }

  const data = {
    fields: {
      employeeId: { stringValue: employeeId },
      updatedAt: { timestampValue: new Date().toISOString() },
    },
    updateMask: updateMask,
  }

  const response = await makeRequest('PATCH', path, data)
  return response.status === 200
}

/**
 * Generate unique 6-digit ID
 */
function generateEmployeeId(existingIds) {
  let attempts = 0
  while (attempts < 100) {
    const id = String(Math.floor(Math.random() * 900000) + 100000)
    if (!existingIds.has(id)) {
      return id
    }
    attempts++
  }
  throw new Error('Could not generate unique employee ID')
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting employee ID generation...\n')

    console.log('📊 Fetching employees from Firestore...')
    const employees = await getAllEmployees()

    if (employees.length === 0) {
      console.log('✅ No employees found in database.')
      process.exit(0)
    }

    console.log(`Found ${employees.length} employees\n`)

    // Analyze employees
    const existingIds = new Set()
    let withoutIds = []
    let withIds = 0

    employees.forEach((emp) => {
      if (emp.data.employeeId?.stringValue) {
        existingIds.add(emp.data.employeeId.stringValue)
        withIds++
      } else {
        withoutIds.push(emp)
      }
    })

    console.log(
      `📈 Statistics:\n` +
      `   - With employee ID: ${withIds}\n` +
      `   - Without employee ID: ${withoutIds.length}\n`
    )

    if (withoutIds.length === 0) {
      console.log('✅ All employees already have IDs!')
      process.exit(0)
    }

    // Generate IDs
    console.log(`🔄 Generating ${withoutIds.length} IDs...\n`)

    let updated = 0
    let failed = 0

    for (let i = 0; i < withoutIds.length; i++) {
      const emp = withoutIds[i]
      const firstName = emp.data.firstName?.stringValue || ''
      const lastName = emp.data.lastName?.stringValue || ''
      const email = emp.data.email?.stringValue || ''

      try {
        const employeeId = generateEmployeeId(existingIds)
        existingIds.add(employeeId)

        await updateEmployeeId(emp.id, employeeId)

        console.log(
          `✓ ${i + 1}/${withoutIds.length} - ${firstName} ${lastName}: ${employeeId}`
        )
        updated++
      } catch (error) {
        console.log(`✗ ${i + 1}/${withoutIds.length} - ${firstName} ${lastName}: ${error.message}`)
        failed++
      }
    }

    console.log('\n📊 Summary:')
    console.log(`   ✓ Generated: ${updated} IDs`)
    console.log(`   ✗ Failed: ${failed}`)
    console.log(`   Total employees: ${employees.length}\n`)

    console.log('✅ Complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
