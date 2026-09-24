import type { Note } from "../application/types"
import styles from './NoteCard.module.css'

interface Props {
    note: Note
 }

export default function NoteCard({note}: Props) {
    
    return (
        <div className={styles.container}>
          <h2 className={styles.noMargin}>{note.title}</h2>
          <div className={styles.row}>
            <p className={styles.noMargin}>{note.createdAt.toLocaleDateString()}</p>
            <p className={styles.noMargin}>{note.hidden ? 'Hidden' : 'Visible'}</p>
            <p className={styles.noMargin}>{note.tags.join(', ')}</p>
          </div>
          <p className={styles.noMargin}>{note.description}</p>
        </div>
    )
}