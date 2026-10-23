import { useNavigate } from "react-router"
import type { Note } from "../application/types"

interface Props {
  note: Note
  onDelete: () => void
}

export default function NoteCard({
  note,
  onDelete,
}: Props) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/notes/${note.id}`)}
      className={`relative p-4 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 group cursor-pointer ${
        note.hidden
          ? "bg-gray-100 text-gray-400"
          : "bg-white text-gray-900"
      }`}
    >
      <h2 className="mt-0 mb-2 text-lg font-semibold truncate pr-16">
        {note.title}
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm opacity-80">
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
      <p className="m-0 line-clamp-3">{note.description}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Delete
      </button>
    </div>
  )
}
