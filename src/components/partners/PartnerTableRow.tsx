import { ExternalLink, ImageOff, MapPin, Pencil, Trash2 } from 'lucide-react'
import type { Partner } from '../../models/partner'

const cdnUrl = import.meta.env.VITE_CDN_URL?.replace(/\/$/, '') ?? ''

export function PartnerTableRow({ partner }: { partner: Partner }) {
  const imageUrl = partner.coverImage?.url
    ? partner.coverImage.url
    : partner.coverImage?.key
      ? `${cdnUrl}/${partner.coverImage.key.replace(/^\//, '')}`
      : null
  const mapUrl = partner.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.coordinates)}`
    : null

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-5 py-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Ảnh bìa ${partner.name}`}
            className="h-32 w-[168px] rounded-md border object-cover"
          />
        ) : (
          <div className="grid h-32 w-[168px] place-items-center rounded-md border bg-muted text-muted-foreground">
            <ImageOff className="size-4" aria-hidden="true" />
            <span className="sr-only">Chưa có ảnh bìa</span>
          </div>
        )}
      </td>
      <td className="px-5 py-4">
        <div className="font-medium">{partner.name}</div>
      </td>
      <td className="px-5 py-4">
        {mapUrl ? (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            <MapPin className="size-4" aria-hidden="true" />
            Google Maps
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Chỉnh sửa đối tác"
            aria-label={`Chỉnh sửa ${partner.name}`}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Xóa đối tác"
            aria-label={`Xóa ${partner.name}`}
            className="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}
