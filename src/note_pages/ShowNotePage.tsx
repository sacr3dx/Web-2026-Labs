import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import type { Note, NoteDTO } from "../application/types"
import { mapNoteFromDTO } from "../application/utils"

export default function ShowNotePage() {
  const { id = "" } = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://localhost:3000/notes/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`)
        } else {
          return res.json()
        }
      })
      .then((data: NoteDTO) => {
        setNote(mapNoteFromDTO(data))
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError(
          "Database is sleep... Try this: 'npm run db'"
        )
      })
  }, [id])

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!note) {
    return <p className="text-gray-500">Loading...</p>
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <p className="m-0 text-lg font-semibold text-gray-900">
          {note.title}
        </p>
        <Link
          to={`/notes/${note.id}/edit`}
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 transition-colors no-underline"
        >
          Edit Note
        </Link>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <p className="m-0">
          {note.createdAt.toLocaleDateString()}
        </p>
        <p className="m-0 font-medium">
          {note.hidden ? "Hidden" : "Visible"}
        </p>
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="m-0 whitespace-pre-wrap">
        {note.description}
      </p>

      <Link
        to="/notes"
        className="text-sm text-blue-600 hover:text-blue-700 no-underline"
      >
        Back to notes
      </Link>
    </div>
  )
}
