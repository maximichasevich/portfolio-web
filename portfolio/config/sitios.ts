/**
 * Direcciones públicas del portfolio y de las tres demos.
 *
 * Cuando tengas las direcciones definitivas (o tu dominio propio), cambialas
 * acá o, mejor, en las variables de entorno del sitio en Netlify
 * (Site configuration > Environment variables). Las variables tienen
 * prioridad sobre estos valores por defecto. Van sin barra final.
 */
export const sitios = {
  /** Este portfolio. Con dominio propio: "https://tudominio.com". */
  portfolio:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://maximilianomichasevich.netlify.app",
  laEspiga:
    process.env.NEXT_PUBLIC_DEMO_LA_ESPIGA_URL ??
    "https://demo-la-espiga.netlify.app",
  estudioFaro:
    process.env.NEXT_PUBLIC_DEMO_ESTUDIO_FARO_URL ??
    "https://demo-estudio-faro.netlify.app",
  verdeTienda:
    process.env.NEXT_PUBLIC_DEMO_VERDE_TIENDA_URL ??
    "https://demo-verde-tienda.netlify.app",
}
