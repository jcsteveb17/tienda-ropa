// ===== WebRopa — Supabase Client =====
// Requiere: config.js cargado primero.
// NOTA: Se usa nombre 'db' para evitar conflicto con window.supabase (el SDK)

const db = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/* =========================================
   PRODUCTOS — Lectura
   ========================================= */

async function fetchProducts(filters = {}) {
    let query = db.from('products').select('*');

    if (filters.status)    query = query.eq('status', filters.status);
    if (filters.category)  query = query.eq('category', filters.category);
    if (filters.minPrice)  query = query.gte('price', filters.minPrice);
    if (filters.maxPrice)  query = query.lte('price', filters.maxPrice);
    if (filters.condition) query = query.eq('condition', filters.condition);
    if (filters.search)    query = query.ilike('name', `%${filters.search}%`);
    if (filters.limit)     query = query.limit(filters.limit);

    if (filters.sortByPrice === 'asc')       query = query.order('price', { ascending: true });
    else if (filters.sortByPrice === 'desc') query = query.order('price', { ascending: false });
    else                                     query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
        console.error('[Supabase] fetchProducts:', error.message);
        return [];
    }
    return data || [];
}

async function fetchProductById(id) {
    const { data, error } = await db
        .from('products').select('*').eq('id', id).single();
    if (error) {
        console.error('[Supabase] fetchProductById:', error.message);
        return null;
    }
    return data;
}

async function fetchProductsByCategory(category, excludeId = null) {
    let query = db
        .from('products').select('*')
        .eq('category', category)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(4);
    if (excludeId) query = query.neq('id', excludeId);
    const { data, error } = await query;
    if (error) {
        console.error('[Supabase] fetchProductsByCategory:', error.message);
        return [];
    }
    return data || [];
}

async function countProductsByCategory(category) {
    const { count, error } = await db
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', category)
        .eq('status', 'available');
    if (error) {
        console.error('[Supabase] countProductsByCategory:', error.message);
        return 0;
    }
    return count || 0;
}

/* =========================================
   PRODUCTOS — Escritura
   ========================================= */

async function updateProductStatus(id, status) {
    const { error } = await db
        .from('products').update({ status }).eq('id', id);
    if (error) {
        console.error('[Supabase] updateProductStatus:', error.message);
        return false;
    }
    return true;
}

async function insertProduct(product) {
    const { data, error } = await db
        .from('products')
        .insert([{ ...product, status: 'available' }])
        .select()
        .single();
    if (error) {
        console.error('[Supabase] insertProduct:', error.message, error);
        return null;
    }
    return data;
}

async function deleteProduct(id) {
    const { error } = await db
        .from('products').delete().eq('id', id);
    if (error) {
        console.error('[Supabase] deleteProduct:', error.message);
        return false;
    }
    return true;
}

/* =========================================
   STORAGE — Imágenes
   ========================================= */

async function uploadProductImage(file) {
    const ext      = file.name.split('.').pop().toLowerCase();
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await db.storage
        .from('products')
        .upload(safeName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
        console.error('[Supabase Storage] uploadProductImage:', uploadError.message, uploadError);
        return null;
    }

    const { data } = db.storage.from('products').getPublicUrl(safeName);
    return data.publicUrl;
}
