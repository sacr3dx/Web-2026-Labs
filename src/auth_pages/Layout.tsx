import { useAuthContext } from "../hooks/useAuthContext"
import { Navigate, Link, Outlet } from "react-router"

export default function Layout() {
  const { user, setUser } = useAuthContext()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-240 mx-auto flex items-center justify-between px-6 py-4 font-sans antialiased">
          <div>
            <Link
              to="/"
              className="text-xl font-semibold text-[#1a1a1a] hover:text-blue-600 transition-colors"
            >
              Notes
            </Link>
          </div>
          <div>
            <button
              onClick={() => setUser(null)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased p-6">
        <div className="max-w-240 mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  )
}
