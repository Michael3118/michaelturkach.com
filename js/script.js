
/* ------------------------------------------------------------------
   1. NAVIGATION
   ------------------------------------------------------------------ */

const navLinks          = document.querySelectorAll('.nav-link');
const pages             = document.querySelectorAll('.page');
const navToggle         = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');

/**
 * Wechselt zur angegebenen Seite und aktualisiert die Navigation.
 * @param {string} pageId - z.B. "home", "about", "projects", "skills", "documents"
 */
function showPage(pageId) {
  // Alle Seiten ausblenden, aktive Seite einblenden
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  navLinks.forEach(l => {
    if (l.dataset.page === pageId) l.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Spezifische Aktionen pro Seite
  if (pageId === 'skills') {
    animateLangBars();
  }

  // Mobile-Menü schliessen
  navLinksContainer.classList.remove('open');
}

// Klick-Events auf alle Navigationslinks
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    showPage(this.dataset.page);
  });
});

// Hamburger-Button (Mobile)
navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinksContainer.classList.toggle('open');
});

// Klick ausserhalb des Menüs → Menü schliessen
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
    navLinksContainer.classList.remove('open');
  }
});

/* ------------------------------------------------------------------
   2. LANGUAGE BARS ANIMATION (ICT Skills Seite)
   ------------------------------------------------------------------ */

/**
 * Animiert die Sprachbalken auf der Skills-Seite.
 * Die Breite wird direkt im HTML als inline-style gesetzt und
 * hier per kurzer Verzögerung sichtbar gemacht.
 */
function animateLangBars() {
  const fills = document.querySelectorAll('.lc-fill');
  fills.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.transition = 'width 0.9s ease';
      bar.style.width = targetWidth;
    }, 80);
  });
}

/* ------------------------------------------------------------------
   3. DOCUMENTS – LOGIN-SYSTEM
   ------------------------------------------------------------------ */

// Zugangsdaten (in einer echten Website wäre dies serverseitig!)
// Hier nur als lokaler Demo-Schutz gemäss Aufgabenstellung IDAF IV.
const DEMO_USER = 'admin';
const DEMO_PASS = 'michael2026';

const loginArea  = document.getElementById('loginArea');
const docsArea   = document.getElementById('docsArea');
const loginBtn   = document.getElementById('loginBtn');
const logoutBtn  = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');
const loginUser  = document.getElementById('loginUser');
const loginPass  = document.getElementById('loginPass');

/**
 * Prüft die eingegebenen Zugangsdaten und schaltet
 * den Dokumentenbereich frei (oder zeigt eine Fehlermeldung).
 */
function tryLogin() {
  const user = loginUser ? loginUser.value.trim() : '';
  const pass = loginPass ? loginPass.value : '';

  if (!loginError) return;

  if (user === DEMO_USER && pass === DEMO_PASS) {
    // Login erfolgreich
    loginError.textContent = '';
    if (loginArea) loginArea.style.display = 'none';
    if (docsArea)  docsArea.style.display  = 'block';

    // Session-Flag setzen (bleibt bis zum Logout)
    sessionStorage.setItem('docs_unlocked', '1');
  } else {
    // Fehlermeldung anzeigen
    loginError.textContent = 'Benutzername oder Passwort ist falsch.';
    if (loginPass) loginPass.value = '';
    loginPass.focus();
  }
}

/**
 * Meldet den Benutzer ab und blendet den Dokumentenbereich aus.
 */
function doLogout() {
  if (loginArea) loginArea.style.display = 'flex';
  if (docsArea)  docsArea.style.display  = 'none';
  if (loginUser) loginUser.value = '';
  if (loginPass) loginPass.value = '';
  if (loginError) loginError.textContent = '';
  sessionStorage.removeItem('docs_unlocked');
}

// Button-Klicks
if (loginBtn)  loginBtn.addEventListener('click',  tryLogin);
if (logoutBtn) logoutBtn.addEventListener('click',  doLogout);

// Enter-Taste im Passwortfeld = Login
if (loginPass) {
  loginPass.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryLogin();
  });
}

// Enter-Taste im Benutzernamen-Feld = Fokus auf Passwort
if (loginUser) {
  loginUser.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && loginPass) loginPass.focus();
  });
}

/**
 * Stellt den Login-Status wieder her, wenn der Benutzer
 * bereits in dieser Session eingeloggt war.
 */
function restoreLoginState() {
  if (sessionStorage.getItem('docs_unlocked') === '1') {
    if (loginArea) loginArea.style.display = 'none';
    if (docsArea)  docsArea.style.display  = 'block';
  }
}

/* ------------------------------------------------------------------
   4. OVERVIEW CARDS – Klick-Navigation (Home-Seite)
   ------------------------------------------------------------------ */

// Die .ov-card Elemente haben onclick="showPage(...)" direkt im HTML,
// aber wir sichern es hier zusätzlich für JS-saubere Variante.
document.querySelectorAll('.ov-card').forEach(card => {
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ------------------------------------------------------------------
   5. INITIALISIERUNG
   ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  restoreLoginState();
});
