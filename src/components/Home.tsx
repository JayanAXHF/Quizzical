import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [scores, setScores] = useState<number[]>([]);
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
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    navigate("/quiz");
  };

  return (
    <div className="grid h-screen w-screen grid-flow-row  place-content-center place-items-center  ">
      <h1 className="mx-auto text-center text-5xl">Quizzical</h1>
      <br />
      <Typography variant="h3">Top Score: {Math.max(...scores)}/5</Typography>
      <br />
      <Button variant="contained" color="success" onClick={handleClick}>
        Start
      </Button>
    </div>
  );
};

export default Home;
