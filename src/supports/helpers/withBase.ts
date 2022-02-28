import { isLinkHttp, removeLeadingSlash } from '../util'

/**
 * Prefix url with site base
 */
export const withBase = (url: string): string => {
  if (isLinkHttp(url)) return url

  const base = process.env.BASE_URL
  return `${base}${removeLeadingSlash(url)}`
}
