import React from "react";

import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { light, dark } from "./Theme";
import Home from "./components/Home";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuizPage from "./components/QuizPage";

function App() {
  const prefersDarkMode = useMediaQuery<boolean>(
    "(prefers-color-scheme: dark)"
  );

  const theme = React.useMemo(
    () => createTheme(prefersDarkMode ? dark : light),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
