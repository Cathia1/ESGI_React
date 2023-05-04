import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import "./Note.css";

const Note = ({onSubmit}) => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);

  const filteredNotes = notes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();
    const searchTerm = search.toLowerCase();
    return title.includes(searchTerm) || content.includes(searchTerm);
  });
  
  const fetchNote = useCallback(async () => {
    try {
      const response = await fetch(`/notes/${id}`);
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [id, fetchNote]);

  const handleSaveNote = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  };

  const handleDeleteNote = async () => {
    try {
      await fetch(`/notes/${id}`, {
        method: "DELETE",
      });
      setNote(null);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch(`/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Nouvelle note", content: "" }),
      });
      const result = await response.json();
      setNote(result);
    } catch (error) {
      setError(error);
    }
    onSubmit();
  };

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div className="Note">
      <form className="Form" onSubmit={handleSaveNote}>
        <input
          className="Note-editable Note-title"
          type="text"
          value={note ? note.title : ""}
          onChange={(event) => {
            setNote({ ...note, title: event.target.value });
          }}
        />
        <input
          className="Note-editable Note-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une note"
        />
        

        <textarea
          className="Note-editable Note-content"
          value={note ? note.content : ""}
          onChange={(event) => {
            setNote({ ...note, content: event.target.value });
          }}
        />
        <div className="Note-actions">
          <button className="Button" type="submit">
            Enregistrer
          </button>
          {note && (
            <button className="Button" onClick={handleDeleteNote}>
              Supprimer
            </button>
          )}
          <button className="Button" onClick={handleCreateNote}>
            Ajouter une note
          </button>
        </div>
      </form>
    </div>
  );
};

export default Note;

