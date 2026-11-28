// Builds README.md and its translations, one per app language (README.es.md, .zh, .he, .pt, .ru),
// with the same header, language buttons and sections, plus the button images in .github/readme.
// The top banners come from scripts/build-banner.js (npx electron scripts/build-banner.js).
// The texts live here: change them here and run `node scripts/build-readme.js`, not in the .md files.
// The one exception is the Supported devices table, which is kept by hand in README.md (and in
// docs/index.html) and carried over from there each time this runs.
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || path.join(__dirname, '..');
const REPO = 'https://github.com/battery-hub/battery-hub';
const SITE = 'https://battery-hub.github.io/battery-hub/';

const LANGS = [
  ['en', 'English', 'README.md'],
  ['es', 'Español', 'README.es.md'],
  ['zh', '简体中文', 'README.zh.md'],
  ['he', 'עברית', 'README.he.md'],
  ['pt', 'Português', 'README.pt.md'],
  ['ru', 'Русский', 'README.ru.md'],
];

// GitHub's heading anchors: lower case, punctuation dropped, spaces to hyphens.
const anchor = (heading) => '#' + heading.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');

// The device table lives in the English README only; it is lifted from the current file as is.
const current = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8').split(/\r?\n/);
const tableStart = current.findIndex((l) => l.startsWith('| Family | Devices |'));
let tableEnd = tableStart;
while (tableEnd < current.length && current[tableEnd].startsWith('|')) tableEnd++;
const TABLE = current.slice(tableStart, tableEnd).join('\n');
if (tableStart < 0 || tableEnd - tableStart < 20) throw new Error('device table not found');

const T = {
  en: {
    tagline: 'Battery levels for all your wireless mice, keyboards, headsets and controllers, in one place on Windows.',
    download: 'Download for Windows',
    alt: { release: 'Latest release', downloads: 'Downloads', license: 'License', platform: 'Platform: Windows 10/11', coffee: 'Buy me a coffee', shot: 'The Battery Hub dashboard with five devices, their charge rings, history sparklines and time-left estimates' },
    intro: 'Battery Hub reads the battery level of your wireless devices straight from their receivers, cables and Bluetooth, shows them on one live dashboard and in the system tray, and warns you before anything runs flat. It\'s free, open source and runs entirely on your PC.',
    h: { features: 'Features', install: 'Installation', start: 'Getting started', devices: 'Supported devices', trouble: 'Troubleshooting', privacy: 'Privacy', build: 'Building from source', contrib: 'Contributing', thanks: 'Acknowledgements', support: 'Support the project', license: 'License' },
    features: [
      ['Every device in one place', 'mice, keyboards, headsets and controllers, each with a colour-coded charge ring.'],
      ['Tray icons', 'a live battery indicator for each device, next to the clock.'],
      ['History and estimates', '24-hour and 7-day charts, drain rate, time left and when it was last charged.'],
      ['Low-battery alerts', 'a Windows notification at the level you choose, for all devices or one at a time.'],
      ['Knows when a device is off', 'shows *Asleep or off* instead of an old reading.'],
      ['Setup for unknown devices', 'a 30-second scan finds the battery level of devices that aren\'t recognised automatically.'],
      ['Six languages', 'English, Español, 简体中文, עברית, Português and Русский.'],
      ['Made for Windows 11', 'light and dark themes, a tray flyout, a reduce-motion option and automatic updates.'],
    ],
    winget: 'Windows Package Manager',
    installer: 'Installer',
    installerText: `Download \`Battery-Hub-Installer-x.y.z.exe\` from the [latest release](${REPO}/releases/latest) and run it. Battery Hub installs for the current user and needs no administrator rights.`,
    smartscreen: 'The installer isn\'t code-signed, so Windows SmartScreen may show **"Windows protected your PC"**. Select **More info → Run anyway**. Signing certificates cost a yearly fee that this free project can\'t cover.',
    verifyTitle: 'Verifying a download',
    verify1: `Every release is built and published by [GitHub Actions](.github/workflows/release.yml) from a tagged commit, with no files uploaded by hand, and each one includes a \`SHA256SUMS.txt\`. In the folder you downloaded the installer to, run:`,
    verify2: 'and compare the hash with the one in that release\'s `SHA256SUMS.txt`. You can also search for the same hash on [VirusTotal](https://www.virustotal.com/gui/home/search) to see scan results for that exact file.',
    addTitle: 'Add a device',
    addText: 'Open **Add device**. Devices Battery Hub recognises are marked **Supported**: just click **Add**. For any other device, click **Set up**:',
    steps: [
      'Start the 30-second scan.',
      'Turn the device off and on while it scans. Many wireless devices only report their battery when they power up.',
      'Pick the value that matches your current battery level.',
      'If the device uses a different scale, enter your real level and Battery Hub converts it from then on.',
    ],
    dashTitle: 'The dashboard',
    dashText: 'Each card shows the level with a green, yellow or red ring, whether it\'s charging, a history sparkline, the time left and how old the reading is. Click a card for its full history. From the ⋯ menu you can rename a device, change its icon or hide it, and you can drag cards to reorder them. Hidden devices keep their setup, are no longer polled and can be restored at any time.',
    settingsTitle: 'Settings',
    settingsText: 'Language, theme, card density, reduce motion, low-battery level, tray icons, launch at login and refresh interval.',
    devicesText: 'Battery Hub reads the devices below directly, plus any Bluetooth device that reports its battery to Windows. Most other wireless devices can be added with **Set up**.',
    showList: 'Show the full list',
    tested: `Tested on real hardware: VXE NordicMouse, MCHOSE V9 Turbo+, DualSense on USB and Bluetooth, Logitech MX Master 4 over Bluetooth, INZONE Buds on their USB dongle and the ELECOM BlueLED Mouse over Bluetooth. The rest are built from the protocols documented by the projects under [Acknowledgements](#acknowledgements) and checked against those byte layouts, so please [report a device](${REPO}/issues/new?template=device-support.yml) if one misbehaves.`,
    devicesNotes: 'A device connected two ways, such as a controller on its cable and over Bluetooth, shows as one card when both connections report the same Bluetooth address. Reading a PlayStation controller over Bluetooth switches it to its full report mode until it\'s turned off, as Steam and DS4Windows do; a few older games may not see the controller in that mode until it\'s turned off and on.',
    trouble: [
      ['Something isn\'t working.', 'Open **Settings → Help** and press **Run check**. It tests your install, your PC and your devices, tells you where the problem is, and can open a filled-in support request.'],
      ['A device isn\'t recognised.', 'After two scans that find nothing, or three failed reads in a row, a **Send device report** button appears. It opens a filled-in device request on GitHub for you to check and submit.'],
      ['Nothing is captured during a scan.', 'Run it again and turn the device off and on while it runs.'],
      ['"Can\'t read this device\'s battery."', 'Some devices block battery requests in their driver and can\'t be read.'],
      ['MCHOSE V9 Turbo+ says "needs Python + hid module".', 'This headset is read through Python. Install [Python](https://www.python.org/downloads/), then run `pip install hidapi`.'],
      ['Logs', 'are written to `%APPDATA%\\battery-hub\\battery-hub.log`.'],
    ],
    privacy: 'Battery Hub runs entirely on your PC and collects nothing. It goes online only to reach GitHub: to check for and download updates, and for the version check in **Settings → Help**. Device reports and support requests open a filled-in GitHub form in your browser, and nothing is sent until you submit it yourself. Battery history and settings stay in `%APPDATA%\\battery-hub`.',
    buildReq: 'Requires [Node.js](https://nodejs.org).',
    buildCmds: ['run in development', 'run the tests', 'build the Windows installer into dist/', 'wrap it in the branded installer window'],
    paths: ['Path', 'Purpose', 'Electron main process: device polling, tray, notifications and updates', 'Battery drivers for each device family; `table.js` lists the simple request-and-reply devices', 'The interface and its translations', 'Build tooling, icons and the screenshot (`npx electron scripts/screenshot.js`)'],
    isolated: '`node-hid` runs in a separate utility process, so a driver fault can\'t take the app down.',
    contrib: 'Device requests, translations and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) to get started, [CHANGELOG.md](CHANGELOG.md) for the release history and [SECURITY.md](SECURITY.md) to report a security issue.',
    thanks: 'The device protocols build on the work of these open-source projects, and each driver names its sources:',
    linux: 'the Linux kernel\'s HID drivers',
    support: 'Battery Hub is free and will stay free. If it saved you from a dead mouse mid-game, you can [buy it a coffee](https://buymeacoffee.com/batteryhub). It helps keep the project going and add support for more devices.',
  },

  es: {
    tagline: 'El nivel de batería de todos tus ratones, teclados, auriculares y mandos inalámbricos, en un solo lugar en Windows.',
    download: 'Descargar para Windows',
    alt: { release: 'Última versión', downloads: 'Descargas', license: 'Licencia', platform: 'Plataforma: Windows 10/11', coffee: 'Invítame a un café', shot: 'El panel de Battery Hub con cinco dispositivos, sus anillos de carga, gráficos de historial y estimaciones de tiempo restante' },
    intro: 'Battery Hub lee el nivel de batería de tus dispositivos inalámbricos directamente desde sus receptores, cables y Bluetooth, los muestra en un panel en vivo y en la bandeja del sistema, y te avisa antes de que alguno se quede sin carga. Es gratuito, de código abierto y funciona por completo en tu PC.',
    h: { features: 'Características', install: 'Instalación', start: 'Primeros pasos', devices: 'Dispositivos compatibles', trouble: 'Solución de problemas', privacy: 'Privacidad', build: 'Compilar desde el código fuente', contrib: 'Contribuir', thanks: 'Agradecimientos', support: 'Apoya el proyecto', license: 'Licencia' },
    features: [
      ['Todos tus dispositivos en un lugar', 'ratones, teclados, auriculares y mandos, cada uno con un anillo de carga por colores.'],
      ['Iconos en la bandeja', 'un indicador de batería en vivo para cada dispositivo, junto al reloj.'],
      ['Historial y estimaciones', 'gráficos de 24 horas y 7 días, ritmo de descarga, tiempo restante y la última carga.'],
      ['Avisos de batería baja', 'una notificación de Windows al nivel que elijas, para todos los dispositivos o para cada uno.'],
      ['Sabe cuándo un dispositivo está apagado', 'muestra *En reposo o apagado* en lugar de una lectura antigua.'],
      ['Configuración de dispositivos desconocidos', 'un escaneo de 30 segundos encuentra el nivel de batería de los dispositivos que no se reconocen automáticamente.'],
      ['Seis idiomas', 'English, Español, 简体中文, עברית, Português y Русский.'],
      ['Hecho para Windows 11', 'temas claro y oscuro, un panel en la bandeja, opción para reducir animaciones y actualizaciones automáticas.'],
    ],
    winget: 'Administrador de paquetes de Windows',
    installer: 'Instalador',
    installerText: `Descarga \`Battery-Hub-Installer-x.y.z.exe\` de la [última versión](${REPO}/releases/latest) y ejecútalo. Battery Hub se instala para el usuario actual y no necesita permisos de administrador.`,
    smartscreen: 'El instalador no está firmado digitalmente, así que Windows SmartScreen puede mostrar **"Windows protegió su PC"**. Selecciona **Más información → Ejecutar de todas formas**. Los certificados de firma tienen un coste anual que este proyecto gratuito no puede cubrir.',
    verifyTitle: 'Verificar una descarga',
    verify1: `Cada versión la compila y publica [GitHub Actions](.github/workflows/release.yml) a partir de un commit etiquetado, sin archivos subidos a mano, y cada una incluye un \`SHA256SUMS.txt\`. En la carpeta donde descargaste el instalador, ejecuta:`,
    verify2: 'y compara el hash con el del `SHA256SUMS.txt` de esa versión. También puedes buscar el mismo hash en [VirusTotal](https://www.virustotal.com/gui/home/search) para ver los resultados de análisis de ese archivo exacto.',
    addTitle: 'Añadir un dispositivo',
    addText: 'Abre **Añadir dispositivo**. Los dispositivos que Battery Hub reconoce aparecen como **Compatible**: solo haz clic en **Añadir**. Para cualquier otro, haz clic en **Configurar**:',
    steps: [
      'Inicia el escaneo de 30 segundos.',
      'Apaga y enciende el dispositivo mientras se escanea. Muchos dispositivos inalámbricos solo informan de su batería al encenderse.',
      'Elige el valor que coincide con tu nivel de batería actual.',
      'Si el dispositivo usa otra escala, escribe tu nivel real y Battery Hub lo convertirá a partir de entonces.',
    ],
    dashTitle: 'El panel',
    dashText: 'Cada tarjeta muestra el nivel con un anillo verde, amarillo o rojo, si se está cargando, un gráfico de historial, el tiempo restante y la antigüedad de la lectura. Haz clic en una tarjeta para ver su historial completo. Desde el menú ⋯ puedes cambiar el nombre de un dispositivo, su icono u ocultarlo, y puedes arrastrar las tarjetas para reordenarlas. Los dispositivos ocultos conservan su configuración, dejan de consultarse y se pueden restaurar en cualquier momento.',
    settingsTitle: 'Ajustes',
    settingsText: 'Idioma, tema, densidad de las tarjetas, reducir animaciones, nivel de batería baja, iconos de la bandeja, inicio con Windows e intervalo de actualización.',
    devicesText: 'Battery Hub lee directamente cientos de dispositivos de Logitech, Razer, SteelSeries, HyperX, Corsair, ASUS, Sony, MCHOSE, VXE, ATK, VGN, Redragon y muchas otras marcas, además de los mandos de Xbox, PlayStation, Nintendo, 8BitDo y Flydigi y cualquier dispositivo Bluetooth que informe de su batería a Windows. La mayoría de los demás se pueden añadir con **Configurar**.',
    fullList: `Consulta la [lista completa de dispositivos](README.md#supported-devices) (en inglés) o la del [sitio web](${SITE}). Si un dispositivo no funciona bien, [infórmanos](${REPO}/issues/new?template=device-support.yml).`,
    trouble: [
      ['Algo no funciona.', 'Abre **Ajustes → Ayuda** y pulsa **Comprobar**. Revisa tu instalación, tu PC y tus dispositivos, te dice dónde está el problema y puede abrir una solicitud de soporte ya rellenada.'],
      ['Un dispositivo no se reconoce.', 'Tras dos escaneos sin resultados, o tres lecturas fallidas seguidas, aparece el botón **Enviar informe del dispositivo**. Abre en GitHub una solicitud ya rellenada para que la revises y la envíes.'],
      ['El escaneo no captura nada.', 'Vuelve a ejecutarlo y apaga y enciende el dispositivo mientras se escanea.'],
      ['"No se puede leer la batería de este dispositivo."', 'Algunos dispositivos bloquean las consultas de batería en su controlador y no se pueden leer.'],
      ['MCHOSE V9 Turbo+ muestra "needs Python + hid module".', 'Estos auriculares se leen mediante Python. Instala [Python](https://www.python.org/downloads/) y luego ejecuta `pip install hidapi`.'],
      ['Los registros', 'se guardan en `%APPDATA%\\battery-hub\\battery-hub.log`.'],
    ],
    privacy: 'Battery Hub funciona por completo en tu PC y no recopila nada. Solo se conecta a GitHub: para buscar y descargar actualizaciones, y para la comprobación de versión en **Ajustes → Ayuda**. Los informes de dispositivos y las solicitudes de soporte abren en tu navegador un formulario de GitHub ya rellenado, y no se envía nada hasta que tú lo envíes. El historial de batería y los ajustes se quedan en `%APPDATA%\\battery-hub`.',
    buildReq: 'Necesitas [Node.js](https://nodejs.org).',
    buildCmds: ['ejecutar en modo desarrollo', 'ejecutar las pruebas', 'compilar el instalador de Windows en dist/', 'envolverlo en la ventana del instalador'],
    paths: ['Ruta', 'Uso', 'Proceso principal de Electron: lectura de dispositivos, bandeja, notificaciones y actualizaciones', 'Controladores de batería de cada familia de dispositivos; `table.js` reúne los dispositivos de pregunta y respuesta simples', 'La interfaz y sus traducciones', 'Herramientas de compilación, iconos y la captura de pantalla (`npx electron scripts/screenshot.js`)'],
    isolated: '`node-hid` se ejecuta en un proceso aparte, así que un fallo de un controlador no puede cerrar la aplicación.',
    contrib: 'Se agradecen las solicitudes de dispositivos, las traducciones y los pull requests. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para empezar, [CHANGELOG.md](CHANGELOG.md) para el historial de versiones y [SECURITY.md](SECURITY.md) para informar de un problema de seguridad.',
    thanks: 'Los protocolos de los dispositivos se basan en el trabajo de estos proyectos de código abierto, y cada controlador cita sus fuentes:',
    linux: 'los controladores HID del kernel de Linux',
    support: 'Battery Hub es gratuito y lo seguirá siendo. Si te salvó de quedarte sin ratón en plena partida, puedes [invitarle a un café](https://buymeacoffee.com/batteryhub). Ayuda a mantener el proyecto y a añadir más dispositivos.',
  },

  zh: {
    tagline: '在 Windows 上集中查看所有无线鼠标、键盘、耳机和手柄的电量。',
    download: '下载 Windows 版',
    alt: { release: '最新版本', downloads: '下载量', license: '许可证', platform: '平台：Windows 10/11', coffee: '请我喝杯咖啡', shot: 'Battery Hub 仪表板，显示五个设备的电量环、历史曲线和剩余时间估计' },
    intro: 'Battery Hub 直接从接收器、数据线和蓝牙读取无线设备的电量，在实时仪表板和系统托盘中显示，并在设备电量耗尽前提醒你。它免费、开源，并且完全在你的电脑上运行。',
    h: { features: '功能', install: '安装', start: '快速上手', devices: '支持的设备', trouble: '故障排除', privacy: '隐私', build: '从源代码构建', contrib: '参与贡献', thanks: '致谢', support: '支持本项目', license: '许可证' },
    features: [
      ['所有设备一目了然', '鼠标、键盘、耳机和手柄，每个都有按颜色区分的电量环。'],
      ['托盘图标', '每个设备都有一个实时电量图标，显示在时钟旁边。'],
      ['历史与估计', '24 小时和 7 天图表、耗电速度、剩余时间以及上次充电时间。'],
      ['低电量提醒', '在你设定的电量时弹出 Windows 通知，可统一设置或为每个设备单独设置。'],
      ['识别设备已关闭', '显示*休眠或已关闭*，而不是旧的读数。'],
      ['未知设备设置', '30 秒扫描即可找到无法自动识别的设备的电量。'],
      ['六种语言', 'English、Español、简体中文、עברית、Português 和 Русский。'],
      ['为 Windows 11 打造', '浅色和深色主题、托盘弹出窗口、减少动画选项以及自动更新。'],
    ],
    winget: 'Windows 程序包管理器',
    installer: '安装程序',
    installerText: `从[最新版本](${REPO}/releases/latest)下载 \`Battery-Hub-Installer-x.y.z.exe\` 并运行。Battery Hub 为当前用户安装，无需管理员权限。`,
    smartscreen: '安装程序没有代码签名，因此 Windows SmartScreen 可能会显示 **"Windows 已保护你的电脑"**。请选择 **更多信息 → 仍要运行**。签名证书需要每年付费，而这个免费项目无力承担。',
    verifyTitle: '验证下载',
    verify1: `每个版本都由 [GitHub Actions](.github/workflows/release.yml) 从带标签的提交自动构建和发布，不会手动上传任何文件，并附带 \`SHA256SUMS.txt\`。在下载安装程序的文件夹中运行：`,
    verify2: '然后将结果与该版本 `SHA256SUMS.txt` 中的哈希值进行比较。你也可以在 [VirusTotal](https://www.virustotal.com/gui/home/search) 上搜索同一个哈希值，查看该文件的扫描结果。',
    addTitle: '添加设备',
    addText: '打开 **添加设备**。Battery Hub 能识别的设备会标记为 **已支持**：直接点击 **添加** 即可。其他设备请点击 **设置**：',
    steps: [
      '开始 30 秒扫描。',
      '扫描期间将设备关闭再打开。许多无线设备只在开机时报告电量。',
      '选择与当前电量相符的数值。',
      '如果设备使用不同的刻度，输入实际电量，Battery Hub 之后会自动换算。',
    ],
    dashTitle: '仪表板',
    dashText: '每张卡片显示电量和绿色、黄色或红色的电量环、是否正在充电、历史曲线、剩余时间以及读数的新旧。点击卡片可查看完整历史。在 ⋯ 菜单中可以重命名设备、更换图标或隐藏设备，也可以拖动卡片调整顺序。隐藏的设备会保留设置、停止轮询，并可随时恢复。',
    settingsTitle: '设置',
    settingsText: '语言、主题、卡片密度、减少动画、低电量阈值、托盘图标、开机启动和刷新间隔。',
    devicesText: 'Battery Hub 可直接读取罗技、雷蛇、赛睿、HyperX、海盗船、华硕、索尼、迈从 (MCHOSE)、VXE、ATK、VGN、红龙 (Redragon) 等众多品牌的数百款设备，以及 Xbox、PlayStation、任天堂、8BitDo 和飞智手柄，还有任何向 Windows 报告电量的蓝牙设备。大多数其他设备可以通过 **设置** 添加。',
    fullList: `查看[完整设备列表](README.md#supported-devices)（英文）或[网站](${SITE})上的列表。如果某个设备工作不正常，请[告诉我们](${REPO}/issues/new?template=device-support.yml)。`,
    trouble: [
      ['出现问题。', '打开 **设置 → 帮助** 并点击 **开始检查**。它会检查安装、电脑和设备，告诉你问题所在，并可打开一份已填好的支持请求。'],
      ['设备无法识别。', '两次扫描都没有结果，或连续三次读取失败后，会出现 **发送设备报告** 按钮。它会在 GitHub 上打开一份已填好的设备请求，供你检查后提交。'],
      ['扫描没有捕获到任何内容。', '重新扫描，并在扫描时将设备关闭再打开。'],
      ['"无法读取此设备的电量。"', '有些设备在驱动层面阻止电量查询，无法读取。'],
      ['MCHOSE V9 Turbo+ 显示 "needs Python + hid module"。', '这款耳机通过 Python 读取。请安装 [Python](https://www.python.org/downloads/)，然后运行 `pip install hidapi`。'],
      ['日志', '保存在 `%APPDATA%\\battery-hub\\battery-hub.log`。'],
    ],
    privacy: 'Battery Hub 完全在你的电脑上运行，不收集任何数据。它只连接 GitHub：检查和下载更新，以及 **设置 → 帮助** 中的版本检查。设备报告和支持请求会在浏览器中打开一份已填好的 GitHub 表单，在你亲自提交之前不会发送任何内容。电量历史和设置保存在 `%APPDATA%\\battery-hub`。',
    buildReq: '需要 [Node.js](https://nodejs.org)。',
    buildCmds: ['以开发模式运行', '运行测试', '将 Windows 安装程序构建到 dist/', '封装为带品牌界面的安装程序'],
    paths: ['路径', '用途', 'Electron 主进程：设备轮询、托盘、通知和更新', '各设备系列的电量驱动；`table.js` 列出简单的请求-应答设备', '界面及其翻译', '构建工具、图标和截图（`npx electron scripts/screenshot.js`）'],
    isolated: '`node-hid` 在独立的工具进程中运行，驱动出错也不会导致应用崩溃。',
    contrib: '欢迎提交设备请求、翻译和拉取请求。请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何开始，[CHANGELOG.md](CHANGELOG.md) 查看版本历史，[SECURITY.md](SECURITY.md) 报告安全问题。',
    thanks: '设备协议建立在以下开源项目的成果之上，每个驱动都注明了其来源：',
    linux: 'Linux 内核的 HID 驱动',
    support: 'Battery Hub 是免费的，并将一直免费。如果它让你免于在游戏中途鼠标没电，可以[请它喝杯咖啡](https://buymeacoffee.com/batteryhub)。这有助于项目持续发展并支持更多设备。',
  },

  he: {
    rtl: true,
    tagline: 'רמת הסוללה של כל העכברים, המקלדות, האוזניות והשלטים האלחוטיים שלכם, במקום אחד ב-Windows.',
    download: 'הורדה ל-Windows',
    alt: { release: 'הגרסה האחרונה', downloads: 'הורדות', license: 'רישיון', platform: 'פלטפורמה: Windows 10/11', coffee: 'קנו לי קפה', shot: 'לוח הבקרה של Battery Hub עם חמישה מכשירים, טבעות טעינה, גרפי היסטוריה והערכות זמן שנותר' },
    intro: 'Battery Hub קורא את רמת הסוללה של המכשירים האלחוטיים שלכם ישירות מהמקלטים, מהכבלים ומ-Bluetooth, מציג אותם בלוח בקרה חי ובמגש המערכת, ומזהיר אתכם לפני שמשהו נכבה. הוא חינמי, בקוד פתוח ופועל כולו על המחשב שלכם.',
    h: { features: 'תכונות', install: 'התקנה', start: 'צעדים ראשונים', devices: 'מכשירים נתמכים', trouble: 'פתרון בעיות', privacy: 'פרטיות', build: 'בנייה מקוד המקור', contrib: 'תרומה לפרויקט', thanks: 'תודות', support: 'תמיכה בפרויקט', license: 'רישיון' },
    features: [
      ['כל המכשירים במקום אחד', 'עכברים, מקלדות, אוזניות ושלטים, לכל אחד טבעת טעינה צבעונית.'],
      ['סמלים במגש המערכת', 'מחוון סוללה חי לכל מכשיר, ליד השעון.'],
      ['היסטוריה והערכות', 'גרפים של 24 שעות ו-7 ימים, קצב פריקה, זמן שנותר ומתי נטען לאחרונה.'],
      ['התראות על סוללה חלשה', 'התראה של Windows ברמה שתבחרו, לכל המכשירים או לכל מכשיר בנפרד.'],
      ['יודע כשמכשיר כבוי', 'מציג *במנוחה או כבוי* במקום קריאה ישנה.'],
      ['הגדרה למכשירים לא מוכרים', 'סריקה של 30 שניות מוצאת את רמת הסוללה של מכשירים שלא מזוהים אוטומטית.'],
      ['שש שפות', 'English, Español, 简体中文, עברית, Português ו-Русский.'],
      ['נבנה עבור Windows 11', 'ערכות נושא בהירה וכהה, חלונית במגש, אפשרות להפחתת אנימציות ועדכונים אוטומטיים.'],
    ],
    winget: 'מנהל החבילות של Windows',
    installer: 'קובץ התקנה',
    installerText: `הורידו את \`Battery-Hub-Installer-x.y.z.exe\` [מהגרסה האחרונה](${REPO}/releases/latest) והפעילו אותו. Battery Hub מותקן עבור המשתמש הנוכחי ולא דורש הרשאות מנהל.`,
    smartscreen: 'קובץ ההתקנה לא חתום דיגיטלית, ולכן Windows SmartScreen עשוי להציג **"Windows הגן על המחשב שלך"**. בחרו **מידע נוסף ← הפעל בכל זאת**. אישורי חתימה עולים תשלום שנתי שהפרויקט החינמי הזה לא יכול לממן.',
    verifyTitle: 'אימות ההורדה',
    verify1: `כל גרסה נבנית ומתפרסמת על ידי [GitHub Actions](.github/workflows/release.yml) מתוך commit מתויג, בלי קבצים שהועלו ידנית, וכל אחת כוללת \`SHA256SUMS.txt\`. בתיקייה שאליה הורדתם את קובץ ההתקנה, הריצו:`,
    verify2: 'והשוו את התוצאה לערך שב-`SHA256SUMS.txt` של אותה גרסה. אפשר גם לחפש את אותו ערך ב-[VirusTotal](https://www.virustotal.com/gui/home/search) כדי לראות תוצאות סריקה של הקובץ הזה בדיוק.',
    addTitle: 'הוספת מכשיר',
    addText: 'פתחו את **הוספת מכשיר**. מכשירים ש-Battery Hub מזהה מסומנים **נתמך**: פשוט לחצו **הוספה**. לכל מכשיר אחר, לחצו **הגדרה**:',
    steps: [
      'התחילו את הסריקה של 30 שניות.',
      'כבו והדליקו את המכשיר בזמן הסריקה. מכשירים אלחוטיים רבים מדווחים על הסוללה רק כשהם נדלקים.',
      'בחרו את הערך שמתאים לרמת הסוללה הנוכחית.',
      'אם המכשיר משתמש בסולם אחר, הזינו את הרמה האמיתית ו-Battery Hub ימיר אותה מעכשיו והלאה.',
    ],
    dashTitle: 'לוח הבקרה',
    dashText: 'כל כרטיס מציג את הרמה עם טבעת ירוקה, צהובה או אדומה, אם המכשיר בטעינה, גרף היסטוריה, הזמן שנותר ומתי נקרא לאחרונה. לחצו על כרטיס כדי לראות את ההיסטוריה המלאה. מתפריט ⋯ אפשר לשנות שם של מכשיר, להחליף את הסמל שלו או להסתיר אותו, ואפשר לגרור כרטיסים כדי לשנות את הסדר. מכשירים מוסתרים שומרים על ההגדרה שלהם, לא נקראים יותר ואפשר להחזיר אותם בכל עת.',
    settingsTitle: 'הגדרות',
    settingsText: 'שפה, ערכת נושא, צפיפות כרטיסים, הפחתת אנימציות, רמת סוללה חלשה, סמלים במגש, הפעלה עם Windows ותדירות רענון.',
    devicesText: 'Battery Hub קורא ישירות מאות מכשירים של Logitech, Razer, SteelSeries, HyperX, Corsair, ASUS, Sony, MCHOSE, VXE, ATK, VGN, Redragon ומותגים רבים נוספים, וגם שלטים של Xbox, PlayStation, Nintendo, 8BitDo ו-Flydigi, וכל מכשיר Bluetooth שמדווח על הסוללה שלו ל-Windows. את רוב המכשירים האחרים אפשר להוסיף עם **הגדרה**.',
    fullList: `ראו את [רשימת המכשירים המלאה](README.md#supported-devices) (באנגלית) או את הרשימה [באתר](${SITE}). אם מכשיר לא עובד כמו שצריך, [ספרו לנו](${REPO}/issues/new?template=device-support.yml).`,
    trouble: [
      ['משהו לא עובד.', 'פתחו **הגדרות ← עזרה** ולחצו **הפעלת בדיקה**. הבדיקה בודקת את ההתקנה, את המחשב ואת המכשירים, אומרת איפה הבעיה ויכולה לפתוח בקשת תמיכה ממולאת.'],
      ['מכשיר לא מזוהה.', 'אחרי שתי סריקות בלי תוצאה, או שלוש קריאות שנכשלו ברצף, מופיע הכפתור **שליחת דוח מכשיר**. הוא פותח ב-GitHub בקשה ממולאת לבדיקה ולשליחה שלכם.'],
      ['הסריקה לא קלטה כלום.', 'הריצו אותה שוב, וכבו והדליקו את המכשיר בזמן הסריקה.'],
      ['"לא ניתן לקרוא את הסוללה של המכשיר הזה."', 'חלק מהמכשירים חוסמים בקשות סוללה בדרייבר שלהם ואי אפשר לקרוא אותם.'],
      ['MCHOSE V9 Turbo+ מציג "needs Python + hid module".', 'האוזניות האלה נקראות דרך Python. התקינו [Python](https://www.python.org/downloads/) והריצו `pip install hidapi`.'],
      ['יומנים', 'נשמרים ב-`%APPDATA%\\battery-hub\\battery-hub.log`.'],
    ],
    privacy: 'Battery Hub פועל כולו על המחשב שלכם ולא אוסף שום מידע. הוא מתחבר לאינטרנט רק אל GitHub: כדי לבדוק ולהוריד עדכונים, ולבדיקת הגרסה ב**הגדרות ← עזרה**. דוחות מכשיר ובקשות תמיכה פותחים בדפדפן טופס GitHub ממולא, ושום דבר לא נשלח עד שתשלחו אותו בעצמכם. היסטוריית הסוללה וההגדרות נשמרות ב-`%APPDATA%\\battery-hub`.',
    buildReq: 'נדרש [Node.js](https://nodejs.org).',
    buildCmds: ['run in development', 'run the tests', 'build the Windows installer into dist/', 'wrap it in the branded installer window'],
    paths: ['נתיב', 'תפקיד', 'התהליך הראשי של Electron: קריאת מכשירים, מגש, התראות ועדכונים', 'דרייברי סוללה לכל משפחת מכשירים; `table.js` מרכז את המכשירים עם בקשה ותשובה פשוטות', 'הממשק והתרגומים שלו', 'כלי בנייה, סמלים וצילום המסך (`npx electron scripts/screenshot.js`)'],
    isolated: '`node-hid` רץ בתהליך נפרד, כך שתקלה בדרייבר לא יכולה להפיל את האפליקציה.',
    contrib: 'בקשות למכשירים, תרגומים ו-pull requests יתקבלו בברכה. ראו [CONTRIBUTING.md](CONTRIBUTING.md) כדי להתחיל, [CHANGELOG.md](CHANGELOG.md) להיסטוריית הגרסאות ו-[SECURITY.md](SECURITY.md) לדיווח על בעיית אבטחה.',
    thanks: 'פרוטוקולי המכשירים מבוססים על העבודה של פרויקטי הקוד הפתוח האלה, וכל דרייבר מציין את המקורות שלו:',
    linux: 'דרייברי ה-HID של ליבת Linux',
    support: 'Battery Hub חינמי ויישאר חינמי. אם הוא הציל אתכם מעכבר שנכבה באמצע משחק, אפשר [לקנות לו קפה](https://buymeacoffee.com/batteryhub). זה עוזר להמשיך את הפרויקט ולהוסיף תמיכה במכשירים נוספים.',
  },

  pt: {
    tagline: 'O nível de bateria de todos os seus mouses, teclados, headsets e controles sem fio, em um só lugar no Windows.',
    download: 'Baixar para Windows',
    alt: { release: 'Última versão', downloads: 'Downloads', license: 'Licença', platform: 'Plataforma: Windows 10/11', coffee: 'Pague um café', shot: 'O painel do Battery Hub com cinco dispositivos, seus anéis de carga, gráficos de histórico e estimativas de tempo restante' },
    intro: 'O Battery Hub lê o nível de bateria dos seus dispositivos sem fio direto dos receptores, cabos e Bluetooth, mostra tudo em um painel ao vivo e na bandeja do sistema, e avisa antes que algum fique sem carga. É gratuito, de código aberto e roda inteiramente no seu PC.',
    h: { features: 'Recursos', install: 'Instalação', start: 'Primeiros passos', devices: 'Dispositivos compatíveis', trouble: 'Solução de problemas', privacy: 'Privacidade', build: 'Compilar a partir do código-fonte', contrib: 'Como contribuir', thanks: 'Agradecimentos', support: 'Apoie o projeto', license: 'Licença' },
    features: [
      ['Todos os dispositivos em um só lugar', 'mouses, teclados, headsets e controles, cada um com um anel de carga colorido.'],
      ['Ícones na bandeja', 'um indicador de bateria ao vivo para cada dispositivo, ao lado do relógio.'],
      ['Histórico e estimativas', 'gráficos de 24 horas e 7 dias, ritmo de descarga, tempo restante e a última recarga.'],
      ['Alertas de bateria fraca', 'uma notificação do Windows no nível que você escolher, para todos os dispositivos ou para cada um.'],
      ['Sabe quando um dispositivo está desligado', 'mostra *Em repouso ou desligado* em vez de uma leitura antiga.'],
      ['Configuração de dispositivos desconhecidos', 'uma busca de 30 segundos encontra o nível de bateria dos dispositivos que não são reconhecidos automaticamente.'],
      ['Seis idiomas', 'English, Español, 简体中文, עברית, Português e Русский.'],
      ['Feito para o Windows 11', 'temas claro e escuro, painel na bandeja, opção de reduzir animações e atualizações automáticas.'],
    ],
    winget: 'Gerenciador de Pacotes do Windows',
    installer: 'Instalador',
    installerText: `Baixe \`Battery-Hub-Installer-x.y.z.exe\` da [versão mais recente](${REPO}/releases/latest) e execute. O Battery Hub é instalado para o usuário atual e não precisa de permissões de administrador.`,
    smartscreen: 'O instalador não tem assinatura digital, então o Windows SmartScreen pode mostrar **"O Windows protegeu o computador"**. Selecione **Mais informações → Executar assim mesmo**. Certificados de assinatura têm um custo anual que este projeto gratuito não consegue pagar.',
    verifyTitle: 'Verificar um download',
    verify1: `Cada versão é compilada e publicada pelo [GitHub Actions](.github/workflows/release.yml) a partir de um commit com tag, sem arquivos enviados manualmente, e cada uma inclui um \`SHA256SUMS.txt\`. Na pasta para onde você baixou o instalador, execute:`,
    verify2: 'e compare o hash com o do `SHA256SUMS.txt` dessa versão. Você também pode pesquisar o mesmo hash no [VirusTotal](https://www.virustotal.com/gui/home/search) para ver os resultados de verificação desse arquivo exato.',
    addTitle: 'Adicionar um dispositivo',
    addText: 'Abra **Adicionar dispositivo**. Os dispositivos que o Battery Hub reconhece aparecem como **Compatível**: basta clicar em **Adicionar**. Para qualquer outro, clique em **Configurar**:',
    steps: [
      'Inicie a busca de 30 segundos.',
      'Desligue e ligue o dispositivo durante a busca. Muitos dispositivos sem fio só informam a bateria ao ligar.',
      'Escolha o valor que corresponde ao nível de bateria atual.',
      'Se o dispositivo usar outra escala, digite o nível real e o Battery Hub fará a conversão a partir daí.',
    ],
    dashTitle: 'O painel',
    dashText: 'Cada cartão mostra o nível com um anel verde, amarelo ou vermelho, se está carregando, um gráfico de histórico, o tempo restante e a idade da leitura. Clique em um cartão para ver o histórico completo. No menu ⋯ você pode renomear um dispositivo, trocar o ícone ou ocultá-lo, e pode arrastar os cartões para reorganizá-los. Dispositivos ocultos mantêm a configuração, deixam de ser consultados e podem ser restaurados a qualquer momento.',
    settingsTitle: 'Configurações',
    settingsText: 'Idioma, tema, densidade dos cartões, reduzir animações, nível de bateria fraca, ícones na bandeja, iniciar com o Windows e intervalo de atualização.',
    devicesText: 'O Battery Hub lê diretamente centenas de dispositivos da Logitech, Razer, SteelSeries, HyperX, Corsair, ASUS, Sony, MCHOSE, VXE, ATK, VGN, Redragon e muitas outras marcas, além de controles de Xbox, PlayStation, Nintendo, 8BitDo e Flydigi e qualquer dispositivo Bluetooth que informe a bateria ao Windows. A maioria dos outros pode ser adicionada com **Configurar**.',
    fullList: `Veja a [lista completa de dispositivos](README.md#supported-devices) (em inglês) ou a do [site](${SITE}). Se um dispositivo não funcionar direito, [avise-nos](${REPO}/issues/new?template=device-support.yml).`,
    trouble: [
      ['Algo não está funcionando.', 'Abra **Configurações → Ajuda** e clique em **Verificar**. Ele testa a instalação, o PC e os dispositivos, mostra onde está o problema e pode abrir um pedido de suporte já preenchido.'],
      ['Um dispositivo não é reconhecido.', 'Depois de duas buscas sem resultado, ou três leituras com falha seguidas, aparece o botão **Enviar relatório do dispositivo**. Ele abre no GitHub um pedido já preenchido para você revisar e enviar.'],
      ['A busca não captura nada.', 'Execute de novo e desligue e ligue o dispositivo durante a busca.'],
      ['"Não é possível ler a bateria deste dispositivo."', 'Alguns dispositivos bloqueiam as consultas de bateria no driver e não podem ser lidos.'],
      ['O MCHOSE V9 Turbo+ mostra "needs Python + hid module".', 'Este headset é lido via Python. Instale o [Python](https://www.python.org/downloads/) e depois execute `pip install hidapi`.'],
      ['Os logs', 'são gravados em `%APPDATA%\\battery-hub\\battery-hub.log`.'],
    ],
    privacy: 'O Battery Hub roda inteiramente no seu PC e não coleta nada. Ele só se conecta ao GitHub: para procurar e baixar atualizações, e para a verificação de versão em **Configurações → Ajuda**. Relatórios de dispositivos e pedidos de suporte abrem no navegador um formulário do GitHub já preenchido, e nada é enviado até que você mesmo envie. O histórico de bateria e as configurações ficam em `%APPDATA%\\battery-hub`.',
    buildReq: 'Requer [Node.js](https://nodejs.org).',
    buildCmds: ['executar em modo de desenvolvimento', 'executar os testes', 'gerar o instalador do Windows em dist/', 'empacotá-lo na janela do instalador'],
    paths: ['Caminho', 'Função', 'Processo principal do Electron: leitura dos dispositivos, bandeja, notificações e atualizações', 'Drivers de bateria de cada família de dispositivos; `table.js` reúne os dispositivos de pergunta e resposta simples', 'A interface e suas traduções', 'Ferramentas de build, ícones e a captura de tela (`npx electron scripts/screenshot.js`)'],
    isolated: 'O `node-hid` roda em um processo separado, então uma falha de driver não derruba o aplicativo.',
    contrib: 'Pedidos de dispositivos, traduções e pull requests são bem-vindos. Veja [CONTRIBUTING.md](CONTRIBUTING.md) para começar, [CHANGELOG.md](CHANGELOG.md) para o histórico de versões e [SECURITY.md](SECURITY.md) para relatar um problema de segurança.',
    thanks: 'Os protocolos dos dispositivos se baseiam no trabalho destes projetos de código aberto, e cada driver cita suas fontes:',
    linux: 'os drivers HID do kernel Linux',
    support: 'O Battery Hub é gratuito e vai continuar sendo. Se ele te salvou de um mouse descarregado no meio da partida, você pode [pagar um café](https://buymeacoffee.com/batteryhub). Isso ajuda a manter o projeto e a adicionar mais dispositivos.',
  },

  ru: {
    tagline: 'Заряд всех ваших беспроводных мышей, клавиатур, гарнитур и геймпадов в одном месте в Windows.',
    download: 'Скачать для Windows',
    alt: { release: 'Последний релиз', downloads: 'Загрузки', license: 'Лицензия', platform: 'Платформа: Windows 10/11', coffee: 'Угостить кофе', shot: 'Панель Battery Hub с пятью устройствами, индикаторами заряда, графиками истории и прогнозом оставшегося времени' },
    intro: 'Battery Hub считывает уровень заряда беспроводных устройств напрямую через их приёмники, кабели и Bluetooth, показывает его на единой панели и в области уведомлений и предупреждает, пока что-нибудь не разрядилось. Приложение бесплатное, с открытым исходным кодом и работает полностью на вашем компьютере.',
    h: { features: 'Возможности', install: 'Установка', start: 'Начало работы', devices: 'Поддерживаемые устройства', trouble: 'Устранение неполадок', privacy: 'Конфиденциальность', build: 'Сборка из исходного кода', contrib: 'Участие в разработке', thanks: 'Благодарности', support: 'Поддержать проект', license: 'Лицензия' },
    features: [
      ['Все устройства в одном месте', 'мыши, клавиатуры, гарнитуры и геймпады, у каждого цветной индикатор заряда.'],
      ['Значки в области уведомлений', 'живой индикатор заряда для каждого устройства рядом с часами.'],
      ['История и прогнозы', 'графики за 24 часа и 7 дней, скорость разряда, оставшееся время и время последней зарядки.'],
      ['Уведомления о низком заряде', 'уведомление Windows на выбранном вами уровне, для всех устройств сразу или для каждого отдельно.'],
      ['Понимает, когда устройство выключено', 'показывает *Спит или выключено* вместо устаревших данных.'],
      ['Настройка неизвестных устройств', '30-секундное сканирование находит уровень заряда устройств, которые не распознаются автоматически.'],
      ['Шесть языков', 'English, Español, 简体中文, עברית, Português и Русский.'],
      ['Создано для Windows 11', 'светлая и тёмная темы, всплывающее окно в трее, уменьшение анимации и автоматические обновления.'],
    ],
    winget: 'Диспетчер пакетов Windows',
    installer: 'Установщик',
    installerText: `Скачайте \`Battery-Hub-Installer-x.y.z.exe\` из [последнего релиза](${REPO}/releases/latest) и запустите его. Battery Hub устанавливается для текущего пользователя и не требует прав администратора.`,
    smartscreen: 'Установщик не подписан цифровой подписью, поэтому Windows SmartScreen может показать **«Система Windows защитила ваш компьютер»**. Выберите **Подробнее → Выполнить в любом случае**. Сертификаты подписи стоят ежегодной платы, которую этот бесплатный проект не может себе позволить.',
    verifyTitle: 'Проверка загруженного файла',
    verify1: `Каждый релиз собирается и публикуется через [GitHub Actions](.github/workflows/release.yml) из коммита с тегом, без ручной загрузки файлов, и содержит \`SHA256SUMS.txt\`. В папке, куда вы скачали установщик, выполните:`,
    verify2: 'и сравните результат с хешем в `SHA256SUMS.txt` этого релиза. Тот же хеш можно найти на [VirusTotal](https://www.virustotal.com/gui/home/search), чтобы посмотреть результаты проверки именно этого файла.',
    addTitle: 'Добавление устройства',
    addText: 'Откройте **Добавить устройство**. Устройства, которые Battery Hub распознаёт, отмечены как **Поддерживается**: просто нажмите **Добавить**. Для любого другого устройства нажмите **Настроить**:',
    steps: [
      'Запустите 30-секундное сканирование.',
      'Выключите и включите устройство во время сканирования. Многие беспроводные устройства сообщают заряд только при включении.',
      'Выберите значение, которое совпадает с текущим уровнем заряда.',
      'Если устройство использует другую шкалу, введите реальный уровень, и дальше Battery Hub будет пересчитывать его сам.',
    ],
    dashTitle: 'Панель',
    dashText: 'Каждая карточка показывает уровень заряда с зелёным, жёлтым или красным кольцом, идёт ли зарядка, график истории, оставшееся время и давность показаний. Нажмите на карточку, чтобы увидеть полную историю. В меню ⋯ можно переименовать устройство, сменить его значок или скрыть его, а карточки можно перетаскивать, чтобы изменить порядок. Скрытые устройства сохраняют настройку, больше не опрашиваются и могут быть восстановлены в любой момент.',
    settingsTitle: 'Настройки',
    settingsText: 'Язык, тема, плотность карточек, уменьшение анимации, уровень низкого заряда, значки в трее, запуск при входе в систему и интервал обновления.',
    devicesText: 'Battery Hub напрямую считывает сотни устройств Logitech, Razer, SteelSeries, HyperX, Corsair, ASUS, Sony, MCHOSE, VXE, ATK, VGN, Redragon и многих других брендов, а также геймпады Xbox, PlayStation, Nintendo, 8BitDo и Flydigi и любые Bluetooth-устройства, которые сообщают заряд Windows. Большинство остальных устройств можно добавить через **Настроить**.',
    fullList: `Смотрите [полный список устройств](README.md#supported-devices) (на английском) или список [на сайте](${SITE}). Если устройство работает неправильно, [сообщите нам](${REPO}/issues/new?template=device-support.yml).`,
    trouble: [
      ['Что-то не работает.', 'Откройте **Настройки → Помощь** и нажмите **Запустить проверку**. Она проверит установку, компьютер и устройства, покажет, в чём проблема, и может открыть заполненный запрос в поддержку.'],
      ['Устройство не распознаётся.', 'После двух сканирований без результата или трёх неудачных чтений подряд появляется кнопка **Отправить отчёт об устройстве**. Она открывает на GitHub заполненный запрос, который вы можете проверить и отправить.'],
      ['Сканирование ничего не находит.', 'Запустите его снова и выключите и включите устройство во время сканирования.'],
      ['«Не удаётся прочитать заряд этого устройства».', 'Некоторые устройства блокируют запросы заряда на уровне драйвера, и прочитать их нельзя.'],
      ['MCHOSE V9 Turbo+ показывает «needs Python + hid module».', 'Заряд этой гарнитуры считывается через Python. Установите [Python](https://www.python.org/downloads/), затем выполните `pip install hidapi`.'],
      ['Журналы', 'сохраняются в `%APPDATA%\\battery-hub\\battery-hub.log`.'],
    ],
    privacy: 'Battery Hub работает полностью на вашем компьютере и ничего не собирает. В интернет он выходит только к GitHub: чтобы проверить и скачать обновления и для проверки версии в **Настройки → Помощь**. Отчёты об устройствах и запросы в поддержку открывают в браузере заполненную форму GitHub, и ничего не отправляется, пока вы сами её не отправите. История заряда и настройки хранятся в `%APPDATA%\\battery-hub`.',
    buildReq: 'Требуется [Node.js](https://nodejs.org).',
    buildCmds: ['запуск в режиме разработки', 'запуск тестов', 'сборка установщика Windows в dist/', 'упаковка в фирменное окно установщика'],
    paths: ['Путь', 'Назначение', 'Главный процесс Electron: опрос устройств, трей, уведомления и обновления', 'Драйверы заряда для каждого семейства устройств; `table.js` содержит устройства с простым запросом и ответом', 'Интерфейс и его переводы', 'Инструменты сборки, значки и снимок экрана (`npx electron scripts/screenshot.js`)'],
    isolated: '`node-hid` работает в отдельном процессе, поэтому сбой драйвера не может уронить приложение.',
    contrib: 'Запросы на поддержку устройств, переводы и pull request-ы приветствуются. Смотрите [CONTRIBUTING.md](CONTRIBUTING.md), чтобы начать, [CHANGELOG.md](CHANGELOG.md) с историей релизов и [SECURITY.md](SECURITY.md), чтобы сообщить о проблеме безопасности.',
    thanks: 'Протоколы устройств основаны на работе этих проектов с открытым исходным кодом, и каждый драйвер указывает свои источники:',
    linux: 'HID-драйверы ядра Linux',
    support: 'Battery Hub бесплатен и останется бесплатным. Если он спас вас от разряженной мыши посреди игры, можно [угостить его кофе](https://buymeacoffee.com/batteryhub). Это помогает развивать проект и добавлять поддержку новых устройств.',
  },
};

// The build commands keep English comments in Hebrew: mixed-direction code is unreadable otherwise.
const PROJECTS = [
  ['HeadsetControl', 'https://github.com/Sapd/HeadsetControl'],
  ['OpenRazer', 'https://github.com/openrazer/openrazer'],
  ['rivalcfg', 'https://github.com/flozz/rivalcfg'],
  ['openinzone', 'https://github.com/penguinwokrs/openinzone'],
  ['SDL', 'https://github.com/libsdl-org/SDL'],
  ['OpenLinkHub', 'https://github.com/jurkovic-nikola/OpenLinkHub'],
  ['HaloBattery', 'https://github.com/HeyOkay/HaloBattery'],
];

// Buttons drawn here instead of shields.io: its badges space Hebrew letters apart, and fixed-width
// buttons line up. Kept in .github/readme so they ship neither in the app nor on the website.
const ART = '.github/readme';
const FONT = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans', Helvetica, Arial, sans-serif";
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function langSvg(name, active, rtl) {
  const fill = active ? '#0B7B7C' : '#30363D';
  const stroke = active ? '#0B7B7C' : '#484F58';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="116" height="34" viewBox="0 0 116 34" role="img" aria-label="${esc(name)}">
  <rect x="0.5" y="0.5" width="115" height="33" rx="7" fill="${fill}" stroke="${stroke}"/>
  <text x="58" y="22" text-anchor="middle"${rtl ? ' direction="rtl"' : ''} font-family="${FONT}" font-size="14" font-weight="600" fill="#FFFFFF">${esc(name)}</text>
</svg>
`;
}
function downloadSvg(text, rtl) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="44" viewBox="0 0 250 44" role="img" aria-label="${esc(text)}">
  <rect width="250" height="44" rx="9" fill="#2FD5A0"/>
  <g transform="translate(22 13)" fill="none" stroke="#011C28" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 0v11M4.5 7 9 11.5 13.5 7M1 15.5v1.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-1.5"/>
  </g>
  <text x="137" y="28" text-anchor="middle"${rtl ? ' direction="rtl"' : ''} font-family="${FONT}" font-size="16" font-weight="700" fill="#011C28">${esc(text)}</text>
</svg>
`;
}

function coffeeSvg(text, rtl) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="44" viewBox="0 0 250 44" role="img" aria-label="${esc(text)}">
  <rect width="250" height="44" rx="9" fill="#FFDD00"/>
  <g transform="translate(20 12)" fill="none" stroke="#000000" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 7h13v5.5a5.5 5.5 0 0 1-5.5 5.5h-2A5.5 5.5 0 0 1 1 12.5zM14 9h1.5a3 3 0 0 1 0 6H14M5 0.5v3M10 0.5v3"/>
  </g>
  <text x="137" y="28" text-anchor="middle"${rtl ? ' direction="rtl"' : ''} font-family="${FONT}" font-size="16" font-weight="700" fill="#000000">${esc(text)}</text>
</svg>
`;
}

function build(code) {
  const t = T[code];
  const langButtons = LANGS.map(([c, name, file]) => {
    const active = c === code;
    return `  <a href="${file}"><img src="${ART}/lang-${c}${active ? '-active' : ''}.svg" height="34" alt="${name}" /></a>`;
  }).join('\n');
  const nav = ['features', 'install', 'start', 'devices', 'trouble', 'privacy', 'build']
    .map((k) => `<a href="${anchor(t.h[k])}">${t.h[k]}</a>`).join(' •\n  ');
  const fence = '```';
  const out = [];
  out.push(`<div align="center">

<img src="${ART}/banner-${code}.jpg" width="100%" alt="Battery Hub: ${t.tagline}" />

<p>
${langButtons}
</p>

<p>
  <a href="${REPO}/releases/latest"><img src="${ART}/download-${code}.svg" height="44" alt="${t.download}" /></a>
  <a href="https://buymeacoffee.com/batteryhub"><img src="${ART}/coffee-${code}.svg" height="44" alt="${t.alt.coffee}" /></a>
</p>

<p>
  <a href="${REPO}/releases/latest"><img src="https://img.shields.io/github/v/release/battery-hub/battery-hub?sort=semver" alt="${t.alt.release}" /></a>
  <a href="${REPO}/releases"><img src="https://img.shields.io/github/downloads/battery-hub/battery-hub/total" alt="${t.alt.downloads}" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/battery-hub/battery-hub" alt="${t.alt.license}" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010%20%2F%2011-0078D6" alt="${t.alt.platform}" />
</p>

</div>
`);
  if (t.rtl) out.push('<div dir="rtl">\n');
  out.push(`${t.intro}

<p align="center">
  ${nav}
</p>

## ${t.h.features}

${t.features.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}

## ${t.h.install}

**${t.winget}**

${fence}powershell
winget install DORON177.BatteryHub
${fence}

**${t.installer}**

${t.installerText}

> [!NOTE]
> ${t.smartscreen}

<details>
<summary><strong>${t.verifyTitle}</strong></summary>
<br>

${t.verify1}

${fence}powershell
Get-FileHash .\\Battery-Hub-Installer-*.exe -Algorithm SHA256
${fence}

${t.verify2}

</details>

## ${t.h.start}

### ${t.addTitle}

${t.addText}

${t.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### ${t.dashTitle}

${t.dashText}

### ${t.settingsTitle}

${t.settingsText}

## ${t.h.devices}

${t.devicesText}
`);
  if (code === 'en') {
    out.push(`<details>
<summary><strong>${t.showList}</strong></summary>
<br>

${TABLE}

</details>

${t.tested}

${t.devicesNotes}
`);
  } else {
    out.push(`${t.fullList}
`);
  }
  const cmds = ['npm install', 'npm start', 'npm test', 'npm run dist', 'npm run installer'];
  const comments = t.rtl ? T.en.buildCmds : t.buildCmds;
  const width = Math.max(...cmds.map((c) => c.length)) + 2;
  const cmdBlock = cmds.map((c, i) => (i === 0 ? c : `${c.padEnd(width)}# ${comments[i - 1]}`)).join('\n');
  out.push(`## ${t.h.trouble}

${t.trouble.map(([a, b]) => `- **${a}** ${b}`).join('\n')}

## ${t.h.privacy}

${t.privacy}

## ${t.h.build}

${t.buildReq}

${fence}bash
${cmdBlock}
${fence}

| ${t.paths[0]} | ${t.paths[1]} |
| --- | --- |
| \`src/main\` | ${t.paths[2]} |
| \`src/main/hid/drivers\` | ${t.paths[3]} |
| \`src/renderer\` | ${t.paths[4]} |
| \`scripts\` | ${t.paths[5]} |

${t.isolated}

## ${t.h.contrib}

${t.contrib}

## ${t.h.thanks}

${t.thanks} ${PROJECTS.map(([n, u]) => `[${n}](${u})`).join(', ')}, ${t.linux}.

## ${t.h.support}

${t.support}

## ${t.h.license}

[MIT](LICENSE) © 2026 Battery Hub contributors
`);
  if (t.rtl) out.push('\n</div>\n');
  const text = out.join('\n');
  return t.rtl ? rtlMarks(text) : text;
}

// GitHub gives every paragraph and list item dir="auto", which takes its direction from the first
// strong letter: a Hebrew line that starts with "Battery Hub" would run left to right. A right-to-left
// mark (U+200F) at the start of each text line sets it right. Code, HTML and table rows are left as is.
function rtlMarks(md) {
  const RLM = '‏';
  let inCode = false;
  return md.split('\n').map((line) => {
    if (line.startsWith('```')) { inCode = !inCode; return line; }
    if (inCode || !line.trim() || /^\s*[<|]/.test(line) || /^> \[!/.test(line)) return line;
    const m = line.match(/^(#{1,6} |- |\d+\. |> )?(.*)$/);
    return (m[1] || '') + RLM + m[2];
  }).join('\n');
}

fs.mkdirSync(path.join(ROOT, ART), { recursive: true });
for (const [code, name, file] of LANGS) {
  const rtl = !!T[code].rtl;
  fs.writeFileSync(path.join(ROOT, ART, `lang-${code}.svg`), langSvg(name, false, rtl));
  fs.writeFileSync(path.join(ROOT, ART, `lang-${code}-active.svg`), langSvg(name, true, rtl));
  fs.writeFileSync(path.join(ROOT, ART, `download-${code}.svg`), downloadSvg(T[code].download, rtl));
  fs.writeFileSync(path.join(ROOT, ART, `coffee-${code}.svg`), coffeeSvg(T[code].alt.coffee, rtl));
  fs.writeFileSync(path.join(ROOT, file), build(code));
  console.log('wrote', file);
}
