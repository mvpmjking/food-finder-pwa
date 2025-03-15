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
