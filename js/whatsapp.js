// ===== WebRopa — WhatsApp Integration =====
// Requiere: cart.js, config.js

/**
 * Construye el mensaje de WhatsApp con los productos del carrito.
 * @returns {string|null}
 */
function buildWhatsAppMessage() {
    const cart = getCart();
    if (cart.length === 0) return null;

    let msg = `Hola, me gustaría saber si tienen disponibles las siguientes prendas:\n\n`;

    cart.forEach(item => {
        const code = item.id.slice(0, 8).toUpperCase();
        msg += `• ${item.name} (Código: ${code}) — ${CONFIG.CURRENCY}${parseFloat(item.price).toFixed(2)}\n`;
    });

    const total = getCartTotal();
    msg += `\nTotal: ${CONFIG.CURRENCY}${total.toFixed(2)}`;
    msg += '\n\n¿Están todas disponibles?';

    return msg;
}

/**
 * Abre WhatsApp con el mensaje del carrito.
 */
function openWhatsApp() {
    const msg = buildWhatsAppMessage();
    if (!msg) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    const url = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Abre WhatsApp para consultar sobre un producto específico (desde la página de detalle).
 * @param {Object} product
 */
function openWhatsAppForProduct(product) {
    const code = product.id.slice(0, 8).toUpperCase();
    const msg  = `Hola, me interesa este producto:\n\n• ${product.name} (Código: ${code}) — ${CONFIG.CURRENCY}${parseFloat(product.price).toFixed(2)}\n\n¿Está disponible?`;
    const url  = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}
