const http = require('http');
const path = require('path');
const url =  require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(path.join(__dirname, 'templates', 'template-overview.html'), 'utf-8');
const tempCard = fs.readFileSync(path.join(__dirname, 'templates', 'template-card.html'), 'utf-8');
const tempProduct = fs.readFileSync(path.join(__dirname, 'templates', 'template-product.html'), 'utf-8');

const data = fs.readFileSync(path.join(__dirname, 'dev-data', 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);

const httpServer = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // OVERVIEW Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    // PRODUCT Page
    } else if (pathname === '/product') {
        res.writeHead(200, {'content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(data);
    // NOT FOUND
    } else {
        res.writeHead(404, {'content-type': 'text/html'});
        res.end('<h1>Page not found</h1>');
    }
});

httpServer.listen(3030, () => {
    console.log('Server listening on port 3030');
});
