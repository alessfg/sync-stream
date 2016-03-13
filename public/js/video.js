
// 2. This code loads the IFrame Player API code asynchronously.
$(document).ready(function() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
// var id = document.getElementById('youtubeID').value;
function id() {
    var s = window.location.href;
    var id = s.substring(s.indexOf('=') + 1, s.length);
    return id;
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: id(), //id,
        events: {
            'onReady':  onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
var stateHistory = ['','','',''];
function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     done = true;
    // }
    var status = player.getPlayerState();
    var statusDecode = ["", "play", "pause", "buffer"];
    stateHistory.shift();
    stateHistory.push(status);
    var time = player.getCurrentTime();
    if (event.data == YT.PlayerState.PLAYING) {
        // console.log('emit video:play', stateHistory);
        socket.emit('video:play', time);
        if (stateHistory.indexOf(3) != -1 && stateHistory.indexOf(-1) == -1) {
            setTimeout(function() {
                // console.log("delayed emit");
                socket.emit('video:play', time);
            }, 600);
        }
    }
    else if (event.data = YT.PlayerState.PAUSED) {
        // console.log('emit video:pause', stateHistory);
        socket.emit('video:pause', time);
    } 
    prevState = player.getPlayerState();
    return event.data;
}

function resumePlayer() {
    player.playVideo();
    prevState = player.getPlayerState();
}

function pausePlayer() {
    player.pauseVideo();
    prevState = player.getPlayerState();
}

socket.on('video:pause', function(time) {
    pausePlayer();
    player.seekTo(time+0.4, true);
    // console.log('get video:pause', stateHistory);
});

socket.on('video:play', function(time) {
    resumePlayer();
    player.seekTo(time+0.4, true);
    // console.log('get video:play', stateHistory);
});

socket.on('url', function(url) {
    var href = window.location.href;
	var href = href.split('/');
	window.location = href[0] + '//' + href[2] + "/vroom=" + url; 
});