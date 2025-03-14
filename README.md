# Calendário Financeiro

Este projeto é uma aplicação de calendário financeiro que permite aos usuários gerenciar suas finanças de forma eficiente. A aplicação possui uma interface amigável que facilita a visualização e o registro de lançamentos financeiros.

## Estrutura do Projeto

O projeto contém os seguintes arquivos:

- **public/index.html**: Este arquivo contém a estrutura HTML da aplicação, incluindo a interface do usuário para o calendário financeiro, botões de navegação e um formulário para novos lançamentos financeiros.

- **public/styles.css**: Este arquivo contém os estilos CSS que definem a aparência da aplicação, incluindo layout, cores e fontes.

- **public/script.js**: Este arquivo contém o código JavaScript que gerencia a lógica da aplicação, como a manipulação de eventos, a renderização do calendário e a adição de novos lançamentos financeiros.

- **create_database.js**: Este arquivo contém o script para criar a base de dados SQLite.

- **server.js**: Este arquivo contém o código do servidor Express que gerencia as requisições e a comunicação com a base de dados.

## Como Usar

1. Clone o repositório para sua máquina local.
2. Navegue até a pasta do projeto.
3. Instale as dependências necessárias:
    ```sh
    npm install express sqlite3 body-parser
    ```
4. Execute o script para criar a base de dados:
    ```sh
    node create_database.js
    ```
5. Inicie o servidor:
    ```sh
    node server.js
    ```
6. Abra o arquivo `public/index.html` em um navegador para visualizar a aplicação.
7. Utilize os botões para navegar entre os meses e anos, e adicione novos lançamentos financeiros conforme necessário.

## Contribuição

Sinta-se à vontade para contribuir com melhorias e correções. Para isso, faça um fork do repositório e envie um pull request com suas alterações.

## Licença

Este projeto está licenciado sob a MIT License.