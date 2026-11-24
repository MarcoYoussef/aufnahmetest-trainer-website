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
 sp:{},mk:{},rk:{},arch:[],conf:true,gkey:'',rem:'18:00',qs:{},notes:{},wg:[],log:[],days:{},lv:{},sc:{},plan:null,iv:{},chk:{},lex:{},ex:[],einst:null,psg:{},dk:{n:0,ok:0}};}
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
function packCloud(){const o=Object.assign({},ST);delete o.gkey;let s=JSON.stringify(o);if(s.length>230000){o.wg=[];o.log=ST.log.slice(-600);s=JSON.stringify(o);}return s;}
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
function cloudQueue(){if(ST.acct==='sb'){sbQueue();return;}if(ST.acct!=='cloud'||!C.db)return;clearTimeout(C.t);C.t=setTimeout(cloudPush,2500);}
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
  if(ST.acct==='sb')return A.user?({sync:['Wird abgeglichen …','dim'],ok:['Gesichert'+(A.last?' · '+new Date(A.last).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}):''),'ok'],err:['Sichern fehlgeschlagen','bad'],mfa:['2FA-Code nötig','warn']})[A.state]||['Angemeldet','ok']:['Abgemeldet','warn'];
  if(ST.acct!=='cloud')return ['Nur auf diesem Gerät','dim'];
  return ({wait:['Verbinde …','dim'],sync:['Wird abgeglichen …','dim'],slow:['Speicher antwortet noch nicht','warn'],ok:['Gesichert'+(C.last?' · '+new Date(C.last).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}):''),'ok'],err:['Sichern fehlgeschlagen','bad'],na:['Konto hier nicht verfügbar','warn'],ready:['Bereit','dim']})[C.state]||['–','dim'];
}
function refreshAcct(){document.querySelectorAll('[data-acct]').forEach(el=>{const [t,c]=acctLabel();el.textContent=t;el.className='acct '+c;});}


/* ================= Konto auf der eigenen Website (Supabase: E-Mail oder Benutzername, Passwort, 2FA) ================= */
const SB_URL='https://hppzxcsvnewdorkidjbb.supabase.co',SB_KEY='sb_publishable_kqw72gF8caWsAKPDVdjHfQ_9jHKOJCg',UDOM='@nutzer.aufnahmetest.invalid';
const IS_LINK=/claude/.test(location.hostname)||window.top!==window;
const A={sb:null,user:null,aal:null,next:null,factors:[],state:'off',last:0,t:null,writing:false,pending:false,mode:'in',kind:'mail',msg:'',busy:false,enroll:null,recovery:false};
function sbInit(){
  if(IS_LINK||!window.supabase||!window.supabase.createClient)return;
  try{A.sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}catch(e){A.sb=null;return;}
  A.sb.auth.onAuthStateChange((ev,session)=>{
    if(ev==='PASSWORD_RECOVERY'){A.recovery=true;setTimeout(()=>{V.view='auth';render();},0);return;}
    setTimeout(()=>sbAfterAuth(session),0);
  });
}
const uname=u=>u&&u.email&&u.email.endsWith(UDOM)?u.email.slice(0,-UDOM.length):null;
const whoLabel=()=>A.user?(uname(A.user)||A.user.email):'';
async function sbAfterAuth(session){
  A.user=session?session.user:null;
  if(!A.user){if(ST.acct==='sb'){A.state='off';}render();return;}
  try{const {data}=await A.sb.auth.mfa.getAuthenticatorAssuranceLevel();A.aal=data.currentLevel;A.next=data.nextLevel;}catch(e){}
  try{const {data}=await A.sb.auth.mfa.listFactors();A.factors=(data&&data.totp||[]).filter(f=>f.status==='verified');}catch(e){A.factors=[];}
  if(A.next==='aal2'&&A.aal!=='aal2'){A.state='mfa';V.view='auth';render();return;}
  if(!ST.onb){ST.onb=true;}
  ST.acct='sb';await sbPull();
  if(V.view==='auth'&&!A.recovery){V.view=V.tab='me';stack.length=0;}
  render();
  if(A.newAcct&&!A.factors.length){A.newAcct=false;sheet(`<h2>Konto erstellt</h2><p class="sub">Dein Fortschritt wird ab jetzt gesichert. Willst du die Zwei-Faktor-Anmeldung (2FA) einschalten? Dauert 1 Minute mit einer Authenticator-App.</p><div class="stackb"><button class="btn dark" data-a="au-mfa-go">2FA jetzt einschalten</button><button class="btn ghost" data-a="sclose">Später</button></div>`);}
}
async function sbPull(){
  if(!A.sb||!A.user)return;A.state='sync';refreshAcct();
  try{
    const {data,error}=await A.sb.from('fortschritt').select('stand,geaendert').eq('user_id',A.user.id).maybeSingle();
    if(error)throw error;
    if(data&&data.stand&&data.stand.v===1&&(data.geaendert||0)>(ST.upd||0)){const th=ST.theme,gk=ST.gkey;ST=Object.assign(fresh(),data.stand);ST.acct='sb';ST.onb=true;ST.gkey=gk;if(!ST.theme)ST.theme=th;try{localStorage.setItem(SKEY,JSON.stringify(ST));}catch(e){}A.state='ok';A.last=Date.now();applyTheme();render();return;}
    A.state='ok';await sbPush();
  }catch(e){A.state='err';refreshAcct();}
}
function sbQueue(){if(ST.acct!=='sb'||!A.user)return;clearTimeout(A.t);A.t=setTimeout(sbPush,2500);}
async function sbPush(){
  if(ST.acct!=='sb'||!A.sb||!A.user)return;
  if(A.writing){A.pending=true;return;}A.writing=true;
  try{const {error}=await A.sb.from('fortschritt').upsert({user_id:A.user.id,stand:Object.assign({},ST,{gkey:''}),geaendert:ST.upd||Date.now(),updated_at:new Date().toISOString()});if(error)throw error;A.state='ok';A.last=Date.now();}
  catch(e){A.state='err';}
  A.writing=false;refreshAcct();if(A.pending){A.pending=false;sbPush();}
}
const pwOk=p=>p.length>=8&&/[a-zA-Z]/.test(p)&&/\d/.test(p);
async function sbSubmit(){
  const f=id=>{const e=document.getElementById(id);return e?e.value:'';};
  const id=f('auid').trim(),pw=f('aupw'),pw2=f('aupw2');
  A.msg='';A.busy=true;render();
  try{
    if(A.mode==='up'){
      if(!pwOk(pw))throw new Error('Passwort: mindestens 8 Zeichen, mit Buchstaben und Ziffern.');
      if(pw!==pw2)throw new Error('Die beiden Passwörter stimmen nicht überein.');
      if(A.kind==='mail'){
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id))throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
        const {data,error}=await A.sb.auth.signUp({email:id,password:pw,options:{emailRedirectTo:location.origin+location.pathname}});
        if(error)throw error;
        if(!data.session){A.msg='Fast fertig: Wir haben dir eine E-Mail geschickt. Tippe auf den Link darin, dann bist du angemeldet. (Auch im Spam-Ordner nachsehen.)';A.busy=false;render();return;}
      }else{
        const r=await fetch(SB_URL+'/functions/v1/benutzer-anlegen',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY},body:JSON.stringify({benutzer:id,passwort:pw})});
        const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Konto konnte nicht angelegt werden.');
        const {error}=await A.sb.auth.signInWithPassword({email:id.toLowerCase()+UDOM,password:pw});if(error)throw error;
      }
      A.newAcct=true;
    }else{
      const email=id.includes('@')?id:id.toLowerCase()+UDOM;
      const {error}=await A.sb.auth.signInWithPassword({email,password:pw});if(error)throw error;
    }
  }catch(e){A.msg=authMsg(e);}
  A.busy=false;render();
}
function authMsg(e){const m=String(e&&e.message||e);
  if(/Invalid login/i.test(m))return 'Anmeldung fehlgeschlagen: Name/E-Mail oder Passwort falsch.';
  if(/Email not confirmed/i.test(m))return 'Bitte zuerst die E-Mail bestätigen (Link in deinem Postfach).';
  if(/already registered|already exists/i.test(m))return 'Für diese E-Mail gibt es schon ein Konto. Melde dich an.';
  if(/rate limit|too many/i.test(m))return 'Zu viele Versuche. Bitte ein paar Minuten warten.';
  if(/Failed to fetch|NetworkError/i.test(m))return 'Keine Verbindung. Bitte Internet prüfen.';
  return m;}
async function sbMfaVerify(){
  const c=(document.getElementById('aucode')||{}).value||'';if(!/^\d{6}$/.test(c.trim())){A.msg='Bitte den 6-stelligen Code eingeben.';render();return;}
  A.busy=true;A.msg='';render();
  try{
    if(A.enroll){const {error}=await A.sb.auth.mfa.challengeAndVerify({factorId:A.enroll.id,code:c.trim()});if(error)throw error;A.enroll=null;toast('2FA ist eingeschaltet');}
    else{const {data}=await A.sb.auth.mfa.listFactors();const fct=(data.totp||[]).find(f=>f.status==='verified');const {error}=await A.sb.auth.mfa.challengeAndVerify({factorId:fct.id,code:c.trim()});if(error)throw error;}
    A.busy=false;const {data:{session}}=await A.sb.auth.getSession();await sbAfterAuth(session);if(V.view==='auth'){V.view=V.tab='me';}render();return;
  }catch(e){A.msg=/invalid|expired/i.test(String(e.message))?'Code falsch oder abgelaufen. Nimm den aktuellen Code aus der App.':authMsg(e);}
  A.busy=false;render();
}
async function sbMfaStart(){
  A.busy=true;render();
  try{const old=await A.sb.auth.mfa.listFactors();for(const f of (old.data&&old.data.totp||[]))if(f.status!=='verified')await A.sb.auth.mfa.unenroll({factorId:f.id});
    const {data,error}=await A.sb.auth.mfa.enroll({factorType:'totp',friendlyName:'Aufnahmetest Trainer'});if(error)throw error;
    A.enroll={id:data.id,qr:data.totp.qr_code,secret:data.totp.secret,uri:data.totp.uri};A.msg='';V.view='auth';A.state2='enroll';
  }catch(e){toast(authMsg(e));}
  A.busy=false;render();
}
async function sbMfaOff(){
  try{if(A.aal!=='aal2'){toast('Melde dich zuerst mit 2FA-Code an.');return;}for(const f of A.factors){const {error}=await A.sb.auth.mfa.unenroll({factorId:f.id});if(error)throw error;}
    A.factors=[];await A.sb.auth.refreshSession();toast('2FA ausgeschaltet');}catch(e){toast(authMsg(e));}
  render();
}
async function sbReset(){
  const id=((document.getElementById('auid')||{}).value||'').trim();
  if(!id.includes('@')){A.msg='Passwort-Reset geht nur bei Konten mit E-Mail. Gib oben deine E-Mail ein.';render();return;}
  try{const {error}=await A.sb.auth.resetPasswordForEmail(id,{redirectTo:location.origin+location.pathname});if(error)throw error;A.msg='Wir haben dir einen Link zum Zurücksetzen geschickt.';}catch(e){A.msg=authMsg(e);}
  render();
}
async function sbNewPw(){
  const p=(document.getElementById('aunew')||{}).value||'';if(!pwOk(p)){A.msg='Passwort: mindestens 8 Zeichen, mit Buchstaben und Ziffern.';render();return;}
  const {error}=await A.sb.auth.updateUser({password:p});if(error){A.msg=authMsg(error);render();return;}
  A.recovery=false;toast('Neues Passwort gespeichert');V.view=V.tab='me';render();
}
async function sbOut(){try{await A.sb.auth.signOut();}catch(e){}A.user=null;A.factors=[];ST.acct='local';save();toast('Abgemeldet. Dein Stand bleibt auf diesem Gerät.');render();}
function authView(){
  if(!A.sb)return head('Konto',null,'Zurück')+'<div class="card"><p class="sub">Konten gibt es in der Website-Fassung. Im Claude-Link läuft die Sicherung über dein Claude-Konto (Profil).</p></div>';
  const msg=A.msg?`<div class="amsg" role="alert">${H(A.msg)}</div>`:'';
  if(A.recovery)return head('Neues Passwort')+`<div class="card"><label class="fl">Neues Passwort<input class="in" id="aunew" type="password" autocomplete="new-password"></label>${msg}<button class="btn" data-a="au-newpw">Speichern</button></div>`;
  if(A.enroll)return head('2FA einrichten',null,'Profil')+`<div class="card"><ol class="lx"><li>Öffne eine Authenticator-App (z. B. Google Authenticator, Microsoft Authenticator oder Apple Passwörter).</li><li>Scanne den QR-Code. Am iPhone kannst du auch den Schlüssel kopieren und einfügen.</li><li>Gib den 6-stelligen Code ein.</li></ol>
    <div class="qr"><img src="${H(A.enroll.qr)}" alt="QR-Code für die Authenticator-App"></div>
    <label class="fl">Schlüssel<input class="in mono" readonly value="${H(A.enroll.secret)}" id="ausec"></label><button class="pill" data-a="au-copysec">Schlüssel kopieren</button>
    <label class="fl">Code aus der App<input class="in big" id="aucode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456"></label>${msg}
    <button class="btn" data-a="au-verify" ${A.busy?'disabled':''}>Bestätigen und einschalten</button><button class="btn ghost" data-a="au-enrollx">Abbrechen</button></div>`;
  if(A.state==='mfa')return head('Bestätigung mit 2FA')+`<div class="card"><p class="sub">Gib den 6-stelligen Code aus deiner Authenticator-App ein.</p><label class="fl">Code<input class="in big" id="aucode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456"></label>${msg}<button class="btn" data-a="au-verify" ${A.busy?'disabled':''}>Anmelden</button><button class="btn ghost" data-a="au-out">Abbrechen</button></div>`;
  const up=A.mode==='up',mail=A.kind==='mail';
  return head(up?'Konto erstellen':'Anmelden',up?'Dein Fortschritt wird gesichert und auf jedem Gerät abgeglichen. Kostenlos, kein Abo.':null,'Zurück')+`
   <div class="seg"><button class="${!up?'on':''}" data-a="au-mode" data-v="in">Anmelden</button><button class="${up?'on':''}" data-a="au-mode" data-v="up">Registrieren</button></div>
   ${up?`<div class="seg sm2"><button class="${mail?'on':''}" data-a="au-kind" data-v="mail">Mit E-Mail</button><button class="${!mail?'on':''}" data-a="au-kind" data-v="user">Mit Benutzername</button></div>`:''}
   <form class="card" data-a="au-form">
    <label class="fl">${up?(mail?'E-Mail-Adresse':'Benutzername'):'E-Mail oder Benutzername'}<input class="in" id="auid" ${up&&mail?'type="email" autocomplete="email"':'autocomplete="username" autocapitalize="off"'} spellcheck="false" required></label>
    <label class="fl">Passwort<span class="pwrow"><input class="in" id="aupw" type="password" autocomplete="${up?'new-password':'current-password'}" required><button type="button" class="pill" data-a="au-eye" aria-label="Passwort anzeigen">Zeigen</button></span></label>
    ${up?`<label class="fl">Passwort wiederholen<input class="in" id="aupw2" type="password" autocomplete="new-password" required></label><p class="fine left">Mindestens 8 Zeichen, mit Buchstaben und Ziffern.${mail?'':' Ohne E-Mail kann ein vergessenes Passwort nicht zurückgesetzt werden.'}</p>`:''}
    ${msg}<button class="btn" type="submit" ${A.busy?'disabled':''}>${A.busy?'Bitte warten …':up?'Konto erstellen':'Anmelden'}</button>
    ${up?'':'<button type="button" class="lnk" data-a="au-reset">Passwort vergessen?</button>'}
   </form>
   <p class="fine left">${ST.log.length?'Dein bisheriger Fortschritt auf diesem Gerät wird ins Konto übernommen.':''} Nach dem Anmelden kannst du im Profil die Zwei-Faktor-Anmeldung (2FA) einschalten.</p>`;
}

/* ================= Entwickler-Bereich (nur Konten mit Rolle "dev") ================= */
const APPV='2026.11.24';
const isDev=()=>!!(A.user&&A.user.app_metadata&&A.user.app_metadata.role==='dev');
let DEVS=null;
function devView(){
  if(!isDev())return head('Entwickler',null,'Profil')+'<div class="card"><p class="sub">Nur für Entwickler-Konten.</p></div>';
  const size=(()=>{try{return Math.round(JSON.stringify(ST).length/1024);}catch(e){return 0;}})();
  const st=DEVS;
  const kv=(k,v)=>`<div class="srow"><span>${H(k)}</span><b>${H(v)}</b></div>`;
  return head('Entwickler',null,'Profil')+`
   <div class="card"><div class="ch"><b>App und Konto</b></div>
    ${kv('Version',APPV)}${kv('Konto',whoLabel())}${kv('Rolle','Entwickler')}${kv('2FA',A.factors.length?'an (Stufe '+(A.aal||'?')+')':'aus')}${kv('Sicherung',acctLabel()[0])}${kv('Lokaler Speicher',size+' KB')}${kv('Antworten im Protokoll',ST.log.length)}${kv('Fragen mit Lernstand',Object.keys(ST.qs).length)}</div>
   <div class="card"><div class="ch"><b>Server</b><button class="lnk" data-a="dev-stats">Aktualisieren</button></div>
    ${st?(st.err?`<p class="sub">${H(st.err)}</p>`:kv('Konten gesamt',st.konten)+kv('davon mit E-Mail',st.mit_email)+kv('mit 2FA',st.mit_2fa)+kv('mit gesichertem Fortschritt',st.mit_fortschritt)+kv('aktiv (7 Tage)',st.aktiv_7_tage)+kv('neu (7 Tage)',st.neu_7_tage)):'<p class="sub">Tippe auf „Aktualisieren“.</p>'}</div>
   <div class="sec">Test-Werkzeuge</div>
   <div class="card">
    <div class="frow"><div><b>Stufe für alle Aufgaben</b><small>Generatoren-Schwierigkeit</small></div><div class="seg sm">${[1,2,3].map(n=>`<button data-a="dev-lv" data-v="${n}">${n}</button>`).join('')}</div></div>
    <div class="row"><button class="btn sm alt" data-a="dev-plan">Tagesplan neu</button><button class="btn sm alt" data-a="dev-due">Alles fällig machen</button><button class="btn sm alt" data-a="dev-einst">Einstufung zurücksetzen</button><button class="btn sm alt" data-a="dev-wg">Fehlerliste leeren</button><button class="btn sm alt" data-a="dev-onb">Willkommen erneut zeigen</button></div>
   </div>
   <div class="card"><div class="ch"><b>Stand als JSON</b></div><textarea class="in ta mono" rows="5" readonly>${H(JSON.stringify(ST).slice(0,20000))}</textarea></div>
   <p class="fine left">Rolle wird nur auf dem Server vergeben (Supabase, Tabelle privat.entwickler). Wer 2FA eingeschaltet hat, sieht die Server-Zahlen erst nach dem 2FA-Code.</p>`;
}
async function devStats(){try{const {data,error}=await A.sb.rpc('dev_statistik');if(error)throw error;DEVS=data;}catch(e){DEVS={err:'Nicht abrufbar: '+(e.message||e)};}render();}
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
function go(view,arg,keep){ruStop();K=view==='karten'?K:null;if(!keep)stack.push(Object.assign({},V));V.view=view;V.arg=arg;stopSpeak();render();window.scrollTo(0,0);}
function back(){const p=stack.pop();if(p){V=p;}else{V.view=V.tab;V.arg=null;}stopSpeak();render();window.scrollTo(0,0);}
function tab(t){ruStop();K=null;stack.length=0;V.tab=t;V.view=t;V.arg=null;stopSpeak();render();window.scrollTo(0,0);}

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
  if(!ST.onb&&!S&&V.view!=='auth'){app.innerHTML=onbView();document.body.className='onb';return;}
  if(S){document.body.className='sess';app.innerHTML=sessView();afterSess();plRender();return;}
  document.body.className=ST.onb?'':'onb';
  const v=V.view;let h='';
  try{
    h=({home:homeView,learn:learnView,know:knowView,me:meView,area:areaView,scenes:scenesView,passages:passView,lex:lexView,kquiz:kquizView,iv:ivView,dk:dkView,chk:chkView,sport:sportView,auth:authView,dev:devView,ausw:auswView,archiv:archView,notizen:notesView,markiert:markView,suche:suchView,karten:kartView,regeln:regelView,ablauf:ablaufView,methoden:methView,info:infoView,ruhe:ruheView,stats:statsView,data:dataView,result:resultView})[v]();
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
    ${A.sb?`<button class="btn dark" data-a="au-go" data-v="up">${ICO(I.cloud,20)} Konto erstellen</button><button class="btn ghost" data-a="au-go" data-v="in">Anmelden</button><button class="btn" data-a="ob-local">Als Gast starten</button>`:`<button class="btn dark" data-a="ob-cloud">${ICO(I.cloud,20)} Mit Konto starten</button>
    <button class="btn" data-a="ob-local">Ohne Konto starten</button>`}
   </div>
   <p class="fine" id="obnote">${A.sb?'Als Gast bleibt alles nur auf diesem Gerät. Ein Konto (E-Mail oder Benutzername, Passwort, auf Wunsch 2FA) sichert deinen Fortschritt auf allen Geräten. Kostenlos, kein Abo.':''}${A.sb?'':`Ohne Konto bleibt alles nur auf diesem Gerät. Mit Konto wird dein Fortschritt privat gesichert und auf iPhone und PC abgeglichen, sobald du diesen Link angemeldet öffnest. Kostenlos, kein Abo.`}</p>
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
    ${kiOn()?`<details class="kid"><summary>Meine Antwort von der KI prüfen lassen</summary><textarea class="in ta" id="iva${i}" rows="4" placeholder="Schreib deine Antwort in Stichworten oder ganz …"></textarea><button class="btn sm" data-a="ivai" data-i="${i}">Feedback holen</button><div class="aiout" id="ivo${i}" aria-live="polite"></div></details>`:''}
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
   ${A.sb?sbCard():claudeCard()}
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
    <div class="frow"><div><b>KI-Coach</b><small>${AI?'Eingebaut (Claude)':ST.gkey?'Mit deinem Gemini-Schlüssel':'Braucht einen kostenlosen Gemini-Schlüssel'}</small></div>${sw('ki',ST.ki)}</div>
    ${AI?'':`<div class="frow"><div><b>Gemini-Schlüssel</b><small>Kostenlos bei <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. Bleibt nur auf diesem Gerät, wird nicht gesichert.</small></div><input class="in" id="gkey" type="password" autocomplete="off" placeholder="AIza…" value="${H(ST.gkey)}"></div>`}
    <div class="frow"><div><b>„Wie sicher bist du?“ fragen</b><small>Zeigt dir, wo du dich überschätzt</small></div>${sw('conf',ST.conf)}</div>
    <div class="frow"><div><b>Fragen pro Runde</b><small>Bei Themen und Wissen-Quiz</small></div><div class="seg sm">${[['alle','Alle'],['20','20'],['10','10']].map(([v,l])=>`<button class="${ST.round===v?'on':''}" data-a="set" data-k="round" data-v="${v}">${l}</button>`).join('')}</div></div>
   </div>
   <div class="sec">Mehr</div>
   <div class="list">${row('ausw','Auswertung','Wochenbericht, schwache Themen, Muster','#0A5FC8',I.learn)}${row('archiv','Ergebnis-Archiv',ST.arch.length+' Runden mit allen Antworten','#5B3FD6',I.list)}${row('notizen','Notizen',Object.keys(ST.notes).length+' Notizen, durchsuchbar','#E5A000',I.note)}${row('markiert','Markierte Fragen',Object.keys(ST.mk).length+' mit Stern','#FF9500','<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>')}${row('suche','Fragen suchen','Alle festen Fragen und Erklärungen','#6C6C70','<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>')}${row('karten','Lernkarten','Österreich, Steiermark, Polizei, Aufnahmeverfahren','#2FA45A',I.know)}${row('regeln','Regel-Karten',Object.keys(ST.rk).length+' Regeln aus deinen Fehlern','#C4161C',I.warn)}</div>
   <div class="list">${row('ablauf','Ablauf und Fristen','Bewerbung, Testtage, Bewertung, Checklisten','#0A3D8F',I.list)}${row('ruhe','Ruhig in den Test','Sorgen aufschreiben, Atmen, Testtag-Plan','#30B0C7','<path d="M3 12h4l3-8 4 16 3-8h4"/>')}${row('methoden','Wie die App lernt','Lernforschung hinter den Funktionen','#8E8E93',I.spark)}${row('info','Hinweise und Quellen','Was die App ist und was nicht','#8E8E93','<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>')}</div>
   <div class="card"><div class="ch"><b>Lern-Erinnerung</b></div><p class="sub">Legt eine tägliche Erinnerung für 60 Tage in deinem Kalender an. Am iPhone die Datei öffnen und „Alle hinzufügen“ tippen.</p><div class="inrow"><input class="in" type="time" id="remt" value="${H(ST.rem)}" aria-label="Uhrzeit"><button class="btn sm" data-a="ics">Kalender-Datei</button></div>${IS_LINK?'<p class="fine left">Im Claude-Link sind Downloads gesperrt, auf der Website geht es.</p>':''}</div>
   <div class="list">${row('data','Sichern und übertragen','Code kopieren, auf anderem Gerät einfügen','#6C6C70',I.cloud)}${isDev()?row('dev','Entwickler','Server-Zahlen, Test-Werkzeuge, Rohdaten','#111114',I.spark):''}</div>
   <button class="btn ghost danger" data-a="reset">Alle Daten auf diesem Gerät löschen</button>
   <p class="fine left">Inoffizielle Übungs-App mit selbst geschriebenen und erzeugten Aufgaben. Nicht vom Innenministerium oder der Polizei. Kein Abo, keine Werbung.</p>`;
}
function claudeCard(){return `<div class="banner" style="margin-bottom:0"><span><b>Eigene Website mit Konto</b>E-Mail oder Benutzername, Passwort und 2FA gibt es auf der unabhängigen Website.</span><a class="btn sm" href="https://marcoyoussef.github.io/aufnahmetest-trainer-website/neu/" target="_blank" rel="noopener">Öffnen</a></div>   <div class="card">
    <div class="ch"><b>Konto</b></div>
    ${ST.acct==='cloud'?`<p class="sub">Dein Fortschritt wird privat in deinem Claude-Konto gesichert. Öffnest du diesen Link am PC oder iPhone angemeldet, ist alles da. Niemand sonst sieht deine Daten.</p><div class="row"><button class="btn sm alt" data-a="sync">Jetzt abgleichen</button><button class="btn sm ghost" data-a="acct-off">Nur noch auf diesem Gerät</button></div>`
    :`<p class="sub">Gerade bleibt alles nur auf diesem Gerät. Mit Konto wird dein Fortschritt gesichert und geräteübergreifend abgeglichen.</p><button class="btn sm" data-a="acct-on" ${C.state==='na'?'disabled':''}>${ICO(I.cloud,18)} Mit Konto sichern</button>${C.state==='na'?'<p class="fine left">Konto ist nur verfügbar, wenn du diesen Link in Claude angemeldet öffnest. Daten übertragen geht immer über „Sichern und übertragen“.</p>':''}`}
   </div>`;}
function sbCard(){
  if(!A.user)return `<div class="card"><div class="ch"><b>Konto</b></div><p class="sub">Du bist als Gast unterwegs, alles bleibt nur auf diesem Gerät. Mit Konto wird dein Fortschritt gesichert und auf jedem Gerät abgeglichen.</p><div class="row"><button class="btn sm" data-a="au-go" data-v="up">${ICO(I.cloud,18)} Konto erstellen</button><button class="btn sm alt" data-a="au-go" data-v="in">Anmelden</button></div></div>`;
  const on=A.factors.length>0;
  return `<div class="card"><div class="ch"><b>Konto</b><span data-acct class="acct"></span></div>
   <p class="sub">Angemeldet als <b>${H(whoLabel())}</b></p>
   <div class="frow"><div><b>Zwei-Faktor-Anmeldung (2FA)</b><small>${on?'Eingeschaltet: Beim Anmelden braucht es zusätzlich den Code aus deiner Authenticator-App.':'Aus. Empfohlen: schützt dein Konto, auch wenn jemand dein Passwort kennt.'}</small></div>${on?'<button class="btn sm ghost" data-a="au-mfa-off">Ausschalten</button>':'<button class="btn sm" data-a="au-mfa-on">Einschalten</button>'}</div>
   <div class="row"><button class="btn sm alt" data-a="sb-sync">Jetzt abgleichen</button><button class="btn sm ghost" data-a="au-out">Abmelden</button></div></div>`;
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


/* ================= Mehr: Auswertung, Archiv, Notizen, Markiert, Suche, Lernkarten, Regel-Karten, Ablauf, Methoden, Ruhe, Hinweise ================= */
const pc=x=>Math.round(100*x);
const accA=a=>a.length?a.reduce((t,e)=>t+e.o,0)/a.length:null;
const med=a=>{if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y);return b[Math.floor(b.length/2)];};
function weakTags(){const L=ST.log.filter(e=>e.g).slice(-800),g={};for(const e of L){const k=e.a+'|'+e.g;const x=g[k]||(g[k]={a:e.a,c:e.c,g:e.g,n:0,w:0});x.n++;if(!e.o)x.w++;}
  return Object.values(g).filter(x=>x.w>=2&&x.w/x.n>=.25).sort((a,b)=>(b.w*b.w/b.n)-(a.w*a.w/a.n)).slice(0,6);}
function auswView(){
  const now=Date.now(),L=ST.log,a7=L.filter(e=>e.t>=now-7*DMS),p7=L.filter(e=>e.t<now-7*DMS&&e.t>=now-14*DMS);
  const pat=[];
  if(a7.length>=10&&p7.length>=10){const d=Math.round(100*(accA(a7)-accA(p7)));pat.push([d>=0?'Trend: besser':'Trend: schlechter',`Letzte 7 Tage ${pc(accA(a7))} % richtig, die 7 Tage davor ${pc(accA(p7))} % (${d>=0?'+':''}${d} Prozentpunkte).`,d<0]);}
  else pat.push(['Trend','Noch zu wenig Daten für den Wochenvergleich (je mindestens 10 Antworten).',0,1]);
  const W=L.filter(e=>!e.o&&e.d>800&&e.d<600000).map(e=>e.d),R=L.filter(e=>e.o&&e.d>800&&e.d<600000).map(e=>e.d);
  if(W.length>=8&&R.length>=8){const mw=med(W),mr=med(R),f=x=>Math.round(x/1000)+' s';
    pat.push(mw<mr*.6?['Zu schnell bei Fehlern',`Falsche Antworten gibst du im Mittel nach ${f(mw)}, richtige nach ${f(mr)}. Viele Fehler sind wohl Flüchtigkeitsfehler: Aufgabe ganz lesen, dann antworten.`,1]:mw>mr*1.6?['Viel Zeit bei schweren Aufgaben',`Falsch: ${f(mw)}, richtig: ${f(mr)}. Im Test gilt: Nach etwa einer Minute eine Wahl treffen und weitermachen.`,1]:['Tempo passt',`Richtig im Mittel ${f(mr)}, falsch ${f(mw)}. Kein auffälliges Muster.`,0]);}
  else pat.push(['Tempo','Noch zu wenig Daten (je 8 richtige und falsche Antworten).',0,1]);
  const C=L.filter(e=>e.f===2),G=L.filter(e=>e.f===0);
  if(C.length>=8){const w=C.filter(e=>!e.o).length/C.length;pat.push(w>=.2?['Du überschätzt dich',`Bei „Sicher“ ist ${pc(w)} % falsch. Prüfe sichere Antworten noch einmal kurz.`,1]:['Gute Selbsteinschätzung',`Bei „Sicher“ ist nur ${pc(w)} % falsch.`,0]);
    if(G.length>=5&&accA(G)>=.5)pat.push(['Du unterschätzt dich',`Geratene Antworten sind zu ${pc(accA(G))} % richtig. Du weißt mehr, als du denkst.`,0]);}
  else pat.push(['Selbsteinschätzung','Noch zu wenig Daten. Beantworte mindestens 8 Aufgaben mit „Sicher“.',0,1]);
  const slot=h=>h<12?'Vormittag':h<17?'Nachmittag':'Abend';const by={};L.forEach(e=>{const k=slot(new Date(e.t).getHours());(by[k]=by[k]||[]).push(e);});
  const sl=Object.entries(by).filter(([,v])=>v.length>=15).map(([k,v])=>[k,accA(v)]).sort((x,y)=>y[1]-x[1]);
  if(sl.length>=2)pat.push(['Beste Tageszeit',`${sl[0][0]}: ${pc(sl[0][1])} % richtig, ${sl[sl.length-1][0]}: ${pc(sl[sl.length-1][1])} %. Lerne Schweres möglichst am ${sl[0][0]}.`,0]);
  const wk=weakTags();
  const wb=AREAS.map(a=>{const x=a7.filter(e=>e.a===a.id),y=p7.filter(e=>e.a===a.id);return `<tr><td>${SHORT[a.id]}</td><td>${x.length}</td><td>${x.length?pc(accA(x))+' %':'–'}</td><td>${x.length&&y.length?((accA(x)>=accA(y)?'+':'')+Math.round(100*(accA(x)-accA(y)))):'–'}</td></tr>`;}).join('');
  return head('Auswertung','Wochenbericht, schwache Themen und deine Muster. Wird mit jeder Antwort genauer.','Profil')+`
   <div class="sec">Diese Woche</div><div class="card"><table class="tb st"><tr><th>Bereich</th><th>Antw.</th><th>Quote</th><th>± Vorwoche</th></tr>${wb}</table></div>
   <div class="sec">Schwache Themen</div>${wk.length?`<div class="list">${wk.map((x,i)=>`<button class="li" data-a="weak" data-i="${i}"><span class="ic" style="background:${(AREA_COL[x.a]||['#eee'])[0]};color:${(AREA_COL[x.a]||[0,'#333'])[1]}">${ICO(AREA_IC[x.a]||I.warn,18)}</span><span class="tx"><b>${H(x.g)}</b><span class="s">${x.w} von ${x.n} falsch · gezielt üben</span></span>${ICO(I.chev,18)}</button>`).join('')}</div>`:'<p class="sub pad">Noch keine auffälligen Schwächen (ab 2 Fehlern und 25 % Fehlerquote je Thema).</p>'}
   <div class="sec">Deine Muster</div>${pat.map(([t,d,bad,nd])=>`<div class="card pat ${bad?'bad':''} ${nd?'nd':''}"><b>${H(t)}</b><p class="sub">${H(d)}</p></div>`).join('')}`;
}
function weakItems(x){
  const bank=Object.values(BANKBY).flat().filter(q=>(q.tag||'')===x.g);
  if(bank.length)return mix(bank).slice(0,15).map(q=>Q(q));
  if(GEN[x.c]){const out=[];for(let k=0;k<60&&out.length<12;k++){try{const q=GEN[x.c](lvOf(x.c));if(tagOf(q)===x.g)out.push(Q(q));}catch(e){}}if(out.length)return out;return genPick(x.c,10).map(q=>Q(q));}
  return areaItems(x.a);
}
function archView(){
  if(V.arg!=null&&ST.arch[V.arg]){const r=ST.arch[V.arg];return head(r.title,`${new Date(r.t).toLocaleString('de-AT',{dateStyle:'medium',timeStyle:'short'})} · ${r.ok}/${r.n} richtig · ${mmss(r.dur/1000)}`,'Archiv')+`<div class="card">${r.R.map(x=>`<div class="arw ${x.ok?'ok':'bad'}"><span class="rd">${x.ok?'✓':'✕'}</span><div><p class="pre">${H(x.q)}</p><small>Deine Antwort: ${H(x.g)}${x.ok?'':' · Richtig: '+H(x.r)}</small></div></div>`).join('')}</div>`;}
  return head('Ergebnis-Archiv',`${ST.arch.length} gespeicherte Runden (die letzten 40).`,'Profil')+(ST.arch.length?`<div class="list">${ST.arch.map((r,i)=>`<button class="li" data-a="go" data-v="archiv" data-x="${i}"><span class="tx"><b>${H(r.title)}</b><span class="s">${new Date(r.t).toLocaleString('de-AT',{dateStyle:'short',timeStyle:'short'})} · ${r.n} Aufgaben</span></span><span class="val">${Math.round(100*r.ok/r.n)} %</span>${ICO(I.chev,18)}</button>`).join('')}</div>`:'<p class="sub pad">Noch keine Runde abgeschlossen.</p>');
}
let NF='';
function notesView(){
  const all=Object.entries(ST.notes).map(([k,v])=>typeof v==='string'?[k,{t:v,q:'',ts:0}]:[k,v]).sort((a,b)=>(b[1].ts||0)-(a[1].ts||0));
  const f=NF.toLowerCase(),L=f?all.filter(([,v])=>(v.t+' '+v.q).toLowerCase().includes(f)):all;
  return head('Notizen',`${all.length} Notizen zu Aufgaben.`,'Profil')+`<input class="in" id="nsearch" placeholder="Notizen durchsuchen …" value="${H(NF)}">`+(L.length?L.map(([k,v])=>`<div class="card"><p class="pre sub">${H(v.q||'')}</p>${v.a?`<p class="fine left">Richtig: ${H(v.a)}</p>`:''}<p class="pre"><b>${H(v.t)}</b></p><div class="row">${v.id&&QBYID[v.id]?`<button class="pill" data-a="qone" data-x="${H(v.id)}">Nochmal üben</button>`:''}<button class="pill" data-a="ndel" data-x="${H(k)}">Löschen</button></div></div>`).join(''):'<p class="sub pad">Keine Notizen. Nach jeder Antwort kannst du unter „Notiz“ etwas festhalten.</p>');
}
function markView(){
  const ids=Object.keys(ST.mk).filter(id=>QBYID[id]);
  return head('Markierte Fragen',`${ids.length} mit Stern markiert.`,'Profil')+(ids.length?`<button class="btn" data-a="mkrun">Alle ${ids.length} üben</button><div class="card">${ids.map(id=>`<div class="arw"><div><p class="pre">${H(QBYID[id].q)}</p><small>${H(CAT[QBYID[id].cat]?CAT[QBYID[id].cat].t:'')}</small></div><button class="pill" data-a="unmk" data-x="${H(id)}">Entfernen</button></div>`).join('')}</div>`:'<p class="sub pad">Noch nichts markiert. Tippe bei einer Frage auf den Stern.</p>');
}
let SQ='';
function suchView(){
  const f=SQ.trim().toLowerCase();let res=[];
  if(f.length>=3)res=Object.values(QBYID).filter(q=>(String(q.q)+' '+(q.e||'')+' '+(q.tag||'')).toLowerCase().includes(f)).slice(0,40);
  return head('Fragen suchen','Durchsucht alle festen Fragen, Texte und Erklärungen.','Profil')+`<input class="in" id="qsearch" placeholder="Suchbegriff, z. B. Dativ, Prozent, StVO …" value="${H(SQ)}" autocapitalize="off">`+
   (f.length<3?'<p class="sub pad">Mindestens 3 Zeichen eingeben.</p>':res.length?`<p class="sub pad">${res.length}${res.length===40?'+':''} Treffer</p><button class="btn alt" data-a="sqrun">Diese Fragen üben</button>${res.map(q=>`<details class="card"><summary class="pre">${H(String(q.q).slice(0,160))}</summary><p><small>Richtig:</small> ${H(q.t==='mc'?q.c:q.t==='num'?fmt(q.ans):(q.ans||[])[0])}</p>${q.e?`<p class="sub">${H(q.e)}</p>`:''}</details>`).join('')}`:'<p class="sub pad">Keine Treffer.</p>');
}
const DECKS={at:'Österreich',st:'Steiermark',po:'Polizei, Recht, Verkehr',av:'Aufnahmeverfahren 2026'};
let K=null;
function kartView(){
  if(!K)return head('Lernkarten','Vorderseite lesen, Antwort im Kopf geben, umdrehen und ehrlich einschätzen. Nicht Gewusstes kommt früher wieder.','Profil')+`<div class="list">${Object.entries(DECKS).map(([k,t])=>{const ids=(BANKBY[k]||[]).map(q=>q.id);return `<button class="li" data-a="deck" data-x="${k}"><span class="ic" style="background:var(--tint);color:#fff">${ICO(I.know,18)}</span><span class="tx"><b>${t}</b><span class="s">${ids.length} Karten · ${sureCount(ids)} sicher</span></span>${ICO(I.chev,18)}</button>`;}).join('')}</div>`;
  if(K.i>=K.list.length)return head(DECKS[K.d],null,'Lernkarten')+`<div class="res"><div class="bigp">${K.ok}/${K.list.length}</div><p class="lead">gewusst</p></div><button class="btn" data-a="deck" data-x="${K.d}">Weitere 20 Karten</button><button class="btn ghost" data-a="kend">Andere Kartei</button>`;
  const q=K.list[K.i],ans=q.t==='mc'?q.c:q.t==='num'?fmt(q.ans):(q.ans||[])[0];
  return `<button class="back" data-a="kend">${ICO(I.back,20)}<span>Lernkarten</span></button><div class="studt"><span class="track"><i style="width:${Math.round(100*K.i/K.list.length)}%"></i></span><b>${K.i+1}/${K.list.length}</b></div>
   <button class="fcard ${K.flip?'on':''}" data-a="flip"><span class="fin"><span class="ff"><small>${H(q.tag||DECKS[K.d])}</small><span class="fq">${H(q.q)}</span><span class="fine">Tippen zum Umdrehen</span></span><span class="fb2"><small>Antwort</small><span class="fa">${H(ans)}</span>${q.e?`<span class="fe">${H(q.e)}</span>`:''}</span></span></button>
   ${K.flip?`<div class="row"><button class="btn alt wide" data-a="kr" data-v="0">Nicht gewusst</button><button class="btn wide" data-a="kr" data-v="1">Gewusst</button></div>`:''}`;
}
let RK={f:'all',i:0,show:false};
function regelView(){
  const keys=Object.keys(ST.rk).filter(k=>RK.f==='all'||ST.rk[k].ar===RK.f).sort((a,b)=>ST.rk[b].n-ST.rk[a].n||ST.rk[b].t-ST.rk[a].t);
  let h=head('Regel-Karten','Nach jedem Fehler in Logik oder Sprache landet die passende Regel hier. Blättere sie vor dem Test durch. Was sitzt, nimmst du heraus.','Profil')+`<div class="seg">${[['all','Alle'],['logik','Logik'],['sprache','Sprache']].map(([k,l])=>`<button class="${RK.f===k?'on':''}" data-a="rkf" data-v="${k}">${l}</button>`).join('')}</div>`;
  if(!keys.length)return h+'<p class="sub pad">Noch keine Regel-Karten. Sie entstehen automatisch bei Fehlern.</p>';
  const k=keys[RK.i%keys.length],x=ST.rk[k];
  return h+`<div class="card"><div class="ch"><span class="chip" style="background:var(--fill)">${H(x.tg)}</span><span class="sub">${RK.i%keys.length+1}/${keys.length}${x.n>1?' · '+x.n+'× falsch':''}</span></div><p class="pre"><b>${H(x.q)}</b></p>
   ${RK.show?`<div class="ra"><small>Richtig</small><div>${H(x.a)}</div></div>${x.e?`<p class="exp">${H(x.e)}</p>`:''}<div class="row"><button class="btn sm alt" data-a="rkdel" data-x="${H(k)}">Sitzt, herausnehmen</button><button class="btn sm" data-a="rknext">Nächste Karte</button></div>`:`<div class="row"><button class="btn sm" data-a="rkshow">Regel zeigen</button><button class="btn sm alt" data-a="rknext">Weiter</button></div>`}</div>`;
}
function ablaufView(){const box=(k,t)=>`<button class="cbrow ${ST.chk[k]?'on':''}" data-a="chk" data-x="${H(k)}" role="checkbox" aria-checked="${!!ST.chk[k]}"><span class="cbk">${ST.chk[k]?'✓':''}</span><span>${H(t)}</span></button>`;
  return head('Ablauf und Fristen',null,'Profil')+'<div class="legacy">'+ABLAUF_HTML.replace('%%CHKV%%',CHK_VOR.map(([k,t])=>box('v_'+k,t)).join('')).replace('%%CHKT%%',CHK_T2.map(([k,t])=>box('t_'+k,t)).join(''))+'</div>';}
function methView(){return head('Wie die App lernt','Jede Funktion beruht auf Lernforschung.','Profil')+METHODS.map(m=>`<div class="card"><b>${H(m[0])}</b><p class="sub">${H(m[1])}</p><p class="fine left">${H(m[2])}${m[3]&&/^https:\/\//.test(m[3])?` · <a href="${H(m[3])}" target="_blank" rel="noopener">Quelle</a>`:''}</p></div>`).join('');}
function infoView(){return head('Hinweise und Quellen',null,'Profil')+'<div class="legacy">'+INFO_HTML+'</div>';}
let RU={w:null,b:null};
function ruheView(){
  return head('Ruhig in den Test','Vier kurze Werkzeuge für die Tage vor dem Test und den Testmorgen. Alles bleibt auf deinem Gerät.','Profil')+`
   <div class="sec">1 · Sorgen aufschreiben (10 Minuten)</div><div class="card"><p class="sub">Schreib direkt vor dem Üben oder am Testmorgen ehrlich auf, was dich beunruhigt. Sehr nervösen Schülern half das in einer Studie (Ramirez &amp; Beilock 2011, Science).</p><textarea class="in ta" id="rutxt" rows="6" placeholder="Was mich am Test beunruhigt …">${H(ST.ruhe||'')}</textarea><div class="row"><button class="btn sm" data-a="ru-w">${RU.w?'Stopp':'10-Minuten-Uhr starten'}</button><button class="btn sm ghost" data-a="ru-del">Text löschen</button></div><p class="sub" id="rutime" role="timer">${RU.w?'':'Nicht schön schreiben, nur ehrlich.'}</p></div>
   <div class="sec">2 · Langsam atmen (2 Minuten)</div><div class="card"><p class="sub">4 Sekunden ein, 6 Sekunden aus. Langsames Ausatmen beruhigt den Puls.</p><div class="brw"><div class="brc" id="brc">${RU.b?'':'Bereit'}</div><p class="sub" id="brl" aria-live="polite">${RU.b?'':'12 Atemzüge'}</p><button class="btn sm" data-a="ru-b">${RU.b?'Stopp':'Atmen starten'}</button></div></div>
   <div class="sec">3 · Aufregung umdeuten</div><div class="card"><p class="sub">Herzklopfen ist Energie für Leistung, kein Zeichen von Versagen. Sag dir vor dem Start: <b>„Ich bin aufgeregt, weil es mir wichtig ist. Mein Körper macht mich bereit.“</b></p></div>
   <div class="sec">4 · Testtag-Plan</div><div class="card"><ul class="lx"><li>Am Vorabend kein neuer Stoff, nur kurz wiederholen. Ausreichend schlafen.</li><li>Ausweis, Einladung und Lebenslauf (für Testtag 2) einpacken, Anfahrt mit Puffer planen.</li><li>Frühstücken und Wasser trinken. Der Computertest dauert etwa 2–3 Stunden.</li><li>Erklärungen und Übungsaufgaben vor jeder Aufgabengruppe in Ruhe lesen.</li><li>Bei einer schweren Aufgabe nicht hängen bleiben. Im Persönlichkeitsteil ehrlich und gleichbleibend antworten.</li></ul><p class="fine left">Ablauf laut polizeikarriere.gv.at, Stand November 2026. Maßgeblich ist deine Einladung.</p></div>`;
}
function ruStop(){if(RU.w){clearInterval(RU.w.iv);RU.w=null;}if(RU.b){clearTimeout(RU.b.to);RU.b=null;}}
function icsFile(){
  const [hh,mm]=(ST.rem||'18:00').split(':').map(Number);const d=new Date();d.setDate(d.getDate()+1);
  const p=n=>String(n).padStart(2,'0');const ds=`${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(hh)}${p(mm)}00`;
  const url=location.href.split('#')[0];
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aufnahmetest Trainer//DE','BEGIN:VEVENT','UID:atn-'+Date.now()+'@aufnahmetest','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART:'+ds,'DURATION:PT20M','RRULE:FREQ=DAILY;COUNT=60','SUMMARY:Aufnahmetest üben (20 Min.)','DESCRIPTION:Tagesplan im Aufnahmetest Trainer: '+url,'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:Zeit zum Üben','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
}
/* ================= Runde (Session) ================= */
function start(title,items,mode,meta){
  items=items.filter(Boolean);if(!items.length){toast('Gerade keine Aufgaben verfügbar.');return;}
  stopSpeak();
  S={qt:Date.now(),sel:null,title,items,i:0,mode:mode||'learn',meta:meta||{},res:[],ans:false,given:null,t0:Date.now(),end:mode==='exam'?Date.now()+EXAM_MIN*60000:0,zoom:false};
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
      if(!a&&S.sel===i)c='sel';
      return `<button class="opt ${c}" data-a="pick" data-i="${i}" ${a?'disabled':''}><span class="lab">${'ABCDEF'[i]}</span><span class="ot">${q.oh?o:H(o)}</span>${c==='ok'?'<span class="mk">✓</span>':c==='bad'?'<span class="mk">✕</span>':''}</button>`;}).join('')}</div>`;
  }else{
    opts=`<form class="inrow" data-a="numform"><input id="ans" class="in big ${a&&!ex?(S.okk?'ok':'bad'):''}" ${q.t==='num'?'inputmode="decimal"':'autocapitalize="off" spellcheck="false"'} autocomplete="off" placeholder="Antwort" value="${a?H(S.given):''}" ${a?'disabled':''} aria-label="Antwort">${a?'':(useConf()?'':'<button class="btn" type="submit">Prüfen</button>')}</form>${!a&&useConf()?confRow():''}`;
  }
  const passage=it.p?`<details class="card psum"><summary>Text nochmal anzeigen</summary><div class="ptx">${H(it.p.text)}</div></details>`:'';
  return `<div class="sw2">${sessHead()}
   <div class="chips"><span class="chip" style="background:${(AREA_COL[q.area]||['var(--fill)'])[0]};color:${(AREA_COL[q.area]||[0,'var(--ink)'])[1]}">${H(SHORT[q.area]||'Wissen')}${tag?' · '+H(tag):''}</span>${srsW&&!ex?'<span class="chip warnc">Kommt wieder: war falsch</span>':''}</div>
   ${passage}${q.fig?`<div class="fig">${q.fig}</div>`:''}
   ${qText(q)}
   ${opts}
   ${a&&!ex?feedback(it):''}
   ${!a&&q.t==='mc'&&useConf()&&S.sel!=null?confRow():''}
   <div class="qfoot">${q.id&&QBYID[q.id]?`<button class="rbtn ${ST.mk[q.id]?'star':''}" data-a="star" aria-label="${ST.mk[q.id]?'Markierung entfernen':'Frage markieren'}" aria-pressed="${!!ST.mk[q.id]}">${ICO('<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>',20)}</button>`:''}${a?'':`<button class="rbtn" data-a="sayq" aria-label="Frage vorlesen">${ICO(I.spk,20)}</button>`}${a?`<button class="btn dark wide" data-a="next">${S.i>=S.items.length-1?'Auswertung':'Weiter'}</button>`:(q.t==='mc'&&!(useConf()&&S.sel!=null)?'<span class="fine">'+(useConf()?'Antwort wählen, dann sagen wie sicher':'Tippe auf eine Antwort')+'</span>':'')}</div></div>`;
}
function qText(q){
  const t=String(q.q);
  if(q.mono&&t.includes('\n')){const i=t.indexOf('\n');return `<h2 class="qt">${H(t.slice(0,i))}</h2><div class="seq">${H(t.slice(i+1).trim())}</div>`;}
  return `<h2 class="qt ${t.length>160?'long':''}">${H(t)}</h2>`;
}
function rightAns(q){if(q.t==='mc')return q.oh?q.o[q.ci]:H(q.o[q.ci]);if(q.t==='num')return H(fmt(q.ans));return H((q.ans||[])[0]);}
function feedback(it){
  const q=it.q;let mark='';try{if(q.mk)mark=markHtml(q,S.given);}catch(e){}
  const nid=q.id||('h'+hashS(q.q));const nn=ST.notes[nid];const note=nn?(typeof nn==='string'?nn:nn.t):'';
  const link=q.nurl&&/^https:\/\//.test(q.nurl)?` · <a href="${H(q.nurl)}" target="_blank" rel="noopener">im RIS</a>`:'';
  return `<div class="fb ${S.okk?'ok':'bad'}" tabindex="-1" id="fb"><b class="vd">${S.okk?ICO(I.check,20)+' Richtig':ICO(I.x,20)+' Leider falsch'}</b>
   ${S.okk?'':`<div class="ra"><small>Richtige Antwort</small><div>${rightAns(q)}</div></div>`}
   ${q.e?`<p class="exp">${H(q.e)}</p>`:''}${mark?`<div class="mark">${mark}</div>`:''}${q.norm?`<p class="fine left"><b>Rechtsgrundlage:</b> ${H(q.norm)}${link}</p>`:''}
   ${q.id&&!S.okk?'<p class="fine left">Diese Frage kommt bald wieder. Richtig beantwortet, dann nach 1, 3, 7, 14 und 30 Tagen.</p>':q.id?`<p class="fine left">Nächste Wiederholung in ${BOXD[(ST.qs[q.id]||{b:1}).b]||1} ${BOXD[(ST.qs[q.id]||{b:1}).b]===1?'Tag':'Tagen'}.</p>`:''}</div>
   <details class="acc" ${S.kiOpen?'open':''}><summary>${ICO(I.spark,18)}<span>KI-Coach fragen</span><i class="arr">${ICO(I.chev,16)}</i></summary><div class="accb">
    ${kiOn()?`<div class="qk"><button class="pill" data-a="ki" data-v="einfach">Einfacher erklären</button><button class="pill" data-a="ki" data-v="merk">Merksatz</button><button class="pill" data-a="ki" data-v="aehnlich">Ähnliche Aufgabe</button></div>
     <div class="inrow"><input class="in" id="kiin" placeholder="Eigene Frage zur Aufgabe …"><button class="btn sm" data-a="ki" data-v="frei">Fragen</button></div><div class="aiout" id="kiout" aria-live="polite"></div>`:`<p class="sub">${ST.ki?'Für den KI-Coach im Profil einen kostenlosen Gemini-Schlüssel eintragen.':'KI-Coach ist im Profil ausgeschaltet.'}</p>`}
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
const useConf=()=>ST.conf&&S&&S.mode!=='exam';
function confRow(){return `<div class="conf"><span class="fine left">Wie sicher bist du?</span><div class="confb"><button class="btn sm" data-a="conf" data-f="2">Sicher</button><button class="btn sm alt" data-a="conf" data-f="1">Eher sicher</button><button class="btn sm alt" data-a="conf" data-f="0">Geraten</button></div></div>`;}
function answer(g,f){
  if(!S||S.ans)return;S.f=f;const it=S.items[S.i],q=it.q;
  if(q.t!=='mc'&&String(g).trim()===''){toast('Bitte zuerst eine Antwort eingeben.');return;}
  const ok=isOk(q,g);S.ans=true;S.given=g;S.okk=ok;S.kiOpen=false;
  S.res.push({q,ok,g,sc:it.sc,p:it.p&&it.p.id});
  record(q,ok,it);
  try{navigator.vibrate&&navigator.vibrate(ok?15:[30,40,30]);}catch(e){}
  if(S.mode==='exam'){nextItem();return;}
  render();
  const fb=document.getElementById('fb');if(fb){fb.focus({preventScroll:true});fb.scrollIntoView({behavior:'smooth',block:'nearest'});}
}
const tagOf=q=>q.tg||q.tag||(typeof TIDN!=='undefined'&&TIDN[q.tid])||(CAT[q.cat]&&CAT[q.cat].t)||'';
const plain=h=>String(h==null?'':h).replace(/<[^>]*>/g,'').trim()||'(Grafik)';
function rightPlain(q){if(q.t==='mc')return q.oh?'Grafik '+'ABCDEF'[q.ci]:plain(q.o[q.ci]);if(q.t==='num')return fmt(q.ans);return (q.ans||[])[0];}
function givenPlain(q,g){if(q.t==='mc')return g==null?'–':q.oh?'Grafik '+'ABCDEF'[g]:plain(q.o[g]);return String(g==null?'–':g);}
function record(q,ok,it){
  const e={t:Date.now(),a:q.area,c:q.cat,o:ok?1:0,g:tagOf(q).slice(0,40),m:S?S.mode:'',d:S&&S.qt?Date.now()-S.qt:0};if(S&&S.f!=null)e.f=S.f;if(q.id)e.i=q.id;
  ST.log.push(e);
  if(!ok&&(q.area==='logik'||q.area==='sprache')&&q.cat!=='sz'){const k=q.id||('h'+hashS(q.q));const r=ST.rk[k]||{n:0};Object.assign(r,{q:String(q.q).slice(0,400),a:rightPlain(q),e:q.e||'',tg:tagOf(q),ar:q.area,n:r.n+1,t:Date.now()});ST.rk[k]=r;const ks=Object.keys(ST.rk);if(ks.length>120){ks.sort((x,y)=>ST.rk[x].t-ST.rk[y].t).slice(0,ks.length-120).forEach(x=>delete ST.rk[x]);}}if(ST.log.length>1500)ST.log.splice(0,ST.log.length-1500);
  ST.days[dk()]=(ST.days[dk()]||0)+1;
  if(q.id&&QBYID[q.id]){const r=ST.qs[q.id]||{b:0,n:0,w:0};r.n++;if(ok){r.b=Math.min(5,r.b+1);r.due=Date.now()+BOXD[r.b]*DMS;}else{r.b=0;r.w++;r.due=Date.now()+DMS/2;}ST.qs[q.id]=r;}
  else if(!q.id&&q.cat!=='sz'){if(!ok){const c=Object.assign({},q);delete c.o;delete c.ci;delete c.area;ST.wg.unshift(c);ST.wg=ST.wg.slice(0,30);}else if(it&&it.wgi!=null){ST.wg=ST.wg.filter(x=>x!==it.wgref);}}
  if(q.cat&&GEN[q.cat])adapt(q.cat);
  save();
}
function nextItem(){
  stopSpeak();
  if(S.i>=S.items.length-1){finish();return;}
  S.i++;S.ans=false;S.given=null;S.zoom=false;S.sel=null;S.qt=Date.now();
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
  if(R.length){ST.arch.unshift({t:Date.now(),title:S.title,mode:S.mode,ok,n:R.length,dur:Date.now()-S.t0,R:R.map(x=>({q:String(x.q.q).slice(0,220),ok:x.ok?1:0,g:givenPlain(x.q,x.g).slice(0,80),r:String(rightPlain(x.q)).slice(0,80),id:x.q.id||''}))});ST.arch=ST.arch.slice(0,40);}
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
async function llm(prompt,onText){
  if(AI){const r=await AI(prompt,{modelTier:'quick',onText:({text})=>onText(text)});return r.text;}
  if(ST.gkey){const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key='+encodeURIComponent(ST.gkey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}]})});
    const j=await r.json().catch(()=>({}));if(!r.ok)throw {code:r.status===429?'rate_limited':r.status===400||r.status===403?'key':'x'};
    return ((j.candidates||[])[0]&&j.candidates[0].content.parts.map(x=>x.text).join(''))||'';}
  throw {code:'none'};
}
const kiOn=()=>ST.ki&&(AI||ST.gkey);
async function askKI(kind,q,outId,extra){
  const out=document.getElementById(outId);if(!out)return;
  if(!kiOn()){out.textContent='KI-Coach ist nicht eingerichtet (Profil → KI-Coach).';return;}
  const ctx=`Aufgabe: ${q.q}\n${q.t==='mc'?'Antwortmöglichkeiten: '+(q.oh?'(Grafiken)':q.o.join(' | '))+'\n':''}Richtige Antwort: ${q.t==='mc'?(q.oh?'Grafik '+'ABCDEF'[q.ci]:q.o[q.ci]):q.t==='num'?fmt(q.ans):(q.ans||[])[0]}\n${S&&S.given!=null?'Antwort des Lernenden: '+(q.t==='mc'?(q.oh?'Grafik '+'ABCDEF'[S.given]:q.o[S.given]):S.given)+' ('+(S.okk?'richtig':'falsch')+')\n':''}Erklärung aus der App: ${q.e||'-'}`;
  const ask={einfach:'Erkläre die Lösung ganz einfach in 3–5 kurzen Sätzen, Schritt für Schritt.',merk:'Gib einen kurzen, einprägsamen Merksatz oder Trick für diesen Aufgabentyp (max. 3 Sätze).',aehnlich:'Erstelle EINE ähnliche Übungsaufgabe mit gleichem Schwierigkeitsgrad. Zeige zuerst nur die Aufgabe, dann nach einer Leerzeile „Lösung:“ mit kurzer Erklärung.',frei:extra||''}[kind];
  if(!ask){out.textContent='Bitte zuerst eine Frage eingeben.';return;}
  out.textContent='Denkt nach …';out.classList.add('busy');
  try{
    out.textContent=await llm(`Du bist ein freundlicher, präziser Lern-Coach für den Aufnahmetest der österreichischen Polizei (Steiermark). Antworte auf Deutsch (österreichisch, Du-Form), kurz, ohne Markdown-Überschriften. Erfinde keine Fakten über das Aufnahmeverfahren.\n\n${ctx}\n\nAuftrag: ${ask}`,t=>{out.textContent=t;});
  }catch(e){out.textContent=e&&e.code==='rate_limited'?'Gerade zu viele Anfragen. Bitte kurz warten.':e&&e.code==='key'?'Der Gemini-Schlüssel wurde abgelehnt. Prüfe ihn im Profil.':e&&e.code==='not_granted'?'KI-Coach wurde nicht erlaubt.':'KI-Coach gerade nicht erreichbar.';}
  out.classList.remove('busy');
}
async function askIV(i){
  const out=document.getElementById('ivo'+i),inp=document.getElementById('iva'+i);if(!out||!inp)return;
  const a=inp.value.trim();if(!a){out.textContent='Schreib zuerst deine Antwort.';return;}
  out.textContent='Denkt nach …';
  try{out.textContent=await llm(`Du bist Coach für das psychologische Gespräch beim Aufnahmeverfahren der österreichischen Polizei. Gib Feedback auf Deutsch (Du-Form), max. 6 kurze Punkte: was gut ist, was fehlt, ein besserer Formulierungsvorschlag. Ehrlich, nicht übertrieben lobend.\n\nFrage: ${IV[i][1]}\nTipp aus der App: ${IV[i][2]}\nAntwort des Bewerbers: ${a}`,t=>{out.textContent=t;});}
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
   case 'weak':{const x=weakTags()[+b.dataset.i];if(x)start(x.g,weakItems(x),'learn');break;}
   case 'qone':start('Nochmal üben',[Q(QBYID[x])],'learn');break;
   case 'ndel':delete ST.notes[x];save();render();break;
   case 'mkrun':start('Markierte Fragen',mix(Object.keys(ST.mk).filter(id=>QBYID[id])).map(id=>Q(QBYID[id])),'learn');break;
   case 'unmk':delete ST.mk[x];save();render();break;
   case 'sqrun':{const f=SQ.trim().toLowerCase();start('Suche: '+SQ,Object.values(QBYID).filter(q=>(String(q.q)+' '+(q.e||'')+' '+(q.tag||'')).toLowerCase().includes(f)).slice(0,40).map(q=>Q(q)),'learn');break;}
   case 'deck':K={d:x,list:bankPick(x,20),i:0,ok:0,flip:false};render();window.scrollTo(0,0);break;
   case 'kend':K=null;render();break;
   case 'flip':K.flip=!K.flip;render();break;
   case 'kr':{const q=K.list[K.i],ok=v==='1';const sv=S;S=null;record(prepQ(q),ok,null);S=sv;if(ok)K.ok++;K.i++;K.flip=false;render();window.scrollTo(0,0);break;}
   case 'rkf':RK.f=v;RK.i=0;RK.show=false;render();break;
   case 'rkshow':RK.show=true;render();break;
   case 'rknext':RK.i++;RK.show=false;render();break;
   case 'rkdel':delete ST.rk[x];RK.show=false;save();render();break;
   case 'ru-del':ST.ruhe='';save();render();break;
   case 'ru-w':{if(RU.w){clearInterval(RU.w.iv);RU.w=null;render();break;}RU.w={end:Date.now()+600000};RU.w.iv=setInterval(()=>{const el=document.getElementById('rutime');const r=RU.w?RU.w.end-Date.now():0;if(!RU.w||r<=0){if(RU.w)clearInterval(RU.w.iv);RU.w=null;if(el)el.textContent='Zeit um. Gut gemacht, jetzt kannst du loslegen.';const bt=document.querySelector('[data-a="ru-w"]');if(bt)bt.textContent='10-Minuten-Uhr starten';return;}if(el)el.textContent='Noch '+mmss(r/1000);},1000);render();const t=document.getElementById('rutxt');if(t)t.focus();break;}
   case 'ru-b':{if(RU.b){clearTimeout(RU.b.to);RU.b=null;render();break;}RU.b={n:0};render();const step=()=>{const c=document.getElementById('brc'),l=document.getElementById('brl');if(!RU.b||!c)return;if(RU.b.n>=24){RU.b=null;c.className='brc';c.textContent='Fertig';if(l)l.textContent='Gut gemacht.';const bt=document.querySelector('[data-a="ru-b"]');if(bt)bt.textContent='Atmen starten';return;}const inh=RU.b.n%2===0;c.className='brc '+(inh?'in':'out');c.textContent=inh?'Ein':'Aus';if(l)l.textContent=(inh?'Einatmen':'Ausatmen')+' · Atemzug '+(Math.floor(RU.b.n/2)+1)+' von 12';RU.b.n++;RU.b.to=setTimeout(step,(inh?4:6)*1000);};requestAnimationFrame(()=>requestAnimationFrame(step));break;}
   case 'ics':{try{const bl=new Blob([icsFile()],{type:'text/calendar'});const u=URL.createObjectURL(bl);const a2=document.createElement('a');a2.href=u;a2.download='aufnahmetest-erinnerung.ics';document.body.appendChild(a2);a2.click();setTimeout(()=>{URL.revokeObjectURL(u);a2.remove();},2000);}catch(e){toast('Download hier nicht möglich.');}break;}
   case 'au-eye':{const i=document.getElementById('aupw'),j=document.getElementById('aupw2');const sh=i.type==='password';i.type=sh?'text':'password';if(j)j.type=i.type;b.textContent=sh?'Verbergen':'Zeigen';break;}
   case 'dev-stats':devStats();break;
   case 'dev-lv':CATS.forEach(c=>{if(c.gen)ST.lv[c.id]=+v;});save();toast('Stufe '+v+' für alle Generatoren');render();break;
   case 'dev-plan':ST.plan=null;save();toast('Tagesplan wird neu erzeugt');break;
   case 'dev-due':Object.values(ST.qs).forEach(r=>r.due=0);save();toast('Alle gelernten Fragen sind fällig');render();break;
   case 'dev-einst':ST.einst=null;ST.plan=null;save();toast('Einstufung zurückgesetzt');break;
   case 'dev-wg':ST.wg=[];Object.values(ST.qs).forEach(r=>r.w=0);save();toast('Fehlerliste geleert');break;
   case 'dev-onb':ST.onb=false;OB=0;save();V={tab:'home',view:'home',arg:null,seg:'t1'};render();break;
   case 'au-go':A.mode=v||'in';A.kind='mail';A.msg='';A.recovery=false;if(V.view!=='auth')stack.push(Object.assign({},V));V.view='auth';render();window.scrollTo(0,0);break;
   case 'au-mode':A.mode=v;A.msg='';render();break;
   case 'au-kind':A.kind=v;A.msg='';render();break;
   case 'au-verify':sbMfaVerify();break;
   case 'au-reset':sbReset();break;
   case 'au-newpw':sbNewPw();break;
   case 'au-enrollx':(async()=>{try{if(A.enroll)await A.sb.auth.mfa.unenroll({factorId:A.enroll.id});}catch(e){}A.enroll=null;tab('me');})();break;
   case 'au-copysec':{const t=document.getElementById('ausec');try{navigator.clipboard.writeText(t.value).then(()=>toast('Schlüssel kopiert'));}catch(e){t.select();document.execCommand('copy');toast('Schlüssel kopiert');}break;}
   case 'au-out':A.state='off';A.msg='';sbOut();tab('me');break;
   case 'au-mfa-on':sbMfaStart();break;
   case 'au-mfa-go':closeSheet();sbMfaStart();break;
   case 'au-mfa-off':sheet(`<h2>2FA ausschalten?</h2><p class="sub">Dann reicht wieder nur das Passwort zum Anmelden.</p><div class="stackb"><button class="btn red" data-a="au-mfa-off2">Ausschalten</button><button class="btn ghost" data-a="sclose">Abbrechen</button></div>`);break;
   case 'au-mfa-off2':closeSheet();sbMfaOff();break;
   case 'sb-sync':sbPull();break;

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
   case 'pick':if(useConf()){S.sel=+b.dataset.i;render();const c=document.querySelector('.conf');if(c)c.scrollIntoView({behavior:'smooth',block:'nearest'});}else answer(+b.dataset.i);break;
   case 'conf':{const q=S.items[S.i].q;if(q.t==='mc'){if(S.sel!=null)answer(S.sel,+b.dataset.f);}else{const i=document.getElementById('ans');answer(i?i.value:'',+b.dataset.f);}break;}
   case 'star':{const id=S.items[S.i].q.id;if(ST.mk[id])delete ST.mk[id];else ST.mk[id]=Date.now();save();render();break;}
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
document.addEventListener('submit',ev=>{if(ev.target.closest('[data-a="au-form"]')){ev.preventDefault();sbSubmit();return;}const f=ev.target.closest('[data-a="numform"]');if(!f)return;ev.preventDefault();if(useConf()){toast('Wähle unten, wie sicher du bist.');return;}const i=document.getElementById('ans');answer(i?i.value:'');});
document.addEventListener('input',ev=>{
  const t=ev.target;
  if(t.id==='nsearch'){NF=t.value;clearTimeout(t._t);t._t=setTimeout(()=>{render();const n=document.getElementById('nsearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}},300);}
  if(t.id==='qsearch'){SQ=t.value;clearTimeout(t._t);t._t=setTimeout(()=>{render();const n=document.getElementById('qsearch');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}},400);}
  if(t.id==='rutxt'){ST.ruhe=t.value;clearTimeout(t._t);t._t=setTimeout(save,500);}
  if(t.id==='note'){const id=t.dataset.nid;const q=S&&S.items[S.i]&&S.items[S.i].q;if(t.value.trim())ST.notes[id]={t:t.value,q:q?String(q.q).slice(0,300):'',a:q?rightPlain(q):'',c:q?q.cat:'',id:q&&q.id||'',ts:Date.now()};else delete ST.notes[id];clearTimeout(t._t);t._t=setTimeout(save,600);}
  if(t.dataset&&t.dataset.a==='rate'){ST.tts.rate=+t.value;setRateLive();const l=document.getElementById('rtv');if(l)l.textContent=String(ST.tts.rate).replace('.',',')+'×';clearTimeout(t._t);t._t=setTimeout(save,400);}
});
document.addEventListener('change',ev=>{
  const t=ev.target;
  if(t.id==='gkey'){ST.gkey=t.value.trim();save();toast(ST.gkey?'Gemini-Schlüssel gespeichert':'Schlüssel entfernt');render();}
  if(t.id==='remt'){ST.rem=t.value||'18:00';save();}
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

sbInit();render();capInit();
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&!/claude/.test(location.hostname)&&window.top===window)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}
})();
