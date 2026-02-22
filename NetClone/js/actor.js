// js/actor.js

const actorId = getQueryParam('id')
const container = document.getElementById('actor-container')

async function initActor() {
 if (!actorId) {
  container.innerHTML = '<h2>ID de actor no especificado</h2>'
  return
 }

 try {
  // 1. Obtener datos del actor
  const person = await fetchData(`/person/${actorId}`)
  // 2. Obtener créditos combinados (Películas y Series)
  const credits = await fetchData(`/person/${actorId}/combined_credits`)

  if (!person) {
   container.innerHTML = '<h2>Actor no encontrado</h2>'
   return
  }

  // Preparar datos
  const profileImg = person.profile_path
   ? `${ORIGINAL_IMAGE_URL}${person.profile_path}`
   : 'https://via.placeholder.com/300x450?text=No+Image'

  // Filtrar duplicados, ordenar por popularidad y tomar los top 20
  const knownFor = credits.cast
   .filter((item) => item.poster_path) // Solo los que tienen foto
   .sort((a, b) => b.popularity - a.popularity) // Ordenar por fama
   .slice(0, 24) // Limite de tarjetas

  // Renderizar HTML
  container.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 2rem; margin-top: 2rem;">
                <!-- Columna Izquierda: Foto -->
                <div style="flex: 0 0 300px; max-width: 100%;">
                    <img src="${profileImg}" style="width: 100%; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                    <div style="margin-top: 1rem; color: #ccc;">
                        <p><strong>Nacimiento:</strong> ${person.birthday || 'Desconocido'}</p>
                        <p><strong>Lugar:</strong> ${person.place_of_birth || 'Desconocido'}</p>
                    </div>
                </div>

                <!-- Columna Derecha: Bio y Filmografía -->
                <div style="flex: 1; min-width: 300px;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">${person.name}</h1>
                    <h3 style="color: var(--primary-color);">Biografía</h3>
                    <p style="line-height: 1.6; margin-bottom: 2rem; color: #ddd;">
                        ${person.biography || 'No hay biografía disponible en español para este actor.'}
                    </p>

                    <h3 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                        Filmografía Destacada
                    </h3>
                    
                    <div class="grid-container">
                        ${knownFor.map((item) => createActorCreditCard(item)).join('')}
                    </div>
                </div>
            </div>
        `
 } catch (error) {
  console.error(error)
  container.innerHTML = '<h2>Error cargando los datos del actor.</h2>'
 }
}

// Función auxiliar para crear tarjetas pequeñas dentro del perfil del actor
function createActorCreditCard(item) {
 const title = item.title || item.name
 const img = item.poster_path
  ? `${IMAGE_BASE_URL}${item.poster_path}`
  : 'https://via.placeholder.com/200x300?text=No+Img'
 const type = item.media_type // 'movie' o 'tv'
 const character = item.character ? `as ${item.character}` : ''

 return `
        <div class="card">
            <a href="detalle.html?id=${item.id}&type=${type}">
                <div class="card-image-wrapper">
                    <img src="${img}" alt="${title}" loading="lazy">
                    <div class="card-overlay">
                        <h3>${title}</h3>
                        <p style="font-size: 0.8rem; color: #ccc;">${character}</p>
                    </div>
                </div>
            </a>
        </div>
    `
}

// Iniciar
initActor()
