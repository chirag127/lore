/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_CF_BEACON_TOKEN?: string
  readonly PUBLIC_WEB3FORMS_KEY?: string
  readonly PUBLIC_GA4_ID?: string
  readonly PUBLIC_DEPLOY_TIME?: string
  readonly PUBLIC_GIT_SHA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
