import { BrowserRouter, Routes, Route } from "react-router";
import { Auth } from "../pages";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
