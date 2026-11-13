import NoteFilterForm from "../forms/NoteFilterForm"
import NoteCard from "../note/NoteCard"
import type {
  Note,
  NoteDTO,
  NoteFilters,
} from "../application/types"
import { useMemo, useState } from "react"
import { mapNoteFromDTO } from "../application/utils"
import { useAuthContext } from "../hooks/useAuthContext"
import { Link } from "react-router"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

export default function NotesPages() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()

  const [tagFilter, setTagFilter] = useState<string[]>([])

  const [filters, setFilters] = useState<NoteFilters>({
    authorId: (params) => params.set("author_id", user!.id),
  })

  const query = useMemo(() => {
    const params = new URLSearchParams()
    Object.values(filters).forEach((foo) => foo(params))
    return params.toString()
  }, [filters])

  const {
    isLoading,
    error,
    data: notes = [],
  } = useQuery<Note[]>({
    queryKey: ["notes", query],
    queryFn: () =>
      fetch(
        `http://localhost:3000/notes${query ? `?${query}` : ""}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server responded ${res.status}`)
          }
          return res.json()
        })
        .then((data: NoteDTO[]) => data.map(mapNoteFromDTO)),
  })

  const allTags = useMemo(
    () => Array.from(new Set(notes.flatMap((note) => note.tags))),
    [notes]
  )

  const { mutate: deleteNotes, error: deleteError } =
    useMutation({
      mutationFn: async (ids: string[]) => {
        const results = await Promise.all(
          ids.map((id) =>
            fetch(`http://localhost:3000/notes/${id}`, {
              method: "DELETE",
            })
          )
        )
        const failed = results.filter((r) => !r.ok)
        if (failed.length > 0) {
          throw new Error(`Delete error ${failed.length}`)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        })
      },
    })

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
        {error && (
          <p className="text-red-500">{error.message}</p>
        )}
        {deleteError && (
          <p className="text-red-500">
            {deleteError.message}
          </p>
        )}

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
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : notes.length === 0 ? (
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
                    onDelete={() => deleteNotes([note.id])}
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
