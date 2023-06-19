// ==UserScript==
// @name         IMDB_FILEWAREZ_JUSTWATCH WIDGET COM OS STREAMINGS
// @namespace    JasonZorky
// @version      1.60
// @description  Adiciona Um WIDGET do Justwatch Com os Streamings Disponiveis Do Próprio Filme ou Série!
// @match        https://www.imdb.com/title/*
// @match        https://filewarez.tv/showthread.php?t=*
// @match        https://filewarez.tv/showthread.php?p=*
// @updateURL    https://raw.githubusercontent.com/jasonzorky/ScriptsFW/master/WidgetJustwatchFW.user.js
// @downloadURL  https://raw.githubusercontent.com/jasonzorky/ScriptsFW/master/WidgetJustwatchFW.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// ==/UserScript==

// CÓDIGO PARA ADICIONAR A BARRA DE STREAMINGS EM filewarez.tv
(function() {
    'use strict';

    const imdbRegex = /data-title="(tt\d+)"/; // Extrai o ID do IMDb do atributo data-title
    const match = document.documentElement.innerHTML.match(imdbRegex);

    if (match) {
        const imdb = match[1];
        console.log(`O ID DO IMDB OBTIDO NA FILEWAREZ É: ${imdb}`);

        // Faz uma consulta na API do IMDb para obter o tipo de título
        fetch(`https://corsproxy.io/?https://v3.sg.media-imdb.com/suggestion/z/${imdb}.json`)
            .then(response => response.json())
            .then(data => {
                const type = data.d[0].qid;
                console.log(`É FILME OU SÉRIE? ${type}`);

                // Faz o Mapeamento do tipo de título para 'movie' ou 'show'
                const TipoTitulo = type === 'movie' ? 'movie' : 'show';

                fetch(`https://widget-justwatch.jztools.hair/?imdb=${imdb}&TipoTitulo=${TipoTitulo}`)
                    .then(response => response.text())
                    .then(html => {
                        const ElementFW = document.querySelector('#postador_titleinfo .blockrow:last-child'); // Última classe 'blockrow' dentro da div com id 'postador_titleinfo'
                        if (ElementFW) {
                            const divBlockRow = document.createElement('div');
                            divBlockRow.className = 'blockrow';
                            divBlockRow.innerHTML = '<dt>Streamings disponíveis para esse título logo abaixo</dt>';

                            const div = document.createElement('div');
                            div.innerHTML = html;
                            const jwWidget = div.querySelector('#jw-widget,#message'); // Obtem a div 'jw-widget' ou '#message' do conteúdo HTML

                            // Adiciona estilos CSS
                            const cssStyles = document.createElement('style');
                            cssStyles.innerHTML = `
                                #message {
                                    padding: 0.5em 1.6em;
                                    padding-top: initial;
                                    display: inline-block;
                                    position: relative;
                                    top: 3px;
                                    font-size: 65%;
                                }
                                .jw-offer {
                                    display: inline-block;
                                    text-align: center;
                                }
                                .jw-offer-label {
                                    margin-bottom: 0.4em;
                                    text-align: center;
                                }
                                .jw-package-icon {
                                    width: 1.8em;
                                    height: 2em;
                                }
                                #jw-widget {
                                    display: initial;
                                    padding: 0.5em 1em;
                                    overflow: auto;
                                    position: relative;
                                }
                                .jw-offer-label {
                                    color: #0a0a0a;
                                    font-size: 50%;
                                }
                            `;

                            // Insere o novo bloco e o widget Justwatch na página
                            ElementFW.after(divBlockRow);
                            divBlockRow.after(jwWidget);
                            document.head.appendChild(cssStyles);
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao obter o resultado da API do Justwatch!', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao obter a informação se é filme ou série no IMDb!', error);
            });
    } else {
        console.error('Erro ao obter o ID do IMDb na FILEWAREZ na classe imdbRatingPlugin com o valor do data-title');
    }
})();

// CÓDIGO PARA ADICIONAR A BARRA DE STREAMINGS EM imdb.com
(function() {
    'use strict';

    const imdbRegex = /\/title\/(tt\d+)\//; // Expressão regular para extrair o ID do IMDb da URL
    const match = window.location.href.match(imdbRegex);
    if (match) {
        const imdb = match[1];
        console.log(`O ID DO IMDB OBTIDO NO PRÓPRIO SITE É: ${imdb}`);

        // Fazer uma consulta na API do IMDb para obter o tipo de título
        fetch(`https://corsproxy.io/?https://v3.sg.media-imdb.com/suggestion/z/${imdb}.json`)
            .then(response => response.json())
            .then(data => {
                const type = data.d[0].qid;
                console.log(`É FILME OU SÉRIE NO IMDb? ${type}`);

                // Mapear o tipo de título para 'movie' ou 'show'
                const TipoTitulo = type === 'movie' ? 'movie' : 'show';

                fetch(`https://widget-justwatch.jztools.hair/?imdb=${imdb}&TipoTitulo=${TipoTitulo}`)
                    .then(response => response.text())
                    .then(html => {
                        const ElementFW2 = document.querySelector('.sc-385ac629-3.kRUqXl');
                        const div = document.createElement('div');
                        div.innerHTML = html;
                        const jwWidget = div.querySelector('#jw-widget,#message'); // Obter a div 'jw-widget' do conteúdo HTML

                        // Adicionar estilos CSS
                        const cssStyles = document.createElement('style');
                        cssStyles.innerHTML = `
                            #message {
                            padding: 0.5em 1.6em;
                            padding-top: initial;
                            }

                            .jw-offer {
                                display: inline-block;
                            }
                            .jw-offer-label {
                                margin-bottom: 0.4em;
                                text-align: center;
                            }
                            .jw-package-icon {
                                border: 1px solid transparent;
                                width: 35px;
                                height: 40px;
                            }
                            #jw-widget {
                                display: inline-block;
                                padding: 0.5em 1em;
                                overflow: auto;
                                padding-left: 25px;
                            }
                            .jw-offer-label {
                                color: #d8d8d8;
                                font-size: 50%;
                            }
                        `;

                        // Inserir o widget Justwatch e os estilos na página do IMDb
                        ElementFW2.after(jwWidget);
                        document.head.appendChild(cssStyles);
                    })
                    .catch(error => {
                        console.error('Erro ao obter o resultado da API do Justwatch!', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao obter a informação, se é filme ou série no IMDb!', error);
            });
    } else {
        console.error('Erro ao obter o ID no site do IMDb');
    }
})();
