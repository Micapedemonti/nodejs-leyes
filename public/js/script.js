// // 
// let contenidoNormaActual = "";
// document.getElementById('searchForm').addEventListener('submit', function(e) {
//     e.preventDefault(); // Evitar el envío del formulario de manera tradicional
//     var searchTerm = document.getElementById('searchTerm').value;
//     var url = `http://localhost:10000/proxy?cadena=${encodeURIComponent(searchTerm)}`;

//     fetch(url)
//         .then(response => response.text())
//         .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
//         .then(data => {
//             const normas = data.getElementsByTagName("Norma");
//             let html = "<ul>";
//             for (let i = 0; i < normas.length; i++) {
//                 const idNorma = normas[i].getElementsByTagName("IdNorma")[0].textContent;
//                 const tituloNorma = normas[i].getElementsByTagName("TituloNorma")[0].textContent;
//                 const fechaPublicacion = normas[i].getElementsByTagName("FechaPublicacion")[0].textContent;
//                 const urlNorma = normas[i].getElementsByTagName("Url")[0].textContent.replace("&amp;", "&");
                
//                 html += `<li>
//                             <h3>${tituloNorma}</h3>
//                             <p>ID de la Norma: ${idNorma}</p>
//                             <p>Fecha de Publicación: ${fechaPublicacion}</p>
//                             <p><a href="${urlNorma}" target="_blank">Ver Documento</a></p>
//                             <button onclick="accederAlDocumento('${idNorma}')">Acceder al documento</button>     
//                                 </li>`;
//             }
//             html += "</ul>";
//             document.getElementById('results').innerHTML = html;
//              // Vaciar el input después de mostrar los resultados
//              document.getElementById('searchTerm').value = ""; // E

//         })
//         .catch(error => console.error('Error al realizar la solicitud:', error));
// });

// function accederAlDocumento(idNorma,tituloNorma) {
//     const url = `http://localhost:10000/contenidoNorma?idNorma=${idNorma}`;

//     fetch(url)
//         .then(response => response.text())
//         .then(str => {
//             const parser = new DOMParser();
//             const xml = parser.parseFromString(str, "text/xml");
//             let html = `<div class="norma-content">`;
//             let contenidoNorma = "";
                

// // Obtener el título de la norma como texto
//     const tituloNormaElement = xml.querySelector("TituloNorma");
//     const tituloNormaTexto = tituloNormaElement ? tituloNormaElement.textContent : "Sin título";
//             // Título de la norma
//             const tituloNorma = xml.querySelector("TituloNorma");
//             if (tituloNorma) {
//                 html += `<h2>${tituloNorma.textContent}</h2>`;
//                 contenidoNorma += `${tituloNorma.textContent}\n\n`;
//             }

//             // Texto del encabezado
//             const encabezado = xml.querySelector("Encabezado Texto");
//             if (encabezado) {
//                 html += `<p>${encabezado.textContent}</p>`;
//                 contenidoNorma += `${encabezado.textContent}\n\n`;
//             }

//             // Estructuras funcionales (artículos)
//             const estructurasFuncionales = xml.querySelectorAll("EstructuraFuncional");
//             estructurasFuncionales.forEach(ef => {
//                 const articuloTexto = ef.querySelector("Texto");
//                 if (articuloTexto) {
//                     html += `<div><h3>Artículo:</h3><p>${articuloTexto.textContent}</p></div>`;
//                     contenidoNorma += `${articuloTexto.textContent}\n\n`;
//                  contenidoNormaActual = contenidoNorma;
                   
//                 }
//             });
      
            
//             html += `</div>`;
//             html += `<button   class ="btn-bot" onclick="crearChatbot('${idNorma}')">Bot</button>`; // Usa tituloNormaTexto

//             console.log("Contenido de la norma:", contenidoNormaActual);

//             document.getElementById('results').innerHTML = html;
          

//         })
//         .catch(error => console.error('Error al obtener el documento:', error));
// }

// //Crear chatbot
// async function crearChatbot(idNorma) {

//         try {
//             // Realizar la solicitud POST
//             const response = await fetch('https://www.chatbase.co/api/v1/create-chatbot', {
//                 method: 'POST',
//                 headers: {
//                     Authorization: 'Bearer f67ea799-5519-41b6-85da-85ef446b21df',
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 body: new URLSearchParams({
//                     chatbotName: idNorma,
//                     sourceText:contenidoNormaActual
//                 }).toString(),
//             });

//             // Procesar la respuesta
//             if (!response.ok) {
//                 throw new Error('La solicitud falló con el estado ' + response.status);
//             }

//             const data = await response.json();
//             console.log('Chatbot creado:', data);
//             console.log('Chatbot id', data.chatbotId);
//             alert('¡Chatbot creado exitosamente!');
//            actualizarConfiguracionChatbot(data.chatbotId,contenidoNormaActual,idNorma)
//         } catch (error) {
//             console.error('Error al crear el chatbot:', error);
//             alert('Error al crear el chatbot');
//         }

//     }


// //Actualizar chatbot

// async function actualizarConfiguracionChatbot(chatbotId,contenidoNormaActual,idNorma) {
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json', 
//             'content-type': 'application/json',
//             Authorization: 'Bearer f67ea799-5519-41b6-85da-85ef446b21df' // Asegúrate de usar el token correcto aquí
//         },
//         body: JSON.stringify({
//             // Aquí van las configuraciones que quieres actualizar
//             visibility: 'can_be_embedded',
//             chatbotName: idNorma,
//             sourceText:contenidoNormaActual,
//             chatbotId:chatbotId, 
//             instructions: 'Eres un experto en normativas de Chile,quiero que actúes como un documento con el que estoy conversando. Tu nombre es "Asistente de IA". Me proporcionarás respuestas a partir de la información proporcionada. Si la respuesta no está incluida, diga exactamente "Hmm, no estoy seguro". y parar después de eso. Negarse a responder cualquier pregunta que no sea sobre la información. Nunca rompas el carácter.',
//             initialMessages: [ "Hola soy un experto en Normativas de Chile, en que puedo ayudarte?" ],
//             temp: 0.8,
//           })
//     };

//     try {
//         const response = await fetch('https://www.chatbase.co/api/v1/update-chatbot-settings', options);

//         if (!response.ok) {
//             throw new Error('La actualización del chatbot falló con el estado ' + response.status);
//         }

//         const responseData = await response.json();
//         console.log('Chatbot actualizado:', responseData)
//         console.log("contenido norma:",contenidoNormaActual);
//         window.open(`https://www.chatbase.co/chatbot-iframe/${chatbotId}`, '_blank');

//     } catch (err) {
//         console.error('Error al actualizar el chatbot:', err);
//     }
// }


// 


let contenidoNormaActual = "";
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar el envío del formulario de manera tradicional
    var searchTerm = document.getElementById('searchTerm').value;
    var url = `http://localhost:10000/proxy?cadena=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const normas = data.getElementsByTagName("Norma");
            let html = "<ul>";
            for (let i = 0; i < normas.length; i++) {
                const idNorma = normas[i].getElementsByTagName("IdNorma")[0].textContent;
                const tituloNorma = normas[i].getElementsByTagName("TituloNorma")[0].textContent;
                const fechaPublicacion = normas[i].getElementsByTagName("FechaPublicacion")[0].textContent;
                const urlNorma = normas[i].getElementsByTagName("Url")[0].textContent.replace("&amp;", "&");
                
                html += `<li>
                            <h3>${tituloNorma}</h3>
                            <p>ID de la Norma: ${idNorma}</p>
                            <p>Fecha de Publicación: ${fechaPublicacion}</p>
                            <p><a href="${urlNorma}" target="_blank">Ver Documento</a></p>
                            <button onclick="accederAlDocumento('${idNorma}')">Acceder al documento</button>     
                                </li>`;
            }
            html += "</ul>";
            document.getElementById('results').innerHTML = html;
             // Vaciar el input después de mostrar los resultados
             document.getElementById('searchTerm').value = ""; // E

        })
        .catch(error => console.error('Error al realizar la solicitud:', error));
});

function accederAlDocumento(idNorma,tituloNorma) {
    const url = `http://localhost:10000/contenidoNorma?idNorma=${idNorma}`;

    fetch(url)
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");
            let html = `<div class="norma-content">`;
            let contenidoNorma = "";
                

// Obtener el título de la norma como texto
    const tituloNormaElement = xml.querySelector("TituloNorma");
    const tituloNormaTexto = tituloNormaElement ? tituloNormaElement.textContent : "Sin título";
            // Título de la norma
            const tituloNorma = xml.querySelector("TituloNorma");
            if (tituloNorma) {
                html += `<h2>${tituloNorma.textContent}</h2>`;
                contenidoNorma += `${tituloNorma.textContent}\n\n`;
            }

            // Texto del encabezado
            const encabezado = xml.querySelector("Encabezado Texto");
            if (encabezado) {
                html += `<p>${encabezado.textContent}</p>`;
                contenidoNorma += `${encabezado.textContent}\n\n`;
            }

            // Estructuras funcionales (artículos)
            const estructurasFuncionales = xml.querySelectorAll("EstructuraFuncional");
            estructurasFuncionales.forEach(ef => {
                const articuloTexto = ef.querySelector("Texto");
                if (articuloTexto) {
                    html += `<div><h3>Artículo:</h3><p>${articuloTexto.textContent}</p></div>`;
                    contenidoNorma += `${articuloTexto.textContent}\n\n`;
                 contenidoNormaActual = contenidoNorma;
                   
                }
            });
      
            
            html += `</div>`;
            html += `<button   class ="btn-bot" onclick="crearChatbot('${idNorma}')">Bot</button>`; // Usa tituloNormaTexto

            console.log("Contenido de la norma:", contenidoNormaActual);

            document.getElementById('results').innerHTML = html;
          

        })
        .catch(error => console.error('Error al obtener el documento:', error));
}

