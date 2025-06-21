import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants";
import { constants } from "@/helpers/constants";

const useConnect = (id: string) => {
  return useQuery({
    queryKey: ["connect", id],
    queryFn: () => {
      return axios.get(`${API_URL}connect/${id}`, {});
    },
    enabled: id !== constants.emptyId,
  });
};

export { useConnect };
