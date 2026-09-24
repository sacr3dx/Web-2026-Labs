export interface Note {
    id: string
    title: string
    description: string
    createdAt: Date
    hidden: boolean
    tags: string[]
}

export interface NoteDTO{
    id: string
    title: string
    description: string
    createdAt: string
    hidden: boolean
    tags: string[]
}