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

// Directly use API key for faster performance
const googleApiKey = "AIzaSyAB-y19t010bAMA_R1vaxmlhuaO-74fKNg";

async function searchRestaurants() {
    logMessage("Searching for restaurants...");
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    if (!userLatitude || !userLongitude) {
        logMessage("Error: Location not found before searching.");
        resultsList.innerHTML = "Error: Location not found.";
        return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLatitude},${userLongitude}&radius=4828&type=restaurant&keyword=${foodType}&key=${googleApiKey}`;
    
    logMessage(`API Request URL: ${url}`);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        logMessage("Received response from Google API.");
        resultsList.innerHTML = "";
        if (data.results && data.results.length > 0) {
            data.results.slice(0, 5).forEach(place => {
                let listItem = document.createElement("li");
                listItem.textContent = `${place.name} - Rating: ${place.rating}`;
                resultsList.appendChild(listItem);
                logMessage(`Found: ${place.name} (Rating: ${place.rating})`);
            });
        } else {
            logMessage("No restaurants found matching your criteria.");
            resultsList.innerHTML = "No restaurants found matching your criteria.";
        }
    })
    .catch(error => {
        logMessage(`Error fetching restaurant data: ${error.message}`);
        resultsList.innerHTML = "Error fetching restaurant data.";
    });
}
