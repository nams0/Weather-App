import getWeatherData from "./utils/httpReq.js"
import { showModal, removeModal } from "./utils/modal.js"

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

const locationIcon = document.querySelector(".fa-location-dot")
const searchInput = document.querySelector("input")
const searchButton = document.querySelector("button")
const weatherContainer = document.getElementById("weather")
const forecastContainer = document.getElementById("forcast")
const closeModalIcon = document.querySelector(".bi-x-square")
const footer = document.querySelector("footer")

const renderCurrentWeather = data => {
    const weatherJSX =`
        <h1>${data.name}, ${data.sys.country}</h1>
        <div id="main">
            <img alt="weather icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"/>
            <span>${data.weather[0].main}</span>
            <p>${Math.round(data.main.temp)} °C</p>
        </div>
        <div id="info">
            <p>Humidity: <span>${data.main.humidity} %</span></p>
            <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
        </div>
    `
    weatherContainer.innerHTML = weatherJSX
    weatherContainer.style.opacity = 1
    weatherContainer.className = "animate__animated animate__fadeInDown"
}

const renderForecastWeather = data => {
    forecastContainer.innerHTML = ""
    const fiveDays = data.list.filter(item => item.dt_txt.split(" ")[1] === "12:00:00")

    fiveDays.forEach(day => {
        // fixing short time 
        const dayOfWeek = new Date(day.dt * 1000).getDay()
        const forecastJSX = `
            <div>
                <img alt="weather icon" src="https://openweathermap.org/img/w/${day.weather[0].icon}.png"/>
                <h3>${DAYS[dayOfWeek]}</h3>
                <p>${Math.round(day.main.temp)} °C</p>
                <span>${day.weather[0].main}</span>
            </div>
        `
        forecastContainer.innerHTML += forecastJSX
    })
    forecastContainer.className = "animate__animated animate__fadeInDown"
}

const searchHandler = async () => {
    const cityName = searchInput.value

    if(!cityName) {
        showModal("Please enter city name !")
        return
    }
    
    const currentData = await getWeatherData("current", cityName)
    if(currentData.cod !== 200) {
        showModal(currentData.message)
        console.clear()
        return
    }
    renderCurrentWeather(currentData)
    const getForcast = await getWeatherData("forcast", cityName)
    footer.style.marginTop = "20px"
    renderForecastWeather(getForcast)
}

const positionCallback = async position => {
    const currentData = await getWeatherData("current", position.coords)
    renderCurrentWeather(currentData)
    const forcastData = await getWeatherData("forcast", position.coords)
    renderForecastWeather(forcastData)
}

const errorCallback = error => {
    showModal(error.message)
}

const locationHandler = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionCallback, errorCallback)
    } else {
        showModal("Your browser does not support geolocation")
    }
}

searchButton.addEventListener("click", searchHandler)
locationIcon.addEventListener("mouseenter", () => locationIcon.className = "fa-solid fa-location-dot")
locationIcon.addEventListener("mouseleave", () => locationIcon.className = "fa-solid fa-location-dot fa-bounce")
weatherContainer.addEventListener("animationend", () => weatherContainer.className = "")
forecastContainer.addEventListener("animationend", () => forecastContainer.className = "")
locationIcon.addEventListener("click", locationHandler)
closeModalIcon.addEventListener("click", removeModal)