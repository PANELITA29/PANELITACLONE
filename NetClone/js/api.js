// js/api.js

const API_KEY = 'ce683597765b9e89359356b518e3b724' // Tu API Key
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const ORIGINAL_IMAGE_URL = 'https://image.tmdb.org/t/p/original'

// Mapeo de géneros (para evitar llamar a la API constantemente)
const genresList = {}

// Función genérica para hacer peticiones
async function fetchData(endpoint, params = {}) {
 const url = new URL(`${BASE_URL}${endpoint}`)
 url.searchParams.append('api_key', API_KEY)
 url.searchParams.append('language', 'es-ES')

 Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]))

 try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Error en la petición')
  return await response.json()
 } catch (error) {
  console.error('Error fetching data:', error)
  return null
 }
}

// Obtener parámetros de la URL actual (para detalle.html?id=123)
function getQueryParam(param) {
 const urlParams = new URLSearchParams(window.location.search)
 return urlParams.get(param)
}

// Cargar géneros al iniciar
async function loadGenres() {
 const movieGenres = await fetchData('/genre/movie/list')
 const tvGenres = await fetchData('/genre/tv/list')

 if (movieGenres) movieGenres.genres.forEach((g) => (genresList[g.id] = g.name))
 if (tvGenres) tvGenres.genres.forEach((g) => (genresList[g.id] = g.name))
}

// Función para crear tarjeta de película/serie
function createCard(item, type) {
 const card = document.createElement('div')
 card.className = 'card'

 // Determinar imagen
 const imagePath = item.poster_path
  ? `${IMAGE_BASE_URL}${item.poster_path}`
  : 'https://via.placeholder.com/500x750?text=No+Image'

 // Obtener nombre del género (toma el primero)
 const genreName =
  item.genre_ids && item.genre_ids.length > 0
   ? genresList[item.genre_ids[0]]
   : 'General'
 const title = item.title || item.name
 const date = item.release_date || item.first_air_date || 'N/A'
 const year = date.split('-')[0]
 const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A'

 // Navegación: Detectar si estamos en carpeta pages o raíz para construir el link correcto
 // Nota: Simplificamos asumiendo estructura fija.
 const isRoot =
  window.location.pathname.endsWith('index.html') ||
  window.location.pathname === '/'
 const linkPrefix = isRoot ? 'pages/' : ''

 // HTML de la tarjeta
 card.innerHTML = `
        <a href="${linkPrefix}detalle.html?id=${item.id}&type=${type}" class="card-link">
            <div class="card-image-wrapper">
                <img src="${imagePath}" alt="${title}" loading="lazy">
                <div class="card-overlay">
                    <h3>${title}</h3>
                    <div class="meta">
                        <span class="rating">⭐ ${rating}</span>
                        <span class="year">${year}</span>
                    </div>
                    <span class="genre-tag">${genreName}</span>
                </div>
            </div>
        </a>
    `
 return card
}

// Inicializar navbar activa
function highlightActiveLink() {
 const path = window.location.pathname
 document.querySelectorAll('.nav-links a').forEach((link) => {
  if (
   path.includes(
    link.getAttribute('href').replace('./', '').replace('pages/', ''),
   )
  ) {
   link.classList.add('active')
  }
 })
}

// Ejecutar carga de géneros inmediatamente
loadGenres()
