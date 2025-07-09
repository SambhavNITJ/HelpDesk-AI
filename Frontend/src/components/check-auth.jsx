import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      if (!token) {
        navigate("/login");
        return;
      }
    } else {
      if (token) {
        navigate("/");
        return;
      }
    }

    setLoading(false);
  }, [navigate, protectedRoute]);

  if (loading) return null;

  return children;
}

export default CheckAuth;
