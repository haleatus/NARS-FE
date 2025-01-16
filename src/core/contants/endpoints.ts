export const baseURL: string = "http://localhost:3000";

export const endpoints = {
  auth: {
    admin: {
      signup: `${baseURL}/api/nars/admin/create`,
      signin: `${baseURL}/api/nars/auth/admin/signin`,
    },
    user: {
      signup: `${baseURL}/api/nars/user/create`,
      signin: `${baseURL}/api/nars/auth/user/signin`,
    },
    ambulance: {
      signin: `${baseURL}/api/nars/auth/ambulance/signin`,
    },
  },
  user: {
    getAllUsers: `${baseURL}/api/nars/user/get-all`,
    getCurrentUser: `${baseURL}/api/nars/user/me`,
  },
};
