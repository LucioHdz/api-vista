async function fetchUsuarios() {
    const response = await fetch('https://api-usuarios-i5sd.onrender.com/');
    const usuarios = await response.json();
    const listaRegistros = document.getElementById('listaRegistros');
    listaRegistros.innerHTML = '';
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = `${usuario.id}: ${usuario.nombre}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('https://api-usuarios-i5sd.onrender.com/', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: usuario.id })
                });
                if (response.ok) {
                    alert('Usuario eliminado');
                    li.remove();
                } else {
                    const errorData = await response.json();
                    alert('Error al eliminar el usuario: ' + errorData.message);
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                alert('Error al eliminar el usuario');
            }
        });
        li.appendChild(deleteBtn);
        listaRegistros.appendChild(li);
    });
}

document.getElementById('agregarBtn').addEventListener('click', async () => {
    
    
    const nombre = document.getElementById('nombre').value;
    const response = await fetch('https://api-usuarios-i5sd.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 0, nombre })
    });
    const result = await response.json();
    if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "Usuario Agregado",
            text:"se agrego a la base de datos",
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: "No permitir",
            cancelButtonColor:"#FF6663",
            confirmButtonText:"Enterado",
            footer:"<h1>mensaje</h1>",
            theme:"dark"
        });
        document.getElementById('id').value = '';
        document.getElementById('nombre').value = '';
        fetchUsuarios();
    } else {
        alert('Error al agregar el usuario: ' + result.message);
    }
});

document.getElementById('verUsuariosBtn').addEventListener('click', fetchUsuarios);