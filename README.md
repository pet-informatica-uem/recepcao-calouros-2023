# Site da Recepção de Calouros de 2022

Este projeto utiliza Sass e a biblioteca gulp.js. Arquivos na pasta `css` e o script `js/all.js` são gerados pelo gulp a partir do código na pasta `scss` e na pasta `js/scripts` respectivamente e não devem ser modificados diretamente.

## Configurando

Certifique-se de que possui instalados npm e Node.js de versões recentes em seu sistema.

Em seguida, abra um terminal e execute os seguintes comandos:

1. `git clone https://github.com/pet-informatica-uem/recepcao-calouros-2023.git`
2. `cd ./recepcao-calouros-2023`
3. `npm install`

Para desenvolver o site, abra a pasta do repositório e execute

4. `npx gulp`

Em seguida, acesse [https://localhost:3000/] em seu navegador. As páginas serão automaticamente atualizadas conforme os arquivos forem sendo modificados. O comando também compila as fontes Sass para arquivos .css.