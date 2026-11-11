# Compensi spettacolo: sito, app per Mac/Windows/Android e cloud cifrato

Questo pacchetto contiene:

| Cosa | Dove |
|---|---|
| App MARTINELLI (aziendale) | cartella `MARTINELLI` |
| App TOTEM (copia di MARTINELLI per un'altra azienda, stessa pagina, nome e dati separati) | usa la cartella `MARTINELLI` |
| App AUTONOMI SPETTACOLO (singolo musicista) | cartella `AUTONOMI-SPETTACOLO` |
| Collegamento al cloud (da compilare) | `sync-config.js` |
| Preparazione del cloud (Supabase) | `supabase-setup.sql` |
| Costruzione automatica degli installer | `.github/workflows/build-app.yml` e cartella `native` |

**Regola d'oro:** su GitHub e Vercel vanno solo i programmi. I dati dei musicisti non vanno mai caricati lì: stanno sul dispositivo e, cifrati, su Supabase.

---

## 1. Supabase (il cloud)

1. Su supabase.com apri il tuo progetto.
2. Menu **SQL Editor** > **New query**. Apri il file `supabase-setup.sql`, copia tutto il contenuto, incollalo e premi **Run**. Deve comparire «Success». (Si può rieseguire senza problemi.)
3. **Crea il tuo utente**: menu **Authentication** > **Users** > **Add user** > **Create new user**. Scrivi la tua email e una password, e spunta **Auto Confirm User**. Questa è la password dell'account: conservala, ti serve su ogni dispositivo.
4. **Chiudi le iscrizioni** così nessun altro può crearsi un account: **Authentication** > **Sign In / Providers** (o «Settings») e disattiva **Allow new users to sign up**. (Se le voci hanno nomi leggermente diversi, cerca quella sulle iscrizioni dei nuovi utenti.)
5. **Copia i due codici del progetto**: **Project Settings** > **API Keys** (o il pulsante **Connect**):
   - **Project URL** (tipo `https://abcdefgh.supabase.co`)
   - la chiave **anon** oppure **publishable** (la lunga stringa pubblica)

   Non usare mai la chiave `service_role` / `secret`, e non scrivere mai la password di Supabase in nessun file.

## 2. Compila `sync-config.js`

Apri `sync-config.js` con il Blocco note e scrivi i due codici tra gli apici:

```js
window.SYNC_CFG = {
  url: 'https://abcdefgh.supabase.co',
  key: 'la-chiave-pubblica'
};
```

(Puoi anche mandarmeli e ti restituisco i file già pronti.) Se lasci il file vuoto le app funzionano lo stesso: i due codici si possono inserire a mano su ogni dispositivo, nelle Impostazioni.

## 3. GitHub

1. Nel repository esistente: **Add file** > **Upload files**. Trascina il contenuto di questa cartella (`index.html`, `vercel.json`, `robots.txt`, `sync-config.js`, `supabase-setup.sql`, `LEGGIMI.md`, `.gitignore` se lo vedi, e le cartelle `MARTINELLI`, `AUTONOMI-SPETTACOLO`, `native`). I file con lo stesso nome vengono sostituiti. Poi **Commit changes**.
2. **Il file della procedura automatica** (`.github/workflows/build-app.yml`) si trova in una cartella nascosta, che di solito non si riesce a trascinare. Crealo così: **Add file** > **Create new file**, nel campo del nome scrivi esattamente `.github/workflows/build-app.yml` (le barre creano le cartelle da sole), apri sul computer il file `native/build-app.yml.txt`, copia tutto il testo e incollalo nella casella grande. **Commit changes**.
3. Vercel ripubblica da solo i siti in circa un minuto. Gli indirizzi non cambiano.

## 4. Costruire gli installer (Windows, Mac, Android)

1. Su GitHub apri la scheda **Actions**. Se compare un avviso, premi **I understand my workflows, go ahead and enable them**.
2. A sinistra scegli **Costruisci le app**, poi a destra **Run workflow** > **Run workflow**.
3. Aspetta 10-20 minuti. Quando tutte le righe sono verdi, torna alla pagina principale del repository: a destra, sotto **Releases**, compare **App versione N**. Aprila: lì ci sono i file da scaricare.
4. Se qualche riga diventa rossa: aprila, copia le ultime righe di errore e mandamele; si sistema.

I file:

| File | Per cosa |
|---|---|
| `martinelli-win-x64.exe`, `autonomi-win-x64.exe` | Windows a 64 bit |
| `martinelli-win-ia32.exe`, `autonomi-win-ia32.exe` | Windows a 32 bit |
| `martinelli-mac-arm64.dmg`, `autonomi-mac-arm64.dmg` | Mac con chip Apple (M1, M2, M3, M4) |
| `martinelli-mac-x64.dmg`, `autonomi-mac-x64.dmg` | Mac con processore Intel |
| `martinelli-android.apk`, `autonomi-android.apk`, `totem-android.apk` | Android |
| `totem-win-x64.exe`, `totem-win-ia32.exe`, `totem-mac-arm64.dmg`, `totem-mac-x64.dmg` | TOTEM per Windows e Mac |

Requisiti: Windows 10 o successivo (a 32 o 64 bit); Mac con macOS 10.15 (Catalina) o successivo.

Per sapere che Mac hai: menu Apple > **Informazioni su questo Mac**: se c'è scritto «Chip Apple...» usa arm64, se c'è «Processore Intel» usa x64.

## 5. Installazione (compaiono avvisi: è normale)

I programmi non sono firmati con i certificati a pagamento di Microsoft e Apple, quindi i sistemi mostrano un avviso la prima volta.

- **Windows:** doppio clic sull'`.exe`. Se compare «Windows ha protetto il PC»: **Ulteriori informazioni** > **Esegui comunque**.
- **Mac:** apri il `.dmg` e trascina l'app in **Applicazioni**. Alla prima apertura: tasto destro sull'app > **Apri** > **Apri**. Su macOS 15 o successivi, se non compare «Apri»: doppio clic, poi **Impostazioni di Sistema** > **Privacy e sicurezza** > in basso **Apri comunque**. Se dice che l'app è «danneggiata», apri il Terminale e scrivi (una riga per app):
  `xattr -cr /Applications/MARTINELLI.app`
  `xattr -cr "/Applications/AUTONOMI SPETTACOLO.app"`
- **Android:** scarica l'`.apk` dal telefono, aprilo e consenti l'installazione da questa fonte quando richiesto. Se Play Protect avvisa, scegli **Installa comunque**.

Ogni app ha i propri dati, separati dalle altre e dal sito.

## 6. Attivare il cloud (una volta per dispositivo)

Dentro l'app: scheda **Azienda** (o Impostazioni), blocco **Cloud cifrato (Supabase)**.

**Primo dispositivo (quello con i dati giusti):**
1. Scrivi email e password dell'account Supabase.
2. Scegli una **passphrase** di almeno 8 caratteri e scrivila due volte. È la chiave che cifra i dati: nessuno, nemmeno Supabase, può leggerli senza. **Se la perdi i dati sul cloud non si recuperano**: scrivila in un posto sicuro e continua a fare il backup `.json`.
3. **Accedi e attiva**. I dati vengono inviati cifrati.

**Altri dispositivi:** stessa email, stessa password, **stessa passphrase** (una volta sola). I dati si scaricano da soli.

Da quel momento a ogni modifica l'app salva sul dispositivo e sul cloud; ogni minuto e quando riapri l'app controlla se c'è una versione più recente. In alto compare «☁ sincronizzato alle HH:MM».

- **Senza rete** si lavora normalmente: «☁ da sincronizzare», e alla prima connessione parte da solo.
- **Se hai modificato i dati su due dispositivi senza che si siano sincronizzati**, l'app ti chiede quali tenere. L'altra versione non va persa: resta come copia di sicurezza o tra le «Versioni precedenti nel cloud» (le ultime 30, con il pulsante **Ripristina**).
- **Scollega questo dispositivo** ferma la sincronizzazione senza cancellare nulla.

## 7. Aggiornamenti futuri

Quando ricevi nuovi file: carica su GitHub le cartelle `MARTINELLI` e `AUTONOMI-SPETTACOLO` (Vercel si aggiorna da solo) e rilancia **Costruisci le app** per avere gli installer nuovi. Per aggiornare un'app già installata basta installare la nuova versione sopra quella vecchia: i dati restano.
Su Android l'aggiornamento funziona solo con gli APK costruiti da questa procedura (usano sempre la stessa chiave di firma).

## Avvertenze

- I dati dei musicisti (codici fiscali, IBAN) sono dati personali: sul cloud arrivano **solo cifrati**; la passphrase resta solo tua. Tieni il repository GitHub **privato**.
- Fai comunque un **Esporta backup** (.json) dopo ogni mese.
- Le due app usano archivi distinti sul cloud (`azienda` e `lavoratore`): non si mescolano.
- Sui siti Vercel e nelle app puoi usare lo stesso account Supabase.
