// const express = require('express');
// //configurar netlify
// const serverless = require('serverless-http')


// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const app = express();
// const PORT = 3000; // Puedes elegir el puerto que prefieras

// // Permitir solicitudes de cualquier origen (CORS)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

// // app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'
// app.use('/.netlify/functions/api',router);
// module.exports.handler = serverless(app)
// // Ruta para buscar en la API de Ley Chile
// app.get('/proxy', async (req, res) => {
//     const searchTerm = req.query.cadena;
//     const url = `https://www.leychile.cl/Consulta/obtxml?opt=61&cadena=${encodeURIComponent(searchTerm)}&cantidad=5`;

//     try {
//         const response = await fetch(url);
//         const data = await response.text();
//         res.send(data);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Error al obtener los datos');
//     }
// });

// // Nueva ruta para obtener el contenido de una norma específica por su ID
// app.get('/contenidoNorma', async (req, res) => {
//     const idNorma = req.query.idNorma;
//     const url = `https://www.leychile.cl/Consulta/obtxml?opt=7&idNorma=${idNorma}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.text();
//         res.send(data);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Error al obtener el contenido de la norma');
//     }
// });



// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
const express = require('express');
//configurar netlify
const serverless = require('serverless-http')


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = 3000; // Puedes elegir el puerto que prefieras

// Permitir solicitudes de cualquier origen (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// Ruta para buscar en la API de Ley Chile
app.get('/proxy', async (req, res) => {
    const searchTerm = req.query.cadena;
    const url = `https://www.leychile.cl/Consulta/obtxml?opt=61&cadena=${encodeURIComponent(searchTerm)}&cantidad=5`;

    try {
        const response = await fetch(url);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al obtener los datos');
    }
});

// Nueva ruta para obtener el contenido de una norma específica por su ID
app.get('/contenidoNorma', async (req, res) => {
    const idNorma = req.query.idNorma;
    const url = `https://www.leychile.cl/Consulta/obtxml?opt=7&idNorma=${idNorma}`;

    try {
        const response = await fetch(url);
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al obtener el contenido de la norma');
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

