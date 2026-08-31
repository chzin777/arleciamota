/* ============================================================
   O lugar da foto.

   O site nasceu antes das imagens: o material dela está no
   Instagram e ainda não foi exportado. Em vez de apontar para
   arquivos que não existem — o que deixaria a página cheia de
   ícone de imagem quebrada — cada foto passa por aqui.

   Sem `src`, o componente desenha uma superfície de pigmento com o
   símbolo no meio e uma legenda dizendo o que entra ali. Com
   `src`, vira a foto de verdade, no mesmo recorte e no mesmo
   tamanho. Trocar uma coisa pela outra é preencher o campo `foto`
   em `src/dados.ts` — nenhum layout muda.
   ============================================================ */

import Image from 'next/image';
import { Simbolo } from './Simbolo';

export default function Moldura({
  src,
  alt = '',
  pos = '50% 50%',
  legenda,
  sizes = '(max-width: 900px) 92vw, 45vw',
  priority,
  quality = 80,
}: {
  src?: string;
  alt?: string;
  pos?: string;
  legenda?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        style={{ objectFit: 'cover', objectPosition: pos }}
      />
    );
  }

  return (
    <span className="vaga" aria-hidden="true">
      <Simbolo />
      {legenda ? <i>{legenda}</i> : null}
    </span>
  );
}
