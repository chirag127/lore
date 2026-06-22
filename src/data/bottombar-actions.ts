import type { BottomBarAction } from '@chirag127/astro-chrome/BottomBar.astro'

/**
 * BottomBar actions for book·lore — mobile primary nav.
 * Structure (BottomBar.astro) comes from @chirag127/astro-chrome;
 * the icon/label/href set is per-app and book-summaries-specific.
 */
export const bottomBarActions: BottomBarAction[] = [
  { icon: '⌂', label: 'Home', href: '/' },
  { icon: '☷', label: 'Browse', href: '/browse/' },
  { icon: '✦', label: 'Latest', href: '/latest/' },
  { icon: '⌕', label: 'Search', href: '/search/' },
  { icon: '☰', label: 'Menu', href: '#sb-toggle' },
]
