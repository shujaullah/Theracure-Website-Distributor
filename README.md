# Therapeutic Pharma & Distributor — Website

Static HTML5 / CSS3 / JavaScript website built from the *Website Development Plan* PDF in this folder.
It needs no build step: open `index.html` in a browser, or upload the whole folder to any web host.

## Pages

| File | Page (from the plan) |
|---|---|
| `index.html` | Home: header, hero, about preview, strengths, services, principals, operations, partnership CTA, footer |
| `about.html` | About Us: background, mission, vision, values, management profiles |
| `services.html` | Our Services: distribution, order coordination, supply-chain support, customer communication |
| `principals.html` | Our Principals & Partners: logo grid and the principal inquiry form |
| `operations.html` | Our Operations: photo gallery, order-to-delivery process, Karachi coverage map, quality practices |
| `contact.html` | Contact Us: address, phone, email, WhatsApp, map, business inquiry form |
| `privacy.html` | Privacy notice (linked from the footer and both forms) |
| `404.html` | Not-found page |

```
assets/css/style.css   all styles (brand colours are CSS variables at the top)
assets/js/main.js      mobile menu, scroll effects, form validation and sending
assets/images/         logo (taken from the PDF, transparent background), favicon
sitemap.xml, robots.txt
```

Brand colours: Medical Blue `#07517D`, Healthcare Green `#4D9B70`, Dark Text `#233746`, Soft Background `#F2F7F8`.

## Before launch: content to supply

The pages show **dashed placeholder boxes** wherever real material is needed. Every one of them must be replaced before the site goes live.

- [ ] **Logo:** the current logo was taken from the PDF at 425×175 px. Replace `assets/images/logo.png` with the original vector or high-resolution file.
- [ ] **Principal logos:** add only authorised logos (`index.html` and `principals.html`). The HTML comments next to the grids show the markup to use.
- [ ] **Photos:** real office and warehouse photographs only (`index.html`, `about.html`, `operations.html`).
- [ ] **Company history:** year established and verified history (`about.html`, marked with an orange tag).
- [ ] **Warehousing and inventory services:** publish these only after they are confirmed (`services.html`, shown as a notice for now).
- [ ] **Operations process:** confirm the 5-step order-to-delivery flow with the operations team (`operations.html`).
- [ ] **Quality practices, licences and certifications:** publish only verified details (`operations.html`, shown as a notice for now).
- [ ] **Contact details:** confirm the public phone and email addresses. Switch to a branded email when it exists.
- [ ] **Map pin:** check that the Google Maps embed points to the exact office. If it doesn't, replace the `iframe src` with the "Embed a map" URL from Google Maps.
- [ ] **Domain:** replace `https://www.your-domain.com` in `sitemap.xml` and `robots.txt`.
- [ ] **Analytics:** paste the GA4 snippet where the comment `<!-- Analytics: ... -->` appears in each page's `<head>`.
- [ ] **Privacy notice:** have it reviewed so it matches actual practices.

**Regulatory note (from the plan):** do not add claims such as "DRAP certified", "GDP compliant" or "temperature-controlled warehousing" unless they are verified. There is no product catalogue, pricing or checkout, by design.

## Forms

Both forms check the required fields, email and phone format, and include a hidden honeypot field to block simple spam bots. A static site has no server, so on submit the form opens the visitor's email app with the message already filled in:

- Contact form → `khu.ahmed09@gmail.com`
- Principal inquiry → `syedkingasif@yahoo.com` and `khu.ahmed09@gmail.com`

To change a recipient, edit the form's `data-recipient` attribute. For production, send submissions directly from the server instead: use Contact Form 7 or WPForms with reCAPTCHA or Turnstile on WordPress, or a form service such as Formspree on static hosting.

## Moving to WordPress (the platform named in the plan)

The markup was written so it can become a lightweight custom theme:

1. Header markup (`<header class="site-header">`) → `header.php`. Footer and WhatsApp button → `footer.php`.
2. Each page body (`<main>`) → a page template (`page-about.php`, etc.) or a block pattern.
3. `style.css` and `main.js` → load them with `wp_enqueue_style` and `wp_enqueue_script`.
4. Principal logos and photos → ACF fields or a custom post type, so staff can edit them without coding.
5. Forms → Contact Form 7 or WPForms. SEO → Yoast or Rank Math (titles, meta, sitemap). Security → HTTPS, backups, limited admin accounts.

Until then, the header and footer are repeated in every HTML file. A change to them has to be made in each page.

## Already built in

Responsive layouts for mobile, tablet and desktop · keyboard navigation and a skip link · visible focus states · alt text and ARIA labels · reduced-motion support · per-page titles and meta descriptions · Organization structured data (JSON-LD) · lazy-loaded maps · `font-display: swap` · WhatsApp floating button.
