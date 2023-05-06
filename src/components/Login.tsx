import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { auth, db } from "../firebase";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/context";
import { ref, child, get } from "firebase/database";
const Login: FC = () => {
  const dbRef = ref(db);
  const [keepLogin, setKeepLogin] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setUserData, setLogin } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      keepLogin &&
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error ${errorCode} ${errorMessage} `);
          });
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      const { uid } = user;

      const snapshot = await get(child(dbRef, `users/${uid}`));
      if (snapshot.exists()) {
        setUserData({ ...snapshot.val(), uid });
      } else {
        throw new Error("No data available");
      }

      setLogin(true);
    } catch (error) {
      throw error;
    }

    navigate("/");
  };

  return (
    <div>
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
      <form className="grid h-screen w-screen place-content-center gap-y-6">
        <span className="grid place-content-center gap-y-5 rounded-lg bg-white p-6 shadow-md dark:bg-main">
          <Typography variant="h1">Welcome Back!</Typography>
          <TextField
            label="Email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            type="email"
            required
          />
          <TextField
            label="Password"
            type={showPass ? "text" : "password"}
            onChange={(event) => {
              setPassword(event.target.value);
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
            Don't have an account?{" "}
            <Link to="/signup" component={RouterLink}>
              Sign Up instead
            </Link>
          </Typography>
          <Button
            type="submit"
            onClick={handleSubmit}
            sx={{ width: "max-content" }}
            variant="contained"
          >
            Login
          </Button>
        </span>
      </form>
    </div>
  );
};

export default Login;
