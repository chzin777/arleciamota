'use client';

/* ============================================================
   A esteira.

   Ela corre sozinha, mas a rolagem empurra: quanto mais rápido a
   pessoa desce, mais rápido a faixa anda, e ao subir ela inverte o
   sentido. É a diferença entre uma faixa que se move e uma faixa
   que responde — a segunda faz a página parecer uma superfície só.
   ============================================================ */

import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced, ScrollTrigger } from '@/lib/anim';
import { TARJA } from '@/dados';
import { Simbolo } from './Simbolo';

export default function Esteira() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const trilho = root.current?.querySelector<HTMLElement>('.esteira-trilho');
      if (!trilho) return;

      /* A metade do trilho é uma cópia exata da outra, então o laço
         pode voltar a zero sem emenda visível. */
      const meia = () => trilho.scrollWidth / 2;
      const x = gsap.quickSetter(trilho, 'x', 'px');

      let pos = 0;
      let direcao = -1;
      const base = 0.5;

      /* `fator` é um objeto vivo: a velocidade da rolagem entra aqui e
         volta a 1 sozinha. Sem o retorno suave a faixa daria um tranco
         a cada parada. */
      const fator = { v: 1 };

      const tick = (_t: number, delta: number) => {
        const largura = meia();
        if (!largura) return;
        pos += direcao * base * (delta / 16.7) * fator.v;
        if (pos <= -largura) pos += largura;
        if (pos > 0) pos -= largura;
        x(pos);
      };

      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = self.getVelocity();
          direcao = v < 0 ? 1 : -1;
          const alvo = gsap.utils.clamp(1, 7, 1 + Math.abs(v) / 320);
          gsap.to(fator, { v: alvo, duration: 0.25, overwrite: true });
          gsap.to(fator, { v: 1, duration: 0.9, delay: 0.25, overwrite: false });
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  return (
    <div className="esteira" ref={root} aria-hidden="true">
      <div className="esteira-trilho">
        {[0, 1].map((n) => (
          <span key={n}>
            {TARJA.map((t) => (
              <b key={t}>
                {t}
                <Simbolo />
              </b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
