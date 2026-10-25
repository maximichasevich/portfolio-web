import type { MetadataRoute } from "next"

import { perfil } from "@/data/perfil"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${perfil.url}/sitemap.xml`,
  }
}
