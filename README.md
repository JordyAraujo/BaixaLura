# BaixaLura

![Node Version 16.13.1](https://img.shields.io/badge/node-v16.13.1-brightgreen)

Script para download das formações da Alura. É necessário possuir assinatura da plataforma para utilizar a ferramenta.

Baseado no [projeto](https://github.com/v4p0r/gengar) do [v4p0r](https://github.com/v4p0r), com a intenção de facilitar os estudos na plataforma. Os desenvolvedores da ferramenta não assumem nenhuma responsabilidade pelo uso indevido da mesma.

![Imgur](https://imgur.com/ARqIjga.png)

## Instalação

Primeiro é necessário clonar o projeto para executá-lo localmente:

```bash
git clone https://github.com/JordyAraujo/BaixaLura.git
cd BaixaLura
```

Depois, vá até o arquivo *.env.exemplo*, o renomeie para *.env* e preencha os dados solicitados:

```bash
# Credenciais
EMAIL="email@conta.alura.com"
SENHA="senhaAlura_123"

# URL da formação
FORMACAO_URL="https://cursos.alura.com.br/formacao-url-da-formacao"

# Nome da formação
FORMACAO_NOME="Nome da Formação"
```

Feito isso, a aplicação já está configurada e pode rodar.

Com o docker instalado e rodando na sua máquina, basta executar o comando:

```bash
docker-compose up --build
```
