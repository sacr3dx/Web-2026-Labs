import type { Note, CreateNoteFormValues } from "../application/types"
import styles from "./Form.module.css"
import { 
  useForm,
  type SubmitHandler
  } from "react-hook-form"

interface Props {
  onSubmit: (note: Omit<Note, "id">) => void
  disabled?: boolean
}

export default function CreateNodeForm({
  onSubmit
}: Props) {
  const { 
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isValid }
  } = useForm<CreateNoteFormValues>({
    mode: "onBlur",
  })

  const handleFormSubmit: SubmitHandler<
    CreateNoteFormValues
  > = (data) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      createdAt: new Date(),
      hidden: data.hidden,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !!tag)
    })
    reset()
    setFocus('title')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={styles.title}>
        <p>Create new note</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Title"
          {...register("title", {
            validate: (value) => {
              return value.trim().length > 0
                ? true
                : "Title is required"
            }
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <textarea
          placeholder="Description"
          {...register("description")}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Tags"
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
            }
          })}
        />
        {errors.tags && <p>{errors.tags.message}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            {...register("hidden")}
          />
          Hidden
        </label>
      </div>

      <button type="submit" disabled={!isValid}>
        Add Note
      </button>
    </form>
  )
}
