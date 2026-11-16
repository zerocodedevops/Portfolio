/**
 * Zero Plague — Gestión centralizada de formularios de demostración (Fase 4)
 * Validación accesible, estados de carga y confirmación demo sin envío ni almacenamiento real.
 */
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  if (!forms.length) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^[+\d\s()-]{9,20}$/;
  const CP_RE = /^\d{5}$/;

  const getErrorId = (field, idx) => `${field.id || field.name || "field-" + idx}-error`;

  const clearFieldError = (field, idx) => {
    field.removeAttribute("aria-invalid");
    field.classList.remove("border-error", "ring-1", "ring-error");
    const errEl = document.getElementById(getErrorId(field, idx));
    if (errEl) errEl.remove();
  };

  const showFieldError = (field, idx, message) => {
    clearFieldError(field, idx);
    field.setAttribute("aria-invalid", "true");
    field.classList.add("border-error", "ring-1", "ring-error");

    const errId = getErrorId(field, idx);
    field.setAttribute("aria-describedby", errId);

    const errEl = document.createElement("p");
    errEl.id = errId;
    errEl.setAttribute("role", "alert");
    errEl.className = "mt-1.5 text-body-sm text-error font-medium flex items-center gap-1";
    errEl.innerHTML = `<span class="material-symbols-outlined text-[16px]" aria-hidden="true">error</span><span>${message}</span>`;

    const anchor = field.type === "checkbox" && field.closest("div") ? field.closest("div") : field;
    anchor.insertAdjacentElement("afterend", errEl);
  };

  const validateField = (field) => {
    const val = (field.value || "").trim();
    if (field.type === "checkbox" && field.required && !field.checked) {
      return "Debes aceptar esta casilla para continuar con la demostración.";
    }
    if (field.required && !val) {
      return "Este campo es obligatorio.";
    }
    if (val && field.type === "email" && !EMAIL_RE.test(val)) {
      return "Introduce un correo electrónico válido (ej. nombre@dominio.com).";
    }
    if (val && field.type === "tel" && !PHONE_RE.test(val)) {
      return "Introduce un teléfono válido de al menos 9 dígitos.";
    }
    if (val && (field.id === "codigo_postal" || field.id === "postalCode") && !CP_RE.test(val)) {
      return "Introduce un código postal válido de 5 dígitos.";
    }
    return "";
  };

  const showDemoConfirmation = (form) => {
    const existingBanner =
      form.querySelector("#calc-result, #final-confirm, #form-success-banner, [data-demo-confirm]") ||
      document.querySelector(
        form.id === "calc-form"
          ? "#calc-result"
          : form.id === "diagnostic-form"
          ? "#form-success-banner"
          : form.id === "final-lead-form"
          ? "#final-confirm"
          : null
      );

    const demoNotice =
      "Simulación completada: esta es una demostración comercial de Zero Plague; no se han enviado ni almacenado datos reales.";

    if (existingBanner) {
      existingBanner.classList.remove("hidden");
      let note = existingBanner.querySelector("[data-demo-note]");
      if (!note) {
        note = document.createElement("p");
        note.setAttribute("data-demo-note", "true");
        note.className = "mt-2 text-body-sm font-semibold text-secondary";
        existingBanner.appendChild(note);
      }
      note.textContent = demoNotice;
      existingBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const banner = document.createElement("div");
    banner.setAttribute("data-demo-confirm", "true");
    banner.setAttribute("role", "status");
    banner.className =
      "col-span-full mt-4 p-4 rounded-xl bg-secondary-container/40 border border-secondary text-on-secondary-fixed flex items-start gap-3";
    banner.innerHTML = `<span class="material-symbols-outlined text-secondary text-[22px] shrink-0" aria-hidden="true">check_circle</span><div><p class="font-label-md font-bold">Solicitud de demostración validada</p><p class="text-body-sm mt-0.5">${demoNotice}</p></div>`;
    form.appendChild(banner);
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  forms.forEach((form) => {
    form.setAttribute("novalidate", "novalidate");
    let isSubmitting = false;

    const fields = Array.from(form.querySelectorAll("input:not([type='radio']), select, textarea"));

    fields.forEach((field, idx) => {
      const evt = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
      field.addEventListener(evt, () => clearFieldError(field, idx));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      let firstInvalid = null;
      fields.forEach((field, idx) => {
        const errorMsg = validateField(field);
        if (errorMsg) {
          showFieldError(field, idx, errorMsg);
          if (!firstInvalid) firstInvalid = field;
        } else {
          clearFieldError(field, idx);
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const originalHtml = submitBtn ? submitBtn.innerHTML : "";
      isSubmitting = true;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-75", "cursor-not-allowed");
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin" aria-hidden="true">progress_activity</span><span>Procesando demostración...</span>`;
      }

      window.setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-75", "cursor-not-allowed");
          submitBtn.innerHTML = originalHtml;
        }
        isSubmitting = false;
        showDemoConfirmation(form);
        form.reset();
      }, 550);
    });
  });
});
