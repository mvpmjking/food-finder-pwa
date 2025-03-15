if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}

let userLatitude, userLongitude;

function logMessage(message) {
    const logArea = document.getElementById("debug-log");
    if (logArea) {
        logArea.innerHTML += `<p>${message}</p>`;
    }
    console.log(message);
}

function getLocation() {
    logMessage("Getting location...");
    const status = document.getElementById("status");
    status.textContent = "Locating…";

    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser.";
        logMessage("❌ Geolocation not supported");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    
    logMessage(`✅ Location found: Latitude ${userLatitude}, Longitude ${userLongitude}`);

    // Display location on the screen
    document.getElementById("status").innerHTML = `📍 Your Location: <b>${userLatitude}, ${userLongitude}</b>`;
    document.getElementById("preferences").style.display = "block";
}

function error(err) {
    logMessage(`❌ Error retrieving location: ${err.message}`);
    document.getElementById("status").innerHTML = "❌ Unable to retrieve your location.";
}

// OpenStreetMap API - Now Using Proper Nearby Search
async function searchRestaurants() {
    logMessage("🔍 Searching for nearby restaurants...");
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    if (!userLatitude || !userLongitude) {
        logMessage("❌ Error: Location not found before searching.");
        resultsList.innerHTML = "❌ Error: Location not found.";
        return;
    }

    // Search within a 5-mile radius (8000 meters)
    const radius = 8000;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${foodType}&dedupe=1&limit=5&extratags=1&countrycodes=us&lat=${userLatitude}&lon=${userLongitude}&radius=${radius}`;

    logMessage(`🌍 API Request URL: ${url}`);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        logMessage("✅ Received response from OpenStreetMap API.");
        resultsList.innerHTML = "";
        if (data.length > 0) {
            data.forEach(place => {  
                let listItem = document.createElement("li");
                listItem.textContent = `${place.display_name}`;
                resultsList.appendChild(listItem);
                logMessage(`📍 Found: ${place.display_name}`);
            });
        } else {
            logMessage("❌ No restaurants found near your location.");
            resultsList.innerHTML = "❌ No restaurants found near your location.";
        }
    })
    .catch(error => {
        logMessage(`❌ Error fetching restaurant data: ${error.message}`);
        resultsList.innerHTML = "❌ Error fetching restaurant data.";
    });
}
