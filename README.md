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
- [ ] **Photos (optional, currently hidden):** photo areas were removed until good-quality real photos exist. Each spot is marked in the HTML with `<!-- Photos hidden until ... -->`. When photos are ready, put them in `assets/images/` and add them to:
  - `about.html`: next to "Company background" (currently the "At a glance" panel)
  - `operations.html`: a "Our facilities" gallery section above "From order to delivery"
  - `index.html` (optional): the "At a glance" panel or the map in the operations section
- [x] **Year established:** October 2026 (`about.html`, and `foundingDate` in the structured data on `index.html` and `contact.html`).
- [ ] **Company history:** optional, any further verified milestones (`about.html`).
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

Both forms check the required fields, email and phone format, and include a hidden honeypot field to block simple spam bots. Submissions are delivered by email through [Web3Forms](https://web3forms.com), because GitHub Pages has no server of its own.

**Setup (one time):**
1. Go to https://web3forms.com, enter the email address that should receive inquiries, and click **Create Access Key**. The key arrives by email.
2. Paste the key into `WEB3FORMS_KEYS` at the top of the forms section in `assets/js/main.js`:
   ```js
   var WEB3FORMS_KEYS = {
     contact: "your-key-here",     // contact.html
     principal: "your-key-here"    // principals.html (same key, or a second key for another inbox)
   };
   ```
3. Commit and push, then send a test inquiry from the live site.

**Spam protection** has three layers:
1. **hCaptcha** (free through Web3Forms, no separate account): a captcha widget on both forms. The visitor must complete it before the form will send. In the Web3Forms dashboard (app.web3forms.com) → your form → settings, **hCaptcha must be enabled**, or the server won't check the captcha.
2. **Web3Forms' server-side spam filter**: always on, no setup.
3. **Hidden honeypot field**: silently drops submissions from simple bots that fill in every field.

Each key delivers to one email address. To send principal inquiries to a different person, create a second key with that person's email and use it for `principal`.

**Until a key is added**, that form falls back to opening the visitor's email app with the message pre-filled, addressed to the form's `data-recipient`:
- Contact form → `khu.ahmed09@gmail.com`
- Principal inquiry → `syedkingasif@yahoo.com` and `khu.ahmed09@gmail.com`

If a submission fails (for example, no internet connection), the visitor keeps what they typed and is shown the email address to contact instead.

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
