'use client';

/* ============================================================
   Tarja fina + barra flutuante.

   A tarja carrega o que a pessoa procura antes de decidir qualquer
   coisa: a frase que resume o trabalho e onde ela atende. Some com
   a rolagem, e a barra sobe para o lugar dela — assim o menu nunca
   fica pairando sobre um vão vazio.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CONTATO, MENU, PROVA } from '@/dados';
import { Simbolo } from './Simbolo';

export default function Nav() {
  const [preso, setPreso] = useState(false);
  const [aberta, setAberta] = useState(false);
  const [ativo, setAtivo] = useState('');
  const gaveta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rolou = () => setPreso(window.scrollY > 60);
    rolou();
    window.addEventListener('scroll', rolou, { passive: true });
    return () => window.removeEventListener('scroll', rolou);
  }, []);

  /* Qual seção está sendo lida.

     O observador olha uma FAIXA no meio da tela (as margens cortam o
     topo e a base), não a seção inteira: com seções de altura muito
     diferente, quem entra primeiro na tela nem sempre é quem a pessoa
     está lendo. Entre duas que cruzam a faixa ao mesmo tempo, vence a
     de maior área visível. */
  useEffect(() => {
    const alvos = MENU.map((m) => document.querySelector(m.href)).filter(
      (el): el is Element => Boolean(el)
    );
    if (!alvos.length) return;

    const visiveis = new Map<string, number>();

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) visiveis.set(`#${e.target.id}`, e.intersectionRatio);
          else visiveis.delete(`#${e.target.id}`);
        });

        let melhor = '';
        let maior = 0;
        visiveis.forEach((v, k) => {
          if (v >= maior) {
            maior = v;
            melhor = k;
          }
        });
        setAtivo(melhor);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    alvos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  /* Esc fecha a gaveta. Numa navegação que cobre a tela inteira, sem
     isso a única saída é acertar o botão de fechar. */
  useEffect(() => {
    if (!aberta) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberta(false);
    };
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [aberta]);

  return (
    <>
      <div className="tarja-topo">
        <span className="tt-frase">
          <Simbolo />
          <b>{PROVA.frase}</b>
        </span>
        <span className="tt-fim">
          <a className="tt-esconde" href={CONTATO.instagramURL} target="_blank" rel="noopener">
            {CONTATO.instagram}
          </a>
          <span>{CONTATO.cidade}</span>
        </span>
      </div>

      <nav className="nav" data-preso={preso ? '1' : '0'} aria-label="Principal">
        <a className="nav-marca" href="#topo">
          <Simbolo />
          <span>
            arlecia<i>mota</i>
          </span>
        </a>

        <div className="nav-menu">
          {MENU.map((m) => (
            <a
              key={m.href}
              href={m.href}
              data-ativo={ativo === m.href ? '1' : '0'}
              aria-current={ativo === m.href ? 'true' : undefined}
            >
              {m.rotulo}
            </a>
          ))}
        </div>

        <a className="btn nav-cta" href={CONTATO.agendar}>
          Agendar avaliação
        </a>

        <button
          className="nav-menu-botao"
          onClick={() => setAberta(true)}
          aria-label="Abrir menu"
          aria-expanded={aberta}
        >
          <Menu strokeWidth={1.8} />
        </button>
      </nav>

      <div
        className="nav-gaveta"
        ref={gaveta}
        data-aberta={aberta ? '1' : '0'}
        aria-hidden={!aberta}
        inert={!aberta}
      >
        <button className="ng-fechar" onClick={() => setAberta(false)} aria-label="Fechar menu">
          <X strokeWidth={1.6} />
        </button>

        {MENU.map((m) => (
          <a
            key={m.href}
            href={m.href}
            data-ativo={ativo === m.href ? '1' : '0'}
            aria-current={ativo === m.href ? 'true' : undefined}
            onClick={() => setAberta(false)}
          >
            {m.rotulo}
          </a>
        ))}

        <a
          className="btn"
          href={CONTATO.agendar}
          style={{ marginTop: 24, alignSelf: 'flex-start' }}
        >
          Agendar avaliação
        </a>

        <div className="ng-rodape">
          <span>{CONTATO.instagram}</span>
          <span>{CONTATO.cidade}</span>
        </div>
      </div>
    </>
  );
}
