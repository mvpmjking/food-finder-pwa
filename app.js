if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}

let userLatitude, userLongitude;

function getLocation() {
    console.log("Getting location...");
    const status = document.getElementById("status");
    status.textContent = "Locating…";

    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser.";
        console.error("Geolocation not supported");
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    userLatitude  = position.coords.latitude;
    userLongitude = position.coords.longitude;
    
    console.log("Location found:", userLatitude, userLongitude);
    document.getElementById("status").textContent = "Location found. Select your preferences.";
    document.getElementById("preferences").style.display = "block";
}

function error(err) {
    console.error("Error retrieving location:", err);
    document.getElementById("status").textContent = "Unable to retrieve your location.";
}

// Directly use API key for faster performance
const googleApiKey = "AIzaSyAB-y19t010bAMA_R1vaxmlhuaO-74fKNg";

async function searchRestaurants() {
    console.log("Searching for restaurants...");
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    // Reduce radius to 3 miles (4828 meters) for faster search
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLatitude},${userLongitude}&radius=4828&type=restaurant&keyword=${foodType}&key=${googleApiKey}`;

    console.log("API Request URL:", url);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("Received response from Google API:", data);
        resultsList.innerHTML = "";
        if (data.results && data.results.length > 0) {
            data.results.slice(0, 5).forEach(place => {  // Limit to top 5 results for speed
                let listItem = document.createElement("li");
                listItem.textContent = `${place.name} - Rating: ${place.rating}`;
                resultsList.appendChild(listItem);
            });
        } else {
            resultsList.innerHTML = "No restaurants found matching your criteria.";
        }
    })
    .catch(error => {
        console.error("Error fetching restaurant data:", error);
        resultsList.innerHTML = "Error fetching restaurant data.";
    });
}
