import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import { get, child, ref } from "firebase/database";
const AppContext = createContext<any>("");

interface UserData {
  email: String;
  scores: number[];
  uid: string;
}
const dbRef = ref(db);

export const AppProvider = ({ children }: any) => {
  const [globalUser, setGlobalUser] = useState<User>();
  const [login, setLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();

  const fetchUserData = async (uid: string) => {
    const snapshot = await get(child(dbRef, `users/${uid}`));
    if (snapshot.exists()) {
      setUserData({ ...snapshot.val(), uid });
      setLogin(true);
    } else {
    }
  };

  useEffect(() => {
    const usr = JSON.parse(
      localStorage.getItem(
        `firebase:authUser:AIzaSyD5Wx1tmwXiUsBDGZ31tB0Hm5E5xABAY1c:[DEFAULT]`
      ) as string
    );

    if (usr) {
      setPersistence(auth, browserLocalPersistence);
      setGlobalUser(usr);
      fetchUserData(usr.uid);
      localStorage.setItem(
        `firebase:authUser:AIzaSyD5Wx1tmwXiUsBDGZ31tB0Hm5E5xABAY1c:[DEFAULT]`,
        JSON.stringify(usr)
      );
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        globalUser,
        setGlobalUser,
        login,
        setLogin,
        userData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
