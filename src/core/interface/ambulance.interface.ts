export interface Ambulance {
  createdAt: string;
  updatedAt: string;
  _id: string;
  driver_name: string;
  ambulance_number: string;
  contact: string;
  location: {
    latitude: string;
    longitude: string;
  };
  status: string;
}
