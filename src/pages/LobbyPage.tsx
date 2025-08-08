import { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Scoreboard from "@/components/custom/scoreboard";

interface GameQuestion {
  Question: string;
  Answers: string[];
}

export default function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get("nickname");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [questionData, setQuestionData] = useState<GameQuestion | null>(null);
  const [finishedMessage, setFinishedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!lobbyId || !nickname) return;

    const socket = new WebSocket(
      `ws://localhost:8080/join-lobby/${lobbyId}?nickname=${encodeURIComponent(
        nickname
      )}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      if (socket.readyState === WebSocket.OPEN) {
        setIsConnected(true);
        console.log("Connected to lobby");
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message from server:", message);

      // Handle StartOfGame event
      if (message.event === "Lobby" && message.type === "StartOfGame") {
        setGameStarted(true);
      }

      // Handle Game Question
      if (message.event === "Game" && message.type === "Question") {
        const parsedData = JSON.parse(message.data);
        setQuestionData(parsedData);
      }

      if (message.type === "FinishedGame") {
        setQuestionData(null);
        setFinishedMessage(
          "You finished your question. Wait for your opponent..."
        );
      }

      if (message.type === "EndOfGame") {
        setQuestionData(null);
        setFinishedMessage(null);
        setGameStarted(false);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      setIsConnected(false);
      console.log(
        "Disconnected from lobby",
        event.code,
        event.reason,
        event.wasClean
      );
    };

    return () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      socket.close();
    };
  }, [lobbyId, nickname]);

  const startGame = () => {
    const msg = {
      type: "Lobby",
      action: "StartGame",
      data: "",
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  const sendAnswer = (answer: string) => {
    const msg = {
      type: "Game",
      action: "GuessAnswer",
      data: JSON.stringify({ Answer: answer }),
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-lg p-6 space-y-6 shadow-lg">
        <CardContent className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Lobby: {lobbyId}</h2>
          <p className="text-muted-foreground">Nickname: {nickname}</p>
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>

          {!gameStarted && (
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          )}

          {gameStarted && <Scoreboard socket={socketRef.current} />}

          {questionData && (
            <div className="w-full space-y-4">
              <Separator />
              <h3 className="text-xl font-semibold text-center">
                {questionData.Question}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {questionData.Answers.map((ans, idx) => (
                  <Button key={idx} onClick={() => sendAnswer(ans)}>
                    {ans}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {finishedMessage && (
            <div className="text-center mt-4 text-muted-foreground font-semibold">
              {finishedMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
