import { useEffect, useState } from "react"
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
    const selectedTags = tagsShow.filter((tag) => tags.includes(tag))

    useEffect(() => {
        if (selectedTags.length !== tagsShow.length) {
            onTagsChange(selectedTags)
        }
    }, [tags])

    const handleTagToggle = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const tag = e.target.value
        const checked = e.target.checked

        const next = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag)

        setTagsShow(next)
        onTagsChange(next)
    }

    const[sort, setSort] = useState("-createdAt")
    const handleSortChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value
        setSort(value)
        onFilterChange("sort", (params) => {
            params.set("_sort", value)
        })
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
            <div className={styles.field}>
                <p className={styles.label}>Tag filter</p>

                <div className={styles.tags}>
                    {tags.length === 0 ? (
                        <p>Tags not found</p>
                    ) : (
                        tags.map((tag) => {
                        const active = selectedTags.includes(tag)
                        return (
                            <label
                            key={tag}
                            className={`${styles.tag} ${active ? styles.tagActive : ''}`}
                            >
                            <input
                                type="checkbox"
                                value={tag}
                                checked={active}
                                onChange={handleTagToggle}
                            />
                            {tag}
                            </label>
                        )
                        })
                    )}
                    </div>
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="sort-select">
                    Date filter
                </label>
                <select
                    id="sort-select"
                    className={styles.select}
                    value={sort}
                    onChange={handleSortChange}
                >
                    <option value="-createdAt">Newest first</option>
                    <option value="createdAt">Oldest first</option>
                </select>
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