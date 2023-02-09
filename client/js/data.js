let getData = document.querySelector('.alias-recording');
let cnt = document.querySelector(".container");
let dataCnt = document.querySelector(".data");
let cardCnt = document.querySelector(".cards");

getData.addEventListener('click', async () => {
    cnt.style.display = 'none';
    dataCnt.style.display = 'inline-block';
    fetch(`${baseURL}/aliasdata`, {
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
            cardCnt.innerHTML = '';
            files.forEach(file => {
                if (file.filetype !== 'take photo' && file.filetype !== 'geo-snap' && file.filetype !== 'take snap') {
                    let div = document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML = `<div class="cardInfo">
                <p><span class="bold">aliascode : </span>${file.alias}</p>
                <p><span class="bold">file : </span>{ type : ${file.filetype}, name : ${file.filename}, duration : ${file.duration} seconds }</p>
                <p><span class="bold">filepath : </span><a href="${baseURL}/${file.filepath}" target="_blank">${file.filepath}</a></p>
                <p><span class="bold">time_zone : </span>{ date: ${file.date}, time : ${file.time} }</p>
                <p><span class="bold">location : </span>{ lat : ${file.latitude}, long : ${file.longitude} }</p>
                <p><span class="bold">ip : </span>{ address : ${file.user.ip}, type : ${file.user.iptype} }</p>
                <p><span class="bold">os : </span>{ address : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                <p><span class="bold">search : </span>{ browser : ${file.user.name}, type : ${file.user.type} }</p>
                <p><span class="bold">device : </span>{ brand : ${file.user.device.brand}, name : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                </div>`;
                    cardCnt.appendChild(div);
                }
                else if (file.filetype === 'geo-snap') {
                    let div = document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML = `<div class="cardInfo">
                <p><span class="bold">aliascode : </span>${file.alias}</p>
                <p><span class="bold">file : </span>{ type : ${file.filetype}, name : ${file.filename} }</p>
                <p><span class="bold">time_zone : </span>{ date: ${file.date}, time : ${file.time} }</p>
                <p><span class="bold">location : </span>{ lat : ${file.latitude}, long : ${file.longitude} }</p>
                <p><span class="bold">ip : </span>{ address : ${file.user.ip}, type : ${file.user.iptype} }</p>
                <p><span class="bold">os : </span>{ name : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                <p><span class="bold">search : </span>{ browser : ${file.user.name}, type : ${file.user.type} }</p>
                <p><span class="bold">device : </span>{ brand : ${file.user.device.brand}, name : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                </div>`;
                    cardCnt.appendChild(div);
                }
                else {
                    let div = document.createElement('div');
                    div.classList.add('card');
                    div.innerHTML = `<div class="cardInfo">
                <p><span class="bold">aliascode : </span>${file.alias}</p>
                <p><span class="bold">file : </span>{ type : ${file.filetype}, name : ${file.filename} }</p>
                <p><span class="bold">filepath : </span><a href="${baseURL}/${file.filepath}" target="_blank">${file.filepath}</a></p>
                <p><span class="bold">time_zone : </span>{ date: ${file.date}, time : ${file.time} }</p>
                <p><span class="bold">location : </span>{ lat : ${file.latitude}, long : ${file.longitude} }</p>
                <p><span class="bold">ip : </span>{ address : ${file.user.ip}, type : ${file.user.iptype} }</p>
                <p><span class="bold">os : </span>{ address : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                <p><span class="bold">search : </span>{ browser : ${file.user.name}, type : ${file.user.type} }</p>
                <p><span class="bold">device : </span>{ brand : ${file.user.device.brand}, name : ${file.user.os.name}, type : ${file.user.os.type} }</p>
                </div>`;
                    cardCnt.appendChild(div);
                }
            });
        });
})

document.querySelector('.getBack').addEventListener('click', () => {
    cnt.style.display = 'flex';
    dataCnt.style.display = 'none';
})