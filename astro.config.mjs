// @ts-check
import mdx from '@astrojs/mdx'
import { shell } from '@chirag127/astro-shell/shell'
import remarkEscapeStrayLt from './src/lib/remarkEscapeStrayLt.mjs'
import remarkStripUnknownJsx from './src/lib/remarkStripUnknownJsx.mjs'

export default shell({
  site: 'https://book-lore.oriz.in',
  includeMdx: false,
  integrations: [mdx({ remarkPlugins: [remarkEscapeStrayLt, remarkStripUnknownJsx] })],
})
