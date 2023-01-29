(function () {

    document.querySelector('.geo-snap').addEventListener("click", () => {
        let fileName = prompt("Enter file name", "file");

        let date = formatDate();
        let time = formatTime();

        fetch(`${baseURL}/geo-snap`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                filename: fileName, date, time, latitude: lat, longitude: long, altitude: alt, alias: aliasCodeName,
            })
        }).then((response) => response.json())
            .then((data) => console.log(data));
    })

})();
