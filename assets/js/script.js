//query selectors

var searchEl = document.querySelector("#search");
var searchBtnEl = document.querySelector("#searchBtn");
var resultsEl = document.querySelector("#results");
var cityEl = document.querySelector("#city");
var pastSearchEl = document.querySelector("#previous");


//retrieve previous searches from local storage or null if no items
var searchHistory = JSON.parse(localStorage.getItem("history")) || [];

//fill out past search section with local storage list and add event listeners
for (var i = 0; i < searchHistory.length; i++) {
    var previousCities = document.createElement("li");
    previousCities.classList.add("pastSearch");
    previousCities.textContent = searchHistory[i];
    previousCities.addEventListener("click", function(event) {
        searchEl.value = event.target.textContent
        callApi()
    })
    pastSearchEl.appendChild(previousCities);

    }

//main API call function
function callApi() {
    resultsEl.innerHTML = ""
    cityEl.textContent = ""
    var currentDate = dayjs();
    var searchCity = searchEl.value;
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=imperial&appid=ed2d2ec84946d427202f34afc3723a16"
// check if response from API ok
    fetch(requestUrl)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            window.alert("HTTPS Error: " + response.status);
            return;
        }
// function to create results elements for next 5 days and append to results section
    })
    .then(function (data) {
        console.log(data);
        cityEl.textContent = data.city.name
        var days = [0, 8, 16, 24, 32]
        for (var i = 0; i < days.length; i++) {
            var date = currentDate.add(i, "day");
            var formattedDate = date.format("MMMM D")
            var currentTemp = Math.round(data.list[days[i]].main.temp);
            var currentHumidity = data.list[days[i]].main.humidity;
            var currentWind = data.list[days[i]].wind.speed;
            var rain = data.list[days[i]].weather[0].main;
            var weatherIcon = data.list[days[i]].weather[0].icon;
            var weatherImg = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            var resultBox = document.createElement("div")
            resultBox.classList.add("weatherBox")
            resultBox.innerHTML = `
            <h2>${formattedDate}</h2>
            <img src= ${weatherImg}>
            <p>${rain}</p>
            <p>${"Temperature: " + currentTemp + "°F"}</p>
            <p>${"Humidity: " + currentHumidity + "%"}</p>
            <p>${"Wind: " + currentWind + "mph"}</p>
            `
            resultsEl.appendChild(resultBox)
            // checks local storage list to make sure city is not already on past search list and adds current query to list
            if (!searchHistory.includes(searchCity)) {
                searchHistory.push(searchCity);
                localStorage.setItem("history", JSON.stringify(searchHistory));
            }
        }}           
    )}

// event listener
searchBtnEl.addEventListener("click", callApi);
