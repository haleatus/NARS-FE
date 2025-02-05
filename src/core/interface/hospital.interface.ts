export interface IHospital {
  name: string;
  amenity: string;
  latitude: number;
  longitude: number;
}

export interface IHospitalSuccessResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: IHospital[];
}
