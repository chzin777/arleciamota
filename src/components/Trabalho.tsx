'use client';

/* ============================================================
   O trabalho — o campo de fotos na diagonal.

   Cinco colunas que sobem em velocidades diferentes enquanto a
   página rola, o conjunto inteiro girado, e as pontas morrendo no
   escuro. O texto flutua no meio, sobre um véu que impede uma foto
   clara de passar por trás de uma palavra e apagá-la.

   NÃO PRENDE A ROLAGEM: a rolagem continua sendo rolagem, e o
   movimento é consequência dela.

   A geometria vale entender antes de mexer:
   · cada coluna começa PUXADA PARA CIMA e desce durante o percurso;
     sem esse recuo ela nasce no lugar e não sobra caminho;
   · o conjunto girado precisa ser mais largo que a tela, senão as
     quinas aparecem no canto.

   Enquanto as fotos do Instagram não forem exportadas, cada quadro
   é uma superfície de pigmento. A grade e o movimento são os
   mesmos que as fotos vão herdar: preencher `GALERIA` com caminhos
   de arquivo troca uma coisa pela outra sem tocar no layout.
   ============================================================ */

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReduced } from '@/lib/anim';
import { GALERIA, NUMEROS } from '@/dados';
import Moldura from './Moldura';

/* A ALTURA DA SEÇÃO EM VH, repetida do CSS de propósito: o recuo
   inicial de cada coluna é derivado dela, e as duas contas têm que
   bater. Se o `min-height` de `.cm` mudar, este número muda junto —
   senão a coluna mais rápida termina antes do fim do percurso e abre
   um vão. */
const ALTURA = 100;

/* Cada coluna tem a sua velocidade, e o comprimento acompanha: uma
   coluna que desce `altura × vel` precisa de fila sobrando nas duas
   pontas. As ordens são embaralhadas para as repetições não caírem
   lado a lado. */
const COLUNAS = [
  { i: [0, 5, 1, 7, 3, 8, 2, 6, 4], vel: 0.5 },
  { i: [1, 6, 2, 8, 4, 0, 5, 3, 7], vel: 0.85 },
  { i: [2, 7, 3, 0, 5, 1, 6, 4, 8], vel: 0.32 },
  { i: [3, 8, 4, 1, 6, 2, 7, 5, 0], vel: 0.68 },
  { i: [4, 0, 5, 2, 7, 3, 8, 6, 1], vel: 0.44 },
];

function formatar(v: number, decimais = 0) {
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });
}

export default function Trabalho() {
  const root = useRef<HTMLElement>(null);
  const numeros = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;

      gsap.utils.toArray<HTMLElement>('.cm-col', root.current).forEach((col) => {
        const vel = Number(col.dataset.vel);
        gsap.to(col, {
          /* o percurso é medido pela altura da SEÇÃO, não da janela, e
             recalculado a cada refresh pelo `invalidateOnRefresh` */
          y: () => (root.current?.offsetHeight || window.innerHeight) * vel,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            /* `scrub: true` gruda a animação no pixel da rolagem, e cada
               salto de roda vira um salto na imagem — lê como travado.
               Com um NÚMERO, o scrub vira perseguição amortecida. */
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      });

      gsap.from('.cm-titulo > *', {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 62%', once: true },
      });

      /* Cada número conta uma vez, quando aparece. */
      gsap.utils.toArray<HTMLElement>('.st-num b', numeros.current).forEach((el) => {
        const fim = Number(el.dataset.valor);
        const dec = Number(el.dataset.dec ?? 0);
        const prefixo = el.dataset.prefixo ?? '';
        const sufixo = el.dataset.sufixo ?? '';
        const conta = { v: 0 };

        gsap.to(conta, {
          v: fim,
          duration: 1.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = `${prefixo}${formatar(conta.v, dec)}${sufixo}`;
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <>
      <section className="cm" id="trabalho" ref={root} aria-labelledby="cm-t">
        <div className="cm-conjunto" aria-hidden="true">
          {COLUNAS.map((c, ci) => (
            <div
              className="cm-col"
              key={ci}
              data-vel={c.vel}
              style={{ marginTop: `${-(c.vel * ALTURA + 20)}vh` }}
            >
              {c.i.map((idx, j) => (
                <div className="cm-quadro" key={`${ci}-${j}`}>
                  <Moldura src={GALERIA[idx]} sizes="24vw" quality={70} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* as pontas morrem no escuro: sem isso o conjunto girado
            mostra as quinas e o corte denuncia o truque */}
        <span className="cm-fade cm-fade-topo" aria-hidden="true" />
        <span className="cm-fade cm-fade-base" aria-hidden="true" />

        <div className="cm-titulo">
          <p className="rotulo">O trabalho</p>
          <h2 className="display cm-h2" id="cm-t">
            o traço é <span className="cm-destaque">seu</span>, a mão é minha
          </h2>
          <p className="cm-sub">
            Cada rosto pede uma curva diferente. O desenho sai da sua estrutura óssea, do pelo que
            você já tem e do que você quer ver no espelho todo dia.
          </p>
          <a className="btn" href="#tecnicas">
            Ver as técnicas
            <ArrowUpRight strokeWidth={2.2} />
          </a>
        </div>
      </section>

      <div className="secao-numeros" ref={numeros}>
        <div className="container">
          <dl className="st-numeros">
            {NUMEROS.map((n) => (
              <div className="st-num" key={n.rotulo}>
                <dt style={{ order: 1 }}>
                  <b
                    data-valor={n.valor}
                    data-dec={n.decimais ?? 0}
                    data-prefixo={n.prefixo ?? ''}
                    data-sufixo={n.sufixo ?? ''}
                  >
                    {`${n.prefixo ?? ''}${formatar(n.valor, n.decimais ?? 0)}${n.sufixo ?? ''}`}
                  </b>
                </dt>
                <dd style={{ order: 2, margin: 0 }}>
                  <span>{n.rotulo}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
