import { Button, TextField, Typography } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    console.log(await auth.currentUser?.getIdToken());
    navigate("/");
  };

  return (
    <form className="place-ite grid h-screen w-screen place-content-center gap-y-6">
      <Typography variant="h1">Welcome Back!</Typography>
      <TextField
        label="Email"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        required
      />
      <TextField
        label="Password"
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        required
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
    </form>
  );
};

export default Login;
