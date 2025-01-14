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
  },
};
