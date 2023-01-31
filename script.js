var geoLat = "";
var geoLon = "";
var countryCodeUSA = "840";
var apiKey = '76e05ded687bd40e7bfd14c0e3e682be'
let query =''

//Fix THIS




var cityState = "New York, NY";


function getUserHistory() {
  let userSearches = []
  if (localStorage.getItem("userHistory")) {
    userSearches = JSON.parse(localStorage.getItem("userHistory"));
  }
  return userSearches;
}

function updateUserHistory(newCity) {

  let userSearches = getUserHistory();
  if (!userSearches.includes(newCity)){
  userSearches.push(newCity);
  }
  localStorage.setItem("userHistory", JSON.stringify(userSearches));
  renderUserHistory()
}

function renderUserHistory() {
  let userSearches = getUserHistory();
  let pastSearchList = document.querySelector("#userHistory");
  pastSearchList.innerHTML = '';
  for (i = 0; i < userSearches.length; i++) {
    let newSearch = document.createElement("p");
    newSearch.textContent = userSearches[i];
    pastSearchList.appendChild(newSearch);
  }
}

function init() {
  renderUserHistory();
}

const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value;
  searchInput.value = '';
  updateUserHistory(searchValue);
  getGeoCoord(searchValue);

});

function getGeoCoord(city) {
  let query = city.replace(', ',',');
  query = encodeURIComponent(city.trim()) + ',' + countryCodeUSA;
  let geoCodeAPI =
  `http://api.openweathermap.org/geo/1.0/direct?limit=1&appid=${apiKey}&q=${query}`;
 
  fetch(geoCodeAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      geoLat = data[0].lat;
      geoLon = data[0].lon;
   
      getWeatherData(geoLat, geoLon);
    });
}

function getWeatherData(geoLat, geoLon) {
  let openWeatherStub =
  `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&lat=${geoLat}&lon=${geoLon}`;

  fetch(openWeatherStub)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderForecast(data);
    });
}

function pastSearch(event) {
  event.preventDefault();
  let city = event.target.textContent;
  console.log(city);
  getGeoCoord(city);
}

function renderForecast(data) {
  const town = data.city.name;
  
  let cityEl = document.querySelector('.currentCity')
  
  cityEl.textContent = town;
  for (i=0; i<5;i++) { 
    let weatherDataEl = document.querySelector('.card' + (i+1))
    const weatherData = data.list[i];
  weatherDataEl.textContent = `Temp is ${weatherData.main.temp} degrees with ${weatherData.weather[0].description}`;
  }
}

init();
document.querySelector('#userHistory').addEventListener("click", pastSearch);

