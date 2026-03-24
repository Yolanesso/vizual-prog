import { useEffect, useState } from 'react';
import BookCard from './components/BookCard';

export interface BookData {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

function App() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);
  fetch('https://openlibrary.org/search.json?language=rus&q=russian&limit=50')
    .then(res => res.json())
    .then(data => {
      const withCovers = data.docs
        .filter((b: any) => b.cover_i)
        .slice(0, 25); 
      
      setBooks(withCovers);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, []);

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <h1 className="text-4xl font-serif font-black text-center mb-12 text-stone-800 border-b-2 border-stone-300 pb-4 max-w-2xl mx-auto">
        РУССКАЯ КЛАССИКА
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-stone-400 border-t-stone-800 rounded-full animate-spin mb-4"></div>
          <p className="text-stone-500 font-serif italic">Листаем страницы истории...</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center">
          {books.map((book) => (
            <BookCard 
              key={book.key}
              title={book.title}
              authors={book.author_name || ['Автор неизвестен']}
              coverId={book.cover_i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;