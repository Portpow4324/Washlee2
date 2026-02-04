// Google Places API utilities for address validation and parsing
// Documentation: https://developers.google.com/maps/documentation/places/web-service/overview

export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface AddressParts {
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

/**
 * Validate address using Google Places API Autocomplete
 * Returns predictions with detailed address information
 */
export async function getAddressPredictions(input: string): Promise<any[]> {
  if (!input || input.length < 3) return []

  try {
    const response = await fetch('/api/places/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    if (!response.ok) throw new Error('Failed to fetch predictions')
    const data = await response.json()
    return data.predictions || []
  } catch (error) {
    console.error('Error fetching address predictions:', error)
    return []
  }
}

/**
 * Get detailed address information from Google Places API
 * Returns parsed address components
 */
export async function getAddressDetails(placeId: string): Promise<AddressParts | null> {
  try {
    const response = await fetch('/api/places/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId }),
    })

    if (!response.ok) throw new Error('Failed to fetch address details')
    const data = await response.json()
    return data.addressParts || null
  } catch (error) {
    console.error('Error fetching address details:', error)
    return null
  }
}

/**
 * Parse address components from Google Places response
 */
export function parseAddressComponents(components: AddressComponent[]): Partial<AddressParts> {
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
      parsed.state = component.short_name // Returns state code like NSW, VIC
    }
    if (component.types.includes('postal_code')) {
      parsed.postcode = component.long_name
    }
    if (component.types.includes('country')) {
      parsed.country = component.long_name
    }
  })

  // Combine street number and name
  if (parsed.streetNumber && parsed.streetName) {
    parsed.streetAddress = `${parsed.streetNumber} ${parsed.streetName}`
  } else if (parsed.streetName) {
    parsed.streetAddress = parsed.streetName
  }

  return parsed
}

/**
 * Validate if address is in Australia
 */
export function isAustralianAddress(addressParts: Partial<AddressParts>): boolean {
  return addressParts.country?.toLowerCase() === 'australia' ||
         ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].includes(addressParts.state || '')
}

/**
 * Format address parts into readable format
 */
export function formatAddressParts(parts: Partial<AddressParts>): string {
  const components = [
    parts.streetAddress,
    parts.suburb,
    parts.state && `${parts.state} ${parts.postcode}`,
  ].filter(Boolean)

  return components.join(', ')
}
