'use client';

/* ============================================================
   O calendário.

   Mês inteiro à vista, e não uma lista de "próximas datas": quem
   marca procedimento longo escolhe pelo dia da semana que consegue
   faltar do trabalho, e isso só se enxerga na grade.

   Dia fechado continua aparecendo, apagado — sumir com ele
   embaralha as colunas e a pessoa perde a noção de semana.
   ============================================================ */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { chaveDia, diaAtendivel, primeiroMesUtil } from '@/lib/agenda';

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export default function Calendario({
  mes,
  aoMudarMes,
  selecionado,
  aoSelecionar,
}: {
  mes: Date;
  aoMudarMes: (d: Date) => void;
  selecionado: string | null;
  aoSelecionar: (dia: string) => void;
}) {
  const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  /* O botão de voltar morre no primeiro mês que tem dia livre — que
     nem sempre é o mês de hoje. Deixar voltar para um mês todo
     apagado é oferecer uma tela que não serve para nada. */
  const limite = primeiroMesUtil();
  const noPrimeiroMes =
    mes.getFullYear() === limite.getFullYear() && mes.getMonth() === limite.getMonth();

  const celulas: (Date | null)[] = [];
  for (let i = 0; i < primeiro.getDay(); i++) celulas.push(null);
  for (let d = 1; d <= diasNoMes; d++) celulas.push(new Date(mes.getFullYear(), mes.getMonth(), d));

  return (
    <div className="cal">
      <div className="cal-topo">
        <button
          type="button"
          className="cal-seta"
          onClick={() => aoMudarMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
          disabled={noPrimeiroMes}
          aria-label="Mês anterior"
        >
          <ChevronLeft strokeWidth={2} />
        </button>

        <strong>
          {mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </strong>

        <button
          type="button"
          className="cal-seta"
          onClick={() => aoMudarMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
          aria-label="Próximo mês"
        >
          <ChevronRight strokeWidth={2} />
        </button>
      </div>

      <div className="cal-semana" aria-hidden="true">
        {SEMANA.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <div className="cal-grade">
        {celulas.map((d, i) => {
          if (!d) return <span key={`vazio-${i}`} className="cal-dia cal-vazio" />;

          const iso = chaveDia(d);
          const livre = diaAtendivel(d);
          const ehHoje = iso === chaveDia(hoje);

          return (
            <button
              key={iso}
              type="button"
              className="cal-dia"
              data-livre={livre ? '1' : '0'}
              data-hoje={ehHoje ? '1' : '0'}
              data-ativo={selecionado === iso ? '1' : '0'}
              disabled={!livre}
              aria-pressed={selecionado === iso}
              onClick={() => aoSelecionar(iso)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <p className="cal-nota">Atendimento de terça a sábado, das 9h às 18h.</p>
    </div>
  );
}
