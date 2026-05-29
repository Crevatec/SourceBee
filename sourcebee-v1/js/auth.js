// ============================================================
//  auth.js  —  FIREBASE AUTHENTICATION
// ============================================================

let firebaseAuth   = null;
let googleProvider = null;
let currentUser    = null;

function initFirebase() {
  if (typeof firebase === 'undefined') { console.warn('Firebase SDK not loaded'); return; }
  if (!firebase.apps.length) firebase.initializeApp(CONFIG.FIREBASE);
  firebaseAuth   = firebase.auth();
  googleProvider = new firebase.auth.GoogleAuthProvider();

  firebaseAuth.onAuthStateChanged(user => {
    currentUser = user;
    updateNavAuth(user);
  });

  if (typeof initDB === 'function') initDB();
}

function updateNavAuth(user) {
  const authBtn   = document.getElementById('authBtn');
  const navUser   = document.getElementById('navUser');
  const navUname  = document.getElementById('navUsername');
  const navAvatar = document.getElementById('navAvatar');
  const adminLink = document.getElementById('nav-admin-link');

  if (user) {
    if (authBtn)  authBtn.style.display = 'none';
    if (navUser)  navUser.style.display = 'flex';
    const name = user.displayName || user.email.split('@')[0];
    if (navUname)  navUname.textContent = name.split(' ')[0];
    if (navAvatar) navAvatar.innerHTML  = user.photoURL
      ? `<img src="${user.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%">`
      : name[0].toUpperCase();

    // Show Admin link only for admin email
    if (adminLink) adminLink.style.display = isAdmin(user) ? '' : 'none';

    const mn = document.getElementById('menuName');
    const me = document.getElementById('menuEmail');
    if (mn) mn.textContent = user.displayName || name;
    if (me) me.textContent = user.email;
  } else {
    if (authBtn)    authBtn.style.display = '';
    if (navUser)    navUser.style.display = 'none';
    if (adminLink)  adminLink.style.display = 'none';
    closeUserMenu();
  }
}

function openAuthModal(tab) {
  document.getElementById('authOverlay')?.classList.add('open');
  document.getElementById('authModal')?.classList.add('open');
  if (tab) switchAuthTab(tab);
  clearAuthErrors();
}

function closeAuthModal() {
  document.getElementById('authOverlay')?.classList.remove('open');
  document.getElementById('authModal')?.classList.remove('open');
  clearAuthErrors();
}

function clearAuthErrors() {
  ['siError','suError'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
}

function switchAuthTab(tab) {
  document.getElementById('formSignin').style.display = tab === 'signin' ? '' : 'none';
  document.getElementById('formSignup').style.display = tab === 'signup' ? '' : 'none';
  document.getElementById('tabSignin').classList.toggle('active', tab === 'signin');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  clearAuthErrors();
}

function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  inp.type  = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

async function signUpEmail() {
  const first = document.getElementById('suFirst')?.value.trim();
  const last  = document.getElementById('suLast')?.value.trim();
  const email = document.getElementById('suEmail')?.value.trim();
  const pass  = document.getElementById('suPassword')?.value;
  const conf  = document.getElementById('suConfirm')?.value;
  const errEl = document.getElementById('suError');
  const btn   = document.getElementById('suBtn');
  if (!first || !email || !pass) { errEl.textContent = 'Please fill in all fields.'; return; }
  if (pass.length < 6)           { errEl.textContent = 'Password must be at least 6 characters.'; return; }
  if (pass !== conf)             { errEl.textContent = 'Passwords do not match.'; return; }
  btn.disabled = true; btn.textContent = 'Creating account…';
  try {
    const cred = await firebaseAuth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: `${first} ${last}`.trim() });
    await firebaseAuth.currentUser.reload();
    currentUser = firebaseAuth.currentUser;
    updateNavAuth(currentUser);
    closeAuthModal();
    toast(`🐝 Welcome, ${first}! Account created.`);
  } catch (err) {
    errEl.textContent = _friendlyError(err.code);
    btn.disabled = false; btn.textContent = 'Create Account';
  }
}

async function signInEmail() {
  const email = document.getElementById('siEmail')?.value.trim();
  const pass  = document.getElementById('siPassword')?.value;
  const errEl = document.getElementById('siError');
  const btn   = document.getElementById('siBtn');
  if (!email || !pass) { errEl.textContent = 'Please enter your email and password.'; return; }
  btn.disabled = true; btn.textContent = 'Signing in…';
  try {
    await firebaseAuth.signInWithEmailAndPassword(email, pass);
    closeAuthModal();
    toast('🐝 Welcome back!');
  } catch (err) {
    errEl.textContent = _friendlyError(err.code);
    btn.disabled = false; btn.textContent = 'Sign In';
  }
}

async function signInWithGoogle() {
  try {
    await firebaseAuth.signInWithPopup(googleProvider);
    closeAuthModal();
    toast('🐝 Signed in with Google!');
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
      document.getElementById('siError').textContent = _friendlyError(err.code);
    }
  }
}

async function forgotPassword() {
  const email = document.getElementById('siEmail')?.value.trim();
  if (!email) { document.getElementById('siError').textContent = 'Enter your email above first.'; return; }
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
    toast('📧 Password reset email sent!');
  } catch (err) {
    document.getElementById('siError').textContent = _friendlyError(err.code);
  }
}

async function signOut() {
  await firebaseAuth.signOut();
  closeUserMenu();
  toast('👋 Signed out.');
}

function openUserMenu() {
  const m = document.getElementById('userMenu');
  if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function closeUserMenu() {
  const m = document.getElementById('userMenu');
  if (m) m.style.display = 'none';
}
document.addEventListener('click', e => {
  if (!e.target.closest('#navUser') && !e.target.closest('#userMenu')) closeUserMenu();
});

function _friendlyError(code) {
  const map = {
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password is too weak.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/invalid-credential':     'Email or password is incorrect.',
    'auth/too-many-requests':      'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-blocked':          'Popup blocked. Please allow popups.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
