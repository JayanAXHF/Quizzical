import { Button, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { decode } from "html-entities";
import { red } from "@mui/material/colors";

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

const QuizPage = () => {
  const url: string = "https://opentdb.com/api.php?amount=5&type=multiple";

  const [selectedAnswers, setSelectedAnswers] = useState<SelAns>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [completed, setCompleted] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<boolean[]>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(selectedAnswers);
  }, [selectedAnswers]);

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
    // let prevAns: string[] = prevState;
    // prevAns[index] = answer;
    // console.log(
    //   `JSC ~ file: QuizPage.tsx:67 ~ setSelectedAnswers ~ prevAns`,
    //   prevAns
    // );
    setSelectedAnswers({ ...selectedAnswers, [index]: answer });
  };

  const questionComponent = questions.map((question, i) => {
    const randomInteger = Math.floor(Math.random() * 3);

    // let answers = shuffle(
    //   question.incorrect_answers.concat([question.correct_answer])
    // );
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
        <Divider />
      </div>
    );
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const results = questions.map((question, i) => {
      if (question.correct_answer === selectedAnswers[i]) {
        return true;
      } else {
        return false;
      }
    });
    console.log(`JSC ~ file: QuizPage.tsx:97 ~ results ~ results`, results);
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
      {!completed ? (
        <form className="w-screen h-screen grid place-content-center gap-y-4">
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
      ) : (
        <div className="w-screen h-screen grid place-content-center gap-y-4">
          {" "}
          {checkComponent}
          <br />
          <Button
            variant="contained"
            sx={{
              width: "max-content",
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
