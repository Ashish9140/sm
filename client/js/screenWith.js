(async function () {

    let screenWithAudio = document.querySelector(".screenWithAudioCtr");
    let recordScreenWith = document.querySelector(".screenWithAudio-sec-btn");
    let screenWithBtn = document.querySelector(".screen-rec-withAudio");
    let durationBtn = document.querySelector(".screenWithAudio-duration");

    let duration = 0;
    let interval;

    function shareScreen() {
        var screenConstraints = { video: true, audio: true };
        navigator.mediaDevices.getDisplayMedia(screenConstraints).then(function (screenStream) {
            /* use the screen & audio stream */

            var micConstraints = { audio: true };
            navigator.mediaDevices.getUserMedia(micConstraints).then(function (micStream) {
                /* use the microphone stream */

                //create a new stream in which to pack everything together
                var mediaStreamObj = new MediaStream();

                //add the screen video stream
                screenStream.getVideoTracks().forEach(function (videoTrack) {
                    mediaStreamObj.addTrack(videoTrack);
                });

                //create new Audio Context
                var context = new AudioContext();

                //create new MediaStream destination. This is were our final stream will be.
                var audioDestinationNode = context.createMediaStreamDestination();

                //check to see if we have a screen stream and only then add it
                if (screenStream && screenStream.getAudioTracks().length > 0) {
                    //get the audio from the screen stream
                    const systemSource = context.createMediaStreamSource(screenStream);

                    //set it's volume (from 0.1 to 1.0)
                    const systemGain = context.createGain();
                    systemGain.gain.value = 1.0;

                    //add it to the destination
                    systemSource.connect(systemGain).connect(audioDestinationNode);

                }

                //check to see if we have a microphone stream and only then add it
                if (micStream && micStream.getAudioTracks().length > 0) {
                    //get the audio from the microphone stream
                    const micSource = context.createMediaStreamSource(micStream);

                    //set it's volume
                    const micGain = context.createGain();
                    micGain.gain.value = 1.0;

                    //add it to the destination
                    micSource.connect(micGain).connect(audioDestinationNode);
                }

                //add the combined audio stream
                audioDestinationNode.stream.getAudioTracks().forEach(function (audioTrack) {
                    mediaStreamObj.addTrack(audioTrack);
                });

                // getting media tracks
                let screenTrackWithAudio = screenStream.getTracks();
                let audioTracks = micStream.getTracks();

                {
                    // buttons
                    let screenWithAudioPause = document.getElementById('screenWithAudiobtnPauseReco');
                    let screenWithAudioResume = document.getElementById('screenWithAudiobtnResumeReco');
                    let screenWithAudioStop = document.getElementById('screenWithAudiobtnStopReco');

                    screenWithAudioResume.style.display = "none";
                    screenWithAudioPause.style.display = "inline-block";
                    screenWithAudioStop.style.display = "inline-block";

                    // Chunk array to store the audio data
                    let _recordedChunks = [];
                    screenWithAudio.srcObject = mediaStreamObj;
                    screenWithBtn.style.display = "none";
                    recordScreenWith.style.display = "flex";

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

                        const formData = new FormData();
                        formData.append("screenwith", blob);
                        formData.append("filename", fileName);
                        formData.append("date", date);
                        formData.append("time", time);
                        formData.append("latitude", lat);
                        formData.append("longitude", long);
                        formData.append("duration", duration);
                        formData.append("alias", aliasCodeName);

                        formData.append("ip", user.ip);
                        formData.append("iptype", user.iptype);
                        formData.append("devicebrand", user.device.brand);
                        formData.append("devicename", user.device.name);
                        formData.append("devicetype", user.device.type);
                        formData.append("searchname", user.name);
                        formData.append("searchtype", user.type);
                        formData.append("searchversion", user.version);
                        formData.append("osname", user.os.name);
                        formData.append("ostype", user.os.type);

                        fetch(`${baseURL}/screenwith`, {
                            method: 'POST',
                            body: formData
                        }).then((response) => response.json())
                            .then((data) => console.log(data));

                        screenWithAudio.srcObject = null;
                    }
                }

            })
                .catch(function (err) {
                    console.log(err);
                });

        }).catch(function (err) {
            console.log(err);
        });
    }

    document.querySelector(".screen-rec-withAudio").addEventListener("click", () => {
        durationBtn.innerHTML = '00:00';
        duration = 0;
        shareScreen();
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
