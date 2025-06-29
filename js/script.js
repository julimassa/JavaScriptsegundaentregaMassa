const form = document.getElementById("form-turno");
const listaTurnos = document.getElementById("lista-turnos");
const especialidadSelect = document.getElementById("especialidad");
const medicoSelect = document.getElementById("medico");

const especialidades = {
  "Alérgia e Inmunología": ["Dr. Suli", "Dra. Suli"],
  "Cardiología": ["Dr. Modenesi", "Dra. Modenesi"]
};

let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

function actualizarSelectMedicos() {
  const seleccion = especialidadSelect.value;
  medicoSelect.innerHTML = "<option value=''>Elegí un médico</option>";
  if (especialidades[seleccion]) {
    especialidades[seleccion].forEach(medico => {
      const option = document.createElement("option");
      option.textContent = medico;
      option.value = medico;
      medicoSelect.appendChild(option);
    });
  }
}

especialidadSelect.addEventListener("change", actualizarSelectMedicos);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const turno = {
    nombre: document.getElementById("nombre").value,
    dni: document.getElementById("dni").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    obraSocial: document.getElementById("obraSocial").value,
    especialidad: especialidadSelect.value,
    medico: medicoSelect.value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    id: Date.now()
    
  };

  turnos.push(turno);
  localStorage.setItem("turnos", JSON.stringify(turnos));
  form.reset();
  medicoSelect.innerHTML = "<option value=''>Elegí un médico</option>";
  mostrarTurnos();
});

function mostrarTurnos() {
  listaTurnos.innerHTML = "";
  if (turnos.length === 0) {
    listaTurnos.innerHTML = "<p class='text-muted'>No hay turnos reservados.</p>";
    return;
  }

  turnos.forEach(turno => {
    const div = document.createElement("div");
    div.className = "col-md-6";
    div.innerHTML = `
      <div class="card card-turno shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${turno.nombre} - ${turno.especialidad}</h5>
          <p class="card-text mb-1"><strong>Médico:</strong> ${turno.medico}</p>
          <p class="card-text mb-1"><strong>DNI:</strong> ${turno.dni}</p>
          <p class="card-text mb-1"><strong>Tel:</strong> ${turno.telefono}</p>
          <p class="card-text mb-1"><strong>Email:</strong> ${turno.email}</p>
          <p class="card-text mb-1"><strong>Obra social:</strong> ${turno.obraSocial}</p>
          <p class="card-text"><strong>Fecha:</strong> ${turno.fecha} - ${turno.hora}</p>
          <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${turno.id})">Eliminar</button>
        </div>
      </div>
    `;
    listaTurnos.appendChild(div);
  });
}

function eliminarTurno(id) {
  turnos = turnos.filter(t => t.id !== id);
  localStorage.setItem("turnos", JSON.stringify(turnos));
  mostrarTurnos();
}

document.addEventListener("DOMContentLoaded", mostrarTurnos);
document.getElementById("fecha").addEventListener("change", actualizarHorariosDisponibles);
medicoSelect.addEventListener("change", actualizarHorariosDisponibles);


function generarHorarios() {
  const horarios = [];
  let hora = 13;
  let minuto = 0;
  while (hora < 18 || (hora === 18 && minuto === 0)) {
    const h = hora.toString().padStart(2, "0");
    const m = minuto.toString().padStart(2, "0");
    horarios.push(`${h}:${m}`);
    minuto += 15;
    if (minuto === 60) {
      minuto = 0;
      hora++;
    }
  }
  return horarios;
}

function actualizarHorariosDisponibles() {
  const fecha = document.getElementById("fecha").value;
  const medico = medicoSelect.value;
  const horaSelect = document.getElementById("hora");

  if (!fecha || !medico) {
    horaSelect.innerHTML = "<option value=''>Elegí un horario</option>";
    return;
  }

  const horariosTotales = generarHorarios();

  const horariosReservados = turnos
    .filter(t => t.fecha === fecha && t.medico === medico)
    .map(t => t.hora);

  const horariosDisponibles = horariosTotales.filter(h => !horariosReservados.includes(h));

  // Cargar los horarios al select
  horaSelect.innerHTML = "<option value=''>Elegí un horario</option>";
  horariosDisponibles.forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horaSelect.appendChild(option);
  });
}

