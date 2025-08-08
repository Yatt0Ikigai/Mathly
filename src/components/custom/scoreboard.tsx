import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type ScoreboardProps = {
  socket: WebSocket | null;
};

export default function Scoreboard({ socket }: ScoreboardProps) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!socket) {
        return 
    }

    const handleScoreboard = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === "Game" && msg.type === "Scoreboard") {
          const parsedData = JSON.parse(msg.data); // msg.data is stringified JSON
          setScores(parsedData);
        }
      } catch (err) {
        console.error("Error parsing scoreboard message:", err);
      }
    };

    socket.addEventListener("message", handleScoreboard);
    return () => socket.removeEventListener("message", handleScoreboard);
  }, [socket]);

  return (
    <div className="fixed top-4 right-4 w-64 z-50">
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-2">Scoreboard</h2>
          {Object.entries(scores).length === 0 ? (
            <p className="text-sm text-muted-foreground">No scores yet.</p>
          ) : (
            <ul className="space-y-1">
              {Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .map(([nickname, score]) => (
                  <li
                    key={nickname}
                    className="flex justify-between text-sm font-medium"
                  >
                    <span>{nickname}</span>
                    <span>{score}</span>
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
