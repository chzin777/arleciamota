/* ============================================================
   A agenda — SIMULADA.

   Nada aqui fala com servidor: os horários livres são calculados
   por uma conta determinística em cima da data, e as marcações
   ficam no navegador de quem marcou. Serve para a Arlecia ver o
   fluxo inteiro de pé e dizer o que muda antes de existir back-end.

   Quando virar de verdade, só três funções trocam de corpo:
   `horariosDoDia`, `salvar` e `listar`. O resto da tela não sabe de
   onde vem o dado.

   REVISAR com ela: duração e valor de cada procedimento, dias de
   atendimento e horário de trabalho.
   ============================================================ */

export type Servico = {
  id: string;
  nome: string;
  detalhe: string;
  /* em minutos — é o que define quantos horários cabem no dia */
  duracao: number;
  /* em reais; 0 quando o valor só sai na avaliação */
  valor: number;
};

export const SERVICOS: Servico[] = [
  {
    id: 'avaliacao',
    nome: 'Avaliação',
    detalhe: 'Conversa, análise do rosto e simulação do desenho. Sem compromisso.',
    duracao: 40,
    valor: 0,
  },
  {
    id: 'sobrancelha',
    nome: 'Sobrancelha',
    detalhe: 'Fio a fio, shadow lines ou ombré — a técnica sai da avaliação.',
    duracao: 150,
    valor: 750,
  },
  {
    id: 'labios',
    nome: 'Lábios',
    detalhe: 'Micropigmentação labial: cor, contorno e uniformidade.',
    duracao: 180,
    valor: 900,
  },
  {
    id: 'delineado',
    nome: 'Delineado',
    detalhe: 'Linha rente ao cílio, do discreto ao marcado.',
    duracao: 90,
    valor: 600,
  },
  {
    id: 'retoque',
    nome: 'Retoque',
    detalhe: 'De 30 a 45 dias depois. Incluso em quem fez comigo.',
    duracao: 90,
    valor: 0,
  },
];

/* Segunda a sábado. Domingo (0) fechado e segunda (1) reservada para
   retorno e material — é o padrão mais comum em estúdio de PMU, e é
   um dos pontos que ela precisa confirmar. */
const DIAS_FECHADOS = [0, 1];

/* A jornada, em minutos desde a meia-noite: 9h às 18h, com uma hora
   de almoço às 12h que some da grade. */
const ABRE = 9 * 60;
const FECHA = 18 * 60;
const ALMOCO_INICIO = 12 * 60;
const ALMOCO_FIM = 13 * 60;

/* Quantos dias para a frente a agenda abre. Além disso ela prefere
   falar antes — procedimento longo demais para marcar com meses. */
export const JANELA_DIAS = 60;

export type Marcacao = {
  codigo: string;
  servicoId: string;
  dia: string; // AAAA-MM-DD
  hora: string; // HH:MM
  nome: string;
  telefone: string;
  observacao?: string;
  criadoEm: string;
};

const CHAVE = 'arleciamota:agendamentos';

export function chaveDia(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dia = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function daChave(s: string) {
  const [a, m, d] = s.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function minutosParaHora(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${`${h}`.padStart(2, '0')}:${`${m}`.padStart(2, '0')}`;
}

/* Um embaralhador determinístico: a mesma data devolve sempre a mesma
   agenda. Sem isso, cada renderização inventaria uma ocupação nova e
   o horário sumiria debaixo do dedo de quem está escolhendo. */
function semente(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function diaAtendivel(d: Date) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + JANELA_DIAS);
  const alvo = new Date(d);
  alvo.setHours(0, 0, 0, 0);

  if (alvo < hoje || alvo > limite) return false;
  return !DIAS_FECHADOS.includes(alvo.getDay());
}

/**
 * O primeiro dia que ainda dá para marcar.
 *
 * O calendário abre no mês DESTE dia, e não no mês de hoje: no fim
 * de agosto, com o mês já sem dia de atendimento, abrir em agosto
 * mostra uma grade inteira apagada e obriga a pessoa a adivinhar que
 * precisa avançar. Vira setembro sozinho.
 */
export function primeiroDiaUtil() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i <= JANELA_DIAS; i++) {
    if (diaAtendivel(d)) return d;
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function primeiroMesUtil() {
  const d = primeiroDiaUtil();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export type Horario = { hora: string; livre: boolean };

/**
 * A grade de um dia para um serviço.
 *
 * O passo é de 30 minutos, mas o horário só entra se o procedimento
 * inteiro couber antes do fim do expediente e não atravessar o
 * almoço — marcar 17h30 para um serviço de três horas seria vender
 * um horário que não existe.
 */
export function horariosDoDia(diaISO: string, servico: Servico): Horario[] {
  const dia = daChave(diaISO);
  if (!diaAtendivel(dia)) return [];

  const ocupados = listar()
    .filter((m) => m.dia === diaISO)
    .map((m) => m.hora);

  const grade: Horario[] = [];
  const base = semente(diaISO + servico.id);

  for (let t = ABRE; t + servico.duracao <= FECHA; t += 30) {
    const fim = t + servico.duracao;
    const cruzaAlmoco = t < ALMOCO_FIM && fim > ALMOCO_INICIO;
    if (cruzaAlmoco) continue;

    const hora = minutosParaHora(t);
    /* dois em cada cinco horários nascem ocupados: agenda vazia lê
       como estúdio parado, e agenda cheia demais desanima */
    const ocupadoFake = (base + t) % 5 < 2;
    grade.push({ hora, livre: !ocupadoFake && !ocupados.includes(hora) });
  }

  return grade;
}

export function listar(): Marcacao[] {
  if (typeof window === 'undefined') return [];
  try {
    const cru = window.localStorage.getItem(CHAVE);
    return cru ? (JSON.parse(cru) as Marcacao[]) : [];
  } catch {
    /* modo anônimo e navegador com armazenamento bloqueado caem aqui:
       a tela continua funcionando, só não lembra do que foi marcado */
    return [];
  }
}

export function salvar(m: Omit<Marcacao, 'codigo' | 'criadoEm'>): Marcacao {
  const marcacao: Marcacao = {
    ...m,
    codigo: gerarCodigo(m.dia, m.hora),
    criadoEm: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify([...listar(), marcacao]));
  } catch {
    /* sem armazenamento, a marcação vale só para esta tela */
  }
  return marcacao;
}

function gerarCodigo(dia: string, hora: string) {
  const n = semente(dia + hora + Date.now()) % 46656;
  return `AM-${n.toString(36).toUpperCase().padStart(3, '0')}`;
}

export function formatarValor(v: number) {
  if (!v) return 'na avaliação';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarDuracao(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${`${m}`.padStart(2, '0')}` : `${h}h`;
}

export function formatarDiaLongo(diaISO: string) {
  return daChave(diaISO).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

/* Máscara de telefone. Formata enquanto digita e devolve só o que
   cabe num celular brasileiro — 11 dígitos com o nono. */
export function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

export function telefoneValido(valor: string) {
  return valor.replace(/\D/g, '').length >= 10;
}
