var aliasCodeName = "xyz";
var baseURL = "https://sm-q7uq.onrender.com";
var lat;
var long;
var alt = 22;

function aliasCode() {
    aliasCodeName = prompt("Enter Alias Code", "abc");
    document.querySelector(".container").style.display = "flex";
    document.querySelector(".alias-code").innerHTML = `Alias Code - ${aliasCodeName}`;
}
aliasCode();

function formatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '/' + month + '/' + year;
}

function formatTime() {
    let d = new Date();
    function pad(n) { return n < 10 ? '0' + n : n }
    return [pad(d.getHours()), ':',
    pad(d.getMinutes()), ':',
    pad(d.getSeconds())].join("");
}

function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

getPosition().then((pos) => {
    lat = pos.coords.latitude;
    long = pos.coords.longitude;
    // fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat}, ${long}`).then((response) => response.json())
    //     .then((data) => {
    //         alt = data.results[0].elevation;
    console.log(lat, long, alt);
    // });
})

// const main = async () => {
//     let pos = await getPosition();
//     lat = pos.coords.latitude;
//     long = pos.coords.longitude;
//     console.log(lat, long);
// }

// for (let i = 0; i < 10; i++) {
//     main();
// }