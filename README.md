<h1 align="center" >
  <img alt="GoStack" src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/bootcamp-header.png" width="100px" /> <br />
  Bootcamp 9.0 da <a text-decoration="none" href="https://rocketseat.com.br">:rocket: Rockeseat</a> - Desafio 3: Gympoint Backend
</h1>
<h2 align="center">
    <img alt="GoStack" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" width="120px" />
</h2>

<blockquote align="center">“Feito é melhor doque perfeito!"</blockquote>

<p align="center">
  <a href="https://github.com/lucasssartori?tab=followers">
    <img alt="GitHub Lucas Sartori" src="https://img.shields.io/github/followers/lucasssartori?style=social">
  </a>

  <a href="https://github.com/lucasssartori/gympointbackend/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/lucasssartori/gympointbackend?style=social">
  </a>
  <a href="https://github.com/lucasssartori/gympointbackend/forks/">
    <img alt="Stargazers" src="https://img.shields.io/github/forks/lucasssartori/gympointbackend?style=social">
  </a>

  <a href="https://github.com/lucasssartori/gympointbackend/watchers">
    <img alt="watchers" src="https://img.shields.io/github/watchers/lucasssartori/gympointbackend?style=social">
  </a>
</p>

<p align="center">
  <a href="#1---sobre-o-módulo">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#2---tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#3---funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#4---apresentação">Apresentação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#5---executar-aplicação">Executar aplicação</a>
</p>

## Sobre o desafio

Bootcamp 9.0 da Rocketseat - Desafio 3: Gympoint Backend

Neste desafio foi desenvolvido um backend para uma aplicação para a administração de academias.

A aplicação web que consome este backend está no seguinte repositório: https://github.com/lucasssartori/gympointweb


## 2 - Tecnologias

O Projeto desenvolvido em NodeJS com aplicação de diversas tecnologias e bibliotecas.

  - postgres - Banco de Dados Relacional
  - Redis - Banco de dados NoSQL
  - bcryptjs - Criptografia
  - bee-queue - Criação de serviços na aplicação com o uso de Redis
  - cors - Acesso e segurança das APIs da aplicação
  - date-fns - Manipulação de datas
  - dotenv - Variaveis de ambiente
  - express - Desenvolvimento de Apis
  - jsonwebtoken - Autenticação JWT
  - nodemailer - Enviao de e-mails
  - express-handlebars - Desenvolvimento de Layout de emails
  - nodemailer-express-handlebars - Desenvolvimento de Layout de emails
  - pg - Para utilização do banco de dados postgress
  - pg-hstore - Para utilização do banco de dados postgress
  - sequelize - Mapeamento Objeto Relacional
  - yup - Validação de dados.
  - eslint - Padronização de código
  - nodemon - Statrt e restart automatico da aplicação durante o desenvolvimento.
  - prettier - Formatador de código
  - sucrase - Utilização do padrão de sintaxe ES6
  - sentry - Tratamento de exceções de produção
  - youch - Tratamento das mensagens para o  ambiente de desenvolvimento e produção

## 3 - Funcionalidades
  - Api para sessão de administrador da aplicação com JWT.
  - Middleware de autenticação de administrador.
  - Apis para criação, atualização alunos na academia.
  - Apis para CRUD de planos ofertados pela academia.
  - Api para realização de checkin de alunos matriculados na academia.
  - Api para consulta dos checkins realizados pelos alunos matriculados na academia.
  - Apis para CRUD de matriculas dos alunos na academia.
  - Fila para envio de e-mails para os alunos matriculados.
  - Apis para os alunos criarem e consultarem solicitação de ajuda para os administradores da academia.
  - Apis para para os administradores consultarem e responderem o pedido de ajuda dos alunos.
  - Fila de e-mail para o envio das respostas aos alunos da academia.

## 4 - Apresentação

<p> Video abaixo aprensenta de frma rápida as funcionalidades da aplicação. </p>


## 5 - Executar aplicação

:heavy_check_mark: Realizar um clone desse repositório. <br />
:heavy_check_mark: Entre na pasta do projeto via linha de comando. <br />
:heavy_check_mark: Executar o comando yarn para instalar as dependências. <br />
:heavy_check_mark: Criar um constainer no docker do banco de dados do banco de dados postgress através do comando: docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 postgres<br />
:heavy_check_mark: Criar um constainer no docker do banco de dados do banco de dados NOSQL Redis através do comando: docker run --name redisgympoint -p 6379:6379 redis-alpine<br />
:heavy_check_mark: Executar o comando "yarn sequelize db:migrate" para criação das tabelas. <br />
:heavy_check_mark: Executar o comando "yarn sequelize db:seed:all" para criação de conteudos nas tabelas. <br />
:heavy_check_mark: Executar o comando "yarn queue" em um terminal iniciar a fila de execuções. <br />
:heavy_check_mark: Executar o comando "yarn dev" em outro terminal iniciar o backend. <br />
:heavy_check_mark: Criar o frontend conforme indicado no repositório: https://github.com/lucasssartori/gympointbackend. <br />

:heavy_exclamation_mark: Obs: Deve-se ter instalado as aplicações yarn e docker.
