const ville = document.getElementById("city").textContent;
const date = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = date.toLocaleDateString('fr-FR', options);
document.getElementById("date").textContent = formattedDate[0].toUpperCase() + formattedDate.slice(1);


function displayUserLocation(){
    let latitude;
    let longitude;

    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                
                const userloc = {latitude, longitude};
                
                fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${userloc.latitude}&lon=${userloc.longitude}&appid=8f26ed1267745bf52f0077b38373c011`)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById("city").textContent = data[0].state || data[0].name;
                       
                        getCityWeather();
                        displayHourlyForecast();
                        
                        
                        
                    })
                    .catch(error => console.log("erreur", error));
            },
            (error)=>{
                console.error(error)
            }
        );
    }else{
        console.error("Geolocation is not supported by this browser.");
    }
}


function getCityWeather(){
    const location = document.getElementById("city").textContent;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&lang=fr&appid=8f26ed1267745bf52f0077b38373c011&units=metric`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("temperature").textContent = `${data.main.temp}°C`;
            document.getElementById("descr").textContent = `${data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1)}`;
             
           
            
            
        })
        .catch(error => console.log("erreur", error));
}


function handleSearch(){
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    document.getElementById("city").textContent = searchInput[0].toUpperCase() + searchInput.slice(1);
    getCityWeather();
    displayHourlyForecast();
}


function displayHourlyForecast(){
    const location = document.getElementById("city").textContent;
    const hForecastTab = document.getElementById("h-forecast");
    hForecastTab.innerHTML = ""; 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&lang=fr&appid=8f26ed1267745bf52f0077b38373c011&units=metric`)
        .then(res => res.json())
        .then(data => {
            
            data.list.forEach((forecast) => {
                   
                    const hour = forecast.dt_txt.split(" ")[1].split(":")[0];
                    hForecastTab.innerHTML += `
                        <li class="flex flex-col items-center gap-2 shrink-0">
                            <span class="font-semibold">${forecast.main.temp}°</span>
                            <span>☁️</span>
                            <span class="text-sm text-white/70">${hour}h</span>
                        </li>
                    `
                

            });
        
        })
        .catch(error => console.log("erreur", error));
}

displayUserLocation();

document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
        
    }
});










