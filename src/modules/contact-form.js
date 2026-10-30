// ============================================================
//  Formulaire de contact : envoi via Web3Forms (AJAX) et Notion
//  On reste sur la page : états chargement / succès / erreur.
// ============================================================
// Chaque demande part par deux chemins en parallèle : Web3Forms (l'e-mail
// de notification) et /api/demande (la base Notion « Prospects du site »).
// Il suffit que l'un des deux aboutisse : aucune demande n'est perdue.

// Provenance du visiteur (site d'où il arrive, campagne), mémorisée pour
// la session à l'arrivée sur le site, et jointe à sa demande seulement
function rememberSource() {
  try {
    if (sessionStorage.getItem("diurn-source")) return;
    const parts = [];
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) parts.push(host);
    }
    new URLSearchParams(location.search).forEach((value, key) => {
      if (key.startsWith("utm_")) parts.push(`${key.slice(4)}=${value}`);
    });
    sessionStorage.setItem("diurn-source", parts.join(" · ") || "accès direct");
  } catch {
    /* stockage indisponible : la provenance restera vide */
  }
}

function readSource() {
  try {
    return sessionStorage.getItem("diurn-source") || "";
  } catch {
    return "";
  }
}

const postJSON = (url, data) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

function initContactForm() {
  rememberSource();
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".contact__status");
  const submit = form.querySelector(".contact__submit");
  const defaultLabel = submit ? submit.innerHTML : "Envoyer";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // pot de miel : si coché, c'est un robot → on ignore silencieusement
    if (form.botcheck && form.botcheck.checked) return;

    submit.disabled = true;
    submit.innerHTML = "Envoi…";
    status.textContent = "";
    status.className = "contact__status";

    try {
      const data = Object.fromEntries(new FormData(form));
      // Adresse de site saisie sans protocole (« monsite.fr ») : complétée
      if (data.website && !/^https?:\/\//i.test(data.website.trim())) {
        data.website = "https://" + data.website.trim();
      }
      const { access_key, ...fields } = data;
      const keyReady = access_key && access_key !== "WEB3FORMS_ACCESS_KEY";
      const [mail, crm] = await Promise.allSettled([
        keyReady ? postJSON("https://api.web3forms.com/submit", data) : Promise.reject(new Error("clé absente")),
        postJSON("/api/demande", {
          ...fields,
          form_name: form.dataset.formName || "contact",
          page: location.pathname,
          source: readSource(),
        }),
      ]);
      // envoyé si l'e-mail OU la fiche Notion est passé
      const sent =
        (mail.status === "fulfilled" && mail.value.success) || (crm.status === "fulfilled" && crm.value.ok);

      if (sent) {
        status.textContent =
          form.dataset.formName === "audit"
            ? "Merci ! Votre demande est bien partie, votre rapport arrive sous 48 heures."
            : "Merci ! Votre message est bien parti, je vous réponds au plus vite.";
        status.classList.add("is-success");
        form.reset();

        // Conversion GA4 au succès réel de l'envoi (pas au clic). Le nom du
        // formulaire vient de data-form-name (« audit », « devis »), sinon
        // « contact ». gtag n'existe qu'après consentement (consent.js).
        if (typeof window.gtag === "function") {
          window.gtag("event", "generate_lead", {
            form_name: form.dataset.formName || "contact",
          });
        }
      } else {
        throw new Error("Échec de l'envoi");
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
