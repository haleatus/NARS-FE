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
    ambulanceRequest: {
      requestAmbulance: `${baseURL}/api/nars/user/ambulance-request/create`,
      getUserAmbulanceRequests: `${baseURL}/api/nars/user/ambulance-request/my-request`,
      updateAmbulanceRequest: `${baseURL}/api/nars/user/ambulance-request/update/:id`,
      deleteAmbulanceRequest: `${baseURL}/api/nars/user/ambulance-request/delete/:id`,
    },
  },
  admin: {
    ambulance: {
      createAmbulance: `${baseURL}/api/nars/admin/ambulance/create`,
      deleteAmbulance: `${baseURL}/api/nars/admin/ambulance/delete`,
      updateAmbulance: `${baseURL}/api/nars/admin/ambulance/update`,
    },
    ambulanceRequest: {
      getAllRequest: `${baseURL}/api/nars/admin/ambulance-request/get-all`,
      getRequestById: `${baseURL}/api/nars/admin/ambulance-request/get/:id`,
    },
    user: {
      getAllUsers: `${baseURL}/api/nars/admin/user/get-all`,
      getUserById: `${baseURL}/api/nars/admin/user/get/:id`,
    },
  },
  ambulance: {
    getAllAmbulances: `${baseURL}/api/nars/ambulance/get-all`,
    getAmbulanceById: `${baseURL}/api/nars/ambulance/get/:id`,
  },
};
