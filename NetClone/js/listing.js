const gridContainer = document.getElementById('grid-container')
const loader = document.getElementById('loader')
const form = document.getElementById('filter-form')
const genreSelect = document.getElementById('genre-select')

// Llenar select de géneros
async function populateGenres() {
 // Esperar un poco a que api.js cargue los géneros
 setTimeout(() => {
  Object.entries(genresList).forEach(([id, name]) => {
   const option = document.createElement('option')
   option.value = id
   option.textContent = name
   genreSelect.appendChild(option)
  })
 }, 500)
}

// Cargar contenido
async function loadContent(params = {}) {
 gridContainer.innerHTML = ''
 loader.style.display = 'block'

 let endpoint = `/discover/${PAGE_TYPE}`

 // Si hay búsqueda de texto, cambia el endpoint
 if (params.query) {
  endpoint = `/search/${PAGE_TYPE}`
 }

 const data = await fetchData(endpoint, {
  sort_by: params.sort_by || 'popularity.desc',
  with_genres: params.with_genres,
  primary_release_year: params.year,
  first_air_date_year: params.year, // Para series
  query: params.query,
 })

 loader.style.display = 'none'

 if (data.results.length === 0) {
  gridContainer.innerHTML = '<h3>No se encontraron resultados</h3>'
  return
 }

 data.results.forEach((item) => {
  const card = createCard(item, PAGE_TYPE)
  gridContainer.appendChild(card)
 })
}

// Evento Submit Filtros
form.addEventListener('submit', (e) => {
 e.preventDefault()
 const query = document.getElementById('search-input').value
 const sort = document.getElementById('sort-select').value
 const genre = document.getElementById('genre-select').value
 const year = document.getElementById('year-input').value

 loadContent({
  query: query,
  sort_by: sort,
  with_genres: genre,
  year: year,
 })
})

// Inicializar
populateGenres()
loadContent()
