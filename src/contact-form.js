// ============================================================
//  Formulaire de contact — envoi via Web3Forms (AJAX)
//  On reste sur la page : états chargement / succès / erreur.
// ============================================================

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".contact__status");
  const submit = form.querySelector(".contact__submit");
  const defaultLabel = submit ? submit.innerHTML : "Envoyer";
  const accessKey = (form.querySelector('input[name="access_key"]') || {}).value || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // pot de miel : si coché, c'est un robot → on ignore silencieusement
    if (form.botcheck && form.botcheck.checked) return;

    // Garde-fou : tant que la vraie clé Web3Forms n'est pas renseignée,
    // on n'envoie pas dans le vide et on oriente vers l'e-mail.
    if (!accessKey || accessKey === "WEB3FORMS_ACCESS_KEY") {
      status.textContent =
        "Le formulaire sera actif très bientôt — en attendant, écrivez-moi à hello@diurnstudio.fr.";
      status.className = "contact__status is-error";
      return;
    }

    submit.disabled = true;
    submit.innerHTML = "Envoi…";
    status.textContent = "";
    status.className = "contact__status";

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        status.textContent =
          "Merci ! Votre message est bien parti — je vous réponds au plus vite.";
        status.classList.add("is-success");
        form.reset();

        if (typeof gtag === "function") {
          gtag("event", "generate_lead", { method: "contact_form" });
        }
      } else {
        throw new Error(json.message || "Échec de l'envoi");
      }
    } catch (err) {
      status.textContent =
        "Oups, l'envoi a échoué. Réessayez, ou écrivez-moi à hello@diurnstudio.fr.";
      status.classList.add("is-error");
    } finally {
      submit.disabled = false;
      submit.innerHTML = defaultLabel;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}
