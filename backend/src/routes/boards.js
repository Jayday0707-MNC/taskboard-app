import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// List all boards for the logged-in user
router.get("/", (req, res) => {
  const boards = db
    .prepare("SELECT * FROM boards WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId);
  res.json(boards);
});

// Create a board
router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });

  const result = db
    .prepare("INSERT INTO boards (user_id, title) VALUES (?, ?)")
    .run(req.userId, title);
  res.status(201).json({ id: result.lastInsertRowid, title, user_id: req.userId });
});

// Get one board with its lists and cards
router.get("/:id", (req, res) => {
  const board = db
    .prepare("SELECT * FROM boards WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!board) return res.status(404).json({ error: "Board not found" });

  const lists = db
    .prepare("SELECT * FROM lists WHERE board_id = ? ORDER BY position")
    .all(board.id);

  const cards = db
    .prepare(
      `SELECT cards.* FROM cards
       JOIN lists ON cards.list_id = lists.id
       WHERE lists.board_id = ? ORDER BY cards.position`
    )
    .all(board.id);

  const listsWithCards = lists.map((list) => ({
    ...list,
    cards: cards.filter((c) => c.list_id === list.id),
  }));

  res.json({ ...board, lists: listsWithCards });
});

// Delete a board
router.delete("/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM boards WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: "Board not found" });
  res.status(204).send();
});

export default router;
