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

function searchRestaurants() {
    const price = document.getElementById("price").value;
    const foodType = document.getElementById("food").value;
    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "Searching for restaurants...";

    const url = `https://api.yelp.com/v3/businesses/search?term=${foodType}&latitude=${userLatitude}&longitude=${userLongitude}&radius=8047&price=${price}&categories=restaurants&limit=5`;

    fetch(url, {
        headers: {
            'Authorization': 'Bearer YOUR_YELP_API_KEY' // Replace with your API key
        }
    })
    .then(response => response.json())
    .then(data => {
        resultsList.innerHTML = "";
        if (data.businesses && data.businesses.length > 0) {
            data.businesses.forEach(business => {
                let listItem = document.createElement("li");
                listItem.textContent = `${business.name} - ${business.location.address1}, ${business.rating} stars`;
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
