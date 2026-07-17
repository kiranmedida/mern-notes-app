import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://mern-notes-app-6t9w.onrender.com/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Toast Helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load notes. Please refresh.", "error");
    }
  }, [token]);

  // Check dark mode status on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const hasDarkClass = document.body.classList.contains("dark");
    if (savedTheme === "dark" || hasDarkClass) {
      setIsDark(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Check auth and fetch notes
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [fetchNotes, navigate, token]);

  // Save / Update note
  const saveNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Please fill in both title and content", "warning");
      return;
    }

    setIsSaving(true);
    try {
      if (editId) {
        const res = await axios.put(
          `${API_BASE}/notes/${editId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(notes.map((n) => (n._id === editId ? res.data : n)));
        showToast("Note updated successfully");
      } else {
        const res = await axios.post(
          `${API_BASE}/notes`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes([res.data, ...notes]);
        showToast("Note added successfully");
      }

      // Reset form
      setTitle("");
      setContent("");
      setEditId(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to save note. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`${API_BASE}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
      showToast("Note deleted successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete note. Please try again.", "error");
    }
  };

  // Set note to editor
  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  // Toggle theme
  const toggleTheme = () => {
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    if (isNowDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Format Date utility
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get User details for greeting
  const userEmail = localStorage.getItem("userEmail") || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();
  const userName = userEmail.split("@")[0];

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notes-container">
      {/* Sticky Header */}
      <header>
        <h2>
          <span className="logo-icon">S</span>
          Scribble
        </h2>

        {/* Search */}
        <div className="search-container">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "15px", height: "15px" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Toolbar */}
        <div className="header-actions">
          <div className="avatar-badge">
            <div className="avatar-circle">{userInitial}</div>
            <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Hi, {userName}
            </span>
          </div>

          <button className="dark-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
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

      {/* Note Adder Editor */}
      <div className="note-form">
        <input
          placeholder="Title"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="note-form-footer">
          <span className="char-counter">{content.length} characters</span>
          <div style={{ display: "flex", gap: "10px" }}>
            {editId && (
              <button className="secondary-btn" onClick={cancelEdit} disabled={isSaving}>
                Cancel
              </button>
            )}
            <button className="primary-btn" onClick={saveNote} disabled={isSaving}>
              {isSaving ? "Saving..." : editId ? "Update Note" : "Add Note"}
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div className="note-card" key={note._id}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <div className="note-card-footer">
                <span className="note-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "12px", height: "12px", marginRight: "4px" }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatDate(note.createdAt)}
                </span>
                <div className="actions">
                  <button className="edit-btn" onClick={() => editNote(note)} aria-label="Edit note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}>
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteNote(note._id)} aria-label="Delete note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "14px", height: "14px" }}>
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">📝</span>
            {searchQuery ? (
              <>
                <h3>No notes found</h3>
                <p>No notes matched "{searchQuery}". Try refining your search query.</p>
              </>
            ) : (
              <>
                <h3>Start your journey</h3>
                <p>You don't have any notes yet. Create your first note above to get started!</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Toast Portal */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div className={`toast ${t.type}`} key={t.id}>
            <div className="toast-icon">
              {t.type === "success" && "✅"}
              {t.type === "error" && "❌"}
              {t.type === "warning" && "⚠️"}
            </div>
            <div className="toast-content">{t.message}</div>
            <button
              className="toast-close"
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              aria-label="Close Toast"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "12px", height: "12px" }}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
