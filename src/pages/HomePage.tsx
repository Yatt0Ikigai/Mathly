import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function HomePage() {
  const [token, setToken] = useState<string | null>("");
  const [userDetails, setUserDetails] = useState<{
    email: string;
    name: string;
    id: string;
  } | null>(null);
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
    console.log(token);
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

  return (
    <div>
      Hello {userDetails?.name} {userDetails?.email} your id is
      {userDetails?.id}
    </div>
  );
}
