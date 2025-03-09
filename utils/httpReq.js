const BASE_URL = "https://api.openweathermap.org/data/2.5"
const API_KEY = "b328ac6a42433410914c7e5fa3eefdc2"

const loader = document.getElementById("loader-container")

const getWeatherData = async (type, data) => {
    let url = null
    
    switch (type) {
        case "current":
            if (typeof data === "string")
                url = `${BASE_URL}/weather?q=${data}&appid=${API_KEY}&units=metric`
            else
            url = `${BASE_URL}/weather?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`
        break
        case "forcast":
            if (typeof data === "string")
                url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}&units=metric`
            else
            url = `${BASE_URL}/forcast?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`
    }
    
    try {
        loader.style.display = "flex"
        const response = await fetch(url)
        const json = await response.json()
        loader.style.display = "none"
        return json
    } catch (error) {
        showModal("An error occured during fetching data !")        
    }
}

export default getWeatherData