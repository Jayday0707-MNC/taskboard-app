import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import List from "../components/List.jsx";

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const data = await api.getBoard(id);
      setBoard(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddList(e) {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await api.createList(id, newListTitle.trim());
    setNewListTitle("");
    refresh();
  }

  if (error) return <div className="page"><p className="muted">{error}</p></div>;
  if (!board) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="brand">Rowboard</Link>
        <h2 className="board-heading">{board.title}</h2>
      </header>

      <main className="board-main">
        <div className="lists-row">
          {board.lists.map((list) => (
            <List key={list.id} list={list} onChange={refresh} />
          ))}

          <form className="new-list-form" onSubmit={handleAddList}>
            <input
              placeholder="Add another list…"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
            <button type="submit">Add list</button>
          </form>
        </div>
      </main>
    </div>
  );
}
