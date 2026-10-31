// ============================================================
//  Simulateur de budget (partials/simulateur.html)
// ============================================================
// Cinq questions, une par écran, puis le prénom et l'e-mail pour voir
// l'estimation. Les fourchettes sont celles des tarifs publiés sur la page
// des prix ; une combinaison absente du tableau (site d'une page + logo,
// par exemple) s'affiche « à partir de », somme des prix de départ publiés.
// La demande part vers Notion (/api/demande) et par e-mail (Web3Forms), en
// arrière-plan : l'estimation s'affiche même si l'envoi échoue.

const ACCESS_KEY = "e5c89c34-54c5-4f3a-8c1f-6a8d4c359c75"; // Web3Forms (clé publique)
const CALENDLY = "https://calendly.com/diurnstudio/appel-decouvert";

// Tarifs publiés (combien-coute-site-internet-nice.html, tableau des tarifs)
const OFFRES = {
  onepage: { label: "Site d'une page sur mesure", min: 900, max: 1500, weeks: [2, 2] },
  vitrine: { label: "Site vitrine (4 à 6 pages)", min: 1800, max: 3200, weeks: [3, 5] },
  refonte: { label: "Refonte de votre site", min: 1500, max: 3500, weeks: [3, 6] },
  logo: { label: "Création de logo", min: 700, max: null, weeks: [1, 2] },
};
const LOGO_PRIX = 700;
const LOGO_SEMAINES = [1, 2];

const LIBELLES = {
  projet: { onepage: "site d'une page", vitrine: "site vitrine", refonte: "refonte", logo: "logo seul" },
  logo: { ok: "logo existant", revoir: "logo à revoir", aucun: "pas de logo" },
  contenus: { tout: "contenus prêts", partie: "contenus en partie prêts", rien: "contenus à préparer" },
};

// Plafond de chaque tranche de budget, pour comparer avec l'estimation
const BUDGET_MAX = {
  "Moins de 1 000 €": 1000,
  "1 000 à 2 000 €": 2000,
  "2 000 à 3 500 €": 3500,
  "Plus de 3 500 €": Infinity,
};

const euros = (n) => `${n.toLocaleString("fr-FR").replace(/\s/g, " ")} €`;
const semaines = ([a, b]) => (a === b ? `${a} semaines` : `${a} à ${b} semaines`);

export function estimate(answers) {
  const base = OFFRES[answers.projet];
  const withLogo = answers.projet !== "logo" && answers.logo && answers.logo !== "ok";
  let offre = { ...base };
  if (withLogo && answers.projet === "vitrine") {
    // ligne publiée : site vitrine + identité de marque
    offre = { label: "Site vitrine et identité de marque", min: 2800, max: 4500, weeks: [5, 8] };
  } else if (withLogo) {
    offre = {
      label: `${base.label} et logo`,
      min: base.min + LOGO_PRIX,
      max: null,
      weeks: [base.weeks[0] + LOGO_SEMAINES[0], base.weeks[1] + LOGO_SEMAINES[1]],
    };
  }
  const prix = offre.max ? `${euros(offre.min)} à ${euros(offre.max)}` : `à partir de ${euros(offre.min)}`;
  return { ...offre, prix, delai: semaines(offre.weeks) };
}

function conseils(answers, offre) {
  const list = [];
  const plafond = BUDGET_MAX[answers.budget];
  if (answers.projet === "vitrine" || answers.projet === "refonte") {
    list.push(
      `Commencer par un site d'une page (à partir de ${euros(900)}), puis ajouter des pages quand votre activité grandit&nbsp;: le site est conçu pour évoluer.`
    );
  }
  if (answers.logo === "revoir") {
    list.push("Si votre logo actuel reste lisible, on peut le garder et ne refaire que le site&nbsp;: c'est la première économie possible.");
  } else if (answers.logo === "aucun" && answers.projet !== "logo") {
    list.push("Le logo peut venir dans un second temps&nbsp;: le site démarre avec votre nom mis en forme simplement, l'identité complète suit.");
  }
  if (answers.contenus === "tout") {
    list.push("Vos textes et vos photos sont prêts&nbsp;: c'est autant de temps, et de budget, en moins.");
  } else if (answers.contenus) {
    list.push("Préparer vous-même vos textes et vos photos allège le devis.");
  }
  if (answers.delai === "Dès que possible") {
    list.push("Pour tenir un délai court, le plus efficace est d'avoir vos textes et vos photos prêts dès le départ.");
  }
  if (answers.projet !== "logo") {
    list.push(
      "Pas d'abonnement obligatoire&nbsp;: le site est à votre nom et se paie une fois, hors nom de domaine et hébergement (quelques dizaines d'euros par an)."
    );
  }
  const sous = plafond !== undefined && plafond < offre.min;
  return { list, sous };
}

function renderResult(answers, offre) {
  const { list, sous } = conseils(answers, offre);
  const verdict =
    answers.budget === "Je ne sais pas"
      ? ""
      : sous
        ? `<p class="sim__verdict">Votre budget est un peu en dessous de cette fourchette. Les pistes ci-dessous permettent souvent de s'en rapprocher.</p>`
        : `<p class="sim__verdict sim__verdict--ok">Votre budget correspond à ce type de projet.</p>`;
  const inclus =
    answers.projet === "logo"
      ? ""
      : `<h3 class="sim__subtitle">Inclus dans chaque site</h3>
        <p class="sim__text">Design sur mesure, site adapté au mobile, à la tablette et à l'ordinateur, interface pour modifier vos textes et vos photos, formulaire de contact, référencement local, mise en ligne, et 3&nbsp;mois de correctifs offerts.</p>`;
  return `
    <p class="sim__progress-label">Votre estimation</p>
    <p class="sim__offer">${offre.label}</p>
    <p class="sim__price">${offre.prix}</p>
    <p class="sim__delay">Délai&nbsp;: ${offre.delai}</p>
    ${verdict}
    ${inclus}
    <h3 class="sim__subtitle">Pour réduire la facture</h3>
    <ul class="sim__tips">${list.map((t) => `<li>${t}</li>`).join("")}</ul>
    <p class="sim__note">Estimation indicative, établie à partir de mes tarifs publiés. Le prix exact est fixé dans un devis gratuit, après un échange de 30&nbsp;minutes.</p>
    <div class="sim__actions">
      <a class="sim__next" href="${CALENDLY}" target="_blank" rel="noopener" data-calendly>Réserver un appel de 30&nbsp;min</a>
      <a class="sim__back sim__back--link" href="/combien-coute-site-internet-nice#contact">Recevoir un devis précis</a>
      <button class="sim__restart" type="button" data-sim-restart>Refaire l'estimation</button>
    </div>`;
}

function send(answers, offre, contact) {
  const resume = [
    LIBELLES.projet[answers.projet],
    LIBELLES.logo[answers.logo],
    LIBELLES.contenus[answers.contenus],
  ]
    .filter(Boolean)
    .join(" · ");
  const estimation = `${offre.prix} · ${offre.delai}`.replace(/ /g, " ");
  let source = "";
  try {
    source = sessionStorage.getItem("diurn-source") || "";
  } catch {
    /* stockage indisponible */
  }
  const message = `Simulateur de budget\nProjet : ${resume}\nEstimation : ${estimation}\nBudget prévu : ${answers.budget}\nDélai souhaité : ${answers.delai}`;
  const post = (url, data) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
  post("/api/demande", {
    name: contact.name,
    email: contact.email,
    subject: `Estimation : ${offre.label}`,
    message,
    form_name: "simulateur",
    page: location.pathname,
    source,
    projet: resume,
    estimation,
    budget: answers.budget,
    delai: answers.delai,
  }).catch(() => {});
  post("https://api.web3forms.com/submit", {
    access_key: ACCESS_KEY,
    subject: `Simulateur : ${contact.name} (${offre.label})`,
    from_name: "Diurn Studio, simulateur",
    name: contact.name,
    email: contact.email,
    message,
  }).catch(() => {});
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", { form_name: "simulateur" });
  }
}

function initSimulator(root) {
  const form = root.querySelector(".sim__form");
  const steps = [...root.querySelectorAll(".sim__step")];
  const label = root.querySelector("[data-sim-label]");
  const bar = root.querySelector("[data-sim-bar]");
  const back = root.querySelector("[data-sim-back]");
  const next = root.querySelector("[data-sim-next]");
  const error = root.querySelector("[data-sim-error]");
  const result = root.querySelector("[data-sim-result]");
  let current = 0;

  const answers = () => Object.fromEntries(new FormData(form));
  // Étapes utiles selon le projet : un logo seul saute « logo » et « contenus »
  const path = () =>
    steps.filter((s) => !(answers().projet === "logo" && ["logo", "contenus"].includes(s.dataset.step)));

  function show(index, focus = true) {
    const list = path();
    current = Math.max(0, Math.min(index, list.length - 1));
    steps.forEach((s) => (s.hidden = s !== list[current]));
    const step = list[current];
    const isContact = step.dataset.step === "contact";
    const questions = list.length - 1;
    label.textContent = isContact ? "Dernière étape" : `Question ${current + 1} sur ${questions}`;
    bar.style.width = `${((current + 1) / list.length) * 100}%`;
    back.hidden = current === 0;
    next.textContent = isContact ? "Voir mon estimation" : "Suivant";
    next.disabled = !isContact && !step.querySelector("input:checked");
    error.textContent = "";
    if (focus) (step.querySelector("input:checked") || step.querySelector("input"))?.focus({ preventScroll: true });
  }

  // Un choix à la souris ou au doigt passe à la question suivante ; au
  // clavier (flèches), on reste sur place et on valide avec « Suivant ».
  form.addEventListener("change", (e) => {
    if (e.target.type === "radio") next.disabled = false;
  });
  form.addEventListener("click", (e) => {
    const option = e.target.closest(".sim__option");
    if (option && e.detail > 0) setTimeout(() => show(current + 1), 180);
  });

  back.addEventListener("click", () => show(current - 1));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const step = path()[current];
    if (step.dataset.step !== "contact") {
      if (step.querySelector("input:checked")) show(current + 1);
      return;
    }
    const nameInput = form.elements.name;
    const emailInput = form.elements.email;
    if (!nameInput.value.trim() || !emailInput.checkValidity() || !emailInput.value) {
      error.textContent = "Indiquez votre prénom et une adresse e-mail valide.";
      (nameInput.value.trim() ? emailInput : nameInput).focus();
      return;
    }
    const a = answers();
    const offre = estimate(a);
    if (!a.botcheck) send(a, offre, { name: nameInput.value.trim(), email: emailInput.value.trim() });
    form.hidden = true;
    result.innerHTML = renderResult(a, offre);
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  result.addEventListener("click", (e) => {
    if (!e.target.closest("[data-sim-restart]")) return;
    form.reset();
    result.hidden = true;
    form.hidden = false;
    show(0);
  });

  root.hidden = false;
  show(0, false);
  // Arrivée par un lien vers #simulateur : le bloc était masqué au moment
  // où le navigateur a cherché l'ancre, on y descend une fois affiché.
  if (location.hash === `#${root.id}`) root.scrollIntoView({ block: "start" });
}

document.querySelectorAll("[data-simulator]").forEach(initSimulator);
