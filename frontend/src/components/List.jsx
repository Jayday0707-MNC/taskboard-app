import { useState } from "react";
import { api } from "../api";
import Card from "./Card.jsx";

export default function List({ list, onChange }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAddCard(e) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    await api.createCard(list.id, newCardTitle.trim(), "");
    setNewCardTitle("");
    setAdding(false);
    onChange();
  }

  async function handleDeleteList() {
    if (!confirm(`Delete list "${list.title}" and all its cards?`)) return;
    await api.deleteList(list.id);
    onChange();
  }

  return (
    <section className="list-col">
      <header className="list-col-head">
        <h3>{list.title}</h3>
        <button className="icon-btn" onClick={handleDeleteList} aria-label="Delete list">×</button>
      </header>

      <div className="card-stack">
        {list.cards.map((card) => (
          <Card key={card.id} card={card} onChange={onChange} />
        ))}
      </div>

      {adding ? (
        <form className="new-card-form" onSubmit={handleAddCard}>
          <textarea
            autoFocus
            placeholder="Card title…"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleAddCard(e);
            }}
          />
          <div className="new-card-actions">
            <button type="submit">Add card</button>
            <button type="button" className="ghost-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>+ Add a card</button>
      )}
    </section>
  );
}
