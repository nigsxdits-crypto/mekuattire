const products = [
  {
    id: 1,
    name: "Essential Hoodie",
    price: 4500,
    description: "A clean everyday essential with a relaxed fit and soft feel.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Washed Oversized Hoodie",
    price: 5200,
    description: "A washed oversized silhouette made for effortless streetwear looks.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Classic Zip Hoodie",
    price: 5800,
    description: "A versatile zip-up layer with a classic urban finish.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Terrain Hoodie",
    price: 5400,
    description: "A bold everyday hoodie designed for comfort and attitude.",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Shadow Hoodie",
    price: 4900,
    description: "A minimal shadow-toned piece for understated street style.",
    image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Urban Fit Hoodie",
    price: 5600,
    description: "A modern urban fit that brings comfort and character together.",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Monochrome Hoodie",
    price: 4800,
    description: "A monochrome staple built for easy, everyday styling.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Terrain Zip Hoodie",
    price: 5900,
    description: "A refined zip hoodie with a relaxed fit and contemporary edge.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85"
  }
];

let cart = [];
let discountApplied = false;

const productsGrid = document.getElementById("productsGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const discountMessage = document.getElementById("discountMessage");

function money(value) {
  return "Rs. " + value.toLocaleString("en-PK");
}

function renderProducts(list = products) {
  productsGrid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${money(product.price)}</p>

        <label class="size-label" for="size-${product.id}">SELECT SIZE</label>
        <select class="size-select" id="size-${product.id}">
          <option value="">Choose size</option>
          <option value="S">Small (S)</option>
          <option value="M">Medium (M)</option>
          <option value="L">Large (L)</option>
          <option value="XL">Extra Large (XL)</option>
        </select>

        <div class="product-actions">
          <button class="add-btn" onclick="addToCart(${product.id})">ADD TO CART</button>
          <button class="favorite" aria-label="Add to favorites">♡</button>
        </div>
      </div>
    </article>
  `).join("");
}
function addToCart(id) {
  const selectedSize = document.getElementById(`size-${id}`).value;

  if (!selectedSize) {
    alert("Please choose a size first.");
    return;
  }

  const existing = cart.find(item => item.id === id && item.size === selectedSize);

  if (existing) {
    existing.quantity++;
  } else {
    const product = products.find(item => item.id === id);
    cart.push({ ...product, size: selectedSize, quantity: 1 });
  }

  renderCart();
  openCart();
}
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-meta">${money(item.price)}<br>Size: ${item.size}</p>
          <div class="quantity">
            <button onclick="changeQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
      </div>
    `).join("");
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = discountApplied ? Math.round(subtotal * .9) : subtotal;

  cartCount.textContent = count;
  subtotalElement.textContent = money(subtotal);
  totalElement.textContent = money(total);
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("active");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("active");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("sortSelect").addEventListener("change", event => {
  const value = event.target.value;
  let sorted = [...products];

  if (value === "low") sorted.sort((a, b) => a.price - b.price);
  if (value === "high") sorted.sort((a, b) => b.price - a.price);
  if (value === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

  renderProducts(sorted);
});

document.getElementById("applyDiscount").addEventListener("click", () => {
  const code = document.getElementById("discountCode").value.trim().toUpperCase();

  if (code === "MEKU10") {
    discountApplied = true;
    discountMessage.textContent = "10% discount applied.";
  } else {
    discountApplied = false;
    discountMessage.textContent = code ? "Invalid discount code." : "Enter a discount code.";
  }

  renderCart();
});

const checkoutModal = document.getElementById("checkoutModal");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const cardFields = document.getElementById("cardFields");

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  checkoutTotal.textContent = totalElement.textContent;
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
}

function closeCheckout() {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
}

document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) closeCheckout();
});

document.querySelectorAll('input[name="payment"]').forEach(input => {
  input.addEventListener("change", event => {
    cardFields.classList.toggle("show", event.target.value === "Card Payment");
  });
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

  if (selectedPayment === "Card Payment") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !expiry || !cvv) {
      alert("Please complete the card payment fields.");
      return;
    }
  }

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  alert(`Thank you, ${firstName} ${lastName}! Your MEKU ATTIRE order has been placed using ${selectedPayment}.`);

  cart = [];
  discountApplied = false;
  checkoutForm.reset();
  cardFields.classList.remove("show");
  closeCheckout();
  closeCart();
  renderCart();
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.add("open");
});

document.getElementById("closeMenu").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.remove("open");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = prompt("Search hoodies:");
  if (!query) return;

  const results = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  renderProducts(results);
});

renderProducts();
renderCart();
