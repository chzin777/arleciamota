'use client';

/* ============================================================
   A trilha — o elemento assinatura.

   Um traço só, contínuo, que atravessa a página inteira e vai
   sendo desenhado conforme a pessoa desce. É o mesmo gesto que ela
   faz na pele: um fio puxado de uma vez, sem levantar a mão.

   O SVG estica com `preserveAspectRatio="none"`, então a curva
   acompanha qualquer altura de documento. A espessura não estica
   junto por causa do `vector-effect: non-scaling-stroke` no CSS —
   sem ele o traço engordaria numa página longa e sumiria numa
   curta.
   ============================================================ */

import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';

const CURVA =
  'M 86 0 C 86 58, 14 80, 14 150 C 14 222, 92 240, 92 320 C 92 400, 8 422, 8 502 C 8 582, 90 602, 90 682 C 90 760, 12 782, 12 860 C 12 932, 58 950, 58 1000';

export default function Trilha() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const linhas = gsap.utils.toArray<SVGPathElement>('path', root.current);
      if (!linhas.length) return;

      linhas.forEach((linha) => {
        const total = linha.getTotalLength();
        gsap.set(linha, { strokeDasharray: total, strokeDashoffset: total });
        gsap.to(linha, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current?.parentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.9,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <svg
      className="trilha"
      ref={root}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="trilha-eco" d={CURVA} />
      <path d={CURVA} />
    </svg>
  );
}
