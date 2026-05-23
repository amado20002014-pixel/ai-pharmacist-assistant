// =============================================
//   CONFIG
// =============================================
const SUPABASE_URL = "https://atgyefigxigkfpfgbycu.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXldtz1K4KsuRje0khdQDQ_B0DBzxi3";

// =============================================
//   AUTH HELPERS
// =============================================
async function supabaseRequest(path, method = 'GET', body = null, authToken = null) {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json',
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  else headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(SUPABASE_URL + path, opts);
  return res;
}

async function supabaseAuth(action, payload) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${action}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// =============================================
//   AUTH STATE
// =============================================
let currentUser = null;
let currentSession = null;

function saveSession(session, user) {
  currentSession = session;
  currentUser = user;
  localStorage.setItem('ph_session', JSON.stringify({ session, user }));
}

function loadSession() {
  try {
    const raw = localStorage.getItem('ph_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function clearSession() {
  currentSession = null;
  currentUser = null;
  localStorage.removeItem('ph_session');
}

// =============================================
//   AUTH INIT
// =============================================
async function initAuth() {
  const saved = loadSession();
  if (!saved) { showAuthScreen(); return; }

  // تحقق إن الـ session لسه صالح
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${saved.session.access_token}`
      }
    });
    if (res.ok) {
      const user = await res.json();
      currentUser = user;
      currentSession = saved.session;
      showAppScreen(user);
    } else {
      // Token منتهي — جرب refresh
      const refreshed = await refreshToken(saved.session.refresh_token);
      if (refreshed) showAppScreen(currentUser);
      else { clearSession(); showAuthScreen(); }
    }
  } catch {
    clearSession();
    showAuthScreen();
  }
}

async function refreshToken(refreshToken) {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    const data = await res.json();
    if (data.access_token) {
      saveSession(data, data.user);
      return true;
    }
    return false;
  } catch { return false; }
}

// =============================================
//   SHOW / HIDE SCREENS
// =============================================
function showAuthScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display  = 'none';
  showAuthPage('loginPage');
}

function showAppScreen(user) {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('appScreen').style.display  = 'block';
  updateUserUI(user);
  loadAllMedicines();
}

function showAuthPage(pageId) {
  document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  // clear errors
  document.querySelectorAll('.auth-error, .auth-success').forEach(el => el.style.display = 'none');
}

function updateUserUI(user) {
  const meta  = user.user_metadata || {};
  const name  = meta.full_name || meta.name || user.email?.split('@')[0] || 'صيدلاني';
  const phone = meta.phone || user.phone || '—';
  const avatar = name.charAt(0).toUpperCase();

  const el = (id) => document.getElementById(id);
  if (el('userName'))  el('userName').textContent  = name;
  if (el('userPhone')) el('userPhone').textContent  = phone;
  if (el('userAvatar')) el('userAvatar').textContent = avatar;
}

// =============================================
//   LOGIN
// =============================================
async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');

  if (!email || !password) {
    showAuthError('loginError', 'من فضلك أدخل الإيميل وكلمة المرور');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'جاري تسجيل الدخول...';

  const data = await supabaseAuth('token?grant_type=password', { email, password });

  if (data.access_token) {
    saveSession(data, data.user);
    showAppScreen(data.user);
  } else {
    const msg = data.error_description || data.msg || 'بيانات غلط، حاول تاني';
    showAuthError('loginError', translateAuthError(msg));
    btn.disabled = false;
    btn.textContent = 'تسجيل الدخول';
  }
}

// =============================================
//   SIGNUP
// =============================================
async function doSignup() {
  const name     = document.getElementById('signupName').value.trim();
  const phone    = document.getElementById('signupPhone').value.trim();
  const email    = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;
  const btn      = document.getElementById('signupBtn');

  if (!name || !phone || !email || !password || !confirm) {
    showAuthError('signupError', 'من فضلك أكمل كل البيانات'); return;
  }
  if (!/^01[0125]\d{8}$/.test(phone)) {
    showAuthError('signupError', 'رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015'); return;
  }
  if (password.length < 8) {
    showAuthError('signupError', 'كلمة المرور لازم تكون ٨ أحرف على الأقل'); return;
  }
  if (password !== confirm) {
    showAuthError('signupError', 'كلمة المرور مش متطابقة'); return;
  }

  btn.disabled = true;
  btn.textContent = 'جاري إنشاء الحساب...';

  const data = await supabaseAuth('signup', {
    email,
    password,
    data: { full_name: name, phone: '+20' + phone.replace(/^0/, '') }
  });

  if (data.id || data.user?.id) {
    showAuthPage('verifyPage');
    document.getElementById('verifyMsg').textContent =
      `بعتنالك رابط تأكيد على ${email} — افتحه عشان تكمّل التسجيل`;
  } else {
    const msg = data.error_description || data.msg || data.message || 'حصل خطأ، حاول تاني';
    showAuthError('signupError', translateAuthError(msg));
    btn.disabled = false;
    btn.textContent = 'إنشاء الحساب';
  }
}

// =============================================
//   LOGOUT
// =============================================
async function doLogout() {
  if (currentSession) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${currentSession.access_token}` }
    }).catch(() => {});
  }
  clearSession();
  allMedicines = [];
  showAuthScreen();
}

// =============================================
//   UI HELPERS
// =============================================
function showAuthError(elId, msg) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.style.display = 'block';
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

function translateAuthError(msg) {
  if (!msg) return 'حصل خطأ، حاول تاني';
  msg = msg.toLowerCase();
  if (msg.includes('invalid login') || msg.includes('invalid credentials')) return 'الإيميل أو كلمة المرور غلط';
  if (msg.includes('email not confirmed')) return 'لازم تأكد إيميلك الأول';
  if (msg.includes('already registered') || msg.includes('already exists')) return 'الإيميل ده مسجّل قبل كده';
  if (msg.includes('weak password')) return 'كلمة المرور ضعيفة جداً';
  if (msg.includes('rate limit')) return 'حاولت كتير، استنى شوية وحاول تاني';
  return msg;
}

// =============================================
//   قاموس البحث العربي
// =============================================
const ARABIC_DICT = {
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
  'باراسيتامول':'PARACETAMOL','بانادول':'PARACETAMOL','ادول':'PARACETAMOL',
  'أدول':'PARACETAMOL','تايلينول':'PARACETAMOL',
  'ايبوبروفين':'IBUPROFEN','أيبوبروفين':'IBUPROFEN','بروفين':'IBUPROFEN','نوروفين':'IBUPROFEN',
  'ديكلوفيناك':'DICLOFENAC','كتافلام':'DICLOFENAC','فولتارين':'DICLOFENAC',
  'كيتوبروفين':'KETOPROFEN','نابروكسين':'NAPROXEN',
  'ايتوريكوكسيب':'ETORICOXIB','إيتوريكوكسيب':'ETORICOXIB',
  'ميلوكسيكام':'MELOXICAM','سيليكوكسيب':'CELECOXIB',
  'ترامادول':'TRAMADOL','مورفين':'MORPHINE','كوديين':'CODEINE',
  'اوميبرازول':'OMEPRAZOLE','أوميبرازول':'OMEPRAZOLE','لوسيك':'OMEPRAZOLE',
  'ايزوميبرازول':'ESOMEPRAZOLE','نيكسيوم':'ESOMEPRAZOLE',
  'لانسوبرازول':'LANSOPRAZOLE','بانتوبرازول':'PANTOPRAZOLE',
  'رانيتيدين':'RANITIDINE','زانتاك':'RANITIDINE',
  'ميتوكلوبراميد':'METOCLOPRAMIDE','بريمبيران':'METOCLOPRAMIDE',
  'اوندانسيترون':'ONDANSETRON','زوفران':'ONDANSETRON',
  'أملوديبين':'AMLODIPINE','املوديبين':'AMLODIPINE','نورفاسك':'AMLODIPINE',
  'أتينولول':'ATENOLOL','ليزينوبريل':'LISINOPRIL',
  'اينالابريل':'ENALAPRIL','إنالابريل':'ENALAPRIL','ريناتك':'ENALAPRIL',
  'فالسارتان':'VALSARTAN','ديوفان':'VALSARTAN',
  'لوزارتان':'LOSARTAN','كوزار':'LOSARTAN',
  'ميتوبرولول':'METOPROLOL','كارفيديلول':'CARVEDILOL',
  'فوروسيميد':'FUROSEMIDE','لازيكس':'FUROSEMIDE',
  'هيدروكلوروثيازيد':'HYDROCHLOROTHIAZIDE','سبيرونولاكتون':'SPIRONOLACTONE',
  'ديجوكسين':'DIGOXIN','أميودارون':'AMIODARONE',
  'ميتفورمين':'METFORMIN','جلوكوفاج':'METFORMIN',
  'جليمبيريد':'GLIMEPIRIDE','أمارايل':'GLIMEPIRIDE',
  'جليبنكلاميد':'GLIBENCLAMIDE','انسولين':'INSULIN','إنسولين':'INSULIN',
  'سيتاجليبتين':'SITAGLIPTIN','جانوفيا':'SITAGLIPTIN',
  'أتورفاستاتين':'ATORVASTATIN','ليبيتور':'ATORVASTATIN',
  'روزوفاستاتين':'ROSUVASTATIN','كريستور':'ROSUVASTATIN',
  'سيمفاستاتين':'SIMVASTATIN','زوكور':'SIMVASTATIN',
  'سالبوتامول':'SALBUTAMOL','فينتولين':'SALBUTAMOL',
  'مونتيلوكاست':'MONTELUKAST','سينجولار':'MONTELUKAST',
  'سيتيريزين':'CETIRIZINE','زيرتك':'CETIRIZINE',
  'لوراتادين':'LORATADINE','كلاريتين':'LORATADINE',
  'فيكسوفينادين':'FEXOFENADINE','تيلفاست':'FEXOFENADINE',
  'ديكساميثازون':'DEXAMETHASONE','بريدنيزون':'PREDNISONE','بريدنيزولون':'PREDNISOLONE',
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
  'فيتامين د':'CHOLECALCIFEROL','فيتامين د3':'CHOLECALCIFEROL',
  'كولكالسيفيرول':'CHOLECALCIFEROL','فيتامين c':'ASCORBIC ACID',
  'فيتامين سي':'ASCORBIC ACID','حمض الاسكوربيك':'ASCORBIC ACID',
  'كالسيوم':'CALCIUM','حديد':'IRON','فوليك اسيد':'FOLIC ACID',
  'حمض الفوليك':'FOLIC ACID','زنك':'ZINC','اوميجا 3':'OMEGA',
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

const FDA_INFO = {
  'A': { color: '#065f46', bg: '#d1fae5', label: 'A — آمن', desc: 'دراسات كافية لم تُظهر خطراً على الجنين' },
  'B': { color: '#1e40af', bg: '#dbeafe', label: 'B — محدود', desc: 'دراسات الحيوان آمنة، دراسات بشرية محدودة' },
  'C': { color: '#92400e', bg: '#fef3c7', label: 'C — احتياط', desc: 'دراسات الحيوان أظهرت تأثيراً — استخدام عند الضرورة فقط' },
  'D': { color: '#991b1b', bg: '#fee2e2', label: 'D — خطر', desc: 'أدلة على خطر الجنين — استخدام في حالات الضرورة القصوى' },
  'X': { color: '#9d174d', bg: '#fce7f3', label: 'X — ممنوع', desc: 'خطر واضح يفوق أي فائدة — ممنوع في الحمل' },
  'N': { color: '#374151', bg: '#f3f4f6', label: 'N — غير مصنف', desc: 'لم يُصنَّف من FDA بعد' },
};

function translateArabicQuery(query) {
  const q = query.trim();
  if (!q) return null;
  if (ARABIC_DICT[q]) return ARABIC_DICT[q];
  for (const [arabic, english] of Object.entries(ARABIC_DICT)) {
    if (arabic.includes(q) || q.includes(arabic)) return english;
  }
  return null;
}

function isArabic(text) { return /[\u0600-\u06FF]/.test(text); }

// =============================================
//   STATE
// =============================================
let allMedicines = [];
let filteredResults = [];
let displayedCount = 0;
const PAGE_SIZE = 30;
let isLoading = false;
const pageTitles = { search:'البحث عن دواء', equivalent:'البحث عن مثيل', interactions:'التعارضات', ai:'المساعد الذكي' };

// =============================================
//   LOAD DATA
// =============================================
async function loadAllMedicines() {
  try {
    let all = [], from = 0;
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

function populateFilters() {
  const groups    = [...new Set(allMedicines.map(m => m.medical_group).filter(Boolean))].sort();
  const companies = [...new Set(allMedicines.map(m => m.manufacturer).filter(Boolean))].sort();
  const gf = document.getElementById('groupFilter');
  groups.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; gf.appendChild(o); });
  const cf = document.getElementById('companyFilter');
  companies.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; cf.appendChild(o); });
}

function showInitialState() {
  document.getElementById('searchStats').textContent = `إجمالي قاعدة البيانات: ${allMedicines.length.toLocaleString()} دواء`;
  document.getElementById('searchResults').innerHTML = `<div class="empty-state"><div class="es-emoji">💊</div><h3>ابدأ البحث</h3><p>اكتب بالعربي أو الإنجليزي</p></div>`;
  document.getElementById('loadMore').style.display = 'none';
}

function searchMedicines() {
  const raw = document.getElementById('searchInput').value.trim();
  const group = document.getElementById('groupFilter').value;
  const company = document.getElementById('companyFilter').value;
  const clearBtn = document.getElementById('searchClear');
  clearBtn.style.display = raw ? 'flex' : 'none';
  if (!raw && !group && !company) { showInitialState(); return; }
  let q = raw.toLowerCase(), translatedTerm = null;
  if (isArabic(raw)) translatedTerm = translateArabicQuery(raw);
  filteredResults = allMedicines.filter(m => {
    const name   = (m.trade_name||'').toLowerCase();
    const nameAr = (m.arabic_name||'').toLowerCase();
    const ing    = (m.active_ingredient||'').toLowerCase();
    const code   = (m.drug_code||'').toLowerCase();
    let matchQuery = false;
    if (!raw) matchQuery = true;
    else if (translatedTerm) matchQuery = ing.includes(translatedTerm.toLowerCase()) || name.includes(translatedTerm.toLowerCase());
    else matchQuery = name.includes(q) || ing.includes(q) || code.includes(q) || nameAr.includes(q);
    return matchQuery && (!group || m.medical_group === group) && (!company || m.manufacturer === company);
  });
  if (filteredResults.length === 0 && translatedTerm) {
    const partial = translatedTerm.toLowerCase().split(' ')[0];
    filteredResults = allMedicines.filter(m => (m.active_ingredient||'').toLowerCase().includes(partial));
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
  if (translatedTerm && isArabic(originalQuery)) statsText += ` &nbsp;|&nbsp; 🔄 تم البحث عن: <b>${translatedTerm}</b>`;
  stats.innerHTML = statsText;
  if (!filteredResults.length) {
    container.innerHTML = `<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا توجد نتائج</h3><p>جرب كلمة بحث مختلفة</p></div>`;
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
  const fda   = med.fda_category || '';
  const fdaInfo = FDA_INFO[fda];
  el.innerHTML = `
    <div class="card-icon">💊</div>
    <div class="card-body">
      <div class="card-name">${med.trade_name||''}</div>
      ${med.arabic_name ? `<div class="card-name-ar">${med.arabic_name}</div>` : ''}
      ${ing ? `<div class="card-ing">${ing.length>55?ing.substring(0,55)+'…':ing}</div>` : ''}
      <div class="card-tags">
        <span class="tag tag-price">${price}</span>
        ${group ? `<span class="tag tag-group">${group.length>25?group.substring(0,25)+'…':group}</span>` : ''}
        ${fdaInfo ? `<span class="tag tag-fda" style="background:${fdaInfo.bg};color:${fdaInfo.color}">${fdaInfo.label}</span>` : ''}
      </div>
    </div>
    <span class="card-chevron">‹</span>`;
  return el;
}

function searchEquivalent() {
  const raw = document.getElementById('equivInput').value.trim();
  const src = document.getElementById('equivSource');
  const res = document.getElementById('equivResults');
  if (!raw) { src.innerHTML=''; res.innerHTML=''; return; }
  let searchTerm = raw.toLowerCase();
  if (isArabic(raw)) { const t = translateArabicQuery(raw); if (t) searchTerm = t.toLowerCase(); }
  const source = allMedicines.find(m =>
    (m.trade_name||'').toLowerCase().includes(searchTerm) ||
    (m.active_ingredient||'').toLowerCase().includes(searchTerm) ||
    (m.arabic_name||'').toLowerCase().includes(raw.toLowerCase())
  );
  if (!source || !source.active_ingredient) {
    src.innerHTML='';
    res.innerHTML=`<div class="empty-state"><div class="es-emoji">💊</div><h3>لا توجد نتائج</h3><p>تأكد من كتابة اسم الدواء بشكل صحيح</p></div>`;
    return;
  }
  const equivalents = allMedicines.filter(m =>
    m.active_ingredient && m.active_ingredient.toLowerCase()===source.active_ingredient.toLowerCase() && m.trade_name!==source.trade_name
  );
  src.innerHTML=`<div class="equiv-source-card"><div class="es-label">المادة الفعالة</div><div class="es-ing">🧬 ${source.active_ingredient}</div><div class="es-count">${equivalents.length} مثيل موجود في السوق</div></div>`;
  res.innerHTML='';
  if (!equivalents.length) res.innerHTML=`<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا يوجد مثيل</h3><p>هذا الدواء ليس له مثيل في قاعدة البيانات</p></div>`;
  else equivalents.forEach(m => res.appendChild(createMedCard(m)));
}

function suggestDrug(inputId, dropId) {
  const raw=document.getElementById(inputId).value.trim();
  const drop=document.getElementById(dropId);
  if (raw.length<2) { drop.innerHTML=''; return; }
  let searchTerm=raw.toLowerCase();
  if (isArabic(raw)) { const t=translateArabicQuery(raw); if (t) searchTerm=t.toLowerCase(); }
  const matches=allMedicines.filter(m=>
    (m.trade_name||'').toLowerCase().includes(searchTerm)||
    (m.active_ingredient||'').toLowerCase().includes(searchTerm)||
    (m.arabic_name||'').toLowerCase().includes(raw.toLowerCase())
  ).slice(0,8);
  if (!matches.length) { drop.innerHTML=''; return; }
  drop.innerHTML=matches.map(m=>`
    <div class="sug-item" onclick="selectSug('${inputId}','${dropId}','${(m.trade_name||'').replace(/'/g,"\\'")}')">
      <div class="sug-name">${m.trade_name}</div>
      ${m.arabic_name?`<div class="sug-ing" style="color:#16a34a">${m.arabic_name}</div>`:''}
      ${m.active_ingredient?`<div class="sug-ing">${m.active_ingredient}</div>`:''}
    </div>`).join('');
}

function selectSug(inputId, dropId, name) {
  document.getElementById(inputId).value=name;
  document.getElementById(dropId).innerHTML='';
}

async function checkInteraction() {
  const d1=document.getElementById('drug1Input').value.trim();
  const d2=document.getElementById('drug2Input').value.trim();
  const el=document.getElementById('interactionResult');
  if (!d1||!d2) { el.innerHTML=`<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدوائين</p></div>`; return; }
  const m1=allMedicines.find(m=>(m.trade_name||'').toLowerCase()===d1.toLowerCase());
  const m2=allMedicines.find(m=>(m.trade_name||'').toLowerCase()===d2.toLowerCase());
  const i1=m1?.active_ingredient||d1, i2=m2?.active_ingredient||d2;
  el.innerHTML=`<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  const prompt=`أنت صيدلاني متخصص. افحص التعارض الدوائي بين:\nالدواء الأول: ${d1} (المادة الفعالة: ${i1})\nالدواء الثاني: ${d2} (المادة الفعالة: ${i2})\nأجب باللغة العربية:\n1. مستوى التعارض: (آمن / تحذير / خطر)\n2. نوع التعارض إن وجد\n3. التأثيرات المحتملة\n4. التوصية للصيدلاني\nكن مختصراً ودقيقاً.`;
  const res=await callClaude(prompt);
  let cls='result-info';
  if (res.includes('خطر')||res.includes('ممنوع')) cls='result-danger';
  else if (res.includes('تحذير')||res.includes('احتياط')) cls='result-warning';
  else if (res.includes('آمن')) cls='result-safe';
  el.innerHTML=`<div class="result-box ${cls}"><h3>${d1} + ${d2}</h3><p>${res.replace(/\n/g,'<br/>')}</p></div>`;
}

async function checkPregnancy() {
  const drug=document.getElementById('pregInput').value.trim();
  const el=document.getElementById('pregnancyResult');
  if (!drug) { el.innerHTML=`<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدواء</p></div>`; return; }
  const med=allMedicines.find(m=>(m.trade_name||'').toLowerCase().includes(drug.toLowerCase()));
  const ing=med?.active_ingredient||drug, fda=med?.fda_category||'';
  el.innerHTML=`<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  const fdaInfo=FDA_INFO[fda];
  const fdaBadge=fdaInfo?`<div class="fda-badge-big" style="background:${fdaInfo.bg};color:${fdaInfo.color}"><strong>FDA: ${fdaInfo.label}</strong><span>${fdaInfo.desc}</span></div>`:'';
  const prompt=`أنت صيدلاني متخصص. اشرح أمان دواء ${drug} (المادة الفعالة: ${ing}${fda?', تصنيف FDA: '+fda:''}) في:\n1. الحمل\n2. الرضاعة الطبيعية\n3. توصيات للصيدلاني\nأجب باللغة العربية باختصار ودقة.`;
  const res=await callClaude(prompt);
  el.innerHTML=`<div class="result-box result-info"><h3>💊 ${drug}</h3>${fdaBadge}<p style="margin-top:12px">${res.replace(/\n/g,'<br/>')}</p></div>`;
}

async function sendChat() {
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if (!msg||isLoading) return;
  input.value='';
  addBubble(msg,'user');
  isLoading=true;
  const loadId=addTyping();
  const relevantMeds=allMedicines.filter(m=>msg.split(' ').some(w=>w.length>2&&((m.trade_name||'').toLowerCase().includes(w.toLowerCase())||(m.arabic_name||'').toLowerCase().includes(w.toLowerCase())))).slice(0,5);
  const dbCtx=relevantMeds.length?`\nأدوية ذات صلة:\n${relevantMeds.map(m=>`- ${m.trade_name}${m.arabic_name?' ('+m.arabic_name+')':''} | ${m.active_ingredient||'—'} | ${m.price} ج`).join('\n')}` :'';
  const system=`أنت مساعد صيدلاني ذكي متخصص في أدوية السوق المصري. تتكلم بالعربية بأسلوب ودود ومهني. لديك قاعدة بيانات ${allMedicines.length} دواء.${dbCtx}`;
  const res=await callClaude(msg,system);
  removeTyping(loadId);
  addBubble(res,'bot');
  isLoading=false;
}

function addBubble(text,type) {
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');
  div.className=`chat-row ${type}`;
  div.innerHTML=`<div class="chat-avatar">${type==='bot'?'⚕️':'👨‍⚕️'}</div><div class="chat-bubble">${text.replace(/\n/g,'<br/>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}

function addTyping() {
  const id='typing-'+Date.now(), msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');
  div.className='chat-row bot'; div.id=id;
  div.innerHTML=`<div class="chat-avatar">⚕️</div><div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div); msgs.scrollTop=msgs.scrollHeight; return id;
}

function removeTyping(id) { const el=document.getElementById(id); if(el) el.remove(); }

async function callClaude(userMsg, system=null) {
  try {
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:userMsg}],system:system||""})});
    const data=await res.json();
    if (data.content&&data.content[0]) return data.content[0].text;
    if (data.error) return "خطأ: "+data.error.message;
    return "لم يصل رد.";
  } catch { return "تعذر الاتصال. تحقق من الإنترنت."; }
}

function openSheet(med) {
  const price=med.price?`${parseFloat(med.price).toFixed(2)} جنيه`:'—';
  const fda=med.fda_category||'', fdaInfo=FDA_INFO[fda];
  const imgSearchUrl=`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(med.image_search||med.trade_name)}`;
  document.getElementById('sheetContent').innerHTML=`
    <div class="sheet-name">${med.trade_name||''}</div>
    ${med.arabic_name?`<div class="sheet-name-ar">🇦🇪 ${med.arabic_name}</div>`:''}
    <div class="sheet-ing">🧬 ${med.active_ingredient||'غير محدد'}</div>
    <div class="sheet-grid">
      <div class="sheet-info-item"><div class="sii-label">السعر</div><div class="sii-value price">${price}</div></div>
      <div class="sheet-info-item"><div class="sii-label">كود الدواء</div><div class="sii-value">${med.drug_code||'—'}</div></div>
      <div class="sheet-info-item"><div class="sii-label">الشركة</div><div class="sii-value" style="font-size:13px">${med.manufacturer||'—'}</div></div>
      <div class="sheet-info-item"><div class="sii-label">المجموعة</div><div class="sii-value" style="font-size:12px">${med.medical_group||'—'}</div></div>
    </div>
    ${fdaInfo?`<div class="sheet-fda" style="background:${fdaInfo.bg};border:1.5px solid ${fdaInfo.color}30"><div class="sheet-fda-title" style="color:${fdaInfo.color}">🤰 تصنيف FDA: ${fdaInfo.label}</div><div class="sheet-fda-desc">${fdaInfo.desc}</div></div>`:''}
    ${med.moa?`<div class="sheet-moa"><div class="sheet-moa-title">⚙️ آلية العمل</div><div class="sheet-moa-text">${med.moa}</div></div>`:''}
    <div class="sheet-actions">
      <button class="sheet-equiv-btn" onclick="findEquiv('${(med.trade_name||'').replace(/'/g,"\\'")}')">💊 ابحث عن المثيل</button>
      <a href="${imgSearchUrl}" target="_blank" class="sheet-img-btn">🖼️ صورة الدواء</a>
    </div>`;
  document.getElementById('sheetBg').classList.add('show');
  document.getElementById('bottomSheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('sheetBg').classList.remove('show');
  document.getElementById('bottomSheet').classList.remove('open');
}

function findEquiv(name) {
  closeSheet();
  document.getElementById('equivInput').value=name;
  showPage('equivalent',document.querySelector('[data-page="equivalent"]'));
  setTimeout(searchEquivalent,100);
}

function showPage(page,btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-item, .bn-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n=>n.classList.add('active'));
  const titleEl=document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent=pageTitles[page]||'';
  if (window.innerWidth<=768) closeSidebar();
}

function switchTab(tab,btn) {
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
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

document.addEventListener('click',e=>{
  if (!e.target.closest('.drug-inp-wrap')&&!e.target.closest('.search-input-group'))
    document.querySelectorAll('.suggest-drop').forEach(d=>d.innerHTML='');
});

// =============================================
//   START
// =============================================
initAuth();
