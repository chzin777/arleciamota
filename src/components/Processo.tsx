'use client';

/* ============================================================
   O processo.

   A coluna da esquerda fica presa enquanto as três etapas passam à
   direita. É o formato que o conteúdo pede: as etapas são uma
   sequência dentro de UMA sessão, e prender o título é o que
   mantém "2 horas" à vista enquanto a pessoa desce por elas.

   Esta é a primeira das duas faixas claras da página. A troca de
   fundo marca a mudança de assunto — do que ela faz para como
   funciona — sem precisar de linha divisória.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced, ScrollTrigger } from '@/lib/anim';
import { CONTATO, ETAPAS } from '@/dados';
import Moldura from './Moldura';

export default function Processo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const escopo = root.current;
      if (!escopo) return;

      /* O pin só em tela larga: abaixo de 1080px a coluna vira o topo
         empilhado, e prender um bloco que ocupa a largura toda deixaria
         a página parada por várias telas. */
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1081px)', () => {
        const st = ScrollTrigger.create({
          trigger: '.mt',
          start: 'top 18%',
          endTrigger: '.mt-etapas',
          end: 'bottom 78%',
          pin: '.mt-fixo',
          pinSpacing: false,
        });
        return () => st.kill();
      });

      gsap.utils.toArray<HTMLElement>('.mt-etapa', escopo).forEach((el) => {
        gsap.from(el, {
          y: 90,
          opacity: 0,
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });

        const foto = el.querySelector('.mt-etapa-foto img');
        if (foto) {
          gsap.fromTo(
            foto,
            /* A escala entra junto no mesmo tween: o paralaxe move a
               imagem para dentro da moldura, e sem folga apareceria uma
               faixa vazia na borda de cima. */
            { yPercent: -8, scale: 1.18 },
            {
              yPercent: 8,
              scale: 1.18,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="secao claro" id="processo" ref={root}>
      <div className="container">
        <div className="mt">
          <div className="mt-fixo">
            <p className="rotulo">Como funciona</p>
            <h2 className="display secao-titulo">Uma sessão, três etapas, nenhuma pressa</h2>
            <p className="mt-relogio">
              <b>2h</b>
              <i>da conversa ao último traço</i>
            </p>
            <p className="lead">
              A ordem não é sugestão: metade do resultado está no desenho, antes de a agulha
              encostar. Quem pula essa parte entrega sobrancelha igual para rostos diferentes.
            </p>
            <a
              className="btn btn-escuro"
              href={CONTATO.agendar}
            >
              Agendar minha sessão
              <ArrowUpRight strokeWidth={2.2} />
            </a>
          </div>

          <ol className="mt-etapas">
            {ETAPAS.map((e) => (
              <li className="mt-etapa" key={e.n}>
                <div className="mt-etapa-texto">
                  <span className="mt-n">Etapa {e.n}</span>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </div>
                <figure className="mt-etapa-foto">
                  <Moldura src={e.foto} sizes="(max-width: 1080px) 90vw, 22vw" quality={76} />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
