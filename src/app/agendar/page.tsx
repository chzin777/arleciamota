'use client';

/* ============================================================
   Agendamento — quatro passos numa tela só.

   Serviço, dia, hora, dados. Um passo por vez porque cada escolha
   muda a seguinte: a duração do serviço decide quais horários
   existem, e o dia decide quais estão livres. Mostrar tudo junto
   obrigaria a apagar meia tela a cada clique.

   Os passos já resolvidos viram uma linha clicável no topo — dá
   para voltar em qualquer um sem perder o que já foi escolhido.

   ATENÇÃO: a agenda é simulada (veja `src/lib/agenda.ts`). Nada é
   enviado para lugar nenhum e nada chega até a Arlecia. A tela
   existe para ela aprovar o fluxo antes de existir back-end.
   ============================================================ */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import {
  SERVICOS,
  type Marcacao,
  type Servico,
  chaveDia,
  formatarDiaLongo,
  formatarDuracao,
  formatarValor,
  horariosDoDia,
  mascaraTelefone,
  primeiroMesUtil,
  salvar,
  telefoneValido,
} from '@/lib/agenda';
import { CONTATO } from '@/dados';
import { Simbolo } from '@/components/Simbolo';
import Calendario from '@/components/Calendario';

const PASSOS = ['Serviço', 'Dia', 'Hora', 'Seus dados'];

export default function Agendar() {
  const [passo, setPasso] = useState(0);
  const [servico, setServico] = useState<Servico | null>(null);
  const [mes, setMes] = useState(primeiroMesUtil);
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');
  const [feito, setFeito] = useState<Marcacao | null>(null);

  const topo = useRef<HTMLDivElement>(null);

  /* A grade só é montada no cliente: ela lê o que já foi marcado no
     navegador, e no servidor esse dado não existe. Calcular nos dois
     lados devolveria HTML diferente do que a tela desenha. */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const horarios = useMemo(() => {
    if (!montado || !dia || !servico) return [];
    return horariosDoDia(dia, servico);
  }, [montado, dia, servico]);

  /* Ao trocar de passo a tela volta para o topo do cartão. Sem isso,
     quem escolhe um horário no fim de uma grade longa cai no meio do
     formulário seguinte, já rolado. */
  useEffect(() => {
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [passo]);

  function escolherServico(s: Servico) {
    setServico(s);
    setHora(null);
    setPasso(1);
  }

  function escolherDia(d: string) {
    setDia(d);
    setHora(null);
    setPasso(2);
  }

  function escolherHora(h: string) {
    setHora(h);
    setPasso(3);
  }

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 3) return setErro('Escreva seu nome completo.');
    if (!telefoneValido(telefone)) return setErro('Falta o WhatsApp com DDD.');
    if (!servico || !dia || !hora) return setErro('Faltou escolher serviço, dia ou hora.');

    setErro('');
    setFeito(
      salvar({
        servicoId: servico.id,
        dia,
        hora,
        nome: nome.trim(),
        telefone,
        observacao: observacao.trim() || undefined,
      })
    );
  }

  /* ---------- confirmação ---------- */

  if (feito && servico && dia && hora) {
    const texto = encodeURIComponent(
      `Olá! Agendei ${servico.nome} pelo site para ${formatarDiaLongo(dia)} às ${hora}. Protocolo ${feito.codigo}.`
    );

    return (
      <main className="ag">
        <div className="ag-caixa ag-pronto" ref={topo}>
          <span className="ag-check" aria-hidden="true">
            <Check strokeWidth={2.6} />
          </span>
          <p className="rotulo">Pedido registrado</p>
          <h1 className="display ag-titulo">Guardei o seu horário</h1>
          <p className="ag-sub">
            {formatarDiaLongo(dia)}, às {hora} — {servico.nome}. Protocolo{' '}
            <b>{feito.codigo}</b>.
          </p>

          <p className="ag-aviso">
            Esta é uma <b>demonstração</b>: o pedido ficou salvo só neste navegador e ainda não
            chegou até a Arlecia. Para valer, confirme pelo WhatsApp.
          </p>

          <div className="ag-acoes">
            <a
              className="btn"
              href={`https://wa.me/${CONTATO.telefoneURL.replace('+', '')}?text=${texto}`}
              target="_blank"
              rel="noopener"
            >
              Confirmar no WhatsApp
              <ArrowUpRight strokeWidth={2.2} />
            </a>
            <Link className="btn btn-vazado" href="/">
              Voltar ao site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- fluxo ---------- */

  return (
    <main className="ag">
      <div className="ag-caixa" ref={topo}>
        <div className="ag-cabeca">
          <Link className="ag-voltar" href="/">
            <ArrowLeft size={16} strokeWidth={2} />
            Site
          </Link>
          <span className="ag-marca">
            <Simbolo />
            arlecia<i>mota</i>
          </span>
        </div>

        <h1 className="display ag-titulo">Agendar</h1>

        {/* A trilha de passos. Passo já resolvido volta a ser clicável;
            passo à frente fica morto, porque ele depende do de trás. */}
        <ol className="ag-passos">
          {PASSOS.map((p, i) => (
            <li key={p}>
              <button
                type="button"
                data-estado={i === passo ? 'agora' : i < passo ? 'feito' : 'espera'}
                disabled={i > passo}
                onClick={() => setPasso(i)}
              >
                <b>{i + 1}</b>
                {p}
              </button>
            </li>
          ))}
        </ol>

        {passo === 0 && (
          <section className="ag-etapa">
            <h2 className="ag-h2">O que você quer fazer?</h2>
            <div className="ag-servicos">
              {SERVICOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="ag-servico"
                  data-ativo={servico?.id === s.id ? '1' : '0'}
                  onClick={() => escolherServico(s)}
                >
                  <span className="ag-servico-nome">{s.nome}</span>
                  <span className="ag-servico-txt">{s.detalhe}</span>
                  <span className="ag-servico-meta">
                    {formatarDuracao(s.duracao)} · {formatarValor(s.valor)}
                  </span>
                </button>
              ))}
            </div>
            <p className="ag-nota">
              Valores e durações são de exemplo — a Arlecia precisa confirmar antes de o site ir
              ao ar.
            </p>
          </section>
        )}

        {passo === 1 && servico && (
          <section className="ag-etapa">
            <h2 className="ag-h2">
              Que dia funciona para você?
              <span>
                {servico.nome} · {formatarDuracao(servico.duracao)}
              </span>
            </h2>
            <Calendario
              mes={mes}
              aoMudarMes={setMes}
              selecionado={dia}
              aoSelecionar={escolherDia}
            />
          </section>
        )}

        {passo === 2 && servico && dia && (
          <section className="ag-etapa">
            <h2 className="ag-h2">
              Horários de {formatarDiaLongo(dia)}
              <span>
                {servico.nome} · {formatarDuracao(servico.duracao)}
              </span>
            </h2>

            {!montado ? (
              <p className="ag-nota">Carregando a grade…</p>
            ) : horarios.length === 0 ? (
              <p className="ag-vazio">
                Não há horário para esse serviço nesse dia. Escolha outro dia.
              </p>
            ) : (
              <div className="ag-horas">
                {horarios.map((h) => (
                  <button
                    key={h.hora}
                    type="button"
                    className="ag-hora"
                    data-ativo={hora === h.hora ? '1' : '0'}
                    disabled={!h.livre}
                    onClick={() => escolherHora(h.hora)}
                  >
                    {h.hora}
                  </button>
                ))}
              </div>
            )}

            <p className="ag-nota">Horário apagado já está ocupado.</p>
          </section>
        )}

        {passo === 3 && servico && dia && hora && (
          <section className="ag-etapa">
            <h2 className="ag-h2">Seus dados</h2>

            <div className="ag-resumo">
              <span>
                <i>Serviço</i>
                {servico.nome}
              </span>
              <span>
                <i>Quando</i>
                {formatarDiaLongo(dia)}, {hora}
              </span>
              <span>
                <i>Duração</i>
                {formatarDuracao(servico.duracao)}
              </span>
              <span>
                <i>Valor</i>
                {formatarValor(servico.valor)}
              </span>
            </div>

            <form className="ag-form" onSubmit={confirmar} noValidate>
              <label className="ag-campo">
                <span>Nome completo</span>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="name"
                  placeholder="Como você se chama"
                />
              </label>

              <label className="ag-campo">
                <span>WhatsApp</span>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(31) 9 0000-0000"
                />
              </label>

              <label className="ag-campo ag-campo-largo">
                <span>Alguma coisa que eu precise saber? (opcional)</span>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  placeholder="Procedimento anterior, alergia, medicação, gestação…"
                />
              </label>

              {erro ? (
                <p className="ag-erro" role="alert">
                  {erro}
                </p>
              ) : null}

              <button className="btn ag-enviar" type="submit">
                Confirmar agendamento
                <ArrowUpRight strokeWidth={2.2} />
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
