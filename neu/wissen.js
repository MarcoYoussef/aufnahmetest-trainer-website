/* Wissen: Themen, Kurzfassungen, Eselsbrücken, Selbsttests, Bilder und Vorlese-Texte (aus der bisherigen App übernommen) */
const LEXI={};LEX.forEach(g=>g.items.forEach(x=>{LEXI[x.id]=x;x.cat=g.cat;x.g=g.g;}));const LEX_ALL=LEX.flatMap(g=>g.items);
const BL='#0A5FC8',PU='#8E3FC4',GN='#1B7F37',RD='#C4161C',OR='#B45309',GY='#6C6C70',IN='#4F46E5';
const TOP=[
{k:'faelle',t:'Die vier Fälle',e:'🧩',c:BL,lead:'Wer? Wessen? Wem? Wen? Mit vier Fragen erkennst du jeden Fall.',cheat:[['Nominativ','Wer oder was?  ·  der Mann',BL],['Genitiv','Wessen?  ·  des Mannes',PU],['Dativ','Wem?  ·  dem Mann',GN],['Akkusativ','Wen oder was?  ·  den Mann',RD]]},
{k:'zeiten',t:'Die Zeiten',e:'⏳',c:OR,lead:'Sechs Zeitformen, ein Bauplan: Hilfsverb vorne, Partizip hinten.',cheat:[['Präsens','ich gehe  ·  jetzt',GN],['Präteritum','ich ging  ·  Bericht',OR],['Perfekt','ich bin gegangen  ·  Alltag',OR],['Plusquamperfekt','ich war gegangen  ·  davor',PU],['Futur I','ich werde gehen  ·  Zukunft',BL],['Futur II','ich werde gegangen sein  ·  dann fertig',IN]]},
{k:'steigerung',t:'Steigerung',e:'📈',c:RD,lead:'gut, besser, am besten: Vergleichen mit drei Stufen.',cheat:[['Positiv','schnell',GY],['Komparativ','schneller  ·  + er',OR],['Superlativ','am schnellsten  ·  am + sten',RD]]},
{k:'satz',t:'Sätze und Wörter',e:'🧱',c:IN,lead:'Wortarten, Satzbau, Passiv und Konjunktiv.'},
{k:'rs',t:'Rechtschreibung',e:'✏️',c:'#0E7490',lead:'Die Regeln, die in jedem Test vorkommen.'},
{k:'bruch',t:'Bruchrechnen',e:'🍕',c:GN,lead:'Brüche sehen und verstehen: mit Bildern statt nur Formeln.',cheat:[['+ und −','gleicher Nenner nötig  ·  1/2 + 1/3 = 5/6',GN],['mal','oben mal oben, unten mal unten  ·  2/3 · 4/5 = 8/15',OR],['geteilt','mal Kehrwert  ·  2/3 : 4/5 = 5/6',PU]]},
{k:'rechnen',t:'Rechnen',e:'🧮',c:'#8C6A44',lead:'Prozent, Dreisatz, Einheiten und Tempo, Schritt für Schritt.'},
{k:'logik',t:'Logik',e:'🔢',c:GY,lead:'Zahlen- und Buchstabenreihen sicher knacken.'}
];
LEX.forEach((g,i)=>{g.items.forEach(x=>{x.ti=i;});});
const TOPK={};TOP.forEach((t,i)=>{TOPK[t.k]=i;});
const LX={
fall0:{k:'Jeder Fall hat eine Frage: **Wer?** (Nom.), **Wessen?** (Gen.), **Wem?** (Dat.), **Wen?** (Akk.). Nur beim männlichen Wort sind alle vier Artikel verschieden.',m:'Der Mann (Wer?), des Mannes Hut (Wessen?), ich helfe dem Mann (Wem?), ich sehe den Mann (Wen?).',q:[['Welche Frage gehört zum Dativ?',['Wer oder was?','Wessen?','Wem?','Wen oder was?'],2],['Bei welchem Geschlecht unterscheiden sich alle vier Fälle im Artikel?',['männlich','weiblich','sächlich','Plural'],0],['Ich sehe ___ Mann. (Akkusativ)',['der','den','dem','des'],1]]},
nom:{c:BL,k:'Nominativ = das Subjekt, **Wer oder was?** Er steht auch nach sein, werden, bleiben.',q:[['Welcher Fall steht nach „sein“, „werden“ und „bleiben“?',['Nominativ','Genitiv','Dativ','Akkusativ'],0],['In „Der Hund bellt“ ist „Der Hund“ …',['Subjekt im Nominativ','Objekt im Akkusativ','Objekt im Dativ','Genitivattribut'],0]]},
gen:{c:PU,k:'Genitiv = **Wessen?** Besitz und Zugehörigkeit. Männlich und sächlich bekommen -s oder -es. Merke: wegen, trotz, während, statt.',m:'Wegen des Wetters, trotz des Verbots, während der Fahrt: Die Wörter wegen, trotz, während, statt wollen den Genitiv.',q:[['Wegen ___ Regens blieb er daheim.',['der','dem','des','den'],2],['Das Auto ___ Nachbarn steht dort. (Wessen?)',['der','des','dem','den'],1],['Welche Präposition verlangt den Genitiv?',['mit','trotz','bei','durch'],1]]},
dat:{c:GN,k:'Dativ = **Wem?** Der Empfänger. Dativ-Wörter: aus, außer, bei, mit, nach, seit, von, zu. Im Plural kommt ein -n dazu: den Kindern.',m:'Aus, außer, bei, mit, nach, seit, von, zu: dem Dativ gehört die Ruh. Und: Ich gebe DEM Mann.',q:[['Welche Präposition verlangt immer den Dativ?',['für','durch','mit','ohne'],2],['Ich helfe ___ Frau.',['die','der','den','des'],1],['Das Buch gehört ___ Kindern.',['die','den','der','das'],1]]},
akk:{c:RD,k:'Akkusativ = **Wen oder was?** Das direkte Objekt. Nur männlich ändert sich: der → den. Immer Akkusativ: bis, durch, für, gegen, ohne, um.',m:'Für, um, durch, gegen, ohne, bis: diese sechs wollen den Akkusativ. Männlich wird aus „der“ ein „den“.',q:[['Welche Präposition verlangt immer den Akkusativ?',['mit','von','für','bei'],2],['Er kauft ___ Hund.',['der','den','dem','des'],1],['Welcher Artikel ändert sich vom Nominativ zum Akkusativ?',['der','die','das','die (Plural)'],0]]},
wech:{c:OR,k:'an, auf, hinter, in, neben, über, unter, vor, zwischen: **Wo?** (ruhen) → Dativ. **Wohin?** (Bewegung) → Akkusativ.',m:'WO bleibt DEM (ruhig). WOHIN geht DEN Weg (Bewegung).',q:[['Wohin? Ich stelle die Vase auf ___ Tisch.',['dem','den','der','des'],1],['Wo? Die Vase steht auf ___ Tisch.',['dem','den','der','des'],0],['Wo? Er sitzt in ___ Küche.',['die','der','den','das'],1]]},
zeit0:{k:'Sechs Zeitformen. Alltag und Gespräch in Österreich: **Perfekt**. Berichte: **Präteritum**. Vorvergangenheit: **Plusquamperfekt**.',m:'Hilfsverb vorne, Partizip hinten: die Klammer. „Ich habe den Bericht geschrieben.“',q:[['Welche Zeitform ist „ich war gegangen“?',['Perfekt','Plusquamperfekt','Präteritum','Futur II'],1],['Welche Zeitform nutzt man in Österreich im Gespräch meist für Vergangenes?',['Futur II','Plusquamperfekt','Perfekt','Futur I'],2],['„Ich werde gehen“ ist …',['Präsens','Futur I','Futur II','Perfekt'],1]]},
praes:{c:GN,k:'Endungen: -e, -st, -t, -en, -t, -en. Endet der Stamm auf d oder t, kommt ein e dazu (du arbeitest). Bei e → i und a → ä ändert sich der Vokal.',q:[['du ___ (sehen)',['sehst','siehst','sieht','sehest'],1],['er ___ (fahren)',['fahrt','fährt','fährst','fahrst'],1],['du ___ (arbeiten)',['arbeitst','arbeitest','arbeite','arbeitet'],1]]},
praet:{c:OR,k:'Schwach: Stamm + **te** (machte). Stark: Vokalwechsel, kein -te (ging). Bei ich und er sieht das Verb gleich aus: ich ging, er ging.',q:[['Präteritum von „gehen“ (ich)?',['gehte','gang','ging','gegangen'],2],['Präteritum von „machen“ (er)?',['machte','mach','gemacht','mochte'],0],['Präteritum von „wissen“ (ich)?',['wisste','wusste','wiss','gewusst'],1]]},
perf:{c:OR,k:'haben oder sein + **Partizip II**. **sein** bei Bewegung (gehen, fahren) und Zustandswechsel (einschlafen). Sonst **haben**.',m:'Bewegung oder Wechsel: SEIN. Alles andere: HABEN.',q:[['Wir ___ nach Graz gefahren.',['haben','sind','werden','hatten'],1],['Partizip II von „aufmachen“?',['geaufmacht','aufgemacht','aufmachte','aufgemachen'],1],['Partizip II von „telefonieren“?',['getelefoniert','telefoniert','telefonieren','getelefont'],1]]},
plus:{c:PU,k:'hatte oder war + Partizip II. Für das, was **vor** etwas anderem in der Vergangenheit passiert ist.',q:[['Nachdem er gegessen ___, ging er spazieren.',['hat','hatte','war','wurde'],1],['Plusquamperfekt von „kommen“ (er)?',['er kam','er ist gekommen','er war gekommen','er wird kommen'],2]]},
fut1:{c:BL,k:'werden + Infinitiv. Für Zukunft, Versprechen und **Vermutungen**: Er wird wohl zu Hause sein.',q:[['Futur I von „lernen“ (ich)?',['ich lerne','ich werde lernen','ich lernte','ich habe gelernt'],1],['„Er wird wohl zu Hause sein“ drückt aus …',['Vermutung','Vergangenheit','Befehl','Wunsch'],0]]},
fut2:{c:IN,k:'werden + Partizip II + haben/sein. Etwas ist bis zu einem Zeitpunkt in der Zukunft **fertig** oder eine Vermutung über Vergangenes.',q:[['Futur II von „schreiben“ (ich)?',['ich werde schreiben','ich werde geschrieben haben','ich habe geschrieben','ich hatte geschrieben'],1],['„Er wird es vergessen haben.“ bedeutet vor allem …',['Vermutung über Vergangenes','Plan','Befehl','Gewohnheit'],0]]},
st0:{c:RD,k:'Komparativ: **-er**. Superlativ: **am -sten**. Nach d, t, s, ß, sch, x, z: **am -esten** (am ältesten, am heißesten).',m:'Zwei Schritte nach oben: schnell, schnell**er**, am schnell**sten**.',q:[['Superlativ von „alt“?',['am altesten','am ältesten','am älteren','am altsten'],1],['Komparativ von „klein“?',['kleiner','am kleinsten','kleinere','kleinster'],0],['Superlativ von „heiß“?',['am heißten','am heißesten','am heißsten','am heissten'],1]]},
st1:{c:RD,k:'Diese Formen sind anders: gut, besser, am besten · viel, mehr, am meisten · gern, lieber, am liebsten · hoch, höher, am höchsten · nah, näher, am nächsten.',q:[['Komparativ von „gut“?',['guter','besser','gutter','bester'],1],['Superlativ von „viel“?',['am meisten','am vielsten','am mehrsten','am meistesten'],0],['Komparativ von „gern“?',['gerner','mehr','lieber','besser'],2]]},
st2:{c:RD,k:'Gleichheit: **so … wie**. Ungleichheit: Komparativ + **als**. Nicht steigerbar: tot, einzig, schwanger, perfekt.',q:[['Er ist größer ___ ich.',['wie','als','denn','so'],1],['Er ist so groß ___ ich.',['als','wie','denn','so'],1],['Welches Wort ist nicht steigerbar?',['schnell','einzig','klein','hell'],1]]},
wa:{k:'Nomen, Verb, Adjektiv, Artikel, Pronomen, Präposition, Konjunktion, Adverb. Adjektive kann man steigern, Adverbien nicht.',q:[['Welche Wortart ist „heute“?',['Nomen','Adjektiv','Adverb','Verb'],2],['„weil“ ist eine …',['Präposition','Konjunktion','Artikel','Verb'],1]]},
satz:{k:'Hauptsatz: Verb an **zweiter** Stelle. Nebensatz (weil, dass, obwohl): Verb am **Ende**, davor ein Komma.',m:'Hauptsatz: Verb auf Platz 2. Nebensatz: Verb ganz hinten.',q:[['Im Hauptsatz steht das Verb an …',['erster Stelle','zweiter Stelle','letzter Stelle','dritter Stelle'],1],['Im Nebensatz mit „weil“ steht das Verb …',['am Ende','an zweiter Stelle','am Anfang','in der Mitte'],0]]},
pass:{k:'Passiv = **werden + Partizip II**. Das Geschehen steht im Mittelpunkt, nicht der Handelnde. Perfekt: ist verhaftet **worden**.',q:[['Passiv von „Der Polizist verhaftet den Mann“?',['Der Mann wird verhaftet.','Der Mann verhaftet.','Der Mann hat verhaftet.','Der Mann ist verhaften.'],0],['Passiv-Perfekt: Er ist verhaftet ___.',['geworden','worden','wurde','werden'],1]]},
konj:{k:'Konjunktiv II für Wunsch und Bedingung (hätte, wäre, käme, würde). Konjunktiv I für indirekte Rede (er sei, er habe).',q:[['Konjunktiv II von „haben“ (ich)?',['hatte','hätte','habe','würde haben'],1],['Indirekte Rede: Er sagt, er ___ krank.',['ist','sei','war','wird'],1]]},
das:{k:'Ersatzprobe: Passt **dieses**, **jenes** oder **welches**? Dann **das**. Sonst **dass**. Vor „dass“ steht ein Komma.',m:'dass-Satz = „Ich weiß, dass …“. Alles, was man durch „dieses“ ersetzen kann, ist „das“.',q:[['Das Auto, ___ dort steht, ist rot.',['dass','das','daß','dies'],1],['Ich glaube, ___ er recht hat.',['das','dass','dies','was'],1]]},
ss:{k:'Nach **langem** Vokal oder Doppellaut: **ß** (Straße, heiß). Nach **kurzem** Vokal: **ss** (Wasser, muss).',m:'Lang gezogen = ß (Fuß). Kurz und knapp = ss (Fluss).',q:[['Die Stra__e ist lang.',['ss','ß'],1],['Das Wa__er ist kalt.',['ss','ß'],0],['Welches Wort ist richtig?',['Fuss','Fuß','Fus','Fuβ'],1]]},
gk:{k:'Groß: Nomen, Satzanfang, Namen, Nominalisiertes (das Lesen, beim Laufen), Tageszeit nach heute/gestern (heute Abend). Klein: Verben, Adjektive, Adverbien (abends).',q:[['Welcher Satz ist richtig?',['Ich gehe zum Schwimmen.','Ich gehe zum schwimmen.','Ich Gehe zum Schwimmen.','ich gehe zum schwimmen.'],0],['Wir sehen uns heute ___.',['abend','Abend'],1]]},
komma:{k:'Komma bei Aufzählungen, vor Nebensätzen (dass, weil, obwohl), vor aber/sondern, bei Einschüben. **Kein** Komma vor „und“ und „oder“ in Aufzählungen.',q:[['Wo steht das Komma richtig?',['Ich weiß dass er kommt.','Ich weiß, dass er kommt.','Ich, weiß dass er kommt.','Ich weiß dass, er kommt.'],1],['Welcher Satz ist richtig?',['Äpfel, Birnen, und Nüsse.','Äpfel, Birnen und Nüsse.','Äpfel Birnen, und Nüsse.','Äpfel, Birnen, und, Nüsse.'],1]]},
dehn:{k:'Kurzer Vokal: oft Doppelkonsonant (Mitte, Bett). Langer Vokal: ie, Dehnungs-h oder Doppelvokal (Liebe, Zahl, Meer). Wortfamilie hilft beim Schreiben.',q:[['Welche Schreibweise ist richtig?',['Standart','Standard','Standardt','Stantard'],1],['Welche Schreibweise ist richtig?',['Maschiene','Maschine','Maschinne','Mashine'],1],['Welche Schreibweise ist richtig?',['vieleicht','vielleicht','villeicht','fielleicht'],1]]},
verw:{k:'seit (Zeit) und seid (ihr seid). wieder (nochmals) und wider (gegen). Stadt (Ort) und statt (anstatt). Der Satz entscheidet.',q:[['Ihr ___ pünktlich.',['seit','seid'],1],['Er kommt ___.',['wieder','wider'],0],['Er wohnt ___ drei Jahren hier.',['seid','seit'],1]]},
br0:{k:'Zähler oben, Nenner unten. **Kürzen** = beide durch dieselbe Zahl teilen. **Erweitern** = beide mit derselben Zahl malnehmen. Der Wert bleibt gleich.',m:'Nenner = „nennt“ die Teile. Zähler = „zählt“ die Teile, die du hast.',q:[['Kürze 6/8.',['3/4','2/3','6/4','1/2'],0],['Erweitere 2/3 mit 4.',['6/7','8/12','8/3','2/12'],1],['Welcher Bruch ist am größten?',['3/8','1/2','2/5','1/3'],1]]},
br1:{k:'Plus und Minus: Nenner müssen **gleich** sein. Erst auf einen Hauptnenner bringen, dann nur die Zähler rechnen.',m:'Nenner niemals addieren: 1/2 + 1/3 ist **nicht** 2/5.',q:[['1/2 + 1/3 = ?',['2/5','5/6','1/6','2/6'],1],['3/4 − 1/6 = ?',['7/12','2/10','5/6','1/2'],0],['2/7 + 3/7 = ?',['5/14','5/7','6/7','5/49'],1]]},
br2:{k:'Mal: **oben mal oben, unten mal unten**. Vorher kürzen spart Arbeit. „von“ heißt mal.',q:[['2/3 · 4/5 = ?',['8/15','6/8','8/8','2/5'],0],['3/4 von 40 = ?',['10','30','3','36'],1]]},
br3:{k:'Geteilt: **mal Kehrwert**. Den zweiten Bruch umdrehen, dann malnehmen.',m:'Teilen durch einen Bruch = mal den umgedrehten Bruch.',q:[['2/3 : 4/5 = ?',['8/15','5/6','6/5','10/9'],1],['Kehrwert von 3/7?',['7/3','3/7','−3/7','4/7'],0]]},
br4:{k:'Gemischte Zahl: ganze Zahl + Bruch. Zu unechtem Bruch: ganze Zahl mal Nenner plus Zähler.',q:[['7/4 als gemischte Zahl?',['1 3/4','2 1/4','1 1/4','3 1/4'],0],['2 1/3 als unechter Bruch?',['7/3','6/3','5/3','21/3'],0]]},
br5:{k:'Bruch → Dezimal: Zähler durch Nenner. Dezimal → Prozent: mal 100. Lerne: 1/2 = 50 %, 1/4 = 25 %, 3/4 = 75 %, 1/5 = 20 %, 1/8 = 12,5 %.',q:[['3/4 in Prozent?',['34 %','75 %','25 %','60 %'],1],['0,2 als Bruch?',['1/5','1/2','2/5','1/20'],0],['1/8 in Prozent?',['18 %','12,5 %','8 %','15 %'],1]]},
pr:{k:'W = G · p / 100. **Grundwert** = das Ganze (100 %), **Prozentwert** = der Teil. 10 % = durch 10, 1 % = durch 100.',m:'G wie Ganzes, W wie Wert des Teils.',q:[['20 % von 150?',['20','30','25','300'],1],['80 Euro plus 25 %?',['100','105','120','85'],0],['Von 10 % auf 15 %: Der Anstieg ist …',['5 Prozentpunkte','5 Prozent','50 Prozentpunkte','15 %'],0]]},
dre:{k:'Immer erst auf **eins** rechnen, dann auf das Ziel. Je mehr, desto mehr: erst teilen, dann mal. Je mehr, desto weniger: erst mal, dann teilen.',q:[['3 kg kosten 6 €. Was kosten 5 kg?',['10 €','12 €','9 €','15 €'],0],['4 Arbeiter brauchen 6 Tage. Wie lange brauchen 3 Arbeiter?',['8 Tage','4,5 Tage','6 Tage','12 Tage'],0]]},
pot:{k:'a² = a · a. Wurzel ist die Umkehrung. Minus mal Minus = Plus. Quadratzahlen bis 15 auswendig: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.',q:[['Wurzel aus 81 = ?',['9','8','18','7'],0],['(−3)² = ?',['9','−9','6','−6'],0],['2³ = ?',['6','8','9','5'],1]]},
ein:{k:'Länge: ×1000 (km→m), ×100 (m→cm), ×10 (cm→mm). Zeit: 60 min = 1 h. km/h durch 3,6 = m/s.',q:[['72 km/h in m/s?',['20','25','15','72'],0],['2,5 km in m?',['250','2500','25','25000'],1]]},
tempo:{k:'**s = v · t**. Weg gleich Tempo mal Zeit. Durchschnitt = Summe durch Anzahl. Median = mittlerer Wert der geordneten Reihe.',m:'Weg-Dreieck: Finger auf die gesuchte Größe, der Rest zeigt die Rechnung.',q:[['90 km/h für 2,5 h: Wie weit?',['180 km','225 km','200 km','36 km'],1],['Durchschnitt von 4, 7, 10?',['6','7','8','21'],1],['Median von 3, 9, 5, 1, 7?',['5','7','3','9'],0]]},
regel:{k:'Klammern, dann Potenzen, dann **Punkt vor Strich**. 1 ist keine Primzahl. Durch 3 teilbar, wenn die Quersumme durch 3 teilbar ist.',q:[['3 + 4 · 2 = ?',['14','11','10','24'],1],['Welche Zahl ist eine Primzahl?',['21','27','29','33'],2],['Welche Zahl ist durch 3 teilbar?',['124','135','215','301'],1]]},
zrr:{k:'Schreibe die **Abstände** auf. Gleich? Dann plus/minus. Wachsend? Dann Differenzen der Differenzen. Verdoppeln? Dann mal.',m:'Erst Abstände, dann Quotienten, dann zwei Reihen abwechselnd.',q:[['3, 7, 11, 15, …',['17','19','18','21'],1],['2, 6, 18, 54, …',['108','162','72','216'],1],['1, 2, 4, 7, 11, …',['15','16','17','18'],1]]}
};
const lxCol=x=>(LX[x.id]&&LX[x.id].c)||TOP[x.ti].c;
/* ----- Bilder (SVG) ----- */
const lxS=(w,h,b,al)=>`<svg class="lxs" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(al)}">${b}</svg>`;
const lxT=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" class="lxt${o.s?' lxsm':''}" style="${o.c?'fill:'+o.c+';':''}${o.z?'font-size:'+o.z+'px;':''}${o.w?'font-weight:'+o.w:''}">${esc(t)}</text>`;};
const lxR=(x,y,w,h,f,o)=>{o=o||{};return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r==null?10:o.r}" style="fill:${f};${o.s?'stroke:'+o.s+';stroke-width:'+(o.sw||2)+';':''}${o.op?'opacity:'+o.op:''}"/>`;};
function lxChips(parts,al){
  const gap=8,ws=parts.map(p=>Math.max(56,p[0].length*8.8+24)),tot=ws.reduce((a,b)=>a+b,0)+gap*(parts.length-1)+16;let x=8,o='';
  parts.forEach((p,i)=>{const w=ws[i];o+=lxR(x,12,w,40,p[1],{r:12})+lxT(x+w/2,37,p[0],{c:'#fff',w:700,z:15})+(p[2]?lxT(x+w/2,72,p[2],{c:p[1],w:700,z:12}):'');x+=w+gap;});
  return lxS(Math.max(tot,300),88,o,al);
}
function lxPie(cx,cy,r,n,d,col){
  const pt=a=>[cx+r*Math.cos(a),cy+r*Math.sin(a)],A=i=>-Math.PI/2+2*Math.PI*i/d;
  let s=`<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--card2)"/>`;
  for(let i=0;i<n;i++){const [x1,y1]=pt(A(i)),[x2,y2]=pt(A(i+1));s+=`<path d="M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" style="fill:${col}"/>`;}
  for(let i=0;i<d;i++){const [x,y]=pt(A(i));s+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--ink2);stroke-width:1.5"/>`;}
  return s+`<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
}
function lxBar(x,y,w,h,n,d,col){
  let s=lxR(x,y,w,h,'var(--card2)',{r:4});if(n)s+=lxR(x,y,w*n/d,h,col,{r:4});
  for(let i=1;i<d;i++)s+=`<line x1="${x+w*i/d}" y1="${y}" x2="${x+w*i/d}" y2="${y+h}" style="stroke:var(--ink2);stroke-width:1.5"/>`;
  return s+`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
}
const FIG={
fall0:()=>{const C=[['Nominativ','Wer oder was?','der Mann',BL],['Genitiv','Wessen?','des Mannes',PU],['Dativ','Wem?','dem Mann',GN],['Akkusativ','Wen oder was?','den Mann',RD]];let b='';C.forEach((c,i)=>{const x=8+(i%2)*166,y=8+Math.floor(i/2)*86;b+=lxR(x,y,158,78,c[3],{r:14})+lxT(x+79,y+25,c[0],{c:'#fff',w:700,z:16})+lxT(x+79,y+46,c[1],{c:'#fff',z:14})+lxT(x+79,y+66,c[2],{c:'#fff',w:700,z:14});});return lxS(340,186,b,'Die vier Fälle mit Frage und Beispiel');},
nom:()=>lxChips([['Der Polizist',BL,'Wer?'],['kommt',GY,'tut'],['heute',GY,'wann?']],'Nominativ: Der Polizist kommt heute'),
gen:()=>lxChips([['Das Auto',GY,'was?'],['des Nachbarn',PU,'Wessen?'],['steht dort',GY,'']],'Genitiv: Das Auto des Nachbarn'),
dat:()=>lxChips([['Der Polizist',BL,'Wer?'],['hilft',GY,'tut'],['dem Mann',GN,'Wem?']],'Dativ: Der Polizist hilft dem Mann'),
akk:()=>lxChips([['Der Polizist',BL,'Wer?'],['befragt',GY,'tut'],['den Zeugen',RD,'Wen?']],'Akkusativ: Der Polizist befragt den Zeugen'),
wech:()=>{let b=lxR(6,6,160,128,'var(--card2)',{r:14})+lxR(174,6,160,128,'var(--card2)',{r:14});
  b+=lxR(30,86,112,10,'#8C6A44',{r:3})+'<rect x="38" y="96" width="8" height="28" style="fill:#8C6A44"/><rect x="126" y="96" width="8" height="28" style="fill:#8C6A44"/>'+lxR(62,68,56,18,GN,{r:3})+lxT(86,30,'WO?',{c:GN,w:800,z:20})+lxT(86,50,'ruht auf dem Tisch',{z:12,s:1});
  b+=lxR(198,86,112,10,'#8C6A44',{r:3})+'<rect x="206" y="96" width="8" height="28" style="fill:#8C6A44"/><rect x="294" y="96" width="8" height="28" style="fill:#8C6A44"/>'+lxR(186,28,44,16,RD,{r:3})+'<path d="M232 38Q262 30 258 78" style="fill:none;stroke:'+RD+';stroke-width:3"/><path d="M251 70L258 80L266 70" style="fill:none;stroke:'+RD+';stroke-width:3"/>'+lxT(254,22,'WOHIN?',{c:RD,w:800,z:20,a:'middle'})+lxT(254,132,'',{});
  b+=lxT(86,128,'Dativ',{c:GN,w:700,z:14})+lxT(254,128,'Akkusativ',{c:RD,w:700,z:14});return lxS(340,142,b,'Wo: Dativ, Wohin: Akkusativ');},
zeit0:()=>{let b='<line x1="14" y1="86" x2="386" y2="86" style="stroke:var(--ink2);stroke-width:3"/>';
  [[50,'Plusquamperfekt','ich war gegangen',PU,-1],[120,'Perfekt / Präteritum','ich bin gegangen / ging',OR,1],[190,'Präsens','ich gehe',GN,-1],[260,'Futur I','ich werde gehen',BL,1],[330,'Futur II','ich werde gegangen sein',IN,-1]].forEach(([x,t,e,c,up])=>{b+=`<circle cx="${x}" cy="86" r="7" style="fill:${c}"/>`+lxT(x,up<0?56:118,t,{c,w:700,z:11})+lxT(x,up<0?71:133,e,{z:10,s:1});});
  return lxS(400,170,b+lxT(50,160,'← Vergangenheit',{z:11,s:1})+lxT(190,160,'jetzt',{z:11,s:1,w:700})+lxT(340,160,'Zukunft →',{z:11,s:1}),'Zeitstrahl mit den sechs Zeitformen');},
praes:()=>lxChips([['Er',GY,''],['geht',GN,'Präsens'],['nach Hause',GY,'']],'Präsens'),
praet:()=>lxChips([['Er',GY,''],['ging',OR,'Präteritum'],['nach Hause',GY,'']],'Präteritum'),
perf:()=>lxChips([['Ich',GY,''],['habe',OR,'haben / sein'],['den Bericht',GY,''],['geschrieben',BL,'Partizip II']],'Perfekt: Klammer aus Hilfsverb und Partizip'),
plus:()=>lxChips([['Er',GY,''],['hatte',PU,'hatte / war'],['gegessen',BL,'Partizip II']],'Plusquamperfekt'),
fut1:()=>lxChips([['Ich',GY,''],['werde',BL,'werden'],['morgen',GY,''],['lernen',GN,'Infinitiv']],'Futur I'),
fut2:()=>lxChips([['Ich',GY,''],['werde',BL,'werden'],['den Bericht',GY,''],['geschrieben',IN,'Partizip II'],['haben',OR,'haben / sein']],'Futur II'),
st0:()=>{let b='';[['schnell','Positiv',50,GY],['schneller','Komparativ',90,OR],['am schnellsten','Superlativ',130,RD]].forEach(([t,s,h,c],i)=>{const x=10+i*112;b+=lxR(x,150-h,104,h,c,{r:10})+lxT(x+52,150-h+24,t,{c:'#fff',w:700,z:13})+lxT(x+52,150-h+42,s,{c:'#fff',z:11});});return lxS(340,160,b,'Drei Stufen der Steigerung');},
st1:()=>lxChips([['gut',GY,'Positiv'],['besser',OR,'Komparativ'],['am besten',RD,'Superlativ']],'gut, besser, am besten'),
st2:()=>lxChips([['so groß',GY,''],['wie',GN,'gleich'],['größer',OR,''],['als',RD,'ungleich']],'so wie, als'),
satz:()=>lxChips([['Heute',BL,'Platz 1'],['kommt',RD,'Platz 2: Verb'],['der Polizist',GY,'Platz 3']],'Hauptsatz: Verb an zweiter Stelle'),
pass:()=>lxChips([['Der Mann',BL,'Subjekt'],['wird',OR,'werden'],['verhaftet',RD,'Partizip II']],'Passiv'),
konj:()=>lxChips([['Wenn ich Zeit hätte,',GY,'Bedingung'],['würde ich',PU,'Konjunktiv II'],['kommen',GN,'Infinitiv']],'Konjunktiv II'),
das:()=>lxChips([['Das Auto,',GY,''],['das',BL,'= welches'],['dort steht',GY,'']],'das mit s: ersetzbar durch welches'),
br0:()=>lxS(340,176,lxPie(70,80,56,3,4,GN)+lxT(70,160,'3/4',{w:700,z:16})+lxT(170,92,'=',{w:800,z:30})+lxPie(270,80,56,6,8,GN)+lxT(270,160,'6/8',{w:700,z:16}),'3/4 und 6/8 sind gleich viel'),
br1:()=>{let b='';[['1/2 = 3/6',3,6,GN],['1/3 = 2/6',2,6,OR],['zusammen 5/6',5,6,PU]].forEach((r,i)=>{b+=lxT(8,34+i*52,r[0],{a:'start',w:700,z:14})+lxBar(130,16+i*52,200,28,r[1],r[2],r[3]);});return lxS(340,160,b,'1/2 + 1/3 = 5/6 mit Sechsteln');},
br2:()=>{let b='';for(let r=0;r<3;r++)for(let c=0;c<5;c++){const a=c<4,e=r<2;b+=lxR(20+c*40,14+r*36,38,34,a&&e?PU:a?GN:e?OR:'var(--card2)',{r:4,op:a&&e?1:.5});}
  return lxS(340,132,b+lxT(240,44,'4/5 breit',{a:'start',c:GN,w:700,z:13})+lxT(240,66,'2/3 hoch',{a:'start',c:OR,w:700,z:13})+lxT(240,94,'8 von 15',{a:'start',c:PU,w:700,z:15})+lxT(240,114,'= 2/3 · 4/5',{a:'start',z:12,s:1}),'Flächenbild: 2/3 mal 4/5 ist 8/15');},
br3:()=>lxS(340,150,lxBar(20,16,300,36,3,4,GN)+lxT(170,76,'3 Viertel ÷ 3 = 1 Viertel',{w:700,z:14})+lxT(170,106,'Durch einen Bruch teilen:',{z:12,s:1})+lxT(170,128,'2/3 : 4/5 = 2/3 · 5/4 (Kehrwert)',{w:700,z:14,c:PU}),'Teilen und Kehrwert'),
br4:()=>lxS(340,150,lxPie(70,66,50,4,4,GN)+lxPie(190,66,50,3,4,GN)+lxT(130,76,'+',{w:800,z:26})+lxT(270,76,'=',{w:800,z:26})+lxT(305,82,'7/4',{w:800,z:18,c:GN})+lxT(130,140,'1 + 3/4 = 1 3/4',{w:700,z:14}),'7/4 sind eine ganze Pizza und 3/4'),
br5:()=>{let b='<line x1="30" y1="60" x2="310" y2="60" style="stroke:var(--ink2);stroke-width:3"/>';[['0','0',''],['1/4','0,25','25 %'],['1/2','0,5','50 %'],['3/4','0,75','75 %'],['1','1','100 %']].forEach(([f,d,p],i)=>{const x=30+i*70;b+=`<circle cx="${x}" cy="60" r="6" style="fill:${GN}"/>`+lxT(x,38,f,{w:800,z:15})+lxT(x,84,d,{z:13,s:1})+(p?lxT(x,104,p,{z:13,w:700,c:GN}):lxT(x,104,'0 %',{z:13,w:700,c:GN}));});return lxS(340,116,b,'Zahlenstrahl: Bruch, Dezimal, Prozent');},
pr:()=>lxS(340,126,lxT(14,20,'100 % = Grundwert (150)',{a:'start',z:12,s:1})+lxBar(14,28,312,34,2,10,OR)+lxT(14,86,'20 % = Prozentwert (30)',{a:'start',z:14,c:OR,w:700})+lxT(14,110,'10 % = 150 : 10 = 15, also 20 % = 30',{a:'start',z:12,s:1}),'Prozentbalken'),
dre:()=>{let b='';[['3 kg → 6 €',8],['1 kg → 2 €',70],['5 kg → 10 €',132]].forEach(([t,y],i)=>{b+=lxR(90,y-6,160,38,i===1?OR:GY,{r:10})+lxT(170,y+19,t,{c:'#fff',w:700,z:15});});
  b+=lxT(80,60,'÷ 3',{a:'end',w:800,z:16,c:OR})+lxT(80,122,'· 5',{a:'end',w:800,z:16,c:OR})+'<path d="M170 32L170 62M164 56L170 64L176 56" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/><path d="M170 94L170 124M164 118L170 126L176 118" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/>';return lxS(340,176,b,'Dreisatz: auf eins, dann auf das Ziel');},
pot:()=>{let b='';for(let r=0;r<3;r++)for(let c=0;c<3;c++)b+=lxR(30+c*40,14+r*40,36,36,GN,{r:5});return lxS(340,140,b+lxT(240,56,'3² = 3 · 3',{a:'start',w:700,z:16})+lxT(240,82,'= 9',{a:'start',w:800,z:20,c:GN})+lxT(240,110,'Wurzel aus 9 = 3',{a:'start',z:12,s:1}),'3 mal 3 Quadrate');},
ein:()=>lxChips([['km',BL,'× 1000 →'],['m',GN,'× 100 →'],['cm',OR,'× 10 →'],['mm',RD,'']],'Längenleiter: km, m, cm, mm'),
tempo:()=>lxS(340,170,'<path d="M170 12L58 152L282 152Z" style="fill:var(--card2);stroke:var(--ink2);stroke-width:3"/><line x1="94" y1="104" x2="246" y2="104" style="stroke:var(--ink2);stroke-width:3"/><line x1="170" y1="104" x2="170" y2="152" style="stroke:var(--ink2);stroke-width:3"/>'+lxT(170,84,'s (Weg)',{w:800,z:17,c:OR})+lxT(118,136,'v',{w:800,z:19,c:BL})+lxT(222,136,'t',{w:800,z:19,c:GN}),'Weg-Dreieck: s oben, v und t unten'),
zrr:()=>{let b='';[3,7,11,15,19].forEach((n,i)=>{const x=34+i*68;b+=`<circle cx="${x}" cy="64" r="22" style="fill:${GN}"/>`+lxT(x,70,String(n),{c:'#fff',w:700,z:17});if(i<4)b+=`<path d="M${x+14} 40Q${x+34} 16 ${x+54} 40" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`+lxT(x+34,20,'+4',{c:OR,w:800,z:14});});return lxS(340,100,b,'Zahlenreihe mit gleichem Abstand +4');}
};
Object.entries({
nom:'„Wer oder was?“ fragen, immer zuerst. Gibt es eine Antwort, ist es der Nominativ.',
praes:'Endungen wie eine Treppe: -e, -st, -t. Bei d und t kommt ein e dazu: du arbeit**e**st.',
praet:'Schwache Verben bekommen ein -te (machen → machte). Starke wechseln den Vokal (gehen → ging).',
plus:'Plus-quam-perfekt heißt „mehr als vollendet“: Es war schon vorher vorbei. Immer hatte oder war + Partizip.',
fut1:'Zukunft braucht „werden“: Ich **werde** lernen. Das Verb steht hinten im Infinitiv.',
fut2:'Futur II ist Futur I plus „fertig“: Bis morgen **werde** ich es geschafft **haben**.',
st1:'Drei Lieder zum Merken: gut, besser, am besten · gern, lieber, am liebsten · viel, mehr, am meisten.',
st2:'**als** hat einen Abstand (größer **als**), **wie** ist gleich (so groß **wie**).',
wa:'Nomen kannst du mit „der, die, das“ verbinden. Verben kannst du tun. Adjektive antworten auf „Wie?“.',
pass:'Passiv = werden + Partizip II. Im Perfekt wird aus „geworden“ ein **worden**: ist verhaftet worden.',
konj:'Wünsche mit „wäre, hätte, käme“ (Konjunktiv II). Berichtetes mit „sei, habe, komme“ (Konjunktiv I).',
gk:'Kannst du einen Artikel davorsetzen („beim Lesen“, „das Lesen“)? Dann groß. Nach heute, gestern, morgen: Tageszeit groß (heute Abend).',
komma:'Vor Nebensätzen mit „dass“, „weil“, „obwohl“ oder „wenn“ steht ein Komma. Vor „und“ und „oder“ in einer Aufzählung steht keines.',
dehn:'Kurz gesprochen: doppelt (Bett, Mitte). Lang gesprochen: h, ie oder Doppelvokal (Zahl, Liebe, Meer).',
verw:'wieder = nochmals (wiederholen, mit ie). wider = gegen (widersprechen). seit = Zeit. seid = ihr seid.',
br4:'„Mal, plus, gleicher Nenner“: 2 1/3 → 2·3 + 1 = 7, also 7/3.',
br5:'Münzen helfen: 1/2 Euro = 50 Cent = 50 %, 1/4 Euro = 25 Cent = 25 %. Prozent heißt „pro hundert“.',
dre:'Immer zuerst auf **eins** rechnen! Mehr Arbeiter, weniger Tage: indirekt, also mal und dann teilen.',
pot:'3² sind 3 mal 3 Kästchen (ein Quadrat). Minus mal minus ist plus: der Feind meines Feindes ist mein Freund.',
ein:'Kilo = tausend, Zenti = hundertstel, Milli = tausendstel. km/h durch 3,6 = m/s.',
br2:'Oben mal oben, unten mal unten: 2/3 · 4/5 = 8/15. Vorher kürzen spart Rechenarbeit. „von“ heißt mal.',
regel:'Punkt vor Strich. Quersumme durch 3 oder 9 teilbar → die Zahl auch. Eine Primzahl hat nur zwei Teiler: 1 und sich selbst.'
}).forEach(([id,m])=>{if(LX[id]&&!LX[id].m)LX[id].m=m;});
FIG.wa=()=>lxChips([['Nomen',BL,'der Mann'],['Verb',RD,'laufen'],['Adjektiv',GN,'schnell'],['Adverb',OR,'heute']],'Wortarten');
FIG.ss=()=>lxS(340,120,lxR(8,10,150,92,GN,{r:14})+lxT(83,46,'Fuß',{c:'#fff',w:800,z:24})+lxT(83,74,'lang → ß',{c:'#fff',z:14})+lxR(182,10,150,92,RD,{r:14})+lxT(257,46,'Fluss',{c:'#fff',w:800,z:24})+lxT(257,74,'kurz → ss',{c:'#fff',z:14}),'ß nach langem, ss nach kurzem Vokal');
FIG.gk=()=>lxChips([['das Lesen',GN,'Nomen: groß'],['beim Laufen',GN,'Artikel davor'],['abends',GY,'klein']],'Groß- und Kleinschreibung');
FIG.komma=()=>lxChips([['Ich weiß',GY,'Hauptsatz'],[',',RD,'Komma'],['dass er kommt',BL,'Nebensatz']],'Komma vor dass');
FIG.dehn=()=>lxChips([['Bett',RD,'kurz: doppelt'],['Zahl',GN,'lang: h'],['Liebe',GN,'lang: ie'],['Meer',GN,'lang: ee']],'Kurze und lange Vokale');
FIG.verw=()=>lxChips([['seit',BL,'Zeit'],['seid',GN,'ihr seid'],['wieder',OR,'nochmals'],['wider',RD,'gegen']],'Wörter, die man verwechselt');
FIG.regel=()=>lxChips([['3',GY,''],['+',GY,''],['4 · 2',RD,'zuerst'],['=',GY,''],['11',GN,'']],'Punkt vor Strich');
const add=(gi,it,lx,fig)=>{const g=LEX[gi];it.ti=gi;it.cat=g.cat;it.g=g.g;g.items.push(it);LEXI[it.id]=it;LEX_ALL.push(it);LX[it.id]=lx;FIG[it.id]=fig;};
add(4,{id:'silb',t:'Silben und Silbentrennung',d:'Silbenbogen, Trennregeln',b:[
"# Was ist eine Silbe?",
"Eine Silbe ist ein Sprechtakt. Du kannst sie mitklatschen: Po – li – zei. Jede Silbe hat **einen Vokal, Umlaut oder Doppellaut** (a, e, i, o, u, ä, ö, ü, ei, au, eu, äu; auch ie zählt als ein Laut).",
"# Trennen am Zeilenende",
"• Ein einzelner Konsonant kommt auf die nächste Zeile: Ha-se, Stra-ße, Pau-se.",
"• Bei mehreren Konsonanten kommt nur der **letzte** nach unten: Kat-ze, Hüt-te, kämp-fen, Fens-ter.",
"• **ch, sch** und **ck** bleiben zusammen: Ta-sche, Kü-che, Zu-cker.",
"• Zusammengesetzte Wörter und Wörter mit Vorsilbe trennt man an der Wortfuge bzw. nach der Vorsilbe: Haus-tür, Aus-weis, Ver-kehr.",
"> Merke: Erst klatschen, dann trennen. So zählst du auch die Silben richtig."]},
{c:'#0E7490',k:'Eine Silbe ist ein Sprechtakt mit **einem** Vokal oder Doppellaut. Beim Trennen kommt bei mehreren Konsonanten nur der **letzte** in die nächste Zeile (Kat-ze). ch, sch, ck bleiben zusammen.',m:'Klatsche das Wort mit: Po – li – zei sind drei Klatscher, also drei Silben. ei zählt als ein Laut.',q:[['Wie viele Silben hat „Polizei“?',['2','3','4','5'],1],['Wie trennt man „Katze“?',['Ka-tze','Kat-ze','Katz-e','K-atze'],1],['Wie trennt man „Fenster“?',['Fen-ster','Fens-ter','Fenst-er','F-enster'],1],['Wie viele Silben hat „Ausweis“?',['1','2','3','4'],1],['Wie trennt man „Tasche“?',['Tas-che','Ta-sche','Tasc-he','T-asche'],1]]},
()=>{const W=[['Po','li','zei'],['Fens','ter']],C=[BL,RD,GN];let b='';
 W.forEach((w,r)=>{let x=14;const yb=40+r*88;
  w.forEach((s,i)=>{const wd=s.length*19,col=C[i];
   b+=lxT(x+wd/2,yb,s,{z:30,w:800,c:col});
   b+=`<path d="M${x+3} ${yb+10} Q${x+wd/2} ${yb+36} ${x+wd-3} ${yb+10}" style="fill:none;stroke:${col};stroke-width:3.5;stroke-linecap:round"/>`;
   b+=lxT(x+wd/2,yb+46,String(i+1),{z:14,w:700,c:col});x+=wd+8;});
  b+=lxT(x+8,yb,'= '+w.length+' Silben',{a:'start',z:15,w:700});});
 return lxS(300,178,b,'Silbenbögen: Po-li-zei hat drei Silben, Fens-ter hat zwei Silben');});
add(3,{id:'hglied',t:'Hauptglieder: Subjekt und Prädikat',d:'Kern des Satzes, Umstellprobe',b:[
"# Die zwei Hauptglieder",
"• **Subjekt** (Wer oder was?): steht im Nominativ. Der Polizist hilft dem Kind.",
"• **Prädikat** (Was tut er? Was geschieht?): das Verb. Im Hauptsatz steht es an zweiter Stelle.",
"Ohne Subjekt und Prädikat gibt es keinen vollständigen Satz. Alles andere (Objekte, Adverbiale) ergänzt sie.",
"# Mehrteiliges Prädikat",
"Er **hat** das Buch **gelesen**. Das Prädikat besteht aus zwei Teilen, die eine Klammer bilden.",
"# Satzglieder finden: Umstellprobe",
"Ein Satzglied ist alles, was beim Umstellen **zusammenbleibt**: „Dem Kind hilft der Polizist.“ Es gibt drei Satzglieder: der Polizist, hilft, dem Kind.",
"> Merke: Erst das Prädikat suchen, dann fragen: Wer oder was tut das?"]},
{c:IN,k:'**Subjekt** (Wer oder was? Nominativ) und **Prädikat** (Was tut er?) sind die Hauptglieder. Satzglieder erkennst du mit der Umstellprobe: Was zusammenbleibt, ist ein Glied.',m:'Erst das Verb finden (Prädikat), dann „Wer oder was + Verb?“ fragen: Das ist das Subjekt.',q:[['Welche zwei Satzglieder sind die Hauptglieder?',['Subjekt und Objekt','Subjekt und Prädikat','Prädikat und Adverbiale','Objekt und Adverbiale'],1],['In welchem Fall steht das Subjekt?',['Nominativ','Genitiv','Dativ','Akkusativ'],0],['Wie heißt das Prädikat in „Er hat das Buch gelesen“?',['hat','gelesen','hat … gelesen','das Buch'],2],['Wie fragt man nach dem Subjekt?',['Wem?','Wen oder was?','Wer oder was?','Wessen?'],2]]},
()=>lxChips([['Der Polizist',BL,'Subjekt'],['hilft',RD,'Prädikat'],['dem Kind',GN,'Dativobjekt']],'Satzglieder: Der Polizist hilft dem Kind'));
function splitSent(t){const p=(String(t).match(/[^.!?…]+(?:[.!?…]+["“”»«)]*|$)\s*/g)||[t]).filter(x=>x.trim());const o=[];for(const x of p){const l=o[o.length-1];if(l&&((/\d\.$/.test(l)&&/^\d/.test(x))||(/(^|\s)\d{1,2}\.\s+$/.test(l)&&/^(Jänner|Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/.test(x))))o[o.length-1]=l+x;else o.push(x);}return o;}
function lexSpeech(x){
  const E=LX[x.id]||{},parts=[x.t+'.'];if(E.k)parts.push('In 30 Sekunden: '+E.k.replace(/\*\*/g,'')+'.'.replace(/^\.$/,''));
  let hdr=null;
  for(const l of x.b){
    if(l.startsWith('|')){const c=l.split('|').slice(1,-1).map(s=>s.trim());if(hdr===null){hdr=c;continue;}parts.push(c.map((v,i)=>(hdr&&hdr.length>2&&i>0?hdr[i]+': ':'')+v).join(', ')+'.');continue;}
    hdr=null;let t=l.replace(/^(#|>|•|ex:)\s*/,'').replace(/\*\*/g,'');if(!/[.!?:]$/.test(t))t+='.';parts.push(t);
  }
  if(E.m)parts.push('Eselsbrücke: '+E.m.replace(/\*\*/g,''));
  return parts;
}
