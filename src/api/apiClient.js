import axios from "axios";

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "es",
  },
});

// Interceptor para agregar el token de autorización a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtener el token del localStorage
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales, como la expiración del token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Aquí puedes manejar la lógica de refrescar el token o redirigir al login
      console.error(
        "Token expirado o no autorizado:",
        error.response.data?.detail
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
