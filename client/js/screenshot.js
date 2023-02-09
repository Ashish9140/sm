(function () {

    const capture = async () => {
        const video = document.querySelector(".snapCtr");

        try {
            const captureStream = await navigator.mediaDevices.getDisplayMedia();
            video.srcObject = captureStream;
            let audio = new Audio('click.mp3');
            let fileName = prompt("Enter file name", "my-image");
            setTimeout(() => {
                audio.play();
                let canvas = document.createElement('canvas');
                canvas.width = 921;
                canvas.height = 518;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const img = canvas.toDataURL('image/jpeg')

                let date = formatDate();
                let time = formatTime();

                fetch(`${baseURL}/take-snap`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        img, filename: fileName, date, time, latitude: lat, longitude: long, altitude: alt, alias: aliasCodeName,
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


                captureStream.getTracks().forEach((track) => {
                    track.stop();
                });
                video.srcObject = null;

            }, 1000);

        } catch (err) {
            console.error("Error: " + err);
        }
    };


    document.querySelector('.screenshot').addEventListener('click', () => {
        capture();
    })
})();