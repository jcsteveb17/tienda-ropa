// ===== WebRopa — Supabase Client =====
// Todas las operaciones de base de datos pasan por este módulo.
// Requiere: config.js cargado primero.

// Inicializar cliente de Supabase
const _supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/* =========================================
   PRODUCTOS — Operaciones de lectura
   ========================================= */

/**
 * Obtener todos los productos con filtros opcionales.
 * @param {Object} filters - { status, category, maxPrice, minPrice, search, limit }
 */
async function fetchProducts(filters = {}) {
    let query = _supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters.status)      query = query.eq('status', filters.status);
    if (filters.category)    query = query.eq('category', filters.category);
    if (filters.minPrice)    query = query.gte('price', filters.minPrice);
    if (filters.maxPrice)    query = query.lte('price', filters.maxPrice);
    if (filters.condition)   query = query.eq('condition', filters.condition);
    if (filters.search)      query = query.ilike('name', `%${filters.search}%`);
    if (filters.limit)       query = query.limit(filters.limit);
    if (filters.sortByPrice === 'asc')  query = query.order('price', { ascending: true });
    if (filters.sortByPrice === 'desc') query = query.order('price', { ascending: false });

    const { data, error } = await query;
    if (error) {
        console.error('[Supabase] Error al obtener productos:', error.message);
        return [];
    }
    return data;
}

/**
 * Obtener un producto por su ID (UUID).
 * @param {string} id
 */
async function fetchProductById(id) {
    const { data, error } = await _supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('[Supabase] Error al obtener producto:', error.message);
        return null;
    }
    return data;
}

/**
 * Obtener productos de la misma categoría (para "Relacionados").
 * @param {string} category
 * @param {string} excludeId - ID del producto actual (excluirlo)
 */
async function fetchProductsByCategory(category, excludeId = null) {
    let query = _supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(4);

    if (excludeId) query = query.neq('id', excludeId);

    const { data, error } = await query;
    if (error) {
        console.error('[Supabase] Error al obtener productos por categoría:', error.message);
        return [];
    }
    return data;
}

/**
 * Contar productos disponibles por categoría.
 * @param {string} category
 */
async function countProductsByCategory(category) {
    const { count, error } = await _supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('status', 'available');

    if (error) {
        console.error('[Supabase] Error al contar productos:', error.message);
        return 0;
    }
    return count || 0;
}

/* =========================================
   PRODUCTOS — Operaciones de escritura
   ========================================= */

/**
 * Actualizar el status de un producto.
 * @param {string} id
 * @param {'available'|'reserved'|'sold'} status
 */
async function updateProductStatus(id, status) {
    const { error } = await _supabase
        .from('products')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('[Supabase] Error al actualizar status:', error.message);
        return false;
    }
    return true;
}

/**
 * Insertar un nuevo producto.
 * @param {Object} product - { name, price, description, image_url, category, condition, size }
 */
async function insertProduct(product) {
    const { data, error } = await _supabase
        .from('products')
        .insert([{ ...product, status: 'available' }])
        .select()
        .single();

    if (error) {
        console.error('[Supabase] Error al insertar producto:', error.message);
        return null;
    }
    return data;
}

/**
 * Eliminar un producto por ID.
 * @param {string} id
 */
async function deleteProduct(id) {
    const { error } = await _supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[Supabase] Error al eliminar producto:', error.message);
        return false;
    }
    return true;
}

/* =========================================
   STORAGE — Imágenes
   ========================================= */

/**
 * Subir una imagen al bucket "products" de Supabase Storage.
 * @param {File} file
 * @returns {string|null} URL pública de la imagen
 */
async function uploadProductImage(file) {
    const ext      = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await _supabase.storage
        .from('products')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
        console.error('[Supabase Storage] Error al subir imagen:', uploadError.message);
        return null;
    }

    const { data } = _supabase.storage
        .from('products')
        .getPublicUrl(fileName);

    return data.publicUrl;
}
