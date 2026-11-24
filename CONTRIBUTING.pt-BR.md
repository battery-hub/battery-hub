# Como contribuir

[English](CONTRIBUTING.md) · **Português (Brasil)**

> Esta é a tradução do [CONTRIBUTING.md](CONTRIBUTING.md), que é a versão de referência. Se as duas divergirem, vale a em inglês.

Obrigado pelo interesse no Battery Hub.

## Pedir suporte a um dispositivo

A contribuição mais útil é um relatório de dispositivo. O Battery Hub só consegue ler um dispositivo
depois que o protocolo da bateria dele é conhecido, e isso exige dados do próprio hardware.

Abra um [pedido de suporte a dispositivo](https://github.com/battery-hub/battery-hub/issues/new?template=device-support.yml)
e inclua o vendor/product ID e o resultado da busca de calibração do app
(**Adicionar dispositivo → Configurar**, *Add device → Set up*). Sem essas informações, normalmente
não dá para fazer nada com o pedido.

Se o seu dispositivo já funciona depois de você mesmo calibrá-lo, vale relatar do mesmo jeito: esses
ajustes podem virar um perfil embutido, para ninguém mais precisar repetir.

### Escrever issues e PRs em português

Os formulários de issue estão em inglês e o robô de triagem do repositório lê os títulos dos campos,
então use os formulários como estão. Dentro dos campos você pode escrever em português; se conseguir
escrever em inglês, o mantenedor responde mais rápido. Dados técnicos (IDs, bytes, resultado da busca)
valem em qualquer idioma.

## Desenvolvimento

Precisa do [Node.js](https://nodejs.org).

```bash
npm install
npm start        # roda em modo de desenvolvimento
npm test         # roda os testes unitários
npm run dist     # gera o instalador do Windows em dist/
```

A interface pode ser trabalhada sem hardware: abrir `src/renderer/index.html` por um servidor estático
carrega o `src/renderer/mock.js`, que fornece dispositivos de exemplo cobrindo todos os estados visuais.

### Estrutura

| Caminho | Função |
| --- | --- |
| `src/main` | Processo principal do Electron: leitura HID, bandeja, notificações, atualizações. |
| `src/main/hid/drivers` | Drivers de bateria por dispositivo. |
| `src/renderer` | Interface do app. |
| `test` | Testes unitários (`node:test`, sem framework). |
| `scripts` | Geração de ícones e de screenshots. |
| `packaging/winget` | Manifestos do Gerenciador de Pacotes do Windows. |

As chamadas nativas do `node-hid` rodam num processo utilitário isolado, para que uma falha num driver
não derrube o app. Tudo o que mexe com HID passa pelo `src/main/hid/hid-client.js`, e os drivers pegam
seus handles do `src/main/hid/session.js`: leia o cabeçalho dele antes de mudar como os handles são
abertos ou fechados.

Os dados de exemplo não exercitam o caminho HID. Teste mudanças em drivers e na busca com hardware real.

## Pull requests

- Rode `npm test` antes de abrir um PR; o CI roda os mesmos testes a cada push.
- Mantenha a lógica testável livre de Electron e de imports nativos: veja `src/main/history.js` e
  `src/renderer/estimate.js` como exemplo do padrão.
- Siga o estilo do código ao redor. O `.editorconfig` cobre indentação e quebras de linha.
- Descreva o que você testou, principalmente em mudanças de driver, já que a maior parte do hardware
  só pode ser verificada pelo próprio dono.

## Publicar versões

Só para mantenedores: veja a seção [Releasing](CONTRIBUTING.md#releasing) do CONTRIBUTING em inglês.
