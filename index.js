'use strict';

const fs = require('fs');
const logger = require('./utils/logger');
const m3u8stream = require('m3u8stream');
const request = require('request');

require('dotenv').config();

const email = process.env.EMAIL;
const senha = process.env.SENHA;
const formacaoURL = process.env.FORMACAO_URL;
const formacaoNome = process.env.FORMACAO_NOME;

main();

/**
 * Função principal onde tudo acontece
 */
async function main() {
    criaPasta(formacaoNome);
    logger.log('login', { email, senha });
    const accessToken = await login(email, senha);

    if (!accessToken) {
        logger.log('erro-conexao', { email, senha });
        return;
    }

    logger.log('logado-sucesso', { email, senha });

    await getVideos(accessToken);
}

/**
 * Login na conta informada
 * @param {string} mail 
 * @param {string} senha 
 */
async function login(mail, senha) {
    let res = await httpRequest({
        url: 'https://cursos.alura.com.br/mobile/token',
        method: 'POST',
        body: `password=${senha}&client_secret=3de44ac5f5bccbcfba14a77181fbdbb9&client_id=br.com.alura.mobi&username=${mail}&grant_type=password`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'alura-mobi/android',
            'Host': 'cursos.alura.com.br',
            'Connection': 'Keep-Alive'
        }
    });

    if (res.body.includes('access_token'))
        return JSON.parse(res.body).access_token;

    return false;
}

/**
 * Envia requisição HTTP
 * @param {object} options 
 */
function httpRequest(options) {
    return new Promise(resolve => request(options, (error, response, body) => resolve({ error, response, body })));
}

/**
 * Retorna Array com as URLs dos cursos da formação
 * @param {string} accessToken 
 */
async function arrayURLCursos(accessToken) {
    let apelido = formacaoURL.split('/').at(-1);
    const url = `https://cursos.alura.com.br/api/${apelido}`;
    let res = await httpRequest({
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'alura-mobi/android',
            'Host': 'cursos.alura.com.br',
            'Authorization': `Bearer ${accessToken}`,
            'Connection': 'Keep-Alive'
        }
    });

    let formacao = JSON.parse(res.body);
    let passos = formacao.steps;
    let cursosURL = [];
    passos.forEach(passo => {
        passo.courses.forEach(curso => {
            cursosURL.push(curso.url);
        });
    });
    return cursosURL;
}

/**
 * Retorna objeto com todas as informações do curso
 * @param {string} accessToken 
 * @param {string} curso 
 */
async function infoCurso(accessToken, curso) {
    const apelido = curso.split('curso-online-').at(-1);
    let res = await httpRequest({
        url: `https://cursos.alura.com.br/mobile/v2/course/${apelido}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'alura-mobi/android',
            'Host': 'cursos.alura.com.br',
            'Authorization': `Bearer ${accessToken}`,
            'Connection': 'Keep-Alive'
        }
    });
    return JSON.parse(res.body);
}

/**
 * Cria pasta
 * @param {string} nomePasta
 */
function criaPasta(nomePasta) {
    if (!fs.existsSync(nomePasta)) {
        fs.mkdirSync(nomePasta);
    }
}

/**
 * Pega o link do video para download
 * @param {int} id 
 * @param {string} apelido 
 * @param {string} accessToken 
 */
async function retornaLinkVideo(id, apelido, accessToken) {
    let res = await httpRequest({
        url: `https://cursos.alura.com.br/course/${apelido}/task/${id}/video`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'alura-mobi/android',
            'Host': 'cursos.alura.com.br',
            'Authorization': `Bearer ${accessToken}`,
            'Connection': 'Keep-Alive'
        }
    });

    let video = JSON.parse(res.body)[0]; // Selecione o índice 1 se quiser diminuir a qualidade do vídeo
    return video.link;
}

/**
 * Faz download do video de acordo com a URL do .m3u8
 * @param {String} arquivo 
 * @param {String} url 
 * @param {String} titulo 
 */
async function downloadVideo(arquivo, url, titulo) {
    return new Promise((resolve, reject) => {
        const stream = m3u8stream(url);
        stream.pipe(fs.createWriteStream(arquivo));
        stream.on('progress', (segment, totalSegments, downloaded) => {
            logger.log('baixando-video', { titulo: titulo, segmentoAtual: segment.num, totalDeSegmentos: totalSegments, baixado: downloaded });
        });
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

async function getVideos(accessToken){
    // Esse conjunto de laços pega as URLs dos cursos, cria suas pastas
    // depois entra em cada curso, pegando suas aulas e criando as pastas
    // depois entrando em cada aula, para pegar as informações dos vídeos
    // e salva em formato .m3u8 como, vem do servidor da Alura
    let cursosURL = await arrayURLCursos(accessToken);
    let cursos = [];
    const promises = cursosURL.map(async (cursoURL, indice) => {
        let indiceStr = (indice + 1).toString();
        cursos[indice] = await infoCurso(accessToken, cursoURL);
        logger.log('id-curso', { id: cursos[indice].id, apelido: cursos[indice].slug, nome: cursos[indice].name, tempoVideo: cursos[indice].totalVideoTime });
        let nomeCurso = cursos[indice].name.replace(':', ' -');
        criaPasta(`${formacaoNome}/${indiceStr.padStart(2, '0')} - ${nomeCurso}`);
        for await (let titulo of cursos[indice].sections) {
            logger.log('titulo-download', { titulo: titulo.titulo });
            criaPasta(`${formacaoNome}/${indiceStr.padStart(2, '0')} - ${nomeCurso}/${titulo.position.toString().padStart(2, '0')} - ${titulo.titulo}`);
            for await (let [index, aula] of titulo.videos.entries()) {
                let nomeAula = aula.nome.replace(':', ' -');
                let url = await retornaLinkVideo(aula.id, cursos[indice].slug, accessToken);
                logger.log('download-aula', { aula: aula.nome, id: aula.id });
                await downloadVideo(`${formacaoNome}/${indiceStr.padStart(2, '0')} - ${nomeCurso}/${titulo.position.toString().padStart(2, '0')} - ${titulo.titulo}/${(index + 1).toString().padStart(2, '0')} - ${nomeAula}.mp4`, url, nomeAula);
                logger.log('titulo-baixado', { formacao: formacaoNome, curso: nomeCurso, aula: nomeAula });
            }
        }
    });

    await Promise.all(promises);
}