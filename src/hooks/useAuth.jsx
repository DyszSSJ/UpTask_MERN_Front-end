import { useContext } from "react";
import AuthContext from "../context/AuthPrivider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
