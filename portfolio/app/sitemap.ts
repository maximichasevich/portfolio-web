import type { MetadataRoute } from "next"

import { perfil } from "@/data/perfil"

/**
 * Solo el portfolio entra en el sitemap. Los sitios de ejemplo en /proyectos
 * están marcados como noindex y no tienen que aparecer en Google.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: perfil.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
