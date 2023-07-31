import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import { useQueryString } from '../../utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'

const LIMIT = 10
export default function Students() {
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page || 1)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => getStudents(page, LIMIT),
  })
  const totalStudentCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentCount / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => deleteStudent(id),
    onSuccess: (_, id) => {
      console.log(page, totalPage)
      toast.success(`Successfully delete student with id is ${id}`)
      queryClient.invalidateQueries({ queryKey: ['students', page] })
      if (page === totalPage && totalStudentCount % LIMIT === 1) {
        navigate(`/students?page=${page - 1}`)
      }
    },
  })

  const handleDelete = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(id),
      staleTime: 1000,
    })
  }

  return (
    <div>
      <h1 className="text-lg">Students</h1>
      <Link
        to="/students/add"
        state={{ totalPage: totalStudentCount % LIMIT === 0 ? totalPage + 1 : totalPage }}
        className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Add student
      </Link>

      {studentsQuery.isLoading === true && (
        <div role="status" className="mt-6 animate-pulse">
          <div className="mb-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {studentsQuery.isLoading === false && (
        <>
          <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Avatar
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="py-4 px-6">{student.id}</td>
                    <td className="py-4 px-6">
                      <img src={student.avatar} alt={student.last_name} className="h-5 w-5" />
                    </td>
                    <th scope="row" className="whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white">
                      {student.last_name}
                    </th>
                    <td className="py-4 px-6">{student.email}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/students/${student.id}`}
                        state={{ page }}
                        className="mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500"
                        onMouseEnter={() => handlePrefetchStudent(student.id)}
                      >
                        Edit
                      </Link>
                      <button
                        className="font-medium text-red-600 dark:text-red-500"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <nav aria-label="Page navigation example">
              <ul className="inline-flex -space-x-px">
                <li>
                  {page <= 1 ? (
                    <span className="cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-300">
                      Previous
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page - 1}`}
                      className="cursor-pointer rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames('border border-gray-300 py-2 px-3 leading-tight', {
                            'bg-gray-100 font-semibold text-blue-500': isActive,
                            'hover:bg-gray-100 hover:text-gray-700': !isActive,
                          })}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}
                <li>
                  {page >= totalPage ? (
                    <span className="cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-300">
                      Next
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page + 1}`}
                      className="cursor-pointer rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
