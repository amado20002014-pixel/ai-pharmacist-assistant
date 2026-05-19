// =============================================
//   CONFIG
// =============================================
const SUPABASE_URL = "https://atgyefigxigkfpfgbycu.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXldtz1K4KsuRje0khdQDQ_B0DBzxi3";
const CLAUDE_API_KEY = "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
// =============================================
//   قاموس البحث العربي
// =============================================
const ARABIC_DICT = {
  // مضادات حيوية
  'اموكسيسيلين':'AMOXICILLIN','أموكسيسيلين':'AMOXICILLIN','أموكسيل':'AMOXICILLIN',
  'اوجمنتين':'AMOXICILLIN','أوجمنتين':'AMOXICILLIN','كلافيوكس':'AMOXICILLIN',
  'ازيثرومايسين':'AZITHROMYCIN','أزيثرومايسين':'AZITHROMYCIN','زيثروماكس':'AZITHROMYCIN',
  'سيفترياكسون':'CEFTRIAXONE','روسيفين':'CEFTRIAXONE',
  'سيفادروكسيل':'CEFADROXIL','سيفوتاكسيم':'CEFOTAXIME',
  'سيبروفلوكساسين':'CIPROFLOXACIN','سيبروسين':'CIPROFLOXACIN',
  'ميترونيدازول':'METRONIDAZOLE','فلاجيل':'METRONIDAZOLE',
  'كليندامايسين':'CLINDAMYCIN','دوكسيسيكلين':'DOXYCYCLINE',
  'تتراسيكلين':'TETRACYCLINE','اريثرومايسين':'ERYTHROMYCIN',
  'ليفوفلوكساسين':'LEVOFLOXACIN','امبيسيلين':'AMPICILLIN',

  // مسكنات ومضادات التهاب
  'باراسيتامول':'PARACETAMOL','بانادول':'PARACETAMOL','ادول':'PARACETAMOL',
  'أدول':'PARACETAMOL','تايلينول':'PARACETAMOL',
  'ايبوبروفين':'IBUPROFEN','أيبوبروفين':'IBUPROFEN','بروفين':'IBUPROFEN','نوروفين':'IBUPROFEN',
  'ديكلوفيناك':'DICLOFENAC','كتافلام':'DICLOFENAC','فولتارين':'DICLOFENAC',
  'كيتوبروفين':'KETOPROFEN','نابروكسين':'NAPROXEN',
  'ايتوريكوكسيب':'ETORICOXIB','إيتوريكوكسيب':'ETORICOXIB',
  'ميلوكسيكام':'MELOXICAM','سيليكوكسيب':'CELECOXIB',
  'ترامادول':'TRAMADOL','مورفين':'MORPHINE','كوديين':'CODEINE',

  // معدة وهضم
  'اوميبرازول':'OMEPRAZOLE','أوميبرازول':'OMEPRAZOLE','لوسيك':'OMEPRAZOLE',
  'ايزوميبرازول':'ESOMEPRAZOLE','نيكسيوم':'ESOMEPRAZOLE',
  'لانسوبرازول':'LANSOPRAZOLE','بانتوبرازول':'PANTOPRAZOLE',
  'رانيتيدين':'RANITIDINE','زانتاك':'RANITIDINE',
  'ميتوكلوبراميد':'METOCLOPRAMIDE','بريمبيران':'METOCLOPRAMIDE',
  'اوندانسيترون':'ONDANSETRON','زوفران':'ONDANSETRON',

  // قلب وضغط
  'أملوديبين':'AMLODIPINE','املوديبين':'AMLODIPINE','نورفاسك':'AMLODIPINE',
  'أتينولول':'ATENOLOL','ليزينوبريل':'LISINOPRIL',
  'اينالابريل':'ENALAPRIL','إنالابريل':'ENALAPRIL','ريناتك':'ENALAPRIL',
  'فالسارتان':'VALSARTAN','ديوفان':'VALSARTAN',
  'لوزارتان':'LOSARTAN','كوزار':'LOSARTAN',
  'ميتوبرولول':'METOPROLOL','كارفيديلول':'CARVEDILOL',
  'فوروسيميد':'FUROSEMIDE','لازيكس':'FUROSEMIDE',
  'هيدروكلوروثيازيد':'HYDROCHLOROTHIAZIDE','سبيرونولاكتون':'SPIRONOLACTONE',
  'ديجوكسين':'DIGOXIN','أميودارون':'AMIODARONE',

  // سكر
  'ميتفورمين':'METFORMIN','جلوكوفاج':'METFORMIN',
  'جليمبيريد':'GLIMEPIRIDE','أمارايل':'GLIMEPIRIDE',
  'جليبنكلاميد':'GLIBENCLAMIDE','انسولين':'INSULIN','إنسولين':'INSULIN',
  'سيتاجليبتين':'SITAGLIPTIN','جانوفيا':'SITAGLIPTIN',

  // كوليسترول
  'أتورفاستاتين':'ATORVASTATIN','ليبيتور':'ATORVASTATIN',
  'روزوفاستاتين':'ROSUVASTATIN','كريستور':'ROSUVASTATIN',
  'سيمفاستاتين':'SIMVASTATIN','زوكور':'SIMVASTATIN',

  // جهاز تنفسي
  'سالبوتامول':'SALBUTAMOL','فينتولين':'SALBUTAMOL',
  'مونتيلوكاست':'MONTELUKAST','سينجولار':'MONTELUKAST',
  'سيتيريزين':'CETIRIZINE','زيرتك':'CETIRIZINE',
  'لوراتادين':'LORATADINE','كلاريتين':'LORATADINE',
  'فيكسوفينادين':'FEXOFENADINE','تيلفاست':'FEXOFENADINE',
  'ديكساميثازون':'DEXAMETHASONE','بريدنيزون':'PREDNISONE','بريدنيزولون':'PREDNISOLONE',

  // أعصاب ونفسية
  'بريجابالين':'PREGABALIN','ليريكا':'PREGABALIN',
  'جابابنتين':'GABAPENTIN','نيورونتين':'GABAPENTIN',
  'اريبيبرازول':'ARIPIPRAZOLE','ابيليفاي':'ARIPIPRAZOLE',
  'كيوتيابين':'QUETIAPINE','سيروكيل':'QUETIAPINE',
  'اسيتالوبرام':'ESCITALOPRAM','ليكسابرو':'ESCITALOPRAM',
  'سيرترالين':'SERTRALINE','زولوفت':'SERTRALINE',
  'فلوكسيتين':'FLUOXETINE','بروزاك':'FLUOXETINE',
  'ديازيبام':'DIAZEPAM','فاليوم':'DIAZEPAM',
  'الوبرازولام':'ALPRAZOLAM','زاناكس':'ALPRAZOLAM',
  'ليفيتيراسيتام':'LEVETIRACETAM','كيبرا':'LEVETIRACETAM',
  'كاربامازيبين':'CARBAMAZEPINE','تيجريتول':'CARBAMAZEPINE',

  // فيتامينات ومكملات
  'فيتامين د':'CHOLECALCIFEROL','فيتامين د3':'CHOLECALCIFEROL',
  'كولكالسيفيرول':'CHOLECALCIFEROL','فيتامين c':'ASCORBIC ACID',
  'فيتامين سي':'ASCORBIC ACID','حمض الاسكوربيك':'ASCORBIC ACID',
  'كالسيوم':'CALCIUM','حديد':'IRON','فوليك اسيد':'FOLIC ACID',
  'حمض الفوليك':'FOLIC ACID','زنك':'ZINC','اوميجا 3':'OMEGA',

  // مجموعات طبية عامة
  'مضاد حيوي':'ANTIBIOTIC','مضادات حيوية':'ANTIBIOTIC',
  'مسكن':'PARACETAMOL','مسكنات':'PARACETAMOL',
  'ضغط':'AMLODIPINE','ضغط الدم':'AMLODIPINE',
  'سكر':'METFORMIN','سكري':'METFORMIN',
  'كوليسترول':'ROSUVASTATIN','دهون':'ROSUVASTATIN',
  'معدة':'OMEPRAZOLE','حرقة':'OMEPRAZOLE',
  'حساسية':'CETIRIZINE','الرجية':'CETIRIZINE',
  'نوم':'DIAZEPAM','منوم':'DIAZEPAM',
  'اكتئاب':'ESCITALOPRAM','قلق':'ALPRAZOLAM',
  'تادالافيل':'TADALAFIL','سيالاس':'TADALAFIL',
  'سيلدينافيل':'SILDENAFIL','فياجرا':'SILDENAFIL',
  'ميكونازول':'MICONAZOLE','فلوكونازول':'FLUCONAZOLE',
  'ديفلوكان':'FLUCONAZOLE','ليدوكايين':'LIDOCAINE',
};

// =============================================
//   ترجمة الاستعلام العربي للإنجليزي
// =============================================
function translateArabicQuery(query) {
  const q = query.trim();
  if (!q) return null;

  // بحث مباشر في القاموس
  if (ARABIC_DICT[q]) return ARABIC_DICT[q];

  // بحث جزئي — لو الكلمة موجودة في أي مفتاح
  for (const [arabic, english] of Object.entries(ARABIC_DICT)) {
    if (arabic.includes(q) || q.includes(arabic)) {
      return english;
    }
  }
  return null;
}

// =============================================
//   هل الاستعلام عربي؟
// =============================================
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

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
      <p>اكتب بالعربي أو الإنجليزي</p>
    </div>`;
  document.getElementById('loadMore').style.display = 'none';
}

function searchMedicines() {
  const raw = document.getElementById('searchInput').value.trim();
  const group = document.getElementById('groupFilter').value;
  const company = document.getElementById('companyFilter').value;
  const clearBtn = document.getElementById('searchClear');
  clearBtn.style.display = raw ? 'flex' : 'none';

  if (!raw && !group && !company) { showInitialState(); return; }

  // ترجمة لو عربي
  let q = raw.toLowerCase();
  let translatedTerm = null;
  if (isArabic(raw)) {
    translatedTerm = translateArabicQuery(raw);
  }

  filteredResults = allMedicines.filter(m => {
    const name = (m.trade_name || '').toLowerCase();
    const ing  = (m.active_ingredient || '').toLowerCase();
    const code = (m.drug_code || '').toLowerCase();

    let matchQuery = false;
    if (!raw) {
      matchQuery = true;
    } else if (translatedTerm) {
      // بحث بالمصطلح المترجم
      matchQuery = ing.includes(translatedTerm.toLowerCase()) || name.includes(translatedTerm.toLowerCase());
    } else {
      // بحث عادي بالإنجليزي
      matchQuery = name.includes(q) || ing.includes(q) || code.includes(q);
    }

    const matchGroup   = !group   || m.medical_group === group;
    const matchCompany = !company || m.manufacturer  === company;
    return matchQuery && matchGroup && matchCompany;
  });

  // لو ما لقاش نتايج بالترجمة، جرب بحث جزئي
  if (filteredResults.length === 0 && translatedTerm) {
    const partial = translatedTerm.toLowerCase().split(' ')[0];
    filteredResults = allMedicines.filter(m => {
      const ing = (m.active_ingredient || '').toLowerCase();
      return ing.includes(partial);
    });
  }

  displayedCount = 0;
  renderResults(true, translatedTerm, raw);
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').style.display = 'none';
  showInitialState();
}

function renderResults(reset = false, translatedTerm = null, originalQuery = '') {
  const container = document.getElementById('searchResults');
  const stats     = document.getElementById('searchStats');
  const loadMore  = document.getElementById('loadMore');

  if (reset) container.innerHTML = '';

  let statsText = `نتائج البحث: ${filteredResults.length.toLocaleString()} دواء`;
  if (translatedTerm && isArabic(originalQuery)) {
    statsText += ` &nbsp;|&nbsp; 🔄 تم البحث عن: <b>${translatedTerm}</b>`;
  }
  stats.innerHTML = statsText;

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
  const ing   = med.active_ingredient || '';
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
    <span class="card-chevron">‹</span>`;
  return el;
}

// =============================================
//   EQUIVALENT
// =============================================
function searchEquivalent() {
  const raw = document.getElementById('equivInput').value.trim();
  const src = document.getElementById('equivSource');
  const res = document.getElementById('equivResults');

  if (!raw) { src.innerHTML = ''; res.innerHTML = ''; return; }

  let searchTerm = raw.toLowerCase();
  if (isArabic(raw)) {
    const translated = translateArabicQuery(raw);
    if (translated) searchTerm = translated.toLowerCase();
  }

  const source = allMedicines.find(m =>
    (m.trade_name || '').toLowerCase().includes(searchTerm) ||
    (m.active_ingredient || '').toLowerCase().includes(searchTerm)
  );

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
  const raw  = document.getElementById(inputId).value.trim();
  const drop = document.getElementById(dropId);
  if (raw.length < 2) { drop.innerHTML = ''; return; }

  let searchTerm = raw.toLowerCase();
  if (isArabic(raw)) {
    const translated = translateArabicQuery(raw);
    if (translated) searchTerm = translated.toLowerCase();
  }

  const matches = allMedicines
    .filter(m =>
      (m.trade_name || '').toLowerCase().includes(searchTerm) ||
      (m.active_ingredient || '').toLowerCase().includes(searchTerm)
    )
    .slice(0, 8);

  if (!matches.length) { drop.innerHTML = ''; return; }

  drop.innerHTML = matches.map(m => `
    <div class="sug-item" onclick="selectSug('${inputId}','${dropId}','${(m.trade_name||'').replace(/'/g,"\\'")}')">
      <div class="sug-name">${m.trade_name}</div>
      ${m.active_ingredient ? `<div class="sug-ing">${m.active_ingredient}</div>` : ''}
    </div>`).join('');
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
  const el  = document.getElementById('interactionResult');

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
  const el   = document.getElementById('pregnancyResult');

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
  const msg   = input.value.trim();
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
  const div  = document.createElement('div');
  div.className = `chat-row ${type}`;
  div.innerHTML = `
    <div class="chat-avatar">${type === 'bot' ? '⚕️' : '👨‍⚕️'}</div>
    <div class="chat-bubble">${text.replace(/\n/g,'<br/>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addTyping() {
  const id   = 'typing-' + Date.now();
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-row bot';
  div.id = id;
  div.innerHTML = `
    <div class="chat-avatar">⚕️</div>
    <div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
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
    const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: userMsg }], system: system || "" })
});
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
    <button class="sheet-equiv-btn" onclick="findEquiv('${(med.trade_name||'').replace(/'/g,"\\'")}')">💊 ابحث عن المثيل</button>`;
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
  document.querySelectorAll('.nav-item, .bn-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n => n.classList.add('active'));
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = pageTitles[page] || '';
  if (window.innerWidth <= 768) closeSidebar();
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  btn.classList.add('active');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.drug-inp-wrap') && !e.target.closest('.search-input-group')) {
    document.querySelectorAll('.suggest-drop').forEach(d => d.innerHTML = '');
  }
});

// =============================================
//   INIT
// =============================================
loadAllMedicines();
