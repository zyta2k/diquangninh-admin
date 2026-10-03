import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAccessToken } from '../lib/auth'
import type { Partner } from '../models/partner'

const apiUrl = import.meta.env.VITE_API_URL ?? 'https://dev-api.diquangninh.vn'

type UsePartnersParams = {
  page: number
  pageSize: number
}

export function usePartners({ page, pageSize }: UsePartnersParams) {
  const query = useQuery({
    queryKey: ['partners', { page, pageSize }],
    enabled: typeof window !== 'undefined',
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        skip: String((page - 1) * pageSize),
        take: String(pageSize),
      })
      const token = getAccessToken()
      const response = await fetch(
        `${apiUrl}/admin/partner?${params.toString()}`,
        {
          signal,
          headers: {
            accept: 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
        },
      )
      if (!response.ok) throw new Error(`Máy chủ trả về lỗi ${response.status}`)

      return (await response.json()) as Array<Partner>
    },
  })

  return {
    error: query.error?.message ?? null,
    hasNextPage: query.data?.length === pageSize,
    isLoading: query.isLoading,
    partners: query.data ?? [],
    reload: query.refetch,
  }
}
