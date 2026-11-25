// Turns a piece of Battery Hub's English into the chosen language: an exact match in
// i18n-strings.js first, then the patterns below for text with numbers or names in it. Anything
// unknown comes back unchanged, so a missing translation shows English rather than nothing.
// Pure: loaded as a plain script by the windows (after i18n-strings.js) and required by the main
// process for the tray and notifications.
const BH_LANGS = ['en', 'es', 'zh', 'he', 'ru'];

// 'system' or a missing setting follows the Windows display language.
function resolveLanguage(setting, locale) {
  if (BH_LANGS.includes(setting)) return setting;
  const l = String(locale || '').toLowerCase();
  if (l.startsWith('es')) return 'es';
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('zh')) return 'zh';
  if (l.startsWith('he') || l.startsWith('iw')) return 'he';
  return 'en';
}

// "1d 16h", "40s", "~7h": the short durations the app writes.
const UNITS = {
  es: { d: ' d', h: ' h', m: ' min', s: ' s' },
  zh: { d: '天', h: '小时', m: '分钟', s: '秒' },
  he: { d: ' ימ׳', h: ' שע׳', m: ' דק׳', s: ' שנ׳' },
  ru: { d: ' дн.', h: ' ч', m: ' мин', s: ' сек.' },
};
function duration(text, lang) {
  return text.replace(/(\d+)([dhms])\b/g, (all, n, unit) => n + UNITS[lang][unit]);
}

// [pattern, { lang: (match) => text }]
const PATTERNS = [
  [/^Updated (\d+[dhms]) ago$/, {
    es: (m, l) => `Actualizado hace ${duration(m[1], l)}`,
    zh: (m, l) => `${duration(m[1], l)}前更新`,
    he: (m, l) => `עודכן לפני ${duration(m[1], l)}`,
  }],
  [/^(\d+[dhms]) ago$/, {
    es: (m, l) => `hace ${duration(m[1], l)}`,
    zh: (m, l) => `${duration(m[1], l)}前`,
    he: (m, l) => `לפני ${duration(m[1], l)}`,
  }],
  [/^~((?:\d+[dhm] ?)+) left$/, {
    es: (m, l) => `Quedan ~${duration(m[1], l)}`,
    zh: (m, l) => `剩余约 ${duration(m[1], l)}`,
    he: (m, l) => `נותרו ~${duration(m[1], l)}`,
  }],
  [/^~((?:\d+[dhm] ?)+)$/, {
    es: (m, l) => `~${duration(m[1], l)}`,
    zh: (m, l) => `约 ${duration(m[1], l)}`,
    he: (m, l) => `~${duration(m[1], l)}`,
  }],
  [/^([\d.]+)% a day$/, { es: (m) => `${m[1]}% al día`, zh: (m) => `每天 ${m[1]}%`, he: (m) => `${m[1]}% ביום` }],
  [/^([\d.]+)% an hour$/, { es: (m) => `${m[1]}% por hora`, zh: (m) => `每小时 ${m[1]}%`, he: (m) => `${m[1]}% בשעה` }],
  [/^Same as Settings \((\d+)%\)$/, {
    es: (m) => `Igual que en Ajustes (${m[1]}%)`,
    zh: (m) => `与设置相同（${m[1]}%）`,
    he: (m) => `כמו בהגדרות (${m[1]}%)`,
  }],
  [/^Charging, (\d+)%$/, { es: (m) => `Cargando, ${m[1]}%`, zh: (m) => `充电中，${m[1]}%`, he: (m) => `בטעינה, ${m[1]}%` }],
  [/^(\d+) hidden devices?$/, {
    es: (m) => (m[1] === '1' ? '1 dispositivo oculto' : `${m[1]} dispositivos ocultos`),
    zh: (m) => `${m[1]} 个隐藏的设备`,
    he: (m) => (m[1] === '1' ? 'מכשיר מוסתר אחד' : `${m[1]} מכשירים מוסתרים`),
  }],
  [/^(.*) · (\d+) channels?$/, {
    es: (m) => `${m[1]} · ${m[2]} ${m[2] === '1' ? 'canal' : 'canales'}`,
    zh: (m) => `${m[1]} · ${m[2]} 个通道`,
    he: (m) => `${m[1]} · ${m[2] === '1' ? 'ערוץ אחד' : `${m[2]} ערוצים`}`,
  }],
  [/^Version (\S+)$/, { es: (m) => `Versión ${m[1]}`, zh: (m) => `版本 ${m[1]}`, he: (m) => `גרסה ${m[1]}` }],
  [/^Update available: (v\S+)$/, {
    es: (m) => `Actualización disponible: ${m[1]}`,
    zh: (m) => `有可用更新：${m[1]}`,
    he: (m) => `עדכון זמין: ${m[1]}`,
  }],
  [/^Update ready: (v\S+)$/, {
    es: (m) => `Actualización lista: ${m[1]}`,
    zh: (m) => `更新已就绪：${m[1]}`,
    he: (m) => `העדכון מוכן: ${m[1]}`,
  }],
  [/^Set up (.+)$/, { es: (m) => `Configurar ${m[1]}`, zh: (m) => `设置 ${m[1]}`, he: (m) => `הגדרת ${m[1]}` }],
  [/^(.+): open details$/, { es: (m) => `${m[1]}: abrir detalles`, zh: (m) => `${m[1]}：打开详情`, he: (m) => `${m[1]}: פתיחת פרטים` }],
  // notifications
  [/^(.+) is at (\d+)%\. Time to charge\.$/, {
    es: (m) => `${m[1]} está al ${m[2]}%. Hora de cargarlo.`,
    zh: (m) => `${m[1]} 电量为 ${m[2]}%，该充电了。`,
    he: (m) => `${m[1]} ב-${m[2]}%. הגיע הזמן לטעון.`,
  }],
  [/^(.+) is charging \((\d+)%\)\.$/, {
    es: (m) => `${m[1]} se está cargando (${m[2]}%).`,
    zh: (m) => `${m[1]} 正在充电（${m[2]}%）。`,
    he: (m) => `${m[1]} בטעינה (${m[2]}%).`,
  }],
  [/^(.+) is charged \((\d+)%\)\.$/, {
    es: (m) => `${m[1]} está cargado (${m[2]}%).`,
    zh: (m) => `${m[1]} 已充满（${m[2]}%）。`,
    he: (m) => `${m[1]} טעון (${m[2]}%).`,
  }],
];

// Russian dynamic translations with correct plural forms for counts.
function ruPlural(n, one, few, many) {
  const v = Math.abs(Number(n));
  const mod100 = v % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = v % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
const RU_PATTERNS = [
  [/^Scan failed: (.+)$/, (m) => `Ошибка сканирования: ${m[1]}`],
  [/^Channel 0x([0-9a-fA-F]+), (input|output|feature) report (\d+), seen (\d+) times$/, (m) => {
    const kind = { input: 'входящий', output: 'исходящий', feature: 'служебный' }[m[2]];
    return `Канал 0x${m[1]}, ${kind} отчёт ${m[3]}, получен ${m[4]} ${ruPlural(m[4], 'раз', 'раза', 'раз')}`;
  }],
  [/^Open report #(\d+)$/, (m) => `Открыть отчёт №${m[1]}`],
  [/^(.+) This problem may already be fixed\. Update, then scan again\.$/, (m) => `${m[1]} Возможно, проблему уже исправили. Обновите программу и повторите сканирование.`],
  [/^Someone with the same device opened report #(\d+)\. Add yours to it instead of starting a new one\.$/, (m) => `Для такого устройства уже есть обращение №${m[1]}. Добавьте информацию туда, а не создавайте новое.`],
  [/^This device was looked at in report #(\d+), which has the answer\. Add yours there if something changed\.$/, (m) => `Устройство уже рассматривали в обращении №${m[1]}. Если появились новые сведения, добавьте их туда.`],
  [/^Battery Hub opened a report on it (.+)\. Add anything new as a comment there\.$/, (m) => `Battery Hub создал обращение ${m[1]}. Новые сведения можно добавить в комментарий.`],
  [/^The report couldn't be made: (.+)$/, (m) => `Не удалось подготовить отчёт: ${m[1]}`],
  [/^The check couldn't finish: (.+)$/, (m) => `Не удалось завершить проверку: ${m[1]}`],
  [/^Updated (\d+[dhms]) ago$/, (m) => `Обновлено ${duration(m[1], 'ru')} назад`],
  [/^(\d+[dhms]) ago$/, (m) => `${duration(m[1], 'ru')} назад`],
  [/^~((?:\d+[dhm] ?)+) left$/, (m) => `Осталось примерно ${duration(m[1], 'ru')}`],
  [/^~((?:\d+[dhm] ?)+)$/, (m) => `≈${duration(m[1], 'ru')}`],
  [/^([\d.]+)% a day$/, (m) => `${m[1]}% в день`],
  [/^([\d.]+)% an hour$/, (m) => `${m[1]}% в час`],
  [/^Same as Settings \((\d+)%\)$/, (m) => `Как в настройках (${m[1]}%)`],
  [/^Charging, (\d+)%$/, (m) => `Заряжается, ${m[1]}%`],
  [/^(\d+) hidden devices?$/, (m) => `${m[1]} ${ruPlural(m[1], 'скрытое устройство', 'скрытых устройства', 'скрытых устройств')}`],
  [/^(.*) · (\d+) channels?$/, (m) => `${m[1]} · ${m[2]} ${ruPlural(m[2], 'канал', 'канала', 'каналов')}`],
  [/^Version (\S+)$/, (m) => `Версия ${m[1]}`],
  [/^Update available: (v\S+)$/, (m) => `Доступно обновление: ${m[1]}`],
  [/^Update ready: (v\S+)$/, (m) => `Обновление готово: ${m[1]}`],
  [/^Set up (.+)$/, (m) => `Настроить ${m[1]}`],
  [/^(.+): open details$/, (m) => `${m[1]}: открыть сведения`],
  [/^(.+) is at (\d+)%\. Time to charge\.$/, (m) => `Устройство «${m[1]}»: заряд ${m[2]}%. Пора заряжать.`],
  [/^(.+) is charging \((\d+)%\)\.$/, (m) => `Устройство «${m[1]}» заряжается (${m[2]}%).`],
  [/^(.+) is charged \((\d+)%\)\.$/, (m) => `Устройство «${m[1]}» заряжено (${m[2]}%).`],
];

function bhTranslate(text, lang) {
  if (lang === 'en' || text == null) return text;
  const s = String(text);
  const trimmed = s.trim();
  if (!trimmed) return s;
  const table = (typeof BH_STRINGS !== 'undefined' ? BH_STRINGS : require('./i18n-strings').BH_STRINGS)[lang];
  if (!table) return s;
  // Collapse internal whitespace for strings split across multiple source lines.
  const normalized = trimmed.replace(/\s+/g, ' ');
  let out = table[trimmed];
  if (out === undefined && normalized !== trimmed) out = table[normalized];
  if (out === undefined) {
    for (const [re, forms] of PATTERNS) {
      const m = normalized.match(re);
      if (m && forms[lang]) { out = forms[lang](m, lang); break; }
    }
  }
  if (out === undefined && lang === 'ru') {
    for (const [re, format] of RU_PATTERNS) {
      const m = normalized.match(re);
      if (m) { out = format(m); break; }
    }
  }
  if (out === undefined) return s;
  return s.slice(0, s.indexOf(trimmed)) + out + s.slice(s.indexOf(trimmed) + trimmed.length);
}

if (typeof module !== 'undefined' && module.exports) module.exports = { BH_LANGS, resolveLanguage, bhTranslate };
