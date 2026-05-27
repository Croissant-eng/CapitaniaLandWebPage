// API URL (Ajustar en producción)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'https://7mzq2kk1-3001.usw3.devtunnels.ms/api';

// Verificar autenticación en el Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const token = localStorage.getItem('capitania_token');
    const user = localStorage.getItem('capitania_user');

    if (!token) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userName').innerText = user;
        loadReservas();
    }
}

// ── NAVEGACIÓN TABS ──
function switchTab(tabId) {
    // Esconder todos los contenidos
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    // Desmarcar todos los items de navegación
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Mostrar el activo
    document.getElementById(`tab-${tabId}`).classList.add('active');
    // Marcar item en sidebar
    event.currentTarget.classList.add('active');

    // Cambiar Título
    const titles = {
        'reservas': 'Gestión de Reservas',
        'eventos': 'Eventos Especiales',
        'promociones': 'Promociones'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];

    // Cargar datos
    if (tabId === 'reservas') loadReservas();
    if (tabId === 'eventos') loadEventos();
    if (tabId === 'promociones') loadPromociones();
}

function logout() {
    localStorage.removeItem('capitania_token');
    localStorage.removeItem('capitania_user');
    window.location.href = 'index.html';
}


// ── UTILS PARA FETCH ──
async function fetchAuth(url, options = {}) {
    const token = localStorage.getItem('capitania_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };
    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (res.status === 401) {
        localStorage.removeItem('capitania_token');
        localStorage.removeItem('capitania_user');
        window.location.href = 'index.html';
        throw new Error('Sesión expirada');
    }
    return res;
}

// ── RESERVAS ──
async function loadReservas() {
    try {
        const res = await fetchAuth('/reservas');
        const data = await res.json();
        const tbody = document.getElementById('reservasTableBody');
        tbody.innerHTML = '';

        data.forEach(r => {
            const date = new Date(r.fecha).toLocaleDateString();
            const badgeClass = `status-${r.estatus.toLowerCase()}`;

            tbody.innerHTML += `
                <tr>
                    <td>#${r.id}</td>
                    <td>${r.nombre_completo}</td>
                    <td>${r.sucursal}</td>
                    <td>${date} - ${r.hora}</td>
                    <td>${r.personas}</td>
                    <td>${r.telefono}</td>
                    <td><span class="status-badge ${badgeClass}">${r.estatus}</span></td>
                    <td>
                        <button class="action-btn approve" title="Confirmar" onclick="updateEstatus(${r.id}, 'Confirmada')">✓</button>
                        <button class="action-btn reject" title="Cancelar" onclick="updateEstatus(${r.id}, 'Cancelada')">✕</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}

async function updateEstatus(id, estatus) {
    if(!confirm(`¿Seguro que deseas marcar la reserva como ${estatus}?`)) return;

    try {
        await fetchAuth(`/admin/reservas/${id}/estatus`, {
            method: 'PUT',
            body: JSON.stringify({ estatus })
        });
        loadReservas();
    } catch (e) {
        console.error(e);
    }
}

// ── EVENTOS ──
if (document.getElementById('formEvento')) {
    document.getElementById('formEvento').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            titulo: document.getElementById('ev_titulo').value,
            fecha_evento: document.getElementById('ev_fecha').value,
            descripcion: document.getElementById('ev_desc').value,
            imagen_url: document.getElementById('ev_img').value || '/Images/Galeria/Seleccionadas/Corona.jpg'
        };

        try {
            await fetchAuth('/admin/eventos', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            document.getElementById('formEvento').reset();
            loadEventos();
        } catch (e) {
            console.error(e);
        }
    });
}

async function loadEventos() {
    try {
        const res = await fetch(`${API_URL}/eventos`, { credentials: 'include' });
        const data = await res.json();
        const grid = document.getElementById('eventosGrid');
        grid.innerHTML = '';

        data.forEach(ev => {
            grid.innerHTML += `
                <div class="card">
                    <img src="${ev.imagen_url.startsWith('/') ? ev.imagen_url : '/' + ev.imagen_url}" alt="${ev.titulo}" class="card-img" onerror="this.onerror=null;this.style.display='none'">
                    <div class="card-body">
                        <h4 class="card-title">${ev.titulo}</h4>
                        <p style="font-size: 0.8rem; color: var(--gold); margin-bottom: 0.5rem;">🗓 ${ev.fecha_evento}</p>
                        <p class="card-desc">${ev.descripcion}</p>
                        <button class="btn-danger" onclick="deleteEvento(${ev.id})">Eliminar</button>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}

async function deleteEvento(id) {
    if(!confirm('¿Eliminar este evento definitivamente?')) return;
    try {
        await fetchAuth(`/admin/eventos/${id}`, { method: 'DELETE' });
        loadEventos();
    } catch (e) {
        console.error(e);
    }
}

// ── PROMOCIONES ──
if (document.getElementById('formPromo')) {
    document.getElementById('formPromo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            nombre: document.getElementById('pr_nombre').value,
            precio_destacado: document.getElementById('pr_precio').value,
            descripcion: document.getElementById('pr_desc').value,
            imagen_url: document.getElementById('pr_img').value || '/Images/Galeria/Seleccionadas/Chava preciosa.jpg'
        };

        try {
            await fetchAuth('/admin/promociones', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            document.getElementById('formPromo').reset();
            loadPromociones();
        } catch (e) {
            console.error(e);
        }
    });
}

async function loadPromociones() {
    try {
        const res = await fetch(`${API_URL}/promociones`, { credentials: 'include' });
        const data = await res.json();
        const grid = document.getElementById('promocionesGrid');
        grid.innerHTML = '';

        data.forEach(pr => {
            grid.innerHTML += `
                <div class="card">
                    <img src="${pr.imagen_url.startsWith('/') ? pr.imagen_url : '/' + pr.imagen_url}" alt="${pr.nombre}" class="card-img" onerror="this.onerror=null;this.style.display='none'">
                    <div class="card-body">
                        <h4 class="card-title">${pr.nombre} <span style="float:right; color:var(--gold-xl);">${pr.precio_destacado || ''}</span></h4>
                        <p class="card-desc" style="margin-top: 1rem;">${pr.descripcion}</p>
                        <button class="btn-danger" onclick="deletePromo(${pr.id})">Eliminar</button>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        console.error(e);
    }
}