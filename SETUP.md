# 🛠️ WebRopa — Guía de Configuración

Antes de publicar tu tienda, debes configurar estas 4 cosas en el archivo `js/config.js`.

---

## 1. 🗄️ Supabase (Base de Datos e Imágenes)

### Paso 1 — Crear proyecto en Supabase:
1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige una región cercana)
3. Espera a que se inicialice (1-2 minutos)
4. Ve a **Settings → API** y copia:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon / public key** → una cadena larga que empieza con `eyJ...`

### Paso 2 — Configurar en el código:
Abre `js/config.js` y reemplaza en las líneas 4 y 5:
```js
SUPABASE_URL: 'https://TU_PROYECTO.supabase.co',    // ← Línea 4
SUPABASE_ANON_KEY: 'TU_ANON_KEY_AQUI',              // ← Línea 5
```

### Paso 3 — Crear la tabla de productos:
1. En Supabase Dashboard → **SQL Editor**
2. Copia y pega el contenido del archivo `docs/plans/schema.sql`
3. Haz clic en **Run**

### Paso 4 — Crear bucket de imágenes:
1. Supabase Dashboard → **Storage**
2. Clic en **New bucket**
3. Nombre: `products`
4. Marcar como **Public bucket** ✅
5. Clic en **Create bucket**
6. Ir a **Policies** del bucket → **Add policy** → **For full customization** → Allow all operations for anon

---

## 2. 📱 WhatsApp

Abre `js/config.js` y reemplaza en la línea 6:
```js
WHATSAPP_PHONE: '573001234567',    // ← Línea 6
```

**Formato:** código de país + número, **sin `+`**, sin espacios, sin guiones.
- Colombia: `573001234567`
- México: `5215551234567`
- España: `34612345678`

---

## 3. 🏪 Nombre de la Tienda

Abre `js/config.js` y reemplaza en la línea 7:
```js
STORE_NAME: 'ARCHIVE',    // ← Línea 7
```

Este nombre aparece en:
- Logo de la navegación superior
- Footer
- Títulos de cada página (pestaña del navegador)
- Meta tags SEO

---

## 4. 🔒 Contraseña del Panel Admin

Abre `js/config.js` y reemplaza en la línea 8:
```js
ADMIN_PASSWORD: 'admin123',    // ← Línea 8
```

> ⚠️ **IMPORTANTE:** Cambia esta contraseña antes de publicar tu sitio.
> Elige una contraseña segura que solo tú conozcas.

El panel de administración está disponible en:
```
tudominio.com/pages/admin.html
```
Esta página **NO aparece** en ningún menú ni enlace de la tienda.
Solo tú sabes que existe — así que guarda bien la URL y la contraseña.

---

## 5. 🚀 Publicar en Netlify (recomendado, gratis)

1. Ve a https://netlify.com y crea una cuenta
2. Arrastra la carpeta `WebRopa` completa al área de deploy
3. ¡Listo! Tu tienda quedará en una URL como `https://tunombre.netlify.app`

**O con GitHub:**
1. Sube el proyecto a un repositorio en GitHub
2. En Netlify → **New site from Git** → conecta el repo
3. Build command: (dejar vacío)
4. Publish directory: `.` (punto, la raíz)

---

## ✅ Lista de verificación rápida

- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_ANON_KEY` configurado
- [ ] Tabla `products` creada en Supabase (via `schema.sql`)
- [ ] Bucket `products` creado y público en Supabase Storage
- [ ] `WHATSAPP_PHONE` configurado con tu número real
- [ ] `STORE_NAME` cambiado al nombre de tu tienda
- [ ] `ADMIN_PASSWORD` cambiado a una contraseña segura
- [ ] Sitio publicado y funcionando
