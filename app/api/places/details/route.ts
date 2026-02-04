import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY

interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface AddressParts {
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  country: string
  formattedAddress: string
  latitude: number
  longitude: number
  placeId: string
}

function parseAddressComponents(components: AddressComponent[]): Partial<AddressParts> {
  const parsed: any = {}

  components.forEach((component) => {
    if (component.types.includes('street_number')) {
      parsed.streetNumber = component.long_name
    }
    if (component.types.includes('route')) {
      parsed.streetName = component.long_name
    }
    if (component.types.includes('locality') || component.types.includes('postal_town')) {
      parsed.suburb = component.long_name
    }
    if (component.types.includes('administrative_area_level_1')) {
      parsed.state = component.short_name
    }
    if (component.types.includes('postal_code')) {
      parsed.postcode = component.long_name
    }
    if (component.types.includes('country')) {
      parsed.country = component.long_name
    }
  })

  if (parsed.streetNumber && parsed.streetName) {
    parsed.streetAddress = `${parsed.streetNumber} ${parsed.streetName}`
  } else if (parsed.streetName) {
    parsed.streetAddress = parsed.streetName
  }

  return parsed
}

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Places API key not configured' },
        { status: 500 }
      )
    }

    // Call Google Places Details API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}&fields=address_component,formatted_address,geometry`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' || !data.result) {
      throw new Error('Place details not found')
    }

    const result = data.result
    const parsedAddress = parseAddressComponents(result.address_components)

    const addressParts: AddressParts = {
      streetAddress: parsedAddress.streetAddress || '',
      suburb: parsedAddress.suburb || '',
      state: parsedAddress.state || '',
      postcode: parsedAddress.postcode || '',
      country: parsedAddress.country || '',
      formattedAddress: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      placeId,
    }

    // Verify it's an Australian address
    if (addressParts.country.toLowerCase() !== 'australia') {
      return NextResponse.json(
        { error: 'Only Australian addresses are supported', addressParts: null },
        { status: 400 }
      )
    }

    return NextResponse.json({ addressParts })
  } catch (error) {
    console.error('Details API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch address details' },
      { status: 500 }
    )
  }
}
