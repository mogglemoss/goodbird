import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeRoute } from "./routes/Home";
import { LessonRoute } from "./routes/Lesson";
import { ResultsRoute } from "./routes/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/lesson/:id" element={<LessonRoute />} />
        <Route path="/results/:id" element={<ResultsRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
