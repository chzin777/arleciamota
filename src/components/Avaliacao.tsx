'use client';

/* ============================================================
   A avaliação.

   É o passo real que a página inteira está pedindo, então ela vem
   depois dos procedimentos e antes da prova social: a pessoa já
   sabe o que existe, e ainda não viu o que as outras acharam.

   Faixa clara de novo — a segunda e última. As duas faixas claras
   marcam as duas coisas que a pessoa precisa entender antes de
   mandar mensagem: como funciona e como começa.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';
import { AVALIACAO, CONTATO, FOTOS } from '@/dados';
import { Simbolo } from './Simbolo';
import Moldura from './Moldura';

export default function Avaliacao() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.from('.av-lista li', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.av-lista', start: 'top 86%' },
      });

      /* A foto entra maior e assenta. É o mesmo gesto do herói —
         chegar perto — no momento em que a página convida a pessoa a
         marcar a avaliação. */
      gsap.fromTo(
        '.av-foto img',
        { scale: 1.28, yPercent: -6 },
        {
          scale: 1.05,
          yPercent: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: '.av-foto',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section className="secao claro av" id="avaliacao" ref={root}>
      <div className="container">
        <div className="av-grade">
          <div className="av-texto">
            <p className="rotulo">O primeiro passo</p>
            <h2 className="display secao-titulo">Comece pela avaliação</h2>
            <span className="av-selo">Sem compromisso</span>
            <p className="lead">
              Antes de marcar procedimento, a gente conversa. Você conta o que quer, eu digo o que
              a sua pele permite — e se não for a hora, eu falo isso também.
            </p>

            <ul className="av-lista">
              {AVALIACAO.map((item) => (
                <li key={item}>
                  <Simbolo />
                  {item}
                </li>
              ))}
            </ul>

            <a
              className="btn btn-escuro"
              href={CONTATO.agendar}
            >
              Agendar minha avaliação
              <ArrowUpRight strokeWidth={2.2} />
            </a>
          </div>

          <figure className="av-foto">
            <Moldura
              src={FOTOS.avaliacao}
              alt="Desenho da sobrancelha marcado antes da pigmentação"
              legenda="foto do atendimento — desenho antes da pigmentação"
              sizes="(max-width: 980px) 92vw, 46vw"
              quality={80}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
