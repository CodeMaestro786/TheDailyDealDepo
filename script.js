// ========== UTILITIES ==========
function $(id) {
  return document.getElementById(id);
}

const STORAGE_KEY = "dailydepot_inventory";

// Load inventory from localStorage or default
function loadInventory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : getDefaultInventory();
}

function saveInventory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getDefaultInventory() {
  return [
    {
      id: 1,
      name: "Sunlight Soap",
      category: "Cleaning",
      description: "Trusted household bar soap.",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1617957741685-c6481d948e76?auto=format&fit=crop&w=600&q=60",
      deal: true,
    },
    {
      id: 2,
      name: "Maize Meal 10kg",
      category: "Groceries",
      description: "Everyday staple for the family.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1601050690597-1c17e2f7a97a?auto=format&fit=crop&w=600&q=60",
      deal: false,
    },
    {
      id: 3,
      name: "Cooking Oil 2L",
      category: "Groceries",
      description: "Pure sunflower oil.",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1582651052102-2460f2a444ef?auto=format&fit=crop&w=600&q=60",
      deal: true,
    },
  ];
}

// ========== RENDER FUNCTIONS ==========
function renderProducts(items) {
  const grid = $("products-grid");
  grid.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <div class="price">R${item.price.toFixed(2)}</div>
      <small>${item.category}</small>
    `;
    grid.appendChild(card);
  });
}

function renderDeals(items) {
  const grid = $("deals-grid");
  grid.innerHTML = "";
  items
    .filter((item) => item.deal)
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h4>${item.name}</h4>
        <div class="price">R${item.price.toFixed(2)}</div>
      `;
      grid.appendChild(card);
    });
}

function renderCategories(items) {
  const select = $("filter-cat");
  const cats = ["all", ...new Set(items.map((i) => i.category))];
  select.innerHTML = cats
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
}

// ========== SEARCH & FILTER ==========
function filterAndRender(items) {
  const term = $("search").value.toLowerCase();
  const cat = $("filter-cat").value;
  let filtered = items.filter((i) =>
    i.name.toLowerCase().includes(term) ||
    i.description.toLowerCase().includes(term)
  );
  if (cat !== "all") {
    filtered = filtered.filter((i) => i.category === cat);
  }
  renderProducts(filtered);
}

// ========== ADMIN PANEL ==========
function openAdminModal(items) {
  const modalBody = $("modal-body");
  modalBody.innerHTML = `
    <h3>Manage Inventory</h3>
    <form id="admin-form">
      <input type="text" id="prod-name" placeholder="Product name" required />
      <input type="text" id="prod-cat" placeholder="Category" required />
      <textarea id="prod-desc" placeholder="Description"></textarea>
      <input type="number" id="prod-price" placeholder="Price" step="0.01" required />
      <input type="url" id="prod-img" placeholder="Image URL" required />
      <label><input type="checkbox" id="prod-deal" /> Mark as deal</label>
      <button type="submit" class="btn btn-primary">Add Product</button>
    </form>
    <hr />
    <h4>Current Products</h4>
    <ul id="prod-list"></ul>
  `;

  // Render product list
  const list = $("prod-list");
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} — R${item.price.toFixed(2)} 
      <button data-id="${item.id}" class="btn-delete">Delete</button>`;
    list.appendChild(li);
  });

  // Add product
  $("admin-form").onsubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: $("prod-name").value,
      category: $("prod-cat").value,
      description: $("prod-desc").value,
      price: parseFloat($("prod-price").value),
      image: $("prod-img").value,
      deal: $("prod-deal").checked,
    };
    items.push(newItem);
    saveInventory(items);
    renderProducts(items);
    renderDeals(items);
    renderCategories(items);
    openAdminModal(items); // refresh list
  };

  // Delete product
  list.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id, 10);
      const updated = items.filter((i) => i.id !== id);
      saveInventory(updated);
      renderProducts(updated);
      renderDeals(updated);
      renderCategories(updated);
      openAdminModal(updated);
    };
  });

  openModal();
}

// ========== MODAL ==========
function openModal() {
  $("modal").classList.remove("hidden");
}
function closeModal() {
  $("modal").classList.add("hidden");
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  let items = loadInventory();

  // Render
  renderProducts(items);
  renderDeals(items);
  renderCategories(items);

  // Search & filter
  $("search").addEventListener("input", () => filterAndRender(items));
  $("filter-cat").addEventListener("change", () => filterAndRender(items));

  // Admin
  $("btn-admin").addEventListener("click", () => openAdminModal(items));
  $("modal-close").addEventListener("click", closeModal);
  $("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });

  // Footer year
  $("year").textContent = new Date().getFullYear();
});
