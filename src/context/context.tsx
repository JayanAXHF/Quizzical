import { createContext, useContext, useState } from "react";
import { db } from "../firebase";

import { User } from "firebase/auth";
import { ref } from "firebase/database";
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
