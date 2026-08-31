'use client';

/* ============================================================
   Procedimentos e cuidados.

   Grade de doze colunas com fluxo denso: três cartões de quatro
   colunas fecham a primeira linha exata, e os dois painéis de seis
   fecham a segunda. Nenhuma célula sobra — buraco em grade é o
   defeito que mais entrega página montada às pressas.

   Os cuidados vêm em lista, não em cartão: são seis regras curtas,
   e seis cartões dariam a elas o mesmo peso dos três procedimentos
   que sustentam a página.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';
import { CONTATO, CUIDADOS, PROCEDIMENTOS } from '@/dados';
import Moldura from './Moldura';

export default function Procedimentos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.from('.md-cartao', {
        y: 80,
        opacity: 0,
        scale: 0.96,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.md-grade', start: 'top 82%' },
      });

      gsap.from('.md-cuidados, .md-painel', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.md-cuidados', start: 'top 88%' },
      });

      gsap.from('.md-regras li', {
        opacity: 0,
        x: -14,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: { trigger: '.md-regras', start: 'top 90%' },
      });
    },
    { scope: root }
  );

  return (
    <section className="secao" id="procedimentos" ref={root}>
      <div className="container">
        <div className="md-cabeca">
          <div>
            <p className="rotulo">Procedimentos</p>
            <h2 className="display secao-titulo" style={{ marginTop: 18 }}>
              Sobrancelhas, lábios e olhos
            </h2>
          </div>
          <p className="lead" style={{ maxWidth: '36ch' }}>
            Três regiões, a mesma régua: o desenho respeita o que já é seu e a cor sai um tom
            abaixo do que você imagina.
          </p>
        </div>

        <div className="md-grade">
          {PROCEDIMENTOS.map((p) => (
            <article className="md-cartao" key={p.id}>
              <Moldura
                src={p.foto}
                sizes="(max-width: 700px) 92vw, (max-width: 1080px) 46vw, 31vw"
                quality={76}
              />
              <div className="md-corpo">
                <h3>{p.nome}</h3>
                <p>{p.texto}</p>
              </div>
            </article>
          ))}

          <div className="md-cuidados">
            <h3>O pós é metade do resultado</h3>
            <ul className="md-regras">
              {CUIDADOS.map((c) => (
                <li key={c.nome}>
                  {c.nome}
                  <span>
                    {c.dur} · {c.obs}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md-painel">
            <div>
              <h3>Quem não pode fazer agora</h3>
              <p style={{ marginTop: 14 }}>
                Gestantes e lactantes, quem está em tratamento oncológico, quem usa ácido ou
                roacutan na região e quem tem lesão de pele aberta no local. Diabetes,
                queloide e alergia a pigmento entram na conversa antes de qualquer agendamento —
                por isso a avaliação vem primeiro.
              </p>
            </div>

            <div className="md-selos">
              <span className="md-selo">Material descartável</span>
              <span className="md-selo">Anestésico tópico</span>
              <span className="md-selo">Pigmento certificado</span>
              <span className="md-selo">Retoque incluso</span>
            </div>

            <a className="btn" href={CONTATO.agendar}>
              Tirar minha dúvida
              <ArrowUpRight strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
