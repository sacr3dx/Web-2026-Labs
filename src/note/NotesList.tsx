import { useEffect, useMemo } from "react"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import NoteCard from "./NoteCard"
import type { Note } from "../application/types"
import {
  deleteNotes,
  fetchNotes,
  type NotesPage,
} from "../application/api"

interface Props {
  query: string
  tagFilter: string[]
  onAvailableTagsChange: (tags: string[]) => void
}

export default function NotesList({
  query,
  tagFilter,
  onAvailableTagsChange,
}: Props) {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notes", query] as const,
    queryFn: fetchNotes,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const notes = useMemo(
    () => data?.pages.flatMap((page) => page.notes) ?? [],
    [data]
  )

  useEffect(() => {
    onAvailableTagsChange(
      Array.from(new Set(notes.flatMap((note) => note.tags)))
    )
  }, [notes, onAvailableTagsChange])

  const { mutate: removeNotes, error: deleteError } =
    useMutation({
      mutationFn: deleteNotes,
      onMutate: async (ids) => {
        await queryClient.cancelQueries({
          queryKey: ["notes"],
        })

        const previous = queryClient.getQueriesData<
          InfiniteData<NotesPage>
        >({ queryKey: ["notes"] })

        queryClient.setQueriesData<InfiniteData<NotesPage>>(
          { queryKey: ["notes"] },
          (old) =>
            old && {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                notes: page.notes.filter(
                  (note) => !ids.includes(note.id)
                ),
              })),
            }
        )

        return { previous }
      },
      onError: (_err, _ids, context) => {
        context?.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
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

  return (
    <>
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
      {deleteError && (
        <p className="text-red-500">
          {deleteError.message}
        </p>
      )}

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
              onDelete={() => removeNotes([note.id])}
            />
          ))}

          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="self-center px-4 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isFetchingNextPage
                ? "Loading..."
                : "Load more"}
            </button>
          )}
        </div>
      )}
    </>
  )
}
