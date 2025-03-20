import apiClient from "./apiClient";

const apiService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/token/", credentials);
    return response.data;
  },

  getUserProfile: async (user_id) => {
    const response = await apiClient.get(`/core/users/${user_id}/`);
    return response.data;
  },

  updateUser: async (user_id, data) => {
    const response = await apiClient.patch(`/core/users/${user_id}/`, data);
    return response.data;
  },

  getChildList: async () => {
    const response = await apiClient.get("/core/users/get_child_list/");
    return response.data;
  },

  createChild: async (data) => {
    const response = await apiClient.post("/core/users/", data);
    return response.data;
  },

  getInscriptions: async () => {
    const response = await apiClient.get("/core/inscriptions/");
    return response.data;
  },
  checkAvailableUsername: async (username) => {
    const response = await apiClient.get("/core/users/check_used_username/", {
      params: { username: username },
    });
    return response.data;
  },
  updateUsername: async (user_id, data) => {
    const response = await apiClient.patch(
      `/core/users/${user_id}/update_username/`,
      { data }
    );
    return response.data;
  },
  changePassword: async (user_id, data) => {
    const response = await apiClient.post(
      `/core/users/${user_id}/set_password/`,
      data
    );
    return response.data;
  },
  getCatechists: async () => {
    const response = await apiClient.get("/core/users/get_catechist_list/");
    return response.data;
  },
  getRooms: async () => {
    const response = await apiClient.get("/core/rooms/");
    return response.data;
  },
  getRoom: async (roomId) => {
    const response = await apiClient.get(`/core/rooms/${roomId}/`);
    return response.data;
  },
  createRoom: async (data) => {
    const response = await apiClient.post("/core/rooms/", data);
    return response.data;
  },
  getEnrolledChildren: async (roomId) => {
    const response = await apiClient.get(
      `/core/rooms/${roomId}/enrolled_children/`
    );
    return response.data;
  },
  getNotEnrolledChildren: async (roomId) => {
    const response = await apiClient.get(
      `/core/rooms/${roomId}/not_enrolled_children/`
    );
    return response.data;
  },
  enrollChildren: async (roomId, data) => {
    const response = await apiClient.post(
      `/core/rooms/${roomId}/enroll_with_user_id_list/`,
      data
    );
    return response.data;
  },
  unrollChildren: async (roomId, data) => {
    const response = await apiClient.post(
      `/core/rooms/${roomId}/unroll_with_user_id_list/`,
      data
    );
    return response.data;
  },
};

export default apiService;
