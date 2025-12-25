const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* GET NOTES */
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ADD NOTE */
router.post("/", auth, async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    });
    await note.save();
    res.json(note);
  } catch {
    res.status(500).json({ message: "Add failed" });
  }
});

/* UPDATE NOTE */
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = req.body.title;
    note.content = req.body.content;
    await note.save();

    res.json(note);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

/* DELETE NOTE */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
