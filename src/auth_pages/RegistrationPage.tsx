import { Link, useNavigate } from "react-router"
import type { RegistrationFormValues } from "../application/types"
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form"
import { useAuthContext } from "../hooks/useAuthContext"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../application/api"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegistrationFormValues>({
    mode: "onBlur",
  })

  const { mutate: submitRegister, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      setUser(user)
      navigate("/notes")
    },
  })

  const handleRegister: SubmitHandler<
    RegistrationFormValues
  > = (data) => {
    submitRegister({
      email: data.email.trim(),
      password: data.password_first,
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="border-b border-gray-100 pb-3">
          <p className="m-0 text-lg font-semibold text-gray-900">
            Sign Up
          </p>
        </div>

        {error && (
          <p className="text-red-500">{error.message}</p>
        )}

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            {...register("password_first", {
              required: true,
            })}
          />
          <input
            type="password"
            placeholder="Repeat password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            {...register("password_seccond", {
              required: true,
              validate: (value, formValues) =>
                value === formValues.password_first,
            })}
          />
          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        </form>
        <Link
          to="/login"
          className="text-center text-sm text-blue-600 hover:text-blue-700 no-underline"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  )
}
