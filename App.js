import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./App.css";
import Note from "./Note";

function App() {
  const [notes, setNotes] = useState(null);

  const fetchNotes = async () => {
    const response = await fetch("/notes");
    const result = await response.json();
    setNotes(result);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <aside className="Side">
        {notes &&
          notes.map((note) => (
            <Link to={`/notes/${note.id}`} className="Note-link">
              {note.title}
            </Link>
          ))}
      </aside>
      <main className="Main">
        <Routes>
          <Route path="/notes/:id" element={<Note onSubmit={fetchNotes} /> } />
        </Routes>
      </main>
    </>
  );
}

export default App;

