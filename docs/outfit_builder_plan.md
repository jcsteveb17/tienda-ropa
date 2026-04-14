# Plan de Implementación: Correcciones y "Outfit Builder"

Este plan documenta las acciones necesarias para corregir posibles errores de traducción en el frontend y para desarrollar la nueva funcionalidad "The Outfit Builder" que solicitaste.

## FASE 1: Corrección de Textos y Frontend

1. **Revisión profunda del Frontend:** 
   - Revisaré todo el texto estático en archivos HTML (`index.html`, `shop.html`, `cart.html`, `about.html`, `contact.html`).
   - Mapearé los términos que puedan parecer fuera de lugar o en otro idioma, corrigiéndolos a un español neutral.
   - *Nota:* En primera vista encontré la gran mayoría del sitio en español correcto, así que te pediré en mi respuesta que me orientes sobre dónde viste las palabras incorrectas si el problema persiste.

## FASE 2: Desarrollo de "The Outfit Builder"

### 1. Modelo Funcional: "Arma tu Conjunto"
Crearemos un espacio interactivo ("lienzos" o siluetas) enfocado en construir **un solo outfit a la vez**. Las prendas seleccionadas se asignarán automáticamente a una sección específica del cuerpo dependiendo de la categoría del producto:
- **Cabeza y Accesorios:** Categoría `accessories`
- **Torso:** Categoría `outerwear` (y partes superiores)
- **Piernas:** Categoría `bottoms`
- **Pies:** Categoría `footwear`

**¿Qué pasa si escogen 2 prendas de la misma categoría (ej. 2 abrigos)?** 
La silueta representa el cuerpo del usuario. Al seleccionar un segundo abrigo, este *reemplazará* automáticamente al abrigo anterior en el slot del "Torso". Así siempre habrá un conjunto limpio y coherente sin que se amontonen las prendas, manteniendo el diseño de la silueta intacto.

### 2. Estructura de la Interfaz (Frontend)
No utilizaremos un modelo 3D complejo, sino una representación modular de contenedores abstractos y atractivos que encajen en el diseño actual.
- **Página Dedicada:** Añadiremos una página nueva `outfit.html` accesible a través del menú de navegación superior.
- **El Lienzo (Canvas) del Outfit:** Contará con 4 bloques principales visuales apilados simulando un maniquí base. Al seleccionar un objeto de la lista en la tienda lateral, este rellenará el recuadro que le corresponde con la imagen del producto.
- **Interacción:** El usuario podrá ir visualizando cómo combinan las prendas, reemplazando un accesorio o previsualizando los conjuntos.

### 3. Lógica del "Outfit Builder" (Javascript y Base de Datos)
- **Base de Datos (Supabase):** El catálogo de prendas de esta sección seguirá conectándose de forma normal a tu base de datos (como el resto de la tienda) para mostrar siempre inventario real y actualizado. Todo el inventario se jala directamente de la base.
- **LocalStorage:** Utilizaremos `localStorage` **solo para el "estado temporal" de la pinta**. Es decir, actúa como la memoria del navegador para recordar qué 4 prendas tiene puestas el maniquí actualmente. De este modo, si el usuario recarga la página por accidente, no perderá el outfit que llevaba construyendo.
- Crearemos `js/outfit.js` para manejar reemplazar los ítems en su debida silueta y evitar conflictos (como los de intentar ponerse dos pantalones).

### 4. Integración al Carrito (Checkout)
- Incluiremos un botón de "Añadir Pinta al Carrito" que tomará los artículos que arman la pinta cargada y los pasará todos a la vez al carrito normal para realizar la compra vía WhatsApp.

---

### Siguiente paso
Por favor, asegúrate de que el plan para el Outfit Builder esté alineado con la idea que visualizas. Si estás de acuerdo, podemos empezar inmediatamente con la implementación a código.
