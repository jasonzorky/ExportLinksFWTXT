// ==UserScript==
// @name         Exportar Links em TXT na FW
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Exporta links em TXT da div 'upload_links' na página 'https://filewarez.tv/showthread.php?t=*', ignorando os links que começam com 'vlc://'
// @author       JasonZorky
// @match        https://filewarez.tv/showthread.php?t=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function exportLinks(event) {
        event.preventDefault();
        const links = document.querySelectorAll('#upload_links a:not([href^="vlc://"])');
        const text = `${location.href}\n${[...links].map(link => link.href).join('\n')}`;
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'UPlinksFW.txt';
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    }

    const button = document.createElement('button');
    button.textContent = 'Exportar Links';
    const linkManageDivs = document.querySelectorAll('.link_manage');
    const linkManageDiv = linkManageDivs[3];
    linkManageDiv.parentNode.insertBefore(button, linkManageDiv);
    button.addEventListener('click', exportLinks);
})();
