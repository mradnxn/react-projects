/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { authorise } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!authorise) navigate("/");
    },
    [authorise, navigate]
  );
  return authorise ? children : null;
}

export default ProtectedRoute;
