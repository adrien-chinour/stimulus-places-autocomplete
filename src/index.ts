import { Controller } from 'stimulus'

interface Address {
  street_number: string
  route: string
  locality: string
  administrative_area_level_2: string
  administrative_area_level_1: string
  country: string
  postal_code: string
}

export default class extends Controller {
  autocomplete: google.maps.places.Autocomplete
  place: google.maps.places.PlaceResult

  addressTarget: HTMLInputElement
  streetNumberTarget: HTMLInputElement
  routeTarget: HTMLInputElement
  cityTarget: HTMLInputElement
  countyTarget: HTMLInputElement
  stateTarget: HTMLInputElement
  countryTarget: HTMLInputElement
  postalCodeTarget: HTMLInputElement

  hasStreetNumberTarget: boolean
  hasRouteTarget: boolean
  hasCityTarget: boolean
  hasCountryTarget: boolean
  hasCountyTarget: boolean
  hasPostalCodeTarget: boolean
  hasStateTarget: boolean

  static targets = ['address', 'city', 'streetNumber', 'route', 'postalCode', 'country', 'county', 'state']

  initialize (): void {
    this.placeChanged = this.placeChanged.bind(this)
  }

  connect (): void {
    if (typeof google !== 'undefined') {
      this.initAutocomplete()
    }
  }

  initAutocomplete (): void {
    this.autocomplete = new google.maps.places.Autocomplete(this.addressTarget, this.autocompleteOptions)

    google.maps.event.addDomListener(this.addressTarget, 'keydown', (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.preventDefault()
      }
    })

    this.autocomplete.addListener('place_changed', this.placeChanged)
  }

  placeChanged (): void {
    this.place = this.autocomplete.getPlace()
    const addressComponents: google.maps.GeocoderAddressComponent[] = this.place.address_components

    if (addressComponents !== undefined) {
      const formattedAddress = this.formatAddressComponents(addressComponents) as Address

      this.setAddressComponents(formattedAddress)
    }
  }

  setAddressComponents (address: Address): void {
    if (this.hasStreetNumberTarget) this.streetNumberTarget.value = address.street_number
    if (this.hasRouteTarget) this.routeTarget.value = address.route
    if (this.hasCityTarget) this.cityTarget.value = address.locality
    if (this.hasCountyTarget) this.countyTarget.value = address.administrative_area_level_2
    if (this.hasStateTarget) this.stateTarget.value = address.administrative_area_level_1
    if (this.hasCountryTarget) this.countryTarget.value = address.country
    if (this.hasPostalCodeTarget) this.postalCodeTarget.value = address.postal_code
  }

  get autocompleteOptions (): google.maps.places.AutocompleteOptions {
    return {
      fields: ['address_components']
    }
  }

  private formatAddressComponents (addressComponents: google.maps.GeocoderAddressComponent[]): Address {
    const data = {}

    addressComponents.forEach((component: google.maps.GeocoderAddressComponent) => {
      const type = component.types[0]

      data[type] = component.long_name
    })

    return data as Address
  }
}