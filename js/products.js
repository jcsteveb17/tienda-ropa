// ===== WebRopa — Product Rendering Engine =====
// Requiere: supabase-client.js, cart.js, app.js, config.js

/* =====================================================
   TEMPLATES
   ===================================================== */

function createProductCard(product) {
    const isReserved  = product.status === 'reserved';
    const isSold      = product.status === 'sold';
    const isAvailable = product.status === 'available';
    const inCart      = typeof isInCart === 'function' && isInCart(product.id);

    const conditionLabel = product.condition || '';
    const sizeLabel      = product.size ? `• ${product.size}` : '';

    // Badge de condición (si existe)
    let conditionBadge = '';
    if (conditionLabel) {
        const bgClass = conditionLabel === 'Como Nuevo' || conditionLabel === 'Nuevo'
            ? 'bg-secondary-fixed text-on-secondary-fixed'
            : 'bg-white text-on-surface';
        conditionBadge = `
        <div class="absolute top-4 left-4 ${bgClass} px-3 py-1 text-[10px] font-headline font-black uppercase tracking-widest z-10">
            ${conditionLabel}
        </div>`;
    }

    // Overlay de status
    let statusOverlay = '';
    if (isReserved) {
        statusOverlay = `
        <div class="status-reserved-overlay">
            <span class="status-badge-text badge-reserved">Reservado</span>
        </div>`;
    } else if (isSold) {
        statusOverlay = `
        <div class="status-sold-overlay">
            <span class="status-badge-text badge-sold">Vendido</span>
        </div>`;
    }

    // Botón hover "Agregar" (solo si disponible)
    let hoverBtn = '';
    if (isAvailable && !inCart) {
        hoverBtn = `
        <div class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button
                onclick="event.preventDefault(); addToCart('${product.id}')"
                class="w-full py-3 bg-on-surface text-white font-headline text-xs font-bold uppercase tracking-widest hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors">
                Agregar al Carrito
            </button>
        </div>`;
    } else if (inCart) {
        hoverBtn = `
        <div class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <a href="cart.html"
               class="w-full py-3 bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-colors">
                Ver Carrito
            </a>
        </div>`;
    }

    const wrapperClass = !isAvailable ? 'group cursor-pointer product-unavailable' : 'group cursor-pointer';

    return `
    <div class="${wrapperClass}">
        <a href="product.html?id=${product.id}" class="block">
            <div class="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-4">
                ${statusOverlay}
                ${conditionBadge}
                <img
                    alt="${product.name}"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src="${product.image_url || CONFIG.FALLBACK_IMAGE}"
                    loading="lazy"
                    onerror="this.src='${CONFIG.FALLBACK_IMAGE}'"
                />
                ${hoverBtn}
            </div>
        </a>
        <div class="space-y-1">
            <div class="flex justify-between items-start">
                <h3 class="font-headline font-bold text-sm tracking-tight uppercase pr-2">${product.name}</h3>
                <span class="font-headline font-bold text-sm whitespace-nowrap">${CONFIG.CURRENCY}${parseFloat(product.price).toFixed(2)}</span>
            </div>
            <p class="text-xs text-on-surface-variant uppercase tracking-widest font-medium">
                ${conditionLabel} ${sizeLabel}
            </p>
        </div>
    </div>`;
}

function createProductSkeleton() {
    return `
    <div>
        <div class="aspect-[3/4] skeleton mb-4"></div>
        <div class="space-y-2" style="padding:0 0 0.25rem">
            <div class="skeleton h-4" style="width:75%;border-radius:0.125rem"></div>
            <div class="skeleton h-3" style="width:45%;border-radius:0.125rem"></div>
        </div>
    </div>`;
}

/* =====================================================
   RENDER DE GRID
   ===================================================== */

/**
 * Renderiza la grilla de productos en un contenedor.
 * @param {string} containerId
 * @param {Object} filters - { status, category, maxPrice, minPrice, search, limit, sortByPrice }
 */
async function renderProductGrid(containerId, filters = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Mostrar skeletons mientras carga
    container.innerHTML = Array(filters.limit || 8).fill(createProductSkeleton()).join('');

    const products = await fetchProducts(filters);

    if (products.length === 0) {
        container.innerHTML = `
        <div class="col-span-full empty-state">
            <div class="empty-state-icon">
                <span class="material-symbols-outlined" style="font-size:4rem;color:#acadad">inventory_2</span>
            </div>
            <p class="font-headline font-bold uppercase tracking-widest text-on-surface-variant text-sm">
                No hay productos disponibles
            </p>
            <p class="font-body text-sm text-on-surface-variant mt-2 opacity-60">
                ${filters.category ? 'No hay piezas en esta categoría por ahora.' : 'Vuelve pronto para ver nuevas piezas.'}
            </p>
        </div>`;
        return;
    }

    container.innerHTML = products.map(createProductCard).join('');

    // Actualizar conteo si hay un elemento con id "product-count"
    const countEl = document.getElementById('product-count');
    if (countEl) {
        countEl.textContent = `${products.length} ${products.length === 1 ? 'producto' : 'productos'}`;
    }
}

/* =====================================================
   FILTROS — Para shop.html
   ===================================================== */

// Estado de filtros activos
const _activeFilters = {
    category:   null,
    price:      null,
    condition:  null,
    search:     null,
    sortByPrice: null,
};

const PRICE_RANGES = {
    'menos-50':    { maxPrice: 50 },
    '50-100':      { minPrice: 50,  maxPrice: 100  },
    '100-200':     { minPrice: 100, maxPrice: 200  },
    'mas-200':     { minPrice: 200 },
};

function _buildFilters() {
    const f = {};
    if (_activeFilters.category)  f.category  = _activeFilters.category;
    if (_activeFilters.condition) f.condition  = _activeFilters.condition;
    if (_activeFilters.search)    f.search     = _activeFilters.search;
    if (_activeFilters.sortByPrice) f.sortByPrice = _activeFilters.sortByPrice;
    if (_activeFilters.price && PRICE_RANGES[_activeFilters.price]) {
        Object.assign(f, PRICE_RANGES[_activeFilters.price]);
    }
    return f;
}

async function _applyFilters() {
    await renderProductGrid('product-grid', _buildFilters());
}

function initFilters() {
    // Leer URL params al cargar (para links de categorías)
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) {
        _activeFilters.category = params.get('category');
        // Marcar botón activo
        const btn = document.querySelector(`[data-filter-category="${params.get('category')}"]`);
        if (btn) btn.classList.add('filter-btn-active');
        const label = document.getElementById('filter-category-label');
        if (label) {
            const cat = CONFIG.CATEGORIES.find(c => c.id === params.get('category'));
            if (cat) label.textContent = cat.name;
        }
    }
    if (params.get('search')) {
        _activeFilters.search = params.get('search');
        const input = document.getElementById('shop-search-inline');
        if (input) input.value = params.get('search');
    }

    // Dropdown — Categoría
    document.querySelectorAll('[data-filter-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.filterCategory;
            _activeFilters.category = (_activeFilters.category === val) ? null : val;
            // UI
            document.querySelectorAll('[data-filter-category]').forEach(b => b.classList.remove('filter-btn-active'));
            if (_activeFilters.category) {
                btn.classList.add('filter-btn-active');
                const label = document.getElementById('filter-category-label');
                const cat   = CONFIG.CATEGORIES.find(c => c.id === val);
                if (label && cat) label.textContent = cat.name;
            } else {
                const label = document.getElementById('filter-category-label');
                if (label) label.textContent = 'Categoría';
            }
            _closeAllDropdowns();
            _applyFilters();
        });
    });

    // Dropdown — Precio
    document.querySelectorAll('[data-filter-price]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.filterPrice;
            _activeFilters.price = (_activeFilters.price === val) ? null : val;
            document.querySelectorAll('[data-filter-price]').forEach(b => b.classList.remove('filter-btn-active'));
            if (_activeFilters.price) {
                btn.classList.add('filter-btn-active');
                const label = document.getElementById('filter-price-label');
                if (label) label.textContent = btn.textContent.trim();
            } else {
                const label = document.getElementById('filter-price-label');
                if (label) label.textContent = 'Precio';
            }
            _closeAllDropdowns();
            _applyFilters();
        });
    });

    // Dropdown — Condición
    document.querySelectorAll('[data-filter-condition]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.filterCondition;
            _activeFilters.condition = (_activeFilters.condition === val) ? null : val;
            document.querySelectorAll('[data-filter-condition]').forEach(b => b.classList.remove('filter-btn-active'));
            if (_activeFilters.condition) {
                btn.classList.add('filter-btn-active');
                const label = document.getElementById('filter-condition-label');
                if (label) label.textContent = val;
            } else {
                const label = document.getElementById('filter-condition-label');
                if (label) label.textContent = 'Condición';
            }
            _closeAllDropdowns();
            _applyFilters();
        });
    });

    // Dropdown — Ordenar
    document.querySelectorAll('[data-filter-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.filterSort;
            _activeFilters.sortByPrice = val === 'newest' ? null : val;
            document.querySelectorAll('[data-filter-sort]').forEach(b => b.classList.remove('filter-btn-active'));
            btn.classList.add('filter-btn-active');
            const label = document.getElementById('filter-sort-label');
            if (label) label.textContent = btn.textContent.trim();
            _closeAllDropdowns();
            _applyFilters();
        });
    });

    // Limpiar todos los filtros
    document.getElementById('btn-clear-filters')?.addEventListener('click', () => {
        _activeFilters.category   = null;
        _activeFilters.price      = null;
        _activeFilters.condition  = null;
        _activeFilters.search     = null;
        _activeFilters.sortByPrice = null;

        document.querySelectorAll('[data-filter-category],[data-filter-price],[data-filter-condition],[data-filter-sort]')
            .forEach(b => b.classList.remove('filter-btn-active'));

        const lblCat   = document.getElementById('filter-category-label');
        const lblPrice = document.getElementById('filter-price-label');
        const lblCond  = document.getElementById('filter-condition-label');
        const lblSort  = document.getElementById('filter-sort-label');
        if (lblCat)   lblCat.textContent   = 'Categoría';
        if (lblPrice) lblPrice.textContent  = 'Precio';
        if (lblCond)  lblCond.textContent   = 'Condición';
        if (lblSort)  lblSort.textContent   = 'Más Recientes';

        const searchInput = document.getElementById('shop-search-inline');
        if (searchInput) searchInput.value = '';

        _applyFilters();
    });

    // Búsqueda inline (shop.html tiene su propio input de búsqueda)
    let _searchDebounce = null;
    document.getElementById('shop-search-inline')?.addEventListener('input', e => {
        clearTimeout(_searchDebounce);
        _searchDebounce = setTimeout(() => {
            _activeFilters.search = e.target.value.trim() || null;
            _applyFilters();
        }, 400);
    });

    // Toggle de dropdowns
    document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const target = document.getElementById(btn.dataset.dropdownToggle);
            const isOpen = target?.classList.contains('open');
            _closeAllDropdowns();
            if (!isOpen) target?.classList.add('open');
        });
    });

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', _closeAllDropdowns);
}

function _closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown-menu.open').forEach(m => m.classList.remove('open'));
}
