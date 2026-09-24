import type { Note, NoteDTO } from "./types";

export function mapNoteFromDTO(note: NoteDTO): Note {
    return {
        id: note.id,
        title: note.title,
        description: note.description,
        createdAt: new Date(note.createdAt),
        hidden: note.hidden,
        tags: note.tags
    }
}