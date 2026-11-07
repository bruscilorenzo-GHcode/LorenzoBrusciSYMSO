# Instagram ↔ symbolicsociety.com

## Principio
Instagram mostra e fa scoprire; il sito cerca, vende e certifica. Ogni opera in vendita ha un codice (SS-0147) che compare in tre posti: nella didascalia del post, nel catalogo del sito, nel certificato.

## Link
- Link in bio: `https://symbolicsociety.com/#catalogo`
- Link diretto a un'opera (da mettere nelle storie e nei DM): `https://symbolicsociety.com/#SS-0147` oppure `https://symbolicsociety.com/?o=SS-0147`. Apre la scheda e il modulo di richiesta già compilato.
- Link per chi manda una foto: `https://symbolicsociety.com/#elabora`

## Bio (150 caratteri circa)
Immagini e suoni composti. Opere numerate, ritratti su commissione, per persone, animali e aziende. Catalogo e certificati ↓

## Didascalia tipo per un'opera in vendita
> [titolo]
> SS-0147 · tiratura di 5 (1/5 disponibile) · [tecnica]
> Richiedi: symbolicsociety.com/#SS-0147 (link in bio)

Per i post vecchi basta aggiungere in fondo la riga con il codice, solo alle opere che metti in catalogo. Non serve toccare tutto il feed.

## Highlight (per serie, non per data)
Un highlight per ogni serie in catalogo, con il nome della serie e le opere numerate. Più un highlight fisso "Elaborazioni" con tre prima/dopo e dieci secondi di audio, e uno "Come si compra" con cinque storie: codice, anteprima gratuita, livelli, certificato, consegna.

## Storie a slot
> Questa settimana ho due slot per elaborazioni di livello III e IV. Mandami una foto in DM o dal sito: symbolicsociety.com/#elabora

## Risposta automatica ai DM (se la attivi)
> Grazie del messaggio. Per un'opera del catalogo scrivimi il codice (SS-xxxx). Per un'elaborazione della tua immagine usa symbolicsociety.com/#elabora: riceverai un'anteprima gratuita con filigrana.

## Numerazione
- SS-xxxx: opere di catalogo (progressivo, mai riutilizzato)
- PR-xxxx: elaborazioni per privati (registro interno, mai pubblico)
- PT-xxxx: ritratti di animali (registro interno, mai pubblico)

## Ordine di lavoro per le migliaia di immagini
1. Parti dalle serie recenti e scegli le prime 30-50 opere.
2. Per ognuna: assegna il codice, controlla i diritti (immagini, voci, musiche di terzi), decidi unica o tiratura.
3. Aggiungila a `catalogo.json` con `"pubblico": true` e copia il file immagine in `img/SS-xxxx.jpg`.
4. Aggiungi la riga con il codice alla didascalia del post su Instagram.
