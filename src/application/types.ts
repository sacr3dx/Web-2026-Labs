export interface Note {
  id: string
  author_id: string
  title: string
  description: string
  createdAt: Date
  hidden: boolean
  tags: string[]
}

export interface NoteDTO {
  id: string
  author_id: string
  title: string
  description: string
  createdAt: string
  hidden: boolean
  tags: string[]
}

export type CreateNoteFormValues = {
  title: string
  description: string
  hidden: boolean
  tags: string
}

export type NoteFilters = Record<
  string,
  (params: URLSearchParams) => void
>

export type LoginFormValues = {
  email: string
  password: string
}

export type RegistrationFormValues = {
  email: string
  password_first: string
  password_seccond: string
}

export interface User {
  id: string
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
}
