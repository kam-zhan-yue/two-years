const ENV = import.meta.env.MODE; // 'development' or 'production'

export const BASE_URL = "http://0.0.0.0:8000/";
const DEPLOYED_URL = "https://two-years-backend.onrender.com/";

export const PRODUCTION = ENV === "production";
export const API_URL = PRODUCTION ? DEPLOYED_URL : BASE_URL;
export const ECHO_URL = `${API_URL}ws`;
export const WS_URL = `${API_URL}game`;
