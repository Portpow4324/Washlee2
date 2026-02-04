'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, AlertCircle, CheckCircle, X, Home } from 'lucide-react'
import { getAddressPredictions, getAddressDetails, AddressParts, isAustralianAddress } from '@/lib/googlePlaces'

interface AddressInputProps {
  value: string
  onChange: (address: string, details?: AddressParts) => void
  placeholder?: string
  className?: string
}

export default function AddressInput({
  value,
  onChange,
  placeholder = '123 Main St, Sydney NSW 2000',
  className = '',
}: AddressInputProps) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<AddressParts | null>(null)
  const [validationStatus, setValidationStatus] = useState<'empty' | 'valid' | 'invalid'>('empty')
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch predictions as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!value || value.length < 3) {
        setPredictions([])
        setShowPredictions(false)
        setValidationStatus('empty')
        return
      }

      setIsLoading(true)
      try {
        const results = await getAddressPredictions(value)
        setPredictions(results)
        setShowPredictions(true)
        setValidationStatus('invalid')
        setErrorMessage('Select an address from the suggestions below')
      } catch (error) {
        console.error('Error fetching predictions:', error)
        setPredictions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  // Handle prediction selection
  const handleSelectPrediction = async (prediction: any) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const addressDetails = await getAddressDetails(prediction.placeId)

      if (!addressDetails) {
        setErrorMessage('Could not fetch address details. Please try again.')
        setValidationStatus('invalid')
        setIsLoading(false)
        return
      }

      // Verify it's Australian
      if (!isAustralianAddress(addressDetails)) {
        setErrorMessage('Only Australian addresses are supported')
        setValidationStatus('invalid')
        setIsLoading(false)
        return
      }

      // Format the address nicely
      const formattedAddress = [
        addressDetails.streetAddress,
        addressDetails.suburb,
        addressDetails.state && `${addressDetails.state} ${addressDetails.postcode}`,
      ].filter(Boolean).join(', ')

      setSelectedAddress(addressDetails)
      onChange(formattedAddress, addressDetails)
      setValidationStatus('valid')
      setPredictions([])
      setShowPredictions(false)
    } catch (error) {
      console.error('Error selecting address:', error)
      setErrorMessage('Failed to validate address. Please try again.')
      setValidationStatus('invalid')
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative">
        {/* Input Field */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value && predictions.length > 0 && setShowPredictions(true)}
            placeholder={placeholder}
            className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
              validationStatus === 'valid'
                ? 'border-green-500 focus:ring-green-500'
                : validationStatus === 'invalid' && value
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray focus:ring-primary'
            } ${className}`}
          />

          {/* Validation Icons */}
          {validationStatus === 'valid' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle size={20} className="text-green-500" />
            </div>
          )}
          {validationStatus === 'invalid' && value && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle size={20} className="text-red-500" />
            </div>
          )}
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}

          {/* Clear Button */}
          {value && !isLoading && (
            <button
              onClick={() => {
                onChange('')
                setSelectedAddress(null)
                setValidationStatus('empty')
                setErrorMessage('')
                setPredictions([])
                inputRef.current?.focus()
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray hover:text-dark transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Predictions Dropdown */}
        {showPredictions && predictions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {predictions.map((prediction, index) => (
              <button
                key={index}
                onClick={() => handleSelectPrediction(prediction)}
                className="w-full text-left px-4 py-3 hover:bg-light transition border-b border-gray/20 last:border-b-0 flex items-start gap-3"
              >
                <Home size={16} className="text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark truncate">{prediction.mainText}</p>
                  <p className="text-sm text-gray truncate">{prediction.secondaryText}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Address Details Breakdown */}
      {selectedAddress && validationStatus === 'valid' && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm font-semibold text-green-700">Address verified</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {selectedAddress.streetAddress && (
              <div>
                <p className="text-gray text-xs font-semibold uppercase">Street Address</p>
                <p className="text-dark font-medium">{selectedAddress.streetAddress}</p>
              </div>
            )}
            {selectedAddress.suburb && (
              <div>
                <p className="text-gray text-xs font-semibold uppercase">Suburb / City</p>
                <p className="text-dark font-medium">{selectedAddress.suburb}</p>
              </div>
            )}
            {selectedAddress.state && (
              <div>
                <p className="text-gray text-xs font-semibold uppercase">State</p>
                <p className="text-dark font-medium">{selectedAddress.state}</p>
              </div>
            )}
            {selectedAddress.postcode && (
              <div>
                <p className="text-gray text-xs font-semibold uppercase">Postcode</p>
                <p className="text-dark font-medium">{selectedAddress.postcode}</p>
              </div>
            )}
            {selectedAddress.latitude && selectedAddress.longitude && (
              <div>
                <p className="text-gray text-xs font-semibold uppercase">Coordinates</p>
                <p className="text-dark font-medium text-xs">
                  {selectedAddress.latitude.toFixed(4)}, {selectedAddress.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unit/Apartment Field */}
      {selectedAddress && validationStatus === 'valid' && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-dark mb-2">
            Unit/Apartment Number (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Unit 4B, Apt 201, Suite 300"
            className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => {
              if (selectedAddress && e.target.value) {
                const updatedAddress = `${e.target.value}, ${selectedAddress.streetAddress}, ${selectedAddress.suburb} ${selectedAddress.state} ${selectedAddress.postcode}`
                onChange(updatedAddress, selectedAddress)
              }
            }}
          />
        </div>
      )}

      {/* Error Messages */}
      {validationStatus === 'invalid' && errorMessage && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      {/* Helper Text */}
      {!selectedAddress && (
        <p className="mt-1 text-xs text-gray">
          Start typing your address and select from the suggestions
        </p>
      )}
    </div>
  )
}
