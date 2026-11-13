import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type {
  CreateNoteFormValues,
  Note,
} from "../application/types"
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import {
  fetchNote,
  updateNote,
  type NotesPage,
} from "../application/api"

export default function EditCardPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateNoteFormValues>({
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      hidden: false,
      tags: "",
    },
  })

  const {
    data: note,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: fetchNote,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!note) return
    reset({
      title: note.title,
      description: note.description,
      hidden: note.hidden,
      tags: note.tags.join(", "),
    })
  }, [note, reset])

  const { mutate: saveNote, error: saveError } =
    useMutation({
      mutationFn: updateNote,
      onMutate: async (updatedNote) => {
        await queryClient.cancelQueries({
          queryKey: ["note", id],
        })
        await queryClient.cancelQueries({
          queryKey: ["notes"],
        })

        const previousNote = queryClient.getQueryData<Note>(
          ["note", id]
        )
        const previousLists = queryClient.getQueriesData<
          InfiniteData<NotesPage>
        >({ queryKey: ["notes"] })

        if (previousNote) {
          queryClient.setQueryData<Note>(["note", id], {
            ...previousNote,
            ...updatedNote,
          })
        }

        queryClient.setQueriesData<InfiniteData<NotesPage>>(
          { queryKey: ["notes"] },
          (old) =>
            old && {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                notes: page.notes.map((note) =>
                  note.id === id
                    ? { ...note, ...updatedNote }
                    : note
                ),
              })),
            }
        )

        return { previousNote, previousLists }
      },
      onError: (_err, _updatedNote, context) => {
        if (context?.previousNote) {
          queryClient.setQueryData(
            ["note", id],
            context.previousNote
          )
        }
        context?.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["note", id],
        })
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        })
        navigate(`/notes/${id}`)
      },
    })

  const handleFormSubmit: SubmitHandler<
    CreateNoteFormValues
  > = (data) => {
    saveNote({
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      hidden: data.hidden,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !!tag),
    })
  }

  if (loadError) {
    return (
      <p className="text-red-500">
        {loadError.message}
      </p>
    )
  }

  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>
  }

  return (
    <form
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="border-b border-gray-100 pb-3">
        <p className="m-0 text-lg font-semibold text-gray-900">
          Edit note
        </p>
      </div>

      {saveError && (
        <p className="text-red-500">{saveError.message}</p>
      )}

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Title"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
            errors.title
              ? "border-red-500"
              : "border-gray-300"
          }`}
          {...register("title", {
            validate: (value) => {
              return value.trim().length > 0
                ? true
                : "Title is required"
            },
          })}
        />
        {errors.title && (
          <p className="m-0 text-xs text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
          {...register("description")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
            errors.tags
              ? "border-red-500"
              : "border-gray-300"
          }`}
          {...register("tags", {
            validate: (value) => {
              const tags = value
                .trim()
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => !!tag)
              return tags.length > 5
                ? "You can add max 5 tags"
                : true
            },
          })}
        />
        {errors.tags && (
          <p className="m-0 text-xs text-red-500">
            {errors.tags.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            {...register("hidden")}
          />
          Hidden
        </label>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Save Note
      </button>
    </form>
  )
}
