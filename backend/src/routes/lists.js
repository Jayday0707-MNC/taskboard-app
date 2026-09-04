import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function ownsBoard(boardId, userId) {
  return db.prepare("SELECT id FROM boards WHERE id = ? AND user_id = ?").get(boardId, userId);
}

// Create a list on a board
router.post("/", (req, res) => {
  const { boardId, title } = req.body;
  if (!boardId || !title) return res.status(400).json({ error: "boardId and title are required" });
  if (!ownsBoard(boardId, req.userId)) return res.status(404).json({ error: "Board not found" });

  const { maxPos } = db
    .prepare("SELECT COALESCE(MAX(position), -1) AS maxPos FROM lists WHERE board_id = ?")
    .get(boardId);

  const result = db
    .prepare("INSERT INTO lists (board_id, title, position) VALUES (?, ?, ?)")
    .run(boardId, title, maxPos + 1);

  res.status(201).json({ id: result.lastInsertRowid, board_id: boardId, title, position: maxPos + 1, cards: [] });
});

// Rename a list or change its position
router.patch("/:id", (req, res) => {
  const { title, position } = req.body;
  const list = db.prepare("SELECT * FROM lists WHERE id = ?").get(req.params.id);
  if (!list || !ownsBoard(list.board_id, req.userId)) {
    return res.status(404).json({ error: "List not found" });
  }

  db.prepare("UPDATE lists SET title = COALESCE(?, title), position = COALESCE(?, position) WHERE id = ?")
    .run(title ?? null, position ?? null, req.params.id);

  res.json({ ...list, title: title ?? list.title, position: position ?? list.position });
});

// Delete a list
router.delete("/:id", (req, res) => {
  const list = db.prepare("SELECT * FROM lists WHERE id = ?").get(req.params.id);
  if (!list || !ownsBoard(list.board_id, req.userId)) {
    return res.status(404).json({ error: "List not found" });
  }
  db.prepare("DELETE FROM lists WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

export default router;
