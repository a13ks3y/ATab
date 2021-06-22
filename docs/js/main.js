function okGoogleTellMeWhatIs(key, callback) {
  if (window['chrome'] && window['chrome']['storage']) {
    return window['chrome']['storage']['local'].get(key, callback);
  } else {
    const result = {};
    result[key] = localStorage.getItem(key);
    return callback(result);
  } 
}
// Get username for calendar
okGoogleTellMeWhatIs(['gitCalName'], function (result) {
  if (result.gitCalName === undefined) {
    //Error Message Block
    let calStart = document.getElementById('calendar-start')
    calStart.setAttribute('style', 'color: red; font-size: 1.25rem;')
    calStart.textContent = 'Please go to settings and configure your username!'
  } else {
    // Info to initiate the github calendar - pulled into the github-calendar.js
    let calendarName = result.gitCalName
    new GitHubCalendar('.calendar', calendarName, { responsive: true })
  }
})

// @todo: try to get username from cookies/localstorage etc.
GithubFeed.init({
  username: 'a13ks3y',
  container: '#github-feeds',
  count: 10,
  order: 'desc',
  onComplete: function () {
    console.log('Feed Loaded')
  },
});


// okGoogleTellMeWhatIs(['userGit'], function (result) {
//   if (result.userGit === undefined) {
//     let feedUnknown = document.getElementById('github-feeds')
//     feedUnknown.setAttribute('style', 'color: red; font-size: 1.15rem;')
//     feedUnknown.textContent = 'Please configure Github Username!' //Error Message
//   } else {
//     // Initiate the Feed - This is pulled  into the githubFeed.js file
//     GithubFeed.init({
//       username: result.userGit,
//       container: '#github-feeds',
//       count: 10,
//       order: 'desc',
//       onComplete: function () {
//         console.log('Feed Loaded')
//       },
//     })
//   }
// })

const qEl = document.getElementsByName('q')[0];
qEl.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    const googleQuery = `https://www.google.com/search?q=${qEl.value}`;
    const rawQuery = qEl.value.toString();
    const quater = rawQuery.substr(0, 4);
    const isUrl = (quater === 'http' || quater === 'file');
    const url = isUrl ? rawQuery : googleQuery;
    if (window['chrome'] && window['chrome']['tabs']) {
      window['chrome']['tabs'].create({ url });  
    } else {
      location.href = url;
    }
  }
});

// Start of Clock and Calendar

function GetClock() {
  let tday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  let tmonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  let d = new Date()
  let nday = d.getDay(),
    nmonth = d.getMonth(),
    ndate = d.getDate(),
    nyear = d.getFullYear()
  let nhour = d.getHours(),
    nmin = d.getMinutes(),
    nsec = d.getSeconds(),
    ap

  if (nhour === 0) {
    ap = ' AM'
    nhour = 12
  } else if (nhour < 12) {
    ap = ' AM'
  } else if (nhour === 12) {
    ap = ' PM'
  } else if (nhour > 12) {
    ap = ' PM'
    nhour -= 12
  }

  if (nmin <= 9) nmin = '0' + nmin
  if (nsec <= 9) nsec = '0' + nsec

  let dateText =
    '' + tday[nday] + ', ' + tmonth[nmonth] + ' ' + ndate + ', ' + nyear + ' '
  let clockText = nhour + ':' + nmin + ':' + nsec + ap + ''
  let clockDate = document.getElementById('date')
  let clockTime = document.getElementById('clock')
  clockDate.textContent = dateText
  clockTime.textContent = clockText
}

GetClock()

setInterval(GetClock, 1000)

// Start of Weather Widget

const apiKey = 'de86474ef2fa9963ad1c2292b7b89082' //API key.
let cityEl = document.getElementById('city')
let currTempEl = document.getElementById('temp')
let humidityEl = document.getElementById('humidity')
let windEl = document.getElementById('wind')
let skyEl = document.getElementById('sky')
// 50.4501° N, 30.5234°
let lat = '50.420';
let lon = '30.5234';
let unit = 'metric';

/**
 *
 * @type {object} response
 * @property {object} main
 * @property {number} temp
 * @property {number} humidity
 * @property {number} wind
 * @property {number} clouds
 * @property {string} name
 *
 */

function findWeather() {
  let searchLink =
    'https://api.openweathermap.org/data/2.5/weather?lat=' +
    lat +
    '&lon=' +
    lon +
    '&appid=' +
    apiKey +
    '&units=' +
    unit
  httpRequestAsync(searchLink, theResponse)
}

function theResponse(response) {
  let jsonObject = JSON.parse(response)
  cityEl.textContent = jsonObject.name // Location
  currTempEl.textContent = parseInt(jsonObject.main.temp) + '° ' //Temperature
  humidityEl.textContent = jsonObject.main.humidity + '%' // Humidity
  let windSpeed = 'mph'

  if (unit === 'metric') {
    windSpeed = 'kph'
  }
  windEl.textContent = jsonObject.wind.speed + windSpeed + ' ' // Wind Speed
  skyEl.textContent = jsonObject.clouds.all + '%' // Cloud Cover %
}

function httpRequestAsync(url, callback) {
  let httpRequest = new XMLHttpRequest()
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4 && httpRequest.status === 200)
      callback(httpRequest.responseText)
  }
  httpRequest.open('GET', url, true)
  httpRequest.send()
}
findWeather() //Initiate the function


/**
 *
 * @type {XMLHttpRequest}
 * @type {object} article
 * @property {object} article.user
 * @property {string} article.cover_image
 * @property {string} article.user.twitter_username
 * @property {string} article.description
 * @property {string} article.user.name
 * @property {string} article.user.username
 */


var iconEl = document.getElementById('addIcon')
iconEl && iconEl.addEventListener('click', showInput)
function showInput() {
  let input1 = document.getElementById('urlName')
  let input2 = document.getElementById('siteUrl')
  let addButton = document.getElementById('addItem')
  let label1 = document.getElementById('siteLabel')
  let label2 = document.getElementById('urlLabel')
  if (input1.style.display === 'none') {
    input1.style.display = 'inline-block'
    input2.style.display = 'inline-block'
    addButton.style.display = 'inline-block'
    label1.style.display = 'inline-block'
    label2.style.display = 'inline-block'
    document.getElementById('addIcon').innerText = '-'
  } else {
    input1.style.display = 'none'
    input2.style.display = 'none'
    addButton.style.display = 'none'
    label1.style.display = 'none'
    label2.style.display = 'none'
    document.getElementById('addIcon').innerText = '+'
  }
}
