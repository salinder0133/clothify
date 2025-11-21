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
    const closeModalButton = document.getElementById('closeModal');
    const modalImgElement = document.getElementById('modalImg');

    // 🖼️ NEW ELEMENT REFERENCES FOR GALLERY
    const modalImagePreviewer = document.getElementById('modal-image-previewer');

    // 🛒 NEW ELEMENT REFERENCE FOR CHECKOUT
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Variable to hold the product details selected in the modal for a Quick Order
    let currentQuickOrder = {};

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
                { code: 'lightblue', img: ['photos/women/jacket-blue.jpg', 'photos/women/jacket-blue1.jpg'] }
            ],
            img: 'photos/women/Jacket-blue.jpg',
            desc: 'Denim jacket with soft lining.'
        },
        {
            id: 3,
            title: 'Casual Polo Tee',
            price: 599,
            cat: 'Men',
            sizes: ['M', 'L', 'XL'],
            colors: [
                { code: 'Red', img: ['photos/men/polo-red.jpg', 'photos/men/polo-red1.jpg'] },
                { code: 'green', img: ['photos/men/polo-green.jpg', 'photos/men/polo-green1.jpg'] },
                { code: 'Blue', img: ['photos/men/polo-teal.jpg', 'photos/men/polo-teal1.jpg'] }
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
                { code: 'orange', img: ['photos/women/dress-orange.jpg', 'photos/women/dress-orange1.jpg'] },
                { code: 'pink', img: ['photos/women/dress-pink.jpg', 'photos/women/dress-pink1.jpg'] }
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
                { code: 'yellow', img: ['photos/kide/shorts-yellow.jpg', 'photos/kide/shorts-yellow1.jpg'] },
                { code: 'blue', img: ['photos/kide/shorts-blue.jpg', 'photos/kide/shorts-blue1.jpg'] }
            ],
            img: 'photos/kids/shorts-yellow.jpg',
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
        },
        {
            id: 8,
            title: 'High-Waist Black Jeans',
            price: 1899,
            cat: 'Women',
            sizes: ['S', 'M', 'L'],
            colors: [
                { code: 'Black', img: ['photos/women/jeans-black.jpg', 'photos/women/jeans-black-detail.jpg'] },
                { code: 'Grey', img: ['photos/women/jeans-grey.jpg', 'photos/women/jeans-grey1.jpg'] }
            ],
            img: 'photos/women/jeans-black.jpg',
            desc: 'Stretchable denim with a comfortable high-waist fit. A wardrobe essential.'
        },
        {
            id: 9,
            title: 'Kids Rainbow Dress',
            price: 749,
            cat: 'Kids',
            sizes: ['S', 'M', 'L'],
            colors: [
                { code: '#FFC0CB', img: ['photos/kide/dress-rainbow.jpg', 'photos/kide/dress-rainbow-detail.jpg'] },
                { code: '#F08080', img: ['photos/kide/dress-pink.jpg', 'photos/kide/dress-pink-side.jpg'] }
            ],
            img: 'photos/kide/dress-rainbow.jpg',
            desc: 'Flowy summer dress with light, breathable inner lining.'
        },
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 🖼️ Function to handle the image rotation logic
    function startImageRotation(imageArray, imgElement) {
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }

        const images = Array.isArray(imageArray) ? imageArray : [imageArray];

        if (images.length < 2) {
            imgElement.src = images[0] || '';
            return;
        }

        let currentIndex = 0;
        imgElement.src = images[currentIndex];

        imageCycleInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imgElement.src = images[currentIndex];
        }, 2000);
    }
    // -------------------------------------------------------

    // 🖼️ Function that renders the thumbnail gallery
    function renderImageGallery(imageArray, mainImgElement) {
        modalImagePreviewer.innerHTML = '';

        imageArray.forEach((imageUrl, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrl;
            thumbnail.alt = `Product view ${index + 1}`;
            thumbnail.className = 'thumbnail';

            if (index === 0) {
                thumbnail.classList.add('active');
            }

            thumbnail.addEventListener('click', (e) => {
                if (imageCycleInterval) {
                    clearInterval(imageCycleInterval);
                }

                mainImgElement.src = imageUrl;

                document.querySelectorAll('#modal-image-previewer .thumbnail').forEach(img => {
                    img.classList.remove('active');
                });
                e.target.classList.add('active');
            });

            modalImagePreviewer.appendChild(thumbnail);
        });

        if (imageArray.length > 0) {
            mainImgElement.src = imageArray[0];
        }
    }
    // -------------------------------------------------------


    // Function to calculate and update total price
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

        const selectedSize = [...document.querySelectorAll('#modalSizes .size')].find(s => s.dataset.selected === '1');
        const selectedColor = [...document.querySelectorAll('#modalSwatches .swatch')].find(s => s.classList.contains('selected'));

        currentQuickOrder.qty = qty;
        currentQuickOrder.total = total;
        currentQuickOrder.size = selectedSize ? selectedSize.textContent : null;
        currentQuickOrder.color = selectedColor ? selectedColor.style.background : null;

        if (showqtyElement && orderModal.style.display === 'flex' && currentQuickOrder.title) {
            showqtyElement.innerHTML = `
                ${currentQuickOrder.qty} x ${currentQuickOrder.title} 
                <br>Size: ${currentQuickOrder.size} 
                <br>Color: <span style="display:inline-block;width:12px;height:12px;background:${currentQuickOrder.color};border:1px solid #ccc;border-radius:2px;"></span>
                <br><strong>Total: ₹${currentQuickOrder.total}</strong>
            `;
        }
    }

    // Render all products on page
    function renderProducts(list) {
        const el = document.getElementById('products');
        el.innerHTML = '';
        document.getElementById('count').textContent = list.length;

        list.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.dataset.id = p.id;

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

    // Add event listeners to product buttons & cards
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

    // Open product modal and setup selections
    function openModal(id) {
        const p = productsData.find(x => x.id === id);
        if (!p) return;

        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }

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

        modalImagePreviewer.innerHTML = '';


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

                startImageRotation(c.img, modalImgElement);
                renderImageGallery(c.img, modalImgElement);

                currentQuickOrder.color = c.code;
                updatePriceBasedOnSelection();
            };

            if (i === 0) {
                d.classList.add('selected');
                startImageRotation(c.img, modalImgElement);
                renderImageGallery(c.img, modalImgElement);
            }
            s.appendChild(d);
        });

        // Setup sizes
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

        // Quantity setup & listener for price update
        modalQty.value = 1;
        modalQty.min = 1;
        modalQty.oninput = () => updatePriceBasedOnSelection();

        modalBg.style.display = 'flex';
        addToCartModal.dataset.id = id;

        orderNowBtn.style.display = 'inline-block';
        addToCartModal.style.display = 'inline-block';
        orderNowForm.style.display = 'none';

        updatePriceBasedOnSelection();
    }

    // Function to reload the page
    function reloadPage() {
        if (imageCycleInterval) {
            clearInterval(imageCycleInterval);
        }
        window.location.reload();
    }

    // Close modal & reset
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

    // Add to cart button inside modal
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
        reloadPage();
    };

    // Add to cart logic
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

    // Render cart items on sidebar/drawer
    function renderCart() {
        const el = document.getElementById('cartItems');
        el.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            el.innerHTML = '<p style="color:#777">"The cart is empty." 🛒.</p>';
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

        // 🛒 Checkout Button Logic
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
            checkoutBtn.style.backgroundColor = cart.length > 0 ? 'var(--accent)' : '#ccc';
        }
        // -----------------------

        document.getElementById('cartCount').innerText = cart.length;

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Clear cart button functionality
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            localStorage.removeItem("cart");
            renderCart();

            alert('Cart has been cleared!');
        });
    }


    // Filtering and sorting products
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

    // Event listeners for filters & search
    document.getElementById('searchBtn').onclick = () => applyFilters();
    document.querySelectorAll('.cat, .sizeFilter').forEach(i => i.onchange = () => applyFilters());
    document.getElementById('applyPriceFilter').onclick = () => applyFilters();
    document.getElementById('sort').onchange = () => applyFilters();
    document.getElementById('search').addEventListener('input', () => applyFilters());

    // Initial render
    renderProducts(productsData);
    renderCart();

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBg.style.display === 'flex') {
            reloadPage();
        }
    });

    // Close cart drawer if clicked outside
    document.addEventListener('click', (e) => {
        const cd = document.getElementById('cartDrawer');
        const ob = document.getElementById('openCart');
        if (cd && ob && !cd.contains(e.target) && !ob.contains(e.target) && cd.style.display === 'block') {
            cd.style.display = 'none';
        }
    });

    // Open cart drawer
    document.getElementById('openCart').onclick = () => {
        const cd = document.getElementById('cartDrawer');
        if (cd) {
            cd.style.display = 'block';
            renderCart();
        }
    };

    // 🛒 NEW FUNCTION: Opens the Order Form directly from the Cart Drawer
    function openCartCheckoutForm() {
        if (cart.length === 0) return;

        // 1. Calculate combined total and summary text
        let total = 0;
        let summaryHtml = '';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            let colorDisplay = item.color;

            summaryHtml += `
                <p style="margin: 5px 0; font-size: 14px;">
                    ${index + 1}. <strong>${item.title}</strong>
                    (Qty: ${item.qty}, Size: ${item.size})
                    <br>
                    <span style="display:inline-block; margin-left: 15px;">
                        Color: 
                        <span style="
                            display: inline-block;
                            width: 18px; /* Size increased slightly for better visibility */
                            height: 18px;
                            background: ${colorDisplay}; 
                            border: 1px solid #aaa;
                            border-radius: 10px; /* 👈 UPDATED BORDER-RADIUS TO 10px (for roundness) */
                            vertical-align: middle;
                        "></span> 
                        (${colorDisplay}) 
                    </span>
                    — Subtotal: ₹${itemTotal}
                </p>
            `;
        });

        // 2. Hide cart drawer and show the order modal/form
        document.getElementById('cartDrawer').style.display = 'none';

        // Use ModalBG to display the form
        document.getElementById('modalBg').style.display = 'flex';
        orderModal.style.display = 'flex';
        orderNowForm.style.display = 'block';

        // Hide Add to Cart/Order Now buttons 
        addToCartModal.style.display = 'none';
        orderNowBtn.style.display = 'none';

        // 3. Populate the order form details (`#showqty`)
        if (showqtyElement) {
            showqtyElement.innerHTML = `
                <h4 style="margin-bottom: 5px;">Items to be Ordered:</h4>
                <div style="border: 1px solid #eee; padding: 10px; border-radius: 6px; max-height: 150px; overflow-y: auto;">
                    ${summaryHtml}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                <strong>GRAND TOTAL: ₹${total}</strong>
            `;
        }

        // Store total for order form submission reference
        currentQuickOrder = { cartCheckout: true, total: total };
    }

    // 🛒 Checkout button click (NEW LOGIC)
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            openCartCheckoutForm();
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

        // Finalize order details before showing form (Single Item Logic)
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

    // Handle order form submission 
    quickOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderDetails = Object.fromEntries(formData.entries());

        let finalOrderText = "";
        let finalTotal = currentQuickOrder.total;

        if (currentQuickOrder.cartCheckout) {
            // Logic for multi-item cart checkout
            let cartItemsDetail = cart.map(item =>
                `Item: ${item.title} (Size: ${item.size}, Qty: ${item.qty}, Price: ${item.price * item.qty})`
            ).join('\n');

            finalOrderText = `
Order Placed (CART CHECKOUT):
Total Items: ${cart.length}
TOTAL: ₹${finalTotal}

--- Items ---
${cartItemsDetail}
            `;
            // Clear cart after successful submission
            cart = [];
            localStorage.removeItem("cart");

        } else {
            // Logic for single item 'Order Now'
            finalOrderText = `
Order Placed (SINGLE ITEM):
Product: ${currentQuickOrder.title}
Size: ${currentQuickOrder.size}
Color: ${currentQuickOrder.color}
Quantity: ${currentQuickOrder.qty}
TOTAL: ₹${currentQuickOrder.total}
            `;
        }

        let customerDetails = `
--- Customer Details ---
Name: ${orderDetails.fullname}
Mobile: ${orderDetails.mobile}
Email: ${orderDetails.email || 'N/A'}
Address: ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}
Payment: ${orderDetails.payment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
        `;

        alert(`Order placed successfully! ${finalOrderText}\n${customerDetails}`);

        // After successful order, RELOAD the page
        reloadPage();
    });

    // Close order modal when clicking outside the form
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            reloadPage();
        }
    });

    // Reset order form & modal UI
    function resetOrderUI() {
        orderNowForm.style.display = 'none';
        addToCartModal.style.display = 'inline-block';
        orderNowBtn.style.display = 'inline-block';
        quickOrderForm.reset();
        orderModal.style.display = 'none';
        currentQuickOrder = {};
    }

    // Populate state dropdown 
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

    // Populate city dropdown
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
