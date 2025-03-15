if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}

let userLatitude, userLongitude;

// Fetch API Key from Server
async function getApiKey() {
    return fetch('/secrets')
        .then(response => response.json())
        .then(data => data.FOURSQUARE_API_KEY)
        .catch(error => {
            console.error("❌ Error fetching API Key:", error);
            return null;
        });
}

function logMessage(message) {
    const logArea = document.getElementById("debug-log");
    if (logArea) {
        logArea.innerHTML += `<p>${message}</p>`;
    }
    console.log(message);
}

function getLocation() {
    logMessage("📍 Getting location...");
    const status = document.getElementById("status");
    status.textContent = "Locating…";

    if (!navigator.geolocation) {
        status.textContent = "❌ Geolocation not supported by your browser.";
        logMessage("❌ Geolocation not supported.");
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

// Foursquare Places API - Fetch Nearby Restaurants
async function searchRestaurants() {
    logMessage("🔍 Searching for nearby restaurants...");
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "<p>⏳ Searching for restaurants...</p>";

    if (!userLatitude || !userLongitude) {
        logMessage("❌ Error: Location not found before searching.");
        resultsList.innerHTML = "❌ Error: Location not found.";
        return;
    }

    // Get API Key securely
    const foursquareApiKey = await getApiKey();
    if (!foursquareApiKey) {
        logMessage("❌ API Key could not be retrieved.");
        resultsList.innerHTML = "❌ API Key error.";
        return;
    }

    const radius = 5000; // Search within 5km (3 miles)
    const url = `https://api.foursquare.com/v3/places/search?query=${foodType}&ll=${userLatitude},${userLongitude}&radius=${radius}&limit=5`;

    logMessage(`🌍 API Request URL: <br> <a href="${url}" target="_blank">${url}</a>`);

    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": foursquareApiKey
        }
    })
    .then(response => {
        logMessage("✅ API request sent. Waiting for response...");
        return response.json();
    })
    .then(data => {
        logMessage("✅ Received response from Foursquare API.");
        resultsList.innerHTML = "";
        if (data.results && data.results.length > 0) {
            logMessage(`✅ Found ${data.results.length} places.`);
            data.results.forEach(place => {  
                let listItem = document.createElement("li");
                listItem.textContent = `${place.name} - ${place.location.address}`;
                resultsList.appendChild(listItem);
                logMessage(`📍 Found: ${place.name} (${place.location.address})`);
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
