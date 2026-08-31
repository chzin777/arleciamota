'use client';

/* ============================================================
   Depoimentos.

   Três relatos, sem corte. O texto inteiro fica porque o que
   convence num depoimento de procedimento é o detalhe — quanto
   tempo durou, como ficou depois do retoque — e detalhe é a
   primeira coisa que some quando se resume um elogio.

   REVISAR: os três textos em `dados.ts` são marcadores de lugar.
   Trocar por relatos reais, com autorização de nome.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';
import { CONTATO, DEPOIMENTOS, PROVA } from '@/dados';
import { Simbolo } from './Simbolo';

export default function Depoimentos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from('.dp-cartao', {
        y: 70,
        opacity: 0,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.11,
        scrollTrigger: { trigger: '.dp-grade', start: 'top 85%' },
      });
    },
    { scope: root }
  );

  return (
    <section className="secao" id="depoimentos" ref={root}>
      <div className="container">
        <div className="dp-cabeca">
          <div>
            <p className="rotulo">Depoimentos</p>
            <h2 className="display secao-titulo" style={{ marginTop: 18 }}>
              Quem sentou nessa cadeira conta
            </h2>
          </div>
          <p className="dp-nota">
            <Simbolo />
            <b>{PROVA.seguidores}</b>
            pessoas acompanham o trabalho no {PROVA.fonte}
          </p>
        </div>

        <div className="dp-grade">
          {DEPOIMENTOS.map((d) => (
            <blockquote className="dp-cartao" key={d.iniciais}>
              <p>{d.texto}</p>
              <footer className="dp-quem">
                <span className="dp-avatar" aria-hidden="true">
                  {d.iniciais}
                </span>
                <span>
                  <b>{d.nome}</b>
                  <span>Cliente</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div style={{ marginTop: 'clamp(32px, 4vw, 52px)' }}>
          <a
            className="btn btn-vazado"
            href={CONTATO.instagramURL}
            target="_blank"
            rel="noopener"
          >
            Ver antes e depois no Instagram
            <ArrowUpRight strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
