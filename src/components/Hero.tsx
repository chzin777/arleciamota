'use client';

/* ============================================================
   O herói.

   A tese da página em uma imagem: um rosto real dentro de um arco,
   sobrancelha e boca à vista. A marca fica onde marca funciona — no
   canto, pequena; dentro da foto ela vira desenho sobre desenho.

   Três profundidades: os anéis quase não andam, os ecos andam
   pouco, o recorte com a foto anda mais. Paralaxe convence pela
   DIFERENÇA entre planos, não pela distância que cada um percorre;
   por isso os números aqui são pequenos.
   ============================================================ */

import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced, splitChars } from '@/lib/anim';
import { CONTATO, FOTOS } from '@/dados';
import { Simbolo } from './Simbolo';
import Moldura from './Moldura';
import Gotas from './Gotas';

const FATOS = [
  'Desenho aprovado por você',
  'Material descartável',
  'Retoque incluso',
  'Atendimento com hora marcada',
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const escopo = root.current;
      if (!escopo) return;

      /* O split acontece uma vez por elemento, não uma vez por montagem:
         o `revert` do useGSAP desfaz os tweens, não o corte do texto, e
         cortar de novo geraria letras dentro de letras. */
      const linhas = gsap.utils.toArray<HTMLElement>('.he-linha i', escopo);
      const letras = linhas.flatMap((l) =>
        l.dataset.dividido === '1'
          ? (Array.from(l.querySelectorAll('span span')) as HTMLElement[])
          : ((l.dataset.dividido = '1'), splitChars(l))
      );

      gsap
        .timeline({ delay: 2.15, defaults: { ease: 'expo.out' } })
        .from('.he-rotulo', { y: 16, opacity: 0, duration: 0.7 })
        .from(letras, { yPercent: 118, duration: 1, stagger: 0.014 }, 0.06)
        .from(
          '.he-sub, .he-acoes, .he-fatos',
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 },
          0.5
        )
        .from('.he-plano', { opacity: 0, scale: 1.08, duration: 1.2, stagger: 0.09 }, 0.2)
        .from('.he-legenda, .he-rolar', { opacity: 0, duration: 0.7 }, 1.1);

      const planos = gsap.utils.toArray<HTMLElement>('.he-plano', escopo).map((el) => ({
        el,
        mov: Number(el.dataset.mov),
        rol: Number(el.dataset.rol),
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }),
        r: gsap.quickTo(el, 'rotation', { duration: 1.7, ease: 'power3.out' }),
      }));

      const colX = gsap.quickTo('.he-texto', 'x', { duration: 1.2, ease: 'power3.out' });
      const colY = gsap.quickTo('.he-texto', 'y', { duration: 1.4, ease: 'power3.out' });

      /* O ponteiro é escutado na SEÇÃO inteira, não só na cena: quem lê
         o texto à esquerda também move a imagem à direita, e é isso que
         faz a página parecer viva antes de chegar na foto. */
      const mover = (e: PointerEvent) => {
        const r = escopo.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        planos.forEach((p) => {
          p.x(-dx * 40 * p.mov);
          p.y(-dy * 22 * p.mov);
          p.r(dx * 1.8 * p.mov);
        });
        colX(-dx * 12);
        colY(-dy * 7);
      };

      const sair = () => {
        planos.forEach((p) => {
          p.x(0);
          p.y(0);
          p.r(0);
        });
        colX(0);
        colY(0);
      };

      escopo.addEventListener('pointermove', mover);
      escopo.addEventListener('pointerleave', sair);

      /* A rolagem repete a mesma profundidade no eixo vertical. */
      planos.forEach((p) => {
        gsap.fromTo(
          p.el,
          { yPercent: 0 },
          {
            yPercent: -p.rol,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: escopo,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5 + p.mov * 0.6,
            },
          }
        );
      });

      gsap.fromTo(
        '.he-texto',
        { y: 0, opacity: 1 },
        {
          y: 80,
          opacity: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: escopo, start: 'top top', end: 'bottom top', scrub: 0.6 },
        }
      );

      gsap.to('.he-aneis', {
        rotation: 26,
        ease: 'none',
        scrollTrigger: { trigger: escopo, start: 'top top', end: 'bottom top', scrub: 1.2 },
      });

      return () => {
        escopo.removeEventListener('pointermove', mover);
        escopo.removeEventListener('pointerleave', sair);
      };
    },
    { scope: root }
  );

  return (
    <section className="he" id="topo" ref={root}>
      <Gotas />

      <div className="he-texto">
        <p className="rotulo he-rotulo">Micropigmentação — Belo Horizonte</p>

        <h1 className="display he-h1">
          <span className="he-linha">
            <i>Menos contorno,</i>
          </span>
          <span className="he-linha he-linha-destaque">
            <i>mais naturalidade.</i>
          </span>
        </h1>

        <p className="he-sub">
          Sobrancelhas e lábios feitos traço a traço, no seu formato e no seu tom. Quem olha vê
          você — não vê o procedimento.
        </p>

        <div className="he-acoes">
          <a className="btn" href={CONTATO.agendar}>
            Agendar avaliação
            <ArrowUpRight strokeWidth={2.2} />
          </a>
          <a className="btn btn-vazado" href="#processo">
            Ver como funciona
          </a>
        </div>

        <ul className="he-fatos">
          {FATOS.map((f) => (
            <li key={f}>
              <Simbolo />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="he-cena">
        <svg className="he-aneis" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="98" />
          <circle className="anel-tracejado" cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="58" />
        </svg>

        <span className="he-eco he-eco-1 he-plano" data-mov="0.5" data-rol="7" aria-hidden="true" />
        <span className="he-eco he-eco-2 he-plano" data-mov="0.75" data-rol="11" aria-hidden="true" />

        <div className="he-retrato he-plano" data-mov="0.34" data-rol="5">
          <Moldura
            src={FOTOS.hero}
            legenda="foto de rosto — sobrancelha e lábios"
            alt="Rosto de cliente com sobrancelhas e lábios micropigmentados"
            sizes="(max-width: 1080px) 90vw, 40vw"
            priority
            quality={82}
          />
        </div>

        <p className="he-legenda">
          <b>Retoque incluso</b>
          A cor só fecha depois que a pele cicatriza
        </p>
      </div>

      {/* O selo de rolagem.

          É um alvo de verdade — um link para a primeira seção — em vez
          de um aviso. A palavra corre em volta do círculo e a seta
          desce sozinha: dois movimentos lentos, e o que chama a
          atenção é a diferença entre eles. */}
      <a className="he-rolar" href="#trabalho" aria-label="Rolar para o trabalho">
        <svg className="he-rolar-texto" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path
              id="he-rolar-curva"
              d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
              fill="none"
            />
          </defs>
          <text>
            <textPath href="#he-rolar-curva" startOffset="0">
              role para ver · o trabalho ·
            </textPath>
          </text>
        </svg>
        <span className="he-rolar-seta" aria-hidden="true">
          <ArrowDown size={20} strokeWidth={2.2} />
        </span>
      </a>
    </section>
  );
}
