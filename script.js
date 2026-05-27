// ============ DATA (EXPANDIDA COM ESTIMATIVAS E METADADOS) ============
const employees = [
  { id:1, name:'João Silva',     initials:'JS', role:'Operador de Pátio',  sector:'Operações Portuárias', shift:'Manhã',  matricula:'TI-2022-001', color:'var(--teal)', avClass:'av-teal' },
  { id:2, name:'Maria Costa',    initials:'MC', role:'Conferente',         sector:'Conferência',          shift:'Manhã',  matricula:'TI-2022-004', color:'var(--blue)', avClass:'av-blue' },
  { id:3, name:'Ricardo Alves',  initials:'RA', role:'Motorista',          sector:'Transporte',           shift:'Tarde',  matricula:'TI-2021-007', color:'var(--amber)', avClass:'av-amber' },
  { id:4, name:'Ana Souza',      initials:'AS', role:'Operadora de Pátio', sector:'Operações Portuárias', shift:'Manhã',  matricula:'TI-2023-002', color:'var(--teal)', avClass:'av-teal' },
  { id:5, name:'Pedro Lima',     initials:'PL', role:'Supervisor',         sector:'Operações',            shift:'Admin',  matricula:'TI-2019-001', color:'var(--teal)', avClass:'av-teal' },
  { id:6, name:'Fernanda Nunes', initials:'FN', role:'Conferente',         sector:'Conferência',          shift:'Tarde',  matricula:'TI-2023-005', color:'var(--blue)', avClass:'av-blue' },
  { id:7, name:'Lucas Martins',  initials:'LM', role:'Motorista',          sector:'Transporte',           shift:'Tarde',  matricula:'TI-2020-003', color:'var(--teal)', avClass:'av-teal' },
  { id:8, name:'Carlos Ramos',   initials:'CR', role:'Gerente de Operações',sector:'Gestão',             shift:'Admin',  matricula:'TI-2018-001', color:'var(--navy)', avClass:'av-navy' },
];

// Adicionado: estHours (Tempo Estimado) e actHours (Tempo Real Gasto até agora)
const activities = [
  { id:1, name:'Descarga navio Anita',             emp:'João Silva',     sector:'Cais Berço 1',   time:'2h', estHours: 2, actHours: 2, pct:100, status:'done',      justify:'' },
  { id:2, name:'Registro de carga L47',            emp:'João Silva',     sector:'Escritório',     time:'1h', estHours: 1, actHours: 1, pct:100, status:'done',      justify:'' },
  { id:3, name:'Transporte ao galpão 3',           emp:'João Silva',     sector:'Pátio',          time:'1h', estHours: 1, actHours: 0.8, pct:20,  status:'inprogress', justify:'' },
  { id:4, name:'Conferência manifesto M-09',       emp:'Maria Costa',    sector:'Galpão 2',       time:'2h', estHours: 2, actHours: 2, pct:100, status:'done',      justify:'' },
  { id:5, name:'Inventário containers B-12',       emp:'Maria Costa',    sector:'Pátio Principal',time:'3h', estHours: 3, actHours: 4, pct:50,  status:'inprogress', justify:'Atraso na chegada do navio às 11h, containers não disponíveis antes do meio-dia.' },
  { id:6, name:'Relatório de saídas diário',       emp:'Maria Costa',    sector:'Escritório',     time:'1h', estHours: 1, actHours: 0, pct:0,   status:'pending',    justify:'' },
  { id:7, name:'Rota carga seca Galpão 1→5',       emp:'Ricardo Alves',  sector:'Pátio',          time:'4h', estHours: 4, actHours: 5, pct:10,  status:'inprogress', justify:'Caminhão com defeito mecânico desde as 7h. Aguardando manutenção.' },
  { id:8, name:'Entrega porto Sul',                emp:'Ricardo Alves',  sector:'Porto Sul',      time:'4h', estHours: 4, actHours: 0, pct:0,   status:'pending',    justify:'Caminhão com defeito mecânico desde as 7h. Aguardando manutenção.' },
  { id:9, name:'Operação descarga container C5',   emp:'Ana Souza',      sector:'Cais Berço 2',   time:'3h', estHours: 3, actHours: 3, pct:100, status:'done',      justify:'' },
  { id:10,name:'Movimentação empilhadeira Z2',     emp:'Ana Souza',      sector:'Galpão 1',       time:'2h', estHours: 2, actHours: 2, pct:100, status:'done',      justify:'' },
  { id:11,name:'Relatório turnos',                 emp:'Pedro Lima',     sector:'Escritório',     time:'1h', estHours: 1, actHours: 1, pct:100, status:'done',      justify:'' },
  { id:12,name:'Conferência manifesto M-10',       emp:'Fernanda Nunes', sector:'Galpão 3',       time:'2h', estHours: 2, actHours: 2, pct:100, status:'done',      justify:'' },
  { id:13,name:'Inventário carga frigorificada',   emp:'Fernanda Nunes', sector:'Câmara Fria',    time:'3h', estHours: 3, actHours: 3.5, pct:40,  status:'inprogress', justify:'Equipamento de medição de temperatura com falha intermitente.' },
];

// ============ STATE ============
let selectedRole = 'manager';
let currentManagerScreen = 'dashboard';
let activityToRedesignId = null;

let chartInstances = { weekChart: null, sectorChart: null, reportChart: null };

// ============ UTILS & METRICS ============
function getEmployeeMetrics(empName) {
  const empActs = activities.filter(a => a.emp === empName);
  if (empActs.length === 0) {
    const isManager = employees.find(e => e.name === empName)?.sector === 'Gestão';
    return { pct: isManager ? null : 0, done: 0, inprogress: 0, pending: 0 };
  }
  
  const done = empActs.filter(a => a.status === 'done').length;
  const inprogress = empActs.filter(a => a.status === 'inprogress').length;
  const pending = empActs.filter(a => a.status === 'pending').length;
  const totalPct = empActs.reduce((acc, curr) => acc + curr.pct, 0);
  
  return { pct: Math.round(totalPct / empActs.length), done, inprogress, pending };
}

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
  if(status==='inprogress') return '<span class="badge bd-amber">🔄 Em curso</span>';
  return '<span class="badge bd-red">⏳ Pendente</span>';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if(!t) return;
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
    showManagerScreen('dashboard');
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
  ['dashboard','employees','emp-detail','activities','new-activity','new-employee','reports']
    .forEach(s => {
      const el = document.getElementById('manager-'+s);
      if(el) el.style.display='none';
    });

  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const navEl = document.getElementById('nav-'+name);
  if(navEl) navEl.classList.add('active');

  const target = document.getElementById('manager-'+name);
  if(target) target.style.display='block';

  currentManagerScreen = name;

  if(name==='dashboard') renderDashboard();
  if(name==='employees') renderEmployees();
  if(name==='activities') renderActivities();
  if(name==='new-activity') populateFormSelects();
  if(name==='new-employee') renderEmpQuickList();
  if(name==='reports') { setTimeout(renderReportChart, 200); }
}

function populateFormSelects() {
  const actSelect = document.getElementById('act-emp-select');
  if (actSelect) {
    actSelect.innerHTML = '<option value="">Selecione o funcionário responsável...</option>' +
      employees.map(e => `<option value="${e.name}">${e.name} (${e.role})</option>`).join('');
  }
}

// ============ INTERFACES AVANÇADAS DO DASHBOARD ============

function calculateGlobalKPIs() {
  const total = activities.length;
  const done = activities.filter(a => a.status === 'done').length;
  const oee = Math.round((done / total) * 100);

  // Regra de estimativa de atraso: se actHours > estHours e pct < 100, está em Overtime/Atraso
  const delayedActs = activities.filter(a => a.status !== 'done' && a.actHours > a.estHours).length;
  const occurrences = activities.filter(a => a.justify !== '').length;

  return { oee, delayedActs, occurrences, total };
}

function renderGargalosEInsights() {
  const bottlenecksContainer = document.getElementById('dash-bottlenecks');
  const insightsContainer = document.getElementById('dash-insights');
  if (!bottlenecksContainer || !insightsContainer) return;

  let bottlenecksHTML = '';
  let insightsHTML = '';

  // 1. Análise de Gargalo por Setor/Equipamento (Caminhões ou Pátio)
  const patioIssues = activities.filter(a => a.justify.toLowerCase().includes('caminhão') || a.justify.toLowerCase().includes('manutenção'));
  if (patioIssues.length > 0) {
    bottlenecksHTML += `
      <div style="padding: 10px; background: #fee2e2; border-left: 4px solid var(--red); border-radius: 4px; margin-bottom: 8px;">
        <div style="font-size:12px; font-weight:700; color:#991b1b;">🔴 GARGALO: Indisponibilidade de Ativos (${patioIssues.length} tarefas paradas)</div>
        <div style="font-size:11px; color:#7f1d1d; margin-top:2px;">Frota de transporte terrestre comprometida devido a manutenções não planejadas de manhã.</div>
      </div>
    `;
    insightsHTML += `
      <div style="padding: 10px; background: #e0f2fe; border-left: 4px solid var(--blue); border-radius: 4px; margin-bottom: 8px;">
        <div style="font-size:12px; font-weight:700; color:#0369a1;">💡 RECOMENDAÇÃO: Redesenho de Rotas</div>
        <div style="font-size:11px; color:#0c4a6e; margin-top:2px;">Substituir imediatamente os veículos afetados do operador <strong>Ricardo Alves</strong> ou mover tarefas prioritárias para parceiros terceirizados hoje.</div>
      </div>
    `;
  }

  // 2. Análise de Carga Horária/Acúmulo (Overload Check)
  employees.forEach(emp => {
    const activeTasks = activities.filter(a => a.emp === emp.name && a.status === 'inprogress');
    if (activeTasks.length >= 2) {
      bottlenecksHTML += `
        <div style="padding: 10px; background: #fffdb2; border-left: 4px solid var(--amber); border-radius: 4px; margin-bottom: 8px;">
          <div style="font-size:12px; font-weight:700; color:#92400e;">⚠️ SOBRECARGA: ${emp.name}</div>
          <div style="font-size:11px; color:#78350f; margin-top:2px;">O colaborador possui ${activeTasks.length} tarefas em execução paralela. Risco iminente de perda de eficiência (Fator de Fadiga).</div>
        </div>
      `;
    }
  });

  // 3. Insight de Janela de Cais Livre
  const caisTasks = activities.filter(a => a.sector.includes('Cais') && a.status === 'done').length;
  if (caisTasks >= 2) {
    insightsHTML += `
      <div style="padding: 10px; background: #e0f5ef; border-left: 4px solid var(--teal); border-radius: 4px; margin-bottom: 8px;">
        <div style="font-size:12px; font-weight:700; color:#0f766e;">🚀 OPORTUNIDADE: Janela de Cais Antecipada</div>
        <div style="font-size:11px; color:#115e59; margin-top:2px;">Cais Berço 1 e 2 operando acima do KPI esperado. Antecipar a atracação de navios em fila de espera para otimizar demurrage.</div>
      </div>
    `;
  }

  bottlenecksContainer.innerHTML = bottlenecksHTML || '<div style="color:var(--gray400); font-size:11px;">Operação fluindo dentro das tolerâncias estruturais.</div>';
  insightsContainer.innerHTML = insightsHTML || '<div style="color:var(--gray400); font-size:11px;">Coletando mais métricas de ciclo para gerar previsões preditivas.</div>';
}

function renderDashboard() {
  const dateEl = document.getElementById('dash-date');
  if(dateEl) dateEl.textContent = new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  // Injetar KPIs Dinâmicos de Alto Impacto Visual no topo do HTML
  const kpis = calculateGlobalKPIs();
  const kpiWrapper = document.getElementById('dash-kpi-summary');
  if (kpiWrapper) {
    kpiWrapper.innerHTML = `
      <div class="card" style="padding:15px; border-top:4px solid var(--teal); text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--gray400); font-weight:700;">Eficiência (OEE)</div>
        <div style="font-size:24px; font-weight:800; color:var(--navy); margin-top:5px;">${kpis.oee}%</div>
      </div>
      <div class="card" style="padding:15px; border-top:4px solid var(--red); text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--gray400); font-weight:700;">Em Atraso / Alerta</div>
        <div style="font-size:24px; font-weight:800; color:var(--red); margin-top:5px;">${kpis.delayedActs}</div>
      </div>
      <div class="card" style="padding:15px; border-top:4px solid var(--amber); text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--gray400); font-weight:700;">Ocorrências Ativas</div>
        <div style="font-size:24px; font-weight:800; color:var(--amber); margin-top:5px;">${kpis.occurrences}</div>
      </div>
      <div class="card" style="padding:15px; border-top:4px solid var(--blue); text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--gray400); font-weight:700;">Total de Escopos</div>
        <div style="font-size:24px; font-weight:800; color:var(--navy); margin-top:5px;">${kpis.total}</div>
      </div>
    `;
  }

  // Lista da Equipe
  const teamEl = document.getElementById('dash-team-list');
  if(teamEl) {
    teamEl.innerHTML = employees.map(emp => {
      const metrics = getEmployeeMetrics(emp.name);
      if(metrics.pct === null) return '';
      return `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray100);cursor:pointer;" onclick="showEmpDetail(${emp.id})">
          <div class="avatar ${emp.avClass}" style="width:36px;height:36px;font-size:13px;">${emp.initials}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:var(--gray800);">${emp.name}</div>
            <div class="progress-wrap" style="margin-top:5px;height:6px;"><div class="progress-bar ${getPctClass(metrics.pct)}" style="width:${metrics.pct}%;height:6px;"></div></div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:14px;font-weight:700;color:${getPctColor(metrics.pct)};">${metrics.pct}%</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Monitor Completo de Tarefas com Visão de Estimativa (ETA) e Tempo Real
  const pendEl = document.getElementById('dash-pending');
  if(pendEl) {
    pendEl.innerHTML = activities.map(a=>{
      const isOvertime = a.status !== 'done' && a.actHours > a.estHours;
      return `
        <div class="task-item" style="${isOvertime ? 'border-left: 3px solid var(--red); background:#fff5f5;' : ''}">
          <div style="flex:1; min-width:0;">
            <div class="task-name" style="font-weight:700;">${a.name}</div>
            <div class="task-meta">${a.emp} · 📍 ${a.sector}</div>
            <div style="margin-top:6px; font-size:11px; display:flex; gap:12px; color:var(--gray500);">
              <span>📊 Progresso: <strong>${a.pct}%</strong></span>
              <span>⏱️ Est: <strong>${a.estHours}h</strong></span>
              <span>⏱️ Real: <strong style="${isOvertime?'color:var(--red); font-weight:bold;':''}">${a.actHours}h</strong></span>
            </div>
          </div>
          <div style="text-align:right; flex-shrink:0;">
            ${getStatusBadge(a.status)}
            ${isOvertime ? `<div style="font-size:10px; color:var(--red); font-weight:700; margin-top:4px;">⚠️ OVERTIME (+${(a.actHours - a.estHours).toFixed(1)}h)</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Renderizar Inteligência de Negócio e Gráficos
  renderGargalosEInsights();

  setTimeout(() => {
    const weekCanvas = document.getElementById('weekChart');
    if (weekCanvas) {
      if (chartInstances.weekChart) chartInstances.weekChart.destroy();
      chartInstances.weekChart = new Chart(weekCanvas, {
        type: 'bar',
        data: {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex (hoje)'],
          datasets: [
            { label: 'Concluídas', data: [9, 10, 7, 11, activities.filter(a=>a.status==='done').length], backgroundColor: '#0b9e77', borderRadius: 4 },
            { label: 'Pendentes/Curso',  data: [2, 1, 3, 1, activities.filter(a=>a.status!=='done').length],   backgroundColor: '#f59e0b', borderRadius: 4 },
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: '#f3f4f6' } } } }
      });
    }

    const sectorCanvas = document.getElementById('sectorChart');
    if (sectorCanvas) {
      if (chartInstances.sectorChart) chartInstances.sectorChart.destroy();
      chartInstances.sectorChart = new Chart(sectorCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Op. Portuárias', 'Conferência', 'Transporte', 'Escritório'],
          datasets: [{ 
            data: [
              activities.filter(a=>a.sector.includes('Cais') || a.sector.includes('Pátio')).length,
              activities.filter(a=>a.sector.includes('Galpão') || a.sector.includes('Conferência')).length,
              activities.filter(a=>a.sector.includes('Porto') || a.sector.includes('Rota')).length,
              activities.filter(a=>a.sector.includes('Escritório')).length
            ], 
            backgroundColor: ['#0b9e77', '#3b82f6', '#f59e0b', '#8b5cf6'], borderWidth: 0 
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }, 250);
}

// ============ EMPLOYEES & DETAILS ============
function renderEmployees() {
  const grid = document.getElementById('emp-cards-grid');
  if(!grid) return;
  grid.innerHTML = employees.map(emp=>{
    const metrics = getEmployeeMetrics(emp.name);
    return `
      <div class="emp-card" onclick="showEmpDetail(${emp.id})">
        <div class="emp-header">
          <div class="avatar ${emp.avClass}" style="width:44px;height:44px;font-size:15px;">${emp.initials}</div>
          <div>
            <div class="emp-name">${emp.name}</div>
            <div class="emp-role-text">${emp.role}</div>
            <div style="font-size:11px;color:var(--gray400);">${emp.matricula} · ${emp.shift}</div>
          </div>
        </div>
        ${metrics.pct!==null ? `
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray400);margin-bottom:4px;margin-top:10px;">
            <span>Eficiência do Dia</span>
            <strong style="color:${getPctColor(metrics.pct)};">${metrics.pct}%</strong>
          </div>
          <div class="progress-wrap"><div class="progress-bar ${getPctClass(metrics.pct)}" style="width:${metrics.pct}%"></div></div>
        ` : '<div style="font-size:12px;color:var(--gray400);margin-top:8px;">Gestor — sem atividades diretas</div>'}
      </div>
    `;
  }).join('');
}

function showEmpDetail(id) {
  const emp = employees.find(e=>e.id===id);
  if(!emp) return;
  showManagerScreen('emp-detail');

  document.getElementById('detail-topbar-name').textContent = emp.name;
  const empActs = activities.filter(a=>a.emp===emp.name);
  const metrics = getEmployeeMetrics(emp.name);
  const content = document.getElementById('emp-detail-content');
  if(!content) return;

  content.innerHTML = `
    <div class="detail-header">
      <div class="avatar ${emp.avClass} detail-avatar">${emp.initials}</div>
      <div>
        <div class="detail-name">${emp.name}</div>
        <div class="detail-role">${emp.role} · ${emp.sector}</div>
      </div>
    </div>
    <div class="card">
      <h3>Atividades Alocadas</h3>
      ${empActs.map(a => `<div style="padding:8px 0; border-bottom:1px solid var(--gray100);">${a.name} - <strong>${a.pct}%</strong></div>`).join('')}
    </div>
  `;
}

function openRedesignModalForUser(name) {
  const firstAct = activities.find(a => a.emp === name && a.status !== 'done');
  if(!firstAct) {
    showToast('Nenhuma atividade pendente para transferir!');
    return;
  }
  activityToRedesignId = firstAct.id;
  const modalSelect = document.querySelector('#modal-redesign select');
  if(modalSelect) {
    modalSelect.innerHTML = '<option value="">Selecione...</option>' +
      employees.filter(e => e.name !== name && e.sector !== 'Gestão').map(e => `<option value="${e.name}">${e.name}</option>`).join('');
  }
  openModal('modal-redesign');
}

function executeRedesign() {
  const modalSelect = document.querySelector('#modal-redesign select');
  if(!modalSelect || !modalSelect.value) return;
  const act = activities.find(a => a.id === activityToRedesignId);
  if(act) {
    act.emp = modalSelect.value;
    showToast('Atividade transferida!');
  }
  closeModal('modal-redesign');
  showManagerScreen('dashboard');
}

// ============ TABLE ACTIVITIES ============
function renderActivities() {
  const tbody = document.getElementById('activities-table');
  if(!tbody) return;
  tbody.innerHTML = activities.map(a=>`
    <tr>
      <td>${getStatusBadge(a.status)}</td>
      <td>${a.name}</td>
      <td>${a.emp}</td>
      <td>${a.sector}</td>
      <td>${a.estHours}h / ${a.actHours}h</td>
      <td>${a.pct}%</td>
      <td><button class="btn btn-danger btn-sm" onclick="removeActivity(${a.id})">🗑</button></td>
    </tr>
  `).join('');
}

function removeActivity(id) {
  const idx = activities.findIndex(a => a.id === id);
  if(idx !== -1) { activities.splice(idx, 1); renderActivities(); }
}

function renderEmpQuickList() {
  const el = document.getElementById('emp-quick-list');
  if(!el) return;
  el.innerHTML = employees.slice(-3).map(e => `<div>${e.name} (${e.role})</div>`).join('');
}

function renderReportChart() {
  const ctx = document.getElementById('reportChart');
  if(ctx) {
    if (chartInstances.reportChart) chartInstances.reportChart.destroy();
    chartInstances.reportChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
        datasets: [{ label: 'Performance Geral %', data: [75, 82, 70, 89, calculateGlobalKPIs().oee], borderColor: '#0b9e77', fill: true }]
      }
    });
  }
}

// ============ FORM ACTIONS ============
function saveActivity() {
  const nameIn = document.getElementById('new-act-name');
  const empSel = document.getElementById('act-emp-select');
  const estIn = document.getElementById('new-act-est') || {value: 2}; // Fallback se não criado no HTML

  if(!nameIn || !nameIn.value || !empSel || !empSel.value) {
    alert('Preencha os campos obrigatórios.');
    return;
  }

  activities.push({
    id: activities.length + 1,
    name: nameIn.value,
    emp: empSel.value,
    sector: 'Pátio Geral',
    time: estIn.value + 'h',
    estHours: parseFloat(estIn.value) || 2,
    actHours: 0,
    pct: 0,
    status: 'pending',
    justify: ''
  });

  nameIn.value = '';
  showManagerScreen('activities');
  showToast('✅ Atividade inserida no pipeline!');
}

function saveEmployee() {
  const nameIn = document.getElementById('new-emp-name');
  if(!nameIn || !nameIn.value) return;

  employees.push({
    id: employees.length + 1,
    name: nameIn.value,
    initials: 'NF',
    role: 'Operador',
    sector: 'Pátio',
    shift: 'Manhã',
    matricula: `TI-2026-${Math.floor(100 + Math.random()*900)}`,
    color: 'var(--blue)',
    avClass: 'av-blue'
  });

  nameIn.value = '';
  showManagerScreen('employees');
}

function switchEmpPage(page) {
  document.querySelectorAll('.emp-content').forEach(e=>e.style.display='none');
  document.getElementById('emp-page-'+page).style.display='block';
}

function updateEmpTask(v) {
  const bar=document.getElementById('inv-bar-emp');
  if(bar) bar.style.width=v+'%';
}

document.addEventListener('DOMContentLoaded', ()=>{
  populateFormSelects();
  const saveRedesignBtn = document.querySelector('#modal-redesign .btn-primary');
  if(saveRedesignBtn) saveRedesignBtn.setAttribute('onclick', 'executeRedesign()');
});
