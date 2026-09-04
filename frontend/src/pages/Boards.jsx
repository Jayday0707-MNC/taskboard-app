import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getBoards().then(setBoards).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const board = await api.createBoard(title.trim());
    setBoards([board, ...boards]);
    setTitle("");
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">Rowboard</span>
        <button className="ghost-btn" onClick={logout}>Log out</button>
      </header>

      <main className="boards-main">
        <h1>Your boards</h1>
        <form className="new-board-form" onSubmit={handleCreate}>
          <input
            placeholder="New board name…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Create board</button>
        </form>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : boards.length === 0 ? (
          <p className="muted">No boards yet — create your first one above.</p>
        ) : (
          <div className="board-grid">
            {boards.map((b) => (
              <Link key={b.id} to={`/boards/${b.id}`} className="board-tile">
                {b.title}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
