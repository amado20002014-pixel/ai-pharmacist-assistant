// ======= CONFIG =======
const SUPABASE_URL = "https://atgyefigxigkfpfgbycu.supabase.co";
const SUPABASE_KEY = "sb_publishable_FXldtz1K4KsuRje0khdQDQ_B0DBzxi3";

// ======= FDA INFO =======
const FDA_INFO = {
  'A':{color:'#065f46',bg:'#d1fae5',label:'A — آمن',desc:'دراسات كافية لم تُظهر خطراً على الجنين'},
  'B':{color:'#1e40af',bg:'#dbeafe',label:'B — محدود',desc:'دراسات الحيوان آمنة، دراسات بشرية محدودة'},
  'C':{color:'#92400e',bg:'#fef3c7',label:'C — احتياط',desc:'دراسات الحيوان أظهرت تأثيراً — استخدام عند الضرورة فقط'},
  'D':{color:'#991b1b',bg:'#fee2e2',label:'D — خطر',desc:'أدلة على خطر الجنين — استخدام في حالات الضرورة القصوى'},
  'X':{color:'#9d174d',bg:'#fce7f3',label:'X — ممنوع',desc:'خطر واضح يفوق أي فائدة — ممنوع في الحمل'},
  'N':{color:'#374151',bg:'#f3f4f6',label:'N — غير مصنف',desc:'لم يُصنَّف من FDA بعد'},
};

// ======= ARABIC DICT =======
const ARABIC_DICT = {
  'اموكسيسيلين':'AMOXICILLIN','أموكسيسيلين':'AMOXICILLIN','أموكسيل':'AMOXICILLIN','اوجمنتين':'AMOXICILLIN','أوجمنتين':'AMOXICILLIN',
  'ازيثرومايسين':'AZITHROMYCIN','أزيثرومايسين':'AZITHROMYCIN','زيثروماكس':'AZITHROMYCIN',
  'سيفترياكسون':'CEFTRIAXONE','روسيفين':'CEFTRIAXONE','سيبروفلوكساسين':'CIPROFLOXACIN','سيبروسين':'CIPROFLOXACIN',
  'ميترونيدازول':'METRONIDAZOLE','فلاجيل':'METRONIDAZOLE','كليندامايسين':'CLINDAMYCIN','دوكسيسيكلين':'DOXYCYCLINE',
  'باراسيتامول':'PARACETAMOL','بانادول':'PARACETAMOL','ادول':'PARACETAMOL','أدول':'PARACETAMOL','تايلينول':'PARACETAMOL',
  'ايبوبروفين':'IBUPROFEN','بروفين':'IBUPROFEN','نوروفين':'IBUPROFEN',
  'ديكلوفيناك':'DICLOFENAC','كتافلام':'DICLOFENAC','فولتارين':'DICLOFENAC',
  'ميلوكسيكام':'MELOXICAM','سيليكوكسيب':'CELECOXIB','ترامادول':'TRAMADOL',
  'اوميبرازول':'OMEPRAZOLE','أوميبرازول':'OMEPRAZOLE','لوسيك':'OMEPRAZOLE',
  'ايزوميبرازول':'ESOMEPRAZOLE','نيكسيوم':'ESOMEPRAZOLE','بانتوبرازول':'PANTOPRAZOLE',
  'اوندانسيترون':'ONDANSETRON','زوفران':'ONDANSETRON','ميتوكلوبراميد':'METOCLOPRAMIDE','بريمبيران':'METOCLOPRAMIDE',
  'أملوديبين':'AMLODIPINE','نورفاسك':'AMLODIPINE','أتينولول':'ATENOLOL','ليزينوبريل':'LISINOPRIL',
  'اينالابريل':'ENALAPRIL','ريناتك':'ENALAPRIL','فالسارتان':'VALSARTAN','ديوفان':'VALSARTAN',
  'لوزارتان':'LOSARTAN','كوزار':'LOSARTAN','فوروسيميد':'FUROSEMIDE','لازيكس':'FUROSEMIDE',
  'ميتفورمين':'METFORMIN','جلوكوفاج':'METFORMIN','جليمبيريد':'GLIMEPIRIDE','أمارايل':'GLIMEPIRIDE',
  'انسولين':'INSULIN','إنسولين':'INSULIN','سيتاجليبتين':'SITAGLIPTIN','جانوفيا':'SITAGLIPTIN',
  'أتورفاستاتين':'ATORVASTATIN','ليبيتور':'ATORVASTATIN','روزوفاستاتين':'ROSUVASTATIN','كريستور':'ROSUVASTATIN',
  'سيمفاستاتين':'SIMVASTATIN','زوكور':'SIMVASTATIN',
  'سالبوتامول':'SALBUTAMOL','فينتولين':'SALBUTAMOL','مونتيلوكاست':'MONTELUKAST','سينجولار':'MONTELUKAST',
  'سيتيريزين':'CETIRIZINE','زيرتك':'CETIRIZINE','لوراتادين':'LORATADINE','كلاريتين':'LORATADINE',
  'ديكساميثازون':'DEXAMETHASONE','بريدنيزون':'PREDNISONE','بريدنيزولون':'PREDNISOLONE',
  'بريجابالين':'PREGABALIN','ليريكا':'PREGABALIN','جابابنتين':'GABAPENTIN',
  'اسيتالوبرام':'ESCITALOPRAM','ليكسابرو':'ESCITALOPRAM','سيرترالين':'SERTRALINE','زولوفت':'SERTRALINE',
  'فلوكسيتين':'FLUOXETINE','بروزاك':'FLUOXETINE','ديازيبام':'DIAZEPAM','فاليوم':'DIAZEPAM',
  'الوبرازولام':'ALPRAZOLAM','زاناكس':'ALPRAZOLAM','كاربامازيبين':'CARBAMAZEPINE','تيجريتول':'CARBAMAZEPINE',
  'فيتامين د':'CHOLECALCIFEROL','فيتامين د3':'CHOLECALCIFEROL','فيتامين سي':'ASCORBIC ACID',
  'كالسيوم':'CALCIUM','حديد':'IRON','حمض الفوليك':'FOLIC ACID','زنك':'ZINC','اوميجا 3':'OMEGA',
  'مضاد حيوي':'ANTIBIOTIC','مضادات حيوية':'ANTIBIOTIC','مسكن':'PARACETAMOL',
  'ضغط':'AMLODIPINE','سكر':'METFORMIN','سكري':'METFORMIN',
  'كوليسترول':'ROSUVASTATIN','معدة':'OMEPRAZOLE','حرقة':'OMEPRAZOLE',
  'حساسية':'CETIRIZINE','نوم':'DIAZEPAM','اكتئاب':'ESCITALOPRAM','قلق':'ALPRAZOLAM',
  'تادالافيل':'TADALAFIL','سيلدينافيل':'SILDENAFIL','فلوكونازول':'FLUCONAZOLE',
};

function translateArabicQuery(q){
  if(!q) return null;
  if(ARABIC_DICT[q]) return ARABIC_DICT[q];
  for(const[ar,en] of Object.entries(ARABIC_DICT)) if(ar.includes(q)||q.includes(ar)) return en;
  return null;
}
function isArabic(t){return /[\u0600-\u06FF]/.test(t)}

// ======= AUTH =======
let currentUser=null, currentSession=null;

function saveSession(s,u){currentSession=s;currentUser=u;localStorage.setItem('ph_s',JSON.stringify({s,u}))}
function loadSession(){try{const r=localStorage.getItem('ph_s');return r?JSON.parse(r):null}catch{return null}}
function clearSession(){currentSession=null;currentUser=null;localStorage.removeItem('ph_s')}

async function supabaseAuth(action,payload){
  const r=await fetch(`${SUPABASE_URL}/auth/v1/${action}`,{method:'POST',headers:{'apikey':SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  return r.json();
}

async function initAuth(){
  const saved=loadSession();
  if(!saved){showAuthScreen();return}
  try{
    const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${saved.s.access_token}`}});
    if(r.ok){currentUser=await r.json();currentSession=saved.s;showAppScreen(currentUser)}
    else{clearSession();showAuthScreen()}
  }catch{clearSession();showAuthScreen()}
}

async function doLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pass=document.getElementById('loginPassword').value;
  const btn=document.getElementById('loginBtn');
  if(!email||!pass){showAuthError('loginError','من فضلك أدخل الإيميل وكلمة المرور');return}
  btn.disabled=true;btn.textContent='جاري تسجيل الدخول...';
  const data=await supabaseAuth('token?grant_type=password',{email,password:pass});
  if(data.access_token){saveSession(data,data.user);showAppScreen(data.user)}
  else{showAuthError('loginError',translateAuthErr(data.error_description||data.msg||''));btn.disabled=false;btn.textContent='تسجيل الدخول'}
}

async function doSignup(){
  const name=document.getElementById('signupName').value.trim();
  const phone=document.getElementById('signupPhone').value.trim();
  const email=document.getElementById('signupEmail').value.trim();
  const pass=document.getElementById('signupPassword').value;
  const conf=document.getElementById('signupConfirm').value;
  const btn=document.getElementById('signupBtn');
  if(!name||!phone||!email||!pass||!conf){showAuthError('signupError','من فضلك أكمل كل البيانات');return}
  if(!/^01[0125]\d{8}$/.test(phone)){showAuthError('signupError','رقم الموبايل غير صحيح');return}
  if(pass.length<8){showAuthError('signupError','كلمة المرور لازم تكون ٨ أحرف على الأقل');return}
  if(pass!==conf){showAuthError('signupError','كلمة المرور مش متطابقة');return}
  btn.disabled=true;btn.textContent='جاري إنشاء الحساب...';
  const data=await supabaseAuth('signup',{email,password:pass,data:{full_name:name,phone:'+20'+phone.replace(/^0/,'')}});
  if(data.id||data.user?.id){showAuthPage('verifyPage');document.getElementById('verifyMsg').textContent=`بعتنالك رابط تأكيد على ${email}`}
  else{showAuthError('signupError',translateAuthErr(data.error_description||data.msg||data.message||''));btn.disabled=false;btn.textContent='إنشاء الحساب'}
}

async function doLogout(){
  if(currentSession) await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${currentSession.access_token}`}}).catch(()=>{});
  clearSession();allMedicines=[];showAuthScreen();
}

function showAuthError(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block'}
function translateAuthErr(msg){
  if(!msg) return 'حصل خطأ، حاول تاني';
  const m=msg.toLowerCase();
  if(m.includes('invalid')||m.includes('credentials')) return 'الإيميل أو كلمة المرور غلط';
  if(m.includes('not confirmed')) return 'لازم تأكد إيميلك الأول';
  if(m.includes('already')) return 'الإيميل ده مسجّل قبل كده';
  if(m.includes('rate limit')) return 'حاولت كتير، استنى شوية';
  return msg;
}
function togglePass(id,btn){const i=document.getElementById(id);if(i.type==='password'){i.type='text';btn.textContent='🙈'}else{i.type='password';btn.textContent='👁'}}

// ======= SCREENS =======
function showAuthScreen(){document.getElementById('authScreen').style.display='flex';document.getElementById('appScreen').style.display='none';showAuthPage('loginPage')}
function showAuthPage(id){document.querySelectorAll('.auth-page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.auth-error,.auth-success').forEach(e=>e.style.display='none')}

function showAppScreen(user){
  document.getElementById('authScreen').style.display='none';
  document.getElementById('appScreen').style.display='block';
  const meta=user.user_metadata||{};
  const name=meta.full_name||meta.name||user.email?.split('@')[0]||'صيدلاني';
  document.getElementById('greetName').textContent=name;
  document.getElementById('tbAvatar').textContent=name.charAt(0).toUpperCase();
  loadAllMedicines();
}

// ======= NAVIGATION =======
let currentPage='home';

function openPage(page){
  currentPage=page;
  document.getElementById('homeScreen').classList.remove('active');
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.getElementById('tbBack').style.display='flex';

  const titles={
    search:'البحث عن أدوية 🔍',equivalent:'البحث عن مثيل 💊',
    drugdrug:'تعارضات دوائية ⚠️',pregnancy:'تعارضات الحمل 🤰',
    breastfeeding:'تعارضات الرضاعة 🤱',moa:'Mechanism of Action ⚙️',
    ai:'المساعد الذكي 🤖',companies:'الشركات المنتجة 🏭'
  };
  document.querySelector('.tb-title span').textContent=titles[page]||'';

  if(page==='companies') renderCompanies();
}

function goHome(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('homeScreen').classList.add('active');
  document.getElementById('tbBack').style.display='none';
  document.querySelector('.tb-title span').textContent='AI Pharmacist';
  currentPage='home';
  document.getElementById('companyDrugsView').style.display='none';
  document.getElementById('companiesList').style.display='flex';
}

// ======= DATA =======
let allMedicines=[], filteredResults=[], displayedCount=0;
const PAGE_SIZE=30;
let isLoading=false;

async function loadAllMedicines(){
  try{
    let all=[],from=0;
    while(true){
      const r=await fetch(`${SUPABASE_URL}/rest/v1/medicines?select=*&order=trade_name.asc&limit=1000&offset=${from}`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
      const d=await r.json();
      if(!d||!d.length) break;
      all=all.concat(d);
      if(d.length<1000) break;
      from+=1000;
    }
    allMedicines=all;
    // Stats
    document.getElementById('statDrugs').textContent=all.length.toLocaleString('ar-EG');
    const companies=new Set(all.map(m=>m.manufacturer).filter(Boolean));
    const groups=new Set(all.map(m=>m.medical_group).filter(Boolean));
    document.getElementById('statCompanies').textContent=companies.size.toLocaleString('ar-EG');
    document.getElementById('statGroups').textContent=groups.size.toLocaleString('ar-EG');
    populateFilters();
  }catch(e){console.error(e)}
}

function populateFilters(){
  const groups=[...new Set(allMedicines.map(m=>m.medical_group).filter(Boolean))].sort();
  const companies=[...new Set(allMedicines.map(m=>m.manufacturer).filter(Boolean))].sort();
  const gf=document.getElementById('groupFilter');
  groups.forEach(g=>{const o=document.createElement('option');o.value=g;o.textContent=g;gf.appendChild(o)});
  const cf=document.getElementById('companyFilter');
  companies.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;cf.appendChild(o)});
}

// ======= SEARCH =======
function searchMedicines(){
  const raw=document.getElementById('searchInput').value.trim();
  const group=document.getElementById('groupFilter').value;
  const company=document.getElementById('companyFilter').value;
  document.getElementById('searchClear').style.display=raw?'flex':'none';
  if(!raw&&!group&&!company){
    document.getElementById('searchStats').textContent=`إجمالي قاعدة البيانات: ${allMedicines.length.toLocaleString()} دواء`;
    document.getElementById('searchResults').innerHTML=`<div class="empty-state"><div class="es-emoji">💊</div><h3>ابدأ البحث</h3><p>اكتب بالعربي أو الإنجليزي</p></div>`;
    document.getElementById('loadMore').style.display='none';
    return;
  }
  let q=raw.toLowerCase(),translated=null;
  if(isArabic(raw)) translated=translateArabicQuery(raw);
  filteredResults=allMedicines.filter(m=>{
    const name=(m.trade_name||'').toLowerCase(),ar=(m.arabic_name||'').toLowerCase(),ing=(m.active_ingredient||'').toLowerCase();
    let match=false;
    if(!raw) match=true;
    else if(translated) match=ing.includes(translated.toLowerCase())||name.includes(translated.toLowerCase());
    else match=name.includes(q)||ing.includes(q)||ar.includes(q)||(m.drug_code||'').toLowerCase().includes(q);
    return match&&(!group||m.medical_group===group)&&(!company||m.manufacturer===company);
  });
  if(!filteredResults.length&&translated){const p=translated.toLowerCase().split(' ')[0];filteredResults=allMedicines.filter(m=>(m.active_ingredient||'').toLowerCase().includes(p))}
  displayedCount=0;
  let stats=`نتائج البحث: ${filteredResults.length.toLocaleString()} دواء`;
  if(translated&&isArabic(raw)) stats+=` | 🔄 بحث عن: <b>${translated}</b>`;
  document.getElementById('searchStats').innerHTML=stats;
  const container=document.getElementById('searchResults');
  container.innerHTML='';
  if(!filteredResults.length){container.innerHTML=`<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا توجد نتائج</h3><p>جرب كلمة بحث مختلفة</p></div>`;document.getElementById('loadMore').style.display='none';return}
  const slice=filteredResults.slice(0,PAGE_SIZE);
  slice.forEach(m=>container.appendChild(createMedCard(m)));
  displayedCount=slice.length;
  document.getElementById('loadMore').style.display=displayedCount<filteredResults.length?'block':'none';
}

function clearSearch(){document.getElementById('searchInput').value='';document.getElementById('searchClear').style.display='none';searchMedicines()}

function loadMoreResults(){
  const slice=filteredResults.slice(displayedCount,displayedCount+PAGE_SIZE);
  slice.forEach(m=>document.getElementById('searchResults').appendChild(createMedCard(m)));
  displayedCount+=slice.length;
  document.getElementById('loadMore').style.display=displayedCount<filteredResults.length?'block':'none';
}

function createMedCard(med){
  const el=document.createElement('div');el.className='med-card';el.onclick=()=>openSheet(med);
  const price=med.price?`${parseFloat(med.price).toFixed(2)} ج`:'—';
  const fi=FDA_INFO[med.fda_category||''];
  el.innerHTML=`
    <div class="card-icon">💊</div>
    <div class="card-body">
      <div class="card-name">${med.trade_name||''}</div>
      ${med.arabic_name?`<div class="card-name-ar">${med.arabic_name}</div>`:''}
      ${med.active_ingredient?`<div class="card-ing">${med.active_ingredient.length>55?med.active_ingredient.substring(0,55)+'…':med.active_ingredient}</div>`:''}
      <div class="card-tags">
        <span class="tag tag-price">${price}</span>
        ${med.medical_group?`<span class="tag tag-group">${med.medical_group.length>25?med.medical_group.substring(0,25)+'…':med.medical_group}</span>`:''}
        ${fi?`<span class="tag tag-fda" style="background:${fi.bg};color:${fi.color}">${fi.label}</span>`:''}
      </div>
    </div>
    <span class="card-chevron">‹</span>`;
  return el;
}

// ======= EQUIVALENT =======
function searchEquivalent(){
  const raw=document.getElementById('equivInput').value.trim();
  const src=document.getElementById('equivSource'),res=document.getElementById('equivResults');
  if(!raw){src.innerHTML='';res.innerHTML='';return}
  let term=raw.toLowerCase();
  if(isArabic(raw)){const t=translateArabicQuery(raw);if(t) term=t.toLowerCase()}
  const source=allMedicines.find(m=>(m.trade_name||'').toLowerCase().includes(term)||(m.active_ingredient||'').toLowerCase().includes(term)||(m.arabic_name||'').toLowerCase().includes(raw.toLowerCase()));
  if(!source||!source.active_ingredient){src.innerHTML='';res.innerHTML=`<div class="empty-state"><div class="es-emoji">💊</div><h3>لا توجد نتائج</h3><p>تأكد من اسم الدواء</p></div>`;return}
  const equivs=allMedicines.filter(m=>m.active_ingredient&&m.active_ingredient.toLowerCase()===source.active_ingredient.toLowerCase()&&m.trade_name!==source.trade_name);
  src.innerHTML=`<div class="equiv-source-card"><div class="es-label">المادة الفعالة</div><div class="es-ing">🧬 ${source.active_ingredient}</div><div class="es-count">${equivs.length} مثيل موجود في السوق</div></div>`;
  res.innerHTML='';
  if(!equivs.length) res.innerHTML=`<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا يوجد مثيل</h3><p>هذا الدواء ليس له مثيل في قاعدة البيانات</p></div>`;
  else equivs.forEach(m=>res.appendChild(createMedCard(m)));
}

// ======= SUGGEST =======
function suggestDrug(inputId,dropId){
  const raw=document.getElementById(inputId).value.trim();
  const drop=document.getElementById(dropId);
  if(raw.length<2){drop.innerHTML='';return}
  let term=raw.toLowerCase();
  if(isArabic(raw)){const t=translateArabicQuery(raw);if(t) term=t.toLowerCase()}
  const matches=allMedicines.filter(m=>(m.trade_name||'').toLowerCase().includes(term)||(m.active_ingredient||'').toLowerCase().includes(term)||(m.arabic_name||'').toLowerCase().includes(raw.toLowerCase())).slice(0,8);
  if(!matches.length){drop.innerHTML='';return}
  drop.innerHTML=matches.map(m=>`<div class="sug-item" onclick="selectSug('${inputId}','${dropId}','${(m.trade_name||'').replace(/'/g,"\\'")}')"><div class="sug-name">${m.trade_name}</div>${m.arabic_name?`<div class="sug-ing" style="color:#16a34a">${m.arabic_name}</div>`:''} ${m.active_ingredient?`<div class="sug-ing">${m.active_ingredient}</div>`:''}</div>`).join('');
}

function selectSug(inputId,dropId,name){document.getElementById(inputId).value=name;document.getElementById(dropId).innerHTML=''}

// ======= INTERACTIONS =======
async function checkInteraction(){
  const d1=document.getElementById('drug1Input').value.trim(),d2=document.getElementById('drug2Input').value.trim();
  const el=document.getElementById('interactionResult');
  if(!d1||!d2){el.innerHTML=`<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدوائين</p></div>`;return}
  const m1=allMedicines.find(m=>(m.trade_name||'').toLowerCase()===d1.toLowerCase());
  const m2=allMedicines.find(m=>(m.trade_name||'').toLowerCase()===d2.toLowerCase());
  el.innerHTML=`<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  const prompt=`أنت صيدلاني متخصص. افحص التعارض الدوائي بين:\nالدواء الأول: ${d1} (المادة الفعالة: ${m1?.active_ingredient||d1})\nالدواء الثاني: ${d2} (المادة الفعالة: ${m2?.active_ingredient||d2})\nأجب باللغة العربية:\n1. مستوى التعارض: (آمن / تحذير / خطر)\n2. نوع التعارض\n3. التأثيرات المحتملة\n4. التوصية للصيدلاني`;
  const res=await callClaude(prompt);
  let cls='result-info';
  if(res.includes('خطر')||res.includes('ممنوع')) cls='result-danger';
  else if(res.includes('تحذير')||res.includes('احتياط')) cls='result-warning';
  else if(res.includes('آمن')) cls='result-safe';
  el.innerHTML=`<div class="result-box ${cls}"><h3>${d1} + ${d2}</h3><p>${res.replace(/\n/g,'<br/>')}</p></div>`;
}

async function checkPregnancy(){
  const drug=document.getElementById('pregInput').value.trim();
  const el=document.getElementById('pregnancyResult');
  if(!drug){el.innerHTML=`<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدواء</p></div>`;return}
  const med=allMedicines.find(m=>(m.trade_name||'').toLowerCase().includes(drug.toLowerCase()));
  const ing=med?.active_ingredient||drug, fda=med?.fda_category||'';
  el.innerHTML=`<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  const fi=FDA_INFO[fda];
  const fdaBadge=fi?`<div class="fda-badge-big" style="background:${fi.bg};color:${fi.color}"><strong>FDA: ${fi.label}</strong><span>${fi.desc}</span></div>`:'';
  const prompt=`أنت صيدلاني متخصص. اشرح أمان دواء ${drug} (المادة الفعالة: ${ing}${fda?', تصنيف FDA: '+fda:''}) في الحمل:\n1. تصنيف FDA ومعناه\n2. المخاطر المحتملة على الجنين\n3. توصيات للصيدلاني\nأجب باللغة العربية باختصار ودقة.`;
  const res=await callClaude(prompt);
  el.innerHTML=`<div class="result-box result-info"><h3>🤰 ${drug}</h3>${fdaBadge}<p style="margin-top:12px">${res.replace(/\n/g,'<br/>')}</p></div>`;
}

async function checkBreastfeeding(){
  const drug=document.getElementById('bfInput').value.trim();
  const el=document.getElementById('breastfeedingResult');
  if(!drug){el.innerHTML=`<div class="result-box result-warning"><h3>⚠️ تنبيه</h3><p>من فضلك أدخل اسم الدواء</p></div>`;return}
  const med=allMedicines.find(m=>(m.trade_name||'').toLowerCase().includes(drug.toLowerCase()));
  const ing=med?.active_ingredient||drug;
  el.innerHTML=`<div class="result-box result-info"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  const prompt=`أنت صيدلاني متخصص. اشرح أمان دواء ${drug} (المادة الفعالة: ${ing}) أثناء الرضاعة الطبيعية:\n1. هل يُفرز في لبن الأم؟\n2. التأثير المحتمل على الرضيع\n3. هل يُسمح باستخدامه أم لا؟\n4. توصيات للصيدلاني\nأجب باللغة العربية باختصار ودقة.`;
  const res=await callClaude(prompt);
  let cls='result-info';
  if(res.includes('ممنوع')||res.includes('خطر')) cls='result-danger';
  else if(res.includes('احتياط')||res.includes('تحذير')) cls='result-warning';
  else if(res.includes('آمن')||res.includes('مسموح')) cls='result-safe';
  el.innerHTML=`<div class="result-box ${cls}"><h3>🤱 ${drug}</h3><p>${res.replace(/\n/g,'<br/>')}</p></div>`;
}

// ======= MOA =======
function searchMOA(){
  const raw=document.getElementById('moaInput').value.trim();
  const container=document.getElementById('moaResults');
  if(!raw){container.innerHTML=`<div class="empty-state"><div class="es-emoji">⚙️</div><h3>ابحث عن دواء</h3><p>سيظهر لك آلية عمله من قاعدة البيانات</p></div>`;return}
  let term=raw.toLowerCase();
  if(isArabic(raw)){const t=translateArabicQuery(raw);if(t) term=t.toLowerCase()}
  const results=allMedicines.filter(m=>
    m.moa&&(
      (m.trade_name||'').toLowerCase().includes(term)||
      (m.active_ingredient||'').toLowerCase().includes(term)||
      (m.arabic_name||'').toLowerCase().includes(raw.toLowerCase())
    )
  ).slice(0,20);
  container.innerHTML='';
  if(!results.length){container.innerHTML=`<div class="empty-state"><div class="es-emoji">🔍</div><h3>لا توجد نتائج</h3><p>جرب اسم دواء مختلف</p></div>`;return}
  results.forEach(m=>{
    const card=document.createElement('div');card.className='moa-card';
    card.innerHTML=`
      <div class="moa-drug-name">${m.trade_name}</div>
      ${m.arabic_name?`<div class="moa-drug-ar">${m.arabic_name}</div>`:''}
      ${m.active_ingredient?`<div style="font-size:12px;color:var(--text-3);margin-bottom:8px">🧬 ${m.active_ingredient}</div>`:''}
      <div class="moa-text">${m.moa}</div>`;
    container.appendChild(card);
  });
}

// ======= COMPANIES =======
let allCompanies=[];

function renderCompanies(){
  const list=document.getElementById('companiesList');
  list.style.display='flex';
  document.getElementById('companyDrugsView').style.display='none';
  if(!allCompanies.length){
    const counts={};
    allMedicines.forEach(m=>{if(m.manufacturer) counts[m.manufacturer]=(counts[m.manufacturer]||0)+1});
    allCompanies=Object.entries(counts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  }
  displayCompanies(allCompanies);
}

function displayCompanies(list){
  const container=document.getElementById('companiesList');
  container.innerHTML='';
  list.forEach(c=>{
    const card=document.createElement('div');card.className='company-card';
    card.onclick=()=>openCompany(c.name);
    card.innerHTML=`<div class="company-icon">🏭</div><div class="company-name">${c.name}</div><span class="company-count">${c.count} دواء</span>`;
    container.appendChild(card);
  });
}

function filterCompanies(){
  const q=document.getElementById('companySearch').value.trim().toLowerCase();
  if(!q){displayCompanies(allCompanies);return}
  displayCompanies(allCompanies.filter(c=>c.name.toLowerCase().includes(q)));
}

function openCompany(name){
  document.getElementById('companiesList').style.display='none';
  document.getElementById('companyDrugsView').style.display='block';
  document.getElementById('companyTitle').textContent=name;
  const drugs=allMedicines.filter(m=>m.manufacturer===name);
  document.getElementById('companyCount').textContent=`${drugs.length} دواء`;
  const list=document.getElementById('companyDrugsList');
  list.innerHTML='';
  drugs.forEach(m=>list.appendChild(createMedCard(m)));
}

function backToCompanies(){
  document.getElementById('companyDrugsView').style.display='none';
  document.getElementById('companiesList').style.display='flex';
}

// ======= AI CHAT =======
async function sendChat(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg||isLoading) return;
  input.value='';
  addBubble(msg,'user');isLoading=true;
  const loadId=addTyping();
  const relevantMeds=allMedicines.filter(m=>msg.split(' ').some(w=>w.length>2&&((m.trade_name||'').toLowerCase().includes(w.toLowerCase())||(m.arabic_name||'').toLowerCase().includes(w.toLowerCase())))).slice(0,5);
  const dbCtx=relevantMeds.length?`\nأدوية ذات صلة:\n${relevantMeds.map(m=>`- ${m.trade_name} | ${m.active_ingredient||'—'} | ${m.price} ج`).join('\n')}`:'';
  const system=`أنت مساعد صيدلاني ذكي متخصص في أدوية السوق المصري. تتكلم بالعربية بأسلوب ودود ومهني. لديك قاعدة بيانات ${allMedicines.length} دواء.${dbCtx}`;
  const res=await callClaude(msg,system);
  removeTyping(loadId);addBubble(res,'bot');isLoading=false;
}

function addBubble(text,type){
  const msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');div.className=`chat-row ${type}`;
  div.innerHTML=`<div class="chat-avatar">${type==='bot'?'⚕️':'👨‍⚕️'}</div><div class="chat-bubble">${text.replace(/\n/g,'<br/>')}</div>`;
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
}

function addTyping(){
  const id='t-'+Date.now(),msgs=document.getElementById('chatMessages');
  const div=document.createElement('div');div.className='chat-row bot';div.id=id;
  div.innerHTML=`<div class="chat-avatar">⚕️</div><div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;return id;
}
function removeTyping(id){const el=document.getElementById(id);if(el)el.remove()}

// ======= CLAUDE API =======
async function callClaude(msg,system=null){
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:msg}],system:system||''})});
    const d=await r.json();
    if(d.content&&d.content[0]) return d.content[0].text;
    if(d.error) return 'خطأ: '+d.error.message;
    return 'لم يصل رد.';
  }catch{return 'تعذر الاتصال. تحقق من الإنترنت.'}
}

// ======= SHEET =======
function openSheet(med){
  const price=med.price?`${parseFloat(med.price).toFixed(2)} جنيه`:'—';
  const fi=FDA_INFO[med.fda_category||''];
  const imgUrl=`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(med.image_search||med.trade_name)}`;
  document.getElementById('sheetContent').innerHTML=`
    <div class="sheet-name">${med.trade_name||''}</div>
    ${med.arabic_name?`<div class="sheet-name-ar">🇦🇪 ${med.arabic_name}</div>`:''}
    <div class="sheet-ing">🧬 ${med.active_ingredient||'غير محدد'}</div>
    <div class="sheet-grid">
      <div class="sheet-info-item"><div class="sii-label">السعر</div><div class="sii-value price">${price}</div></div>
      <div class="sheet-info-item"><div class="sii-label">كود الدواء</div><div class="sii-value">${med.drug_code||'—'}</div></div>
      <div class="sheet-info-item"><div class="sii-label">الشركة</div><div class="sii-value" style="font-size:12px">${med.manufacturer||'—'}</div></div>
      <div class="sheet-info-item"><div class="sii-label">المجموعة</div><div class="sii-value" style="font-size:11px">${med.medical_group||'—'}</div></div>
    </div>
    ${fi?`<div class="sheet-fda" style="background:${fi.bg};border:1.5px solid ${fi.color}40"><div class="sheet-fda-title" style="color:${fi.color}">🤰 FDA: ${fi.label}</div><div class="sheet-fda-desc">${fi.desc}</div></div>`:''}
    ${med.moa?`<div class="sheet-moa"><div class="sheet-moa-title">⚙️ آلية العمل</div><div class="sheet-moa-text">${med.moa}</div></div>`:''}
    <div class="sheet-actions">
      <button class="sheet-equiv-btn" onclick="goEquiv('${(med.trade_name||'').replace(/'/g,"\\'")}')">💊 ابحث عن المثيل</button>
      <a href="${imgUrl}" target="_blank" class="sheet-img-btn">🖼️ صورة الدواء</a>
    </div>`;
  document.getElementById('sheetBg').classList.add('show');
  document.getElementById('bottomSheet').classList.add('open');
}

function closeSheet(){document.getElementById('sheetBg').classList.remove('show');document.getElementById('bottomSheet').classList.remove('open')}

function goEquiv(name){
  closeSheet();
  openPage('equivalent');
  document.getElementById('equivInput').value=name;
  setTimeout(searchEquivalent,100);
}

document.addEventListener('click',e=>{
  if(!e.target.closest('.drug-inp-wrap')&&!e.target.closest('.search-input-group'))
    document.querySelectorAll('.suggest-drop').forEach(d=>d.innerHTML='');
});

// ======= INIT =======
initAuth();
