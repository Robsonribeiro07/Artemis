import { getUrlBackend } from "@/utils/get-url-backend";
import axios, { AxiosInstance } from "axios";

export type Api = {
  api: AxiosInstance;
};

interface ApiOptions {
  token?: string | null;
  withoutApi?: boolean;
  test?: boolean;
  userId?: string;
}

const api = ({
  token = null,
  withoutApi = false,
  test = true,
  userId = "6aafe568417fa267c697210f",
}: ApiOptions = {}) =>
  axios.create({
    baseURL: `${getUrlBackend()}${withoutApi ? "" : "/api"}`,
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      "Content-Type": "application/json",

      ...(test && {
        "x-client": "insomnia",
        user_from_insomnia: userId,
      }),
    },
  });

if (process.env.EXPO_PUBLIC_DELAY_API === "true") {
  api().interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return config;
  });
}

export default api;
