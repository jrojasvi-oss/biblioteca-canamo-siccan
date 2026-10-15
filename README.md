# Biblioteca Cáñamo SICCAN

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23384254.svg)](https://doi.org/10.5281/zenodo.23384254)

Base de datos abierta de la revisión sistemática PRISMA 2020 sobre cáñamo (*Cannabis sativa* L.) para grano proteico, hecha por el **Semillero SICCAN** de la Universidad Nacional de Colombia, Sede Palmira, dentro del proyecto Hermes 59460 con la asociación campesina **AURACOL** (Sevilla, Valle del Cauca).

- **Página de consulta:** `index.html` (con GitHub Pages queda en `https://jrojasvi-oss.github.io/biblioteca-canamo-siccan/`). Tiene buscador, filtros por tema, bloque, año, acceso e idioma, y descarga en CSV.
- **Excel:** [`biblioteca_canamo_siccan.xlsx`](biblioteca_canamo_siccan.xlsx) — hoja *Registros* con filtros y enlaces, y hoja *Resumen* con conteos y gráfica por año.
- **CSV:** [`biblioteca_canamo_siccan.csv`](biblioteca_canamo_siccan.csv) — UTF-8, una fila por artículo.

## Qué contiene

974 registros: 958 elegibles de OpenAlex (2010–2026) y 16 fuentes de una búsqueda dirigida sobre sanidad (plagas, enfermedades, *Fusarium*, *Pythium*, MIPE y control biológico) y economía (costos y sistema agroecológico frente a convencional), agregadas el 14/10/2026. Cada registro trae año, título, revista, países de los autores, temas, bloques de búsqueda, citas, tipo de acceso, idioma, DOI y enlace a OpenAlex. La columna *Usado en el artículo* marca las fuentes que aportaron datos al artículo (versión 9).

## Método

Búsqueda del 3 de octubre de 2026 en Scopus, ScienceDirect y PubMed (acceso institucional UNAL) y en OpenAlex, con 10 bloques temáticos en título, resumen y palabras clave, más un bloque de literatura en español, desde 2010. El tamizaje se hizo en OpenAlex con reglas fijas y reproducibles:

1. Duplicados por título.
2. Solo artículos y revisiones en inglés o español.
3. El título debe nombrar al cáñamo o a *Cannabis* (se excluyen *Crotalaria juncea* y el concreto de cáñamo).
4. Exclusión de ciencia de materiales y biomedicina.
5. Al menos una variable agronómica, nutricional, de semilla, proteína, mercado o productores.

Flujo: 8202 registros → 7632 únicos → 958 elegibles. El detalle de las cadenas está en la página.

## Cómo citar

SICCAN (2026). *Cáñamo para grano en el trópico andino: datos de la revisión sistemática, rangos objetivo, sanidad y economía (SICCAN–AURACOL)* (versión 1) [Conjunto de datos]. Zenodo. https://doi.org/10.5281/zenodo.23384254

## Licencia

Datos bibliográficos bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es). Los metadatos provienen de [OpenAlex](https://openalex.org) (CC0).

Contacto: Juan David Rojas Villafañe — jrojasvi@unal.edu.co
