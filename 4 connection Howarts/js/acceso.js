const nameSelect = document.getElementById('nameSelect');
const customName = document.getElementById('customName');
const schoolSelect = document.getElementById('schoolSelect');
const errorMessage = document.getElementById('errorMessage');

// Formulario de acceso al juego
const submitForm = () => {
    const selectedName = nameSelect.value;
    const enteredName = customName.value.trim();
    const selectedSchool = schoolSelect.value;

    // Determina el nombre que se usará (del select o del input)
    const userName = selectedName || enteredName;

    // Verificar si se ha seleccionado o introducido un nombre y elegido una escuela
    if (userName && selectedSchool) {
        // Almacena el nombre y la escuela seleccionada en sessionStorage
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('school', selectedSchool);

        // Oculta el mensaje de error si todo está correcto
        errorMessage.style.display = 'none';

        // Redirecciona al juego
        window.location.href = './pages/juego.html';
    } else {
        // Muestra el mensaje de error
        errorMessage.style.display = 'block';
    }
};

// Eventos
document.getElementById('submitBtn').addEventListener('click', submitForm);
