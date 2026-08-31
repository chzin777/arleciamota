'use client';

import { useCallback, useRef, useState } from 'react';
import { useLenis } from '@/lib/anim';
import Abertura from '@/components/Abertura';
import Nav from '@/components/Nav';
import Trilha from '@/components/Trilha';
import Hero from '@/components/Hero';
import Esteira from '@/components/Esteira';
import Trabalho from '@/components/Trabalho';
import Tecnicas from '@/components/Tecnicas';
import Processo from '@/components/Processo';
import Procedimentos from '@/components/Procedimentos';
import Avaliacao from '@/components/Avaliacao';
import Depoimentos from '@/components/Depoimentos';
import Fechamento from '@/components/Fechamento';

export default function Pagina() {
  const root = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);
  const fechar = useCallback(() => setPronto(true), []);

  useLenis();

  return (
    <div ref={root} data-pronto={pronto ? '1' : '0'}>
      <Abertura aoFechar={fechar} />

      <a className="skip" href="#main">
        Pular para o conteúdo
      </a>

      <Nav />

      <main id="main" style={{ position: 'relative', overflowX: 'clip', width: '100%' }}>
        <Trilha />
        <Hero />
        <Esteira />
        <Trabalho />
        <Tecnicas />
        <Processo />
        <Procedimentos />
        <Avaliacao />
        <Depoimentos />
      </main>

      <Fechamento />
    </div>
  );
}
