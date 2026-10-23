import { createContext, useContext, useState } from "react"
import type {
  AuthContextType,
  User,
} from "../application/types"

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")!) || null
      )
    } catch {
      return null
    }
  })
  const handleUserChange = (user: User | null) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }
  return (
    <AuthContext.Provider
      value={{ user, setUser: handleUserChange }}
    >
      {children}
    </AuthContext.Provider>
  )
}
