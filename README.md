# Raspberry Frontend

Interface em **Angular 19** para consulta dos indicados e vencedores da categoria **Pior Filme** do
Golden Raspberry Awards. Consome a API `https://challenge.outsera.tech/api/movies`.

## Telas
- **Dashboard** (`/dashboard`): anos com mais de um vencedor, top 3 estúdios com mais vitórias,
  produtores com maior e menor intervalo entre prêmios e busca de vencedores por ano.
- **List** (`/movies`): todos os filmes com paginação (15 por página) e filtros por ano e por vencedor.

O menu lateral dá acesso às duas telas. O layout é responsivo (mínimo 768x1280): o dashboard usa 2 colunas em telas largas e 1 coluna abaixo de 1024px.

## Pré-requisitos
- Node.js 18.19+, 20.11+ ou 22+ (requisito do Angular 19) e npm
- Google Chrome (necessário apenas para rodar os testes)

## Como rodar o projeto
    npm install
    npm start

Acesse http://localhost:4200.

Build de produção (saída em `dist/raspberry-frontend`):

    npm run build

## Como rodar os testes unitários
    npm test              # modo watch, abre o Chrome
    npm run test:ci       # execução única, Chrome headless, com cobertura (pasta coverage/)

## Configuração da API
A URL base está em `src/environments/environment.ts` (`apiUrl`). Todas as rotas e parâmetros
usados estão concentrados em `src/app/core/services/movie.service.ts`:

| Uso                              | Requisição                                                        |
|----------------------------------|-------------------------------------------------------------------|
| Lista paginada                   | `GET /api/movies?page=0&size=15[&year=2018][&winner=true]`        |
| Anos com mais de um vencedor     | `GET /api/movies/yearsWithMultipleWinners`                        |
| Estúdios com número de vitórias  | `GET /api/movies/studiosWithWinCount`                             |
| Intervalo de prêmios (min/max)   | `GET /api/movies/maxMinWinIntervalForProducers`                   |
| Vencedores de um ano             | `GET /api/movies/winnersByYear?year=2018`                         |

Se a documentação OpenAPI da API usar nomes diferentes, basta ajustar a constante `ENDPOINT`
e os métodos desse serviço.

## Estrutura
    src/app
    ├── core/            modelos, token da URL da API e MovieService
    ├── shared/          PanelComponent, PaginationComponent e helper loadRemote
    ├── features/
    │   ├── dashboard/   4 painéis independentes (cada um carrega seus próprios dados)
    │   └── movie-list/  tabela com filtros e paginação
    ├── app.routes.ts    rotas com lazy loading
    └── app.component.*  topo e menu
    src/testing          fixtures e dublê do MovieService usados nos testes

## Decisões
- Componentes standalone, signals e novo control flow (`@if`/`@for`) do Angular.
- Cada painel do dashboard trata seu próprio carregamento e erro; falha em um não afeta os outros.
- O filtro de ano na lista só é aplicado com 4 dígitos (ou campo vazio), após 400 ms sem digitar.
- Mudar qualquer filtro volta para a primeira página; requisições obsoletas são canceladas.
