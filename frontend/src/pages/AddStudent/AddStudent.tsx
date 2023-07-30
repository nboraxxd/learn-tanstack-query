import { useMutation } from '@tanstack/react-query'
import { addStudent } from 'apis/students.api'
import { useMemo, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { Student } from 'types/students.type'
import { isAxiosError } from 'utils/utils'

type FormStateType = Omit<Student, 'id'>
type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null

const initialFormState: FormStateType = {
  first_name: '',
  last_name: '',
  email: '',
  gender: 'other',
  country: '',
  avatar: '',
  btc_address: '',
}

export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState)

  const addMatch = useMatch('/students/add')
  const isAddMatch = addMatch !== null
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate, mutateAsync, error, data, reset } = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    },
  })

  const errorForm: FormError = useMemo(() => {
    if (isAxiosError<{ error: FormError }>(error) && error.response?.status === 422) {
      return error.response?.data.error
    }
    return null
  }, [error])

  console.log(data)

  const onChangeFormState = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (data || error) {
      reset()
    }
  }

  const onsubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      await mutateAsync(formState)
      setFormState(initialFormState)
    } catch (error) {
      console.log(error)
    }
  }

  // Cách dùng mutate
  // const onsubmit = (ev: React.FormEvent<HTMLFormElement>) => {
  //   ev.preventDefault()
  //   mutate(formState, {
  //     onSuccess: () => {
  //       setFormState(initialFormState)
  //     },
  //   })
  // }

  return (
    <div>
      <h1 className="text-lg">{isAddMatch ? 'Add student' : 'Edit student'}</h1>
      <form className="mt-6" onSubmit={onsubmit}>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="text"
            name="email"
            value={formState.email}
            onChange={onChangeFormState}
            id="floating_email"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            required
          />
          <label
            htmlFor="floating_email"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Email address
          </label>
          {errorForm && <p className="mt-1 text-xs text-red-600">{errorForm.email}</p>}
        </div>

        <div className="group relative z-0 mb-6 w-full">
          <div>
            <div>
              <div className="mb-4 flex items-center">
                <input
                  id="gender-1"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formState.gender === 'male'}
                  onChange={onChangeFormState}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label htmlFor="gender-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Male
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  id="gender-2"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formState.gender === 'female'}
                  onChange={onChangeFormState}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label htmlFor="gender-2" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Female
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gender-3"
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formState.gender === 'other'}
                  onChange={onChangeFormState}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label htmlFor="gender-3" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="group relative z-0 mb-6 w-full">
          <input
            type="text"
            name="country"
            value={formState.country}
            onChange={onChangeFormState}
            id="country"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
            required
          />
          <label
            htmlFor="country"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
          >
            Country
          </label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="text"
              name="first_name"
              value={formState.first_name}
              onChange={onChangeFormState}
              id="first_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              required
            />
            <label
              htmlFor="first_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              First Name
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="text"
              name="last_name"
              value={formState.last_name}
              onChange={onChangeFormState}
              id="last_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              required
            />
            <label
              htmlFor="last_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Last Name
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="text"
              name="avatar"
              value={formState.avatar}
              onChange={onChangeFormState}
              id="avatar"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              required
            />
            <label
              htmlFor="avatar"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              Avatar Base64
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="text"
              name="btc_address"
              value={formState.btc_address}
              onChange={onChangeFormState}
              id="btc_address"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
              required
            />
            <label
              htmlFor="btc_address"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
