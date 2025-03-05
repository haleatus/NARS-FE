export interface User {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  fullname: string;
  email: string;
  contact: string;
  deletedAt?: string | Date | null;
  location?: {
    latitude: string;
    longitude: string;
  };
}

export interface UpdateUser {
  fullname?: string;
  email?: string;
  contact?: string;
  location?: {
    latitude: string;
    longitude: string;
  };
}
