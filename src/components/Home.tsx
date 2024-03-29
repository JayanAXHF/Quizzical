import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";
import { useAppContext } from "../context/context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
import { Close as CloseIcon } from "@mui/icons-material";
import Config from "./modals/Config";

function BootstrapDialogTitle(props: any) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const Home = () => {
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {
    setGlobalUser,
    setUserData,
    setLogin,
    login,
    userData,
    setConfigIsOpen,
    setShowScores,
  } = useAppContext();

  const [confirmPass, setConfirmPass] = useState<string>("");

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleStart: React.MouseEventHandler<HTMLButtonElement> = () => {
    navigate("/quiz");
  };

  const handleSubmit = async () => {
    if (password === confirmPass) {
      try {
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
        navigate("/");
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error("The passwords do not match!");
    }
  };

  const handleLogout = (): void => {
    localStorage.clear();
    setGlobalUser(null);
    setUserData(null);
    setLogin(false);
    handleClose();
  };

  return (
    <div className="grid h-screen w-screen grid-flow-row  place-content-center place-items-center  ">
      <span className="fixed top-5 right-5 grid grid-flow-col">
        {login ? (
          <Button variant="text" color="info" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <span className="grid grid-flow-col gap-3">
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </Button>
            <Button
              variant="text"
              color="info"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          </span>
        )}
      </span>

<a href='github.com/JayanAXHF/quizzical' className='rounded-2xl bg-white dark:bg-black dark:text-white px-5 mx-auto'>

  Trivial Trivia is open-source!
</a>
      <Typography variant="h1" className="mx-auto  mb-5 text-center">
        Trivial Trivia
      </Typography>

      {login && (
        <>
          <Typography variant="h3">
            Top Score: {Math.max(...(userData?.scores ? userData?.scores : 0))}
          </Typography>
          <Typography variant="h3">
            Last Score: {userData?.scores[userData.scores.length - 1]}
          </Typography>
        </>
      )}
      <br />
      <div className="grid grid-flow-col gap-x-3">
        <Button
          variant="outlined"
          color="info"
          onClick={() => {
            if (login) {
              setConfigIsOpen(true);
            } else {
              setShow(true);
            }
          }}
          sx={{
            width: "100%",
          }}
        >
          Settings
        </Button>
        <Button
          variant={"text"}
          color="warning"
          onClick={() => {
            if (login) {
              setShowScores(true);
            } else {
              setShow(true);
            }
          }}
        >
          View Scores
        </Button>
      </div>
      <br />
      <Button
        variant="contained"
        color="success"
        onClick={
          login
            ? handleStart
            : () => {
                setShow(true);
              }
        }
        sx={{
          width: "100%",
        }}
      >
        Start
      </Button>

      <Dialog
        open={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <BootstrapDialogTitle
          onClose={() => {
            setShow(false);
          }}
        >
          Sign Up
        </BootstrapDialogTitle>
        <DialogContent className="grid grid-flow-row grid-cols-1">
          {" "}
          <form className="grid grid-flow-row gap-y-5">
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
            <TextField
              label="Retype Password"
              type="password"
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
        </DialogContent>
      </Dialog>
      <Config />
      <ScoresModal scores={userData?.scores ?? []} />
    </div>
  );
};

export default Home;

interface ScoresModelProps {
  scores: number[];
}

const ScoresModal = ({ scores }: ScoresModelProps) => {
  const { showScores, setShowScores } = useAppContext();
  return (
    <Dialog
      open={showScores}
      onClose={() => {
        setShowScores(false);
      }}
      scroll="body"
    >
      <DialogContent>
        <ul className="grid list-none grid-flow-row grid-cols-1">
          {scores.map((score) => {
            return <li className="list-item">{score}</li>;
          })}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowScores(false);
          }}
          className="grid-flow-col"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
