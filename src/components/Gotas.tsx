'use client';

/* ============================================================
   Os traços que flutuam no herói.

   São arcos de sobrancelha, a outra metade do trabalho: a boca já
   é a forma central da cena, e repeti-la quatro vezes em volta
   faria a página parecer adesivada. O arco entra como gesto, não
   como marca.

   Cada uma declara quanto se move. O paralaxe do herói procura os
   elementos com a classe `he-plano` e lê `data-mov` e `data-rol`,
   então aqui basta declarar a profundidade — o motor é o mesmo que
   move o recorte da marca.

   O balanço fica na FORMA de dentro, e não no invólucro: o
   invólucro é quem o GSAP escreve, e uma animação de CSS no mesmo
   elemento disputaria a propriedade `transform` com ele.
   ============================================================ */

import { Arco } from './Simbolo';

const TRACOS = [
  { cls: 'gt-1', mov: 0.62, rol: 10 },
  { cls: 'gt-2', mov: 1.15, rol: 18 },
  { cls: 'gt-3', mov: 0.42, rol: 7 },
  { cls: 'gt-4', mov: 0.78, rol: 12 },
];

export default function Gotas() {
  return (
    <div className="gt-campo" aria-hidden="true">
      {TRACOS.map((p) => (
        <span className={`gt ${p.cls} he-plano`} key={p.cls} data-mov={p.mov} data-rol={p.rol}>
          <Arco className="gt-forma" />
        </span>
      ))}
    </div>
  );
}
