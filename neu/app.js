/* Aufnahmetest Trainer · Neubau 2026 · App-Logik
   Daten und Aufgaben-Generatoren kommen aus data.js (aus der bisherigen App übernommen), Tatort-Bilder aus scenes.js. */
(function(){
'use strict';

/* ================= Grundlagen ================= */
const H=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mix=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const any=a=>a[Math.floor(Math.random()*a.length)];
const DMS=864e5, BOXD=[0,1,3,7,14,30];
const SKEY='aufnahmetest-neu-v1';
const dk=t=>{const d=new Date(t||Date.now());return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const app=document.getElementById('app');
const AREA_IC={
 logik:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
 raum:'<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/>',
 konz:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 merk:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 text:'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
 sprache:'<path d="M4 20l6-16h2l6 16M7 14h8"/>'
};
const AREA_COL={logik:['#EAF1FB','#0A5FC8'],raum:['#FFF3D6','#8A5A00'],konz:['#E6F6EC','#17702F'],merk:['#F0EBFF','#5B3FD6'],text:['#E7F6FA','#0E6A80'],sprache:['#FDECEF','#B3261E']};
const SHORT={logik:'Logik',raum:'Räumlich',konz:'Konzentration',merk:'Merkfähigkeit',text:'Textverständnis',sprache:'Sprache'};
const ICO=(p,s)=>`<svg viewBox="0 0 24 24" width="${s||22}" height="${s||22}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 learn:'<path d="M4 19V5M10 19V9M16 19v-6M22 19H2"/>',
 know:'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h6"/>',
 me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>', back:'<path d="M15 18l-6-6 6-6"/>', chev:'<path d="M9 18l6-6-6-6"/>',
 spk:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9a4 4 0 0 1 0 6"/>', spark:'<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>', redo:'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
 warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>', check:'<path d="M5 12l5 5L20 7"/>',
 play:'<path d="M7 4l13 8-13 8z"/>', pause:'<path d="M7 4h4v16H7zM14 4h4v16h-4z"/>', stop:'<path d="M6 6h12v12H6z"/>',
 cloud:'<path d="M7 18a5 5 0 0 1-.6-9.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>', note:'<path d="M4 20h4L20 8l-4-4L4 16z"/>',
 zoom:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M11 8v6M8 11h6"/>', mic:'<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>', trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5"/>'
};

/* ================= Zustand ================= */
function fresh(){return {v:1,upd:0,name:'',test:'',onb:false,acct:'local',theme:'weiss',
 tts:{eng:'hb',cv:'buttery',sex:'w',rate:1,hl:true},ki:true,round:'alle',
 sp:{},qs:{},notes:{},wg:[],log:[],days:{},lv:{},sc:{},plan:null,iv:{},chk:{},lex:{},ex:[],einst:null,psg:{},dk:{n:0,ok:0}};}
let ST=(()=>{try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.v===1)return Object.assign(fresh(),s);}catch(e){}return fresh();})();
let storeOK=true;
function save(){ST.upd=Date.now();try{localStorage.setItem(SKEY,JSON.stringify(ST));storeOK=true;}catch(e){storeOK=false;}cloudQueue();}

/* ================= Konto (Claude-Link: privater Speicher je Person) ================= */
const C={state:'wait',db:null,uid:null,writing:false,pending:false,t:null,last:0,err:''};
async function capInit(){
  let tries=0;while(!(window.claude&&window.claude.use)&&tries<20){await new Promise(r=>setTimeout(r,150));tries++;}
  if(!(window.claude&&window.claude.use)){C.state='na';refreshAcct();return;}
  try{
    const [db,u]=await Promise.all([claude.use('db'),claude.use('user')]);
    const id=u?await u.id():null;
    if(!db||!id){C.state='na';refreshAcct();return;}
    C.db=db;C.uid=id;C.state='ready';refreshAcct();
    if(ST.acct==='cloud')cloudPull();
  }catch(e){C.state='na';refreshAcct();}
  try{AI=await claude.use('sample');}catch(e){AI=null;}
  try{TT=await claude.use('tts');}catch(e){TT=null;}
  if(TT)try{TT.onState(({state})=>{PL.cstate=state;if(state==='idle'&&PL.eng==='claude'){PL.on=false;plRender();}});}catch(e){}
  if(TT)try{TT.onLine(({id})=>{if(PL.eng==='claude'&&id!=null){PL.i=+id;plMark();}});}catch(e){}
  render();
}
const cdoc=()=>C.db.doc('data/users/'+C.uid+'/trainer');
function packCloud(){const o=Object.assign({},ST);let s=JSON.stringify(o);if(s.length>230000){o.wg=[];o.log=ST.log.slice(-600);s=JSON.stringify(o);}return s;}
async function cloudPull(){
  if(!C.db)return;C.state='sync';refreshAcct();
  const to=setTimeout(()=>{if(C.state==='sync'){C.state='slow';refreshAcct();}},10000);
  try{
    const snap=await cdoc().get();clearTimeout(to);
    if(snap.exists){const d=snap.data();let r=null;try{r=JSON.parse(d.st);}catch(e){}
      if(r&&r.v===1&&(r.upd||0)>(ST.upd||0)){const keepTheme=ST.theme;ST=Object.assign(fresh(),r);ST.acct='cloud';if(!ST.theme)ST.theme=keepTheme;try{localStorage.setItem(SKEY,JSON.stringify(ST));}catch(e){}applyTheme();C.state='ok';C.last=Date.now();render();return;}}
    C.state='ok';await cloudPush();
  }catch(e){clearTimeout(to);C.state='err';C.err=e&&e.code||'';refreshAcct();}
}
function cloudQueue(){if(ST.acct!=='cloud'||!C.db)return;clearTimeout(C.t);C.t=setTimeout(cloudPush,2500);}
async function cloudPush(){
  if(ST.acct!=='cloud'||!C.db)return;
  if(C.writing){C.pending=true;return;}
  C.writing=true;
  try{await cdoc().set({st:packCloud(),upd:ST.upd||Date.now()});C.state='ok';C.last=Date.now();}
  catch(e){C.state='err';C.err=e&&e.code||'';}
  C.writing=false;refreshAcct();
  if(C.pending){C.pending=false;cloudPush();}
}
function acctLabel(){
  if(ST.acct!=='cloud')return ['Nur auf diesem Gerät','dim'];
  return ({wait:['Verbinde …','dim'],sync:['Wird abgeglichen …','dim'],slow:['Speicher antwortet noch nicht','warn'],ok:['Gesichert'+(C.last?' · '+new Date(C.last).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}):''),'ok'],err:['Sichern fehlgeschlagen','bad'],na:['Konto hier nicht verfügbar','warn'],ready:['Bereit','dim']})[C.state]||['–','dim'];
}
function refreshAcct(){document.querySelectorAll('[data-acct]').forEach(el=>{const [t,c]=acctLabel();el.textContent=t;el.className='acct '+c;});}

/* ================= KI und Vorlesen ================= */
let AI=null,TT=null;

/* ================= Lernsystem ================= */
const CAT_AREA=Object.fromEntries(CATS.filter(c=>c.area).map(c=>[c.id,c.area]));
const WCATS=['av','at','st','po'];
function lvOf(cat){return ST.lv[cat]||1;}
function adapt(cat){
  const L=ST.log.filter(e=>e.c===cat).slice(-12);if(L.length<8)return;
  const acc=L.reduce((s,e)=>s+e.o,0)/L.length;const cur=lvOf(cat);
  if(acc>=.8&&cur<3)ST.lv[cat]=cur+1;else if(acc<.5&&cur>1)ST.lv[cat]=cur-1;
}
function dueIds(){const n=Date.now();return Object.keys(ST.qs).filter(id=>{const r=ST.qs[id];return r.n>0&&r.due<=n&&QBYID[id];});}
function wrongIds(){return Object.keys(ST.qs).filter(id=>{const r=ST.qs[id];return r.w>0&&r.b<2&&QBYID[id];});}
function sureCount(ids){return (ids||Object.keys(ST.qs)).filter(id=>ST.qs[id]&&ST.qs[id].b>=3).length;}
function areaScore(a){
  const E=ST.log.filter(e=>e.a===a);if(E.length<2)return null;
  const L=E.slice(-40),acc=L.reduce((s,e)=>s+e.o,0)/L.length,cov=Math.min(1,E.length/60);
  return Math.round(100*acc*(.6+.4*cov));
}
function readiness(){const v=AREAS.map(a=>areaScore(a.id)).filter(x=>x!=null);return v.length?Math.round(v.reduce((s,x)=>s+x,0)/AREAS.length):null;}
function streak(){let n=0,d=new Date();if(!(ST.days[dk(d)]>=5))d=new Date(d-DMS);while(ST.days[dk(d)]>=5){n++;d=new Date(d-DMS);}return n;}
function daysLeft(){if(!ST.test)return null;const t=new Date(ST.test+'T08:00:00');return Math.ceil((t-new Date(dk()+'T08:00:00'))/DMS);}
function areaCount(a){return ST.log.filter(e=>e.a===a).length;}

/* Aufgaben vorbereiten */
function prepQ(q,area){
  const o=Object.assign({},q);o.area=area||CAT_AREA[o.cat]||'wissen';o.wasW=!!(o.id&&ST.qs[o.id]&&ST.qs[o.id].w>0);
  if(o.t==='mc'){const arr=mix([{h:o.c,k:1}].concat((o.w||[]).map(h=>({h,k:0}))));o.o=arr.map(x=>x.h);o.ci=arr.findIndex(x=>x.k);}
  return o;
}
const Q=(q,area)=>({k:'q',q:prepQ(q,area)});
function bankPick(cat,n){
  const all=(BANKBY[cat]||[]).slice();const now=Date.now();
  const due=mix(all.filter(q=>ST.qs[q.id]&&ST.qs[q.id].due<=now));
  const fresh_=mix(all.filter(q=>!ST.qs[q.id]));
  const rest=mix(all.filter(q=>ST.qs[q.id]&&ST.qs[q.id].due>now));
  const ord=due.concat(fresh_,rest);return n?ord.slice(0,n):ord;
}
function genPick(cat,n){const out=[];for(let i=0;i<n;i++){try{out.push(GEN[cat](lvOf(cat)));}catch(e){}}return out;}
function memoBlock(lv){const m=genME(lv||lvOf('me'));return [{k:'memo',m}].concat(m.qs.map(q=>Object.assign(Q(q,'merk'),{blk:1})));}
function sceneBlock(sc){return [{k:'scene',sc}].concat(mix(sc.qs).map(q=>({k:'q',q:prepQ(Object.assign({t:'mc',cat:'sz',lv:sc.lv},q),'merk'),sc:sc.id})));}
function passBlock(p,n){const qs=n?p.qs.slice(0,n):p.qs;return [{k:'text',p}].concat(qs.map(q=>Object.assign(Q(q,'text'),{p})));}
function nextPassage(){const fresh_=PASS.filter(p=>!ST.psg[p.id]);return any(fresh_.length?fresh_:PASS);}
function nextScene(){const s=SCENES.filter(x=>!ST.sc[x.id]);return s.length?s[0]:SCENES.slice().sort((a,b)=>(ST.sc[a.id].best||0)-(ST.sc[b.id].best||0))[0];}
function areaItems(a,n){
  n=n||10;
  if(a==='merk')return Math.random()<.5?sceneBlock(nextScene()):memoBlock().concat(memoBlock());
  if(a==='text')return passBlock(nextPassage()).concat(passBlock(nextPassage()));
  if(a==='raum')return genPick('rv',n).map(q=>Q(q,a));
  if(a==='konz')return genPick('ko',n).map(q=>Q(q,a));
  if(a==='sprache'){const k=Math.ceil(n/2);return mix(bankPick('rs',k).concat(bankPick('gr',n-k))).map(q=>Q(q,a));}
  if(a==='logik'){return mix(genPick('zr',3).concat(genPick('ab',3),bankPick('lg',2),genPick('ma',2))).map(q=>Q(q,a));}
  return [];
}
function catItems(cat){
  const isBank=!!(BANKBY[cat]&&BANKBY[cat].length)&&!CAT[cat].gen;
  if(isBank){const n=ST.round==='alle'?0:+ST.round;return bankPick(cat,n).map(q=>Q(q));}
  if(cat==='me')return memoBlock().concat(memoBlock(),memoBlock());
  return genPick(cat,ST.round==='alle'?15:+ST.round).map(q=>Q(q));
}

/* ================= Tagesplan ================= */
function plan(){
  const d=dk();
  if(!ST.plan||ST.plan.d!==d){
    const u=[];const due=dueIds().length;
    if(due)u.push({k:'due',t:'Wiederholen',s:Math.min(due,20)+' fällige Fragen'});
    const sc={};AREAS.forEach(a=>sc[a.id]=areaScore(a.id));
    const used=new Set();
    const weak=AREAS.filter(a=>sc[a.id]!=null).sort((x,y)=>sc[x.id]-sc[y.id])[0];
    if(weak){u.push({k:'area',a:weak.id,t:'Schwäche: '+SHORT[weak.id],s:'10 Aufgaben, passend zu deinem Stand'});used.add(weak.id);}
    for(const a of AREAS.slice().sort((x,y)=>areaCount(x.id)-areaCount(y.id))){if(u.length>=3)break;if(used.has(a.id))continue;u.push({k:'area',a:a.id,t:(areaCount(a.id)?'Üben: ':'Neu: ')+SHORT[a.id],s:'10 Aufgaben'});used.add(a.id);}
    ST.plan={d,u:u.slice(0,3),done:[]};save();
  }
  return ST.plan;
}
function unitItems(u){
  if(u.k==='due')return mix(dueIds()).slice(0,20).map(id=>Q(QBYID[id]));
  return areaItems(u.a);
}

/* ================= Navigation ================= */
let V={tab:'home',view:'home',arg:null,seg:'t1'};
let S=null;/* laufende Runde */
const stack=[];
function go(view,arg,keep){if(!keep)stack.push(Object.assign({},V));V.view=view;V.arg=arg;stopSpeak();render();window.scrollTo(0,0);}
function back(){const p=stack.pop();if(p){V=p;}else{V.view=V.tab;V.arg=null;}stopSpeak();render();window.scrollTo(0,0);}
function tab(t){stack.length=0;V.tab=t;V.view=t;V.arg=null;stopSpeak();render();window.scrollTo(0,0);}

/* ================= Rendering ================= */
function applyTheme(){document.documentElement.setAttribute('data-th',ST.theme||'weiss');}
function nav(){
  const t=[['home','Heute',I.home],['learn','Lernen',I.learn],['know','Wissen',I.know],['me','Profil',I.me]];
  return `<nav class="tabbar" aria-label="Hauptmenü">${t.map(([id,l,ic])=>`<button data-a="tab" data-v="${id}" class="${V.tab===id?'on':''}" ${V.tab===id?'aria-current="page"':''}>${ICO(ic)}<span>${l}</span></button>`).join('')}</nav>`;
}
function head(title,sub,backLabel){
  return `${backLabel?`<button class="back" data-a="back">${ICO(I.back,20)}<span>${H(backLabel)}</span></button>`:''}<h1 class="lt">${H(title)}</h1>${sub?`<p class="lead">${sub}</p>`:''}`;
}
function render(){
  applyTheme();
  if(!ST.onb&&!S){app.innerHTML=onbView();document.body.className='onb';return;}
  if(S){document.body.className='sess';app.innerHTML=sessView();afterSess();plRender();return;}
  document.body.className='';
  const v=V.view;let h='';
  try{
    h=({home:homeView,learn:learnView,know:knowView,me:meView,area:areaView,scenes:scenesView,passages:passView,lex:lexView,kquiz:kquizView,iv:ivView,dk:dkView,chk:chkView,sport:sportView,stats:statsView,data:dataView,result:resultView})[v]();
  }catch(e){h=`<div class="card"><b>Fehler beim Anzeigen</b><p class="sub">${H(e.message)}</p><button class="btn" data-a="tab" data-v="home">Zur Startseite</button></div>`;console.error(e);}
  app.innerHTML=`<main class="wrap">${h}</main>${nav()}`;
  refreshAcct();plRender();
}

/* ---------- Willkommen ---------- */
let OB=0;
function onbView(){
  if(OB===0)return `<div class="onbw">
   <div class="logo">${LOGO}</div>
   <div class="kick">Polizei Steiermark · Aufnahmetest</div>
   <h1 class="hero-t">Bereit für den Test. Jeden Tag ein Stück.</h1>
   <p class="lead">Ein Lernsystem, das sich merkt, was du schon kannst, und dir zeigt, was heute zählt.</p>
   <ol class="steps"><li><span>1</span>Kurze Einstufung, alle 6 Testbereiche</li><li><span>2</span>Testdatum eintragen, Plan entsteht</li><li><span>3</span>Täglich 20 Minuten, die App passt sich an</li></ol>
   <div class="grow"></div>
   <div class="stackb">
    <button class="btn dark" data-a="ob-cloud">${ICO(I.cloud,20)} Mit Konto starten</button>
    <button class="btn" data-a="ob-local">Ohne Konto starten</button>
   </div>
   <p class="fine" id="obnote">Ohne Konto bleibt alles nur auf diesem Gerät. Mit Konto wird dein Fortschritt privat gesichert und auf iPhone und PC abgeglichen, sobald du diesen Link angemeldet öffnest. Kostenlos, kein Abo.</p>
  </div>`;
  if(OB===1)return `<div class="onbw">
   <button class="back" data-a="ob-back">${ICO(I.back,20)}<span>Zurück</span></button>
   <h1 class="lt">Kurz zu dir</h1><p class="lead">Beides kannst du später im Profil ändern.</p>
   <label class="fl">Vorname<input id="obname" class="in" autocomplete="given-name" value="${H(ST.name)}" placeholder="z. B. Marco"></label>
   <label class="fl">Testtag 1 (falls bekannt)<input id="obtest" class="in" type="date" value="${H(ST.test)}"></label>
   <p class="fine left">Mit Testdatum taktet die App Wiederholungen so, dass bis zum Test alles mehrmals drankommt.</p>
   <div class="grow"></div>
   <button class="btn" data-a="ob-next">Weiter</button></div>`;
  return `<div class="onbw">
   <div class="logo">${LOGO}</div>
   <h1 class="lt">Wo stehst du gerade?</h1>
   <p class="lead">Die Einstufung dauert etwa 8 Minuten: Aufgaben aus allen 6 Testbereichen. Danach weiß die App, womit du anfangen solltest.</p>
   <div class="grow"></div>
   <div class="stackb"><button class="btn" data-a="einst">Einstufung starten</button><button class="btn ghost" data-a="ob-done">Später, direkt zur App</button></div></div>`;
}

/* ---------- Heute ---------- */
function homeView(){
  const P=plan(),dl=daysLeft(),rd=readiness(),sk=streak();
  const done=P.done.length,tot=P.u.length;const nexti=P.u.findIndex((u,i)=>!P.done.includes(i));
  const pct=tot?Math.round(100*done/tot):0;
  const d=new Date().toLocaleDateString('de-AT',{weekday:'long',day:'numeric',month:'long'});
  const hi=ST.name?'Hallo '+H(ST.name):'Hallo';
  let hero;
  if(!ST.einst)hero=`<div class="hero"><div class="hk">Erster Schritt</div><div class="hrow"><div><h2>In 8 Minuten weißt du, wo du stehst.</h2><p class="hs">Einstufung · alle 6 Testbereiche</p></div></div><div class="hact"><button class="btn light" data-a="einst">Einstufung starten</button></div></div>`;
  else hero=`<div class="hero"><div class="hrow"><div><div class="hk">Tagesplan · ${tot} Einheiten</div><h2>${nexti<0?'Alles erledigt. Stark.':'Noch '+(tot-done)+' von '+tot+', etwa '+(tot-done)*7+' Minuten'}</h2></div>
    <div class="ring" style="--p:${pct}"><b>${done}/${tot}</b></div></div>
    <div class="plist">${P.u.map((u,i)=>`<button class="pitem ${P.done.includes(i)?'done':''}" data-a="unit" data-i="${i}"><span class="pdot">${P.done.includes(i)?ICO(I.check,14):''}</span><span><b>${H(u.t)}</b><small>${H(u.s||'')}</small></span></button>`).join('')}</div>
    <div class="hact">${nexti<0?`<button class="btn light" data-a="tab" data-v="learn">Frei weiterlernen</button>`:`<button class="btn light" data-a="unit" data-i="${nexti}">Weiter lernen</button>`}</div></div>`;
  const kp=`<div class="kpis">
    <button class="kpi" data-a="go" data-v="me">${dl==null?'<b>–</b><span>Testtermin eintragen</span>':`<b>${dl<0?'vorbei':dl}</b><span>${dl===1?'Tag':'Tage'} bis Testtag 1</span>`}</button>
    <div class="kpi"><b>${rd==null?'–':rd+' %'}</b><span>Bereitschaft</span></div>
    <div class="kpi"><b>${sk}</b><span>${sk===1?'Tag':'Tage'} in Folge</span></div></div>`;
  const bars=`<div class="card"><div class="ch"><b>Testbereiche</b><button class="lnk" data-a="tab" data-v="learn">Alle</button></div>
    ${AREAS.map(a=>{const s=areaScore(a.id);return `<button class="abar" data-a="go" data-v="area" data-x="${a.id}"><span>${SHORT[a.id]}</span><span class="track"><i style="width:${s||0}%;background:${s==null?'var(--track)':s>=70?'var(--ok)':s>=50?'var(--tint)':'var(--amber)'}"></i></span><b>${s==null?'–':s}</b></button>`;}).join('')}
    <p class="fine left">Bereitschaft = Trefferquote der letzten 40 Antworten je Bereich, gewichtet nach Übungsmenge. Ab 2 Antworten, wird mit mehr Übung genauer.</p></div>`;
  const sc=nextScene();
  const scn=`<button class="scard" data-a="scene" data-x="${sc.id}"><img src="${sc.img}" alt="" loading="lazy"><span class="sct"><small>Merkfähigkeit · Tatort-Bild</small><b>${H(sc.t)}</b><span>${sc.secs} Sekunden einprägen, dann ${sc.qs.length} Fragen</span></span></button>`;
  return `<div class="hhead"><div><div class="date">${H(d)}</div><h1 class="lt">${hi}</h1></div><button class="avatar" data-a="tab" data-v="me" aria-label="Profil">${H(initials())}</button></div>${hero}${kp}${scn}${bars}
   <p class="fine left">${storeOK?'✓ Automatisch gespeichert':'⚠ Speichern im Browser nicht möglich (privates Fenster?)'} · <span data-acct></span></p>`;
}
function initials(){const n=(ST.name||'').trim();return n?n.slice(0,2).toUpperCase():'—';}

/* ---------- Lernen ---------- */
function learnView(){
  const seg=`<div class="seg" role="tablist"><button role="tab" class="${V.seg==='t1'?'on':''}" data-a="seg" data-v="t1">Testtag 1</button><button role="tab" class="${V.seg==='t2'?'on':''}" data-a="seg" data-v="t2">Testtag 2</button></div>`;
  if(V.seg==='t2')return head('Lernen')+seg+`
   <p class="lead">Psychologisches Gespräch, Diktat und die Unterlagen für den zweiten Testtag.</p>
   <div class="list">
    ${row('iv','Psychologisches Gespräch',IV.length+' typische Fragen mit Tipps'+(AI?' · KI-Feedback':''),'#0A5FC8',I.mic)}
    ${row('dk','Diktat',DIKTAT.length+' Sätze zum Vorlesen und Schreiben','#5B3FD6',I.note)}
    ${row('sport','Fitness','Ergometrie, Fitness-Check in der Ausbildung, 8-Wochen-Plan','#FF6A2B',I.trophy)}
    ${row('chk','Checklisten','Voraussetzungen und Unterlagen für Testtag 2','#2FA45A',I.check)}
   </div><p class="fine left">Maßgeblich ist immer deine Einladung und polizeikarriere.gv.at.</p>`;
  const due=dueIds().length,wr=wrongIds().length+ST.wg.length;
  return head('Lernen')+seg+`
   <div class="tiles">
    <button class="tile dark" data-a="exam">${ICO(I.clock,22)}<b>Simulation</b><span>45 Min. wie am Testtag</span></button>
    <button class="tile" data-a="due" ${due?'':'disabled'}>${ICO(I.redo,22)}<b>Wiederholen</b><span>${due?due+' fällig':'Nichts fällig'}</span></button>
    <button class="tile" data-a="wrong" ${wr?'':'disabled'}>${ICO(I.warn,22)}<b>Fehler</b><span>${wr?wr+' offen':'Keine offen'}</span></button>
   </div>
   ${ST.einst?'':`<button class="banner" data-a="einst"><b>Einstufung machen</b><span>8 Minuten, danach passt sich der Tagesplan an dich an.</span>${ICO(I.chev,18)}</button>`}
   <div class="sec">6 Testbereiche</div>
   <div class="list">${AREAS.map(a=>{const s=areaScore(a.id);const [bg,fg]=AREA_COL[a.id];return `<button class="li" data-a="go" data-v="area" data-x="${a.id}"><span class="ic" style="background:${bg};color:${fg}">${ICO(AREA_IC[a.id],20)}</span><span class="tx"><b>${H(a.t)}</b><span class="track sm"><i style="width:${s||0}%;background:${s==null?'transparent':s>=70?'var(--ok)':s>=50?'var(--tint)':'var(--amber)'}"></i></span></span><span class="val">${s==null?'–':s+' %'}</span></button>`;}).join('')}</div>`;
}
function row(v,t,s,col,ic,x){return `<button class="li" data-a="go" data-v="${v}" ${x?`data-x="${H(x)}"`:''}><span class="ic" style="background:${col};color:#fff">${ICO(ic,19)}</span><span class="tx"><b>${H(t)}</b><span class="s">${H(s)}</span></span>${ICO(I.chev,18)}</button>`;}

function areaView(){
  const a=AREA[V.arg];const s=areaScore(a.id);const [bg,fg]=AREA_COL[a.id];
  const cats=a.cats.map(id=>CAT[id]);
  let h=head(a.t,null,'Lernen')+`<div class="card arh"><span class="ic big" style="background:${bg};color:${fg}">${ICO(AREA_IC[a.id],26)}</span><div><b class="num">${s==null?'–':s+' %'}</b><span class="sub">Bereitschaft · ${areaCount(a.id)} Antworten</span></div></div>
   <button class="btn" data-a="arun" data-x="${a.id}">Gemischte Runde starten</button>`;
  if(a.id==='merk'){
    h+=`<div class="sec">Tatort-Bilder (neu)</div><div class="list">${SCENES.map(sc=>{const r=ST.sc[sc.id];return `<button class="li" data-a="scene" data-x="${sc.id}"><img class="thumb" src="${sc.img}" alt="" loading="lazy"><span class="tx"><b>${H(sc.t)}</b><span class="s">${sc.secs} s einprägen · ${sc.qs.length} Fragen${r?' · beste: '+r.best+'/'+sc.qs.length:''}</span></span>${ICO(I.chev,18)}</button>`;}).join('')}</div>
    <div class="sec">Einsatzmeldungen und Listen</div><div class="list">${row('cat','Merkfähigkeit · 3 Blöcke','Wörter, Zahlen, Zuordnungen, Einsatzmeldungen','#5B3FD6',AREA_IC.merk,'me')}</div>
    <p class="fine left">Tatort-Bilder sind Zusatztraining. Ob der echte Test genau so abfragt, ist nicht bestätigt.</p>`;
    return h;
  }
  if(a.id==='text'){
    const done=PASS.filter(p=>ST.psg[p.id]).length;
    h+=`<div class="sec">Texte · ${done} von ${PASS.length} gelesen</div><div class="list">${PASS.map(p=>`<button class="li" data-a="psg" data-x="${p.id}"><span class="ic" style="background:${ST.psg[p.id]?'var(--ok)':'var(--fill)'};color:${ST.psg[p.id]?'#fff':'var(--mute)'}">${ST.psg[p.id]?ICO(I.check,18):ICO(AREA_IC.text,18)}</span><span class="tx"><b>${H(p.title)}</b><span class="s">${p.qs.length} Fragen${ST.psg[p.id]?' · '+ST.psg[p.id].ok+'/'+p.qs.length+' richtig':''}</span></span>${ICO(I.chev,18)}</button>`).join('')}</div>`;
    return h;
  }
  h+=`<div class="sec">Themen</div><div class="list">${cats.map(c=>{const n=(BANKBY[c.id]||[]).length;const ids=(BANKBY[c.id]||[]).map(q=>q.id);
    const sub=c.gen?`${H(c.d)} · Stufe ${lvOf(c.id)}, passt sich an`:`${n} Fragen · ${sureCount(ids)} sicher`;
    return `<button class="li" data-a="go" data-v="cat" data-x="${c.id}"><span class="ic" style="background:${bg};color:${fg}">${ICO(AREA_IC[a.id],18)}</span><span class="tx"><b>${H(c.t)}</b><span class="s">${sub}</span></span>${ICO(I.chev,18)}</button>`;}).join('')}</div>
   <p class="fine left">Fragen pro Runde: ${ST.round==='alle'?'alle Fragen der Auswahl':ST.round} (änderbar im Profil).</p>`;
  return h;
}
function scenesView(){return areaView();}
function passView(){return areaView();}

/* ---------- Wissen ---------- */
function knowView(){
  const read=LEX_ALL.filter(x=>ST.lex[x.id]).length,tot=LEX_ALL.length;
  const qn={av:'Aufnahmeverfahren 2026',at:'Österreich',st:'Steiermark',po:'Polizei, Recht, Verkehr'};
  const col={av:'#0A3D8F',at:'#C8102E',st:'#2FA45A',po:'#3C3C43'};
  const nx=LEX_ALL.find(x=>!ST.lex[x.id]);
  return head('Wissen','Regeln verstehen, anhören wie ein Hörbuch, dann selbst testen.')+`
   <div class="card"><div class="ch"><b>${read} von ${tot} Seiten gelesen</b><span class="sub">${Math.round(100*read/tot)} %</span></div><span class="track"><i style="width:${Math.round(100*read/tot)}%;background:var(--tint)"></i></span>
   ${nx?`<button class="btn" data-a="go" data-v="lex" data-x="${nx.id}" style="margin-top:12px">Weiterlesen: ${H(nx.t)}</button>`:''}</div>
   <div class="sec">Grundwissen-Quiz</div>
   <div class="qgrid">${WCATS.map(c=>{const ids=(BANKBY[c]||[]).map(q=>q.id);return `<button class="qcard" data-a="cat" data-x="${c}"><span class="qb" style="background:${col[c]}"></span><b>${qn[c]}</b><span>${ids.length} Fragen · ${sureCount(ids)} sicher</span></button>`;}).join('')}</div>
   ${LEX.map((g,gi)=>{const T=TOP[gi]||{c:'#0A5FC8',t:g.g};const r=g.items.filter(x=>ST.lex[x.id]).length;return `<div class="sec">${H(T.t)} · ${r}/${g.items.length}</div>${T.lead?`<p class="sub pad">${H(T.lead)}</p>`:''}<div class="list">${g.items.map(x=>`<button class="li" data-a="go" data-v="lex" data-x="${x.id}"><span class="ic" style="background:${ST.lex[x.id]?'var(--ok)':T.c};color:#fff">${ST.lex[x.id]?ICO(I.check,18):ICO(I.know,18)}</span><span class="tx"><b>${H(x.t)}</b><span class="s">${H(x.d||'')}${hbHas('w-'+x.id)?' · Hörbuch':''}</span></span>${ICO(I.chev,18)}</button>`).join('')}</div>`;}).join('')}`;
}
const mkB=s=>H(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
/* Seite aufbauen: jede vorgelesene Zeile bekommt ihre Nummer (passt zu lexSpeech und zu den Hörbuch-Zeitmarken) */
function lexBody(x,start){
  let h='',si=start,ul=[],tb=[];const sp=(tag,inner,cls)=>`<${tag} class="sp ${cls||''}" data-s="${si++}">${inner}</${tag}>`;
  const flUl=()=>{if(ul.length){h+=`<ul class="lx">${ul.join('')}</ul>`;ul=[];}};
  const flTb=()=>{if(tb.length){h+=`<div class="tbw"><table class="tb">${tb.join('')}</table></div>`;tb=[];}};
  for(const l of x.b||[]){
    if(l.startsWith('|')){flUl();const c=l.split('|').slice(1,-1).map(t=>t.trim());
      if(!tb.length)tb.push(`<tr>${c.map(t=>`<th>${mkB(t)}</th>`).join('')}</tr>`);else tb.push(`<tr class="sp" data-s="${si++}">${c.map(t=>`<td>${mkB(t)}</td>`).join('')}</tr>`);continue;}
    flTb();
    if(l.startsWith('•')){ul.push(sp('li',mkB(l.replace(/^•\s*/,''))));continue;}
    flUl();
    if(l.startsWith('# '))h+=sp('h3',mkB(l.slice(2)),'lxh');
    else if(l.startsWith('> '))h+=sp('div',mkB(l.slice(2)),'merke');
    else if(l.startsWith('ex:'))h+=`<div class="ex"><small>Beispiel</small>${sp('span',mkB(l.slice(3).trim()))}</div>`;
    else h+=sp('p',mkB(l));
  }
  flUl();flTb();return {h,next:si};
}
let LQS={};
function lexView(){
  const x=LEXI[V.arg];if(!x)return head('Nicht gefunden',null,'Wissen');
  const gi=LEX.findIndex(g=>g.items.includes(x)),T=TOP[gi]||{c:'#0A5FC8',t:x.g},E=LX[x.id]||{},col=E.c||T.c;
  const L=LEX[gi].items,i=L.indexOf(x),min=Math.max(1,Math.round((x.b||[]).join(' ').split(/\s+/).length/170));
  let si=0;const t0=`<h1 class="lt sp" data-s="${si++}">${H(x.t)}</h1>`;
  const kk=E.k?`<div class="kbox sp" data-s="${si++}" style="--c:${col}"><small>In 30 Sekunden</small>${mkB(E.k)}</div>`:'';
  const body=lexBody(x,si);si=body.next;
  const es=E.m?`<div class="esel sp" data-s="${si++}"><small>Eselsbrücke</small>${mkB(E.m)}</div>`:'';
  let fig='';try{if(FIG[x.id])fig=`<div class="card figc">${FIG[x.id]()}</div>`;}catch(e){}
  const cat=CAT[x.cat];const hb=hbHas('w-'+x.id);
  const qs=E.q||[];const st=LQS[x.id]||{};
  const quiz=qs.length?`<div class="sec">Selbsttest · ${qs.length} Fragen</div>${qs.map((q,qi)=>{const a=st[qi];return `<div class="card lq"><b>${H(q[0])}</b><div class="lqo">${q[1].map((o,oi)=>{const c=a==null?'':oi===q[2]?'ok':oi===a?'bad':'';return `<button class="opt sm ${c}" data-a="lq" data-i="${qi}" data-o="${oi}" ${a!=null?'disabled':''}>${H(o)}${c==='ok'?'<span class="mk">✓</span>':c==='bad'?'<span class="mk">✕</span>':''}</button>`;}).join('')}</div></div>`;}).join('')}${Object.keys(st).length===qs.length?`<p class="sub pad"><b>${qs.filter((q,qi)=>st[qi]===q[2]).length} von ${qs.length} richtig.</b> <button class="lnk" data-a="lqreset">Nochmal</button></p>`:''}`:'';
  return `<button class="back" data-a="back">${ICO(I.back,20)}<span>Wissen</span></button>
   <div class="lxhero" style="--c:${col}"><small>${H(T.t)} · ca. ${min} Min.${ST.lex[x.id]?' · ✓ gelesen':''}</small>${t0.replace('class="lt sp"','class="sp"')}<p>${H(x.d||'')}</p></div>
   <div class="tools"><button class="pill" data-a="readlex">${ICO(I.spk,18)} ${hb&&ST.tts.eng==='hb'?'Als Hörbuch anhören':'Vorlesen'}</button>${cat?`<button class="pill" data-a="cat" data-x="${cat.id}">${ICO(I.learn,18)} Dazu üben</button>`:''}</div>
   <div id="reader">${kk}${fig}<article class="card reader">${body.h}</article>${es}</div>
   ${quiz}
   <button class="btn ${ST.lex[x.id]?'alt':''}" data-a="lexread" data-x="${x.id}">${ST.lex[x.id]?'✓ Gelesen (zurücknehmen)':'Als gelesen markieren'}</button>
   <div class="pnav">${i>0?`<button class="pill" data-a="go" data-v="lex" data-x="${L[i-1].id}">‹ ${H(L[i-1].t)}</button>`:'<span></span>'}${i<L.length-1?`<button class="pill" data-a="go" data-v="lex" data-x="${L[i+1].id}">${H(L[i+1].t)} ›</button>`:''}</div>`;
}
function kquizView(){return knowView();}

/* ---------- Testtag 2 ---------- */
function ivView(){
  const done=IV.filter((_,i)=>ST.iv[i]).length;
  let last='';
  return head('Psychologisches Gespräch',`${done} von ${IV.length} geübt. Laut antworten, 1–2 Minuten pro Frage.`,'Lernen')+IV.map((x,i)=>{const g=x[0]!==last?`<div class="sec">${H(x[0])}</div>`:'';last=x[0];
    return g+`<div class="card ivc ${ST.iv[i]?'done':''}"><b class="ivq">${H(x[1])}</b>
    <details><summary>Tipp anzeigen</summary><p class="sub">${H(x[2])}</p></details>
    ${AI&&ST.ki?`<details class="kid"><summary>Meine Antwort von der KI prüfen lassen</summary><textarea class="in ta" id="iva${i}" rows="4" placeholder="Schreib deine Antwort in Stichworten oder ganz …"></textarea><button class="btn sm" data-a="ivai" data-i="${i}">Feedback holen</button><div class="aiout" id="ivo${i}" aria-live="polite"></div></details>`:''}
    <div class="row"><button class="pill" data-a="say" data-t="${H(x[1])}">${ICO(I.spk,18)} Vorlesen</button><button class="pill ${ST.iv[i]?'on':''}" data-a="ivdone" data-i="${i}">${ICO(I.check,18)} ${ST.iv[i]?'Geübt':'Als geübt markieren'}</button></div></div>`;}).join('');
}
let DK={i:0,res:null};
function dkView(){
  const s=DIKTAT[DK.i%DIKTAT.length];
  return head('Diktat',`Satz ${DK.i%DIKTAT.length+1} von ${DIKTAT.length} · bisher ${ST.dk.ok}/${ST.dk.n} fehlerfrei. Hör zu und schreib den Satz genau mit.`,'Lernen')+`
   <div class="card"><button class="btn" data-a="dksay">${ICO(I.spk,20)} Satz vorlesen</button>
   <textarea class="in ta" id="dkin" rows="3" autocapitalize="sentences" spellcheck="false" placeholder="Hier schreiben …" ${DK.res?'disabled':''}></textarea>
   ${DK.res?`<div class="fb ${DK.res.ok?'ok':'bad'}"><b>${DK.res.ok?'Fehlerfrei!':'Nicht ganz.'}</b><div class="dkcmp">${DK.res.html}</div><p class="sub"><b>Richtig:</b> ${H(s[0])}</p><p class="sub">${H(s[1])}</p></div><button class="btn" data-a="dknext">Nächster Satz</button>`:`<button class="btn dark" data-a="dkcheck">Prüfen</button>`}</div>`;
}
function dkCompare(a,b){
  const wa=a.trim().split(/\s+/),wb=b.trim().split(/\s+/);let ok=wa.length===wb.length;
  const html=wb.map((w,i)=>{const g=wa[i]||'';const same=g===w;if(!same)ok=false;return same?`<span class="w ok">${H(w)}</span>`:`<span class="w bad" title="${H(g)}">${H(g||'∅')} → ${H(w)}</span>`;}).join(' ');
  return {ok,html};
}
function sportView(){
  const sp=ST.sp||{},pu=+sp.pu||0;const m=/^(\d{1,2}):([0-5]\d)$/.exec(String(sp.run||'').trim());const run=m?(+m[1])*60+(+m[2]):null;
  const lvl=(v,g,l,lower)=>!v?'':(lower?(v<=l?'Leistungsstufe erreicht':v<=g?'Grundstufe erreicht':'noch unter der Grundstufe'):(v>=l?'Leistungsstufe erreicht':v>=g?'Grundstufe erreicht':'noch unter der Grundstufe'));
  const plan=[['Woche 1–2','3× 25–30 min locker laufen oder Rad fahren (du kannst dabei noch sprechen). Liegestütze jeden 2. Tag: 3 Sätze mit je 60–70 % deines Maximums.'],['Woche 3–5','1× Intervalle: 6× 400 m zügig, je 2 min gehen. 1× 35–45 min locker. 1× 2–3 km im geplanten 3.000-m-Tempo. Liegestütze: 4 Sätze, pro Woche 1–2 Wiederholungen mehr.'],['Woche 6–8','Wie Woche 3–5, dazu alle 2 Wochen ein 3.000-m-Test und ein Liegestütz-Test. Werte oben eintragen.'],['Vor Testtag 2','Letzte 2 Tage nur locker, ausgeschlafen kommen. Für die Ergometrie hilft regelmäßiges Radfahren.']];
  return head('Fitness',null,'Lernen')+`<div class="card"><b>Was offiziell gilt (Stand November 2026)</b><ul class="lx">
   <li>Im Aufnahmeverfahren gibt es <b>keinen eigenen Sporttest</b>. Die Belastbarkeit wird am Testtag 2 bei der ärztlichen Untersuchung mit einer <b>Fahrradergometrie</b> geprüft.</li>
   <li>In der Grundausbildung folgt ein <b>Fitness-Check</b>. Männer 18–29: <b>15 Liegestütze</b> (Grundstufe), 21 (Leistungsstufe), dazu eine Ausdauerdisziplin nach Wahl: <b>3.000 m Lauf in 15:15 min</b> (Grundstufe), 13:45 min (Leistungsstufe), oder 20 km Radfahren oder 300 m Schwimmen.</li>
   <li>Ein Schwimmabzeichen brauchst du nicht, aber Schwimmen können musst du. Das wird in der Ausbildung geprüft.</li></ul>
   <p class="fine left">Quelle: polizeikarriere.gv.at (Bewerbung, FAQ, Karriere). Werte für Frauen und andere Altersgruppen stehen dort.</p></div>
   <div class="card"><b>Meine Werte</b>
   <label class="fl">Liegestütze am Stück (sauber)<input class="in" id="sppu" type="number" inputmode="numeric" min="0" max="200" value="${pu||''}"></label>${pu?`<p class="sub">${lvl(pu,15,21)}</p>`:''}
   <label class="fl">3.000 m Zeit (mm:ss)<input class="in" id="sprun" inputmode="numeric" placeholder="z. B. 14:30" autocomplete="off" value="${H(sp.run||'')}"></label>${run!=null?`<p class="sub">${lvl(run,15*60+15,13*60+45,true)}</p>`:sp.run?'<p class="sub">Bitte als Minuten:Sekunden eingeben, z. B. 14:30.</p>':''}</div>
   <div class="card"><b>8-Wochen-Plan</b><p class="sub">3 Ausdauer- und 3 Kraft-Einheiten pro Woche.</p>${plan.map(([a,b])=>`<div class="srow pl"><b>${a}</b><span>${b}</span></div>`).join('')}
   <p class="fine left">Allgemeiner Trainingsvorschlag, kein ärztlicher Rat. Bei Schmerzen oder Beschwerden pausieren und ärztlich abklären lassen.</p></div>`;
}
function chkView(){
  const box=(k,t)=>`<button class="cbrow ${ST.chk[k]?'on':''}" data-a="chk" data-x="${H(k)}" role="checkbox" aria-checked="${!!ST.chk[k]}"><span class="cbk">${ST.chk[k]?'✓':''}</span><span>${H(t)}</span></button>`;
  return head('Checklisten',null,'Lernen')+`<div class="sec">Voraussetzungen</div><div class="card">${CHK_VOR.map(([k,t])=>box('v_'+k,t)).join('')}</div>
   <div class="sec">Unterlagen für Testtag 2</div><div class="card">${CHK_T2.map(([k,t])=>box('t_'+k,t)).join('')}</div><p class="fine left">Maßgeblich ist deine Einladung.</p>`;
}

/* ---------- Profil ---------- */
function meView(){
  const [al,ac]=acctLabel();const dl=daysLeft();
  const totalA=ST.log.length,sure=sureCount();
  const bd=badges();
  const eng=ST.tts.eng==='auto'&&!TT?'device':ST.tts.eng;
  const engs=[['hb','Hörbuch']].concat(TT?[['auto','Claude']]:[],[['device','Gerät']]);
  const voices=`<div class="frow"><div><b>Stimme</b><small>${eng==='hb'?'Vorab gesprochen, läuft auch bei gesperrtem Handy. Fragen liest '+(TT?'Claude':'das Gerät')+'.':eng==='auto'?'Natürliche Claude-Stimme':'Stimme des Geräts'}</small></div>
      <div class="seg sm">${engs.map(([v,l])=>`<button class="${eng===v?'on':''}" data-a="set" data-k="tts.eng" data-v="${v}">${l}</button>`).join('')}</div></div>`;
  const cv=eng==='auto'?`<div class="frow"><div><b>Claude-Stimme</b></div><div class="seg sm">${[['buttery','Warm'],['airy','Hell'],['glassy','Klar'],['rounded','Tief']].map(([v,l])=>`<button class="${ST.tts.cv===v?'on':''}" data-a="set" data-k="tts.cv" data-v="${v}">${l}</button>`).join('')}</div></div>`:
   `<div class="frow"><div><b>${eng==='hb'?'Hörbuch-Stimme':'Gerätestimme'}</b></div><div class="seg sm"><button class="${ST.tts.sex==='w'?'on':''}" data-a="set" data-k="tts.sex" data-v="w">Weiblich</button><button class="${ST.tts.sex==='m'?'on':''}" data-a="set" data-k="tts.sex" data-v="m">Männlich</button></div></div>`;
  return head('Profil')+`
   <div class="card prof"><div class="avatar xl">${H(initials())}</div><div><b class="pn">${H(ST.name||'Ohne Namen')}</b><span class="sub">Ziel: Polizei Steiermark</span><span data-acct class="acct ${ac}">${H(al)}</span></div></div>
   <div class="card">
    <div class="ch"><b>Konto</b></div>
    ${ST.acct==='cloud'?`<p class="sub">Dein Fortschritt wird privat in deinem Claude-Konto gesichert. Öffnest du diesen Link am PC oder iPhone angemeldet, ist alles da. Niemand sonst sieht deine Daten.</p><div class="row"><button class="btn sm alt" data-a="sync">Jetzt abgleichen</button><button class="btn sm ghost" data-a="acct-off">Nur noch auf diesem Gerät</button></div>`
    :`<p class="sub">Gerade bleibt alles nur auf diesem Gerät. Mit Konto wird dein Fortschritt gesichert und geräteübergreifend abgeglichen.</p><button class="btn sm" data-a="acct-on" ${C.state==='na'?'disabled':''}>${ICO(I.cloud,18)} Mit Konto sichern</button>${C.state==='na'?'<p class="fine left">Konto ist nur verfügbar, wenn du diesen Link in Claude angemeldet öffnest. Daten übertragen geht immer über „Sichern und übertragen“.</p>':''}`}
   </div>
   <div class="card">
    <div class="ch"><b>Ziel</b></div>
    <label class="fl">Vorname<input class="in" id="pname" value="${H(ST.name)}" data-a="pname"></label>
    <label class="fl">Testtag 1<input class="in" type="date" id="ptest" value="${H(ST.test)}" data-a="ptest"></label>
    <p class="sub">${dl==null?'Kein Testdatum eingetragen.':dl<0?'Der Testtag liegt in der Vergangenheit.':'Noch '+dl+' Tage.'}</p>
   </div>
   <div class="sec">Fortschritt</div>
   <div class="kpis"><div class="kpi"><b>${totalA}</b><span>Antworten</span></div><div class="kpi"><b>${sure}</b><span>Fragen sicher</span></div><div class="kpi"><b>${streak()}</b><span>Tage in Folge</span></div></div>
   <div class="list">${row('stats','Statistik','Je Testbereich, letzte 14 Tage, Simulationen','#0A5FC8',I.learn)}</div>
   <div class="sec">Abzeichen · ${bd.filter(b=>b.on).length} von ${bd.length}</div>
   <div class="badges">${bd.map(b=>`<div class="bdg ${b.on?'on':''}">${ICO(I.trophy,22)}<b>${H(b.t)}</b><small>${H(b.d)}</small></div>`).join('')}</div>
   <div class="sec">Einstellungen</div>
   <div class="card">
    <div class="frow"><div><b>Helligkeit</b><small>Standard: Weiß</small></div><div class="seg sm">${[['weiss','Weiß'],['hell','Hell'],['dunkel','Dunkel'],['schwarz','Schwarz']].map(([v,l])=>`<button class="${ST.theme===v?'on':''}" data-a="set" data-k="theme" data-v="${v}">${l}</button>`).join('')}</div></div>
    ${voices}${cv}
    <div class="frow"><div><b>Vorlese-Tempo</b><small id="rtv">${String(ST.tts.rate).replace('.',',')}×${eng==='auto'?' (Claude-Stimme: 0,7–1,5×)':''}</small></div><input type="range" min="0.5" max="2" step="0.1" value="${ST.tts.rate}" class="range" data-a="rate" aria-label="Vorlese-Tempo"></div>
    <div class="frow"><div><b>Mitlesen markieren</b><small>Aktueller Satz wird hervorgehoben</small></div>${sw('tts.hl',ST.tts.hl)}</div>
    <div class="frow"><div><b>KI-Coach</b><small>${AI?'Erklärt Fehler, beantwortet Fragen':'In diesem Fenster nicht verfügbar'}</small></div>${sw('ki',ST.ki)}</div>
    <div class="frow"><div><b>Fragen pro Runde</b><small>Bei Themen und Wissen-Quiz</small></div><div class="seg sm">${[['alle','Alle'],['20','20'],['10','10']].map(([v,l])=>`<button class="${ST.round===v?'on':''}" data-a="set" data-k="round" data-v="${v}">${l}</button>`).join('')}</div></div>
   </div>
   <div class="list">${row('data','Sichern und übertragen','Code kopieren, auf anderem Gerät einfügen','#6C6C70',I.cloud)}</div>
   <button class="btn ghost danger" data-a="reset">Alle Daten auf diesem Gerät löschen</button>
   <p class="fine left">Inoffizielle Übungs-App mit selbst geschriebenen und erzeugten Aufgaben. Nicht vom Innenministerium oder der Polizei. Kein Abo, keine Werbung.</p>`;
}
function sw(k,on){return `<button class="sw" role="switch" aria-checked="${!!on}" data-a="tog" data-k="${k}"><span class="swt"><span class="swk"></span></span></button>`;}
function badges(){
  const tot=ST.log.length,sc=Object.keys(ST.sc).length;
  return [
   {t:'Erster Schritt',d:'Einstufung gemacht',on:!!ST.einst},
   {t:'100 Antworten',d:'Dranbleiben zahlt sich aus',on:tot>=100},
   {t:'500 Antworten',d:'Echte Routine',on:tot>=500},
   {t:'7 Tage Serie',d:'Eine Woche täglich',on:streak()>=7},
   {t:'Fotogedächtnis',d:'Alle 6 Tatort-Bilder',on:sc>=6},
   {t:'Testreif',d:'Simulation ab 70 %',on:ST.ex.some(e=>e.p>=70)}
  ];
}
function statsView(){
  const days=[];for(let i=13;i>=0;i--){const d=new Date(Date.now()-i*DMS);days.push([d,ST.days[dk(d)]||0]);}
  const mx=Math.max(10,...days.map(x=>x[1]));
  return head('Statistik',null,'Profil')+`
   <div class="card"><div class="ch"><b>Letzte 14 Tage</b><span class="sub">${days.reduce((s,x)=>s+x[1],0)} Antworten</span></div>
   <div class="bars" role="img" aria-label="Antworten pro Tag">${days.map(([d,n])=>`<div class="bc"><i style="height:${Math.round(100*n/mx)}%"></i><small>${d.toLocaleDateString('de-AT',{weekday:'narrow'})}</small></div>`).join('')}</div></div>
   <div class="card"><table class="tb st"><tr><th>Bereich</th><th>Antw.</th><th>Quote</th><th>Bereit</th></tr>${AREAS.map(a=>{const E=ST.log.filter(e=>e.a===a.id);const q=E.length?Math.round(100*E.reduce((s,e)=>s+e.o,0)/E.length):null;const s=areaScore(a.id);return `<tr><td>${SHORT[a.id]}</td><td>${E.length}</td><td>${q==null?'–':q+' %'}</td><td><b>${s==null?'–':s+' %'}</b></td></tr>`;}).join('')}</table></div>
   <div class="sec">Simulationen</div>${ST.ex.length?`<div class="card">${ST.ex.slice().reverse().slice(0,10).map(e=>`<div class="srow"><span>${new Date(e.t).toLocaleDateString('de-AT')}</span><b>${e.ok}/${e.n} · ${e.p} %</b></div>`).join('')}</div>`:'<p class="sub pad">Noch keine Simulation gemacht.</p>'}`;
}
function dataView(){
  return head('Sichern und übertragen','Kopiere den Code und füge ihn auf dem anderen Gerät hier wieder ein. Funktioniert auch ohne Konto.','Profil')+`
   <div class="card"><div class="ch"><b>1. Code von diesem Gerät</b></div><textarea class="in ta mono" id="excode" rows="4" readonly>${H(btoa(unescape(encodeURIComponent(JSON.stringify(ST)))))}</textarea><button class="btn sm" data-a="copy">Code kopieren</button></div>
   <div class="card"><div class="ch"><b>2. Code einfügen</b></div><textarea class="in ta mono" id="imcode" rows="4" placeholder="Code hier einfügen …"></textarea><button class="btn sm alt" data-a="import">Übernehmen</button><p class="fine left">Ersetzt den Stand auf diesem Gerät.</p></div>`;
}

/* ================= Runde (Session) ================= */
function start(title,items,mode,meta){
  items=items.filter(Boolean);if(!items.length){toast('Gerade keine Aufgaben verfügbar.');return;}
  stopSpeak();
  S={title,items,i:0,mode:mode||'learn',meta:meta||{},res:[],ans:false,given:null,t0:Date.now(),end:mode==='exam'?Date.now()+EXAM_MIN*60000:0,zoom:false};
  const it=S.items[0];if(it.k==='scene'||it.k==='memo')S.stud=Date.now()+(it.k==='scene'?it.sc.secs:it.m.secs)*1000;
  render();window.scrollTo(0,0);startTick();
}
let tick=null;
function startTick(){clearInterval(tick);tick=setInterval(()=>{
  if(!S){clearInterval(tick);return;}
  if(S.end){const r=Math.max(0,S.end-Date.now());const el=document.getElementById('clk');if(el)el.textContent=mmss(r/1000);if(el)el.classList.toggle('low',r<300000);if(r<=0){finish();return;}}
  const it=S.items[S.i];
  if(it&&(it.k==='scene'||it.k==='memo')&&S.stud){const r=Math.max(0,S.stud-Date.now());const el=document.getElementById('stud');if(el){el.textContent=mmss(Math.ceil(r/1000));const b=document.getElementById('studbar');if(b)b.style.width=(100*r/((it.k==='scene'?it.sc.secs:it.m.secs)*1000))+'%';}if(r<=0){S.stud=0;nextItem();}}
},250);}
const mmss=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function qCount(){return S.items.filter(x=>x.k==='q').length;}
function qIndex(){return S.items.slice(0,S.i+1).filter(x=>x.k==='q').length;}
function sessHead(){
  const n=qCount(),k=Math.min(n,qIndex());
  return `<div class="shead"><button class="cbtn" data-a="quit" aria-label="Runde beenden">${ICO(I.x,18)}</button><div class="track lg"><i style="width:${n?Math.max(0,Math.round(100*(k-(S.ans?0:1))/n)):0}%"></i></div><span class="cnt">${k}/${n}</span>${S.end?`<span class="clk" id="clk">${mmss((S.end-Date.now())/1000)}</span>`:''}</div>`;
}
function sessView(){
  const it=S.items[S.i];
  if(it.k==='scene'){const sc=it.sc;return `<div class="sw2">${sessHead()}<div class="kick">Merkfähigkeit · ${H(S.title)}</div><h2 class="st2">Präg dir das Bild genau ein</h2>
    <p class="sub">Danach kommen ${sc.qs.length} Fragen ohne Bild. Achte auf Uhrzeiten, Schilder, Farben, Personen und Gegenstände.</p>
    <button class="scimg" data-a="zoom" aria-label="Bild vergrößern"><img src="${sc.img}" alt="Tatort-Bild: ${H(sc.t)}"><span class="zb">${ICO(I.zoom,18)}</span></button>
    <div class="studt"><span class="track"><i id="studbar" style="width:100%"></i></span><b id="stud">${mmss(sc.secs)}</b></div>
    <button class="btn dark" data-a="next">Ich bin bereit</button>${S.zoom?`<div class="zov" data-a="zoom"><img src="${sc.img}" alt=""><span class="fine">Tippen zum Schließen</span></div>`:''}</div>`;}
  if(it.k==='memo'){return `<div class="sw2">${sessHead()}<div class="kick">Merkfähigkeit</div><h2 class="st2">Einprägen</h2><p class="sub">Danach kommen die Fragen, ohne diese Liste.</p>
    <div class="card memo">${it.m.memo}</div><div class="studt"><span class="track"><i id="studbar" style="width:100%"></i></span><b id="stud">${mmss(it.m.secs)}</b></div><button class="btn dark" data-a="next">Fertig, zu den Fragen</button></div>`;}
  if(it.k==='text'){const p=it.p;return `<div class="sw2">${sessHead()}<div class="kick">Textverständnis</div><h2 class="st2">${H(p.title)}</h2>
    <div class="tools"><button class="pill" data-a="readtxt">${ICO(I.spk,18)} Vorlesen</button></div>
    <article class="card reader" id="reader">${sentHtml(p.text)}</article><button class="btn dark" data-a="next">Zu den ${p.qs.length} Fragen</button></div>`;}
  const q=it.q,a=S.ans,ex=S.mode==='exam';
  const tag=q.tg||q.tag||(CAT[q.cat]&&CAT[q.cat].t)||'';
  const srsW=q.wasW;
  let opts='';
  if(q.t==='mc'){
    opts=`<div class="opts ${q.oh?'oh':''}">${q.o.map((o,i)=>{let c='';if(a&&!ex){if(i===q.ci)c='ok';else if(i===S.given)c='bad';}else if(a&&i===S.given)c='sel';
      return `<button class="opt ${c}" data-a="pick" data-i="${i}" ${a?'disabled':''}><span class="lab">${'ABCDEF'[i]}</span><span class="ot">${q.oh?o:H(o)}</span>${c==='ok'?'<span class="mk">✓</span>':c==='bad'?'<span class="mk">✕</span>':''}</button>`;}).join('')}</div>`;
  }else{
    opts=`<form class="inrow" data-a="numform"><input id="ans" class="in big ${a&&!ex?(S.okk?'ok':'bad'):''}" ${q.t==='num'?'inputmode="decimal"':'autocapitalize="off" spellcheck="false"'} autocomplete="off" placeholder="Antwort" value="${a?H(S.given):''}" ${a?'disabled':''} aria-label="Antwort">${a?'':'<button class="btn" type="submit">Prüfen</button>'}</form>`;
  }
  const passage=it.p?`<details class="card psum"><summary>Text nochmal anzeigen</summary><div class="ptx">${H(it.p.text)}</div></details>`:'';
  return `<div class="sw2">${sessHead()}
   <div class="chips"><span class="chip" style="background:${(AREA_COL[q.area]||['var(--fill)'])[0]};color:${(AREA_COL[q.area]||[0,'var(--ink)'])[1]}">${H(SHORT[q.area]||'Wissen')}${tag?' · '+H(tag):''}</span>${srsW&&!ex?'<span class="chip warnc">Kommt wieder: war falsch</span>':''}</div>
   ${passage}${q.fig?`<div class="fig">${q.fig}</div>`:''}
   ${qText(q)}
   ${opts}
   ${a&&!ex?feedback(it):''}
   <div class="qfoot">${a?'':`<button class="rbtn" data-a="sayq" aria-label="Frage vorlesen">${ICO(I.spk,20)}</button>`}${a?`<button class="btn dark wide" data-a="next">${S.i>=S.items.length-1?'Auswertung':'Weiter'}</button>`:(q.t==='mc'?'<span class="fine">Tippe auf eine Antwort</span>':'')}</div></div>`;
}
function qText(q){
  const t=String(q.q);
  if(q.mono&&t.includes('\n')){const i=t.indexOf('\n');return `<h2 class="qt">${H(t.slice(0,i))}</h2><div class="seq">${H(t.slice(i+1).trim())}</div>`;}
  return `<h2 class="qt ${t.length>160?'long':''}">${H(t)}</h2>`;
}
function rightAns(q){if(q.t==='mc')return q.oh?q.o[q.ci]:H(q.o[q.ci]);if(q.t==='num')return H(fmt(q.ans));return H((q.ans||[])[0]);}
function feedback(it){
  const q=it.q;let mark='';try{if(q.mk)mark=markHtml(q,S.given);}catch(e){}
  const nid=q.id||('h'+hashS(q.q));const note=ST.notes[nid]||'';
  const link=q.nurl&&/^https:\/\//.test(q.nurl)?` · <a href="${H(q.nurl)}" target="_blank" rel="noopener">im RIS</a>`:'';
  return `<div class="fb ${S.okk?'ok':'bad'}" tabindex="-1" id="fb"><b class="vd">${S.okk?ICO(I.check,20)+' Richtig':ICO(I.x,20)+' Leider falsch'}</b>
   ${S.okk?'':`<div class="ra"><small>Richtige Antwort</small><div>${rightAns(q)}</div></div>`}
   ${q.e?`<p class="exp">${H(q.e)}</p>`:''}${mark?`<div class="mark">${mark}</div>`:''}${q.norm?`<p class="fine left"><b>Rechtsgrundlage:</b> ${H(q.norm)}${link}</p>`:''}
   ${q.id&&!S.okk?'<p class="fine left">Diese Frage kommt bald wieder. Richtig beantwortet, dann nach 1, 3, 7, 14 und 30 Tagen.</p>':q.id?`<p class="fine left">Nächste Wiederholung in ${BOXD[(ST.qs[q.id]||{b:1}).b]||1} ${BOXD[(ST.qs[q.id]||{b:1}).b]===1?'Tag':'Tagen'}.</p>`:''}</div>
   <details class="acc" ${S.kiOpen?'open':''}><summary>${ICO(I.spark,18)}<span>KI-Coach fragen</span><i class="arr">${ICO(I.chev,16)}</i></summary><div class="accb">
    ${AI&&ST.ki?`<div class="qk"><button class="pill" data-a="ki" data-v="einfach">Einfacher erklären</button><button class="pill" data-a="ki" data-v="merk">Merksatz</button><button class="pill" data-a="ki" data-v="aehnlich">Ähnliche Aufgabe</button></div>
     <div class="inrow"><input class="in" id="kiin" placeholder="Eigene Frage zur Aufgabe …"><button class="btn sm" data-a="ki" data-v="frei">Fragen</button></div><div class="aiout" id="kiout" aria-live="polite"></div>`:`<p class="sub">${ST.ki?'Der eingebaute KI-Coach ist nur im Claude-Link verfügbar.':'KI-Coach ist im Profil ausgeschaltet.'}</p>`}
    <div class="row"><button class="pill" data-a="extai" data-v="chatgpt">In ChatGPT öffnen</button><button class="pill" data-a="extai" data-v="claude">In Claude öffnen</button></div></div></details>
   <details class="acc"><summary>${ICO(I.note,18)}<span>Notiz${note?' (1)':''}</span><i class="arr">${ICO(I.chev,16)}</i></summary><div class="accb"><textarea class="in ta" id="note" data-nid="${H(nid)}" rows="3" placeholder="Was will ich mir merken?">${H(note)}</textarea></div></details>`;
}
function hashS(s){let h=0;s=String(s);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return (h>>>0).toString(36);}
function sentHtml(t){return `<p class="ptx2">${splitSent(t).map((x,i)=>`<span class="sp" data-s="${i}">${H(x)}</span>`).join('')}</p>`;}
function parseN(s){s=String(s).trim().replace(/\s/g,'').replace(/−/g,'-').replace(/€|%|cm|km|kg|m$/g,'');if(/^-?\d+\/\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b?a/b:NaN;}s=s.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.');return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)?parseFloat(s):NaN;}
const nrm=s=>String(s).trim().normalize('NFC').replace(/\s+/g,' ');
function isOk(q,g){
  if(q.t==='mc')return g===q.ci;
  if(q.t==='num'){const v=parseN(g);return Number.isFinite(v)&&Math.abs(v-q.ans)<=1e-6*Math.max(1,Math.abs(q.ans));}
  if(q.t==='text')return (q.ans||[]).some(a=>nrm(a)===nrm(g));
  return false;
}
function answer(g){
  if(!S||S.ans)return;const it=S.items[S.i],q=it.q;
  if(q.t!=='mc'&&String(g).trim()===''){toast('Bitte zuerst eine Antwort eingeben.');return;}
  const ok=isOk(q,g);S.ans=true;S.given=g;S.okk=ok;S.kiOpen=false;
  S.res.push({q,ok,g,sc:it.sc,p:it.p&&it.p.id});
  record(q,ok,it);
  try{navigator.vibrate&&navigator.vibrate(ok?15:[30,40,30]);}catch(e){}
  if(S.mode==='exam'){nextItem();return;}
  render();
  const f=document.getElementById('fb');if(f){f.focus({preventScroll:true});f.scrollIntoView({behavior:'smooth',block:'nearest'});}
}
function record(q,ok,it){
  ST.log.push({t:Date.now(),a:q.area,c:q.cat,o:ok?1:0});if(ST.log.length>1500)ST.log.splice(0,ST.log.length-1500);
  ST.days[dk()]=(ST.days[dk()]||0)+1;
  if(q.id&&QBYID[q.id]){const r=ST.qs[q.id]||{b:0,n:0,w:0};r.n++;if(ok){r.b=Math.min(5,r.b+1);r.due=Date.now()+BOXD[r.b]*DMS;}else{r.b=0;r.w++;r.due=Date.now()+DMS/2;}ST.qs[q.id]=r;}
  else if(!q.id&&q.cat!=='sz'){if(!ok){const c=Object.assign({},q);delete c.o;delete c.ci;delete c.area;ST.wg.unshift(c);ST.wg=ST.wg.slice(0,30);}else if(it&&it.wgi!=null){ST.wg=ST.wg.filter(x=>x!==it.wgref);}}
  if(q.cat&&GEN[q.cat])adapt(q.cat);
  save();
}
function nextItem(){
  stopSpeak();
  if(S.i>=S.items.length-1){finish();return;}
  S.i++;S.ans=false;S.given=null;S.zoom=false;
  const it=S.items[S.i];
  if(it.k==='scene'||it.k==='memo')S.stud=Date.now()+(it.k==='scene'?it.sc.secs:it.m.secs)*1000;else S.stud=0;
  render();window.scrollTo(0,0);
  if(it.k==='q'&&it.q.t!=='mc'){const i=document.getElementById('ans');if(i)setTimeout(()=>i.focus(),50);}
}
function finish(){
  clearInterval(tick);stopSpeak();
  const R=S.res,ok=R.filter(r=>r.ok).length,n=Math.max(R.length,qCount());
  const res={title:S.title,mode:S.mode,ok,n,R,items:S.items,meta:S.meta,dur:Date.now()-S.t0};
  if(S.mode==='plan'&&S.meta.unit!=null){const P=plan();if(!P.done.includes(S.meta.unit))P.done.push(S.meta.unit);}
  if(S.mode==='einst'){ST.einst={t:Date.now(),ok,n};ST.plan=null;}
  if(S.mode==='exam')ST.ex.push({t:Date.now(),ok,n,p:Math.round(100*ok/n)});
  const scs=new Set(R.filter(r=>r.sc).map(r=>r.sc));scs.forEach(id=>{const sc=SCENES.find(s=>s.id===id);const k=R.filter(r=>r.sc===id&&r.ok).length;const o=ST.sc[id]||{best:0,n:0};o.best=Math.max(o.best,k);o.last=k;o.n++;ST.sc[id]=o;});
  const ps=new Set(R.filter(r=>r.p).map(r=>r.p));ps.forEach(id=>{ST.psg[id]={ok:R.filter(r=>r.p===id&&r.ok).length,t:Date.now()};});
  if(!ST.onb&&S.mode==='einst'){ST.onb=true;}
  save();
  S=null;LAST=res;V.view='result';render();window.scrollTo(0,0);
}
let LAST=null;
function resultView(){
  const r=LAST;if(!r)return homeView();
  const p=r.n?Math.round(100*r.ok/r.n):0;
  const byA={};r.R.forEach(x=>{const a=x.q.area;byA[a]=byA[a]||{ok:0,n:0};byA[a].n++;if(x.ok)byA[a].ok++;});
  const scImgs=[...new Set(r.R.filter(x=>x.sc).map(x=>x.sc))].map(id=>SCENES.find(s=>s.id===id));
  const msg=p>=85?'Sehr stark.':p>=70?'Gut gemacht.':p>=50?'Solide Basis, da geht noch mehr.':'Dranbleiben, Fehler kommen gezielt wieder.';
  return `<div class="res"><div class="kick">${H(r.title)}</div><div class="bigp">${p} %</div><h1 class="lt">${msg}</h1><p class="lead">${r.ok} von ${r.n} richtig · Dauer ${mmss(r.dur/1000)}${r.mode==='exam'&&r.R.length<r.n?' · Zeit abgelaufen':''}</p></div>
   ${Object.keys(byA).length>1?`<div class="card">${Object.entries(byA).map(([a,v])=>`<div class="srow"><span>${H(SHORT[a]||'Wissen')}</span><b>${v.ok}/${v.n}</b></div>`).join('')}</div>`:''}
   ${scImgs.map(sc=>`<details class="card"><summary><b>Bild nochmal ansehen: ${H(sc.t)}</b></summary><img class="rimg" src="${sc.img}" alt=""></details>`).join('')}
   ${r.mode==='einst'?`<div class="card"><b>Deine Einstufung ist gespeichert.</b><p class="sub">Der Tagesplan auf „Heute“ richtet sich ab jetzt nach deinen schwächsten Bereichen.</p></div>`:''}
   <div class="sec">Alle Antworten</div><div class="card">${r.R.map(x=>`<details class="rv ${x.ok?'ok':'bad'}"><summary><span class="rd">${x.ok?'✓':'✕'}</span><span class="rq">${H(String(x.q.q).split('\n')[0].slice(0,110))}</span></summary>
     <div class="rvb">${x.q.fig?`<div class="fig">${x.q.fig}</div>`:''}<p class="pre">${H(x.q.q)}</p><p><small>Deine Antwort:</small> ${x.q.t==='mc'?(x.q.oh?x.q.o[x.g]:H(x.q.o[x.g])):H(x.g)}</p><p><small>Richtig:</small> ${rightAns(x.q)}</p>${x.q.e?`<p class="sub">${H(x.q.e)}</p>`:''}</div></details>`).join('')||'<p class="sub">Keine Antworten.</p>'}</div>
   <div class="stackb"><button class="btn dark" data-a="tab" data-v="${r.mode==='plan'||r.mode==='einst'?'home':V.tab}">Fertig</button>${r.R.some(x=>!x.ok&&!x.sc)?'<button class="btn alt" data-a="wrong">Fehler gleich üben</button>':''}</div>`;
}
function afterSess(){
  const it=S.items[S.i];
  if(it&&it.k==='q'&&it.q.t!=='mc'&&!S.ans){const i=document.getElementById('ans');if(i&&!('ontouchstart' in window))i.focus();}
}

/* ================= Vorlesen ================= */
const PL={on:false,paused:false,parts:[],i:0,eng:'device',cstate:'idle',scope:null,unit:null};
let AUD=null;
const hbV=()=>ST.tts.sex==='m'?'m':'f';
function hbHas(unit){return !!(typeof ABX!=='undefined'&&ABX[hbV()]&&ABX[hbV()][unit]);}
function voicePick(){
  const vs=(speechSynthesis.getVoices()||[]).filter(v=>/^de/i.test(v.lang));if(!vs.length)return null;
  const W=/anna|petra|helena|marlene|vicki|katja|hedda|female|sabine|seraphina|amala|kathrin|steffi|monika|eva/i,M=/markus|yannick|stefan|martin|hans|\bmale\b|conrad|michael|daniel|jonas|viktor|florian|killian/i;
  const pref=(ST.tts.sex==='m'?vs.filter(v=>M.test(v.name)&&!/female/i.test(v.name)):vs.filter(v=>W.test(v.name)));
  const at=pref.filter(v=>/AT/i.test(v.lang));return (at[0]||pref[0]||vs[0]);
}
/* parts: vorzulesende Abschnitte; scope: wo markiert wird; unit: Hörbuch-Abschnitt (falls vorhanden) */
function speak(parts,scope,unit,title){
  stopSpeak();
  parts=parts.map(x=>String(x).trim()).filter(Boolean);if(!parts.length)return;
  PL.parts=parts;PL.i=0;PL.on=true;PL.paused=false;PL.scope=scope||null;PL.unit=unit||null;
  const I=unit&&ST.tts.eng==='hb'&&hbHas(unit)?ABX[hbV()][unit]:null;
  if(I&&I.s.length===parts.length){PL.eng='hb';hbPlay(unit,I,title);plRender();plMark();return;}
  const useClaude=TT&&ST.tts.eng!=='device';
  PL.eng=useClaude?'claude':'device';
  if(useClaude){
    const rate=Math.min(1.5,Math.max(.7,ST.tts.rate));
    const lines=parts.map((t,i)=>({text:t.replace(/\*\*/g,'').slice(0,1900),voice:ST.tts.cv,rate,language:'de',id:String(i)}));
    TT.speak(lines).then(()=>{PL.on=false;plRender();plMark(true);}).catch(e=>{PL.on=false;plRender();plMark(true);if(e&&e.code==='not_granted')TT=null;});
  }else{
    if(!('speechSynthesis' in window)){toast('Vorlesen wird hier nicht unterstützt.');PL.on=false;return;}
    const v=voicePick();
    parts.forEach((t,i)=>{const u=new SpeechSynthesisUtterance(t.replace(/\*\*/g,''));u.lang=v?v.lang:'de-AT';if(v)u.voice=v;u.rate=ST.tts.rate;
      u.onstart=()=>{PL.i=i;plMark();plRender();};u.onend=()=>{if(i===parts.length-1){PL.on=false;plRender();plMark(true);}};speechSynthesis.speak(u);});
  }
  plRender();plMark();
}
function hbPlay(unit,I,title){
  if(!AUD){AUD=document.createElement('audio');AUD.preload='auto';AUD.setAttribute('playsinline','');AUD.style.display='none';document.body.appendChild(AUD);}
  const A=AUD;A.src='audio/'+hbV()+'/'+unit+'.mp4';
  try{A.defaultPlaybackRate=ST.tts.rate;A.playbackRate=ST.tts.rate;A.preservesPitch=true;A.webkitPreservesPitch=true;}catch(e){}
  A.ontimeupdate=()=>{if(PL.eng!=='hb'||!PL.on)return;const t=A.currentTime;let k=0;for(let i=0;i<I.s.length;i++)if(I.s[i]<=t+.05)k=i;if(k!==PL.i){PL.i=k;plMark();plRender();}};
  A.onended=()=>{if(PL.eng==='hb'){PL.on=false;plRender();plMark(true);try{navigator.mediaSession.playbackState='none';}catch(e){}}};
  A.onerror=()=>{if(PL.eng==='hb'&&PL.on){PL.on=false;plRender();plMark(true);toast('Hörbuch konnte nicht geladen werden.');}};
  const pr=A.play();if(pr&&pr.catch)pr.catch(()=>{if(PL.eng==='hb'){PL.on=false;plRender();toast('Tippe nochmal auf Vorlesen.');}});
  try{if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:title||'Vorlesen',artist:'Aufnahmetest Trainer',album:'Hörbuch'});
    navigator.mediaSession.setActionHandler('play',()=>{if(PL.paused)pauseSpeak();});
    navigator.mediaSession.setActionHandler('pause',()=>{if(!PL.paused)pauseSpeak();});
    try{navigator.mediaSession.setActionHandler('stop',()=>stopSpeak());}catch(e){}}}catch(e){}
}
function stopSpeak(){
  if(TT&&PL.eng==='claude'&&PL.on)try{TT.stop();}catch(e){}
  if(AUD&&PL.eng==='hb'){try{AUD.pause();AUD.removeAttribute('src');AUD.load();}catch(e){}}
  try{speechSynthesis.cancel();}catch(e){}
  PL.on=false;PL.paused=false;plMark(true);plRender();
}
function pauseSpeak(){
  if(!PL.on)return;
  if(PL.eng==='hb'&&AUD){try{PL.paused?AUD.play():AUD.pause();}catch(e){}}
  else if(PL.eng==='claude'){try{PL.paused?TT.resume():TT.pause();}catch(e){}}else{try{PL.paused?speechSynthesis.resume():speechSynthesis.pause();}catch(e){}}
  PL.paused=!PL.paused;plRender();
}
function setRateLive(){if(PL.on&&PL.eng==='hb'&&AUD){try{AUD.playbackRate=ST.tts.rate;}catch(e){}}if(PL.on&&PL.eng==='claude'&&TT){try{TT.setRate(Math.min(1.5,Math.max(.7,ST.tts.rate)));}catch(e){}}}
function plMark(clear){
  document.querySelectorAll('.sp.rd').forEach(e=>e.classList.remove('rd'));
  if(clear||!PL.on||!ST.tts.hl||!PL.scope)return;
  const el=document.querySelector(`${PL.scope} .sp[data-s="${PL.i}"]`);if(el){el.classList.add('rd');const r=el.getBoundingClientRect();if(r.top<80||r.bottom>innerHeight-170)el.scrollIntoView({behavior:'smooth',block:'center'});}
}
function plRender(){
  let b=document.getElementById('plbar');
  if(!PL.on){if(b)b.remove();return;}
  if(!b){b=document.createElement('div');b.id='plbar';b.setAttribute('role','region');b.setAttribute('aria-label','Vorlesen');document.body.appendChild(b);}
  const nm={hb:'Hörbuch · '+(hbV()==='m'?'männlich':'weiblich'),claude:'Claude-Stimme',device:'Gerätestimme'}[PL.eng];
  b.innerHTML=`<span class="plt">${ICO(I.spk,18)}<span>${nm} · ${PL.i+1}/${PL.parts.length}</span></span><button class="rbtn rate" data-a="plr" aria-label="Tempo ändern">${String(ST.tts.rate).replace('.',',')}×</button><button class="rbtn" data-a="plp" aria-label="${PL.paused?'Weiter':'Pause'}">${ICO(PL.paused?I.play:I.pause,18)}</button><button class="rbtn" data-a="pls" aria-label="Stopp">${ICO(I.stop,18)}</button>`;
}
function partsOf(sel){return [...document.querySelectorAll(sel+' .sp')].sort((a,b)=>a.dataset.s-b.dataset.s).map(e=>e.textContent);}

/* ================= KI ================= */
async function askKI(kind,q,outId,extra){
  const out=document.getElementById(outId);if(!out)return;
  if(!AI){out.textContent='KI-Coach ist hier nicht verfügbar.';return;}
  const ctx=`Aufgabe: ${q.q}\n${q.t==='mc'?'Antwortmöglichkeiten: '+(q.oh?'(Grafiken)':q.o.join(' | '))+'\n':''}Richtige Antwort: ${q.t==='mc'?(q.oh?'Grafik '+'ABCDEF'[q.ci]:q.o[q.ci]):q.t==='num'?fmt(q.ans):(q.ans||[])[0]}\n${S&&S.given!=null?'Antwort des Lernenden: '+(q.t==='mc'?(q.oh?'Grafik '+'ABCDEF'[S.given]:q.o[S.given]):S.given)+' ('+(S.okk?'richtig':'falsch')+')\n':''}Erklärung aus der App: ${q.e||'-'}`;
  const ask={einfach:'Erkläre die Lösung ganz einfach in 3–5 kurzen Sätzen, Schritt für Schritt.',merk:'Gib einen kurzen, einprägsamen Merksatz oder Trick für diesen Aufgabentyp (max. 3 Sätze).',aehnlich:'Erstelle EINE ähnliche Übungsaufgabe mit gleichem Schwierigkeitsgrad. Zeige zuerst nur die Aufgabe, dann nach einer Leerzeile „Lösung:“ mit kurzer Erklärung.',frei:extra||''}[kind];
  if(!ask){out.textContent='Bitte zuerst eine Frage eingeben.';return;}
  out.textContent='Denkt nach …';out.classList.add('busy');
  try{
    const r=await AI(`Du bist ein freundlicher, präziser Lern-Coach für den Aufnahmetest der österreichischen Polizei (Steiermark). Antworte auf Deutsch (österreichisch, Du-Form), kurz, ohne Markdown-Überschriften. Erfinde keine Fakten über das Aufnahmeverfahren.\n\n${ctx}\n\nAuftrag: ${ask}`,{modelTier:'quick',onText:({text})=>{out.textContent=text;}});
    out.textContent=r.text;
  }catch(e){out.textContent=e&&e.code==='rate_limited'?'Gerade zu viele Anfragen. Bitte kurz warten.':e&&e.code==='not_granted'?'KI-Coach wurde nicht erlaubt.':'KI-Coach gerade nicht erreichbar.';}
  out.classList.remove('busy');
}
async function askIV(i){
  const out=document.getElementById('ivo'+i),inp=document.getElementById('iva'+i);if(!out||!inp)return;
  const a=inp.value.trim();if(!a){out.textContent='Schreib zuerst deine Antwort.';return;}
  out.textContent='Denkt nach …';
  try{const r=await AI(`Du bist Coach für das psychologische Gespräch beim Aufnahmeverfahren der österreichischen Polizei. Gib Feedback auf Deutsch (Du-Form), max. 6 kurze Punkte: was gut ist, was fehlt, ein besserer Formulierungsvorschlag. Ehrlich, nicht übertrieben lobend.\n\nFrage: ${IV[i][1]}\nTipp aus der App: ${IV[i][2]}\nAntwort des Bewerbers: ${a}`,{modelTier:'quick',onText:({text})=>{out.textContent=text;}});out.textContent=r.text;}
  catch(e){out.textContent='KI-Coach gerade nicht erreichbar.';}
}
function extPrompt(q){return `Ich übe für den Aufnahmetest der Polizei Österreich. Erkläre mir diese Aufgabe einfach:\n\n${q.q}\n${q.t==='mc'&&!q.oh?'Antworten: '+q.o.join(' | ')+'\n':''}Richtige Lösung: ${q.t==='mc'?(q.oh?'Grafik '+'ABCDEF'[q.ci]:q.o[q.ci]):q.t==='num'?fmt(q.ans):(q.ans||[])[0]}`;}

/* ================= Kleine Helfer ================= */
function toast(t){let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2600);}
function sheet(html){closeSheet();const d=document.createElement('div');d.className='xov';d.innerHTML=`<div class="xbg" data-a="sclose"></div><div class="xsheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;document.body.appendChild(d);const f=d.querySelector('button,a');if(f)f.focus();}
function closeSheet(){document.querySelectorAll('.xov').forEach(e=>e.remove());}
function setPath(k,v){const p=k.split('.');let o=ST;while(p.length>1)o=o[p.shift()];o[p[0]]=v;}
function getPath(k){return k.split('.').reduce((o,x)=>o&&o[x],ST);}

/* ================= Aktionen ================= */
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-a]');if(!b||b.tagName==='FORM'||b.tagName==='INPUT'&&b.type!=='range'&&b.type!=='checkbox')return;
  const a=b.dataset.a,v=b.dataset.v,x=b.dataset.x;
  switch(a){
   case 'tab':tab(v);break;
   case 'go':if(v==='cat'){start(CAT[x].t,catItems(x),'learn');break;}if(v==='me'||v==='learn'||v==='know'||v==='home'){tab(v);break;}go(v,x);break;
   case 'back':back();break;
   case 'seg':V.seg=v;render();break;
   case 'ob-local':ST.acct='local';OB=1;render();break;
   case 'ob-cloud':if(C.state==='na'){const n=document.getElementById('obnote');if(n)n.textContent='Konto geht nur, wenn du diesen Link in Claude angemeldet öffnest. Du kannst jetzt ohne Konto starten und später im Profil sichern.';toast('Konto hier nicht verfügbar');break;}ST.acct='cloud';save();cloudPull();OB=1;render();break;
   case 'ob-back':OB=0;render();break;
   case 'ob-next':{const n=document.getElementById('obname'),t=document.getElementById('obtest');ST.name=(n&&n.value||'').trim().slice(0,30);ST.test=t&&t.value||'';save();OB=2;render();break;}
   case 'ob-done':ST.onb=true;save();V={tab:'home',view:'home',arg:null,seg:'t1'};render();break;
   case 'einst':{const it=[];it.push(...mix(genPick('zr',1).concat(bankPick('lg',1))).map(q=>Q(q,'logik')));it.push(...genPick('rv',2).map(q=>Q(q,'raum')));it.push(...genPick('ko',2).map(q=>Q(q,'konz')));it.push(...memoBlock(1));it.push(...passBlock(PASS[0],3));it.push(...bankPick('rs',1).concat(bankPick('gr',1)).map(q=>Q(q,'sprache')));start('Einstufung',it,'einst');break;}
   case 'unit':{const P=plan(),u=P.u[+b.dataset.i];if(!u)break;start(u.t,unitItems(u),'plan',{unit:+b.dataset.i});break;}
   case 'due':start('Wiederholen',mix(dueIds()).map(id=>Q(QBYID[id])),'wieder');break;
   case 'wrong':{const it=mix(wrongIds()).map(id=>Q(QBYID[id])).concat(ST.wg.map(q=>Object.assign(Q(q),{wgi:1,wgref:q})));start('Fehler-Training',it,'fehler');break;}
   case 'exam':sheet(`<h2>Simulation starten?</h2><p class="sub">45 Minuten, alle 6 Testbereiche, Antworten erst am Ende. Wie am Testtag: nicht hängen bleiben, weitermachen.</p><div class="stackb"><button class="btn dark" data-a="exam-go">Los geht's</button><button class="btn ghost" data-a="sclose">Abbrechen</button></div>`);break;
   case 'exam-go':{closeSheet();const it=[];EXAM_PLAN.forEach(([area,parts])=>parts.forEach(([cat,n])=>{if(n==='blk')it.push(...memoBlock(2));else if(n==='blk2'){it.push(...passBlock(nextPassage()));it.push(...passBlock(nextPassage()));}else if(GEN[cat]&&CAT[cat].gen)it.push(...genPick(cat,n).map(q=>Q(q,area)));else it.push(...bankPick(cat,n).map(q=>Q(q,area)));}));start('Simulation',it,'exam');break;}
   case 'arun':start(AREA[x].t,areaItems(x),'learn');break;
   case 'cat':start(CAT[x].t,catItems(x),'learn');break;
   case 'scene':{const sc=SCENES.find(s=>s.id===x);start(sc.t,sceneBlock(sc),'scene');break;}
   case 'psg':{const p=PASS.find(p=>p.id===x);start(p.title,passBlock(p),'learn');break;}
   case 'pick':answer(+b.dataset.i);break;
   case 'next':nextItem();break;
   case 'zoom':S.zoom=!S.zoom;render();break;
   case 'quit':if(S.mode==='exam'||S.res.length){sheet(`<h2>Runde beenden?</h2><p class="sub">${S.res.length} Antworten sind gespeichert.</p><div class="stackb"><button class="btn dark" data-a="quit-eval">Beenden und auswerten</button><button class="btn ghost" data-a="sclose">Weitermachen</button></div>`);}else{clearInterval(tick);S=null;stopSpeak();render();}break;
   case 'quit-eval':closeSheet();finish();break;
   case 'sclose':closeSheet();break;
   case 'sayq':{const q=S.items[S.i].q;const parts=[q.q];if(q.t==='mc'&&!q.oh)q.o.forEach((o,i)=>parts.push('ABCDEF'[i]+': '+o));speak(parts);break;}
   case 'readtxt':{const it=S&&S.items[S.i];const p=it&&it.p;speak(p?splitSent(p.text):partsOf('#reader'),'#reader',p?'t-'+p.id:null,p&&p.title);break;}
   case 'readlex':{const x=LEXI[V.arg];if(x)speak(lexSpeech(x),'.wrap','w-'+x.id,x.t);break;}
   case 'say':speak([b.dataset.t]);break;
   case 'plp':pauseSpeak();break;
   case 'pls':stopSpeak();break;
   case 'lexread':if(ST.lex[x])delete ST.lex[x];else ST.lex[x]=1;save();render();break;
   case 'lq':{const id=V.arg,qi=+b.dataset.i,oi=+b.dataset.o,q=(LX[id]||{}).q[qi];LQS[id]=LQS[id]||{};if(LQS[id][qi]!=null)break;LQS[id][qi]=oi;const ok=oi===q[2];const x=LEXI[id];ST.log.push({t:Date.now(),a:CAT_AREA[x.cat]||'wissen',c:'lx',o:ok?1:0});ST.days[dk()]=(ST.days[dk()]||0)+1;if(Object.keys(LQS[id]).length===LX[id].q.length)ST.lex[id]=1;save();const y=window.scrollY;render();window.scrollTo(0,y);break;}
   case 'lqreset':delete LQS[V.arg];render();break;
   case 'plr':{const R=[.5,.75,1,1.25,1.5,1.75,2];const i=R.indexOf(ST.tts.rate);ST.tts.rate=R[(i+1)%R.length];save();setRateLive();plRender();break;}
   case 'ki':{const q=S.items[S.i].q;S.kiOpen=true;const inp=document.getElementById('kiin');askKI(v,q,'kiout',inp&&inp.value.trim());break;}
   case 'extai':{const q=S.items[S.i].q;const u=v==='chatgpt'?'https://chatgpt.com/?q=':'https://claude.ai/new?q=';const href=u+encodeURIComponent(extPrompt(q));
     sheet(`<h2>${v==='chatgpt'?'ChatGPT':'Claude'} öffnen?</h2><p class="sub">Die Aufgabe wird in einem neuen Tab an ${v==='chatgpt'?'ChatGPT (OpenAI)':'Claude (Anthropic)'} übergeben. Deine Lerndaten bleiben hier.</p><div class="stackb"><a class="btn dark" href="${H(href)}" target="_blank" rel="noopener" data-a="sclose">Sicher, öffnen</a><button class="btn ghost" data-a="sclose">Abbrechen</button></div>`);break;}
   case 'ivdone':{const i=+b.dataset.i;ST.iv[i]=!ST.iv[i];save();render();break;}
   case 'ivai':askIV(+b.dataset.i);break;
   case 'dksay':speak([DIKTAT[DK.i%DIKTAT.length][0]]);setTimeout(()=>{const t=document.getElementById('dkin');if(t)t.focus();},100);break;
   case 'dkcheck':{const t=document.getElementById('dkin');const g=t?t.value:'';if(!g.trim()){toast('Schreib zuerst den Satz.');break;}DK.res=dkCompare(g,DIKTAT[DK.i%DIKTAT.length][0]);ST.dk.n++;if(DK.res.ok)ST.dk.ok++;ST.log.push({t:Date.now(),a:'sprache',c:'dk',o:DK.res.ok?1:0});ST.days[dk()]=(ST.days[dk()]||0)+1;save();render();break;}
   case 'dknext':DK.i++;DK.res=null;render();break;
   case 'chk':ST.chk[x]=!ST.chk[x];save();render();break;
   case 'set':setPath(b.dataset.k,v);save();if(b.dataset.k==='theme')applyTheme();render();break;
   case 'tog':setPath(b.dataset.k,!getPath(b.dataset.k));save();render();break;
   case 'acct-on':ST.acct='cloud';save();cloudPull();render();break;
   case 'acct-off':ST.acct='local';save();render();toast('Ab jetzt nur noch auf diesem Gerät.');break;
   case 'sync':cloudPull();break;
   case 'copy':{const t=document.getElementById('excode');t.select();try{navigator.clipboard.writeText(t.value).then(()=>toast('Code kopiert'),()=>{document.execCommand('copy');toast('Code kopiert');});}catch(e){document.execCommand('copy');toast('Code kopiert');}break;}
   case 'import':{const t=document.getElementById('imcode');try{const s=JSON.parse(decodeURIComponent(escape(atob(t.value.trim()))));if(!s||s.v!==1)throw 0;sheet(`<h2>Stand übernehmen?</h2><p class="sub">Der aktuelle Stand auf diesem Gerät wird ersetzt.</p><div class="stackb"><button class="btn dark" data-a="import-go">Übernehmen</button><button class="btn ghost" data-a="sclose">Abbrechen</button></div>`);window.__imp=s;}catch(e){toast('Code ungültig.');}break;}
   case 'import-go':{closeSheet();const keep=ST.acct;ST=Object.assign(fresh(),window.__imp);ST.acct=keep;ST.onb=true;save();toast('Übernommen');tab('me');break;}
   case 'reset':sheet(`<h2>Alles löschen?</h2><p class="sub">Fortschritt, Notizen und Einstellungen auf diesem Gerät werden gelöscht.${ST.acct==='cloud'?' Die Sicherung im Konto wird mit dem leeren Stand überschrieben.':''}</p><div class="stackb"><button class="btn red" data-a="reset-go">Endgültig löschen</button><button class="btn ghost" data-a="sclose">Abbrechen</button></div>`);break;
   case 'reset-go':{closeSheet();const acct=ST.acct;ST=fresh();ST.acct=acct;save();OB=0;V={tab:'home',view:'home',arg:null,seg:'t1'};render();break;}
  }
});
document.addEventListener('submit',ev=>{const f=ev.target.closest('[data-a="numform"]');if(!f)return;ev.preventDefault();const i=document.getElementById('ans');answer(i?i.value:'');});
document.addEventListener('input',ev=>{
  const t=ev.target;
  if(t.id==='note'){const id=t.dataset.nid;if(t.value.trim())ST.notes[id]=t.value;else delete ST.notes[id];clearTimeout(t._t);t._t=setTimeout(save,600);}
  if(t.dataset&&t.dataset.a==='rate'){ST.tts.rate=+t.value;setRateLive();const l=document.getElementById('rtv');if(l)l.textContent=String(ST.tts.rate).replace('.',',')+'×';clearTimeout(t._t);t._t=setTimeout(save,400);}
});
document.addEventListener('change',ev=>{
  const t=ev.target;
  if(t.id==='sppu'||t.id==='sprun'){ST.sp=ST.sp||{};ST.sp[t.id==='sppu'?'pu':'run']=t.value.trim();save();render();}
  if(t.id==='pname'){ST.name=t.value.trim().slice(0,30);save();}
  if(t.id==='ptest'){ST.test=t.value;ST.plan=null;save();render();}
});
document.addEventListener('keydown',ev=>{
  if(!S||ev.target.matches('input,textarea'))return;
  const it=S.items[S.i];
  if(ev.key==='Enter'&&(S.ans||it.k!=='q')){ev.preventDefault();nextItem();}
  else if(it.k==='q'&&!S.ans&&it.q.t==='mc'&&/^[1-6a-fA-F]$/.test(ev.key)){const i=/\d/.test(ev.key)?+ev.key-1:'abcdef'.indexOf(ev.key.toLowerCase());if(i<it.q.o.length)answer(i);}
  else if(ev.key==='Escape'&&S.zoom){S.zoom=false;render();}
});
if('speechSynthesis' in window)try{speechSynthesis.onvoiceschanged=()=>{};speechSynthesis.getVoices();}catch(e){}

const LOGO='<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#0A3D8F"/><path d="M32 13l15 5.6v11.2c0 9.4-6.4 17.4-15 20.6-8.6-3.2-15-11.2-15-20.6V18.6z" fill="none" stroke="#fff" stroke-width="3"/><path d="M25 32l5 5 9-10" fill="none" stroke="#FFCC00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

render();capInit();
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname)&&window.top===window)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}
})();
