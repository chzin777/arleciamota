'use client';

/* ============================================================
   Chamada final e rodapé.

   A chamada é o acento em superfície cheia: é o único lugar da
   página, além da esteira, em que a cor deixa de ser detalhe.
   Guardar a cor para o fim faz o convite parecer o fim de um
   caminho, e não mais uma caixa colorida no meio do texto.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight, AtSign, MapPin } from 'lucide-react';
import { gsap, useGSAP, prefersReduced, splitChars } from '@/lib/anim';
import { CONTATO, MENU, PROVA } from '@/dados';
import { Simbolo } from './Simbolo';

export default function Fechamento() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const alvo = root.current?.querySelector<HTMLElement>('.cta-h2');
      if (alvo) {
        /* Corta uma vez só; nas montagens seguintes reaproveita os spans
           que já estão no DOM. */
        const letras =
          alvo.dataset.dividido === '1'
            ? (Array.from(alvo.querySelectorAll('span span')) as HTMLElement[])
            : ((alvo.dataset.dividido = '1'), splitChars(alvo));

        gsap.from(letras, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.012,
          scrollTrigger: { trigger: alvo, start: 'top 88%' },
        });
      }

      gsap.from('.cta-acoes, .cta-sub', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.cta-acoes', start: 'top 92%' },
      });
    },
    { scope: root }
  );

  return (
    <footer id="contato" ref={root}>
      <section className="cta">
        <h2 className="display cta-h2">Vamos desenhar a sua?</h2>
        <p className="cta-sub">
          A avaliação é sem compromisso. Você sai dela sabendo o que dá para fazer, quanto custa e
          quanto tempo dura.
        </p>
        <div className="cta-acoes">
          <a className="btn btn-escuro" href={CONTATO.agendar}>
            Agendar pelo link
            <ArrowUpRight strokeWidth={2.2} />
          </a>
          <a className="btn btn-vazado" href={CONTATO.instagramURL} target="_blank" rel="noopener">
            Ver o Instagram
            <AtSign strokeWidth={2} />
          </a>
        </div>
        <Simbolo className="cta-marca" />
      </section>

      <div className="rodape">
        <div className="container">
          <div className="rd-grade">
            <div className="rd-marca">
              <span className="rd-logo">
                <Simbolo />
                <span>
                  arlecia<i>mota</i>
                </span>
              </span>
              <p>
                Especialista em micropigmentação de lábios e sobrancelhas em Belo Horizonte.
                Desenho autoral, pele respeitada, retoque incluso.
              </p>
              <p style={{ color: 'var(--nude)' }}>{PROVA.frase}</p>
            </div>

            <div className="rd-col">
              <h3>Falar comigo</h3>
              <ul>
                <li>
                  <a href={CONTATO.agendar}>Agendar horário</a>
                </li>
                <li>
                  <a href={CONTATO.instagramURL} target="_blank" rel="noopener">
                    {CONTATO.instagram}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
                </li>
              </ul>
            </div>

            <div className="rd-col">
              <h3>Navegação</h3>
              <ul>
                {MENU.map((m) => (
                  <li key={m.href}>
                    <a href={m.href}>{m.rotulo}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rd-col">
              <h3>Onde atendo</h3>
              <ul>
                <li>{CONTATO.cidade}</li>
                <li>{CONTATO.endereco}</li>
                <li>
                  <a className="rd-mapa" href={CONTATO.mapa} target="_blank" rel="noopener">
                    <MapPin size={13} strokeWidth={2} />
                    <span>Abrir no mapa</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rd-fim">
            <span>© {new Date().getFullYear()} Arlecia Mota PMU</span>
            <span>Lábios · Sobrancelhas · Delineado</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
