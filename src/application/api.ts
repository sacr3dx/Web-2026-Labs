import type { QueryFunctionContext } from "@tanstack/react-query"
import type { Note, NoteDTO } from "./types"
import { mapNoteFromDTO } from "./utils"

const API_URL = import.meta.env.API_URL

export function fetchNotes({
  queryKey: [, query],
  signal,
}: QueryFunctionContext<readonly ["notes", string]>): Promise<
  Note[]
> {
  return fetch(
    `${API_URL}/notes${query ? `?${query}` : ""}`,
    { signal }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`)
      }
      return res.json()
    })
    .then((data: NoteDTO[]) => data.map(mapNoteFromDTO))
}

export function fetchNote({
  queryKey: [, id],
  signal,
}: QueryFunctionContext<readonly ["note", string]>): Promise<Note> {
  return fetch(`${API_URL}/notes/${id}`, { signal })
    .then((res) => res.json())
    .then(mapNoteFromDTO)
}

export function createNote(
  note: Omit<Note, "id">
): Promise<Response> {
  return fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
}

export type EditNotePayload = Pick<
  Note,
  "id" | "title" | "description" | "hidden" | "tags"
>

export function updateNote({
  id,
  ...note
}: EditNotePayload): Promise<Response> {
  return fetch(`${API_URL}/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
}

export async function deleteNotes(
  ids: string[]
): Promise<void> {
  const results = await Promise.all(
    ids.map((id) =>
      fetch(`${API_URL}/notes/${id}`, { method: "DELETE" })
    )
  )
  const failed = results.filter((r) => !r.ok)
  if (failed.length > 0) {
    throw new Error(`Delete error ${failed.length}`)
  }
}
