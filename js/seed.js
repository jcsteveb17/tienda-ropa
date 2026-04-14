// ===== WebRopa — Productos de Ejemplo (Seed) =====
// Usado por el panel de administración para cargar datos iniciales.
// Requiere: supabase-client.js cargado primero.

const SEED_PRODUCTS = [
    // --- Abrigos (Outerwear) ---
    {
        name: 'Chaqueta Vintage de Cuero',
        price: 120.00,
        description: 'Chaqueta de cuero genuino estilo vintage de los años 80. Corte oversized con hombreras sutiles. Perfecto estado interior, desgaste natural en el cuero que le da carácter único.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdywa98pm50A0Jf-6Kwc7G8HChBgKtfh5HtlnezijI1TxifvE7SotMFcCSubYiYUTScDMU4Zyf6tVrPCMaQr3d8xBE9SX0cjasGU_OxD4QIqayQyzJrwx7y9L3wCCkh8WIpbHFWZYytR9ZzwsRxz5_91ozJx_Ld5Po-MPUAdaSBX-AT86u_CqElkhSoZVN7QnQYwhjZubPh2J6O6u0D5Fbkt2IsmCp8r7kOAwCInm2J0pwmf39QCLDWpLkbPi24E3cPkXUjob8QCop',
        category: 'outerwear',
        condition: 'Excelente',
        size: 'M',
    },
    {
        name: 'Abrigo Largo de Lana',
        price: 95.00,
        description: 'Abrigo de lana merino color camel, largo hasta las rodillas. Corte clásico con solapas anchas. Forro de seda interior. Procedencia europea, colección otoño.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBpDjZpyG5EVjoMa3-_wnF6X0nLkJobYKOAFN0MiXhbWuzY5cr6nh_ELqDXFKRMHkZJ5aeNuKjmmzRAxDy4pUXDW5rpZQTCVchdGuD1eIVfglBvu8xbk4m82ijvtE3uWU2EEJpusleMDcWLMX8kKI-5BSWXZ4nM99RqCj-oTV_BQzHgBkp8AbMB-fSCiwCvrSX07M2v-AsINtMl0EhWIkONbBB6d4o3f3lAhP6ZjrkcenzNeyRMjCHFUu67JgbJHxCL4RG4pyrLSIT',
        category: 'outerwear',
        condition: 'Bueno',
        size: 'L',
    },
    // --- Calzado (Footwear) ---
    {
        name: 'Zapatillas Retro Runner',
        price: 65.00,
        description: 'Zapatillas de running retro en blanco y azul navy. Suela de goma original en perfecto estado. Plantillas reemplazadas. Un clásico atemporal del streetwear.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2oqY5lD_k0SP69WpjRc2pJGIgAS5igBrlbDOMwiT5N4JbC5VxaZ_ZjNlkskBPfaFnS9YvbsT_WmyKe5dNoDDMDcWp5aAzd01qpwzGKK75PCNBUQKLgNOyldyGgmoBnlizPzTnxsJH1deMN4uZ5gUv-kwz2G9LjhzYkElc_mGJQthueP4WACM42X65VOJCKaMnAfhKCi-8g-D-LDD_4TJ6u2UkgujGquStZFAmmdKMR6EBOJNpQQIWSo3dsZX6WtAGvehg7OmndCb_',
        category: 'footwear',
        condition: 'Como Nuevo',
        size: '42',
    },
    {
        name: 'Botas Chelsea Clásicas',
        price: 85.00,
        description: 'Botas Chelsea de cuero negro genuino con elásticos laterales camel. Suela de cuero. Ligero desgaste en los tacones, muy poca vida de uso. Estilo clásico atemporal.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoYFCXrYZhdcAp86W2cjI-GXIg9QlyyuoyeOBmJlzMdz7bHNw4gSjLY3MsblOBugozjmlvC_V8hywUse8icbH5DA2-SzjPUlPr0JISk1Ytj_A8xmULD0rmdoK1HrgdLzaNHctOJibKgiZWH_dgHH_sJHKeZVIxmFtd82g_sEiHSg8EXwWEt87QqMld3SuT9pQb0R-ClmOK_a7b6nBlMGkEjnKsmcxOnS5L1CdjioOmjxikdhUd4dXUWw7OVdquPsHEVip7fPQ9U3YW',
        category: 'footwear',
        condition: 'Excelente',
        size: '40',
    },
    // --- Accesorios (Accessories) ---
    {
        name: 'Bolso Bandolera de Cuero',
        price: 45.00,
        description: 'Bolso bandolera de cuero vacuno en color cognac. Cierre magnético, bolsillo interior con cremallera, correa ajustable. Capacidad perfecta para el día a día.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaf1yrKXjOgyUniuSbChyU96uPe--HMHRRLNnbd41LOahVauxxfjOlTjerkXyQjIhJfbNHsQygZTquZN5Fto26lVtY-cKNkru6oL9XUaXphxKHICTmCLwPfKifxYhKmjIR0HnEyRkU-niyEDJA8uyemu1PtzfvhGJqBn0wgd2DYr-1uReyTjF1CfCbW2ZFoQHci3mO_iKsMocJKPK7rApG36abFV1NiUvCzpuw1KjhEaz4hW-ILFJLAcpPV3Nz5edwWWrORrV8WHvH',
        category: 'accessories',
        condition: 'Bueno',
        size: 'Único',
    },
    {
        name: 'Gafas de Sol Vintage Ovaladas',
        price: 30.00,
        description: 'Gafas de sol de montura metálica dorada con lentes ámbar. Estilo 70s. Sin rasguños en las lentes. Incluye funda original de tela.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBonpcVVwwFMNx6Xn9Oahxu3acycHrHzl08YtQoKo7geI7wn5TwBA20uITamrPhjXNzsDBKL3_MxhZj07foZ94D0MVhdTTIDmtmTajRrL8jJROxcVKk3w1H8hCfrhvGTe0JJFLIPla7Amtk2zXY7e_7noeEChF_-V9Y_maBterLCrAwnanMD9VNOD3eQIA6n5eDahIPXtu00avPIWWjgBNL0AmQ18bf9xZOny7N9QsQ2kswK4wLxDidv4qN4RXwUmtg5V5oRc8NV79w',
        category: 'accessories',
        condition: 'Como Nuevo',
        size: 'Único',
    },
    // --- Pantalones (Bottoms) ---
    {
        name: "Jeans Levi's 501 Vintage",
        price: 55.00,
        description: "Jeans Levi's 501 originales de los años 90. Lavado claro con desgaste natural en rodillas. Tiro alto, corte recto. Auténtico denim americano con historia.",
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQOxl445mFK2xhNyJgXDBLGfFvYCOvhuh5kGEPc2yC95ym9KEcs9d37PTqQBZYC4SMXzTMl3w0CMav2UJ2P_wPg9YjR10opO3e1L7YrltSKunbkm0z0DhNokvNh2e5sIdy96vbF2nNYWak1ppbEr8JqMuPkeMz6cB6g1JlC6J9bJiG80OWg7WEeOyTL5DysgXoLykUuOMvYL_aMWrJZH57qqgZ8g99TSGNlPAkpXrjr33gqRbsE-w00wHpQYAH1C_yEw7A1IbQqe9S',
        category: 'bottoms',
        condition: 'Excelente',
        size: '32',
    },
    {
        name: 'Pantalón Cargo Militar Vintage',
        price: 40.00,
        description: 'Pantalón cargo de tela ripstop verde oliva militar. Múltiples bolsillos laterales con velcro. Cintura ajustable con cordón. Edición vintage con parches de época.',
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApUOKbJ4HhJU0-3bH2ioF-ernS3WyZ4kEv9tYJiiKur3ShvW2WbL4_U5CovFZ7J8d76Fc1XU2FcS3QjcAtx-1SlVAJaQ9N4ZEr0_vh7pd5xRS39dR_Nom-lI9K3KPdivYVjs8UsvDjHtXDsGIdCbJgPm7VdorxehocWvMPogS75JI4CD2_o14i-zJX2kgYVzRP4eFTRFOosrnTYIE0SPTS5lHb9RgkZCDORb4GJPfMRPkAVJNwOQve6Zdbwfx6vxr9-IrvUbh9Rh5O',
        category: 'bottoms',
        condition: 'Bueno',
        size: 'L',
    },
];

/**
 * Insertar los 8 productos de ejemplo en Supabase.
 * Muestra notificación de progreso y resultado.
 */
async function seedSampleProducts() {
    if (!confirm('¿Cargar 8 productos de ejemplo? Esto insertará datos en tu base de datos.')) return;

    showNotification('Cargando productos de ejemplo...', 'info');
    let count = 0;

    for (const product of SEED_PRODUCTS) {
        const result = await insertProduct(product);
        if (result) count++;
    }

    if (count === SEED_PRODUCTS.length) {
        showNotification(`✓ ${count} productos de ejemplo cargados`, 'success');
    } else {
        showNotification(`${count}/${SEED_PRODUCTS.length} productos cargados`, 'info');
    }

    // Refrescar la lista de admin si existe
    if (typeof renderAdminProductList === 'function') {
        await renderAdminProductList();
    }
}
