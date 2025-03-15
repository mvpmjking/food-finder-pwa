async function getGoogleApiKey() {
    const response = await fetch('/google-key');
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
