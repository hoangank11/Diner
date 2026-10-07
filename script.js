/* ===== Sáng Ơi Breakfast House — shared script for every page ===== */

/* ---------- Data ---------- */
const DISHES = [
  { id: 1, img: 'images/pho-bo.jpg',  name: 'Phở Bò',          price: 45000, available: true,  emoji: '🍜', desc: 'Flat rice noodles in a clear beef broth simmered overnight with star anise and cinnamon, topped with thin-sliced beef and fresh herbs.' },
  { id: 2, img: 'images/banh-mi-thit.jpg',  name: 'Bánh Mì Thịt',    price: 25000, available: true,  emoji: '🥖', desc: 'A crackly baguette filled with grilled pork, pâté, pickled carrot and daikon, cucumber, coriander and a dash of chilli sauce.' },
  { id: 3, img: 'images/xoi-xeo.jpg',  name: 'Xôi Xéo',         price: 20000, available: true,  emoji: '🍚', desc: 'Turmeric sticky rice with mashed mung bean and crispy fried shallots — the classic Hanoi breakfast wrapped in a banana leaf.' },
  { id: 4, img: 'images/bun-cha.jpg',  name: 'Bún Chả',         price: 50000, available: false, emoji: '🍢', desc: 'Charcoal-grilled pork patties served in a warm sweet-and-sour dipping broth with rice vermicelli and a basket of herbs.' },
  { id: 5, img: 'images/banh-cuon.jpg',  name: 'Bánh Cuốn',       price: 35000, available: true,  emoji: '🥟', desc: 'Silky steamed rice rolls filled with minced pork and wood-ear mushroom, served with fried shallots and fish-sauce dip.' },
  { id: 6, img: 'images/chao-suon.jpg',  name: 'Cháo Sườn',       price: 30000, available: true,  emoji: '🥣', desc: 'Smooth rice porridge cooked with pork ribs, finished with black pepper and crunchy fried dough sticks.' },
  { id: 7, img: 'images/bun-rieu.jpg',  name: 'Bún Riêu',        price: 40000, available: true,  emoji: '🦀', desc: 'Rice vermicelli in a tangy tomato broth with freshwater crab paste, fried tofu and a squeeze of lime.' },
  { id: 8, img: 'images/banh-bao.jpg',  name: 'Bánh Bao',        price: 15000, available: false, emoji: '🥠', desc: 'A fluffy steamed bun stuffed with seasoned pork, quail egg and Chinese sausage. Easy to eat on the way to work.' },
  { id: 9, img: 'images/ca-phe-sua-da.jpg',  name: 'Cà Phê Sữa Đá',   price: 25000, available: true,  emoji: '☕', desc: 'Strong drip-filtered robusta coffee over ice with sweetened condensed milk. The proper way to wake up.' },
  { id: 10, img: 'images/sua-dau-nanh.jpg', name: 'Sữa Đậu Nành',    price: 10000, available: true,  emoji: '🥛', desc: 'Fresh soy milk made in-house every morning, lightly sweetened and served warm or cold.' }
];

const PROMOS = {'DISCOUNT50%': 0.50 };  // promo code -> discount rate

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const vnd = (n) => n.toLocaleString('vi-VN') + ' ₫';
const byId = (id) => DISHES.find((d) => d.id === Number(id));

const store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
};
const getCart = () => store.get('cart', {});   // { dishId: quantity }
const getFavs = () => store.get('favs', []);   // [dishId, ...]

function toast(message) {
  let t = $('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = message;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Header + footer (same on every page) ---------- */
const ICON = {
  user:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>',
  shop:  '<svg viewBox="0 0 24 24"><path d="M4 10v10h16V10"/><path d="M3 10l1.5-6h15L21 10a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M10 20v-5h4v5"/></svg>'
};

function renderLayout() {
  const page = document.body.dataset.page;
  const link = (href, label, key) =>
    `<a href="${href}" class="${page === key ? 'active' : ''}">${label}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="site-header">
      <a class="logo" href="index.html"><span>☀</span> Sáng Ơi</a>
      <nav>
        ${link('index.html', 'Home', 'home')}
        ${link('menu.html', 'Dishes', 'menu')}
        ${link('contact.html', 'Contact', 'contact')}
      </nav>
      <div class="icons">
        <button class="icon-btn" id="loginBtn" title="Log in" aria-label="Log in">${ICON.user}</button>
        <a class="icon-btn" href="menu.html?fav=1" title="Favourites" aria-label="Favourites">${ICON.heart}<span class="badge" id="favBadge"></span></a>
        <a class="icon-btn" href="order.html" title="Your order" aria-label="Your order">${ICON.shop}<span class="badge" id="cartBadge"></span></a>
      </div>
    </header>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-footer">
      <span>© 2026 Sáng Ơi Breakfast House · Open daily 6:00 – 22:00</span>
      <small>Web made by Hoàng Mạnh Thắng</small>
    </footer>
    <dialog id="loginDlg">
      <form method="dialog">
        <h3>Log in</h3>
        <input id="loginName" placeholder="Your name" required>
        <input type="password" placeholder="Password" required>
        <div class="dlg-actions">
          <button class="btn btn-outline" value="cancel" formnovalidate>Cancel</button>
          <button class="btn" value="ok">Log in</button>
        </div>
      </form>
    </dialog>`);

  // Demo login: only remembers a name in the browser
  const dlg = $('#loginDlg');
  const loginBtn = $('#loginBtn');
  const showUser = () => {
    const user = store.get('user', null);
    loginBtn.innerHTML = user ? `<b class="avatar">${user[0].toUpperCase()}</b>` : ICON.user;
    loginBtn.title = user ? `Logged in as ${user}` : 'Log in';
  };
  loginBtn.addEventListener('click', () => {
    const user = store.get('user', null);
    if (!user) { dlg.showModal(); return; }
    if (confirm(`Log out, ${user}?`)) { store.set('user', null); showUser(); }
  });
  dlg.addEventListener('close', () => {
    const name = $('#loginName').value.trim();
    if (dlg.returnValue === 'ok' && name) {
      store.set('user', name);
      showUser();
      toast(`Good morning, ${name}!`);
    }
  });
  showUser();
  updateBadges();
}

function updateBadges() {
  const cartCount = Object.values(getCart()).reduce((a, b) => a + b, 0);
  const favCount = getFavs().length;
  $('#cartBadge').textContent = cartCount || '';
  $('#favBadge').textContent = favCount || '';
}

/* ---------- Dish card (menu + suggestions) ---------- */
// Dish picture: shows the photo in d.img; if the file is missing, falls back to the emoji
function art(d) {
  return `<img src="${d.img}" alt="${d.name}" data-emoji="${d.emoji}" onerror="this.replaceWith(this.dataset.emoji)">`;
}

function card(d) {
  const fav = getFavs().includes(d.id);
  return `
    <article class="card ${d.available ? '' : 'is-out'}">
      <button class="fav ${fav ? 'on' : ''}" data-fav="${d.id}" aria-label="Add to favourites">♥</button>
      <div class="card-art">${art(d)}</div>
      <h3>${d.name}</h3>
      <p class="price">${vnd(d.price)}</p>
      <p class="status ${d.available ? 'in' : 'out'}">${d.available ? 'Available' : 'Sold out'}</p>
      <a class="btn btn-outline" href="detail.html?id=${d.id}">Info</a>
    </article>`;
}

// Heart buttons on any card
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-fav]');
  if (!btn) return;
  const id = Number(btn.dataset.fav);
  let favs = getFavs();
  favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
  store.set('favs', favs);
  btn.classList.toggle('on', favs.includes(id));
  updateBadges();
});

/* ---------- Page: menu ---------- */
function initMenu() {
  const onlyFavs = new URLSearchParams(location.search).get('fav') === '1';
  const list = onlyFavs ? DISHES.filter((d) => getFavs().includes(d.id)) : DISHES;

  if (onlyFavs) {
    $('#menuTitle').textContent = 'Your favourites';
    $('#menuLead').innerHTML = 'Dishes you marked with a heart. <a href="menu.html">See all dishes</a>';
  }
  $('#menuGrid').innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="empty">No favourites yet — tap the ♥ on a dish to save it.</p>';
}

/* ---------- Page: detail ---------- */
function initDetail() {
  const d = byId(new URLSearchParams(location.search).get('id'));
  const box = $('#detail');

  if (!d) {
    box.innerHTML = '<p class="empty">Dish not found. <a href="menu.html">Back to dishes</a></p>';
  } else {
    document.title = `${d.name} — Sáng Ơi`;
    box.innerHTML = `
      <div class="detail-art">${art(d)}</div>
      <div class="detail-info">
        <a class="back" href="menu.html">← All dishes</a>
        <h1>${d.name}</h1>
        <p class="price big">${vnd(d.price)}</p>
        <p class="status ${d.available ? 'in' : 'out'}">${d.available ? 'Available' : 'Sold out'}</p>
        <p class="desc">${d.desc}</p>
        <button class="btn" id="orderBtn" ${d.available ? '' : 'disabled'}>
          ${d.available ? 'Order' : 'Sold out'}
        </button>
      </div>`;

    $('#orderBtn').addEventListener('click', () => {
      const cart = getCart();
      cart[d.id] = Math.min((cart[d.id] || 0) + 1, 99);
      store.set('cart', cart);
      updateBadges();
      toast(`${d.name} added · <a href="order.html">View order</a>`);
    });
  }

  // Suggestions: only dishes that are still on sale
  const others = DISHES.filter((x) => x.available && (!d || x.id !== d.id));
  $('#suggestGrid').innerHTML = others.map(card).join('');
}

/* ---------- Page: order ---------- */
function initOrder() {
  let promo = null;             // currently applied promo code
  const itemsBox = $('#cartItems');

  function render() {
    const cart = getCart();
    const rows = Object.keys(cart).map((id) => ({ d: byId(id), qty: cart[id] })).filter((r) => r.d);

    itemsBox.innerHTML = rows.length
      ? rows.map(({ d, qty }) => `
          <div class="cart-row" data-id="${d.id}">
            <div class="cart-art">${art(d)}</div>
            <div class="cart-name">
              <h3>${d.name}</h3>
              <p class="price">${vnd(d.price)}</p>
            </div>
            <div class="qty">
              <button data-act="minus" aria-label="Minus one">−1</button>
              <input type="number" min="1" max="99" value="${qty}" aria-label="Quantity">
              <button data-act="plus" aria-label="Plus one">+1</button>
            </div>
            <strong class="line-total">${vnd(d.price * qty)}</strong>
            <button class="remove" data-act="remove" aria-label="Remove">✕</button>
          </div>`).join('')
      : '<p class="empty">Your order is empty. <a href="menu.html">Pick some dishes</a></p>';

    const subtotal = rows.reduce((sum, r) => sum + r.d.price * r.qty, 0);
    const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;

    $('#summaryLines').innerHTML = rows.map(({ d, qty }) =>
      `<li><span>${d.name} × ${qty}</span><span>${vnd(d.price * qty)}</span></li>`).join('')
      + (discount ? `<li class="discount"><span>Promo ${promo}</span><span>− ${vnd(discount)}</span></li>` : '');
    $('#total').textContent = vnd(subtotal - discount);
    $('#checkoutBtn').disabled = rows.length === 0;
    updateBadges();
  }

  function setQty(id, qty) {
    const cart = getCart();
    cart[id] = Math.max(1, Math.min(99, Math.floor(qty) || 1));
    store.set('cart', cart);
    render();
  }

  itemsBox.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.closest('.cart-row').dataset.id;
    const cart = getCart();
    if (btn.dataset.act === 'remove') {
      delete cart[id];
      store.set('cart', cart);
      render();
    } else {
      setQty(id, cart[id] + (btn.dataset.act === 'plus' ? 1 : -1));
    }
  });

  itemsBox.addEventListener('change', (e) => {
    if (e.target.matches('.qty input')) {
      setQty(e.target.closest('.cart-row').dataset.id, Number(e.target.value));
    }
  });

  $('#promoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = $('#promoInput').value.trim().toUpperCase();
    const msg = $('#promoMsg');
    if (PROMOS[code]) {
      promo = code;
      msg.textContent = `Code applied: ${PROMOS[code] * 100}% off`;
      msg.className = 'promo-msg ok';
    } else {
      promo = null;
      msg.textContent = 'This code is not valid';
      msg.className = 'promo-msg bad';
    }
    render();
  });

  // Payment method buttons
  $('#payMethods').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    document.querySelectorAll('#payMethods button').forEach((b) => b.classList.remove('on'));
    btn.classList.add('on');
  });

  $('#checkoutBtn').addEventListener('click', () => {
    const method = $('#payMethods .on').textContent;
    const total = $('#total').textContent;
    store.set('cart', {});
    updateBadges();
    $('#orderMain').innerHTML = `
      <div class="thanks">
        <div class="thanks-art">🎉</div>
        <h1>Thank you!</h1>
        <p>Your payment of <strong>${total}</strong> with ${method} was received.<br>
           Your breakfast is being prepared.</p>
        <a class="btn" href="menu.html">Order more</a>
      </div>`;
  });

  render();
}

/* ---------- Start ---------- */
renderLayout();
const page = document.body.dataset.page;
if (page === 'menu') initMenu();
if (page === 'detail') initDetail();
if (page === 'order') initOrder();
