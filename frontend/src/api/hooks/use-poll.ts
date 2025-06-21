import axios from "axios";
import { API_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";

export const usePoll = () => {
  return useQuery({
    queryKey: ["poll"],
    queryFn: () => {
      return axios.get(API_URL);
    },
    retryDelay: 1000,
    retry: true,
  });
};
