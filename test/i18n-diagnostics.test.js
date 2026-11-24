// The check in Settings > Help writes its messages in English; the window shows them in the chosen
// language (the report that goes to GitHub stays English). These tests run the check in every state
// it can end up in and make sure no message is left in English in Portuguese.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { bhTranslate } = require('../src/renderer/i18n-core');
const { writeManifest } = require('../src/main/package-check');
const { runChecks, verdictOf, checkDevice, checkPython } = require('../src/main/diagnostics');

const pt = (text) => bhTranslate(text, 'pt');

function tempPackage() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bh-i18n-'));
  fs.mkdirSync(path.join(root, 'src'));
  fs.writeFileSync(path.join(root, 'package.json'), '{}');
  fs.writeFileSync(path.join(root, 'src', 'main.js'), 'one');
  return root;
}

function deps(root, extra = {}) {
  return {
    root, packaged: true, version: '2.0.5', userData: root, logFile: path.join(root, 'no-such.log'),
    fetcher: async () => ({ ok: true, json: async () => ({ tag_name: 'v2.0.5' }) }),
    enumerate: async () => [{}, {}, {}, {}],
    windowsSelfTest: async () => ({ ok: true, count: 4 }),
    devices: { a: { id: '13652:62858:serial', product: 'VXE', driverId: 'kysona', lastReadingAt: Date.now() } },
    ...extra,
  };
}

// What the window shows for a result: titles of the checks, details, fixes and the verdict.
function shown(result) {
  const out = [result.verdict.title, result.verdict.detail];
  for (const c of result.checks) {
    if (!c.id.startsWith('device:')) out.push(c.title);
    out.push(c.detail);
    if (c.fix) out.push(c.fix);
  }
  return out;
}

function assertAllTranslated(texts) {
  const left = [...new Set(texts)].filter((t) => pt(t) === t);
  assert.deepEqual(left, [], 'these are still English');
}

test('the texts the check shows on a healthy PC are all in Portuguese', async () => {
  const root = tempPackage();
  await writeManifest(root, '2.0.5');
  assertAllTranslated(shown(await runChecks(deps(root))));
  assertAllTranslated(shown(await runChecks(deps(root, { packaged: false }))));
  fs.rmSync(root, { recursive: true });
});

test('the texts of every failure and warning are all in Portuguese', async () => {
  const root = tempPackage();
  await writeManifest(root, '2.0.5');
  fs.writeFileSync(path.join(root, 'src', 'main.js'), 'changed');
  const log = path.join(root, 'app.log');
  const when = new Date().toISOString();
  fs.writeFileSync(log, Array.from({ length: 11 }, () => `[${when}] ERROR something broke`).join('\n'));
  const bad = await runChecks(deps(root, {
    logFile: log,
    fetcher: async () => ({ ok: true, json: async () => ({ tag_name: 'v9.0.0' }) }),
    enumerate: async () => { throw new Error('worker exited'); },
    windowsSelfTest: async () => ({ ok: false, error: 'blocked' }),
    userData: path.join(root, 'no', 'such', 'folder'),
  }));
  assertAllTranslated(shown(bad));
  const offline = await runChecks(deps(root, { fetcher: async () => { throw new Error('offline'); }, packaged: true }));
  assertAllTranslated(shown(offline));
  const noManifest = tempPackage();
  assertAllTranslated(shown(await runChecks(deps(noManifest))));
  fs.rmSync(root, { recursive: true });
  fs.rmSync(noManifest, { recursive: true });
});

test('the Python check is in Portuguese whether Python is there or not', async () => {
  const device = [{ driverId: 'mchose', product: 'MCHOSE' }];
  const found = await checkPython(device, async () => true);
  const missing = await checkPython(device, async () => false);
  assertAllTranslated([found, missing].flatMap((c) => [c.title, c.detail, c.fix].filter(Boolean)));
});

test('every state a device can be in is in Portuguese', () => {
  const now = Date.now();
  const minutes = (n) => now - n * 60000;
  const devices = [
    { id: 'a:1', product: 'VXE', online: false },
    { id: 'a:2', product: 'VXE', online: false, lastError: 'headset is off' },
    { id: 'a:3', product: 'VXE', lastError: 'not connected' },
    { id: 'a:4', product: 'VXE', lastError: 'waiting for headset update' },
    { id: 'a:5', product: 'VXE', lastError: 'needs Python + hid module' },
    { id: 'a:6', product: 'VXE', lastError: 'timed out', lastReadingAt: minutes(30) },
    { id: 'a:7', product: 'VXE', lastError: 'something odd' },
    { id: 'a:8', product: 'VXE' },
    { id: 'a:9', product: 'VXE', lastReadingAt: now },
    { id: 'a:10', product: 'VXE', lastReadingAt: minutes(5) },
    { id: 'a:11', product: 'VXE', lastReadingAt: minutes(180) },
    { id: 'a:12', product: 'VXE', lastReadingAt: minutes(60 * 24 * 4) },
    { id: 'a:13', product: 'VXE', lastError: 'timed out', lastReadingAt: minutes(60 * 24 * 4) },
  ];
  const texts = devices.flatMap((d) => {
    const c = checkDevice(d, now);
    return [c.detail, c.fix].filter(Boolean);
  });
  assertAllTranslated(texts);
});

test('the four verdicts are in Portuguese', () => {
  const mk = (status, side) => ({ status, side });
  const verdicts = [
    verdictOf([mk('ok', null)]),
    verdictOf([mk('fail', 'pc')]),
    verdictOf([mk('warn', 'app')]),
    verdictOf([mk('warn', 'pc')]),
  ];
  assertAllTranslated(verdicts.flatMap((v) => [v.title, v.detail]));
});

test('the dynamic messages read well in Portuguese', () => {
  assert.equal(pt('You have 2.0.5, the latest version.'), 'Você tem a 2.0.5, a versão mais recente.');
  assert.equal(pt('You have 2.0.5. The latest is v2.1.0.'), 'Você tem a 2.0.5. A mais recente é a v2.1.0.');
  assert.equal(pt("You have 2.0.5. Couldn't reach GitHub to compare."), 'Você tem a 2.0.5. Não foi possível acessar o GitHub para comparar.');
  assert.equal(pt('Working: found 4 devices in 5 ms.'), 'Funcionando: 4 dispositivos encontrados em 5 ms.');
  assert.equal(pt('Working: found 1 device in 12 ms.'), 'Funcionando: 1 dispositivo encontrado em 12 ms.');
  assert.equal(pt('Working: Windows has a battery reading for 4 devices.'), 'Funcionando: o Windows tem leitura de bateria de 4 dispositivos.');
  assert.equal(pt('Working: Windows has a battery reading for 1 device.'), 'Funcionando: o Windows tem leitura de bateria de 1 dispositivo.');
  assert.equal(pt('11 in the last week.'), '11 na última semana.');
  assert.equal(pt('All 312 files match what was shipped.'), 'Todos os 312 arquivos são iguais aos do pacote original.');
  assert.equal(pt('3 of 312 files are missing or changed.'), '3 de 312 arquivos estão ausentes ou alterados.');
  assert.equal(pt('Last read just now.'), 'Última leitura agora mesmo.');
  assert.equal(pt('Last read 5 min ago.'), 'Última leitura há 5 min.');
  assert.equal(pt('Last read 3 h ago.'), 'Última leitura há 3 h.');
  assert.equal(pt('Last read 4 days ago.'), 'Última leitura há 4 dias.');
  assert.equal(pt("Didn't answer, so it may be asleep. Last read 5 min ago."), 'Não respondeu, então pode estar em repouso. Última leitura há 5 min.');
  assert.equal(pt("Can't read it: no such report"), 'Não foi possível ler: no such report');
  assert.equal(pt('Run again'), 'Verificar de novo');
});

test('only the other languages keep the check in English for now; the report is never translated', () => {
  assert.equal(bhTranslate('11 in the last week.', 'es'), '11 in the last week.');
  const source = fs.readFileSync(path.join(__dirname, '../src/main/diagnostics.js'), 'utf8');
  assert.ok(!/require\('\.\/lang'\)/.test(source), 'diagnostics.js does not translate: its report goes to GitHub in English');
  const support = fs.readFileSync(path.join(__dirname, '../src/renderer/support.js'), 'utf8');
  assert.match(support, /supportText\('pre', '', result\.report\)\.dataset\.noTranslate|noTranslate/, 'the report shown on screen is marked as not to be translated');
});
