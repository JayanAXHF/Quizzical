import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { Button, Link, TextField, Typography } from "@mui/material";
import { auth } from "../firebase";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../firebase";
import { useAppContext } from "../context/context";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const emailRef = useRef<string>(null);
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
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (password === confirmPass) {
      createUserWithEmailAndPassword(
        auth,
        emailRef.current as string,
        password
      ).then((userCredential) => {
        // Signed in

        console.log(
          `JSC ~ file: Signup.tsx:23 ~ .then ~ user`,
          userCredential.user
        );
      });
      await set(ref(db, "users/"), {
        email: emailRef.current?.toString(),
        scores: [],

        // ...
      }).catch((error) => {
        throw error;
        // ..
      });
      navigate("/");
    } else {
      throw new Error("The passwords do not match!");
    }
  };

  return (
    <form className="grid h-screen w-screen place-content-center gap-y-5">
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
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        required
      />
      <TextField
        label="Retype Password"
        onChange={(event) => {
          setConfirmPass(event.target.value);
        }}
        required
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
    </form>
  );
};

export default Signup;
