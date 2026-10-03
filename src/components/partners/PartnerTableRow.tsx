import { ExternalLink, MapPin } from 'lucide-react'
import type { Partner } from '../../models/partner'

export function PartnerTableRow({ partner }: { partner: Partner }) {
  const categories = partner.categories ?? []
  const parentCategories = categories.filter((category) => category.level === 1)
  const subCategories = categories.filter(
    (category) => category.level && category.level > 1,
  )

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-5 py-4">
        <div className="font-medium">{partner.name}</div>
      </td>
      <td className="px-5 py-4">
        <CategoryList categories={parentCategories} />
      </td>
      <td className="px-5 py-4">
        <CategoryList categories={subCategories} />
      </td>
      <td className="px-5 py-4 text-muted-foreground">{partner.ward || '—'}</td>
      <td className="px-5 py-4 text-muted-foreground">
        <span className="line-clamp-2 min-w-56">{partner.address || '—'}</span>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
        {partner.hotline || '—'}
      </td>
      <td className="px-5 py-4">
        <ExternalLinkButton
          href={partner.googleMapUrl}
          label="Google Maps"
          icon={<MapPin className="size-4" aria-hidden="true" />}
        />
      </td>
      <td className="px-5 py-4">
        <ExternalLinkButton href={partner.facebookPageUrl} label="Fanpage" />
      </td>
      <td className="px-5 py-4">
        <ExternalLinkButton href={partner.websiteUrl} label="Website" />
      </td>
    </tr>
  )
}

function CategoryList({ categories }: { categories: Partner['categories'] }) {
  if (!categories?.length)
    return <span className="text-muted-foreground">—</span>

  return (
    <div className="flex min-w-32 flex-wrap gap-1">
      {categories.map((category) => (
        <span
          key={category.id}
          className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {category.name}
        </span>
      ))}
    </div>
  )
}

function ExternalLinkButton({
  href,
  icon,
  label,
}: {
  href?: string
  icon?: React.ReactNode
  label: string
}) {
  if (!href) return <span className="text-muted-foreground">—</span>

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-primary underline-offset-4 hover:underline"
    >
      {icon}
      {label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  )
}
