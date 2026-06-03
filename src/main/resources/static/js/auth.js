document.addEventListener('DOMContentLoaded', () => {

    const mensajeToast = sessionStorage.getItem('toast');

    if (mensajeToast) {
        mostrarToast(mensajeToast);
        sessionStorage.removeItem('toast');
    }

});

// Alternar visualmente entre Login y Registro usando clases de Tailwind
function conmutarVista(mostrarRegistro) {
    const loginSec = document.getElementById('loginSection');
    const regSec = document.getElementById('registerSection');

    if (mostrarRegistro) {
        loginSec.classList.add('hidden');
        regSec.classList.remove('hidden');
    } else {
        loginSec.classList.remove('hidden');
        regSec.classList.add('hidden');
    }
}

// 1. PETICIÓN ASÍNCRONA DE LOGIN
async function ejecutarLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardamos el token criptográfico y el nombre devuelto por el Backend
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario_nombre', data.nombre);

            // LOGICA DE REINTEGRACIÓN: Si el usuario rebotó desde el Home al intentar guardar una receta
            const recetaPendiente = sessionStorage.getItem('receta_pendiente');
            if (recetaPendiente) {
                const receta = JSON.parse(recetaPendiente);

                // Intentamos guardar la receta inmediatamente en segundo plano aprovechando el nuevo Token
                const responseGuardar = await fetch('/api/recetas/guardar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.token}`
                    },
                    body: JSON.stringify({
                        titulo: receta.nombre,
                        ingredientes: receta.ingredientes
                            .map(i => i.nombre ?? i)
                            .join(', '),
                        tiempo: receta.tiempo,
                        porciones: receta.porciones,
                        pasos: receta.pasos.join('\n')
                    })
                });

                if (responseGuardar.ok) {
                    sessionStorage.removeItem('receta_pendiente');
                    mostrarToast('¡Inicio de sesión exitoso! Guardamos la receta en tus favoritas.');
                } else {
                    console.error(await responseGuardar.text());
                    mostrarToast('Iniciaste sesión, pero no pudimos guardar la receta.');
                }

            }
            // Redirigimos al Home principal con la sesión iniciada
            window.location.href = "/";
        } else {
            mostrarToast(data.error || 'Credenciales incorrectas. Verifique los datos.');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        mostrarToast('Error de red al conectar con el servidor.');
    }
}

// 2. PETICIÓN ASÍNCRONA DE REGISTRO
async function ejecutarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarToast('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
            conmutarVista(false); // Volvemos automáticamente a la pantalla de login
        } else {
            mostrarToast(data.error || 'No se pudo crear la cuenta.');
        }
    } catch (error) {
        console.error('Error en el registro:', error);
    }
}