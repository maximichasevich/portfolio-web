/**
 * Direcciones públicas del portfolio y de las tres demos.
 *
 * Cuando tengas las direcciones definitivas (o tu dominio propio), cambialas
 * acá o, mejor, en las variables de entorno del sitio en Netlify
 * (Site configuration > Environment variables). Las variables tienen
 * prioridad sobre estos valores por defecto. Van sin barra final.
 */
export const sitios = {
  /** Este portfolio. */
  portfolio:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://michasevich.com",
  laEspiga:
    process.env.NEXT_PUBLIC_DEMO_LA_ESPIGA_URL ??
    "https://laespiga.michasevich.com",
  estudioFaro:
    process.env.NEXT_PUBLIC_DEMO_ESTUDIO_FARO_URL ??
    "https://estudiofaro.michasevich.com",
  verdeTienda:
    process.env.NEXT_PUBLIC_DEMO_VERDE_TIENDA_URL ??
    "https://verdetienda.michasevich.com",
}
