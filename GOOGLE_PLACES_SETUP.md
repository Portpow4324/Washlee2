# Google Places Address Validation Setup Guide

## Overview
The booking page now includes production-grade address validation using Google Places API. This guide walks you through the setup process.

## What Was Implemented

### New Files Created:
1. **`/lib/googlePlaces.ts`** - Utility functions for Google Places API
2. **`/app/api/places/autocomplete/route.ts`** - Server-side autocomplete endpoint
3. **`/app/api/places/details/route.ts`** - Server-side address details endpoint
4. **`/components/AddressInput.tsx`** - React address input component with autocomplete

### Files Modified:
1. **`/app/booking/page.tsx`** - Integrated AddressInput component in Step 4

## Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable these APIs:
   - **Places API**
   - **Geocoding API** (for latitude/longitude parsing)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the generated API key

## Step 2: Add Environment Variable

Add the following to your `.env.local` file:

```bash
# Google Places API Key (for server-side address validation)
GOOGLE_PLACES_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

### Security Note:
- The API key is stored server-side (in `.env.local`), NOT exposed to the client
- API calls are made through Next.js API routes (`/api/places/*`)
- This protects your API key from being exposed in browser DevTools

## Step 3: Test the Integration

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the booking page:**
   - Go to `http://localhost:3000/booking`
   - Scroll to Step 4 (Delivery Options)

3. **Test address input:**
   - Click on the "Enter delivery address" field
   - Start typing an Australian address (e.g., "123 Main St, Sydney")
   - You should see autocomplete suggestions appearing
   - Select an address from the dropdown
   - The component should display parsed address details (street, suburb, state, postcode)

## How It Works

### Address Validation Flow:

```
User Types Address
       ↓
   AddressInput Component (300ms debounce)
       ↓
   /api/places/autocomplete (Server-side)
       ↓
   Google Places Autocomplete API (Australian region)
       ↓
   Display Predictions to User
       ↓
   User Selects Address
       ↓
   /api/places/details (Server-side)
       ↓
   Google Places Details API + Address Component Parsing
       ↓
   Return Formatted Address with:
      - Street address
      - Suburb/City
      - State (NSW, VIC, QLD, etc.)
      - Postcode
      - Latitude/Longitude coordinates
       ↓
   Store in bookingData.deliveryAddressDetails
```

## Component Features

### AddressInput Component Props:
- `value: string` - Current address text
- `onChange: (address: string, details: AddressParts | null) => void` - Callback with address and parsed components
- `placeholder: string` - Input placeholder text
- `className: string` - Additional CSS classes

### Address Validation:
- ✅ Real-time predictions with 300ms debounce
- ✅ Green checkmark when valid address is selected
- ✅ Red X icon when input doesn't match any address
- ✅ Australian addresses only (enforced at API level)
- ✅ Automatic unit/apartment number field for multi-unit buildings

### AddressParts Structure:
```typescript
interface AddressParts {
  streetAddress: string;    // e.g., "123 Main Street"
  suburb: string;            // e.g., "Sydney"
  state: string;             // e.g., "NSW"
  postcode: string;          // e.g., "2000"
  country: string;           // e.g., "Australia"
  formattedAddress: string;  // Full formatted address
  latitude: number;          // Geocoded latitude
  longitude: number;         // Geocoded longitude
  placeId: string;           // Google Places ID
}
```

## Booking Page Integration

### Step 4 (Delivery Options):
- The delivery address input now uses `AddressInput` component
- Validation requires `deliveryAddressDetails` to be populated (not just text)
- User cannot proceed to Step 5 until a valid Australian address is selected

### State Management:
```typescript
bookingData.deliveryAddress      // Raw address text
bookingData.deliveryAddressDetails // Parsed address components
```

Both are stored and sent with the order submission.

## Testing Checklist

- [ ] Environment variable is set in `.env.local`
- [ ] Dev server starts without errors: `npm run build` shows no Google Places related errors
- [ ] Booking page loads (Step 4 visible)
- [ ] Address input shows autocomplete dropdown when typing
- [ ] Can select an address from dropdown
- [ ] Address details display correctly
- [ ] Validation icon shows green checkmark for valid address
- [ ] Step 4 validation passes and can proceed to Step 5
- [ ] Order submission includes address details

## API Endpoints

### POST `/api/places/autocomplete`
Gets address predictions for a partial address input.

**Request:**
```json
{
  "input": "123 Main St, Sydney"
}
```

**Response:**
```json
{
  "predictions": [
    {
      "placeId": "ChIJN1blFLsCEWQRCNr4...",
      "mainText": "123 Main Street",
      "secondaryText": "Sydney, NSW, Australia",
      "description": "123 Main Street, Sydney NSW 2000, Australia"
    }
  ]
}
```

### POST `/api/places/details`
Gets parsed address components for a selected place.

**Request:**
```json
{
  "placeId": "ChIJN1blFLsCEWQRCNr4..."
}
```

**Response:**
```json
{
  "addressParts": {
    "streetAddress": "123 Main Street",
    "suburb": "Sydney",
    "state": "NSW",
    "postcode": "2000",
    "country": "Australia",
    "formattedAddress": "123 Main Street, Sydney NSW 2000, Australia",
    "latitude": -33.8688,
    "longitude": 151.2093,
    "placeId": "ChIJN1blFLsCEWQRCNr4..."
  }
}
```

## Troubleshooting

### API Key Issues:
- **401 Unauthorized**: API key is missing or invalid
  - Check `.env.local` has correct key
  - Verify key is enabled in Google Cloud Console
  - Check that Places API is enabled

- **403 Forbidden**: API key doesn't have required permissions
  - Enable "Places API" in Google Cloud Console
  - Wait 5 minutes for changes to propagate

### No Predictions Appearing:
- Check browser console for errors
- Verify API key is set in `.env.local`
- Try a common Australian address like "123 Main St, Sydney NSW"
- Check that server is running

### Address Details Not Parsing:
- Ensure selected address is in Australia
- Check that Geocoding API is enabled in Google Cloud Console
- Non-Australian addresses are rejected

## Production Deployment

When deploying to production:

1. **Set Environment Variable:**
   - Add `GOOGLE_PLACES_API_KEY` to your hosting platform's environment variables
   - Do NOT commit `.env.local` to git

2. **Restrict API Key (Recommended):**
   - In Google Cloud Console → Credentials → API Key → Edit
   - Set restrictions to:
     - **Application restriction**: HTTP referrers
     - **API restriction**: Places API
     - **Referrer restrictions**: Your domain only (e.g., `www.washlee.com`, `api.washlee.com`)

3. **Monitor Usage:**
   - Google Cloud Console → Billing
   - Set up alerts for unusual API usage

## Cost Considerations

Google Places API is a paid service. Pricing is based on:
- **Autocomplete (per request)**: ~$0.007 - $0.017
- **Place Details (per request)**: ~$0.007 - $0.017

Monitor your usage in Google Cloud Console to manage costs.

## Next Steps

1. ✅ Set `GOOGLE_PLACES_API_KEY` in `.env.local`
2. ✅ Test the booking flow
3. ⏳ Consider adding address display in Step 5 (Review & Confirm)
4. ⏳ Update order submission API to handle address components
5. ⏳ Test order creation with address details

---

**Last Updated**: January 18, 2026
**Status**: Ready for Testing
