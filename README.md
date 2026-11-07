# Symbolic Society — sito

Sito statico per la vendita delle ricerche audiovisive di Lorenzo Brusci:
catalogo numerato, elaborazioni su commissione (persone, animali, aziende),
certificato di autenticità. Versioni italiana (`/`) e inglese (`/en/`).

## Struttura

- `index.html`, `en/index.html` — pagine IT/EN, form Netlify (elaborazione, galleria, aziende, richiesta opera)
- `app.js` — logica condivisa (demo livelli, catalogo, invio form)
- `style.css`, `fonts/` — stile e carattere Space Grotesk
- `catalogo.json` — catalogo opere (codice, serie, tiratura, prezzo, disponibilità)
- `img/SS-xxxx.jpg` — immagini delle opere
- `registro-opere.csv` — registro interno dei file originali
- `instagram-kit.md` — kit per collegare Instagram al catalogo

## Aggiungere un'opera

1. Assegna il codice progressivo (SS-xxxx, mai riutilizzato) e copia l'immagine in `img/SS-xxxx.jpg`.
2. Aggiungi l'oggetto in `catalogo.json` con `"pubblico": true` (`regime`: `unica` oppure `tiratura`; `prezzo` 0 = prezzo su richiesta).
3. Aggiungi il codice nella didascalia del post Instagram.

## Deploy su Netlify

Cartella di pubblicazione: la radice del progetto (`netlify.toml`).

```sh
netlify deploy --prod
```

Prima volta: `netlify login`, poi `netlify init` (o `netlify sites:create`).
I form (elaborazione, galleria, aziende, richiesta opera) vengono rilevati al deploy
e i messaggi arrivano all'email dell'account Netlify.
