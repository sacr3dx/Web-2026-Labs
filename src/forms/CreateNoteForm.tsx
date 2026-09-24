import { useState } from "react"
import type { Note } from "../application/types"
import styles from './Form.module.css';

interface Props {
    onSubmit: (note: Note) => void
    disabled?: boolean
}

export default function CreateNodeForm({onSubmit, disabled}: Props) {
    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState('')

    const [description, setDescription] = useState('')
    const [hidden, setHidden] = useState(false)

    const [tags, setTags] = useState<string>('')
    const [tagsError, setTagsError] = useState('')


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const curentTitle = title.trim()
        if(curentTitle.length == 0) {
            setTitleError('Title is none!')
            return
        }

        const curentTags = tags
        .trim()
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => !!tag)
        if (curentTags.length > 5){
            setTagsError('You can add only 5 tags!')
            return
        }
            
        const note: Note = {
            id: Date.now().toString(),
            title: curentTitle,
            description,
            createdAt: new Date(),
            hidden,
            tags: curentTags
        }
        onSubmit(note)
        setTitle('')
        setTitleError('')

        setDescription('')
        setHidden(false)

        setTags('')
        setTagsError('')
      }

    return (
     <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.title}>
        <p>Create new note</p>
    </div>
    <div>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        {titleError && <p className={styles.error}>{titleError}</p>}
    </div>

    <div>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
    </div>

    <div>
        <input type="text" placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)}/>
        {tagsError && <p className={styles.error}>{tagsError}</p>}
    </div>

    <div>
        <label>
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)}/>
        Hidden
        </label>
    </div>

    <button type="submit" disabled ={disabled}>Add Note</button>
    </form>
    )
}