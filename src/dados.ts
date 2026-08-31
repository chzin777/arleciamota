/* ============================================================
   Conteúdo — Arlecia Mota PMU.

   A base é o que está no perfil dela: micropigmentação de lábios e
   sobrancelhas, atendimento em Belo Horizonte, agendamento pelo
   link da bio, e a frase que ela mesma usa nas legendas —
   "menos contorno, mais naturalidade".

   ATENÇÃO — as fotos em /public/fotos são TEMPORÁRIAS, geradas por
   IA para o site parar de pé antes do material real. Elas não são
   trabalho dela e não podem ir ao ar. Substituir pelos arquivos do
   Instagram mantendo os mesmos nomes resolve tudo de uma vez.

   O que ainda não veio dela está marcado com REVISAR: número de
   telefone, endereço, preços e depoimentos precisam ser conferidos
   antes de o site ir ao ar. Nada aqui promete técnica que ela não
   anuncia no perfil.
   ============================================================ */

export const CONTATO = {
  /* A tela de marcação do próprio site. O link da bio continua
     abaixo, para quem prefere falar antes. */
  agendar: '/agendar',
  /* REVISAR: telefone real. O link de agendamento é o da bio. */
  agendamento: 'https://bit.ly/arleciamotapmu',
  telefone: '(31) 9 0000-0000',
  telefoneURL: '+5531900000000',
  email: 'contato@arleciamota.com.br',
  instagram: '@arleciamota.pmu',
  instagramURL: 'https://www.instagram.com/arleciamota.pmu',
  cidade: 'Belo Horizonte — Minas Gerais',
  /* REVISAR: endereço do estúdio. */
  endereco: 'Atendimento com hora marcada',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Belo+Horizonte+MG',
};

export const PROVA = {
  frase: 'Menos contorno, mais naturalidade',
  seguidores: '4,4 mil',
  fonte: 'Instagram',
};

/* A tarja que corre. Frases curtas, sem verbo, porque elas passam
   depressa demais para caber uma oração inteira. */
export const TARJA = [
  'Lábios',
  'Sobrancelhas',
  'Efeito natural',
  'Pele respeitada',
  'Belo Horizonte',
  'Hora marcada',
];

export const NUMEROS = [
  { valor: 2, sufixo: 'h', rotulo: 'de sessão, do desenho ao último traço' },
  { valor: 30, prefixo: '+', rotulo: 'dias até o retoque, já incluso' },
  { valor: 4.4, sufixo: ' mil', rotulo: 'pessoas acompanham o trabalho', decimais: 1 },
  { valor: 100, sufixo: '%', rotulo: 'do desenho aprovado por você antes de começar' },
];

/* As técnicas. O acordeão mostra uma de cada vez, e cada uma abre
   pelo nome que a pessoa procura no Instagram. */
export const TECNICAS = [
  {
    id: 'fio',
    foto: '/fotos/sobrancelha-fio.png',
    titulo: 'Sobrancelha fio a fio',
    texto:
      'Traço a traço, seguindo o sentido em que o seu pelo já nasce. De longe ninguém vê pigmento — vê sobrancelha.',
  },
  {
    id: 'shadow',
    foto: '/fotos/retrato.png',
    titulo: 'Shadow lines',
    texto:
      'O fio a fio com um véu de sombra por baixo. Preenche a falha sem fechar o desenho, e segura melhor em pele oleosa.',
  },
  {
    id: 'ombre',
    foto: '/fotos/sobrancelha-ombre.png',
    titulo: 'Ombré shadow',
    texto:
      'Esfumado do claro para o cheio, começo suave e cauda marcada. É o efeito de sobrancelha maquiada que acorda pronta.',
  },
  {
    id: 'labios',
    foto: '/fotos/labios-1.png',
    titulo: 'Micropigmentação labial',
    texto:
      'Cor devolvida ao lábio, contorno corrigido e a boca uniforme. Sem risco duro em volta: a cor nasce de dentro.',
  },
  {
    id: 'delineado',
    foto: '/fotos/delineado.png',
    titulo: 'Delineado',
    texto:
      'Uma linha fina rente ao cílio, que só engrossa se você pedir. Olhar definido no dia em que não dá tempo de maquiar.',
  },
  {
    id: 'reparadora',
    foto: '/fotos/labios-2.png',
    titulo: 'Pigmentação reparadora',
    texto:
      'Camuflagem de cicatriz e de estria em pele já cicatrizada, feita em sessões, respeitando o tempo da sua pele.',
  },
];

/* As três etapas são uma sequência de verdade: a ordem muda o
   resultado. É o único lugar da página onde numerar significa algo. */
export const ETAPAS = [
  {
    n: '1',
    foto: '/fotos/desenho.png',
    titulo: 'Visagismo e desenho',
    texto:
      'Antes de qualquer agulha, a gente desenha. Mede o seu rosto, testa a curva, escolhe o tom junto com você — e só sai do desenho quando você olha no espelho e diz que é isso.',
  },
  {
    n: '2',
    foto: '/fotos/sobrancelha-fio.png',
    titulo: 'Pigmentação',
    texto:
      'Anestésico tópico, material descartável e a mão lenta. Cada traço entra na profundidade certa: pigmento raso some, pigmento fundo espalha e azula com o tempo.',
  },
  {
    n: '3',
    foto: '/fotos/labios-rosto.png',
    titulo: 'Cicatrização e retoque',
    texto:
      'Você sai com as instruções de cuidado por escrito e volta em 30 a 45 dias. O retoque é parte do procedimento, não um extra: é nele que a cor final se fecha.',
  },
];

export const PROCEDIMENTOS = [
  {
    id: 'sobrancelhas',
    foto: '/fotos/sobrancelha-ombre.png',
    nome: 'Sobrancelhas',
    texto: 'Fio a fio, shadow lines e ombré. O desenho que já era seu, com a falha preenchida.',
  },
  {
    id: 'labios',
    foto: '/fotos/labios-2.png',
    nome: 'Lábios',
    texto: 'Cor, contorno e uniformidade. A boca que você já tem, acordada.',
  },
  {
    id: 'olhos',
    foto: '/fotos/delineado.png',
    nome: 'Olhos',
    texto: 'Delineado rente ao cílio, do discreto ao marcado, do jeito que combina com o seu olhar.',
  },
];

export const CUIDADOS = [
  { nome: 'Sem sol direto', dur: '15 dias', obs: 'e protetor depois' },
  { nome: 'Sem piscina e mar', dur: '15 dias', obs: 'nem sauna' },
  { nome: 'Sem esfoliar a área', dur: '30 dias', obs: 'nem ácido' },
  { nome: 'Pomada indicada', dur: '7 dias', obs: 'camada fina' },
  { nome: 'Não descascar a casquinha', dur: 'sempre', obs: 'ela cai sozinha' },
  { nome: 'Retoque', dur: '30 a 45 dias', obs: 'já incluso' },
];

export const AVALIACAO = [
  'Conversa sobre o que você quer e o que a sua pele permite',
  'Análise do formato do rosto e do pelo que você já tem',
  'Simulação do desenho e escolha do tom, sem compromisso',
  'Orçamento fechado, sem surpresa no dia do procedimento',
];

/* REVISAR: depoimentos precisam vir das clientes reais, com nome
   autorizado. Estes são marcadores de lugar com texto neutro. */
export const DEPOIMENTOS = [
  {
    nome: 'Cliente — REVISAR',
    iniciais: 'AB',
    texto:
      'Espaço para o depoimento real de uma cliente. Peça o texto por escrito e a autorização para publicar o nome.',
  },
  {
    nome: 'Cliente — REVISAR',
    iniciais: 'CD',
    texto:
      'Espaço para o depoimento real de uma cliente. Vale mais um relato longo e específico do que três elogios curtos.',
  },
  {
    nome: 'Cliente — REVISAR',
    iniciais: 'EF',
    texto:
      'Espaço para o depoimento real de uma cliente. O detalhe é o que convence: quanto tempo durou, como ficou depois do retoque.',
  },
];

/* O campo diagonal do topo. Nove quadros; as colunas repetem em
   ordens diferentes. */
export const GALERIA = [
  '/fotos/labios-1.png',
  '/fotos/sobrancelha-fio.png',
  '/fotos/sobrancelha-ombre.png',
  '/fotos/delineado.png',
  '/fotos/desenho.png',
  '/fotos/retrato.png',
  '/fotos/labios-2.png',
  '/fotos/bancada.png',
  '/fotos/labios-rosto.png',
];

export const FOTOS = {
  hero: '/fotos/retrato.png',
  avaliacao: '/fotos/desenho.png',
};

export const MENU = [
  { href: '#trabalho', rotulo: 'O trabalho' },
  { href: '#tecnicas', rotulo: 'Técnicas' },
  { href: '#processo', rotulo: 'Processo' },
  { href: '#procedimentos', rotulo: 'Procedimentos' },
  { href: '#avaliacao', rotulo: 'Avaliação' },
  { href: '#contato', rotulo: 'Contato' },
];
