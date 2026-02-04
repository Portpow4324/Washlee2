# Delivery Address Fields - Quick Reference

## Essential Address Fields

| Field | Description | Example | Data Field |
|-------|-------------|---------|------------|
| **Address Line 1** | Street address | 123 Main Street | `deliveryAddressLine1` |
| **Address Line 2** | Unit/Apartment | Apt 10, Unit 4B | `deliveryAddressLine2` |
| **City/Suburb** | City or suburb | Sydney | `deliveryCity` |
| **State/Province** | State code | NSW | `deliveryState` |
| **Postcode/ZIP** | Postal code | 2000 | `deliveryPostcode` |
| **Country** | Country name | Australia | `deliveryCountry` |

## Data Flow

```
Step 4: Delivery Options
├─ Google Places Address Input
│  └─ User selects from suggestions
├─ Auto-fill address components
│  └─ Street, City, State, Postcode populate automatically
├─ Optional unit/apartment field
│  └─ User can add apartment number
└─ Delivery notes field
   └─ User can add special instructions

                    ↓

Step 5: Review
├─ Display formatted address string
└─ Display individual components
   ├─ Street Address
   ├─ Unit/Apartment (if provided)
   ├─ City/Suburb
   ├─ State
   ├─ Postcode
   └─ Country

                    ↓

Order Submission
├─ All address components sent to backend
├─ Coordinates available (lat/lng)
└─ Ready for delivery logistics
```

## BookingData Structure

```typescript
bookingData = {
  // ... other fields ...
  
  // Address Fields (populated from Google Places + user input)
  deliveryAddress: string                    // Formatted full address
  deliveryAddressDetails: AddressParts | null // Google Places raw data
  
  // Essential Address Components
  deliveryAddressLine1: string              // Street address
  deliveryAddressLine2: string              // Unit/Apartment (optional)
  deliveryCity: string                      // Suburb/City
  deliveryState: string                     // State code (NSW, VIC, etc.)
  deliveryPostcode: string                  // 4-digit postcode
  deliveryCountry: string                   // Country (default: Australia)
  
  // Notes
  deliveryNotes: string                     // Special delivery instructions
}
```

## Step 4: Input Fields

### Address Input (Auto-populated)
```
┌─ Delivery Address ──────────────────────────┐
│ 🔍 123 Main Street, Sydney NSW 2000, Australia ✓ │
│                                            │
│ Address details:                          │
│ Street: 123 Main Street                   │
│ Suburb: Sydney                            │
│ State: NSW                                │
│ Postcode: 2000                            │
│ Coordinates: -33.8688, 151.2093           │
│                                            │
│ Unit/Apartment (Optional)                 │
│ ┌─────────────────────────────────────┐   │
│ │ Apt 10                              │   │
│ └─────────────────────────────────────┘   │
│                                            │
│ Delivery Notes (Optional)                 │
│ ┌─────────────────────────────────────┐   │
│ │ Leave in front porch, gate code...  │   │
│ └─────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

## Step 5: Review Display

```
┌─ Delivery Address ──────────────────────────┐
│                                            │
│ Street Address                             │
│ 123 Main Street                            │
│                                            │
│ Unit/Apartment                             │
│ Apt 10                                     │
│                                            │
│ City/Suburb        │ State                │
│ Sydney             │ NSW                  │
│                                            │
│ Postcode           │ Country              │
│ 2000               │ Australia            │
│                                            │
└────────────────────────────────────────────┘
```

## Integration Points

### Google Places API
- **Input**: User types address
- **Process**: Auto-complete and Google Places Details API
- **Output**: Address components (street, suburb, state, postcode, lat/lng)

### Booking State
- **Receive**: Address components from Google Places
- **Store**: In individual `deliveryAddressLine1`, `deliveryCity`, etc. fields
- **Use**: Display in Step 5 review and send to backend

### Backend API (Ready)
- **Receive**: All address fields in order submission
- **Process**: Store in database
- **Use**: 
  - Display in admin panel
  - Send to delivery service
  - Use coordinates for mapping
  - Validate delivery zone

## Example Order Data

```json
{
  "deliveryAddress": "123 Main Street, Sydney NSW 2000, Australia",
  "deliveryAddressLine1": "123 Main Street",
  "deliveryAddressLine2": "Apt 10",
  "deliveryCity": "Sydney",
  "deliveryState": "NSW",
  "deliveryPostcode": "2000",
  "deliveryCountry": "Australia",
  "deliveryNotes": "Leave in front porch",
  "deliveryAddressDetails": {
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

## Validation

✅ **Address Line 1**: Required (must have street address)
✅ **Address Line 2**: Optional (unit/apartment)
✅ **City/Suburb**: Required (auto-populated from Google)
✅ **State**: Required (auto-populated from Google)
✅ **Postcode**: Required (auto-populated from Google)
✅ **Country**: Required (defaults to Australia)

## Benefits of This Structure

| Benefit | Description |
|---------|------------|
| **Flexibility** | Can use formatted address OR individual components |
| **Data Integrity** | Each field validated independently |
| **Logistics** | Backend can parse state/postcode for routing |
| **Mapping** | Coordinates available for delivery tracking |
| **Display** | Clean presentation in review and order confirmation |
| **Scalability** | Easy to extend with additional fields if needed |

## Testing Checklist

- [ ] Address input shows autocomplete suggestions
- [ ] Selecting address auto-populates all fields
- [ ] Unit/apartment field accepts user input
- [ ] Step 5 review displays all address components correctly
- [ ] Address displays with proper formatting and layout
- [ ] Delivery notes appear in review
- [ ] All fields contain expected data
- [ ] Coordinates are captured (lat/lng)

---

**Status**: ✅ Implementation Complete | **Date**: January 30, 2026
