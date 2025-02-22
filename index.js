let peer;
let myStream;
let currentCall;

function ajoutVideo(stream) {
    try {
        var video = document.createElement('video');
        document.getElementById('participants').appendChild(video);
        video.autoplay = true;
        video.controls = true;
        video.srcObject = stream;
    } catch (error) {
        console.error(error);
    }
}

function register() {
    var name = document.getElementById('name').value;
    try {
        peer = new Peer(name);
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            myStream = stream;
            ajoutVideo(stream);
            document.getElementById('register').style.display = 'none';
            document.getElementById('userAdd').style.display = 'block';
            document.getElementById('userShare').style.display = 'block';
            document.getElementById('endCall').style.display = 'block'; // Le bouton apparaît maintenant

            peer.on('call', function(call) {
                call.answer(myStream);
                currentCall = call;
                call.on('stream', function(remoteStream) {
                    ajoutVideo(remoteStream);
                });
            });
        }, function(err) {
            console.log('Failed to get local stream', err);
        });
    } catch (error) {
        console.error(error);
    }
}

function appelUser() {
    try {
        var name = document.getElementById('add').value;
        document.getElementById('add').value = "";
        var call = peer.call(name, myStream);
        currentCall = call;
        call.on('stream', function(remoteStream) {
            ajoutVideo(remoteStream);
        });
    } catch (error) {
        console.error(error);
    }
}

function addScreenShare() {
    var name = document.getElementById('share').value;
    document.getElementById('share').value = "";
    navigator.mediaDevices.getDisplayMedia({video: {cursor: "always"}, audio: true})
    .then((stream) => {
        let call = peer.call(name, stream);
        currentCall = call;
    });
}

function endCall() {
    if (currentCall) {
        currentCall.close(); // Terminer l'appel
        document.getElementById('participants').innerHTML = ""; // Effacer les vidéos
        document.getElementById('endCall').style.display = 'none'; // Cacher le bouton après l'appel
    }
    if (myStream) {
        myStream.getTracks().forEach(track => track.stop()); // Arrêter les flux locaux
    }

    // Retour à l'écran d'inscription
    document.getElementById('register').style.display = 'block'; // Afficher l'écran d'inscription
    document.getElementById('userAdd').style.display = 'none'; // Cacher la section de connexion
    document.getElementById('userShare').style.display = 'none'; // Cacher la section de partage d'écran
}
