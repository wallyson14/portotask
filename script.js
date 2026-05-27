// ============ DATA ============
const employees = [
  { id:1, name:'João Silva',     initials:'JS', role:'Operador de Pátio',  sector:'Operações Portuárias', shift:'Manhã',  matricula:'TI-2022-001', pct:75, done:2, inprogress:0, pending:1, color:'var(--teal)', avClass:'av-teal' },
  { id:2, name:'Maria Costa',    initials:'MC', role:'Conferente',         sector:'Conferência',          shift:'Manhã',  matricula:'TI-2022-004', pct:40, done:1, inprogress:1, pending:1, color:'var(--blue)', avClass:'av-blue' },
  { id:3, name:'Ricardo Alves',  initials:'RA', role:'Motorista',          sector:'Transporte',           shift:'Tarde',  matricula:'TI-2021-007', pct:0,  done:0, inprogress:0, pending:2, color:'var(--amber)', avClass:'av-amber' },
  { id:4, name:'Ana Souza',      initials:'AS', role:'Operadora de Pátio', sector:'Operações Portuárias', shift:'Manhã',  matricula:'TI-2023-002', pct:90, done:3, inprogress:0, pending:0, color:'var(--teal)', avClass:'av-teal' },
  { id:5, name:'Pedro Lima',     initials:'PL', role:'Supervisor',         sector:'Operações',            shift:'Admin',  matricula:'TI-2019-001', pct:100,done:2, inprogress:0, pending:0, color:'var(--teal)', avClass:'av-teal' },
  { id:6, name:'Fernanda Nunes', initials:'FN', role:'Conferente',         sector:'Conferência',          shift:'Tarde',  matricula:'TI-2023-005', pct:50, done:1, inprogress:1, pending:2, color:'var(--blue)', avClass:'av-blue' },
  { id:7, name:'Lucas Martins',  initials:'LM', role:'Motorista',          sector:'Transporte',           shift:'Tarde',  matricula:'TI-2020-003', pct:100,done:2, inprogress:0, pending:0, color:'var(--teal)', avClass:'av-teal' },
  { id:8, name:'Carlos Ramos',   initials:'CR', role:'Gerente de Operações',sector:'Gestão',             shift:'Admin',  matricula:'TI-2018-001', pct:null,done:0,inprogress:0, pending:0, color:'var(--navy)', avClass:'av-navy' },
];

const activities = [
  { id:1, name:'Descarga navio Anita',             emp:'João Silva',     sector:'Cais Berço 1',   time:'2h',  pct:100, status:'done',       justify:'' },
  { id:2, name:'Registro de carga L47',            emp:'João Silva',     sector:'Escritório',     time:'1h',  pct:100, status:'done',       justify:'' },
  { id:3, name:'Transporte ao galpão 3',           emp:'João Silva',     sector:'Pátio',          time:'1h',  pct:0,   status:'pending',    justify:'' },
  { id:4, name:'Conferência manifesto M-09',       emp:'Maria Costa',    sector:'Galpão 2',       time:'2h',  pct:100, status:'done',       justify:'' },
  { id:5, name:'Inventário containers B-12',       emp:'Maria Costa',    sector:'Pátio Principal',time:'3h',  pct:50,  status:'inprogress', justify:'Atraso na chegada do navio às 11h, containers não disponíveis antes do meio-dia.' },
  { id:6, name:'Relatório de saídas diário',       emp:'Maria Costa',    sector:'Escritório',     time:'1h',  pct:0,   status:'pending',    justify:'' },
  { id:7, name:'Rota carga seca Galpão 1→5',       emp:'Ricardo Alves',  sector:'Pátio',          time:'2d',  pct:0,   status:'pending',    justify:'Caminhão com defeito mecânico desde as 7h. Aguardando manutenção.' },
  { id:8, name:'Entrega porto Sul',                emp:'Ricardo Alves',  sector:'Porto Sul',      time:'4h',  pct:0,   status:'pending',    justify:'Caminhão com defeito mecânico desde as 7h. Aguardando manutenção.' },
  { id:9, name:'Operação descarga container C5',   emp:'Ana Souza',      sector:'Cais Berço 2',   time:'3h',  pct:100, status:'done',       justify:'' },
  { id:10,name:'Movimentação empilhadeira Z2',     emp:'Ana Souza',      sector:'Galpão 1',       time:'2h',  pct:100, status:'done',       justify:'' },
  { id:11,name:'Relatório turnos',                 emp:'Pedro Lima',     sector:'Escritório',     time:'1h',  pct:100, status:'done',       justify:'' },
  { id:12,name:'Conferência manifesto M-10',       emp:'Fernanda Nunes', sector:'Galpão 3',       time:'2h',  pct:100, status:'done',       justify:'' },
  { id:13,name:'Inventário carga frigorificada',   emp:'Fernanda Nunes', sector:'Câmara Fria',    time:'3h',  pct:50,  status:'inprogress', justify:'Equipamento de medição de temperatura com falha intermitente.' },
];

// ============ STATE ============
let selectedRole = 'manager';
let currentManagerScreen = 'dashboard';
let chartsInit = false;
let reportChartInit = false;

// ============ UTILS ============
function getPctColor(pct) {
  if(pct===null) return 'var(--gray300)';
  if(pct>=70) return 'var(--teal)';
  if(pct>=30) return 'var(--amber)';
  return 'var(--red)';
}
function getPctClass(pct) {
  if(pct>=70) return 'pb-green';
  if(pct>=30) return 'pb-amber';
  return 'pb-red';
}
function getStatusBadge(status) {
  if(status==='done')       return '<span class="badge bd-green">✅ Concluída</span>';
  if(status==='inprogress') return '<span class="badge bd-amber">🔄 Em andamento</span>';
  return '<span class="badge bd-red">⏳ Pendente</span>';
}
function getStatusDot(status) {
  if(status==='done')       return 'background:var(--teal)';
  if(status==='inprogress') return 'background:var(--amber)';
  return 'background:var(--red)';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ============ LOGIN ============
function selectRole(role) {
  selectedRole = role;
  document.getElementById('role-manager').classList.toggle('selected', role==='manager');
  document.getElementById('role-employee').classList.toggle('selected', role==='employee');
}

function doLogin() {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(selectedRole==='manager') {
    document.getElementById('screen-manager-app').classList.add('active');
    renderDashboard();
  } else {
    document.getElementById('screen-employee-app').classList.add('active');
    document.getElementById('emp-today-date').textContent = new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
  }
}

function doLogout() {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-login').classList.add('active');
}

// ============ MANAGER SCREENS ============
function showManagerScreen(name) {
  // hide all manager pages
  ['dashboard','employees','emp-detail','activities','new-activity','new-employee','reports']
    .forEach(s => {
      const el = document.getElementById('manager-'+s);
      if(el) el.style.display='none';
    });

  // update nav
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const navEl = document.getElementById('nav-'+name);
  if(navEl) navEl.classList.add('active');

  // show target
  const target = document.getElementById('manager-'+name);
  if(target) target.style.display='block';

  currentManagerScreen = name;

  if(name==='dashboard' && !chartsInit) { renderDashboard(); chartsInit=true; }
  if(name==='employees') renderEmployees();
  if(name==='activities') renderActivities();
  if(name==='new-employee') renderEmpQuickList();
  if(name==='reports' && !reportChartInit) { setTimeout(renderReportChart, 200); reportChartInit=true; }
}

// ============ DASHBOARD ============
function renderDashboard() {
  const dateEl = document.getElementById('dash-date');
  if(dateEl) dateEl.textContent = new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  // Team list
  const teamEl = document.getElementById('dash-team-list');
  if(teamEl) {
    const active = employees.filter(e=>e.pct!==null);
    teamEl.innerHTML = active.map(emp=>`
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray100);cursor:pointer;" onclick="showEmpDetail(${emp.id})">
        <div class="avatar ${emp.avClass}" style="width:36px;height:36px;font-size:13px;">${emp.initials}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--gray800);">${emp.name}</div>
          <div style="font-size:11px;color:var(--gray400);">${emp.role}</div>
          <div class="progress-wrap" style="margin-top:5px;height:6px;"><div class="progress-bar ${getPctClass(emp.pct)}" style="width:${emp.pct}%;height:6px;"></div></div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:15px;font-weight:700;color:${getPctColor(emp.pct)};">${emp.pct}%</div>
          <div style="font-size:10px;color:var(--gray400);">${emp.done}✅ ${emp.pending}⏳</div>
        </div>
      </div>
    `).join('');
  }

  // Pending
  const pendEl = document.getElementById('dash-pending');
  if(pendEl) {
    const pend = activities.filter(a=>a.status!=='done').slice(0,4);
    pendEl.innerHTML = pend.map(a=>`
      <div class="task-item">
        <div class="task-dot" style="${getStatusDot(a.status)}"></div>
        <div class="task-body">
          <div class="task-name">${a.name}</div>
          <div class="task-meta">${a.emp} · ${a.time} · ${a.sector}</div>
        </div>
        ${getStatusBadge(a.status)}
      </div>
    `).join('');
  }

  // Justificativas
  const justEl = document.getElementById('dash-justificativas');
  if(justEl) {
    const withJ = activities.filter(a=>a.justify);
    justEl.innerHTML = withJ.map(a=>`
      <div style="margin-bottom:10px;">
        <div style="font-size:12px;font-weight:600;color:var(--gray700);">${a.emp} — ${a.name}</div>
        <div class="justify-box" style="margin-top:4px;">
          <div class="justify-text">"${a.justify}"</div>
        </div>
      </div>
    `).join('');
  }

  // Week chart - com altura fixa e delay maior
  setTimeout(() => {
    const weekCanvas = document.getElementById('weekChart');
    if (weekCanvas && !weekCanvas._chartInstance) {
      weekCanvas.style.height = '160px';
      weekCanvas.style.width = '100%';
      
      weekCanvas._chartInstance = new Chart(weekCanvas, {
        type: 'bar',
        data: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex (hoje)'],
          datasets: [
            { label: 'Concluídas', data: [9, 10, 7, 11, 8], backgroundColor: '#0b9e77', borderRadius: 4 },
            { label: 'Pendentes',  data: [2, 1, 3, 1, 5],   backgroundColor: '#f59e0b', borderRadius: 4 },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
          scales: {
            x: { stacked: false, grid: { display: false } },
            y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }
          }
        }
      });
    }

    const sectorCanvas = document.getElementById('sectorChart');
    if (sectorCanvas && !sectorCanvas._chartInstance) {
      sectorCanvas.style.height = '180px';
      sectorCanvas.style.width = '100%';
      
      sectorCanvas._chartInstance = new Chart(sectorCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Operações', 'Conferência', 'Transporte', 'Supervisão'],
          datasets: [{ data: [45, 25, 20, 10], backgroundColor: ['#0b9e77', '#3b82f6', '#f59e0b', '#8b5cf6'], borderWidth: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
        }
      });
    }
  }, 250);
}

// ============ EMPLOYEES ============
function renderEmployees() {
  const grid = document.getElementById('emp-cards-grid');
  if(!grid) return;
  grid.innerHTML = employees.map(emp=>`
    <div class="emp-card" onclick="showEmpDetail(${emp.id})">
      <div class="emp-header">
        <div class="avatar ${emp.avClass}" style="width:44px;height:44px;font-size:15px;">${emp.initials}</div>
        <div>
          <div class="emp-name">${emp.name}</div>
          <div class="emp-role-text">${emp.role}</div>
          <div style="font-size:11px;color:var(--gray400);">${emp.matricula} · ${emp.shift}</div>
        </div>
      </div>
      ${emp.pct!==null ? `
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray400);margin-bottom:4px;">
          <span>Progresso hoje</span>
          <strong style="color:${getPctColor(emp.pct)};">${emp.pct}%</strong>
        </div>
        <div class="progress-wrap"><div class="progress-bar ${getPctClass(emp.pct)}" style="width:${emp.pct}%"></div></div>
        <div class="emp-stats">
          <div class="emp-stat"><div class="emp-stat-val" style="color:var(--teal);">${emp.done}</div><div class="emp-stat-lab">Concluídas</div></div>
          <div class="emp-stat"><div class="emp-stat-val" style="color:var(--amber);">${emp.inprogress}</div><div class="emp-stat-lab">Andamento</div></div>
          <div class="emp-stat"><div class="emp-stat-val" style="color:var(--red);">${emp.pending}</div><div class="emp-stat-lab">Pendentes</div></div>
        </div>
      ` : '<div style="font-size:12px;color:var(--gray400);margin-top:8px;">Gestor — sem atividades diretas</div>'}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--gray100);">
        <span class="badge ${emp.pct===null?'bd-gray':emp.pct>=70?'bd-green':emp.pct>=30?'bd-amber':'bd-red'}">${emp.pct===null?'—':emp.pct>=70?'No prazo':emp.pct>=30?'Atenção':'Atrasado'}</span>
        <span style="font-size:11px;color:var(--teal);font-weight:600;">Ver detalhes →</span>
      </div>
    </div>
  `).join('');
}

// ============ EMPLOYEE DETAIL ============
function showEmpDetail(id) {
  const emp = employees.find(e=>e.id===id);
  if(!emp) return;
  showManagerScreen('emp-detail');

  document.getElementById('detail-topbar-name').textContent = emp.name;
  document.getElementById('nav-employees').classList.add('active');

  const empActs = activities.filter(a=>a.emp===emp.name);
  const content = document.getElementById('emp-detail-content');
  if(!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <div class="avatar ${emp.avClass} detail-avatar">${emp.initials}</div>
      <div>
        <div class="detail-name">${emp.name}</div>
        <div class="detail-role">${emp.role} · ${emp.sector}</div>
        <div class="detail-meta">${emp.matricula} · Turno: ${emp.shift}</div>
      </div>
      <div style="margin-left:auto;text-align:center;padding:12px 20px;background:var(--gray50);border-radius:var(--radius);border:1px solid var(--gray200);">
        ${emp.pct!==null?`
          <div style="font-size:28px;font-weight:800;color:${getPctColor(emp.pct)};">${emp.pct}%</div>
          <div style="font-size:12px;color:var(--gray500);">Conclusão hoje</div>
        `:'<div style="font-size:13px;color:var(--gray400);">Sem atividades</div>'}
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="section-header">
          <div class="section-title">📋 Atividades de Hoje (${empActs.length})</div>
          <button class="btn btn-primary btn-sm" onclick="showManagerScreen('new-activity')">+ Adicionar</button>
        </div>
        ${empActs.length===0?'<div style="color:var(--gray400);font-size:13px;">Nenhuma atividade designada hoje.</div>':
          empActs.map(a=>`
            <div class="task-item">
              <div class="task-dot" style="${getStatusDot(a.status)}"></div>
              <div class="task-body">
                <div class="task-name">${a.name}</div>
                <div class="task-meta">⏱ ${a.time} · 📍 ${a.sector}</div>
                ${a.justify?`<div class="justify-box ${a.status==='pending'?'red':''}" style="margin-top:6px;"><div class="justify-label">Justificativa</div><div class="justify-text">"${a.justify}"</div></div>`:''}
              </div>
              <div style="text-align:right;flex-shrink:0;">
                ${getStatusBadge(a.status)}
                <div style="font-size:14px;font-weight:700;color:${getPctColor(a.pct)};margin-top:4px;">${a.pct}%</div>
              </div>
            </div>
          `).join('')}
        <div style="display:flex;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--gray200);">
          <button class="btn btn-secondary btn-sm" onclick="openModal('modal-redesign')">🔄 Redesignar</button>
          <button class="btn btn-danger btn-sm" onclick="showToast('Atividade removida!')">🗑 Remover</button>
        </div>
      </div>

      <div class="card">
        <div class="section-title" style="margin-bottom:14px;">📊 Desempenho — Semana</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${['Seg','Ter','Qua','Qui','Sex'].map((d,i)=>{
            const vals=[82,91,67,88,emp.pct||0];
            return `<div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray500);margin-bottom:3px;"><span>${d}</span><strong>${vals[i]}%</strong></div>
              <div class="progress-wrap"><div class="progress-bar ${getPctClass(vals[i])}" style="width:${vals[i]}%"></div></div>
            </div>`;
          }).join('')}
        </div>
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--gray200);">
          <div style="font-size:12px;color:var(--gray500);margin-bottom:4px;">Média da semana</div>
          <div style="font-size:20px;font-weight:700;color:var(--teal);">82%</div>
        </div>
      </div>
    </div>
  `;
}

// ============ ACTIVITIES ============
function renderActivities() {
  const tbody = document.getElementById('activities-table');
  if(!tbody) return;
  tbody.innerHTML = activities.map(a=>`
    <tr>
      <td>${getStatusBadge(a.status)}</td>
      <td style="font-weight:600;">${a.name}</td>
      <td>${a.emp}</td>
      <td style="color:var(--gray500);">${a.sector}</td>
      <td style="color:var(--gray500);">${a.time}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-wrap" style="width:80px;height:6px;"><div class="progress-bar ${getPctClass(a.pct)}" style="width:${a.pct}%;height:6px;"></div></div>
          <span style="font-size:12px;font-weight:600;color:${getPctColor(a.pct)};">${a.pct}%</span>
        </div>
      </td>
      <td style="max-width:180px;">
        ${a.justify?`<span style="font-size:11px;color:var(--amber);cursor:pointer;" title="${a.justify}">⚠️ Ver justificativa</span>`:'<span style="font-size:11px;color:var(--gray300);">—</span>'}
      </td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-secondary btn-sm" onclick="openModal('modal-redesign')">🔄</button>
          <button class="btn btn-danger btn-sm" onclick="showToast('Atividade removida!')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ============ NEW EMPLOYEE QUICK LIST ============
function renderEmpQuickList() {
  const el = document.getElementById('emp-quick-list');
  if(!el) return;
  el.innerHTML = employees.slice(0,6).map(emp=>`
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="avatar ${emp.avClass}" style="width:30px;height:30px;font-size:11px;">${emp.initials}</div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--gray800);">${emp.name}</div>
        <div style="font-size:11px;color:var(--gray400);">${emp.role}</div>
      </div>
      <span class="badge ${emp.pct===null?'bd-gray':emp.pct>=70?'bd-green':emp.pct>=30?'bd-amber':'bd-red'}" style="margin-left:auto;">${emp.pct===null?'Gestor':emp.pct+'%'}</span>
    </div>
  `).join('');
}

// ============ REPORT CHART ============
function renderReportChart() {
  const ctx = document.getElementById('reportChart');
  if(ctx && !ctx._chartInstance) {
    ctx.style.height = '200px';
    ctx.style.width = '100%';
    
    ctx._chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
        datasets: [{
          label: 'Taxa de conclusão (%)',
          data: [72, 80, 67, 85, 78],
          borderColor: '#0b9e77',
          backgroundColor: 'rgba(11,158,119,.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#0b9e77',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { 
            min: 0, 
            max: 100, 
            ticks: { callback: v => v + '%', font: { size: 11 } }, 
            grid: { color: '#f3f4f6' } 
          }
        }
      }
    });
  }
}

// ============ FORM ACTIONS ============
function saveActivity() {
  showManagerScreen('activities');
  showToast('✅ Atividade cadastrada com sucesso!');
}
function saveEmployee() {
  showManagerScreen('employees');
  showToast('✅ Funcionário cadastrado com sucesso!');
  renderEmployees();
}

// ============ EMPLOYEE MODE ============
function switchEmpPage(page) {
  document.querySelectorAll('.emp-content').forEach(e=>e.style.display='none');
  document.querySelectorAll('.emp-nav-item').forEach(e=>e.classList.remove('active'));
  document.getElementById('emp-page-'+page).style.display='block';
  document.getElementById('emp-nav-'+page).classList.add('active');
}

function updateEmpTask(v) {
  document.getElementById('inv-pct-emp').textContent=v+'%';
  document.getElementById('inv-range-val').textContent=v+'%';
  const bar=document.getElementById('inv-bar-emp');
  bar.style.width=v+'%';
  bar.className='progress-bar '+(v>=70?'pb-green':v>=30?'pb-amber':'pb-red');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', ()=>{
  showManagerScreen('dashboard');
});
