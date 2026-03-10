/**
 * Ti Zef Billard — app.js
 *
 * Ce fichier gère :
 *   - La galerie photos
 *   - La navbar (effet scroll + menu burger)
 *
 * ===== AJOUTER DES PHOTOS =====
 * Remplissez le tableau PHOTOS ci-dessous avec les URLs de vos images.
 * Si une URL est vide (""), un placeholder s'affiche à la place.
 *
 * ===== MODIFIER LES ENTRAÎNEMENTS =====
 * Les jours et horaires sont directement dans index.html
 * (section #entrainements) — pas besoin de toucher ce fichier.
 *
 * ===== MODIFIER L'ADRESSE =====
 * L'adresse est dans index.html (section #contact).
 */

// ==============================
//   PHOTOS
//   Remplacer "" par l'URL de la photo
// ==============================
const PHOTOS = [
  { url: "", legende: "Salle principale" },
  { url: "", legende: "Tables de jeu" },
  { url: "", legende: "Ambiance du club" },
  { url: "", legende: "Entraînement" },
  { url: "", legende: "Tournoi" },
  { url: "", legende: "L'équipe" }
];

// ==============================
//   GALERIE
// ==============================
function renderGalerie() {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = PHOTOS.map(photo => {
    if (photo.url) {
      // Photo disponible
      return `
        <div class="gallery-item">
          <img src="${photo.url}" alt="${photo.legende}" loading="lazy"
               onerror="this.parentElement.innerHTML=placeholderHTML('${photo.legende}')"/>
          <div class="gallery-overlay"><span>${photo.legende}</span></div>
        </div>`;
    } else {
      // Placeholder : photo pas encore ajoutée
      return `
        <div class="gallery-placeholder">
          <div class="gallery-placeholder-inner">
            <span>🎱</span>
            <span>${photo.legende}</span>
          </div>
        </div>`;
    }
  }).join("");
}

window.placeholderHTML = (legende) =>
  `<div class="gallery-placeholder" style="width:100%;height:100%;">
    <div class="gallery-placeholder-inner"><span>🎱</span><span>${legende}</span></div>
  </div>`;

// ==============================
//   NAVBAR — effet au scroll
// ==============================
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

// ==============================
//   BURGER MENU (mobile)
// ==============================
document.getElementById("burger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Ferme le menu quand on clique sur un lien
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ==============================
//   INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderGalerie();
});
