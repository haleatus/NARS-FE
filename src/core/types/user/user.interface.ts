export interface User {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  fullname: string;
  email: string;
  contact: string;
  deletedAt?: string | Date | null;
}
