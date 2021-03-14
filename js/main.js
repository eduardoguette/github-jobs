const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
if (userPrefersDark) {
  document.body.classList.add('darkmode')
} else {
  document.body.classList.remove('darkmode')
}

const darkMode = document.querySelector('#darkmode')
const formulario = document.querySelector('form')
const inputJob = document.querySelector('#job')
const inputLocation = document.querySelector('#location')
const inputJobType = document.querySelector('#jobtype')

const busquedaObj = {
  job: '',
  location: '',
  jobtype: "",
}

darkMode.addEventListener('input', (e) => {
  if (e.target.checked) {
    document.body.classList.add('darkmode')
  } else {
    document.body.classList.remove('darkmode')
  }
})
inputJob.addEventListener('change', leerInfo)
inputLocation.addEventListener('change', leerInfo)
inputJobType.addEventListener('change', leerInfo)

formulario.addEventListener('submit', busqueda)

function busqueda(e) {
  e.preventDefault()
}
function leerInfo(e) {
  busquedaObj[e.target.name] = e.target.value
  console.log(busquedaObj)
}
