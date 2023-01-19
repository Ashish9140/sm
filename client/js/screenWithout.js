(function () {
    let screenWithoutAudio = document.querySelector(".screenWithoutAudioCtr");
    let recordScreenWithout = document.querySelector(".screenWithoutAudio-sec-btn");
    let screenWithoutBtn = document.querySelector(".screen-rec-withoutAudio");
    let durationBtn = document.querySelector(".screenWithoutAudio-duration");

    let duration = 0;
    let interval;


    // Navigator audio stream
    async function screenReco2() {
        await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
            },
            audio: true,
        }).then(async (mediaStreamObj) => {

            // buttons
            let screenWithoutAudioPause = document.getElementById('screenWithoutAudiobtnPauseReco');
            let screenWithoutAudioResume = document.getElementById('screenWithoutAudiobtnResumeReco');
            let screenWithoutAudioStop = document.getElementById('screenWithoutAudiobtnStopReco');


            let lat, long;
            getPosition().then((pos) => {
                lat = pos.coords.latitude;
                long = pos.coords.longitude;
            })


            // starting actions of buttons
            screenWithoutAudioResume.style.display = "none";
            screenWithoutAudioPause.style.display = "inline-block";
            screenWithoutAudioStop.style.display = "inline-block";

            // Chunk array to store the audio data
            let _recordedChunks = [];
            screenWithoutAudio.srcObject = mediaStreamObj;
            screenWithoutBtn.style.display = "none";
            recordScreenWithout.style.display = "flex";

            // getting media tracks
            let screenTrackWithoutAudio = mediaStreamObj.getTracks();

            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);
            runInterval();

            // Start event
            mediaRecorder.start();
            screenWithoutAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
            screenWithoutAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
            screenWithoutAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

            // If audio data available then push
            // it to the chunk array
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                screenWithoutAudioPause.style.display = "none";
                screenWithoutAudioResume.style.display = "inline-block";
                clearInterval(interval);
            };
            mediaRecorder.onresume = async () => {
                screenWithoutAudioResume.style.display = "none";
                screenWithoutAudioPause.style.display = "inline-block";
                screenWithoutAudioStop.style.display = "inline-block";
                runInterval();
            };

            // Convert the audio data in to blob
            // after stopping the recording
            mediaRecorder.onstop = async function (ev) {
                screenTrackWithoutAudio.forEach((track) => {
                    track.stop();
                });
                clearInterval(interval);
                screenWithoutBtn.style.display = "inline-block";
                recordScreenWithout.style.display = "none";
                var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                let url = window.URL.createObjectURL(blob);
                // take file input
                let fileName = prompt("Enter file name", "my-screen");

                // save file
                let date = formatDate();
                let time = formatTime();

                if (lat === undefined) {
                    let pos = await getPosition();
                    lat = pos.coords.latitude;
                    long = pos.coords.longitude;
                }
                const formData = new FormData();
                formData.append("screenwithout", blob);
                formData.append("filename", fileName);
                formData.append("date", date);
                formData.append("time", time);
                formData.append("latitude", lat);
                formData.append("longitude", long);
                formData.append("duration", duration);
                formData.append("alias", aliasCodeName);

                fetch('https://sm-q7uq.onrender.com/screenwithout', {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json())
                    .then((data) => console.log(data));

                screenWithoutAudio.srcObject = null;
            }
        })
            // If any error occurs then handles the error
            .catch(function (err) {
                console.log(err.name, err.message);

            });
    }


    document.querySelector(".screen-rec-withoutAudio").addEventListener("click", () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        screenReco2();
    })

    function runInterval() {
        interval = setInterval(() => {
            duration++;
            if (duration < 10)
                durationBtn.innerHTML = `00:0${duration}`;
            else if (duration < 60)
                durationBtn.innerHTML = `00:${duration}`;
            else
                durationBtn.innerHTML = `0${duration / 60}:${duration % 60}`;

        }, 1000);
    }

})();
