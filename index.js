let peer;
let myStream;
let currentCall;

function ajoutVideo(stream) {
    var video = document.createElement('video');
    document.getElementById('participants').appendChild(video);
    video.autoplay = true;
    video.controls = true;
    video.srcObject = stream;
}

function register() {
    var name = document.getElementById('name').value;
    peer = new Peer(name);

    navigator.getUserMedia({ video: true, audio: true }, function (stream) {
        myStream = stream;
        ajoutVideo(stream);

        document.getElementById('register').style.display = 'none';
        document.getElementById('userAdd').style.display = 'block';
        document.getElementById('controls').style.display = 'block';

        peer.on('call', function (call) {
            call.answer(myStream);
            currentCall = call;
            call.on('stream', function (remoteStream) {
                ajoutVideo(remoteStream);
            });
        });
    }, function (err) {
        console.log('Erreur de capture vidéo/audio', err);
    });
}

function addScreenShare() {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
            let call = peer.call(peer.id, stream);
            currentCall = call;
        })
        .catch((err) => {
            console.error("Erreur lors du partage d'écran :", err);
        });
}

function endCall() {
    if (currentCall) {
        currentCall.close();
        document.getElementById('participants').innerHTML = ""; // Supprime les vidéos
    }
    if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
    }

    // Retour à l'écran d'accueil et suppression de la vidéo
    document.getElementById('register').style.display = 'block';
    document.getElementById('userAdd').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
}



