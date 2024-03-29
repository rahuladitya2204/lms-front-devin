import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const NavLink = ({ to, activeClassName, exact, children, ...props }) => {
  const router = useRouter()
  const isActive = exact
    ? router.pathname === to
    : router.pathname.startsWith(to)

  const className = isActive ? activeClassName : ''

  return (
    <Link href={to} {...props}>
      <a className={className}>{children}</a>
    </Link>
  )
}

export const useSearchParams = () => {
  const router = useRouter()
  const searchParams = new URLSearchParams(router.asPath.split('?')[1])

  const get = key => searchParams.get(key)
  const getAll = key => searchParams.getAll(key)
  const has = key => searchParams.has(key)
  const set = (key, value) => {
    searchParams.set(key, value)
    router.push(`${router.pathname}?${searchParams.toString()}`, undefined, {
      shallow: true
    })
  }
  const append = (key, value) => {
    searchParams.append(key, value)
    router.push(`${router.pathname}?${searchParams.toString()}`, undefined, {
      shallow: true
    })
  }
  const remove = key => {
    searchParams.delete(key)
    router.push(`${router.pathname}?${searchParams.toString()}`, undefined, {
      shallow: true
    })
  }
  const toString = () => searchParams.toString()

  return [
    Object.fromEntries(searchParams),
    {
      get,
      getAll,
      has,
      set,
      append,
      remove,
      toString
    }
  ]
}

import { useCallback } from 'react'

const useNavigate = () => {
  const router = useRouter()

  const navigate = useCallback(
    (path, options = {}) => {
      const { replace = false, state = {} } = options

      if (replace) {
        router.replace(path, undefined, { shallow: true, ...state })
      } else {
        router.push(path, undefined, { shallow: true, ...state })
      }
    },
    [router]
  )

  return navigate
}

export const useParams = () => {
  const router = useRouter()
  const params = router.query

  return params
}
