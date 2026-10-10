import CreateNodeForm from "./forms/CreateNoteForm"
import NoteFilterForm from "./forms/NoteFilterForm"
import NoteCard from "./note/NoteCard"
import type { Note, NoteDTO, NoteFilters } from "./application/types"
import { useEffect, useState } from "react"
import { mapNoteFromDTO } from "./application/utils"

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const [allTags, setAllTags] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const [filters, setFilters] = useState<NoteFilters>({})

  useEffect(() => {
    loadNotes()
  }, [filters])

  const loadNotes = async () => {
    const params = new URLSearchParams
    Object.values(filters).forEach((foo) => foo(params))
    const query = params.toString()
      ? `?${params.toString()}`
      : ""

    fetch(`http://localhost:3000/notes${query}`)
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

      fetch("http://localhost:3000/notes")
      .then((res) => res.json())
      .then((data: NoteDTO[]) => {
        setAllTags(Array.from(new Set(data.flatMap((note) => note.tags))))
      })
      .catch((err) => console.error(err))
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
        loadNotes()
        setNotes([mapNoteFromDTO(note), ...notes])
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
    loadNotes()
    setNotes((prev) =>
      prev.filter((n) => !ids.includes(n.id))
    )
    setError(null)
  }

  const filterNotes = (notes: Note[]): Note[] =>
    tagFilter.length
      ? notes.filter((note) => note.tags.some((tag) => tagFilter.includes(tag)))
      : notes

  const handleFilterChange = (
    filter: string,
    foo: (params: URLSearchParams) => void
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: foo}))
  } 

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="layout">
        <div className="main">
          <CreateNodeForm
            onSubmit={handleSubmit}
            disabled={!!error}
          />

          <h1>Your notes:</h1>

          {notes.length === 0 ? (
            <p>You have no notes yet</p>
          ) : filterNotes(notes).length === 0 ? (
            <p>No notes match the selected filters</p>
          ) : (
            filterNotes(notes).map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => handleDelete([note.id])}
              />
            ))
          )}
        </div>

        <div className="sidebar">
          <NoteFilterForm
            onFilterChange={handleFilterChange} onTagsChange={setTagFilter} tags={allTags}/>
        </div>
      </div>
    </div>
  )
}

export default App
