// ===== WebRopa — Outfit Builder Logic =====
// Requiere: supabase-client.js, cart.js, config.js

const OUTFIT_STORAGE_KEY = 'webropa_outfit_state';

// El estado local
let outfitState = {
    headwear: null,
    outerwear: null,
    bottoms: null,
    footwear: null,
    accessories: null // Extras como bolsos
};

// Carga inicial
function _loadOutfitState() {
    try {
        const stored = localStorage.getItem(OUTFIT_STORAGE_KEY);
        if (stored) {
            outfitState = JSON.parse(stored);
        }
    } catch(e) {
        console.error('Error loading outfit state', e);
    }
}

function _saveOutfitState() {
    localStorage.setItem(OUTFIT_STORAGE_KEY, JSON.stringify(outfitState));
    _renderCanvas();
}

/**
 * Añade o reemplaza un item en el canvas dependiendo de su categoría
 */
function addToOutfit(productStr) {
    const product = JSON.parse(decodeURIComponent(productStr));
    
    // Asignar al slot correcto
    if (product.category === 'headwear') outfitState.headwear = product;
    else if (product.category === 'outerwear') outfitState.outerwear = product;
    else if (product.category === 'bottoms') outfitState.bottoms = product;
    else if (product.category === 'footwear') outfitState.footwear = product;
    else if (product.category === 'accessories') outfitState.accessories = product;
    
    _saveOutfitState();
    
    showNotification('Añadido al lienzo', 'success');
}

/**
 * Remueve un item del outfit
 */
function removeFromOutfit(category) {
    if (outfitState[category] !== undefined) {
        outfitState[category] = null;
        _saveOutfitState();
    }
}

/**
 * Limpia el lienzo entero
 */
document.getElementById('btn-clear-outfit')?.addEventListener('click', () => {
    outfitState = { headwear: null, outerwear: null, bottoms: null, footwear: null, accessories: null };
    _saveOutfitState();
});

/**
 * Renderiza los recuadros del canvas basado en el estado
 */
function _renderCanvas() {
    let total = 0;
    
    const slots = [
        { cat: 'headwear', elId: 'slot-headwear', placeholderText: 'Cabeza/Rostro', icon: 'face' },
        { cat: 'outerwear', elId: 'slot-outerwear', placeholderText: 'Torso', icon: 'styler' },
        { cat: 'bottoms', elId: 'slot-bottoms', placeholderText: 'Piernas', icon: 'steps' },
        { cat: 'footwear', elId: 'slot-footwear', placeholderText: 'Pies', icon: 'directions_walk' },
        { cat: 'accessories', elId: 'slot-accessories', placeholderText: 'Bolso/Extra', icon: 'shopping_bag' }
    ];

    slots.forEach(slot => {
        const el = document.getElementById(slot.elId);
        if (!el) return;
        
        const item = outfitState[slot.cat];
        
        if (item) {
            total += parseFloat(item.price);
            el.classList.add('filled');
            el.innerHTML = `
                <img class="item-bg" src="${item.image_url || CONFIG.FALLBACK_IMAGE}" alt="${item.name}" />
                <div class="outfit-remove-btn" onclick="removeFromOutfit('${slot.cat}')">
                    <span class="material-symbols-outlined text-[14px]">close</span>
                </div>
            `;
        } else {
            el.classList.remove('filled');
            el.innerHTML = `
                <span class="slot-placeholder tracking-widest">
                    <span class="material-symbols-outlined block mb-1">${slot.icon}</span>
                    ${slot.placeholderText}
                </span>
            `;
        }
    });

    const totalEl = document.getElementById('outfit-total');
    if (totalEl) {
        totalEl.textContent = CONFIG.CURRENCY + total.toFixed(2);
    }
}


/* =====================================================
   Rendereo del Inventario Derecho
   ===================================================== */
let outfitActiveFilter = null;
let outfitSearchQuery = null;

async function renderOutfitInventory() {
    const container = document.getElementById('outfit-products-grid');
    if (!container) return;

    // Skeletons
    container.innerHTML = Array(6).fill(`
    <div>
        <div class="aspect-[3/4] skeleton mb-4"></div>
        <div class="space-y-2">
            <div class="skeleton h-4 w-3/4 rounded-sm"></div>
        </div>
    </div>`).join('');

    const filters = {};
    if (outfitActiveFilter && outfitActiveFilter !== 'all') filters.category = outfitActiveFilter;
    if (outfitSearchQuery) filters.search = outfitSearchQuery;
    filters.status = 'available'; // Solo mostrar lo disponible

    const products = await fetchProducts(filters);

    if (products.length === 0) {
        container.innerHTML = `
        <div class="col-span-full py-10 text-center opacity-50">
            <span class="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
            <p class="font-headline font-bold uppercase text-xs tracking-widest">No hay prendas disponibles aquí</p>
        </div>`;
        return;
    }

    container.innerHTML = products.map(p => {
        const productJson = encodeURIComponent(JSON.stringify(p));
        return `
        <div class="group cursor-pointer">
            <div class="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-3">
                <img src="${p.image_url || CONFIG.FALLBACK_IMAGE}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/>
                
                <!-- Hover action -->
                <div class="absolute bottom-0 left-0 w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                        onclick="addToOutfit('${productJson}')"
                        class="w-full py-2 bg-on-surface text-white font-headline text-[10px] font-bold uppercase tracking-widest hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors">
                        Añadir al Conjunto
                    </button>
                </div>
            </div>
            <div>
                <h3 class="font-headline font-bold text-xs uppercase truncate">${p.name}</h3>
                <span class="font-headline font-bold text-xs">${CONFIG.CURRENCY}${parseFloat(p.price).toFixed(2)}</span>
            </div>
        </div>
        `;
    }).join('');
}


// Eventos UI del inventario
document.querySelectorAll('.outfit-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Estilos
        document.querySelectorAll('.outfit-filter-btn').forEach(b => {
             b.classList.remove('bg-on-surface', 'text-white');
             b.classList.add('bg-white', 'text-on-surface');
        });
        e.target.classList.remove('bg-white', 'text-on-surface');
        e.target.classList.add('bg-on-surface', 'text-white');

        outfitActiveFilter = e.target.getAttribute('data-filter');
        renderOutfitInventory();
    });
});

let debounceOutfitSearch;
document.getElementById('outfit-search')?.addEventListener('input', (e) => {
    clearTimeout(debounceOutfitSearch);
    debounceOutfitSearch = setTimeout(() => {
        outfitSearchQuery = e.target.value.trim();
        renderOutfitInventory();
    }, 400);
});

// Botón de Comprar el Conjunto Completo
document.getElementById('btn-add-outfit')?.addEventListener('click', async () => {
    const items = [
        outfitState.headwear,
        outfitState.outerwear,
        outfitState.bottoms,
        outfitState.footwear,
        outfitState.accessories
    ].filter(i => i !== null);

    if (items.length === 0) {
        showNotification('Añade prendas al lienzo primero', 'error');
        return;
    }

    try {
        const btn = document.getElementById('btn-add-outfit');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-lg">sync</span>Añadiendo...';
        btn.disabled = true;

        for (const item of items) {
           await addToCart(item.id); 
        }
        
        updateCartBadge();
        showNotification('¡Conjunto añadido al carrito!', 'success');
        
        // Limpiamos la silueta después de la compra como sugerencia UX
         outfitState = { accessories: null, outerwear: null, bottoms: null, footwear: null };
        _saveOutfitState();

        setTimeout(() => {
           window.location.href = 'cart.html';
        }, 800);

    } catch (e) {
        console.error(e);
        showNotification('Hubo un error al añadir al carrito', 'error');
        document.getElementById('btn-add-outfit').disabled = false;
        document.getElementById('btn-add-outfit').innerHTML = '<span class="material-symbols-outlined text-lg">shopping_bag</span> Añadir todo al Carrito';
    }
});


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('outfit-canvas')) {
        _loadOutfitState();
        _renderCanvas();
        renderOutfitInventory();
    }
});
