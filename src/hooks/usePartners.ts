import { useEffect, useState } from 'react'
import { getAccessToken } from '../lib/auth'
import type { Partner } from '../models/partner'

const apiUrl = import.meta.env.VITE_API_URL ?? 'https://dev-api.diquangninh.vn'

type UsePartnersParams = {
  page: number
  pageSize: number
}

export function usePartners({ page, pageSize }: UsePartnersParams) {
  const [partners, setPartners] = useState<Array<Partner>>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPartners() {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          skip: String((page - 1) * pageSize),
          take: String(pageSize),
        })
        const token = getAccessToken()
        const response = await fetch(`${apiUrl}/admin/partner?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            accept: 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok)
          throw new Error(`Máy chủ trả về lỗi ${response.status}`)

        const result = (await response.json()) as Array<Partner>
        setPartners(result)
        setHasNextPage(result.length === pageSize)
      } catch (loadError) {
        if (
          loadError instanceof DOMException &&
          loadError.name === 'AbortError'
        )
          return

        setPartners([])
        setHasNextPage(false)
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Không thể tải danh sách đối tác.',
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadPartners()
    return () => controller.abort()
  }, [page, pageSize, reloadKey])

  return {
    error,
    hasNextPage,
    isLoading,
    partners,
    reload: () => setReloadKey((key) => key + 1),
  }
}
