document.addEventListener('DOMContentLoaded', () => {
    // 🎨 State & Data
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let currentQuickOrder = {};
    let isCartCheckout = false;

    // 👕 MASTER PRODUCT DATA
    const productsData = [
        {
            id: 1, title: 'Classic Shirt', price: 799, cat: 'Men', sizes: ['S', 'M', 'L', 'XL'], badge: '🔥 Hot',
            img: 'photos/men/shirt-red.jpg',
            desc: 'Premium cotton, regular fit. Perfect for office and casual wear.',
            colors: [
                { code: 'red', name: 'Red', img: ['photos/men/shirt-red.jpg', 'photos/men/shirt-red1.jpg'] },
                { code: '#f0f0f0', name: 'White', img: ['photos/men/shirt-white.jpg', 'photos/men/shirt-white1.jpg'] }
            ]
        },
        {
            id: 2, title: 'Blue Denim Jacket', price: 2499, cat: 'Women', sizes: ['S', 'M', 'L'], badge: '🆕 New',
            img: 'photos/women/Jacket-lightblue.jpg',
            desc: 'Stylish denim jacket with soft inner lining.',
            colors: [
                { code: '#add8e6', name: 'Light Blue', img: ['photos/women/Jacket-lightblue.jpg', 'photos/women/Jacket-lightblue1.jpg'] },
                { code: '#1e3f5a', name: 'Dark Blue', img: ['photos/women/Jacket-blue.jpg', 'photos/women/Jacket-blue1.jpg'] }
            ]
        },
        {
            id: 3, title: 'Casual Polo Tee', price: 599, cat: 'Men', sizes: ['M', 'L', 'XL'],
            img: 'photos/men/polo-red.jpg',
            desc: 'Breathable fabric, slim fit polo t-shirt.',
            colors: [
                { code: 'red', name: 'Red', img: ['photos/men/polo-red.jpg', 'photos/men/polo-red1.jpg'] },
                { code: 'green', name: 'Green', img: ['photos/men/polo-green.jpg', 'photos/men/polo-green1.jpg'] },
                { code: '#008080', name: 'Teal', img: ['photos/men/polo-teal.jpg', 'photos/men/polo-teal1.jpg'] }
            ]
        },
        {
            id: 4, title: 'Floral Summer Dress', price: 1299, cat: 'Women', sizes: ['S', 'M'], badge: '📉 Sale',
            img: 'photos/women/dress-orange.jpg',
            desc: 'Lightweight fabric, perfect for summers.',
            colors: [
                { code: 'orange', name: 'Orange', img: ['photos/women/dress-orange.jpg', 'photos/women/dress-orange1.jpg'] },
                { code: 'pink', name: 'Pink', img: ['photos/women/dress-pink.jpg', 'photos/women/dress-pink1.jpg'] }
            ]
        },
        {
            id: 5, title: 'Kids Cotton Shorts', price: 399, cat: 'Kids', sizes: ['S', 'M'],
            img: 'photos/kids/shorts-yellow.jpg',
            desc: 'Comfortable cotton shorts for everyday play.',
            colors: [
                { code: '#ffd700', name: 'Yellow', img: ['photos/kide/shorts-yellow.jpg', 'photos/kide/shorts-yellow1.jpg'] },
                { code: 'blue', name: 'Blue', img: ['photos/kide/shorts-blue.jpg', 'photos/kide/shorts-blue1.jpg'] }
            ]
        },
        {
            id: 6, title: 'Sukoon Kurti', price: 899, cat: 'Women', sizes: ['M', 'L', 'XL'], badge: '⭐ Best',
            img: 'photos/women/kurti-black.jpg',
            desc: 'Where comfort meets style — made for daily elegance.',
            colors: [
                { code: 'black', name: 'Black', img: ['photos/women/kurti-black.jpg', 'photos/women/kurti-black1.jpg'] },
                { code: 'green', name: 'Green', img: ['photos/women/kurti-green.jpg', 'photos/women/kurti-green1.jpg'] },
                { code: 'red', name: 'Red', img: ['photos/women/kurti-red.jpg', 'photos/women/kurti-red1.jpg'] }
            ]
        },
        {
            id: 7, title: 'Premium Silk Saree', price: 3499, cat: 'Women', sizes: ['Free Size'],
            img: 'photos/women/saree-black.jpg',
            desc: 'Elegance that flows — for your special moments.',
            colors: [
                { code: 'black', name: 'Black', img: ['photos/women/saree-black.jpg', 'photos/women/saree-black1.jpg'] },
                { code: 'green', name: 'Green', img: ['photos/women/saree-green.jpg', 'photos/women/saree-green1.jpg'] },
                { code: 'red', name: 'Red', img: ['photos/women/saree-red.jpg', 'photos/women/saree-red1.jpg'] }
            ]
        },
        {
            id: 8, title: 'High-Waist Jeans', price: 1899, cat: 'Women', sizes: ['28', '30', '32'],
            img: 'photos/women/jeans-black.jpg',
            desc: 'Stretchable denim with a comfortable high-waist fit.',
            colors: [
                { code: '#1a1a1a', name: 'Black', img: ['photos/women/jeans-black.jpg', 'photos/women/jeans-black-detail.jpg'] },
                { code: 'grey', name: 'Grey', img: ['photos/women/jeans-grey.jpg', 'photos/women/jeans-grey1.jpg'] }
            ]
        }
    ];

    // ELEMENTS REFERENCES (Safe Selection)
    const el = (id) => document.getElementById(id);
    const els = {
        productsContainer: el('products'),
        count: el('count'),
        search: el('search'),
        searchBtn: el('searchBtn'),
        sort: el('sort'),
        minP: el('minPrice'),
        maxP: el('maxPrice'),
        applyPrice: el('applyPriceFilter'),
        catChecks: document.querySelectorAll('.cat'),
        sizeChecks: document.querySelectorAll('.sizeFilter'),
        state: el('state'),
        city: el('city'),
        modalBg: el('modalBg'),
        modalImg: el('modalImg'),
        previewer: el('modal-image-previewer'),
        modalTitle: el('modalTitle'),
        modalPrice: el('modalPrice'),
        modalDesc: el('modalDesc'),
        modalSwatches: el('modalSwatches'),
        modalSizes: el('modalSizes'),
        modalQty: el('modalQty'),
        cartDrawer: el('cartDrawer'),
        cartOverlay: el('cartOverlay'),
        cartItems: el('cartItems'),
        cartTotal: el('cartTotal'),
        cartCount: el('cartCount'),
        orderModal: el('orderModal'),
        showqty: el('showqty')
    };

    // 🗺 STATE & CITY LOGIC
    const stateCityData = {
        "Uttar Pradesh": ["Agra", "Lucknow", "Kanpur", "Noida", "Varanasi"],
        "Delhi": ["New Delhi", "South Delhi", "West Delhi"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
        "Karnataka": ["Bangalore", "Mysore"],
        "Rajasthan": ["Jaipur", "Udaipur", "Kota"]
    };

    if (els.state) {
        Object.keys(stateCityData).forEach(s => {
            let opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            els.state.appendChild(opt);
        });
        els.state.addEventListener('change', function () {
            els.city.innerHTML = '<option value="">Select City</option>';
            if (this.value && stateCityData[this.value]) {
                els.city.disabled = false;
                stateCityData[this.value].forEach(c => {
                    let opt = document.createElement('option');
                    opt.value = c; opt.textContent = c;
                    els.city.appendChild(opt);
                });
            } else {
                els.city.disabled = true;
                els.city.innerHTML = '<option value="">Select State First</option>';
            }
        });
    }

    // 🖼 RENDER PRODUCTS (GRID)
    function renderProducts(list) {
        if (!els.productsContainer) return;
        els.productsContainer.innerHTML = '';
        els.count.textContent = list.length;

        if (list.length === 0) {
            els.productsContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#777">No products found.</div>';
            return;
        }

        list.forEach(p => {
            // FIX 1: Added backticks around the HTML string
            const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';

            let imgUrl = p.img;
            if (p.colors && p.colors[0] && Array.isArray(p.colors[0].img)) {
                imgUrl = p.colors[0].img[0];
            }

            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                ${badge}
                <img src="${imgUrl}" alt="${p.title}" loading="lazy">
                <div class="product-info">
                    <div class="p-title">${p.title}</div>
                    <div class="meta" style="font-size:12px;margin-bottom:5px">${p.cat}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div class="price">₹${p.price}</div>
                        <button class="secondary-btn" style="padding:5px 10px;font-size:12px" onclick="event.stopPropagation(); openModal(${p.id})">View</button>
                    </div>
                </div>
            `;
            div.onclick = () => openModal(p.id);
            els.productsContainer.appendChild(div);
        });
    }

    // ⚡ FILTER FUNCTION
    function applyFilters() {
        const term = els.search.value.toLowerCase();
        const selectedCats = Array.from(els.catChecks).filter(c => c.checked).map(c => c.value);
        const selectedSizes = Array.from(els.sizeChecks).filter(c => c.checked).map(c => c.value);
        const min = Number(els.minP.value) || 0;
        const max = Number(els.maxP.value) || 100000;

        let filtered = productsData.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(term) || p.cat.toLowerCase().includes(term);
            const matchCat = selectedCats.length === 0 || selectedCats.includes(p.cat);
            const matchSize = selectedSizes.length === 0 || p.sizes.some(s => selectedSizes.includes(s));
            const matchPrice = p.price >= min && p.price <= max;
            return matchSearch && matchCat && matchSize && matchPrice;
        });

        const sVal = els.sort.value;
        if (sVal === 'low') filtered.sort((a, b) => a.price - b.price);
        if (sVal === 'high') filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    if (els.searchBtn) els.searchBtn.onclick = applyFilters;
    if (els.search) els.search.onkeyup = applyFilters;
    if (els.sort) els.sort.onchange = applyFilters;
    if (els.applyPrice) els.applyPrice.onclick = applyFilters;
    els.catChecks.forEach(c => c.onchange = applyFilters);
    els.sizeChecks.forEach(c => c.onchange = applyFilters);

    // 👁 MODAL LOGIC
    window.openModal = function (id) {
        const p = productsData.find(x => x.id === id);
        if (!p) return;

        currentQuickOrder = { id: p.id, title: p.title, price: p.price, qty: 1, color: p.colors[0].name, colorCode: p.colors[0].code, size: p.sizes[0] };

        els.modalTitle.textContent = p.title;
        // FIX 2: Added backticks for price
        els.modalPrice.textContent = `₹${p.price}`;
        els.modalDesc.textContent = p.desc;
        els.modalQty.value = 1;

        els.modalSwatches.innerHTML = '';
        p.colors.forEach((c, i) => {
            const d = document.createElement('div');
            // FIX 3: Added backticks for className logic
            d.className = `swatch ${i === 0 ? 'selected' : ''}`;
            d.style.background = c.code;
            d.title = c.name;
            d.onclick = () => {
                document.querySelectorAll('.swatch').forEach(el => el.classList.remove('selected'));
                d.classList.add('selected');
                renderGallery(c.img);
                currentQuickOrder.color = c.name;
                currentQuickOrder.colorCode = c.code;
            };
            els.modalSwatches.appendChild(d);
        });

        els.modalSizes.innerHTML = '';
        p.sizes.forEach((s, i) => {
            const d = document.createElement('div');
            d.className = 'size';
            d.textContent = s;
            if (i === 0) d.setAttribute('data-selected', '1');
            d.onclick = () => {
                document.querySelectorAll('.size').forEach(el => el.removeAttribute('data-selected'));
                d.setAttribute('data-selected', '1');
                currentQuickOrder.size = s;
            };
            els.modalSizes.appendChild(d);
        });

        renderGallery(p.colors[0].img);
        updateTotal();
        els.modalBg.style.display = 'flex';
    };

    function renderGallery(imgs) {
        const images = Array.isArray(imgs) ? imgs : [imgs];
        els.modalImg.src = images[0];
        els.previewer.innerHTML = '';
        images.forEach((src, i) => {
            let img = document.createElement('img');
            // FIX 4: Added backticks for className logic
            img.src = src; img.className = `thumbnail ${i === 0 ? 'active' : ''}`;
            img.onclick = () => {
                els.modalImg.src = src;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                img.classList.add('active');
            };
            els.previewer.appendChild(img);
        });
    }

    function updateTotal() {
        const t = currentQuickOrder.price * els.modalQty.value;
        // FIX 5: Added backticks
        document.getElementById('Total').textContent = `Total: ₹${t}`;
    }

    // Modal Qty Change Listener (Important Addition)
    if (els.modalQty) {
        els.modalQty.onchange = updateTotal;
        els.modalQty.oninput = updateTotal;
    }

    // 🛒 CART FUNCTIONS
    function updateCartUI() {
        localStorage.setItem("cart", JSON.stringify(cart));
        els.cartCount.textContent = cart.length;
        els.cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            els.cartItems.innerHTML = '<div style="text-align:center;padding:20px;opacity:0.6">Cart Empty</div>';
            el('checkoutBtn').disabled = true;
        } else {
            el('checkoutBtn').disabled = false;
        }

        cart.forEach((item, idx) => {
            total += item.price * item.qty;
            let row = document.createElement('div');
            row.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:10px;border-bottom:1px dashed #eee;padding-bottom:10px';
            row.innerHTML = `
                <div>
                    <b>${item.title}</b><br>
                    <small>${item.size} | ${item.color} x ${item.qty}</small>
                </div>
                <div style="text-align:right">
                    ₹${item.price * item.qty} <br>
                    <small style="color:red;cursor:pointer" onclick="removeItem(${idx})">Remove</small>
                </div>
            `;
            els.cartItems.appendChild(row);
        });
        // FIX 6: Added backticks
        els.cartTotal.textContent = `₹${total}`;
    }

    window.removeItem = (i) => { cart.splice(i, 1); updateCartUI(); };

    // Button Actions
    el('addToCartModal').onclick = () => {
        const exists = cart.find(c => c.id === currentQuickOrder.id && c.size === currentQuickOrder.size && c.color === currentQuickOrder.color);
        if (exists) exists.qty += parseInt(els.modalQty.value);
        else cart.push({ ...currentQuickOrder, qty: parseInt(els.modalQty.value) });
        updateCartUI();
        showToast('Added to Cart');
        els.modalBg.style.display = 'none';
    };

    el('orderNowBtn').onclick = () => {
        isCartCheckout = false;
        els.modalBg.style.display = 'none';
        els.orderModal.style.display = 'flex';
        // FIX 7: Added backticks for detailed string
        els.showqty.innerHTML = `Ordering: <b>${currentQuickOrder.title}</b><br>Total: ₹${currentQuickOrder.price * currentQuickOrder.qty}`;
    };

    el('checkoutBtn').onclick = () => {
        isCartCheckout = true;
        els.cartDrawer.classList.remove('open');
        els.cartOverlay.style.display = 'none';
        els.orderModal.style.display = 'flex';
        const t = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        // FIX 8: Added backticks
        els.showqty.innerHTML = `Checkout Cart (${cart.length} items)<br>Total: ₹${t}`;
    };

    el('closeModal').onclick = () => els.modalBg.style.display = 'none';
    el('closeOrderForm').onclick = () => els.orderModal.style.display = 'none';
    el('openCart').onclick = () => { els.cartDrawer.classList.add('open'); els.cartOverlay.style.display = 'block'; updateCartUI(); };
    el('closeCartBtn').onclick = () => { els.cartDrawer.classList.remove('open'); els.cartOverlay.style.display = 'none'; };
    el('clearCartBtn').onclick = () => { cart = []; updateCartUI(); };

    el('darkModeToggle').onclick = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    };
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

    function showToast(msg) {
        let t = document.createElement('div');
        // FIX 9: Added backticks
        t.className = 'toast'; t.textContent = `✅ ${msg}`;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    document.getElementById('quickOrderForm').onsubmit = (e) => {
        e.preventDefault();
        if (isCartCheckout) { cart = []; updateCartUI(); }
        showToast('Order Placed Successfully!');
        els.orderModal.style.display = 'none';
    };

    renderProducts(productsData);
    updateCartUI();
});
