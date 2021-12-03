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
        'login': ansi.yellow(`[DEBUG] LOGANDO COM AS CREDENCIAIS ${ansi.yellowBright(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'erro-conexao': ansi.red(`[INFO] ERRO DE CONEXÃO ${ansi.yellow(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'id-curso': ansi.cyan(`[INFO] ID DO CURSO: ${ansi.blue(`${infos.id}`)} | APELIDO: ${ansi.blue(`${infos.apelido}`.toUpperCase())} | NOME: ${ansi.blue(`${infos.nome}`.toUpperCase())} | TEMPO DE VÍDEO: ${ansi.blue(`${infos.tempoVideo}`)} MINUTOS`),
        'titulo-download': ansi.green(`[INFO] TÍTULO DO DOWNLOAD: ${ansi.greenBright(`${infos.titulo}`.toUpperCase())}`),
        'download-aula': ansi.cyan(`[INFO] DOWNLOAD DA AULA: ${ansi.cyanBright(`${infos.aula}`.toUpperCase())} | ID DA AULA: ${ansi.cyanBright(`${infos.id}`)}`),
        'logado-sucesso': ansi.green(`[INFO] LOGADO COM SUCESSO COM AS CREDENCIAIS ${ansi.greenBright(`${infos.email}:${infos.senha}`.toUpperCase())}`),
        'pegando-curso': ansi.yellow('[DEBUG] PEGANDO CURSO'),
        'parseando-curso': ansi.yellow('[DEBUG] PARSEANDO CURSO'),
        'titulo-baixado': ansi.yellow(`[DEBUG] TÍTULO BAIXADO: ${ansi.yellowBright(`${infos.titulo}`.toUpperCase())}`),
        'baixando-video': ansi.green(`[INFO] BAIXANDO VÍDEO: ${ansi.greenBright(`${infos.titulo}`.toUpperCase())} | ${infos.segmentoAtual} de ${infos.totalDeSegmentos} segmentos (${(infos.segmentoAtual / infos.totalDeSegmentos * 100).toFixed(2)}%) ${(infos.baixado / 1024 / 1024).toFixed(2)}MB baixados`)
    };

    console.log(lines[type]);
    return;

}

module.exports = {
    log
};