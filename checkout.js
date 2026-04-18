const CART_STORAGE_KEY = 'cart';

const cartItemsContainer = document.getElementById('cartItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const cartCount = document.getElementById('cartCount');
const confirmButton = document.getElementById('confirmButton');
const backButton = document.getElementById('backButton');
const checkoutSuccess = document.getElementById('checkoutSuccess');
const checkoutError = document.getElementById('checkoutError');

function loadCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function showError(message) {
  checkoutError.textContent = message;
  checkoutError.classList.remove('hidden');
  checkoutSuccess.classList.add('hidden');
}

function showSuccess(message) {
  checkoutSuccess.textContent = message;
  checkoutSuccess.classList.remove('hidden');
  checkoutError.classList.add('hidden');
}

function renderCartItems(cart) {
  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
    cartCount.textContent = '0 items in cart';
    checkoutTotal.textContent = formatCurrency(0);
    confirmButton.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image || ''}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <span>${formatCurrency(item.price)}</span>
      </div>
    </div>
  `).join('');

  const itemCount = cart.length;
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  cartCount.textContent = `${itemCount} item${itemCount === 1 ? '' : 's'} in cart`;
  checkoutTotal.textContent = formatCurrency(total);
  confirmButton.disabled = false;
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

function handleConfirmPurchase() {
  const cart = loadCart();

  if (!cart.length) {
    showError('Your cart is empty. Add items from the shop.');
    return;
  }

  clearCart();
  confirmButton.disabled = true;
  renderCartItems([]);
  showSuccess('Purchase confirmed! Your cart has been cleared. Closing checkout...');

  setTimeout(() => {
    window.close();
    window.location.href = 'index.html';
  }, 1500);
}

function handleBackToShop() {
  window.location.href = 'shop.html';
}

confirmButton.addEventListener('click', handleConfirmPurchase);
backButton.addEventListener('click', handleBackToShop);

const cart = loadCart();
renderCartItems(cart);
