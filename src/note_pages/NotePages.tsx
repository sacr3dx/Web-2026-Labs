import NoteFilterForm from "../forms/NoteFilterForm"
import NoteCard from "../note/NoteCard"
import type {
  Note,
  NoteDTO,
  NoteFilters,
} from "../application/types"
import { useEffect, useState } from "react"
import { mapNoteFromDTO } from "../application/utils"
import { useAuthContext } from "../hooks/useAuthContext"
import { Link } from "react-router"

export default function NotesPages() {
  const { user } = useAuthContext()

  const [notes, setNotes] = useState<Note[]>([])
  const [error, setError] = useState<string | null>(null)

  const [allTags, setAllTags] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const [filters, setFilters] = useState<NoteFilters>({
    authorId: (params) => params.set("author_id", user!.id),
  })

  useEffect(() => {
    loadNotes()
  }, [filters])

  const loadNotes = async () => {
    const params = new URLSearchParams()
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
        setAllTags(
          Array.from(
            new Set(data.flatMap((note) => note.tags))
          )
        )
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
    const remainingNotes = notes.filter(
      (n) => !ids.includes(n.id)
    )
    setNotes(remainingNotes)
    setAllTags(
      Array.from(
        new Set(remainingNotes.flatMap((note) => note.tags))
      )
    )
    setError(null)
  }

  const filterNotes = (notes: Note[]): Note[] =>
    tagFilter.length
      ? notes.filter((note) =>
          note.tags.some((tag) => tagFilter.includes(tag))
        )
      : notes

  const handleFilterChange = (
    filter: string,
    foo: (params: URLSearchParams) => void
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: foo }))
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased p-6">
      <div className="max-w-240 mx-auto">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold m-0">
            Your notes:
          </h1>
          <Link
            to="/notes/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-colors no-underline"
          >
            Create Note
          </Link>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            {notes.length === 0 ? (
              <p className="text-gray-500">
                You have no notes yet
              </p>
            ) : filterNotes(notes).length === 0 ? (
              <p className="text-gray-500">
                No notes match the selected filters
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {filterNotes(notes).map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={() => handleDelete([note.id])}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-70 shrink-0 sticky top-6">
            <NoteFilterForm
              onFilterChange={handleFilterChange}
              onTagsChange={setTagFilter}
              tags={allTags}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
