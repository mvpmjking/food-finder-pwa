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

// Overpass Turbo API - Free, No API Key Needed
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

    const radius = 5000; // Search within 5km (3 miles)
    
    // Overpass Turbo query to find restaurants near the user
    const overpassQuery = `
        [out:json];
        node["amenity"="restaurant"](around:${radius},${userLatitude},${userLongitude});
        out;
    `;

    const overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    logMessage(`🌍 API Request URL: <br> <a href="${overpassURL}" target="_blank">${overpassURL}</a>`);

    fetch(overpassURL)
    .then(response => {
        logMessage("✅ API request sent. Waiting for response...");
        return response.json();
    })
    .then(data => {
        logMessage("✅ Received response from Overpass Turbo API.");
        resultsList.innerHTML = "";
        if (data.elements && data.elements.length > 0) {
            logMessage(`✅ Found ${data.elements.length} places.`);
            data.elements.forEach(place => {  
                let listItem = document.createElement("li");
                listItem.textContent = `${place.tags.name || "Unnamed Restaurant"}`;
                resultsList.appendChild(listItem);
                logMessage(`📍 Found: ${place.tags.name || "Unnamed Restaurant"}`);
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
