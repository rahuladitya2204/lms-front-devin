import { createSearchParams, useNavigate } from 'react-router-dom'

export const useNavigateParams = () => {
  const navigate = useNavigate()

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString()
    navigate(url + '?' + searchParams)
  }
}
