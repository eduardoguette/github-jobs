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
const btnFilter = document.querySelector('.btn-filter')
const header = document.querySelector('header')

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
btnFilter.addEventListener('click', filterJobs)
inputJob.addEventListener('click', nofilterJobs)
htmlJobs.addEventListener('click', nofilterJobs)
// header.addEventListener('click', nofilterJobs)

window.addEventListener('resize', nofilterJobs)

function nofilterJobs() {
  formulario.classList.remove('active')
}
function filterJobs() {
  formulario.classList.toggle('active')
}

function busqueda(e) {
  e.preventDefault()
  limpiarHTML()
  page = 1
  getJobs()
  formulario.classList.remove('active')
}
function leerInfo(e) { 
  
  job[e.target.name] = e.target.value
}

getJobs()
function getJobs() {
  spinner()
  let { title, location, jobtype } = job
  jobtype === 'on' ? (jobtype = true) : (jobtype = false)
  const jobsite = `https://jobs.github.com/positions.json?description=${title}&location=${location}&full_time=${jobtype}&page=${page}`
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(jobsite)}`
  axios.get(url).then((response) => mostrarJobs(JSON.parse(response.data.contents)))
  page++
}

function mostrarJobs(jobs) {
  formulario.classList.remove('active')
  if (jobs.length > 0) {
    if (document.querySelector('.spinner')) document.querySelector('.spinner').remove()
    btnLoadMore.classList.remove('hidden')
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
      htmlJobs.classList.remove('no-results')
      htmlJobs.appendChild(divCard)
    })
  } else {
    htmlJobs.classList.add('no-results')
    htmlJobs.innerHTML = `
     <img width="300" src="https://media2.giphy.com/media/V0E9fl9dPKWWI/giphy.gif?cid=ecf05e47ld9aubiebvneh5zb14uo3l1u5t9th0x4y9hqusdb&rid=giphy.gif" alt="no more jobs image"/>
     <p class="text-no-results">No results</p>
    `
    if (document.querySelector('.spinner')) document.querySelector('.spinner').remove()
    btnLoadMore.style.opacity = 0
  }
}

function noPagination(jobs) {
  if (jobs.length < 50) {
    btnLoadMore.style.opacity = 0
  } else {
    btnLoadMore.style.opacity = 1
  }
}

function spinner() {
  btnLoadMore.classList.add('hidden')
  const div = document.createElement('div')
  div.className = 'spinner'
  document.querySelector('.pagination__content').appendChild(div)
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
