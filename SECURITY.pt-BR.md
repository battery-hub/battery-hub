# Política de segurança

[English](SECURITY.md) · **Português (Brasil)**

> Esta é a tradução do [SECURITY.md](SECURITY.md), que é a versão de referência. Se as duas divergirem, vale a em inglês.

## Versões com suporte

As correções saem só para a versão mais recente. Atualize para a
[versão atual](https://github.com/battery-hub/battery-hub/releases/latest) antes de relatar um problema.

## Relatar uma vulnerabilidade

Relate vulnerabilidades em particular, pelo
[formulário de alerta de segurança](https://github.com/battery-hub/battery-hub/security/advisories/new)
do GitHub, em vez de abrir uma issue pública.

Inclua a versão afetada, o que um atacante conseguiria fazer e os passos para reproduzir. Este é um
projeto pequeno, mantido por hobby, então espere uma primeira resposta em algumas semanas, não no
mesmo dia.

## O que o Battery Hub faz na sua máquina

Contexto útil para avaliar um relato:

- Ele lê dados de bateria de dispositivos USB/HID locais e guarda as configurações dos dispositivos
  e o histórico de bateria em `%APPDATA%\battery-hub`. Nada é enviado para lugar nenhum.
- As únicas requisições para fora são a verificação de atualizações na API de versões do GitHub e o
  download do instalador quando uma atualização é aplicada.
- A interface roda com `contextIsolation` ligado e `nodeIntegration` desligado; todas as operações
  privilegiadas passam pela ponte do preload em `src/main/preload.js`.
- As chamadas nativas do `node-hid` ficam isoladas num processo utilitário separado.

## Sobre a assinatura de código

Os instaladores **não têm assinatura de código**, então o Windows SmartScreen avisa no download.
Toda versão é gerada pelo GitHub Actions a partir de um commit com tag e publicada com um checksum
`SHA256SUMS.txt`; veja [Verificar um download](README.pt-BR.md#verificar-um-download).
