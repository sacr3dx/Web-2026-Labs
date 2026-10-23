import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type {
  NoteDTO,
  CreateNoteFormValues,
} from "../application/types"
import { mapNoteFromDTO } from "../application/utils"
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form"

export default function EditCardPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
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

  useEffect(() => {
    fetch(`http://localhost:3000/notes/${id}`)
      .then((res) => res.json())
      .then((data: NoteDTO) => {
        const note = mapNoteFromDTO(data)
        reset({
          title: note.title,
          description: note.description,
          hidden: note.hidden,
          tags: note.tags.join(", "),
        })
      })
  }, [id, reset])

  const handleFormSubmit: SubmitHandler<
    CreateNoteFormValues
  > = (data) => {
    const note = {
      title: data.title.trim(),
      description: data.description.trim(),
      hidden: data.hidden,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !!tag),
    }

    fetch(`http://localhost:3000/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }).then(() => {
      navigate(`/notes/${id}`)
    })
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
