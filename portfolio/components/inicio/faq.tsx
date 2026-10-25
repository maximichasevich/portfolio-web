import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { preguntas } from "@/data/perfil"

export function Faq() {
  return (
    <section
      id="preguntas"
      className="relative scroll-mt-24 px-5 py-24 md:px-10 md:py-32"
      aria-labelledby="titulo-preguntas"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="etiqueta-hud mb-4">[06] Preguntas</p>
          <h2
            id="titulo-preguntas"
            className="display text-[clamp(2.4rem,6vw,4.8rem)]"
          >
            Preguntas frecuentes
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--estrella-70)] md:text-lg">
            Lo que me preguntan casi todos antes de empezar. Si tu duda no está,
            escribime y te la respondo en el día.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="vidrio rounded-3xl px-6 md:px-8"
        >
          {preguntas.map((p, i) => (
            <AccordionItem
              key={p.pregunta}
              value={`pregunta-${i}`}
              className="border-[var(--borde)]"
            >
              <AccordionTrigger className="display-md py-6 text-left text-lg text-[var(--estrella)] hover:no-underline md:text-xl [&_svg]:text-[var(--cian)]">
                {p.pregunta}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-[var(--estrella-70)]">
                {p.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
