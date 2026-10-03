import type { Category } from './category'

export type Partner = {
  id: string | number | bigint
  index?: number
  name: string
  coordinates?: string
  ownerName?: string
  ownerPhone?: string
  ward?: string
  address?: string
  tags?: string
  menuItems?: string
  hotline?: string
  googleMapUrl?: string
  facebookPageUrl?: string
  websiteUrl?: string
  contractStatus?: string
  createdAt?: string
  categories?: Array<Category>
}
