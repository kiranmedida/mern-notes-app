import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ fetchNotes wrapped with useCallback (fixes ESLint dependency issue)
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://mern-notes-app-6t9w.onrender.com/api/notes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch notes");
    }
  }, [token]);

  // ✅ Correct useEffect dependencies
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [fetchNotes, navigate, token]);

  const saveNote = async () => {
    if (!title || !content) return alert("Fill all fields");

    try {
      if (editId) {
        const res = await axios.put(
          `https://mern-notes-app-6t9w.onrender.com/api/notes/${editId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(notes.map(n => (n._id === editId ? res.data : n)));
      } else {
        const res = await axios.post(
          "https://mern-notes-app-6t9w.onrender.com/api/notes",
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes([res.data, ...notes]);
      }

      setTitle("");
      setContent("");
      setEditId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `https://mern-notes-app-6t9w.onrender.com/api/notes/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  // ✅ editNote defined (fixes previous build failure)
  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="notes-container">
      <header>
        <h2>My Notes 📝</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="dark-toggle"
            onClick={() => {
              document.body.classList.toggle("dark");
              localStorage.setItem(
                "theme",
                document.body.classList.contains("dark") ? "dark" : "light"
              );
            }}
          >
            🌙 / ☀️
          </button>

          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="note-form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="primary-btn" onClick={saveNote}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-card" key={note._id}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <div className="actions">
              <button onClick={() => editNote(note)}>Edit</button>
              <button onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
