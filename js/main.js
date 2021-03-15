const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
if (userPrefersDark) {
  document.body.classList.add('darkmode')
} else {
  document.body.classList.remove('darkmode')
}

const darkMode = document.querySelector('#darkmode')
const formulario = document.querySelector('form')
const inputJob = document.querySelector('#title')
const inputLocation = document.querySelector('#location')
const inputJobType = document.querySelector('#jobtype')
const htmlJobs = document.querySelector('.results__content')
const btnLoadMore = document.querySelector('.btn-loadmore')
const job = {
  title: '',
  location: '',
  jobtype: '',
}
let page = 1
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
btnLoadMore.addEventListener('click', getJobs)
function busqueda(e) {
  e.preventDefault()
  limpiarHTML()
  page = 1
  getJobs()
}
function leerInfo(e) {
  job[e.target.name] = e.target.value
  console.log(job)
}

getJobs()
function getJobs() {
  let { title, location, jobtype } = job

  jobtype === 'on' ? (jobtype = true) : (jobtype = false)

  const jobsite = `https://jobs.github.com/positions.json?description=${title}&location=${location}&full_time=${jobtype}&page=${page}`
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(jobsite)}`
  // fetch(url).then(response => response.json()).then(jobs => console.log(jobs))
  axios.get(url).then((response) => mostrarJobs(JSON.parse(response.data.contents)))
  page++
}

function mostrarJobs(jobs) {
  noPagination(jobs)
  const logoError = '../static/icons/error-circle-solid-24.png'

  jobs.forEach((job) => {
    const { company, company_logo, created_at, description, location, title, type, url } = job
    const divCard = document.createElement('div')
    divCard.className = 'card-job'
    divCard.innerHTML = `
      <div class="card-job__head">
      <div class="container-logo">
        <img
          height="40"
          width="40"
          src="${company_logo ? company_logo : logoError}"
          alt="logo-${company}">
      </div>
      </div>
      <div class="card-job__date">
        <span>${timeSince(new Date(created_at))} - </span>
        <span>${type}</span>
      </div>
      <div class="card-job__title">
        <a href="${url}">${title}</a>
      </div>
      <div class="card-job__company">
        <p>${company}</p>
      </div>
      <div class="card-job__location">
        <p>${location}</p>
      </div>
    
    `
    htmlJobs.appendChild(divCard)
  })
}

function noPagination(jobs) {
  if (jobs.length < 50) {
    btnLoadMore.style.opacity = 0
  } else {
    btnLoadMore.style.opacity = 1
  }
}

function limpiarHTML() {
  while (htmlJobs.firstChild) {
    htmlJobs.removeChild(htmlJobs.firstChild)
  }
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + 'y ago'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + 'm ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + 'd ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + 'h ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + 'min'
  }
  return Math.floor(seconds) + ' seconds'
}
