// ===== WebRopa — Admin Panel =====
// Requiere: config.js, supabase-client.js, app.js, seed.js

const ADMIN_SESSION_KEY = 'webropa_admin';

/* =====================================================
   AUTENTICACIÓN
   ===================================================== */

function checkAdminAuth() {
    const isAuth = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    if (isAuth) {
        showAdminPanel();
    } else {
        showPasswordGate();
    }
}

function showPasswordGate() {
    document.getElementById('admin-gate').style.display    = 'flex';
    document.getElementById('admin-panel').style.display   = 'none';
    document.getElementById('admin-password').focus();
}

function showAdminPanel() {
    document.getElementById('admin-gate').style.display  = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    initAdminPanel();
}

function handleAdminLogin(e) {
    if (e) e.preventDefault();
    const input    = document.getElementById('admin-password');
    const errorEl  = document.getElementById('admin-gate-error');
    const password = input.value;

    if (password === CONFIG.ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        errorEl.classList.remove('show');
        showAdminPanel();
    } else {
        input.value = '';
        errorEl.classList.add('show');
        // Shake animation
        input.style.borderBottomColor = '#f95630';
        setTimeout(() => { input.style.borderBottomColor = ''; }, 1500);
        input.focus();
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.href = '/';
}

/* =====================================================
   INICIALIZACIÓN DEL PANEL
   ===================================================== */

let _editingProductId  = null;   // null = crear, UUID = editar
let _imageFile         = null;   // imagen principal (File)
let _imageDataUrl      = null;   // preview imagen principal
const MAX_EXTRA        = 4;
// Cada entrada: { file: File|null, url: string|null, dataUrl: string|null }
let _extraSlots        = [];     // array de objetos (máx 4)

function initAdminPanel() {
    // Poblar selects con CONFIG
    _populateSelect('form-category', CONFIG.CATEGORIES, c => ({ value: c.id, label: c.name }));
    _populateSelectOptions('form-condition', CONFIG.CONDITIONS);
    _populateSelectOptions('form-size',      CONFIG.SIZES);

    // Formulario
    document.getElementById('admin-product-form').addEventListener('submit', handleProductSubmit);

    // Cancelar edición
    document.getElementById('btn-cancel-edit')?.addEventListener('click', resetForm);

    // Drop zones
    initDropZone();
    initExtraImageSlots();

    // Seed
    document.getElementById('btn-seed')?.addEventListener('click', seedSampleProducts);

    // Cargar lista
    renderAdminProductList();
}

function _populateSelect(id, items, mapper) {
    const el = document.getElementById(id);
    if (!el) return;
    items.forEach(item => {
        const { value, label } = mapper(item);
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = label;
        el.appendChild(opt);
    });
}

function _populateSelectOptions(id, list) {
    const el = document.getElementById(id);
    if (!el) return;
    list.forEach(val => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = val;
        el.appendChild(opt);
    });
}

/* =====================================================
   DROP ZONE DE IMAGEN
   ===================================================== */

function initDropZone() {
    const zone    = document.getElementById('drop-zone');
    const fileIn  = document.getElementById('image-file-input');
    const preview = document.getElementById('image-preview');
    if (!zone || !fileIn) return;

    zone.addEventListener('click',  () => fileIn.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
    });
    fileIn.addEventListener('change', () => {
        if (fileIn.files[0]) handleImageFile(fileIn.files[0]);
    });
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('El archivo debe ser una imagen', 'error');
        return;
    }
    _imageFile = file;
    const reader = new FileReader();
    reader.onload = e => {
        _imageDataUrl = e.target.result;
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.src   = _imageDataUrl;
            preview.style.display = 'block';
        }
        const zoneText = document.getElementById('drop-zone-text');
        if (zoneText) zoneText.textContent = file.name;
    };
    reader.readAsDataURL(file);
}

/* =====================================================
   SLOTS DE FOTOS ADICIONALES
   ===================================================== */

function initExtraImageSlots() {
    renderExtraSlots();
    const fileIn = document.getElementById('extra-image-file-input');
    if (fileIn) {
        fileIn.addEventListener('change', () => {
            if (fileIn.files[0]) {
                handleExtraImageFile(fileIn.files[0], fileIn._targetSlotIndex);
                fileIn.value = '';
            }
        });
    }
}

function renderExtraSlots() {
    const grid = document.getElementById('extra-images-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 0; i < MAX_EXTRA; i++) {
        const slot = _extraSlots[i];
        const el = document.createElement('div');
        el.className = 'extra-img-slot' + (slot ? ' filled' : '');
        el.dataset.index = i;

        if (slot) {
            const img = document.createElement('img');
            img.src = slot.dataUrl || slot.url || '';
            img.alt = `Foto adicional ${i + 1}`;
            el.appendChild(img);

            const rmBtn = document.createElement('button');
            rmBtn.className = 'slot-remove';
            rmBtn.type = 'button';
            rmBtn.innerHTML = '&times;';
            rmBtn.title = 'Quitar imagen';
            rmBtn.addEventListener('click', e => {
                e.stopPropagation();
                _extraSlots.splice(i, 1);
                renderExtraSlots();
                updateExtraCounter();
            });
            el.appendChild(rmBtn);
        } else {
            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined slot-add-icon';
            icon.textContent = 'add_photo_alternate';
            el.appendChild(icon);

            el.addEventListener('click', () => {
                if (_extraSlots.length >= MAX_EXTRA) return;
                const fileIn = document.getElementById('extra-image-file-input');
                fileIn._targetSlotIndex = i;
                fileIn.click();
            });

            // Drag & drop en slot vacío
            el.addEventListener('dragover', e => { e.preventDefault(); el.style.borderColor = '#4e6300'; });
            el.addEventListener('dragleave', () => { el.style.borderColor = ''; });
            el.addEventListener('drop', e => {
                e.preventDefault();
                el.style.borderColor = '';
                if (e.dataTransfer.files[0] && _extraSlots.length < MAX_EXTRA) {
                    handleExtraImageFile(e.dataTransfer.files[0], i);
                }
            });
        }

        grid.appendChild(el);
    }
}

function updateExtraCounter() {
    const el = document.getElementById('extra-img-counter');
    if (el) el.textContent = `${_extraSlots.length} / ${MAX_EXTRA}`;
}

function handleExtraImageFile(file, slotIndex) {
    if (!file.type.startsWith('image/')) {
        showNotification('El archivo debe ser una imagen', 'error');
        return;
    }
    if (_extraSlots.length >= MAX_EXTRA) {
        showNotification(`Máximo ${MAX_EXTRA} fotos adicionales`, 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = e => {
        // Insertar en posición slotIndex o al final
        const entry = { file, url: null, dataUrl: e.target.result };
        if (slotIndex < _extraSlots.length) {
            _extraSlots[slotIndex] = entry;
        } else {
            _extraSlots.push(entry);
        }
        renderExtraSlots();
        updateExtraCounter();
    };
    reader.readAsDataURL(file);
}


/* =====================================================
   FORMULARIO — AGREGAR / EDITAR PRODUCTO
   ===================================================== */

async function handleProductSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btn-product-submit');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Guardando...';

    const name        = document.getElementById('form-name').value.trim();
    const price       = parseFloat(document.getElementById('form-price').value);
    const description = document.getElementById('form-description').value.trim();
    const category    = document.getElementById('form-category').value;
    const condition   = document.getElementById('form-condition').value;
    const size        = document.getElementById('form-size').value;
    const imageUrl    = document.getElementById('form-image-url').value.trim();

    if (!name || isNaN(price) || price <= 0) {
        showNotification('Nombre y precio son obligatorios', 'error');
        submitBtn.disabled    = false;
        submitBtn.textContent = _editingProductId ? 'Guardar Cambios' : 'Publicar Producto';
        return;
    }

    // Subir imagen principal si se seleccionó una
    let finalImageUrl = imageUrl;
    if (_imageFile) {
        showNotification('Subiendo imagen principal...', 'info');
        finalImageUrl = await uploadProductImage(_imageFile);
        if (!finalImageUrl) {
            showNotification('Error al subir imagen principal. Revisa el bucket en Supabase Storage.', 'error');
            submitBtn.disabled    = false;
            submitBtn.textContent = _editingProductId ? 'Guardar Cambios' : 'Publicar Producto';
            return;
        }
    }

    // Subir fotos adicionales (solo las que tienen File, conservar URLs existentes)
    const extraUrls = [];
    const slotsWithFiles = _extraSlots.filter(s => s.file);
    if (slotsWithFiles.length > 0) {
        showNotification(`Subiendo ${slotsWithFiles.length} foto(s) adicional(es)...`, 'info');
    }
    for (const slot of _extraSlots) {
        if (slot.file) {
            const url = await uploadProductImage(slot.file);
            if (url) extraUrls.push(url);
            else showNotification('Una foto adicional no pudo subirse', 'error');
        } else if (slot.url) {
            extraUrls.push(slot.url); // conservar URL existente al editar
        }
    }

    const productData = {
        name, price, description,
        image_url: finalImageUrl,
        category, condition, size,
        extra_images: extraUrls,
    };

    let result = false;
    if (_editingProductId) {
        const { error } = await db.from('products').update(productData).eq('id', _editingProductId);
        result = !error;
        if (!error) showNotification('Producto actualizado ✓', 'success');
        else showNotification('Error al actualizar: ' + error.message, 'error');
    } else {
        result = await insertProduct(productData);
        if (result) showNotification('Producto publicado ✓', 'success');
        else showNotification('Error al publicar. Revisa la consola del navegador (F12).', 'error');
    }

    submitBtn.disabled    = false;
    submitBtn.textContent = _editingProductId ? 'Guardar Cambios' : 'Publicar Producto';

    if (result) {
        resetForm();
        await renderAdminProductList();
    }
}

function resetForm() {
    _editingProductId = null;
    _imageFile        = null;
    _imageDataUrl     = null;
    _extraSlots       = [];

    document.getElementById('admin-product-form').reset();

    const preview = document.getElementById('image-preview');
    if (preview) preview.style.display = 'none';

    const zoneText = document.getElementById('drop-zone-text');
    if (zoneText) zoneText.textContent = 'Arrastra la foto principal aquí o haz clic';

    renderExtraSlots();
    updateExtraCounter();

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = 'Agregar Producto';

    const submitBtn = document.getElementById('btn-product-submit');
    if (submitBtn) submitBtn.textContent = 'Publicar Producto';

    const cancelBtn = document.getElementById('btn-cancel-edit');
    if (cancelBtn) cancelBtn.style.display = 'none';
}

async function startEditProduct(id) {
    const product = await fetchProductById(id);
    if (!product) return;

    _editingProductId = id;
    _imageFile        = null;
    _extraSlots       = [];

    document.getElementById('form-name').value        = product.name || '';
    document.getElementById('form-price').value       = product.price || '';
    document.getElementById('form-description').value = product.description || '';
    document.getElementById('form-category').value    = product.category || '';
    document.getElementById('form-condition').value   = product.condition || '';
    document.getElementById('form-size').value        = product.size || '';
    document.getElementById('form-image-url').value   = product.image_url || '';

    if (product.image_url) {
        const preview = document.getElementById('image-preview');
        if (preview) { preview.src = product.image_url; preview.style.display = 'block'; }
    }

    // Cargar fotos adicionales existentes
    const extras = Array.isArray(product.extra_images) ? product.extra_images : [];
    _extraSlots = extras.slice(0, MAX_EXTRA).map(url => ({ file: null, url, dataUrl: null }));
    renderExtraSlots();
    updateExtraCounter();

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = 'Editar Producto';

    const submitBtn = document.getElementById('btn-product-submit');
    if (submitBtn) submitBtn.textContent = 'Guardar Cambios';

    const cancelBtn = document.getElementById('btn-cancel-edit');
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';

    document.getElementById('admin-form-section').scrollIntoView({ behavior: 'smooth' });
}

/* =====================================================
   LISTA DE PRODUCTOS
   ===================================================== */

const STATUS_CONFIG = {
    available: { label: 'Disponible', dot: 'status-available', next: 'reserved',  nextLabel: 'Marcar Reservado' },
    reserved:  { label: 'Reservado',  dot: 'status-reserved',  next: 'available', nextLabel: 'Liberar',          altNext: 'sold', altLabel: 'Marcar Vendido' },
    sold:      { label: 'Vendido',    dot: 'status-sold',      next: 'available', nextLabel: 'Restaurar'         },
};

function createAdminProductRow(product) {
    const s    = STATUS_CONFIG[product.status] || STATUS_CONFIG.available;
    const code = product.id.slice(0,8).toUpperCase();
    const catName = (CONFIG.CATEGORIES.find(c => c.id === product.category) || {}).name || product.category;

    let statusActions = `
    <button
        onclick="handleStatusChange('${product.id}', '${s.next}')"
        class="font-label text-[10px] font-bold uppercase tracking-widest hover:text-secondary transition-colors">
        ${s.nextLabel}
    </button>`;

    if (s.altNext) {
        statusActions += `
        <button
            onclick="handleStatusChange('${product.id}', '${s.altNext}')"
            class="font-label text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors ml-3">
            ${s.altLabel}
        </button>`;
    }

    return `
    <div class="admin-product-row" id="admin-row-${product.id}">
        <img
            class="admin-product-thumb"
            src="${product.image_url || CONFIG.FALLBACK_IMAGE}"
            alt="${product.name}"
            onerror="this.src='${CONFIG.FALLBACK_IMAGE}'"
        />

        <div class="min-w-0">
            <p class="font-headline font-bold text-sm uppercase tracking-tight truncate">${product.name}</p>
            <p class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                ${catName} • Talla ${product.size || '—'} • $${parseFloat(product.price).toFixed(2)}
            </p>
            <p class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-0.5">
                ID: ${code} • ${product.condition}
            </p>
            <div class="flex items-center gap-1 mt-2">
                <span class="admin-status-dot ${s.dot}"></span>
                <span class="font-label text-[10px] font-bold uppercase tracking-widest">${s.label}</span>
            </div>
        </div>

        <div class="flex flex-col items-end gap-2">
            ${statusActions}
            <div class="flex gap-3 mt-1">
                <button
                    onclick="startEditProduct('${product.id}')"
                    class="font-label text-[10px] font-bold uppercase tracking-widest hover:text-secondary transition-colors">
                    Editar
                </button>
                <button
                    onclick="handleDeleteProduct('${product.id}', '${product.name.replace(/'/g,"\\'")}')"
                    class="font-label text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors">
                    Eliminar
                </button>
            </div>
        </div>
    </div>`;
}

async function renderAdminProductList() {
    const container = document.getElementById('admin-product-list');
    if (!container) return;

    container.innerHTML = '<p class="font-body text-sm text-on-surface-variant py-8">Cargando productos...</p>';

    const products = await fetchProducts({});
    const countEl  = document.getElementById('admin-product-count');

    if (products.length === 0) {
        container.innerHTML = `
        <div class="py-16 text-center">
            <p class="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">No hay productos todavía</p>
            <p class="font-body text-sm text-on-surface-variant/60 mt-2">Usa el formulario de la izquierda o carga los productos de ejemplo.</p>
        </div>`;
        if (countEl) countEl.textContent = '0 productos';
        return;
    }

    container.innerHTML = products.map(createAdminProductRow).join('');
    if (countEl) countEl.textContent = `${products.length} ${products.length === 1 ? 'producto' : 'productos'}`;
}

async function handleStatusChange(id, newStatus) {
    const row = document.getElementById('admin-row-' + id);
    if (row) row.style.opacity = '0.5';

    const ok = await updateProductStatus(id, newStatus);
    if (ok) {
        showNotification('Estado actualizado a: ' + (STATUS_CONFIG[newStatus]?.label || newStatus), 'success');
        await renderAdminProductList();
    } else {
        showNotification('Error al actualizar el estado', 'error');
        if (row) row.style.opacity = '1';
    }
}

async function handleDeleteProduct(id, name) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

    const row = document.getElementById('admin-row-' + id);
    if (row) row.style.opacity = '0.4';

    const ok = await deleteProduct(id);
    if (ok) {
        showNotification('Producto eliminado', 'info');
        await renderAdminProductList();
    } else {
        showNotification('Error al eliminar el producto', 'error');
        if (row) row.style.opacity = '1';
    }
}
