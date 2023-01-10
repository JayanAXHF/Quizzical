import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const Home = () => {
  const navigate = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    navigate("/quiz");
  };

  return (
    <div className="h-screen w-screen grid grid-flow-row  place-content-center place-items-center  ">
      <h1 className="mx-auto text-center text-5xl">Quizzical</h1>
      <br />
      <Button variant="contained" color="success" onClick={handleClick}>
        Start
      </Button>
    </div>
  );
};

export default Home;
