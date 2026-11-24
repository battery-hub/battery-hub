<div align="center">
  <img src="assets/brand/watcher-tile.png" width="120" alt="Battery Hub" />
  <h1>Battery Hub</h1>
  <p><strong>Monitor de bateria ao vivo para mouses, teclados, fones e controles sem fio no Windows.</strong></p>

  <p><a href="README.md">English</a> · <strong>Português (Brasil)</strong></p>

  <a href="https://github.com/battery-hub/battery-hub/releases/latest"><img src="https://img.shields.io/github/v/release/battery-hub/battery-hub?sort=semver" alt="Última versão" /></a>
  <a href="https://github.com/battery-hub/battery-hub/releases"><img src="https://img.shields.io/github/downloads/battery-hub/battery-hub/total" alt="Downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/battery-hub/battery-hub" alt="Licença" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010%20%2F%2011-0078D6" alt="Plataforma: Windows 10/11" />

  <p><a href="https://buymeacoffee.com/batteryhub"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000" height="34" alt="Pague um café" /></a></p>
</div>

---

> Esta é a tradução do [README em inglês](README.md), que é a versão de referência. Se as duas divergirem, vale a em inglês.

O Battery Hub lê o nível de bateria dos seus dispositivos HID sem fio e mostra cada um num painel ao vivo, com um indicador por dispositivo na bandeja do sistema. Feito com Electron.

<p align="center">
  <img src="docs/screenshot.png" width="820" alt="Painel do Battery Hub com cinco dispositivos, anéis de carga, gráficos de histórico e estimativas de tempo restante" />
  <br />
  <sub>O painel, com dispositivos de exemplo. Para gerar de novo: <code>npx electron scripts/screenshot.js</code>.</sub>
</p>

## Recursos

- **Painel com vários dispositivos** — mouses, teclados, fones e controles, cada um com um anel de carga colorido.
- **Ícones na bandeja do sistema** — um indicador de bateria ao vivo por dispositivo, ao lado do relógio.
- **Visão geral rápida** — qual dispositivo precisa de carga primeiro, em quanto tempo e quantos estão conectados.
- **Histórico e estimativas** — clique num dispositivo para ver o gráfico de bateria de 24 horas ou 7 dias, o ritmo de descarga e quando foi carregado pela última vez.
- **Avisos de bateria fraca** — notificações do Windows quando um dispositivo fica abaixo de um limite, definido uma vez para todos ou por dispositivo.
- **Sabe quando um dispositivo está desligado** — um dispositivo desligado com o receptor ainda conectado aparece como *Em repouso ou desligado*, em vez de mostrar uma leitura antiga.
- **Calibração guiada** — uma busca de 30 segundos encontra o byte da bateria em dispositivos que não são reconhecidos automaticamente.
- **Temas claro e escuro** — uma janela tranquila no estilo do Windows 11, um painel na bandeja e uma opção para reduzir animações.
- **Atualizações automáticas** — entregues pelo GitHub Releases.

## Instalação

Com o [Gerenciador de Pacotes do Windows](https://learn.microsoft.com/windows/package-manager/):

```powershell
winget install DORON177.BatteryHub
```

Ou baixe o `Battery-Hub-Installer-x.y.z.exe` mais recente na [página de versões](https://github.com/battery-hub/battery-hub/releases/latest) e execute. O Battery Hub é instalado só para o seu usuário e não pede permissão de administrador.

O Windows SmartScreen mostra o aviso **"O Windows protegeu o computador"** porque o instalador não tem assinatura de código: clique em **Mais informações → Executar assim mesmo**. Certificados de assinatura de código são emitidos para editores identificados, com uma taxa recorrente; este projeto não tem financiamento, então as versões não são assinadas. Veja [Verificar um download](#verificar-um-download) se quiser confirmar a integridade do arquivo antes.

### Verificar um download

Toda versão é gerada e publicada pelo [GitHub Actions](.github/workflows/release.yml) diretamente a partir de um commit com tag, sem nenhum binário enviado à mão, e cada uma vem com um `SHA256SUMS.txt`. Para confirmar que o seu download confere, rode:

```powershell
(Get-FileHash "Battery-Hub-Installer-2.0.5.exe" -Algorithm SHA256).Hash
```

e compare o resultado com o checksum no `SHA256SUMS.txt` daquela versão. Colando o mesmo hash no [VirusTotal](https://www.virustotal.com/gui/home/search), você vê os resultados de análise desse arquivo exato.

## Uso

### Adicionar um dispositivo

Abra **Adicionar dispositivo** (*Add device*). Os dispositivos reconhecidos aparecem primeiro, com o selo *Compatível* (*Supported*): clique em **Adicionar** (*Add*). Para os outros, escolha **Configurar** (*Set up*):

1. Inicie a busca de 30 segundos.
2. Desligue e ligue o dispositivo enquanto a busca roda: muitos dispositivos sem fio só informam a bateria quando são ligados.
3. Selecione o valor que corresponde à porcentagem atual da bateria.
4. Se o dispositivo informar numa escala diferente, digite a porcentagem real e a conversão passa a ser automática dali em diante.

### Ler um cartão

Cada cartão mostra a porcentagem atual e o anel (verde / amarelo / vermelho), um indicador de carregamento, um mini gráfico do histórico, o tempo restante estimado e a idade da última leitura. Clique num cartão para ver o histórico completo. Cada dispositivo também aparece como um ícone na bandeja, que enche e muda de cor conforme a carga.

### Configurações

Tema, densidade dos cartões, reduzir animações, limite de bateria fraca, comportamento da bandeja, abrir ao iniciar a sessão e intervalo de atualização.

Os dispositivos podem ser renomeados, ganhar um ícone próprio, ser arrastados para mudar a ordem ou ser **ocultados** pelo menu ⋯. Ocultar mantém o dispositivo e a calibração, mas para as leituras e remove o ícone da bandeja; os dispositivos ocultos ficam listados abaixo da grade e podem voltar a qualquer momento.

## Rodar pelo código-fonte

Precisa do [Node.js](https://nodejs.org).

```bash
npm install
npm start          # roda em modo de desenvolvimento
npm run dist       # gera o instalador do Windows em dist/
npm run installer  # coloca o instalador na janela de instalação com a marca do projeto
```

## Dispositivos suportados

O Battery Hub lê estes diretamente. Os outros normalmente podem ser adicionados com **Configurar**.

| Família | Dispositivos |
| --- | --- |
| Bluetooth | Qualquer dispositivo pareado que informe a bateria ao Windows |
| Xbox | Controles sem fio |
| PlayStation | DualSense, DualSense Edge, DualShock 4 (USB e Bluetooth) |
| Logitech | Mouses e teclados com HID++ 2.0 (Bolt, Unifying, Lightspeed); fones G PRO, G533, G535, G633, G733, G933, G935 |
| Razer | 81 mouses e teclados sem fio |
| SteelSeries | Fones Arctis 1, 7, 7+, 9, Nova 3P, Nova 5, Nova 7, Nova Pro Wireless; mouses Aerox, Prime e Rival 3 Wireless |
| HyperX | Cloud Alpha Wireless, Cloud Flight, Cloud II Wireless, Cloud II Core Wireless, Cloud III Wireless, Cloud III S Wireless, Cloud Stinger 2 Wireless |
| Corsair | Fones Void, Void Wireless v2, HS80 MAX, Virtuoso, Virtuoso SE, XT e MAX; receptor Slipstream |
| Audeze | Maxwell, Maxwell 2 |
| Astro | A50 Gen 4, A50 Gen 5 |
| MCHOSE | Fones V9 Turbo+, V9 PRO, X9; mouses A7 V2 Ultra, A5 Ultra, K7 Ultra, A7 Ultra; teclados G75 V2, G87 V2, K87S, K99 V3 |
| VXE, ATK, MADLIONS | Dragonfly R1 Pro, NordicMouse e outros mouses com receptor Compx; receptores ATK NearLink e BitMouse, X1 NearLink |
| Glorious, LAMZU | Model O, O-, D, D- Wireless; Maya X e outros mouses LAMZU |
| Receptor 2.4G Beken/Xenta | Attack Shark e outros mouses no 1d57:fa60 |
| Receptor 2.4G Compx | Teclados AULA F87 Pro e F99 Pro, Lingbao K98, MCHOSE G75 |

Testados em hardware real: VXE NordicMouse, MCHOSE V9 Turbo+, DualSense por USB e Bluetooth e Logitech MX Master 4 por Bluetooth. Os outros foram feitos a partir dos protocolos documentados pelos projetos abaixo e conferidos com esses formatos de bytes; por isso, [relate um dispositivo](https://github.com/battery-hub/battery-hub/issues/new?template=device-support.yml) se algum não funcionar direito.

O trabalho de protocolo vem do [HeadsetControl](https://github.com/Sapd/HeadsetControl), do [OpenRazer](https://github.com/openrazer/openrazer), do [rivalcfg](https://github.com/flozz/rivalcfg) e dos drivers HID do kernel Linux.

Um dispositivo conectado de mais de um jeito, como um controle no cabo e por Bluetooth, aparece como um só cartão quando as duas conexões informam o mesmo endereço Bluetooth.

Ler um controle de PlayStation por Bluetooth o coloca no modo de relatório completo até ser desligado, como fazem o Steam e o DS4Windows. Alguns jogos mais antigos podem não reconhecer o controle nesse modo até ele ser desligado e ligado de novo.

## Estrutura do projeto

| Caminho | Função |
| --- | --- |
| `src/main` | Processo principal do Electron: leitura HID, bandeja, notificações, atualizações. |
| `src/main/hid/drivers` | Drivers de bateria por dispositivo; `table.js` lista os dispositivos simples de pergunta e resposta. |
| `src/renderer` | Interface do app. |
| `scripts` | Geração de ícones e ferramentas de build. |

O `node-hid` nativo roda num processo utilitário isolado, para que uma falha num driver não derrube o app.

## Solução de problemas

- **"Não é possível ler a bateria deste dispositivo"** (*Can't read this device's battery*). Alguns dispositivos bloqueiam os pedidos de bateria no driver e não podem ser lidos.
- **Nada capturado na calibração.** Rode a busca de novo e desligue e ligue o dispositivo enquanto ela roda.
- **O MCHOSE V9 Turbo+ mostra "needs Python + hid module".** Esse fone é lido pelo Python. Instale o [Python](https://www.python.org/downloads/) e rode `pip install hidapi`.
- **Um dispositivo não funciona.** Depois de duas buscas sem resultado, ou de três leituras seguidas com falha (abra o cartão do dispositivo), aparece o botão **Enviar relatório do dispositivo** (*Send device report*). Ele preenche um pedido de dispositivo no GitHub para você conferir e enviar.
- **Outra coisa não funciona.** Abra Configurações > Ajuda e clique em **Verificar** (*Run check*). Ele testa a instalação, este PC e seus dispositivos, diz onde está o problema e pode abrir um pedido de suporte já preenchido.
- **Os registros de erro** ficam em `%APPDATA%\battery-hub\battery-hub.log`.

## Privacidade

O Battery Hub roda inteiro no seu PC e não coleta nada. Ele só acessa a internet para duas coisas,
as duas no GitHub: procurar e baixar atualizações, e a verificação de versão em Configurações > Ajuda.
Relatórios de dispositivo e pedidos de suporte abrem um formulário do GitHub já preenchido no seu
navegador; nada é enviado até você mesmo enviar, e você pode ler cada campo antes. O histórico de
bateria e as configurações ficam em `%APPDATA%\battery-hub`.

## Como contribuir

Pedidos de suporte a dispositivos e pull requests são bem-vindos: veja o
[CONTRIBUTING.pt-BR.md](CONTRIBUTING.pt-BR.md). O histórico de versões está no
[CHANGELOG.md](CHANGELOG.md) (em inglês), e relatos de segurança estão no
[SECURITY.pt-BR.md](SECURITY.pt-BR.md).

## Apoie o projeto

O Battery Hub é gratuito e continua gratuito. Se ele te salvou de um mouse descarregado no meio do jogo,
você pode [pagar um café](https://buymeacoffee.com/batteryhub). Isso ajuda a mantê-lo gratuito e a
adicionar suporte a mais dispositivos.

## Licença

[MIT](LICENSE) © 2026 Battery Hub contributors
