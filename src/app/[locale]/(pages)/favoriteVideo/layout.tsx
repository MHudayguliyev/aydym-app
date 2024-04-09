import type { Metadata } from 'next'
import sidebar_routes from '@app/assets/json-data/sidebar_routes'
import { useLocale } from 'next-intl'
 
export function generateMetadata(): Metadata {
    const locale = useLocale()
    const route = sidebar_routes[9]
    //@ts-ignore
    const title = route.display_name[locale] + ' - Aydym.com | Diňläň, lezzet alyň'
    return { title }
}

export default function Layout({
    children, 
  }: {
    children: React.ReactNode, 
  }) {
    return <>{children}</>
}