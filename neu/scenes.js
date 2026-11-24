/* Tatort-Bilder für die Merkfähigkeit: Bild einprägen, danach Fragen ohne Bild.
   Zusatztraining. Im offiziellen Test nicht in dieser Form bestätigt. */
const SCENES=[
{id:'s1',img:'img/s1.jpg',t:'Verkehrsunfall an der Kreuzung',d:'Radfahrer und Pkw, Regen, Abend',lv:3,secs:90,qs:[
 {q:'Welche Automarke hatte der beschädigte Pkw?',c:'BMW',w:['Audi','VW','Mercedes'],e:'Ein dunkelblauer BMW Kombi mit beschädigter Front.'},
 {q:'Welche Farbe hatte der Pkw?',c:'Dunkelblau',w:['Schwarz','Silber','Dunkelgrün'],e:'Der Kombi war dunkelblau.'},
 {q:'Was stand auf dem weißen Lieferwagen?',c:'Frisch & Regional',w:['Frisch & Lecker','Regional & Bio','Bäckerei Mayer'],e:'Aufschrift am Lieferwagen: „Frisch & Regional“.'},
 {q:'Wie viele gelbe Spurentafeln (nummerierte Marker) lagen auf der Straße?',c:'3',w:['2','4','5'],e:'Marker 1, 2 und 3.'},
 {q:'Welche Uhrzeit zeigte der Fahrradcomputer?',c:'18:32',w:['18:41','18:31','18:23'],e:'Fahrradcomputer: 18:32 (+3 min). Bäckerei-Anzeige: 18:41, Uhr an der Haltestelle: 18:31.'},
 {q:'Welches Verkehrszeichen stand rechts neben der Haltestelle?',c:'Vorrang geben',w:['Stopp','Einbahn','Fahrverbot'],e:'Das auf der Spitze stehende Dreieck: „Vorrang geben“.'},
 {q:'Was sagte die Zeugin laut Notiz?',c:'Der Pkw wirkte ungewöhnlich schnell',w:['Der Radfahrer fuhr bei Rot','Der Fahrer telefonierte','Sie hat nichts gesehen'],e:'Zeugin: „Pkw wirkte ungewöhnlich schnell.“ Fahrer: sofort stark gebremst. Lieferwagenfahrer: hörte einen Knall, evtl. falsche Zeit.'},
 {q:'Wie viele Hunde waren beim Kinderwagen?',c:'2',w:['1','3','Keiner'],e:'Zwei Hunde rechts beim Kinderwagen.'},
 {q:'Welche Kollisionsgeschwindigkeit stand in der Berechnung?',c:'etwa 19,5 km/h',w:['etwa 36 km/h','etwa 10 km/h','etwa 25 km/h'],e:'Kollisionsgeschwindigkeit 5,42 m/s, also etwa 19,5 km/h. Ausgangsgeschwindigkeit war 36 km/h.'},
 {q:'Was trug der fotografierende Polizist an den Händen?',c:'Blaue Handschuhe',w:['Weiße Handschuhe','Schwarze Handschuhe','Nichts'],e:'Blaue Einweghandschuhe, ein weiteres Paar lag am Boden.'}
]},
{id:'s2',img:'img/s2.jpg',t:'Arbeitszimmer am Abend',d:'Wohnung, viele Uhren, Winter',lv:3,secs:90,qs:[
 {q:'Welche Uhrzeit zeigte der digitale Wecker?',c:'21:36',w:['21:30','12:36','20:36'],e:'Rote Digitalanzeige: 21:36.'},
 {q:'Zeigten alle Uhren im Raum dieselbe Uhrzeit?',c:'Nein, sie zeigten verschiedene Zeiten',w:['Ja, alle gleich','Es gab nur eine Uhr','Alle Uhren standen still'],e:'Standuhr, Kaminuhr, Digitalwecker und Wecker zeigten unterschiedliche Zeiten.'},
 {q:'Was stand auf dem Zettel am Tisch?',c:'Es war nicht geplant …',w:['Es tut mir leid …','Ich komme wieder …','Vergib mir …'],e:'Handschriftlich: „Es war nicht geplant …“'},
 {q:'Wie hieß das Buch auf dem Tisch?',c:'Das Geheimnis der alten Uhr',w:['Die alte Standuhr','Das Rätsel der Zeit','Mord um Mitternacht'],e:'Buchtitel: „Das Geheimnis der alten Uhr“.'},
 {q:'Welches Tier saß am Fensterbrett?',c:'Eine Katze',w:['Ein Hund','Ein Papagei','Kein Tier'],e:'Eine getigerte Katze mit weißer Brust am Fenster.'},
 {q:'Welche Farbe hatte der Schirm der Schreibtischlampe?',c:'Grün',w:['Weiß','Rot','Gelb'],e:'Grüne Bankerlampe links.'},
 {q:'Was war auf der Tasse abgebildet?',c:'Österreich-Flagge mit Adler',w:['Ein Herz','Ein Polizeistern','Nichts'],e:'Rot-weiß-rote Tasse mit Bundesadler.'},
 {q:'Welche Figur war auf dem karierten Blatt gezeichnet?',c:'Ein Dreieck mit drei 60°-Winkeln',w:['Ein Quadrat','Ein Kreis','Ein rechtwinkeliges Dreieck'],e:'Gleichseitiges Dreieck, jeder Winkel 60°.'},
 {q:'Welches Spiel stand auf dem Tisch?',c:'Schach',w:['Dame','Mühle','Karten'],e:'Ein Schachbrett links vorne.'},
 {q:'Welche Blumen standen in der Vase?',c:'Weiße Lilien',w:['Rote Rosen','Tulpen','Sonnenblumen'],e:'Weiße Lilien in einer blau-weißen Vase.'}
]},
{id:'s3',img:'img/s3.jpg',t:'Vorfall im Salon',d:'Großer Raum, mehrere Anwesende',lv:2,secs:60,qs:[
 {q:'Womit war die Person am Boden bedeckt?',c:'Mit einem hellen Tuch',w:['Mit einer dunklen Decke','Mit einem Mantel','Sie war nicht bedeckt'],e:'Ein helles, cremefarbenes Tuch.'},
 {q:'Was lag neben der bedeckten Person am Boden?',c:'Glasscherben',w:['Ein Messer','Ein Handy','Blumen'],e:'Viele Glasscherben vorne im Bild.'},
 {q:'Wie viele Personen standen im Raum?',c:'5',w:['3','4','7'],e:'Fünf Personen standen, ein Mann saß vorne links im Sessel.'},
 {q:'Was stand auf dem Glastisch in der Mitte?',c:'Orange Blumen',w:['Eine Weinflasche','Eine Lampe','Nichts'],e:'Ein Gesteck mit orangen Blumen.'},
 {q:'Welche Farbe hatten die beiden Sofas?',c:'Hell (cremeweiß)',w:['Dunkelbraun','Rot','Schwarz'],e:'Zwei helle Chesterfield-Sofas.'},
 {q:'Was machte der Mann vorne links?',c:'Er saß im Sessel',w:['Er telefonierte','Er stand am Fenster','Er kniete am Boden'],e:'Er saß in einem orangen Sessel.'}
]},
{id:'s4',img:'img/s4.jpg',t:'Einbruch ins Museum',d:'Zwei Täter, Schnee, Nacht',lv:2,secs:60,qs:[
 {q:'In welcher Gasse lag das Museum laut Straßenschild?',c:'Rathausgasse',w:['Hauptstraße','Bahnhofstraße','Herrengasse'],e:'Schild an der Uhr: „Rathausgasse“.'},
 {q:'Welche Farbe hatte die Jacke des rechten Täters?',c:'Rot',w:['Grün','Schwarz','Blau'],e:'Rechter Täter: rote Jacke, graue Kapuze, schwarze Mütze, Jeans, weiße Schuhe.'},
 {q:'Was trug der linke Täter im Gesicht?',c:'Eine Sturmhaube',w:['Eine Sonnenbrille','Nichts','Einen Schal'],e:'Schwarze Sturmhaube. Der rechte trug Mütze und Mundschutz.'},
 {q:'Welche Tasche trug der rechte Täter?',c:'Eine beige Umhängetasche',w:['Einen schwarzen Rucksack','Eine Sporttasche','Keine'],e:'Beige Umhängetasche. Der linke trug eine lange schwarze Tasche und einen Rucksack.'},
 {q:'Welche Uhrzeit zeigte die Uhr ungefähr?',c:'9:45',w:['12:15','3:45','10:50'],e:'Großer Zeiger auf der 9, kleiner knapp vor der 10: etwa 9:45 (21:45 Uhr, es war Nacht).'},
 {q:'Welche Farbe hatte die Jacke der Radfahrerin?',c:'Orange',w:['Gelb','Rot','Weiß'],e:'Radfahrerin rechts: orange Jacke, weißer Helm.'},
 {q:'Was lag zwischen den Fußspuren am Boden?',c:'Ein Handschuh',w:['Ein Schlüssel','Eine Geldbörse','Ein Handy'],e:'Ein schwarzer Handschuh, daneben ein umgestürzter Mülleimer.'}
]},
{id:'s5',img:'img/s5.jpg',t:'Einbruch Elektronikmarkt',d:'Zwei Männer, Fluchtauto',lv:1,secs:45,qs:[
 {q:'In welches Geschäft wurde eingebrochen?',c:'Saturn',w:['Media Markt','Hartlauer','Apple Store'],e:'Schaufenster von „Saturn“ war eingeschlagen.'},
 {q:'Wie hieß die Straße?',c:'Bahnhofstraße',w:['Hauptstraße','Rathausgasse','Annenstraße'],e:'Straßenschild: „Bahnhofstraße“.'},
 {q:'Mit welchem Fahrzeug wollte ein Mann flüchten?',c:'Dunkelblauer BMW Kombi',w:['Schwarzer Audi','Weißer Lieferwagen','Silberner VW Golf'],e:'Dunkelblauer BMW Kombi mit offener Fahrertür.'},
 {q:'Welche Uhrzeit zeigte die Uhr ungefähr?',c:'15:45',w:['12:20','16:45','9:15'],e:'Großer Zeiger auf der 9, kleiner knapp vor der 4: 3:45, also 15:45.'},
 {q:'Was war am Fluchtauto nicht lesbar?',c:'Das Kennzeichen',w:['Die Marke','Die Farbe','Nichts'],e:'Das Kennzeichen war verdeckt bzw. unkenntlich.'},
 {q:'Welches Kleidungsstück trug der Mann beim Auto am Kopf?',c:'Eine schwarze Mütze',w:['Eine Kapuze','Eine Kappe','Nichts'],e:'Mann beim Auto: graue Jacke, schwarze Mütze, schwarze Tasche. Der andere trug eine Kapuze.'}
]},
{id:'s6',img:'img/s6.jpg',t:'Einbruch beim Juwelier',d:'Belebte Straße, viele Zeugen',lv:2,secs:60,qs:[
 {q:'Welches Geschäft lag links neben dem Juwelier?',c:'Eine Apotheke',w:['Eine Bäckerei','Ein Café','Eine Bank'],e:'Links: Apotheke mit grünem Kreuz.'},
 {q:'Welche Farbe hatte der Regenschirm der Frau links?',c:'Rot',w:['Schwarz','Blau','Gelb'],e:'Roter Schirm, bordeauxrote Steppjacke.'},
 {q:'Wie hieß die Straße?',c:'Hauptstraße',w:['Bahnhofstraße','Rathausgasse','Marktgasse'],e:'Straßenschild: „Hauptstraße“.'},
 {q:'Welche Uhrzeit zeigte die Uhr ungefähr?',c:'16:45',w:['15:45','17:20','9:25'],e:'Großer Zeiger auf der 9, kleiner knapp vor der 5: 4:45, also 16:45.'},
 {q:'Was lag in der Pfütze rechts vorne?',c:'Ein Handy',w:['Eine Geldbörse','Ein Schlüssel','Ein Handschuh'],e:'Ein Smartphone in der Pfütze. Der Handschuh lag bei der Bank.'},
 {q:'Welche Farbe hatte die Jacke des Radfahrers?',c:'Gelb',w:['Orange','Rot','Grün'],e:'Radfahrer hinten mit gelber Jacke.'},
 {q:'Welches Fahrzeug stand mit offener Tür auf der Straße?',c:'Dunkelblauer BMW Kombi',w:['Weißer Lieferwagen','Silberner Kleinwagen','Taxi'],e:'Derselbe dunkelblaue BMW Kombi wie beim Saturn-Einbruch.'},
 {q:'Welcher Hund war rechts zu sehen?',c:'Ein heller Golden Retriever',w:['Ein schwarzer Pudel','Ein Dackel','Kein Hund'],e:'Ein Golden Retriever an der Leine.'}
]}
];
