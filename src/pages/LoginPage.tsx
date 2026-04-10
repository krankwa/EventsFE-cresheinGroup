// import { useState } from 'react'
// // import { useNavigate, Link } from 'react-router-dom'
// // import { login } from '../api/authApi'
// // import { useAuth } from '../hooks/useAuth'
// // import { LoginRequest } from '../interfaces/Auth'
// // import toast from 'react-hot-toast'

// const LoginPage = () => {
//     // const { login: setAuth } = useAuth()
//     // const navigate = useNavigate()
//     const [form, setForm] = useState("")
//     const [loading, setLoading] = useState(false)
//     const [errors, setErrors] = useState<string[]>([])

//     // const validate = (): boolean => {
//     //     const errs: string[] = []
//     //     if (!form.email.includes('@')) errs.push('Invalid email format')
//     //     if (!form.password) errs.push('Password is required')
//     //     setErrors(errs)
//     //     return errs.length === 0
//     // }

//     // const handleSubmit = async (e: React.FormEvent) => {
//     //     e.preventDefault()
//     //     if (!validate()) return
//     //     setLoading(true)
//     //     try {
//     //         const response = await login(form)
//     //         setAuth(response)
//     //         toast.success(`Welcome back, ${response.name}!`)
//     //         if (response.role === 'Admin') navigate('/admin')
//     //         else navigate('/events')
//     //     } catch {
//     //         toast.error('Invalid email or password')
//     //     } finally {
//     //         setLoading(false)
//     //     }
//     // }

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//             <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">

//                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//                     Welcome Back
//                 </h2>

//                 {errors.length > 0 && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//                         {errors.map(err => (
//                             <p key={err} className="text-red-500 text-sm">• {err}</p>
//                         ))}
//                     </div>
//                 )}

//                 <form className="flex flex-col gap-4">
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         // value={form.email}
//                         // onChange={e => setForm({ ...form, email: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"

//                         // onChange={e => setForm({ ...form, password: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
//                     >
//                         {loading ? 'Logging in...' : 'Login'}
//                     </button>
//                 </form>

//                 <p className="text-center text-sm text-gray-500 mt-4">
//                     No account?{' '}
//                     {/* <Link to="/register" className="text-blue-600 hover:underline"> */}
//                     Register here
//                     {/* </Link> */}
//                 </p>
//             </div>
//         </div>

//     )
// }

// export default LoginPage