const { useState, useRef, useEffect, useMemo } = React;

const LEVELS = ["A1", "A2", "B1", "B2+"];
const CORRECTION_MODES = [
  { id: "inline", label: "Correct inline" },
  { id: "end", label: "Correct at end" },
  { id: "onrequest", label: "Only if asked" },
  { id: "never", label: "Never correct" },
];
const REGISTER_MODES = [
  { id: "standard", label: "Standard" },
  { id: "colloquial", label: "Colloquial" },
];
const DEFAULT_TOPICS = ["Everyday small talk","Shopping & errands","Food & restaurants","Travel & directions","Chip carving","Christian Science","Banking & Finance","Current Events & News"];

const PANELS = [
  { id: "lists", label: "Lists" },
  { id: "verblookup", label: "Conjugator" },
  { id: "vocab", label: "S&H Vocab" },
  { id: "settings", label: "Settings" },
];

const LIST_TABS = [
  { id: "cognates", label: "Cognates" },
  { id: "grammar", label: "Grammar" },
  { id: "idioms", label: "Idioms" },
  { id: "media", label: "Media" },
  { id: "numbers", label: "Numbers" },
  { id: "pairs", label: "Min. Pairs" },
  { id: "phrases", label: "Phrases" },
  { id: "sounds", label: "Pronunciation" },
  { id: "verbref", label: "Verb List" },
];

const MINIMAL_PAIRS = [
  { a: { word: "pão", meaning: "bread" }, b: { word: "pau", meaning: "stick" } },
  { a: { word: "avó", meaning: "grandmother" }, b: { word: "avô", meaning: "grandfather" } },
  { a: { word: "casa", meaning: "house" }, b: { word: "caça", meaning: "hunt" } },
  { a: { word: "só", meaning: "alone" }, b: { word: "sou", meaning: "I am" } },
  { a: { word: "pode", meaning: "can" }, b: { word: "pôde", meaning: "could" } },
  { a: { word: "pé", meaning: "foot" }, b: { word: "pê", meaning: "letter P" } },
  { a: { word: "é", meaning: "is" }, b: { word: "e", meaning: "and" } },
  { a: { word: "sede", meaning: "thirst" }, b: { word: "cede", meaning: "yields" } },
  { a: { word: "dá", meaning: "gives" }, b: { word: "da", meaning: "of the" } },
  { a: { word: "vi", meaning: "I saw" }, b: { word: "vim", meaning: "I came" } },
  { a: { word: "si", meaning: "self" }, b: { word: "sim", meaning: "yes" } },
  { a: { word: "sei", meaning: "I know" }, b: { word: "sem", meaning: "without" } },
  { a: { word: "tem", meaning: "has" }, b: { word: "têm", meaning: "have" } },
  { a: { word: "sou", meaning: "I am" }, b: { word: "som", meaning: "sound" } },
  { a: { word: "vou", meaning: "I go" }, b: { word: "vão", meaning: "they go" } },
  { a: { word: "lá", meaning: "there" }, b: { word: "lã", meaning: "wool" } },
  { a: { word: "chá", meaning: "tea" }, b: { word: "já", meaning: "already" } },
  { a: { word: "mala", meaning: "bag" }, b: { word: "malha", meaning: "mesh" } },
  { a: { word: "fala", meaning: "speech" }, b: { word: "falha", meaning: "fault" } },
  { a: { word: "vela", meaning: "candle" }, b: { word: "velha", meaning: "old" } },
  { a: { word: "sono", meaning: "sleep" }, b: { word: "sonho", meaning: "dream" } },
  { a: { word: "caro", meaning: "expensive" }, b: { word: "carro", meaning: "car" } },
  { a: { word: "coro", meaning: "choir" }, b: { word: "corro", meaning: "I run" } },
  { a: { word: "terra", meaning: "earth" }, b: { word: "tera", meaning: "will have" } },
  { a: { word: "pato", meaning: "duck" }, b: { word: "bato", meaning: "I hit" } },
  { a: { word: "tela", meaning: "screen" }, b: { word: "dela", meaning: "of her" } },
  { a: { word: "cama", meaning: "bed" }, b: { word: "gama", meaning: "range" } },
  { a: { word: "pai", meaning: "father" }, b: { word: "pá", meaning: "shovel" } },
  { a: { word: "mau", meaning: "bad (m)" }, b: { word: "má", meaning: "bad (f)" } },
  { a: { word: "mãe", meaning: "mother" }, b: { word: "má", meaning: "bad" } },
  { a: { word: "dúvida", meaning: "doubt" }, b: { word: "duvida", meaning: "he doubts" } },
  { a: { word: "sábia", meaning: "wise" }, b: { word: "sabia", meaning: "knew" } },
  { a: { word: "a", meaning: "to" }, b: { word: "há", meaning: "there is" } },
  { a: { word: "por", meaning: "by" }, b: { word: "pôr", meaning: "to put" } },
  { a: { word: "casa", meaning: "house" }, b: { word: "caso", meaning: "case" } },
  { a: { word: "pala", meaning: "visor" }, b: { word: "palha", meaning: "straw" } },
  { a: { word: "pena", meaning: "feather" }, b: { word: "penha", meaning: "cliff" } },
  { a: { word: "pelo", meaning: "hair" }, b: { word: "belo", meaning: "beautiful" } },
  { a: { word: "mão", meaning: "hand" }, b: { word: "mó", meaning: "millstone" } },
  { a: { word: "publico", meaning: "I publish" }, b: { word: "público", meaning: "public" } },
  { a: { word: "pratico", meaning: "I practice" }, b: { word: "prático", meaning: "practical" } },
  { a: { word: "fato", meaning: "fact" }, b: { word: "fado", meaning: "fado music" } },
  { a: { word: "pico", meaning: "peak" }, b: { word: "bico", meaning: "beak" } },
  { a: { word: "copo", meaning: "cup" }, b: { word: "corpo", meaning: "body" } },
  { a: { word: "faca", meaning: "knife" }, b: { word: "vaca", meaning: "cow" } },
  { a: { word: "tio", meaning: "uncle" }, b: { word: "dia", meaning: "day" } },
  { a: { word: "piso", meaning: "floor" }, b: { word: "peso", meaning: "weight" } },
  { a: { word: "lago", meaning: "lake" }, b: { word: "logo", meaning: "soon" } },
  { a: { word: "cinto", meaning: "belt" }, b: { word: "sinto", meaning: "I feel" } },
  { a: { word: "penso", meaning: "I think" }, b: { word: "peso", meaning: "weight" } },
  { a: { word: "caro", meaning: "expensive" }, b: { word: "cara", meaning: "face" } },
  { a: { word: "mala", meaning: "bag" }, b: { word: "mola", meaning: "spring" } },
  { a: { word: "pato", meaning: "duck" }, b: { word: "prato", meaning: "plate" } },
  { a: { word: "casa", meaning: "house" }, b: { word: "capa", meaning: "cover" } },
  { a: { word: "fino", meaning: "thin" }, b: { word: "vinho", meaning: "wine" } },
  { a: { word: "ser", meaning: "to be" }, b: { word: "ver", meaning: "to see" } },
  { a: { word: "mal", meaning: "badly" }, b: { word: "mel", meaning: "honey" } },
  { a: { word: "bola", meaning: "ball" }, b: { word: "boca", meaning: "mouth" } },
  { a: { word: "vale", meaning: "valley" }, b: { word: "bale", meaning: "bale" } },
  { a: { word: "luz", meaning: "light" }, b: { word: "noz", meaning: "walnut" } },
  { a: { word: "vir", meaning: "to come" }, b: { word: "ver", meaning: "to see" } },
  { a: { word: "fui", meaning: "I went" }, b: { word: "fiz", meaning: "I did" } },
  { a: { word: "fio", meaning: "thread" }, b: { word: "frio", meaning: "cold" } },
  { a: { word: "paz", meaning: "peace" }, b: { word: "pás", meaning: "shovels" } },
];

const TENSE_LABELS = ["Presente","Pret. Perfeito","Pret. Imperfeito","Futuro","Particípio"];
const PRONOUNS = ["eu","tu","ele/ela","nós","vós","eles/elas"];

const IRREGULAR_VERBS = [
  { inf:"estar", en:"to be (temp)", tenses:[
    ["estou","estás","está","estamos","estão","estão"],
    ["estive","estiveste","esteve","estivemos","estiveram","estiveram"],
    ["estava","estavas","estava","estávamos","estavam","estavam"],
    ["estarei","estarás","estará","estaremos","estarão","estarão"],
    ["estado"]]},
  { inf:"fazer", en:"to do/make", tenses:[
    ["faço","fazes","faz","fazemos","fazem","fazem"],
    ["fiz","fizeste","fez","fizemos","fizeram","fizeram"],
    ["fazia","fazias","fazia","fazíamos","faziam","faziam"],
    ["farei","farás","fará","faremos","farão","farão"],
    ["feito"]]},
  { inf:"haver", en:"to have/exist", tenses:[
    ["hei","hás","há","havemos","hão","hão"],
    ["houve","houveste","houve","houvemos","houveram","houveram"],
    ["havia","havias","havia","havíamos","haviam","haviam"],
    ["haverei","haverás","haverá","haveremos","haverão","haverão"],
    ["havido"]]},
  { inf:"ir", en:"to go", tenses:[
    ["vou","vais","vai","vamos","vão","vão"],
    ["fui","foste","foi","fomos","foram","foram"],
    ["ia","ias","ia","íamos","iam","iam"],
    ["irei","irás","irá","iremos","irão","irão"],
    ["ido"]]},
  { inf:"poder", en:"to be able to", tenses:[
    ["posso","podes","pode","podemos","podem","podem"],
    ["pude","pudeste","pôde","pudemos","puderam","puderam"],
    ["podia","podias","podia","podíamos","podiam","podiam"],
    ["poderei","poderás","poderá","poderemos","poderão","poderão"],
    ["podido"]]},
  { inf:"querer", en:"to want", tenses:[
    ["quero","queres","quer","queremos","querem","querem"],
    ["quis","quiseste","quis","quisemos","quiseram","quiseram"],
    ["queria","querias","queria","queríamos","queriam","queriam"],
    ["quererei","quererás","quererá","quereremos","quererão","quererão"],
    ["querido"]]},
  { inf:"saber", en:"to know", tenses:[
    ["sei","sabes","sabe","sabemos","sabem","sabem"],
    ["soube","soubeste","soube","soubemos","souberam","souberam"],
    ["sabia","sabias","sabia","sabíamos","sabiam","sabiam"],
    ["saberei","saberás","saberá","saberemos","saberão","saberão"],
    ["sabido"]]},
  { inf:"ser", en:"to be (perm)", tenses:[
    ["sou","és","é","somos","são","são"],
    ["fui","foste","foi","fomos","foram","foram"],
    ["era","eras","era","éramos","eram","eram"],
    ["serei","serás","será","seremos","serão","serão"],
    ["sido"]]},
  { inf:"ter", en:"to have", tenses:[
    ["tenho","tens","tem","temos","têm","têm"],
    ["tive","tiveste","teve","tivemos","tiveram","tiveram"],
    ["tinha","tinhas","tinha","tínhamos","tinham","tinham"],
    ["terei","terás","terá","teremos","terão","terão"],
    ["tido"]]},
  { inf:"vir", en:"to come", tenses:[
    ["venho","vens","vem","vimos","vêm","vêm"],
    ["vim","vieste","veio","viemos","vieram","vieram"],
    ["vinha","vinhas","vinha","vínhamos","vinham","vinham"],
    ["virei","virás","virá","viremos","virão","virão"],
    ["vindo"]]},
];

const REGULAR_AR_VERBS = [
  { inf:"aceitar", en:"to accept" }, { inf:"amar", en:"to love" }, { inf:"andar", en:"to walk" },
  { inf:"apagar", en:"to erase" }, { inf:"arrumar", en:"to tidy up" }, { inf:"aumentar", en:"to increase" },
  { inf:"buscar", en:"to search" }, { inf:"cantar", en:"to sing" }, { inf:"casar", en:"to marry" },
  { inf:"chamar", en:"to call" }, { inf:"combinar", en:"to combine" }, { inf:"começar", en:"to begin" },
  { inf:"comprar", en:"to buy" }, { inf:"contar", en:"to count/tell" }, { inf:"cozinhar", en:"to cook" },
  { inf:"dançar", en:"to dance" }, { inf:"descansar", en:"to rest" }, { inf:"desenhar", en:"to draw" },
  { inf:"desejar", en:"to wish" }, { inf:"empurrar", en:"to push" }, { inf:"encontrar", en:"to find" },
  { inf:"ensinar", en:"to teach" }, { inf:"entrar", en:"to enter" }, { inf:"escutar", en:"to listen" },
  { inf:"estudar", en:"to study" }, { inf:"explicar", en:"to explain" }, { inf:"falar", en:"to speak" },
  { inf:"fechar", en:"to close" }, { inf:"ficar", en:"to stay" }, { inf:"ganhar", en:"to win/earn" },
  { inf:"gostar", en:"to like" }, { inf:"guardar", en:"to keep" }, { inf:"jogar", en:"to play" },
  { inf:"lavar", en:"to wash" }, { inf:"lembrar", en:"to remember" }, { inf:"levar", en:"to take" },
  { inf:"ligar", en:"to call/connect" }, { inf:"morar", en:"to live (reside)" }, { inf:"mostrar", en:"to show" },
  { inf:"mudar", en:"to change" }, { inf:"nadar", en:"to swim" }, { inf:"pagar", en:"to pay" },
  { inf:"parar", en:"to stop" }, { inf:"perguntar", en:"to ask" }, { inf:"precisar", en:"to need" },
  { inf:"trabalhar", en:"to work" },
];

const REGULAR_ER_IR_VERBS = [
  { inf:"abrir", en:"to open" }, { inf:"admitir", en:"to admit" }, { inf:"agir", en:"to act" },
  { inf:"aprender", en:"to learn" }, { inf:"assistir", en:"to watch/attend" }, { inf:"atender", en:"to attend/answer" },
  { inf:"atribuir", en:"to attribute" }, { inf:"beber", en:"to drink" }, { inf:"caber", en:"to fit" },
  { inf:"cobrir", en:"to cover" }, { inf:"comer", en:"to eat" }, { inf:"competir", en:"to compete" },
  { inf:"compreender", en:"to understand" }, { inf:"conhecer", en:"to know/meet" }, { inf:"consentir", en:"to consent" },
  { inf:"consistir", en:"to consist" }, { inf:"construir", en:"to build" }, { inf:"consumir", en:"to consume" },
  { inf:"contribuir", en:"to contribute" }, { inf:"convencer", en:"to convince" }, { inf:"correr", en:"to run" },
  { inf:"corrigir", en:"to correct" }, { inf:"crescer", en:"to grow" }, { inf:"decidir", en:"to decide" },
  { inf:"definir", en:"to define" }, { inf:"depender", en:"to depend" }, { inf:"descer", en:"to descend" },
  { inf:"destruir", en:"to destroy" }, { inf:"devolver", en:"to return" }, { inf:"discutir", en:"to discuss" },
  { inf:"dividir", en:"to divide" }, { inf:"doer", en:"to hurt" }, { inf:"emitir", en:"to emit" },
  { inf:"engolir", en:"to swallow" }, { inf:"entender", en:"to understand" }, { inf:"escolher", en:"to choose" },
  { inf:"esconder", en:"to hide" }, { inf:"escrever", en:"to write" }, { inf:"esculpir", en:"to sculpt" },
  { inf:"esquecer", en:"to forget" }, { inf:"estabelecer", en:"to establish" }, { inf:"excluir", en:"to exclude" },
  { inf:"exibir", en:"to exhibit" }, { inf:"expandir", en:"to expand" }, { inf:"extinguir", en:"to extinguish" },
  { inf:"fornecer", en:"to provide" }, { inf:"fugir", en:"to flee" }, { inf:"garantir", en:"to guarantee" },
  { inf:"incluir", en:"to include" }, { inf:"inserir", en:"to insert" }, { inf:"insistir", en:"to insist" },
  { inf:"investir", en:"to invest" }, { inf:"ler", en:"to read" }, { inf:"manter", en:"to maintain" },
  { inf:"medir", en:"to measure" }, { inf:"mentir", en:"to lie" }, { inf:"merecer", en:"to deserve" },
  { inf:"morrer", en:"to die" }, { inf:"nascer", en:"to be born" }, { inf:"nutrir", en:"to nourish" },
  { inf:"obedecer", en:"to obey" }, { inf:"oferecer", en:"to offer" }, { inf:"omitir", en:"to omit" },
  { inf:"parecer", en:"to seem" }, { inf:"perceber", en:"to understand/perceive" }, { inf:"perder", en:"to lose" },
  { inf:"permitir", en:"to permit" }, { inf:"pertencer", en:"to belong" }, { inf:"preferir", en:"to prefer" },
  { inf:"pretender", en:"to intend" }, { inf:"proibir", en:"to forbid" }, { inf:"prometer", en:"to promise" },
  { inf:"proteger", en:"to protect" }, { inf:"punir", en:"to punish" }, { inf:"reagir", en:"to react" },
  { inf:"reconhecer", en:"to recognize" }, { inf:"reduzir", en:"to reduce" }, { inf:"repetir", en:"to repeat" },
  { inf:"residir", en:"to reside" }, { inf:"resolver", en:"to resolve" }, { inf:"responder", en:"to respond" },
  { inf:"reunir", en:"to gather" }, { inf:"saber", en:"to know" }, { inf:"sofrer", en:"to suffer" },
  { inf:"sugerir", en:"to suggest" }, { inf:"surpreender", en:"to surprise" }, { inf:"temer", en:"to fear" },
  { inf:"tender", en:"to tend" }, { inf:"traduzir", en:"to translate" }, { inf:"valer", en:"to be worth" },
  { inf:"vender", en:"to sell" }, { inf:"ver", en:"to see" }, { inf:"vestir", en:"to dress" },
  { inf:"viver", en:"to live" },
];

// Slim projection used by ALL_VERBS_DATA and verbRefList; avoids re-mapping on every render.
const IRREGULAR_VERBS_SLIM = IRREGULAR_VERBS.map(v => ({ inf: v.inf, en: v.en }));

const ALL_VERBS_DATA = [
  ...IRREGULAR_VERBS_SLIM,
  ...REGULAR_AR_VERBS,
  ...REGULAR_ER_IR_VERBS,
];

// Pre-sorted once at module load; used by filteredVerbDropdown to avoid re-sorting on every keystroke.
const ALL_VERB_INFS_SORTED = ALL_VERBS_DATA.map(x => x.inf).sort();

// O(1) English-translation lookup keyed by infinitive; replaces ALL_VERBS_DATA.find() at all call sites.
const ALL_VERBS_MAP = new Map(ALL_VERBS_DATA.map(x => [x.inf, x.en]));

// O(1) irregularity check; replaces IRREGULAR_VERBS.some() at all call sites.
const IRREGULAR_VERBS_SET = new Set(IRREGULAR_VERBS.map(v => v.inf));

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const PRONUNCIATION_GUIDE = [
  { section: "Vowels", items: [
    { symbol: "a", desc: "Like the 'a' in 'father' or 'spa'", example: "casa", syllables: "ca-sa", highlight: "a" },
    { symbol: "á (acute)", desc: "Open stressed 'a' — like the 'a' in 'father', marked for stress: 'fácil', 'já'", example: "já", syllables: "já", highlight: "á" },
    { symbol: "â (circumflex)", desc: "Closed stressed 'a' — slightly more closed than á: 'câmara', 'pânico'", example: "câmara", syllables: "câ-ma-ra", highlight: "â" },
    { symbol: "ã / am / an", desc: "Nasal 'a' — like 'on' in 'bond' pushed through your nose: 'irmã', 'campo'", example: "irmã", syllables: "ir-mã", highlight: "ã" },
    { symbol: "à (grave)", desc: "Marks contraction of 'a+a' — same sound as 'a', not a stress mark: 'vou à praia'", example: "à praia", syllables: "à pra-ia", highlight: "à" },
    { symbol: "e (stressed)", desc: "Like the 'e' in 'bet' or 'set'", example: "perto", syllables: "per-to", highlight: "e" },
    { symbol: "e (unstressed)", desc: "Often swallowed — like the 'a' in 'sofa'", example: "tarde", syllables: "tar-de", highlight: "e" },
    { symbol: "é (acute)", desc: "Open stressed 'e' — like the 'e' in 'bed': 'café', 'pé'", example: "café", syllables: "ca-fé", highlight: "é" },
    { symbol: "ê (circumflex)", desc: "Closed stressed 'e' — like 'ay' cut short, no glide: 'mês', 'você'", example: "mês", syllables: "mês", highlight: "ê" },
    { symbol: "i", desc: "Like the 'ee' in 'feet' or 'see'", example: "fio", syllables: "fi-o", highlight: "i" },
    { symbol: "í (acute)", desc: "Stressed 'i' — same sound as i but marks stress: 'aquí', 'difícil'", example: "difícil", syllables: "di-fí-cil", highlight: "í" },
    { symbol: "o (stressed)", desc: "Like the 'o' in 'off' or 'hot'", example: "porta", syllables: "por-ta", highlight: "o" },
    { symbol: "ó (acute)", desc: "Open stressed 'o' — like the 'o' in 'off': 'pó', 'ótimo'", example: "ótimo", syllables: "ó-ti-mo", highlight: "ó" },
    { symbol: "ô (circumflex)", desc: "Closed stressed 'o' — like the 'o' in 'go' cut short: 'avô', 'pôr'", example: "avô", syllables: "a-vô", highlight: "ô" },
    { symbol: "õ / om / on", desc: "Nasal 'o' — like 'ohn' pushed through your nose: 'limões', 'bom'", example: "limões", syllables: "li-mõ-es", highlight: "õe" },
    { symbol: "u", desc: "Like the 'oo' in 'food' or 'moon'", example: "furo", syllables: "fu-ro", highlight: "u" },
    { symbol: "ú (acute)", desc: "Stressed 'u' — same sound as u but marks stress: 'azúl', 'público'", example: "público", syllables: "pú-bli-co", highlight: "ú" },
  ]},
  { section: "Diphthongs", items: [
    { symbol: "ai", desc: "Like 'eye' — as in 'pai' (father)", example: "pai", syllables: "pai", highlight: "ai" },
    { symbol: "ei", desc: "Like 'ay' in 'day' — as in 'lei' (law)", example: "lei", syllables: "lei", highlight: "ei" },
    { symbol: "oi", desc: "Like 'oy' in 'boy' — as in 'boi' (ox)", example: "boi", syllables: "boi", highlight: "oi" },
    { symbol: "ui", desc: "Like 'wee' — as in 'fui' (I went)", example: "fui", syllables: "fui", highlight: "ui" },
    { symbol: "au", desc: "Like 'ow' in 'cow' — as in 'mau' (bad)", example: "mau", syllables: "mau", highlight: "au" },
    { symbol: "eu", desc: "Like 'eh-oo' blended quickly — as in 'seu' (your)", example: "seu", syllables: "seu", highlight: "eu" },
    { symbol: "ou", desc: "Like 'o' in 'go' — as in 'ouro' (gold); often same as 'ô' in EP", example: "ouro", syllables: "ou-ro", highlight: "ou" },
    { symbol: "ãe", desc: "Nasal 'ai' — like 'ang'+'ay' blended; as in 'mãe' (mother)", example: "mãe", syllables: "mãe", highlight: "ãe" },
    { symbol: "ão", desc: "Nasal 'ow' — like 'ow' hummed through the nose; as in 'pão' (bread)", example: "pão", syllables: "pão", highlight: "ão" },
    { symbol: "õe", desc: "Nasal 'oy' — like 'oy' hummed through the nose; as in 'limões' (lemons)", example: "limões", syllables: "li-mõ-es", highlight: "õe" },
  ]},
  { section: "Consonants", items: [
    { symbol: "c (before a, o, u)", desc: "Hard 'k' like 'c' in 'cat': \"casa\" (house), \"cor\" (color)", example: "casa", syllables: "ca-sa", highlight: "c" },
    { symbol: "c (before e, i)", desc: "Soft 's' like 'ss' in 'miss': \"cedo\" (early), \"cidade\" (city)", example: "cedo", syllables: "ce-do", highlight: "c" },
    { symbol: "ç", desc: "Always soft 's' like 'ss' in 'miss': \"cabeça\" (head), \"praça\" (square)", example: "cabeça", syllables: "ca-be-ça", highlight: "ç" },
    { symbol: "cc (before e, i)", desc: "Pronounced 'ks': \"acção\" (action, older spelling)", example: "acção", syllables: "ac-ção", highlight: "cc" },
    { symbol: "ch / x", desc: "Like 'sh' in 'shoe': \"chave\" (key), \"caixa\" (box)", example: "chave", syllables: "cha-ve", highlight: "ch" },
    { symbol: "g (before a, o, u)", desc: "Hard 'g' like 'go': \"gato\" (cat), \"gordo\" (fat)", example: "gato", syllables: "ga-to", highlight: "g" },
    { symbol: "g (before e, i)", desc: "Soft — like 's' in 'measure': \"gente\" (people), \"girafa\" (giraffe)", example: "gente", syllables: "gen-te", highlight: "g" },
    { symbol: "gu (before e, i)", desc: "Hard 'g', u is silent: \"guerra\" (war), \"guitarra\" (guitar)", example: "guerra", syllables: "guer-ra", highlight: "gu" },
    { symbol: "j", desc: "Like 's' in 'measure': \"janela\" (window), \"hoje\" (today)", example: "janela", syllables: "ja-ne-la", highlight: "j" },
    { symbol: "lh", desc: "Like 'lli' in 'million': \"filho\" (son), \"trabalho\" (work)", example: "filho", syllables: "fi-lho", highlight: "lh" },
    { symbol: "nh", desc: "Like 'ny' in 'canyon': \"manhã\" (morning), \"vinho\" (wine)", example: "vinho", syllables: "vi-nho", highlight: "nh" },
    { symbol: "qu (before e, i)", desc: "Hard 'k', u is silent: \"quero\" (I want), \"aqui\" (here)", example: "quero", syllables: "que-ro", highlight: "qu" },
    { symbol: "qu (before a, o)", desc: "'kw' — u is voiced: \"qual\" (which), \"quatro\" (four)", example: "quatro", syllables: "qua-tro", highlight: "qu" },
    { symbol: "r (start of word)", desc: "Rasping 'h' like 'h' in 'hot' but stronger: \"rua\" (street)", example: "rua", syllables: "ru-a", highlight: "r" },
    { symbol: "rr", desc: "Same rasping 'h': \"carro\" (car), \"arroz\" (rice)", example: "carro", syllables: "car-ro", highlight: "rr" },
    { symbol: "s (between vowels)", desc: "Like 'z' in 'zoo': \"casa\" (house), \"mesa\" (table)", example: "mesa", syllables: "me-sa", highlight: "s" },
    { symbol: "s (end of word)", desc: "Like 'sh' in 'flash' — unique to EP: \"bons\" (good, plural)", example: "bons", syllables: "bons", highlight: "s" },
    { symbol: "z (end of word)", desc: "Soft buzzing 'zh' like 's' in 'measure': \"luz\" (light)", example: "luz", syllables: "luz", highlight: "z" },
  ]},
  { section: "Word stress & accents", items: [
    { symbol: "Default rule", desc: "Stress on SECOND-TO-LAST syllable: \"fa-LA-mos\", \"ca-SA\", \"me-NI-no\"", example: "menino", syllables: "me-ni-no", highlight: "ni" },
    { symbol: "Words ending in -i", desc: "Stress on LAST syllable: \"a-QUI\"", example: "aqui", syllables: "a-qui", highlight: "qui" },
    { symbol: "Words ending in -r", desc: "Stress on LAST syllable: \"fa-LAR\"", example: "falar", syllables: "fa-lar", highlight: "lar" },
    { symbol: "Words ending in -u", desc: "Stress on LAST syllable: \"a-ZUL\" (note: -l also stressed)", example: "azul", syllables: "a-zul", highlight: "zul" },
    { symbol: "Words ending in -l", desc: "Stress on LAST syllable: \"a-ni-MAL\"", example: "animal", syllables: "a-ni-mal", highlight: "mal" },
    { symbol: "Words ending in -z", desc: "Stress on LAST syllable: \"fe-LIZ\"", example: "feliz", syllables: "fe-liz", highlight: "liz" },
    { symbol: "Words ending in -im", desc: "Stress on LAST syllable: \"jar-DIM\"", example: "jardim", syllables: "jar-dim", highlight: "dim" },
    { symbol: "Words ending in -um", desc: "Stress on LAST syllable: \"al-GUM\"", example: "algum", syllables: "al-gum", highlight: "gum" },
    { symbol: "Words ending in -ção, -são", desc: "Always stressed on last syllable: \"na-ÇÃO\", \"li-ÇÃO\"", example: "nação", syllables: "na-ção", highlight: "ção" },
    { symbol: "Acute accent (á, é, í, ó, ú)", desc: "Marks stress AND open vowel: \"FÁ-cil\", \"ca-FÉ\"", example: "café", syllables: "ca-fé", highlight: "é" },
    { symbol: "Circumflex (â, ê, ô)", desc: "Marks stress AND closed vowel: \"vo-CÊ\", \"TÔ-ni-co\"", example: "avô", syllables: "a-vô", highlight: "ô" },
    { symbol: "Tilde (ã, õ)", desc: "Nasal vowel; in diphthongs also carries stress: \"pão\", \"mãe\"", example: "pão", syllables: "pão", highlight: "ão" },
    { symbol: "Grave accent (à)", desc: "Does NOT mark stress — marks contraction of a+a: \"vou à praia\"", example: "vou à praia", syllables: "vou à pra-ia", highlight: "à" },
    { symbol: "Two accents in one word", desc: "When two accented syllables appear, stress the WRITTEN accent: \"ó-ti-mo\" (ó wins over -mo), \"pú-bli-co\" (ú wins over -co). The written accent always overrides the default rule.", example: "ótimo", syllables: "ó-ti-mo", highlight: "ó" },
    { symbol: "Two accents — example 2", desc: "\"difícil\" — the accent on í overrides the -il ending rule. Stress falls on í, not on the last syllable.", example: "difícil", syllables: "di-fí-cil", highlight: "í" },
    { symbol: "Reflexive verbs — stress rule", desc: "Reflexive verbs with clitic -se attached keep stress on the VERB stem, not on -se: \"cha-MA-se\" (is called), \"le-VAN-ta-se\" (gets up). The -se is always unstressed.", example: "chama-se", syllables: "cha-ma-se", highlight: "ma" },
    { symbol: "Reflexive — example 2", desc: "\"levanta-se\" (he/she gets up) — stress on \"van\": \"le-VAN-ta-se\"", example: "levanta-se", syllables: "le-van-ta-se", highlight: "van" },
    { symbol: "Verb stress shift", desc: "\"FA-lo\" (I speak) vs \"fa-LÁ-mos\" (we spoke) vs \"fa-LA-mos\" (we speak)", example: "falo", syllables: "fa-lo", highlight: "fa" },
    { symbol: "Tip", desc: "Stressed syllable is louder and longer. Unstressed syllables in EP are very weak — the contrast is much stronger than in English.", example: null, syllables: null, highlight: null },
  ]},
  { section: "Open, Medium & Closed Vowels", items: [
    { symbol: "Overview", desc: "EP vowels fall into three categories based on how open your mouth is. OPEN vowels have the jaw fully open. MEDIUM vowels have moderate jaw closure. CLOSED vowels are heavily reduced — sometimes barely audible in unstressed syllables. This is the main reason EP sounds so different from Brazilian Portuguese.", example: null, example_en: null, syllables: null, highlight: null },
    { symbol: "— OPEN VOWELS —", desc: "Jaw fully open. Always occur in stressed syllables.", example: null, example_en: null, syllables: null, highlight: null },
    { symbol: "á — Open A", desc: "Jaw fully open, sound forward. Like 'palm' in English.", example: "má", example_en: "palm", syllables: "má", highlight: "á" },
    { symbol: "é — Open E", desc: "Mouth half-open, lips spread. Like 'bed' in English.", example: "pé", example_en: "bed", syllables: "pé", highlight: "é" },
    { symbol: "ó — Open O", desc: "Mouth half-open, lips rounded. Like 'fall' in English.", example: "cópia", example_en: "fall", syllables: "có-pia", highlight: "ó" },
    { symbol: "— MEDIUM VOWELS —", desc: "Moderate jaw opening. Occur in stressed closed syllables or unstressed positions.", example: null, example_en: null, syllables: null, highlight: null },
    { symbol: "a — Medium A", desc: "Slightly less open than á. Like the 'u' in 'nut' in English.", example: "pera", example_en: "nut", syllables: "pe-ra", highlight: "a" },
    { symbol: "ê — Medium E", desc: "Lips lightly closed. Like 'play' in English (the pure vowel, no glide).", example: "mesa", example_en: "play", syllables: "me-sa", highlight: "e" },
    { symbol: "ô — Medium O", desc: "Lips rounded, moderate closure. Like 'goal' in English.", example: "amor", example_en: "goal", syllables: "a-mor", highlight: "o" },
    { symbol: "— CLOSED VOWELS —", desc: "Minimal jaw movement. These sounds are reduced — in unstressed syllables they can nearly disappear.", example: null, example_en: null, syllables: null, highlight: null },
    { symbol: "i — Closed I", desc: "Lips fully spread, jaw almost closed. Like 'free' in English.", example: "filho", example_en: "free", syllables: "fi-lho", highlight: "i" },
    { symbol: "e — Closed E", desc: "Like 'i' but slightly more open. Occurs in unstressed final syllables. Like 'roses' in English.", example: "feliz", example_en: "roses", syllables: "fe-liz", highlight: "e" },
    { symbol: "u — Closed U", desc: "Lips fully rounded and pursed. Like 'food' in English.", example: "peru", example_en: "food", syllables: "pe-ru", highlight: "u" },
    { symbol: "Key rule", desc: "STRESSED vowels tend to be open or medium. UNSTRESSED vowels tend to close — sometimes disappearing entirely. This is why EP sounds 'swallowed' compared to BP, which keeps vowels open even when unstressed.", example: null, example_en: null, syllables: null, highlight: null },
  ]},
];

const PHRASES = [
  { section: "Greetings & farewells", items: [
    { pt: "Bom dia", en: "Good morning" }, { pt: "Boa tarde", en: "Good afternoon" },
    { pt: "Boa noite", en: "Good evening / Good night" }, { pt: "Olá, tudo bem?", en: "Hello, all good?" },
    { pt: "Tudo bem, obrigado/a", en: "All good, thank you" }, { pt: "Até logo / Até já", en: "See you soon" },
    { pt: "Adeus", en: "Goodbye (final)" }, { pt: "Com licença", en: "Excuse me (to pass)" }, { pt: "Desculpe", en: "Sorry / Excuse me" },
  ]},
  { section: "Politeness", items: [
    { pt: "Por favor", en: "Please" }, { pt: "Obrigado / Obrigada", en: "Thank you (m/f speaker)" },
    { pt: "De nada", en: "You're welcome" }, { pt: "Com muito prazer", en: "With great pleasure" },
    { pt: "Faz favor", en: "Please / Excuse me (to get attention)" }, { pt: "Não faz mal", en: "It doesn't matter / No worries" },
  ]},
  { section: "Shopping & money", items: [
    { pt: "Quanto custa?", en: "How much does it cost?" }, { pt: "É muito caro", en: "It's very expensive" },
    { pt: "Tem mais barato?", en: "Do you have something cheaper?" }, { pt: "Posso pagar com cartão?", en: "Can I pay by card?" },
    { pt: "Onde fica a caixa?", en: "Where is the checkout?" }, { pt: "Queria...", en: "I would like..." }, { pt: "Estou só a ver", en: "I'm just looking" },
  ]},
  { section: "Food & restaurants", items: [
    { pt: "Uma mesa para dois, faz favor", en: "A table for two, please" }, { pt: "A ementa, faz favor", en: "The menu, please" },
    { pt: "O que recomenda?", en: "What do you recommend?" }, { pt: "Está delicioso", en: "It's delicious" },
    { pt: "A conta, faz favor", en: "The bill, please" }, { pt: "Sem glúten / Sou vegetariano/a", en: "Gluten-free / I'm vegetarian" },
  ]},
  { section: "Getting around", items: [
    { pt: "Onde fica...?", en: "Where is...?" }, { pt: "Como chego a...?", en: "How do I get to...?" },
    { pt: "Vire à direita / esquerda", en: "Turn right / left" }, { pt: "Sempre em frente", en: "Straight ahead" },
    { pt: "Um bilhete para..., faz favor", en: "A ticket to..., please" }, { pt: "A que horas parte o autocarro?", en: "What time does the bus leave?" },
  ]},
  { section: "Emergencies & help", items: [
    { pt: "Preciso de ajuda", en: "I need help" }, { pt: "Chame uma ambulância", en: "Call an ambulance" },
    { pt: "Perdi a minha carteira", en: "I lost my wallet" }, { pt: "Não me sinto bem", en: "I don't feel well" },
    { pt: "Fala inglês?", en: "Do you speak English?" }, { pt: "Não percebo / Não entendo", en: "I don't understand" },
  ]},
];

const IDIOMS = [
  { pt: "A galinha do vizinho sempre é mais gorda", en: "The neighbor's chicken is always fatter", when: "The grass is always greener on the other side" },
  { pt: "Água mole em pedra dura tanto bate até que fura", en: "Soft water on hard stone hits until it drills a hole", when: "Persistence overcomes resistance" },
  { pt: "Alimentar um burro a pão de ló", en: "To feed a donkey sponge cake", when: "Wasting good things on someone who doesn't appreciate them" },
  { pt: "Andar a apanhar bonés", en: "To go around catching caps", when: "Wandering aimlessly, especially after a setback" },
  { pt: "Andar com a cabeça nas nuvens", en: "To walk with your head in the clouds", when: "Someone is distracted or daydreaming" },
  { pt: "Andar com os pés no chão", en: "To keep your feet on the ground", when: "Staying realistic and grounded" },
  { pt: "Andar com rodeios", en: "To walk with detours", when: "Beating around the bush instead of being direct" },
  { pt: "Andar feito barata tonta", en: "To move like a dizzy cockroach", when: "Running around confused in chaos" },
  { pt: "Apanhar uma seca", en: "To catch a drought", when: "Being extremely bored" },
  { pt: "Aqui há gato", en: "There's a cat here", when: "Something seems suspicious or not right" },
  { pt: "Armar-se em carapau de corrida", en: "To act like a racing mackerel", when: "Acting arrogantly or showing off" },
  { pt: "Bater as botas", en: "To knock the boots", when: "To die (casual, humorous)" },
  { pt: "Bater na mesma tecla", en: "To hit the same key", when: "Insisting on the same point over and over" },
  { pt: "Bola para a frente", en: "Ball to the front", when: "Encouraging forward movement after something negative" },
  { pt: "Chorar sobre o leite derramado", en: "To cry over spilled milk", when: "Regretting something that can't be undone" },
  { pt: "Chover a cântaros", en: "To rain in jugs", when: "It's raining very heavily" },
  { pt: "Comer e calar", en: "To eat and shut up", when: "Accepting something without complaining" },
  { pt: "Comer gato", en: "To eat cat", when: "Eating something of bad or suspicious quality" },
  { pt: "Comprar gato por lebre", en: "To buy a cat thinking it's a hare", when: "Being deceived or scammed" },
  { pt: "Custar os olhos da cara", en: "Costing the eyes of the face", when: "Something is extremely expensive" },
  { pt: "Dar à sola", en: "To give to the sole of your shoe", when: "To flee quickly" },
  { pt: "Dar água pela barba", en: "To give water up to the beard", when: "Something is very difficult or troublesome" },
  { pt: "Dar com a língua nos dentes", en: "To hit the teeth with the tongue", when: "Spilling a secret" },
  { pt: "Dar uma mãozinha", en: "To give a little hand", when: "Offering to help out" },
  { pt: "Deitar a toalha ao chão", en: "To throw the towel to the ground", when: "Giving up on something" },
  { pt: "Engolir sapos", en: "To swallow frogs", when: "Accepting humiliation silently to keep the peace" },
  { pt: "Entrar pelos olhos dentro", en: "To enter through the inside of the eyes", when: "Something immediately striking or obvious" },
  { pt: "Estar a bater mal", en: "To be beating badly", when: "Acting emotionally unstable or going off the deep end" },
  { pt: "Estar a bater mal da bola", en: "To be hitting the ball badly", when: "Not having one's head straight; feeling confused or off" },
  { pt: "Estar a modos que", en: "To be in a sort of way", when: "Expressing hesitation or uncertainty" },
  { pt: "Estar a treinar para burro", en: "To be training to be a donkey", when: "Working hard but not smartly" },
  { pt: "Estar com os azeites", en: "To be with the olive oils", when: "Being annoyed or grumpy" },
  { pt: "Estar com os cabelos em pé", en: "To have hair standing on end", when: "Being terrified or very nervous" },
  { pt: "Estar com um grão na asa", en: "To have a grain on the wing", when: "Being tipsy or slightly drunk" },
  { pt: "Estar de mãos a abanar", en: "To be with hands waving", when: "Returning empty-handed with nothing to show" },
  { pt: "Estar entre a espada e a parede", en: "To be between the sword and the wall", when: "Stuck in a tough spot with no easy way out" },
  { pt: "Estar nas sete quintas", en: "To be in the seven farms", when: "Being very happy or ecstatic" },
  { pt: "Falar de boca cheia", en: "To speak with a full mouth", when: "Speaking without thinking or rudely" },
  { pt: "Falar para o boneco", en: "To talk to the doll", when: "Talking to someone who isn't paying attention" },
  { pt: "Falar pelos cotovelos", en: "To talk through the elbows", when: "Talking too much, non-stop" },
  { pt: "Fazer das suas", en: "To do your own things", when: "Misbehaving or causing trouble" },
  { pt: "Fazer das tripas coração", en: "To make a heart out of guts", when: "Summoning all your courage in a tough situation" },
  { pt: "Fazer uma tempestade num copo de água", en: "To make a storm in a glass of water", when: "Exaggerating a minor issue" },
  { pt: "Fazer uma vaquinha", en: "To make a little cow", when: "Chipping in together to pool resources" },
  { pt: "Fazer vista grossa", en: "To make a thick view", when: "Pretending not to see something wrong" },
  { pt: "Ficar a ver navios", en: "To stay watching ships", when: "Being left empty-handed or disappointed" },
  { pt: "Ficar de molho", en: "To stay soaking", when: "Resting or being inactive, often when sick" },
  { pt: "Ficar em águas de bacalhau", en: "To end up in codfish waters", when: "A plan comes to nothing and is abandoned" },
  { pt: "Ir aos arames", en: "To go to the wires", when: "On the edge of losing patience or having a breakdown" },
  { pt: "Ir com os porcos", en: "To go with the pigs", when: "An idea or plan went completely down the drain" },
  { pt: "Ir pentear macacos", en: "To go comb monkeys", when: "Telling someone rudely to go away" },
  { pt: "Levar com os pés", en: "To be hit with feet", when: "Being rejected, especially romantically" },
  { pt: "Matar dois coelhos de uma cajadada só", en: "To kill two rabbits with one blow", when: "Solving two problems at once" },
  { pt: "Meter os pés pelas mãos", en: "To put your feet through your hands", when: "Messing things up or getting confused" },
  { pt: "Muitos anos a virar frangos", en: "Many years turning chickens", when: "Having a lot of experience doing something" },
  { pt: "Não dar a bota com a perdigota", en: "Doesn't match the boot with the young quail", when: "Comparing two things that are not comparable" },
  { pt: "Não há duas sem três", en: "There's no two without three", when: "When a third mishap follows two others" },
  { pt: "Não perceber patavina", en: "Not to understand a patavina", when: "Not understanding anything at all" },
  { pt: "Não ter papas na língua", en: "Not to have porridge on the tongue", when: "Being direct and frank; speaking one's mind" },
  { pt: "Pagar o pato", en: "To pay the duck", when: "Taking the blame for something you didn't do" },
  { pt: "Passar pelas brasas", en: "To go through hot coals", when: "Dozing off or taking a quick nap" },
  { pt: "Pôr a mão na consciência", en: "Put your hand on your conscience", when: "Reflecting on your actions before doing something wrong" },
  { pt: "Pôr-se fino", en: "Put yourself thin", when: "Warning someone to start behaving properly" },
  { pt: "Pôr-se na alheta", en: "Put yourself in Alheta", when: "Leaving quickly to avoid a difficult situation" },
  { pt: "Queimar as pestanas", en: "To burn the eyelashes", when: "Studying or working very hard late into the night" },
  { pt: "Quem feio ama, bonito lhe parece", en: "Whoever loves one who's ugly finds beauty in them", when: "Beauty is in the eye of the beholder" },
  { pt: "Quem não arrisca, não petisca", en: "Who doesn't risk, doesn't snack", when: "Encouraging someone to take a chance" },
  { pt: "Quem tem boca vai a Roma", en: "He who has a mouth goes to Rome", when: "Asking questions helps you get where you want" },
  { pt: "Quem vê cara, não vê coração", en: "Those who see faces don't see hearts", when: "Don't judge a book by its cover" },
  { pt: "Quem espera sempre alcança", en: "Who waits always reaches", when: "Patience pays off in the end" },
  { pt: "Sair a correr como alma penada", en: "To run like a tormented soul", when: "Running away in panic" },
  { pt: "Sem pés nem cabeça", en: "Without feet or head", when: "Something makes no sense at all" },
  { pt: "Ser uma pessoa de poucas palavras", en: "To be a person of few words", when: "Someone who doesn't talk much" },
  { pt: "Só para Inglês ver", en: "Just for an English person to see", when: "Doing something purely for appearances or show" },
  { pt: "Ter a pulga atrás da orelha", en: "To have a flea behind the ear", when: "Being suspicious about something" },
  { pt: "Ter as costas quentes", en: "To have warm backs", when: "Having powerful protection or connections" },
  { pt: "Ter cabeça fria", en: "To have a cool head", when: "Staying calm under pressure" },
  { pt: "Ter debaixo da língua", en: "To have under the tongue", when: "Having something on the tip of your tongue" },
  { pt: "Ter dor de cotovelo", en: "To have elbow pain", when: "Feeling envy or jealousy" },
  { pt: "Ter macaquinhos na cabeça", en: "To have little monkeys in your head", when: "Having silly or paranoid ideas" },
  { pt: "Ter muita lata", en: "To have a lot of tin", when: "Being very shameless or bold" },
  { pt: "Ter o coração nas mãos", en: "To have the heart in the hands", when: "Being extremely worried or scared" },
  { pt: "Ter o rei na barriga", en: "To have the king in the belly", when: "Acting arrogantly, like you're more important than others" },
  { pt: "Ter os pés bem assentes na terra", en: "To have your feet firmly planted on the ground", when: "Being realistic and sensible" },
  { pt: "Tirar o cavalinho da chuva", en: "Take your little horse away from the rain", when: "Giving up on an idea that won't work" },
  { pt: "Uma pilha de nervos", en: "A battery of nerves", when: "Being so stressed others can visibly tell" },
  { pt: "Viajar na maionese", en: "To travel in the mayonnaise", when: "Talking nonsense or drifting into irrelevant thoughts" },
];

const NUMBERS = [
  { section: "Cardinal numbers", items: [
    { pt: "zero", en: "0" },
    { pt: "um / uma", en: "1 (m/f)" },
    { pt: "dois / duas", en: "2 (m/f)" },
    { pt: "três", en: "3" },
    { pt: "quatro", en: "4" },
    { pt: "cinco", en: "5" },
    { pt: "seis", en: "6" },
    { pt: "sete", en: "7" },
    { pt: "oito", en: "8" },
    { pt: "nove", en: "9" },
    { pt: "dez", en: "10" },
    { pt: "onze", en: "11" },
    { pt: "doze", en: "12" },
    { pt: "treze", en: "13" },
    { pt: "catorze", en: "14" },
    { pt: "quinze", en: "15" },
    { pt: "dezasseis", en: "16" },
    { pt: "dezassete", en: "17" },
    { pt: "dezoito", en: "18" },
    { pt: "dezanove", en: "19" },
    { pt: "vinte", en: "20" },
    { pt: "trinta", en: "30" },
    { pt: "quarenta", en: "40" },
    { pt: "cinquenta", en: "50" },
    { pt: "sessenta", en: "60" },
    { pt: "setenta", en: "70" },
    { pt: "oitenta", en: "80" },
    { pt: "noventa", en: "90" },
    { pt: "cem", en: "100 (exactly)" },
    { pt: "cento e um", en: "101" },
    { pt: "cento e dois", en: "102" },
    { pt: "duzentos / duzentas", en: "200 (m/f)" },
    { pt: "trezentos / trezentas", en: "300 (m/f)" },
    { pt: "quatrocentos / quatrocentas", en: "400 (m/f)" },
    { pt: "quinhentos / quinhentas", en: "500 (m/f)" },
    { pt: "seiscentos / seiscentas", en: "600 (m/f)" },
    { pt: "setecentos / setecentas", en: "700 (m/f)" },
    { pt: "oitocentos / oitocentas", en: "800 (m/f)" },
    { pt: "novecentos / novecentas", en: "900 (m/f)" },
    { pt: "mil", en: "1,000" },
    { pt: "dois mil", en: "2,000" },
    { pt: "cem mil", en: "100,000" },
    { pt: "duzentos mil", en: "200,000" },
    { pt: "um milhão", en: "1,000,000" },
    { pt: "dois milhões", en: "2,000,000" },
    { pt: "um bilião", en: "1,000,000,000 (EP)" },
    { pt: "um trilião", en: "1,000,000,000,000 (EP)" },
    { pt: "mil e oitocentos e sessenta e seis", en: "1866" },
    { pt: "mil novecentos e cinquenta e oito", en: "1958" },
    { pt: "dois mil e vinte e seis", en: "2026" },
  ]},
  { section: "Ordinal numbers", items: [
    { pt: "primeiro / primeira", en: "1st (m/f)" },
    { pt: "segundo / segunda", en: "2nd (m/f)" },
    { pt: "terceiro / terceira", en: "3rd (m/f)" },
    { pt: "quarto / quarta", en: "4th (m/f)" },
    { pt: "quinto / quinta", en: "5th (m/f)" },
    { pt: "sexto / sexta", en: "6th (m/f)" },
    { pt: "sétimo / sétima", en: "7th (m/f)" },
    { pt: "oitavo / oitava", en: "8th (m/f)" },
    { pt: "nono / nona", en: "9th (m/f)" },
    { pt: "décimo / décima", en: "10th (m/f)" },
  ]},
  { section: "Days of the week", items: [
    { pt: "segunda-feira", en: "Monday" },
    { pt: "terça-feira", en: "Tuesday" },
    { pt: "quarta-feira", en: "Wednesday" },
    { pt: "quinta-feira", en: "Thursday" },
    { pt: "sexta-feira", en: "Friday" },
    { pt: "sábado", en: "Saturday" },
    { pt: "domingo", en: "Sunday" },
  ]},
  { section: "Months", items: [
    { pt: "janeiro", en: "January" },
    { pt: "fevereiro", en: "February" },
    { pt: "março", en: "March" },
    { pt: "abril", en: "April" },
    { pt: "maio", en: "May" },
    { pt: "junho", en: "June" },
    { pt: "julho", en: "July" },
    { pt: "agosto", en: "August" },
    { pt: "setembro", en: "September" },
    { pt: "outubro", en: "October" },
    { pt: "novembro", en: "November" },
    { pt: "dezembro", en: "December" },
  ]},
  { section: "Dates", items: [
    { pt: "Que dia é hoje?", en: "What day is today?" },
    { pt: "Hoje é (dia) vinte de março", en: "Today is the 20th of March" },
    { pt: "Em que ano?", en: "In what year?" },
    { pt: "Em dois mil e vinte e seis", en: "In 2026" },
  ]},
  { section: "Telling time", items: [
    { pt: "Que horas são?", en: "What time is it?" },
    { pt: "São duas horas", en: "It is two o\'clock" },
    { pt: "É uma hora e meia", en: "It is half past one" },
    { pt: "São três e um quarto", en: "It is quarter past three" },
    { pt: "São quatro menos um quarto", en: "It is quarter to four" },
    { pt: "São cinco e vinte", en: "It is twenty past five" },
    { pt: "É meio-dia", en: "It is noon" },
    { pt: "É meia-noite", en: "It is midnight" },
    { pt: "da manhã", en: "in the morning" },
    { pt: "da tarde", en: "in the afternoon" },
    { pt: "da noite", en: "in the evening" },
  ]},
];

const COGNATES = [
  { section: "-AGE → -AGEM (f)", rule: "", items: [
    { pt: "a coragem", en: "courage" }, { pt: "a imagem", en: "image" }, { pt: "a viagem", en: "voyage/trip" }, { pt: "a linguagem", en: "language" },
  ], exceptions: [] },
  { section: "-AL → -AL", rule: "Identical ending — very large group.", items: [
    { pt: "adicional", en: "additional" }, { pt: "cultural", en: "cultural" }, { pt: "nacional", en: "national" },
  ], exceptions: [] },
  { section: "-AN → -ANO/A", rule: "Agrees with gender.", items: [
    { pt: "americano/a", en: "American" }, { pt: "italiano/a", en: "Italian" }, { pt: "humano/a", en: "human" },
  ], exceptions: [] },
  { section: "-AN → -ÃO (m)", rule: "Masculine nouns.", items: [
    { pt: "o vilão", en: "villain" }, { pt: "o capitão", en: "captain" },
  ], exceptions: [] },
  { section: "-ANCE → -ÂNCIA (f)", rule: "", items: [
    { pt: "a abundância", en: "abundance" }, { pt: "a importância", en: "importance" }, { pt: "a tolerância", en: "tolerance" },
  ], exceptions: [] },
  { section: "-ANCY → -ÂNCIA (f)", rule: "", items: [
    { pt: "a constância", en: "constancy" }, { pt: "a relevância", en: "relevancy" },
  ], exceptions: [] },
  { section: "-ANT → -ANTE", rule: "Same form for m & f.", items: [
    { pt: "importante", en: "important" }, { pt: "elegante", en: "elegant" }, { pt: "constante", en: "constant" },
  ], exceptions: [] },
  { section: "-AR → -AR (not verbs)", rule: "", items: [
    { pt: "circular", en: "circular" }, { pt: "o dólar", en: "dollar" }, { pt: "popular", en: "popular" },
  ], exceptions: [] },
  { section: "-ATE → -ADO/A (not verbs)", rule: "Adjective agrees with gender.", items: [
    { pt: "privado/a", en: "private" }, { pt: "moderado/a", en: "moderate" }, { pt: "dedicado/a", en: "dedicated" },
  ], exceptions: [] },
  { section: "-ATE → -AR (verbs)", rule: "", items: [
    { pt: "celebrar", en: "to celebrate" }, { pt: "separar", en: "to separate" }, { pt: "operar", en: "to operate" },
  ], exceptions: [] },
  { section: "-BLE → -VEL (adj, m & f same)", rule: "Same form for both genders.", items: [
    { pt: "adorável", en: "adorable" }, { pt: "audível", en: "audible" }, { pt: "possível", en: "possible" }, { pt: "responsável", en: "responsible" },
  ], exceptions: [] },
  { section: "-CY → -CIA", rule: "", items: [
    { pt: "a democracia", en: "democracy" }, { pt: "a agência", en: "agency" }, { pt: "a farmácia", en: "pharmacy" },
  ], exceptions: [] },
  { section: "-ENCE → -ÊNCIA (f)", rule: "", items: [
    { pt: "a coexistência", en: "coexistence" }, { pt: "a experiência", en: "experience" }, { pt: "a violência", en: "violence" },
  ], exceptions: ["difference → a diferença", "presence → a presença", "sentence → a sentença"] },
  { section: "-ENCY → -ÊNCIA (f)", rule: "", items: [
    { pt: "a agência", en: "agency" }, { pt: "a urgência", en: "urgency" }, { pt: "a frequência", en: "frequency" },
  ], exceptions: [] },
  { section: "-ENT → -ENTE (adjectives)", rule: "", items: [
    { pt: "inteligente", en: "intelligent" }, { pt: "diferente", en: "different" }, { pt: "urgente", en: "urgent" },
  ], exceptions: [] },
  { section: "-ENT → -ENTO (nouns)", rule: "", items: [
    { pt: "o movimento", en: "movement" }, { pt: "o momento", en: "moment" }, { pt: "o documento", en: "document" },
  ], exceptions: [] },
  { section: "-FY → -FICAR (verb)", rule: "", items: [
    { pt: "classificar", en: "to classify" }, { pt: "simplificar", en: "to simplify" }, { pt: "notificar", en: "to notify" },
  ], exceptions: [] },
  { section: "-IC → -ICO/A", rule: "Adjective agrees with gender.", items: [
    { pt: "lógico/a", en: "logical" }, { pt: "histórico/a", en: "historic" }, { pt: "público/a", en: "public" },
  ], exceptions: [] },
  { section: "-ID → -IDO/A", rule: "Adjective agrees with gender.", items: [
    { pt: "líquido/a", en: "liquid" }, { pt: "rígido/a", en: "rigid" }, { pt: "sólido/a", en: "solid" },
  ], exceptions: [] },
  { section: "-ILE → -IL", rule: "", items: [
    { pt: "frágil", en: "fragile" }, { pt: "fácil", en: "facile/easy" }, { pt: "útil", en: "useful/utile" },
  ], exceptions: [] },
  { section: "-ISM → -ISMO (m)", rule: "Always masculine.", items: [
    { pt: "o batismo", en: "baptism" }, { pt: "o capitalismo", en: "capitalism" }, { pt: "o turismo", en: "tourism" },
  ], exceptions: [] },
  { section: "-IST → -ISTA", rule: "Same form m & f; article shows gender.", items: [
    { pt: "o/a artista", en: "artist" }, { pt: "o/a turista", en: "tourist" }, { pt: "o/a jornalista", en: "journalist" },
  ], exceptions: ["list → a lista (a different word entirely)"] },
  { section: "-IVE → -IVO/A", rule: "Adjective agrees with gender.", items: [
    { pt: "narrativo/a", en: "narrative" }, { pt: "positivo/a", en: "positive" }, { pt: "criativo/a", en: "creative" },
  ], exceptions: [] },
  { section: "-IZE → -IZAR (verb)", rule: "", items: [
    { pt: "finalizar", en: "to finalize" }, { pt: "organizar", en: "to organize" }, { pt: "utilizar", en: "to utilize" },
  ], exceptions: [] },
  { section: "-LY → -MENTE (adverb)", rule: "Add -mente to the feminine adjective form.", items: [
    { pt: "anualmente", en: "annually" }, { pt: "rapidamente", en: "rapidly" }, { pt: "normalmente", en: "normally" },
  ], exceptions: [] },
  { section: "-ON → -ÃO (m)", rule: "Masculine nouns.", items: [
    { pt: "o bilhão", en: "billion" }, { pt: "o cânon", en: "canon" },
  ], exceptions: [] },
  { section: "-OR → -OR/A", rule: "Masculine -or, feminine -ora.", items: [
    { pt: "o criador / a criadora", en: "creator" }, { pt: "o ditador / a ditadora", en: "dictator" }, { pt: "o professor / a professora", en: "professor" },
  ], exceptions: [] },
  { section: "-OUS → -OSO/A", rule: "Adjective agrees with gender of noun.", items: [
    { pt: "curioso/a", en: "curious" }, { pt: "famoso/a", en: "famous" }, { pt: "delicioso/a", en: "delicious" }, { pt: "generoso/a", en: "generous" },
  ], exceptions: [] },
  { section: "-RAM → -RAMA (nouns only)", rule: "Always masculine despite -a ending.", items: [
    { pt: "o programa", en: "program" }, { pt: "o diagrama", en: "diagram" }, { pt: "o telegrama", en: "telegram" },
  ], exceptions: [] },
  { section: "-RY → -RIO/A", rule: "Agrees with gender.", items: [
    { pt: "satisfatório/a", en: "satisfactory" }, { pt: "voluntário/a", en: "voluntary" }, { pt: "o vocabulário", en: "vocabulary" },
  ], exceptions: [] },
  { section: "-SION → -SÃO (f)", rule: "Always feminine.", items: [
    { pt: "a invasão", en: "invasion" }, { pt: "a decisão", en: "decision" }, { pt: "a televisão", en: "television" },
  ], exceptions: [] },
  { section: "-TION → -ÇÃO (f)", rule: "Extremely reliable — thousands of words. Always feminine.", items: [
    { pt: "a ação", en: "action" }, { pt: "a nação", en: "nation" }, { pt: "a situação", en: "situation" }, { pt: "a informação", en: "information" },
  ], exceptions: [] },
  { section: "-TUDE → -TUDE (f)", rule: "Identical ending.", items: [
    { pt: "a atitude", en: "attitude" }, { pt: "a altitude", en: "altitude" }, { pt: "a gratitude", en: "gratitude" },
  ], exceptions: [] },
  { section: "-TY → -DADE (f)", rule: "Always feminine.", items: [
    { pt: "a cidade", en: "city" }, { pt: "a liberdade", en: "liberty" }, { pt: "a qualidade", en: "quality" }, { pt: "a universidade", en: "university" },
  ], exceptions: [] },
  { section: "False cognates (watch out!)", rule: "These look like English words but mean something different.", items: [
    { pt: "actually → actualmente", en: "actualmente = currently (not 'actually' — na verdade)" },
    { pt: "agenda", en: "diary/planner (not a meeting agenda — ordem do dia)" },
    { pt: "assistir", en: "to watch/attend (not to assist — ajudar)" },
    { pt: "borracha", en: "rubber/eraser (not drunk — bêbado)" },
    { pt: "constipado", en: "having a cold (not constipated — obstipado)" },
    { pt: "costume", en: "custom/habit (not a costume — fantasia/fato)" },
    { pt: "decepção", en: "disappointment (not deception — engano/fraude)" },
    { pt: "discussão", en: "argument/heated debate (not a calm discussion — conversa)" },
    { pt: "embaraçado", en: "tangled/confused (not embarrassed — envergonhado)" },
    { pt: "esquisito", en: "strange/odd (not exquisite — requintado)" },
    { pt: "eventual", en: "possible/hypothetical (not eventual — final/último)" },
    { pt: "fábrica", en: "factory (not fabric — tecido)" },
    { pt: "jornal", en: "newspaper (not journal/diary — diário)" },
    { pt: "largo", en: "wide/broad or a town square (not large — grande)" },
    { pt: "livraria", en: "bookshop (not library — biblioteca)" },
    { pt: "novela", en: "TV soap opera (not a novel — romance)" },
    { pt: "parente", en: "relative/family member (not parent — pai/mãe)" },
    { pt: "policia", en: "police/officer (not policy — política/apólice)" },
    { pt: "polvo", en: "octopus (not powder — pó)" },
    { pt: "preservativo", en: "condom (not food preservative — conservante)" },
    { pt: "pretender", en: "to intend/plan (not to pretend — fingir)" },
    { pt: "realizar", en: "to carry out/achieve (not to realize mentally — perceber)" },
    { pt: "sopa", en: "soup (not soap — sabão)" },
    { pt: "tuna", en: "student music group (not the fish — atum)" },
  ], exceptions: [] },
];

// Static media resource data; defined at module scope to avoid re-creation on every render.
const MEDIA_SECTIONS = [
  { id: "s01", pt: "Televisão em Directo & Plataformas de Streaming", en: "Live TV & Streaming Platforms", links: [
    { label: "RTP Play — Directo", url: "https://www.rtp.pt/play/direto" },
    { label: "RTP2 — Directo", url: "https://www.rtp.pt/play/direto/rtp2" },
    { label: "RTP3 / RTP Notícias — Directo", url: "https://www.rtp.pt/play/direto/rtp3" },
    { label: "RTP Play — Arquivo e On-Demand", url: "https://www.rtp.pt/play/" },
    { label: "Arquivos RTP", url: "https://arquivos.rtp.pt/" },
    { label: "Porto Canal — Directo", url: "https://portocanal.sapo.pt/live" },
    { label: "SIC — Directo", url: "https://www.sic.pt/direto" },
    { label: "SIC Notícias — Directo", url: "https://sicnoticias.pt/direto" },
    { label: "Opto SIC — On-Demand", url: "https://opto.sic.pt/" },
    { label: "TVI — Directo", url: "https://tvi.iol.pt/direto" },
    { label: "TVI Player — On-Demand", url: "https://tviplayer.iol.pt/" },
    { label: "Euronews PT — Directo", url: "https://pt.euronews.com/live" },
    { label: "CNN Portugal — Directo", url: "https://cnnportugal.iol.pt/direto" },
    { label: "Canal 180 — Cultura e Artes", url: "https://canal180.pt/" },
    { label: "Lista IPTV Gratuita e Legal (Reddit)", url: "https://www.reddit.com/r/portugal/comments/hadmt5/lista_de_iptv_gratuita_e_legal/" },
  ]},
  { id: "s02", pt: "Séries de Ficção Portuguesa", en: "Portuguese Drama & Fiction Series", links: [
    { label: "Os Nossos Dias", url: "https://www.rtp.pt/play/p1844/os-nossos-dias" },
    { label: "Bem-Vindos a Beirais", url: "https://www.rtp.pt/play/p1222/bem-vindos-a-beirais" },
    { label: "Pôr do Sol", url: "https://www.rtp.pt/play/p9165/por-do-sol" },
    { label: "Crónica dos Bons Malandros", url: "https://www.rtp.pt/play/p8013/cronica-dos-bons-malandros" },
    { label: "Conta-me Como Foi", url: "https://www.rtp.pt/play/p6487/conta-me-como-foi" },
    { label: "República", url: "https://www.rtp.pt/play/p9328/republica" },
    { label: "Sara", url: "https://www.rtp.pt/play/p4996/e696433/sara" },
    { label: "Terra Nova", url: "https://www.rtp.pt/play/p7334/terra-nova" },
    { label: "Esta Língua Que Nos Une", url: "https://www.rtp.pt/play/p15723/esta-lingua-que-nos-une" },
    { label: "Espiãs", url: "https://www.rtp.pt/play/p15506/e873973/espias" },
    { label: "King of Game (YouTube)", url: "https://www.youtube.com/@2kingofgames" },
    { label: "Ficção Portuguesa — Playlist YouTube", url: "https://www.youtube.com/playlist?list=PLQa6lSX42iFvhpahGLRNYsT3gZJN-T6xC" },
  ]},
  { id: "s03", pt: "Comédia, Variedades e Talk Shows", en: "Comedy, Variety & Talk Shows", links: [
    { label: "5 Para a Meia-Noite", url: "https://www.rtp.pt/play/p9868/5-para-a-meia-noite" },
    { label: "Alta Definição (SIC)", url: "https://sic.pt/programas/altadefinicao-programas/" },
    { label: "Isto é Gozar com Quem Trabalha (SIC)", url: "https://sic.pt/programas/istoegozarcomquemtrabalha/" },
    { label: "Férias Cá Dentro", url: "https://www.rtp.pt/play/p10536/e633736/ferias-ca-dentro" },
    { label: "Cuidado com a Língua", url: "https://www.rtp.pt/play/p3991/cuidado-com-a-lingua" },
    { label: "Raminhos (YouTube)", url: "https://www.youtube.com/@raminhos/videos" },
    { label: "Pierre Zago (YouTube)", url: "https://www.youtube.com/@PierreZago/videos" },
    { label: "Beatriz Gosta (YouTube)", url: "https://www.youtube.com/c/BeatrizGosta" },
  ]},
  { id: "s04", pt: "Documentários e Actualidade", en: "Documentaries & Current Affairs", links: [
    { label: "RTP Play — Documentários", url: "https://www.rtp.pt/play/colecao/documentarios" },
    { label: "FFMS Play — Documentários", url: "https://www.ffms.pt/pt-pt/ffms-play/documentarios" },
    { label: "Canal Documentários PT (YouTube)", url: "https://www.youtube.com/channel/UCAzXTUnXaYXsscGtzWae1dA" },
    { label: "Fundação Francisco Manuel dos Santos (YouTube)", url: "https://www.youtube.com/@ffmspt/videos" },
  ]},
  { id: "s05", pt: "Viagens e Geografia", en: "Travel & Geography", links: [
    { label: "Portugal Mais Perto", url: "https://www.rtp.pt/play/p5665/portugal-mais-perto" },
    { label: "Guia de Portugal", url: "https://www.rtp.pt/play/p3376/e282290/guia-de-portugal" },
    { label: "Portugal a Pé", url: "https://www.rtp.pt/play/p2272/portugal-a-pe" },
    { label: "Visita Guiada", url: "https://www.rtp.pt/play/p7378/visita-guiada" },
    { label: "Lisboa, Cidade Triste e Alegre", url: "https://www.rtp.pt/play/p10399/e623375/lisboa-cidade-triste-e-alegre" },
    { label: "Alma de Viajante", url: "https://www.almadeviajante.com/" },
    { label: "Cidades de Portugal (YouTube)", url: "https://www.youtube.com/@CidadesdePortugal/videos" },
    { label: "Meio Cheio (YouTube)", url: "https://www.youtube.com/@MeioCheio/videos" },
    { label: "Remote Portugal (YouTube)", url: "https://www.youtube.com/@RemotePortugal/videos" },
  ]},
  { id: "s06", pt: "Natureza, Vida Selvagem e Ambiente", en: "Nature, Wildlife & Environment", links: [
    { label: "Geosfera", url: "https://www.rtp.pt/play/p960/e94486/geosfera" },
    { label: "Vida Animal", url: "https://www.rtp.pt/play/p553/e235162/vida-animal" },
    { label: "Natureza e Vida Selvagem", url: "https://www.rtp.pt/play/p1776/e179598/natureza-e-vida-selvagem" },
    { label: "Faça Chuva, Faça Sol", url: "https://www.rtp.pt/play/p14288/e820411/faca-chuva-faca-sol" },
    { label: "Jardim Zoológico de Lisboa (YouTube)", url: "https://www.youtube.com/user/ZoologicoJardim/playlists" },
    { label: "SPEA BirdLife Portugal (YouTube)", url: "https://www.youtube.com/@spea_birdlife/videos" },
    { label: "A Cientista Agrícola", url: "https://acientistaagricola.pt/" },
    { label: "Portugal Rural na Prática (YouTube)", url: "https://www.youtube.com/@portugalruralnapratica/videos" },
  ]},
  { id: "s07", pt: "História e Cultura", en: "History & Culture", links: [
    { label: "Arquivos RTP", url: "https://arquivos.rtp.pt/" },
    { label: "A Porta da História", url: "https://www.rtp.pt/play/p2097/a-porta-da-historia" },
    { label: "Herdeiros de Saramago", url: "https://www.rtp.pt/play/p7972/herdeiros-de-saramago" },
    { label: "História de Portugal JHS (YouTube)", url: "https://www.youtube.com/@historiadeportugaljhs3389" },
    { label: "Sete Cidades — Da Lenda à Realidade", url: "https://www.rtp.pt/play/p10718/e642720/sete-cidades-da-lenda-a-realidade" },
    { label: "Portugal Tradições (YouTube)", url: "https://www.youtube.com/@PortugalTradi%C3%A7%C3%B5es" },
    { label: "Nionoi — História PT (YouTube)", url: "https://www.youtube.com/c/Nionoi/featured" },
    { label: "Casa Comum — Universidade do Porto", url: "https://www.up.pt/casacomum/" },
    { label: "Direcção-Geral do Património Cultural", url: "https://patrimoniocultural.gov.pt/" },
    { label: "Agenda Cultural do Porto", url: "https://agendaculturalporto.org/" },
    { label: "Agenda LX — Lisboa", url: "https://www.agendalx.pt/" },
  ]},
  { id: "s08", pt: "Ferramentas de Língua Portuguesa", en: "Portuguese Language Tools", subgroups: [
    { label: "Dicionários e Tradução", links: [
      { label: "Priberam — Dicionário", url: "https://dicionario.priberam.org/" },
      { label: "Infopédia — Português–Inglês", url: "https://www.infopedia.pt/dicionarios/portugues-ingles" },
      { label: "Infopédia — Inglês–Português", url: "https://www.infopedia.pt/dicionarios/ingles-portugues" },
      { label: "Linguee", url: "https://www.linguee.pt/" },
      { label: "DeepL Tradutor", url: "https://www.deepl.com/translator" },
      { label: "WordReference PT-EN", url: "https://www.wordreference.com/pten/" },
      { label: "Dicionário de Calão (PDF)", url: "https://natura.di.uminho.pt/~jj/pln/calao/dicionario.pdf" },
    ]},
    { label: "Ortografia e Gramática", links: [
      { label: "Ciberdúvidas da Língua Portuguesa", url: "https://ciberduvidas.iscte-iul.pt/" },
      { label: "Ciberdúvidas — Pronúncia PT-PT", url: "https://ciberduvidas.iscte-iul.pt/outros/diversidades/outra-pronuncia/1014" },
      { label: "Correcao.pt — Corretor Ortográfico e Gramatical", url: "https://www.correcao.pt/" },
      { label: "FLiP — Corrector Ortográfico e Sintáctico", url: "https://www.flip.pt/FLiP-On-line/Corrector-ortografico-e-sintactico" },
    ]},
    { label: "Verbos e Conjugação", links: [
      { label: "Conjuga-me", url: "https://conjuga-me.net/" },
      { label: "Infopédia — Verbos Portugueses", url: "https://www.infopedia.pt/dicionarios/verbos-portugueses" },
      { label: "Reverso Conjugator — Português", url: "https://conjugator.reverso.net/conjugation-portuguese.html" },
      { label: "Verbos Portugueses — Prática", url: "https://www.verbos-portugueses.info/en/practise.html" },
      { label: "Verbugata", url: "https://verbugata.com/" },
    ]},
    { label: "Pronúncia e Escuta", links: [
      { label: "Forvo — Pronúncia PT", url: "https://forvo.com/languages/pt/" },
      { label: "LangPractice — Números PT-PT", url: "https://langpractice.com/portuguese-portugal/numbers/listening#1,0,1000" },
      { label: "MicMonster — Texto para Voz", url: "https://micmonster.com/" },
      { label: "Narakeet — Texto para Áudio", url: "https://www.narakeet.com/app/text-to-audio/?projectId=c4fa7619-eb7b-49d9-84bc-15572bc0e046" },
      { label: "Vocaroo — Gravador de Voz Online", url: "https://vocaroo.com/" },
      { label: "YouGlish — Português", url: "https://pt.youglish.com/portuguese" },
    ]},
    { label: "Plataformas de Aprendizagem PT-PT", links: [
      { label: "Practice Portuguese", url: "https://www.practiceportuguese.com/" },
      { label: "Portuguesepedia", url: "https://www.portuguesepedia.com/" },
      { label: "Slow Portuguese With Maria (Spotify)", url: "https://open.spotify.com/show/5PjzPWqcoGIaL29K3wIVzX" },
      { label: "Portuguese Lab — European Portuguese (Spotify)", url: "https://open.spotify.com/show/6kW8Hemxwn8N5M9BssisNg" },
      { label: "Marco Neves — Língua Portuguesa (YouTube)", url: "https://www.youtube.com/@marconeves/videos" },
      { label: "Portuguese With Carla (YouTube)", url: "https://www.youtube.com/@portuguesewithcarla" },
      { label: "Portuguese With Leo (YouTube)", url: "https://www.youtube.com/@portuguesewithleo" },
      { label: "Talk The Streets — Liz Sharma (YouTube)", url: "https://www.youtube.com/@TalkTheStreets" },
    ]},
  ]},
  { id: "s09", pt: "Notícias", en: "News", links: [
    { label: "RTP Notícias", url: "https://www.rtp.pt/noticias/" },
    { label: "RTP Notícias — Vídeo", url: "https://www.rtp.pt/noticias/videos" },
    { label: "Euronews PT — Últimas Notícias", url: "https://pt.euronews.com/ultimas-noticias" },
    { label: "CNN Portugal", url: "https://cnnportugal.iol.pt/" },
    { label: "SIC Notícias", url: "https://sicnoticias.pt/" },
    { label: "Público", url: "https://www.publico.pt/" },
    { label: "Diário de Notícias", url: "https://www.dn.pt/" },
    { label: "Observador", url: "https://www.observador.pt/" },
    { label: "TSF — Rádio Notícias", url: "https://www.tsf.pt/" },
    { label: "Correio da Manhã", url: "https://www.cmjornal.pt/" },
    { label: "Lusa — Agência de Notícias", url: "https://www.lusa.pt/" },
    { label: "ECO — Economia Online", url: "https://eco.pt/" },
    { label: "Jornal de Negócios", url: "https://www.jornaldenegocios.pt/" },
  ]},
  { id: "s10", pt: "Podcasts", en: "Podcasts", links: [
    { label: "RTP Zigzag — Podcasts", url: "https://www.rtp.pt/play/zigzag/podcasts" },
    { label: "Fumaça — Séries", url: "https://fumaca.pt/category/series/" },
    { label: "Biblioteca Pública (RTP)", url: "https://www.rtp.pt/play/p9930/biblioteca-publica" },
    { label: "Slow Portuguese With Maria (Spotify)", url: "https://open.spotify.com/show/5PjzPWqcoGIaL29K3wIVzX" },
    { label: "Portuguese Lab — European Portuguese (Spotify)", url: "https://open.spotify.com/show/6kW8Hemxwn8N5M9BssisNg" },
    { label: "Portugal Manual — Artesanato (Spotify)", url: "https://open.spotify.com/show/3i3WqMpLJJ7Fgdb9MaUtid" },
    { label: "Portugueses no Mundo — Antena 1 (Spotify)", url: "https://open.spotify.com/show/36OAbErwr710Rm6UGvH5R3" },
    { label: "Avó Carmo (YouTube)", url: "https://www.youtube.com/@Av%C3%B3Carmo" },
    { label: "Decifrar Pessoas (YouTube)", url: "https://www.youtube.com/@DecifrarPessoas/videos" },
    { label: "Joana Perez (YouTube)", url: "https://www.youtube.com/@joana_perez" },
    { label: "Não Mandas em Mim Podcast (YouTube)", url: "https://www.youtube.com/@NaoMandasemMim" },
    { label: "O Martim (YouTube)", url: "https://www.youtube.com/@OMartim/videos" },
    { label: "Podcast Para Elas (YouTube)", url: "https://www.youtube.com/@podcastparaelas/videos" },
  ]},
  { id: "s11", pt: "Música", en: "Music", links: [
    { label: "RTP Palco — Espectáculos de Música", url: "https://www.rtp.pt/play/palco/espetaculos/musica/todos" },
    { label: "Playlist — Top Portugal (Spotify)", url: "https://open.spotify.com/playlist/37i9dQZF1DX6ViL9RcFABv" },
    { label: "Playlist — Fado (Spotify)", url: "https://open.spotify.com/playlist/37i9dQZF1DX6HJZtcjGrCn" },
    { label: "Playlist — PT Clássicos (Spotify)", url: "https://open.spotify.com/playlist/19aeYRwKFy0DXZOyNs2Sjv" },
    { label: "Playlist — Músicas PT (Spotify)", url: "https://open.spotify.com/playlist/37i9dQZF1DWYjjOmuB9ehg" },
    { label: "Antena 3 (YouTube)", url: "https://www.youtube.com/@antena3rtp/videos" },
    { label: "VMTV Portugal (YouTube)", url: "https://www.youtube.com/@VMTVpt/videos" },
    { label: "Jorge Alexandre (YouTube)", url: "https://www.youtube.com/@jorgealexandre_14/videos" },
  ]},
  { id: "s12", pt: "Rádio", en: "Radio", links: [
    { label: "Radio Garden — Portugal", url: "https://radio.garden/visit/portugal/lVedGqUL" },
    { label: "Radio.pt — Todas as Estações PT", url: "https://www.radio.pt/country/portugal" },
    { label: "Antena 1 — Directo", url: "https://www.antena1.rtp.pt/ouvir-em-direto/" },
    { label: "Antena 3 — Directo", url: "https://www.antena3.rtp.pt/ouvir-em-direto/" },
    { label: "TSF — Directo", url: "https://www.tsf.pt/direto/" },
    { label: "RFM — Directo", url: "https://rfm.sapo.pt/radio/ouvir-online/" },
    { label: "Rádio Comercial — Directo", url: "https://comercial.sapo.pt/radio/ouvir-online/" },
    { label: "Rádio Portuense — Directo", url: "https://radioportuense.com/ouvir-em-direto/" },
  ]},
  { id: "s13", pt: "Livros, Literatura e Audiolivros", en: "Books, Literature & Audiobooks", subgroups: [
    { label: "Televisão", links: [
      { label: "Literatura Agora (RTP)", url: "https://www.rtp.pt/play/p1747/e197849/literatura-agora" },
      { label: "Os Livros (RTP)", url: "https://www.rtp.pt/play/p2412/os-livros" },
      { label: "A Vida Privada dos Livros (RTP)", url: "https://www.rtp.pt/play/p9466/e577708/a-vida-privada-dos-livros" },
    ]},
    { label: "Bibliotecas e Arquivos Digitais", links: [
      { label: "Biblioteca Digital Camões", url: "http://cvc.instituto-camoes.pt/conhecer/biblioteca-digital-camoes.html" },
      { label: "Biblioteca Nacional Digital", url: "https://bndigital.bnportugal.gov.pt/project/livros/" },
      { label: "Imprensa Nacional — Livros em PDF", url: "https://imprensanacional.pt/livros-em-pdf/" },
      { label: "Project Gutenberg — Português", url: "https://www.gutenberg.org/browse/languages/pt" },
      { label: "Fundação Gulbenkian — Publicações", url: "https://gulbenkian.pt/publicacoes/" },
    ]},
    { label: "Livrarias", links: [
      { label: "Wook", url: "https://www.wook.pt/" },
      { label: "FNAC Portugal", url: "https://www.fnac.pt/" },
      { label: "Bertrand Livreiros", url: "https://www.bertrand.pt/" },
    ]},
    { label: "Audiolivros", links: [
      { label: "Imprensa Nacional — Audiolivros", url: "https://imprensanacional.pt/digitais/audiolivros/" },
      { label: "Bertrand — Audiolivros em Português", url: "https://www.bertrand.pt/arvoretematica/audiolivros-em-portugues/25188x25189/P" },
      { label: "Audiolivros — Playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLJrrzPTVK9DeTyGHEufvbmRpEPDsErlIp" },
      { label: "Contos Portugueses — Playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLQ7SbCg65jTLZsvPsyBDg_KQYuMZBIymC" },
    ]},
    { label: "Canais YouTube", links: [
      { label: "Abrir o Livro (YouTube)", url: "https://www.youtube.com/c/AbriroLivro" },
      { label: "Mundo dos Poemas (YouTube)", url: "https://www.youtube.com/@mundodospoemas/videos" },
      { label: "Livraria Aqui Há Gato (YouTube)", url: "https://www.youtube.com/@livrariaaquihagato/videos" },
    ]},
    { label: "Banda Desenhada", links: [
      { label: "Astérix — Revista Gratuita PT", url: "https://asterix.com/pt-pt/gratis-a-revista-asterix-para-descarregar/" },
    ]},
  ]},
  { id: "s14", pt: "Gastronomia e Culinária", en: "Food & Cooking", links: [
    { label: "Mesa Portuguesa com Estrelas, com Certeza", url: "https://www.rtp.pt/play/p6444/mesa-portuguesa-com-estrelas-com-certeza" },
    { label: "MasterChef Portugal", url: "https://www.rtp.pt/play/p9491/masterchef-portugal" },
    { label: "Cozinha com Amor", url: "https://www.rtp.pt/play/p2496/e246134/cozinha-com-amor" },
    { label: "Receitas Portuguesas — Playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLMaH2e5YViRYSYd0TwRS43T8PNBqK_0lV" },
    { label: "Sabor Intenso (YouTube)", url: "https://www.youtube.com/@SaborIntenso/videos" },
    { label: "Cozinha do Miguel (YouTube)", url: "https://www.youtube.com/@CozinhadoMiguel/videos" },
    { label: "Tuga na Cozinha (YouTube)", url: "https://www.youtube.com/@TuganaCozinha" },
    { label: "Frederica — Blog", url: "https://frederica.com/blogs/blog?page=1" },
  ]},
  { id: "s15", pt: "Conteúdo Infantil", en: "Children's Content", links: [
    { label: "RTP Zigzag — Directo", url: "https://www.rtp.pt/play/direto/zigzag" },
    { label: "Zigzag — Podcasts Infantis", url: "https://www.rtp.pt/play/zigzag/podcasts" },
    { label: "Portuguese Fairy Tales (YouTube)", url: "https://www.youtube.com/@PortugueseFairyTales" },
    { label: "Mundo Animado PT (YouTube)", url: "https://www.youtube.com/c/MundoAnimadoPT/videos" },
    { label: "Projecto Adamastor — Audiolivros Infantis", url: "https://projectoadamastor.org/audiolivros-para-criancas/" },
    { label: "Histórias Infantis — Playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLuA3C1Hw3DNXftFTFJ3vcdIvnaXm9_VI9" },
    { label: "Fundação Jorge Álvares — Contos e Lendas", url: "https://www.fundacaojorgealvares-bibliotecadigital.com/index.php?s=colecao&coleccao=contos-e-lendas" },
  ]},
  { id: "s16", pt: "Desporto", en: "Sport", links: [
    { label: "Maisfutebol", url: "https://maisfutebol.iol.pt/" },
    { label: "Jornal Record", url: "https://www.record.pt/" },
    { label: "O Jogo", url: "https://www.ojogo.pt/" },
    { label: "A Bola", url: "https://www.abola.pt/" },
    { label: "Golo FM", url: "https://golo.fm/" },
    { label: "O Ciclista Improvável (YouTube)", url: "https://www.youtube.com/c/OCiclistaImprov%C3%A1vel/videos" },
    { label: "Podcast Futebol PT (Spotify)", url: "https://open.spotify.com/show/7q8gYdjuNuElnSQR6z6j4B" },
  ]},
  { id: "s17", pt: "Saúde, Psicologia e Bem-estar", en: "Health, Psychology & Wellbeing", links: [
    { label: "Psicologia Também é Ciência (YouTube)", url: "https://www.youtube.com/@Psicologiatambemeciencia/videos" },
    { label: "Momento Médico (YouTube)", url: "https://www.youtube.com/c/MomentoM%C3%A9dicoYouTube/videos" },
    { label: "O Pediatra PT (YouTube)", url: "https://www.youtube.com/@opediatrapt/videos" },
    { label: "Do Bem PT (YouTube)", url: "https://www.youtube.com/@Dobempt/videos" },
    { label: "Podcast Saúde PT (Spotify)", url: "https://open.spotify.com/show/0wguYIGDBlsQ98UkmJKIQf" },
  ]},
  { id: "s18", pt: "Artesanato, DIY e Casa", en: "Crafts, DIY & Home", links: [
    { label: "Trabalhos Manuais da Di (YouTube)", url: "https://www.youtube.com/c/TrabalhosManuaisdaDi/videos" },
    { label: "Instituto Português do Tricot", url: "https://institutoportuguesdotricot.pt/" },
    { label: "Fios Cruzados (YouTube)", url: "https://www.youtube.com/@fioscruzados/videos" },
    { label: "EVERMEND — DIY (YouTube)", url: "https://www.youtube.com/@EVERMEND/videos" },
    { label: "Leroy Merlin Portugal (YouTube)", url: "https://www.youtube.com/c/leroymerlinportugal/videos" },
    { label: "Querido, Mudei a Casa (YouTube)", url: "https://www.youtube.com/@queridomudeiacasaoficial/videos" },
    { label: "GEM — Revistas de Artesanato", url: "https://gem.pt/1/publicacoes/revistas-gem/" },
    { label: "Tinta Para Todos (YouTube)", url: "https://www.youtube.com/@tintaparatodos1421/videos" },
  ]},
  { id: "s19", pt: "Média Moçambicana e Africana em Português", en: "Mozambican & African Portuguese Media", subgroups: [
    { label: "Televisão e Rádio", links: [
      { label: "RTP África", url: "https://www.rtp.pt/rtpafrica" },
      { label: "RDP África — Rádio", url: "https://rdpafrica.rtp.pt/legacy/?icm=15638" },
      { label: "TVM Moçambique — Directo", url: "http://online.tvm.co.mz/site/emdirecto/tvm1" },
    ]},
    { label: "Podcasts", links: [
      { label: "Ouro Negro — Podcast", url: "https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5ibHVicnJ5LmNvbS9mZWVkcy9vdXJvbmVncm8ueG1s" },
    ]},
    { label: "YouTube", links: [
      { label: "José Diversão (YouTube)", url: "https://www.youtube.com/@JoseDiversao/videos" },
      { label: "Maningue Magic (YouTube)", url: "https://www.youtube.com/maninguemagic/playlists" },
      { label: "Pátria Minha — Moz (YouTube)", url: "https://www.youtube.com/@patriaminhaMoz/videos" },
    ]},
  ]},
  { id: "s20", pt: "Revistas e Publicações", en: "Magazines & Publications", links: [
    { label: "Expresso", url: "https://expresso.pt/" },
    { label: "Visão", url: "https://www.visao.pt/" },
    { label: "Sábado", url: "https://www.sabado.pt/" },
    { label: "Time Out Portugal", url: "https://www.timeout.pt/" },
    { label: "Revista Business Portugal (Issuu)", url: "https://issuu.com/revistabusinessportugal" },
    { label: "Best Guide Portugal (Issuu)", url: "https://issuu.com/bestguideportugal" },
    { label: "GEM — Artesanato", url: "https://gem.pt/1/publicacoes/revistas-gem/" },
    { label: "Echo Boomer", url: "https://echoboomer.pt/" },
  ]},
  { id: "s22", pt: "Comédia e Entretenimento — YouTube", en: "Comedy & Entertainment — YouTube Creators", links: [
    { label: "Beatriz Gosta", url: "https://www.youtube.com/c/BeatrizGosta" },
    { label: "Fernando Rocha", url: "https://www.youtube.com/c/FernandoRochaComedy" },
    { label: "Guilherme Geirinhas", url: "https://www.youtube.com/@GuilhermeGeirinhas" },
    { label: "Mat3us", url: "https://www.youtube.com/@mat3us/videos" },
    { label: "Pierre Zago", url: "https://www.youtube.com/@PierreZago/videos" },
    { label: "Raminhos", url: "https://www.youtube.com/@raminhos/videos" },
  ]},
  { id: "s23", pt: "Criadores Portugueses — YouTube", en: "Portuguese YouTube Creators (Various)", links: [
    { label: "Marco Neves — Língua Portuguesa", url: "https://www.youtube.com/@marconeves/videos" },
    { label: "A Tua Filosofia", url: "https://www.youtube.com/@ATuaFilosofia/videos" },
    { label: "Luís Pinto TekTest — Tecnologia", url: "https://www.youtube.com/@LuisPintoTekTest/videos" },
    { label: "Olívia Ortiz", url: "https://www.youtube.com/@OliviaOrtiz/videos" },
    { label: "Rádio Portuense Online", url: "https://www.youtube.com/c/R%C3%A1dioPortuenseOnline" },
    { label: "Como os Pés na Terra", url: "https://www.youtube.com/c/Comosp%C3%A9snaterra" },
    { label: "Jornalismo Porto Net", url: "https://www.youtube.com/c/JornalismoPortoNet" },
  ]},
  { id: "s24", pt: "Teatro e Artes Performativas", en: "Theatre & Performing Arts", links: [
    { label: "RTP Palco — Teatro", url: "https://www.rtp.pt/play/palco/espetaculos/teatro/todos" },
    { label: "RTP Palco — Música ao Vivo", url: "https://www.rtp.pt/play/palco/espetaculos/musica/todos" },
    { label: "Teatro Camões — Lisboa", url: "https://www.teatro-camoes.pt/" },
    { label: "Teatro Nacional São João — Porto", url: "https://www.tnsj.pt/" },
    { label: "Direcção-Geral das Artes", url: "https://www.dgartes.gov.pt/" },
    { label: "Teatro PT — Playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PLFgXXzMIIMIuMH93bQBEi3SBV4Tsl3xoN" },
  ]},
];
const MEDIA_SECTIONS_SORTED = [...MEDIA_SECTIONS].sort((a, b) => a.pt.localeCompare(b.pt, "pt"));

// ── SCIENCE & HEALTH VOCABULARY ─────────────────────────────
const SH_VOCAB = {
  NOUN: ["o abandono","o abismo","a abordagem","o aborrecimento","o abscesso","o absurdo","os abusos","o abutre","a ação","o acaso","a aceitação","os acidentes","o aço","as ações","os acordes","o acréscimo","a acumulação","a acusação","o acusador","Adão","a adaptação","a adesão","a adição","a adolescência","a adoração","os adoradores","o adultério","o adversário","o advogado","a afeição","o afeto","os afetos","a afinidade","a aflição","as aflições","o agente","os agentes","o agnosticismo","a agonia","a água","as águas","a ajuda","a alegria","as alegrias","a aliança","o alimento","o alívio","a alma","as almas","o altar","a alteração","o Altíssimo","o aluno","os alunos","a ambição","o ambiente","o amor","o amor cristão","o amor divino","a análise","a analogia","o anjo","os anjos","a ansiedade","a aparência","as aparências","o apóstolo","os apóstolos","o Apóstolo Paulo","o ar","o arrependimento","a arte","a árvore","a árvore do conhecimento","a árvore da vida","a ascensão","a aspiração","o ateísmo","a atenção","a atitude","o ato","a atração","o atributo","os atributos","a autoridade","a balança","o barbarismo","a base","a batalha","o batismo","a beleza","o bem","o bem-estar","a benção","a bênção","as bênçãos","o benefício","a Bíblia","a blasfêmia","a bondade","a bondade divina","a busca","a cabeça","o caminho","os caminhos","o campo","o câncer","o cântico","o caos","a capacidade","o caráter","a caridade","a carnalidade","a carne","a casa","o casamento","a castidade","o castigo","a causa","a causalidade","o cérebro","a certeza","o ceticismo","o céu","os céus","a ciência","a Ciência Cristã","a Ciência divina","o cientista","o Cientista Cristão","a clareza","a consciência","a consciência humana","o conselho","a consequência","o conforto","a confusão","o conhecimento","a coragem","o coração","os corações","o corpo","a corporalidade","os corpos","a cortesia","a crença","as crenças","a crença humana","o crente","o crescimento","a criação","a criança","as crianças","a criatura","Cristo Jesus","Cristo","o Cristo","a crucifixão","a cruz","a cura","a cura divina","a dádiva","a decisão","a declaração","o declínio","o defeito","a defesa","a definição","a deidade","a demência","a demonstração","a denominação","o desânimo","a desarmonia","o descanso","a descoberta","a descrença","o desejo","os desejos","o desenvolvimento","o desespero","a destruição","a determinação","Deus","o Deus","o diabo","o diagnóstico","a diferença","a dificuldade","a dignidade","o discernimento","a disciplina","o discípulo","os discípulos","a discórdia","a distinção","a divindade","a divisão","a doença","as doenças","a doença mental","os doentes","o dogma","os dogmas","o dom","o domínio","a dor","as dores","a doutrina","as doutrinas","a dúvida","a educação","o efeito","o ego","o egoísmo","a eletricidade","a elevação","a eloquência","a emoção","a energia","a energia divina","a enfermidade","o engano","o ensinamento","os ensinamentos","o entendimento","o equilíbrio","a era","o erro","os erros","a Escritura","as escrituras","a escuridão","a esfera","a esperança","o Espírito","o Espírito Santo","a espiritualidade","a espiritualização","a essência","a estabilidade","o estado","a eternidade","a ética","o eu","o evangelho","a evidência","a evolução","a existência","a expiação","a expressão","a fé","a febre","a felicidade","o fenômeno","os fenômenos","a fidelidade","a filosofia","o fim","a força","as forças","a forma","a formação","a fraternidade","a fraude","o fruto","os frutos","o fundamento","os fundamentos","o futuro","a generosidade","a glória","a glória de Deus","o gosto","o governo","a graça","a graça celestial","a grandeza","a gratidão","o guia","a harmonia","a herança","a hipocrisia","a hipótese","as hipóteses","a história","o homem","o homem mortal","o homem verdadeiro","os homens","a humildade","a ignorância","a igreja","as igrejas","a igualdade","a iluminação","a ilusão","as ilusões","a imagem","as imagens","a imaginação","a imoralidade","a imortalidade","a imperfeição","a impossibilidade","a incapacidade","a individualidade","a inércia","a infância","o inferno","o infinito","a infinitude","a influência","a ingratidão","o inimigo","os inimigos","a inimizade","a iniquidade","a injustiça","a inocência","a insanidade","a inspiração","a instituição","as instituições","a instrução","a integridade","a inteligência","a intenção","a intuição","a ira","a irmã","o irmão","o jardim","Jeová","o Jeová","a Jerusalém","Jesus","o Jesus","João","a jornada","o júbilo","o judaísmo","a justiça","a justiça divina","a justificação","a juventude","a lealdade","a lei","a lei da matéria","as leis","a liberdade","a libertação","a lição","as lições","a lógica","Logos","a loucura","o louvor","a lua","o lugar","a luta","a luz","a mãe","a magia","o magnetismo","o mal","a maldade","a maldição","a maneira","a manifestação","a mansidão","a mão","as mãos","o mar","a maravilha","os mártires","o martírio","a matéria","a materialidade","o materialismo","a maternidade","a mediação","o mediador","o medicamento","a medicina","o médico","os médicos","o medo","a memória","a mensagem","a mente","a Mente divina","a mente humana","a mente mortal","a mentira","a metafísica","o metafísico","o milagre","os milagres","a misericórdia","a missão","o mistério","a moral","a moralidade","a morte","a motivação","o movimento","a mudança","o mundo","a nação","o nada","a natureza","a natureza divina","a necessidade","o nome","os nomes","a obediência","o objetivo","a obra","as obras","a oração","a ordem","a origem","a originalidade","o osso","os ossos","a paciência","a paciente","o paciente","os pacientes","o pai","o Pai-Mãe","os pais","a paixão","a palavra","as palavras","a parábola","o paraíso","a paz","o pecado","o pecador","os pecadores","os pecados","a pedra","o pensamento","os pensamentos","a percepção","a perda","a perfeição","a permanência","a perseguição","a perseverança","a perturbação","a pesquisa","a pessoa","as pessoas","o poder","o poder de cura","o poder divino","os poderes","a política","a pomba","o ponto de vista","o princípio","o Princípio divino","os princípios","a profecia","o profeta","os profetas","a profundidade","o progresso","a promessa","o propósito","a prosperidade","a prova","a pureza","a purificação","a questão","a razão","a reação","a realidade","a realização","a redenção","a regeneração","a rejeição","a religião cristã","a religião","a religiosidade","o remédio","a renovação","a renúncia","a repetição","o repouso","a representação","a ressurreição","a restauração","o resultado","os resultados","a retidão","a revelação","a revolução","a riqueza","as riquezas","a sabedoria","a salvação","o salvador","a sanidade","a santidade","o santo","Satanás","a satisfação","a saúde","o século","os séculos","o segredo","a semelhança","a semente","as sementes","o ser","o ser humano","a serenidade","o sermão","a serpente","o servo","a significação","o significado","o silêncio","o símbolo","os símbolos","a simplicidade","a sinceridade","o sintoma","os sintomas","o sistema","a situação","a sociedade","o sofrimento","os sofrimentos","a solidão","a solução","o sonho","os sonhos","a substância","o sucesso","a sugestão","a superioridade","a superstição","a supremacia","o tabernáculo","o temor","a tempestade","o templo","o tempo","os tempos","a tentação","a teologia","a teoria","as teorias","a terapia","o termo","os termos","a terra","o terror","a tese","o tesouro","o testemunho","os testemunhos","o texto","os textos","a tradição","a tradução","a transformação","a transgressão","a transição","o tratamento","as trevas","a tríade","a tribulação","o tribunal","a tristeza","o triunfo","o trono","a tuberculose","o tumor","os tumores","o túmulo","a unção","a união","a unidade","o universo","a utilidade","a vaidade","o valor","os valores","a verdade","a verdade divina","a verdade eterna","as verdades","a vergonha","a versão","o versículo","os versículos","a vida","a vida espiritual","a vida eterna","a vigilância","o vigor","o vínculo","a violência","a virtude","as virtudes","a visão","a vitória","a vitalidade","a vontade","a vontade divina","a voz","o zelo"],
  VERB: ["abalar","abandonar","abençoar","abrir","absorver","aceitar","acreditar","adaptar","admitir","adorar","afirmar","agir","ajudar","alcançar","amar","andar","aniquilar","anular","aparecer","aplicar","apoiar","aprender","apresentar","aprofundar","assumir","atender","atribuir","atuar","aumentar","avaliar","avançar","basear","beber","beneficiar","brilhar","buscar","cair","caminhar","causar","ceder","chamar","chegar","cobrir","coexistir","combater","começar","comer","compreender","comunicar","concluir","concordar","condenar","conduzir","confessar","confiar","confundir","conhecer","conseguir","conservar","considerar","construir","consumir","contemplar","continuar","contradizer","controlar","convencer","converter","corrigir","crer","crescer","criar","cuidar","cumprir","curar","dar","debater","decidir","declarar","deduzir","defender","deixar","demonstrar","denominar","depender","derrotar","desaparecer","descobrir","descrever","desenvolver","desejar","destruir","desvanecer","determinar","dever","dizer","dominar","duvidar","edificar","educar","elevar","eliminar","emanar","encontrar","enfrentar","enganar","ensinar","entender","entrar","esclarecer","escolher","escrever","esquecer","estabelecer","estar","estudar","evoluir","examinar","existir","explicar","expressar","expulsar","falar","falhar","fazer","ficar","firmar","florescer","fluir","formar","fornecer","fortalece","fugir","fundamentar","ganhar","garantir","gerar","glorificar","governar","guiar","habitar","harmonizar","haver","herdar","iluminar","imaginar","imitar","impedir","indicar","influenciar","informar","iniciar","instruir","interpretar","introduzir","invocar","ir","julgar","justificar","labutar","lançar","ler","lembrar","levar","libertar","limitar","limpar","louvar","lutar","manifestar","manter","matar","melhorar","morrer","mostrar","mudar","nascer","negar","obedecer","oferecer","olhar","operar","orar","ouvir","pagar","parecer","participar","passar","pensar","perceber","perder","perdoar","permanecer","permitir","perseverar","pertencer","poder","possuir","praticar","pregar","procurar","produzir","progredir","prometer","proteger","purificar","realizar","receber","reconciliar","reconhecer","redimir","reduzir","referir","refletir","regenerar","reinar","rejeitar","renovar","renunciar","representar","resistir","resolver","respeitar","responder","ressuscitar","restabelecer","restaurar","resultar","revelar","saber","sacrificar","salvar","santificar","satisfazer","seguir","sentir","separar","ser","servir","significar","simbolizar","sobreviver","sofrer","sondar","sonhar","subir","submeter","substituir","superar","suprimir","surgir","sustentar","temer","tentar","ter","terminar","testemunhar","tirar","tocar","tomar","tornar","trabalhar","transcender","transformar","transmitir","tratar","trazer","triunfar","unir","usar","utilizar","valer","ver","vencer","viver","voltar"],
  ADJECTIVE: ["absoluto","aceitável","acessível","adequado","adorável","agradável","alegre","amoroso","amplo","ansioso","aparente","apostólico","ardente","ativo","audível","autoritário","baixo","básico","beatífico","belo","bem-aventurado","bendito","benéfico","benigno","bíblico","bondoso","brilhante","capaz","carnal","celestial","científico","claro","coerente","coeterno","completo","complexo","comum","confiante","confiável","consciente","constante","contínuo","contrário","corporal","corpóreo","correto","corrompido","cristão","crítico","curado","decadente","dedicado","definitivo","demente","demonstrável","desanimado","desarmonioso","desconhecido","desejável","desnecessário","devoto","difícil","digno","distinto","divino","doente","doloroso","duradouro","eficaz","efêmero","egoísta","elevado","eloquente","enfermo","errado","errante","errôneo","essencial","espiritual","espiritualizado","estranho","eterno","exato","excelente","existente","falso","fatal","favorável","feliz","fenomenal","fervente","fiel","final","finito","firme","físico","forte","fraco","frágil","frutífero","fútil","genuíno","glorioso","grande","harmônico","harmonioso","honesto","horrível","humano","humilde","ideal","idêntico","ignorante","ilimitado","iluminado","imaculado","imaterial","imenso","imoral","imortal","impassível","imperfeito","impessoal","importante","impossível","impuro","imutável","inanimado","incapaz","incessante","incoerente","incomparável","incompleto","incondicional","incorpóreo","incorreto","incrível","independente","indestrutível","indispensável","individual","inefável","infalível","infinito","inocente","insano","inspirado","intelectual","inteligente","inteligível","intencional","intenso","interior","inútil","invisível","irracional","irreal","jovem","justo","legítimo","limitado","limpo","livre","lógico","luminoso","maior","majestoso","material","mau","melhor","mental","metafísico","milagroso","misericordioso","místico","moral","mortal","mutável","natural","necessário","negativo","nobre","novo","omnipresente","onipotente","onipresente","onisciente","oposto","original","paciente","pacífico","pecaminoso","pequeno","perfeito","perigoso","permanente","perverso","pleno","poderoso","positivo","possível","primário","profundo","próprio","puro","racional","radiante","real","redentor","religioso","responsável","sagrado","salutar","santo","satisfeito","saudável","seguro","semelhante","sensato","sensível","sensual","separado","sereno","severo","silencioso","simples","sincero","sistemático","soberano","sobrenatural","sublime","suficiente","superior","supremo","tangível","temporal","temporário","total","tranquilo","transcendental","transitório","triste","último","único","universal","útil","verdadeiro","vigoroso","visível","vital","vitorioso","vivo"],
  ADVERB: ["abertamente","absolutamente","agora","ainda","além","altamente","anteriormente","antes","apenas","aqui","assim","até","atualmente","bastante","bem","calmamente","cedo","certamente","cientificamente","claramente","completamente","constantemente","continuamente","corretamente","de fato","definitivamente","depois","devotamente","diariamente","diretamente","divinamente","enfim","então","erroneamente","especialmente","espiritualmente","eternamente","evidentemente","exatamente","facilmente","felizmente","finalmente","frequentemente","fundamentalmente","geralmente","harmonicamente","hoje","honestamente","humanamente","humildemente","igualmente","imediatamente","imortalmente","inevitavelmente","infelizmente","infinitamente","inicialmente","injustamente","instantaneamente","inteiramente","intensamente","interiormente","jamais","juntos","lentamente","livremente","logicamente","logo","longe","mais","materialmente","mentalmente","moralmente","muito","naturalmente","necessariamente","novamente","nunca","obviamente","originalmente","perfeitamente","plenamente","positivamente","profundamente","puramente","rapidamente","realmente","relativamente","religiosamente","sempre","silenciosamente","simplesmente","somente","suavemente","suficientemente","supremamente","também","temporariamente","totalmente","verdadeiramente","visivelmente"],
  CONJUNCTION: ["à medida que","ainda que","além disso","antes que","ao passo que","apesar","apesar de","assim","assim que","até","caso","como","conforme","contudo","de","embora","enquanto","então","entre","entretanto","logo","logo que","nem","ou","pois","pois que","por","por exemplo","porém","porquanto","porque","portanto","posto que","quando","que","se","se assim","se não","senão","visto","visto que"],
  PREPOSITION: ["a fim","a partir de","acerca","acima","além","ante","antes","apesar","após","até","através","conforme","contra","de acordo","de acordo com","debaixo","debaixo de","dentro","desde","diante","durante","entre","excepto","fora","junto","mediante","para","pela","pelo","perante","por","salvo","segundo","sob","sobre"],
  OTHER: ["à luz de","à medida","a mesma","a partir","a qual","absolutamente","acabe","adamah","ah","aí","ainda","além","algo","alguém","algum","alguma","alguns","amém","antes","ao","ao passo que","apenas","aquele","aqui","aquilo","as","assim","até","através","cada","com","como","conforme","contra","da","daí","de","de algum modo","de modo algum","de repente","de verdade","depois","desde","desta","diante","eis","em verdade","enfim","enquanto","então","entre","entretanto","essa","essa mesma","esse","esses","esta","este","estes","isso","isto","já","jamais","lá","mais","mas","menos","mesmo","nem","nenhum","nesse","nunca","ora","para","pela","pelo","pois","por","por conseguinte","por fim","por isso","porque","portanto","qualquer","quando","quanto","que","quem","quiçá","se","seja como for","sempre","sequer","só","sob","sobre","tal","talvez","também","tampouco","tanto","tão","teu","toda","todas","todas as coisas","todavia","todo","todos","totalmente","tudo","tudo-em-tudo"],
};

const SH_QUOTES = {"NOUN":{"o abandono":"As angústias do abandono e as bordoadas da ignorância fanática o feriram dolorosa mente.","o abismo":"Tal transformação em sentido contráAbismo rio é impossível na Ciência.","o aborrecimento":"Não se deveria exigir que o homem participasse de todos os aborrecimentos e cuidados da economia doméstica, nem se deveria esperar que a mulher entendesse de economia política.","o abscesso":"A chamada crença da mente mortal, que aparece sob a O erro se destrói forma de abscesso, não deveria ficar mais doloa si mesmo rosa antes de supurar, nem deveria a febre aumentar antes de cessar.","o absurdo":"Se o erro fosse verdadeiro, sua verdade seria um erro, e teríamos um absurdo evidente por si mesmo — a saber, uma verdade errônea.","os abusos":"A ignorância quanto ao erro a ser erradicado frequentemente te expõe a sofrer seus abusos.","o abutre":"O falecido Luiz Agassiz, pelo exame microscópico de um óvulo de abutre, reforça as conclusões dos pensadores sobre a teoria científica da criação.","a ação":"Ele não atribuía a si mesmo inteli gência, ação, nem vida separadas de Deus.","o acaso":"Acaso a Ciência não mostra que o pecado traz sofrimento, tanto hoje como ontem?","a aceitação":"Em vista de todos esses sinais que se seguiram à minha aceitação da Ciência Cristã, compreendi que esta tinha de ser a verdade.","os acidentes":"Dizes que os acidentes, os ferimentos e as doenças matam o homem, mas isso não é verdade.","o aço":"O médico apontou um lugar que estava ligeiramente mais grosso, como um tubo de aço que tivesse sido soldado.","as ações":"Manter na consciência as más ações tende Arrependimento a destruir a capacidade de fazer o bem.","os acordes":"Os tons da mente humana podem ser diferentes, mas deveriam ser harmoniosos para se entrosarem adequadaAcordes e mente.","o acréscimo":"206: “Os estágios de progresso na Ciência Cristã se alcançam pelo crescimento, não pelo acréscimo”.","a acusação":"Esta última acusação tinha sua razão de ser, mas não segundo o modo de ver deles.","o acusador":"Esse método errado é como se o acusado apoiasse o acusador a favor de uma decisão que o acusado sabe que vai terminar em sua própria condenação.","Adão":"Adão, representado nas Escrituras como formado do pó, é um objeto de estudo para a mente humana.","a adaptação":"O Amor é imparcial e universal na sua adaptação e nas suas dádivas.","a adesão":"A estrita adesão ao Princípio divino É impossível e às regras do método científico é a única coisa fazer tramoias que assegura o êxito dos estudantes de Ciência Cristã.","a adição":"A adição dos A matemática mesmos dois números, na matemática, tem de e a lógica científica produzir sempre o mesmo resultado.","a adolescência":"Sempre tive pela frente a doença e os medicamentos e, ao chegar à adolescência, eu achava que conhecia um remédio material para cada doença.","a adoração":"Ciência e Saúde A oração materializa a adoração estorva o desenvolvimento espiritual do homem e o impede de demonstrar seu poder sobre o erro.","os adoradores":"Lembra-te de Jesus, que há quase dezenove séculos demons trou o poder do Espírito e disse: “Aquele que O privilégio crê em mim fará também as obras que eu faço”, desta época e ainda disse: “Mas vem a hora e já chegou, em que os verda deiros adoradores adorarão o Pai em espírito e em verdade”.","o adultério":"Posso enganar, mentir, cometer adultério, roubar, matar, e evito ser descoberto, graças à infâmia de minha linguaO testemunho gem melíflua.","o adversário":"Então, teu adversário te entregará ao juiz (a mente mortal), e o juiz te condenará.","o advogado":"O Homem Mortal não teve advogado competente para lhe defender a causa.","o afeto":"A felicidade do afeto é espiritual, nascida da Verdade e do Amor.","os afetos":"O lar é o lugar mais querido da terra, e deveria ser o centro, mas não o limite, dos afetos.","a afinidade":"A Mente não tem afinidade Não há com a matéria e, por isso, a Verdade é capaz de afinidade física expulsar os males da carne.","a aflição":"Se o pesar causa sofrimento, convence tu o sofredor de que a aflição é muitas vezes a fonte da alegria, e que ele deve se regozijar constantemente no Amor sempre presente.","as aflições":"Se formos suficientemente bons para nos beneficiar do cálice das aflições terrenas de Jesus, Deus nos sustentará nessas aflições.","o agente":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","os agentes":"Sir John Forbes, M.D., F.R.S., Membro da Faculdade Real de Medicina, de Londres, disse: “Nenhuma classificação sistemática ou teórica de doenças ou de agentes terapêuticos já publicada é verdadeira ou se aproxima da verdade, e nenhuma pode ser adotada como guia seguro no desempenho da profissão”.","o agnosticismo":"O paganismo e o agnosticismo talvez definam a Deidade como “o grande incognoscível”; mas a Ciência Cristã traz Deus para muito mais perto do homem, e faz com que conheçamos melhor a Deus como o Tudo-em-tudo, perpetuamente junto do homem.","a agonia":"Toda agonia do erro mortal ajuda o erro a destruir o erro e contribui, assim, para a compreensão da Verdade imortal.","a água":"Durante muitos anos, ele só comeu pão e legumes e não bebeu nada a Inanição não ser água.","as águas":"Não podemos sondar a natureza e a qualidade da criação de Deus, mergulhando nas águas rasas das crenças mortais.","a ajuda":"Os doentes estariam mais deplorejeitados ravelmente perdidos do que os pecadores, se os doentes não pudessem se apoiar na ajuda de Deus, como os pecadores podem.","a alegria":"A unidade de espírito dá novas asas à felicidade, do contrário as asas extenuadas da alegria se arrastam no pó.","as alegrias":"Só as alegrias mais elevadas podem satisfazer os anseios do homem imortal.","a aliança":"Participastes do sangue da Nova Aliança, das perseguições que acompanham uma compreensão nova e mais elevada de Perguntas Deus?","o alimento":"Não é a vida mais do que o alimento, e o corpo, mais do que as vestes?","o alívio":"Durante toda a minha vida havia sofrido desses males, sem nunca achar alívio permanente nos remédios materiais, nem mesmo esperança de um dia ficar curada.","a alma":"A Oração do Senhor é a oração da Alma, não do senso material.","as almas":"O termo almas ou espíritos é tão impróprio como o termo deuses.","o altar":"Paulo viu em Atenas um altar dedicado “ao Deus desco­ nhecido”.","o Altíssimo":"Invejoso da oferta de seu irmão, Caim trama contra a vida de Abel, em vez de fazer de sua própria oferta um tributo mais digno do Altíssimo.","o aluno":"O professor e o aluno também deveriam conhecer a obs tetrícia ensinada por esta Ciência.","os alunos":"Se o Mestre não tivesse e estorvo tido alunos, nem tivesse ensinado a realidade a respeito de Deus, a qual não se via, ele não teria sido crucificado.","a ambição":"A ambição isenta de ego, os nobres dissonância motivos de vida e a pureza — esses elementos do pensamento, unidos, constituem, individual e coletivamente, a verdadeira felicidade, força e permanência.","o ambiente":"Embora os indivíduos tenham Ambiente falecido, seu ambiente mental permanece e pode mental ser discernido, descrito e transmitido.","o amor":"A oração que reforma o pecador e cura o doente é uma fé absoluta em que tudo é possível a Deus — uma compreensão espiritual acerca dEle, um amor isento de ego.","o amor divino":"Estar “com o Senhor” é obedecer à lei de Deus, é ser inteiramente governado pelo Amor divino — pelo Espírito, não pela matéria.","a análise":"A decomposição e a análise das palavras, a não ser para buscar sua derivação metafísica, não é científica.","a analogia":"A Ciência de Deus e do homem não é sobrenatural, assim como não é sobrenatural a ciência da matemática, mas Analogia tendo em vista que a Ciência de Deus, do entre a Ciência e a óptica Espírito, se aparta do reino físico, como tem de se apartar, talvez alguns lhe neguem o direito ao nome de Ciência.","o anjo":"Esse anjo ou mensagem que vem de Deus, envolto em nuvem, prefigura a Ciência divina.","os anjos":"Quando sinceramente prestamos atenção a esses guias espirituais, eles permanecem conosco, e acolhemos anjos “sem o saber”.","a aparência":"Uma vez destruída pela Ciência divina, a falsa aparência que se apresenta aos sentidos corpóreos desaparece.","as aparências":"Eles mantêm cumplicidade secreta com o pecado, e de tais aparências exteriores Jesus diz que são “semelhantes aos sepulcros caiados...","o apóstolo":"O Apóstolo Paulo recomendou que os homens tivessem a mesma Mente que havia também em Cristo.","os apóstolos":"Por isso, eu me firmo, sem reservas, nos ensinamentos de Jesus, de seus apóstolos, dos profetas Fundamentos e no testemunho da Ciência da Mente.","o Apóstolo Paulo":"O Apóstolo Paulo recomendou que os homens tivessem a mesma Mente que havia também em Cristo.","o arrependimento":"Manter na consciência as más ações tende Arrependimento a destruir a capacidade de fazer o bem.","a arte":"A naturalidade Foi um método de cirurgia que estava além da deífica arte material, mas não um ato sobrenatural.","a árvore":"Deus disse da árvore do conhecimento, que produz o fruto do pecado, da doença e da morte: “No dia em que dela comeres, certamente morrerás”.","a árvore do conhecimento":"Deus disse da árvore do conhecimento, que produz o fruto do pecado, da doença e da morte: “No dia em que dela comeres, certamente morrerás”.","a árvore da vida":"E, expulso o homem, colocou querubins ao oriente do jardim do Éden e o refulgir de uma espada que se revolvia, para guardar o caminho da árvore da vida.","a ascensão":"Como recom pensa por sua fidelidade ele ia desaparecer para o senso material, naquela transformação que, a partir daí, foi chamada de ascensão.","a aspiração":"Se alcançasse a sublimidade de sua oração, Aspiração não haveria razão para comentário.","o ateísmo":"O ateísmo, o panteísmo, a teosofia e o agnosticismo se opõem tanto à Ciência Cristã como à religião Os opositores comum; mas isso não significa que o doente podem ser beneficiados profano ou ateu não possa ser curado pela Ciência Cristã.","a atenção":"É melhor impedir que a doença se no pensamento forme na mente mortal para que não apareça depois no corpo; mas para tanto é preciso atenção.","a atitude":"Daí a necessidade de teres tu mesmo a atitude mental correta para ensinar esta Ciência da cura.","o ato":"O ato de curar os doentes só por meio da Mente divina, ou seja, de expulsar o erro pela Verdade, mostra tua posição como Cientista Cristão.","a atração":"A atração entre qualidades inatas será perpétua somente na medida em que for pura e verdadeira, trazendo doces temporadas de renovação, como a volta da primavera.","o atributo":"Esses são Seus atributos, as manifestações eternas do infinito Princípio divino, o Amor.","os atributos":"Esses são Seus atributos, as manifestações eternas do infinito Princípio divino, o Amor.","a autoridade":"Essa compreensão expulsa o erro e cura o doente, e com ela podes falar “como quem tem autoridade”.","a balança":"O medo, que é um elemento de toda doença, tem de ser expulso para corrigir a balança a favor de Deus.","o barbarismo":"Os ídolos da civilização são muito mais destrutivos para a saúde e para a longevidade do que os ídolos do barbarismo.","a base":"Nessa base, será dada à Ciência Cristã a oportunidade de uma luta justa.","a batalha":"Deus exige perfeição, mas não antes que a batalha entre o Espírito e a carne tenha sido travada e a vitória ganha.","o batismo":"Ela traz o batismo do Espírito Santo, cujas chamas da Verdade consomem o erro, como foi profeticamente descrito por João Batista.","a beleza":"A beleza da santidade, a perfeição do existir, a glória imperecível — tudo isso é O testemunho Meu, pois Eu sou Deus.","o bem":"Iremos nós pedir ao espiritual Princípio divino de todo o bem que faça Seu próprio traba lho?","o bem-estar":"Uma doença descrita minuciosamente custa a muita gente o bem-estar de seus dias terrenos.","a bênção":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","as bênçãos":"Jesus deu a verdadeira ideia a respeito do existir, da qual resultam bênçãos infinitas para os mortais.","o benefício":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","a Bíblia":"Na Bíblia, Deus é representado dizendo: “Não Me poderás ver a face, porquanto homem Deus é invisível nenhum verá a Minha face e viverá”.","a blasfêmia":"This commission reported to the govern‐ ment as follows: “In regard to the existence and utility of animal mag‐ netism, we have come to the unanimous conclusions that there is no proof of the existence of the animal magnetic Capítulo Desmascarado o magnetismo animal Porque do coração procedem maus desígnios, homicídios, adultérios, prostituição, furtos, falsos testemunhos, blasfêmias.","a bondade":"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio.","a busca":"Contato Jesus sabia, mas os outros não, que fora a mente mental mortal, não a matéria, que o tocara em busca de auxílio.","a cabeça":"Já não deveria perguntar à cabeça, ao coração ou aos pulmões: Liberdade Que probabilidades de vida tem o homem?","o caminho":"Isso o caminho explica suas lutas no Getsêmani e no Calvário, e foi o que o habilitou a ser o mediador, a mostrar o caminho, entre Deus e os homens.","os caminhos":"Viajantes Nossos caminhos divergem desde o começo e divergentes temos pouca oportunidade de ajudar-nos mutuamente.","o campo":"Durante cinquenta anos, essa tradução trouxe cura e compreensão espiritual ao campo de nossa língua.","o câncer":"Então ele me contou que havia sido curado de câncer mediante tratamento pela Ciência Cristã.","o cântico":"A adoração pagã começou pelo culto aos músculos, mas a lei do Homero Sinai elevou o pensamento ao cântico de Davi.","o caos":"Teorias “Haja luz” é a exigência perpétua da Verdade impróprias sobre a criação e do Amor, que converte o caos em ordem e a desarmonia, em música das esferas.","a capacidade":"A capacidade de ceder um ao outro preservará frequentemente um pacto que, de outro modo, poderia se tornar insu portável.","o caráter":"Esse Cristo, o A demonstração caráter divino do homem Jesus, era sua natudo Cristo reza divina, a santidade que o animava.","a caridade":"As profissões de fé e as orações audíveis são em certo sentido como a caridade — pois encobrem uma “multidão de pecados”.","a carnalidade":"Daí a oposição do homem sensual à Ciência da Alma O erro da e o significado do trecho bíblico: “O pendor da carnalidade carne é inimizade contra Deus”.","a carne":"A Ciência Cristã revela que é indispensável vencer o mundo, a carne e o mal, para assim destruir todo o erro.","a casa":"Ao entrar na casa, A Mente cura encontrei o médico, que disse que o paciente doença do quadril estava agonizante.","o casamento":"Na ressurreição, nem casam, nem se dão em casamento; são, porém, como os anjos no céu.","a castidade":"To happify Ciência e Saúde O matrimônio A castidade é o cimento da civilização e do progresso.","o castigo":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","a causa":"O grande Professor conhecia tanto a causa como o efeito, sabia que a verdade comunica a verdade, mas nunca transmite o erro.","a causalidade":"Do começo ao fim, a causalidade física foi posta de lado por Jesus, que era a manifestação da ideia original de homem.","o cérebro":"O corpo mortal é apenas uma crença mortal errônea de haver O cérebro não mente na matéria.","a certeza":"Manterão a lei e a ordem, e aguardarão com alegria a certeza da perfeição suprema.","o ceticismo":"A ignorância humana a respeito da Mente e das energias restauradoras da Verdade ocasiona todo o ceticismo em relação à terapêutica e à teologia da Ciência Cristã.","o céu":"Para alcançar o céu, a harmonia do existir, temos de compreender o Princípio divino do existir.","os céus":"Essa crença tende a nublar nossa per­cepção do reino dos céus e do reinado da harmonia na Ciência do existir.","a ciência":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","a Ciência Cristã":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","a Ciência divina":"A supremo Ciência divina revela que é preciso haver suficiente sofri mento, ou antes ou depois da morte, para extinguir o amor ao pecado.","o cientista":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","o Cientista Cristão":"A maior ou menor capacidade de um Cientista Cristão para discernir cientificamente o pensamento depende de sua espiritualidade genuína.","a clareza":"Gradativamente essa mais elevada evidência acumulará ímpeto e clareza, até alcançar o ponto culminante da declaração e comprovação científica.","a consciência":"É a consciência espiritual, não a corporal, que se faz necessária.","a consciência humana":"Pela consciência humana, convence o mortal do engano que ele comete ao procurar meios materiais para conseguir a felicidade.","o conselho":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","a consequência":"Ciência e Saúde A oração Não podemos escapar à penalidade que é consequência do pecado.","o conforto":"Eddy fez com que a leitura das Escrituras se tornasse para mim uma fonte inesgotável de conforto.","a confusão":"Abandonada às decisões do senso material, a música está sujeita a ser mal compreendida e a perder-se na confusão.","o conhecimento":"A ciência física (assim chamada) é conhecimento humano — uma lei da mente mortal, uma crença cega, um Sansão despojado de sua força.","a coragem":"Pedro quis agredir os inimigos do Mestre, mas Jesus lho proibiu, repreendendo assim a ira e a coragem animal.","o coração":"Enquanto o coração está longe da Verdade e do Prayer Science and Health divine Truth and Love, we cannot conceal the ingrati‐ tude of barren lives.","os corações":"Revelar essa verdade foi a missão de nosso Mestre para com toda a humanidade, inclusive para com os corações que o rejeitaram.","o corpo":"O efeito bené fico de tal oração em favor dos doentes ocorre na mente humana, fazendo-a agir mais poderosamente sobre o corpo por meio da fé cega em Deus.","a corporalidade":"A Ciência Cristã influi na corporalidade inteira — ou seja, na mente e no corpo — e traz à tona a prova de que a Vida é contínua e harmoniosa.","os corpos":"Da ilusão que este último postulado implica, resulta a decomposição dos corpos mortais naquilo que se chama morte.","a cortesia":"Ele até disse que essa pobre mulher havia feito o que o rico anfitrião deixara de fazer — lavar e ungir os pés do seu con vidado, prova especial de cortesia oriental.","a crença":"Ajudou-os a elevarem-se a com o Cristo si mesmos e aos outros da lerdeza espiritual e da crença cega em Deus, até a percepção de possibilidades infinitas.","as crenças":"A Ciência é imortal e não está concatenada nem com as premissas nem com as conclusões das crenças mortais.","a crença humana":"Segundo a crença humana, o raio é violento e a cor rente elétrica é veloz; mas na Ciência Cristã, o deslocamento de um e o choque da outra se tornarão inofensivos.","o crente":"Nunca havia sido muito robusta, e alguns de meus males, segundo se supunha, eram hereditários e crônicos; com isso eu vinha me arrastando durante muitos anos penosos, crente de estar sob as leis da medicina e da hereditariedade.","o crescimento":"Esse é o grande ponto de partida para todo verdadeiro crescimento espiritual.","a criação":"Os mortais nunca poderão compreender a criação de Deus enquanto crerem que o homem seja criador.","a criança":"Uma criança sorve o mundo exterior pelos olhos e se deleita com o sorvo.","as crianças":"Nada indigno de ser perpetuado deve ser transmitido às crianças.","a criatura":"A Verdade faz uma nova criatura, na qual as coisas antigas passam; “eis que se fizeram novas”.","Cristo Jesus":"Como diz Paulo: “Há um só Deus e um só mediador entre Deus e os homens, Cristo Jesus, homem”.","Cristo":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","o Cristo":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","a cruz":"Na antiguidade, a cruz era o símbolo central da verdade, e assim é até hoje.","a cura":"Durante cinquenta anos, essa tradução trouxe cura e compreensão espiritual ao campo de nossa língua.","a cura divina":"Nenhuma escola antiga de filosofia, de medicina ou de teologia escolástica jamais ensinou ou demonstrou a cura divina da Ciência absoluta.","a dádiva":"Essa dádiva boa e perfeita me veio por meio do estudo cuidadoso e devoto da Ciência Cristã, como ela é revelada hoje ao mundo em Ciência e Saúde.","a decisão":"Antes de decidir que o corpo, a A importante matéria, sofre de um distúrbio, deve-se pergundecisão tar: “Quem és tu que contestas o Espírito?","a declaração":"Assim como nosso país, a Ciência Cristã tem sua Declaração de Independência.","o declínio":"A plenitude do homem é o eterno meio-dia desse sol, e essa plenitude nunca é diminuída por um sol em declínio.","o defeito":"É cristã preciso ter o espírito de nosso bendito Mestre para falar a alguém sobre seus defeitos, e assim correr o risco de ser criticado pelos homens por fazer o que é certo e beneficiar o gênero humano.","a defesa":"Faz tua defesa com uma Defesa convicção sincera da verdade e uma percepção cristã clara do efeito invariável, infalível e inquestionável da Ciência divina.","a definição":"A definição espiritualmente não científica da mente está baseada no testemunho dos sentidos físicos, que cria muitas mentes e diz que a mente é tanto humana como divina.","a deidade":"As escolas do saber puseram em moda a fé em drogas em vez de a fé na Deidade.","a demência":"Conheci só uma pessoa que acreditava em agamogênese; era solteira, de caráter amável, sofria de demência incipiente, e foi curada por um Cientista Cristão.","a demonstração":"Estar presente “com o Senhor” não é ter mero êxtase ou fé emocional, mas é a verdadeira demonstração e compreensão da Vida como é revelada na Ciência Cristã.","a denominação":"Outrora os judeus condenaram à morte o profeta da Galileia, o melhor cristão da terra, por ter falado e demons trado a verdade, ao passo que hoje, judeus e cristãos podem se unir em doutrina e denominação, na própria base das palavras e obras de Jesus.","o desânimo":"São coerentes as pessoas que, vigiando e orando, “correm e não se cansam, caminham e não se fatigam”, A paciência que alcançam rapidamente o bem e mantêm e a perfeição suprema sua posição, ou que o alcançam lentamente e não cedem ao desânimo.","a desarmonia":"É fútil dizer falsidades sobre a Ciência divina, a qual destrói toda a desarmonia, quando o fato é que Pretextos para podes demonstrar a veracidade da Ciência.","o descanso":"Nenhuma Descanso no exaustão resulta da ação dessa Mente, de acordo trabalho sagrado com a compreensão da Ciência divina.","a descoberta":"Essa descoberta corrobora a Ciência da Mente, porque ensina que a multiplicação de certos animais se pro cessa independentemente de condições sexuais.","a descrença":"A experiência cristã ensina a fé naquilo que é certo e a descrença naquilo que é errado.","o desejo":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","os desejos":"No silencioso santuário dos Invocação desejos fervorosos, temos de negar o pecado e eficaz declarar a totalidade de Deus.","o desenvolvimento":"Ciência e Saúde Prefácio x estima pelas recordações do desenvolvimento de um filho, e ela não gostaria que fossem modificadas.","o desespero":"Foi quando meu filho parecia estar no auge do sofrimento e eu me achava no mais profundo desespero que, pela primeira vez, ouvi falar da Ciência Cristã.","a destruição":"A destruição do erro não é de modo algum a destruição da Verdade ou da Vida, mas é o reconhecimento de ambas.","a determinação":"A determinação de manter o Espírito nas garras da matéria é o que persegue a Verdade e o Amor.","Deus":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","o Deus":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","o diabo":"Sua teologia ensina a crença Três classes em um Deus misterioso, sobrenatural, e em um de neófitos diabo natural todo-poderoso.","o diagnóstico":"Visto que a mente mortal tem de ser a causa da enfermidade, um diagnóstico físico da doença tende a produzir a doença.","a diferença":"Esses relatos diferentes ficam cada vez mais entrelaçados até o fim do capítulo doze, a partir do qual não se pode detectar uma diferença nítida entre um e outro.","a dificuldade":"A dificuldade é esta: geralmente não se compreende como uma determinada doença pode ser uma delusão, tanto quanto outra.","a dignidade":"Não são a reputação profissional e os honorários, em vez da dignidade das leis de Deus, o que muitos líderes pro­ curam?","o discernimento":"O que é o estudo dos clássicos, senão o discernimento das mentes de Homero e de Virgílio, de cuja existência pessoal podemos duvidar?","a disciplina":"As rajaAjuda e das gélidas da terra talvez desarraiguem as disciplina flores dos afetos e as espalhem aos ventos; mas essa ruptura dos laços carnais serve para unir o pensamento mais estreitamente a Deus, pois o Amor sustenta o coração em luta, até que este cesse de suspirar pelo mundo e comece a estender as asas rumo ao céu.","o discípulo":"Se o discípulo está se adiantando espiritualmente, é porque está se esforçando por entrar no reino espiritual.","os discípulos":"Não jejuava, como faziam os discípulos de João Batista; no entanto, nunca viveu um homem tão afastado de vícios e paixões, como o Nazareno.","a discórdia":"Por isso, anos mais tarde, quando a Ciência Cristã foi apresentada em minha casa, encontrou em mim um homem que não orava, não ia à igreja e não tinha Deus; encontrou um lar de discórdia onde não havia conhecimento das coisas espirituais e onde não se pensava nelas.","a distinção":"Como é que se pode fazer distinção entre ideias verdadeiras e ilusões?","a divisão":"A perpe tuação das espécies da flora por meio de brotos ou pela divisão de células é evidente, porém refuto a crença de que a agamogênese se aplique à espécie humana.","a doença":"Ele veio ensinar e mostrar divina aos homens como destruir o pecado, a doença e a morte.","as doenças":"Nunca pensarias que os emplastros sejam melhores do que a Mente governante para prevenir doenças pulmonares, se compreendesses a Ciência do existir.","a doença mental":"Deverias tratar a doença mentalmente da mesma forma como tratarias o pecado, com a diferença de que não deves dizer ao paciente que ele está doente, nem dar Tratamento nomes às doenças, pois isso aumentaria o medo, metafísico que é a base da enfermidade, e imprimiria mais profundamente o quadro mental errôneo.","os doentes":"O mero pedido de que Deus cure os doentes não tem poder para Oração pelos tornar a presença divina, que está sempre ao doentes nosso alcance, mais acessível do que ela já é.","o dogma":"Tais admissões nos lançam inteiramente nas trevas e no dogma.","os dogmas":"As seitas, que sofreram os açoites de seus antecessores, açoitam, por sua vez, aqueles que estão mais adiantados do que os dogmas.","o dom":"Paulo, foi “o dom da graça de Deus a mim concedida segundo a força operante do Seu poder”.","o domínio":"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio.","a dor":"O pensa dor adiantado que é cristão devoto, ao perceber Pecado e o alcance e a tendência da cura cristã e da Ciência penalidade dessa cura, lhes dará apoio.","as dores":"Agora é a hora de desaparecer aquilo a que se chamam dores e prazeres materiais, pois ambos são irreais, porque impossíveis na Ciência.","a doutrina":"Por fim, não rendeu homenagem às formas de doutrina nem às teorias dos homens, mas agiu e falou segundo era motivado, não por espíritos, mas pelo Espírito.","as doutrinas":"A Verdade, independente de doutrinas e sistemas consagrados pelo tempo, bate ao portal da humanidade.","a dúvida":"As ideias cristãs, sem dúvida, apresentam aquilo que as teorias humanas excluem — o A fisiologia Princípio da harmonia do homem.","a educação":"Por não conhecermos os direitos que Deus nos deu, submetemo-nos a decretos injustos, e os conceitos errados da Ignorância quanto educação impõem essa escravidão.","o efeito":"O efeito bené fico de tal oração em favor dos doentes ocorre na mente humana, fazendo-a agir mais poderosamente sobre o corpo por meio da fé cega em Deus.","o ego":"A oração que reforma o pecador e cura o doente é uma fé absoluta em que tudo é possível a Deus — uma compreensão espiritual acerca dEle, um amor isento de ego.","a eletricidade":"A eletricidade não é um fluido vital, mas sim a forma menos material da consciência ilusória — o estado material sem mente, que não forma elo algum entre a Eletricidade matéria e a Mente, e que se autodestrói.","a elevação":"De algum modo, mais cedo ou mais tarde, todos terão de se ele­ var acima da materialidade, e o sofrimento é com frequência o agente divino nessa elevação.","a eloquência":"A eloquência repete o eco das modulações da Verdade e do Amor.","a emoção":"É a sensação física, e não a Alma, que produz êxtase e emoção materiais.","a energia":"Sintamos a energia divina do Espírito, que nos traz a uma vida nova e que não reconhece nenhum poder, Identidade mortal ou material, capaz de praticar des­ renovada truição.","a energia divina":"Sintamos a energia divina do Espírito, que nos traz a uma vida nova e que não reconhece nenhum poder, Identidade mortal ou material, capaz de praticar des­ renovada truição.","a enfermidade":"O solo da enfermidade é a mente mortal, e terás uma colheita de doenças, abundante ou escassa, de acordo com as sementes do medo.","o engano":"Ignorar a Deus, como se Ele fosse de pouca ajuda na Saúde por se doença, é um engano.","o ensinamento":"Certo dia, porém, andando na rua, tive a felicidade de visitar a casa de uma Cientista Cristã, e lá me foi explicado o ensinamento da Ciência Cristã.","os ensinamentos":"Por isso, eu me firmo, sem reservas, nos ensinamentos de Jesus, de seus apóstolos, dos profetas Fundamentos e no testemunho da Ciência da Mente.","o entendimento":"A demonstração dos fatos da Alma, à maneira de Jesus, transforma as sombrias visões do senso material em harmonia e Entendimento imortalidade.","o equilíbrio":"Pertencem ao Princípio divino e sustentam o equilíbrio daquela força-pensamento que lançou a Toda a força terra em sua órbita e disse à onda orgulhosa: é mental “Até aqui virás, e não mais”.","a era":"Por fim, não rendeu homenagem às formas de doutrina nem às teorias dos homens, mas agiu e falou segundo era motivado, não por espíritos, mas pelo Espírito.","o erro":"Ciência e Saúde A oração materializa a adoração estorva o desenvolvimento espiritual do homem e o impede de demonstrar seu poder sobre o erro.","os erros":"Eles são os erros que pressupõem a ausência da Verdade, da Vida e do Amor.","a Escritura":"As Escrituras dizem que, se negarmos a Cristo, “ele, por sua vez, nos negará”.","as escrituras":"As Escrituras dizem que, se negarmos a Cristo, “ele, por sua vez, nos negará”.","a escuridão":"O sono é escuridão, mas a ordem criadora de Deus foi: “Haja luz”.","a esfera":"Não estamos no estado deles, nem estão eles na esfera mental em que nós nos encontramos.","a esperança":"Calcular nossa perspectiva de vida, não científica baseando-nos na matéria, seria infringir a lei espiritual e guiar erradamente a esperança humana.","o Espírito":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","o Espírito Santo":"A doutrina rabínica dizia: “Aquele que aceita uma só doutrina, firme na fé, nesse habita o Espírito Santo”.","a espiritualidade":"A maior ou menor capacidade de um Cientista Cristão para discernir cientificamente o pensamento depende de sua espiritualidade genuína.","a espiritualização":"O Amor há de finalmente assinalar a hora do aparecimento da harmonia, e a espiritualização virá a seguir, porque o Amor é o Espírito.","a essência":"O conhecimento do mal nunca foi a essência da natureza divina nem da identidade do homem.","a estabilidade":"Sem ela não há estabilidade na sociedade, e sem ela não se pode alcançar a Ciência da Vida.","o estado":"Não permitam os mortais desrespeito à lei, pois isso poderia levar a um estado social pior do que o existente.","a eternidade":"Ele não atravessa as barreiras do tempo para entrar na vasta eternidade da Vida, mas coexiste com Deus e o universo.","a ética":"A filosofia humana, a ética e a superstição não oferecem um Princípio divino demonstráA chave vel, pelo qual os mortais possam se libertar do do reino pecado; contudo, libertar-se do pecado é o que a Bíblia exige.","o evangelho":"Não me enviou Cristo para batizar, mas para pregar o evangelho.","a evidência":"A evipara toda doença dência do poder sanador da Mente divina e do seu controle absoluto é para mim tão certa como a evidência de minha própria existência.","a evolução":"Só a evolução espiritual é digna da aplicação do poder divino.","a existência":"A semente que germinou tem nova forma e novo estado de existência.","a expiação":"O homem não pode se elevar acima do Amor divino e assim realizar a expiação em favor de si mesmo.","a expressão":"A expressão Ciência Cristã foi introduzida pela autora para designar o sistema científico de cura divina.","a febre":"Calafrios e calor são frequentemente a forma pela qual a febre se manifesta.","a felicidade":"A felicidade do afeto é espiritual, nascida da Verdade e do Amor.","o fenômeno":"Esse fenômeno mostra apenas que as crenças da mente mortal foram soltas.","os fenômenos":"Os ossos são apenas fenômenos da mente dos mortais.","a fidelidade":"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio.","a filosofia":"Nenhuma escola antiga de filosofia, de medicina ou de teologia escolástica jamais ensinou ou demonstrou a cura divina da Ciência absoluta.","o fim":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","a força":"Temos força na medida de nossa compreensão da verdade, e nossa força não diminui quando afirmamos a verdade.","as forças":"A Ciência Cristã revela que a Verdade e o Amor são as forças motrizes do homem.","a forma":"A Alma é sinônimo do Espírito, Deus, o Princípio infinito, criador e governante, fora da forma finita, e que as formas só refletem.","a formação":"São necessárias afinidades de gostos, motivos e aspirações para a formação de um companheirismo feliz e permanente.","a fraternidade":"A fraternidade Quando os preceitos divinos são compreendiuniversal dos, desdobram o fundamento da fraternidade na qual uma mente não está em guerra com outra, mas todos têm um só Espírito, Deus, uma só fonte inteligente, de acordo com o mandamento bíblico: “Que haja em vós a mesma Mente que houve também em Cristo Jesus”*.","a fraude":"Quando se alcança o real, que é anunciado pela Ciência, já não há insegurança na alegria e a esperança já não é uma fraude.","o fruto":"Pois vos digo que, de agora em diante, não mais beberei do fruto da videira, até que venha o reino de Deus.","os frutos":"Se nossas espe­ ranças e nossos afetos são espirituais, é de cima que eles vêm, não de baixo, e trazem, como outrora, os frutos do Espírito.","o fundamento":"A supremacia do Espírito foi o fundamento sobre o qual Jesus edificou.","os fundamentos":"Se os fundamentos do afeto humano forem compatíveis com o progresso, serão sólidos e duráveis.","o futuro":"Tive tantas provas da sabedoria e da bondade de Deus, que sinto muita gratidão ao reconhecer que meu futuro está em Suas mãos e que todas as coisas acabam tendo a melhor solução.","a generosidade":"Os cristãos se regozijam na beleza e generosidade secretas, ocultas ao mundo, mas conhecidas de Deus.","a glória":"O senso imanente do poder da Mente realça a glória da Mente.","o gosto":"Certa vez, alguém disse à descobridora da Ciência Cristã: “Gosto de suas explicações sobre a verdade, mas não compreendo o que diz sobre o erro”.","o governo":"Escapar ao castigo não está de acordo com o governo de Deus, pois a justiça está a serviço da misericórdia.","a graça":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","a grandeza":"When mortals once admit that Ciência e Saúde Reconciliação e Eucaristia Com mansidão nosso Mestre enfrentou o escárnio à sua grandeza não reconhecida.","a gratidão":"Depois da cura eu quase nem me lembrava de comer ou dormir, e meu coração se encheu de gratidão, pois sabia que havia tocado a orla da veste de Cristo.","o guia":"Ela é uma declaração divina — o Consolador, o Confortador, que guia a toda a verdade.","a harmonia":"Para alcançar o céu, a harmonia do existir, temos de compreender o Princípio divino do existir.","a herança":"Teria ele perdido a magnífica herança do homem e o mandato de Deus, isto é, o domínio sobre toda a terra?","a hipocrisia":"A falsidade, a inveja, a hipocrisia, a maldade, o ódio, a vingança, e assim por diante, levam embora os tesouros da Verdade.","a hipótese":"Nenhuma hipótese quanto à existência de outro poder deveria interpor alguma dúvida ou temor e assim estorvar a demonstração da Ciência Cristã.","as hipóteses":"As hipóteses materialistas desafiam a metafísica para um combate decisivo.","a história":"A história autêntica de Kaspar Hauser dá um indício pertinente quanto à fragilidade e deficiência da mente mortal.","o homem":"A sabedoria do homem não é suficiente para autorizá-lo a dar conselhos a Deus.","o homem mortal":"O homem mortal é o antípoda do homem imortal, na origem, na existência e em sua relação com Deus.","o homem verdadeiro":"Isso demonstra que na Ciência Cristã o homem verdadeiro é governado por Deus — pelo bem, não pelo mal — e portanto não é mortal, mas é imortal.","os homens":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","a humildade":"Como no tempo de Jesus, assim também hoje é preciso expulsar do templo, a chicotadas, a tirania e o orgulho, e dar boa acolhida à humildade e à Ciência divina.","a ignorância":"As angústias do abandono e as bordoadas da ignorância fanática o feriram dolorosa mente.","a igreja":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","as igrejas":"Os professores das escolas e os leitores das igrejas devem ser escolhidos levando-se em conta sua moral, tanto quanto sua cultura e leitura correta.","a iluminação":"Ela é a iluminação da compreensão espiritual, que demonstra a capacidade da Alma, não do senso material.","a ilusão":"Não é pessoa, nem lugar, nem coisa, mas é simplesmente uma crença, uma ilusão do senso material.","as ilusões":"Como é que se pode fazer distinção entre ideias verdadeiras e ilusões?","a imagem":"O Amor e a Verdade não estão em guerra com a imagem e semelhança de Deus.","as imagens":"Disso depreendes que essas também são imagens que estão na mente mortal e dela derivam, e que simulam a mente, a vida e a inteligência.","a imaginação":"Por trás dessa conjetura não existe algo de real, assim como não há nada de real por trás do pensamento do escultor, quando este cinzela a “Estátua da Liberdade”, dando corpo a sua concepção de uma qualidade ou condição que não se vê e que não existe como entidade física, a não ser na imaginação e nas “câmaras pintadas de imagens” do próprio artista.","a imortalidade":"A Verdade destrói a mortalidade e traz à luz a imortalidade.","a imperfeição":"Lembra-te de que a perfeição do homem é real e inquestionável, ao passo que a imperfeição é condenável, irreal, e não é produzida pelo Amor divino.","a impossibilidade":"A Mente infinita em uma forma finita é uma absoluta impossibilidade.","a incapacidade":"A s críticas severas a este livro condenariam ao esquecimento a verdade que está levantando, da incapacidade para a força, milhares de pessoas, e que as está elevando de um Cristianismo teórico para um Cristianismo prático.","a individualidade":"O homem A individualidade espiritual do homem nunca é vinculado ao Espírito está sujeita a errar.","a inércia":"A Mente é a fonte de todo o movimento, e não existe inércia que lhe retarde ou impeça a ação perpétua e harmo niosa.","a infância":"A Ciência Cristã também me curou de inflamação crônica na garganta e de nevralgia, que me haviam feito sofrer desde a infância.","o inferno":"aquele que pode fazer perecer no inferno tanto a alma como o corpo”, disse Jesus.","o infinito":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","a infinitude":"Não há união Deus fez tudo o que foi feito, e a Mente signi­ de opostos fica Deus — a infinitude, não a finitude.","a influência":"Qualquer influência que ponhas do Crença do lado da matéria, estás tirando da Mente que, de lado errado outro modo, teria preponderância sobre tudo mais.","a ingratidão":"Whatever mate‐ Ciência e Saúde A oração Amor divinos, não podemos ocultar a ingratidão de uma vida estéril.","o inimigo":"Todo erro humano é seu próprio inimigo e opera contra si mesmo; nada faz na direção A mente mortal certa, e muito faz na direção errada.","os inimigos":"Abençoa seus inimigos, cura os doentes, expulsa o erro, levanta os que estão mortos nas transgressões e pecados, e prega o evangelho aos pobres, os mansos de coração.","a inimizade":"Daí a oposição do homem sensual à Ciência da Alma O erro da e o significado do trecho bíblico: “O pendor da carnalidade carne é inimizade contra Deus”.","a iniquidade":"A cegueira e a presunção de uma retidão pessoal se aferram Esquivar-se à fortemente à iniquidade.","a injustiça":"A injustiça que os primeiros tempos da era cristã fizeram a Jesus talvez não tenha sido maior do que a injustiça que os séculos posteriores infligiram ao Cristo que cura, à ideia espiritual do existir.","a inocência":"A ideia espiritual do Amor; imolação do ego; inocência e pureza; sacrifício.","a insanidade":"O pecado escapa O pecado é uma a essa classificação só porque seu método forma de insanidade de loucura está de acordo com a crença mortal comum.","a inspiração":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","a instituição":"MARY BAKER EDDY Ciência e Saúde Prefácio xii essa instituição com finalidades médicas.","as instituições":"Depois de 1883, já não se concederam alvarás a Cientistas Cristãos para tais instituições, e até aquela data a sua Faculdade fora a única desse gênero que havia sido estabelecida nos Estados Unidos da América, onde se introduziu pela primeira vez a Ciência Cristã.","a instrução":"Se eles cedem a essa influência, é porque sua crença não recebeu a devida instrução da compreensão espiritual.","a integridade":"O exercício da vontade produz um é vencida estado hipnótico, prejudicial à saúde e à integridade do pensamento.","a inteligência":"Sua origem não está no instinto bruto, como a origem dos morOrigem tais, e o homem não passa por condições mateespiritual riais antes de alcançar a inteligência.","a intenção":"A presente revisão procurou levar em consideração essa necessidade, com a finalidade de dar uma visão mais clara da metafísica da Ciência Cristã, conforme a intenção original da Autora.","a intuição":"Alcançarás a Ciência perfeita da cura, quando O valor fores capaz de ler a mente humana dessa maneira da intuição e de discernir o erro que queres destruir.","a ira":"Que a ira de Deus tenha se descarregado sobre Seu Filho bem-amado, não é divinamente natural.","a irmã":"Pode ser que isto ajude a alguma irmã que leia o Journal para procurar uma demonstração desse gênero, como eu fiz antes de nascer meu filho.","o irmão":"Invejoso da oferta de seu irmão, Caim trama contra a vida de Abel, em vez de fazer de sua própria oferta um tributo mais digno do Altíssimo.","o jardim":"Tomou, pois, o Senhor Deus [Jeová] ao homem e o colocou no jardim do Éden para o cultivar e o guardar.","Jeová":"Nesse Jeová, uma nome Jeová, a verdadeira ideia a respeito de deidade tribal Deus parece quase perdida.","o Jeová":"Nesse Jeová, uma nome Jeová, a verdadeira ideia a respeito de deidade tribal Deus parece quase perdida.","a Jerusalém":"O A cidade arquiteto e edificador dessa Nova Jerusalém é quadrangular Deus, como lemos na epístola aos Hebreus; e é uma “cidade que tem fundamentos”.","Jesus":"Se formos suficientemente bons para nos beneficiar do cálice das aflições terrenas de Jesus, Deus nos sustentará nessas aflições.","o Jesus":"Se formos suficientemente bons para nos beneficiar do cálice das aflições terrenas de Jesus, Deus nos sustentará nessas aflições.","João":"Em outras palavras: Dizei a João no que consiste a demonstração do poder divino, e de imediato ele perceberá que Deus é o poder na obra messiânica.","a jornada":"O autor do Apocalipse vê também outra cena, apropriada para confortar o peregrino cansado, que na sua jornada caminha “sempre montanha acima”.","o júbilo":"Um cântico mais Cântico alto, o mais doce que já tenha alcançado o céu, de júbilo agora se eleva mais claro e chega mais perto do grande coração do Cristo; porque o acusador não está lá, e o Amor faz ressoar sua melodia primordial e eterna.","o judaísmo":"O judaísmo era a antítese do Cristianismo, porque o judaísmo engendrou uma forma limitada de religião nacional ou tribal.","a justiça":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","a justiça divina":"Forças As manifestações do mal, que falsamente se falsas apresentam como justiça divina, são denominadas nas Escrituras “a ira do Senhor”.","a justificação":"Do we not Ciência e Saúde A oração A oração cheia de palavras pode proporcionar um senso tácito de justificação do ego, embora faça do pecador um hipócrita.","a juventude":"Desiludida do amor, na juventude, ela perdeu a razão e toda a noção de tempo.","a lealdade":"Não admite reservas para nenhuma lealdade menor.","a lei":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","a lei da matéria":"Por isso, a verdade não é humana, nem é uma lei da matéria, pois a matéria não é legisladora.","as leis":"O termo Ciência, bem compreendido, refere-se unicamente às leis de Deus e ao Seu governo do universo, que inclui o homem.","a liberdade":"Já não deveria perguntar à cabeça, ao coração ou aos pulmões: Liberdade Que probabilidades de vida tem o homem?","a libertação":"Fiquei completamente curada, e a libertação do meu pensamento se manifesta em uma vida de atividade útil, em vez de na escravidão à irre­ mediável invalidez e sofrimento.","a lição":"Sem essa lição, perdemos de vista o Pai perfeito, ou seja, o Princípio divino do homem.","as lições":"Não deveríamos nós beber o cálice que nosso Pai nos deu, e aprender as lições que Ele ensina?","a lógica":"Assim, na Ciência Cristã, não existem discordâncias nem contradições, porque sua lógica é tão harmoniosa quanto o raciocínio de um silogismo formulado com precisão, ou de uma soma bem computada em aritmética.","Logos":"Não há nada no Espírito de que a matéria pudesse ser feita, pois, A única como a Bíblia declara, sem o Logos, o Aeon ou substância Verbo [a Palavra] de Deus, “nada do que foi feito se fez”.","a loucura":"O pecado escapa O pecado é uma a essa classificação só porque seu método forma de insanidade de loucura está de acordo com a crença mortal comum.","o louvor":"Deus não é movido por expressões de louvor a fazer mais do que já fez, nem pode o infinito fazer menos do que propi ciar todo o bem, porque Ele é sabedoria e Amor A Deidade imutáveis.","a lua":"mental “Sin” [palavra que em inglês significa “pecado”] era o deus da lua para os assírios.","o lugar":"O lar é o lugar mais querido da terra, e deveria ser o centro, mas não o limite, dos afetos.","a luta":"Nessa base, será dada à Ciência Cristã a oportunidade de uma luta justa.","a luz":"Todavia, pelo estudo contínuo do livro, vieram naturalmente à luz pontos importantes em que a tradução precisava ser melhorada.","a mãe":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","a magia":"Qualquer benefício aparente que derive dele é proporcional à fé que se tenha na magia esotérica.","o magnetismo":"Em nenhum caso pode o efeito do magnetismo animal, recentemente chamado hipnotismo, ser outra coisa senão o efeito da ilusão.","o mal":"A Ciência Cristã revela que é indispensável vencer o mundo, a carne e o mal, para assim destruir todo o erro.","a maldade":"A falsidade, a inveja, a hipocrisia, a maldade, o ódio, a vingança, e assim por diante, levam embora os tesouros da Verdade.","a maldição":"As O homicídio traz crenças materiais matariam a ideia espiritual maldição sempre e onde quer que esta apareça.","a maneira":"Alcançarás a Ciência perfeita da cura, quando O valor fores capaz de ler a mente humana dessa maneira da intuição e de discernir o erro que queres destruir.","a manifestação":"A Ciência Cristã não associa nenhuma natureza física nem significância física ao Ser A linguagem Supremo ou à Sua manifestação; só os mortais espiritual fazem isso.","a mansidão":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","a mão":"A sensualidade paralisa a mão direita e faz com que a esquerda deixe escapar o que é divino.","as mãos":"O orgulho e o medo não estão capacitados para carregar o estandarte da Verdade, e Deus jamais o colocará em tais mãos.","o mar":"Como é que foram multiplicados os pães e os peixes nas margens do mar da Galileia — e nesse caso também, sem farinha nem células de onde pudessem vir o pão e o peixe?","a maravilha":"Daí a maravilha eterna — de que o espaço infinito é povoado com as ideias de Deus, as quais O refletem em incontáveis formas espirituais.","os mártires":"“O sangue dos mártires é a semente da Igreja.” Os mortais procuram em vão matar a Verdade pela espada ou pela É inevitável fogueira, mas o erro cai apenas pela espada do haver mártires Espírito.","o martírio":"Os que causaram o Emulação martírio desse homem reto lhe teriam, com completa prazer, transformado a carreira sagrada em uma plataforma doutrinária mutilada.","a matéria":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","a materialidade":"É a mente mortal, não a matéria, que traz aos doentes todo benefício que eles pareçam receber da materialidade.","o materialismo":"O contentamento com o passado e as frias convenções do materialismo estão desmoronando.","a maternidade":"O Espírito alimenta e veste devidamente cada objeto, à medida que aparece na ordem da criação espiritual, expres sando assim ternamente a paternidade e a maternidade de Deus.","a mediação":"A mediação de Cristo reconcilia o homem com Deus, não Deus com o homem; pois o Princípio divino do Cristo é Deus, e como pode Deus Se reconciliar consigo mesmo?","o mediador":"Isso o caminho explica suas lutas no Getsêmani e no Calvário, e foi o que o habilitou a ser o mediador, a mostrar o caminho, entre Deus e os homens.","o medicamento":"Visto que Deus é Tudo-em-tudo, Ele precedência fez o medicamento; mas esse medicamento era a Mente.","a medicina":"Nenhuma escola antiga de filosofia, de medicina ou de teologia escolástica jamais ensinou ou demonstrou a cura divina da Ciência absoluta.","o médico":"O médico comum crê na sua receita, e o farmacêutico crê no poder de suas drogas para salvar a Equívocos vida de um homem.","os médicos":"Os esquimós, com seus encantamentos, restabelecem a saúde tão conscientemente como os médicos civilizados a restabelecem com seus métodos mais estudados.","o medo":"O orgulho e o medo não estão capacitados para carregar o estandarte da Verdade, e Deus jamais o colocará em tais mãos.","a memória":"Eles as copiam ou as reproduzem, mesmo quando tais imagens tenham se perdido para a memória da mente na qual é possível descobri-las.","a mensagem":"Quando a crença errônea é corrigida, da crença a Verdade envia uma mensagem de saúde ao corpo inteiro.","a mente":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","a Mente divina":"Os pensamentos não proferidos não são desconhecidos para a Mente divina.","a mente humana":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","a mente mortal":"Disso depreendes que essas também são imagens que estão na mente mortal e dela derivam, e que simulam a mente, a vida e a inteligência.","a mentira":"Preci­ samos fazer calar essa mentira do senso material com a verdade do senso espiritual.","a metafísica":"As proposições fundamentais da metafísica divina se resumem nas quatro proposições seguintes, que para mim são evidentes por si mesmas.","o metafísico":"Jesus curava a doença e o pecado pelo mesmo e único sistema metafísico.","o milagre":"O milagre não introduz nenhuma desordem, mas desdobra a ordem original, estabelecendo a Ciência da lei imutável de Deus.","os milagres":"Moisés provou o poder da Mente por meio daquilo que Prodígios os homens chamavam milagres; provaram-no e reformas também Josué, Elias e Eliseu.","a misericórdia":"Escapar ao castigo não está de acordo com o governo de Deus, pois a justiça está a serviço da misericórdia.","a missão":"Sua missão O divino Um foi tanto individual como coletiva.","o mistério":"Aliás, seus efei­tos O divino éticos e físicos estão indissoluvelmente ligados não é mistério uns aos outros.","a moral":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","a moralidade":"“Pregai o evangelho a toda A moralidade criatura.” Dize a verdade a toda forma de erro.","a morte":"Ele veio ensinar e mostrar divina aos homens como destruir o pecado, a doença e a morte.","o movimento":"O movimento e a posição da terra são sustentados só pela Mente.","a mudança":"Os outros mortais também não efetuam a mudança do erro para a verdade com um simples salto.","o mundo":"Uma criança sorve o mundo exterior pelos olhos e se deleita com o sorvo.","a nação":"e Moisés Moisés fez progredir uma nação até a adoração de Deus em Espírito, em vez de na matéria, e mostrou as grandiosas capacidades humanas do existir, outorgadas pela Mente imortal.","o nada":"Nada indigno de ser perpetuado deve ser transmitido às crianças.","a natureza":"O bem nos afetos humanos tem de predominar sobre o mal, e a natureza espiritual, sobre aquilo que é animal, senão a felicidade jamais será alcançada.","a natureza divina":"A Ciência explica que a existência, separada da natureza divina, é impossível.","a necessidade":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","o nome":"Na Ciência Cristã, a palavra Espírito, como nome próprio, é o nome Derivados da do Ser Supremo.","os nomes":"O Espírito, a Sinônimos Vida, a Verdade, o Amor são um só — e são os divinos nomes bíblicos para Deus.","a obediência":"A obediência é garantida somente pela compreensão correta a respeito dEle, e conhecê-Lo corretamente é a Vida eterna.","o objetivo":"Nosso objetivo deve ser torná-las compreendidas espiritualmente, pois só com essa compreensão se pode alcançar a verdade.","a obra":"Em outras palavras: Dizei a João no que consiste a demonstração do poder divino, e de imediato ele perceberá que Deus é o poder na obra messiânica.","as obras":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","a oração":"Por isso, vos digo que tudo quanto em oração pedirdes, crede que recebestes, e será assim convosco.","a ordem":"Manterão a lei e a ordem, e aguardarão com alegria a certeza da perfeição suprema.","a origem":"Sua origem não está no instinto bruto, como a origem dos morOrigem tais, e o homem não passa por condições mateespiritual riais antes de alcançar a inteligência.","a originalidade":"Sua originalidade era surpreendente e derrubou minhas opiniões preconcebidas sobre Deus, sobre o homem e sobre a criação.","o osso":"O médico acabava de sondar a úlcera do quadril e disse que o osso tinha uma cárie de várias polegadas.","os ossos":"Modifica A Verdade secreções, elimina fluidos nocivos, dissolve é alterante tumores, relaxa músculos enrijecidos e restaura a saúde dos ossos.","a paciência":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","a paciente":"Poderiam ser cita dos milhares de casos em que a saúde foi restabelecida graças à mudança da forma de pensar do paciente quanto à morte.","o paciente":"Poderiam ser cita dos milhares de casos em que a saúde foi restabelecida graças à mudança da forma de pensar do paciente quanto à morte.","os pacientes":"É tolice declarar que manipulas fisicamente os pacientes, mas que não dás importância à manipulação.","o pai":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","o Pai-Mãe":"A Mente é o Princípio divino, o Amor, e não pode produzir nada dessemelhante do eterno Pai-Mãe, Deus.","os pais":"Fui criada por bons e amorosos pais cristãos, e por mais de vinte anos fui membro de uma igreja tradicional, mas nunca me senti satisfeita.","a paixão":"Então a Alma se regozijará naquilo que lhe pertence, naquilo em que a paixão não tem parte.","a palavra":"Aqui a palavra mãos é usada metaforicamente, como a palavra destra é usada no texto “A destra do Senhor se eleva”.","as palavras":"Do we not Ciência e Saúde A oração A oração cheia de palavras pode proporcionar um senso tácito de justificação do ego, embora faça do pecador um hipócrita.","a parábola":"Não será a moral dessa parábola uma profecia que prediz a segunda manifestação do Cristo, a Verdade, na carne, manifestação essa encoberta em santo sigilo ao mundo visível?","o paraíso":"Esta Ciência do existir está presente não somente no além, naquilo que os homens chamam Paraíso, mas aqui e agora; essa Ciência é o grandioso fato do existir, para o tempo e para a eternidade.","a paz":"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio.","o pecado":"A oração não deve ser utilizada como confessionário para cancelar o pecado.","o pecador":"A oração que reforma o pecador e cura o doente é uma fé absoluta em que tudo é possível a Deus — uma compreensão espiritual acerca dEle, um amor isento de ego.","os pecadores":"Ele repreendia os pecadores severamente e com firmeza, porque era amigo deles; daí o cálice que bebeu.","os pecados":"Jesus sofreu por nossos pecados, não para anular a sentença divina aplicada ao pecado de alguém, mas porque o pecado acarreta inevitável sofrimento.","a pedra":"A Verdade é a rocha eterna, a pedra angular, mas “aquele sobre quem ela cair ficará reduzido a pó”.","o pensamento":"Mais tarde, a língua dá voz ao pensamento mais definido, embora ainda imperfeitamente.","os pensamentos":"Um livro apresenta pensamentos novos, mas não pode fazer com que sejam rapidamente compreendidos.","a percepção":"Ajudou-os a elevarem-se a com o Cristo si mesmos e aos outros da lerdeza espiritual e da crença cega em Deus, até a percepção de possibilidades infinitas.","a perda":"Há mais Ciência no exercício perpétuo das faculdades da Mente, do que na sua perda.","a perfeição":"Manterão a lei e a ordem, e aguardarão com alegria a certeza da perfeição suprema.","a permanência":"Nada pode ocultar deles a harmonia de todas as coisas ou o poder e a permanência da Verdade.","a perseguição":"Apesar da perseguição que isso lhe causou, usava seu poder divino para salvar os homens tanto corporal como espiritualmente.","a perseverança":"A perseverança na leitura do livro geralmente produz a cura completa de tais casos.","a perturbação":"Para eliminar o erro que produz a perturbação, tens de acalmar e instruir a mente mortal com a Verdade imortal.","a pesquisa":"Com o mesmo vigor, as asas céleres do pensamento vêm se elevando ao reino do real, até a causa espiritual daquelas Desafio pequenas coisas que dão impulso à pesquisa.","a pessoa":"Não é pessoa, nem lugar, nem coisa, mas é simplesmente uma crença, uma ilusão do senso material.","as pessoas":"Adver­ tir as pessoas sobre a possibilidade de morrer é Pensamentos um erro que contribui para matar de pavor sobre a morte aqueles que não sabem que a Vida é Deus.","o poder":"Ciência e Saúde A oração materializa a adoração estorva o desenvolvimento espiritual do homem e o impede de demonstrar seu poder sobre o erro.","o poder de cura":"Sem esse afeto espiritual, falta-lhe a fé na Mente divina e ele não tem aquele reconhecimento do Amor infinito, o único que outorga o poder de cura.","o poder divino":"Em outras palavras: Dizei a João no que consiste a demonstração do poder divino, e de imediato ele perceberá que Deus é o poder na obra messiânica.","os poderes":"Essa crença tende a sustentar dois poderes opostos, em vez de insistir unicamente na autoridade da Verdade.","a política":"Não se deveria exigir que o homem participasse de todos os aborrecimentos e cuidados da economia doméstica, nem se deveria esperar que a mulher entendesse de economia política.","a pomba":"Pensa nisso, caro leitor, pois há de arrancar o “pano de saco” dos teus olhos, e verás descer sobre ti a pomba de voo suave.","o ponto de vista":"A Ciência é espiritual Cristã adota o ponto de vista exatamente oposto.","o princípio":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","o Princípio divino":"Iremos nós pedir ao espiritual Princípio divino de todo o bem que faça Seu próprio traba lho?","os princípios":"O ponto principal dessa plataforma é a doutrina de que a Ciência Charlatanismo tenha dois princípios associados, um bom e mental outro mau — um espiritual e o outro material — e que esses dois possam atuar simultaneamente sobre os doentes.","a profecia":"Não será a moral dessa parábola uma profecia que prediz a segunda manifestação do Cristo, a Verdade, na carne, manifestação essa encoberta em santo sigilo ao mundo visível?","o profeta":"O profeta de hoje avista no horizonte mental os sinais destes tempos, o reaparecimento do Cristianismo que cura os doentes e destrói o erro, e nenhum outro Presságios sinal será dado.","os profetas":"Por isso, eu me firmo, sem reservas, nos ensinamentos de Jesus, de seus apóstolos, dos profetas Fundamentos e no testemunho da Ciência da Mente.","a profundidade":"nem a altura, nem a profundidade, nem qualquer outra criatura poderá separar-nos do amor de Deus”.","o progresso":"A transgressão da lei acarreta penalidade, a fim de obrigar a esse progresso.","a promessa":"Ao senso mortal, a Ciência no começo parece indistinta, abstrata A nova e obscura; mas uma promessa luminosa lhe mensagem coroa a fronte.","o propósito":"O propósito desse Princípio é bom e sua prática é mais segura e mais potente do que a de qualquer outro método de cura.","a prosperidade":"Mal nos lembramos disso ao sol briAflições lhante da alegria e da prosperidade.","a prova":"Essa foi a mais alta prova que ele podia ter oferecido do Amor divino.","a pureza":"O afeto permanente que a mãe sente pelo filho não pode ser desarraigado, porque o amor materno inclui pureza e constância, ambas imortais.","a purificação":"Quer Purificação aqui, quer no além, ou o sofrimento ou a Ciência científica tem de destruir todas as ilusões referentes à vida e à mente, e reformar o senso material e o ego material.","a questão":"A questão também não melhora quando supostos espíritos ensinam sobre a imortalidade.","a razão":"Jesus de Nazaré ensinou e demonstrou o fato de que o homem e o Pai são um, e por essa razão lhe devemos perene homenagem.","a reação":"Se conseguires que os doentes se deem conta dessa grande verdade incontestável, não haverá reação por excesso de esforço ou por excitação.","a realidade":"Se o Mestre não tivesse e estorvo tido alunos, nem tivesse ensinado a realidade a respeito de Deus, a qual não se via, ele não teria sido crucificado.","a realização":"Se não almejamos secretamente e não Exageros nos esforçamos abertamente pela realização de em público tudo o que pedimos, então nossas orações são “vãs repetições”, como as dos pagãos.","a redenção":"E não somente ela, mas também nós, que temos as primícias do Espírito, igualmente gememos em nosso íntimo, aguardando a adoção de filhos, a redenção do nosso corpo.","a regeneração":"Embora esteja extremamente agradecido pela cura física, minha gratidão pela regeneração mental e espiritual é impossível de expressar em palavras.","a rejeição":"Tens de tratar a crença na enfermidade como tratarias o pecado, isto é, com rejeição instantânea.","a religião":"Na atualidade, os mor tais progridem lentamente, por medo de serem A base da religião julgados ridículos.","o remédio":"Daí a importância da Ciência Cristã, na qual aprendemos que há uma Mente só e que o bem está sempre ao nosso alcance como remédio para todos os males.","a renovação":"A Bíblia ensina a transformação do corpo pela renovação que vem do Espírito.","a renúncia":"A consagração tam­ Renúncia bém não diminui as obrigações do homem para ao ego com Deus, mas mostra a suprema necessidade de cum­pri-las.","a repetição":"quem dizeis que eu sou?” A repetição dessa pergunta significava: Quem ou o que é capaz de fazer a obra, tão miste­ riosa para a mente popular?","o repouso":"A cons­ se cansa ciência da Verdade nos descansa mais do que horas de repouso na inconsciência.","a representação":"O sol é uma representação metafórica da Alma fora do corpo, a qual dá existência e inteligência ao universo.","a ressurreição":"É o Cristo vivo, a Verdade posta primordial em prática, que faz de Jesus “a ressurreição e a vida” para todos os que o seguem em seus atos.","a restauração":"São o sinal de Emanuel, ou seja, “Deus conosco” — uma influência divina sempre presente na consciência humana, e que se repete, vindo agora como fora prometido antigamente: Para proclamar libertação aos cativos [dos sentidos] E restauração da vista aos cegos, Para pôr em liberdade os oprimidos.","o resultado":"A desarmonia que requer métodos materiais é o resultado da fé em modalidades materiais — fé na matéria em vez de fé no Espírito.","os resultados":"A crença produz os resultados da crença, e as penalida­ des que ela impõe duram tanto quanto a crença e dela não podem ser separadas.","a retidão":"As salutares correções por parte do Amor nos ajudam a prosseguir na marcha rumo à retidão, à paz e à pureza, que são os pontos de referência na Ciência.","a revelação":"Deus vinha ternamente me preparando durante muitos anos para receber essa revelação final do Princípio divino absoluto da cura mental científica.","a riqueza":"Deixemos de dar importância à riqueza, à fama e às organi­ zações sociais, que não pesam nem sequer um til na balança de Deus, e obteremos uma percepção mais clara do A percepção Princípio.","as riquezas":"Não podemos servir, Servir a dois ao mesmo tempo, a Deus e às riquezas; mas senhores não é isso o que os frágeis mortais tentam fazer?","a sabedoria":"A sabedoria do homem não é suficiente para autorizá-lo a dar conselhos a Deus.","a salvação":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","o salvador":"Nesse homem perfeito o Salvador via a própria semelhança de Deus, e esse modo correto de ver o homem curava os doentes.","a sanidade":"O pecado escapa O pecado é uma a essa classificação só porque seu método forma de insanidade de loucura está de acordo com a crença mortal comum.","a santidade":"Esse Cristo, o A demonstração caráter divino do homem Jesus, era sua natudo Cristo reza divina, a santidade que o animava.","o santo":"A doutrina rabínica dizia: “Aquele que aceita uma só doutrina, firme na fé, nesse habita o Espírito Santo”.","Satanás":"Esse mandamento foi uma advertência para estar em guarda, não contra Roma, não contra Satanás, nem contra Deus, mas contra o pecado.","a satisfação":"Pode a matéria falar por si mesma, ou encontram-se nela as fontes da vida?” A matéria, que não pode sofrer nem sentir satisfação, não tem parceria com a dor e o prazer, mas a que tem tal parceria é a crença mortal.","a saúde":"Ciência e Saúde Prefácio x estima pelas recordações do desenvolvimento de um filho, e ela não gostaria que fossem modificadas.","o século":"O Apóstolo Paulo se refere à personificação do mal como “o deus deste século”, e além Despotismo disso o define como desonestidade e astúcia.","os séculos":"O Espírito divino, Interpretação que assim identificou Jesus, séculos atrás, falou espiritual pela Palavra inspirada, e por ela falará em todos os tempos e em toda parte.","o segredo":"A mina nada sabe das esmeraldas contidas nas suas rochas; o mar ignora as pedras preciosas que estão nas suas cavernas, ignora os corais, os aguçados recifes, os granSegredos des navios que nele flutuam e os corpos que enterrados jazem sepultos nas areias; não obstante, tudo isso lá está.","a semelhança":"O Amor e a Verdade não estão em guerra com a imagem e semelhança de Deus.","a semente":"A semente que germinou tem nova forma e novo estado de existência.","as sementes":"O solo da enfermidade é a mente mortal, e terás uma colheita de doenças, abundante ou escassa, de acordo com as sementes do medo.","o ser":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","o ser humano":"Os estados mentais são de tal modo dessemelhantes, que a intercomunhão é tão impossível como o seria entre uma toupeira e um ser humano.","o sermão":"Uma xícara de café ou de chá não é tão eficaz como a verdade, seja para inspirar um sermão, seja para sustentar a resistência física.","a serpente":"Aqui cessam as teoA serpente rias, e a Ciência desvenda o mistério e resolve a do erro questão sobre o homem.","o servo":"Da mesma forma o homem é apenas o humilde servo da Mente que descansa e propicia descanso, embora isso pareça diferente ao senso finito.","a significação":"Isso mostra como nosso Mestre constantemente tinha de empregar palavras de significação material a fim de desdobrar pensamentos espirituais.","o significado":"Daí a oposição do homem sensual à Ciência da Alma O erro da e o significado do trecho bíblico: “O pendor da carnalidade carne é inimizade contra Deus”.","o silêncio":"O Espírito acabará por tomar posse daquilo que lhe pertence — tudo o que em realidade existe — e as vozes do senso físico serão para sempre reduzidas a silêncio.","o símbolo":"Na antiguidade, a cruz era o símbolo central da verdade, e assim é até hoje.","os símbolos":"Do mesmo modo, a matéria não tem lugar no Espírito, e o Símbolos Espírito não tem lugar na matéria.","a simplicidade":"Ao lhe perguntarem por que, respondeu com simplicidade: “Não há sensação na matéria”.","a sinceridade":"A recomendação do Mestre é que oremos em secreto e deixemos que nossa vida ateste nossa sinceridade.","o sintoma":"Assim, aprendemos que não é a droga que expulsa a enfermidade ou modifica algum sintoma da doença.","os sintomas":"Pois bem, tive todos os sintomas, e todos eles desapareceram graças à leitura de Ciência e Saúde.","o sistema":"Copérnico traçou o mapa do sistema estelar e, antes que ele se pronunciasse, a astrografia era caótica e os espaços celestes não haviam sido corretamente estudados.","a situação":"Estive nessa situação mais ou menos oito anos, até dois anos atrás, quando (graças a Deus Todo-Poderoso) um bom amigo chamou minha atenção para a Ciência Cristã.","a sociedade":"Sem ela não há estabilidade na sociedade, e sem ela não se pode alcançar a Ciência da Vida.","o sofrimento":"Jesus sofreu por nossos pecados, não para anular a sentença divina aplicada ao pecado de alguém, mas porque o pecado acarreta inevitável sofrimento.","os sofrimentos":"Para que teus filhos não passem às crianças pela experiência do erro e seus sofrimentos, mantém fora da mente deles os pensamentos pecaminosos ou doentios.","a solução":"Nosso Mestre alcançou a solução a respeito do existir, ao demonstrar a existência de uma Mente única, pois não existe outra que lhe seja igual.","o sonho":"Crença Será finalmente constatado que a morte é um na morte sonho mortal que vem nas trevas e desaparece com a luz.","os sonhos":"Sonhos diferentes e diferenças no despertar denotam estados de consciência diferentes.","a substância":"A crença de que uma substância polposa dentro do crânio seja mente é uma zom baria da inteligência, uma imitação ridícula que se faz da Mente.","a sugestão":"sugestão do mal A primeira declaração sobre o mal — a primeira sugestão de que exista mais de uma Mente — acha-se na fábula da serpente.","a superioridade":"Tudo o que vive deve ser gover­ superioridade nado apenas por Deus.","a superstição":"A superstição, tal como “as aves do céu”, arrebata a boa semente antes que tenha brotado.","a supremacia":"A supremacia do Espírito foi o fundamento sobre o qual Jesus edificou.","o tabernáculo":"O corpo; a ideia da Vida, da substância e da inteligência; a superestrutura da Verdade; o tabernáculo do Amor; uma superestrutura material, onde os mortais se congregam para o culto.","o temor":"Nenhuma hipótese quanto à existência de outro poder deveria interpor alguma dúvida ou temor e assim estorvar a demonstração da Ciência Cristã.","a tempestade":"Não sei quanto tempo esperei mas, de repente, como um maravilhoso facho de luz depois de uma tempestade, veio-me claramente este pensamento: “Aquietai-vos e sabei que eu sou Deus”.","o templo":"Como no tempo de Jesus, assim também hoje é preciso expulsar do templo, a chicotadas, a tirania e o orgulho, e dar boa acolhida à humildade e à Ciência divina.","o tempo":"Como é absurda a crença de que estejamos esgotando a vida e nos precipitando para a morte, e que ao mesmo tempo estejamos em comunhão com a imortalidade!","os tempos":"O Espírito divino, Interpretação que assim identificou Jesus, séculos atrás, falou espiritual pela Palavra inspirada, e por ela falará em todos os tempos e em toda parte.","a tentação":"A tentação nos incita a repetir a falta, e o sofrimento vem como resultado do que fizermos.","a teologia":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","a teoria":"Depois disso, publicaram-se vários livros sobre a cura mental, a maioria deles incorretos na teoria e cheios de plá gios de Ciência e Saúde.","as teorias":"Por fim, não rendeu homenagem às formas de doutrina nem às teorias dos homens, mas agiu e falou segundo era motivado, não por espíritos, mas pelo Espírito.","o termo":"O termo Ciência, bem compreendido, refere-se unicamente às leis de Deus e ao Seu governo do universo, que inclui o homem.","os termos":"A científico natureza do homem, assim compreendida, inclui tudo o que significam os termos “imagem” e “semelhança”, tais como são empregados nas Escrituras.","a terra":"Esse anseio humano não foi correspondido, e por isso Jesus se volveu para sempre da terra para o céu, dos sentidos para a Alma.","o terror":"Because of the won‐ drous glory which God bestowed on His anointed, temp‐ tation, sin, sickness, and death had no terror for Jesus.","a tese":"Qualquer hipó tese de que a vida esteja na matéria é uma crença imposta pela educação.","o tesouro":"Os estudantes de Ciência Cristã, que começam com a letra dessa Ciência e pretendem ter êxito sem o espírito, ou farão naufragar sua fé ou, infelizmente, tomarão Tesouro a direção errada.","o testemunho":"O testemunho dos sentidos corpóreos não pode nos informar o que é real e o que é ilusório, mas as revelações da Ciência Cristã são a chave que dá acesso aos tesouros da Verdade.","os testemunhos":"A caminho de casa vieram-me ao pensamento alguns dos testemunhos que ouvira na noite anterior — de pessoas que haviam sido curadas pela simples leitura de Ciência e Saúde.","o texto":"Aqui a palavra mãos é usada metaforicamente, como a palavra destra é usada no texto “A destra do Senhor se eleva”.","os textos":"A familiaridade com os textos originais e a disposição de abandonar as crenças humanas (estabelecidas por hierarquias e instigadas às vezes pelas piores paixões dos Correntezas homens) abrem o caminho para que a Ciência curativas da Vida Cristã seja compreendida, e fazem da Bíblia o mapa náutico da vida, no qual estão assinaladas as boias e as correntezas curativas da Verdade.","a tradição":"Existe a tradição de que Públio Lêntulo escreveu às autoridades de Roma: “Os discípulos de Jesus creem que ele é o Filho de Deus”.","a tradução":"Durante cinquenta anos, essa tradução trouxe cura e compreensão espiritual ao campo de nossa língua.","a transformação":"Tal transformação em sentido contráAbismo rio é impossível na Ciência.","a transgressão":"A transgressão da lei acarreta penalidade, a fim de obrigar a esse progresso.","a transição":"Um estado instável de transição, por si só, nunca é desejável.","o tratamento":"É melhor aceitar o tratamento de um médico infetado de varíola do que ser tratado mentalmente por alguém que não obedeça aos requisitos da Ciência divina.","as trevas":"Crença Será finalmente constatado que a morte é um na morte sonho mortal que vem nas trevas e desaparece com a luz.","a tribulação":"If we would heal by the Spirit, we must not hide the talent Ciência e Saúde A prática da Ciência Cristã na tribulação e o precioso senso do carinho e do amor do Pai querido.","o tribunal":"Alguns exclamam: “É contribunal superior trário à lei e à justiça”.","a tristeza":"O homem não é um pêndulo, oscilando entre o mal e o bem, entre a alegria e a tristeza, entre a doença e a saúde, O homem entre a vida e a morte.","o triunfo":"Do começo ao fim, as Escrituras estão cheias de relatos do triunfo do Espírito, a Mente, sobre a matéria.","o trono":"E o seu filho foi arrebatado para Deus até ao Seu trono.","a tuberculose":"Se o caso a ser tratado mentalmente é de tuberculose, trata dos pontos principais que (segundo a crença) estão incluídos nessa doença.","o tumor":"“Bem”, disse ela com decisão, “o tumor desapareceu, pois Deus nunca o fez”, e essas declarações eram verdadeiras, porque daquele dia em diante não senti mais nenhum incômodo.","os tumores":"Modifica A Verdade secreções, elimina fluidos nocivos, dissolve é alterante tumores, relaxa músculos enrijecidos e restaura a saúde dos ossos.","o túmulo":"no túmulo Ele provou que a Vida é imorredoura e que o Amor domina o ódio.","a unção":"Contudo, a todos os sistemas humanos baseados em premissas materiais falta a unção da Ciência divina.","a união":"A união das qualidades masculinas e femininas constitui o homem completo.","a unidade":"A reconciliação exemplifica a unidade do homem com Deus, segundo a qual o homem reflete a Verdade, a Vida e o Amor divinos.","o universo":"Na Ciência divina, o universo, que inclui o homem, é espiritual, harmonioso e eterno.","a utilidade":"Na esperança de que possa ser de utilidade para algumas dessas pessoas, e em gratidão pelo auxílio que recebi, vou narrar minha própria experiência.","a vaidade":"A mente mortal imperfeita emite sua própria similaridade, da qual o sábio disse: “Tudo é vaidade”.","o valor":"Alcançarás a Ciência perfeita da cura, quando O valor fores capaz de ler a mente humana dessa maneira da intuição e de discernir o erro que queres destruir.","os valores":"O homem que tem valores morais não tem medo de que possa vir a cometer um homicídio, e deveria igualmente não ter medo no tocante à doença.","a verdade":"Enquanto o coração está longe da Verdade e do Prayer Science and Health divine Truth and Love, we cannot conceal the ingrati‐ tude of barren lives.","a verdade divina":"Por isso, aceitamos a conclusão de que as desarmonias só têm existência imaginária, são crenças mortais que a Verdade divina e o Amor divino destroem.","a verdade eterna":"Visto que a Alma é imortal, ela não pode pecar, porque o pecado não é a verdade eterna do existir.","as verdades":"A crença universal na física pesa contra as elevadas e poderosas verdades da metafísica cristã.","a vergonha":"Envergonhado diante da Verdade, o erro recuou, A vergonha é encabulado ao ouvir a voz divina que interpeefeito do pecado lava os sentidos corpóreos.","a versão":"No texto português, as citações da Bíblia são geralmente extraídas da versão de João Ferreira de Almeida, Revista e Atualizada, 2ª Edição, publicada pela Sociedade Bíblica do Brasil.","o versículo":"Do quarto versículo e Eloim do capítulo dois até o capítulo cinco, o Criador é chamado Jeová, ou o Senhor.","os versículos":"Entretanto, nos casos em que o significado da Bíblia em português diverge dos versículos da Bíblia citados por Mary Baker Eddy, essas citações foram traduzidas diretamente do texto inglês.","a vida":"A obediência é garantida somente pela compreensão correta a respeito dEle, e conhecê-Lo corretamente é a Vida eterna.","a vida espiritual":"Para ter comunhão com o Espírito é preciso antes ter alcançado a vida espiritual.","a vida eterna":"A obediência é garantida somente pela compreensão correta a respeito dEle, e conhecê-Lo corretamente é a Vida eterna.","a vigilância":"A oração, a vigilância e o trabalho, somados à imolação do ego, são os misericordiosos meios divinos pelos quais se realizou tudo o que foi feito com êxito para a cristianização e a saúde do gênero humano.","o vigor":"Fiquei curada de um problema na coluna; o nervosismo e a fraqueza se desvaneceram e foram substituídos por saúde e vigor.","o vínculo":"Portanto, o homem seria aniquilado, se não fosse pelo vínculo indissolúvel do homem real O homem e espiritual com seu Deus, vínculo que Jesus imortal trouxe à luz.","a violência":"Os tribunais e os jurados julgam e sentenciam os mortais para refrear o crime, evitar atos de violência ou puni-los.","a virtude":"Os viveiros onde se A função dos cultiva o caráter devem ser fortemente defen­ professores didos pela virtude.","as virtudes":"H., Oleta, Oklahoma, EUA Vencidas muitas dificuldades No segundo capítulo da Primeira Epístola de Pedro, versículo nove, lemos: “...a fim de proclamardes as virtudes daquele que vos chamou das trevas para a sua maravilhosa luz”.","a visão":"A visão, a audição, todos os sentidos espirituais do homem são eternos.","a vitória":"A lei humana o havia condenado, mas ele estava demonstrando a Vitória Ciência divina.","a vitalidade":"Os ensinamentos de Cristo não estão envoltos em mistério, nem são teóricos e fragmentários, mas práticos e completos; e por serem práticos e completos, não estão privados de sua vitalidade essencial.","a vontade":"A vontade humana pertence aos chamados sentidos materiais, e sua utilização deve ser condenada.","a vontade divina":"Ora, Cumprimento da Jesus veio para destruir o pecado, a doença e a vontade divina morte; mas as Escrituras afirmam: “Não vim para destruir, vim para cumprir”*.","a voz":"Mais tarde, a língua dá voz ao pensamento mais definido, embora ainda imperfeitamente.","o zelo":"Examinando profundaOração mente essas coisas, constatamos que o “zelo..."},"VERB":{"abalar":"Ao labutar longamente para abalar a fé que os adultos têm na matéria e para lhes inculcar um grão de fé em Deus — uma pequena ideia da capacidade do Espírito para tornar harmonioso o corpo — a autora muitas vezes se lembra do amor de nosso Mestre pelas crianças, e compreende como realmente pertencem ao reino dos céus os que são como elas.","abandonar":"Temos de abandonar a farmacologia e adotar a ontologia — “a ciência do que realmente existe”.","abençoar":"Só desse modo poderemos abençoar nossos inimigos, embora estes talvez não inter­ pretem assim nossas palavras.","abrir":"Tais admissões deveriam abrir são ineficazes os olhos das pessoas para a ineficácia das teorias materiais sobre a saúde e levar os sofredores a procurar a causa e a cura em outras direções.","absorver":"A Ciência do cristão Cristã pode absorver a atenção de sábios e filósofos, mas só o cristão pode compreendê-la a fundo.","aceitar":"Não quiseram aceitar sua serena interpretação da vida, nem lhe seguir o exemplo.","acreditar":"Não acreditar no erro destrói o erro e leva ao discernimento da Verdade.","admitir":"Não devemos continuar a admitir que a superstição seja alguma coisa, mas precisamos abandonar toda a crença nela e ser sensatos.","adorar":"Encontrei um Deus a quem posso amar e adorar de todo o coração e agora leio a Bíblia com interesse e compreensão.","afirmar":"Ninguém pode verdadeiramente afirmar que Deus seja um ser corpóreo.","agir":"O efeito bené fico de tal oração em favor dos doentes ocorre na mente humana, fazendo-a agir mais poderosamente sobre o corpo por meio da fé cega em Deus.","ajudar":"Viajantes Nossos caminhos divergem desde o começo e divergentes temos pouca oportunidade de ajudar-nos mutuamente.","alcançar":"Para alcançar o céu, a harmonia do existir, temos de compreender o Princípio divino do existir.","amar":"Para teres um só Deus e te valeres do poder do Espírito, tens de amar a Deus supremamente.","andar":"Tens de utilizar o poder moral da Mente a fim de andar sobre as ondas do erro e sustentar tuas reivindicações mediante a demonstração.","aniquilar":"Mas um toque, um incidente, a lei de Deus, podem a qualquer momento aniquilar minha paz, pois todas as minhas alegrias imaginárias são destrutivas.","anular":"Jesus sofreu por nossos pecados, não para anular a sentença divina aplicada ao pecado de alguém, mas porque o pecado acarreta inevitável sofrimento.","aparecer":"Afirmo novamente, um erro na premissa tem de aparecer na conclusão.","aplicar":"Assim se pode aplicar a Ciência Cristã desde cedo.","apoiar":"Os doentes estariam mais deplorejeitados ravelmente perdidos do que os pecadores, se os doentes não pudessem se apoiar na ajuda de Deus, como os pecadores podem.","aprender":"O homem mortal nunca poderá se levantar dos escombros temporais do erro, da crença no pecado, na doença e na morte, até aprender que Deus é a única Vida.","apresentar":"Do contrário, não seria Ciência e não Fatos científicos poderia apresentar provas.","assumir":"Finalmente, ela disse que iria suspender os remédios por um dia e assumir o risco.","atender":"Acaso a Deidade intervém a favor de um devoto, deixando de atender a outro que ora tanto quanto aquele?","atribuir":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","atuar":"Sendo Proclamada a evidente que a semelhança do Espírito não pode onipotência ser material, porventura não se segue daí que Deus não pode estar na Sua dessemelhança e não pode atuar por meio de drogas para curar os doentes?","aumentar":"A chamada crença da mente mortal, que aparece sob a O erro se destrói forma de abscesso, não deveria ficar mais doloa si mesmo rosa antes de supurar, nem deveria a febre aumentar antes de cessar.","avaliar":"Só os que já tiverem sofrido como eu podem avaliar a plena extensão desse padecimento.","avançar":"Quem quiser demonstrar a cura pela Ciência Cristã tem de obedecer estritamente às suas regras, estar atento a cada declaração e avançar a partir dos rudi mentos estabelecidos.","basear":"Se chegava a pensar nesse assunto, era para classificar a Ciência Cristã entre as várias teorias humanas com as quais não podia concordar, pois pareciam basear-se ao mesmo tempo no bem e no mal.","beber":"O melhor intérprete das necessidades do homem disse: “Não andeis ansiosos pela vossa vida, quanto ao que haveis de comer ou beber”.","beneficiar":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","brilhar":"Morava conosco, na mesma casa, uma Cientista Cristã que deixava sua luz brilhar e, embora ela falasse pouco, eu sentia o reflexo do Amor.","buscar":"A decomposição e a análise das palavras, a não ser para buscar sua derivação metafísica, não é científica.","cair":"A Verdade é a rocha eterna, a pedra angular, mas “aquele sobre quem ela cair ficará reduzido a pó”.","caminhar":"Ele chega a um senso mais do homem divino dos fatos e compreende a teologia de Jesus, como ele a demonstrou ao curar os doentes, ressuscitar os mortos e caminhar sobre as ondas.","causar":"Visto que é a mente mortal que cultiva o erro, ela deve ser instruída a não causar dano ao corpo e a arrancar aquilo que semeou erroneamente.","ceder":"A capacidade de ceder um ao outro preservará frequentemente um pacto que, de outro modo, poderia se tornar insu portável.","chamar":"Era difícil chamar um praticista, por isso tomei o livro Ciência e Saúde e apliquei seus ensinamentos o melhor que pude.","chegar":"Eu me achava apenas a dois quarteirões e meio de onde morava, por isso montei novamente na bicicleta e consegui chegar em casa.","cobrir":"Os filhos de Deus já existem e só serão percebidos à medida que o homem descobrir a verdade a respeito do existir.","coexistir":"O Espírito e a Tangibilidade matéria não podem nem coexistir nem coopeespiritual rar, e um não pode criar o outro, assim como a Verdade não pode criar o erro ou vice-versa.","combater":"Então, por que tentam os cristãos obecristão decer às Escrituras e combater “o mundo, a carne e o diabo”?","começar":"No entanto, temos de começar cuidadosa pelas demonstrações mais simples de controle e, quanto mais cedo começarmos, melhor será.","comer":"O mal declarou que comer essa fruta abriria os olhos do homem e este se tornaria como um deus.","compreender":"Para alcançar o céu, a harmonia do existir, temos de compreender o Princípio divino do existir.","comunicar":"Para estarem em condições de se comunicar com o Espírito, é preciso que as pessoas estejam livres dos corpos orgânicos; e sua volta a um estado material, Condições depois de havê-lo deixado, seria tão impossível opostas como o retorno ao estado original de uma semente já transformada em broto acima do solo.","concluir":"Seria razoável concluir, a partir daí, que é a crença humana, e não o arbítrio divino, que põe o organismo físico sob o jugo da doença.","concordar":"Se chegava a pensar nesse assunto, era para classificar a Ciência Cristã entre as várias teorias humanas com as quais não podia concordar, pois pareciam basear-se ao mesmo tempo no bem e no mal.","condenar":"A lei moral, que tem o direito de absol ver ou condenar, sempre exige a reparação antes que os mortais possam ir “mais para cima”.","conduzir":"Podes conduzir o navio a salvo através da tempes tade?” Ele responde corajosamente, mas nem mesmo o marinheiro destemido tem certeza da sua segurança; a ciência náutica não se iguala à Ciência da Mente.","confiar":"Em realidade manipulas porque desconheces os efeitos nocivos do magnetismo, ou porque não és suficientemente espiritual para confiar no Espírito.","confundir":"Para fixar a verdade firmemente no pensamento de teus pacientes, explica-lhes a Ciência Cristã, mas não cedo demais — não antes de estarem preparados para a explicação — a fim de não predispores os doentes contra seus próprios interesses, por lhes perturbar e confundir o pensamento.","conhecer":"Os sentidos físicos não têm capacidade para conhecer a Deus e a Verdade espiritual.","conseguir":"O Legislador hebreu, pesado de língua, tinha pouca esperança de conseguir que as pessoas compreendessem aquilo que a ele seria revelado.","conservar":"Os fariseus de outrora expulsaram das sinagogas a ideia espiritual e o homem que a vivia, e conservaram suas pró prias crenças materialistas a respeito de Deus.","considerar":"Não deveríamos, então, considerar e a Verdade falso e perigoso o conhecimento assim obtido, visto que “pelo fruto se conhece a árvore”?","construir":"Esse conceito verdadeiro do existir destrói a crença no espiritualismo logo no momento incipiente dessa crença, pois não havendo a admissão de que existam pessoalidades materiais chamadas espíritos, o espiritualismo não tem base sobre a qual construir.","consumir":"O desejo depravado de consumir bebidas alcoólicas, fumo, chá, café, ópio, só é destruído pelo domínio da Mente sobre o corpo.","contemplar":"Como pode então essa demonstração estar “cheia de falsidades, dolorosas de contemplar”?","continuar":"Não devemos continuar a admitir que a superstição seja alguma coisa, mas precisamos abandonar toda a crença nela e ser sensatos.","controlar":"Tens de controlar os maus pensamentos logo que surgem, do contrário serão eles que, em seguida, te controlarão.","convencer":"Para convencer Tomé, Jesus o fez examinar o sinal dos pregos e a ferida aberta pela lança.","converter":"Os primeiros sintomas dessa doença apareceram há uns cinco anos sob a forma de agudas cólicas estomacais, que acabaram por se converter em outros sintomas daquela doença dolorosa.","corrigir":"O medo, que é um elemento de toda doença, tem de ser expulso para corrigir a balança a favor de Deus.","crer":"Somos propensos a crer em mais de um Governante Supremo ou em algum poder inferior a Deus.","crescer":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","criar":"Eles acreditam ser trabalhadores independentes, creem que eles mesmos sejam autores e até criadores privilegiados de algo que a Egotismo Deidade não quis ou não pôde criar.","cuidar":"Cerca de seis semanas depois, fui chamada a cuidar de minha mãe, que estava em tratamento com o meu antigo médico.","cumprir":"Esse é um elemento do progresso, e o pro gresso é a lei de Deus, lei que exige de nós apenas aquilo que com certeza podemos cumprir.","curar":"O propósito de Jesus, ao curar, Exemplo para não foi só restaurar a saúde, mas demonstrar nossa salvação seu Princípio divino.","dar":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","decidir":"Antes de decidir que o corpo, a A importante matéria, sofre de um distúrbio, deve-se pergundecisão tar: “Quem és tu que contestas o Espírito?","declarar":"No silencioso santuário dos Invocação desejos fervorosos, temos de negar o pecado e eficaz declarar a totalidade de Deus.","deduzir":"A materialista crença em uma base material, da qual se possa deduzir toda a racionalidade, está lentamente cedendo à ideia de uma base metafísica, está desviando sua atenção da matéria como causa, e vendo que a Mente é a causa de todo efeito.","defender":"O Homem Mortal não teve advogado competente para lhe defender a causa.","deixar":"Estás disposto a deixar tudo por Cristo, pela Verdade, e com isso seres considerado pecador?","demonstrar":"Ciência e Saúde A oração materializa a adoração estorva o desenvolvimento espiritual do homem e o impede de demonstrar seu poder sobre o erro.","denominar":"Só o erro impoA origem tente procuraria unir o Espírito com a matéria, o da natureza divina bem com o mal, a imortalidade com a mortalidade, e denominar essa unidade fictícia homem, como se o homem fosse gerado tanto pela Mente como pela matéria, tanto pela Deidade como pela humanidade.","depender":"Como pode o homem, que reflete a Deus, depender de meios materiais para saber, ouvir e ver?","derrotar":"Pode a matéria expulsar a Vida, o Espírito, e assim derrotar a onipotência?","desaparecer":"Agora é a hora de desaparecer aquilo a que se chamam dores e prazeres materiais, pois ambos são irreais, porque impossíveis na Ciência.","descobrir":"Os filhos de Deus já existem e só serão percebidos à medida que o homem descobrir a verdade a respeito do existir.","descrever":"Não tenho palavras para descrever a maravilhosa alegria e elevação espiritual que então experimentei.","desenvolver":"Vigia a mente, em vez de o corpo, para não deixar entrar no pensamento nada que não deva se desenvolver.","desejar":"Por que desejar que se misturem, quando nada de bom pode vir disso?","destruir":"Ele veio ensinar e mostrar divina aos homens como destruir o pecado, a doença e a morte.","desvanecer":"Nosso grande exemplo, Jesus, podia restabelecer a manifestação individualizada da existência, que parecia se desvanecer na morte.","determinar":"The idols of civilization call into action less faith than Buddhism Ciência e Saúde A fisiologia o cérebro, que agem por meio dos cinco sentidos físicos) constitua o homem, é impossível entender como Quando o a anatomia possa distinguir entre a humanidade homem é homem e o animal, ou determinar quando o homem é realmente homem e já progrediu para além de seus progenitores animais.","dever":"While the heart is far from Ciência e Saúde A oração imutavelmente certo fará o que é certo, sem que seja necessário lembrá-Lo de Seu dever.","dizer":"Inde­ pendentemente do que outros possam dizer ou pensar a esse respeito, eu falo por experiência.","dominar":"Eles apenas diminuem temporariamente o medo da mente mortal, até que esta possa dominar a crença errônea.","duvidar":"O que é o estudo dos clássicos, senão o discernimento das mentes de Homero e de Virgílio, de cuja existência pessoal podemos duvidar?","edificar":"Não podemos edificar com segurança sobre fundamentos falsos.","educar":"Os pais deveriam se lembrar disso e aprender a educar os filhos de maneira apropriada em terra firme.","elevar":"O homem não pode se elevar acima do Amor divino e assim realizar a expiação em favor de si mesmo.","eliminar":"A Ciência cancela a penalidade só depois de eliminar o pecado que acarreta a penalidade.","emanar":"A Ciência Cristã apresenta desdobramento, não acréscimo; não manifesta nenhuma forma de crescimento material da molécula à mente, e sim um emanar da Mente A criação de Deus divina ao homem e ao universo.","encontrar":"Os mortais têm de encontrar refúgio na Verdade para escapar ao erro destes últimos tempos.","enfrentar":"A compreensão disso te dará a possibilidade de comutar essa autocondenação e enfrentar toda circunstância com a verdade.","enganar":"Por se enganar sobre sua origem e sua natureza, o homem acredita que é formado da união da matéria com o Espírito.","ensinar":"Ele veio ensinar e mostrar divina aos homens como destruir o pecado, a doença e a morte.","entender":"Quando é que as gerações científicas vão entender o Ego e compreender que existe um só Deus, a Mente única, a inteligência?","entrar":"O quarto simboliza o santuário do Espírito, cuja porta se fecha ao senso pecaminoso, mas deixa entrar a Verdade, a Vida e o Amor.","esclarecer":"Assim brilhou a pálida estrela aos pastores-profetas; apesar de pálida, essa estrela atravessou a noite e chegou ao recanto protegido e retirado onde estava o menino de Belém, o arauto humano do Cristo, a Verdade, que iria esclarecer à compreensão obscurecida o caminho da salvação por Cristo Jesus, até que, vencida a noite do erro, despontasse a aurora e brilhasse a estrela-guia do existir.","escolher":"Forçada a escolher entre duas dificuldades, a mente humana usa a menor para aliviar a maior.","escrever":"Antes de escrever esta obra, Ciência e Saúde, a autora fez numerosas anotações de estudo bíblico, que nunca foram publicadas.","esquecer":"Comecei a ler Ciência e Saúde, e nunca hei de esquecer a alegria que senti ao descobrir que eu podia amar a Deus e ter confiança nEle.","estabelecer":"Eu já sabia que faltava alguma coisa e, naquela época, achava que a religião tradicional con­tinha apenas a metade da verdade que Jesus veio estabelecer.","estar":"Estar presente “com o Senhor” não é ter mero êxtase ou fé emocional, mas é a verdadeira demonstração e compreensão da Vida como é revelada na Ciência Cristã.","estudar":"Continuei a estudar Ciência e Saúde, e a doença desapareceu.","examinar":"Andei vagando assim até que fui guiado a examinar a Ciência Cristã.","existir":"Para alcançar o céu, a harmonia do existir, temos de compreender o Princípio divino do existir.","explicar":"Só a Ciência pode explicar os incríveis elementos bons e maus que agora estão vindo à tona.","expressar":"Expressar vaidosamente sentimentos fervorosos nunca faz um cristão.","expulsar":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","falar":"Essa compreensão expulsa o erro e cura o doente, e com ela podes falar “como quem tem autoridade”.","falhar":"Tristezas e mais tristezas seguiram-se em rápida sucessão; durante dez longos anos não houve trégua; o caminho era realmente longo e árduo e não tinha saída, até que por fim a única coisa que me havia sustentado em todas as provações, isto é, minha saúde, começou a falhar e com ela se foi minha última esperança.","fazer":"Um livro apresenta pensamentos novos, mas não pode fazer com que sejam rapidamente compreendidos.","ficar":"Quem ousa dizer que a Mente verdadeira A Mente cura as pode ficar sobrecarregada?","firmar":"O único caminho a seguir é firmar-se em posição antagônica a tudo o que se opõe à saúde, à santidade e à harmonia do homem, a imagem de Deus.","florescer":"As crianças deveriam obedecer aos pais; a insubordi­nação é um mal que impede o florescer do autogoverno.","fluir":"A água da fonte não pode fluir a um nível acima da nascente.","formar":"Uma das teorias sobre essa mente mortal é que suas sensações podem reproduzir o homem, podem formar sangue, carne e ossos.","fortalece":"A luta pela Verdade nos fortalece em vez de nos enfraquecer, nos repousa em vez de nos cansar.","fugir":"Fugir à justiça e negar a verdade tendem a perpetuar o pecado, a incentivar o crime, a comprometer o autodomínio e a zombar da misericórdia divina.","ganhar":"É assim que Deus ensina os mortais a se desfazerem da carnalidade e ganhar a espiritualidade.","gerar":"Somente enquanto o medo ou o pecado subsistirem é que estes podem gerar a morte.","governar":"É prerrogativa do senso espiritual vontade é perversa governar o homem.","guiar":"Calcular nossa perspectiva de vida, não científica baseando-nos na matéria, seria infringir a lei espiritual e guiar erradamente a esperança humana.","habitar":"Preferimos “deixar o corpo e habitar com o Senhor” ( Coríntios 5:8).","harmonizar":"Harmonizar as contradições das doutrinas médicas é, de fato, tarefa tão impraticável como a de organizar os vapores fugazes ao nosso redor, ou de reconciliar as incompatibilidades imutáveis e repulsivas da natureza.","haver":"A supremo Ciência divina revela que é preciso haver suficiente sofri mento, ou antes ou depois da morte, para extinguir o amor ao pecado.","herdar":"Como Paulo diz, na sua primeira epístola aos Coríntios: “A carne e o sangue não podem herdar o reino de Deus”.","imaginar":"Quando alguém que não conhecia o caso tinha de imaginar a idade dela, achava que tivesse menos de vinte anos.","imitar":"Por não poderes, tu Imitar o mesmo, andar sobre as águas e ressuscitar os exemplo de Jesus mortos, não tens o direito de pôr em dúvida o grande poder da Ciência divina nesse sentido.","impedir":"É melhor impedir que a doença se no pensamento forme na mente mortal para que não apareça depois no corpo; mas para tanto é preciso atenção.","indicar":"Como ideal individual da Verdade, Cristo Jesus veio para repreender o erro rabínico e todo o pecado, a doença e a morte — para indicar o caminho da Verdade e Repreensões da Vida.","influenciar":"Não temos autoridade na Ciência Cristã, nem temos Não violar os direito moral, para tentar influenciar os pensadireitos humanos mentos dos outros, a não ser para beneficiá-los.","informar":"Podemos informar a Mente infinita de algo que já não compreenda?","iniciar":"Ao iniciar-se o processo do Homem Mortal contra o Senso Pessoal, o advogado do Homem Mortal contempla o acusado com extrema ternura.","instruir":"Para eliminar o erro que produz a perturbação, tens de acalmar e instruir a mente mortal com a Verdade imortal.","interpretar":"Não podemos interpretar o Espírito, a Mente, por intermédio da matéria.","introduzir":"Conta-se que Sir Humphry Davy certa vez aparentemente curou um caso de paralisia, só por introduzir um termômetro na boca do paciente.","invocar":"Podiam invocar a Jeová, mas essa oração não trazia nenhuma prova de haver Some Objections Answered Science and Health proof that it was heard, because they did not sufficiently understand God to be able to demonstrate His power to heal, — to make harmony the reality and discord the unreality.","julgar":"Contudo poderia julgar-se que sim, por uma leitura não esclarecida do relato bíblico que ora comentamos.","justificar":"Na ausência de outras provas, seria o seu pesar evidência suficiente para justificar a esperança de que ela tivesse se arrependido, se reformado e crescido em sabedoria?","labutar":"Ao labutar longamente para abalar a fé que os adultos têm na matéria e para lhes inculcar um grão de fé em Deus — uma pequena ideia da capacidade do Espírito para tornar harmonioso o corpo — a autora muitas vezes se lembra do amor de nosso Mestre pelas crianças, e compreende como realmente pertencem ao reino dos céus os que são como elas.","lançar":"E se o antigo dragão lançar um novo dilúvio para afogar a ideia-Cristo?","ler":"Não é mais A leitura dos difícil ler a mente que está ausente do que ler a pensamentos que está presente.","lembrar":"Os pais deveriam se lembrar disso e aprender a educar os filhos de maneira apropriada em terra firme.","levar":"Não permitam os mortais desrespeito à lei, pois isso poderia levar a um estado social pior do que o existente.","libertar":"A destruição das alegações da mente mortal por meio da Ciência, graças à qual o homem pode se libertar do pecado e da mortalidade, abençoa toda a família humana.","limitar":"Se indesejáveis não fosse o erro de medir e limitar tudo o que é bom e belo, o homem desfrutaria mais de setenta anos de vida e conservaria ainda o vigor, o frescor e o potencial.","limpar":"São os luminares da terra, que servem para limpar e purificar a atmosfera do senso material e para infundir na humanidade ideais mais puros.","louvar":"Põe tua esperança em Deus, pois ainda O louvarei, A Ele, que é a saúde do meu semblante e meu Deus.* — Salmos.","lutar":"Algum dia, aqui ou no além, todo mortal terá de lutar contra a crença mortal em um poder oposto a Deus, e vencê-la.","manifestar":"A matéria não foi criada pela Mente, nem tampouco para manifestar ou sustentar a Mente.","manter":"A determinação de manter o Espírito nas garras da matéria é o que persegue a Verdade e o Amor.","matar":"Adver­ tir as pessoas sobre a possibilidade de morrer é Pensamentos um erro que contribui para matar de pavor sobre a morte aqueles que não sabem que a Vida é Deus.","melhorar":"A humanidade vai melhorar por meio da Ciência e do Cristianismo.","morrer":"Adver­ tir as pessoas sobre a possibilidade de morrer é Pensamentos um erro que contribui para matar de pavor sobre a morte aqueles que não sabem que a Vida é Deus.","mostrar":"Ele veio ensinar e mostrar divina aos homens como destruir o pecado, a doença e a morte.","mudar":"Se acreditas no que é errado e o praticas conscientemente, podes, de imediato, mudar teu proceder e fazer o que é certo.","nascer":"Quem quer que abra o caminho na Ciência Cristã é peregrino e forasteiro, que traça a senda para gerações ainda por nascer.","negar":"No silencioso santuário dos Invocação desejos fervorosos, temos de negar o pecado e eficaz declarar a totalidade de Deus.","obedecer":"Estar “com o Senhor” é obedecer à lei de Deus, é ser inteiramente governado pelo Amor divino — pelo Espírito, não pela matéria.","oferecer":"Guardar os man­ Súplicas damentos de nosso Mestre e seguir seu exemplo eficazes é nossa verdadeira dívida para com ele e a única prova válida que podemos oferecer de nossa gratidão por tudo o que ele fez.","olhar":"Quando fixas o olhar nas realidades supernas, te elevas à consciência espiritual do existir, tal como o pássaro que saiu do ovo e alisa as asas para voar rumo ao céu.","orar":"O que mais necessitamos é orar com o desejo fervoroso de crescer em graça, oração que se expressa em paciência, mansidão, amor e boas obras.","ouvir":"Elas pro­ cedem do ouvir dos ouvidos, da corporalidade e não do Princípio, do mortal e não do imortal.","pagar":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","parecer":"Seria estranho que um amigo pudesse parecer menos do que belo.","participar":"Isso é participar da unificação com a moral Verdade e o Amor.","passar":"Com o passar do tempo, os elementos de cura do Cristianismo puro serão tratados com justiça; eles serão procurados e ensinados, e brilharão em todo o esplendor do bem universal.","pensar":"Inde­ pendentemente do que outros possam dizer ou pensar a esse respeito, eu falo por experiência.","perceber":"O pensa dor adiantado que é cristão devoto, ao perceber Pecado e o alcance e a tendência da cura cristã e da Ciência penalidade dessa cura, lhes dará apoio.","perder":"Ao perder seu crucifixo, uma jovem católica disse: “Nada mais me resta, senão Cristo”.","perdoar":"Os homens podem perdoar, mas somente esse Princípio divino reforma o pecador.","permanecer":"Se Deus tivesse feito o homem tanto bom como mau, o homem teria de permanecer assim.","permitir":"O ato de permitir que nossos pensamentos se prendam indevidamente às necessidades ou alterações físicas produz essas mesmas alterações.","pertencer":"Aqueles que se afastam desse Uma só escola método perdem o direito de pertencer a essa da Verdade escola, e tornam-se adeptos da escola socrática, platônica, spenceriana ou de alguma outra.","poder":"Ciência e Saúde A oração materializa a adoração estorva o desenvolvimento espiritual do homem e o impede de demonstrar seu poder sobre o erro.","possuir":"A mente mortal, que erra, reveste a droga do poder que ela parece possuir.","praticar":"Sintamos a energia divina do Espírito, que nos traz a uma vida nova e que não reconhece nenhum poder, Identidade mortal ou material, capaz de praticar des­ renovada truição.","pregar":"Não me enviou Cristo para batizar, mas para pregar o evangelho.","procurar":"Pela consciência humana, convence o mortal do engano que ele comete ao procurar meios materiais para conseguir a felicidade.","produzir":"Que ultraje à formosura da natureza dizer que uma rosa, o sorriso de Deus, possa produzir sofrimento!","progredir":"Fui guiado para onde podia progredir na Ciência, e já não era “levado ao redor por todo vento de doutrina”, mas aferrei-me ao Princípio o mais firmemente possível.","prometer":"Fugir à justiça e negar a verdade tendem a perpetuar o pecado, a incentivar o crime, a comprometer o autodomínio e a zombar da misericórdia divina.","proteger":"Não, mas às vezes deverias dizer qual é tua crença, se isso for necessário para proteger a outros.","purificar":"Para purificar do pecado, verdadeiros o sangue material de Jesus não foi mais eficaz quando derra­ mado no “madeiro maldito”, do que quando lhe corria nas veias e Jesus tratava diariamente dos negócios de seu Pai.","realizar":"O homem não pode se elevar acima do Amor divino e assim realizar a expiação em favor de si mesmo.","receber":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","reconciliar":"Portanto, o propósito de Cristo foi reconciliar o homem com Deus, não Deus com o homem.","reconhecer":"Pode a Mente infinita reconhecer O reconhecimento a matéria?","reduzir":"Para reduzir a inflamação, dissolver um tumor ou curar uma doença orgânica, constatei que a Verdade divina é mais Physiology Science and Health all lower remedies.","referir":"This righteous preacher John’s once pointed his disciples to Jesus as “the misgivings Lamb of God;” yet afterwards he seriously questioned Ciência e Saúde A ciência, a teologia e a medicina Jesus respondeu afirmativamente, relatando suas obras em vez de se referir à sua doutrina, confiando em que essa mani festação do poder divino para curar responderia plenamente à pergunta.","refletir":"A Alma nunca pode refletir algo que seja inferior ao Espírito.","reinar":"O Cristianismo, com a coroa do Amor sobre a fronte, tem de reinar na vida deles.","rejeitar":"Sustentamos os fatos da Verdade, não por aceitar, mas por rejeitar, a mentira.","renovar":"Maridos, ouvi isso e lembrai-vos de que basta uma palavra ou um gesto para renovar os velhos tempos de namoro.","renunciar":"Eles têm de renunciar à agressão, à opressão e ao orgulho do poder.","representar":"Quem vai dizer que a infância pode articular as ideias da idade adulta, que as trevas podem representar a luz, que estamos na Europa, quando nos achamos no hemisfério oposto?","resistir":"Eleva-te na força do Espírito para resistir a tudo o que é dessemelhante do bem.","resolver":"A crença humana se meteu em muitas astúcias, mas nenhuma delas pode resolver, sem o Princípio divino da Ciência divina, a questão do existir.","responder":"Vosso Tribunal Material de Erros, quando condenou o Homem Mortal por haver desobe decido às leis materiais de saúde, foi influenciado pelas lisonjas e maquinações do advogado Crença Errônea, a quem a Verdade intima a comparecer ante o supremo tribunal do Espírito para responder por seu crime.","ressuscitar":"Ele chega a um senso mais do homem divino dos fatos e compreende a teologia de Jesus, como ele a demonstrou ao curar os doentes, ressuscitar os mortos e caminhar sobre as ondas.","restabelecer":"O paciente se desvia instintivamente da contem­ plação dessa imagem mas, embora não reconheça o medo latente e a falta de esperança de se restabelecer, estes permanecem no seu pensamento.","restaurar":"O propósito de Jesus, ao curar, Exemplo para não foi só restaurar a saúde, mas demonstrar nossa salvação seu Princípio divino.","resultar":"O Homem Mortal, em obediência a uma lei mais elevada, ajudou seu próximo, ato este que deveria resultar em benefício para si mesmo, como também para outros.","revelar":"Sua missão foi revelar a Ciência do existir celestial, provar o que Deus é, e o que Ele faz pelo homem.","saber":"As escolas do saber puseram em moda a fé em drogas em vez de a fé na Deidade.","sacrificar":"A Secreção Mórbida aprendeu a fazer com que o sono ludibrie a razão antes de sacrificar os mortais aos seus falsos deuses.","salvar":"Isso os obriga, como homens que estão se afogando, a fazer esforços vigorosos para salvar-se; e, pelo amor precioso do Cristo, esses esforços são coroados de êxito.","santificar":"Graças ao poder da Verdade divina para elevar e santificar, obtiveram a vitória sobre os sentidos corpóreos, vitória que só a Ciência pode explicar.","satisfazer":"Só as alegrias mais elevadas podem satisfazer os anseios do homem imortal.","seguir":"Nosso Mestre disse: “Portanto, vós A oração de orareis assim”, e a seguir deu aquela oração que Jesus Cristo abrange todas as necessidades humanas.","sentir":"Por que então seria mais difícil ver do que sentir um pensamento?","separar":"nem a altura, nem a profundidade, nem qualquer outra criatura poderá separar-nos do amor de Deus”.","ser":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","servir":"Sabendo isso e sabendo Pregação também que um só afeto seria supremo em nós prática e dirigiria nossa vida, Jesus disse: “Ninguém pode servir a dois senhores”.","significar":"Serviço divino É triste que a expressão serviço divino tenha e adoração vindo, de maneira tão generalizada, a significar adoração pública, em vez de obras diárias.","sofrer":"Deveríamos libertar nossa mente do pensamento depressivo de termos transgredido uma lei material e de que temos, forçosamente, de sofrer as consequências.","sondar":"Não podemos sondar a natureza e a qualidade da criação de Deus, mergulhando nas águas rasas das crenças mortais.","sonhar":"Fecha os olhos, e podes sonhar que vês uma flor — que a tocas e sentes seu perfume.","subir":"Aquele que quiser alcançar a fonte e acima de tudo achar o remédio divino para todo mal não deve tentar subir a colina da Ciência por algum outro caminho.","submeter":"?” A única jurisdição à qual o prisioneiro pode se submeter é a da Verdade, da Vida e do Amor.","substituir":"Os acidentes são desconhecidos para Deus, a Mente imortal, e temos de deixar a base mortal da crença e unir-nos à Mente única, a fim de substituir a noção de acaso pelo Os acidentes são senso apropriado da infalível direção de Deus, desconhecidos para Deus e assim trazer à luz a harmonia.","superar":"A Ciência Cristã deu prova de ser socorro sempre presente, não só para superar males físicos, mas também nos assuntos de trabalho e na vida diária.","suprimir":"Se suprimires a mente mortal, a matéria não terá consciência como homem, assim como não a tem como árvore.","surgir":"Poderia o Espírito fazer surgir seu oposto, a matéria, e dar à matéria a capacidade de pecar e sofrer?","sustentar":"Uma xícara de café ou de chá não é tão eficaz como a verdade, seja para inspirar um sermão, seja para sustentar a resistência física.","temer":"Com base neles, Jesus e perfeição demonstrou a Vida, sem nunca temer nem obedecer ao erro sob nenhuma forma.","tentar":"Quem não for capaz de explicar a Alma, sensato será em não tentar explicar o corpo.","ter":"Estar presente “com o Senhor” não é ter mero êxtase ou fé emocional, mas é a verdadeira demonstração e compreensão da Vida como é revelada na Ciência Cristã.","terminar":"Luta Têm de lutar contra o pecado em si mesmos e cristã nos outros, e continuar essa luta até terminar esse percurso.","tirar":"É preciso tirar o máximo proveito da escola preparatória da terra.","tocar":"Ainda que pareçam tocar-se, um é sempre uma curva e o outro uma linha reta.","tomar":"O Espírito acabará por tomar posse daquilo que lhe pertence — tudo o que em realidade existe — e as vozes do senso físico serão para sempre reduzidas a silêncio.","tornar":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","trabalhar":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","transformar":"Quando, comVencido o pelido pela sabedoria, Moisés lançou o bor­ medo à serpente dão ao chão e o viu transformar-se em ser­pente, fugiu dela; mas a sabedoria lhe ordenou que voltasse e pegasse a serpente, e então o medo de Moisés desapare­ ceu.","transmitir":"Gabriel tem a tarefa mais pacífica de transmitir o senso da presença constante do Amor sempre solícito.","tratar":"Meu método de tratar a fadiga se aplica a todos os males corpóreos, pois a Mente tem de ser, e é, suprema, absoluta e definitiva.","trazer":"É preciso trazer à luz o grandioso fato espiritual de que o homem é, não que será, imortal e perfeito.","triunfar":"O mesmo Amor divino que tornou inofensiva a víbora venenosa, que livrou os homens do óleo fervente, da fornalha ardente, das garras do leão, pode curar os doenOs milagres da tes em todas as épocas e triunfar sobre o pecado antiguidade e os contemporâneos e a morte.","unir":"Quando o homem mortal unir seus pensamentos sobre a existência com o que é espiritual e agir apenas como Deus age, já não andará tateando no escuro, nem se apeO homem mortal é gará à terra por não ter provado o céu.","usar":"Definição da Pode-se sempre encontrar o modo apropriado palavra alma de usar a palavra alma, substituindo-a pela palavra Deus, onde é necessário o significado divino.","utilizar":"Seu trabalho está feito e só precisamos utilizar a regra de Deus a fim de receber a Sua bênção, o que nos permite trabalhar pela nossa própria salvação.","valer":"Algum dia os dado por Deus mortais farão valer sua liberdade em nome de Deus Todo-Poderoso.","ver":"A lei moral, que tem o direito de absol ver ou condenar, sempre exige a reparação antes que os mortais possam ir “mais para cima”.","vencer":"A Ciência Cristã revela que é indispensável vencer o mundo, a carne e o mal, para assim destruir todo o erro.","viver":"Poucos compreenmais do que profissão de fé dem os preceitos divinos de Jesus para viver e para curar, ou a eles aderem.","voltar":"A Mente infinita não pode ter ponto de partida, nem pode voltar a limite algum."},"ADJECTIVE":{"absoluto":"Deus vinha ternamente me preparando durante muitos anos para receber essa revelação final do Princípio divino absoluto da cura mental científica.","aceitável":"Portanto, a semi-inanição não é aceitável para a sabedoria, e está igualmente longe da Ciência, na qual o existir é sustentado por Deus, a Mente.","acessível":"O mero pedido de que Deus cure os doentes não tem poder para Oração pelos tornar a presença divina, que está sempre ao doentes nosso alcance, mais acessível do que ela já é.","adequado":"O erro não é um filtro adequado pelo qual se possa discernir a verdade.","adorável":"Seja-me permitido dar aqui o que entendo ser o significado espiritual da Oração do Senhor: Pai nosso, que estás nos céus, Nosso Pai-Mãe Deus, todo-harmonioso, Santificado seja o Teu nome; Adorável Um e Uno.","agradável":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","alegre":"Hoje, embora se alegre com algum progresso, ela ainda se encontra como discípula solícita à porta celestial, esperando a Mente de Cristo.","amoroso":"Nessa ocasião, tomei conhecimento da Ciência Cristã e nunca esquecerei o momento sublime em que percebi que um Pai todo-amoroso está sempre comigo.","amplo":"Sabemos que se eles compreendessem a Ciência da cura pela Mente e se Intenções estivessem na posse do poder mais amplo que ela respeitadas outorga para beneficiar física e espiritualmente o gênero humano, eles se alegrariam conosco.","ansioso":"O antigo costume de não andar ansioso quanto ao alimento deixava o estômago e o intestino livres para funcionar em obediência à natureza, e dava ao evangelho a oportunidade de ser visto em seu excelente efeito sobre o corpo.","aparente":"O que é, então, esse aparente poder, independente de Deus, que causa e cura a doença?","apostólico":"Os Cientistas Cristãos têm de viver sob a constante pressão do manda mento apostólico de se retirar do mundo material e se apartar dele.","ardente":"Mesmo no cativeiro em nações estrangeiras, o Princípio divino fez maravilhas para o povo de Deus, na fornalha ardente e nos palácios dos reis.","ativo":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","audível":"A oração audível impressiona; dá solenidade e elevação momentâneas ao pensamento.","baixo":"A complacência com os motivos e propósitos maus faz de qualquer homem, que não esteja no mais baixo nível da natureza humana, um sofredor sem esperança.","básico":"A suposta existência de mais de uma mente foi o erro básico da idolatria.","belo":"O belo no caráter é também o bom, que une Afeto indissoluvelmente os elos dos afetos.","bem-aventurado":"E bem-aventurado é aquele que não achar em mim motivo de tropeço”.","bendito":"É cristã preciso ter o espírito de nosso bendito Mestre para falar a alguém sobre seus defeitos, e assim correr o risco de ser criticado pelos homens por fazer o que é certo e beneficiar o gênero humano.","benéfico":"Um perfume só se torna benéfico e agradável na proporção em que se espalha pelo ambiente.","benigno":"A essa altura o advogado da defesa concluiu sua argumentação e o Presidente do Supremo Tribunal, com ar benigno e Christian Science Practice Science and Health presence, comprehending and defining all law and evi‐ dence, explained from his statute-book, the Charge of the Bible, that any so-called law, which under‐ Chief Justice takes to punish aught but sin, is null and void.","bíblico":"Daí a oposição do homem sensual à Ciência da Alma O erro da e o significado do trecho bíblico: “O pendor da carnalidade carne é inimizade contra Deus”.","bondoso":"Tornei-me mais amável, mais honesto, mais bondoso para com meus semelhantes; adquiri também melhor discernimento e a capacidade de fazer o que é certo na hora certa.","brilhante":"Ela diz: “Sou incapaz de usar palavras brilhantes, porque não tenho instrução”.","capaz":"Alcançarás a Ciência perfeita da cura, quando O valor fores capaz de ler a mente humana dessa maneira da intuição e de discernir o erro que queres destruir.","carnal":"Mais vale o sofrimento que desperta a mente mortal de seu sonho carnal, do que os prazeres ilusórios O pecado que tendem a perpetuar esse sonho.","celestial":"Sua missão foi revelar a Ciência do existir celestial, provar o que Deus é, e o que Ele faz pelo homem.","científico":"A científico natureza do homem, assim compreendida, inclui tudo o que significam os termos “imagem” e “semelhança”, tais como são empregados nas Escrituras.","claro":"Isso é claro para aqueles que curam os doentes com base na Ciência.","coerente":"Q uando os seguidores da descobridora da Ciência Cristã lhe perguntam se é apropriado, vantajoso ou coerente fazer um estudo médico sistemático, ela procura O estudo lhes mostrar que, em circunstâncias normais, da medicina recorrer à fé em meios corpóreos tende a impedir aqueles que fazem essa concessão, de confiar por completo em que a Mente onipotente tem de fato todo o poder.","coeterno":"O homem imortal era e é a imagem ou ideia de Deus, a própria expressão infinita da Mente infinita, e o homem imortal é coexistente e coeterno com A verdadeira essa Mente.","completo":"A união das qualidades masculinas e femininas constitui o homem completo.","complexo":"Quando Jesus declara que “são os olhos a lâmpada do corpo”, certamente quer dizer que a luz depende da Mente, não do complexo de fluidos, cristalino, músculos, íris e pupila, que constituem o órgão da visão.","comum":"O médico comum crê na sua receita, e o farmacêutico crê no poder de suas drogas para salvar a Equívocos vida de um homem.","confiante":"Vi diante de mim o terrível conflito, o Mar Vermelho e o deserto; mas continuei a avançar, com fé em Deus, confiante de que a Verdade, a forte libertadora, me guiaria para a terra da Ciência Cristã, onde os Footsteps of Truth Science and Health of Christian Science, where fetters fall and the rights of man are fully known and acknowledged.","confiável":"A saúde não é um estado da matéria, mas da Mente; e os sentidos materiais não podem dar testemunho confiável no tocante à saúde.","consciente":"O conhecimento disso eleva o homem acima do solo, acima da terra e do seu ambiente, eleva-o à harmonia espiri tual consciente e ao eterno existir.","constante":"Gabriel tem a tarefa mais pacífica de transmitir o senso da presença constante do Amor sempre solícito.","contínuo":"Todavia, pelo estudo contínuo do livro, vieram naturalmente à luz pontos importantes em que a tradução precisava ser melhorada.","contrário":"Ciência e Saúde A oração ao contrário, graças por não sermos “como os demais homens”?","corporal":"É a consciência espiritual, não a corporal, que se faz necessária.","corpóreo":"Ninguém pode verdadeiramente afirmar que Deus seja um ser corpóreo.","correto":"O senso finito não alcança o significado correto O velho e o do Princípio infinito, Deus, nem de Sua imanovo homem gem infinita ou reflexo, o homem.","cristão":"Expressar vaidosamente sentimentos fervorosos nunca faz um cristão.","crítico":"Certo crítico disse que, para corroborar essa maravilhosa filosofia, a Ciência Cristã declara que tudo o que é mortal ou desarmonioso não tem origem, existência, nem realidade.","curado":"Se con­ segues eliminar inteiramente o medo, teu paciente é curado.","dedicado":"Paulo viu em Atenas um altar dedicado “ao Deus desco­ nhecido”.","definitivo":"A personificação da ideia espiritual foi de breve duração na vida terrena de nosso Mestre; mas “o seu reinado não terá fim”, pois o Cristo, a ideia de Deus, regerá finalmente todas as nações e todos os povos — de modo imperativo, absoluto e definitivo — com a Ciência divina.","demente":"Ele se deu conta do mal que fizera ao perseguir os cristãos, cuja religião não havia compreendido, e humildemente tomou o novo nome de Paulo.","demonstrável":"Todo preconceito desapareceu imediatamente ante as provas de que a Ciência Cristã é, de fato, a elucidação e a aplicação prática dos ensinamentos de Jesus, que são a verdade demonstrável: a mesma “ontem e hoje...","desanimado":"Nunca o assustes com alguma observação Evita falar desanimadora sobre seu restabelecimento, nem de doenças chames sua atenção para quaisquer sintomas de aspecto desfavorável; evita dizer em voz alta o nome da doença.","desarmonioso":"Um mortal descontente e desarmonioso não é um homem, assim como a dissonância não é música.","desconhecido":"Aquilo que é denominado matéria é desconhecido para o Espírito, que inclui em si mesmo toda a substância e é a Vida eterna.","desejável":"Um estado instável de transição, por si só, nunca é desejável.","desnecessário":"A riqueza pode tornar desnecessário o trabalho árduo ou evitar o mau humor nas relações matrimoniais, porém nada pode abolir os compro missos do casamento.","devoto":"O pensa dor adiantado que é cristão devoto, ao perceber Pecado e o alcance e a tendência da cura cristã e da Ciência penalidade dessa cura, lhes dará apoio.","difícil":"Não é mais A leitura dos difícil ler a mente que está ausente do que ler a pensamentos que está presente.","digno":"Ser digno de confiança constitui o alicerce da fé esclarecida.","distinto":"Sem uma natureza particularmente definida, os objetos e os seres seriam indistintos, como forasteiros em um mato emaranhado, e a criação estaria cheia de uma prole sem nome, desgarrada da Mente paterna.","divino":"Iremos nós implorar por algo divino mais, junto à fonte aberta da qual jorra mais do que aceitamos?","doente":"A oração que reforma o pecador e cura o doente é uma fé absoluta em que tudo é possível a Deus — uma compreensão espiritual acerca dEle, um amor isento de ego.","doloroso":"Dizes que um furúnculo é doloroso; mas isso é impossível, pois a matéria sem a mente não sente dor.","duradouro":"Mantém o pensamento firme no que é duradouro, no que é bom e no que é verda deiro e os terás na tua experiência, na proporção em que ocuparem teus pensamentos.","eficaz":"No silencioso santuário dos Invocação desejos fervorosos, temos de negar o pecado e eficaz declarar a totalidade de Deus.","efêmero":"Os filhos de Deus não se originam da matéria, A infinitude nem do pó efêmero.","elevado":"A mente masculina alcança um tom mais elevado por meio de certos elementos Elementos da feminina, enquanto que a mente feminina mentais ganha mais coragem e força por meio de qualidades masculi nas.","eloquente":"O poder da Ciência Cristã e do Amor eloquente divino é onipotente.","enfermo":"Se o corpo está enfermo, essa é apenas uma das crenças da mente mortal.","errado":"Qualquer influência que ponhas do Crença do lado da matéria, estás tirando da Mente que, de lado errado outro modo, teria preponderância sobre tudo mais.","errante":"Ciência e Saúde A ciência, a teologia e a medicina desorientada, nossa carreira errante se parece com o tatear do Ciclope de Homero na caverna”.","errôneo":"O segundo postulado errôneo é que o homem seja ao mesmo tempo mental e material.","essencial":"É porventura o erro que está restaurando um elemento essencial do Cristianismo — a saber, a cura divina, apostólica?","espiritual":"Durante cinquenta anos, essa tradução trouxe cura e compreensão espiritual ao campo de nossa língua.","espiritualizado":"Seu único sacerdote é o homem espiritualizado.","estranho":"Seria estranho que um amigo pudesse parecer menos do que belo.","eterno":"O Cristo eterno, Prazeres sua identidade espiritual, jamais sofreu.","exato":"É o antípoda exato da Mente imortal, da Verdade e da lei espiritual.","excelente":"O meio sobremodo excelente é a Ciência divina em todos os casos.","existente":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","falso":"Assim é que o homem real e ideal aparece, na proporção em que o falso e material desaparece.","fatal":"Eu demonstrei que essa é uma regra da Ciência divina, quando destruí a delusão de sofrimento resultante daquilo que se chama transgressão fatal de uma lei física.","favorável":"Nunca o assustes com alguma observação Evita falar desanimadora sobre seu restabelecimento, nem de doenças chames sua atenção para quaisquer sintomas de aspecto desfavorável; evita dizer em voz alta o nome da doença.","feliz":"Depois que o menino balbuciante aprendeu a dizer algumas palavras, pediu que o levassem de volta para a masmorra, e disse que nunca seria feliz em outro lugar.","fenomenal":"Hoje o poder sanador da Verdade é extensamente demonstrado como Ciência imanente, eterna, e não como exibição fenomenal.","fervente":"O mesmo Amor divino que tornou inofensiva a víbora venenosa, que livrou os homens do óleo fervente, da fornalha ardente, das garras do leão, pode curar os doenOs milagres da tes em todas as épocas e triunfar sobre o pecado antiguidade e os contemporâneos e a morte.","fiel":"A Ciência divina despedaça essas correntes e assim fica estabelecido o direito inato do homem, de ser fiel somente a seu Criador.","final":"Deus vinha ternamente me preparando durante muitos anos para receber essa revelação final do Princípio divino absoluto da cura mental científica.","finito":"Esse é um senso finito e mortal das coisas, que o Espírito imortal silencia para sempre.","firme":"A doutrina rabínica dizia: “Aquele que aceita uma só doutrina, firme na fé, nesse habita o Espírito Santo”.","físico":"Assim, o senso físico, por não discernir a verdadeira felicidade do existir, Harmonia coloca-a sobre uma base errônea.","forte":"Os perseguidores de Jesus dirigiram seu ataque mais forte justamente nesse ponto.","fraco":"Este último ponto fraco do pecado fará o criminoso afundar em uma noite sem estrelas.","frágil":"Mesmo quando senti e compreendi que estava curada, as pessoas constantemente diziam, por eu ser magra e de aspecto frágil: “Não estás bem; basta ver teu aspecto para saber isso”.","frutífero":"Os talentos que Ele dá, nós correção devemos tornar mais frutíferos.","fútil":"É fútil dizer falsidades sobre a Ciência divina, a qual destrói toda a desarmonia, quando o fato é que Pretextos para podes demonstrar a veracidade da Ciência.","genuíno":"O Cientista Cristão genuíno fortalece o poder mental e moral de seu paciente e lhe aumenta a espiritualidade, enquanto o restabelece fisicamente por meio do Amor divino.","glorioso":"Em prol desse glorioso resultado a Ciência Cristã acende a tocha da compreensão espiritual.","grande":"Q uando nosso grande Mestre foi a João para ser batizado, este ficou perplexo.","harmonioso":"Na Ciência divina, o universo, que inclui o homem, é espiritual, harmonioso e eterno.","honesto":"Na oração feita em público, frequentemente vamos além das nossas convicções, vamos além do desejo fervoroso e honesto.","horrível":"Ciência e Saúde A prática da Ciência Cristã visto com repugnância; ao contrário, isso deixa uma recor­ dação pungente, um sofrimento inconcebivelmente horrível para o respeito próprio.","humano":"O pecado só é perdoado quando Cancelamento do pecado humano destruído pelo Cristo — a Verdade e a Vida.","humilde":"Quando a lamentação Verdade é um mal do publicano se dirigiu ao grande coração do Amor, seu humilde desejo foi atendido.","ideal":"Assim é que o homem real e ideal aparece, na proporção em que o falso e material desaparece.","idêntico":"Isso prova que um é idêntico ao outro.","ignorante":"Esquecendo que é ignorante, acreditando que outra mente está falando por intermédio dela, a médium pode se tornar de uma eloquência incomum.","ilimitado":"Uma concepção mortal, corpórea ou finita a respeito de Deus não pode abranger as gló rias da Vida e do Amor incorpóreo e ilimitado.","imaculado":"Visto que Jesus deve ter sido tentado em todos os aspectos, ele, o imaculado, enfrentou e venceu o pecado em todas as suas formas.","imenso":"Em vista do trabalho imenso a realizar antes que esse reconhecimento da Ciência divina possa vir, é de alta importância volvermos nossos pensamentos para o Princípio divino, a fim de que a crença finita possa estar preparada para se desfazer de seu erro.","imoral":"Nunca respires uma atmosfera imoral, a não ser na tentativa de purificá-la.","imortal":"Só as alegrias mais elevadas podem satisfazer os anseios do homem imortal.","impassível":"As palavras carinhosas e a desprendida solicitude por aquilo que promove o bem-estar e a felicidade de tua esposa serão mais salutares para prolongar-lhe a saúde Renovados e os sorrisos, do que a indiferença impassível os tempos de namoro ou o ciúme.","imperfeito":"O homem não é, de maneira alguma, um ser material que germina do imperfeito e se esforça por alcançar o Espírito, como se este estivesse acima de sua origem.","importante":"Antes de decidir que o corpo, a A importante matéria, sofre de um distúrbio, deve-se pergundecisão tar: “Quem és tu que contestas o Espírito?","impossível":"Tal transformação em sentido contráAbismo rio é impossível na Ciência.","impuro":"É raio e furacão, tudo o que é mau, desonesto, impuro e apegado ao ego.","imutável":"A teologia judaica não fazia nenhuma alusão ao amor imutável de Deus.","inanimado":"Sem o Amor, a letra nada mais é do que o corpo morto da Ciência — sem pulso, frio, inanimado.","incapaz":"Tal pessoa permanece na Vida — vida obtida não do corpo, incapaz de sustentar a vida, mas da Verdade, que desdobra sua própria ideia imortal.","incessante":"O esforço habitual para sermos sempre bons é oração incessante.","incoerente":"Se a letra espiritual da Ciência Cristã lhes parece incoerente, eles precisam Some Objections Answered Science and Health gain the spiritual meaning of Christian Science, and then the ambiguity will vanish.","incomparável":"As teorias humanas não são adequa das para interpretar o Princípio divino presente nos milagres (maravilhas) operados por Jesus e especialmente no que se refere à sua poderosa, incomparável e triunfante saída da existência carnal, que coroou sua obra.","incompleto":"Por outro lado, a Ciência da Mente é de todo separada de qualquer conhecimento incompleto e inoportuno, porque a Ciência da Mente é de Deus e demonstra o Princípio divino, realizando os propósitos apenas do bem.","incorpóreo":"Uma concepção mortal, corpórea ou finita a respeito de Deus não pode abranger as gló rias da Vida e do Amor incorpóreo e ilimitado.","incorreto":"O Defesa raciocínio incorreto conduz a erro na prática.","independente":"O que é, então, esse aparente poder, independente de Deus, que causa e cura a doença?","indestrutível":"Se o meio utilizado para ouvir é inteiramente espiritual, então é normal e indestrutível.","indispensável":"A Ciência Cristã revela que é indispensável vencer o mundo, a carne e o mal, para assim destruir todo o erro.","individual":"Sua missão O divino Um foi tanto individual como coletiva.","inefável":"Qual das duas homenagens foi a mais significativa diante de tão inefável afeto: a hospitalidade do fariseu, ou a con­ trição da mulher de Magdala?","infalível":"A Ciência Cristã é infalível e Divina; o senso humano das coisas erra, porque é humano.","infinito":"Oramos para nos tornar melhores e para beneficiar aqueles que nos ouvem, para dar informações ao infinito e para ser Motivos ouvidos pelos homens?","inocente":"Nele, o Homem é julgado inocente de transgredir leis físicas, porque tais leis não existem.","inspirado":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","intelectual":"O intelectual, o moral, o espiritual — sim, a imagem da Mente infinita — sujeita à não-inteligência!","inteligente":"Eles também indicam o Princípio divino do existir científico, a relação inteligente de Deus com o homem e o universo.","intencional":"Ninguém se cura fisicamente no erro intencional ou por meio desse erro, assim como ninguém se salva moralmente no pecado ou por meio dele.","intenso":"W., Los Angeles, Califórnia, EUA Intenso sofrimento superado Durante aproximadamente cinco anos, padeci de reumatismo ciático de forma tão grave que meu corpo ficou deformado.","interior":"Naquele dia, começou a cura consciente, exterior e interior — mental e física.","inútil":"A obe­ diência às leis materiais de saúde havia sido inútil.","invisível":"Na Bíblia, Deus é representado dizendo: “Não Me poderás ver a face, porquanto homem Deus é invisível nenhum verá a Minha face e viverá”.","irracional":"Para obter bons resultados, certamente não é irracional contar a verdade sobre os fantasmas.","irreal":"É irreal, O mal é porque pressupõe a ausência de Deus, o oni­po­ negativo e autodestrutivo tente e onipresente.","jovem":"Ao perder seu crucifixo, uma jovem católica disse: “Nada mais me resta, senão Cristo”.","justo":"A Mente divina exige do homem, a justo título, toda obediência, afeto e força.","legítimo":"Não é legítimo deixar de comer, de beber ou de vestir-se materialmente, antes de haver alcançado, passo a passo, os fatos espirituais da existência.","limitado":"Visto que a Alma e o Espírito são um, Deus e a Alma são um, e esse um nunca está contido em uma mente limitada ou em um corpo limitado.","limpo":"Precisamos de um corpo limpo e de uma mente limpa — um corpo purificado pela Mente assim como lavado com água.","livre":"Então o prisioneiro se levantou, rege­ divino nerado, forte, livre.","lógico":"Li trechos que me pareceram muito lógicos e pensei comigo mesma: “Isto está mais perto da verdade do que qualquer outra coisa que eu conheço”.","luminoso":"Jesus orou; retirou-se dos sentidos materiais para revi gorar o coração com panoramas mais luminosos, mais espirituais.","maior":"Um só sacrifício, por maior Justiça e que seja, é insuficiente para pagar a dívida do substituição pecado.","majestoso":"É de fato a Os majestosos cidade do Espírito, bela, majestosa e simétrica.","material":"A Oração do Senhor é a oração da Alma, não do senso material.","mau":"Se Deus tivesse feito o homem tanto bom como mau, o homem teria de permanecer assim.","melhor":"Aquela que agora é considerada a melhor condição para a saúde orgânica e funMudanças cional do corpo humano poderá não mais ser corpóreas tida como indispensável à saúde.","mental":"Depois disso, publicaram-se vários livros sobre a cura mental, a maioria deles incorretos na teoria e cheios de plá gios de Ciência e Saúde.","metafísico":"Jesus curava a doença e o pecado pelo mesmo e único sistema metafísico.","misericordioso":"Eu havia perdido inteiramente a crença em um Deus todo-misericordioso e não sabia para onde me volver em busca de auxílio.","moral":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","mortal":"Crença Será finalmente constatado que a morte é um na morte sonho mortal que vem nas trevas e desaparece com a luz.","mutável":"O segundo relato descreve o homem como se fosse mutável, mortal — como se ele se tivesse separado da Deidade e estivesse girando em órbita própria.","natural":"Que a ira de Deus tenha se descarregado sobre Seu Filho bem-amado, não é divinamente natural.","necessário":"While the heart is far from Ciência e Saúde A oração imutavelmente certo fará o que é certo, sem que seja necessário lembrá-Lo de Seu dever.","negativo":"É irreal, O mal é porque pressupõe a ausência de Deus, o oni­po­ negativo e autodestrutivo tente e onipresente.","nobre":"Precisamos formar modelos perfeitos no pensamento e Modelos contemplá-los continuamente, senão nunca perfeitos os esculpiremos em uma vida sublime e nobre.","novo":"A semente que germinou tem nova forma e novo estado de existência.","onipotente":"— A doença, o pecado, o mal, a morte, negam o bem, o onipotente Deus, a Vida.","onipresente":"É irreal, O mal é porque pressupõe a ausência de Deus, o oni­po­ negativo e autodestrutivo tente e onipresente.","onisciente":"Ciência e Saúde Recapitulação um, e esse um é Deus, o Ser onipotente, onisciente e onipre­ sente, e Sua reflexão, Seu reflexo, é o homem e o universo.","oposto":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","original":"O desenho artístico da capa foi inspirado em uma decoração existente no edifício original dA Igreja Mãe, A Primeira Igreja de Cristo, Cientista, em Boston, Massachusetts.","paciente":"Poderiam ser cita dos milhares de casos em que a saúde foi restabelecida graças à mudança da forma de pensar do paciente quanto à morte.","pecaminoso":"O quarto simboliza o santuário do Espírito, cuja porta se fecha ao senso pecaminoso, mas deixa entrar a Verdade, a Vida e o Amor.","pequeno":"Podes saber que é a Verdade que começa a liderar, quando vês o pequeno número e a fidelidade de seus segui dores.","perfeito":"Deus criou tudo por meio da Mente e fez tudo perfeito e eterno.","perigoso":"Não deveríamos, então, considerar e a Verdade falso e perigoso o conhecimento assim obtido, visto que “pelo fruto se conhece a árvore”?","permanente":"O afeto permanente que a mãe sente pelo filho não pode ser desarraigado, porque o amor materno inclui pureza e constância, ambas imortais.","perverso":"The moral condition of such a man de‐ Ciência e Saúde A ciência, a teologia e a medicina com que o perverso “deixe...","pleno":"Antes que os pensamentos estejam em pleno repouso, os membros se desvanecem da consciência.","poderoso":"Sua teologia ensina a crença Três classes em um Deus misterioso, sobrenatural, e em um de neófitos diabo natural todo-poderoso.","positivo":"O homem material é constituído de erro voluntário e involuntário, de um bem negativo e de um mal positivo, e este último se autodefine como sendo o bem.","possível":"A oração que reforma o pecador e cura o doente é uma fé absoluta em que tudo é possível a Deus — uma compreensão espiritual acerca dEle, um amor isento de ego.","primário":"Poderia alguém achar sensato e bom criar o elemento primário, e depois castigar o que dele deriva?","profundo":"A humanidade se torna melhor graças a esse sistema de cura espiritual e profundo.","próprio":"Iremos nós pedir ao espiritual Princípio divino de todo o bem que faça Seu próprio traba lho?","puro":"O feto tem de ser mantido mentalmente puro, e o período de gestação deve ter a santidade da virgindade.","racional":"Não é racional dizer que a Mente seja infinita, mas que resida no finito — na matéria — ou que a matéria seja infinita e seja o instrumento da Mente.","radiante":"O sol radiante da vir­ tude e da verdade é simultâneo com o existir.","real":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","religioso":"Examinava todo ensinamento religioso com atenção calma e sem preconceitos.","responsável":"Ela diz: “A serpente me enganou, Falso conceito da e eu comi”, como se, em humilde penitência, disnatureza feminina sesse: “Nem o homem, nem Deus, é responsável por minha falta”.","sagrado":"Nenhuma Descanso no exaustão resulta da ação dessa Mente, de acordo trabalho sagrado com a compreensão da Ciência divina.","salutar":"Por mais obstinado que seja o caso, a insanidade, mais depressa do que a maioria das doenças, cede à A cura da ação salutar da verdade, que derrota o erro.","santo":"A doutrina rabínica dizia: “Aquele que aceita uma só doutrina, firme na fé, nesse habita o Espírito Santo”.","satisfeito":"Embora longe de estar satisfeito com meu estado, não sabia como melhorá-lo, até que li Ciência e Saúde.","saudável":"Se decides que o clima ou a atmosfera não é saudável, assim o será para ti.","seguro":"O direito ao harmonioso e eterno existir só se encontra seguro na Ciência divina.","semelhante":"A filosofia humana apresenta a Deus como se fosse semelhante ao homem.","sensato":"Quem não for capaz de explicar a Alma, sensato será em não tentar explicar o corpo.","sensível":"Eu não havia indagado dos honorários, nem sequer falei a ninguém sobre minhas intenções, pois dinheiro era uma questão muito sensível para mim.","sensual":"Daí a oposição do homem sensual à Ciência da Alma O erro da e o significado do trecho bíblico: “O pendor da carnalidade carne é inimizade contra Deus”.","separado":"Deus não está separado da sabedoria Perdão e que Ele outorga.","sereno":"Ela apresenta o veredicto sereno e claro da Verdade contra o erro, veredicto proferido e exemplificado pelos profetas, por Jesus, por seus apóstolos, tal como consta na Bíblia inteira.","silencioso":"No silencioso santuário dos Invocação desejos fervorosos, temos de negar o pecado e eficaz declarar a totalidade de Deus.","simples":"Os outros mortais também não efetuam a mudança do erro para a verdade com um simples salto.","sincero":"Espero que desperte o interesse de alguém que ande em busca da verdade, e desejo expressar meu amor sincero à nossa amada Líder, que nos deu a “Chave das Escrituras”.","sistemático":"A outra, a religião popular, se recusa a admitir que a religião de Cristo tenha exercido algum poder sanador sistemático após o primeiro século.","soberano":"A coragem moral é “o leão da tribo de Judá”, o soberano do reino mental.","sobrenatural":"Sua teologia ensina a crença Três classes em um Deus misterioso, sobrenatural, e em um de neófitos diabo natural todo-poderoso.","sublime":"Apoiado nessa base espirisublime tualmente científica Jesus explicou as suas curas, que pareciam milagrosas aos estranhos.","suficiente":"A sabedoria do homem não é suficiente para autorizá-lo a dar conselhos a Deus.","superior":"Se a Mente vem antes de tudo e é superior, confiemos só na Mente, que não necessita da cooperação de poderes inferiores, mesmo se esses chamados poderes fossem reais.","supremo":"A supremo Ciência divina revela que é preciso haver suficiente sofri mento, ou antes ou depois da morte, para extinguir o amor ao pecado.","tangível":"A individualidade do homem não é menos tangível por ser espiritual e por sua vida não estar à mercê da matéria.","temporal":"O temporal e o material não são, pois, criações do Espírito.","temporário":"Parecia-me que eu já havia engolido todos os medicamentos conhecidos para me curar da indigestão, mas estes propiciavam apenas alívio temporário.","total":"Antes da destruição total As horas mais do erro, haverá interrupções na rotina geral e escuras de todas material.","tranquilo":"É o “cicio tranquilo e suave”, a voz da Receptividade Verdade a se manifestar.","transcendental":"Aqui, o texto original declara nitidamente o fato espiritual concernente ao existir, isto é, a existência eterna e harmoniosa do homem como imagem, ideia, em vez de como matéria (por mais transcendental que tal pensamento pareça), e assegura que esse fato não deve ser para sempre rebaixado pela crença de que o homem seja carne e matéria, pois, de acordo com esse erro, o homem seria mortal.","transitório":"Constata-se que sua vida não é a Vida, mas apenas um senso errôneo, transitório, de uma existência que acaba na Os maus morte.","triste":"Serviço divino É triste que a expressão serviço divino tenha e adoração vindo, de maneira tão generalizada, a significar adoração pública, em vez de obras diárias.","último":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","único":"Reconhecia o Espírito, Deus, como o único Criador, e portanto como o Pai de todos.","universal":"O Amor é imparcial e universal na sua adaptação e nas suas dádivas.","útil":"Conhecimento Deveríamos abandonar a base da matéria e útil aceitar a Ciência metafísica e seu Princípio divino.","verdadeiro":"Foi o Princípio divino de todo o verdadeiro existir, que ele ensinou e pôs em prática.","vigoroso":"Seu começo será manso, seu crescimento, vigoroso e sua maturi dade será sem declínio.","visível":"Não será a moral dessa parábola uma profecia que prediz a segunda manifestação do Cristo, a Verdade, na carne, manifestação essa encoberta em santo sigilo ao mundo visível?","vital":"A parte vital, o coração e a alma da Ciência Cristã, é o Amor.","vitorioso":"Seus alunos viram esse poder da Verdade curar os doentes, expul sar os males, ressuscitar os mortos; mas o apogeu dessa obra maravilhosa não foi discernido espiritualmente nem mesmo por eles, até depois da crucificação, quando o Mestre imaculado lhes apareceu, vitorioso sobre a doença, o pecado, a enfermidade, a morte e o túmulo.","vivo":"É o Cristo vivo, a Verdade posta primordial em prática, que faz de Jesus “a ressurreição e a vida” para todos os que o seguem em seus atos."},"ADVERB":{"abertamente":"Se nossas súplicas forem sinceras, nos empenharemos pelo que pedimos; e nosso Pai, que vê em secreto, nos recompensará abertamente.","absolutamente":"Não podemos obedecer ao mesmo tempo à fisiologia e ao Espírito, pois um absolutamente destrói o outro, e só um deles tem de ser supremo nos afetos.","agora":"Pois vos digo que, de agora em diante, não mais beberei do fruto da videira, até que venha o reino de Deus.","ainda":"Mais tarde, a língua dá voz ao pensamento mais definido, embora ainda imperfeitamente.","além":"Na oração feita em público, frequentemente vamos além das nossas convicções, vamos além do desejo fervoroso e honesto.","altamente":"Receitei a quarta atecurada sem drogas nuação de argentum nitratum e de vez em quando doses altamente atenuadas de sulphuris.","anteriormente":"A causa remota ou crença remota de doença não é perigosa por ter se apresentado anteriormente, nem por haver conexão entre os pensamentos mortais do passado e os do presente.","antes":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","apenas":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","aqui":"Aqui a palavra mãos é usada metaforicamente, como a palavra destra é usada no texto “A destra do Senhor se eleva”.","assim":"Por isso, vos digo que tudo quanto em oração pedirdes, crede que recebestes, e será assim convosco.","até":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","atualmente":"Esse fato parece atualmente mais misterioso do que o próprio Science, Theology, Medicine Science and Health the miracle itself.","bastante":"A homeopatia leva bastante em conside­ ração os sintomas mentais no diagnóstico da doença.","bem":"Iremos nós pedir ao espiritual Princípio divino de todo o bem que faça Seu próprio traba lho?","cedo":"Mais cedo ou mais tarde todos têm de ancorar-se em Cristo, a verdadeira ideia de Deus.","certamente":"Isso certamente se aplica à Verdade e ao Amor, compreendidos e postos em prática.","cientificamente":"A maior ou menor capacidade de um Cientista Cristão para discernir cientificamente o pensamento depende de sua espiritualidade genuína.","claramente":"Um dos autores do Novo Testamento descreve claramente a fé, uma qualidade da mente, como “a substância das coisas que se esperam”*.","completamente":"A época atual ainda não superou completamente o senso das crenças em fantasmas.","constantemente":"Se o pesar causa sofrimento, convence tu o sofredor de que a aflição é muitas vezes a fonte da alegria, e que ele deve se regozijar constantemente no Amor sempre presente.","continuamente":"matéria Por meio desse antagonismo, a mente mortal tem de continuamente debilitar seu próprio pretenso poder.","corretamente":"A obediência é garantida somente pela compreensão correta a respeito dEle, e conhecê-Lo corretamente é a Vida eterna.","de fato":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","definitivamente":"Nosso Mestre demonstrou plena e definitivamente a Ciência divina em sua vitória sobre a morte e o túmulo.","depois":"Depois disso, publicaram-se vários livros sobre a cura mental, a maioria deles incorretos na teoria e cheios de plá gios de Ciência e Saúde.","diariamente":"Ela conseguiu que a referida senhora lhe emprestasse seu exemplar de Ciência e Saúde por duas horas, diariamente, durante oito dias, e ficou curada.","diretamente":"A ação orgânica e a secreção das vísceras obedecem à direção da mente mortal, tão diretamente como o braço obedece a essa direção.","divinamente":"Que a ira de Deus tenha se descarregado sobre Seu Filho bem-amado, não é divinamente natural.","então":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","erroneamente":"Visto que é a mente mortal que cultiva o erro, ela deve ser instruída a não causar dano ao corpo e a arrancar aquilo que semeou erroneamente.","especialmente":"Estou especialmente agradecida pela ajuda espiritual que recebi.","espiritualmente":"Se o discípulo está se adiantando espiritualmente, é porque está se esforçando por entrar no reino espiritual.","eternamente":"Em verdade, em verdade vos digo: Se alguém guardar a minha palavra, não verá a morte, eternamente.","evidentemente":"A revelação da Verdade me veio à compreensão aos poucos, e evidentemente pelo poder divino.","exatamente":"A reputação de Jesus era exatamente o oposto de seu caráter.","facilmente":"O cristão pode provar isso hoje, tão facilmente como foi provado séculos atrás.","felizmente":"Os estudantes de Ciência Cristã, que começam com a letra dessa Ciência e pretendem ter êxito sem o espírito, ou farão naufragar sua fé ou, infelizmente, tomarão Tesouro a direção errada.","finalmente":"Crença Será finalmente constatado que a morte é um na morte sonho mortal que vem nas trevas e desaparece com a luz.","frequentemente":"Na oração feita em público, frequentemente vamos além das nossas convicções, vamos além do desejo fervoroso e honesto.","geralmente":"A ciência natural, tal como é geralmente chamada, não é realmente natural nem científica, porque é deduzida da evidência dos sentidos materiais.","hoje":"Deus “ontem e hoje, é o mesmo e o será para sempre”; e Aquele que é Prayer Science and Health He who is immutably right will do right without being reminded of His province.","honestamente":"Nesse caso, como poderia uma mãe declarar honestamente o regozijo bíblico: “Adquiri um Direito varão vindo do Senhor”*?","humanamente":"O fardo daquela hora foi mais terrível do que se pode conceber humanamente.","humildemente":"Ele se deu conta do mal que fizera ao perseguir os cristãos, cuja religião não havia compreendido, e humildemente tomou o novo nome de Paulo.","igualmente":"Se o mal fosse tão real quanto o bem, então o mal seria igualmente imortal.","imediatamente":"Imediatamente lhe apareceram os sintoimaginária mas dessa doença, e o homem morreu.","inevitavelmente":"A Ciência inevitavelmente eleva o nosso existir mais ao alto na escala da harmonia e da felicidade.","infelizmente":"Os estudantes de Ciência Cristã, que começam com a letra dessa Ciência e pretendem ter êxito sem o espírito, ou farão naufragar sua fé ou, infelizmente, tomarão Tesouro a direção errada.","infinitamente":"A eficácia da oferenda espiritual de Jesus é infinitamente maior do que se pode expressar pela noção que temos de Carne e sangue sangue humano.","inicialmente":"Se ele cura a enfermidade por meio de uma crença, uma vez que inicialmente foi uma crença que causou a enfermidade, trata-se de um caso em que o erro maior vence o menor.","injustamente":"Quando a Ciência Cristã e o magnetismo animal forem ambos compreendidos, como o serão em data não distante, ficará evidente por que a autora deste livro foi tão injustamente perseguida e caluniada por lobos disfarçados de ovelhas.","instantaneamente":"Fiquei curada instantaneamente pela Ciência Cristã e estou grata a Deus por ter-nos dado essa compreensão por meio da Sra.","inteiramente":"Estar “com o Senhor” é obedecer à lei de Deus, é ser inteiramente governado pelo Amor divino — pelo Espírito, não pela matéria.","intensamente":"Certa vez fiquei de cama onze semanas, sofrendo intensamente durante todo o tempo, salvo quando recebia alívio com injeções hipodérmicas.","jamais":"O orgulho e o medo não estão capacitados para carregar o estandarte da Verdade, e Deus jamais o colocará em tais mãos.","juntos":"Se meus amigos vão à Europa, enquanto estou a caminho da Califórnia, não viajamos juntos.","lentamente":"Na atualidade, os mor tais progridem lentamente, por medo de serem A base da religião julgados ridículos.","livremente":"E o Senhor Deus [Jeová] deu esta ordem ao homem: De toda árvore do jardim comerás livremente, mas da árvore do conhecimento do bem e do mal não comerás; porque no dia em que dela comeres, certamente morrerás.* Essa metáfora representa a Deus, o Amor, tentando o homem, mas o Apóstolo Tiago diz: “Deus não pode ser tentado pelo mal e Ele mesmo a ninguém tenta”.","logo":"Tens de controlar os maus pensamentos logo que surgem, do contrário serão eles que, em seguida, te controlarão.","longe":"Enquanto o coração está longe da Verdade e do Prayer Science and Health divine Truth and Love, we cannot conceal the ingrati‐ tude of barren lives.","mais":"Mais tarde, a língua dá voz ao pensamento mais definido, embora ainda imperfeitamente.","materialmente":"Não é aos sentidos materialmente, mas espiritualmente, que nós O conhecemos como a Mente divina, como a Vida, a Verdade e o Amor.","mentalmente":"O feto tem de ser mantido mentalmente puro, e o período de gestação deve ter a santidade da virgindade.","moralmente":"Seu julgamento foi uma tragédia e é moralmente ilegal.","muito":"Um magistrado às vezes remite a pena, mas isso pode não ser um benefício moral para o criminoso e, quando muito, apenas o livra de uma das formas de Remissão da pena castigo.","naturalmente":"Todavia, pelo estudo contínuo do livro, vieram naturalmente à luz pontos importantes em que a tradução precisava ser melhorada.","necessariamente":"A Mente não depende necessariamente de processos educativos.","novamente":"Agora que o evangelho da cura é novamente pregado à beira do caminho, não o despreza às vezes o púlpito?","nunca":"Expressar vaidosamente sentimentos fervorosos nunca faz um cristão.","originalmente":"O que chamas matéria era é inteligente originalmente erro em dissolução, mente mortal rudimentar — que Milton comparou com o “caos e a antiga noite”.","perfeitamente":"As falhas pulmonares desapareceram e respiro perfeitamente; raras vezes fico resfriada, e não tenho nem sinal de tosse.","plenamente":"Nunca pode estar presa, nem ser plenamente manifestada pela corporalidade.","profundamente":"Para a autora eles são transparentes, pois contêm o aspecto profundamente divino da Bíblia.","puramente":"Nenhum sistema de saúde, a não ser a Ciência Cristã, é puramente mental.","rapidamente":"Um livro apresenta pensamentos novos, mas não pode fazer com que sejam rapidamente compreendidos.","realmente":"O pão celestiais que eles receberam realmente descera do céu.","sempre":"Deus “ontem e hoje, é o mesmo e o será para sempre”; e Aquele que é Prayer Science and Health He who is immutably right will do right without being reminded of His province.","silenciosamente":"Assegura-lhes, silenciosamente, que não estão sujeitos a doenças e perigos.","simplesmente":"Não é pessoa, nem lugar, nem coisa, mas é simplesmente uma crença, uma ilusão do senso material.","somente":"A obediência é garantida somente pela compreensão correta a respeito dEle, e conhecê-Lo corretamente é a Vida eterna.","suavemente":"As pálpebras se fecharam suavemente e a respiração se tornou natural; ele estava dormindo.","suficientemente":"Se formos suficientemente bons para nos beneficiar do cálice das aflições terrenas de Jesus, Deus nos sustentará nessas aflições.","supremamente":"Para teres um só Deus e te valeres do poder do Espírito, tens de amar a Deus supremamente.","também":"O desenho da capa também é propriedade dO Conselho de Diretores da Ciência Cristã e, com algumas exceções, não pode ser reproduzido sem autorização.","temporariamente":"Pode-se afirmar que não curam, mas apenas A verdadeira cura aliviam temporariamente o sofrimento, substié transcendente tuindo uma doença por outra.","totalmente":"Não me foi difícil aceitar a Bíblia inteira, não podia mesmo deixar de fazê-lo, pois estava totalmente cativado.","verdadeiramente":"Ninguém pode verdadeiramente afirmar que Deus seja um ser corpóreo.","visivelmente":"Mas esse granEvidência dioso fato não é apoiado visivelmente por evidên­ científica cias perceptíveis, até que seu Princípio divino seja demonstrado mediante a cura dos doentes, e assim provado absoluto e divino."},"CONJUNCTION":{"à medida que":"Os filhos de Deus já existem e só serão percebidos à medida que o homem descobrir a verdade a respeito do existir.","ainda que":"Ainda que respeitemos tudo o que há de bom na Igreja ou fora dela, nossa consagração ao Cristo baseia-se mais em demonstrar do que em professar a fé.","além disso":"Além disso, eu fumava sem parar e fazia uso de tabaco em alguma forma, quase constantemente.","antes que":"Deus, o vosso Pai, sabe o de que tendes necessidade, antes que Lho peçais.","ao passo que":"Consideram a mente humana um agente ativo na cura, ao passo que essa mente não faz parte do Princípio da Ciência Cristã.","apesar":"Apesar da perseguição que isso lhe causou, usava seu poder divino para salvar os homens tanto corporal como espiritualmente.","apesar de":"Nunca Apoio digas aos doentes que apesar de sua coragem animador eles não têm forças.","assim":"Por isso, vos digo que tudo quanto em oração pedirdes, crede que recebestes, e será assim convosco.","assim que":"É assim que continua a crença adâmica, da qual a vida mortal e material é o sonho.","até":"Sempre há de ser assim, até aprendermos que não há descontos na lei da justiça e que temos de pagar “o último centavo”.","caso":"Como é que foram multiplicados os pães e os peixes nas margens do mar da Galileia — e nesse caso também, sem farinha nem células de onde pudessem vir o pão e o peixe?","como":"A oração não deve ser utilizada como confessionário para cancelar o pecado.","conforme":"Quando o doente se restabelece com o uso de drogas, o que cura é a lei de uma crença generalizada, que culmina em fé individual; e conforme essa fé será o efeito.","contudo":"Contudo, é surpreenda mulher dente que por costume se conceda à mulher menos direitos do que lhe concede a Ciência Cristã ou a civilização.","embora":"Mais tarde, a língua dá voz ao pensamento mais definido, embora ainda imperfeitamente.","enquanto":"Enquanto o coração está longe da Verdade e do Prayer Science and Health divine Truth and Love, we cannot conceal the ingrati‐ tude of barren lives.","então":"Por que então atribuir essa inspiração a um rito morto, em vez de mostrar, com expulsar o erro e tornar o corpo “santo e agradável a Deus”, que a Verdade veio à compreensão?","entre":"Distingue entre a Verdade, que é isenta de pecado, e a falsidade do senso pecaminoso.","entretanto":"Entretanto, nos casos em que o significado da Bíblia em português diverge dos versículos da Bíblia citados por Mary Baker Eddy, essas citações foram traduzidas diretamente do texto inglês.","logo":"Tens de controlar os maus pensamentos logo que surgem, do contrário serão eles que, em seguida, te controlarão.","logo que":"Tens de controlar os maus pensamentos logo que surgem, do contrário serão eles que, em seguida, te controlarão.","nem":"Nem mesmo Cristo pode reconciliar a Verdade com o erro, pois a Verdade e o erro são irreconciliáveis.","pois":"Pois Deus é infinito, todo o poder, toda a Vida, toda a Verdade, todo o Amor; está acima de tudo, e é Tudo.","pois que":"Depois que o menino balbuciante aprendeu a dizer algumas palavras, pediu que o levassem de volta para a masmorra, e disse que nunca seria feliz em outro lugar.","por":"Por isso, vos digo que tudo quanto em oração pedirdes, crede que recebestes, e será assim convosco.","por exemplo":"Por exemplo: não há dor na Verdade, e não há verdade na Inversões dor; não há nervo na Mente, e não há mente no metafísicas nervo; não há matéria na Mente, e não há mente na matéria; não há matéria na Vida, e não há vida na matéria; não existe matéria no bem, e não existe o bem na matéria.","porém":"A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o espírito de Deus pairava por sobre as águas.","porquanto":"Na Bíblia, Deus é representado dizendo: “Não Me poderás ver a face, porquanto homem Deus é invisível nenhum verá a Minha face e viverá”.","porque":"Jesus sofreu por nossos pecados, não para anular a sentença divina aplicada ao pecado de alguém, mas porque o pecado acarreta inevitável sofrimento.","portanto":"Nosso Mestre disse: “Portanto, vós A oração de orareis assim”, e a seguir deu aquela oração que Jesus Cristo abrange todas as necessidades humanas.","quando":"A teologia e a física ensinam que o Espírito e a matéria são ambos reais e bons, quando de fato é o Espírito que é bom e real, e a matéria é o oposto do Espírito.","que":"Todavia, pelo estudo contínuo do livro, vieram naturalmente à luz pontos importantes em que a tradução precisava ser melhorada.","se assim":"Se assim permanente não fosse, o homem seria rapidamente aniquilado.","se não":"Se não nos elevamos acima da fé cega, não chegamos à Ciência da cura, nem compreendemos que a existência está na Alma, e não está nos sentidos.","senão":"O bem nos afetos humanos tem de predominar sobre o mal, e a natureza espiritual, sobre aquilo que é animal, senão a felicidade jamais será alcançada.","visto":"Visto que Deus é Tudo-em-tudo, Ele precedência fez o medicamento; mas esse medicamento era a Mente.","visto que":"Visto que Deus é Tudo-em-tudo, Ele precedência fez o medicamento; mas esse medicamento era a Mente."}};

const SH_POS_LABELS = {
  NOUN: "Nouns",
  VERB: "Verbs",
  ADJECTIVE: "Adjectives",
  ADVERB: "Adverbs",
  CONJUNCTION: "Conjunctions",
  PREPOSITION: "Prepositions",
  OTHER: "Other",
};

// English translations for all S&H vocab words
const SH_VOCAB_EN = {
  NOUN: {"o abandono":"abandonment","o abismo":"abyss","a abordagem":"approach","o aborrecimento":"annoyance","o abscesso":"abscess","o absurdo":"absurdity","os abusos":"abuses","o abutre":"vulture","a ação":"action","o acaso":"chance","a aceitação":"acceptance","os acidentes":"accidents","o aço":"steel","as ações":"actions","os acordes":"chords","o acréscimo":"increase","a acumulação":"accumulation","a acusação":"accusation","o acusador":"accuser","Adão":"Adam","a adaptação":"adaptation","a adesão":"adherence","a adição":"addition","a adolescência":"adolescence","a adoração":"worship","os adoradores":"worshippers","o adultério":"adultery","o adversário":"adversary","o advogado":"lawyer","a afeição":"affection","o afeto":"affection","os afetos":"affections","a afinidade":"affinity","a aflição":"affliction","as aflições":"afflictions","o agente":"agent","os agentes":"agents","o agnosticismo":"agnosticism","a agonia":"agony","a água":"water","as águas":"waters","a ajuda":"help","a alegria":"joy","as alegrias":"joys","a aliança":"covenant","o alimento":"nourishment","o alívio":"relief","a alma":"soul","as almas":"souls","o altar":"altar","a alteração":"alteration","o Altíssimo":"the Most High","o aluno":"student","os alunos":"students","a ambição":"ambition","o ambiente":"environment","o amor":"love","o amor cristão":"Christian love","o amor divino":"divine Love","a análise":"analysis","a analogia":"analogy","o anjo":"angel","os anjos":"angels","a ansiedade":"anxiety","a aparência":"appearance","as aparências":"appearances","o apóstolo":"apostle","os apóstolos":"apostles","o Apóstolo Paulo":"Apostle Paul","o ar":"air","o arrependimento":"repentance","a arte":"art","a árvore":"tree","a árvore do conhecimento":"tree of knowledge","a árvore da vida":"tree of life","a ascensão":"ascension","a aspiração":"aspiration","o ateísmo":"atheism","a atenção":"attention","a atitude":"attitude","o ato":"act","a atração":"attraction","o atributo":"attribute","os atributos":"attributes","a autoridade":"authority","a balança":"scales","o barbarismo":"barbarism","a base":"basis","a batalha":"battle","o batismo":"baptism","a beleza":"beauty","o bem":"good","o bem-estar":"well-being","a benção":"blessing","a bênção":"blessing","as bênçãos":"blessings","o benefício":"benefit","a Bíblia":"the Bible","a blasfêmia":"blasphemy","a bondade":"goodness","a bondade divina":"divine goodness","a busca":"search","a cabeça":"head","o caminho":"way","os caminhos":"ways","o campo":"field","o câncer":"cancer","o cântico":"song","o caos":"chaos","a capacidade":"capacity","o caráter":"character","a caridade":"charity","a carnalidade":"carnality","a carne":"flesh","a casa":"house","o casamento":"marriage","a castidade":"chastity","o castigo":"punishment","a causa":"cause","a causalidade":"causality","o cérebro":"brain","a certeza":"certainty","o ceticismo":"skepticism","o céu":"heaven","os céus":"heavens","a ciência":"science","a Ciência Cristã":"Christian Science","a Ciência divina":"divine Science","o cientista":"scientist","o Cientista Cristão":"Christian Scientist","a clareza":"clarity","a consciência":"conscience","a consciência humana":"human consciousness","o conselho":"counsel","a consequência":"consequence","o conforto":"comfort","a confusão":"confusion","o conhecimento":"knowledge","a coragem":"courage","o coração":"heart","os corações":"hearts","o corpo":"body","a corporalidade":"corporeality","os corpos":"bodies","a cortesia":"courtesy","a crença":"belief","as crenças":"beliefs","a crença humana":"human belief","o crente":"believer","o crescimento":"growth","a criação":"creation","a criança":"child","as crianças":"children","a criatura":"creature","Cristo Jesus":"Christ Jesus","Cristo":"Christ","o Cristo":"the Christ","a crucifixão":"crucifixion","a cruz":"cross","a cura":"healing","a cura divina":"divine healing","a dádiva":"gift","a decisão":"decision","a declaração":"declaration","o declínio":"decline","o defeito":"defect","a defesa":"defense","a definição":"definition","a deidade":"deity","a demência":"dementia","a demonstração":"demonstration","a denominação":"denomination","o desânimo":"discouragement","a desarmonia":"disharmony","o descanso":"rest","a descoberta":"discovery","a descrença":"unbelief","o desejo":"desire","os desejos":"desires","o desenvolvimento":"development","o desespero":"despair","a destruição":"destruction","a determinação":"determination","Deus":"God","o Deus":"God","o diabo":"devil","o diagnóstico":"diagnosis","a diferença":"difference","a dificuldade":"difficulty","a dignidade":"dignity","o discernimento":"discernment","a disciplina":"discipline","o discípulo":"disciple","os discípulos":"disciples","a discórdia":"discord","a distinção":"distinction","a divindade":"divinity","a divisão":"division","a doença":"disease","as doenças":"diseases","a doença mental":"mental illness","os doentes":"the sick","o dogma":"dogma","os dogmas":"dogmas","o dom":"gift","o domínio":"dominion","a dor":"pain","as dores":"pains","a doutrina":"doctrine","as doutrinas":"doctrines","a dúvida":"doubt","a educação":"education","o efeito":"effect","o ego":"ego","o egoísmo":"selfishness","a eletricidade":"electricity","a elevação":"elevation","a eloquência":"eloquence","a emoção":"emotion","a energia":"energy","a energia divina":"divine energy","a enfermidade":"infirmity","o engano":"deception","o ensinamento":"teaching","os ensinamentos":"teachings","o entendimento":"understanding","o equilíbrio":"balance","a era":"era","o erro":"error","os erros":"errors","a Escritura":"Scripture","as escrituras":"scriptures","a escuridão":"darkness","a esfera":"sphere","a esperança":"hope","o Espírito":"Spirit","o Espírito Santo":"Holy Spirit","a espiritualidade":"spirituality","a espiritualização":"spiritualization","a essência":"essence","a estabilidade":"stability","o estado":"state","a eternidade":"eternity","a ética":"ethics","o eu":"the self","o evangelho":"gospel","a evidência":"evidence","a evolução":"evolution","a existência":"existence","a expiação":"atonement","a expressão":"expression","a fé":"faith","a febre":"fever","a felicidade":"happiness","o fenômeno":"phenomenon","os fenômenos":"phenomena","a fidelidade":"fidelity","a filosofia":"philosophy","o fim":"end","a força":"force","as forças":"forces","a forma":"form","a formação":"formation","a fraternidade":"brotherhood","a fraude":"fraud","o fruto":"fruit","os frutos":"fruits","o fundamento":"foundation","os fundamentos":"foundations","o futuro":"future","a generosidade":"generosity","a glória":"glory","a glória de Deus":"glory of God","o gosto":"taste","o governo":"government","a graça":"grace","a graça celestial":"celestial grace","a grandeza":"greatness","a gratidão":"gratitude","o guia":"guide","a harmonia":"harmony","a herança":"inheritance","a hipocrisia":"hypocrisy","a hipótese":"hypothesis","as hipóteses":"hypotheses","a história":"history","o homem":"man","o homem mortal":"mortal man","o homem verdadeiro":"true man","os homens":"men","a humildade":"humility","a ignorância":"ignorance","a igreja":"church","as igrejas":"churches","a igualdade":"equality","a iluminação":"illumination","a ilusão":"illusion","as ilusões":"illusions","a imagem":"image","as imagens":"images","a imaginação":"imagination","a imoralidade":"immorality","a imortalidade":"immortality","a imperfeição":"imperfection","a impossibilidade":"impossibility","a incapacidade":"incapacity","a individualidade":"individuality","a inércia":"inertia","a infância":"childhood","o inferno":"hell","o infinito":"the infinite","a infinitude":"infinitude","a influência":"influence","a ingratidão":"ingratitude","o inimigo":"enemy","os inimigos":"enemies","a inimizade":"enmity","a iniquidade":"iniquity","a injustiça":"injustice","a inocência":"innocence","a insanidade":"insanity","a inspiração":"inspiration","a instituição":"institution","as instituições":"institutions","a instrução":"instruction","a integridade":"integrity","a inteligência":"intelligence","a intenção":"intention","a intuição":"intuition","a ira":"wrath","a irmã":"sister","o irmão":"brother","o jardim":"garden","Jeová":"Jehovah","o Jeová":"Jehovah","a Jerusalém":"Jerusalem","Jesus":"Jesus","o Jesus":"Jesus","João":"John","a jornada":"journey","o júbilo":"jubilation","o judaísmo":"Judaism","a justiça":"justice","a justiça divina":"divine justice","a justificação":"justification","a juventude":"youth","a lealdade":"loyalty","a lei":"law","a lei da matéria":"law of matter","as leis":"laws","a liberdade":"freedom","a libertação":"liberation","a lição":"lesson","as lições":"lessons","a lógica":"logic","Logos":"Logos","a loucura":"madness","o louvor":"praise","a lua":"moon","o lugar":"place","a luta":"struggle","a luz":"light","a mãe":"mother","a magia":"magic","o magnetismo":"magnetism","o mal":"evil","a maldade":"wickedness","a maldição":"curse","a maneira":"manner","a manifestação":"manifestation","a mansidão":"meekness","a mão":"hand","as mãos":"hands","o mar":"sea","a maravilha":"marvel","os mártires":"martyrs","o martírio":"martyrdom","a matéria":"matter","a materialidade":"materiality","o materialismo":"materialism","a maternidade":"motherhood","a mediação":"mediation","o mediador":"mediator","o medicamento":"medicine","a medicina":"medicine","o médico":"doctor","os médicos":"doctors","o medo":"fear","a memória":"memory","a mensagem":"message","a mente":"mind","a Mente divina":"divine Mind","a mente humana":"human mind","a mente mortal":"mortal mind","a mentira":"lie","a metafísica":"metaphysics","o metafísico":"metaphysician","o milagre":"miracle","os milagres":"miracles","a misericórdia":"mercy","a missão":"mission","o mistério":"mystery","a moral":"morality","a moralidade":"morality","a morte":"death","a motivação":"motivation","o movimento":"movement","a mudança":"change","o mundo":"world","a nação":"nation","o nada":"nothingness","a natureza":"nature","a natureza divina":"divine nature","a necessidade":"necessity","o nome":"name","os nomes":"names","a obediência":"obedience","o objetivo":"objective","a obra":"work","as obras":"works","a oração":"prayer","a ordem":"order","a origem":"origin","a originalidade":"originality","o osso":"bone","os ossos":"bones","a paciência":"patience","a paciente":"patient (f)","o paciente":"patient (m)","os pacientes":"patients","o pai":"father","o Pai-Mãe":"Father-Mother","os pais":"parents","a paixão":"passion","a palavra":"word","as palavras":"words","a parábola":"parable","o paraíso":"paradise","a paz":"peace","o pecado":"sin","o pecador":"sinner","os pecadores":"sinners","os pecados":"sins","a pedra":"stone","o pensamento":"thought","os pensamentos":"thoughts","a percepção":"perception","a perda":"loss","a perfeição":"perfection","a permanência":"permanence","a perseguição":"persecution","a perseverança":"perseverance","a perturbação":"disturbance","a pesquisa":"research","a pessoa":"person","as pessoas":"people","o poder":"power","o poder de cura":"healing power","o poder divino":"divine power","os poderes":"powers","a política":"politics","a pomba":"dove","o ponto de vista":"point of view","o princípio":"principle","o Princípio divino":"divine Principle","os princípios":"principles","a profecia":"prophecy","o profeta":"prophet","os profetas":"prophets","a profundidade":"depth","o progresso":"progress","a promessa":"promise","o propósito":"purpose","a prosperidade":"prosperity","a prova":"proof","a pureza":"purity","a purificação":"purification","a questão":"question","a razão":"reason","a reação":"reaction","a realidade":"reality","a realização":"realization","a redenção":"redemption","a regeneração":"regeneration","a rejeição":"rejection","a religião cristã":"Christian religion","a religião":"religion","a religiosidade":"religiosity","o remédio":"remedy","a renovação":"renewal","a renúncia":"renunciation","a repetição":"repetition","o repouso":"rest","a representação":"representation","a ressurreição":"resurrection","a restauração":"restoration","o resultado":"result","os resultados":"results","a retidão":"righteousness","a revelação":"revelation","a revolução":"revolution","a riqueza":"wealth","as riquezas":"riches","a sabedoria":"wisdom","a salvação":"salvation","o salvador":"savior","a sanidade":"sanity","a santidade":"holiness","o santo":"saint","Satanás":"Satan","a satisfação":"satisfaction","a saúde":"health","o século":"century","os séculos":"centuries","o segredo":"secret","a semelhança":"likeness","a semente":"seed","as sementes":"seeds","o ser":"being","o ser humano":"human being","a serenidade":"serenity","o sermão":"sermon","a serpente":"serpent","o servo":"servant","a significação":"significance","o significado":"meaning","o silêncio":"silence","o símbolo":"symbol","os símbolos":"symbols","a simplicidade":"simplicity","a sinceridade":"sincerity","o sintoma":"symptom","os sintomas":"symptoms","o sistema":"system","a situação":"situation","a sociedade":"society","o sofrimento":"suffering","os sofrimentos":"sufferings","a solidão":"solitude","a solução":"solution","o sonho":"dream","os sonhos":"dreams","a substância":"substance","o sucesso":"success","a sugestão":"suggestion","a superioridade":"superiority","a superstição":"superstition","a supremacia":"supremacy","o tabernáculo":"tabernacle","o temor":"fear","a tempestade":"storm","o templo":"temple","o tempo":"time","os tempos":"times","a tentação":"temptation","a teologia":"theology","a teoria":"theory","as teorias":"theories","a terapia":"therapy","o termo":"term","os termos":"terms","a terra":"earth","o terror":"terror","a tese":"thesis","o tesouro":"treasure","o testemunho":"testimony","os testemunhos":"testimonies","o texto":"text","os textos":"texts","a tradição":"tradition","a tradução":"translation","a transformação":"transformation","a transgressão":"transgression","a transição":"transition","o tratamento":"treatment","as trevas":"darkness","a tríade":"triad","a tribulação":"tribulation","o tribunal":"tribunal","a tristeza":"sadness","o triunfo":"triumph","o trono":"throne","a tuberculose":"tuberculosis","o tumor":"tumor","os tumores":"tumors","o túmulo":"tomb","a unção":"anointing","a união":"union","a unidade":"unity","o universo":"universe","a utilidade":"utility","a vaidade":"vanity","o valor":"value","os valores":"values","a verdade":"truth","a verdade divina":"divine Truth","a verdade eterna":"eternal truth","as verdades":"truths","a vergonha":"shame","a versão":"version","o versículo":"verse","os versículos":"verses","a vida":"life","a vida espiritual":"spiritual life","a vida eterna":"eternal life","a vigilância":"vigilance","o vigor":"vigor","o vínculo":"bond","a violência":"violence","a virtude":"virtue","as virtudes":"virtues","a visão":"vision","a vitória":"victory","a vitalidade":"vitality","a vontade":"will","a vontade divina":"divine will","a voz":"voice","o zelo":"zeal"},
  VERB: {"abalar":"to shake","abandonar":"to abandon","abençoar":"to bless","abrir":"to open","absorver":"to absorb","aceitar":"to accept","acreditar":"to believe","adaptar":"to adapt","admitir":"to admit","adorar":"to worship","afirmar":"to affirm","agir":"to act","ajudar":"to help","alcançar":"to reach","amar":"to love","andar":"to walk","aniquilar":"to annihilate","anular":"to annul","aparecer":"to appear","aplicar":"to apply","apoiar":"to support","aprender":"to learn","apresentar":"to present","aprofundar":"to deepen","assumir":"to assume","atender":"to attend","atribuir":"to attribute","atuar":"to act","aumentar":"to increase","avaliar":"to evaluate","avançar":"to advance","basear":"to base","beber":"to drink","beneficiar":"to benefit","brilhar":"to shine","buscar":"to seek","cair":"to fall","caminhar":"to walk","causar":"to cause","ceder":"to yield","chamar":"to call","chegar":"to arrive","cobrir":"to cover","coexistir":"to coexist","combater":"to combat","começar":"to begin","comer":"to eat","compreender":"to understand","comunicar":"to communicate","concluir":"to conclude","concordar":"to agree","condenar":"to condemn","conduzir":"to lead","confessar":"to confess","confiar":"to trust","confundir":"to confuse","conhecer":"to know","conseguir":"to achieve","conservar":"to preserve","considerar":"to consider","construir":"to build","consumir":"to consume","contemplar":"to contemplate","continuar":"to continue","contradizer":"to contradict","controlar":"to control","convencer":"to convince","converter":"to convert","corrigir":"to correct","crer":"to believe","crescer":"to grow","criar":"to create","cuidar":"to care","cumprir":"to fulfill","curar":"to heal","dar":"to give","debater":"to debate","decidir":"to decide","declarar":"to declare","deduzir":"to deduce","defender":"to defend","deixar":"to leave","demonstrar":"to demonstrate","denominar":"to name","depender":"to depend","derrotar":"to defeat","desaparecer":"to disappear","descobrir":"to discover","descrever":"to describe","desenvolver":"to develop","desejar":"to desire","destruir":"to destroy","desvanecer":"to vanish","determinar":"to determine","dever":"must/ought","dizer":"to say","dominar":"to dominate","duvidar":"to doubt","edificar":"to edify","educar":"to educate","elevar":"to elevate","eliminar":"to eliminate","emanar":"to emanate","encontrar":"to find","enfrentar":"to face","enganar":"to deceive","ensinar":"to teach","entender":"to understand","entrar":"to enter","esclarecer":"to clarify","escolher":"to choose","escrever":"to write","esquecer":"to forget","estabelecer":"to establish","estar":"to be","estudar":"to study","evoluir":"to evolve","examinar":"to examine","existir":"to exist","explicar":"to explain","expressar":"to express","expulsar":"to expel","falar":"to speak","falhar":"to fail","fazer":"to do/make","ficar":"to stay","firmar":"to establish","florescer":"to flourish","fluir":"to flow","formar":"to form","fornecer":"to provide","fortalece":"to strengthen","fugir":"to flee","fundamentar":"to ground","ganhar":"to gain","garantir":"to guarantee","gerar":"to generate","glorificar":"to glorify","governar":"to govern","guiar":"to guide","habitar":"to dwell","harmonizar":"to harmonize","haver":"to have/exist","herdar":"to inherit","iluminar":"to illuminate","imaginar":"to imagine","imitar":"to imitate","impedir":"to prevent","indicar":"to indicate","influenciar":"to influence","informar":"to inform","iniciar":"to initiate","instruir":"to instruct","interpretar":"to interpret","introduzir":"to introduce","invocar":"to invoke","ir":"to go","julgar":"to judge","justificar":"to justify","labutar":"to toil","lançar":"to launch","ler":"to read","lembrar":"to remember","levar":"to carry","libertar":"to liberate","limitar":"to limit","limpar":"to cleanse","louvar":"to praise","lutar":"to struggle","manifestar":"to manifest","manter":"to maintain","matar":"to kill","melhorar":"to improve","morrer":"to die","mostrar":"to show","mudar":"to change","nascer":"to be born","negar":"to deny","obedecer":"to obey","oferecer":"to offer","olhar":"to look","operar":"to operate","orar":"to pray","ouvir":"to hear","pagar":"to pay","parecer":"to seem","participar":"to participate","passar":"to pass","pensar":"to think","perceber":"to perceive","perder":"to lose","perdoar":"to forgive","permanecer":"to remain","permitir":"to permit","perseverar":"to persevere","pertencer":"to belong","poder":"to be able","possuir":"to possess","praticar":"to practice","pregar":"to preach","procurar":"to seek","produzir":"to produce","progredir":"to progress","prometer":"to promise","proteger":"to protect","purificar":"to purify","realizar":"to accomplish","receber":"to receive","reconciliar":"to reconcile","reconhecer":"to recognize","redimir":"to redeem","reduzir":"to reduce","referir":"to refer","refletir":"to reflect","regenerar":"to regenerate","reinar":"to reign","rejeitar":"to reject","renovar":"to renew","renunciar":"to renounce","representar":"to represent","resistir":"to resist","resolver":"to resolve","respeitar":"to respect","responder":"to respond","ressuscitar":"to resurrect","restabelecer":"to restore","restaurar":"to restore","resultar":"to result","revelar":"to reveal","saber":"to know","sacrificar":"to sacrifice","salvar":"to save","santificar":"to sanctify","satisfazer":"to satisfy","seguir":"to follow","sentir":"to feel","separar":"to separate","ser":"to be","servir":"to serve","significar":"to mean","simbolizar":"to symbolize","sobreviver":"to survive","sofrer":"to suffer","sondar":"to probe","sonhar":"to dream","subir":"to rise","submeter":"to submit","substituir":"to substitute","superar":"to overcome","suprimir":"to suppress","surgir":"to arise","sustentar":"to sustain","temer":"to fear","tentar":"to attempt","ter":"to have","terminar":"to end","testemunhar":"to testify","tirar":"to remove","tocar":"to touch","tomar":"to take","tornar":"to become","trabalhar":"to work","transcender":"to transcend","transformar":"to transform","transmitir":"to transmit","tratar":"to treat","trazer":"to bring","triunfar":"to triumph","unir":"to unite","usar":"to use","utilizar":"to utilize","valer":"to be worth","ver":"to see","vencer":"to overcome","viver":"to live","voltar":"to return"},
  ADJECTIVE: {"absoluto":"absolute","aceitável":"acceptable","acessível":"accessible","adequado":"adequate","adorável":"adorable","agradável":"agreeable","alegre":"joyful","amoroso":"loving","amplo":"ample","ansioso":"anxious","aparente":"apparent","apostólico":"apostolic","ardente":"ardent","ativo":"active","audível":"audible","autoritário":"authoritative","baixo":"low","básico":"basic","beatífico":"beatific","belo":"beautiful","bem-aventurado":"blessed","bendito":"blessed","benéfico":"beneficial","benigno":"benign","bíblico":"biblical","bondoso":"kind","brilhante":"brilliant","capaz":"capable","carnal":"carnal","celestial":"celestial","científico":"scientific","claro":"clear","coerente":"coherent","coeterno":"coeternal","completo":"complete","complexo":"complex","comum":"common","confiante":"confident","confiável":"reliable","consciente":"conscious","constante":"constant","contínuo":"continuous","contrário":"contrary","corporal":"bodily","corpóreo":"corporeal","correto":"correct","corrompido":"corrupt","cristão":"Christian","crítico":"critical","curado":"healed","decadente":"decadent","dedicado":"dedicated","definitivo":"definitive","demente":"demented","demonstrável":"demonstrable","desanimado":"discouraged","desarmonioso":"disharmonious","desconhecido":"unknown","desejável":"desirable","desnecessário":"unnecessary","devoto":"devout","difícil":"difficult","digno":"worthy","distinto":"distinct","divino":"divine","doente":"sick","doloroso":"painful","duradouro":"lasting","eficaz":"effective","efêmero":"ephemeral","egoísta":"selfish","elevado":"elevated","eloquente":"eloquent","enfermo":"infirm","errado":"wrong","errante":"errant","errôneo":"erroneous","essencial":"essential","espiritual":"spiritual","espiritualizado":"spiritualized","estranho":"strange","eterno":"eternal","exato":"exact","excelente":"excellent","existente":"existing","falso":"false","fatal":"fatal","favorável":"favorable","feliz":"happy","fenomenal":"phenomenal","fervente":"fervent","fiel":"faithful","final":"final","finito":"finite","firme":"firm","físico":"physical","forte":"strong","fraco":"weak","frágil":"fragile","frutífero":"fruitful","fútil":"futile","genuíno":"genuine","glorioso":"glorious","grande":"great","harmônico":"harmonic","harmonioso":"harmonious","honesto":"honest","horrível":"horrible","humano":"human","humilde":"humble","ideal":"ideal","idêntico":"identical","ignorante":"ignorant","ilimitado":"unlimited","iluminado":"illuminated","imaculado":"immaculate","imaterial":"immaterial","imenso":"immense","imoral":"immoral","imortal":"immortal","impassível":"impassible","imperfeito":"imperfect","impessoal":"impersonal","importante":"important","impossível":"impossible","impuro":"impure","imutável":"immutable","inanimado":"inanimate","incapaz":"incapable","incessante":"incessant","incoerente":"incoherent","incomparável":"incomparable","incompleto":"incomplete","incondicional":"unconditional","incorpóreo":"incorporeal","incorreto":"incorrect","incrível":"incredible","independente":"independent","indestrutível":"indestructible","indispensável":"indispensable","individual":"individual","inefável":"ineffable","infalível":"infallible","infinito":"infinite","inocente":"innocent","insano":"insane","inspirado":"inspired","intelectual":"intellectual","inteligente":"intelligent","inteligível":"intelligible","intencional":"intentional","intenso":"intense","interior":"interior","inútil":"useless","invisível":"invisible","irracional":"irrational","irreal":"unreal","jovem":"young","justo":"just","legítimo":"legitimate","limitado":"limited","limpo":"clean","livre":"free","lógico":"logical","luminoso":"luminous","maior":"greater","majestoso":"majestic","material":"material","mau":"evil","melhor":"better","mental":"mental","metafísico":"metaphysical","milagroso":"miraculous","misericordioso":"merciful","místico":"mystical","moral":"moral","mortal":"mortal","mutável":"mutable","natural":"natural","necessário":"necessary","negativo":"negative","nobre":"noble","novo":"new","omnipresente":"omnipresent","onipotente":"omnipotent","onipresente":"omnipresent","onisciente":"omniscient","oposto":"opposite","original":"original","paciente":"patient","pacífico":"peaceful","pecaminoso":"sinful","pequeno":"small","perfeito":"perfect","perigoso":"dangerous","permanente":"permanent","perverso":"perverse","pleno":"full","poderoso":"powerful","positivo":"positive","possível":"possible","primário":"primary","profundo":"deep","próprio":"own/proper","puro":"pure","racional":"rational","radiante":"radiant","real":"real","redentor":"redemptive","religioso":"religious","responsável":"responsible","sagrado":"sacred","salutar":"salutary","santo":"holy","satisfeito":"satisfied","saudável":"healthy","seguro":"safe","semelhante":"similar","sensato":"sensible","sensível":"sensitive","sensual":"sensual","separado":"separate","sereno":"serene","severo":"severe","silencioso":"silent","simples":"simple","sincero":"sincere","sistemático":"systematic","soberano":"sovereign","sobrenatural":"supernatural","sublime":"sublime","suficiente":"sufficient","superior":"superior","supremo":"supreme","tangível":"tangible","temporal":"temporal","temporário":"temporary","total":"total","tranquilo":"tranquil","transcendental":"transcendental","transitório":"transitory","triste":"sad","último":"last","único":"unique","universal":"universal","útil":"useful","verdadeiro":"true","vigoroso":"vigorous","visível":"visible","vital":"vital","vitorioso":"victorious","vivo":"living"},
  ADVERB: {"abertamente":"openly","absolutamente":"absolutely","agora":"now","ainda":"still/yet","além":"beyond","altamente":"highly","anteriormente":"previously","antes":"before","apenas":"only","aqui":"here","assim":"thus","até":"until/even","atualmente":"currently","bastante":"quite","bem":"well","calmamente":"calmly","cedo":"early","certamente":"certainly","cientificamente":"scientifically","claramente":"clearly","completamente":"completely","constantemente":"constantly","continuamente":"continuously","corretamente":"correctly","de fato":"in fact","definitivamente":"definitively","depois":"after","devotamente":"devoutly","diariamente":"daily","diretamente":"directly","divinamente":"divinely","enfim":"finally","então":"then","erroneamente":"erroneously","especialmente":"especially","espiritualmente":"spiritually","eternamente":"eternally","evidentemente":"evidently","exatamente":"exactly","facilmente":"easily","felizmente":"fortunately","finalmente":"finally","frequentemente":"frequently","fundamentalmente":"fundamentally","geralmente":"generally","harmonicamente":"harmoniously","hoje":"today","honestamente":"honestly","humanamente":"humanly","humildemente":"humbly","igualmente":"equally","imediatamente":"immediately","imortalmente":"immortally","inevitavelmente":"inevitably","infelizmente":"unfortunately","infinitamente":"infinitely","inicialmente":"initially","injustamente":"unjustly","instantaneamente":"instantly","inteiramente":"entirely","intensamente":"intensely","interiormente":"inwardly","jamais":"never","juntos":"together","lentamente":"slowly","livremente":"freely","logicamente":"logically","logo":"soon","longe":"far","mais":"more","materialmente":"materially","mentalmente":"mentally","moralmente":"morally","muito":"very/much","naturalmente":"naturally","necessariamente":"necessarily","novamente":"again","nunca":"never","obviamente":"obviously","originalmente":"originally","perfeitamente":"perfectly","plenamente":"fully","positivamente":"positively","profundamente":"deeply","puramente":"purely","rapidamente":"quickly","realmente":"really","relativamente":"relatively","religiosamente":"religiously","sempre":"always","silenciosamente":"silently","simplesmente":"simply","somente":"only","suavemente":"gently","suficientemente":"sufficiently","supremamente":"supremely","também":"also","temporariamente":"temporarily","totalmente":"totally","verdadeiramente":"truly","visivelmente":"visibly"},
  CONJUNCTION: {"à medida que":"as/as long as","ainda que":"even though","além disso":"furthermore","antes que":"before","ao passo que":"whereas","apesar":"despite","apesar de":"in spite of","assim":"thus","assim que":"as soon as","até":"until","caso":"in case","como":"as/like","conforme":"according to","contudo":"however","de":"of/from","embora":"although","enquanto":"while","então":"then","entre":"between","entretanto":"meanwhile","logo":"therefore","logo que":"as soon as","nem":"nor","ou":"or","pois":"for/because","pois que":"since/because","por":"by/for","por exemplo":"for example","porém":"however","porquanto":"inasmuch as","porque":"because","portanto":"therefore","posto que":"although","quando":"when","que":"that/which","se":"if","se assim":"if so","se não":"if not","senão":"otherwise","visto":"since/given","visto que":"given that"},
  PREPOSITION: {"a fim":"in order","a partir de":"from/starting from","acerca":"about","acima":"above","além":"beyond","ante":"before/in front of","antes":"before","apesar":"despite","após":"after","até":"until/up to","através":"through","conforme":"according to","contra":"against","de acordo":"according","de acordo com":"in accordance with","debaixo":"under","debaixo de":"underneath","dentro":"inside","desde":"since/from","diante":"before/in front of","durante":"during","entre":"between/among","excepto":"except","fora":"outside","junto":"together/near","mediante":"by means of","para":"for/to","pela":"by the (f)","pelo":"by the (m)","perante":"before/in the presence of","por":"by/for/through","salvo":"except","segundo":"according to","sob":"under","sobre":"about/over"},
  OTHER: {"à luz de":"in light of","à medida":"as/to the extent","a mesma":"the same (f)","a partir":"from/starting","a qual":"which","absolutamente":"absolutely","acabe":"end/finish","adamah":"adamah (Hebrew: earth)","ah":"ah","aí":"there","ainda":"still/yet","além":"beyond","algo":"something","alguém":"someone","algum":"some (m)","alguma":"some (f)","alguns":"some (pl)","amém":"amen","antes":"before","ao":"to the (m)","ao passo que":"whereas","apenas":"only","aquele":"that (m)","aqui":"here","aquilo":"that (neut)","as":"the (f pl)","assim":"thus","até":"until","através":"through","cada":"each","com":"with","como":"how/as","conforme":"according to","contra":"against","da":"of the (f)","daí":"from there","de":"of/from","de algum modo":"somehow","de modo algum":"in no way","de repente":"suddenly","de verdade":"truly","depois":"after","desde":"since","desta":"of this (f)","diante":"before","eis":"behold","em verdade":"in truth","enfim":"finally","enquanto":"while","então":"then","entre":"between","entretanto":"meanwhile","essa":"that (f)","essa mesma":"that very (f)","esse":"that (m)","esses":"those (m)","esta":"this (f)","este":"this (m)","estes":"these (m)","isso":"that (neut)","isto":"this (neut)","já":"already/now","jamais":"never","lá":"there","mais":"more","mas":"but","menos":"less","mesmo":"even/same","nem":"nor","nenhum":"none","nesse":"in that","nunca":"never","ora":"now/well","para":"for/to","pela":"by the (f)","pelo":"by the (m)","pois":"for/because","por":"by/for","por conseguinte":"consequently","por fim":"finally","por isso":"therefore","porque":"because","portanto":"therefore","qualquer":"any","quando":"when","quanto":"how much","que":"that/which","quem":"who","quiçá":"perhaps","se":"if","seja como for":"be that as it may","sempre":"always","sequer":"even/at least","só":"only/alone","sob":"under","sobre":"about/over","tal":"such","talvez":"perhaps","também":"also","tampouco":"neither/nor","tanto":"so much","tão":"so/such","teu":"your (m)","toda":"all/every (f)","todas":"all (f pl)","todas as coisas":"all things","todavia":"however","todo":"all/every (m)","todos":"all (m pl)","totalmente":"totally","tudo":"everything","tudo-em-tudo":"all-in-all"},
};

function buildVocabPrompt(word, pos, level, bookQuote) {
  const levelDesc = {
    "A1": "very simple sentences, present tense only, with full English translation",
    "A2": "simple sentences and common tenses, with English translation",
    "B1": "natural sentences and varied tenses, with English translation",
    "B2+": "natural colloquial European Portuguese, with English translation",
  }[level];
  const quoteSection = bookQuote
    ? `\n\nThis word appears in "Ciência e Saúde com a Chave das Escrituras" in the following passage:\n"${bookQuote}"\n\nFor the book_quote field, use this passage exactly (adapted to EP spelling if needed). For example_ep, you may also draw from this passage or write a related EP sentence.`
    : `\n\nFor book_quote, use empty string.`;
  return `You are a European Portuguese (Portugal) language coach with expertise in both Brazilian Portuguese (BP) and European Portuguese (EP).

The learner is studying vocabulary from the Brazilian Portuguese translation of "Science and Health with Key to the Scriptures" by Mary Baker Eddy. The word or phrase is: "${word}" (part of speech: ${pos}).

Respond ONLY with a JSON object and nothing else — no markdown, no backticks, no explanation.

Format:
{
  "word_bp": "${word}",
  "meaning_en": "English meaning in 1–6 words",
  "is_bp_specific": true or false,
  "ep_equivalent": "EP form if different, otherwise empty string",
  "ep_note": "One sentence explaining the BP→EP difference, otherwise empty string",
  "example_ep": "One natural example sentence in European Portuguese using the EP form of this word",
  "example_en": "English translation of the example",
  "book_quote": "Passage from Ciência e Saúde where this word appears",
  "book_quote_en": "English translation of the book_quote passage"
}

Rules:
- is_bp_specific: true ONLY if the word or its spelling is exclusively Brazilian and does not exist in EP (e.g. different orthography like ô→ó, ê→é; or vocabulary like ônibus→autocarro, bebê→bebé, fenômeno→fenómeno). If the word is identical in both dialects, is_bp_specific must be false.
- ep_equivalent: the correct EP form. Leave empty string if is_bp_specific is false.
- ep_note: brief explanation of the difference. Leave empty string if is_bp_specific is false.
- example_ep: always write this sentence in natural European Portuguese, using the EP form of the word. Use ${levelDesc}.
- Return only valid JSON.${quoteSection}`;
}



const GRAMMAR_TOPICS = [
  {
    id: "word_order", label: "Word Order",
    sections: [
      { title: "Basic SVO order", body: "EP follows Subject-Verb-Object order like English: 'O Pedro come a sopa.' (Pedro eats the soup). The subject is often dropped entirely since the verb ending identifies it: 'Como a sopa.' (I eat the soup.)" },
      { title: "Adjective placement", body: "Most descriptive adjectives follow the noun: 'um carro vermelho' (a red car). Adjectives that precede the noun carry a more subjective or emphatic meaning: 'um grande homem' (a great man) vs 'um homem grande' (a big/tall man)." },
      { title: "Question word order", body: "Yes/no questions use rising intonation with no word order change: 'Falas português?' Wh-questions move the question word to the front: 'Onde moras?' In formal EP, the subject may invert after the verb: 'Onde mora o Pedro?'" },
      { title: "Negation", body: "Place 'não' directly before the verb: 'Não falo inglês.' Double negation is standard in EP: 'Não vi nada.' (I didn't see anything — literally 'I didn't see nothing.') This is grammatically correct, not a mistake." },
    ],
  },
  {
    id: "clitics", label: "Clitic Pronouns",
    sections: [
      { title: "What are clitics?", body: "Clitic pronouns (me, te, se, o, a, lhe, nos, vos, os, as, lhes) attach to verbs. EP and BP place them in opposite positions — this is one of the most important EP/BP differences." },
      { title: "Enclisis — EP default (after verb)", body: "In EP, the default in affirmative sentences is to place the clitic AFTER the verb with a hyphen: 'Vejo-o.' (I see him.) 'Chamo-me João.' (My name is João.) This feels unnatural to learners of BP, where preclisis (before the verb) is standard." },
      { title: "Proclisis — before the verb", body: "In EP, clitics go BEFORE the verb after: negatives ('Não o vejo.'), subordinate conjunctions ('quando o vires'), question words ('Quem te disse?'), certain adverbs ('Sempre me esquece.'), and relative pronouns ('o homem que me ligou')." },
      { title: "Mesoclisis — inside the verb (future/conditional)", body: "Unique to EP: in the future and conditional, the clitic inserts INSIDE the verb form: 'Ver-te-ei amanhã.' (I will see you tomorrow.) 'Dir-lhe-ia...' (I would tell him/her...) This is formal but still used in written EP." },
      { title: "Common clitic forms", body: "o/a (him/her/it, direct object) · lhe (to him/her, indirect object) · me (me/to me) · te (you/to you, informal) · se (himself/herself/themselves/reflexive) · nos (us/to us). After -r, -s, -z verb endings: o→lo, a→la (dá-lo, fê-lo)." },
    ],
  },
  {
    id: "ser_estar", label: "Ser vs. Estar",
    sections: [
      { title: "Ser — permanent or defining", body: "Use SER for: identity and origin ('Sou americano.'), permanent characteristics ('A neve é branca.'), profession ('É médico.'), time and dates ('São três horas.'), material ('A mesa é de madeira.'), and passive voice with past participle." },
      { title: "Estar — temporary states", body: "Use ESTAR for: temporary conditions ('Estou cansado.' — I'm tired right now), location of people/things ('Estou em Lisboa.'), ongoing actions (estar a + infinitive: 'Estou a comer.'), and emotional states ('Estou feliz hoje.')." },
      { title: "EP progressive: estar a + infinitive", body: "EP uses 'estar a + infinitive' for ongoing actions: 'Estou a falar.' (I am speaking.) BP uses 'estar + gerund': 'Estou falando.' Never use the gerund form for ongoing actions in EP — it sounds Brazilian." },
      { title: "Tricky cases", body: "'Estar morto' (to be dead — a state) vs 'Ser morto' (to be killed — passive). Location: 'A cidade é bonita' (the city is beautiful — characteristic) vs 'A cidade está cheia' (the city is full — current state). 'Ser casado' (to be married — status) is common in EP even though marriage could be considered temporary." },
    ],
  },
  {
    id: "por_para", label: "Por vs. Para",
    sections: [
      { title: "Para — destination and purpose", body: "Use PARA for: destination ('Vou para Lisboa.'), recipient ('Este presente é para ti.'), purpose/goal ('Estudo para aprender.'), deadline ('Preciso disto para amanhã.'), and opinion ('Para mim, é difícil.')." },
      { title: "Por — cause, exchange, duration", body: "Use POR for: cause/reason ('Fiz isso por amor.'), exchange ('Paguei 10€ por isto.'), duration ('Estudei por duas horas.'), movement through ('Passámos pelo Porto.'), agent in passive ('Foi escrito por Saramago.'), and per ('60km por hora.')." },
      { title: "Contractions", body: "POR contracts with definite articles: por + o = pelo, por + a = pela, por + os = pelos, por + as = pelas. 'Passámos pelo centro.' (We went through the centre.) PARA does not contract in standard EP." },
      { title: "Common confusion", body: "'Obrigado por...' (thank you for — cause/reason) not 'obrigado para'. 'Partir para...' (to leave for a destination). 'Partir por...' (to leave because of). 'Lutar por' (to fight for a cause) vs 'lutar para' (to fight in order to achieve)." },
    ],
  },
  {
    id: "articles", label: "Articles",
    sections: [
      { title: "EP uses articles before names", body: "Unlike English and BP (in some contexts), EP places the definite article before first names and proper nouns in conversation: 'A Maria chegou.' (Maria arrived.) 'O João está aqui.' (João is here.) Omitting the article sounds formal or literary in EP." },
      { title: "Definite articles", body: "Masculine: o (sing), os (pl). Feminine: a (sing), as (pl). Contract with prepositions: a+o=ao, a+a=à, de+o=do, de+a=da, em+o=no, em+a=na, por+o=pelo, por+a=pela." },
      { title: "Indefinite articles", body: "Masculine: um (sing), uns (pl). Feminine: uma (sing), umas (pl). Contract with em: em+um=num, em+uma=numa. 'Num café' (in a café). No contraction with de or a." },
      { title: "When to omit the article", body: "Omit before: unmodified professions after ser ('Sou professor.'), nationalities after ser ('É portuguesa.'), days of the week without preposition ('Chegou segunda-feira.'), and in many set expressions ('Tenho fome.', 'Tenho razão.')." },
    ],
  },
  {
    id: "gender_agreement", label: "Gender & Agreement",
    sections: [
      { title: "Noun gender", body: "All Portuguese nouns are masculine or feminine. Most nouns ending in -o are masculine (o livro), most ending in -a are feminine (a mesa). Exceptions: o dia, o mapa, o problema (masc despite -a); a mão, a tribo (fem despite not ending -a)." },
      { title: "Adjective agreement", body: "Adjectives agree with the noun in gender and number: 'um carro rápido / uma mota rápida / dois carros rápidos / duas motas rápidas.' Adjectives ending in -e or a consonant often have the same form for m/f: 'um/uma estudante inteligente.'" },
      { title: "Article and determiner agreement", body: "All articles, demonstratives, and quantifiers must agree: 'este livro / esta caneta / esses livros / essas canetas / algum tempo / alguma coisa / muito trabalho / muita gente.'" },
      { title: "Past participle agreement in compound tenses", body: "With TER/HAVER (compound tenses), the participle does NOT agree: 'Ela tem comido.' With SER (passive), it DOES agree: 'A carta foi escrita.' With FICAR + participle, it agrees: 'A porta ficou aberta.'" },
    ],
  },
  {
    id: "subjunctive", label: "Subjunctive Triggers",
    sections: [
      { title: "What triggers the subjunctive", body: "The subjunctive expresses subjectivity — doubt, emotion, wish, possibility, or indirect influence. It is triggered by the main clause, not chosen by the speaker freely. If the main clause expresses a subjective stance toward the subordinate action, use the subjunctive." },
      { title: "Common triggers — verbs", body: "querer que, esperar que, preferir que, pedir que, sugerir que, recomendar que, duvidar que, é possível que, é importante que, é preciso que, lamentar que, ter medo que, gostar que, exigir que." },
      { title: "Common triggers — conjunctions", body: "embora (although), ainda que (even though), para que (so that), antes que (before), a menos que (unless), caso (in case), sem que (without), por mais que (however much), que (after expressions of emotion/will)." },
      { title: "Futuro do Conjuntivo — EP essential", body: "After quando, se, assim que, logo que, enquanto, onde — when referring to a hypothetical future: 'Quando fores a Lisboa...' 'Se puderes, liga-me.' 'Faz o que quiseres.' This tense is alive and required in EP, unlike in most other Romance languages." },
    ],
  },
  {
    id: "personal_infinitive", label: "Personal Infinitive",
    sections: [
      { title: "What it is", body: "The personal infinitive is an inflected infinitive unique to Portuguese — it agrees with the subject just like a conjugated verb but has the form of an infinitive. It has no direct equivalent in English, Spanish, French, or Italian." },
      { title: "Forms", body: "eu: falar · tu: falares · ele/ela: falar · nós: falarmos · vós: falardes · eles/elas: falarem. The 1st and 3rd person singular are identical to the uninflected infinitive." },
      { title: "When to use it", body: "After prepositions when the subject of the infinitive differs from the main clause: 'É importante vocês fazerem isso.' (It's important for you to do that.) 'Depois de chegares, liga-me.' (After you arrive, call me.) 'Para eles saberem...' (For them to know...)" },
      { title: "vs. the subjunctive", body: "Both can express subordinate clauses, but the personal infinitive follows prepositions while the subjunctive follows conjunctions. 'Para que fales' (conj. + subj.) vs 'Para falares' (prep. + pers. inf.) — same meaning, both correct, infinitive is more common in spoken EP." },
    ],
  },
];

// Labels are derived from GRAMMAR_TOPICS to keep them as a single source of truth.
const GRAMMAR_FOCUS_TOPICS = [
  { id: "word_order",         instruction: "Focus on word order: demonstrate correct EP sentence structure in your responses. When relevant, gently point out word order differences from English or Brazilian Portuguese. Use varied sentence structures including negation, questions, and adjective placement." },
  { id: "clitics",            instruction: "Focus on clitic pronouns: use clitic constructions naturally in your responses, especially EP-style enclisis (verb-clitic). When the learner uses a clitic incorrectly or in BP position, note it gently. Demonstrate mesoclisis in the future/conditional where natural." },
  { id: "ser_estar",          instruction: "Focus on ser vs. estar: consciously use both verbs in varied contexts across your responses. Demonstrate the EP progressive (estar a + infinitive) rather than the gerund. When the learner confuses ser/estar, correct it." },
  { id: "por_para",           instruction: "Focus on por vs. para: use both prepositions naturally across your responses in varied constructions. When the learner uses one where the other is needed, correct it with a brief explanation." },
  { id: "articles",           instruction: "Focus on articles: model correct EP article usage, especially the EP convention of placing definite articles before first names. Demonstrate article contractions naturally. Correct missing or incorrect articles in the learner's input." },
  { id: "gender_agreement",   instruction: "Focus on gender and agreement: ensure all your responses model perfect gender/number agreement. When the learner makes agreement errors (wrong article, adjective ending, or participle), correct them clearly." },
  { id: "subjunctive",        instruction: "Focus on the subjunctive: weave subjunctive constructions naturally into your responses using triggers like embora, espero que, é importante que, quando (+ futuro do conjuntivo). When the learner should use the subjunctive but doesn't, point it out." },
  { id: "personal_infinitive", instruction: "Focus on the personal infinitive: use personal infinitive constructions naturally in your responses. Demonstrate the contrast with the subjunctive where relevant. If the learner avoids it or uses a subjunctive where a personal infinitive fits better, note it." },
].map(ft => ({ ...ft, label: GRAMMAR_TOPICS.find(gt => gt.id === ft.id).label }));


function buildSystemPrompt(level, correctionMode, topics, verbOfSession, focusIdiom, focusGrammar, registerMode) {
  const topicList = topics.filter(t => t.selected).map(t => t.label).join(", ");
  const levelDesc = {
    "A1": "complete beginner. Use very simple sentences, basic vocabulary, present tense only. Always include an English translation in parentheses after each Portuguese sentence.",
    "A2": "elementary learner. Use simple sentences, common vocabulary, present and simple past tense. Include brief English hints for difficult words in brackets.",
    "B1": "intermediate learner. Use natural sentences, varied vocabulary and tenses. Only include English hints for uncommon words.",
    "B2+": "advanced learner. Respond entirely in natural, colloquial European Portuguese. No English unless the user asks.",
  }[level];
  const correctionDesc = {
    "inline": "If the user makes a Portuguese grammar or vocabulary mistake, correct it naturally woven into your response — for example, by subtly using the correct form yourself, or with a brief parenthetical like '(queremos, not queríamos)' embedded in your reply. Do NOT add a separate correction block at the end. Do NOT use --- or Correção:. The correction must be part of the flow of your response.",
    "end": "If the user makes a Portuguese grammar or vocabulary mistake, you MUST append a correction block at the very end of your reply, after all other content. Use EXACTLY this format — no variations:\n---\nCorreção: [your correction here]\n\nRules: (1) The --- must be on its own line. (2) Correção: must immediately follow on the next line with no blank line between them. (3) Do not add any text after the correction. (4) If the user made no errors, omit the block entirely.",
    "onrequest": "Only correct the user's Portuguese if they explicitly ask for feedback.",
    "never": "Never comment on or correct the user's Portuguese errors. Just respond naturally.",
  }[correctionMode];
  const verbInstruction = verbOfSession
    ? `\n\nFocus verb: naturally use the verb "${verbOfSession}" at least 2–3 times across your responses this session, weaving it into the conversation organically.`
    : "";
  const idiomInstruction = focusIdiom
    ? `\n\nFocus idiom: naturally introduce and use the idiom "${focusIdiom.pt}" (meaning: ${focusIdiom.en}) at least once during this session. When you use it, do so organically in context. If the learner uses it correctly, acknowledge it warmly.`
    : "";
  const grammarInstruction = focusGrammar
    ? `\n\nFocus grammar: ${focusGrammar.instruction}`
    : "";
  const registerInstruction = registerMode === "colloquial"
    ? "\n\nRegister: speak and write like a relaxed local Portuguese person, not a textbook. Use colloquial vocabulary, contractions, and reductions natural to spoken EP — for example: 'tou' for 'estou', 'tás' for 'estás', 'pra' for 'para', 'dum' for 'de um', 'gajo'/'gaja', 'fixe', 'pois', 'olha', 'tipo', 'que seca', 'bué'. Drop subjects where a native would. Use filler words and discourse markers naturally. When correcting the learner, prefer what a native speaker would actually say over strictly textbook forms."
    : "\n\nRegister: use clear, correct, standard European Portuguese — the kind a learner would encounter in a well-written textbook or a formal conversation. Avoid heavy slang and contractions. Model grammatically complete sentences.";
  return `You are a friendly, patient European Portuguese (Portugal, not Brazil) conversation partner helping a native English speaker learn Portuguese.\n\nThe learner's level is ${level} — treat them as a ${levelDesc}\n\nAlways use European Portuguese vocabulary and grammar (e.g. "autocarro" not "ônibus", "casa de banho" not "banheiro", "fixe" not "legal"). Never use Brazilian Portuguese variants.\n\nPreferred conversation topics: ${topicList || "any topic"}.\n\nError correction policy: ${correctionDesc}${registerInstruction}${verbInstruction}${idiomInstruction}${grammarInstruction}\n\nRespond primarily in European Portuguese, adapting complexity to the learner's level. Be warm, encouraging, and conversational. Keep responses concise — 2 to 4 sentences unless the learner asks for more detail.\n\nDo not use any emoji in your responses under any circumstances.`;
}

// Tense-to-level mapping used by the conjugator display
const CONJ_LEVEL_GROUPS = [
  { level: "A1",  tenses: ["Presente do Indicativo", "Imperativo"] },
  { level: "A2",  tenses: ["Pretérito Perfeito Simples", "Pretérito Imperfeito do Indicativo", "Futuro do Indicativo"] },
  { level: "B1",  tenses: ["Condicional", "Presente do Conjuntivo", "Infinitivo Pessoal"] },
  { level: "B2+", tenses: ["Pretérito Mais-que-Perfeito", "Pretérito Imperfeito do Conjuntivo", "Futuro do Conjuntivo"] },
];

const TENSE_USAGE = {
  "Presente do Indicativo": {
    when: "Actions happening now, habitual actions, general truths, and — very commonly in EP — the near future with a time marker.",
    contrast: null,
    examples: [
      { pt: "Falo português todos os dias.", en: "I speak Portuguese every day. (habit)" },
      { pt: "Amanhã vou ao médico.", en: "Tomorrow I'm going to the doctor. (near future via present)" },
    ],
  },
  "Imperativo": {
    when: "Direct commands, instructions, and polite requests. In EP, você-commands use the Presente do Conjuntivo form, not the infinitive.",
    contrast: "Avoid using the infinitive as a command (a Brazilian habit): say 'Fala mais devagar' not 'Falar mais devagar'.",
    examples: [
      { pt: "Fala mais devagar, faz favor.", en: "Speak more slowly, please." },
      { pt: "Não fales tão depressa.", en: "Don't speak so fast. (negative imperative uses conjuntivo)" },
    ],
  },
  "Pretérito Perfeito Simples": {
    when: "A completed action at a specific point in the past. The default past tense for finished events. This is where EP and BP diverge sharply.",
    contrast: "EP uses this where English uses the present perfect ('I've already eaten' = 'Já comi'). The Perfeito Composto (tenho comido) means something different — see B2+ notes.",
    examples: [
      { pt: "Fui ao mercado esta manhã.", en: "I went to the market this morning." },
      { pt: "Já comi.", en: "I've already eaten. (EP uses simple perfect, not compound)" },
    ],
  },
  "Pretérito Imperfeito do Indicativo": {
    when: "Ongoing or habitual actions in the past, background description, and — crucially in EP — polite softened requests in the present.",
    contrast: "Not just 'used to': also used for interrupted actions ('estava a falar quando…') and as a politeness device ('Queria um café' = I'd like a coffee).",
    examples: [
      { pt: "Quando era criança, jogava futebol.", en: "When I was a child, I used to play football." },
      { pt: "Queria um café, faz favor.", en: "I'd like a coffee, please. (polite present request)" },
    ],
  },
  "Futuro do Indicativo": {
    when: "Formal or written future, strong predictions, and hypothetical present (if-clauses). In spoken EP this form sounds formal or literary.",
    contrast: "In everyday spoken EP, use 'ir + infinitive' or the present tense with a time marker instead. 'Falarei' sounds stiff; 'Vou falar' or 'Falo contigo amanhã' sounds natural.",
    examples: [
      { pt: "O relatório estará pronto na sexta.", en: "The report will be ready on Friday. (formal/written)" },
      { pt: "Se tiveres tempo, liga-me.", en: "If you have time, call me. (future in si-clause uses present)" },
    ],
  },
  "Condicional": {
    when: "Hypothetical situations ('would'), polite requests, and the result clause of conditional sentences. Also used in reported speech to shift from future.",
    contrast: "Often interchangeable with the Imperfeito in informal EP speech for hypotheticals: 'Se pudesse, ia' instead of 'Se pudesse, iria'.",
    examples: [
      { pt: "Gostaria de aprender mais.", en: "I would like to learn more." },
      { pt: "Se tivesse dinheiro, comprava uma casa.", en: "If I had money, I would buy a house. (informal: imperfeito in both clauses)" },
    ],
  },
  "Presente do Conjuntivo": {
    when: "Doubt, emotion, wish, recommendation, possibility, and after certain conjunctions (embora, para que, antes que). Triggered by the main clause expressing subjectivity.",
    contrast: "English has largely lost the subjunctive; translate it as 'that…' or with modal verbs. Required after 'espero que', 'é importante que', 'embora', 'talvez'.",
    examples: [
      { pt: "Espero que fales com ele.", en: "I hope (that) you talk to him." },
      { pt: "Embora fale bem, ainda aprende.", en: "Although he speaks well, he's still learning." },
    ],
  },
  "Infinitivo Pessoal": {
    when: "Unique to Portuguese. An inflected infinitive that agrees with the subject — used after prepositions, conjunctions, and in subordinate clauses where the subject differs from the main clause.",
    contrast: "English has no equivalent. Where English uses 'for us to do' or 'after leaving', Portuguese uses the personal infinitive: 'para fazermos', 'depois de saíres'.",
    examples: [
      { pt: "É importante fazermos isto juntos.", en: "It's important for us to do this together." },
      { pt: "Depois de chegares, liga-me.", en: "After you arrive, call me." },
    ],
  },
  "Pretérito Mais-que-Perfeito": {
    when: "The 'past of the past' — an action completed before another past action. Common in literary and formal EP; in speech often replaced by the compound form (tinha + particípio).",
    contrast: "Spoken EP strongly prefers 'tinha falado' over 'falara'. The simple form (falara) survives mainly in writing, news, and formal registers.",
    examples: [
      { pt: "Quando cheguei, já tinham saído.", en: "When I arrived, they had already left. (spoken form)" },
      { pt: "Quando chegou, já partira o comboio.", en: "When he arrived, the train had already left. (formal/written)" },
    ],
  },
  "Pretérito Imperfeito do Conjuntivo": {
    when: "The past subjunctive — used in hypothetical conditions ('if' clauses with past reference), reported speech, and after expressions of wish or doubt referring to the past.",
    contrast: "Pairs with the Condicional in the result clause: 'Se falasse mais devagar, perceberia' (If he spoke more slowly, I would understand).",
    examples: [
      { pt: "Se soubesse a resposta, dizia-te.", en: "If I knew the answer, I'd tell you." },
      { pt: "Queria que ficasses.", en: "I wanted you to stay." },
    ],
  },
  "Futuro do Conjuntivo": {
    when: "A tense almost extinct in other Romance languages but alive and essential in EP. Used in temporal and conditional clauses referring to a hypothetical future — whenever English uses the simple present in a future-oriented 'if/when' clause.",
    contrast: "Do not use the Presente do Conjuntivo here: 'quando fores' (futuro do conjuntivo) not 'quando vás'. This is one of the most distinctive features of European Portuguese grammar.",
    examples: [
      { pt: "Quando fores a Lisboa, visita o Museu do Azulejo.", en: "When you go to Lisbon, visit the Tile Museum." },
      { pt: "Se fizeres isso, vai correr bem.", en: "If you do that, it will go well." },
    ],
  },
};

const SPOKEN_SHORTCUTS = [
  {
    title: "Expressing the future in spoken EP",
    items: [
      { label: "ir + infinitive (most common)", pt: "Vou falar contigo amanhã.", en: "I'm going to talk to you tomorrow." },
      { label: "Present tense + time marker", pt: "Falo contigo amanhã.", en: "I'll talk to you tomorrow." },
      { label: "Futuro do Indicativo (formal/written)", pt: "Falarei contigo amanhã.", en: "I will speak with you tomorrow." },
    ],
    note: "In everyday speech, the bare future (falarei) sounds stiff. Use 'vou falar' or the present tense instead.",
  },
  {
    title: "Expressing the past in spoken EP",
    items: [
      { label: "Perfeito Simples — single completed act (default)", pt: "Comi a sopa.", en: "I ate the soup. / I've eaten the soup." },
      { label: "Imperfeito — habitual or background past", pt: "Comia sopa todos os dias.", en: "I used to eat soup every day." },
      { label: "tinha + particípio — prior past (spoken)", pt: "Já tinha comido quando chegaste.", en: "I had already eaten when you arrived." },
      { label: "tenho + particípio — repeated/ongoing up to now", pt: "Tenho comido melhor ultimamente.", en: "I've been eating better lately. (repeated recent habit)" },
    ],
    note: "EP uses the Perfeito Simples where English uses the present perfect ('I've eaten' = 'Comi'). The compound 'tenho comido' only applies to repeated actions continuing into now — not single completed events.",
  },
  {
    title: "Imperfeito as politeness",
    items: [
      { label: "Softened present request (very common)", pt: "Queria um café, faz favor.", en: "I'd like a coffee, please." },
      { label: "Softened question", pt: "Podia repetir, faz favor?", en: "Could you repeat that, please?" },
      { label: "Tentative statement", pt: "Pensava que era por aqui.", en: "I was thinking it was this way." },
    ],
    note: "Using the Imperfeito instead of the present tense softens a request significantly. 'Quero' sounds blunt; 'Queria' sounds polite and natural.",
  },
];

function buildConjugationPrompt(verb) {
  return `You are a European Portuguese grammar reference. The user wants conjugation tables for the verb "${verb}".\n\nRespond ONLY with a JSON object and nothing else — no markdown, no backticks, no explanation.\n\nFormat:\n{\n  "infinitive": "falar",\n  "meaning": "to speak",\n  "tenses": [\n    {\n      "name": "Presente do Indicativo",\n      "rows": [\n        ["eu", "falo"],["tu", "falas"],["ele/ela", "fala"],["nós", "falamos"],["vós", "falais"],["eles/elas", "falam"]\n      ],\n      "example_pt": "Ela fala português muito bem.",\n      "example_en": "She speaks Portuguese very well."\n    }\n  ]\n}\n\nInclude exactly these 11 tenses in this order:\n1. Presente do Indicativo\n2. Imperativo\n3. Pretérito Perfeito Simples\n4. Pretérito Imperfeito do Indicativo\n5. Futuro do Indicativo\n6. Condicional\n7. Presente do Conjuntivo\n8. Infinitivo Pessoal\n9. Pretérito Mais-que-Perfeito\n10. Pretérito Imperfeito do Conjuntivo\n11. Futuro do Conjuntivo\n\nFor each tense, include one natural example sentence using a randomly chosen pronoun. The example must use the correct conjugated form of "${verb}" for that tense. Use European Portuguese naturally — contractions, clitic placement, and vocabulary appropriate for Portugal (not Brazil).\n\nFor Imperativo rows use: tu, você/ele/ela, nós, vós, vocês/eles/elas (affirmative).\nFor Infinitivo Pessoal rows use all six persons: eu, tu, ele/ela, nós, vós, eles/elas.\nUse European Portuguese forms throughout. Return only valid JSON.`;
}

function ls(key, fallback) { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

const chip = (active) => ({
  display: "inline-block", fontSize: 12, padding: "4px 14px", borderRadius: 999,
  border: active ? "2px solid #2563eb" : "2px solid transparent",
  background: active ? "#2563eb" : "var(--color-background-secondary)",
  color: active ? "#fff" : "var(--color-text-tertiary)",
  cursor: "pointer", margin: "2px", fontFamily: "var(--font-sans)", outline: "none",
  fontWeight: active ? 600 : 400, textTransform: "uppercase", transition: "all 0.15s",
});
const segCtrl = { display: "inline-flex", borderRadius: 999, overflow: "hidden", border: "1.5px solid #2563eb", background: "transparent" };
const segBtn = (active, pos) => ({
  fontSize: 12, fontWeight: active ? 700 : 400,
  padding: "4px 14px",
  background: active ? "#2563eb" : "transparent",
  color: active ? "#fff" : "#2563eb",
  border: "none",
  borderLeft: pos === "mid" || pos === "last" ? "1px solid #2563eb" : "none",
  cursor: "pointer", fontFamily: "var(--font-sans)", outline: "none",
  textTransform: "uppercase", transition: "all 0.15s",
});
const toolBtn = (active) => ({
  fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 999,
  border: "none",
  background: active ? "#2563eb" : "var(--color-background-secondary)",
  color: active ? "#fff" : "var(--color-text-secondary)",
  cursor: "pointer", fontFamily: "var(--font-sans)", outline: "none", whiteSpace: "nowrap",
  textTransform: "uppercase", textDecoration: "none", transition: "all 0.15s",
});
const panelStyle = { padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", flexShrink: 0, overflowY: "auto", maxHeight: 300 };
const listPanelStyle = { padding: "12px 16px", background: "var(--color-background-secondary)", flex: 1, overflowY: "auto" };
const secWrap = { marginBottom: 14 };

// Pure function — no state or prop dependencies; stable reference across renders.
// Defined at module scope so React.memo on MessageBubble is not defeated by a new reference each render.
function renderWithParens(text, baseColor, baseWeight) {
  const parts = text.split(/(\([^)]+\))/g);
  return parts.map((part, pi) => {
    if (/^\([^)]+\)$/.test(part)) {
      const inner = part.slice(1, -1).toLowerCase();
      const isCorrection = /\bnot\b|\bnão\b|\binstead of\b|\bem vez de\b|\buse\b|\bshould be\b|\bdevia\b|\bdeveria\b|\bcorrect\b/.test(inner);
      return isCorrection
        ? <span key={pi} style={{ color: "#800000", fontWeight: 700, fontSize: 16, fontStyle: "italic" }}>{part}</span>
        : <span key={pi} style={{ color: "#166534", fontWeight: 700, fontSize: 16, fontStyle: "italic" }}>{part}</span>;
    }
    return <span key={pi} style={{ color: baseColor, fontWeight: baseWeight }}>{part}</span>;
  });
}

const MessageBubble = React.memo(function MessageBubble({ m, fontSize, ttsSupported, speak, renderWithParens }) {
  if (m._grammarCard && m._grammar) {
    const gt = m._grammar;
    const intro = gt.sections[0];
    const examples = gt.sections.slice(1, 3);
    return (
      <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
        <div style={{ background: "#f0f9ff", border: "1.5px solid #0369a1", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", lineHeight: 1.6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Focus Grammar</p>
          <p style={{ fontSize: Math.max(16, fontSize), fontWeight: 700, color: "#0c4a6e", margin: "0 0 8px" }}>{gt.label}</p>
          <p style={{ fontSize: Math.max(14, fontSize - 1), color: "var(--color-text-primary)", margin: "0 0 8px", lineHeight: 1.6 }}>{intro.body}</p>
          {examples.map((sec, si) => (
            <div key={si} style={{ paddingTop: 6, borderTop: "0.5px solid #bae6fd", marginTop: 4 }}>
              <p style={{ fontSize, fontWeight: 700, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 2px" }}>{sec.title}</p>
              <p style={{ fontSize, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.5 }}>{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (m._idiomCard && m._idiom) {
    const id = m._idiom;
    return (
      <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
        <div style={{ background: "#f5f3ff", border: "1.5px solid #7c3aed", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", lineHeight: 1.6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Focus Idiom</p>
          <p style={{ fontSize: Math.max(16, fontSize), fontWeight: 700, color: "#4c1d95", margin: "0 0 6px", fontStyle: "italic" }}>{id.pt}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 6, borderTop: "0.5px solid #ddd6fe" }}>
            <p style={{ fontSize: Math.max(14, fontSize - 1), margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#6d28d9" }}>Literal: </span>
              <span style={{ color: "var(--color-text-primary)" }}>{id.en}</span>
            </p>
            <p style={{ fontSize: Math.max(14, fontSize - 1), margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#6d28d9" }}>Used when: </span>
              <span style={{ color: "var(--color-text-primary)" }}>{id.when}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  const isAssistant = m.role === "assistant";
  const bubbleStyle = { maxWidth: "80%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "var(--color-background-info)" : "var(--color-background-secondary)", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: Math.max(16, fontSize), lineHeight: 1.6, whiteSpace: "pre-wrap", color: isAssistant ? "#1a56db" : "var(--color-text-info)" };
  if (isAssistant && (m.content.includes("---") || m.content.includes("Correção:") || m.content.includes("Correcao:"))) {
    let main = m.content;
    let correction = "";
    const corrMarkerMatch = m.content.match(/Corre[cç][aã]o:/);
    if (corrMarkerMatch) {
      const idx = m.content.indexOf(corrMarkerMatch[0]);
      const beforeMarker = m.content.slice(0, idx).replace(/\s*---\s*$/, "").trim();
      main = beforeMarker;
      correction = m.content.slice(idx).replace(/^Corre[cç][aã]o:\s*/, "").trim();
    } else {
      const parts = m.content.split(/\n?---\n?/);
      main = parts[0].trim();
      correction = parts.slice(1).join("").trim();
    }
    if (!correction) {
      return (
        <div style={{ ...bubbleStyle, alignSelf: "flex-start" }}>
          {renderWithParens(m.content, "#1a56db", 700)}
        </div>
      );
    }
    return (
      <div style={{ maxWidth: "80%", alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ ...bubbleStyle, alignSelf: undefined }}>
          {renderWithParens(main.trim(), "#1a56db", 700)}
        </div>
        <div style={{ background: "#fff8f8", border: "0.5px solid #d4a0a0", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: Math.max(16, fontSize), lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#800000", fontWeight: 700 }}>
          {correction}
        </div>
        {ttsSupported && (
          <button onClick={() => speak(main.trim())}
            style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-tertiary)", padding: "0 4px" }}
            title="Read aloud">🔊</button>
        )}
      </div>
    );
  }
  return (
    <div style={{ maxWidth: "80%", alignSelf: isAssistant ? "flex-start" : "flex-end", display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ ...bubbleStyle, color: isAssistant ? "#1a56db" : "var(--color-text-info)", fontWeight: isAssistant ? 700 : 400 }}>
        {isAssistant ? renderWithParens(m.content, "#1a56db", 700) : renderWithParens(m.content, "var(--color-text-info)", 400)}
      </div>
      {isAssistant && ttsSupported && (
        <button onClick={() => speak(m.content)}
          style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-tertiary)", padding: "0 4px" }}
          title="Read aloud">🔊</button>
      )}
    </div>
  );
});

const LIGHT_VARS = {
  "--color-background-primary": "#ffffff",
  "--color-background-secondary": "#f3f4f6",
  "--color-background-info": "#eff6ff",
  "--color-background-warning": "#fef3c7",
  "--color-text-primary": "#111827",
  "--color-text-secondary": "#6b7280",
  "--color-text-tertiary": "#9ca3af",
  "--color-text-info": "#1e40af",
  "--color-text-warning": "#92400e",
  "--color-text-danger": "#b91c1c",
  "--color-border-tertiary": "#e5e7eb",
};
const DARK_VARS = {
  "--color-background-primary": "#1f2937",
  "--color-background-secondary": "#111827",
  "--color-background-info": "#1e3a5f",
  "--color-background-warning": "#451a03",
  "--color-text-primary": "#f9fafb",
  "--color-text-secondary": "#9ca3af",
  "--color-text-tertiary": "#6b7280",
  "--color-text-info": "#93c5fd",
  "--color-text-warning": "#fcd34d",
  "--color-text-danger": "#f87171",
  "--color-border-tertiary": "#374151",
};

function App() {

  const [theme, setTheme] = useState(() => ls("pe_theme", "light"));
  const [level, setLevel] = useState(() => ls("pe_level", "A2"));
  const [correctionMode, setCorrectionMode] = useState(() => ls("pe_correction", "end"));
  const [registerMode, setRegisterMode] = useState(() => ls("pe_register", "standard"));
  const [apiKey, setApiKey] = useState(() => ls("pe_api_key", ""));
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [azureKey, setAzureKey] = useState(() => ls("pe_azure_key", ""));
  const [azureKeyInput, setAzureKeyInput] = useState("");
  const [azureRegion, setAzureRegion] = useState(() => ls("pe_azure_region", ""));
  const [topics, setTopics] = useState(() => {
    const saved = ls("pe_topics", null);
    if (saved && Array.isArray(saved)) return saved;
    return DEFAULT_TOPICS.map(l => ({ label: l, selected: true }));
  });
  const [customTopic, setCustomTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [listTab, setListTab] = useState("cognates");
  const [baseFontSize, setBaseFontSize] = useState(() => ls("pe_fontsize", 16));
  const [fontOffset, setFontOffset] = useState(0);
  const fontSize = Math.max(11, Math.min(24, baseFontSize + fontOffset));
  const [verbOfSession, setVerbOfSession] = useState(() => pickRandom(ALL_VERBS_DATA).inf);
  const [verbRefTab, setVerbRefTab] = useState("irregular");
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [verbInput, setVerbInput] = useState("");
  const [conjugation, setConjugation] = useState(null);
  const [conjLoading, setConjLoading] = useState(false);
  const [conjError, setConjError] = useState("");
  const [conjOpenGroups, setConjOpenGroups] = useState(true);   // true = all groups open
  const [conjUsageOpen, setConjUsageOpen] = useState(false);    // false = all usage sections closed
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [focusIdiom, setFocusIdiom] = useState(null);
  const [idiomDropdownOpen, setIdiomDropdownOpen] = useState(false);
  const [idiomDropdownSearch, setIdiomDropdownSearch] = useState("");
  const idiomDropdownRef = useRef(null);
  const [focusGrammar, setFocusGrammar] = useState(null);
  const [grammarDropdownOpen, setGrammarDropdownOpen] = useState(false);
  const grammarDropdownRef = useRef(null);
  const [vocabPos, setVocabPos] = useState("NOUN");
  const [vocabCard, setVocabCard] = useState(null);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [vocabError, setVocabError] = useState("");
  const [vocabReview, setVocabReview] = useState(() => ls("pe_vocab_review", []));
  const [vocabShowReview, setVocabShowReview] = useState(false);
  const [verbDropdownOpen, setVerbDropdownOpen] = useState(false);
  const [verbDropdownSearch, setVerbDropdownSearch] = useState("");
  const verbDropdownRef = useRef(null);

  // Minimal pairs state
  const [pairsOrder, setPairsOrder] = useState(() => MINIMAL_PAIRS.map((_, i) => i));
  const [pairIndex, setPairIndex] = useState(0);
  const [pairsQuizMode, setPairsQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);   // "a" or "b"
  const [quizResult, setQuizResult] = useState(null);   // null | "correct" | "wrong"
  const [pairsScore, setPairsScore] = useState({ correct: 0, total: 0 });

  const [mediaOpenSection, setMediaOpenSection] = useState(null);
  const mediaSectionRefs = useRef({});

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const vocabCache = useRef({});
  const recognitionRef = useRef(null);
  const selectedVoiceRef = useRef(null);
  const intentionalStopRef = useRef(false);
  const enviarStopRef = useRef(false);
  const finalTranscriptRef = useRef("");

  // Speech state
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => ls("pe_tts_enabled", false));
  const [ttsRate, setTtsRate] = useState(() => ls("pe_tts_rate", 1.0));
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechLang, setSpeechLang] = useState("pt-PT");
  const speechSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const ttsSupported = "speechSynthesis" in window;

  // Load voices — they load async in most browsers
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        // If Azure is configured, default to Azure voice; otherwise pick best browser voice
        if (azureKey && azureRegion) {
          setSelectedVoice({ name: "__azure_raquel__", lang: "pt-PT", azureVoice: "pt-PT-RaquelNeural" });
        } else {
          const ptPT = v.find(x => x.lang === "pt-PT");
          const ptBR = v.find(x => x.lang === "pt-BR");
          const anyPt = v.find(x => x.lang.startsWith("pt"));
          setSelectedVoice(ptPT || ptBR || anyPt || v[0]);
        }
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Keep ref in sync so speak() always sees the current voice without stale closure issues
  useEffect(() => { selectedVoiceRef.current = selectedVoice; }, [selectedVoice]);

  const createRecognition = (SR, lang) => {
    const r = new SR();
    r.lang = lang;
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += (finalTranscriptRef.current ? " " : "") + e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setInput((finalTranscriptRef.current + (interim ? " " + interim : "")).trim());
    };
    r.onerror = (ev) => {
      if (!intentionalStopRef.current && ev.error === "no-speech") return;
      setListening(false);
    };
    r.onend = () => {
      if (!intentionalStopRef.current) {
        try {
          const next = createRecognition(SR, lang);
          recognitionRef.current = next;
          next.start();
          return;
        } catch (_) { /* fall through */ }
      }
      setListening(false);
      if (enviarStopRef.current) { enviarStopRef.current = false; return; }
      const final = finalTranscriptRef.current.trim();
      if (final) {
        setInput(final);
        sendMessage(final);
      }
    };
    return r;
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    intentionalStopRef.current = false;
    finalTranscriptRef.current = "";
    const r = createRecognition(SR, speechLang);
    recognitionRef.current = r;
    r.start();
    setListening(true);
  };

  const stopListening = () => {
    intentionalStopRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  const speakViaAzure = async (text, lang = "pt-PT") => {
    if (!azureKey || !azureRegion || !text) return false;
    try {
      const ratePercent = Math.round((ttsRate - 1) * 100) + "%";
      const escaped = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const azureVoiceName = selectedVoiceRef.current?.azureVoice || "pt-PT-RaquelNeural";
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-PT'><voice name='${azureVoiceName}'><prosody rate='${ratePercent}'>${escaped}</prosody></voice></speak>`;
      const resp = await fetch(`https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": azureKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
          "User-Agent": "PortuguesEuropeu",
        },
        body: ssml,
      });
      if (!resp.ok) {
        const errText = await resp.text();
        console.error(`Azure TTS ${resp.status}:`, errText);
        return false;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setSpeaking(true);
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.play();
      return true;
    } catch (e) { console.error("Azure TTS fetch error:", e); return false; }
  };

  // Find a real browser SpeechSynthesisVoice for fallback — never pass the fake __azure__ object
  const findBrowserVoice = (lang) => {
    const vs = window.speechSynthesis.getVoices();
    if (lang === "en-US") return vs.find(x => x.lang === "en-US") || vs.find(x => x.lang.startsWith("en")) || null;
    return vs.find(x => x.lang === "pt-PT") || vs.find(x => x.lang.startsWith("pt")) || null;
  };

  const speakViaBrowser = (text, lang, voice) => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    // Only assign a real SpeechSynthesisVoice — never the fake __azure__ sentinel
    const realVoice = (voice && voice.name !== "__azure__") ? voice : findBrowserVoice(lang || "pt-PT");
    if (realVoice) { utt.voice = realVoice; utt.lang = realVoice.lang; } else { utt.lang = lang || "pt-PT"; }
    utt.rate = ttsRate;
    utt.pitch = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const speak = async (text) => {
    // Strip markdown-ish symbols and correction block
    const clean = text
      .replace(/---[\s\S]*$/m, "")
      .replace(/\*[^*]+\*/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/[#_`]/g, "")
      .trim();
    if (!clean) return;
    const currentVoice = selectedVoiceRef.current;
    const isAzureVoice = currentVoice === null || currentVoice?.name?.startsWith("__azure");
    if (azureKey && azureRegion && isAzureVoice) {
      const ok = await speakViaAzure(clean, "pt-PT");
      if (ok) return;
    }
    speakViaBrowser(clean, "pt-PT", currentVoice);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // Shared TTS helper for list tabs. Routes through Azure if key+region set and lang is pt-PT.
  const speakListPT = async (text, lang = "pt-PT") => {
    if (!text) return;
    const isAzureVoice = selectedVoiceRef.current === null || selectedVoiceRef.current?.name?.startsWith("__azure");
    if (azureKey && azureRegion && lang === "pt-PT" && isAzureVoice) {
      const ok = await speakViaAzure(text, "pt-PT");
      if (ok) return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = ttsRate;
    const v = findBrowserVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Auto-speak last assistant message when TTS is on and loading just finished
  useEffect(() => {
    if (ttsEnabled && !loading && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant" && !last._idiomCard && !last._grammarCard && last.content && last.content !== "__IDIOM_CARD__" && last.content !== "__GRAMMAR_CARD__") {
        speak(last.content);
      }
    }
  }, [loading]);
  useEffect(() => {
    const handler = (e) => {
      if (verbDropdownRef.current && !verbDropdownRef.current.contains(e.target)) setVerbDropdownOpen(false);
      if (idiomDropdownRef.current && !idiomDropdownRef.current.contains(e.target)) setIdiomDropdownOpen(false);
      if (grammarDropdownRef.current && !grammarDropdownRef.current.contains(e.target)) setGrammarDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyTheme = (t) => { setTheme(t); lsSet("pe_theme", t); };
  const applyLevel = (l) => { setLevel(l); lsSet("pe_level", l); };
  const applyCorrection = (c) => { setCorrectionMode(c); lsSet("pe_correction", c); };
  const applyRegister = (r) => { setRegisterMode(r); lsSet("pe_register", r); };
  const applyBaseFontSize = (size) => { setBaseFontSize(size); setFontOffset(0); lsSet("pe_fontsize", size); };
  const adjustFontOffset = (delta) => setFontOffset(prev => Math.max(11 - baseFontSize, Math.min(24 - baseFontSize, prev + delta)));

  const toggleTopic = (i) => setTopics(prev => {
    const next = prev.map((t, idx) => idx === i ? { ...t, selected: !t.selected } : t);
    lsSet("pe_topics", next); return next;
  });
  const addCustomTopic = () => {
    const trimmed = customTopic.trim();
    if (trimmed && !topics.find(t => t.label.toLowerCase() === trimmed.toLowerCase())) {
      setTopics(prev => { const next = [...prev, { label: trimmed, selected: true }]; lsSet("pe_topics", next); return next; });
      setCustomTopic("");
    }
  };
  const removeTopic = (i) => setTopics(prev => { const next = prev.filter((_, idx) => idx !== i); lsSet("pe_topics", next); return next; });

  const sendMessage = async (overrideText) => {
    if (listening) {
      intentionalStopRef.current = true;
      enviarStopRef.current = true;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      finalTranscriptRef.current = "";
    }
    const text = (overrideText || input).trim().replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };

    // Build clean strictly-alternating API history
    const rawHistory = messages.filter(m =>
      !m._idiomCard &&
      !m._grammarCard &&
      m.content !== "__IDIOM_CARD__" &&
      m.content !== "__GRAMMAR_CARD__" &&
      m.content.trim() !== "" &&
      (m.role === "user" || m.role === "assistant")
    );
    const cleanHistory = [];
    for (const msg of rawHistory) {
      const last = cleanHistory[cleanHistory.length - 1];
      if (!last || last.role !== msg.role) cleanHistory.push(msg);
      else cleanHistory[cleanHistory.length - 1] = msg;
    }

    setMessages(prev => [
      ...prev.filter(m => m._idiomCard || m._grammarCard || m.content.trim() !== ""),
      userMsg,
    ]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          ...(apiKey ? { "x-api-key": apiKey } : {})
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: buildSystemPrompt(level, correctionMode, topics, verbOfSession, focusIdiom, focusGrammar, registerMode),
          messages: [...cleanHistory, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await resp.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: `*(API error: ${data.error.message})*` }]);
      } else {
        const reply = data.content?.find(b => b.type === "text")?.text || "Desculpa, não percebi. Podes repetir?";
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      const errMsg = err?.message || String(err);
      setMessages(prev => [...prev, { role: "assistant", content: `*(Error: ${errMsg})*` }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };


  const fetchVocabCard = async (word, pos) => {
    const cacheKey = `${pos}:${word}`;
    if (vocabCache.current[cacheKey]) {
      setVocabCard(vocabCache.current[cacheKey]);
      return;
    }
    setVocabLoading(true); setVocabCard(null); setVocabError("");
    const bookQuote = SH_QUOTES[pos]?.[word] || "";
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true", ...(apiKey ? { "x-api-key": apiKey } : {}) },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 600,
          messages: [{ role: "user", content: buildVocabPrompt(word, pos, level, bookQuote) }],
        }),
      });
      const data = await resp.json();
      if (data.error) { setVocabError(`API error: ${data.error.message}`); setVocabLoading(false); return; }
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      try {
        const card = JSON.parse(raw.replace(/```json|```/g, "").trim());
        vocabCache.current[cacheKey] = card;
        setVocabCard(card);
      } catch { setVocabError("Could not parse response. Try again."); }
    } catch (err) { setVocabError(`Connection error: ${err.message}`); }
    setVocabLoading(false);
  };

  const drawVocabCard = () => {
    const list = SH_VOCAB[vocabPos] || [];
    const word = list[Math.floor(Math.random() * list.length)];
    fetchVocabCard(word, vocabPos);
  };

  const addToReview = () => {
    if (vocabCard && !vocabReview.find(r => r.word_bp === vocabCard.word_bp)) {
      setVocabReview(prev => { const next = [...prev, vocabCard]; lsSet("pe_vocab_review", next); return next; });
    }
  };

  const lookupVerb = async () => {
    const v = verbInput.trim();
    if (!v) return;
    setConjLoading(true); setConjugation(null); setConjError("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true", ...(apiKey ? { "x-api-key": apiKey } : {}) },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 3500,
          messages: [{ role: "user", content: buildConjugationPrompt(v) }],
        }),
      });
      const data = await resp.json();
      if (data.error) { setConjError(`API error: ${data.error.message}`); setConjLoading(false); return; }
      const raw = data.content?.find(b => b.type === "text")?.text || "";
      if (!raw) { setConjError("Empty response from API. Try again."); setConjLoading(false); return; }
      try {
        setConjugation(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (parseErr) {
        setConjError(`Could not parse conjugation data. Try again. (${parseErr.message})`);
      }
    } catch (err) { setConjError(`Connection error: ${err.message}`); }
    setConjLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };


  const themeVars = theme === "light" ? LIGHT_VARS : theme === "dark" ? DARK_VARS : {};

  const secTitle = { fontSize, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 6px", textTransform: "uppercase" };
  const tbl = { width: "100%", borderCollapse: "collapse", fontSize };
  const tdL = { fontFamily: "var(--font-mono)", color: "var(--color-text-info)", padding: "3px 8px 3px 0", verticalAlign: "top", width: "42%", fontSize };
  const tdR = { color: "var(--color-text-secondary)", padding: "3px 0", verticalAlign: "top", fontSize };

  const verbRefList = verbRefTab === "irregular" ? IRREGULAR_VERBS_SLIM
    : verbRefTab === "ar" ? REGULAR_AR_VERBS : REGULAR_ER_IR_VERBS;

  const filteredVerbDropdown = useMemo(() => {
    const q = verbDropdownSearch.toLowerCase();
    if (!q) return ALL_VERB_INFS_SORTED;
    return ALL_VERB_INFS_SORTED.filter(v => {
      const en = ALL_VERBS_MAP.get(v) || "";
      return v.includes(q) || en.toLowerCase().includes(q);
    });
  }, [verbDropdownSearch]);

  const irreg = IRREGULAR_VERBS.find(v => v.inf === selectedVerb);


  return (
    <div style={{ ...themeVars, colorScheme: theme === "system" ? "light dark" : theme, fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", height: "100vh", maxHeight: 760, minHeight: 500, background: "var(--color-background-primary)" }}>

      {/* Header */}
      <div style={{ padding: "8px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 2, flexShrink: 0, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }}>
            <rect x="0" y="0" width="11" height="20" fill="#006600" />
            <rect x="11" y="0" width="17" height="20" fill="#CC0000" />
            <ellipse cx="11" cy="10" rx="5.5" ry="5.5" fill="none" stroke="#FFD700" strokeWidth="1.2" />
            <rect x="8.2" y="7.5" width="5.6" height="5" rx="0.5" fill="#FFD700" fillOpacity="0.15" stroke="#FFD700" strokeWidth="0.8" />
            <rect x="9.5" y="8.7" width="1.2" height="1.2" rx="0.2" fill="#003399" />
            <rect x="11.3" y="8.7" width="1.2" height="1.2" rx="0.2" fill="#003399" />
            <rect x="10.4" y="8.7" width="1.2" height="1.2" rx="0.2" fill="#003399" />
            <rect x="10.4" y="10.1" width="1.2" height="1.2" rx="0.2" fill="#003399" />
            <rect x="10.4" y="7.3" width="1.2" height="1.2" rx="0.2" fill="#003399" />
          </svg>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Português Europeu</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "1px 0 0" }}>European Portuguese practice</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <div style={segCtrl}>
            {LEVELS.map((l, i) => {
              const pos = i === 0 ? "first" : i === LEVELS.length - 1 ? "last" : "mid";
              return <button key={l} style={segBtn(level === l, pos)} onClick={() => applyLevel(l)}>{l}</button>;
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "1cm", background: "var(--color-background-secondary)", borderRadius: 999, padding: "2px 4px", position: "relative" }}>
            <button style={{ ...toolBtn(false), padding: "3px 10px" }} onClick={() => adjustFontOffset(-1)}>A−</button>
            <button style={{ ...toolBtn(false), padding: "3px 10px" }} onClick={() => adjustFontOffset(1)}>A+</button>
            {fontOffset !== 0 && (
              <span title={`Session override: ${fontOffset > 0 ? "+" : ""}${fontOffset}px (base: ${baseFontSize}px)`}
                style={{ position: "absolute", top: 1, right: 1, width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", pointerEvents: "none" }} />
            )}
          </div>
          <button style={{ ...toolBtn(false), marginLeft: 4, color: "#16a34a", background: "#dcfce7" }} onClick={() => setMessages([])}>↺ Clear</button>
        </div>
      </div>

      {/* Focus bar */}
      <div style={{ padding: "5px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: "var(--color-background-secondary)", flexWrap: "wrap" }}>
        {/* Focus Verb */}
        <div ref={verbDropdownRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", fontVariant: "small-caps", textTransform: "lowercase" }}>Focus Verb</span>
          <button onClick={() => { setVerbDropdownOpen(o => !o); setVerbDropdownSearch(""); }}
            style={{ fontSize: 16, fontWeight: 700, padding: "3px 12px", borderRadius: "var(--border-radius-md)", border: "1px solid #2563eb", background: "var(--color-background-primary)", color: IRREGULAR_VERBS_SET.has(verbOfSession) ? "#800000" : "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {(() => {
              const rawEn = ALL_VERBS_MAP.get(verbOfSession) || "";
              const en = rawEn.replace(/\(([^()]+\([^()]+\)[^()]*)\)/g, (m, outer) => `(${outer.replace(/\(([^()]+)\)/g, '[$1]')})`);
              const isIrreg = IRREGULAR_VERBS_SET.has(verbOfSession);
              return <>{verbOfSession.toUpperCase()}{en ? <span style={{ fontWeight: 400 }}> — ({en})</span> : null}{isIrreg ? <span style={{ fontWeight: 400 }}> irr</span> : null}</>;
            })()}
            <span style={{ fontSize: 12, marginLeft: 2 }}>▾</span>
          </button>
          {verbDropdownOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 9999, background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "var(--border-radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)", minWidth: 320, maxHeight: 320, display: "flex", flexDirection: "column" }}>
              <input autoFocus placeholder="Search verbs…" value={verbDropdownSearch}
                onChange={e => setVerbDropdownSearch(e.target.value)}
                style={{ fontSize: 14, padding: "6px 10px", border: "none", borderBottom: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", color: "#111827", borderRadius: "var(--border-radius-md) var(--border-radius-md) 0 0" }} />
              <div style={{ overflowY: "auto", flex: 1, background: "#ffffff" }}>
                {filteredVerbDropdown.map(v => {
                  const isIrreg = IRREGULAR_VERBS_SET.has(v);
                  const rawEn = ALL_VERBS_MAP.get(v) || "";
                  const en = rawEn.replace(/\(([^()]+\([^()]+\)[^()]*)\)/g, (m, outer) => `(${outer.replace(/\(([^()]+)\)/g, '[$1]')})`);
                  const color = isIrreg ? "#800000" : "#2563eb";
                  const isSelected = v === verbOfSession;
                  return (
                    <div key={v} onClick={() => { setVerbOfSession(v); setVerbDropdownOpen(false); setVerbDropdownSearch(""); }}
                      style={{ padding: "5px 12px", cursor: "pointer", background: isSelected ? "#dbeafe" : "#ffffff", display: "flex", alignItems: "baseline", gap: 6 }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "#ffffff"; }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color }}>{v.toUpperCase()}</span>
                      {en && <span style={{ fontSize: 16, color: "#6b7280" }}>({en})</span>}
                      {isIrreg && <span style={{ fontSize: 12, color: "#800000" }}>irr</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Focus Idiom */}
        <div ref={idiomDropdownRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", fontVariant: "small-caps", textTransform: "lowercase" }}>Focus Idiom</span>
          <button onClick={() => { setIdiomDropdownOpen(o => !o); setIdiomDropdownSearch(""); }}
            style={{ fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: "var(--border-radius-md)", border: "1px solid #7c3aed", background: "var(--color-background-primary)", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, maxWidth: 260 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{focusIdiom ? focusIdiom.pt : "None"}</span>
            {focusIdiom && (
              <span onClick={e => { e.stopPropagation(); setFocusIdiom(null); setMessages(prev => prev.filter(m => m._idiomCard !== true)); }}
                style={{ fontSize: 12, color: "#7c3aed", opacity: 0.6, marginLeft: 2, flexShrink: 0 }}>✕</span>
            )}
            <span style={{ fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>▾</span>
          </button>
          {idiomDropdownOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 9999, background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "var(--border-radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)", minWidth: 340, maxHeight: 320, display: "flex", flexDirection: "column" }}>
              <input autoFocus placeholder="Search idioms…" value={idiomDropdownSearch}
                onChange={e => setIdiomDropdownSearch(e.target.value)}
                style={{ fontSize: 14, padding: "6px 10px", border: "none", borderBottom: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", color: "#111827", borderRadius: "var(--border-radius-md) var(--border-radius-md) 0 0" }} />
              <div style={{ overflowY: "auto", flex: 1, background: "#ffffff" }}>
                <div onClick={() => { setFocusIdiom(null); setIdiomDropdownOpen(false); setIdiomDropdownSearch(""); }}
                  style={{ padding: "5px 12px", cursor: "pointer", fontSize: 13, color: "#6b7280", fontStyle: "italic" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>None</div>
                {IDIOMS.filter(id => {
                  const q = idiomDropdownSearch.toLowerCase();
                  return !q || id.pt.toLowerCase().includes(q) || id.en.toLowerCase().includes(q) || id.when.toLowerCase().includes(q);
                }).map((id, i) => {
                  const isSelected = focusIdiom?.pt === id.pt;
                  return (
                    <div key={i}
                      onClick={() => {
                        setFocusIdiom(id); setIdiomDropdownOpen(false); setIdiomDropdownSearch("");
                        setMessages(prev => [...prev.filter(m => m._idiomCard !== true), { role: "assistant", _idiomCard: true, _idiom: id, content: "__IDIOM_CARD__" }]);
                      }}
                      style={{ padding: "6px 12px", cursor: "pointer", background: isSelected ? "#f3e8ff" : "#ffffff", borderBottom: "0.5px solid #f3f4f6" }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f3f4f6"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "#ffffff"; }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#7c3aed", margin: "0 0 1px" }}>{id.pt}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{id.when}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Focus Grammar */}
        <div ref={grammarDropdownRef} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", fontVariant: "small-caps", textTransform: "lowercase" }}>Focus Grammar</span>
          <button onClick={() => setGrammarDropdownOpen(o => !o)}
            style={{ fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: "var(--border-radius-md)", border: "1px solid #0369a1", background: "var(--color-background-primary)", color: "#0369a1", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, maxWidth: 220 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{focusGrammar ? focusGrammar.label : "None"}</span>
            {focusGrammar && (
              <span onClick={e => { e.stopPropagation(); setFocusGrammar(null); setMessages(prev => prev.filter(m => m._grammarCard !== true)); }}
                style={{ fontSize: 12, color: "#0369a1", opacity: 0.6, marginLeft: 2, flexShrink: 0 }}>✕</span>
            )}
            <span style={{ fontSize: 12, marginLeft: "auto", flexShrink: 0 }}>▾</span>
          </button>
          {grammarDropdownOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 9999, background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "var(--border-radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)", minWidth: 220, display: "flex", flexDirection: "column" }}>
              <div onClick={() => { setFocusGrammar(null); setGrammarDropdownOpen(false); }}
                style={{ padding: "5px 12px", cursor: "pointer", fontSize: 13, color: "#6b7280", fontStyle: "italic", borderBottom: "0.5px solid #f3f4f6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>None</div>
              {GRAMMAR_FOCUS_TOPICS.map((t, i) => {
                const isSelected = focusGrammar?.id === t.id;
                return (
                  <div key={i}
                    onClick={() => {
                      setFocusGrammar(t); setGrammarDropdownOpen(false);
                      const fullTopic = GRAMMAR_TOPICS.find(gt => gt.id === t.id);
                      setMessages(prev => [...prev.filter(m => m._grammarCard !== true), { role: "assistant", _grammarCard: true, _grammar: fullTopic, content: "__GRAMMAR_CARD__" }]);
                    }}
                    style={{ padding: "7px 12px", cursor: "pointer", background: isSelected ? "#e0f2fe" : "#ffffff", borderBottom: "0.5px solid #f3f4f6" }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f0f9ff"; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "#ffffff"; }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0369a1", margin: 0 }}>{t.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Panel tabs */}
      <div style={{ padding: "6px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 3, flexWrap: "wrap", flexShrink: 0 }}>
        {PANELS.map(p => {
          const isSettings = p.id === "settings";
          const isActive = activePanel === p.id;
          const style = isSettings
            ? { ...toolBtn(isActive), fontSize: 15, fontWeight: 700, background: isActive ? "#16a34a" : "#dcfce7", color: isActive ? "#fff" : "#16a34a" }
            : { ...toolBtn(isActive), fontSize: 15, fontWeight: 700, background: isActive ? "#2563eb" : "transparent", color: isActive ? "#fff" : "var(--color-text-secondary)" };
          const label = isSettings ? `⚙ ${p.label}` : p.id === "lists" ? `☰ ${p.label}` : p.label;
          return <button key={p.id} style={style} onClick={() => setActivePanel(ap => ap === p.id ? null : p.id)}>{label}</button>;
        })}
      </div>

      {/* Settings panel */}
      {activePanel === "settings" && (
        <div style={{ ...panelStyle, flex: 1, maxHeight: "none" }}>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Anthropic API Key</p>
          <div style={{ marginBottom: 12 }}>
            {apiKey ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "#16a34a", fontWeight: 600 }}>✓ API key saved</span>
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>({apiKey.slice(0, 12)}…)</span>
                <button style={{ ...toolBtn(false), marginLeft: "auto", color: "#dc2626" }}
                  onClick={() => { setApiKey(""); lsSet("pe_api_key", ""); setApiKeyInput(""); }}>Remove</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="password"
                  placeholder="Paste your sk-ant-... key here"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  style={{ flex: 1, fontSize: 14, padding: "5px 10px", border: "1.5px solid #2563eb", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none", fontFamily: "var(--font-mono)" }} />
                <button style={{ ...toolBtn(true), background: "#2563eb", color: "#fff", padding: "5px 14px" }}
                  onClick={() => { const k = apiKeyInput.trim().replace(/[^\x20-\x7E\xA0-\xFF]/g, ""); if (k) { setApiKey(k); lsSet("pe_api_key", k); setApiKeyInput(""); } }}>Save</button>
              </div>
            )}
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "5px 0 0", fontStyle: "italic" }}>
              Stored locally in your browser only. Never sent anywhere except Anthropic's API. Get a key at console.anthropic.com.
            </p>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Azure TTS Key</p>
          <div style={{ marginBottom: 12 }}>
            {azureKey ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, color: "#16a34a", fontWeight: 600 }}>✓ Azure key saved</span>
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>({azureKey.slice(0, 8)}…)</span>
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Region: <strong>{azureRegion || "not set"}</strong></span>
                <button style={{ ...toolBtn(false), marginLeft: "auto", color: "#dc2626" }}
                  onClick={() => { setAzureKey(""); lsSet("pe_azure_key", ""); setAzureKeyInput(""); setAzureRegion(""); lsSet("pe_azure_region", ""); setSelectedVoice(null); }}>Remove</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <input
                  type="password"
                  placeholder="Paste Azure Speech key here"
                  value={azureKeyInput}
                  onChange={e => setAzureKeyInput(e.target.value)}
                  style={{ flex: 2, minWidth: 180, fontSize: 14, padding: "5px 10px", border: "1.5px solid #7c3aed", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none", fontFamily: "var(--font-mono)" }} />
                <input
                  type="text"
                  placeholder="Region (e.g. eastus)"
                  value={azureRegion}
                  onChange={e => { setAzureRegion(e.target.value.trim()); lsSet("pe_azure_region", e.target.value.trim()); }}
                  style={{ flex: 1, minWidth: 100, fontSize: 14, padding: "5px 10px", border: "1.5px solid #7c3aed", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none", fontFamily: "var(--font-mono)" }} />
                <button style={{ ...toolBtn(true), background: "#7c3aed", color: "#fff", padding: "5px 14px" }}
                  onClick={() => { const k = azureKeyInput.trim(); if (k && azureRegion) { setAzureKey(k); lsSet("pe_azure_key", k); setAzureKeyInput(""); setSelectedVoice({ name: "__azure_raquel__", lang: "pt-PT", azureVoice: "pt-PT-RaquelNeural" }); } }}>Save</button>
              </div>
            )}
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "5px 0 0", fontStyle: "italic" }}>
              Stored locally only. Used for Azure Cognitive Services TTS (Inês Neural, pt-PT). Get a key at portal.azure.com.
            </p>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Default Font Size</p>
          <div style={{ marginBottom: 12 }}>
            <div style={segCtrl}>
              {[[14,"Small"],[16,"Medium"],[18,"Large"],[20,"X-Large"]].map(([size, label], i, arr) => {
                const pos = i === 0 ? "first" : i === arr.length - 1 ? "last" : "mid";
                return <button key={size} style={segBtn(baseFontSize === size, pos)} onClick={() => applyBaseFontSize(size)}>{label}</button>;
              })}
            </div>
            {fontOffset !== 0 && (
              <p style={{ fontSize: 11, color: "#f59e0b", margin: "5px 0 0", fontStyle: "italic" }}>
                ● Session override active ({fontOffset > 0 ? "+" : ""}{fontOffset}px). Closes with the app.
              </p>
            )}
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Display Theme</p>
          <div style={{ marginBottom: 12 }}>
            <div style={segCtrl}>
              {[["light","☀ Light"],["dark","☾ Dark"],["system","⊙ System"]].map(([id, label], i, arr) => {
                const pos = i === 0 ? "first" : i === arr.length - 1 ? "last" : "mid";
                return <button key={id} style={segBtn(theme === id, pos)} onClick={() => applyTheme(id)}>{label}</button>;
              })}
            </div>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Language Level</p>
          <div style={{ marginBottom: 12 }}>
            <div style={segCtrl}>
              {LEVELS.map((l, i) => {
                const pos = i === 0 ? "first" : i === LEVELS.length - 1 ? "last" : "mid";
                return <button key={l} style={segBtn(level === l, pos)} onClick={() => applyLevel(l)}>{l}</button>;
              })}
            </div>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Error correction</p>
          <div style={{ marginBottom: 12 }}>
            <div style={segCtrl}>
              {CORRECTION_MODES.map((m, i) => {
                const pos = i === 0 ? "first" : i === CORRECTION_MODES.length - 1 ? "last" : "mid";
                return <button key={m.id} style={segBtn(correctionMode === m.id, pos)} onClick={() => applyCorrection(m.id)}>{m.label}</button>;
              })}
            </div>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Conversation Register</p>
          <div style={{ marginBottom: 4 }}>
            <div style={segCtrl}>
              {REGISTER_MODES.map((m, i) => {
                const pos = i === 0 ? "first" : "last";
                return <button key={m.id} style={segBtn(registerMode === m.id, pos)} onClick={() => applyRegister(m.id)}>{m.label}</button>;
              })}
            </div>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "5px 0 12px", fontStyle: "italic" }}>
              {registerMode === "colloquial"
                ? "Colloquial: the bot uses street vocabulary, contractions, slang, and filler words a local would use in casual conversation."
                : "Standard: the bot uses correct, textbook-quality European Portuguese — clear vocabulary, complete sentences."}
            </p>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Speaker Default</p>
          <div style={{ marginBottom: 12 }}>
            <div style={segCtrl}>
              {[["on","🔊 On"],["off","🔇 Off"]].map(([id, label], i, arr) => {
                const pos = i === 0 ? "first" : "last";
                const active = id === "on" ? ttsEnabled : !ttsEnabled;
                return <button key={id} style={segBtn(active, pos)} onClick={() => {
                  const next = id === "on";
                  setTtsEnabled(next);
                  lsSet("pe_tts_enabled", next);
                  if (!next && speaking) stopSpeaking();
                }}>{label}</button>;
              })}
            </div>
          </div>
          <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>Topics</p>
          <div style={{ marginBottom: 8 }}>
            {topics.map((t, i) => (
              <button key={i} style={chip(t.selected)} onClick={() => toggleTopic(i)}>
                {t.label}{!DEFAULT_TOPICS.includes(t.label) && <span onClick={e => { e.stopPropagation(); removeTopic(i); }} style={{ marginLeft: 5, opacity: 0.7 }}>×</span>}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <input style={{ fontSize: 12, flex: 1, padding: "4px 8px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 999, background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
              placeholder="Add custom topic…" value={customTopic}
              onChange={e => setCustomTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomTopic()} />
            <button style={{ ...toolBtn(false), background: "#eff6ff", color: "#2563eb" }} onClick={addCustomTopic}>+ Add</button>
          </div>
        </div>
      )}

      {/* Lists panel */}
      {activePanel === "lists" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "4px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 2, flexWrap: "wrap", background: "var(--color-background-secondary)", flexShrink: 0 }}>
            {LIST_TABS.map(t => (
              <button key={t.id}
                style={{ fontSize: 14, fontWeight: 700, padding: "3px 10px", borderRadius: 999, border: "none", background: listTab === t.id ? "#2563eb" : "transparent", color: listTab === t.id ? "#fff" : "var(--color-text-secondary)", cursor: "pointer", fontFamily: "var(--font-sans)", textTransform: "uppercase" }}
                onClick={() => setListTab(t.id)}>{t.label}</button>
            ))}
          </div>
          {listTab === "sounds" && (
            <div style={listPanelStyle}>
              {PRONUNCIATION_GUIDE.map((sec, si) => (
                <div key={si} style={secWrap}>
                  <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>{sec.section}</p>
                  <table style={tbl}><tbody>
                    {sec.items.map((item, ii) => {
                      const renderSyllables = () => {
                        if (!item.syllables || !item.highlight) return null;
                        const syllables = item.syllables;
                        const highlight = item.highlight;
                        const idx = syllables.toLowerCase().indexOf(highlight.toLowerCase());
                        if (idx === -1) return <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(12, fontSize - 1), color: "var(--color-text-info)" }}>{syllables}</span>;
                        const before = syllables.slice(0, idx);
                        const match = syllables.slice(idx, idx + highlight.length);
                        const after = syllables.slice(idx + highlight.length);
                        return (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(12, fontSize - 1), color: "var(--color-text-info)", letterSpacing: "0.02em" }}>
                            {before}
                            <span style={{ textDecoration: "underline", textDecorationColor: "#7c3aed", textDecorationThickness: 2, fontWeight: 700, color: "#7c3aed" }}>{match}</span>
                            {after}
                          </span>
                        );
                      };
                      // Section header rows (no example)
                      if (!item.example && !item.example_en) {
                        return (
                          <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                            <td style={{ width: 32 }}></td>
                            <td colSpan={3} style={{ ...tdL, fontWeight: 700, color: item.symbol.startsWith("—") ? "#581c87" : "var(--color-text-primary)", fontStyle: item.symbol.startsWith("—") ? "normal" : "italic", paddingTop: 6, paddingBottom: 4 }}>{item.symbol}</td>
                          </tr>
                        );
                      }
                      // Rows with both PT and EN examples (Open/Medium/Closed section)
                      if (item.example_en) {
                        return (
                          <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                            <td style={{ width: 32, paddingRight: 4, verticalAlign: "middle" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <button onClick={() => speakListPT(item.example, "pt-PT")} title={`PT: ${item.example}`}
                                  style={{ fontSize: 11, padding: "1px 4px", borderRadius: 3, border: "1px solid #d1d5db", background: "#eff6ff", color: "#2563eb", cursor: "pointer", lineHeight: 1 }}>▶PT</button>
                                <button onClick={() => speakListPT(item.example_en, "en-US")} title={`EN: ${item.example_en}`}
                                  style={{ fontSize: 11, padding: "1px 4px", borderRadius: 3, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#166534", cursor: "pointer", lineHeight: 1 }}>▶EN</button>
                              </div>
                            </td>
                            <td style={tdL}>{item.symbol}</td>
                            <td style={{ ...tdR, width: "18%", whiteSpace: "nowrap" }}>{renderSyllables()}</td>
                            <td style={tdR}>{item.desc}</td>
                          </tr>
                        );
                      }
                      // Standard rows (PT only)
                      return (
                        <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                          <td style={{ width: 32, paddingRight: 6, verticalAlign: "middle" }}>
                            {item.example && (
                              <button onClick={() => speakListPT(item.example, "pt-PT")} title={`Hear: ${item.example}`}
                                style={{ fontSize: 13, padding: "1px 5px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", lineHeight: 1 }}>▶</button>
                            )}
                          </td>
                          <td style={tdL}>{item.symbol}</td>
                          <td style={{ verticalAlign: "top", padding: "4px 12px 4px 0", width: "18%", whiteSpace: "nowrap" }}>
                            {renderSyllables()}
                          </td>
                          <td style={tdR}>{item.desc}</td>
                        </tr>
                      );
                    })}
                  </tbody></table>
                </div>
              ))}
            </div>
          )}
          {listTab === "pairs" && (() => {
            const pair = MINIMAL_PAIRS[pairsOrder[pairIndex]];
            const shuffle = () => {
              const arr = MINIMAL_PAIRS.map((_, i) => i);
              for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
              }
              setPairsOrder(arr);
              setPairIndex(0);
              setQuizTarget(null);
              setQuizResult(null);
            };
            const startQuiz = () => {
              setQuizTarget(Math.random() < 0.5 ? "a" : "b");
              setQuizResult(null);
            };
            const playQuizWord = () => {
              if (quizTarget) speakListPT(pair[quizTarget].word);
            };
            const guess = (choice) => {
              const correct = choice === quizTarget;
              setQuizResult(correct ? "correct" : "wrong");
              setPairsScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
            };
            const next = () => {
              const nextIdx = (pairIndex + 1) % MINIMAL_PAIRS.length;
              setPairIndex(nextIdx);
              setQuizResult(null);
              if (pairsQuizMode) setQuizTarget(Math.random() < 0.5 ? "a" : "b");
            };
            const prev = () => {
              const prevIdx = (pairIndex - 1 + MINIMAL_PAIRS.length) % MINIMAL_PAIRS.length;
              setPairIndex(prevIdx);
              setQuizResult(null);
              if (pairsQuizMode) setQuizTarget(Math.random() < 0.5 ? "a" : "b");
            };
            const resetScore = () => setPairsScore({ correct: 0, total: 0 });
            const toggleMode = () => {
              setPairsQuizMode(m => !m);
              setQuizTarget(null);
              setQuizResult(null);
            };
            const cardBtn = (label, onClick, style = {}) => (
              <button onClick={onClick} style={{ fontSize: fontSize, padding: "5px 14px", borderRadius: 6, border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer", fontFamily: "var(--font-sans)", ...style }}>{label}</button>
            );
            return (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "12px 16px", gap: 10 }}>
                {/* toolbar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {cardBtn(pairsQuizMode ? "📋 Browse" : "🎯 Quiz", toggleMode, { background: pairsQuizMode ? "#eff6ff" : "#f0fdf4", color: pairsQuizMode ? "#2563eb" : "#166534", borderColor: pairsQuizMode ? "#bfdbfe" : "#bbf7d0" })}
                  {cardBtn("🔀 Shuffle", shuffle)}
                  <span style={{ fontSize: fontSize, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
                    {pairIndex + 1} / {MINIMAL_PAIRS.length}
                    {pairsScore.total > 0 && (
                      <span style={{ marginLeft: 10, color: pairsScore.correct / pairsScore.total >= 0.7 ? "#166534" : "#991b1b" }}>
                        Score: {pairsScore.correct}/{pairsScore.total}
                      </span>
                    )}
                    {pairsScore.total > 0 && <button onClick={resetScore} style={{ marginLeft: 6, fontSize: fontSize, padding: "1px 5px", borderRadius: 4, border: "1px solid var(--color-border-tertiary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>reset</button>}
                  </span>
                </div>

                {/* card */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  {!pairsQuizMode ? (
                    /* Browse mode — both words visible */
                    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                      {["a", "b"].map(side => (
                        <div key={side} style={{ textAlign: "center", background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)", borderRadius: 12, padding: "18px 28px", minWidth: 140 }}>
                          <div style={{ fontSize: fontSize * 2, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>{pair[side].word}</div>
                          <div style={{ fontSize: fontSize, color: "var(--color-text-secondary)", marginBottom: 12, fontStyle: "italic" }}>{pair[side].meaning}</div>
                          <button onClick={() => speakListPT(pair[side].word)} style={{ fontSize: 13, padding: "4px 14px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>▶ Ouvir</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Quiz mode */
                    <div style={{ textAlign: "center", width: "100%", maxWidth: 360 }}>
                      {!quizTarget ? (
                        <div>
                          <p style={{ fontSize: fontSize, color: "var(--color-text-secondary)", marginBottom: 14 }}>Press Play to hear a word, then identify which it is.</p>
                          {cardBtn("▶ Play", startQuiz, { fontSize: fontSize, padding: "10px 32px", background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" })}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                          <button onClick={playQuizWord} style={{ fontSize: 16, padding: "10px 32px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>▶ Play again</button>
                          {quizResult === null ? (
                            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                              {["a", "b"].map(side => (
                                <button key={side} onClick={() => guess(side)} style={{ fontSize: 22, fontFamily: "var(--font-mono)", fontWeight: 700, padding: "14px 28px", borderRadius: 10, border: "2px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 110 }}>
                                  {pair[side].word}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center" }}>
                              <p style={{ fontSize: 20, fontWeight: 700, color: quizResult === "correct" ? "#166534" : "#991b1b", marginBottom: 6 }}>
                                {quizResult === "correct" ? "✓ Correto" : "✗ Errado"}
                              </p>
                              <p style={{ fontSize: fontSize, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                                A palavra era: <strong style={{ fontFamily: "var(--font-mono)", fontSize: fontSize }}>{pair[quizTarget].word}</strong> — {pair[quizTarget].meaning}
                              </p>
                              <p style={{ fontSize: fontSize, color: "var(--color-text-secondary)", marginBottom: 14 }}>
                                {pair[quizTarget === "a" ? "b" : "a"].word} = {pair[quizTarget === "a" ? "b" : "a"].meaning}
                              </p>
                              {cardBtn("Próximo →", next, { background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* nav */}
                <div style={{ display: "flex", justifyContent: "center", gap: 12, paddingBottom: 4 }}>
                  {cardBtn("← Anterior", prev)}
                  {!pairsQuizMode && cardBtn("Próximo →", next)}
                </div>
              </div>
            );
          })()}
          {listTab === "phrases" && (
            <div style={listPanelStyle}>
              {PHRASES.map((sec, si) => (
                <div key={si} style={secWrap}>
                  <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>{sec.section}</p>
                  <table style={tbl}><tbody>
                    {sec.items.map((item, ii) => (
                      <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                        <td style={{ width: 32, paddingRight: 6, verticalAlign: "middle" }}>
                          <button onClick={() => speakListPT(item.pt)}
                            style={{ fontSize: 13, padding: "1px 5px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", lineHeight: 1 }}>▶</button>
                        </td>
                        <td style={tdL}>{item.pt}</td>
                        <td style={tdR}>{item.en}</td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              ))}
            </div>
          )}
          {listTab === "idioms" && (
            <div style={listPanelStyle}>
              <table style={tbl}><tbody>
                {IDIOMS.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #d1d5db" }}>
                    <td style={{ width: 32, paddingRight: 6, verticalAlign: "middle" }}>
                      <button onClick={() => speakListPT(item.pt)}
                        style={{ fontSize: 13, padding: "1px 5px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", lineHeight: 1 }}>▶</button>
                    </td>
                    <td style={{ ...tdL, width: "34%", paddingBottom: 8, paddingTop: 6 }}>{item.pt}</td>
                    <td style={{ ...tdR, width: "32%", paddingBottom: 8, paddingTop: 6 }}>{item.en}</td>
                    <td style={{ ...tdR, paddingBottom: 8, paddingTop: 6, fontStyle: "italic" }}>{item.when}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )}
          {listTab === "verbref" && (
            <div style={listPanelStyle}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {[["irregular","Irregular"],["ar","Regular -AR"],["erir","Regular -ER/-IR"]].map(([id,label]) => (
                  <button key={id} style={toolBtn(verbRefTab === id)} onClick={() => { setVerbRefTab(id); setSelectedVerb(null); }}>{label}</button>
                ))}
              </div>
              {!selectedVerb ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {verbRefList.map((v, i) => (
                    <button key={i} style={{ fontSize, padding: "3px 8px", borderRadius: 20, border: "1px solid var(--color-border-tertiary)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "var(--font-mono)" }}
                      onClick={() => setSelectedVerb(v.inf)}>
                      {v.inf}{v.en ? <span style={{ fontFamily: "var(--font-sans)", fontStyle: "italic", opacity: 0.75 }}> — {v.en}</span> : null}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <button onClick={() => setSelectedVerb(null)} style={{ textDecoration: "underline", cursor: "pointer", background: "transparent", border: "none", fontSize: 11, color: "var(--color-text-secondary)", padding: "3px 8px" }}>← BACK</button>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>{selectedVerb}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{verbRefList.find(v => v.inf === selectedVerb)?.en || ""}</span>
                  </div>
                  {irreg ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                      {TENSE_LABELS.map((tname, ti) => (
                        <div key={ti} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "8px 10px" }}>
                          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{tname}</p>
                          {ti < 4 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: Math.max(11, fontSize - 3) }}><tbody>
                              {PRONOUNS.map((pr, pi) => (
                                <tr key={pi}>
                                  <td style={{ color: "var(--color-text-secondary)", padding: "1px 6px 1px 0", width: "40%" }}>{pr}</td>
                                  <td style={{ color: "var(--color-text-primary)", fontWeight: 500, padding: "1px 0" }}>{irreg.tenses[ti][pi]}</td>
                                </tr>
                              ))}
                            </tbody></table>
                          ) : (
                            <p style={{ fontSize: Math.max(11, fontSize - 2), fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{irreg.tenses[4][0]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: Math.max(13, fontSize - 1), color: "var(--color-text-secondary)", fontStyle: "italic", marginBottom: 10 }}>
                        Regular {verbRefTab === "ar" ? "-AR" : "-ER/-IR"} pattern — stem: <strong style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-info)" }}>{selectedVerb.slice(0, -2)}-</strong>
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                        {TENSE_LABELS.map((tname, ti) => {
                          const stem = selectedVerb.slice(0, -2);
                          const isAR = verbRefTab === "ar";
                          const endings = isAR ? [
                            ["-o","-as","-a","-amos","-am","-am"],
                            ["-ei","-aste","-ou","-ámos","-aram","-aram"],
                            ["-ava","-avas","-ava","-ávamos","-avam","-avam"],
                            ["-arei","-arás","-ará","-aremos","-arão","-arão"],
                            ["-ado"]
                          ] : [
                            ["-o","-es","-e","-emos","-em","-em"],
                            ["-i","-este","-eu","-emos","-eram","-eram"],
                            ["-ia","-ias","-ia","-íamos","-iam","-iam"],
                            ["-erei","-erás","-erá","-eremos","-erão","-erão"],
                            ["-ido"]
                          ];
                          return (
                            <div key={ti} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "8px 10px" }}>
                              <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{tname}</p>
                              {ti < 4 ? (
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: Math.max(11, fontSize - 3) }}><tbody>
                                  {PRONOUNS.map((pr, pi) => (
                                    <tr key={pi}>
                                      <td style={{ color: "var(--color-text-secondary)", padding: "1px 6px 1px 0", width: "40%" }}>{pr}</td>
                                      <td style={{ color: "var(--color-text-primary)", fontWeight: 500, padding: "1px 0" }}>{stem}{endings[ti][pi]}</td>
                                    </tr>
                                  ))}
                                </tbody></table>
                              ) : (
                                <p style={{ fontSize: Math.max(11, fontSize - 2), fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{stem}{endings[4][0]}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {listTab === "grammar" && (
            <div style={listPanelStyle}>
              {GRAMMAR_TOPICS.map((topic, ti) => (
                <div key={ti} style={secWrap}>
                  <p style={{ ...secTitle, color: "#0369a1", fontWeight: 700, textDecoration: "underline" }}>{topic.label}</p>
                  {topic.sections.map((sec, si) => (
                    <div key={si} style={{ marginBottom: 10 }}>
                      <p style={{ fontSize, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{sec.title}</p>
                      <p style={{ fontSize, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.6 }}>{sec.body}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {listTab === "numbers" && (
            <div style={listPanelStyle}>
              {NUMBERS.map((sec, si) => (
                <div key={si} style={secWrap}>
                  <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>{sec.section}</p>
                  <table style={tbl}><tbody>
                    {sec.items.map((item, ii) => (
                      <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                        <td style={{ width: 32, paddingRight: 6, verticalAlign: "middle" }}>
                          <button onClick={() => speakListPT(item.pt)}
                            style={{ fontSize: 13, padding: "1px 5px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", lineHeight: 1 }}>▶</button>
                        </td>
                        <td style={tdL}>{item.pt}</td>
                        <td style={tdR}>{item.en}</td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              ))}
            </div>
          )}
          {listTab === "cognates" && (
            <div style={listPanelStyle}>
              {COGNATES.map((sec, si) => (
                <div key={si} style={secWrap}>
                  <p style={{ ...secTitle, color: "#581c87", fontWeight: 700, textDecoration: "underline" }}>{sec.section}</p>
                  {sec.rule ? <p style={{ fontSize, color: "var(--color-text-secondary)", margin: "0 0 6px", fontStyle: "italic" }}>{sec.rule}</p> : null}
                  <table style={tbl}><tbody>
                    {sec.items.map((item, ii) => {
                      // If pt contains /a (gender variant), speak both forms
                      const hasMF = item.pt.includes("/a") || item.pt.includes("/o");
                      const speakText = hasMF
                        ? item.pt.replace(/^(.*?)(\/a|\/o)\b/, (m, base, suffix) => `${base} ... ${base.slice(0, -1)}${suffix.slice(1)}`)
                        : item.pt;
                      return (
                        <tr key={ii} style={{ borderBottom: "1px solid #d1d5db" }}>
                          <td style={{ width: 32, paddingRight: 6, verticalAlign: "middle" }}>
                            <button onClick={() => speakListPT(speakText)}
                              style={{ fontSize: 13, padding: "1px 5px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer", lineHeight: 1 }}>▶</button>
                          </td>
                          <td style={tdL}>{item.pt}</td>
                          <td style={tdR}>{item.en}</td>
                        </tr>
                      );
                    })}
                  </tbody></table>
                  {sec.exceptions.length > 0 && (
                    <div style={{ marginTop: 4, padding: "4px 8px", background: "var(--color-background-warning)", borderRadius: "var(--border-radius-md)", fontSize, color: "var(--color-text-warning)" }}>
                      {sec.exceptions.map((e, ei) => <div key={ei}>⚠ {e}</div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {listTab === "media" && (() => {
            // Data defined at module scope as MEDIA_SECTIONS / MEDIA_SECTIONS_SORTED.
            const linkStyle = { color: "#1a56db", textDecoration: "none", fontSize: Math.max(13, fontSize - 1), lineHeight: 1.7, display: "block" };
            const subLabelStyle = { fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "8px 0 4px" };
            const sortedSections = MEDIA_SECTIONS_SORTED;
            return (
              <div style={listPanelStyle}>
                {/* Sections */}
                {sortedSections.map(sec => {
                  const sortedLinks = sec.links ? [...sec.links].sort((a, b) => a.label.localeCompare(b.label)) : null;
                  const sortedSubgroups = sec.subgroups ? sec.subgroups.map(sg => ({ ...sg, links: [...sg.links].sort((a, b) => a.label.localeCompare(b.label)) })) : null;
                  return (
                  <div key={sec.id} ref={el => mediaSectionRefs.current[sec.id] = el} style={{ marginBottom: 10, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
                    <button onClick={() => {
                        const newId = mediaOpenSection === sec.id ? null : sec.id;
                        setMediaOpenSection(newId);
                        if (newId) setTimeout(() => mediaSectionRefs.current[newId]?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
                      }}
                      style={{ width: "100%", textAlign: "left", background: "var(--color-background-secondary)", border: "none", cursor: "pointer", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span>
                        <span style={{ fontSize: Math.max(13, fontSize - 1), fontWeight: 600, color: "var(--color-text-primary)" }}>{sec.pt}</span>
                        <span style={{ fontSize: Math.max(11, fontSize - 3), color: "#1e40af", marginLeft: 6 }}>— {sec.en}</span>
                      </span>
                      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", flexShrink: 0 }}>{mediaOpenSection === sec.id ? "▲" : "▼"}</span>
                    </button>
                    {mediaOpenSection === sec.id && (
                      <div style={{ padding: "8px 12px 12px" }}>
                        {sortedSubgroups ? sortedSubgroups.map((sg, sgi) => (
                          <div key={sgi}>
                            <p style={subLabelStyle}>{sg.label}</p>
                            {sg.links.map((lk, li) => (
                              <a key={li} href={lk.url} target="_blank" rel="noopener noreferrer" style={linkStyle}
                                onMouseEnter={e => e.target.style.textDecoration="underline"}
                                onMouseLeave={e => e.target.style.textDecoration="none"}>
                                {lk.label}
                              </a>
                            ))}
                          </div>
                        )) : sortedLinks.map((lk, li) => (
                          <a key={li} href={lk.url} target="_blank" rel="noopener noreferrer" style={linkStyle}
                            onMouseEnter={e => e.target.style.textDecoration="underline"}
                            onMouseLeave={e => e.target.style.textDecoration="none"}>
                            {lk.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Conjugator panel */}
      {activePanel === "verblookup" && (
        <div style={{ ...listPanelStyle, display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
          <div style={{ display: "flex", gap: 6, padding: "12px 16px", flexShrink: 0 }}>
            <input style={{ fontSize: 16, flex: 1, padding: "5px 10px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
              placeholder="Type any verb, e.g. falar, ser, ter…"
              value={verbInput} onChange={e => setVerbInput(e.target.value)} onKeyDown={e => e.key === "Enter" && lookupVerb()} />
            <button style={{ ...toolBtn(true), padding: "5px 14px", fontSize: 16, background: "#2563eb", color: "#fff" }} onClick={lookupVerb} disabled={conjLoading}>{conjLoading ? "…" : "⟳ Look up"}</button>
          </div>
          {conjError && <p style={{ fontSize: 16, color: "var(--color-text-danger)", margin: "0 16px" }}>{conjError}</p>}
          {conjugation && (
            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 12px" }}>{conjugation.infinitive} — {conjugation.meaning}</p>
              {CONJ_LEVEL_GROUPS.map(group => {
                const groupTenses = (conjugation.tenses || []).filter(t => group.tenses.includes(t.name));
                if (groupTenses.length === 0) return null;
                const isOpen = conjOpenGroups;
                const isUsageOpen = conjUsageOpen;
                return (
                  <div key={group.level} style={{ marginBottom: 12, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
                    <button onClick={() => setConjOpenGroups(prev => !prev)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--color-background-secondary)", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em" }}>{group.level}</span>
                      <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, padding: "8px" }}>
                          {groupTenses.map((tense, ti) => (
                            <div key={ti} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "8px 10px" }}>
                              <p style={{ fontSize: Math.max(10, fontSize - 4), fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{tense.name}</p>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize }}><tbody>
                                {tense.rows?.map((row, ri) => (
                                  <tr key={ri}><td style={{ color: "var(--color-text-secondary)", padding: "1px 6px 1px 0", width: "45%" }}>{row[0]}</td><td style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{row[1]}</td></tr>
                                ))}
                              </tbody></table>
                              {tense.example_pt && (
                                <div style={{ marginTop: 8, paddingTop: 7, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                                  <p style={{ fontSize: Math.max(11, fontSize - 2), fontStyle: "italic", color: "var(--color-text-info)", margin: "0 0 2px" }}>{tense.example_pt}</p>
                                  <p style={{ fontSize: Math.max(11, fontSize - 2), color: "var(--color-text-secondary)", margin: 0 }}>{tense.example_en}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                          <button onClick={() => setConjUsageOpen(prev => !prev)}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 10px", background: "#f0f9ff", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#0369a1" }}>WHEN TO USE THESE TENSES</span>
                            <span style={{ fontSize: 12, color: "#0369a1" }}>{isUsageOpen ? "▲" : "▼"}</span>
                          </button>
                          {isUsageOpen && (
                            <div style={{ padding: "10px 12px", background: "#f0f9ff", display: "flex", flexDirection: "column", gap: 12 }}>
                              {groupTenses.map((tense, ti) => {
                                const usage = TENSE_USAGE[tense.name];
                                if (!usage) return null;
                                return (
                                  <div key={ti}>
                                    <p style={{ fontSize: Math.max(11, fontSize - 2), fontWeight: 700, color: "#0369a1", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{tense.name}</p>
                                    <p style={{ fontSize: Math.max(12, fontSize - 1), color: "var(--color-text-primary)", margin: "0 0 4px", lineHeight: 1.5 }}>{usage.when}</p>
                                    {usage.contrast && (
                                      <p style={{ fontSize: Math.max(11, fontSize - 2), color: "#92400e", margin: "0 0 6px", fontStyle: "italic", lineHeight: 1.5 }}>⚠ {usage.contrast}</p>
                                    )}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                      {usage.examples.map((ex, ei) => (
                                        <div key={ei} style={{ paddingLeft: 8, borderLeft: "2px solid #bae6fd" }}>
                                          <p style={{ fontSize: Math.max(11, fontSize - 2), fontWeight: 600, color: "#1d4ed8", margin: 0, fontStyle: "italic" }}>{ex.pt}</p>
                                          <p style={{ fontSize: Math.max(10, fontSize - 3), color: "var(--color-text-secondary)", margin: 0 }}>{ex.en}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              <div style={{ marginTop: 4, border: "0.5px solid #a3e635", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
                <button onClick={() => setShortcutsOpen(o => !o)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: "#f7fee7", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#3f6212", letterSpacing: "0.04em" }}>SPOKEN EP SHORTCUTS — PAST & FUTURE ALTERNATIVES</span>
                  <span style={{ fontSize: 13, color: "#3f6212" }}>{shortcutsOpen ? "▲" : "▼"}</span>
                </button>
                {shortcutsOpen && (
                  <div style={{ padding: "12px", background: "#f7fee7", display: "flex", flexDirection: "column", gap: 16 }}>
                    {SPOKEN_SHORTCUTS.map((section, si) => (
                      <div key={si}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#3f6212", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{section.title}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 6 }}>
                          {section.items.map((item, ii) => (
                            <div key={ii} style={{ paddingLeft: 8, borderLeft: "2px solid #84cc16" }}>
                              <p style={{ fontSize: 11, fontWeight: 600, color: "#4d7c0f", margin: "0 0 1px", textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.label}</p>
                              <p style={{ fontSize: Math.max(12, fontSize - 1), fontWeight: 600, color: "#1d4ed8", margin: 0, fontStyle: "italic" }}>{item.pt}</p>
                              <p style={{ fontSize: Math.max(10, fontSize - 3), color: "var(--color-text-secondary)", margin: 0 }}>{item.en}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: Math.max(11, fontSize - 2), color: "#92400e", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>⚠ {section.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* S&H Vocab panel */}
      {activePanel === "vocab" && (
        <div style={{ ...panelStyle, maxHeight: 420 }}>
          {!vocabShowReview ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {Object.keys(SH_POS_LABELS).map(pos => (
                  <select key={pos}
                    style={{ fontSize: 16, padding: "4px 6px", border: "2px solid #2563eb", borderRadius: "var(--border-radius-md)", background: vocabPos === pos ? "#eff6ff" : "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer", maxWidth: 220 }}
                    value=""
                    onChange={e => {
                      if (!e.target.value) return;
                      setVocabPos(pos);
                      fetchVocabCard(e.target.value, pos);
                      e.target.value = "";
                    }}>
                    <option value="">{SH_POS_LABELS[pos]} ({(SH_VOCAB[pos] || []).length})</option>
                    {(SH_VOCAB[pos] || []).map((w, i) => {
                      const en = SH_VOCAB_EN[pos]?.[w];
                      return <option key={i} value={w}>{w}{en ? ` — (${en})` : ""}</option>;
                    })}
                  </select>
                ))}
                <button style={{ ...toolBtn(true), marginLeft: 4, background: "#2563eb", color: "#fff" }} onClick={drawVocabCard} disabled={vocabLoading}>
                  {vocabLoading ? "…" : "⟳ Random"}
                </button>
                {vocabReview.length > 0 && (
                  <button style={{ ...toolBtn(false), marginLeft: "auto" }} onClick={() => setVocabShowReview(true)}>
                    Review list ({vocabReview.length}{vocabReview.filter(c => c.is_bp_specific).length > 0 ? ` · ${vocabReview.filter(c => c.is_bp_specific).length} BP` : ""})
                  </button>
                )}
              </div>
              {vocabError && <p style={{ fontSize: 16, color: "var(--color-text-danger)", margin: 0 }}>{vocabError}</p>}
              {vocabCard && (
                <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: "var(--color-background-secondary)", display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: Math.max(18, fontSize + 2), fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>{vocabCard.word_bp}</span>
                    <span style={{ fontSize, color: "var(--color-text-secondary)", fontStyle: "italic" }}>{vocabCard.meaning_en}</span>
                    {vocabCard.is_bp_specific && (
                      <span style={{ fontSize: 13, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>BP form</span>
                    )}
                  </div>
                  {vocabCard.is_bp_specific && (
                    <div style={{ padding: "8px 14px", background: "#eff6ff", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                      <span style={{ fontSize, fontWeight: 600, color: "#1d4ed8" }}>EP: </span>
                      <span style={{ fontSize, fontFamily: "var(--font-mono)", color: "#1d4ed8" }}>{vocabCard.ep_equivalent}</span>
                      {vocabCard.ep_note && <span style={{ fontSize, color: "#3b82f6", marginLeft: 8 }}>— {vocabCard.ep_note}</span>}
                    </div>
                  )}
                  <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <button onClick={() => speakListPT(vocabCard.example_ep)}
                        title="Hear EP example (pt-PT)"
                        style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d1d5db", background: "#eff6ff", color: "#2563eb", cursor: "pointer", flexShrink: 0, marginTop: 2 }}>▶ PT-PT</button>
                      <p style={{ fontSize, fontStyle: "italic", color: "var(--color-text-primary)", margin: 0 }}>{vocabCard.example_ep}</p>
                    </div>
                    <div style={{ paddingTop: 4, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                      <p style={{ fontSize, color: "var(--color-text-secondary)", margin: 0 }}>{vocabCard.example_en}</p>
                    </div>
                  </div>
                  {vocabCard.book_quote && (
                    <div style={{ padding: "10px 14px", background: "#f9f7f0", borderTop: "0.5px solid #d6c98a" }}>
                      <p style={{ fontSize: Math.max(10, fontSize - 3), fontWeight: 700, color: "#92700a", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Ciência e Saúde</p>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <button onClick={() => speakListPT(vocabCard.book_quote)}
                          title="Hear book quote (pt-PT)"
                          style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, border: "1px solid #d6c98a", background: "#f0e8c0", color: "#92700a", cursor: "pointer", flexShrink: 0, marginTop: 2 }}>▶ PT-PT</button>
                        <p style={{ fontSize: Math.max(12, fontSize - 1), fontStyle: "italic", color: "#5a4a1a", margin: 0, lineHeight: 1.6 }}>"{vocabCard.book_quote}"</p>
                      </div>
                      {vocabCard.book_quote_en && (
                        <p style={{ fontSize: Math.max(11, fontSize - 2), color: "#7a5c10", margin: "6px 0 0 0", fontStyle: "italic", paddingLeft: 2 }}>{vocabCard.book_quote_en}</p>
                      )}
                    </div>
                  )}
                  <div style={{ padding: "8px 14px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 6 }}>
                    <button style={{ ...toolBtn(false), background: "var(--color-background-secondary)" }} onClick={drawVocabCard}>→ Next word</button>
                    <button style={{ ...toolBtn(false), color: vocabReview.find(r => r.word_bp === vocabCard.word_bp) ? "#92400e" : "var(--color-text-secondary)" }} onClick={addToReview}>
                      {vocabReview.find(r => r.word_bp === vocabCard.word_bp) ? "★ In review list" : "☆ Add to review"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <button style={{ textDecoration: "underline", cursor: "pointer", background: "transparent", border: "none", fontSize: 13, color: "var(--color-text-secondary)", padding: "2px 8px" }}
                  onClick={() => setVocabShowReview(false)}>← BACK</button>
                <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", textTransform: "uppercase" }}>Review list — {vocabReview.length} words</span>
                <button style={{ ...toolBtn(false), marginLeft: "auto", fontSize: 13 }} onClick={() => { setVocabReview([]); lsSet("pe_vocab_review", []); }}>Clear all</button>
              </div>
              {vocabReview.filter(c => c.is_bp_specific).length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ ...secTitle, color: "#92400e", marginBottom: 6 }}>BP Flagged — {vocabReview.filter(c => c.is_bp_specific).length} words</p>
                  <table style={tbl}><tbody>
                    {vocabReview.filter(c => c.is_bp_specific).map((card, i) => (
                      <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                        <td style={{ ...tdL, width: "28%", paddingTop: 6, paddingBottom: 6, fontWeight: 600 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 5px", borderRadius: 10, background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", marginRight: 5 }}>BP</span>
                          {card.word_bp}
                        </td>
                        <td style={{ ...tdR, width: "18%", paddingTop: 6, paddingBottom: 6 }}>{card.meaning_en}</td>
                        <td style={{ ...tdR, paddingTop: 6, paddingBottom: 6, color: "#1d4ed8" }}>EP: {card.ep_equivalent}</td>
                        <td style={{ paddingTop: 6, paddingBottom: 6, textAlign: "right" }}>
                          <button style={{ textDecoration: "underline", cursor: "pointer", background: "transparent", border: "none", fontSize: 13, color: "var(--color-text-secondary)", padding: "1px 6px" }}
                            onClick={() => setVocabReview(prev => { const next = prev.filter(c => c.word_bp !== card.word_bp); lsSet("pe_vocab_review", next); return next; })}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              )}
              {vocabReview.filter(c => !c.is_bp_specific).length > 0 && (
                <div>
                  <p style={{ ...secTitle, marginBottom: 6 }}>All words — {vocabReview.filter(c => !c.is_bp_specific).length} words</p>
                  <table style={tbl}><tbody>
                    {vocabReview.filter(c => !c.is_bp_specific).map((card, i) => (
                      <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                        <td style={{ ...tdL, width: "30%", paddingTop: 6, paddingBottom: 6, fontWeight: 600 }}>{card.word_bp}</td>
                        <td style={{ ...tdR, width: "20%", paddingTop: 6, paddingBottom: 6 }}>{card.meaning_en}</td>
                        <td style={{ ...tdR, paddingTop: 6, paddingBottom: 6, color: "var(--color-text-tertiary)", fontSize: 14 }}>same in EP</td>
                        <td style={{ paddingTop: 6, paddingBottom: 6, textAlign: "right" }}>
                          <button style={{ textDecoration: "underline", cursor: "pointer", background: "transparent", border: "none", fontSize: 13, color: "var(--color-text-secondary)", padding: "1px 6px" }}
                            onClick={() => setVocabReview(prev => { const next = prev.filter(c => c.word_bp !== card.word_bp); lsSet("pe_vocab_review", next); return next; })}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              )}
              {vocabReview.length === 0 && (
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", fontStyle: "italic" }}>No words in review list yet. Draw cards and add them with ☆ ADD TO REVIEW.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: (activePanel === "lists" || activePanel === "verblookup" || activePanel === "vocab" || activePanel === "settings") ? "none" : "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} m={m} fontSize={fontSize} ttsSupported={ttsSupported} speak={speak} renderWithParens={renderWithParens} />
        ))}
        {loading && <div style={{ alignSelf: "flex-start", background: "var(--color-background-secondary)", padding: "10px 14px", borderRadius: "18px 18px 18px 4px", fontSize: 13, color: "var(--color-text-tertiary)" }}>A escrever…</div>}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      {(activePanel !== "lists" && activePanel !== "verblookup" && activePanel !== "vocab") && (
      <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        {!apiKey && (
          <div style={{ padding: "6px 10px", background: "#fef3c7", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "#92400e" }}>
            ⚠ No API key — open <strong>⚙ Settings</strong> and paste your Anthropic key to start chatting.
          </div>
        )}
        {/* Voice controls row */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {/* Mic button */}
          {speechSupported && (
            <button
              onClick={listening ? stopListening : startListening}
              title={listening ? "Stop listening" : `Speak (${speechLang})`}
              style={{ padding: "6px 12px", fontSize: 18, borderRadius: "var(--border-radius-lg)", border: listening ? "2px solid #dc2626" : "1px solid var(--color-border-tertiary)", background: listening ? "#fee2e2" : "var(--color-background-secondary)", color: listening ? "#dc2626" : "var(--color-text-secondary)", cursor: "pointer", flexShrink: 0 }}>
              {listening ? "⏹" : "🎤"}
            </button>
          )}
          {/* Speech language toggle */}
          {speechSupported && (
            <select value={speechLang} onChange={e => setSpeechLang(e.target.value)}
              style={{ fontSize: 12, padding: "4px 6px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              <option value="pt-PT">PT-PT</option>
              <option value="pt-BR">PT-BR</option>
              <option value="en-US">EN-US</option>
              <option value="en-GB">EN-GB</option>
            </select>
          )}
          {/* TTS toggle */}
          {ttsSupported && (
            <button onClick={() => { setTtsEnabled(o => !o); if (speaking) stopSpeaking(); }}
              title={ttsEnabled ? "Auto-speak on — click to turn off" : "Auto-speak off — click to turn on"}
              style={{ padding: "6px 12px", fontSize: 13, borderRadius: "var(--border-radius-lg)", border: ttsEnabled ? "2px solid #2563eb" : "1px solid var(--color-border-tertiary)", background: ttsEnabled ? "#eff6ff" : "var(--color-background-secondary)", color: ttsEnabled ? "#2563eb" : "var(--color-text-secondary)", cursor: "pointer", fontWeight: ttsEnabled ? 700 : 400, flexShrink: 0 }}>
              {speaking ? "🔊 …" : ttsEnabled ? "🔊 ON" : "🔇 OFF"}
            </button>
          )}
          {/* Speed control */}
          {ttsSupported && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", flexShrink: 0 }}>
              <button
                onClick={() => { const r = Math.max(0.25, Math.round((ttsRate - 0.05) * 100) / 100); setTtsRate(r); lsSet("pe_tts_rate", r); }}
                disabled={ttsRate <= 0.25}
                title="Slower"
                style={{ padding: "4px 7px", fontSize: 13, border: "none", background: "var(--color-background-secondary)", color: ttsRate <= 0.25 ? "var(--color-text-tertiary)" : "var(--color-text-secondary)", cursor: ttsRate <= 0.25 ? "default" : "pointer" }}>−</button>
              <span style={{ fontSize: 12, fontWeight: 600, color: ttsRate !== 1.0 ? "#2563eb" : "var(--color-text-secondary)", minWidth: 36, textAlign: "center", padding: "0 2px" }}>
                {Math.round(ttsRate * 100)}%
              </span>
              <button
                onClick={() => { const r = Math.min(2.0, Math.round((ttsRate + 0.05) * 100) / 100); setTtsRate(r); lsSet("pe_tts_rate", r); }}
                disabled={ttsRate >= 2.0}
                title="Faster"
                style={{ padding: "4px 7px", fontSize: 13, border: "none", background: "var(--color-background-secondary)", color: ttsRate >= 2.0 ? "var(--color-text-tertiary)" : "var(--color-text-secondary)", cursor: ttsRate >= 2.0 ? "default" : "pointer" }}>+</button>
            </div>
          )}
          {/* Voice selector */}
          {ttsSupported && (
            <select
              value={selectedVoice?.name || (azureKey && azureRegion ? "__azure_raquel__" : "")}
              onChange={e => {
                const v = e.target.value;
                if (v === "__azure_raquel__") setSelectedVoice({ name: "__azure_raquel__", lang: "pt-PT", azureVoice: "pt-PT-RaquelNeural" });
                else if (v === "__azure_fernanda__") setSelectedVoice({ name: "__azure_fernanda__", lang: "pt-PT", azureVoice: "pt-PT-FernandaNeural" });
                else if (v === "__azure_duarte__") setSelectedVoice({ name: "__azure_duarte__", lang: "pt-PT", azureVoice: "pt-PT-DuarteNeural" });
                else setSelectedVoice(voices.find(x => x.name === v) || null);
              }}
              style={{ fontSize: 12, padding: "4px 6px", border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer", maxWidth: 200, flex: 1 }}>
              {azureKey && azureRegion && (<>
                <option value="__azure_raquel__">MS Azure Raquel - Portuguese (Portugal) (pt-PT)</option>
                <option value="__azure_fernanda__">MS Azure Fernanda - Portuguese (Portugal) (pt-PT)</option>
                <option value="__azure_duarte__">MS Azure Duarte - Portuguese (Portugal) (pt-PT)</option>
              </>)}
              {voices.filter(v => v.lang.startsWith("pt") || v.lang.startsWith("en")).map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          )}
        </div>
        {/* Input row */}
        <div style={{ display: "flex", gap: 8 }}>
          <textarea ref={inputRef}
            style={{ flex: 1, fontSize, padding: "8px 12px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", resize: "none", background: "var(--color-background-primary)", color: "var(--color-text-primary)", lineHeight: 1.5, minHeight: 38, maxHeight: 120, fontFamily: "var(--font-sans)", outline: "none" }}
            rows={1} placeholder="Type or use 🎤 to speak…"
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} />
          <button style={{ padding: "8px 16px", fontSize: 14, borderRadius: "var(--border-radius-lg)", border: "none", background: loading || !input.trim() ? "var(--color-background-secondary)" : "#2563eb", color: loading || !input.trim() ? "var(--color-text-tertiary)" : "#fff", cursor: loading || !input.trim() ? "default" : "pointer", fontWeight: 500 }}
            onClick={() => sendMessage()} disabled={loading || !input.trim()}> ENVIAR</button>
        </div>
      </div>
      )}
    </div>
  );
}