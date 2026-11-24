// Turns a piece of Battery Hub's English into the chosen language: an exact match in
// i18n-strings.js first, then the patterns below for text with numbers or names in it. Anything
// unknown comes back unchanged, so a missing translation shows English rather than nothing.
// Pure: loaded as a plain script by the windows (after i18n-strings.js) and required by the main
// process for the tray and notifications.
const BH_LANGS = ['en', 'es', 'zh', 'he', 'pt'];

// 'system' or a missing setting follows the Windows display language.
function resolveLanguage(setting, locale) {
  if (BH_LANGS.includes(setting)) return setting;
  const l = String(locale || '').toLowerCase();
  if (l.startsWith('es')) return 'es';
  if (l.startsWith('zh')) return 'zh';
  if (l.startsWith('he') || l.startsWith('iw')) return 'he';
  if (/^pt(?:[-_]|$)/.test(l)) return 'pt'; // pt-BR, and pt-PT too: better than English
  return 'en';
}

// "1d 16h", "40s", "~7h": the short durations the app writes.
const UNITS = {
  es: { d: ' d', h: ' h', m: ' min', s: ' s' },
  zh: { d: '天', h: '小时', m: '分钟', s: '秒' },
  he: { d: ' ימ׳', h: ' שע׳', m: ' דק׳', s: ' שנ׳' },
  pt: { d: ' d', h: ' h', m: ' min', s: ' s' },
};
function duration(text, lang) {
  return text.replace(/(\d+)([dhms])\b/g, (all, n, unit) => n + UNITS[lang][unit]);
}

// "just now", "5 min ago", "3 h ago", "4 days ago": how diagnostics.js says when a device was last read.
function checkAgo(text) {
  if (text === 'just now') return 'agora mesmo';
  const m = text.match(/^(\d+) (min|h|days) ago$/);
  if (!m) return text;
  return `há ${m[1]} ${m[2] === 'days' ? (m[1] === '1' ? 'dia' : 'dias') : m[2]}`;
}

// [pattern, { lang: (match) => text }]
const PATTERNS = [
  [/^Updated (\d+[dhms]) ago$/, {
    es: (m, l) => `Actualizado hace ${duration(m[1], l)}`,
    zh: (m, l) => `${duration(m[1], l)}前更新`,
    he: (m, l) => `עודכן לפני ${duration(m[1], l)}`,
    pt: (m, l) => `Atualizado há ${duration(m[1], l)}`,
  }],
  [/^(\d+[dhms]) ago$/, {
    es: (m, l) => `hace ${duration(m[1], l)}`,
    zh: (m, l) => `${duration(m[1], l)}前`,
    he: (m, l) => `לפני ${duration(m[1], l)}`,
    pt: (m, l) => `há ${duration(m[1], l)}`,
  }],
  [/^~((?:\d+[dhm] ?)+) left$/, {
    es: (m, l) => `Quedan ~${duration(m[1], l)}`,
    zh: (m, l) => `剩余约 ${duration(m[1], l)}`,
    he: (m, l) => `נותרו ~${duration(m[1], l)}`,
    pt: (m, l) => `Restam ~${duration(m[1], l)}`,
  }],
  [/^~((?:\d+[dhm] ?)+)$/, {
    es: (m, l) => `~${duration(m[1], l)}`,
    zh: (m, l) => `约 ${duration(m[1], l)}`,
    he: (m, l) => `~${duration(m[1], l)}`,
    pt: (m, l) => `~${duration(m[1], l)}`,
  }],
  [/^([\d.]+)% a day$/, { es: (m) => `${m[1]}% al día`, zh: (m) => `每天 ${m[1]}%`, he: (m) => `${m[1]}% ביום`, pt: (m) => `${m[1]}% por dia` }],
  [/^([\d.]+)% an hour$/, { es: (m) => `${m[1]}% por hora`, zh: (m) => `每小时 ${m[1]}%`, he: (m) => `${m[1]}% בשעה`, pt: (m) => `${m[1]}% por hora` }],
  [/^Same as Settings \((\d+)%\)$/, {
    es: (m) => `Igual que en Ajustes (${m[1]}%)`,
    zh: (m) => `与设置相同（${m[1]}%）`,
    he: (m) => `כמו בהגדרות (${m[1]}%)`,
    pt: (m) => `Igual às Configurações (${m[1]}%)`,
  }],
  [/^Charging, (\d+)%$/, { es: (m) => `Cargando, ${m[1]}%`, zh: (m) => `充电中，${m[1]}%`, he: (m) => `בטעינה, ${m[1]}%`, pt: (m) => `Carregando, ${m[1]}%` }],
  [/^(\d+) hidden devices?$/, {
    es: (m) => (m[1] === '1' ? '1 dispositivo oculto' : `${m[1]} dispositivos ocultos`),
    zh: (m) => `${m[1]} 个隐藏的设备`,
    he: (m) => (m[1] === '1' ? 'מכשיר מוסתר אחד' : `${m[1]} מכשירים מוסתרים`),
    pt: (m) => (m[1] === '1' ? '1 dispositivo oculto' : `${m[1]} dispositivos ocultos`),
  }],
  [/^(.*) · (\d+) channels?$/, {
    es: (m) => `${m[1]} · ${m[2]} ${m[2] === '1' ? 'canal' : 'canales'}`,
    zh: (m) => `${m[1]} · ${m[2]} 个通道`,
    he: (m) => `${m[1]} · ${m[2] === '1' ? 'ערוץ אחד' : `${m[2]} ערוצים`}`,
    pt: (m) => `${m[1]} · ${m[2]} ${m[2] === '1' ? 'canal' : 'canais'}`,
  }],
  [/^Version (\S+)$/, { es: (m) => `Versión ${m[1]}`, zh: (m) => `版本 ${m[1]}`, he: (m) => `גרסה ${m[1]}`, pt: (m) => `Versão ${m[1]}` }],
  [/^Update available: (v\S+)$/, {
    es: (m) => `Actualización disponible: ${m[1]}`,
    zh: (m) => `有可用更新：${m[1]}`,
    he: (m) => `עדכון זמין: ${m[1]}`,
    pt: (m) => `Atualização disponível: ${m[1]}`,
  }],
  [/^Update ready: (v\S+)$/, {
    es: (m) => `Actualización lista: ${m[1]}`,
    zh: (m) => `更新已就绪：${m[1]}`,
    he: (m) => `העדכון מוכן: ${m[1]}`,
    pt: (m) => `Atualização pronta: ${m[1]}`,
  }],
  [/^Set up (.+)$/, { es: (m) => `Configurar ${m[1]}`, zh: (m) => `设置 ${m[1]}`, he: (m) => `הגדרת ${m[1]}`, pt: (m) => `Configurar ${m[1]}` }],
  [/^(.+): open details$/, {
    es: (m) => `${m[1]}: abrir detalles`,
    zh: (m) => `${m[1]}：打开详情`,
    he: (m) => `${m[1]}: פתיחת פרטים`,
    pt: (m) => `${m[1]}: abrir detalhes`,
  }],
  // notifications (Portuguese words them so the device's gender never matters)
  [/^(.+) is at (\d+)%\. Time to charge\.$/, {
    es: (m) => `${m[1]} está al ${m[2]}%. Hora de cargarlo.`,
    zh: (m) => `${m[1]} 电量为 ${m[2]}%，该充电了。`,
    he: (m) => `${m[1]} ב-${m[2]}%. הגיע הזמן לטעון.`,
    pt: (m) => `${m[1]} está com ${m[2]}%. Hora de carregar.`,
  }],
  [/^(.+) is charging \((\d+)%\)\.$/, {
    es: (m) => `${m[1]} se está cargando (${m[2]}%).`,
    zh: (m) => `${m[1]} 正在充电（${m[2]}%）。`,
    he: (m) => `${m[1]} בטעינה (${m[2]}%).`,
    pt: (m) => `Carregando: ${m[1]} (${m[2]}%).`,
  }],
  [/^(.+) is charged \((\d+)%\)\.$/, {
    es: (m) => `${m[1]} está cargado (${m[2]}%).`,
    zh: (m) => `${m[1]} 已充满（${m[2]}%）。`,
    he: (m) => `${m[1]} טעון (${m[2]}%).`,
    pt: (m) => `Carga completa: ${m[1]} (${m[2]}%).`,
  }],
  // The check in Settings > Help (diagnostics.js). Only Portuguese has these so far: the others
  // show the English until someone translates them.
  [/^All (\d+) files match what was shipped\.$/, { pt: (m) => `Todos os ${m[1]} arquivos são iguais aos do pacote original.` }],
  [/^(\d+) of (\d+) files are missing or changed\.$/, { pt: (m) => `${m[1]} de ${m[2]} arquivos estão ausentes ou alterados.` }],
  [/^You have (\S+), the latest version\.$/, { pt: (m) => `Você tem a ${m[1]}, a versão mais recente.` }],
  [/^You have (\S+)\. The latest is (\S+)\.$/, { pt: (m) => `Você tem a ${m[1]}. A mais recente é a ${m[2]}.` }],
  [/^You have (\S+)\. Couldn't reach GitHub to compare\.$/, { pt: (m) => `Você tem a ${m[1]}. Não foi possível acessar o GitHub para comparar.` }],
  [/^Working: found (\d+) devices? in (\d+) ms\.$/, {
    pt: (m) => `Funcionando: ${m[1] === '1' ? '1 dispositivo encontrado' : `${m[1]} dispositivos encontrados`} em ${m[2]} ms.`,
  }],
  [/^Working: Windows has a battery reading for (\d+) devices?\.$/, {
    pt: (m) => `Funcionando: o Windows tem leitura de bateria de ${m[1] === '1' ? '1 dispositivo' : `${m[1]} dispositivos`}.`,
  }],
  [/^(\d+) in the last week\.$/, { pt: (m) => `${m[1]} na última semana.` }],
  [/^Last read (.+)\.$/, { pt: (m) => `Última leitura ${checkAgo(m[1])}.` }],
  [/^Didn't answer, so it may be asleep\. Last read (.+)\.$/, {
    pt: (m) => `Não respondeu, então pode estar em repouso. Última leitura ${checkAgo(m[1])}.`,
  }],
  [/^Can't read it: (.+)$/, { pt: (m) => `Não foi possível ler: ${m[1]}` }],
  [/^The check couldn't finish: (.+)$/, { pt: (m, l) => `A verificação não pôde terminar: ${bhTranslate(m[1], l)}` }],
  [/^(Opens GitHub with the report filled in|Your browser opened with the report filled in)\. Nothing is posted until you submit it there\. You need a free GitHub account\. Issues are public, so your user name, device serials and Bluetooth details are left out\.( This report is too long for a link, so the full version is also copied for you to paste in\.)?$/, {
    pt: (m) => (m[1].startsWith('Opens') ? 'Abre o GitHub com o relatório preenchido.' : 'O navegador abriu com o relatório preenchido.')
      + ' Nada é publicado até você enviá-lo lá. Você precisa de uma conta gratuita no GitHub.'
      + ' As issues são públicas, por isso seu nome de usuário, os números de série dos dispositivos e os dados de Bluetooth ficam de fora.'
      + (m[2] ? ' Este relatório é grande demais para um link, então a versão completa também foi copiada para você colar.' : ''),
  }],
  // The rest of the Help panel (support.js): reports that were already sent, and errors with a reason.
  [/^Open report #(\d+)$/, { pt: (m) => `Abrir relatório #${m[1]}` }],
  [/^Someone with the same device opened report #(\d+)\. Add yours to it instead of starting a new one\.$/, {
    pt: (m) => `Alguém com o mesmo dispositivo abriu o relatório #${m[1]}. Adicione o seu a ele em vez de começar um novo.`,
  }],
  [/^This device was looked at in report #(\d+), which has the answer\. Add yours there if something changed\.$/, {
    pt: (m) => `Este dispositivo foi analisado no relatório #${m[1]}, que tem a resposta. Adicione o seu lá se algo mudou.`,
  }],
  [/^Battery Hub opened a report on it (.+)\. Add anything new as a comment there\.$/, {
    pt: (m) => `O Battery Hub abriu um relatório sobre ele em ${m[1]}. Adicione qualquer novidade como comentário lá.`,
  }],
  [/^(.+) This problem may already be fixed\. Update, then scan again\.$/, {
    pt: (m, l) => `${bhTranslate(m[1], l)} Este problema pode já ter sido corrigido. Atualize e busque de novo.`,
  }],
  [/^The report couldn't be made: (.+)$/, { pt: (m, l) => `Não foi possível criar o relatório: ${bhTranslate(m[1], l)}` }],
  [/^The form couldn't be opened: (.+)$/, { pt: (m, l) => `Não foi possível abrir o formulário: ${bhTranslate(m[1], l)}` }],
  [/^Opens GitHub with the device filled in, so it can be listed and built in for everyone\. Nothing is posted until you submit it there\. (.+)$/, {
    pt: (m, l) => `Abre o GitHub com o dispositivo preenchido, para que ele possa ser listado e incluído para todos. Nada é publicado até você enviá-lo lá. ${bhTranslate(m[1], l)}`,
  }],
  // Set up a device: the scan and the choice of the battery value (app.js)
  [/^The scan takes (\d+) seconds\. While it runs, turn the device off and on once or twice, because many devices only report their battery at power on\. If the device has its own app, keep it open\.$/, {
    pt: (m) => `A busca leva ${m[1]} segundos. Enquanto ela roda, desligue e ligue o dispositivo uma ou duas vezes, porque muitos dispositivos só informam a bateria quando são ligados. Se o dispositivo tiver um app próprio, deixe-o aberto.`,
  }],
  [/^Scan failed: (.+)$/, { pt: (m, l) => `A busca falhou: ${bhTranslate(m[1], l)}` }],
  [/^Channel 0x([0-9a-f]+), (\w+) report (\d+), seen (\d+) times$/, {
    pt: (m) => `Canal 0x${m[1]}, relatório ${({ input: 'de entrada', feature: 'de recurso' })[m[2]] || m[2]} ${m[3]}, visto ${m[4]} ${m[4] === '1' ? 'vez' : 'vezes'}`,
  }],
  [/^Battery from (\d+)% to (\d+)%, between (\d+)% and (\d+)%\. Use the arrow keys to read each point\.$/, {
    pt: (m) => `Bateria de ${m[1]}% a ${m[2]}%, entre ${m[3]}% e ${m[4]}%. Use as setas do teclado para ler cada ponto.`,
  }],
];

function bhTranslate(text, lang) {
  if (lang === 'en' || text == null) return text;
  const s = String(text);
  const trimmed = s.trim();
  if (!trimmed) return s;
  const table = (typeof BH_STRINGS !== 'undefined' ? BH_STRINGS : require('./i18n-strings').BH_STRINGS)[lang];
  if (!table) return s;
  // A sentence the source wraps over several lines reaches us with its line breaks and indentation.
  const key = trimmed.replace(/\s+/g, ' ');
  let out = table[key];
  if (out === undefined) {
    for (const [re, forms] of PATTERNS) {
      const m = key.match(re);
      if (m && forms[lang]) { out = forms[lang](m, lang); break; }
    }
  }
  if (out === undefined) return s;
  return s.slice(0, s.indexOf(trimmed)) + out + s.slice(s.indexOf(trimmed) + trimmed.length);
}

if (typeof module !== 'undefined' && module.exports) module.exports = { BH_LANGS, PATTERNS, UNITS, resolveLanguage, bhTranslate };
