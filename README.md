# PANELITA-CLONE
Este proyecto consiste en el desarrollo de una aplicación web tipo Netflix, completamente funcional, que consume datos reales desde la API de The Movie Database (TMDB).
La aplicación permite visualizar películas y series, consultar información detallada, ver trailers oficiales, realizar búsquedas dinámicas, aplicar filtros, usar scroll infinito y cambiar entre modo oscuro y claro.

El objetivo del proyecto fue aplicar conocimientos de:

HTML5

CSS3

JavaScript

Consumo de APIs

Diseño responsive

Uso responsable de Inteligencia Artificial como herramienta de aprendizaje

 Demo en Producción

🔗 Sitio desplegado en:
(https://panelita-clone.netlify.app/)
Proyecto publicado mediante Netlify.

Tecnologías Utilizadas

HTML5 → Estructura del proyecto

CSS3 → Diseño visual y responsive

JavaScript (ES6) → Lógica del proyecto

Fetch API → Consumo de datos desde TMDB

API TMDB → Datos reales de películas y series

Integración con la API TMDB

El proyecto consume datos desde la API de TMDB utilizando fetch().

Endpoints utilizados:

/movie/popular

/movie/top_rated

/search/movie

/movie/{id}

/movie/{id}/credits

/movie/{id}/videos

/genre/movie/list

Ejemplo de conexión:
const API_KEY =ce683597765b9e89359356b518e3b724;
const BASE_URL = "https://api.themoviedb.org/3";

async function getPopularMovies() {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    showMovies(data.results);
}


Personalización del Proyecto

Para demostrar autoría y comprensión del código, se añadieron mejoras propias:

Diseño visual personalizado

Animaciones hover en posters

Transiciones suaves

Loader animado

Mejoras en experiencia de usuario

Estilo UI diferente al diseño base

 Uso de Inteligencia Artificial

La Inteligencia Artificial fue utilizada como herramienta de aprendizaje para:

Explicar línea por línea el código

Agregar comentarios educativos en HTML, CSS y JavaScript

Comprender la conexión con la API

Mejorar la estructura del proyecto

Optimizar funciones

Entender la lógica general del sistema

El código del proyecto se encuentra comentado para facilitar su comprensión.
![Uploading image.png…]()

