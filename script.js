/* ==========================
   Daily Deal Depo Website JS
   ========================== */

// ===== Inventory System =====
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

// Save inventory to localStorage
function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
  renderDeals();
}

// Add new item
function addItem(e) {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const price = document.getElementById("itemPrice").value.trim();
  const description = document.getElementById("itemDesc").value.trim();
  const imageUrl = document.getElementById("itemImage").value.trim();

  if (!name || !price) {
    alert("Please enter at least a name and price!");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    price: `R${price}`,
    description: description || "No description",
    image: imageUrl || "https://via.placeholder.com/300x180.png?text=No+Image"
  };

  inventory.push(newItem);
  saveInventory();

  e.target.reset();
  closeAdmin();
}

// Render inventory to page
function renderInventory() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;

  grid.innerHTML = inventory.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="p-3">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="price">${item.price}</div>
      </div>
    </div>
  `).join("");
}

// Render featured deals carousel
function renderDeals() {
  const carousel = document.getElementById("dealCarousel");
  if (!carousel) return;

  let deals = [...inventory].sort(() => 0.5 - Math.random()).slice(0, 6);
  carousel.innerHTML = deals.map(item => `
    <div class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="p-3">
        <h4>${item.name}</h4>
        <div class="price">${item.price}</div>
      </div>
    </div>
  `).join("");
}

// ===== Modal Control (Admin) =====
const adminModal = document.getElementById("adminModal");

function openAdmin() {
  adminModal.classList.remove("hidden");
}

function closeAdmin() {
  adminModal.classList.add("hidden");
}

// ===== Smooth Scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Carousel drag scroll =====
const carousel = document.getElementById("dealCarousel");
if (carousel) {
  let isDown = false;
  let startX, scrollLeft;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    carousel.classList.add("active");
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener("mouseleave", () => { isDown = false; });
  carousel.addEventListener("mouseup", () => { isDown = false; });
  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });
}

// ===== Initialize on Load =====
document.addEventListener("DOMContentLoaded", () => {
  renderInventory();
  renderDeals();
});
