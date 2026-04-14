// ===== WebRopa — Cart System =====
// Gestiona el carrito en localStorage y sincroniza el status con Supabase.
// Requiere: supabase-client.js, app.js

const CART_KEY = 'webropa_cart';

/* =====================================================
   LECTURA DEL CARRITO
   ===================================================== */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function getCartCount() {
    return getCart().length;
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
}

function isInCart(productId) {
    return getCart().some(item => item.id === productId);
}

/* =====================================================
   ESCRITURA DEL CARRITO
   ===================================================== */

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

/* =====================================================
   AGREGAR AL CARRITO
   ===================================================== */

async function addToCart(productId) {
    // Ya está en el carrito
    if (isInCart(productId)) {
        showNotification('Este producto ya está en tu carrito', 'info');
        return false;
    }

    // Obtener datos del producto
    const product = await fetchProductById(productId);
    if (!product) {
        showNotification('No se pudo obtener el producto', 'error');
        return false;
    }

    // Verificar disponibilidad (no dejar agregar si ya está vendido o reservado)
    if (product.status !== 'available') {
        showNotification(
            product.status === 'reserved' ? 'Este producto está reservado' : 'Este producto ya fue vendido',
            'error'
        );
        return false;
    }

    // Agregar al localStorage
    const cart = getCart();
    cart.push({
        id:        product.id,
        name:      product.name,
        price:     product.price,
        image_url: product.image_url || CONFIG.FALLBACK_IMAGE,
        category:  product.category,
        size:      product.size,
        added_at:  new Date().toISOString(),
    });
    saveCart(cart);

    showNotification('Producto agregado al carrito', 'success');

    // No reservamos automáticamente, solo informamos a la UI si fuera necesario
    _updateAddToCartButton(productId, 'available');
    return true;
}

/* =====================================================
   QUITAR DEL CARRITO
   ===================================================== */

async function removeFromCart(productId) {
    const cart    = getCart();
    const existed = cart.some(item => item.id === productId);
    if (!existed) return false;

    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);

    showNotification('Producto eliminado del carrito', 'info');
    _updateAddToCartButton(productId, 'available');
    return true;
}

/* =====================================================
   VACIAR CARRITO
   ===================================================== */

async function clearCart() {
    saveCart([]);
    showNotification('Carrito vaciado', 'info');
}

/* =====================================================
   HELPERS DE UI
   ===================================================== */

/** Actualiza el estado visual del botón "Agregar al carrito" si existe en la página */
function _updateAddToCartButton(productId, status) {
    const btn = document.querySelector(`[data-cart-btn="${productId}"]`);
    if (!btn) return;

    if (status === 'reserved' || status === 'sold') {
        btn.disabled    = true;
        btn.textContent = status === 'reserved' ? 'Reservado' : 'Vendido';
        btn.classList.remove('bg-secondary-fixed', 'text-on-secondary-fixed');
        btn.classList.add('bg-surface-container', 'text-on-surface-variant', 'cursor-not-allowed');
    } else {
        btn.disabled    = false;
        btn.textContent = 'Agregar al Carrito';
        btn.classList.add('bg-secondary-fixed', 'text-on-secondary-fixed');
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant', 'cursor-not-allowed');
    }
}
