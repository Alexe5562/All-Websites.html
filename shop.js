function startCheckout(itemName, price, description, image) {
  const checkoutItem = {
    name: itemName,
    price,
    description,
    image,
    date: new Date().toLocaleDateString(),
  };
  localStorage.setItem('checkoutItem', JSON.stringify(checkoutItem));
  window.location.href = 'checkout.html';
}
