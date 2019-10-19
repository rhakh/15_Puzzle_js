const express = require('express');
const bodyParser = require('body-parser');
const solver = require('./src/NPuzzleSolver.js');
const app = express();

app.use(bodyParser.json());

app.get('/index.html', (request, response) => response.sendFile(`${__dirname}/webPages/index.html`));
app.get('/style.css', (request, response) => response.sendFile(`${__dirname}/webPages/style.css`));
app.get('/webScripts.js', (request, response) => response.sendFile(`${__dirname}/webPages/webScripts.js`));
app.get('/favicon.ico', (request, response) => response.sendFile(`${__dirname}/webPages/favicon.ico`));
app.get('/', (request, response) => response.sendFile(`${__dirname}/webPages/index.html`));

function constrSolution(path) {
    let objToSend = {};
    let jsonStr;

    objToSend.messageType = 1;
    objToSend.movements = JSON.stringify(path);
    jsonStr = JSON.stringify(objToSend);

    return (jsonStr);
}

app.post('/message', (request, response) => {
    const postBody = request.body;

    console.log("Request from client: ", JSON.stringify(postBody));

    let path = solver(JSON.parse(postBody.map));
    let solution = constrSolution(path);
    console.log("Response to client: ", solution);
    
    // construct response
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(solution);
    response.end();
});

app.listen(8080, () => console.log('Application running on port 8080, go to http://localhost:8080'));