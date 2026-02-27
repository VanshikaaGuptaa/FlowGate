import api from "./axios";

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const initiateRegister = (email) =>
  api.post("/auth/register/initiate", { email });

export const verifyOtp = (email, otp, password) =>
  api.post("/auth/register/verify", { email, otp, password });
