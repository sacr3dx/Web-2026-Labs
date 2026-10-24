import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import HomePage from "./auth_pages/HomePage"
import LoginPage from "./auth_pages/LoginPage"
import RegistrationPage from "./auth_pages/RegistrationPage"
import ErrorPage from "./auth_pages/ErrorPage"
import NotesPages from "./note_pages/NotePages"
import { AuthProvider } from "./hooks/useAuthContext"
import Layout from "./auth_pages/Layout"
import CreateNotePage from "./note_pages/CreateNotePage"
import ShowNotePage from "./note_pages/ShowNotePage"
import EditCardPage from "./note_pages/EditCardPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/notes",
        element: <NotesPages />,
      },
      {
        path: "/notes/new",
        element: <CreateNotePage />,
      },
      {
        path: "/notes/:id",
        element: <ShowNotePage />,
      },
      {
        path: "/notes/:id/edit",
        element: <EditCardPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
