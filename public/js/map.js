document.addEventListener('DOMContentLoaded', function () {
  const mapDiv = document.getElementById('map');
  const latitude = parseFloat(mapDiv.dataset.latitude);
  const longitude = parseFloat(mapDiv.dataset.longitude);
  const title = mapDiv.dataset.title || "Listing Location";

  const map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map)
    .bindPopup(`<h4>${title}</h4><p>Location will be provided after booking</p>`)
    .openPopup();
});
