
// =====================================
// ASISTEPRO - SISTEMA DE ASISTENCIA
// =====================================

// Cursos iniciales
const cursosIniciales = [
    ["3ro", "A"],
    ["3ro", "B"],
    ["3ro", "C"],

    ["4to", "Agropecuaria"],
    ["4to", "Acondicionamiento Físico"],
    ["4to", "Informática"],

    ["5to", "Agropecuaria"],
    ["5to", "Acondicionamiento Físico"],
    ["5to", "Informática"],

    ["6to", "Agropecuaria"],
    ["6to", "Acondicionamiento Físico"],
    ["6to", "Informática"]
];

let cursoActual = "";
let registroTemporal = null;

// =====================================
// ALMACENAMIENTO
// =====================================

function obtenerDatos() {
    return JSON.parse(
        localStorage.getItem("asistepro") || "{}"
    );
}

function guardarDatos(datos) {
    localStorage.setItem(
        "asistepro",
        JSON.stringify(datos)
    );
}

function crearId() {
    return Date.now().toString() +
        Math.random().toString(36).slice(2, 8);
}

// =====================================
// CREAR CURSOS INICIALES
// =====================================

function iniciarCursos() {

    const datos = obtenerDatos();

    cursosIniciales.forEach(([grado, modalidad]) => {

        const existe = Object.values(datos).some(curso =>
            curso.grado.toLowerCase() === grado.toLowerCase() &&
            curso.modalidad.toLowerCase() === modalidad.toLowerCase()
        );

        if (!existe) {
            const id = crearId();

            datos[id] = {
                grado: grado,
                modalidad: modalidad,
                estudiantes: [],
                registros: []
            };
        }

    });

    guardarDatos(datos);
    mostrarCursos();
}

// =====================================
// CREAR UN NUEVO CURSO
// =====================================

document.getElementById("form-curso").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const grado = document.getElementById("grado").value.trim();
        const modalidad = document.getElementById("modalidad").value.trim();

        if (!grado || !modalidad) return;

        const datos = obtenerDatos();

        const existe = Object.values(datos).some(curso =>
            curso.grado.toLowerCase() === grado.toLowerCase() &&
            curso.modalidad.toLowerCase() === modalidad.toLowerCase()
        );

        if (existe) {
            alert("Este curso ya existe.");
            return;
        }

        const id = crearId();

        datos[id] = {
            grado: grado,
            modalidad: modalidad,
            estudiantes: [],
            registros: []
        };

        guardarDatos(datos);

        this.reset();

        mostrarCursos();

        alert("Curso creado correctamente.");
    }
);

// =====================================
// MOSTRAR LAS CARPETAS
// =====================================

function mostrarCursos() {

    const datos = obtenerDatos();

    const contenedor = document.getElementById("lista-cursos");

    contenedor.innerHTML = "";

    const cursos = Object.entries(datos);

    document.getElementById("cantidad-cursos").textContent =
        cursos.length + " cursos";

    cursos.forEach(([id, curso]) => {

        const tarjeta = document.createElement("div");
        tarjeta.className = "carpeta";

        const icono = document.createElement("div");
        icono.className = "icono-carpeta";
        icono.textContent = "📁";

        const titulo = document.createElement("h3");
        titulo.textContent = curso.grado;

        const modalidad = document.createElement("p");
        modalidad.textContent = curso.modalidad;

        const estudiantes = document.createElement("p");
        estudiantes.textContent =
            curso.estudiantes.length + " estudiantes";

        const registros = document.createElement("p");
        registros.textContent =
            curso.registros.length + " registros guardados";

        const boton = document.createElement("button");
        boton.className = "boton";
        boton.textContent = "Abrir carpeta";

        boton.addEventListener("click", () => {
            abrirCurso(id);
        });

        tarjeta.append(
            icono,
            titulo,
            modalidad,
            estudiantes,
            registros,
            boton
        );

        contenedor.appendChild(tarjeta);

    });
}

// =====================================
// ABRIR UN CURSO
// =====================================

function abrirCurso(id) {

    cursoActual = id;

    const datos = obtenerDatos();
    const curso = datos[id];

    document.getElementById("cursos").hidden = true;

    document.getElementById("administracion").hidden = false;

    document.getElementById("titulo-curso").textContent =
        curso.grado + " " + curso.modalidad;

    document.getElementById("info-curso").textContent =
        curso.estudiantes.length + " estudiantes registrados";

    document.getElementById("area-asistencia").hidden = true;

    document.getElementById("detalle-registro").hidden = true;

    document.getElementById("mensaje").textContent = "";

    mostrarEstudiantes();
    mostrarRegistros();

    window.location.hash = "administracion";
}

// =====================================
// VOLVER A LOS CURSOS
// =====================================

document.getElementById("volver").addEventListener("click", () => {

    document.getElementById("administracion").hidden = true;

    document.getElementById("cursos").hidden = false;

    document.getElementById("detalle-registro").hidden = true;

    mostrarCursos();

    window.location.hash = "cursos";
});

// =====================================
// AGREGAR ESTUDIANTES
// =====================================

document.getElementById("form-estudiante").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();

        if (!nombre) return;

        const datos = obtenerDatos();
        const curso = datos[cursoActual];

        const existe = curso.estudiantes.some(estudiante =>
            estudiante.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (existe) {
            alert("Este estudiante ya está registrado.");
            return;
        }

        curso.estudiantes.push({
            id: crearId(),
            nombre: nombre
        });

        guardarDatos(datos);

        this.reset();

        mostrarEstudiantes();

        document.getElementById("mensaje-estudiante").textContent =
            "Estudiante agregado correctamente.";

    }
);

// =====================================
// MOSTRAR ESTUDIANTES
// =====================================

function mostrarEstudiantes() {

    const datos = obtenerDatos();
    const curso = datos[cursoActual];

    const lista = document.getElementById("lista-estudiantes");

    lista.innerHTML = "";

    document.getElementById("total-estudiantes").textContent =
        curso.estudiantes.length + " estudiantes";

    document.getElementById("info-curso").textContent =
        curso.estudiantes.length + " estudiantes registrados";

    curso.estudiantes.forEach((estudiante, indice) => {

        const fila = document.createElement("tr");

        const numero = document.createElement("td");
        numero.textContent = indice + 1;

        const nombre = document.createElement("td");
        nombre.textContent = estudiante.nombre;

        fila.append(numero, nombre);

        lista.appendChild(fila);

    });
}

// =====================================
// PREPARAR REGISTRO DE ASISTENCIA
// =====================================

document.getElementById("form-asistencia").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const materia = document.getElementById("materia").value.trim();

        const fecha = document.getElementById("fecha").value;

        if (!materia || !fecha) return;

        const datos = obtenerDatos();
        const curso = datos[cursoActual];

        if (curso.estudiantes.length === 0) {
            alert("Primero agrega los estudiantes del curso.");
            return;
        }

        registroTemporal = {
            id: crearId(),
            materia: materia,
            fecha: fecha,
            asistencias: {}
        };

        // Evitar registros duplicados de la misma materia y fecha
        const duplicado = curso.registros.some(registro =>
            registro.materia.toLowerCase() === materia.toLowerCase() &&
            registro.fecha === fecha
        );

        if (duplicado) {
            alert("Ya existe un registro de esta materia para esa fecha. Abre el archivo anterior para consultarlo.");
            return;
        }

        document.getElementById("area-asistencia").hidden = false;

        document.getElementById("detalle-registro").hidden = true;

        document.getElementById("titulo-asistencia").textContent =
            materia + " — " + fecha;

        const tabla = document.getElementById("tabla-asistencia");

        tabla.innerHTML = "";

        curso.estudiantes.forEach(estudiante => {

            const fila = document.createElement("tr");

            const nombre = document.createElement("td");
            nombre.textContent = estudiante.nombre;

            const celda = document.createElement("td");

            const select = document.createElement("select");

            select.className = "estado";
            select.dataset.id = estudiante.id;

            const opciones = [
                "Presente",
                "Ausente",
                "Excusa",
                "Tardanza"
            ];

            opciones.forEach(estado => {

                const opcion = document.createElement("option");

                opcion.value = estado;
                opcion.textContent = estado;

                select.appendChild(opcion);

            });

            select.addEventListener("change", actualizarResumen);

            celda.appendChild(select);

            fila.append(nombre, celda);

            tabla.appendChild(fila);

        });

        actualizarResumen();

    }
);

// =====================================
// RESUMEN DE ASISTENCIA
// =====================================

function contarEstados() {

    const estados = Array.from(
        document.querySelectorAll("#tabla-asistencia .estado")
    ).map(select => select.value);

    return {
        presentes: estados.filter(e => e === "Presente").length,
        ausentes: estados.filter(e => e === "Ausente").length,
        excusas: estados.filter(e => e === "Excusa").length,
        tardanzas: estados.filter(e => e === "Tardanza").length
    };
}

function actualizarResumen() {

    const conteo = contarEstados();

    document.getElementById("cuenta-presentes").textContent =
        conteo.presentes;

    document.getElementById("cuenta-ausentes").textContent =
        conteo.ausentes;

    document.getElementById("cuenta-excusas").textContent =
        conteo.excusas;

    document.getElementById("cuenta-tardanzas").textContent =
        conteo.tardanzas;
}

// =====================================
// GUARDAR ASISTENCIA
// =====================================

document.getElementById("guardar-asistencia").addEventListener(
    "click",
    () => {

        if (!registroTemporal) return;

        const datos = obtenerDatos();
        const curso = datos[cursoActual];

        const selects = document.querySelectorAll(
            "#tabla-asistencia .estado"
        );

        selects.forEach(select => {

            registroTemporal.asistencias[select.dataset.id] =
                select.value;

        });

        curso.registros.push(registroTemporal);

        guardarDatos(datos);

        document.getElementById("mensaje").textContent =
            "¡Registro guardado correctamente!";

        document.getElementById("area-asistencia").hidden = true;

        registroTemporal = null;

        mostrarRegistros();
        mostrarCursos();

    }
);

// =====================================
// MOSTRAR ARCHIVOS GUARDADOS
// =====================================

function mostrarRegistros() {

    const datos = obtenerDatos();
    const curso = datos[cursoActual];

    const lista = document.getElementById("lista-registros");

    lista.innerHTML = "";

    if (curso.registros.length === 0) {

        lista.textContent = "Todavía no existen registros guardados.";

        return;
    }

    const registrosOrdenados = [...curso.registros].sort(
        (a, b) => b.fecha.localeCompare(a.fecha)
    );

    registrosOrdenados.forEach(registro => {

        const archivo = document.createElement("div");

        archivo.className = "archivo";

        const nombre = document.createElement("span");

        nombre.textContent =
            registro.materia + " — " + registro.fecha;

        const boton = document.createElement("button");

        boton.className = "boton";
        boton.textContent = "Abrir archivo";

        boton.addEventListener("click", () => {
            abrirArchivo(registro.id);
        });

        archivo.append(nombre, boton);

        lista.appendChild(archivo);

    });
}

// =====================================
// ABRIR ARCHIVO DE ASISTENCIA
// =====================================

function abrirArchivo(id) {

    const datos = obtenerDatos();
    const curso = datos[cursoActual];

    const registro = curso.registros.find(r => r.id === id);

    if (!registro) return;

    document.getElementById("detalle-registro").hidden = false;

    document.getElementById("titulo-archivo").textContent =
        registro.materia + " — " + registro.fecha;

    const contenido = document.getElementById("contenido-archivo");

    contenido.innerHTML = "";

    const conteo = {
        presentes: 0,
        ausentes: 0,
        excusas: 0,
        tardanzas: 0
    };

    curso.estudiantes.forEach((estudiante, indice) => {

        const estado = registro.asistencias[estudiante.id] || "Sin registrar";

        const fila = document.createElement("tr");

        const numero = document.createElement("td");
        numero.textContent = indice + 1;

        const nombre = document.createElement("td");
        nombre.textContent = estudiante.nombre;

        const resultado = document.createElement("td");
        resultado.textContent = estado;

        if (estado === "Presente") conteo.presentes++;
        if (estado === "Ausente") conteo.ausentes++;
        if (estado === "Excusa") conteo.excusas++;
        if (estado === "Tardanza") conteo.tardanzas++;

        fila.append(numero, nombre, resultado);

        contenido.appendChild(fila);

    });

    document.getElementById("archivo-presentes").textContent =
        conteo.presentes;

    document.getElementById("archivo-ausentes").textContent =
        conteo.ausentes;

    document.getElementById("archivo-excusas").textContent =
        conteo.excusas;

    document.getElementById("archivo-tardanzas").textContent =
        conteo.tardanzas;

    document.getElementById("detalle-registro").scrollIntoView({
        behavior: "smooth"
    });

}

// =====================================
// CERRAR ARCHIVO
// =====================================

document.getElementById("cerrar-archivo").addEventListener(
    "click",
    () => {

        document.getElementById("detalle-registro").hidden = true;

    }
);

// =====================================
// FECHA ACTUAL
// =====================================

function establecerFecha() {

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const mes = String(hoy.getMonth() + 1).padStart(2, "0");

    const dia = String(hoy.getDate()).padStart(2, "0");

    document.getElementById("fecha").value =
        `${anio}-${mes}-${dia}`;

}

// =====================================
// INICIAR SISTEMA
// =====================================

establecerFecha();
iniciarCursos();