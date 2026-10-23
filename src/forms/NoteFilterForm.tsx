import { useEffect, useState } from "react"

interface Props {
  onFilterChange: (
    filter: string,
    foo: (params: URLSearchParams) => void
  ) => void
  onTagsChange: (tags: string[]) => void
  tags: string[]
}

export default function NoteFilterForm({
  onFilterChange,
  onTagsChange,
  tags,
}: Props) {
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
  const selectedTags = tagsShow.filter((tag) =>
    tags.includes(tag)
  )

  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    if (selectedTags.length !== tagsShow.length) {
      onTagsChange(selectedTags)
    }
  }, [tags])

  useEffect(() => {
    onFilterChange("showHidden", (params) => {
      if (!showHidden) {
        params.set("hidden", "false")
      }
    })
  }, [showHidden])

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

  const [sort, setSort] = useState("-createdAt")
  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value
    setSort(value)
    onFilterChange("sort", (params) => {
      params.set("_sort", value)
    })
  }

  const handleShowHiddenChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowHidden(e.target.checked)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="m-0 text-lg font-semibold text-gray-900">
          Filters
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 text-sm font-medium text-gray-700">
          Tag filter
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="m-0 text-sm text-gray-500">
              Tags not found
            </p>
          ) : (
            tags.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <label
                  key={tag}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full cursor-pointer select-none transition-colors border ${
                    active
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tag}
                    checked={active}
                    onChange={handleTagToggle}
                    className="hidden" // Прячем стандартный чекбокс, так как цвет пилюли уже показывает выбор
                  />
                  {tag}
                </label>
              )
            })
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-gray-700 mb-1"
          htmlFor="sort-select"
        >
          Date filter
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        >
          <option value="-createdAt">Newest first</option>
          <option value="createdAt">Oldest first</option>
        </select>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={handleShowHiddenChange}
            className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
          />
          Show Hidden
        </label>
      </div>
    </div>
  )
}
