const menu = {
  Whisky: [
    { name: "Red Label 1L", price: 89.9 },
    { name: "Old Parr 1L", price: 135 },
    { name: "Jack Daniel's 07 1L", price: 130 },
    { name: "Jack Daniel's Maça 1L", price: 130 },
    { name: "Jack Daniel's Honey 1L", price: 130 },
    { name: "Jack Daniel's Fire 1L", price: 130 },
    { name: "Cavalo Branco 1L", price: 67 },
    { name: "Ballantines 1L", price: 67 },
    { name: "Black Label 1L", price: 165 }
  ],
  "Gelo Saborizado": [
    { name: "CocoLeve", price: 3.5, description: "5 ou mais unidades: R$3,00 cada" }
  ],
  Diversos: [
    { name: "43", price: 130 },
    { name: "43 Chocolate", price: 155 },
    { name: "Ballena", price: 130 },
    { name: "Enerup 2L", price: 12 },
    { name: "51 Ice Limão/Balada", price: 6.5 },
    { name: "Pepsi 2L", price: 9.5 },
    { name: "Água 500ml", price: 2 },
    { name: "Heineken 330ml", price: 7.5 }
  ]
};

let currentCategory = "Whisky";
let cart = [];

const menuEl = document.getElementById("menu");
const produtosEl = document.getElementById("produtos");
const carrinhoEl = document.getElementById("carrinho");

function renderMenu() {
  menuEl.innerHTML = "<h2>Categorias</h2>";
  Object.keys(menu).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => { currentCategory = cat; renderProdutos(); };
    menuEl.appendChild(btn);
  });
}

function renderProdutos() {
  produtosEl.innerHTML = "";
  menu[currentCategory].forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${item.name}</h3>
                     <p>${item.description || ""}</p>
                     <p>R$ ${item.price.toFixed(2)}</p>`;
    const btn = document.createElement("button");
    btn.textContent = "➕ Adicionar";
    btn.onclick = () => addToCart(item);
    div.appendChild(btn);
    produtosEl.appendChild(div);
  });
}

function addToCart(item) {
  const existing = cart.find(i => i.name === item.name);
  let price = item.price;
  if (item.name === "CocoLeve" && existing && existing.quantity + 1 >= 5) price = 3;
  if (existing) {
    existing.quantity++;
    existing.price = price;
  } else {
    cart.push({ ...item, quantity: 1, price });
  }
  renderCarrinho();
}

function renderCarrinho() {
  carrinhoEl.innerHTML = "<h2>🛒 Carrinho</h2>";
  if (cart.length === 0) { carrinhoEl.innerHTML += "<p>Vazio</p>"; return; }

  const ul = document.createElement("ul");
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.quantity} R$ ${(item.price*item.quantity).toFixed(2)}
                    <button onclick="changeQty(${i}, -1)">-</button>
                    <button onclick="changeQty(${i}, 1)">+</button>
                    <button onclick="removeItem(${i})">❌</button>`;
    ul.appendChild(li);
  });
  carrinhoEl.appendChild(ul);

  const total = cart.reduce((a,b)=>a+b.price*b.quantity,0).toFixed(2);
  carrinhoEl.innerHTML += `<p>Total: R$ ${total}</p>`;
  const finalizeBtn = document.createElement("button");
  finalizeBtn.textContent = "✅ Finalizar";
  finalizeBtn.onclick = finalizeOrder;
  carrinhoEl.appendChild(finalizeBtn);
}

function changeQty(i, delta) {
  cart[i].quantity += delta;
  if (cart[i].name === "CocoLeve" && cart[i].quantity >= 5) cart[i].price = 3;
  else if (cart[i].name === "CocoLeve") cart[i].price = 3.5;
  if (cart[i].quantity <= 0) cart.splice(i,1);
  renderCarrinho();
}

function removeItem(i) {
  cart.splice(i,1);
  renderCarrinho();
}

function finalizeOrder() {
  const produtos = cart.map(i=>`${i.name} x${i.quantity} R$ ${(i.price*i.quantity).toFixed(2)}`).join(", ");
  const total = cart.reduce((a,b)=>a+b.price*b.quantity,0).toFixed(2);
  const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScvU1jKentKXKAYs8Okd6Cy73FvTUmTES7aWfkXHmgmNBppKA/viewform?usp=pp_url";
  const url = `${formURL}&entry.1025199079=${encodeURIComponent(produtos)}&entry.1266588870=${encodeURIComponent(total)}`;
  window.open(url, "_blank");
}

renderMenu();
renderProdutos();
renderCarrinho();