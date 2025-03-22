const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const opt = {
    'default': { 'folder': 'www', 'document': 'index.html', 'port': 8081, 'favicon': '' },
    'extensions': {
        'htm': 'text/html; charset=utf-8',
        'html': 'text/html; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'json': 'application/json; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'gif': 'image/gif',
        'jpg': 'image/jpg',
        'png': 'image/png',
        'ico': 'image/x-icon'
    }
};

// Função para determinar o tipo MIME do arquivo
function mimeType(fileName) {
    let extension = path.extname(fileName).slice(1);
    return opt.extensions[extension] || 'application/octet-stream';
}

// Função para definir a rota dos arquivos servidos
function router(request) {
    let pathname = url.parse(request.url).pathname;
    if (pathname === '/') pathname = '/' + opt.default.document;
    return path.join(__dirname, opt.default.folder, pathname);
}

// Criar servidor HTTP
const server = http.createServer((request, response) => {
    console.log(`Request para ${request.url}`);

    const filename = router(request);

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error(`Erro ao carregar: ${filename}`, err);
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Erro 404: Arquivo não encontrado');
            return;
        }
        response.writeHead(200, { 'Content-Type': mimeType(filename) });
        response.end(data);
    });
});

// Iniciar o servidor
server.listen(opt.default.port, () => {
    console.log(`Servidor rodando em http://localhost:${opt.default.port}`);
});
