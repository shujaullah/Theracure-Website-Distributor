/* Therapeutic Pharma & Distributor — site scripts */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { closeNav(); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1080) closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Inquiry forms ----------
     Static fallback: validates, blocks honeypot spam, then opens the visitor's
     email client with a pre-filled message to the address in data-recipient.
     In WordPress, replace with Contact Form 7 / WPForms (plus reCAPTCHA or Turnstile). */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+()\-\s\d]{7,20}$/;

  function setError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    var err = wrap.querySelector(".error");
    wrap.classList.toggle("has-error", !!message);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) err.textContent = message || "";
  }

  function validateField(field) {
    var v = (field.value || "").trim();
    if (field.required && !v) return "This field is required.";
    if (v && field.type === "email" && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
    if (v && field.type === "tel" && !PHONE_RE.test(v)) return "Please enter a valid phone number.";
    return "";
  }

  document.querySelectorAll("form[data-inquiry-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var fields = form.querySelectorAll("input:not([type=hidden]):not([name=website]), select, textarea");

    fields.forEach(function (f) {
      f.addEventListener("blur", function () { setError(f, validateField(f)); });
      f.addEventListener("input", function () {
        if (f.closest(".field.has-error")) setError(f, validateField(f));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.className = "form-status"; status.textContent = ""; }

      // Honeypot — real visitors never fill this hidden field.
      var hp = form.querySelector("[name=website]");
      if (hp && hp.value) return;

      var firstInvalid = null;
      fields.forEach(function (f) {
        var msg = validateField(f);
        setError(f, msg);
        if (msg && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Please correct the highlighted fields and try again.";
        }
        return;
      }

      var lines = [];
      fields.forEach(function (f) {
        var label = form.querySelector('label[for="' + f.id + '"]');
        var name = label ? label.textContent.replace("*", "").trim() : f.name;
        if (f.value.trim()) lines.push(name + ": " + f.value.trim());
      });
      var subjectBase = form.getAttribute("data-subject") || "Website inquiry";
      var typeField = form.querySelector("[name=inquiry_type]");
      var companyField = form.querySelector("[name=company]");
      var subject = subjectBase +
        (typeField && typeField.value ? " — " + typeField.value : "") +
        (companyField && companyField.value ? " (" + companyField.value.trim() + ")" : "");
      var to = form.getAttribute("data-recipient") || "";
      var href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n") + "\n\n— Sent from the Therapeutic Pharma & Distributor website");

      window.location.href = href;
      if (status) {
        status.classList.add("is-success");
        status.textContent = "Thank you. Your email app should open with your inquiry ready to send. If it doesn't, please email " + to + " directly.";
      }
      form.reset();
    });
  });
})();
