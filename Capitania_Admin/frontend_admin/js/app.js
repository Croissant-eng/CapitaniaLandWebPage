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
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');

    const titles = {
        'reservas': 'Gestión de Reservas',
        'eventos': 'Eventos Especiales',
        'promociones': 'Promociones',
        'historial': 'Historial del Día'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];

    if (tabId === 'reservas') loadReservas();
    if (tabId === 'eventos') loadEventos();
    if (tabId === 'promociones') loadPromociones();
    if (tabId === 'historial') {
        document.getElementById('historialFecha').value = new Date().toISOString().split('T')[0];
        loadHistorial();
    }
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
let todasLasReservas = [];

async function loadReservas() {
    try {
        const res = await fetchAuth('/reservas');
        const data = await res.json();
        todasLasReservas = data;
        renderReservas(data);
    } catch (e) {
        console.error(e);
    }
}

function filtrarReservas() {
    const sucursal = document.getElementById('filtroSucursal').value;
    if (!sucursal) {
        renderReservas(todasLasReservas);
    } else {
        renderReservas(todasLasReservas.filter(r => r.sucursal === sucursal));
    }
}

function renderReservas(data) {
    const tbody = document.getElementById('reservasTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--muted); padding: 2rem;">No hay reservas para mostrar.</td></tr>`;
        return;
    }

    data.forEach(r => {
        const date = new Date(r.fecha).toLocaleDateString();
        const badgeClass = `status-${r.estatus.toLowerCase()}`;
        tbody.innerHTML += `
            <tr>
                <td>#${r.id}</td>
                <td>${r.nombre || r.nombre_completo || '-'}</td>
                <td>${r.sucursal || '-'}</td>
                <td>${date} - ${r.hora}</td>
                <td>${r.personas}</td>
                <td>${r.telefono || '-'}</td>
                <td><span class="status-badge ${badgeClass}">${r.estatus}</span></td>
                <td>
                    <button class="action-btn approve" title="Confirmar" onclick="updateEstatus(${r.id}, 'Confirmada')">✓</button>
                    <button class="action-btn reject" title="Cancelar" onclick="updateEstatus(${r.id}, 'Cancelada')">✕</button>
                </td>
            </tr>
        `;
    });
}

async function updateEstatus(id, estatus) {
    if (!confirm(`¿Seguro que deseas marcar la reserva como ${estatus}?`)) return;

    try {
        await fetchAuth(`/reservas/${id}/estatus`, {
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
            await fetchAuth('/eventos', {
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

        if (data.length === 0) {
            grid.innerHTML = `<p style="color: var(--muted);">No hay eventos activos.</p>`;
            return;
        }

        data.forEach(ev => {
            grid.innerHTML += `
                <div class="card">
                    <img src="${ev.imagen_url ? (ev.imagen_url.startsWith('/') ? ev.imagen_url : '/' + ev.imagen_url) : ''}" alt="${ev.titulo}" class="card-img" onerror="this.onerror=null;this.style.display='none'">
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
    if (!confirm('¿Eliminar este evento definitivamente?')) return;
    try {
        await fetchAuth(`/eventos/${id}`, { method: 'DELETE' });
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
            await fetchAuth('/promociones', {
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

        if (data.length === 0) {
            grid.innerHTML = `<p style="color: var(--muted);">No hay promociones activas.</p>`;
            return;
        }

        data.forEach(pr => {
            grid.innerHTML += `
                <div class="card">
                    <img src="${pr.imagen_url ? (pr.imagen_url.startsWith('/') ? pr.imagen_url : '/' + pr.imagen_url) : ''}" alt="${pr.nombre}" class="card-img" onerror="this.onerror=null;this.style.display='none'">
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

async function deletePromo(id) {
    if (!confirm('¿Eliminar esta promoción definitivamente?')) return;
    try {
        await fetchAuth(`/promociones/${id}`, { method: 'DELETE' });
        loadPromociones();
    } catch (e) {
        console.error(e);
    }
}

// ── HISTORIAL DEL DÍA ──
async function loadHistorial() {
    const fechaInput = document.getElementById('historialFecha');
    const fecha = fechaInput.value;
    if (!fecha) return;

    try {
        const res = await fetchAuth('/reservas');
        const data = await res.json();

        const reservasDelDia = data.filter(r => {
            const fechaReserva = new Date(r.fecha).toISOString().split('T')[0];
            return fechaReserva === fecha;
        });

        const total = reservasDelDia.length;
        const confirmadas = reservasDelDia.filter(r => r.estatus === 'Confirmada').length;
        const pendientes = reservasDelDia.filter(r => r.estatus === 'Pendiente').length;
        const canceladas = reservasDelDia.filter(r => r.estatus === 'Cancelada').length;
        const personas = reservasDelDia.reduce((sum, r) => sum + parseInt(r.personas || 0), 0);

        document.getElementById('historialResumen').innerHTML = `
            <div style="background: var(--dark2); border: 1px solid rgba(200,134,10,0.2); border-radius: 8px; padding: 1.2rem 2rem; text-align: center; flex: 1;">
                <div style="font-size: 2rem; color: var(--gold-l); font-weight: 600;">${total}</div>
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Total Reservas</div>
            </div>
            <div style="background: var(--dark2); border: 1px solid rgba(40,167,69,0.3); border-radius: 8px; padding: 1.2rem 2rem; text-align: center; flex: 1;">
                <div style="font-size: 2rem; color: #5cb85c; font-weight: 600;">${confirmadas}</div>
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Confirmadas</div>
            </div>
            <div style="background: var(--dark2); border: 1px solid rgba(200,134,10,0.2); border-radius: 8px; padding: 1.2rem 2rem; text-align: center; flex: 1;">
                <div style="font-size: 2rem; color: var(--gold-l); font-weight: 600;">${pendientes}</div>
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Pendientes</div>
            </div>
            <div style="background: var(--dark2); border: 1px solid rgba(255,74,74,0.2); border-radius: 8px; padding: 1.2rem 2rem; text-align: center; flex: 1;">
                <div style="font-size: 2rem; color: var(--danger); font-weight: 600;">${canceladas}</div>
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Canceladas</div>
            </div>
            <div style="background: var(--dark2); border: 1px solid rgba(200,134,10,0.2); border-radius: 8px; padding: 1.2rem 2rem; text-align: center; flex: 1;">
                <div style="font-size: 2rem; color: var(--gold-xl); font-weight: 600;">${personas}</div>
                <div style="font-size: 0.8rem; color: var(--muted); text-transform: uppercase;">Total Personas</div>
            </div>
        `;

        if (reservasDelDia.length === 0) {
            document.getElementById('historialLista').innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--muted);">No hay reservas para esta fecha.</div>
            `;
            return;
        }

        const porHora = {};
        reservasDelDia.sort((a, b) => a.hora.localeCompare(b.hora)).forEach(r => {
            if (!porHora[r.hora]) porHora[r.hora] = [];
            porHora[r.hora].push(r);
        });

        let html = '';
        Object.keys(porHora).forEach(hora => {
            html += `<div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--gold); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(200,134,10,0.2);">⏰ ${hora}</h4>
                <table class="data-table">
                    <thead><tr><th>Nombre</th><th>Sucursal</th><th>Personas</th><th>Teléfono</th><th>Notas</th><th>Estatus</th></tr></thead>
                    <tbody>`;
            porHora[hora].forEach(r => {
                const badge = r.estatus === 'Confirmada' ? 'status-confirmada' : r.estatus === 'Cancelada' ? 'status-cancelada' : 'status-pendiente';
                html += `<tr>
                    <td>${r.nombre || r.nombre_completo || '-'}</td>
                    <td>${r.sucursal || '-'}</td>
                    <td>${r.personas}</td>
                    <td>${r.telefono || '-'}</td>
                    <td>${r.notas || '-'}</td>
                    <td><span class="status-badge ${badge}">${r.estatus}</span></td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        });

        document.getElementById('historialLista').innerHTML = html;

    } catch (e) {
        console.error('Error cargando historial:', e);
    }
}