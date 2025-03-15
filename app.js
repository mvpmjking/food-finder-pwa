if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker Registered'));
}

let userLatitude, userLongitude;

function getLocation() {
    const status = document.getElementById("status");
    status.textContent = "Locating…";

    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser.";
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    userLatitude  = position.coords.latitude;
    userLongitude = position.coords.longitude;
    
    document.getElementById("status").textContent = "Location found. Select your preferences.";
    document.getElementById("preferences").style.display = "block";
}

function error() {
    document.getElementById("status").textContent = "Unable to retrieve your location.";
}

// Fetch the Google API key securely
async function getGoogleApiKey() {
    const response = await fetch('/google-key'); // This assumes you have a server-side endpoint
    const data = await response.json();
    return data.GOOGLE_API_KEY;
}

async function searchRestaurants() {
    const price = document.getElementById("price").value;
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    const googleApiKey = await getGoogleApiKey();
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLatitude},${userLongitude}&radius=8047&type=restaurant&keyword=${foodType}&minprice=${price}&key=${googleApiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        resultsList.innerHTML = "";
        if (data.results && data.results.length > 0) {
            data.results.forEach(place => {
                let listItem = document.createElement("li");
                listItem.textContent = `${place.name} - Rating: ${place.rating}`;
                resultsList.appendChild(listItem);
            });
        } else {
            resultsList.innerHTML = "No restaurants found matching your criteria.";
        }
    })
    .catch(error => {
        resultsList.innerHTML = "Error fetching restaurant data.";
    });
}
