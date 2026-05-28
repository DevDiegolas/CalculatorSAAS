# CalcPay

CalcPay e uma calculadora desktop com recursos por assinatura. A ideia do app e
simular um SaaS serio em volta de uma calculadora: o usuario consegue usar a
interface normalmente, mas certas operacoes, temas e recursos so sao liberados
conforme o plano atual.

Nao existe backend, banco, checkout real ou coleta de dados. As assinaturas sao
simuladas localmente e persistidas no `localStorage`.

## Stack

- Tauri: empacotamento desktop e Android
- React: interface componentizada
- TypeScript: contratos e regras tipadas
- Vite: dev server e build do frontend
- Tailwind CSS: estilos e temas da UI
- Lucide React: icones da interface
- Vitest: testes unitarios
- Docker Compose: ambiente Node isolado para desenvolvimento frontend

O app e pensado para rodar como desktop app e APK Android. O Docker fica
responsavel pelo ambiente Node, mas o Tauri deve ser executado no host ou no CI
por depender de janela, Android SDK e toolchain nativo.

## Rodando com Docker

```bash
docker compose up
```

O Vite fica em `http://localhost:47291`.

Esse modo serve para desenvolvimento do frontend. Para testar como app desktop,
use o Tauri no host.

## Rodando o app desktop

Instale Rust/Cargo e as dependencias nativas do Tauri no sistema, depois rode:

```bash
npm install
npm run tauri:dev
```

## Rodando e gerando APK Android

Para Android, instale Android Studio/SDK, Java e Rust no host, depois inicialize
o alvo Android uma vez:

```bash
npm install
npm run tauri:android:init
```

Com um celular/emulador conectado:

```bash
npm run tauri:android:dev
```

Para gerar APK/AAB de release:

```bash
npm run tauri:android:build
```

O Tauri gera os arquivos Android em `src-tauri/gen/android`. O APK de release
fica dentro da pasta de build do Gradle desse projeto gerado.

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run tauri:dev
npm run tauri:build
npm run tauri:android:init
npm run tauri:android:dev
npm run tauri:android:build
```

## Releases

O projeto tem um workflow em `.github/workflows/release.yml` para gerar builds
de Linux e Windows no GitHub Actions.

Para publicar uma release:

```bash
git tag calcpay-v0.1.0
git push origin calcpay-v0.1.0
```

O workflow cria a release `CalcPay v0.1.0` e anexa os instaladores gerados pelo
Tauri. Tambem e possivel rodar o workflow manualmente pela aba Actions do GitHub.

## Planos

Os planos controlam as permissoes da calculadora:

- Free: numeros, soma e tema branco; resultado permanece bloqueado
- Basic: libera resultado, subtracao e temas essenciais
- Pro: libera multiplicacao, divisao, historico e temas avancados
- Enterprise: libera porcentagem, raiz quadrada, memoria e temas corporativos

Ao tentar usar um recurso bloqueado, o app abre a central de assinaturas. O botao
`Assinar` simula um fluxo de compra com loading e confirmacao.

## Arquitetura

O projeto separa UI e regras de dominio por feature:

- `src/features/calculator`: estado, comandos e interface da calculadora
- `src/features/subscriptions`: planos, permissoes e assinatura local
- `src/shared/ui`: componentes reutilizaveis
- `src/shared/styles`: estilos globais
- `src-tauri`: configuracao e bootstrap do app desktop
- `tests/unit`: testes unitarios por feature
- `infra/docker`: Dockerfile do ambiente frontend

As regras de plano usam Strategy + Factory, permitindo adicionar novos planos
sem espalhar condicionais pela UI.
