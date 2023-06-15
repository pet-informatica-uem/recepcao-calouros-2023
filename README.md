# Site da Recepção de Calouros de 2023

Este projeto utiliza Sass e Webpack. Os arquivos são compilados e empacotados por esta ferramenta.

## Configurando

Certifique-se de que possui instalados npm e Node.js de versões recentes em seu sistema.

Em seguida, abra um terminal e execute os seguintes comandos:

1. `git clone https://github.com/pet-informatica-uem/recepcao-calouros-2023.git`
2. `cd ./recepcao-calouros-2023`
3. `npm install`

Para desenvolver o site, abra a pasta do repositório e execute

4. `npm run start`

Em seguida, acesse [https://localhost:3000/] em seu navegador. As páginas serão automaticamente atualizadas conforme os arquivos forem sendo modificados. O comando também compila as fontes Sass para arquivos .css.

## Compilação

Para compilar o site você deve executar o comando

    $ npm run build

As fontes serão processadas e compiladas para a pasta `/dist`.

Para visualizar o site em um navegador, é necessário servir os arquivos por meio de um servidor, o que pode ser feito, por exemplo, executando o comando a seguir na pasta raiz do projeto:

    $ python3 -m http.server -d dist/

Em seguida, basta acessar o endereço `localhost:8080` em um navegador moderno.

## Licença

O código-fonte neste repositório é disponibilizado sob a licença MIT, que pode ser lida no arquivo LICENSE. Os arquivos gráficos (imagens, vídeos, modelos, áudios) do projeto que não representam logomarcas estão disponibilizados no domínio público. Os demais arquivos, inclusive logomarcas, foram utilizados com autorização expressa.
