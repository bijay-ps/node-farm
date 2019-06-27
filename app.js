const http = require('http');
const path = require('path');
const url =  require('url');
const fs = require('fs');

const tempOverview = fs.readFileSync(path.join(__dirname, 'templates', 'template-overview.html'), 'utf-8');
const tempCard = fs.readFileSync(path.join(__dirname, 'templates', 'template-card.html'), 'utf-8');
const tempProduct = fs.readFileSync(path.join(__dirname, 'templates', 'template-product.html'), 'utf-8');

const data = fs.readFileSync(path.join(__dirname, 'dev-data', 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
};

const httpServer = http.createServer((req, res) => {
    const pathName = req.url;
    // OVERVIEW
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    } else if (pathName === '/product') {

    // PRODUCT
        res.end('This is PRODUCT page');

    // API
    } else if (pathName === '/api') {
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
