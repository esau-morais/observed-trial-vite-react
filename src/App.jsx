import { useEffect, useState } from 'react';
import { fetchBooks } from './api.js';

const shelves = [
  { id: 'reading', label: 'Reading' },
  { id: 'finished', label: 'Finished' },
];

function BookList({ books }) {
  const [label, setLabel] = useState('0 books');
  useEffect(() => {
    setLabel(`${books.length} books`);
  }, [books]);
  return (
    <ul aria-label={label}>
      {books.map((book) => (
        <li key={book.id}>
          <strong>{book.title}</strong> <span>{book.author}</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [shelf, setShelf] = useState(null);
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('Pick a shelf');

  async function open(id) {
    setShelf(id);
    setStatus('Loading…');
    try {
      const result = await fetchBooks(id);
      setBooks(result.books);
      setStatus(`${result.books.length} books`);
    } catch (error) {
      setBooks([]);
      setStatus(`Could not load books: ${error.message}`);
    }
  }

  return (
    <main>
      <h1>Reading list</h1>
      <nav aria-label="Shelves">
        {shelves.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={shelf === item.id}
            onClick={() => open(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <p role="status">{status}</p>
      <BookList books={books} />
    </main>
  );
}
