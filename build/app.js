
        document.getElementById('searchForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Evitar el envío del formulario de manera tradicional
            var searchTerm = document.getElementById('searchTerm').value;
            var url = `http://localhost:3000/proxy?cadena=${encodeURIComponent(searchTerm)}`;

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
                })
                .catch(error => console.error('Error al realizar la solicitud:', error));
        });

        function accederAlDocumento(idNorma) {
            const url = `http://localhost:3000/contenidoNorma?idNorma=${idNorma}`;

            fetch(url)
                .then(response => response.text())
                .then(str => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(str, "text/xml");
                    let html = `<div class="norma-content">`;

                    // Título de la norma
                    const tituloNorma = xml.querySelector("TituloNorma");
                    if (tituloNorma) {
                        html += `<h2>${tituloNorma.textContent}</h2>`;
                    }

                    // Texto del encabezado
                    const encabezado = xml.querySelector("Encabezado Texto");
                    if (encabezado) {
                        html += `<p>${encabezado.textContent}</p>`;
                    }

                    // Estructuras funcionales (artículos)
                    const estructurasFuncionales = xml.querySelectorAll("EstructuraFuncional");
                    estructurasFuncionales.forEach(ef => {
                        const articuloTexto = ef.querySelector("Texto");
                        if (articuloTexto) {
                            html += `<div><h3>Artículo:</h3><p>${articuloTexto.textContent}</p></div>`;
                        }
                    });

                    html += `</div>`;
                    document.getElementById('results').innerHTML = html;
                })
                .catch(error => console.error('Error al obtener el documento:', error));
        }
