const ENV = import.meta.env.MODE; // 'development' or 'production'

export const BASE_URL = "http://127.0.0.1:8000/";
const DEPLOYED_URL = "";

export const PRODUCTION = ENV === "production";
export const API_URL = PRODUCTION ? DEPLOYED_URL : BASE_URL;
export const ECHO_URL = `${API_URL}echo`;
export const WS_URL = `${API_URL}game_state`;
