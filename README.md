# Front-end SPA - Cadastro de Usuários

Este é o projeto front-end de uma aplicação de Cadastro de Usuários desenvolvido como SPA (Single Page Application) utilizando apenas HTML, CSS e JavaScript puro.

## Funcionalidades

- Cadastro de novo usuário  
- Validação de campos (nome, departamento, usuário, senha)  
- Listagem de usuários em cards interativos  
- Edição de usuário existente  
- Exclusão de usuário  
- Consumo de todas as rotas da API  

## Tecnologias Utilizadas

- HTML5  
- CSS3  
- JavaScript (ES6)  

## Como Executar

1. Clonar o repositório:

git clone <URL_DO_REPOSITORIO_FRONTEND>
cd "01 - Projeto"

2. Abrir o arquivo `index.html` diretamente no navegador.

3. Certifique-se que a API (pasta api_flask) esteja rodando na porta 5001.

## Integração com a API

Consome as rotas:

- GET /usuarios/listarusuarios  
- POST /usuarios/cadastrodeusuario  
- GET /usuarios/<id>/buscarusuario  
- PUT /usuarios/<id>/atualizarusuario  
- DELETE /usuarios/<id>/deletarusuario  

## Observações

- Não utiliza frameworks de SPA;  
- Nenhuma dependência externa;  
- Responsivo para dispositivos móveis.
