import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, SyntheticEvent } from "react";
const Home = () => {
  const [scores, setScores] = useState<number[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (localStorage.getItem("scores")) {
      let tempArr = JSON.parse(localStorage.getItem("scores") as string);

      let tempScores: number[] = tempArr.map((item: number) => {
        return Number(item);
      });

      setScores(tempScores);
    }
  }, []);

  const navigate = useNavigate();
  const handleStart: React.MouseEventHandler<HTMLButtonElement> = () => {
    navigate("/quiz");
  };

  return (
    <div className="grid h-screen w-screen grid-flow-row  place-content-center place-items-center  ">
      <span className="fixed top-5 right-5">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Login
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/login");
            }}
          >
            Login
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/signup");
            }}
          >
            Signup
          </MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </span>

      <h1 className="mx-auto text-center text-5xl">Quizzical</h1>
      <br />
      {localStorage.getItem("scores") && (
        <Typography variant="h3">Top Score: {Math.max(...scores)}/5</Typography>
      )}
      <br />
      <Button variant="contained" color="success" onClick={handleStart}>
        Start
      </Button>
    </div>
  );
};

export default Home;
