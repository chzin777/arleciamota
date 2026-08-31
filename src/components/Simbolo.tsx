/* ============================================================
   O símbolo.

   Uma boca, vista de frente: arco do cupido em cima, lábio inferior
   cheio embaixo, e a linha da boca aberta no meio como vazio. É
   metade do que ela faz — e a única forma que ninguém confunde com
   outra coisa.

   Vem em vetor porque serve a três tamanhos muito diferentes:
   marcador de lista com 13px, marca d'água do rodapé com 500px e
   recorte da foto do herói. Um PNG só serviria a um.
   ============================================================ */

/* Contorno em coordenadas normalizadas (0 a 1) para o clipPath da
   foto: `clipPathUnits="objectBoundingBox"` faz o recorte acompanhar
   qualquer tamanho de elemento, o que `clip-path: path()` em pixels
   não faz. */
export const BOCA_NORM =
  'M0.03,0.46 C0.17,0.13 0.37,0.08 0.5,0.32 C0.63,0.08 0.83,0.13 0.97,0.46 C0.82,0.9 0.18,0.9 0.03,0.46 Z';

const EXTERNO = 'M6,55 C34,16 74,10 100,38 C126,10 166,16 194,55 C164,108 36,108 6,55 Z';
/* a linha da boca: um fuso fino, que o `evenodd` transforma em vazio */
const INTERNO = 'M22,55 C62,47 138,47 178,55 C138,66 62,66 22,55 Z';

export function Simbolo({
  className,
  titulo,
}: {
  className?: string;
  titulo?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      role={titulo ? 'img' : 'presentation'}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      <path d={`${EXTERNO} ${INTERNO}`} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/* O traço de sobrancelha: a outra metade do trabalho. Um arco que
   engrossa no meio e afina na cauda, como o pelo desenhado. Serve de
   enfeite flutuante no herói, onde repetir a boca quatro vezes daria
   a impressão de um adesivo colado na página. */
export function Arco({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 70"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4,54 C40,14 96,2 150,10 C176,14 192,24 198,38 C182,26 158,20 132,20 C90,20 44,34 10,62 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* O recorte vive uma vez só no documento. Um SVG de zero pixel, longe
   do fluxo, para o `clip-path: url(#am-boca)` das fotos. */
export function BocaClip() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        <clipPath id="am-boca" clipPathUnits="objectBoundingBox">
          <path d={BOCA_NORM} />
        </clipPath>
      </defs>
    </svg>
  );
}
