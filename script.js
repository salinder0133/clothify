document.addEventListener('DOMContentLoaded', () => {
    // 🎨 Variable to hold the interval for image rotation
    let imageCycleInterval;

    // Element references (Matched with your HTML IDs)
    const orderNowBtn = document.getElementById('orderNowBtn');
    const orderNowForm = document.getElementById('orderNowForm');
    const addToCartModal = document.getElementById('addToCartModal');
    const quickOrderForm = document.getElementById('quickOrderForm');
    const orderModal = document.getElementById('orderModal');
    const modalBg = document.getElementById('modalBg');
    const modalQty = document.getElementById('modalQty');
    const showqtyElement = document.getElementById("showqty");
    const closeModalButton = document.getElementById('closeModal'); // Main modal close button
    const modalImgElement = document.getElementById('modalImg'); // Image element reference

    // Variable to hold the product details selected in the modal for a Quick Order
    let currentQuickOrder = {};

    // 🔴 UPDATED: Product ID 1 has 'red' as the first color option now.
    const productsData = [
        {
            id: 1,
            title: 'Classic Shirt',
            price: 799,
            cat: 'Men',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
                
                { code: 'red', img: ['photos/men/shirt-red.jpg', 'photos/men/shirt-red1.jpg'] },
                { code: 'white', img: ['photos/men/shirt-white.jpg', 'photos/men/shirt-white1.jpg'] }
            ],
            img: 'photos/men/shirt-red.jpg', 
            desc: 'Premium cotton, regular fit. Care: Machine wash.'
        },
        {
            id: 2,
            title: 'Blue Denim Jacket',
            price: 2499,
            cat: 'Women',
            sizes: ['S', 'M', 'L'],
            colors: [
                { code: 'blue', img: ['photos/women/Jacket-lightblue.jpg', 'photos/women/Jacket-lightblue1.jpg'] },
                { code: 'lightblue', img: ['photos/women/Jacket-blue.jpg', 'photos/women/Jacket-blue1.jpg'] }
            ],
            img: 'photos/women/Jacket-lightblue.jpg',
            desc: 'Denim jacket with soft lining.'
        },
        {
            id: 3,
            title: 'Casual Polo Tee',
            price: 599,
            cat: 'Men',
            sizes: ['M', 'L', 'XL'],
            colors: [
                { code: '#ef4444ff', img: ['photos/men/polo-red.jpg', 'photos/men/polo-red1.jpg'] },
                { code: '#10b981', img: ['photos/men/polo-green.jpg', 'photos/men/polo-green1.jpg'] },
                { code: '#0ea5a4', img: ['photos/men/polo-teal.jpg', 'photos/men/polo-teal1.jpg'] }
            ],
            img: 'photos/men/polo-red.jpg',
            desc: 'Breathable fabric, slim fit.'
        },
        {
            id: 4,
            title: 'Floral Summer Dress',
            price: 1299,
            cat: 'Women',
            sizes: ['S', 'M'],
            colors: [
                { code: '#f97316ff', img: ['photos/women/dress-orange.jpg', 'photos/women/dress-orange1.jpg'] },
                { code: '#f43f5e', img: ['photos/women/dress-pink.jpg', 'photos/women/dress-pink1.jpg'] }
            ],
            img: 'photos/women/dress-orange.jpg',
            desc: 'Lightweight fabric, perfect for summers.'
        },
        {
            id: 5,
            title: 'Kids Cotton Shorts',
            price: 399,
            cat: 'Kids',
            sizes: ['S', 'M'],
            colors: [
                { code: '#f59e0b', img: ['photos/kide/shorts-yellow.jpg', 'photos/kide/shorts-yellow1.jpg'] },
                { code: '#06b6d4', img: ['photos/kide/shorts-blue.jpg', 'photos/kide/shorts-blue1.jpg'] }
            ],
            img: 'photos/kide/shorts-yellow.jpg',
            desc: 'Comfortable cotton shorts for kids.'
        },
        {
            id: 6,
            title: 'Sukoon Kurti',
            price: 899,
            cat: 'Women',
            sizes: ['M', 'L', 'XL'],
            colors: [
                { code: 'black', img: ['photos/women/kurti-black.jpg', 'photos/women/kurti-black1.jpg'] },
                { code: 'green', img: ['photos/women/kurti-green.jpg', 'photos/women/kurti-green1.jpg'] },
                { code: 'red', img: ['photos/women/kurti-red.jpg', 'photos/women/kurti-red1.jpg'] }
            ],
            img: 'photos/women/kurti-black.jpg',
            desc: 'Where comfort meets style — made for daily elegance.'
        },
        {
            id: 7,
            title: 'Premium Silk Saree',
            price: 3499,
            cat: 'Women',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
                { code: 'black', img: ['photos/women/saree-black.jpg', 'photos/women/saree-black1.jpg'] },
                { code: 'green', img: ['photos/women/saree-green.jpg', 'photos/women/saree-green1.jpg'] },
                { code: 'red', img: ['photos/women/saree-red.jpg', 'photos/women/saree-red1.jpg'] }
            ],
            img: 'photos/women/saree-black.jpg',
            desc: 'Elegance that flows — for your special moments.'
        }
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 🖼️ NEW FUNCTION: To handle the image rotation logic
    function startImageRotation(imageArray, imgElement) {
        // Stop any existing rotation
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }

        // Convert to array if it's a single string for consistency (for other products)
        const images = Array.isArray(imageArray) ? imageArray : [imageArray];

        if (images.length < 2) {
            // Only one image, just display it and stop the function
            imgElement.src = images[0] || '';
            return;
        }

        let currentIndex = 0;

        // Initial image display
        imgElement.src = images[currentIndex];

        imageCycleInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imgElement.src = images[currentIndex];
        }, 2000); //time chnge kr skte hai photo ka
    }
    // -------------------------------------------------------

    // Function to calculate and update total price (unchanged)
    function updatePriceBasedOnSelection() {
        const basePrice = Number(currentQuickOrder.price);

        if (!basePrice || isNaN(basePrice)) {
            document.getElementById('Total').textContent = 'Total: ₹0';
            currentQuickOrder.total = 0;
            return;
        }

        const qty = Number(modalQty.value) || 1;
        const total = basePrice * qty;

        document.getElementById('Total').textContent = 'Total: ₹' + total;

        // Update the currentQuickOrder object attributes
        const selectedSize = [...document.querySelectorAll('#modalSizes .size')].find(s => s.dataset.selected === '1');
        const selectedColor = [...document.querySelectorAll('#modalSwatches .swatch')].find(s => s.classList.contains('selected'));

        currentQuickOrder.qty = qty;
        currentQuickOrder.total = total;
        currentQuickOrder.size = selectedSize ? selectedSize.textContent : null;
        currentQuickOrder.color = selectedColor ? selectedColor.style.background : null;

        // If the order form is visible, update its display immediately
        if (showqtyElement && orderModal.style.display === 'flex' && currentQuickOrder.title) {
            showqtyElement.innerHTML = `
                ${currentQuickOrder.qty} x ${currentQuickOrder.title} 
                <br>Size: ${currentQuickOrder.size} 
                <br>Color: <span style="display:inline-block;width:12px;height:12px;background:${currentQuickOrder.color};border:1px solid #ccc;border-radius:2px;"></span>
                <br><strong>Total: ₹${currentQuickOrder.total}</strong>
            `;
        }
    }

    // Render all products on page (unchanged)
    function renderProducts(list) {
        const el = document.getElementById('products');
        el.innerHTML = '';
        document.getElementById('count').textContent = list.length;

        list.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.dataset.id = p.id;

            // Find the primary image for the card display
            const primaryImg = Array.isArray(p.colors[0].img) ? p.colors[0].img[0] : p.colors[0].img;

            div.innerHTML = `
                <img src="${primaryImg}" alt="${p.title}">
                <div class="p-title">${p.title}</div>
                <div class="meta">${p.cat} • ${p.sizes.join('/')}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                    <div class="price">₹${p.price}</div>
                    <div style="display:flex;gap:8px">
                        <button data-id="${p.id}" class="quick">Quick view</button>
                    </div>
                </div>
            `;
            el.appendChild(div);
        });

        attachProductEvents();
    }

    // Add event listeners to product buttons & cards (unchanged)
    function attachProductEvents() {
        document.querySelectorAll('.quick').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = +btn.dataset.id;
                openModal(id);
            };
        });

        document.querySelectorAll('.product').forEach(card => {
            card.onclick = () => {
                const id = +card.dataset.id;
                openModal(id);
            };
        });
    }

    // Open product modal and setup selections (MODIFIED)
    function openModal(id) {
        const p = productsData.find(x => x.id === id);
        if (!p) return;

        // 🛑 NEW: Clear existing interval before setting up a new modal 
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }
        // -----------------------------------------------------------------

        // Initialize currentQuickOrder with price 
        currentQuickOrder = {
            id: p.id,
            title: p.title,
            price: p.price,
            qty: 1,
            size: p.sizes[0] || null,
            color: p.colors[0] ? p.colors[0].code : null,
            total: p.price
        };

        // Set modal content
        document.getElementById('modalTitle').textContent = p.title;
        document.getElementById('modalPrice').textContent = '₹' + p.price;
        document.getElementById('modalDesc').textContent = p.desc;

        // Setup swatches (colors)
        const s = document.getElementById('modalSwatches');
        s.innerHTML = '';
        p.colors.forEach((c, i) => {
            const d = document.createElement('div');
            d.className = 'swatch';
            d.style.background = c.code;
            d.title = c.code;

            d.onclick = () => {
                document.querySelectorAll('#modalSwatches .swatch').forEach(s => s.classList.remove('selected'));
                d.classList.add('selected');

                // 🖼️ NEW LOGIC: Start image rotation on color selection
                startImageRotation(c.img, modalImgElement);

                currentQuickOrder.color = c.code;
                updatePriceBasedOnSelection();
            };

            if (i === 0) {
                d.classList.add('selected');
                // 🖼️ NEW LOGIC: Start image rotation for the default color
                startImageRotation(c.img, modalImgElement);
            }
            s.appendChild(d);
        });

        // Setup sizes (unchanged)
        const sz = document.getElementById('modalSizes');
        sz.innerHTML = '';
        p.sizes.forEach((szv, i) => {
            const d = document.createElement('div');
            d.className = 'size';
            d.textContent = szv;
            d.style.cursor = 'pointer';

            d.onclick = () => {
                document.querySelectorAll('#modalSizes .size').forEach(x => {
                    x.style.borderColor = '#e6e9ef';
                    delete x.dataset.selected;
                });
                d.style.borderColor = 'black';
                d.dataset.selected = '1';
                currentQuickOrder.size = szv;
                updatePriceBasedOnSelection();
            };

            if (i === 0) {
                d.style.borderColor = 'black';
                d.dataset.selected = '1';
            }
            sz.appendChild(d);
        });

        // Quantity setup & listener for price update (unchanged)
        modalQty.value = 1;
        modalQty.min = 1;
        modalQty.oninput = () => updatePriceBasedOnSelection();

        modalBg.style.display = 'flex';
        addToCartModal.dataset.id = id;

        orderNowBtn.style.display = 'inline-block';
        addToCartModal.style.display = 'inline-block';
        orderNowForm.style.display = 'none';

        updatePriceBasedOnSelection(); // Initial calculation
    }

    // Function to reload the page (MODIFIED: Clears interval)
    function reloadPage() {
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }
        window.location.reload();
    }

    // Close modal & reset (MODIFIED: Clears interval)
    function closeModalReset() {
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }
        modalBg.style.display = 'none';
        resetOrderUI();
    }

    // Main modal close button will now RELOAD the page
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            reloadPage();
        });
    }

    // Add to cart button inside modal (unchanged logic)
    addToCartModal.onclick = function () {
        const id = +this.dataset.id;
        const qty = +modalQty.value || 1;
        const selectedSize = [...document.querySelectorAll('#modalSizes .size')].find(s => s.dataset.selected === '1');
        const selectedColor = [...document.querySelectorAll('#modalSwatches .swatch')].find(s => s.classList.contains('selected'));

        if (!selectedSize || !selectedColor) {
            alert('Please select both size and color.');
            return;
        }

        addToCart(id, qty, selectedSize.textContent, selectedColor.style.background);
        // After adding to cart, reload the page to refresh modal state
        reloadPage();
    };

    // Add to cart logic (unchanged)
    function addToCart(id, qty, size = null, color = null) {
        const p = productsData.find(x => x.id === id);
        if (!p) return;

        const exists = cart.find(c => c.id === id && c.size === size && c.color === color);
        if (exists) {
            exists.qty += qty;
        } else {
            cart.push({ id: p.id, title: p.title, price: p.price, qty: qty, size, color });
        }
        renderCart();
    }

    // Render cart items on sidebar/drawer (unchanged)
    function renderCart() {
        const el = document.getElementById('cartItems');
        el.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            el.innerHTML = '<p style="color:#777">Cart khali hai.</p>';
        } else {
            cart.forEach(item => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.marginTop = '8px';

                const metaParts = [];
                if (item.size) metaParts.push('Size: ' + item.size);
                if (item.color) metaParts.push('Color: ' + item.color);
                metaParts.push('Qty: ' + item.qty);

                row.innerHTML = `
                    <div>
                        <strong class="cart-item-title" data-id="${item.id}" style="cursor:pointer; color: black; text-decoration: none;">
                            ${item.title}
                        </strong><br>
                        <div class="meta">${metaParts.join(' • ')}</div>
                    </div>
                    <div>₹${item.price * item.qty}</div>
                `;

                el.appendChild(row);
                total += item.price * item.qty;
            });

            document.querySelectorAll('.cart-item-title').forEach(title => {
                title.onclick = () => {
                    const id = +title.dataset.id;
                    openModal(id);
                };
            });
        }

        document.getElementById('cartTotal').textContent = '₹' + total;

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
        }

        document.getElementById('cartCount').innerText = cart.length;

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Clear cart button functionality (unchanged)
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            localStorage.removeItem("cart");
            renderCart();

            alert('Cart has been cleared!');
        });
    }


    // Filtering and sorting products (unchanged)
    function applyFilters() {
        const q = document.getElementById('search').value.toLowerCase();
        const cats = Array.from(document.querySelectorAll('.cat:checked')).map(x => x.value);
        const sizes = Array.from(document.querySelectorAll('.sizeFilter:checked')).map(x => x.value);
        const pmin = Number(document.getElementById('minPrice').value) || 0;
        const pmax = Number(document.getElementById('maxPrice').value) || Infinity;

        let list = productsData.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            p.cat.toLowerCase().includes(q)
        );

        if (cats.length) list = list.filter(p => cats.includes(p.cat));
        if (sizes.length) list = list.filter(p => p.sizes.some(s => sizes.includes(s)));
        list = list.filter(p => p.price >= pmin && p.price <= pmax);

        const sort = document.getElementById('sort').value;
        if (sort === 'low') list.sort((a, b) => a.price - b.price);
        if (sort === 'high') list.sort((a, b) => b.price - a.price);

        renderProducts(list);
    }

    // Event listeners for filters & search (unchanged)
    document.getElementById('searchBtn').onclick = () => applyFilters();
    document.querySelectorAll('.cat, .sizeFilter').forEach(i => i.onchange = () => applyFilters());
    document.getElementById('applyPriceFilter').onclick = () => applyFilters();
    document.getElementById('sort').onchange = () => applyFilters();
    document.getElementById('search').addEventListener('input', () => applyFilters());

    // Initial render (unchanged)
    renderProducts(productsData);
    renderCart();

    // Escape key closes modal -> Reload page (MODIFIED: Clears interval)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBg.style.display === 'flex') {
            reloadPage();
        }
    });

    // Close cart drawer if clicked outside (unchanged)
    document.addEventListener('click', (e) => {
        const cd = document.getElementById('cartDrawer');
        const ob = document.getElementById('openCart');
        if (cd && ob && !cd.contains(e.target) && !ob.contains(e.target) && cd.style.display === 'block') {
            cd.style.display = 'none';
        }
    });

    // Open cart drawer (unchanged)
    document.getElementById('openCart').onclick = () => {
        const cd = document.getElementById('cartDrawer');
        if (cd) {
            cd.style.display = 'block';
            renderCart();
        }
    };

    // Checkout button click (unchanged)
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            document.getElementById('cartDrawer').style.display = 'none';
            const checkoutElement = document.getElementById('checkout');
            if (checkoutElement) {
                checkoutElement.style.display = 'block';
            } else {
                alert('No checkout page defined!');
            }
        };
    }

    // Order Now button click - show order form modal (unchanged)
    orderNowBtn.addEventListener('click', () => {
        const selectedSize = [...document.querySelectorAll('#modalSizes .size')].find(s => s.dataset.selected === '1');
        const selectedColor = [...document.querySelectorAll('#modalSwatches .swatch')].find(s => s.classList.contains('selected'));

        if (!selectedSize || !selectedColor) {
            alert('Please select both size and color before ordering.');
            return;
        }

        // Finalize order details before showing form
        currentQuickOrder.size = selectedSize.textContent;
        currentQuickOrder.color = selectedColor.style.background;
        currentQuickOrder.qty = +modalQty.value;
        currentQuickOrder.total = currentQuickOrder.qty * currentQuickOrder.price;

        // Update the display for the quantity and details inside the order form
        if (showqtyElement) {
            showqtyElement.innerHTML = `
                ${currentQuickOrder.qty} x ${currentQuickOrder.title} 
                <br>Size: ${currentQuickOrder.size} 
                <br>Color: <span style="display:inline-block;width:15px;height:15px;background:${currentQuickOrder.color};border:1px solid black;border-radius:10px;"></span>
                <br><strong>Total: ₹${currentQuickOrder.total}</strong>
            `;
        }

        // Show the order form modal, and hide the quickview buttons
        orderModal.style.display = 'flex';
        orderNowForm.style.display = 'block';
        addToCartModal.style.display = 'none';
        orderNowBtn.style.display = 'none';
    });

    // Handle order form submission -> Reload page (unchanged)
    quickOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderDetails = Object.fromEntries(formData.entries());

        let finalOrder = `
Order Placed:
Product: ${currentQuickOrder.title}
Size: ${currentQuickOrder.size}
Color: ${currentQuickOrder.color}
Quantity: ${currentQuickOrder.qty}
TOTAL: ₹${currentQuickOrder.total}

--- Customer Details ---
Name: ${orderDetails.fullname}
Mobile: ${orderDetails.mobile}
Email: ${orderDetails.email || 'N/A'}
Address: ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}
Payment: ${orderDetails.payment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
        `;

        alert(`Order placed successfully! ${finalOrder}`);

        // After successful order, RELOAD the page
        reloadPage();
    });

    // Close order modal when clicking outside the form -> Reload page (unchanged)
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            // When clicking outside the order form, RELOAD the page
            reloadPage();
        }
    });

    // Reset order form & modal UI (unchanged)
    function resetOrderUI() {
        orderNowForm.style.display = 'none';
        addToCartModal.style.display = 'inline-block';
        orderNowBtn.style.display = 'inline-block';
        quickOrderForm.reset();
        orderModal.style.display = 'none';
        currentQuickOrder = {};
    }

    // Populate state dropdown (unchanged)
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
        "West Bengal"
    ];

    const select = document.getElementById("states");
    if (select) {
        states.forEach(state => {
            let option = document.createElement("option");
            option.value = state.toLowerCase().replace(/\s+/g, "_");
            option.textContent = state;
            select.appendChild(option);
        });
    }

    // Populate city dropdown (unchanged)
    const cities = [
        "Agra", "Ahmedabad", "Bengaluru", "Bhopal", "Chennai",
        "Ghaziabad", "Hyderabad", "Indore", "Jaipur", "Kanpur",
        "Kolkata", "Ludhiana", "Lucknow", "Mumbai", "Nagpur",
        "Patna", "Pune", "Thane", "Vadodara", "Visakhapatnam"
    ];

    const citySelect = document.getElementById("city");
    if (citySelect) {
        cities.forEach(city => {
            let option = document.createElement("option");
            option.value = city.toLowerCase().replace(/\s+/g, "_");
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

});





