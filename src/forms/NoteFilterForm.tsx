import { useState } from "react"
import styles from "./Form.module.css"

interface Props{
    onFilterChange: (
        filter: string,
        foo: (params: URLSearchParams) => void
    ) => void,
    onTagsChange: (tags: string[]) => void,
    tags: string[]
}

export default function NoteFilterForm({onFilterChange, onTagsChange, tags}: Props){
    const [search, setSearch] = useState("")
    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearch(e.target.value)
        onFilterChange("search", (params) => {
            const value = e.target.value.trim()
            if (value) {
                params.set("title:contains", e.target.value.trim())
            }
        })
    }

    const [tagsShow, setTagsShow] = useState<string[]>([])
    const handleTagToggle = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
    const tag = e.target.value
    const checked = e.target.checked

    const next = checked
        ? [...tagsShow, tag]
        : tagsShow.filter((t) => t !== tag)

    setTagsShow(next)

    onTagsChange(next)
}

    const[showHidden, setShowHidden] = useState(true)
    const handleShowHiddenChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setShowHidden(e.target.checked)
        onFilterChange("showHidden", (params) => {
            if (!e.target.checked){
                params.set("hidden", "false")
            }
        })
    }

    return (
        <div className={styles.form}>
            <div className={styles.title}>
            <p>Filters</p>
            </div>

            <div>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
            />
            </div>

            <div>
            <p>Tag filter</p>
            {tags.map((tag) => (
                <label key={tag}>
                <input
                    type="checkbox"
                    value={tag}
                    checked={tagsShow.includes(tag)}
                    onChange={handleTagToggle}
                />
                {tag}
                </label>
            ))}
            </div>

            <div>
            <label>
                <input
                type="checkbox"
                checked={showHidden}
                onChange={handleShowHiddenChange}
                />
                Show Hidden
            </label>
            </div>
        </div>
        )
}