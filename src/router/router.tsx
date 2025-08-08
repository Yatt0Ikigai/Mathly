import { BrowserRouter, Routes, Route } from "react-router";
import { Auth } from "../pages";
import { FullPageWrapper } from "@/lib/ui";
import HomePage from "@/pages/HomePage";
import LobbyPage from "@/pages/LobbyPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <FullPageWrapper>
              <HomePage />
            </FullPageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <FullPageWrapper>
              <Auth />
            </FullPageWrapper>
          }
        />
        <Route
          path="/lobby/:lobbyId"
          element={
            <FullPageWrapper>
              <LobbyPage />
            </FullPageWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
