import { createContext, useContext, useState } from "react";
import { auth } from "../firebase";

import { onAuthStateChanged, User } from "firebase/auth";
const AppContext = createContext<any>("");

export const AppProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setUser(user);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
