import { Link } from "react-router"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4 text-center">
        <div className="border-b border-gray-100 pb-3">
          <p className="m-0 text-lg font-semibold text-gray-900">
            404
          </p>
          <p className="m-0 mt-1 text-sm text-gray-500">
            Page not found.
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2transition-colors no-underline"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
