    const inputUsuario = document.getElementById("Usuario");
    const formulario = document.getElementById("formulario");
    const tabla = document.getElementById("datosTabla");
    const btnFormulario = document.getElementById("btnFormulario");

    const URL = "https://api-usuarios-i5sd.onrender.com/";
    var estadoFormulario = true; //si es verdadero agrega, si es falso edita
    var idUsuaroEditado = null;

    const mostrarUsuarios = async () => {
        const usuariosRaw = await fetch(URL);
        const listaUsuarios = await usuariosRaw.json();
        var componentes = "";
        listaUsuarios.map((usuario) => {
            const componenteUsuario = `
            <tr>
                <td>${usuario.nombre}</td>
                <td>
                <button class="btn" onclick='editar(${usuario.id},"${usuario.nombre}")'>Editar</button>
                <button class="btn-2" onclick='eliminar(${usuario.id})'>Eliminar </button>
                </td>
            </tr>
            `;
            componentes += componenteUsuario;
        });
        tabla.innerHTML = componentes;
    }

    const editar = (id, usuario) => {
        estadoFormulario = false;
        idUsuaroEditado = id;
        inputUsuario.value = usuario;
        btnFormulario.innerText = "Editar Usuario";
    }

    const eliminar = (id) => {
        Swal.fire({
            title: "¿Estás seguro de eliminar el usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro",
            cancelButtonText: "Cancelar"
          }).then( async(result) => {
            if (result.isConfirmed) {
                
                const resultado = await fetch(URL,{
                    method:"DELETE",
                    headers:{
                        "Content-type": "application/json"
                    },
                    body:JSON.stringify({id})
                });
                if (resultado.status ==200){   
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El usuario se elimino correctamente",
                        icon: "success"
                    });
                    mostrarUsuarios();
                }
            }
          });
    }

    const guardarUsuario = async (usuario)=>{
        const resultados = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ nombre: usuario })
        });
        if (resultados.status == 200) {
            //todo correcto
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Usuario Guardado",
                showConfirmButton: false,
                timer: 1500
              });
              mostrarUsuarios();
        } else {
            //cocurrio un error
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Usuario No guardado",
                showConfirmButton: false,
                timer: 1500
              });
        }
    }

    const editarUsuario = async (usuario)=>{
        const usuarioEditado = {
            id: idUsuaroEditado,
            nombre: usuario
        }

        const respuesta = await fetch(URL,{
            method:"PATCH",
            headers:{
                "Content-type": "application/json"
            },
            body:JSON.stringify(usuarioEditado)
        });

        if (respuesta.status == 200){
            inputUsuario.value = "";
            btnFormulario.innerText = "Crear Usuario";
            estadoFormulario = true;
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Usuario Editado",
                showConfirmButton: false,
                timer: 1500
              });
              mostrarUsuarios();
        }else{
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "No se pudo realizar el cambio",
                showConfirmButton: false,
                timer: 1500
              });
        }


    }

    const eventoFormulario = (e) => {
        e.preventDefault();
        const usuario = inputUsuario.value;
        if (estadoFormulario){
            guardarUsuario(usuario);
        }else{
            editarUsuario(usuario);
        }

    }


    mostrarUsuarios();

    formulario.addEventListener("submit", eventoFormulario);