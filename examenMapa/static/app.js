var mapa;

function initMap() {
    mapa = L.map('mapa').setView([36.7213028, -4.4216366], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© Contribuidores de OpenStreetMap'
    }).addTo(mapa);
}

function cargarDatos() {
    fetch('static/datos.json')
        .then(response => response.json())
        .then(datos => {
            datos.features.forEach(feature => {
                const prop = feature.properties;
                const geom = feature.geometry;

                var marcador = L.marker([geom.coordinates[1], geom.coordinates[0]]).addTo(mapa);
                marcador.bindPopup(`<h3>${prop.DESCRIPCION}</h3><p>${prop.DIRECCION}</p>`);

                agregarElementoLista(prop, geom);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

function agregarElementoLista(prop, geom) {
    var lista = document.getElementById('lista-paradas-taxis');
    var elemento = document.createElement('li');
    var accesibilidad = prop.ACCESOPMR === 'Si' ? '<span class="accesible">Accesible</span>' : '';
    var botonInfo = '<a class="btn-mas-info" style="display:none;">Más información</a>'; // El botón se inicia oculto

    elemento.innerHTML = `<b>${prop.DESCRIPCION}</b><p>${prop.DIRECCION}</p>${accesibilidad}${botonInfo}`;
    elemento.onclick = function () {
        document.querySelectorAll('#lista-paradas-taxis li').forEach(function (el) {
            el.classList.remove('selected');
            el.querySelector('.btn-mas-info').style.display = 'none'; // Ocultar el botón en todos los elementos
        });

        this.classList.add('selected');
        this.querySelector('.btn-mas-info').style.display = 'block';

        mapa.setView([geom.coordinates[1], geom.coordinates[0]], 18);
    };

    elemento.querySelector('.btn-mas-info').onclick = function (e) {
        e.stopPropagation(); 
        mostrarModal(prop);
    };

    lista.appendChild(elemento);
}

function mostrarModal(prop) {
    var modal = document.getElementById('modal-info');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-info';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <h2>${prop.DESCRIPCION}</h2>
            <p>Capacidad: ${prop.INFOESP[0].Capacidad_vehiculos}</p>
            <p>Identificador: ${prop.ID}</p>
            <button onclick="cerrarModal()">Cerrar</button>
        </div>
    `;
    modal.style.display = 'block';
}

function cerrarModal() {
    var modal = document.getElementById('modal-info');
    if (modal) {
        modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    cargarDatos();
});
