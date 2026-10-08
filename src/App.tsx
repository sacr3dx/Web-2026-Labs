import CreateNodeForm from "./forms/CreateNoteForm"
import NoteCard from "./note/NoteCard"
import type { Note, NoteDTO } from "./application/types"
import { useEffect, useState } from "react"
import { mapNoteFromDTO } from "./application/utils"
import DeleteNotes from "./forms/DeleteNote"

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    fetch("http://localhost:3000/notes")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`)
        } else {
          return res.json()
        }
      })
      .then((data: NoteDTO[]) => {
        setNotes(data.map(mapNoteFromDTO))
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError(
          "Database is sleep... Try this: 'npm run db'"
        )
      })
  }

  const handleSubmit = (note: Omit<Note, "id">) => {
    fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Addition error ${res.status}`)
        } else {
          return res.json()
        }
      })
      .then((note: NoteDTO) => {
        setNotes([...notes, mapNoteFromDTO(note)])
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError(
          "Database is sleep... Try this: 'npm run db'"
        )
      })
  }

  const handleDelete = async (
    ids: string[]
  ): Promise<void> => {
    const results = await Promise.all(
      ids.map((id) =>
        fetch(`http://localhost:3000/notes/${id}`, {
          method: "DELETE",
        })
      )
    )
    const failed = results.filter((r) => !r.ok)
    if (failed.length > 0) {
      setError(`Не удалось удалить ${failed.length}`)
      return
    }
    setNotes((prev) =>
      prev.filter((n) => !ids.includes(n.id))
    )
    setError(null)
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <CreateNodeForm
        onSubmit={handleSubmit}
        disabled={!!error}
      />

      <DeleteNotes notes={notes} onDelete={handleDelete} />

      <h1>Your notes:</h1>

      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}

export default App
