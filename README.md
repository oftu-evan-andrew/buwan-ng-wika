# Buwan ng Wika

Monorepo para sa mga proyektong may kaugnayan sa Buwan ng Wika.

## Structure

```
apps/
  balagtas/             # One-page website tungkol kay Francisco Balagtas
  hernandez/            # Digital archive ng Noli Me Tángere
  likha-noli-me-tangere/ # Digital archive ng Noli Me Tángere (LIKHA)
  mythology/            # [Description needed]
  wikang_filipino/      # [Description needed]
```

## apps/balagtas

Isang single-page website (pure HTML/CSS/JS) tungkol sa buhay at mga akda ni
Francisco Balagtas ("Ama ng Panitikang Filipino"). Buong nilalaman ay nasa
wikang Filipino.

- Opening: `apps/balagtas/index.html`
- Walang framework o build tool — buksan lang ang `index.html` sa browser.

### Mga image assets

- `balagtas.jpg` — larawan ni Balagtas
- `florante-cover.png` — pabalat ng Florante at Laura (public domain, 1913)
- `larawan-kalikasan.jpg` — hagdan-hagdang palayan (CC BY-SA 4.0)
- `mabini-stamp.jpg` — selyo ni Apolinario Mabini (public domain)

## apps/hernandez

Isang digital archive (single-page website) tungkol sa "Noli Me Tángere" ni José Rizal.
Ang website ay may interactive features tulad ng character profiles, timeline, quiz, at contact form.
Buong nilalaman ay nasa wikang Filipino.

- Opening: `apps/hernandez/index.html`
- External CSS: `Krisnel.css`
- External JavaScript: `Script.js`
- Walang framework o build tool — buksan lang ang `index.html` sa browser.

### Mga image assets

Ang lahat ng larawan ay nasa `images/` directory. Kasalukuyang may mga placeholder references para sa character images na maaaring idagdag sa hinaharap.

## apps/likha-noli-me-tangere

Isang digital archive (single-page website) tungkol sa "Noli Me Tángere" ni José Rizal, kasama ang kasaysayan, buod, mga tauhan, tema, pamana, at isang quiz.
Buong nilalaman ay nasa wikang Filipino.

- Opening: `apps/likha-noli-me-tangere/index.html`
- Walang framework o build tool — buksan lang ang `index.html` sa browser.

### Mga image assets

Ang lahat ng larawan (pabalat, mga tauhan) ay nasa `images/` directory.
