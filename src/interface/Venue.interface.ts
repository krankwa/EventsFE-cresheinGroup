export interface VenueResponse {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  city?: string;
  region?: string;
  country?: string;
  postCode?: string;
  streetName?: string;
  houseNumber?: string;
}

export interface VenueUpdateDTO {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  city?: string;
  region?: string;
  country?: string;
  postCode?: string;
  streetName?: string;
  houseNumber?: string;
}
