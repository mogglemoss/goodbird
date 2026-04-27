import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeRoute } from "./routes/Home";
import { UnitRoute } from "./routes/Unit";
import { LessonRoute } from "./routes/Lesson";
import { ResultsRoute } from "./routes/Results";
import { SpeciesRoute } from "./routes/Species";
import { AboutRoute } from "./routes/About";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/unit/:slug" element={<UnitRoute />} />
        <Route path="/lesson/:id" element={<LessonRoute />} />
        <Route path="/results/:id" element={<ResultsRoute />} />
        <Route path="/species/:id" element={<SpeciesRoute />} />
        <Route path="/about" element={<AboutRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
