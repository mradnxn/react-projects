/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Adnan",
  email: "adnan@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  user: null,
  authorise: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        authorise: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        authorise: false,
      };
    default:
      throw new Error("undefined case");
  }
}

function AuthProvider({ children }) {
  const [{ user, authorise }, dispatch] = useReducer(reducer, initialState);

  function login(user, password) {
    if (user === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, authorise }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("context used outside the authcontext body ");
  return context;
}

export { AuthProvider, useAuth };
