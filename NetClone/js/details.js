const id = getQueryParam('id')
const type = getQueryParam('type') // 'movie' o 'tv'
const container = document.getElementById('detail-container')

async function initDetails() {
 if (!id || !type) return

 // 1. Obtener detalles principales
 const data = await fetchData(`/${type}/${id}`, {
  append_to_response: 'credits,videos,images',
 })

 // Renderizar Banner y Info
 renderHero(data)

 // Renderizar Actores
 renderCast(data.credits.cast)

 // Si es serie, lógica especial de temporadas
 if (type === 'tv') {
  renderSeasonsInterface(data.seasons, id)
 }
}

function renderHero(data) {
 const backdrop = data.backdrop_path
  ? `${ORIGINAL_IMAGE_URL}${data.backdrop_path}`
  : ''
 const poster = data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : ''
 const title = data.title || data.name
 const date = data.release_date || data.first_air_date
 const runtime = data.runtime
  ? `${data.runtime} min`
  : data.number_of_seasons
    ? `${data.number_of_seasons} Temporadas`
    : ''
 const genres = data.genres.map((g) => g.name).join(', ')

 // Buscar trailer de YouTube
 const trailer = data.videos.results.find(
  (v) => v.site === 'YouTube' && v.type === 'Trailer',
 )
 const embedVideo = trailer
  ? `<div style="margin-top:20px"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe></div>`
  : ''

 container.innerHTML = `
        <div class="banner" style="background-image: url('${backdrop}')">
            <div class="banner-overlay"></div>
        </div>
        <div class="content-detail">
            <img src="${poster}" class="poster-detail">
            <div class="info-detail">
                <h1>${title}</h1>
                <p class="tagline">${data.tagline || ''}</p>
                <div style="margin: 10px 0; color: #aaa;">
                    <span>${date}</span> • <span>${runtime}</span> • <span>⭐ ${data.vote_average.toFixed(1)}</span>
                </div>
                <p style="color: var(--primary-color)">${genres}</p>
                <h3 style="margin-top:20px">Sinopsis</h3>
                <p>${data.overview}</p>
                ${embedVideo}
                
                <div id="seasons-container"></div>
                
                <h3>Reparto</h3>
                <div id="cast-container" class="cast-scroller"></div>
            </div>
        </div>
    `
}

function renderCast(cast) {
 const castContainer = document.getElementById('cast-container')
 cast.slice(0, 15).forEach((actor) => {
  const img = actor.profile_path
   ? `${IMAGE_BASE_URL}${actor.profile_path}`
   : 'https://via.placeholder.com/150x225?text=Actor'
  const div = document.createElement('div')
  div.className = 'cast-card'
  div.innerHTML = `
            <a href="actor.html?id=${actor.id}">
                <img src="${img}">
                <div class="cast-name">${actor.name}</div>
                <div class="character-name">${actor.character}</div>
            </a>
        `
  castContainer.appendChild(div)
 })
}

// Lógica de Series
function renderSeasonsInterface(seasons, seriesId) {
 const container = document.getElementById('seasons-container')

 // Crear selector de temporadas
 const select = document.createElement('select')
 select.className = 'season-selector'
 seasons.forEach((season) => {
  const option = document.createElement('option')
  option.value = season.season_number
  option.textContent = season.name
  select.appendChild(option)
 })

 const episodesList = document.createElement('div')
 episodesList.className = 'episodes-list'

 container.innerHTML = `<h3>Episodios</h3>`
 container.appendChild(select)
 container.appendChild(episodesList)

 // Evento al cambiar temporada
 select.addEventListener('change', (e) =>
  loadEpisodes(seriesId, e.target.value, episodesList),
 )

 // Cargar temporada 1 por defecto (o la primera disponible)
 if (seasons.length > 0)
  loadEpisodes(seriesId, seasons[0].season_number, episodesList)
}

async function loadEpisodes(seriesId, seasonNumber, container) {
 container.innerHTML =
  '<div class="loader" style="display:block">Cargando episodios...</div>'

 const data = await fetchData(`/tv/${seriesId}/season/${seasonNumber}`)
 container.innerHTML = ''

 if (!data || !data.episodes) return

 data.episodes.forEach((ep) => {
  const img = ep.still_path
   ? `${IMAGE_BASE_URL}${ep.still_path}`
   : 'https://via.placeholder.com/150x85?text=No+Img'
  const div = document.createElement('div')
  div.className = 'episode-card'
  div.innerHTML = `
            <img src="${img}" class="episode-img">
            <div>
                <h4>${ep.episode_number}. ${ep.name}</h4>
                <p style="font-size:0.9rem; color:#ccc; margin-top:5px">${ep.overview || 'Sin descripción disponible.'}</p>
            </div>
        `
  container.appendChild(div)
 })
}

initDetails()
