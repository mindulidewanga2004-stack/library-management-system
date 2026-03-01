export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string | null;
}

const baseUrl = "http://localhost:5236";

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${baseUrl}/api/Books`);
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`);
  return res.json();
}

export async function createBook(
  book: Omit<Book, "id">
): Promise<Book> {
  const res = await fetch(`${baseUrl}/api/Books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`Failed to create book: ${res.status}`);
  return res.json();
}

export async function updateBook(
  id: number,
  book: Omit<Book, "id">
): Promise<void> {
  const res = await fetch(`${baseUrl}/api/Books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // IMPORTANT: backend requires body id to match route id
    body: JSON.stringify({ id, ...book }),
  });
  if (!res.ok) throw new Error(`Failed to update book: ${res.status}`);
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/api/Books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete book: ${res.status}`);
}
