const profileTop = document.getElementById('profileTop');
const profileDetails = document.getElementById('profileDetails');
const authCard = document.getElementById('authCard');
const authTitle = document.getElementById('authTitle');
const authHelp = document.getElementById('authHelp');
const authForm = document.getElementById('authForm');
const authSubmit = document.getElementById('authSubmit');
const authError = document.getElementById('authError');
const authHint = document.getElementById('authHint');
const createFields = document.getElementById('createFields');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const bioInput = document.getElementById('bioInput');
const profileNameTop = document.getElementById('profileNameTop');
const profileEmailTop = document.getElementById('profileEmailTop');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');

const profileBioText = document.getElementById('profileBioText');
const avatarCircle = document.getElementById('avatarCircle');
const avatarImg = document.getElementById('avatarImg');
const logoutButton = document.getElementById('logoutButton');
const logoutModal = document.getElementById('logoutModal');
const confirmLogoutYes = document.getElementById('confirmLogoutYes');
const confirmLogoutNo = document.getElementById('confirmLogoutNo');
const updateForm = document.getElementById('updateForm');
const updateName = document.getElementById('updateName');
const updateBio = document.getElementById('updateBio');
const updateImageInput = document.getElementById('updateImageInput');
const updateSuccess = document.getElementById('updateSuccess');
const updateError = document.getElementById('updateError');
const imageInput = document.getElementById('imageInput');
const profileSpent = document.getElementById('profileSpent');
const purchaseHistoryList = document.getElementById('purchaseHistoryList');
const PROFILE_STORAGE_KEY = 'profileData';

function loadSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY)) || null;
  } catch (error) {
    console.error('Unable to read saved profile:', error);
    return null;
  }
}

function saveProfileToStorage() {
  if (!savedProfile) return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(savedProfile));
}

let savedProfile = loadSavedProfile();

function saveProfile() {
  saveProfileToStorage();
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getInitials(name) {
  if (!name) return 'ME';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

function updateAuthSection() {
  const hasSaved = Boolean(savedProfile && savedProfile.email);

  if (hasSaved) {
    authTitle.textContent = 'Log in to your profile';
    authHelp.textContent = 'Enter the email and password you created in this session.';
    createFields.style.display = 'none';
    authSubmit.textContent = 'Login';
    authHint.textContent = `Profile available while this page is open: ${savedProfile.name || 'No name'} · ${savedProfile.email}`;
  } else {
    authTitle.textContent = 'Create your profile';
    authHelp.textContent = 'Fill in your name, email, password, and a short bio.';
    createFields.style.display = 'grid';
    authSubmit.textContent = 'Create Profile';
    authHint.textContent = 'This profile will remain only during your current browser session.';
  }
}

function setProfileContent() {
  if (!savedProfile) return;

  savedProfile.amountSpent = savedProfile.amountSpent || 0;
  savedProfile.purchaseHistory = savedProfile.purchaseHistory || [];

  profileNameTop.textContent = savedProfile.name || 'Your name';
  profileEmailTop.textContent = savedProfile.email || 'you@example.com';
  profileName.textContent = savedProfile.name || '—';
  profileEmail.textContent = savedProfile.email || '—';
  profileBioText.textContent = savedProfile.bio || 'No bio yet. Add one below.';
  profileSpent.textContent = formatCurrency(savedProfile.amountSpent);
  updateName.value = savedProfile.name || '';
  updateBio.value = savedProfile.bio || '';
  setProfileImage();
  renderPurchaseHistory();
}

function formatCurrency(value) {
  return `$${Number(value).toFixed(2)}`;
}

function renderPurchaseHistory() {
  if (!purchaseHistoryList) return;
  purchaseHistoryList.innerHTML = '';

  if (!savedProfile || !savedProfile.purchaseHistory || savedProfile.purchaseHistory.length === 0) {
    purchaseHistoryList.innerHTML = '<li>No purchases yet.</li>';
    return;
  }

  savedProfile.purchaseHistory.slice().reverse().forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.name}</strong> — ${formatCurrency(item.price)} <span class="history-date">${item.date}</span>`;
    purchaseHistoryList.appendChild(li);
  });
}

function setProfileImage() {
  if (savedProfile && savedProfile.imageData) {
    avatarImg.src = savedProfile.imageData;
    avatarImg.classList.remove('hidden');
    avatarCircle.classList.add('hidden');
  } else {
    avatarImg.classList.add('hidden');
    avatarCircle.classList.remove('hidden');
    avatarCircle.textContent = getInitials(savedProfile?.name);
  }
}

function showProfile() {
  profileTop.classList.remove('hidden');
  profileDetails.classList.remove('hidden');
  authCard.classList.add('hidden');
  setProfileContent();
}

function showLogin() {
  profileTop.classList.add('hidden');
  profileDetails.classList.add('hidden');
  authCard.classList.remove('hidden');
  authError.classList.add('hidden');
  updateError.classList.add('hidden');
  authForm.reset();
  updateAuthSection();
}

function showError(message) {
  authError.textContent = message;
  authError.classList.remove('hidden');
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  authError.classList.add('hidden');

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError('Email and password are required.');
    return;
  }

  const hasSaved = Boolean(savedProfile && savedProfile.email);

  if (hasSaved) {
    if (email !== savedProfile.email || password !== savedProfile.password) {
      showError('Email or password does not match.');
      return;
    }

    savedProfile.loggedIn = true;
    saveProfileToStorage();
    showProfile();
    return;
  }

  const name = nameInput.value.trim();
  const bio = bioInput.value.trim();

  if (!name) {
    showError('Please enter your name.');
    return;
  }

  const imageFile = imageInput.files[0];
  let imageData = '';
  if (imageFile) {
    try {
      imageData = await readFileAsDataURL(imageFile);
    } catch (error) {
      showError('Unable to load the image. Please try another file.');
      return;
    }
  }

  savedProfile = {
    name,
    email,
    password,
    bio,
    imageData,
    loggedIn: true,
    amountSpent: 0,
    purchaseHistory: [],
  };

  saveProfileToStorage();
  showProfile();
}

async function handleUpdateSubmit(event) {
  event.preventDefault();
  updateSuccess.classList.add('hidden');

  if (!savedProfile) return;

  const name = updateName.value.trim();
  const bio = updateBio.value.trim();
  const imageFile = updateImageInput.files[0];

  updateError.classList.add('hidden');
  updateSuccess.classList.add('hidden');

  if (!name) {
    updateError.classList.remove('hidden');
    return;
  }

  if (imageFile) {
    try {
      savedProfile.imageData = await readFileAsDataURL(imageFile);
    } catch (error) {
      updateError.textContent = 'Unable to load the image. Please try another file.';
      updateError.classList.remove('hidden');
      return;
    }
  }

  savedProfile.name = name;
  savedProfile.bio = bio;
  saveProfileToStorage();
  setProfileContent();
  updateSuccess.classList.remove('hidden');

  window.setTimeout(() => {
    updateSuccess.classList.add('hidden');
  }, 2000);
}

function openLogoutConfirm() {
  if (!logoutModal) return;
  logoutModal.classList.remove('hidden');
}

function closeLogoutConfirm() {
  if (!logoutModal) return;
  logoutModal.classList.add('hidden');
}

function handleLogout() {
  if (!savedProfile) return;
  openLogoutConfirm();
}

function confirmLogout() {
  if (!savedProfile) return;
  savedProfile.loggedIn = false;
  saveProfileToStorage();
  closeLogoutConfirm();
  showLogin();
}

authForm.addEventListener('submit', handleAuthSubmit);
updateForm.addEventListener('submit', handleUpdateSubmit);
logoutButton.addEventListener('click', handleLogout);
confirmLogoutYes.addEventListener('click', confirmLogout);
confirmLogoutNo.addEventListener('click', closeLogoutConfirm);

if (savedProfile && savedProfile.loggedIn) {
  showProfile();
} else {
  showLogin();
}
