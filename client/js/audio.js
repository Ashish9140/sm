(function () {
    let audio = document.querySelector(".audioCtr");
    let recordAudio = document.querySelector(".audio-sec-btn");
    let audioBtn = document.querySelector(".audio-rec");
    let durationBtn = document.querySelector(".audio-duration");

    let duration = 0;
    let interval;

    async function audioCall() {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(async function (mediaStreamObj) {

                // buttons
                let audioPause = document.getElementById('audiobtnPauseReco');
                let audioResume = document.getElementById('audiobtnResumeReco');
                let audioStop = document.getElementById('audiobtnStopReco');

                audioResume.style.display = "none";
                audioPause.style.display = "inline-block";
                audioStop.style.display = "inline-block";

                // getting media tracks
                audioTracks = mediaStreamObj.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                audio.srcObject = mediaStreamObj;
                audio.defaultMuted = true;
                recordAudio.style.display = "flex";
                audioBtn.style.display = 'none';
                runInterval();
                // setup media recorder 
                let mediaRecorder = new MediaRecorder(mediaStreamObj);

                // Start event
                mediaRecorder.start();
                audioPause.addEventListener('click', () => { mediaRecorder.pause(); });
                audioResume.addEventListener('click', () => { mediaRecorder.resume() });
                audioStop.addEventListener('click', () => { mediaRecorder.stop(); });

                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    audioPause.style.display = "none";
                    audioResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    audioResume.style.display = "none";
                    audioPause.style.display = "inline-block";
                    audioStop.style.display = "inline-block";
                    runInterval();
                };

                mediaRecorder.onstop = async function (ev) {
                    audioTracks.forEach((track) => {
                        track.stop();
                    });
                    clearInterval(interval);
                    recordAudio.style.display = "none";
                    audioBtn.style.display = 'inline-block';
                    let blob = new Blob(_recordedChunks, { type: 'audio/mp3' });
                    // let url = window.URL.createObjectURL(blob);
                    let fileName = prompt("Enter file name", "my-audio");

                    let date = formatDate();
                    let time = formatTime();

                    const formData = new FormData();
                    formData.append("audio", blob);
                    formData.append("filename", fileName);
                    formData.append("date", date);
                    formData.append("time", time);
                    formData.append("latitude", lat);
                    formData.append("longitude", long);
                    formData.append("duration", duration);
                    formData.append("altitude", alt);
                    formData.append("alias", aliasCodeName);


                    fetch(`${baseURL}/audio`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => console.log(data));

                    audio.srcObject = null;
                }
            })
            .catch(function (err) {
                console.log(err.name, err.message);
            });
    }


    audioBtn.addEventListener("click", () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        audioCall();
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


