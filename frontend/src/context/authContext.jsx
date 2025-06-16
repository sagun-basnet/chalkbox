import { createContext, useEffect, useState } from "react";
import { post } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [fetchMessage, setFetchMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (input) => {
    try {
      setLoading(true);
      const response = await post("/api/users/login", input);
      if (response.token && response.user) {
        // Store token in localStorage for client-side access
        localStorage.setItem("token", response.token);
        setCurrentUser(response.user);
        setLoading(false);
        return { success: true, user: response.user };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    const res = await post("/api/logout");
    setFetchMessage(res.message);
    setCurrentUser(null);
    toast.success("Logout sucessfully");
  };

  useEffect(() => {
    // Only set the item in localStorage if currentUser is not null
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, fetchMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
