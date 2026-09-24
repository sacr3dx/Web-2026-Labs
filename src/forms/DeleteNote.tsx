import { useState } from "react"
import type { Note } from "../application/types"
import styles from './DeleteForm.module.css';

interface Props {
    onDelete: (ids: string[]) => void
    notes: Note[]
}

export default function DeleteNotes({onDelete, notes}: Props) {
    const [deletedNotes, setDeletedNotes] = useState<string[]>([])
    const [isOpen, setIsOpen] = useState(false) 

    const toggleSelect = (id: string) => {
        setDeletedNotes((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]

        )
    }

    const handleDelete = () => {
        if (deletedNotes.length == 0){
            return 
        }

        onDelete(deletedNotes)
        setDeletedNotes([])
        setIsOpen(false)
    }

    return (
      <div className={styles.container}>
    <h3 className={styles.title}>Delete notes</h3>

    <button type="button" onClick={() => setIsOpen((v) => !v)}>
      {deletedNotes.length === 0
        ? 'Select notes…'
        : `Selected: ${deletedNotes.length}`}
      {' '}
      {isOpen ? '-' : '+'}
    </button>

    {isOpen && (
      <div className={styles.list}>
        {notes.map((note) => (
          <label key={note.id}>
            <input
              type="checkbox"
              checked={deletedNotes.includes(note.id)}
              onChange={() => toggleSelect(note.id)}
            />
            {note.title}
          </label>
        ))}
      </div>
    )}

    <button
      type="button"
      className={styles.danger}
      onClick={handleDelete}
      disabled={deletedNotes.length === 0}
    >
      Delete selected ({deletedNotes.length})
    </button>
  </div>
  )
}