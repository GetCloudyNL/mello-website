# Mello Website

Website voor de Mello app - een rustgevende white noise & ambient sounds app voor iOS.

## Structuur

```
mello-website/
├── index.html      # Hoofdpagina
├── styles.css      # Alle styling
├── script.js       # Minimale JavaScript
├── assets/         # Afbeeldingen
│   ├── app-mockup.png      # App mockup (transparant, aan te leveren)
│   ├── favicon.png         # Favicon
│   ├── apple-touch-icon.png # iOS icon
│   └── og-image.png        # Social sharing image
└── README.md
```

## Lokaal bekijken

Open `index.html` in je browser, of start een lokale server:

```bash
# Met Python 3
python3 -m http.server 8000

# Met Node.js (npx)
npx serve
```

Ga naar `http://localhost:8000`

## Assets die je moet toevoegen

1. **`assets/app-mockup.png`** - Transparante app mockup voor de hero sectie
   - Aanbevolen grootte: 720x1440px (of vergelijkbaar)
   - Formaat: PNG met transparante achtergrond

2. **`assets/favicon.png`** - Favicon (32x32px of 64x64px)

3. **`assets/apple-touch-icon.png`** - iOS home screen icon (180x180px)

4. **`assets/og-image.png`** - Social sharing image (1200x630px)

## Aanpassen

### Kleuren wijzigen
Alle kleuren staan in CSS variabelen bovenaan `styles.css`:

```css
:root {
    --mello-green: #A5BEA9;
    --warm-beige: #F5F0EB;
    --deep-text: #2F3A44;
    --soft-text: #5A6B7D;
    --soft-pink: #F4CEC7;
}
```

### App Store link
Vervang de placeholder links in `index.html`:

```html
<a href="https://apps.apple.com/app/mello" ...>
```

### Contact email
Pas het email adres aan in de footer:

```html
<a href="mailto:hello@mellosounds.app" ...>
```

## Hosting

Deze website is een statische site en kan gehost worden op:

- **Vercel** - Gratis, automatische deploys vanuit Git
- **Netlify** - Gratis, automatische deploys vanuit Git  
- **GitHub Pages** - Gratis voor publieke repositories
- **Cloudflare Pages** - Gratis, snelle CDN

## Domein

Koppel je domein `mellosounds.app` aan je hosting provider.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

Gemaakt met ❤️ door Ralph & Lisa
