document.addEventListener('DOMContentLoaded', async () => {
 // 1. Cargar Tendencias (Mix)
 const trending = await fetchData('/trending/all/day')
 renderCarousel(trending.results, 'trending-container')

 // 2. Películas Populares
 const movies = await fetchData('/movie/popular')
 renderCarousel(movies.results, 'popular-movies', 'movie')

 // 3. Series Top
 const series = await fetchData('/tv/top_rated')
 renderCarousel(series.results, 'top-series', 'tv')
})

function renderCarousel(items, containerId, fixedType = null) {
 const container = document.getElementById(containerId)
 items.forEach((item) => {
  // Si es trending 'all', el item ya trae media_type. Si no, usamos fixedType
  const type = fixedType || item.media_type
  const card = createCard(item, type)
  container.appendChild(card)
 })
}
