(function () {
    let videoWithAudio = document.querySelector(".videoWithAudioCtr");
    let recordVideoWith = document.querySelector(".videoWithAudio-sec-btn");
    let videoWithBtn = document.querySelector(".video-rec-withAudio");
    let durationBtn = document.querySelector(".videoWithAudio-duration");

    let duration = 0;
    let interval;

    async function videoWithAudioCall() {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(function (mediaStreamObj) {

                // buttons
                let videoWithAudioPause = document.getElementById('videoWithAudiobtnPauseReco');
                let videoWithAudioResume = document.getElementById('videoWithAudiobtnResumeReco');
                let videoWithAudioStop = document.getElementById('videoWithAudiobtnStopReco');

                // getting media tracks
                let videoTrackWithAudio = mediaStreamObj.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                videoWithAudio.srcObject = mediaStreamObj;
                videoWithBtn.style.display = 'none';
                recordVideoWith.style.display = 'flex';
                runInterval();
                // setup media recorder 
                let mediaRecorder = new MediaRecorder(mediaStreamObj);

                // Start event
                mediaRecorder.start();
                videoWithAudioPause.addEventListener('click', () => { mediaRecorder.pause(); });
                videoWithAudioResume.addEventListener('click', () => { mediaRecorder.resume(); });
                videoWithAudioStop.addEventListener('click', () => { mediaRecorder.stop(); });

                // If audio data available then push
                // it to the chunk array
                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    videoWithAudioPause.style.display = "none";
                    videoWithAudioResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    videoWithAudioResume.style.display = "none";
                    videoWithAudioPause.style.display = "inline-block";
                    videoWithAudioStop.style.display = "inline-block";
                    runInterval();
                };

                // Convert the audio data in to blob
                // after stopping the recording
                mediaRecorder.onstop = async function (ev) {
                    videoTrackWithAudio.forEach((track) => {
                        track.stop();
                    });
                    duration;
                    clearInterval(interval);
                    videoWithBtn.style.display = 'inline-block';
                    recordVideoWith.style.display = 'none';
                    var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                    let url = window.URL.createObjectURL(blob);
                    // take file input
                    let fileName = prompt("Enter file name", "my-video");

                    // save audio file
                    let date = formatDate();
                    let time = formatTime();

                    const formData = new FormData();
                    formData.append("videowith", blob);
                    formData.append("filename", fileName);
                    formData.append("date", date);
                    formData.append("time", time);
                    formData.append("latitude", lat);
                    formData.append("longitude", long);
                    formData.append("duration", duration);
                    formData.append("altitude", alt);
                    formData.append("alias", aliasCodeName);

                    fetch(`${baseURL}/videowith`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => console.log(data));

                    videoWithAudio.srcObject = null;
                }
            })

            // If any error occurs then handles the error
            .catch(function (err) {
                console.log(err.name, err.message);
            });
    }

    videoWithBtn.addEventListener("click", async () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        videoWithAudioCall();
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



