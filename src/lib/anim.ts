'use client';

/* ============================================================
   A camada de movimento.

   Um módulo só para GSAP, ScrollTrigger e Lenis: registrar o plugin
   em cada componente faria o registro rodar dezenas de vezes, e a
   rolagem suave precisa de UMA instância viva por página — duas
   brigam pelo mesmo scroll e a página treme.
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const EASE = 'power3.out';
export const SAIDA = 'expo.out';

export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisVivo: Lenis | null = null;

/** Para ou retoma a rolagem suave. Devolve `false` se não há Lenis. */
export function pausarRolagem(pausar: boolean) {
  if (!lenisVivo) return false;
  if (pausar) lenisVivo.stop();
  else lenisVivo.start();
  return true;
}

export function useLenis() {
  useEffect(() => {
    if (prefersReduced()) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisVivo = lenis;

    // gsap.ticker entrega segundos; lenis.raf espera milissegundos.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    /* Âncoras também rolam suave. Num site em que tudo desliza, o
       salto seco de um href="#algo" é o único movimento duro — e é
       justo o que o menu faz o tempo todo. */
    const clicou = (e: MouseEvent) => {
      const alvoEvento = e.target as HTMLElement | null;
      const a = alvoEvento?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;

      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const alvo = document.querySelector(id);
      if (!alvo) return;

      e.preventDefault();
      lenis.scrollTo(alvo as HTMLElement, { offset: -96, duration: 1.3 });
      history.pushState(null, '', id);
    };

    document.addEventListener('click', clicou);

    return () => {
      document.removeEventListener('click', clicou);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisVivo = null;
    };
  }, []);
}

/**
 * Quebra o texto em spans por palavra e por caractere, preservando a
 * quebra de linha natural. Substitui o SplitText, que é do Club GSAP.
 */
export function splitChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';
  el.setAttribute('aria-label', text);

  const chars: HTMLSpanElement[] = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.style.display = 'inline-block';
    word.style.whiteSpace = 'nowrap';
    word.setAttribute('aria-hidden', 'true');
    for (const ch of chunk) {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = ch;
      word.appendChild(span);
      chars.push(span);
    }
    el.appendChild(word);
  });
  return chars;
}

/** Espera as webfonts antes de medir texto — evita reflow feio. */
export function whenFontsReady(cb: () => void) {
  if (typeof document === 'undefined') return;
  if (document.fonts?.status === 'loaded') cb();
  else if (document.fonts?.ready) document.fonts.ready.then(cb);
  else cb();
}

export { gsap, ScrollTrigger, useGSAP };
