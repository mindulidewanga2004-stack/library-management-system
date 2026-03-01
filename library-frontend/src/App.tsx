import { useEffect, useState } from "react";
import "./App.css";
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
  type Book,
} from "./api/books";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);

  // add form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError("Title and Author are required.");
      return;
    }

    try {
      await createBook({
        title: title.trim(),
        author: author.trim(),
        description: description.trim() ? description.trim() : null,
      });

      setTitle("");
      setAuthor("");
      setDescription("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function startEdit(b: Book) {
    setEditingId(b.id);
    setEditTitle(b.title);
    setEditAuthor(b.author);
    setEditDescription(b.description ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditAuthor("");
    setEditDescription("");
  }

  async function saveEdit() {
    if (editingId === null) return;

    setError(null);

    if (!editTitle.trim() || !editAuthor.trim()) {
      setError("Title and Author are required.");
      return;
    }

    try {
      await updateBook(editingId, {
        title: editTitle.trim(),
        author: editAuthor.trim(),
        description: editDescription.trim() ? editDescription.trim() : null,
      });

      cancelEdit();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function onDelete(id: number) {
    setError(null);
    try {
      await deleteBook(id);
      if (editingId === id) cancelEdit();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="appShell">
      <div className="panel" style={{ width: "min(560px, 92vw)" }}>
        <div className="headerRow">
          <h1 style={{ margin: 0 }}>Library Management System</h1>
          <span className="badge"> Manage your books with ease</span>
        </div>

        <form onSubmit={onAdd} className="grid" style={{ marginTop: 14 }}>
          <div className="row">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <button className="primary" type="submit">
            Add book
          </button>
        </form>

        {error && (
          <div className="errorBox" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          {loading ? (
            <div>Loading…</div>
          ) : (
            <div className="grid">
              {books.map((b) => (
                <div key={b.id} className="bookCard">
                  {editingId === b.id ? (
                    <div className="grid">
                      <div className="row">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <input
                          value={editAuthor}
                          onChange={(e) => setEditAuthor(e.target.value)}
                          placeholder="Author"
                        />
                      </div>

                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={3}
                      />

                      <div className="row">
                        <button
                          className="primary"
                          type="button"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button type="button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bookTitle">
                        #{b.id} — {b.title}
                      </div>
                      <div className="bookMeta">by {b.author}</div>

                      {b.description ? (
                        <p style={{ marginTop: 8 }}>{b.description}</p>
                      ) : null}

                      <div className="row" style={{ marginTop: 10 }}>
                        <button type="button" onClick={() => startEdit(b)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          type="button"
                          onClick={() => onDelete(b.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {books.length === 0 ? (
                <div className="emptyState">
                  <div className="emptyIcon" aria-hidden="true">
                    📖
                  </div>
                  <div style={{ fontWeight: 700 }}>No books yet</div>
                  <div style={{ color: "rgba(255,255,255,0.72)" }}>
                    Add your first book using the form above.
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}