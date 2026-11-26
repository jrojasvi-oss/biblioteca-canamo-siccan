(function () {
  "use strict";

  var products = [
    { id: "aceite-cbd-10", name: "Aceite CBD 10%", format: "Gotero ámbar · 30 ml", category: "aceite", rx: true, price: 189000, image: "assets/products/oil.webp", profile: "CBD 100 mg/ml · THC < 0,2%", summary: "Espectro amplio en aceite de MCT. Cada gota entrega una concentración medida por lote.", lot: "Lote CM-A10-2611" },
    { id: "aceite-balanceado-11", name: "Aceite balanceado 1:1", format: "Dos goteros · 2 x 15 ml", category: "aceite", rx: true, price: 239000, image: "assets/products/balanced.webp", profile: "CBD 25 mg/ml · THC 25 mg/ml", summary: "Proporción equilibrada de CBD y THC para tratamientos que tu médico ajusta por gotas.", lot: "Lote CM-B11-2611" },
    { id: "capsulas-cbd-25", name: "Cápsulas CBD 25 mg", format: "Frasco · 30 cápsulas blandas", category: "capsula", rx: true, price: 165000, image: "assets/products/caps.webp", profile: "CBD 25 mg por cápsula · THC < 0,2%", summary: "Dosis fija sin medir gotas. Útil cuando la pauta médica pide precisión diaria.", lot: "Lote CM-C25-2610" },
    { id: "flor-estandarizada", name: "Flor medicinal estandarizada", format: "Frasco de vidrio · 10 g", category: "flor", rx: true, price: 210000, image: "assets/products/flower.webp", profile: "THC 18% · CBD 1% · mirceno dominante", summary: "Flor seca de cultivo licenciado, para vaporización según indicación médica.", lot: "Lote CM-F18-2609" },
    { id: "crema-cbd-500", name: "Crema tópica CBD", format: "Tarro airless · 50 g", category: "topico", rx: false, price: 98000, image: "assets/products/cream.webp", profile: "CBD 500 mg · sin THC", summary: "Textura ligera de rápida absorción para masaje localizado. Uso externo.", lot: "Lote CM-T50-2611" },
    { id: "balsamo-cbd", name: "Bálsamo CBD y manzanilla", format: "Lata · 30 g", category: "topico", rx: false, price: 72000, image: "assets/products/balm.webp", profile: "CBD 300 mg · manzanilla · caléndula", summary: "Bálsamo denso con extractos botánicos para piel seca y zonas de tensión.", lot: "Lote CM-T30-2610" }
  ];
  var categoryLabels = { aceite: "Aceites", capsula: "Cápsulas", flor: "Flor", topico: "Tópicos" };
  var FREE_FROM = 250000, SHIP = 12000;
  var cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  function money(n) { return cop.format(n); }
  function byId(id) { for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; }

  // Almacenamiento tolerante a fallos
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
  var cart = load("cmd_cart", []);
  function cartCount() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function setQty(id, qty) {
    var found = cart.filter(function (l) { return l.id === id; })[0];
    if (qty <= 0) cart = cart.filter(function (l) { return l.id !== id; });
    else if (found) found.qty = Math.min(10, qty);
    else cart.push({ id: id, qty: Math.min(10, qty) });
    save("cmd_cart", cart);
    var c = document.querySelector(".site-nav__count"); if (c) c.textContent = cartCount();
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  function nav(overlay) {
    return '<header class="site-nav' + (overlay ? " site-nav--overlay" : "") + '">' +
      '<a href="#/" class="site-nav__brand" aria-label="Cannamed, inicio"><img src="assets/brand/mark-cream.svg" alt="" width="34" height="34"><span>Cannamed</span></a>' +
      '<nav class="site-nav__links" aria-label="Principal">' +
      '<a href="#/catalogo" data-nav="catalogo">Catálogo</a><a href="#/certificacion" data-nav="certificacion">Certificación médica</a><a href="#/registro" data-nav="registro">Mi cuenta</a></nav>' +
      '<div class="site-nav__right"><a href="#/carrito" class="site-nav__cart" aria-label="Carrito"><img src="assets/icons/i8.png" alt="" width="26" height="26"><span class="site-nav__count">' + cartCount() + '</span></a>' +
      '<details class="site-nav__menu"><summary aria-label="Abrir menú">Menú</summary><div class="site-nav__sheet"><a href="#/catalogo">Catálogo</a><a href="#/certificacion">Certificación médica</a><a href="#/registro">Mi cuenta</a><a href="#/carrito">Carrito</a></div></details></div></header>';
  }

  function footer() {
    return '<footer class="site-footer"><div class="site-footer__top"><div class="site-footer__brand"><img src="assets/icons/i1.png" alt="" width="40" height="40"><p>Cannamed. Cannabis medicinal con fórmula, trazabilidad y ciencia.</p></div>' +
      '<nav class="site-footer__links" aria-label="Pie de página"><a href="#/catalogo">Catálogo</a><a href="#/certificacion">Certificación médica</a><a href="#/registro">Crear cuenta</a></nav></div>' +
      '<p class="site-footer__legal">Venta exclusiva a personas mayores de 18 años. Los aceites, cápsulas y flor con cannabinoides se dispensan únicamente con prescripción médica vigente, conforme a la Ley 1787 de 2016 y el Decreto 811 de 2021. Los productos tópicos son de uso externo. Esta información no reemplaza la consulta médica. Mantener fuera del alcance de niños.</p></footer>';
  }

  var ctaCatalog = '<a href="#/catalogo" class="cta-catalog"><span>Ver catálogo</span><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
  var ctaRx = '<a href="#/certificacion" class="cta-rx"><img src="assets/icons/i4.png" alt="" width="22" height="22"><span>Validar fórmula</span></a>';
  var ctaRegister = '<a href="#/registro" class="cta-register"><img src="assets/brand/mark.svg" alt="" width="30" height="30"><span>Crear cuenta</span></a>';

  var chapters = [
    { label: "Planta", title: "Cannabis medicinal, con fórmula.", body: "Productos estandarizados y trazables, dispensados solo con prescripción médica válida en Colombia.", actions: '<div class="hero-actions">' + ctaCatalog + ctaRx + "</div>" },
    { label: "Flor", align: "right", title: "Cada lote nace en cultivo licenciado.", body: "Genética registrada, cultivo bajo buenas prácticas y cosecha con trazabilidad de la semilla al frasco.", tags: ["Cultivo licenciado", "Trazabilidad por lote"] },
    { label: "Tricoma", title: "La medicina vive en el tricoma.", body: "Ahí se concentran CBD, THC y terpenos. Los medimos lote por lote antes de que algo llegue a tus manos.", tags: ["Certificado de análisis", "Cromatografía"] },
    { label: "Gota", align: "right", title: "Una dosis exacta en cada gota.", body: "Tu médico define la concentración. Nosotros garantizamos que el frasco diga la verdad.", actions: '<div class="hero-actions">' + ctaRegister + "</div>" }
  ];

  var steps = [
    ["assets/icons/i5.png", "Crea tu cuenta", "Datos de paciente verificados y protegidos."],
    ["assets/icons/i4.png", "Valida tu fórmula", "Sube tu prescripción o pide una evaluación médica."],
    ["assets/icons/i2.png", "Elige tu tratamiento", "Concentraciones claras, lote y análisis visibles."],
    ["assets/icons/i8.png", "Recíbelo en casa", "Empaque discreto, sin marcas exteriores."]
  ];
  var faqs = [
    ["¿Necesito fórmula médica para comprar?", "Sí para aceites, cápsulas y flor. Los tópicos de CBD sin THC se pueden comprar sin fórmula siendo mayor de edad."],
    ["¿Qué debe tener mi fórmula?", "Tu nombre y documento, el producto o principio activo con su concentración, la dosis, la fecha, y la firma y registro del médico."],
    ["¿Quién revisa mi fórmula?", "El equipo farmacéutico de Cannamed la valida antes de habilitar los productos con prescripción en tu cuenta."],
    ["¿Cómo puedo pagar?", "PSE, tarjeta débito o crédito y Nequi, a través de una pasarela de pagos certificada."],
    ["¿Es legal en Colombia?", "El uso medicinal del cannabis está regulado por la Ley 1787 de 2016 y el Decreto 811 de 2021. Solo vendemos productos de uso médico a mayores de edad."]
  ];

  function viewHome() {
    var ch = chapters.map(function (c, i) {
      var Tag = i === 0 ? "h1" : "h2";
      var tags = c.tags ? '<ul class="chapter__tags">' + c.tags.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" : "";
      return '<article class="chapter" data-align="' + (c.align || "left") + '"><div class="chapter__copy"><' + Tag + ' class="chapter__title">' + c.title + "</" + Tag + '><p class="chapter__body">' + c.body + "</p>" + tags + (c.actions || "") + "</div></article>";
    }).join("");
    var dots = chapters.map(function (c, i) { return '<button type="button" data-dot="' + i + '"><span>' + c.label + "</span></button>"; }).join("");
    var featured = products[0];
    var rest = products.slice(1, 5).map(function (p) {
      return '<a href="#/catalogo" class="teaser-card"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy"><div class="teaser-card__info"><h3>' + p.name + '</h3><p class="mono teaser-card__price">' + money(p.price) + "</p></div></a>";
    }).join("");
    return nav(true) +
      '<main><section class="journey" id="journey"><div class="journey__stage"><img src="assets/world/film.jpg" alt="" class="journey__poster"><video muted playsinline preload="auto" poster="assets/world/film.jpg" aria-hidden="true"></video><span class="journey__progress"></span></div>' +
      '<div class="journey__chapters">' + ch + '</div><nav class="journey__dots" aria-label="Capítulos">' + dots + "</nav></section>" +
      '<section class="process" aria-labelledby="process-title"><h2 id="process-title" class="section-title">Tu tratamiento en cuatro pasos</h2><ol class="process__line">' +
      steps.map(function (s, i) { return '<li class="process__step"><div class="process__node"><img src="' + s[0] + '" alt="" width="56" height="56"><span class="process__index">0' + (i + 1) + "</span></div><h3>" + s[1] + "</h3><p>" + s[2] + "</p></li>"; }).join("") + "</ol></section>" +
      '<section class="rx-split" aria-labelledby="rx-title"><figure class="rx-split__media"><img src="assets/plates/herbarium.webp" alt="Hoja de cannabis en papel de herbario junto a un estetoscopio" loading="lazy"></figure><div class="rx-split__copy"><h2 id="rx-title" class="section-title">Certificación médica sin filas</h2><p class="lead">Sube tu fórmula desde el celular. Si aún no la tienes, solicita una evaluación con un médico y te llamamos.</p><ul class="rx-split__paths"><li><strong>Ya tengo fórmula</strong><span>PDF o foto, validada por el equipo farmacéutico.</span></li><li><strong>Necesito evaluación</strong><span>Un médico revisa tu caso y define si el tratamiento es para ti.</span></li></ul>' + ctaRx + "</div></section>" +
      '<section class="catalog-teaser" aria-labelledby="catalog-title"><div class="catalog-teaser__head"><h2 id="catalog-title" class="section-title">Formulaciones con concentración declarada</h2>' + ctaCatalog + '</div><div class="catalog-teaser__grid"><a href="#/catalogo" class="teaser-card teaser-card--big"><img src="' + featured.image + '" alt="' + featured.name + '" loading="lazy"><div class="teaser-card__info"><h3>' + featured.name + '</h3><p class="mono">' + featured.profile + '</p><p class="mono teaser-card__price">' + money(featured.price) + "</p></div></a>" + rest + "</div></section>" +
      '<section class="lab" aria-labelledby="lab-title"><img class="lab__bg" src="assets/plates/lab.webp" alt="" loading="lazy"><div class="lab__panel"><div class="lab__icons"><img src="assets/icons/i6.png" alt="" width="48" height="48"><img src="assets/icons/i3.png" alt="" width="48" height="48"></div><h2 id="lab-title" class="section-title">Cada lote, analizado</h2><p class="lead">Antes de salir a la venta, cada lote pasa por análisis de cannabinoides, metales pesados, residuos y microbiología.</p><dl class="lab__specs"><div><dt>Cannabinoides</dt><dd>CBD, CBDA, THC, CBG, CBN</dd></div><div><dt>Contaminantes</dt><dd>Metales, pesticidas, solventes</dd></div><div><dt>Microbiología</dt><dd>Hongos, levaduras, patógenos</dd></div><div><dt>Documento</dt><dd>Certificado de análisis por lote</dd></div></dl></div></section>' +
      '<section class="faq" aria-labelledby="faq-title"><h2 id="faq-title" class="section-title">Preguntas frecuentes</h2><div class="faq__list">' +
      faqs.map(function (f, i) { return '<div class="faq__item" data-open="' + (i === 0) + '"><button type="button" aria-expanded="' + (i === 0) + '"><span>' + f[0] + '</span><span class="faq__plus" aria-hidden="true"></span></button><p' + (i === 0 ? "" : " hidden") + ">" + f[1] + "</p></div>"; }).join("") +
      "</div></section></main>" + footer();
  }

  function viewCatalog() {
    var filters = ["todos", "aceite", "capsula", "flor", "topico"].map(function (f, i) {
      return '<button type="button" role="tab" class="filter-chip" data-filter="' + f + '" aria-selected="' + (i === 0) + '">' + (f === "todos" ? "Todos" : categoryLabels[f]) + "</button>";
    }).join("");
    var cards = products.map(function (p) {
      return '<li class="product-card" data-cat="' + p.category + '"><div class="product-card__media"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div><div class="product-card__body"><p class="rx-flag' + (p.rx ? " rx-flag--on" : "") + '">' + (p.rx ? "Requiere fórmula" : "Venta libre a mayores de 18") + "</p><h2>" + p.name + '</h2><p class="product-card__format">' + p.format + '</p><p class="mono product-card__profile">' + p.profile + '</p><p class="product-card__summary">' + p.summary + '</p><p class="mono product-card__lot">' + p.lot + '</p><div class="product-card__foot"><span class="mono product-card__price">' + money(p.price) + '</span><button type="button" class="add-btn" data-add="' + p.id + '"><img src="assets/icons/i7.png" alt="" width="22" height="22"><span>Agregar</span></button></div></div></li>';
    }).join("");
    return page('<section class="catalog"><div class="catalog__head"><h1 class="page-title">Catálogo</h1><p class="lead">Los productos marcados con fórmula se habilitan cuando tu prescripción está aprobada. <a href="#/certificacion" class="inline-link">Validar fórmula</a></p><div class="filters" role="tablist" aria-label="Filtrar por tipo">' + filters + '</div></div><ul class="catalog__grid">' + cards + "</ul></section>");
  }

  function field(label, input) { return '<label class="field"><span>' + label + "</span>" + input + "</label>"; }

  function viewCert() {
    var upload = '<form class="form" data-demo="Fórmula recibida. En la versión final la revisa el equipo farmacéutico y verás el resultado en tu cuenta.">' +
      field("Nombre del médico", '<input name="doctor_name" required minlength="3">') + field("Registro médico", '<input name="doctor_reg" required minlength="3">') +
      field("Fecha de expedición", '<input type="date" required>') + '<label class="field field--file"><span>Fórmula (PDF, JPG o PNG, máximo 8 MB)</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required></label>' +
      field("Notas para el farmacéutico (opcional)", '<textarea rows="3"></textarea>') + '<button type="submit" class="submit-btn">Enviar fórmula</button></form>';
    var consult = '<form class="form" data-demo="Solicitud enviada. En la versión final un profesional te contacta en la franja que elegiste.">' +
      field("Nombre completo", '<input required minlength="3" autocomplete="name">') + field("Correo", '<input type="email" required autocomplete="email">') + field("Celular", '<input type="tel" required minlength="7">') +
      field("Motivo de consulta", '<textarea rows="3" required minlength="10"></textarea>') + field("Franja preferida", '<select><option>Mañana</option><option>Tarde</option><option>Noche</option></select>') +
      '<button type="submit" class="submit-btn">Solicitar evaluación</button></form>';
    return page('<section class="cert"><div class="cert__intro"><h1 class="page-title">Certificación médica</h1><p class="lead">Tu fórmula habilita aceites, cápsulas y flor. Sin ella, puedes pedir una evaluación médica.</p><img class="cert__plate" src="assets/plates/herbarium.webp" alt=""><h2 class="cert__req-title">Una fórmula válida incluye</h2><ul class="cert__req"><li>Tu nombre completo y número de documento</li><li>Producto o principio activo con su concentración</li><li>Dosis, frecuencia y duración del tratamiento</li><li>Fecha de expedición menor a 6 meses</li><li>Firma y registro profesional del médico</li></ul></div>' +
      '<div class="cert__panel"><div class="rx-status rx-status--en_revision"><span class="mono">Ejemplo de estado</span><strong>En revisión</strong><p>Así verá el paciente el avance de su fórmula.</p></div><div class="tabs" role="tablist" aria-label="Tipo de trámite"><button type="button" role="tab" aria-selected="true" data-tab="rx">Ya tengo fórmula</button><button type="button" role="tab" aria-selected="false" data-tab="consult">Necesito evaluación</button></div>' +
      '<div data-pane="rx">' + upload + '</div><div data-pane="consult" hidden>' + consult + "</div></div></section>");
  }

  function viewRegister() {
    return page('<section class="auth"><div class="auth__aside"><img src="assets/brand/mark.svg" alt="" width="88" height="88"><h1 class="page-title">Crear cuenta de paciente</h1><p class="lead">Con tu cuenta validas tu fórmula, sigues tus pedidos y guardas tu historial de tratamiento.</p></div>' +
      '<form class="form auth__form" data-demo="Cuenta creada (demo). En la versión final quedas registrado y pasas a validar tu fórmula.">' + field("Nombre completo", '<input required minlength="3" autocomplete="name">') +
      '<div class="field-row">' + field("Cédula", '<input required minlength="5" maxlength="15" inputmode="numeric">') + field("Fecha de nacimiento", '<input type="date" required>') + "</div>" +
      '<div class="field-row">' + field("Correo", '<input type="email" required>') + field("Celular", '<input type="tel" required minlength="7">') + "</div>" +
      '<div class="field-row">' + field("Contraseña", '<input type="password" required minlength="8">') + field("Repite la contraseña", '<input type="password" required minlength="8">') + "</div>" +
      '<label class="check"><input type="checkbox" required><span>Autorizo el tratamiento de mis datos personales y de salud según la Ley 1581 de 2012 y confirmo que soy mayor de 18 años.</span></label><button type="submit" class="submit-btn">Crear cuenta</button></form></section>');
  }

  function viewCart() {
    var items = cart.map(function (l) { return { line: l, p: byId(l.id) }; }).filter(function (x) { return x.p; });
    if (!items.length) {
      return page('<section class="cart cart--empty"><img src="assets/icons/i8.png" alt="" width="72" height="72"><h1 class="page-title">Tu carrito está vacío</h1><p class="lead">Explora las formulaciones y agrega lo que tu médico te indicó.</p>' + ctaCatalog + "</section>");
    }
    var sub = items.reduce(function (s, x) { return s + x.p.price * x.line.qty; }, 0);
    var ship = sub >= FREE_FROM ? 0 : SHIP;
    var lines = items.map(function (x) {
      return '<li class="cart-line"><img src="' + x.p.image + '" alt="" width="88" height="110"><div class="cart-line__info"><h2>' + x.p.name + '</h2><p class="mono">' + x.p.profile + "</p>" + (x.p.rx ? '<p class="rx-flag rx-flag--on">Requiere fórmula</p>' : "") + '</div><div class="stepper"><button type="button" data-qty="' + x.p.id + '" data-d="-1" aria-label="Quitar uno">−</button><span class="mono">' + x.line.qty + '</span><button type="button" data-qty="' + x.p.id + '" data-d="1" aria-label="Agregar uno">+</button></div><span class="mono cart-line__price">' + money(x.p.price * x.line.qty) + "</span></li>";
    }).join("");
    var methods = [["pse", "PSE", "Débito desde tu banco"], ["tarjeta", "Tarjeta", "Crédito o débito"], ["nequi", "Nequi", "Desde tu celular"]].map(function (m, i) {
      return '<label class="method" data-on="' + (i === 0) + '"><input type="radio" name="method" value="' + m[0] + '"' + (i === 0 ? " checked" : "") + "><strong>" + m[1] + "</strong><span>" + m[2] + "</span></label>";
    }).join("");
    return page('<section class="cart"><div class="cart__lines"><h1 class="page-title">Carrito</h1><ul>' + lines + '</ul><dl class="totals"><div><dt>Subtotal</dt><dd class="mono">' + money(sub) + '</dd></div><div><dt>Envío</dt><dd class="mono">' + (ship ? money(ship) : "Gratis") + '</dd></div><div class="totals__grand"><dt>Total</dt><dd class="mono">' + money(sub + ship) + "</dd></div></dl>" + (ship ? '<p class="hint">Envío gratis desde ' + money(FREE_FROM) + ".</p>" : "") + "</div>" +
      '<div class="cart__checkout"><form class="form" data-demo="Pedido simulado. En la versión final pasas a la pasarela de pago (PSE, tarjeta o Nequi)." data-clear="1"><h2 class="checkout-title">Envío y pago</h2>' + field("Quién recibe", '<input required minlength="3">') + field("Celular", '<input type="tel" required minlength="7">') + field("Dirección", '<input required minlength="5">') +
      '<div class="field-row">' + field("Ciudad", '<input required>') + field("Departamento", '<input required>') + '</div><fieldset class="methods"><legend>Medio de pago</legend>' + methods + '</fieldset><button type="submit" class="pay-btn"><span>Pagar pedido</span><span class="mono">' + money(sub + ship) + '</span></button><p class="hint">Pago procesado por pasarela certificada. Cannamed no almacena datos de tarjetas.</p></form></div></section>');
  }

  function page(inner) { return nav(false) + '<main class="page-main">' + inner + "</main>" + footer(); }

  function ageGate() {
    if (load("cmd_age", false)) return;
    var el = document.createElement("div");
    el.className = "age-gate"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = '<div class="age-gate__card"><img src="assets/brand/mark.svg" alt="" width="64" height="64"><h2>¿Eres mayor de 18 años?</h2><p>Cannamed ofrece productos de cannabis medicinal regulados. Debes ser mayor de edad para continuar.</p><div class="age-gate__actions"><button type="button" class="age-gate__yes">Sí, soy mayor</button><button type="button" class="age-gate__no">No</button></div></div>';
    document.body.appendChild(el);
    el.querySelector(".age-gate__yes").onclick = function () { save("cmd_age", true); el.remove(); };
    el.querySelector(".age-gate__no").onclick = function () { el.querySelector(".age-gate__card").innerHTML = '<img src="assets/brand/mark.svg" alt="" width="64" height="64"><h2>Este sitio es solo para adultos</h2><p>Si necesitas tratamiento para un menor, su médico tratante y su EPS te orientarán.</p>'; };
  }

  // Viaje de scroll: el desplazamiento controla el tiempo del video
  var stopJourney = null;
  function initJourney() {
    var root = document.getElementById("journey");
    if (!root) return;
    var video = root.querySelector("video");
    var poster = root.querySelector(".journey__poster");
    var bar = root.querySelector(".journey__progress");
    var dots = root.querySelectorAll("[data-dot]");
    var arts = root.querySelectorAll(".chapter");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mobile = window.matchMedia("(max-width: 860px)").matches;
    if (mobile) { poster.src = "assets/world/film-mobile.jpg"; video.poster = "assets/world/film-mobile.jpg"; }
    var ready = false, raf = 0, target = 0;
    if (!reduce) {
      fetch(mobile ? "assets/world/film-mobile.mp4" : "assets/world/film.mp4").then(function (r) { return r.blob(); }).then(function (b) {
        video.src = URL.createObjectURL(b);
        video.addEventListener("loadeddata", function () { ready = true; poster.style.display = "none"; tick(); }, { once: true });
        video.load();
      }).catch(function () {});
    }
    function progress() {
      var r = root.getBoundingClientRect();
      var total = root.offsetHeight - window.innerHeight;
      return Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    }
    function tick() {
      raf = 0;
      var p = progress();
      bar.style.transform = "scaleX(" + p + ")";
      var active = Math.min(arts.length - 1, Math.floor(p * arts.length));
      dots.forEach(function (d, i) { if (i === active) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current"); });
      root.classList.toggle("is-hidden-dots", root.getBoundingClientRect().bottom < window.innerHeight * 0.5);
      if (ready && video.duration) {
        target = p * (video.duration - 0.05);
        if (!video.seeking && Math.abs(video.currentTime - target) > 0.01) video.currentTime = target;
      }
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(tick); }
    video.addEventListener("seeked", function () { if (Math.abs(video.currentTime - target) > 0.03) onScroll(); });
    dots.forEach(function (d, i) { d.onclick = function () { window.scrollTo({ top: root.offsetTop + arts[i].offsetTop, behavior: "smooth" }); }; });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
    stopJourney = function () { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (video.src) URL.revokeObjectURL(video.src); };
  }

  function bind(view) {
    document.querySelectorAll(".faq__item button").forEach(function (b) {
      b.onclick = function () {
        var item = b.parentNode, open = item.getAttribute("data-open") === "true";
        document.querySelectorAll(".faq__item").forEach(function (it) { it.setAttribute("data-open", "false"); it.querySelector("button").setAttribute("aria-expanded", "false"); it.querySelector("p").hidden = true; });
        if (!open) { item.setAttribute("data-open", "true"); b.setAttribute("aria-expanded", "true"); item.querySelector("p").hidden = false; }
      };
    });
    document.querySelectorAll("[data-filter]").forEach(function (b) {
      b.onclick = function () {
        var f = b.getAttribute("data-filter");
        document.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
        document.querySelectorAll(".product-card").forEach(function (c) { c.style.display = f === "todos" || c.getAttribute("data-cat") === f ? "" : "none"; });
      };
    });
    document.querySelectorAll("[data-add]").forEach(function (b) {
      b.onclick = function () { var id = b.getAttribute("data-add"); var l = cart.filter(function (x) { return x.id === id; })[0]; setQty(id, (l ? l.qty : 0) + 1); b.querySelector("span").textContent = "Agregado"; toast(byId(id).name + " agregado al carrito"); };
    });
    document.querySelectorAll("[data-qty]").forEach(function (b) {
      b.onclick = function () { var id = b.getAttribute("data-qty"); var l = cart.filter(function (x) { return x.id === id; })[0]; setQty(id, (l ? l.qty : 0) + Number(b.getAttribute("data-d"))); render(); };
    });
    document.querySelectorAll("[data-tab]").forEach(function (b) {
      b.onclick = function () { var t = b.getAttribute("data-tab"); document.querySelectorAll("[data-tab]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); }); document.querySelectorAll("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== t; }); };
    });
    document.querySelectorAll(".method input").forEach(function (r) {
      r.onchange = function () { document.querySelectorAll(".method").forEach(function (m) { m.setAttribute("data-on", String(m.querySelector("input").checked)); }); };
    });
    document.querySelectorAll("form[data-demo]").forEach(function (f) {
      f.onsubmit = function (e) { e.preventDefault(); toast(f.getAttribute("data-demo")); if (f.getAttribute("data-clear")) { cart = []; save("cmd_cart", cart); setTimeout(function () { location.hash = "#/"; }, 1600); } else f.reset(); };
    });
    document.querySelectorAll("[data-nav]").forEach(function (a) { if (a.getAttribute("data-nav") === view) a.classList.add("is-active"); });
  }

  var views = { "": viewHome, catalogo: viewCatalog, certificacion: viewCert, registro: viewRegister, carrito: viewCart };
  function render() {
    if (stopJourney) { stopJourney(); stopJourney = null; }
    var key = (location.hash.replace(/^#\/?/, "").split("?")[0]) || "";
    var fn = views[key] || viewHome;
    document.getElementById("app").innerHTML = fn();
    bind(key);
    if (fn === viewHome) initJourney();
  }
  window.addEventListener("hashchange", function () { render(); window.scrollTo(0, 0); });
  render();
  ageGate();
})();
