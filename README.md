# Mehr Pflegekräfte — Website

Statische, mehrseitige Website für Mehr Pflegekräfte, eine Personalvermittlung für Pflegefachkräfte an ambulante und stationäre Pflegedienste in Deutschland, zum Festpreis statt Provision.

Kein Build-Prozess nötig: reines HTML, CSS und Vanilla-JavaScript. Läuft auf jedem Static-Hosting (GitHub Pages, Netlify, Vercel, klassischer Webspace).

## Struktur

```
├── index.html              Startseite
├── leistungen.html          Leistungen & Festpreis-Modell
├── ueber-uns.html            Über das Unternehmen
├── kontakt.html               Kontaktformular & Terminbuchung
├── faq.html                    Häufige Fragen (FAQPage-Schema)
├── impressum.html          Platzhalter, vor Livegang ausfüllen
├── datenschutz.html        Platzhalter, vor Livegang ausfüllen
├── pflegedienste/            Regionale Landingpages (Berlin, Hamburg, Köln, Frankfurt, München)
├── css/style.css              Zentrales Design-System
├── js/script.js                Interaktionen (Cursor, Slider, Modal, Animationen)
├── robots.txt
└── sitemap.xml
```

## Lokal ansehen

Kein Server nötig, `index.html` direkt im Browser öffnen. Für relative Pfade empfiehlt sich trotzdem ein simpler lokaler Server:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen.

## Vor dem Livegang unbedingt erledigen

- [ ] Echte Calendly-URL in `js/script.js` (`CALENDLY_URL`) eintragen
- [ ] `impressum.html` und `datenschutz.html` mit den rechtsverbindlichen Angaben füllen
- [ ] Platzhalter-Bilder (aktuell Lorem-Picsum-Fotos) durch echte, lizenzierte oder eigene Fotos ersetzen
- [ ] Kontaktformular in `kontakt.html` an ein echtes Backend/CRM anbinden
- [ ] Domain, `canonical`-URLs und `sitemap.xml` mit der finalen Domain abgleichen
- [ ] Google Search Console & Bing Webmaster Tools einrichten, Sitemap einreichen

## Deployment über GitHub Pages

1. Repository auf GitHub anlegen und diesen Code pushen (siehe unten)
2. Unter **Settings → Pages** als Quelle den Branch `main` und Ordner `/ (root)` wählen
3. Nach wenigen Minuten ist die Seite unter `https://<username>.github.io/<repo>/` erreichbar
4. Für die eigene Domain `mehrpflegekraefte.de`: unter **Settings → Pages → Custom domain** eintragen und beim Domain-Anbieter die passenden DNS-Einträge (A-Records auf GitHub Pages IPs bzw. CNAME) setzen

## Lizenz

Internes Projekt, keine Weitergabe ohne Rücksprache.
