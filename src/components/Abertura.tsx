'use client';

/* ============================================================
   A cortina de abertura.

   Existe por um motivo prático, não decorativo: o herói tem foto
   grande e recorte, e o recorte só fica bonito depois que a imagem
   pintou. Um segundo de fundo escuro com o símbolo no meio compra
   esse tempo — e é o tempo que a página usa para escrever a
   primeira linha do título.

   A rolagem fica travada enquanto ela está no ar. `overflow: hidden`
   sozinho não segura o Lenis, que posiciona a página por script;
   por isso a trava é dupla, CSS e Lenis.
   ============================================================ */

import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, pausarRolagem } from '@/lib/anim';
import { Simbolo } from './Simbolo';

export default function Abertura({ aoFechar }: { aoFechar: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) {
        aoFechar();
        return;
      }

      /* Nada de guarda por ref aqui. No StrictMode o React monta, limpa
         e monta de novo, e a limpeza do useGSAP REVERTE a timeline da
         primeira montagem — com um guarda, a segunda montagem sairia na
         primeira linha e a cortina ficaria no ar para sempre, com a
         rolagem travada junto. */
      document.documentElement.classList.add('travado');
      pausarRolagem(true);

      const destravar = () => {
        document.documentElement.classList.remove('travado');
        pausarRolagem(false);
        aoFechar();
      };

      gsap
        .timeline({ defaults: { ease: 'expo.inOut' }, onComplete: destravar })
        .from('.ab-simbolo', { yPercent: 55, opacity: 0, duration: 0.9, ease: 'expo.out' })
        .from('.ab-nome', { opacity: 0, y: 14, duration: 0.7, ease: 'expo.out' }, 0.25)
        .to('.ab-barra i', { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.15)
        .to('.ab-simbolo, .ab-nome', { yPercent: -110, opacity: 0, duration: 0.7 }, 1.05)
        .to('.ab-barra', { opacity: 0, duration: 0.4 }, 1.05)
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.2);

      /* A trava tem que cair mesmo se a timeline for revertida no meio:
         página travada é o pior defeito possível. */
      return () => {
        document.documentElement.classList.remove('travado');
        pausarRolagem(false);
      };
    },
    { scope: root }
  );

  return (
    <div className="abertura" ref={root} aria-hidden="true">
      <Simbolo className="ab-simbolo" />
      <span className="ab-nome">arlecia mota</span>
      <span className="abertura-barra ab-barra">
        <i />
      </span>
    </div>
  );
}
