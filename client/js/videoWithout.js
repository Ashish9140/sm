(function () {
    let videoWithoutAudio = document.querySelector(".videoWithoutAudioCtr");
    let recordVideoWithout = document.querySelector(".videoWithoutAudio-sec-btn");
    let videoWithoutBtn = document.querySelector(".video-rec-withoutAudio");
    let durationBtn = document.querySelector(".videoWithout-duration");

    let duration = 0;
    let interval;

    async function videoWithoutAudioCall() {
        await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
            .then(function (mediaStreamObj) {

                // buttons
                let videoPause = document.getElementById('videobtnPauseReco');
                let videoResume = document.getElementById('videobtnResumeReco');
                let videoStop = document.getElementById('videobtnStopReco');
                videoResume.style.display = "none";
                videoPause.style.display = "inline-block";
                videoStop.style.display = "inline-block";

                // getting media tracks
                let videoTrackWithoutAudio = mediaStreamObj.getTracks();
                // Chunk array to store the audio data
                let _recordedChunks = [];
                videoWithoutAudio.srcObject = mediaStreamObj;
                videoWithoutBtn.style.display = "none";
                recordVideoWithout.style.display = "flex";

                // setup media recorder 
                let mediaRecorder = new MediaRecorder(mediaStreamObj);
                runInterval();

                // Start event
                mediaRecorder.start();
                videoPause.addEventListener('click', () => { mediaRecorder.pause(); });
                videoResume.addEventListener('click', () => { mediaRecorder.resume(); });
                videoStop.addEventListener('click', () => { mediaRecorder.stop(); });

                // If audio data available then push
                // it to the chunk array
                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0)
                        _recordedChunks.push(e.data);
                }
                mediaRecorder.onpause = async () => {
                    videoPause.style.display = "none";
                    videoResume.style.display = "inline-block";
                    clearInterval(interval);
                };
                mediaRecorder.onresume = async () => {
                    videoResume.style.display = "none";
                    videoPause.style.display = "inline-block";
                    videoStop.style.display = "inline-block";
                    runInterval();
                };

                // Convert the audio data in to blob
                // after stopping the recording
                mediaRecorder.onstop = async function (ev) {
                    videoTrackWithoutAudio.forEach((track) => {
                        track.stop();
                    });
                    clearInterval(interval);
                    videoWithoutBtn.style.display = "inline-block";
                    recordVideoWithout.style.display = "none";
                    var blob = new Blob(_recordedChunks, { type: 'video/mp4' });
                    let url = window.URL.createObjectURL(blob);
                    // take file input
                    let fileName = prompt("Enter file name", "my-video");

                    // save audio file
                    let date = formatDate();
                    let time = formatTime();

                    const formData = new FormData();
                    formData.append("videowithout", blob);
                    formData.append("filename", fileName);
                    formData.append("date", date);
                    formData.append("time", time);
                    formData.append("latitude", lat);
                    formData.append("longitude", long);
                    formData.append("altitude", alt);
                    formData.append("duration", duration);
                    formData.append("alias", aliasCodeName);

                    fetch(`${baseURL}/videowithout`, {
                        method: 'POST',
                        body: formData
                    }).then((response) => response.json())
                        .then((data) => console.log(data));

                    videoWithoutAudio.srcObject = null;
                }
            })

            // If any error occurs then handles the error
            .catch(function (err) {
                console.log(err.name, err.message);
            });
    }

    videoWithoutBtn.addEventListener("click", async () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        videoWithoutAudioCall();
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
