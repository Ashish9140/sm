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
                ip: user.ip,
                iptype: user.iptype,
                searchname: user.name,
                searchtype: user.type,
                searchversion: user.version,
                devicebrand: user.device.brand,
                devicetype: user.device.type,
                devicename: user.device.name,
                osname: user.os.name,
                ostype: user.os.type,
            })
        }).then((response) => response.json())
            .then((data) => console.log(data));
    })

})();
