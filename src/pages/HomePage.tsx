import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function HomePage() {
  const [token, setToken] = useState<string | null>("");
  const [userDetails, setUserDetails] = useState<{
    email: string;
    name: string;
    id: string;
  } | null>(null);

  const nicknameRef = useRef<HTMLInputElement>(null);
  const matchIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("access-token", token);
      window.location.href = "http://localhost:5173";
    }

    setToken(localStorage.getItem("access-token"));
  }, []);

  useEffect(() => {
    if (!token) return;
    const decodedAccessToken = jwtDecode<{
      email: string;
      name: string;
      id: string;
    }>(token);
    setUserDetails({
      email: decodedAccessToken.email,
      name: decodedAccessToken.name,
      id: decodedAccessToken.id,
    });
  }, [token]);

  const handleCreateGame = async () => {
    const nickname = nicknameRef.current?.value?.trim();
    if (!nickname) {
      alert("Please enter your nickname.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/create-lobby");
      const lobbyID = response.data.lobbyID;
      window.location.href = `/lobby/${lobbyID}?nickname=${encodeURIComponent(
        nickname
      )}`;
    } catch (err) {
      console.error("Failed to create lobby:", err);
      alert("Error creating lobby. Please try again.");
    }
  };

  const handleJoinGame = () => {
    const nickname = nicknameRef.current?.value?.trim();
    const matchId = matchIdRef.current?.value?.trim();

    if (!nickname || !matchId) {
      alert("Please enter both your nickname and game ID.");
      return;
    }

    window.location.href = `/lobby/${matchId}?nickname=${encodeURIComponent(
      nickname
    )}`;
  };

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center">
      <div className="">{userDetails?.email}</div>
      <div className="w-2xl flex gap-2 flex-col">
        <Input ref={nicknameRef} placeholder="Your nickname" />
        <Input ref={matchIdRef} placeholder="Enter Game ID" />
        <div className="flex gap-4">
          <Button className="grow" onClick={handleJoinGame} variant={"default"}>
            Join Game
          </Button>
          <Button className="grow" onClick={handleCreateGame} variant={"secondary"}>
            Create New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
