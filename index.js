let peer;
let myStream;
let currentCall;

function ajoutVideo(stream) {
    let video = document.createElement('video');
    document.getElementById('participants').appendChild(video);
    video.autoplay = true;
    video.controls = true;
    video.srcObject = stream;
}

function register() {
    let name = document.getElementById('name').value;
    if (!name) return; // Empêche de valider si le champ est vide

    peer = new Peer(name);

    peer.on('open', () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myStream = stream;
                ajoutVideo(stream);

                // Masquer l'écran d'inscription et afficher l'appel
                document.getElementById('register').style.display = 'none';
                document.getElementById('callInterface').style.display = 'block';

                // Écouter les appels entrants
                peer.on('call', call => {
                    call.answer(myStream);
                    currentCall = call;
                    call.on('stream', remoteStream => {
                        ajoutVideo(remoteStream);
                    });
                });

            }).catch(err => {
                console.error('Erreur d’accès à la caméra/micro:', err);
            });
    });
}

function addScreenShare() {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(screenStream => {
            let call = peer.call(peer.id, screenStream);
            currentCall = call;
        })
        .catch(err => {
            console.error("Erreur lors du partage d'écran :", err);
        });
}

function endCall() {
    if (currentCall) {
        currentCall.close();
        document.getElementById('participants').innerHTML = ""; // Supprimer les vidéos
    }
    if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
    }

    // Retour à l'écran d'accueil
    document.getElementById('register').style.display = 'block';
    document.getElementById('callInterface').style.display = 'none';
}
