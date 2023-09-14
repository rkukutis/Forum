import { createContext, useContext, useEffect, useState } from "react";
import cookies from "js-cookies";
import config from  "../config.json"


const UserContext = createContext();

function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  async function login(email, password) {
    try {
      setLoginError("");
      // when using on local network cookie is not being set from this address
      const res = await fetch(`http://${config.backendBaseAdress}:8000/auth/login`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      setLoggedInUser(data.user);
      return data.user;
    } catch (err) {
      console.log(err);
      setLoginError(err.message);
    }
  }

  async function register(username, email, password, passwordConfirm) {
    try {
      setLoginError("");
      const res = await fetch(`http://${config.backendBaseAdress}:8000/auth/signup`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, passwordConfirm }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) throw new Error(data.message);
      setLoggedInUser(data.user);
    } catch (err) {
      setRegisterError(err.message);
    }
  }

  // Checking this every nabiagtion often fails and authenticated user details are not fetched
  // TODO: Find better solution for storing logged in user
  useEffect(function () {
    async function checkUserExists() {
      // check for cookie with jwt
      if (!cookies.getItem("jwt")) return;

      // check jwt validity
      const res = await fetch(`http://${config.backendBaseAdress}:8000/auth/checkUser`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.status === "ok") setLoggedInUser(data.user);
    }
    checkUserExists();
  }, []);

  return (
    <UserContext.Provider
      value={{ loggedInUser, login, register, loginError, registerError }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useLoggedInUser() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("UserContext was used outside the UserProvider");
  return context;
}

export { UserProvider, useLoggedInUser };
