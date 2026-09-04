import { useState } from "react";
import { api } from "../api";

export default function Card({ card, onChange }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");

  async function handleSave(e) {
    e.preventDefault();
    await api.updateCard(card.id, { title, description });
    setEditing(false);
    onChange();
  }

  async function handleDelete() {
    if (!confirm("Delete this card?")) return;
    await api.deleteCard(card.id);
    onChange();
  }

  if (editing) {
    return (
      <form className="card-item editing" onSubmit={handleSave}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <textarea
          placeholder="Description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="new-card-actions">
          <button type="submit">Save</button>
          <button type="button" className="ghost-btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="card-item" onClick={() => setEditing(true)}>
      <p className="card-title">{card.title}</p>
      {card.description && <p className="card-desc">{card.description}</p>}
      <button
        className="icon-btn card-delete"
        aria-label="Delete card"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        ×
      </button>
    </div>
  );
}
