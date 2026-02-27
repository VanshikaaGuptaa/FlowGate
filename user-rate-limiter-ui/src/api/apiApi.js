import api from "./axios";

export const getApis = () => api.get("/apis");

export const createApi = (name, targetUrl, capacity, refillRate) =>
  api.post("/apis", {
    name,
    targetUrl,
    capacity,
    refillRate
  });
