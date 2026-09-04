import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function ownsList(listId, userId) {
  return db
    .prepare(
      `SELECT lists.id FROM lists
       JOIN boards ON lists.board_id = boards.id
       WHERE lists.id = ? AND boards.user_id = ?`
    )
    .get(listId, userId);
}

function ownsCard(cardId, userId) {
  return db
    .prepare(
      `SELECT cards.* FROM cards
       JOIN lists ON cards.list_id = lists.id
       JOIN boards ON lists.board_id = boards.id
       WHERE cards.id = ? AND boards.user_id = ?`
    )
    .get(cardId, userId);
}

// Create a card
router.post("/", (req, res) => {
  const { listId, title, description } = req.body;
  if (!listId || !title) return res.status(400).json({ error: "listId and title are required" });
  if (!ownsList(listId, req.userId)) return res.status(404).json({ error: "List not found" });

  const { maxPos } = db
    .prepare("SELECT COALESCE(MAX(position), -1) AS maxPos FROM cards WHERE list_id = ?")
    .get(listId);

  const result = db
    .prepare("INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)")
    .run(listId, title, description || "", maxPos + 1);

  res.status(201).json({ id: result.lastInsertRowid, list_id: listId, title, description: description || "", position: maxPos + 1 });
});

// Update a card (edit text, move to another list, reorder)
router.patch("/:id", (req, res) => {
  const card = ownsCard(req.params.id, req.userId);
  if (!card) return res.status(404).json({ error: "Card not found" });

  const { title, description, listId, position } = req.body;
  if (listId && !ownsList(listId, req.userId)) {
    return res.status(404).json({ error: "Target list not found" });
  }

  db.prepare(
    `UPDATE cards SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      list_id = COALESCE(?, list_id),
      position = COALESCE(?, position)
     WHERE id = ?`
  ).run(title ?? null, description ?? null, listId ?? null, position ?? null, req.params.id);

  res.json({ ...card, title: title ?? card.title, description: description ?? card.description, list_id: listId ?? card.list_id, position: position ?? card.position });
});

// Delete a card
router.delete("/:id", (req, res) => {
  const card = ownsCard(req.params.id, req.userId);
  if (!card) return res.status(404).json({ error: "Card not found" });
  db.prepare("DELETE FROM cards WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

export default router;
