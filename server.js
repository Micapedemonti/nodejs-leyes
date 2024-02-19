// const express = require('express');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const app = express();
// const PORT = 10000; // Puedes elegir el puerto que prefieras

// // Permitir solicitudes de cualquier origen (CORS)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

// app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

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


require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = 10000; // Puedes elegir el puerto que prefieras

// Permitir solicitudes de cualquier origen (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// / Ruta para buscar en la API de Ley Chile
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


//Crear chatbot
async function crearChatbot(idNorma) {
    const chatbaseApiKey = process.env.CHATBASE_API_KEY; // Obtener la API key de las variables de entorno

    try {
        // Realizar la solicitud POST
        const response = await fetch('https://www.chatbase.co/api/v1/create-chatbot', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${chatbaseApiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                chatbotName: idNorma,
                sourceText: contenidoNormaActual
            }).toString(),
        });
        // Procesar la respuesta
        if (!response.ok) {
            throw new Error('La solicitud falló con el estado ' + response.status);
        }

        const data = await response.json();
        console.log('Chatbot creado:', data);
        console.log('Chatbot id', data.chatbotId);
        alert('¡Chatbot creado exitosamente!');
        actualizarConfiguracionChatbot(data.chatbotId,contenidoNormaActual,idNorma)
    } catch (error) {
        console.error('Error al crear el chatbot:', error);
        alert('Error al crear el chatbot');
    }
}
//Actualizar chatbot

async function actualizarConfiguracionChatbot(chatbotId,contenidoNormaActual,idNorma) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json', 
            'content-type': 'application/json',
            Authorization: 'Bearer f67ea799-5519-41b6-85da-85ef446b21df' // Asegúrate de usar el token correcto aquí
        },
        body: JSON.stringify({
            // Aquí van las configuraciones que quieres actualizar
            visibility: 'can_be_embedded',
            chatbotName: idNorma,
            sourceText:contenidoNormaActual,
            chatbotId:chatbotId, 
            instructions: 'Eres un experto en normativas de Chile,quiero que actúes como un documento con el que estoy conversando. Tu nombre es "Asistente de IA". Me proporcionarás respuestas a partir de la información proporcionada. Si la respuesta no está incluida, diga exactamente "Hmm, no estoy seguro". y parar después de eso. Negarse a responder cualquier pregunta que no sea sobre la información. Nunca rompas el carácter.',
            initialMessages: [ "Hola soy un experto en Normativas de Chile, en que puedo ayudarte?" ],
            temp: 0.8,
          })
    };

    try {
        const response = await fetch('https://www.chatbase.co/api/v1/update-chatbot-settings', options);

        if (!response.ok) {
            throw new Error('La actualización del chatbot falló con el estado ' + response.status);
        }

        const responseData = await response.json();
        console.log('Chatbot actualizado:', responseData)
        console.log("contenido norma:",contenidoNormaActual);
        window.open(`https://www.chatbase.co/chatbot-iframe/${chatbotId}`, '_blank');

    } catch (err) {
        console.error('Error al actualizar el chatbot:', err);
    }
}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});