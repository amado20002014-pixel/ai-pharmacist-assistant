// =============================================
//   إعدادات Supabase
// =============================================
const SUPABASE_URL = "https://atgyefigxigkfpfgbycu.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXldtz1K4KsuRje0khdQDQ_B0DBzxi3";

// =============================================
//   إعدادات Claude AI
//   ضع API Key بتاعك هنا
// =============================================
const CLAUDE_API_KEY = "YOUR_CLAUDE_API_KEY_HERE";

// =============================================
//   متغيرات عامة
// =============================================
let allMedicines = [];
let filteredResults = [];
let displayedCount = 0;
const PAGE_SIZE = 30;
let isLoading = false;

// =============================================
//   تحميل البيانات عند فتح الصفحة
// =============================================
async function loadAllMedicines() {
  try {
    let allData = [];
    let from = 0;
    const batchSize = 1000;

    while (true) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/medicines?select=*&order=trade_name.asc&limit=${batchSize}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await res.json();
      if (!data || data.length === 0) break;
      allData = allData.concat(data);
      if (data.length < batchSize) break;
      from += batchSize;
    }

    allMedicines = allData;
    console.log(`✅ تم تحميل ${allMedicines.length} دواء`);
    populateFilters();
    showInitialState();
  } catch (err) {
    console.error("خطأ في تحميل البيانات:", err);
  }
}

// =============================================
//   ملء الفلاتر
// =============================================
function populateFilters() {
  const groups = [...new Set(allMedicines.map(m => m.medical_group).filter(Boolean))].sort();
  const companies = [...new Set(allMedicines.map(m => m.manufacturer).filter(Boolean))].sort();

  const gf = document.getElementById('groupFilter');
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    gf.appendChild(opt);
  });

  const cf = document.getElementById('companyFilter');
  companies.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    cf.appendChild(opt);
  });
}

function showInitialState() {
  const el = document.getElementById('searchResults');
  const stats = document.getElementById('searchStats');
  stats.textContent = `إجمالي قاعدة البيانات: ${allMedicines.length.toLocaleString()} دواء`;
  el.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">💊</div>
      <h3>ابحث عن أي دواء</h3>
      <p>اكتب في مربع البحث للعثور على الدواء المطلوب</p>
    </div>`;
  document.getElementById('loadMore').style.display = 'none';
}

// =============================================
//   البحث في الأدوية
// =============================================
function searchMedicines() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const group = document.getElementById('groupFilter').value;
  const company = document.getElementById('companyFilter').value;

  if (!query && !group && !company) {
    showInitialState();
    return;
  }

  filteredResults = allMedicines.filter(m => {
    const matchQuery = !query || (
      (m.trade_name || '').toLowerCase().includes(query) ||
      (m.active_ingredient || '').toLowerCase().includes(query) ||
      (m.drug_code || '').toLowerCase().includes(query)
    );
    const matchGroup = !group || m.medical_group === group;
    const matchCompany = !company || m.manufacturer === company;
    return matchQuery && matchGroup && matchCompany;
  });

  displayedCount = 0;
  renderResults(true);
}

function renderResults(reset = false) {
  const container = document.getElementById('searchResults');
  const stats = document.getElementById('searchStats');
  const loadMore = document.getElementById('loadMore');

  if (reset) container.innerHTML = '';

  stats.textContent = `نتائج البحث: ${filteredResults.length.toLocaleString()} دواء`;

  if (filteredResults.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
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

function loadMoreResults() {
  renderResults(false);
}

function createMedCard(med) {
  const card = document.createElement('div');
  card.className = 'med-card';
  card.onclick = () => openModal(med);

  const price = med.price ? `${parseFloat(med.price).toFixed(2)} ج` : 'غير محدد';
  const ingredient = med.active_ingredient || 'غير محدد';
  const group = med.medical_group || '';
  const company = med.manufacturer || '';

  card.innerHTML = `
    <div class="med-name">${med.trade_name || ''}</div>
    <div class="med-ingredient">${ingredient.length > 60 ? ingredient.substring(0,60)+'...' : ingredient}</div>
    <div class="med-meta">
      <span class="med-price">${price}</span>
      ${group ? `<span class="med-group">${group}</span>` : ''}
    </div>
    ${company ? `<div class="med-company">🏭 ${company}</div>` : ''}
  `;
  return card;
}

// =============================================
//   البحث عن المثيل
// =============================================
function searchEquivalent() {
  const query = document.getElementById('equivInput').value.trim().toLowerCase();
  const sourceEl = document.getElementById('equivSource');
  const resultsEl = document.getElementById('equivResults');

  if (!query) {
    sourceEl.style.display = 'none';
    resultsEl.innerHTML = '';
    return;
  }

  // ابحث عن الدواء الأصلي
  const source = allMedicines.find(m =>
    (m.trade_name || '').toLowerCase().includes(query)
  );

  if (!source || !source.active_ingredient) {
    sourceEl.style.display = 'none';
    resultsEl.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">💊</div>
        <h3>لا توجد نتائج</h3>
        <p>تأكد من كتابة اسم الدواء بشكل صحيح</p>
      </div>`;
    return;
  }

  // البحث عن المثائل بنفس المادة الفعالة
  const equivalents = allMedicines.filter(m =>
    m.active_ingredient &&
    m.active_ingredient.toLowerCase() === source.active_ingredient.toLowerCase() &&
    m.trade_name !== source.trade_name
  );

  sourceEl.style.display = 'block';
  sourceEl.innerHTML = `
    <h3>المادة الفعالة للدواء المختار</h3>
    <div class="equiv-ingredient">🧬 ${source.active_ingredient}</div>
    <div class="equiv-count">وُجد ${equivalents.length} مثيل في السوق المصري</div>
  `;

  resultsEl.innerHTML = '';
  if (equivalents.length === 0) {
    resultsEl.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <h3>لا يوجد مثيل مسجل</h3>
        <p>هذا الدواء ليس له مثيل في قاعدة البيانات</p>
      </div>`;
  } else {
    equivalents.forEach(med => resultsEl.appendChild(createMedCard(med)));
  }
}

// =============================================
//   التعارضات — Autocomplete
// =============================================
function suggestDrug(inputId, suggestId) {
  const query = document.getElementById(inputId).value.trim().toLowerCase();
  const box = document.getElementById(suggestId);

  if (query.length < 2) { box.innerHTML = ''; return; }

  const matches = allMedicines
    .filter(m => (m.trade_name || '').toLowerCase().includes(query))
    .slice(0, 8);

  if (matches.length === 0) { box.innerHTML = ''; return; }

  box.innerHTML = matches.map(m => `
    <div class="suggest-item" onclick="selectDrug('${inputId}','${suggestId}','${(m.trade_name||'').replace(/'/g,"\\'")}')">
      <div class="si-name">${m.trade_name}</div>
      <div class="si-ing">${m.active_ingredient || ''}</div>
    </div>
  `).join('');
}

function selectDrug(inputId, suggestId, name) {
  document.getElementById(inputId).value = name;
  document.getElementById(suggestId).innerHTML = '';
}

// =============================================
//   فحص التعارض الدوائي عبر Claude AI
// =============================================
async function checkInteraction() {
  const drug1 = document.getElementById('drug1Input').value.trim();
  const drug2 = document.getElementById('drug2Input').value.trim();
  const resultEl = document.getElementById('interactionResult');

  if (!drug1 || !drug2) {
    resultEl.innerHTML = `<div class="result-card result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدوائين</p></div>`;
    return;
  }

  // إيجاد المادة الفعالة لكل دواء
  const med1 = allMedicines.find(m => (m.trade_name||'').toLowerCase() === drug1.toLowerCase());
  const med2 = allMedicines.find(m => (m.trade_name||'').toLowerCase() === drug2.toLowerCase());

  const ing1 = med1?.active_ingredient || drug1;
  const ing2 = med2?.active_ingredient || drug2;

  resultEl.innerHTML = `
    <div class="result-card result-info">
      <div style="display:flex;gap:8px;align-items:center">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        <span>جاري التحليل...</span>
      </div>
    </div>`;

  const prompt = `أنت صيدلاني متخصص. افحص التعارض الدوائي بين:
الدواء الأول: ${drug1} (المادة الفعالة: ${ing1})
الدواء الثاني: ${drug2} (المادة الفعالة: ${ing2})

أجب باللغة العربية بالتنسيق التالي:
1. مستوى التعارض: (آمن / تحذير / خطر)
2. نوع التعارض (إن وجد)
3. التأثيرات المحتملة
4. التوصية للصيدلاني
كن دقيقاً ومختصراً.`;

  const response = await callClaude(prompt);
  displayInteractionResult(resultEl, response, drug1, drug2);
}

async function checkPregnancy() {
  const drug = document.getElementById('pregInput').value.trim();
  const resultEl = document.getElementById('pregnancyResult');

  if (!drug) {
    resultEl.innerHTML = `<div class="result-card result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدواء</p></div>`;
    return;
  }

  const med = allMedicines.find(m => (m.trade_name||'').toLowerCase().includes(drug.toLowerCase()));
  const ing = med?.active_ingredient || drug;

  resultEl.innerHTML = `
    <div class="result-card result-info">
      <div style="display:flex;gap:8px;align-items:center">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        <span>جاري التحليل...</span>
      </div>
    </div>`;

  const prompt = `أنت صيدلاني متخصص. اشرح أمان استخدام دواء ${drug} (المادة الفعالة: ${ing}) في:
1. الحمل (اذكر تصنيف FDA إن وجد)
2. الرضاعة الطبيعية
3. توصيات للصيدلاني

أجب باللغة العربية باختصار ودقة.`;

  const response = await callClaude(prompt);
  resultEl.innerHTML = `<div class="result-card result-info"><h3>💊 ${drug}</h3><p>${response.replace(/\n/g,'<br/>')}</p></div>`;
}

function displayInteractionResult(el, text, drug1, drug2) {
  let cls = 'result-info';
  if (text.includes('خطر') || text.includes('خطير') || text.includes('ممنوع')) cls = 'result-danger';
  else if (text.includes('تحذير') || text.includes('حذر') || text.includes('احتياط')) cls = 'result-warning';
  else if (text.includes('آمن') || text.includes('مأمون')) cls = 'result-safe';

  el.innerHTML = `
    <div class="result-card ${cls}">
      <h3>نتيجة فحص التعارض: ${drug1} + ${drug2}</h3>
      <p>${text.replace(/\n/g,'<br/>')}</p>
    </div>`;
}

// =============================================
//   المساعد الذكي (Chat)
// =============================================
async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg || isLoading) return;

  input.value = '';
  addChatMsg(msg, 'user');

  isLoading = true;
  const loadingId = addLoadingMsg();

  // ابحث في الداتابيز إذا السؤال عن دواء معين
  const relevantMeds = allMedicines
    .filter(m => msg.split(' ').some(word =>
      word.length > 2 && (m.trade_name||'').toLowerCase().includes(word.toLowerCase())
    ))
    .slice(0, 5);

  const dbContext = relevantMeds.length > 0
    ? `\nأدوية موجودة في قاعدة بيانات السوق المصري ذات صلة:\n${relevantMeds.map(m =>
        `- ${m.trade_name} (${m.active_ingredient || 'غير محدد'}) - سعر: ${m.price} ج - شركة: ${m.manufacturer}`
      ).join('\n')}`
    : '';

  const systemPrompt = `أنت مساعد صيدلاني ذكي متخصص في أدوية السوق المصري. تتحدث باللغة العربية العامية المصرية بشكل ودود ومهني. لديك قاعدة بيانات لـ ${allMedicines.length} دواء في السوق المصري.${dbContext}

ساعد الصيدلاني في: البحث عن الأدوية، المثائل، التعارضات الدوائية، الجرعات، آليات العمل، والمعلومات الطبية. كن مختصراً ومفيداً.`;

  const response = await callClaude(msg, systemPrompt);
  removeLoadingMsg(loadingId);
  addChatMsg(response, 'bot');
  isLoading = false;
}

function addChatMsg(text, type) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `
    <div class="msg-avatar">${type === 'bot' ? '⚕' : '👨‍⚕️'}</div>
    <div class="msg-bubble">${text.replace(/\n/g,'<br/>')}</div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div.id;
}

function addLoadingMsg() {
  const messages = document.getElementById('chatMessages');
  const id = 'loading-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg bot msg-loading';
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar">⚕</div>
    <div class="msg-bubble">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeLoadingMsg(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// =============================================
//   استدعاء Claude API
// =============================================
async function callClaude(userMessage, systemPrompt = null) {
  if (CLAUDE_API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
    return "⚠️ لم يتم إعداد Claude API Key بعد. افتح ملف app.js وضع الـ API Key في المكان المخصص.";
  }

  try {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: userMessage }]
    };

    if (systemPrompt) body.system = systemPrompt;

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
    if (data.content && data.content[0]) return data.content[0].text;
    return "حدث خطأ في الاتصال بالذكاء الاصطناعي.";
  } catch (err) {
    return "تعذر الاتصال. تحقق من الاتصال بالإنترنت.";
  }
}

// =============================================
//   Modal
// =============================================
function openModal(med) {
  const price = med.price ? `${parseFloat(med.price).toFixed(2)} جنيه` : 'غير محدد';
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-med-name">${med.trade_name}</div>
    <div class="modal-med-ingredient">🧬 ${med.active_ingredient || 'غير محدد'}</div>
    <div class="modal-details">
      <div class="detail-item">
        <div class="detail-label">السعر</div>
        <div class="detail-value price">${price}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">كود الدواء</div>
        <div class="detail-value">${med.drug_code || '-'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">الشركة المصنعة</div>
        <div class="detail-value">${med.manufacturer || '-'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">المجموعة الطبية</div>
        <div class="detail-value">${med.medical_group || '-'}</div>
      </div>
    </div>
    <button class="modal-equiv-btn" onclick="findEquivFromModal('${(med.trade_name||'').replace(/'/g,"\\'")}')">
      💊 ابحث عن المثيل
    </button>
  `;
  document.getElementById('medModal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'medModal') document.getElementById('medModal').classList.remove('open');
}

function findEquivFromModal(name) {
  document.getElementById('medModal').classList.remove('open');
  document.getElementById('equivInput').value = name;
  showPage('equivalent');
  searchEquivalent();
}

// =============================================
//   Navigation
// =============================================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  const pageIndex = ['search','equivalent','interactions','ai'];
  const idx = pageIndex.indexOf(page);
  if (btns[idx]) btns[idx].classList.add('active');
}

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function switchITab(tab) {
  document.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.itab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('itab-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// =============================================
//   تشغيل التطبيق
// =============================================
loadAllMedicines();
