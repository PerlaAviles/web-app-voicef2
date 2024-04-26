document.addEventListener('DOMContentLoaded', function () {
    const resultDiv = document.getElementById('result');

    // Comprobar si el navegador admite la API de reconocimiento de voz
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        // Definir configuraciones del reconocimiento de voz
        // Configurar el idioma a español
        recognition.lang = 'es-ES';

        // Escuchar cuando se haya detectado un resultado
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Transcripción de voz:', transcript);

            // Ejecutar acciones según el comando de voz
               // Ejecutar acciones según el comando de voz
            if (transcript.includes('abrir nueva pestaña') && !nuevaPestanaAbierta) {
                abrirNuevaPestana();
                nuevaPestanaAbierta = true; // Actualizar la bandera
            } else if (transcript.includes('ir a google')) {
                const url = obtenerUrl(transcript);
                if (url) {
                    window.location.href = 'https://www.google.com';
                    resultDiv.innerHTML = '<p>Ir a <strong>Google</strong>.</p>';
                } else {
                    resultDiv.innerHTML = '<p>Error: No se proporcionó una URL válida.</p>';
                }
            } else if (transcript.includes('cerrar pestaña')) {
                window.close();
                resultDiv.innerHTML = '<p>Pestaña cerrada.</p>';
            } else if (transcript.includes('cerrar navegador')) {
                window.open('', '_self', '');
                window.close();
                resultDiv.innerHTML = '<p>Navegador cerrado.</p>';
            } else if (transcript.includes('tamaño')) {
                const palabras = transcript.split(' ');
                const indexTamaño = palabras.indexOf('tamaño');

                // Obtener el tamaño de letra especificado en el comando
                const tamaño = parseInt(palabras[indexTamaño + 1]);

                // Aplicar el tamaño de letra al elemento de controlTexto
                if (!isNaN(tamaño)) {
                    document.body.style.fontSize = tamaño + 'px';
                    resultDiv.innerHTML = `<p>Tamaño de letra cambiado a <strong>${tamaño}px</strong>.</p>`;
                } else {
                    resultDiv.innerHTML = '<p>Error: No se proporcionó un tamaño válido.</p>';
                }
            } else {
                resultDiv.innerHTML = '<p>Comando no reconocido.</p>';
            }

            // Enviar el comando de voz a MockAPI junto con la fecha y hora actual
            enviarComandoAVoz(transcript, obtenerFechaHoraActual());
        };

        // Escuchar errores
        recognition.onerror = function (event) {
            console.error('Error de reconocimiento de voz:', event.error);
            resultDiv.innerHTML = '<p>Error al procesar la orden de voz. Por favor, inténtalo de nuevo.</p>';
        };

        // Iniciar el reconocimiento de voz cuando se haga clic en cualquier parte del documento
        document.body.addEventListener('click', function () {
            recognition.start();
            resultDiv.innerHTML = '<p>Escuchando... Di tu orden.</p>';
        });
    } else {
        // Si el navegador no admite la API de reconocimiento de voz, mostrar un mensaje de error
        resultDiv.innerHTML = '<p>Tu navegador no admite la API de reconocimiento de voz. Por favor, actualízalo a una versión más reciente.</p>';
    }
});

// Función para obtener la URL de un comando
function obtenerUrl(transcript) {
    const palabras = transcript.split(' ');
    const indexIrA = palabras.indexOf('ir') + 1;
    return palabras.slice(indexIrA).join(' ');
}

// Función para obtener la fecha y hora actual en el formato deseado
function obtenerFechaHoraActual() {
    const fechaHora = new Date().toISOString().split('T');
    return {
        fecha: fechaHora[0],
        hora: fechaHora[1].slice(0, 8) // Para obtener solo la hora en formato HH:MM:SS
    };
}

// Función para enviar el comando de voz a MockAPI
function enviarComandoAVoz(comando, fechaHora) {
    fetch('https://662752e1b625bf088c07f777.mockapi.io/webappvoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comando: comando,
            fecha: fechaHora.fecha,
            hora: fechaHora.hora
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar el comando de voz a MockAPI');
        }
        console.log('Comando de voz enviado correctamente a MockAPI');
    })
    .catch(error => console.error('Error:', error));
}
