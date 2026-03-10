/**
 * L'Estocade — Club Billard
 * app.js — Intégration Google Sheets + interactions
 *
 * ===== CONFIGURATION ADMIN =====
 * Pour modifier le contenu, éditez votre Google Sheets (voir README).
 * Remplacez SHEET_ID par l'identifiant de votre Google Sheet.
 */

// ==============================
//   CONFIG — À MODIFIER
// ==============================
const CONFIG = {
  // Remplacez par l'ID de votre Google Sheet
  // Ex: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
  SHEET_ID: "VOTRE_SHEET_ID_ICI",

  // Noms des onglets dans votre Google Sheet
  TABS: {
    calendrier: "Calendrier",
    galerie: "Galerie",
    tarifs: "Tarifs"
  }
};

// ==============================
//   DONNÉES DE DÉMO (fallback)
//   Supprimez ou ignorez quand
//   Google Sheets est configuré
// ==============================
const DEMO_DATA = {
  calendrier: [
    { titre: "Entraînement Carom", date: "Mardi 15 Janvier 2026", heure: "19h00 – 21h30", type: "entrainement", description: "Entraînement hebdomadaire niveau intermédiaire / avancé. Coach présent." },
    { titre: "Entraînement Pool", date: "Jeudi 17 Janvier 2026", heure: "18h30 – 21h00", type: "entrainement", description: "Séance ouverte à tous. Débutants bienvenus." },
    { titre: "Tournoi Interne Mensuel", date: "Samedi 25 Janvier 2026", heure: "14h00 – 19h00", type: "tournoi", description: "Tournoi mensuel en format round-robin. Inscription obligatoire. Places limitées à 16 joueurs." },
    { titre: "Entraînement Carom", date: "Mardi 22 Janvier 2026", heure: "19h00 – 21h30", type: "entrainement", description: "Entraînement hebdomadaire. Travail sur la précision et les séries." },
    { titre: "Soirée Portes Ouvertes", date: "Vendredi 31 Janvier 2026", heure: "18h00 – 22h00", type: "evenement", description: "Venez découvrir le club ! Essais gratuits, présentation des formules d'adhésion." },
    { titre: "Stage Débutants", date: "Samedi 8 Février 2026", heure: "10h00 – 16h00", type: "evenement", description: "Stage intensif pour les débutants. Coach diplômé. Inscription préalable requise. 35€/personne." },
    { titre: "Entraînement Pool", date: "Jeudi 6 Février 2026", heure: "18h30 – 21h00", type: "entrainement", description: "Séance hebdomadaire pool. Tous niveaux." },
    { titre: "Championnat Régional", date: "Dimanche 16 Février 2026", heure: "09h00 – 18h00", type: "tournoi", description: "Sélection régionale. Qualification obligatoire. Renseignements auprès du bureau." }
  ],
  galerie: [
    { url: "", legende: "Salle principale" },
    { url: "", legende: "Tables de compétition" },
    { url: "", legende: "Tournoi mensuel" },
    { url: "", legende: "Entraînement" },
    { url: "", legende: "Trophées du club" },
    { url: "", legende: "Stage débutants" }
  ],
  tarifs: [
    {
      nom: "Découverte",
      description: "Idéal pour essayer",
      prix: "Gratuit",
      periode: "1 séance",
      avantages: "1 séance d'essai|Tables pool & carom|Encadrement inclus|Sans engagement",
      vedette: false
    },
    {
      nom: "Étudiant",
      description: "Tarif réduit pour les moins de 26 ans",
      prix: "80",
      periode: "/ an",
      avantages: "Accès illimité au club|Entraînements hebdomadaires|Réduction sur les stages|Licence fédérale incluse",
      vedette: false
    },
    {
      nom: "Adulte",
      description: "La formule la plus populaire",
      prix: "120",
      periode: "/ an",
      avantages: "Accès illimité au club|Entraînements hebdomadaires|Inscription aux tournois|Licence fédérale incluse|Matériel en prêt",
      vedette: true
    },
    {
      nom: "Premium",
      description: "Pour les joueurs engagés",
      prix: "200",
      periode: "/ an",
      avantages: "Tout Adulte inclus|Coaching individuel (2h/mois)|Accès prioritaire aux tables|Participation championnats|Badge et gilet club",
      vedette: false
    }
  ]
};

// ==============================
//   HELPERS
// ==============================
function buildSheetURL(tab) {
  return `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
}

async function fetchSheet(tab) {
  const url = buildSheetURL(tab);
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const text = await res.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  const cols = json.table.cols.map(c => c.label.toLowerCase().trim());
  return json.table.rows.map(row => {
    const obj = {};
    cols.forEach((col, i) => {
      obj[col] = row.c[i] ? (row.c[i].v !== null ? String(row.c[i].v) : "") : "";
    });
    return obj;
  });
}

const useDemo = CONFIG.SHEET_ID === "VOTRE_SHEET_ID_ICI";

// ==============================
//   CALENDRIER
// ==============================
let allEvents = [];

function renderEvents(filter = "all") {
  const grid = document.getElementById("calendar-grid");
  const filtered = filter === "all" ? allEvents : allEvents.filter(e => e.type === filter);
  if (!filtered.length) {
    grid.innerHTML = `<p style="color:var(--gray);grid-column:1/-1;">Aucun événement pour cette catégorie.</p>`;
    return;
  }
  grid.innerHTML = filtered.map(ev => `
    <div class="event-card" data-type="${ev.type || 'evenement'}">
      <span class="event-badge badge-${ev.type || 'evenement'}">${labelType(ev.type)}</span>
      <div class="event-title">${ev.titre || ev.title || ""}</div>
      <div class="event-date">📅 ${ev.date || ""}</div>
      <div class="event-time">🕐 ${ev.heure || ev.heure || ""}</div>
      <div class="event-desc">${ev.description || ev.desc || ""}</div>
    </div>
  `).join("");
}

function labelType(type) {
  return { entrainement: "Entraînement", tournoi: "Tournoi", evenement: "Événement" }[type] || "Événement";
}

async function loadCalendrier() {
  const loading = document.getElementById("calendar-loading");
  const grid = document.getElementById("calendar-grid");
  const error = document.getElementById("calendar-error");
  try {
    if (useDemo) {
      allEvents = DEMO_DATA.calendrier;
    } else {
      allEvents = await fetchSheet(CONFIG.TABS.calendrier);
    }
    loading.style.display = "none";
    grid.style.display = "grid";
    renderEvents("all");
    // Filtres
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderEvents(btn.dataset.filter);
      });
    });
  } catch (e) {
    loading.style.display = "none";
    error.style.display = "block";
    console.error("Calendrier error:", e);
  }
}

// ==============================
//   GALERIE
// ==============================
async function loadGalerie() {
  const loading = document.getElementById("gallery-loading");
  const grid = document.getElementById("gallery-grid");
  try {
    let items;
    if (useDemo) {
      items = DEMO_DATA.galerie;
    } else {
      items = await fetchSheet(CONFIG.TABS.galerie);
    }
    loading.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = items.map(item => {
      if (item.url && item.url.trim()) {
        return `
          <div class="gallery-item">
            <img src="${item.url}" alt="${item.legende || ''}" loading="lazy"
                 onerror="this.parentElement.innerHTML=placeholderHTML('${item.legende||''}')"/>
            <div class="gallery-overlay"><span>${item.legende || ''}</span></div>
          </div>`;
      } else {
        return `
          <div class="gallery-placeholder">
            <div class="gallery-placeholder-inner">
              <span>🎱</span>
              <span>${item.legende || 'Photo à venir'}</span>
            </div>
          </div>`;
      }
    }).join("");
  } catch (e) {
    loading.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = DEMO_DATA.galerie.map(item => `
      <div class="gallery-placeholder">
        <div class="gallery-placeholder-inner">
          <span>🎱</span><span>${item.legende}</span>
        </div>
      </div>`).join("");
  }
}

window.placeholderHTML = (legend) =>
  `<div class="gallery-placeholder" style="width:100%;height:100%;">
    <div class="gallery-placeholder-inner"><span>🎱</span><span>${legend}</span></div>
  </div>`;

// ==============================
//   TARIFS
// ==============================
async function loadTarifs() {
  const loading = document.getElementById("pricing-loading");
  const grid = document.getElementById("pricing-grid");
  try {
    let items;
    if (useDemo) {
      items = DEMO_DATA.tarifs;
    } else {
      items = await fetchSheet(CONFIG.TABS.tarifs);
    }
    loading.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = items.map(item => {
      const featured = item.vedette === "true" || item.vedette === "TRUE" || item.vedette === true;
      const avantages = (item.avantages || "").split("|").filter(Boolean);
      return `
        <div class="pricing-card ${featured ? 'featured' : ''}">
          ${featured ? '<span class="pricing-badge">Populaire</span>' : ''}
          <div class="pricing-name">${item.nom || ""}</div>
          <div class="pricing-desc">${item.description || ""}</div>
          <div class="pricing-price">
            ${item.prix === "Gratuit"
              ? `<span class="price-amount" style="font-size:2rem">Gratuit</span>`
              : `<span class="price-amount">${item.prix}€</span><span class="price-period">${item.periode || ""}</span>`
            }
          </div>
          <ul class="pricing-features">
            ${avantages.map(a => `<li>${a.trim()}</li>`).join("")}
          </ul>
        </div>`;
    }).join("");
  } catch (e) {
    loading.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = `<p style="color:var(--gray)">Impossible de charger les tarifs. <a href="#contact" style="color:var(--gold)">Contactez-nous</a> pour plus d'informations.</p>`;
  }
}

// ==============================
//   NAVBAR SCROLL
// ==============================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

// ==============================
//   BURGER MENU
// ==============================
document.getElementById("burger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Ferme le menu au clic sur un lien
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ==============================
//   FORMULAIRE CONTACT
// ==============================
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  // Ici vous pouvez brancher Netlify Forms, Formspree, EmailJS, etc.
  // Pour Netlify Forms: ajoutez l'attribut data-netlify="true" au <form>
  const success = document.getElementById("form-success");
  success.style.display = "block";
  this.reset();
  setTimeout(() => success.style.display = "none", 5000);
});

// ==============================
//   INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  loadCalendrier();
  loadGalerie();
  loadTarifs();
});
