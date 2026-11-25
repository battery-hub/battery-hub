const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { BH_STRINGS } = require('../src/renderer/i18n-strings');
const { bhTranslate, resolveLanguage } = require('../src/renderer/i18n-core');

const tr = (text) => bhTranslate(text, 'ru');
const renderer = path.join(__dirname, '../src/renderer');

test('Russian contains all shared strings and all localized Help strings', () => {
  for (const lang of ['es', 'zh', 'he', 'pt']) {
    for (const key of Object.keys(BH_STRINGS[lang])) {
      assert.ok(Object.hasOwn(BH_STRINGS.ru, key), 'Missing Russian translation: ' + key);
    }
  }
  for (const [key, value] of Object.entries(BH_STRINGS.ru)) {
    assert.ok(value && value.trim(), 'Empty Russian translation: ' + key);
  }
});

test('Russian translates calibration, help and device-confirmation screens', () => {
  const examples = [
    '1. Scan the device', '2. Pick the battery value', '3. Confirm',
    'Choose an icon', 'Notification test (this PC only)',
    'Low battery alerts are off in Settings',
    'Still not working?', 'Is this battery level right?',
    'It works! Let the developer know', 'Thank you!',
    'This device is no longer saved', 'Python for your headset',
    "Settings can't be saved.", 'Run again',
    'The part that talks to your devices didn\'t start.',
  ];
  for (const english of examples) assert.notEqual(tr(english), english, english);
  assert.equal(resolveLanguage('system', 'ru-RU'), 'ru');
});

test('Russian translates dynamic diagnostics and makes plurals correctly', () => {
  const examples = [
    'All 312 files match what was shipped.',
    '3 of 312 files are missing or changed.',
    'You have 2.0.6, the latest version.',
    'You have 2.0.5. The latest is v2.0.6.',
    "You have 2.0.5. Couldn't reach GitHub to compare.",
    'Working: found 1 device in 12 ms.',
    'Working: found 4 devices in 5 ms.',
    'Working: Windows has a battery reading for 1 device.',
    'Working: Windows has a battery reading for 4 devices.',
    '11 in the last week.',
    'Last read just now.',
    'Last read 5 min ago.',
    'Last read 3 h ago.',
    'Last read 4 days ago.',
    "Didn't answer, so it may be asleep. Last read 5 min ago.",
    "Can't read it: device sleeping",
    "The check couldn't finish: This device is no longer saved",
    "The report couldn't be made: This device is no longer saved",
    "The form couldn't be opened: offline",
    'Battery from 80% to 40%, between 35% and 90%. Use the arrow keys to read each point.',
    'The scan takes 45 seconds. While it runs, turn the device off and on once or twice, because many devices only report their battery at power on. If the device has its own app, keep it open.',
  ];
  for (const english of examples) assert.notEqual(tr(english), english, english);
  assert.match(tr('Working: found 21 devices in 8 ms.'), /21 устройство/);
  assert.match(tr('Working: found 12 devices in 8 ms.'), /12 устройств/);
  assert.match(tr('Last read 4 days ago.'), /4 дня назад/);
  assert.match(tr('Last read 11 days ago.'), /11 дней назад/);
  assert.match(tr("The report couldn't be made: This device is no longer saved"), /Это устройство больше не сохранено/);
});

test('Russian translates GitHub report notes and scan error reasons', () => {
  const examples = [
    'Opens GitHub with the device filled in, so it can be listed and built in for everyone. Nothing is posted until you submit it there. You need a free GitHub account. Issues are public, so your user name, device serials and Bluetooth details are left out.',
    'Opens GitHub with the report filled in. Nothing is posted until you submit it there. You need a free GitHub account. Issues are public, so your user name, device serials and Bluetooth details are left out.',
    'Your browser opened with the report filled in. Nothing is posted until you submit it there. You need a free GitHub account. Issues are public, so your user name, device serials and Bluetooth details are left out. This report is too long for a link, so the full version is also copied for you to paste in.',
    'Scan failed: This device is no longer saved',
    'Channel 0xff00, input report 85, seen 3 times',
  ];
  for (const english of examples) assert.notEqual(tr(english), english, english);
  assert.match(tr('Scan failed: This device is no longer saved'), /Это устройство больше не сохранено/);
  assert.match(tr('Channel 0xff00, input report 85, seen 3 times'), /3 раза/);
});

test('all fixed texts in Russian renderer have translations', () => {
  const files = ['index.html', 'flyout.html', 'app.js', 'detail.js', 'support.js', 'flyout.js'];
  const ignore = new Set(['Enter', 'Escape', 'Home', 'End', 'Tab', 'Battery Hub', 'English', 'Español', 'Português (Brasil)', 'Русский', '中文', 'עברית']);
  const squash = (text) => text.replace(/\s+/g, ' ').trim();
  const covered = (text) => tr(text) !== text || Object.hasOwn(BH_STRINGS.ru, squash(text));
  function htmlTexts(html) {
    const input = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g, '\u0001');
    const results = [];
    for (const m of input.matchAll(/>([^<>]+)</g)) results.push(squash(m[1]));
    for (const m of input.matchAll(/(?:title|placeholder|aria-label|alt)="([^"]+)"/g)) results.push(squash(m[1]));
    return results.filter((t) => /[A-Za-z]{2}/.test(t) && !ignore.has(t) && !t.includes('\u0001'));
  }
  for (const filename of files) {
    const source = fs.readFileSync(path.join(renderer, filename), 'utf8');
    if (filename.endsWith('.html')) {
      const missing = [...new Set(htmlTexts(source).filter(t => !covered(t)))];
      assert.deepEqual(missing, [], filename + ' untranslated');
      continue;
    }
    const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
    const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
    let m, literals = [];
    while ((m = re.exec(withoutComments))) {
      const value = (m[1] ?? m[2] ?? m[3]).replace(/\\'/g, "'").replace(/\\"/g, '"');
      literals.push(value);
      if (/<[a-z/]/i.test(value)) literals.push(...htmlTexts(value));
    }
    const missing = [...new Set(literals.filter(t =>
      !t.includes('${') && !t.includes('<') && /^[A-Z]/.test(t) && /[a-z]{2}/.test(t) &&
      !/[=;{}]/.test(t) && !ignore.has(t) && !covered(t)))];
    assert.deepEqual(missing, [], filename + ' untranslated');
  }
});
