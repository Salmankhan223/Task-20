const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const services = [
  { id: 1, name: "Wash & Fold", description: "Everyday clothes, washed and neatly folded", price: 80, icon: "🧺" },
  { id: 2, name: "Wash & Iron", description: "Freshly washed and perfectly pressed", price: 120, icon: "👔" },
  { id: 3, name: "Dry Cleaning", description: "Special care for delicate garments", price: 180, icon: "✨" },
  { id: 4, name: "Ironing", description: "Crisp finish for your favourite outfits", price: 60, icon: "♨️" },
  { id: 5, name: "Shoe Cleaning", description: "A careful clean for your everyday shoes", price: 150, icon: "👟" },
  { id: 6, name: "Blanket Cleaning", description: "Deep cleaning for blankets and quilts", price: 200, icon: "🛏️" }
];

let cart = [];

const serviceList = document.getElementById("serviceList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function showServices() {
  serviceList.innerHTML = "";

  services.forEach(function (service) {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="service-icon">${service.icon}</div>
      <div class="service-info">
        <h4>${service.name}</h4>
        <p>${service.description}</p>
      </div>
      <div class="service-price">₹${service.price}</div>
      <div class="service-actions">
        <button class="small-btn" onclick="removeItem(${service.id})">Remove Now</button>
        <button class="small-btn add" onclick="addItem(${service.id})">Add Items</button>
      </div>
    `;
    serviceList.appendChild(card);
  });
}

function addItem(id) {
  const selectedService = services.find(function (service) {
    return service.id === id;
  });

  const existingItem = cart.find(function (item) {
    return item.id === id;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...selectedService, quantity: 1 });
  }

  updateCart();
}

function removeItem(id) {
  const existingItem = cart.find(function (item) {
    return item.id === id;
  });

  if (existingItem && existingItem.quantity > 1) {
    existingItem.quantity--;
  } else {
    cart = cart.filter(function (item) {
      return item.id !== id;
    });
  }

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let totalQuantity = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🧺</span>
        <strong>Your cart is empty</strong>
        <small>Add a service to get started</small>
      </div>`;
  } else {
    cart.forEach(function (item) {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalQuantity += item.quantity;

      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${itemTotal}
          <button class="remove-cart" onclick="removeItem(${item.id})">Remove</button>
        </span>`;
      cartItems.appendChild(row);
    });
  }

  cartTotal.textContent = "₹" + total;
  cartCount.textContent = totalQuantity + (totalQuantity === 1 ? " item" : " items");
}

document.getElementById("bookingForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const message = document.getElementById("bookingMessage");
  const button = document.getElementById("bookButton");
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (cart.length === 0) {
    message.style.color = "#d34b4b";
    message.textContent = "Please add at least one service to your cart.";
    return;
  }

  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  const orderItems = cart.map(function (item) {
    return item.name + " x " + item.quantity + " = ₹" + (item.price * item.quantity);
  }).join("\n");

  // Email is sent only after you add valid EmailJS IDs above.
  if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
    EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
    message.style.color = "#d18a22";
    message.textContent = "Demo booking checked. Add your EmailJS IDs in script.js to send the email.";
    return;
  }

  button.disabled = true;
  button.textContent = "Sending...";

  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      order_items: orderItems,
      order_total: "₹" + total
    });

    message.style.color = "#11966e";
    message.textContent = "Thank you For Booking the Service We will get back to you soon!";
    document.getElementById("bookingForm").reset();
    cart = [];
    updateCart();
  } catch (error) {
    console.error("EmailJS error:", error);
    message.style.color = "#d34b4b";
    message.textContent = "Booking could not be emailed. Please check your EmailJS settings and try again.";
  } finally {
    button.disabled = false;
    button.innerHTML = 'Book Now <span>→</span>';
  }
});

document.getElementById("newsletterForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("newsletterName").value.trim();
  const email = document.getElementById("newsletterEmail").value.trim();

  if (name && email) {
    document.getElementById("newsletterMessage").textContent =
      "Thank you for subscribing, " + name + "!";
    this.reset();
  }
});

document.getElementById("menuToggle").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    document.getElementById("navLinks").classList.remove("show");
  });
});

showServices();
updateCart();
