import NoteFilterForm from "../forms/NoteFilterForm"
import NotesList from "../note/NotesList"
import type { NoteFilters } from "../application/types"
import { useMemo, useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { Link } from "react-router"

export default function NotesPages() {
  const { user } = useAuthContext()

  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const [filters, setFilters] = useState<NoteFilters>({
    authorId: (params) => params.set("author_id", user!.id),
  })

  const query = useMemo(() => {
    const params = new URLSearchParams()
    Object.values(filters).forEach((foo) => foo(params))
    return params.toString()
  }, [filters])

  const handleFilterChange = (
    filter: string,
    foo: (params: URLSearchParams) => void
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: foo }))
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased p-6">
      <div className="max-w-240 mx-auto">
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
            <NotesList
              query={query}
              tagFilter={tagFilter}
              onAvailableTagsChange={setAllTags}
            />
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
