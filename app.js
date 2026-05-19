// =============================================
//   CONFIG
// =============================================
const SUPABASE_URL = "https://atgyefigxigkfpfgbycu.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXldtz1K4KsuRje0khdQDQ_B0DBzxi3";
const CLAUDE_API_KEY = "YOUR_CLAUDE_API_KEY_HERE";

// =============================================
//   STATE
// =============================================
let allMedicines = [];
let filteredResults = [];
let displayedCount = 0;
const PAGE_SIZE = 30;
let isLoading = false;
const pageTitles = {
  search: 'البحث عن دواء',
  equivalent: 'البحث عن مثيل',
  interactions: 'التعارضات',
  ai: 'المساعد الذكي'
};

// =============================================
//   LOAD DATA
// =============================================
async function loadAllMedicines() {
  try {
    let all = [];
    let from = 0;
    const batch = 1000;
    while (true) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/medicines?select=*&order=trade_name.asc&limit=${batch}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();
      if (!data || !data.length) break;
      all = all.concat(data);
      if (data.length < batch) break;
      from += batch;
    }
    allMedicines = all;
    document.getElementById('dbCount').textContent = `${allMedicines.length.toLocaleString()} دواء متاح`;
    populateFilters();
    showInitialState();
  } catch (e) {
    document.getElementById('dbCount').textContent = 'خطأ في التحميل';
    console.error(e);
  }
}

// =============================================
//   FILTERS
// =============================================
function populateFilters() {
  const groups = [...new Set(allMedicines.map(m => m.medical_group).filter(Boolean))].sort();
  const companies = [...new Set(allMedicines.map(m => m.manufacturer).filter(Boolean))].sort();

  const gf = document.getElementById('groupFilter');
  groups.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; gf.appendChild(o); });

  const cf = document.getElementById('companyFilter');
  companies.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; cf.appendChild(o); });
}

// =============================================
//   SEARCH
// =============================================
function showInitialState() {
  document.getElementById('searchStats').textContent = `إجمالي قاعدة البيانات: ${allMedicines.length.toLocaleString()} دواء`;
  document.getElementById('searchResults').innerHTML = `
    <div class="empty-state">
      <div class="es-emoji">💊</div>
      <h3>ابدأ البحث</h3>
      <p>اكتب اسم الدواء أو المادة الفعالة</p>
    </div>`;
  document.getElementById('loadMore').style.display = 'none';
}

function searchMedicines() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const group = document.getElementById('groupFilter').value;
  const company = document.getElementById('companyFilter').value;
  const clearBtn = document.getElementById('searchClear');
  clearBtn.style.display = q ? 'flex' : 'none';

  if (!q && !group && !company) { showInitialState(); return; }

  filteredResults = allMedicines.filter(m => {
    const mq = !q || (m.trade_name || '').toLowerCase().includes(q) || (m.active_ingredient || '').toLowerCase().includes(q) || (m.drug_code || '').includes(q);
    const mg = !group || m.medical_group === group;
    const mc = !company || m.manufacturer === company;
    return mq && mg && mc;
  });

  displayedCount = 0;
  renderResults(true);
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').style.display = 'none';
  showInitialState();
}

function renderResults(reset = false) {
  const container = document.getElementById('searchResults');
  const stats = document.getElementById('searchStats');
  const loadMore = document.getElementById('loadMore');

  if (reset) container.innerHTML = '';

  stats.textContent = `نتائج البحث: ${filteredResults.length.toLocaleString()} دواء`;

  if (!filteredResults.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-emoji">🔍</div>
        <h3>لا توجد نتائج</h3>
        <p>جرب كلمة بحث مختلفة</p>
      </div>`;
    loadMore.style.display = 'none';
    return;
  }

  const slice = filteredResults.slice(displayedCount, displayedCount + PAGE_SIZE);
  slice.forEach(med => container.appendChild(createMedCard(med)));
  displayedCount += slice.length;
  loadMore.style.display = displayedCount < filteredResults.length ? 'block' : 'none';
}

function loadMoreResults() { renderResults(false); }

function createMedCard(med) {
  const el = document.createElement('div');
  el.className = 'med-card';
  el.onclick = () => openSheet(med);
  const price = med.price ? `${parseFloat(med.price).toFixed(2)} ج` : '—';
  const ing = med.active_ingredient || '';
  const group = med.medical_group || '';
  el.innerHTML = `
    <div class="card-icon">💊</div>
    <div class="card-body">
      <div class="card-name">${med.trade_name || ''}</div>
      ${ing ? `<div class="card-ing">${ing.length > 55 ? ing.substring(0,55)+'...' : ing}</div>` : ''}
      <div class="card-tags">
        <span class="tag tag-price">${price}</span>
        ${group ? `<span class="tag tag-group">${group.length > 25 ? group.substring(0,25)+'...' : group}</span>` : ''}
      </div>
    </div>
    <span class="card-chevron">‹</span>
  `;
  return el;
}

// =============================================
//   EQUIVALENT
// =============================================
function searchEquivalent() {
  const q = document.getElementById('equivInput').value.trim().toLowerCase();
  const src = document.getElementById('equivSource');
  const res = document.getElementById('equivResults');

  if (!q) { src.innerHTML = ''; res.innerHTML = ''; return; }

  const source = allMedicines.find(m => (m.trade_name || '').toLowerCase().includes(q));
  if (!source || !source.active_ingredient) {
    src.innerHTML = '';
    res.innerHTML = `<div class="empty-state"><div class="es-emoji">💊</div><h3>لا توجد نتائج</h3><p>تأكد من كتابة اسم الدواء بشكل صحيح</p></div>`;
    return;
  }

  const equivalents = allMedicines.filter(m =>
    m.active_ingredient &&
    m.active_ingredient.toLowerCase() === source.active_ingredient.toLowerCase() &&
    m.trade_name !== source.trade_name
  );

  src.innerHTML = `
    <div class="equiv-source-card">
      <div class="es-label">المادة الفعالة</div>
      <div class="es-ing">🧬 ${source.active_ingredient}</div>
      <div class="es-count">${equivalents.length} مثيل موجود في السوق</div>
    </div>`;

  res.innerHTML = '';
  if (!equivalents.length) {
    res.innerHTML = `<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا يوجد مثيل</h3><p>هذا الدواء ليس له مثيل في قاعدة البيانات</p></div>`;
  } else {
    equivalents.forEach(m => res.appendChild(createMedCard(m)));
  }
}

// =============================================
//   SUGGEST
// =============================================
function suggestDrug(inputId, dropId) {
  const q = document.getElementById(inputId).value.trim().toLowerCase();
  const drop = document.getElementById(dropId);
  if (q.length < 2) { drop.innerHTML = ''; return; }

  const matches = allMedicines.filter(m => (m.trade_name || '').toLowerCase().includes(q)).slice(0, 8);
  if (!matches.length) { drop.innerHTML = ''; return; }

  drop.innerHTML = matches.map(m => `
    <div class="sug-item" onclick="selectSug('${inputId}','${dropId}','${(m.trade_name||'').replace(/'/g,"\\'")}')">
      <div class="sug-name">${m.trade_name}</div>
      ${m.active_ingredient ? `<div class="sug-ing">${m.active_ingredient}</div>` : ''}
    </div>
  `).join('');
}

function selectSug(inputId, dropId, name) {
  document.getElementById(inputId).value = name;
  document.getElementById(dropId).innerHTML = '';
}

// =============================================
//   INTERACTIONS
// =============================================
async function checkInteraction() {
  const d1 = document.getElementById('drug1Input').value.trim();
  const d2 = document.getElementById('drug2Input').value.trim();
  const el = document.getElementById('interactionResult');

  if (!d1 || !d2) {
    el.innerHTML = `<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدوائين</p></div>`;
    return;
  }

  const m1 = allMedicines.find(m => (m.trade_name||'').toLowerCase() === d1.toLowerCase());
  const m2 = allMedicines.find(m => (m.trade_name||'').toLowerCase() === d2.toLowerCase());
  const i1 = m1?.active_ingredient || d1;
  const i2 = m2?.active_ingredient || d2;

  el.innerHTML = `<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;

  const prompt = `أنت صيدلاني متخصص. افحص التعارض الدوائي بين:
الدواء الأول: ${d1} (المادة الفعالة: ${i1})
الدواء الثاني: ${d2} (المادة الفعالة: ${i2})
أجب باللغة العربية:
1. مستوى التعارض: (آمن / تحذير / خطر)
2. نوع التعارض إن وجد
3. التأثيرات المحتملة
4. التوصية للصيدلاني
كن مختصراً ودقيقاً.`;

  const res = await callClaude(prompt);
  let cls = 'result-info';
  if (res.includes('خطر') || res.includes('ممنوع')) cls = 'result-danger';
  else if (res.includes('تحذير') || res.includes('احتياط')) cls = 'result-warning';
  else if (res.includes('آمن')) cls = 'result-safe';

  el.innerHTML = `<div class="result-box ${cls}"><h3>${d1} + ${d2}</h3><p>${res.replace(/\n/g,'<br/>')}</p></div>`;
}

async function checkPregnancy() {
  const drug = document.getElementById('pregInput').value.trim();
  const el = document.getElementById('pregnancyResult');

  if (!drug) {
    el.innerHTML = `<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدواء</p></div>`;
    return;
  }

  const med = allMedicines.find(m => (m.trade_name||'').toLowerCase().includes(drug.toLowerCase()));
  const ing = med?.active_ingredient || drug;

  el.innerHTML = `<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;

  const prompt = `أنت صيدلاني متخصص. اشرح أمان دواء ${drug} (المادة الفعالة: ${ing}) في:
1. الحمل (تصنيف FDA إن وجد)
2. الرضاعة الطبيعية
3. توصيات للصيدلاني
أجب باللغة العربية باختصار ودقة.`;

  const res = await callClaude(prompt);
  el.innerHTML = `<div class="result-box result-info"><h3>💊 ${drug}</h3><p>${res.replace(/\n/g,'<br/>')}</p></div>`;
}

// =============================================
//   AI CHAT
// =============================================
async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg || isLoading) return;
  input.value = '';

  addBubble(msg, 'user');
  isLoading = true;
  const loadId = addTyping();

  const relevantMeds = allMedicines
    .filter(m => msg.split(' ').some(w => w.length > 2 && (m.trade_name||'').toLowerCase().includes(w.toLowerCase())))
    .slice(0, 5);

  const dbCtx = relevantMeds.length
    ? `\nأدوية ذات صلة في السوق المصري:\n${relevantMeds.map(m => `- ${m.trade_name} (${m.active_ingredient||'—'}) — ${m.price} ج — ${m.manufacturer}`).join('\n')}`
    : '';

  const system = `أنت مساعد صيدلاني ذكي متخصص في أدوية السوق المصري. تتكلم بالعربية بأسلوب ودود ومهني. لديك قاعدة بيانات ${allMedicines.length} دواء.${dbCtx}`;

  const res = await callClaude(msg, system);
  removeTyping(loadId);
  addBubble(res, 'bot');
  isLoading = false;
}

function addBubble(text, type) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-row ${type}`;
  div.innerHTML = `
    <div class="chat-avatar">${type === 'bot' ? '⚕️' : '👨‍⚕️'}</div>
    <div class="chat-bubble">${text.replace(/\n/g,'<br/>')}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addTyping() {
  const id = 'typing-' + Date.now();
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-row bot';
  div.id = id;
  div.innerHTML = `
    <div class="chat-avatar">⚕️</div>
    <div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// =============================================
//   CLAUDE API
// =============================================
async function callClaude(userMsg, system = null) {
  if (CLAUDE_API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
    return "⚠️ لم يتم إعداد Claude API Key بعد. افتح ملف app.js وضع الـ API Key في المتغير CLAUDE_API_KEY.";
  }
  try {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: userMsg }] };
    if (system) body.system = system;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return data.content?.[0]?.text || "حدث خطأ.";
  } catch {
    return "تعذر الاتصال. تحقق من الإنترنت.";
  }
}

// =============================================
//   BOTTOM SHEET
// =============================================
function openSheet(med) {
  const price = med.price ? `${parseFloat(med.price).toFixed(2)} جنيه` : '—';
  document.getElementById('sheetContent').innerHTML = `
    <div class="sheet-name">${med.trade_name || ''}</div>
    <div class="sheet-ing">🧬 ${med.active_ingredient || 'غير محدد'}</div>
    <div class="sheet-grid">
      <div class="sheet-info-item">
        <div class="sii-label">السعر</div>
        <div class="sii-value price">${price}</div>
      </div>
      <div class="sheet-info-item">
        <div class="sii-label">الكود</div>
        <div class="sii-value">${med.drug_code || '—'}</div>
      </div>
      <div class="sheet-info-item">
        <div class="sii-label">الشركة</div>
        <div class="sii-value" style="font-size:13px">${med.manufacturer || '—'}</div>
      </div>
      <div class="sheet-info-item">
        <div class="sii-label">المجموعة</div>
        <div class="sii-value" style="font-size:12px">${med.medical_group || '—'}</div>
      </div>
    </div>
    <button class="sheet-equiv-btn" onclick="findEquiv('${(med.trade_name||'').replace(/'/g,"\\'")}')">💊 ابحث عن المثيل</button>
  `;
  document.getElementById('sheetBg').classList.add('show');
  document.getElementById('bottomSheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('sheetBg').classList.remove('show');
  document.getElementById('bottomSheet').classList.remove('open');
}

function findEquiv(name) {
  closeSheet();
  document.getElementById('equivInput').value = name;
  showPage('equivalent', document.querySelector('[data-page="equivalent"]'));
  setTimeout(searchEquivalent, 100);
}

// =============================================
//   NAVIGATION
// =============================================
function showPage(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.bn-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n => n.classList.add('active'));

  const title = pageTitles[page] || '';
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = title;

  if (window.innerWidth <= 768) closeSidebar();
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('overlay');
  s.classList.toggle('open');
  o.classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// Close suggestions when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.drug-inp-wrap') && !e.target.closest('.search-input-group')) {
    document.querySelectorAll('.suggest-drop').forEach(d => d.innerHTML = '');
  }
});

// =============================================
//   INIT
// =============================================
loadAllMedicines();
