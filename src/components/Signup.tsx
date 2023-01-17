import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { auth } from "../firebase";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { useAppContext } from "../context/context";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [keepLogin, setKeepLogin] = useState<boolean>(false);

  const emailRef = useRef<string>(null);

  const { setGlobalUser, setUserData, setLogin } = useAppContext();

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (password === confirmPass) {
      try {
        keepLogin && setPersistence(auth, browserLocalPersistence);
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        setGlobalUser(user);
        const uid = user.uid;
        await set(ref(db, `users/${uid}`), { email, scores: [0] });
        setUserData({ email, scores: [0], uid });
        setLogin(true);
        keepLogin &&
          localStorage.setItem(
            "user",
            JSON.stringify({ email, scores: [0], uid })
          );
        if (!keepLogin) {
          localStorage.removeItem(
            `firebase:authUser:${process.env.REACT_APP_API_KEY}:[DEFAULT]`
          );
        }
        navigate("/");
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("The passwords do not match!");
    }
  };

  return (
    <div>
      {" "}
      <Button
        sx={{
          position: "absolute",
          top: 2 * 5,
          left: 2 * 5,
        }}
        variant="outlined"
        onClick={() => {
          navigate("/");
        }}
      >
        <ArrowBackIcon />
      </Button>
      <form className="grid h-screen w-screen place-content-center gap-y-5 ">
        <div className="grid place-content-center gap-y-5 rounded-lg bg-white p-6 shadow-md dark:bg-main">
          <Typography variant="h1">Welcome Here!</Typography>
          <TextField
            label="Email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
            inputRef={emailRef}
          />
          <TextField
            label="Password"
            type={showPass ? "text" : "password"}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
          <TextField
            label="Retype Password"
            type={showPass ? "text" : "password"}
            onChange={(event) => {
              setConfirmPass(event.target.value);
            }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPass}
                onChange={() => {
                  setShowPass((prevState: boolean) => {
                    return !prevState;
                  });
                }}
              />
            }
            label="Show Password"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={keepLogin}
                onChange={() => {
                  setKeepLogin((prevState: boolean) => {
                    return !prevState;
                  });
                }}
              />
            }
            label="Keep me logged in"
          />
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" component={RouterLink}>
              Sign In instead
            </Link>
          </Typography>
          <Button onClick={handleSubmit} variant="contained">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
