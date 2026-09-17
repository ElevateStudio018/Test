# MarkMontage — webbplats

En fristående, responsiv webbplats för MarkMontage, gräventreprenör i Romelanda
med omnejd. Ren HTML/CSS/JS utan byggsteg eller beroenden — enkel att
förhandsgranska, hosta och underhålla.

## Innehåll

- `index.html` — hela sidan (hero, om oss, tjänster, foton, omdömen, karta/kontakt)
- `assets/css/style.css` — designsystem och layout
- `assets/js/main.js` — mobilmeny, header vid scroll, live öppet/stängt-status
  (Europe/Stockholm, mån–fre 07–16) och bildspel/lightbox för galleriet
- `assets/img/*.svg` — originalillustrationer för galleriet (se nedan)
- `favicon.svg` — enkel monogram-favicon

## Om designen

Sidan är en egen, fristående design inspirerad av strukturen hos moderna
branschsajter (fullskärmshero, tjänstegrid, omdömen, karta) — inget innehåll,
bilder eller kod är kopierat från coreco.se. Den sajten kunde faktiskt inte nås
från den här miljön (nätverkspolicyn blockerade domänen), så designen bygger
inte på att ha sett den sidans faktiska text eller bilder. Färgpalett,
typografi, texter och illustrationer nedan är alla original, framtagna för
MarkMontage.

Företagsuppgifterna (namn, adress, telefon, öppettider, betyg och de två
fullständiga recensionerna) är hämtade direkt från den Google-listning
användaren klistrade in, inget är påhittat.

## Foton

Bilderna i galleriet och bakgrunden i hero-sektionen är handritade SVG-
illustrationer i företagets färgpalett — inte riktiga fotografier. Det beror
på att inga verkliga projektbilder fanns tillgängliga när sidan byggdes, och
generiska lagerbilder av grävmaskiner hade gett ett missvisande intryck av att
vara MarkMontages egna projekt. Byt gärna ut filerna i `assets/img/` mot
riktiga foton från företagets projekt — samma filnamn fungerar direkt.

## Kartan

Kontaktsektionen bäddar in Google Maps via den nyckel-fria
`maps.google.com/maps?...&output=embed`-metoden, adresserad till "MarkMontage,
Aleklätten, 442 91 Romelanda". Det gick inte att förhandsgranska kartan i den
här miljön (nätverkspolicyn blockerar Google Maps-domäner härifrån), så
kontrollera gärna kartan och "Vägbeskrivning"-länken i en vanlig webbläsare
efter driftsättning.

## Förhandsgranska lokalt

Inget byggsteg krävs. Starta valfri statisk server i projektmappen, t.ex.:

```
python3 -m http.server 8000
```

och öppna sedan `http://localhost:8000/`.

## Driftsättning

Statiska filer — fungerar direkt på GitHub Pages, Vercel, Netlify eller
liknande utan konfiguration.
