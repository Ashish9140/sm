(async function () {

    let screenWithAudio = document.querySelector(".screenWithAudioCtr");
    let recordScreenWith = document.querySelector(".screenWithAudio-sec-btn");
    let screenWithBtn = document.querySelector(".screen-rec-withAudio");
    let durationBtn = document.querySelector(".screenWithAudio-duration");

    let duration = 0;
    let interval;

    async function screenReco() {
        await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen',
            },
            audio: true,
        }).then(async (e) => {

            // For recording the mic audio
            let audio = await navigator.mediaDevices.getUserMedia({
                audio: true, video: false
            })


            // Combine both video/audio stream with MediaStream object
            let mediaStreamObj = new MediaStream(
                [...e.getTracks(), ...audio.getTracks()])

            // buttons
            let screenWithAudioPause = document.getElementById('screenWithAudiobtnPauseReco');
            let screenWithAudioResume = document.getElementById('screenWithAudiobtnResumeReco');
            let screenWithAudioStop = document.getElementById('screenWithAudiobtnStopReco');


            let lat, long;
            getPosition().then((pos) => {
                lat = pos.coords.latitude;
                long = pos.coords.longitude;
            })

            screenWithAudioResume.style.display = "none";
            screenWithAudioPause.style.display = "inline-block";
            screenWithAudioStop.style.display = "inline-block";

            // Chunk array to store the audio data
            let _recordedChunks = [];
            screenWithAudio.srcObject = mediaStreamObj;
            screenWithBtn.style.display = "none";
            recordScreenWith.style.display = "flex";

            // getting media tracks
            let screenTrackWithAudio = e.getTracks();
            let audioTracks = audio.getTracks();

            runInterval();

            // setup media recorder 
            let mediaRecorder = new MediaRecorder(mediaStreamObj);

            // Start event
            mediaRecorder.start();
            screenWithAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
            screenWithAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
            screenWithAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

            // If audio data available then push
            // it to the chunk array
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0)
                    _recordedChunks.push(e.data);
            }
            mediaRecorder.onpause = async () => {
                screenWithAudioPause.style.display = "none";
                screenWithAudioResume.style.display = "inline-block";
                clearInterval(interval);
            };
            mediaRecorder.onresume = async () => {
                screenWithAudioResume.style.display = "none";
                screenWithAudioPause.style.display = "inline-block";
                screenWithAudioStop.style.display = "inline-block";
                runInterval();
            };

            // Convert the audio data in to blob
            // after stopping the recording
            mediaRecorder.onstop = async function (ev) {
                screenTrackWithAudio.forEach((track) => {
                    track.stop();
                });
                audioTracks.forEach((track) => {
                    track.stop();
                });
                clearInterval(interval);
                screenWithBtn.style.display = "inline-block";
                recordScreenWith.style.display = "none";
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
                formData.append("screenwith", blob);
                formData.append("filename", fileName);
                formData.append("date", date);
                formData.append("time", time);
                formData.append("latitude", lat);
                formData.append("longitude", long);
                formData.append("duration", duration);
                formData.append("alias", aliasCodeName);

                fetch('https://sm-q7uq.onrender.com/screenwith', {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json())
                    .then((data) => console.log(data));

                screenWithAudio.srcObject = null;
            }
        })
            // If any error occurs then handles the error
            .catch(function (err) {
                console.log(err.name, err.message);

            });
    }

    document.querySelector(".screen-rec-withAudio").addEventListener("click", () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        screenReco();
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
