# Desafio Popup e Home Page

-   Desafio feito durante a capacitação M3 Academy da empresa M3 Ecommerce. O desafio era desenvolver um Popup dentro de uma template de CMS da VTEX que aparecesse a cada 7 dias a partir do momento que o usuário o fechasse.

## Principal pasta para análise

-   src/arquivos/components/Popup

## Requisitos

-   Nodejs >= 10.13.0 - recomendo usar o nvm para gerenciar suas versões do nodejs (NVM)[https://github.com/coreybutler/nvm-windows/releases]

## Tarefas Gulp

-   `npm run local` - Ativa um server local e assiste/atualiza mudanças nos arquivos ( html, scss, js e img ), ultilizado para desenvolvimento local.
-   `npm run local:fast` - Ativa um server local e assiste/atualiza mudanças nos arquivos ( html, scss, js e img ), ultilizado para desenvolvimento local. Porem utiliza o sucrase para uma build mais rapida e leve, no qual pode ser util em projetos muito grandes ou em computadores mais fracos.
-   `npm run dev` - Ativa um server local e assiste/atualiza mudanças nos arquivos ( scss, js e img ), ultilizado para desenvolvimento onde o template está.
-   `npm run dev:fast` - Ativa um server local e assiste/atualiza mudanças nos arquivos ( scss, js e img ), ultilizado para desenvolvimento onde o template está. Porem utiliza o sucrase para uma build mais rapida e leve, no qual pode ser util em projetos muito grandes ou em computadores mais fracos.
-   `npm run prod` - Realiza build para implantação na vtex
