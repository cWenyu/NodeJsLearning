const fs = require('fs'); //file system module
const http = require('http');
const url = require('url');

//要用绝对路径 
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

//create a server
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname; //parse url into a object 
    const id = url.parse(req.url, true).query.id;

    //product overview
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace(/{%CARDS%/g, cardsOutput);
                res.end(overviewOutput);
            });
        });

    }

    //laptop detail
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            res.end(replaceTemplate(data, laptop));
        });
    }

    // images
    else if ((/\.(jpg|jpge|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        })
    }

    //not found url
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('url not found');
    }


});

//keep listening 8080 port localhost
server.listen(8080, '127.0.0.1', () => {
    console.log('listening');
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}