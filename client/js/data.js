let getData = document.querySelector('.alias-recording');
let cnt = document.querySelector(".container");
let dataCnt = document.querySelector(".data");

getData.addEventListener('click', async () => {
    cnt.style.display = 'none';
    dataCnt.style.display = 'inline-block';
    fetch('https://sm-q7uq.onrender.com/aliasdata', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            alias: aliasCodeName
        })
    }).then((response) => response.json())
        .then((data) => {
            let files = data.file;
            // console.log(files);
            files.forEach(file => {
                if (file.filetype !== 'take photo') {
                    let div = document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML = `<div class="cardInfo">
                <p><span class="bold">aliascode : </span>${file.alias}</p>
                <p><span class="bold">filetype : </span>${file.filetype}</p>
                <p><span class="bold">filepath : </span><a href="https://sm-q7uq.onrender.com/${file.filepath}" target="_blank">${file.filepath}</a></p>
                <p><span class="bold">duration : </span>${file.duration} seconds</p>
                <p><span class="bold">date : </span>${file.date}</p>
                <p><span class="bold">time : </span>${file.time}</p>
                <p><span class="bold">latitude : </span>${file.latitude}</p>
                <p><span class="bold">longitude : </span>${file.longitude}</p>
                </div>`;
                    dataCnt.appendChild(div);
                }
                else {
                    let div = document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML = `<div class="cardInfo">
                <p><span class="bold">aliascode : </span>${file.alias}</p>
                <p><span class="bold">filetype : </span>${file.filetype}</p>
                <p><span class="bold">filepath : </span><a href="https://sm-q7uq.onrender.com/${file.filepath}" target="_blank">${file.filepath}</a></p>
                <p><span class="bold">date : </span>${file.date}</p>
                <p><span class="bold">time : </span>${file.time}</p>
                <p><span class="bold">latitude : </span>${file.latitude}</p>
                <p><span class="bold">longitude : </span>${file.longitude}</p>
                </div>`;
                    dataCnt.appendChild(div);
                }
            });
        });
})

document.querySelector('.getBack').addEventListener('click', () => {
    cnt.style.display = 'flex';
    dataCnt.style.display = 'none';
})