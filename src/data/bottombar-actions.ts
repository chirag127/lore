import type { BottomBarAction } from '~/components/BottomBar.astro'

/**
 * BottomBar actions for book·lore — mobile primary nav.
 * Icon/label/href set is per-app and book-summaries-specific.
 */
export const bottomBarActions: BottomBarAction[] = [
  { icon: '⌂', label: 'Home', href: '/' },
  { icon: '☷', label: 'Shelves', href: '/books/' },
  { icon: '✦', label: 'Categories', href: '/categories/' },
  { icon: '☰', label: 'Menu', href: '#sb-toggle' },
]
