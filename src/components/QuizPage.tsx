import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { red } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateProfile, User } from "firebase/auth";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}
interface SelAns {
  [key: number]: string | undefined;
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const url: string = "https://opentdb.com/api.php?amount=5&type=multiple";

  const [selectedAnswers, setSelectedAnswers] = useState<SelAns>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<number>();

  useEffect(() => {
    setLoading(true);
    fetchData();
    if (localStorage.getItem("scores")) {
      let tempArr = JSON.parse(localStorage.getItem("scores") as string);

      let tempScores: number[] = tempArr.map((item: number) => {
        return Number(item);
      });

      setScores(tempScores);
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    let formattedData = data.results.map((item: Question) => {
      return {
        ...item,
        answers: shuffle(item.incorrect_answers.concat([item.correct_answer])),
      };
    });
    setQuestions(formattedData);
  };

  const changeAns = (index: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: answer });
  };

  const questionComponent = questions.map((question, i) => {
    const { answers } = question;
    const index: number = i;

    return (
      <div key={i} className="grid gap-y-1">
        <span>
          Q{i + 1}. {decode(question?.question)}
        </span>

        <div className="grid grid-flow-col gap-x-6">
          {answers.map((answer) => {
            const variant =
              selectedAnswers[index] === answer ? "contained" : "outlined";
            return (
              <Button
                size="small"
                variant={variant}
                onClick={() => {
                  changeAns(index, answer);
                }}
              >
                {decode(answer)}
              </Button>
            );
          })}
        </div>
        <br />

        <Divider />
        <br />
      </div>
    );
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let results: number = 0;
    for (let index = 0; index < 5; index++) {
      const element = selectedAnswers[index];
      if (element === questions[index].correct_answer) {
        results += 1;
      }
    }

    setScores([...scores, results]);
    localStorage.setItem("scores", JSON.stringify([...scores, results]));
    setCompleted((prevState: boolean) => {
      return !prevState;
    });
    setResults(results);
  };

  const checkComponent = questions.map((question, i) => {
    const { answers } = question;

    const index: number = i;

    return (
      <div key={i} className="grid gap-y-1">
        <span>
          Q{i + 1}. {decode(question?.question)}
        </span>

        <div className="grid grid-flow-col gap-x-6">
          {answers.map((answer) => {
            const variant =
              selectedAnswers[index] === answer ||
              (selectedAnswers[index] !== answer &&
                !question.incorrect_answers.includes(answer))
                ? "contained"
                : "outlined";

            return (
              <Button
                variant={variant}
                color={
                  selectedAnswers[index] === answer &&
                  question.incorrect_answers.includes(answer)
                    ? "error"
                    : selectedAnswers[index] === answer &&
                      !question.incorrect_answers.includes(answer)
                    ? "success"
                    : selectedAnswers[index] !== answer &&
                      !question.incorrect_answers.includes(answer)
                    ? "success"
                    : "primary"
                }
                sx={{
                  bgcolor:
                    selectedAnswers[index] === answer &&
                    question.incorrect_answers.includes(answer)
                      ? red[500]
                      : "",
                  filter:
                    selectedAnswers[index] === answer &&
                    question.incorrect_answers.includes(answer)
                      ? "grayscale(50%)"
                      : "grayscale(0%)",

                  "&:hover": {
                    bgcolor:
                      selectedAnswers[index] === answer &&
                      question.incorrect_answers.includes(answer)
                        ? red[500]
                        : "",
                    filter:
                      selectedAnswers[index] === answer &&
                      question.incorrect_answers.includes(answer)
                        ? "grayscale(50%)"
                        : "grayscale(0%)",
                  },
                }}
                size="small"
              >
                {decode(answer)}
              </Button>
            );
          })}
        </div>
        <Divider />
      </div>
    );
  });

  return (
    <>
      <Button
        sx={{
          position: "fixed",
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
      {!completed ? (
        loading ? (
          <CircularProgress />
        ) : (
          <form className="grid h-screen w-screen place-content-center gap-y-4">
            {localStorage.getItem("scores") && (
              <Typography variant="h1">
                Top Score: {Math.max(...scores)}/5
              </Typography>
            )}
            {questionComponent}
            <Button
              type="submit"
              sx={{ width: "max-content" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Check Answers
            </Button>
          </form>
        )
      ) : (
        <div className="grid h-screen w-screen place-content-center gap-y-4">
          <Typography variant="h1">
            Score: {results}
            /5
          </Typography>
          <Typography variant="h1">
            Top Score: {Math.max(...scores)}/5
          </Typography>
          {checkComponent}
          <br />
          <Button
            variant="contained"
            sx={{
              width: "max-content",
            }}
            onClick={() => {
              setLoading(true);
              setCompleted(false);
              fetchData();
              setLoading(false);
            }}
          >
            Play Again
          </Button>
        </div>
      )}
    </>
  );
};

export default QuizPage;
