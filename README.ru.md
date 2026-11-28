<div align="center">
  <img src="assets/brand/watcher-tile.png" width="120" alt="Battery Hub" />
  <h1>Battery Hub</h1>
  <p><strong>Мониторинг заряда беспроводных мышей, клавиатур, гарнитур и контроллеров в реальном времени в Windows.</strong></p>

  <a href="https://github.com/battery-hub/battery-hub/releases/latest"><img src="https://img.shields.io/github/v/release/battery-hub/battery-hub?sort=semver" alt="Последний релиз" /></a>
  <a href="https://github.com/battery-hub/battery-hub/releases"><img src="https://img.shields.io/github/downloads/battery-hub/battery-hub/total" alt="Загрузки" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/battery-hub/battery-hub" alt="Лицензия" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010%20%2F%2011-0078D6" alt="Платформа: Windows 10/11" />

  <p><a href="https://buymeacoffee.com/batteryhub"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000" height="34" alt="Поддержать проект" /></a></p>
  <p><a href="README.md">English</a> | <strong>Русский</strong></p>
</div>

---

Battery Hub считывает уровень заряда беспроводных HID-устройств и отображает данные в реальном времени на единой панели мониторинга. Для каждого устройства предусмотрен отдельный индикатор в области уведомлений Windows. Приложение разработано на базе Electron.

<p align="center">
  <img src="docs/screenshot.png" width="820" alt="Панель Battery Hub с пятью устройствами, индикаторами заряда, графиками истории и прогнозами оставшегося времени работы" />
  <br />
  <sub>Панель мониторинга с демонстрационными устройствами. Чтобы заново создать снимок экрана, выполните <code>npx electron scripts/screenshot.js</code>.</sub>
</p>

## Возможности

- **Единая панель мониторинга устройств** — мыши, клавиатуры, гарнитуры и контроллеры с цветными кольцевыми индикаторами заряда.
- **Значки в области уведомлений** — индикатор заряда каждого устройства рядом с часами.
- **Краткая сводка** — сколько устройств подключено, какое из них потребуется зарядить первым и когда.
- **История и прогнозы** — нажмите на устройство, чтобы увидеть график заряда за 24 часа или 7 дней, скорость разряда и время последней зарядки.
- **Уведомления о низком заряде** — Windows предупреждает при снижении заряда ниже заданного порога. Порог можно установить для всех устройств сразу или для каждого отдельно.
- **Распознавание выключенных устройств** — если устройство выключено, но приёмник подключён, вместо устаревших данных отображается статус «Спит или выключено».
- **Пошаговая калибровка** — 30-секундное сканирование определяет байт, содержащий данные об уровне заряда, для устройств, которые не распознаются автоматически.
- **Светлая и тёмная темы** — лаконичное окно в стиле Windows 11, всплывающая панель в области уведомлений и возможность уменьшить анимацию.
- **Автоматические обновления** — через GitHub Releases.

## Установка

Через [диспетчер пакетов Windows](https://learn.microsoft.com/windows/package-manager/):

```powershell
winget install DORON177.BatteryHub
```

Или скачайте актуальный установщик `Battery-Hub-Installer-x.y.z.exe` со [страницы релизов](https://github.com/battery-hub/battery-hub/releases/latest) и запустите его. Battery Hub устанавливается для текущего пользователя и не требует прав администратора.

Windows SmartScreen показывает предупреждение **«Система Windows защитила ваш компьютер»**, поскольку установщик не имеет цифровой подписи. Выберите **Подробнее → Выполнить в любом случае**. Сертификаты подписи кода выдаются издателям после подтверждения их личности и требуют регулярной оплаты. У проекта нет финансирования, поэтому сборки не подписаны. Чтобы сначала проверить целостность файла, см. раздел [Проверка загруженного файла](#проверка-загруженного-файла).

### Проверка загруженного файла

Каждый релиз собирается и публикуется [GitHub Actions](.github/workflows/release.yml) непосредственно из исходного кода соответствующего коммита с тегом — исполняемые файлы не загружаются вручную. В комплект входит файл `SHA256SUMS.txt`. Чтобы проверить скачанный файл, выполните:

```powershell
(Get-FileHash "Battery-Hub-Installer-2.0.9.exe" -Algorithm SHA256).Hash
```

Сравните результат с контрольной суммой в файле `SHA256SUMS.txt` соответствующего релиза. Введите ту же контрольную сумму в поиске [VirusTotal](https://www.virustotal.com/gui/home/search), чтобы посмотреть имеющиеся результаты проверки именно этого файла.

## Использование

### Добавление устройства

Откройте раздел **«Добавить устройство»**. Распознанные устройства отображаются в начале списка с отметкой «Поддерживается». Нажмите **«Добавить»**. Для остальных устройств нажмите **«Настроить»**:

1. Запустите 30-секундное сканирование.
2. Во время сканирования выключите и снова включите устройство — многие беспроводные устройства передают уровень заряда только при включении.
3. Выберите значение, соответствующее текущему уровню заряда.
4. Если устройство использует другую шкалу, введите фактический уровень заряда в процентах — в дальнейшем значения будут преобразовываться автоматически.

### Карточка устройства

На каждой карточке отображаются текущий уровень заряда в процентах и кольцевой индикатор (зелёный, жёлтый или красный), индикатор зарядки, мини-график изменения заряда, прогноз оставшегося времени работы и давность последнего измерения. Нажмите на карточку для просмотра полной истории. Каждому устройству также соответствует значок в области уведомлений, заполнение и цвет которого меняются в зависимости от заряда.

### Настройки

В настройках можно выбрать тему и плотность карточек, уменьшить анимацию, задать порог низкого заряда, настроить поведение значков в области уведомлений, запуск при входе в систему и интервал обновления.

Устройства можно переименовывать, выбирать для них собственные значки, менять порядок перетаскиванием или **скрывать** через меню ⋯. При скрытии устройство и его калибровка сохраняются, но опрос прекращается, а значок исчезает из области уведомлений. Скрытые устройства перечислены под сеткой карточек, и их можно восстановить в любой момент.

## Сборка из исходного кода

Требуется [Node.js](https://nodejs.org).

```bash
npm install
npm start        # запуск в режиме разработки
npm run dist     # сборка установщика Windows в dist/
npm run installer  # создание установщика с фирменным оформлением
```

## Поддерживаемые устройства

Battery Hub считывает заряд следующих устройств напрямую. Остальные обычно можно добавить вручную с помощью кнопки «Настроить».

| Производитель или тип подключения | Устройства |
| --- | --- |
| Bluetooth | Любое сопряжённое устройство, передающее уровень заряда в Windows |
| Xbox | Беспроводные контроллеры |
| PlayStation | DualSense, DualSense Edge, DualShock 4 (USB и Bluetooth) |
| Sony | INZONE Buds (USB-адаптер), INZONE H5, INZONE H9 II |
| Nintendo | Switch Pro Controller и его аналоги, Joy-Con (Bluetooth) |
| Flydigi | Vader 4 Pro, Vader 5 Pro, Apex 4, 5 и 6 |
| 8BitDo | Ultimate 2 Wireless и Bluetooth, Ultimate 3 (режим D-input) |
| Valve | Steam Controller (2015, через приёмник) и Steam Controller (2026) |
| Другие контроллеры | Контроллер NVIDIA SHIELD, Amazon Luna (Bluetooth), контроллеры SInput, например ProGCC |
| Logitech | Мыши и клавиатуры с HID++ 2.0 (Bolt, Unifying, Lightspeed, включая новейший приёмник PRO X3 SUPERSTRIKE); гарнитуры G PRO, G PRO X 2, G325, G533, G535, G633, G733, G933, G935 |
| Razer | 90 беспроводных мышей и клавиатур (включая Basilisk V4 Pro и HyperSpeed, Naga V3 Pro, Orochi V2 и BlackWidow V4 Low Profile TKL); гарнитуры BlackShark V3, V3 Pro, V3 X HyperSpeed, V2 HyperSpeed, V2 Pro (2020), Kraken V4, Kraken V4 Pro (по кабелю) и Nari |
| SteelSeries | Гарнитуры Arctis 1, 7, 7+, 9, Nova 3P, Nova 5, Nova 7, Nova Pro Wireless, Nova Pro Omni, Nova Elite, Arctis GameBuds; мыши Aerox, Aerox 3 Wireless Gen 2, Prime, Rival 3 Wireless, Rival 650 Wireless и Rival Pro; клавиатуры Apex Pro TKL Wireless и Apex Pro Mini Wireless |
| HyperX | Гарнитуры Cloud Alpha Wireless, Cloud Alpha 2 Wireless, Cloud Core Wireless, Cloud Flight (в том числе для PlayStation), Cloud Flight S, Cloud II Wireless, Cloud II Core Wireless, Cloud III Wireless, Cloud III S Wireless, Cloud Stinger 2 Wireless; мыши Pulsefire Haste 2 Wireless, Haste 2 Core и Dart |
| Corsair | Гарнитуры Void, Void Wireless v2 (также по кабелю), HS80 MAX, HS80 RGB, Virtuoso, Virtuoso SE, XT и MAX; SABRE v3 PRO; приёмники Slipstream и адаптеры Dark Core RGB Pro, Ironclaw, Harpoon и Katar Pro; мыши M65, M75, Dark Core, Scimitar, Nightsabre, NIGHTSWORD v2, Sabre и другие беспроводные мыши по кабелю; клавиатуры K65 PLUS (и её адаптер), K70 CORE TKL, K100 AIR, K70 PRO MINI и MAKR 75 по кабелю |
| Audeze | Maxwell, Maxwell 2 (включая адаптеры Xbox и ANC) |
| Skullcandy | PLYR, Crusher PLYR 720 |
| ELECOM | Мышь BlueLED по Bluetooth (056e:00e5, отображается как «Broadcom Bluetooth Wireless Mouse») |
| Astro | A50 Gen 4, A50 Gen 5 |
| Jabra | Адаптеры Link 380 и Link 390, Evolve3 75, Evolve2 65 Flex |
| Poly (Plantronics) | Гарнитуры Voyager через адаптер BT600 |
| JBL | Quantum 810, Quantum 910 |
| Lenovo | Wireless VoIP Headset |
| FIFINE | HT6 |
| MCHOSE | Гарнитуры V9 Turbo+, V9 PRO, V9 Pro 2, X9; мыши A7 V2 Ultra, A7 V2 Pro, A5 Ultra, K7 Ultra, A7 Ultra, G3 A; клавиатуры G75 V2, G87 V2, K87S, K99 V3, K87, G98 Pro; мыши A5 V3, A7 V3, A7X Ultra, K7 V2, R7 Ultra, V7 Pro, G3 V3, G3 Ultra и A5 V2 Ultra |
| VXE, ATK, MADLIONS | Dragonfly R1 Pro, NordicMouse и другие мыши с приёмниками Compx; приёмники ATK NearLink и BitMouse, X1 NearLink; адаптеры ATK 8K Nano и 1K/8K; Pulsar 8K Dongle Gen.2 и мыши CrazyLight, Pulsar Xlite V4, X3 и Feinmann (Fusion2), приёмник G-Wolves 8K, Endgame Gear XM2we, ATK A9 PRO MAX и Duckbill ELITE, адаптер ATK NearLink 8K, A9 Ultimate и F1 NearLink, iRocks M31R, приёмник Zebronics |
| Glorious, LAMZU | Model O, O-, D, D- Wireless; Maya X, Atlantis OG и Mini, TACHI, INCA, PARO, THORN и другие мыши LAMZU; мыши WLmouse (Beast X Max и другие), Attack Shark R5 Ultra |
| Приёмник Beken/Xenta (2,4 ГГц) | Attack Shark и другие мыши с приёмниками 1d57:fa60 и fa55 |
| ASUS | Гарнитуры ROG Strix Go 2.4 и TUF Gaming H3 Wireless; клавиатуры ROG Claymore II, Azoth, Azoth X, Azoth Extreme, Falchion, Falchion RX LP, Strix Scope II 96 и Scope RX TKL Wireless; мыши ROG Gladius III, Gladius III AimPoint (и EVA-02), Chakram X, Harpe Ace, Harpe II Ace, Keris AimPoint, Keris II, Spatha X, TUF Gaming M4 и Mini, ProArt MD301, MD200 и мыши с приёмником ROG OMNI |
| MSI | VERSA 300 Elite Wireless, VERSA PRO Wireless |
| Bloody | R73 Pro и другие беспроводные мыши Bloody |
| Waizowl | OGM 8K |
| NZXT | Lift Elite Wireless |
| Cooler Master | MM712, MM731 |
| VAXEE | Беспроводные мыши при подключении через штатные адаптеры |
| Ninjutso | Sora V3 |
| CROCIRIS | X7 |
| DARKRIM | SHADOW |
| Delux | M800 Pro |
| Redragon | M690 PRO (приёмник); M901P-KS, M913 и другие мыши с приёмниками Compx |
| Darmoshark | M3, N5 и другие мыши и приёмники Darmoshark |
| AULA, EWEADN | Клавиатуры с приёмником SONiX (2,4 ГГц); адаптер AULA F108 Pro |
| Lofree | Flow Lite84 |
| GANSS | GS3075T (2,4 ГГц) |
| Alienware | Pro Wireless Gaming Keyboard |
| Red Square | Alumix TKL |
| CHERRY | MX 3.0S Wireless |
| Приёмник 1EA7 (2,4 ГГц) | Универсальные мыши с подключением на частоте 2,4 ГГц с приёмниками 1ea7:0064 и 0066 |
| Rapoo | Мыши VT7 и VT9 Pro / VT3 MAX (24ae:1413, 1417), VT9 Pro V2, VT7 по кабелю |
| Приёмник YICHIP (2,4 ГГц) | AJAZZ AJ159 APEX, AJ179 PRO, Lingbao M5 Pro, Attack Shark R2 и другие мыши и клавиатуры с приёмниками YICHIP и Rongyuan (также MonsGeek, Epomaker, MSI, Trust и VGN) |
| BY Tech | PIAO 8K, EWEADN S9 и другие мыши BY Tech |
| Akko, Telink, Wobkey | Мыши с приёмником Akko 8K, а также мыши Telink и клавиатуры Wobkey на той же платформе |
| VGN | Dragonfly 3 MasterGT, Dragonfly Y2 / F1 V2, F1 V2 Extreme, Falcon3 Extreme и другие мыши VGN; адаптеры клавиатур N75 V2, V108, V87 V2, V98pro V3 |
| Keychron, SKN | Мыши с приёмником Ultra-Link 8K |
| Приёмник на чипе YJX (2,4 ГГц) | AJAZZ, XCTECH и другие мыши с приёмниками YJX (та же платформа, что и у мышей MCHOSE серии G) |
| Приёмник Compx (2,4 ГГц) | Клавиатуры AULA F87 Pro и F99 Pro, Lingbao K98, MCHOSE G75 |

Проверено на реальном оборудовании: VXE NordicMouse, MCHOSE V9 Turbo+, DualSense по USB и Bluetooth, Logitech MX Master 4 по Bluetooth, INZONE Buds через USB-адаптер и мышь ELECOM BlueLED по Bluetooth. Поддержка остальных устройств реализована на основе протоколов, описанных в проектах ниже, и проверена на соответствие описанным форматам данных. Если устройство работает некорректно, пожалуйста, [сообщите о нём](https://github.com/battery-hub/battery-hub/issues/new?template=device-support.yml).

При реализации протоколов использованы наработки проектов [HeadsetControl](https://github.com/Sapd/HeadsetControl), [OpenRazer](https://github.com/openrazer/openrazer), [rivalcfg](https://github.com/flozz/rivalcfg), [openinzone](https://github.com/penguinwokrs/openinzone) и HID-драйверах ядра Linux.

Устройство, подключённое несколькими способами (например, контроллер по кабелю и Bluetooth), отображается на одной карточке, если при обоих способах подключения определяется один и тот же Bluetooth-адрес.

При чтении заряда контроллера PlayStation по Bluetooth он переключается в режим передачи полных HID-отчётов до выключения контроллера, как в Steam и DS4Windows. Некоторые старые игры могут не распознавать контроллер в этом режиме, пока его не выключить и снова не включить.

## Структура проекта

| Путь | Назначение |
| --- | --- |
| `src/main` | Главный процесс Electron — опрос HID-устройств, область уведомлений, уведомления, обновления. |
| `src/main/hid/drivers` | Драйверы чтения заряда отдельных устройств; в `table.js` перечислены устройства с простым обменом запросами и ответами. |
| `src/renderer` | Интерфейс приложения. |
| `scripts` | Генерация значков и инструменты сборки. |

Нативный модуль `node-hid` работает в изолированном вспомогательном процессе, поэтому сбой драйвера не приводит к завершению приложения.

## Устранение неполадок

- **Не удаётся считать заряд устройства.** Некоторые устройства блокируют запросы заряда на уровне драйвера.
- **При калибровке ничего не обнаружено.** Повторите сканирование, выключив и включив устройство во время его выполнения.
- **MCHOSE V9 Turbo+ требует Python и модуль hid.** Заряд этой гарнитуры считывается через Python. Установите [Python](https://www.python.org/downloads/), затем выполните `pip install hidapi`.
- **Устройство не работает.** После двух неудачных сканирований или трёх последовательных неудачных попыток чтения (откройте карточку устройства) появляется кнопка «Отправить отчёт об устройстве». Она открывает предварительно заполненную форму запроса на GitHub, которую можно проверить и отправить.
- **Другая проблема.** Откройте «Настройки → Помощь» и нажмите «Запустить проверку». Диагностика проверит установку приложения, компьютер и устройства, укажет источник проблемы и при необходимости позволит открыть предварительно заполненную форму обращения в поддержку.
- **Журналы сбоев** записываются в `%APPDATA%\battery-hub\battery-hub.log`.

## Конфиденциальность

Battery Hub работает полностью на вашем компьютере и не собирает данные. Приложение подключается к интернету только для двух задач, в обоих случаях обращаясь к GitHub: проверки и загрузки обновлений, а также проверки версии в разделе «Настройки → Помощь». При создании отчёта об устройстве или обращения в поддержку в браузере открывается предварительно заполненная форма GitHub. Данные не отправляются без вашего участия: перед отправкой можно проверить каждое поле. История заряда и настройки хранятся в `%APPDATA%\battery-hub`.

## Участие в разработке

Приветствуются запросы на добавление поддержки устройств и предложения изменений (pull requests) — см. [CONTRIBUTING.md](CONTRIBUTING.md).
История релизов находится в [CHANGELOG.md](CHANGELOG.md), а порядок сообщения об уязвимостях описан в [SECURITY.md](SECURITY.md).

## Поддержка проекта

Battery Hub бесплатен и останется бесплатным. Если благодаря приложению ваша мышь не разрядилась в разгар игры, вы можете [угостить разработчика кофе](https://buymeacoffee.com/batteryhub). Ваша поддержка помогает проекту оставаться бесплатным и расширять список поддерживаемых устройств.

## Лицензия

[MIT](LICENSE) © 2026 участники разработки Battery Hub
