# Cannamed, design brief

Design read: pacientes adultos en Colombia con prescripcion de cannabis medicinal que buscan una farmacia seria, cientifica y calida; registro clinico, no "dispensario recreativo".

Concept spine: "del cultivo a la gota". El sitio es un viaje de aumento optico: de la planta entera al tricoma y a una gota exacta de aceite. La ciencia (medicion, trazabilidad, formula medica) es la prueba de confianza.

Delivery tier: cinema.

Locked palette (colores dados por el usuario):
- Verde oscuro #0F2A1F (fondo de pagina), variantes #163828 / #1E4633
- Verde salvia #8FA98A (acento unico), salvia suave #B9C8B5 (texto secundario)
- Crema #F3EEE2 (paneles de producto, tarjetas, texto de display)
- Blanco #FFFFFF (texto de cuerpo sobre verde)
Defensa: verde oscuro = laboratorio botanico nocturno; salvia = planta viva; crema = papel de herbario.

Locked type: Outfit (display y cuerpo) + IBM Plex Mono (datos: concentraciones, lotes, precios). Sin serif.

Animation mode: animated-website
Journey shape: single-shot. El proveedor de video rechazo generar el film de la planta, asi que el film se arma con 4 fotogramas macro generados (planta, flor, tricoma, gota) en un acercamiento continuo con fundidos, cortado en 4 tramos consecutivos del mismo master.
Journey:
1. Planta: "Cannabis medicinal, con formula." CTA Ver catalogo + Validar formula.
2. Flor: cultivo licenciado y trazabilidad.
3. Tricoma: donde vive la medicina, medicion por cromatografia.
4. Gota: dosis exacta, el frasco dice la verdad. CTA Crear cuenta.
World grammar: macro botanico cientifico, fondo verde #0F2A1F oscuro, luz de borde salvia, brillos crema, sin cortes, exposicion fija.
Mobile framing: sujeto centrado, version 720p.
Delivery budget: <=32 MiB desktop, <=16 MiB mobile.
La journey enacta el spine: el scroll es literalmente el aumento optico.

Section plan (home, despues del viaje):
1. Proceso: linea de tiempo horizontal de 4 pasos con iconos generados.
2. Certificacion medica: split imagen herbario + dos caminos (tengo formula / necesito evaluacion).
3. Catalogo: grilla asimetrica (1 grande + 4).
4. Laboratorio: imagen a sangre con especificaciones en mono.
5. Preguntas: acordeon divide-y.
6. Footer legal.
Paginas: /catalogo, /certificacion, /registro, /ingresar, /cuenta, /carrito (checkout), /pedido/$id, /admin.

Asset plan: film 15 s, storyboard, monograma SVG, set de 8 iconos, 6 fotos de producto, placa herbario, placa laboratorio, portada 3:2.

CTA inventory: Ver catalogo (pill salvia, flecha que se desliza), Validar formula (contorno crema, subrayado que barre), Crear cuenta (bloque crema, sello que gira), Agregar (boton icono con rebote), Pagar pedido (barra ancha con estado de carga), Enviar formula / Solicitar evaluacion / Ingresar (botones de formulario propios).
