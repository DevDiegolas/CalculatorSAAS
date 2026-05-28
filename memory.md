# CalcPay Memory

## Resumo

CalcPay e um app de calculadora SaaS de zoeira, mas com visual serio. A piada e
que a calculadora funciona como produto por assinatura: alguns recursos ficam
bloqueados por plano e a assinatura e simulada localmente.

Nao existe backend, banco, checkout real, coleta de dados ou integracao de
pagamento. As assinaturas sao locais e persistidas no `localStorage`.

## Stack

- Tauri v2 para desktop e Android.
- React 18.
- TypeScript.
- Vite.
- Tailwind CSS.
- Lucide React.
- Vitest.
- Docker Compose para ambiente Node/frontend.

O app e desktop/mobile nativo via Tauri. Nao tratar como app web final. O Vite
existe para desenvolvimento e para o Tauri carregar a UI no modo dev.

## Produto

Planos atuais:

- Free: numeros, soma e tema branco; resultado fica bloqueado.
- Basic: resultado, subtracao e temas basicos.
- Pro: multiplicacao, divisao, historico e temas avancados.
- Enterprise: porcentagem, raiz quadrada, memoria e temas corporativos.

Fluxos importantes:

- Ao tentar usar recurso bloqueado, abrir a central de assinaturas.
- Botao `Assinar` simula checkout com loading e confirmacao.
- Nao mencionar "fake" na UI.
- O tom visual deve parecer serio/produto real, nao piada explicita.
- Mensagens de bloqueio devem apontar o plano correto do recurso.

## Arquitetura

- `src/features/calculator`: hook, servico, tipos e componentes da calculadora.
- `src/features/subscriptions`: planos, permissoes, strategies, storage local e
  mensagens por plano.
- `src/shared`: componentes reutilizaveis e estilos globais.
- `src-tauri`: config e bootstrap Tauri.
- `.github/workflows/release.yml`: release desktop Linux/Windows.

Padroes usados:

- Strategy + Factory para planos.
- Hook `useCalculator` para coordenar UI com regras da calculadora.
- `CalculatorService` para regras de calculo.
- `SubscriptionService` para permissao, upgrade local e mensagens de bloqueio.

## Estado Atual

Ultimos commits relevantes:

- `d7f17c9 chore: bump version to 0.1.1`
- `b5d325b feat: improve mobile calculator flow`
- `8370f9c build: configure desktop bundle icons`
- `9e05730 build: add Tauri npm script`
- `940c01d ci: use stable Tauri action`
- `1443aef ci: add desktop release workflow`
- `d7bcafe fix: hide locked calculator results`
- `50ef4f0 feat: add CalcPay desktop app`

Release desktop atual:

- `calcpay-v0.1.1`
- URL: `https://github.com/DevDiegolas/CalculatorSAAS/releases/tag/calcpay-v0.1.1`

Assets desktop esperados nessa release:

- `CalcPay_0.1.1_x64-setup.exe`
- `CalcPay_0.1.1_x64_en-US.msi`
- `CalcPay_0.1.1_amd64.AppImage`
- `CalcPay_0.1.1_amd64.deb`
- `CalcPay-0.1.1-1.x86_64.rpm`

Android foi buildado localmente em outra sessao/terminal porque o ambiente Android
do host estava configurado la. A ideia e subir APK/AAB na mesma release `0.1.1`.

## Android

Ambiente Android usado localmente:

- `ANDROID_HOME=$HOME/Android/Sdk`
- `ANDROID_SDK_ROOT=$ANDROID_HOME`
- `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`
- Java 17 deve ser usado. Java 25 causou erro de Gradle:
  `Unsupported class file major version 69`.

Pacotes instalados:

- `cmdline-tools;latest`
- `platform-tools`
- `platforms;android-35`
- `platforms;android-36`
- `build-tools;35.0.0`
- `ndk;27.0.12077973`

Comandos Android:

```bash
npm run tauri:android:init
npm run tauri:android:build
```

Saidas esperadas:

- APK unsigned:
  `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk`
- AAB:
  `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab`

APK assinado localmente esperado:

```text
src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk
```

Nome bonito para release:

- `CalcPay_0.1.1_android-universal.apk`
- `CalcPay_0.1.1_android-universal.aab`

## Desktop Release

Workflow desktop:

- Trigger por tag `calcpay-v*`.
- Build Linux e Windows no GitHub Actions.
- Usa `tauri-apps/tauri-action@v0`.

Para nova release:

1. Bump em `package.json`, `package-lock.json` e `src-tauri/tauri.conf.json`.
2. Rodar `npm run lint`, `npm run test`, `npm run build`.
3. Commit do bump.
4. Criar tag `calcpay-vX.Y.Z`.
5. Push branch e tag.
6. Acompanhar `gh run watch`.
7. Confirmar assets com `gh release view`.

Aviso conhecido:

- GitHub Actions mostra warning de Node 20 deprecated em `actions/checkout@v4`
  e `actions/setup-node@v4`. Nao bloqueia build.

## Dev

Porta Vite:

```text
http://localhost:47291
```

Scripts:

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run tauri:dev
npm run tauri:build
npm run tauri:android:init
npm run tauri:android:dev
npm run tauri:android:build
```

`npm run tauri:dev` usa `beforeDevCommand` e precisa do Vite local. Existe um
`pretauri:dev` que mata processo preso na porta `47291`:

```json
"pretauri:dev": "fuser -k 47291/tcp 2>/dev/null || true"
```

## O Que Fazer

- Antes de trabalhar, ler este `memory.md`.
- Sempre ver os ultimos commits:

```bash
git log --oneline -8
git status --short
```

- Rodar testes conforme risco da mudanca:

```bash
npm run lint
npm run test
npm run build
```

- Manter design serio e usavel.
- Preservar desktop quando mexer no mobile.
- Preservar mobile quando mexer no desktop.
- Quando mudar permissao de plano, atualizar testes.
- Mensagens de bloqueio precisam apontar plano correto.

## O Que Nao Fazer

- Nao transformar em web app final.
- Nao adicionar backend, banco, auth real ou pagamento real sem pedido explicito.
- Nao usar texto de UI dizendo "fake".
- Nao coletar dados pessoais.
- Nao quebrar a piada com copy informal demais dentro do app.
- Nao commitar `Co-authored-by`, assinatura de IA ou trailer automatico.
- Nao adicionar comentarios desnecessarios no codigo.
- Nao sobrescrever release antiga; criar nova versao/tag.
- Nao rodar comandos destrutivos como `git reset --hard` sem pedido explicito.

## Commits

Estilo preferido:

- Conventional Commits.
- Mensagem curta e objetiva.
- Sem `Co-authored-by`.
- Sem atribuicao de IA.

Exemplos:

```text
feat: improve mobile calculator flow
fix: hide locked calculator results
chore: bump version to 0.1.1
```
