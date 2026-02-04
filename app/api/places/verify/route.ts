import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address || address.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide an address to verify' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY is not configured')
      return NextResponse.json(
        { success: false, message: 'Address verification service is not available' },
        { status: 500 }
      )
    }

    console.log('Verifying address:', address)

    // Step 1: Use Autocomplete to get predictions
    // This gives us a place_id that we can use for details
    const autoCompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      address
    )}&key=${GOOGLE_PLACES_API_KEY}&language=en&region=au&components=country:au`

    console.log('Calling Google Places Autocomplete API...')
    const autoCompleteResponse = await fetch(autoCompleteUrl)

    if (!autoCompleteResponse.ok) {
      throw new Error(`Google Places Autocomplete API error: ${autoCompleteResponse.statusText}`)
    }

    const autoCompleteData = await autoCompleteResponse.json()
    console.log('Autocomplete API response status:', autoCompleteData.status)

    if (autoCompleteData.status === 'ZERO_RESULTS' || !autoCompleteData.predictions || autoCompleteData.predictions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Address not found. Please check the address and try again.' },
        { status: 400 }
      )
    }

    if (autoCompleteData.status !== 'OK') {
      console.error('Autocomplete API error:', autoCompleteData.status, autoCompleteData)
      return NextResponse.json(
        { success: false, message: `Address verification failed: ${autoCompleteData.status}. Please check your address and try again.` },
        { status: 400 }
      )
    }

    // Get the first (best) prediction
    const prediction = autoCompleteData.predictions[0]
    const placeId = prediction.place_id

    console.log('Found prediction:', prediction.description, 'Place ID:', placeId)

    // Step 2: Get place details using the place_id
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,geometry,formatted_address&key=${GOOGLE_PLACES_API_KEY}`

    console.log('Getting place details...')
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (detailsData.status !== 'OK') {
      console.warn('Could not get full place details, using autocomplete result')
      // Fallback: use the autocomplete prediction
      return NextResponse.json({
        success: true,
        message: 'Address verified successfully',
        formattedAddress: prediction.description,
        details: {
          streetAddress: address.split(',')[0].trim(),
          suburb: '',
          state: '',
          postcode: '',
          country: 'Australia',
        },
      })
    }

    const addressComponents = detailsData.result?.address_components || []
    const formattedAddress = detailsData.result?.formatted_address || prediction.description

    // Parse address components
    let streetNumber = ''
    let streetName = ''
    let suburb = ''
    let state = ''
    let postcode = ''
    let country = ''

    addressComponents.forEach((component: any) => {
      const types = component.types
      if (types.includes('street_number')) {
        streetNumber = component.long_name
      }
      if (types.includes('route')) {
        streetName = component.long_name
      }
      if (types.includes('locality')) {
        suburb = component.long_name
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.short_name // e.g., NSW, VIC
      }
      if (types.includes('postal_code')) {
        postcode = component.long_name
      }
      if (types.includes('country')) {
        country = component.long_name
      }
    })

    const streetAddress = `${streetNumber} ${streetName}`.trim() || address.split(',')[0].trim()

    console.log('Extracted components:', { streetAddress, suburb, state, postcode, country })

    // Verify it's an Australian address
    if (country.toLowerCase() !== 'australia' && !formattedAddress.includes('Australia')) {
      return NextResponse.json(
        { success: false, message: 'Only Australian addresses are accepted. Please enter an address in Australia.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address verified successfully',
      formattedAddress,
      details: {
        streetAddress,
        suburb: suburb || '',
        state: state || '',
        postcode: postcode || '',
        country: 'Australia',
      },
    })
  } catch (error) {
    console.error('Address verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Error verifying address. Please try again.' },
      { status: 500 }
    )
  }
}
