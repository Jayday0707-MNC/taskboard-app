import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Boards from "./pages/Boards.jsx";
import BoardView from "./pages/BoardView.jsx";

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <Protected>
            <Boards />
          </Protected>
        }
      />
      <Route
        path="/boards/:id"
        element={
          <Protected>
            <BoardView />
          </Protected>
        }
      />
    </Routes>
  );
}
