import api from "./axios";

export const getApis = () => api.get("/apis");

export const createApi = (name, capacity, refillRate) =>
  api.post("/apis", {
    name,
    capacity,
    refillRate
  });

