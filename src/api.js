const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4010';

export async function fetchBooks(shelf) {
  const response = await fetch(`${API_URL}/api/books?shelf=${shelf}`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.json();
}
