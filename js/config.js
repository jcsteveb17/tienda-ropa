// ===== WebRopa — Configuración Global =====
// 📋 Lee SETUP.md para instrucciones de configuración paso a paso.

const CONFIG = {
    // --- Supabase (ver SETUP.md sección 1) ---
    SUPABASE_URL: 'https://qvzccihanhyyjxmuaccw.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2emNjaWhhbmh5eWp4bXVhY2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDMwMTksImV4cCI6MjA5MDkxOTAxOX0.4y86LqjdLpamsvNmMwE1kXGddMWcLvGBfzwW6GqGkho',

    // --- URL base del sitio (terminar con /) ---
    // GitHub Pages: '/tienda-ropa/'   |   VPS con dominio propio: '/'
    SITE_BASE: '/tienda-ropa/',

    // --- WhatsApp (ver SETUP.md sección 2) ---
    WHATSAPP_PHONE: '593996109482',                        // ← Cambiar (ver SETUP.md)

    // --- Tienda (ver SETUP.md sección 3) ---
    STORE_NAME: 'ARCHIVE',                                  // ← Cambiar (ver SETUP.md)

    // --- Admin (ver SETUP.md sección 4) ---
    ADMIN_PASSWORD: 'admin123',                             // ← Cambiar (ver SETUP.md)

    // --- General ---
    CURRENCY: '$',

    // --- Categorías (mantener sincronizadas con los datos en Supabase) ---
    CATEGORIES: [
        { id: 'headwear', name: 'Cabeza/Gafas', nameEn: 'Headwear' },
        { id: 'outerwear', name: 'Abrigos/Tops', nameEn: 'Outerwear' },
        { id: 'bottoms', name: 'Pantalones', nameEn: 'Bottoms' },
        { id: 'footwear', name: 'Calzado', nameEn: 'Footwear' },
        { id: 'accessories', name: 'Bolsos/Extras', nameEn: 'Accessories' },
    ],

    // --- Opciones de condición ---
    CONDITIONS: ['Nuevo', 'Como Nuevo', 'Excelente', 'Bueno', 'Aceptable'],

    // --- Tallas disponibles ---
    SIZES: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'Único'],

    // --- Imágenes de respaldo por categoría (de Stitch design, Google-hosted) ---
    CATEGORY_IMAGES: {
        outerwear: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpDjZpyG5EVjoMa3-_wnF6X0nLkJobYKOAFN0MiXhbWuzY5cr6nh_ELqDXFKRMHkZJ5aeNuKjmmzRAxDy4pUXDW5rpZQTCVchdGuD1eIVfglBvu8xbk4m82ijvtE3uWU2EEJpusleMDcWLMX8kKI-5BSWXZ4nM99RqCj-oTV_BQzHgBkp8AbMB-fSCiwCvrSX07M2v-AsINtMl0EhWIkONbBB6d4o3f3lAhP6ZjrkcenzNeyRMjCHFUu67JgbJHxCL4RG4pyrLSIT',
        footwear: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oqY5lD_k0SP69WpjRc2pJGIgAS5igBrlbDOMwiT5N4JbC5VxaZ_ZjNlkskBPfaFnS9YvbsT_WmyKe5dNoDDMDcWp5aAzd01qpwzGKK75PCNBUQKLgNOyldyGgmoBnlizPzTnxsJH1deMN4uZ5gUv-kwz2G9LjhzYkElc_mGJQthueP4WACM42X65VOJCKaMnAfhKCi-8g-D-LDD_4TJ6u2UkgujGquStZFAmmdKMR6EBOJNpQQIWSo3dsZX6WtAGvehg7OmndCb_',
        accessories: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaf1yrKXjOgyUniuSbChyU96uPe--HMHRRLNnbd41LOahVauxxfjOlTjerkXyQjIhJfbNHsQygZTquZN5Fto26lVtY-cKNkru6oL9XUaXphxKHICTmCLwPfKifxYhKmjIR0HnEyRkU-niyEDJA8uyemu1PtzfvhGJqBn0wgd2DYr-1uReyTjF1CfCbW2ZFoQHci3mO_iKsMocJKPK7rApG36abFV1NiUvCzpuw1KjhEaz4hW-ILFJLAcpPV3Nz5edwWWrORrV8WHvH',
        bottoms: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQOxl445mFK2xhNyJgXDBLGfFvYCOvhuh5kGEPc2yC95ym9KEcs9d37PTqQBZYC4SMXzTMl3w0CMav2UJ2P_wPg9YjR10opO3e1L7YrltSKunbkm0z0DhNokvNh2e5sIdy96vbF2nNYWak1ppbEr8JqMuPkeMz6cB6g1JlC6J9bJiG80OWg7WEeOyTL5DysgXoLykUuOMvYL_aMWrJZH57qqgZ8g99TSGNlPAkpXrjr33gqRbsE-w00wHpQYAH1C_yEw7A1IbQqe9S',
    },

    // --- Imagen de respaldo genérica (placeholder) ---
    FALLBACK_IMAGE: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdywa98pm50A0Jf-6Kwc7G8HChBgKtfh5HtlnezijI1TxifvE7SotMFcCSubYiYUTScDMU4Zyf6tVrPCMaQr3d8xBE9SX0cjasGU_OxD4QIqayQyzJrwx7y9L3wCCkh8WIpbHFWZYytR9ZzwsRxz5_91ozJx_Ld5Po-MPUAdaSBX-AT86u_CqElkhSoZVN7QnQYwhjZubPh2J6O6u0D5Fbkt2IsmCp8r7kOAwCInm2J0pwmf39QCLDWpLkbPi24E3cPkXUjob8QCop',
};
