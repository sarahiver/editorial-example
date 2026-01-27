# Cloudinary Setup für IverLasting

## 1. Cloudinary Account erstellen

1. Gehe zu [cloudinary.com](https://cloudinary.com)
2. Erstelle einen kostenlosen Account (25 Credits/Monat = ca. 25.000 Transformationen oder 25GB)
3. Nach der Registrierung landest du auf dem Dashboard

## 2. Cloud Name finden

Auf dem Dashboard siehst du oben links deinen **Cloud Name**:
```
Cloud Name: dein-cloud-name
```

Notiere dir diesen Namen.

## 3. Unsigned Upload Preset erstellen

1. Klicke oben rechts auf das **Zahnrad** (Settings)
2. Gehe zum Tab **Upload**
3. Scrolle zu **Upload presets**
4. Klicke **Add upload preset**

### Preset konfigurieren:

| Einstellung | Wert |
|-------------|------|
| Upload preset name | `iverlasting_unsigned` (oder eigener Name) |
| Signing Mode | **Unsigned** ⚠️ Wichtig! |
| Folder | `iverlasting` (optional, für Organisation) |

### Empfohlene Einstellungen:

**Incoming Transformation** (optional, spart Speicher):
```
c_limit,w_2000,h_2000,q_auto:good,f_auto
```
→ Begrenzt Bilder auf 2000px, optimiert Qualität automatisch

**Allowed formats**: 
- jpg, jpeg, png, webp, heic

Klicke **Save**.

## 4. Vercel Environment Variables setzen

In deinem Vercel Projekt:

1. Gehe zu **Settings** → **Environment Variables**
2. Füge hinzu:

| Key | Value |
|-----|-------|
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | `dein-cloud-name` |
| `REACT_APP_CLOUDINARY_UPLOAD_PRESET` | `iverlasting_unsigned` |

3. Klicke **Save**
4. **Redeploy** das Projekt

## 5. Lokal testen

Erstelle `.env.local` im Projektordner:

```env
REACT_APP_SUPABASE_URL=https://wikxhpvikelfgzdgndlf.supabase.co
REACT_APP_SUPABASE_ANON_KEY=dein-key
REACT_APP_CLOUDINARY_CLOUD_NAME=dein-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=iverlasting_unsigned
```

Dann:
```bash
npm start
```

## 6. Testen

1. Gehe zur PhotoUpload Komponente auf der Seite
2. Klicke auf "Fotos auswählen"
3. Das Cloudinary Widget sollte sich öffnen
4. Wähle ein Bild aus
5. Nach dem Upload erscheint es in der Preview
6. Klicke "Absenden"
7. Das Bild wird in Supabase `photo_uploads` gespeichert

## Troubleshooting

### "Cloudinary ist noch nicht konfiguriert"
→ Environment Variables fehlen. Prüfe Vercel Settings.

### Widget öffnet sich nicht
→ Check Browser Console für Fehler
→ Cloudinary Script in index.html vorhanden?

### Upload schlägt fehl
→ Preset auf "Unsigned" gesetzt?
→ Richtige Cloud Name?

### Bilder erscheinen nicht
→ Check Supabase `photo_uploads` Tabelle
→ RLS deaktiviert?

## Kosten

Cloudinary Free Tier:
- 25 Credits/Monat
- 1 Credit = 1.000 Transformationen ODER 1 GB Speicher/Bandbreite
- Für eine Hochzeit mit ~500 Fotos völlig ausreichend

## Ordnerstruktur in Cloudinary

Bilder werden gespeichert unter:
```
iverlasting/
  └── {projekt-slug}/
      └── photos/
          └── {timestamp}_{original-filename}
```

## Nächste Schritte

- [ ] Hero Hintergrundbild Upload (Admin)
- [ ] Gallery Bilder Upload (Admin)
- [ ] Automatische Thumbnail-Generierung
- [ ] Bildoptimierung (WebP, AVIF)
