import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { red } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAppContext } from "../context/context";
import { child, get, ref, set } from "firebase/database";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

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
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const dbRef = ref(db);

const QuizPage: React.FC = () => {
  const { userData, setGlobalUser, setUserData, setLogin, login, url } =
    useAppContext();
  const navigate = useNavigate();

  const [selectedAnswers, setSelectedAnswers] = useState<SelAns>({});

  const [scores, setScores] = useState<number[]>([0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<number>();

  useEffect(() => {
    setLoading(true);
    userData && setScores(userData.scores);

    const usr = JSON.parse(localStorage.getItem(`user`) as string);

    console.log(`JSC ~ file: QuizPage.tsx:65 ~ useEffect ~ usr`, usr);
    if (usr) {
      setPersistence(auth, browserLocalPersistence);
      setGlobalUser(usr);
      fetchUserData(usr.uid);
      localStorage.setItem(
        `firebase:authUser:${process.env.REACT_APP_API_KEY}:[DEFAULT]`,
        JSON.stringify(usr)
      );
    }
    fetchData();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const fetchUserData = async (uid: string) => {
    const snapshot = await get(child(dbRef, `users/${uid}`));
    if (snapshot.exists()) {
      console.log(
        `JSC ~ file: QuizPage.tsx:80 ~ fetchUserData ~ snapshot`,
        snapshot.val()
      );
      setUserData({ ...snapshot.val(), uid });
      setLogin(true);
    } else {
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(url);
    const data = await res.json();
    console.log(`JSC ~ file: QuizPage.tsx:106 ~ fetchData ~ data`, data);
    let formattedData = data.results.map((item: Question) => {
      return {
        ...item,
        answers: shuffle(item.incorrect_answers.concat([item.correct_answer])),
      };
    });
    setQuestions(formattedData);
    setLoading(false);
  };

  const changeAns = (index: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: answer });
  };

  const questionComponent = questions.map((question, i) => {
    const { answers } = question;
    const index: number = i;

    return (
      <div key={i} className=" grid gap-y-1">
        <span>
          Q{i + 1}. {decode(question?.question)}
        </span>

        <div className="grid grid-flow-row gap-x-6 gap-y-3 md:grid-flow-col">
          {answers.map((answer) => {
            const variant =
              selectedAnswers[index] === answer ? "contained" : "outlined";
            return (
              <Button
                variant={variant}
                onClick={() => {
                  changeAns(index, answer);
                }}
                sx={{
                  scale: {
                    xs: "95%",

                    md: "100%",
                  },
                }}
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let results: number = 0;
    for (let index = 0; index < questions.length; index++) {
      const element = selectedAnswers[index];
      if (element === questions[index].correct_answer) {
        results += 1;
      }
    }

    setScores([...(scores as number[]), results]);
    localStorage.setItem(
      "scores",
      JSON.stringify([...(scores as number[]), results])
    );
    setCompleted((prevState: boolean) => {
      return !prevState;
    });

    setUserData({
      ...userData,
      scores: [...userData.scores, results],
    });

    try {
      await set(ref(db, `users/${userData.uid}/scores`), [
        ...userData.scores,
        results,
      ]);
    } catch (error) {}

    setResults(results);
  };

  const checkComponent = questions.map((question, i) => {
    const { answers } = question;

    const index: number = i;

    return (
      <div key={i} className="mt-16 grid gap-y-1 md:mt-0">
        <span>
          Q{i + 1}. {decode(question?.question)}
        </span>

        <div className="grid grid-flow-row gap-x-6 md:grid-flow-col">
          {answers.map((answer) => {
            const variant =
              selectedAnswers[index] === answer ||
              (selectedAnswers[index] !== answer &&
                !question.incorrect_answers.includes(answer))
                ? "contained"
                : "outlined";

            return (
              <span>
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
                    scale: {
                      xs: "95%",
                      md: "100%",
                    },
                    width: "100%",
                  }}
                >
                  {decode(answer)}
                </Button>
              </span>
            );
          })}
        </div>
        <Divider />
      </div>
    );
  });

  return (
    <div
      className={` m-auto my-20 h-screen w-screen  justify-center sm:my-0 xl:my-0 xl:grid ${
        questions.length <= 10 && " content-center "
      }`}
    >
      <Button
        sx={{
          position: "absolute",
          top: 2 * 5,

          left: 2 * 5,
        }}
        variant="text"
        color="inherit"
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
          <form>
            <div className="grid w-screen  gap-y-4 px-3 md:mt-0 md:px-0">
              <span className="  grid  gap-y-4 rounded-lg bg-white p-6 dark:bg-main  lg:mt-0 ">
                {login && (
                  <Typography
                    variant="h1"
                    className="text-black dark:text-white"
                  >
                    Top Score: {Math.max(...(userData?.scores || [0]))}
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
              </span>
            </div>
          </form>
        )
      ) : (
        <div className="grid  w-screen gap-y-4 px-3 md:mt-0 md:place-content-center md:px-0">
          <span className="static  grid  gap-y-4 rounded-lg bg-white p-6 dark:bg-main md:place-content-center lg:mt-0  ">
            <Typography variant="h1">
              Score: {results}/{questions.length}
            </Typography>
            <Typography variant="h1">
              Top Score: {Math.max(...(scores as number[]))}
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
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
