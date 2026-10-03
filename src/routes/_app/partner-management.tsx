import { createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PartnerTableRow } from '../../components/partners/PartnerTableRow'
import { usePartners } from '../../hooks/usePartners'
import { PAGE_SIZE_OPTIONS } from '../../lib/constants'

export const Route = createFileRoute('/_app/partner-management')({
  component: PartnerManagementPage,
})

function PartnerManagementPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  const { error, hasNextPage, isLoading, partners, reload } = usePartners({
    page,
    pageSize,
  })

  useEffect(() => {
    console.log('Partners updated:', partners)
  }, [partners])

  const visibleRange = useMemo(() => {
    if (partners.length === 0) return '0 đối tác'
    const start = (page - 1) * pageSize + 1
    return `${start}–${start + partners.length - 1}`
  }, [page, partners.length])

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4" aria-hidden="true" />
            Đối tác
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Quản lí đối tác
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi thông tin và tình trạng hợp đồng của các đối tác.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {error ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm font-medium">
              Không thể tải danh sách đối tác
            </p>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-accent"
            >
              <RefreshCw className="size-4" aria-hidden="true" /> Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Ảnh bìa</th>
                  <th className="px-5 py-3">Tên đối tác</th>
                  <th className="px-5 py-3">Vị trí</th>
                  <th className="px-5 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="h-72 text-center">
                      <LoaderCircle className="mx-auto size-5 animate-spin text-muted-foreground" />
                      <span className="sr-only">Đang tải</span>
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-72 px-5 text-center text-muted-foreground"
                    >
                      Chưa có đối tác nào.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <PartnerTableRow
                      key={String(partner.id)}
                      partner={partner}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {visibleRange} đối tác
          </p>
          <div className="flex items-center gap-2">
            <label
              htmlFor="partner-page-size"
              className="hidden text-sm text-muted-foreground sm:inline"
            >
              Hiển thị
            </label>
            <select
              id="partner-page-size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Số đối tác mỗi trang"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}/trang
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || isLoading}
              className="inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Trước
            </button>
            <span className="min-w-20 text-center text-sm text-muted-foreground">
              Trang {page}
            </span>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage || isLoading}
              className="inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
            >
              Sau <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
