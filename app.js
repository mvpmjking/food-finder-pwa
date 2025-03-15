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
        logMessage("Geolocation not supported");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    userLatitude  = position.coords.latitude;
    userLongitude = position.coords.longitude;
    
    logMessage(`Location found: ${userLatitude}, ${userLongitude}`);
    document.getElementById("status").textContent = "Location found. Select your preferences.";
    document.getElementById("preferences").style.display = "block";
}

function error(err) {
    logMessage(`Error retrieving location: ${err.message}`);
    document.getElementById("status").textContent = "Unable to retrieve your location.";
}

// OpenStreetMap (Nominatim) API - Now Filtering by Location
async function searchRestaurants() {
    logMessage("Searching for nearby restaurants...");
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    if (!userLatitude || !userLongitude) {
        logMessage("Error: Location not found before searching.");
        resultsList.innerHTML = "Error: Location not found.";
        return;
    }

    // Define a search area (bounding box) around the user's location
    const latMin = userLatitude - 0.05;
    const latMax = userLatitude + 0.05;
    const lonMin = userLongitude - 0.05;
    const lonMax = userLongitude + 0.05;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${foodType}&bounded=1&viewbox=${lonMin},${latMin},${lonMax},${latMax}&limit=5`;

    logMessage(`API Request URL: ${url}`);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        logMessage("Received response from OpenStreetMap API.");
        resultsList.innerHTML = "";
        if (data.length > 0) {
            data.forEach(place => {  
                let listItem = document.createElement("li");
                listItem.textContent = `${place.display_name}`;
                resultsList.appendChild(listItem);
                logMessage(`Found: ${place.display_name}`);
            });
        } else {
            logMessage("No restaurants found near your location.");
            resultsList.innerHTML = "No restaurants found near your location.";
        }
    })
    .catch(error => {
        logMessage(`Error fetching restaurant data: ${error.message}`);
        resultsList.innerHTML = "Error fetching restaurant data.";
    });
}
