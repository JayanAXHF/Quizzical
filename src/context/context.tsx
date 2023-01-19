import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";

import { browserLocalPersistence, setPersistence, User } from "firebase/auth";
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
  const [configIsOpen, setConfigIsOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
  const [url, setUrl] = useState<string>(
    "https://opentdb.com/api.php?amount=5&type=multiple"
  );
  const [showScores, setShowScores] = useState<boolean>(false);

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
        `firebase:authUser:${process.env.REACT_APP_API_KEY}:[DEFAULT]`
      ) as string
    );

    if (usr) {
      setPersistence(auth, browserLocalPersistence);
      setGlobalUser(usr);
      fetchUserData(usr.uid);
      localStorage.setItem(
        `firebase:authUser:${process.env.REACT_APP_API_KEY}:[DEFAULT]`,
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

        configIsOpen,
        setConfigIsOpen,
        url,
        setUrl,
        showScores,
        setShowScores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
