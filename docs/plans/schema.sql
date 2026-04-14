-- ===== WebRopa — Supabase Database Schema =====
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → Run

-- Tabla de productos
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'general',
    condition TEXT DEFAULT 'Bueno',
    size TEXT DEFAULT 'M',
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas: cualquiera puede leer, insertar, actualizar y eliminar
-- (Para MVP. En producción con auth, restringir insert/update/delete a admins)
CREATE POLICY "Lectura pública" ON products
    FOR SELECT USING (true);

CREATE POLICY "Inserción pública" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Actualización pública" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Eliminación pública" ON products
    FOR DELETE USING (true);
