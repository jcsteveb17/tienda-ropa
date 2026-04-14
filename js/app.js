// ===== WebRopa — App Utilities (Shared) =====
// Cargado en TODAS las páginas.
// Requiere: config.js cargado primero.

/* =====================================================
   NOTIFICACIONES TOAST
   ===================================================== */
let _toastTimer = null;

function showNotification(message, type = 'info') {
    // Reutilizar o crear el toast
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.className = 'notification-toast';
        document.body.appendChild(toast);
    }

    // Limpiar timer anterior
    if (_toastTimer) clearTimeout(_toastTimer);
    toast.classList.remove('show', 'success', 'error', 'info');

    // Pequeño delay para permitir la transición de salida
    setTimeout(() => {
        toast.textContent = message;
        toast.classList.add('show', type);
        _toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }, 80);
}

/* =====================================================
   CARRITO — Badge
   ===================================================== */
function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge-count');
    const count  = typeof getCartCount === 'function' ? getCartCount() : 0;

    badges.forEach(badge => {
        if (count === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
            badge.textContent = count > 99 ? '99+' : count;
            // Animación bump
            badge.classList.remove('bump');
            void badge.offsetWidth; // reflow
            badge.classList.add('bump');
            setTimeout(() => badge.classList.remove('bump'), 300);
        }
    });
}

/* =====================================================
   NAVEGACIÓN — Nav & Footer HTML compartido
   ===================================================== */

/**
 * Devuelve el HTML de la barra de navegación.
 * @param {string} activePage - id de la página activa: 'inicio','tienda','categorias','nosotros','contacto'
 */
function getNavHTML(activePage = '') {
    const links = [
        { id: 'inicio',     label: 'Inicio',     href: '/'              },
        { id: 'tienda',     label: 'Tienda',      href: '/shop/'         },
        { id: 'outfit',     label: 'Arma tu Conjunto', href: '/outfit/'  },
        { id: 'categorias', label: 'Categorías',  href: '/categories/'   },
        { id: 'nosotros',   label: 'Nosotros',    href: '/about/'        },
        { id: 'contacto',   label: 'Contacto',    href: '/contact/'      },
    ];

    const navLinks = links.map(link => {
        const isActive = link.id === activePage;
        const cls = isActive
            ? 'font-headline tracking-tight font-medium uppercase text-xs text-zinc-900 border-b-2 border-[#4e6300] pb-1'
            : 'font-headline tracking-tight font-medium uppercase text-xs text-zinc-500 hover:text-zinc-900 transition-colors';
        return `<a class="${cls}" href="${link.href}">${link.label}</a>`;
    }).join('');

    return `
    <header class="bg-white/80 backdrop-blur-xl sticky top-0 w-full z-50 shadow-sm">
      <nav class="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        <!-- Logo -->
        <a href="/" class="text-2xl font-black tracking-tighter text-zinc-900 font-headline no-underline"
           id="nav-store-name">${CONFIG.STORE_NAME}</a>

        <!-- Desktop Links -->
        <div class="hidden md:flex gap-8 items-center">
          ${navLinks}
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-5">
          <!-- Search -->
          <button id="btn-search" class="hover:opacity-70 transition-opacity" aria-label="Buscar">
            <span class="material-symbols-outlined text-zinc-900">search</span>
          </button>

          <!-- Cart -->
          <a href="/cart/" class="cart-btn-wrapper hover:opacity-70 transition-opacity" aria-label="Carrito">
            <span class="material-symbols-outlined text-zinc-900">shopping_bag</span>
            <span class="cart-badge-count hidden" id="cart-count-badge">0</span>
          </a>

          <!-- Mobile hamburger -->
          <button id="btn-mobile-menu" class="md:hidden hover:opacity-70 transition-opacity" aria-label="Menú">
            <span class="material-symbols-outlined text-zinc-900">menu</span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Search Overlay -->
    <div id="search-overlay" class="search-overlay" role="dialog" aria-label="Buscar productos">
      <button id="btn-search-close" class="search-overlay-close" aria-label="Cerrar búsqueda">
        <span class="material-symbols-outlined text-zinc-900" style="font-size:2rem">close</span>
      </button>
      <div style="width:100%;max-width:700px;margin:0 auto">
        <input
          id="search-input"
          class="search-overlay-input"
          type="text"
          placeholder="Buscar piezas..."
          autocomplete="off"
        />
        <p class="font-body text-sm text-zinc-400 mt-4">Presiona Enter para buscar en la tienda</p>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="mobile-menu" role="dialog" aria-label="Menú de navegación">
      <button id="btn-mobile-close" class="mobile-menu-close" aria-label="Cerrar menú">
        <span class="material-symbols-outlined" style="font-size:2rem;color:#2d2f2f">close</span>
      </button>
      ${links.map(link => {
          const isActive = link.id === activePage;
          return `<a href="${link.href}" class="${isActive ? 'active' : ''}">${link.label}</a>`;
      }).join('')}
    </div>`;
}

/**
 * Devuelve el HTML del footer.
 */
function getFooterHTML() {
    return `
    <footer class="bg-[#f0f1f1] w-full pt-20 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        <!-- Brand -->
        <div class="space-y-6">
          <div class="text-lg font-bold tracking-widest text-zinc-800 font-headline">${CONFIG.STORE_NAME}</div>
          <p class="font-body text-sm leading-relaxed text-zinc-500">
            El destino premium para el archivista urbano.<br>Curando el pasado para dar estilo al futuro.
          </p>
          <div class="flex gap-4">
            <a href="https://wa.me/${CONFIG.WHATSAPP_PHONE}" target="_blank"
               class="w-8 h-8 rounded-full border border-[#acadad] flex items-center justify-center opacity-80 hover:opacity-100 hover:border-[#4e6300] transition-all"
               aria-label="WhatsApp">
              <span class="material-symbols-outlined" style="font-size:16px">chat</span>
            </a>
            <a href="mailto:hola@${CONFIG.STORE_NAME.toLowerCase()}.com"
               class="w-8 h-8 rounded-full border border-[#acadad] flex items-center justify-center opacity-80 hover:opacity-100 hover:border-[#4e6300] transition-all"
               aria-label="Email">
              <span class="material-symbols-outlined" style="font-size:16px">alternate_email</span>
            </a>
          </div>
        </div>

        <!-- Tienda -->
        <div class="space-y-6">
          <h4 class="font-headline font-black text-xs uppercase tracking-widest text-zinc-900">Tienda</h4>
          <ul class="space-y-3 font-body text-sm">
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/shop/">Todas las Piezas</a></li>
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/shop/">Nuevas Llegadas</a></li>
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/categories/">Categorías</a></li>
          </ul>
        </div>

        <!-- Soporte -->
        <div class="space-y-6">
          <h4 class="font-headline font-black text-xs uppercase tracking-widest text-zinc-900">Soporte</h4>
          <ul class="space-y-3 font-body text-sm">
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/contact/">Contacto</a></li>
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/about/">Sobre Nosotros</a></li>
            <li><a class="text-zinc-500 hover:text-[#4e6300] transition-colors" href="/about/">Reporte de Sostenibilidad</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="space-y-6">
          <h4 class="font-headline font-black text-xs uppercase tracking-widest text-zinc-900">Únete al Colectivo</h4>
          <p class="font-body text-sm text-zinc-500">Recibe novedades de nuevas piezas directamente.</p>
          <form class="relative" onsubmit="handleNewsletterSubmit(event)">
            <input
              class="w-full bg-transparent border-b-2 border-[rgba(172,173,173,0.3)] py-2 font-body text-sm focus:outline-none focus:border-[#4e6300] transition-colors"
              placeholder="Correo Electrónico"
              type="email"
              required
            />
            <button type="submit"
              class="absolute right-0 bottom-2 text-on-surface hover:text-[#4e6300] transition-colors uppercase font-headline font-black text-xs tracking-widest">
              Registrarse
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-20 border-t border-[rgba(172,173,173,0.1)] pt-10 px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <span class="font-body text-xs text-zinc-500">© ${new Date().getFullYear()} ${CONFIG.STORE_NAME}. TODOS LOS DERECHOS RESERVADOS.</span>
        <div class="flex gap-8">
          <span class="material-symbols-outlined opacity-50 text-2xl">payments</span>
          <span class="material-symbols-outlined opacity-50 text-2xl">credit_card</span>
          <span class="material-symbols-outlined opacity-50 text-2xl">local_shipping</span>
        </div>
      </div>
    </footer>`;
}

/* =====================================================
   INICIALIZACIÓN
   ===================================================== */

function handleNewsletterSubmit(e) {
    e.preventDefault();
    showNotification('¡Gracias por suscribirte!', 'success');
    e.target.reset();
}

function _initMobileMenu() {
    const btnOpen  = document.getElementById('btn-mobile-menu');
    const btnClose = document.getElementById('btn-mobile-close');
    const menu     = document.getElementById('mobile-menu');
    if (!menu) return;

    btnOpen?.addEventListener('click', () => menu.classList.add('open'));
    btnClose?.addEventListener('click', () => menu.classList.remove('open'));
    // Cerrar al hacer clic fuera
    menu.addEventListener('click', e => { if (e.target === menu) menu.classList.remove('open'); });
}

function _initSearch() {
    const btnOpen  = document.getElementById('btn-search');
    const btnClose = document.getElementById('btn-search-close');
    const overlay  = document.getElementById('search-overlay');
    const input    = document.getElementById('search-input');
    if (!overlay) return;

    btnOpen?.addEventListener('click', () => {
        overlay.classList.add('open');
        setTimeout(() => input?.focus(), 400);
    });
    btnClose?.addEventListener('click', () => overlay.classList.remove('open'));

    // Enter → ir a la tienda con búsqueda
    input?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) {
            window.location.href = `/shop/?search=${encodeURIComponent(input.value.trim())}`;
        }
        if (e.key === 'Escape') overlay.classList.remove('open');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    _initMobileMenu();
    _initSearch();
});
