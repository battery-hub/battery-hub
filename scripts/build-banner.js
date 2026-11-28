// Draws the README hero banner, one per README language, into .github/readme/banner-<lang>.jpg.
//
//   npx electron scripts/build-banner.js
//
// The design book's promo recipe: dark charcoal, a faint teal glow, the headline on one side with
// its key words in mint, and the app (docs/screenshot.png) on the other with a low-battery toast.
// Hebrew is mirrored. Captured from the window's own output, like screenshot.js.
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '.github', 'readme');
const WIDTH = 1280;
const HEIGHT = 600;
const url = (p) => 'file:///' + path.join(ROOT, p).replace(/\\/g, '/');

const TEXT = {
  en: { lead: 'Every battery,', key: 'at a glance.', sub: 'Mice, keyboards, headsets and controllers, live on one dashboard and in your tray.', tags: ['Free', 'Windows 10 & 11', 'Open source'], toast: 'DualSense Controller is at 14%, time to charge.' },
  es: { lead: 'Todas tus baterías,', key: 'de un vistazo.', sub: 'Ratones, teclados, auriculares y mandos, en vivo en un panel y en tu bandeja.', tags: ['Gratis', 'Windows 10 y 11', 'Código abierto'], toast: 'DualSense Controller está al 14%, es hora de cargarlo.' },
  zh: { lead: '所有电量，', key: '一目了然。', sub: '鼠标、键盘、耳机和手柄，实时显示在仪表板和系统托盘中。', tags: ['免费', 'Windows 10 和 11', '开源'], toast: 'DualSense Controller 电量为 14%，该充电了。' },
  he: { rtl: true, lead: 'כל הסוללות,', key: 'במבט אחד.', sub: 'עכברים, מקלדות, אוזניות ושלטים, בזמן אמת בלוח בקרה אחד ובמגש המערכת.', tags: ['חינם', 'Windows 10 ו-11', 'קוד פתוח'], toast: 'הסוללה של DualSense Controller ב-14%, הגיע הזמן לטעון.' },
  pt: { lead: 'Todas as suas baterias,', key: 'de relance.', sub: 'Mouses, teclados, headsets e controles, ao vivo em um painel e na bandeja.', tags: ['Grátis', 'Windows 10 e 11', 'Código aberto'], toast: 'DualSense Controller está com 14%, hora de carregar.' },
  ru: { lead: 'Все батареи —', key: 'с первого взгляда.', sub: 'Мыши, клавиатуры, гарнитуры и геймпады — в реальном времени на панели и в трее.', tags: ['Бесплатно', 'Windows 10 и 11', 'Открытый код'], toast: 'У DualSense Controller осталось 14%, пора зарядить.' },
};

function page(t) {
  const dir = t.rtl ? 'rtl' : 'ltr';
  const side = t.rtl ? 'left' : 'right';
  const other = t.rtl ? 'right' : 'left';
  return `<!doctype html><html dir="${dir}"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #17191C; }
  body { position: relative; font-family: 'Segoe UI Variable Display', 'Segoe UI', 'Microsoft YaHei UI', sans-serif; color: #F3F4F6; }
  .glow { position: absolute; width: 900px; height: 900px; top: -150px; ${side}: -260px; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(11,123,124,0.55), rgba(4,82,87,0.22) 55%, rgba(23,25,28,0) 100%); }
  .glow2 { position: absolute; width: 520px; height: 520px; bottom: -300px; ${other}: -160px; border-radius: 50%;
    background: radial-gradient(closest-side, rgba(47,213,160,0.12), rgba(23,25,28,0)); }
  .copy { position: absolute; top: 0; bottom: 0; ${other}: 72px; width: 520px; display: flex; flex-direction: column; justify-content: center; }
  .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 34px; }
  .brand img { width: 54px; height: 54px; }
  .brand span { font-size: 26px; font-weight: 600; letter-spacing: 0.2px; }
  h1 { font-size: 58px; line-height: 1.08; font-weight: 600; letter-spacing: -0.6px; }
  h1 em { font-style: normal; color: #2FD5A0; display: block; }
  p { margin-top: 22px; font-size: 22px; line-height: 1.45; color: #A9AEB6; max-width: 470px; }
  .tags { display: flex; gap: 10px; margin-top: 30px; flex-wrap: wrap; }
  .tags span { font-size: 15px; font-weight: 600; padding: 7px 14px; border-radius: 999px; color: #CFF7E8;
    background: rgba(47,213,160,0.10); border: 1px solid rgba(47,213,160,0.35); }
  .shot { position: absolute; top: 56px; ${side}: 64px; width: 560px; border-radius: 14px; overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08); }
  .shot img { display: block; width: 100%; }
  .toast { position: absolute; bottom: 44px; ${side}: 400px; width: 380px; display: flex; gap: 14px; align-items: center;
    padding: 16px 18px; border-radius: 12px; background: rgba(36,39,43,0.96); border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 18px 50px rgba(0,0,0,0.55); font-family: 'Segoe UI', 'Microsoft YaHei UI', sans-serif; }
  .toast img { width: 40px; height: 40px; flex: none; }
  .toast b { display: block; font-size: 14px; font-weight: 600; color: #E6E8EE; margin-bottom: 3px; }
  .toast div div { font-size: 14px; line-height: 1.35; color: #C3C8D0; }
  .toast .dot { width: 10px; height: 10px; border-radius: 50%; background: #FF5A52; flex: none; align-self: flex-start; margin-top: 4px; }
  </style></head><body>
  <div class="glow"></div><div class="glow2"></div>
  <div class="shot"><img src="${url('docs/screenshot.png')}"></div>
  <div class="toast"><img src="${url('assets/brand/watcher-tile.png')}"><div><b>Battery Hub</b><div>${t.toast}</div></div><span class="dot"></span></div>
  <div class="copy">
    <div class="brand"><img src="${url('assets/brand/watcher-tile.png')}"><span>Battery Hub</span></div>
    <h1>${t.lead}<em>${t.key}</em></h1>
    <p>${t.sub}</p>
    <div class="tags">${t.tags.map((x) => `<span>${x}</span>`).join('')}</div>
  </div>
  </body></html>`;
}

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const win = new BrowserWindow({
    width: WIDTH, height: HEIGHT, show: true, skipTaskbar: true, frame: false, useContentSize: true,
    backgroundColor: '#17191C', webPreferences: { zoomFactor: 1, backgroundThrottling: false },
  });
  win.setOpacity(0);
  for (const [code, t] of Object.entries(TEXT)) {
    const file = path.join(os.tmpdir(), `battery-hub-banner-${code}.html`);
    fs.writeFileSync(file, page(t));
    await win.loadFile(file);
    await new Promise((r) => setTimeout(r, 600));
    // At the screen's own scale (1.25 on a typical laptop, so 1600 wide); JPEG keeps the file small.
    // The compositor sometimes refuses a capture right after a load, so it's tried a few times.
    let image = null;
    for (let i = 0; i < 5 && !image; i++) {
      image = await win.webContents.capturePage().catch(() => null);
      if (!image) await new Promise((r) => setTimeout(r, 500));
    }
    if (!image) throw new Error(`could not capture the ${code} banner`);
    const outFile = path.join(OUT, `banner-${code}.jpg`);
    fs.writeFileSync(outFile, image.toJPEG(90));
    fs.unlinkSync(file);
    console.log(`wrote ${outFile} (${Math.round(fs.statSync(outFile).size / 1024)} KB, ${image.getSize().width}x${image.getSize().height})`);
  }
  win.destroy();
  app.quit();
});
