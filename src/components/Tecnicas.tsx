'use client';

/* ============================================================
   As técnicas.

   Um acordeão horizontal: seis fatias verticais, uma aberta por
   vez. O formato veio do conteúdo — são seis técnicas, e a pessoa
   normalmente já chega procurando UMA. Seis cartões lado a lado
   pediriam que ela lesse todos; assim ela varre os nomes e para no
   dela.

   Abre no ponteiro e também no clique e no foco do teclado: em
   telas de toque não existe hover, e sem o clique metade dos
   visitantes veria só a primeira fatia aberta.
   ============================================================ */

import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';
import { CONTATO, TECNICAS } from '@/dados';
import { Simbolo } from './Simbolo';
import Moldura from './Moldura';

export default function Tecnicas() {
  const root = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from('.pf-item, .pf-cartao', {
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '.pf-trilho, .pf-lista', start: 'top 84%' },
      });
    },
    { scope: root }
  );

  return (
    <section className="secao" id="tecnicas" ref={root}>
      <div className="container">
        <div className="pf-cabeca">
          <div>
            <p className="rotulo">Técnicas</p>
            <h2 className="display secao-titulo" style={{ marginTop: 18 }}>
              Seis jeitos de chegar no mesmo lugar
            </h2>
          </div>
          <p className="lead" style={{ maxWidth: '38ch' }}>
            A técnica é escolhida na avaliação, junto com você: depende da sua pele, do seu pelo e
            de quanto você quer que apareça.
          </p>
        </div>

        <div className="pf-trilho">
          {TECNICAS.map((t, i) => (
            <button
              className="pf-item"
              key={t.id}
              type="button"
              data-ativo={ativo === i ? '1' : '0'}
              aria-expanded={ativo === i}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              onClick={() => setAtivo(i)}
            >
              <Moldura src={t.foto} sizes="(max-width: 900px) 90vw, 45vw" quality={74} />
              <Simbolo className="pf-marca" />
              {/* span e não h3/p: o conteúdo vive dentro de um <button>,
                  que só aceita conteúdo de frase. A hierarquia visual é
                  a mesma, e o título de seção acima já dá o contexto. */}
              <span className="pf-corpo">
                <span className="pf-tit">{t.titulo}</span>
                <span className="pf-txt">{t.texto}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="pf-lista">
          {TECNICAS.map((t) => (
            <article className="pf-cartao" key={t.id}>
              <Moldura src={t.foto} sizes="92vw" quality={70} />
              <div className="pf-corpo">
                <h3>{t.titulo}</h3>
                <p>{t.texto}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 'clamp(32px, 4vw, 54px)' }}>
          <a className="btn" href={CONTATO.agendar}>
            Não sei qual é a minha — me ajuda a escolher
            <ArrowUpRight strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
