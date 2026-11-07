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
     Submissions are sent through Web3Forms (https://web3forms.com), which emails
     them to the address the access key was created for.

     >>> SETUP: paste your Web3Forms access keys below. <<<
       contact   = the form on contact.html     (data-form="contact")
       principal = the form on principals.html  (data-form="principal")
     Both can use the same key. An access key is meant to be public, so it is
     safe to keep it in this file.

     While a key is empty, that form falls back to opening the visitor's email
     app with the message pre-filled, sent to the address in data-recipient. */
  var WEB3FORMS_KEYS = {
    contact: "8b230783-0464-4a6e-8d47-c2f9232213b8",
    principal: "8b230783-0464-4a6e-8d47-c2f9232213b8"
  };
  var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
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

      // Collect the filled-in fields as "Label: value" pairs, in form order.
      var entries = [];
      fields.forEach(function (f) {
        var label = form.querySelector('label[for="' + f.id + '"]');
        var name = label ? label.textContent.replace("*", "").trim() : f.name;
        if (f.value.trim()) entries.push({ name: f.name, label: name, value: f.value.trim() });
      });
      var subjectBase = form.getAttribute("data-subject") || "Website inquiry";
      var typeField = form.querySelector("[name=inquiry_type]");
      var companyField = form.querySelector("[name=company]");
      var subject = subjectBase +
        (typeField && typeField.value ? " — " + typeField.value : "") +
        (companyField && companyField.value ? " (" + companyField.value.trim() + ")" : "");
      var to = form.getAttribute("data-recipient") || "";
      var key = WEB3FORMS_KEYS[form.getAttribute("data-form")] || "";

      if (key) {
        // hCaptcha: the widget writes its one-time token into this textarea.
        var captchaBox = form.querySelector(".h-captcha");
        var captchaError = form.querySelector(".captcha-error");
        var tokenField = form.querySelector("textarea[name=h-captcha-response]");
        var token = tokenField ? tokenField.value : "";
        if (captchaBox && !token) {
          var msg = window.hcaptcha
            ? "Please complete the captcha check."
            : "The spam check didn't load. Please reload the page, or check your internet connection.";
          if (captchaError) { captchaError.textContent = msg; captchaError.parentNode.classList.add("has-error"); }
          showStatus(status, false, msg);
          return;
        }
        if (captchaError) { captchaError.textContent = ""; captchaError.parentNode.classList.remove("has-error"); }
        sendViaWeb3Forms(form, key, subject, entries, status, to, token);
      } else {
        openMailApp(to, subject, entries, status);
        form.reset();
      }
    });
  });

  function showStatus(status, ok, text) {
    if (!status) return;
    status.className = "form-status " + (ok ? "is-success" : "is-error");
    status.textContent = text;
  }

  function resetCaptcha() {
    try { if (window.hcaptcha) window.hcaptcha.reset(); } catch (e) { /* widget not rendered */ }
  }

  function sendViaWeb3Forms(form, key, subject, entries, status, fallbackEmail, captchaToken) {
    var button = form.querySelector("[type=submit]");
    var buttonHtml = button ? button.innerHTML : "";
    if (button) { button.disabled = true; button.textContent = "Sending…"; }

    var payload = {
      access_key: key,
      subject: subject,
      from_name: "Therapeutic Pharma website"
    };
    entries.forEach(function (en) { payload[en.label] = en.value; });
    // Lets you press "Reply" in the notification email to answer the visitor.
    var emailEntry = entries.filter(function (en) { return en.name === "email"; })[0];
    if (emailEntry) payload.replyto = emailEntry.value;
    if (captchaToken) payload["h-captcha-response"] = captchaToken;

    fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && r.data && r.data.success) {
          showStatus(status, true, "Thank you — your inquiry has been sent. Our team will get back to you soon.");
          form.reset();
        } else {
          throw new Error((r.data && r.data.message) || "Submission failed");
        }
      })
      .catch(function () {
        showStatus(status, false, "Sorry, your inquiry could not be sent. Please try again, or email us directly at " + fallbackEmail.split(",")[0] + ".");
      })
      .then(function () {
        if (button) { button.disabled = false; button.innerHTML = buttonHtml; }
        resetCaptcha(); // tokens are single-use
      });
  }

  function openMailApp(to, subject, entries, status) {
    var body = entries.map(function (en) { return en.label + ": " + en.value; }).join("\n") +
      "\n\n— Sent from the Therapeutic Pharma & Distributor website";
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    showStatus(status, true, "Thank you. Your email app should open with your inquiry ready to send. If it doesn't, please email " + to.split(",")[0] + " directly.");
  }
})();
