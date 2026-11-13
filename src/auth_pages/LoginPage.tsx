import { Link, useNavigate } from "react-router"
import type { LoginFormValues } from "../application/types"
import { useForm } from "react-hook-form"
import { useAuthContext } from "../hooks/useAuthContext"
import { useMutation } from "@tanstack/react-query"
import { login } from "../application/api"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
  })

  const { mutate: submitLogin, error } = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user)
      navigate("/notes")
    },
  })

  const handleLogin = (data: LoginFormValues) => {
    submitLogin(data)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="border-b border-gray-100 pb-3">
          <p className="m-0 text-lg font-semibold text-gray-900">
            Login
          </p>
        </div>

        {error && (
          <p className="text-red-500">{error.message}</p>
        )}

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            {...register("password", { required: true })}
          />
          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Login
          </button>
        </form>
        <Link
          to="/register"
          className="text-center text-sm text-blue-600 hover:text-blue-700 no-underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
