import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewPage from "./pages/Interview_Page";
import NotFoundPage from "./pages/Not_Found_Page"; // 404 sayfasını import edin
import InterviewEndPage from "./pages/InterviewEndPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/interview/:title" element={<InterviewPage />} />
        <Route path="/interview/ending" element={<InterviewEndPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
