'use strict';

const ansi = require('ansi-colors');
/**
 * Imprime mensagens de Log do sistema
 * @param {String} type 
 * @param {Object} infos 
 * @returns 
 */
function log(type, infos) {

    const lines = {
        'login': ansi.yellow(`[INFO] LOGANDO COM AS CREDENCIAIS ${ansi.yellowBright(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'erro-conexao': ansi.red(`[ERROR] ERRO DE CONEXÃO ${ansi.yellow(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'id-curso': ansi.cyan(`[INFO] ID DO CURSO: ${ansi.blue(`${infos.id}`)} | APELIDO: ${ansi.blue(`${infos.apelido}`.toUpperCase())} | NOME: ${ansi.blue(`${infos.nome}`.toUpperCase())} | TEMPO DE VÍDEO: ${ansi.blue(`${infos.tempoVideo}`)} MINUTOS`),
        'titulo-download': ansi.green(`[INFO] TÍTULO DO DOWNLOAD: ${ansi.greenBright(`${infos.titulo}`.toUpperCase())}`),
        'download-aula': ansi.cyan(`[INFO] DOWNLOAD DA AULA: ${ansi.cyanBright(`${infos.aula}`.toUpperCase())} | ID DA AULA: ${ansi.cyanBright(`${infos.id}`)}`),
        'logado-sucesso': ansi.green(`[INFO] LOGADO COM SUCESSO COM AS CREDENCIAIS ${ansi.greenBright(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'titulo-baixado': ansi.green(`[INFO] TÍTULO BAIXADO: ${ansi.greenBright(`${infos.formacao}`.toUpperCase())} | ${ansi.greenBright(`${infos.curso}`.toUpperCase())} | ${ansi.greenBright(`${infos.aula}`.toUpperCase())}`),
        'baixando-video': ansi.yellow(`[INFO] BAIXANDO VÍDEO: ${ansi.yellowBright(`${infos.titulo}`.toUpperCase())} | ${infos.segmentoAtual} de ${infos.totalDeSegmentos} segmentos (${(infos.segmentoAtual / infos.totalDeSegmentos * 100).toFixed(2)}%) ${(infos.baixado / 1024 / 1024).toFixed(2)}MB baixados`)
    };

    console.log(lines[type]);

    return;

}

module.exports = {
    log
};