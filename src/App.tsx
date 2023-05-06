import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { CssBaseline, useMediaQuery } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import { light, dark } from "./Theme";
import Home from "./components/Home";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuizPage from "./components/QuizPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AppProvider } from "./context/context";

function App() {
  const prefersDarkMode = useMediaQuery<boolean>(
    "(prefers-color-scheme: dark)"
  );
  const rootElement: any = document.getElementById("root");

  const theme = React.useMemo(
    () =>
      createTheme(
        prefersDarkMode
          ? {
              ...dark,
              components: {
                MuiPopper: {
                  defaultProps: {
                    container: rootElement,
                  },
                },
              },
            }
          : light
      ),
    //eslint-disable-next-line
    [prefersDarkMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <div className="grid place-content-center">
        <AppProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/quiz"
                  element={
                    <div>
                      {" "}
                      <QuizPage />
                    </div>
                  }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AppProvider>
        <Analytics />
      </div>
    </StyledEngineProvider>
  );
}

export default App;
