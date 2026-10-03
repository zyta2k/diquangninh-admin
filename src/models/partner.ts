import type { Category } from './category'

type PartnerImage = {
  key?: string
  path?: string
  url?: string
}

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
  hotline?: string
  contractStatus?: string
  createdAt?: string
  categories?: Array<Category>
  coverImage?: PartnerImage
}
