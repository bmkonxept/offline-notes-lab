import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  body: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  function saveNote() {
    if (!title.trim() && !body.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      title,
      body,
    };

    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setTitle("");
    setBody("");
  }

  function deleteNote(id: number) {
    const updatedNotes = notes.filter((note) => note.id !== id);

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }

  return (
    <main>
      <h1>Offline Notes Lab</h1>

      <section>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button onClick={saveNote}>Save Note</button>
      </section>

      <section>
        <h2>My Notes</h2>

        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <article key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}