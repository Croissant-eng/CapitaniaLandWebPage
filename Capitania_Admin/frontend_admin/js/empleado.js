// API URL (Ajustar en producción)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : 'https://7mzq2kk1-3001.usw3.devtunnels.ms/api';

// Verificar autenticación en el Dashboard
if (window.location.pathname.includes('empleado.html')) {
    const token = localStorage.getItem('capitania_token');
    const user = localStorage.getItem('capitania_user');

    if (!token) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('userName').innerText = user;
        // Establecer fecha por defecto en el filtro de fecha
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('filtroFecha').value = today;
        document.getElementById('historialFecha').value = today;
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
        'historial': 'Historial del Día'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];

    if (tabId === 'reservas') loadReservas();
    if (tabId === 'historial') loadHistorialDia();
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
        // Filtrar solo reservas pendientes
        const pendientes = data.filter(r => r.estatus === 'Pendiente');
        renderReservas(pendientes);
    } catch (e) {
        console.error(e);
    }
}

function filtrarReservas() {
    const sucursal = document.getElementById('filtroSucursal').value;
    const fecha = document.getElementById('filtroFecha').value;

    let filtered = todasLasReservas;

    // Filtrar por sucursal si se seleccionó
    if (sucursal) {
        filtered = filtered.filter(r => r.sucursal === sucursal);
    }

    // Filtrar por fecha si se seleccionó
    if (fecha) {
        filtered = filtered.filter(r => {
            const fechaReserva = new Date(r.fecha).toISOString().split('T')[0];
            return fechaReserva === fecha;
        });
    }

    renderReservas(filtered);
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
        // Recargar las reservas pendientes después de confirmar o rechazar
        loadReservas();
    } catch (e) {
        console.error(e);
    }
}

// ── HISTORIAL DEL DÍA ──
async function loadHistorialDia() {
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