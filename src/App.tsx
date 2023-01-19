import React from "react";

import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

  const theme = React.useMemo(
    () => createTheme(prefersDarkMode ? dark : light),
    [prefersDarkMode]
  );
  return (
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
    </div>
  );
}

export default App;
