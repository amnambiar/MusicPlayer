//declaration of global vaariables.
var currentTrack = 0; //current track that is to be played

//array to store track names to display the same.
var track = ['Hydrate', 'Epoq-Lepidoptera', 'Aisa-Jadu', 'Mists-Of-Time', 'Dil-Ka-Rishta', 'Daiya-Daiya-Daiya-Re'];
var audioType = '.mp3'; //audio type

$(document).ready(function() {

    //calculate total number of tracks available in playlist. 
    var totalTracks = $("#playlist ul li").size() - 1;

    //variable to store if track is to be shuffled or not
    var repeatTracks = 0;

    //check if the browser supports the audio type
    if ($("#playerAudio")[0].canPlayType('audio/ogg') === "maybe") {
        audioType = '.ogg'; //For firefox and others who do not support .mp3
    }

    //get back current track value stored in localStorage
    currentTrack = localStorage.getItem("nowPlaying");

    //to be performed on click of play button
    $("#playButton").click(function() {
        if ($("#playerAudio")[0].paused) {
            $("#playerAudio")[0].play();
            $("#playButton").attr("src", "images/PauseIcon.jpg");
        }
        else {
            $("#playerAudio")[0].pause();
            $("#playButton").attr("src", "images/PlayIcon.jpg");
        }
    });

    //to be performed on click of next button
    $("#nextButton").click(function() {
        if (currentTrack < totalTracks) {
            ++currentTrack;
            playCurrentTrack();
        }
        else {
            if (repeatTracks === 1) {
                currentTrack = 0;
                playCurrentTrack();
            }
        }
    });

    //to be performed on click of previous button
    $("#previousButton").click(function() {
        if (currentTrack > 0) {
            --currentTrack;
            playCurrentTrack();
        }
        if (currentTrack === 0) {
            if (repeatTracks === 1) {
                currentTrack = totalTracks;
                playCurrentTrack();
            }
        }
    });

    //to be performed when each song of playlist is clicked.
    $("#playlist ul li").each(function(i) {
        $(this).click(function() {
            currentTrack = i;
            playCurrentTrack();
        });
    });

    //play first track on initial load with help of default global variables
    playCurrentTrack();

    //to seek the progress of current song and display the duration and progress.
    $("#playerAudio")[0].addEventListener("timeupdate", function() {
  
        //$("#playerAudio")[0].currentTime = parseFloat(localStorage.getItem("playTime"));
        
        var duration = $("#playerAudio")[0].duration;           //get duration at initial
        var currentPos = $("#playerAudio")[0].currentTime;      //Get currenttime

        var percentage = 100 * currentPos / duration;           //in %
        var minutes = Math.floor((Math.floor(duration)) / 60);
        var seconds = (Math.round(duration)) % 60;
        var playMinutes = Math.floor((Math.floor(currentPos)) / 60);
        var playSeconds = (Math.round(currentPos)) % 60;

        //Check within range
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        //localStorage.setItem("playTime",$("#playerAudio")[0].currentTime);
        
        $("#showDuration").text(playMinutes + ":" + playSeconds + "/" + minutes + ":" + seconds);
        $('#progressSeek').css('width', percentage + '%');

        //condition to play next song automatically upon finish of one song
        if (playMinutes === minutes && playSeconds === seconds) {
            $("#nextButton").click();
        }
    });



    //to manage volume of audio player
    $("#volumeButton").click(function() {
        if ($("#playerAudio")[0].volume === 1.0) {
            $("#playerAudio")[0].volume = 0.0;
            $("#volumeButton").attr("src", "images/VolumeOffIcon.jpg");
        }
        else {
            $("#playerAudio")[0].volume = 1.0;
            $("#volumeButton").attr("src", "images/VolumeIcon.jpg");
        }
    });

    //to manage shuffle of audio player
    $("#repeatButton").click(function() {
        if (repeatTracks === 0) {
            repeatTracks = 1;
            $("#repeatButton").attr("src", "images/RepeatOnIcon.jpg");
        }
        else if (repeatTracks === 1) {
            repeatTracks = 0;
            $("#repeatButton").attr("src", "images/RepeatOffIcon.jpg");
        }
    });

});

//user-defined function to play a corresponding track based on the value of "currentTrack"
function playCurrentTrack() {
    $("#playerAudio").attr("src", "audios/" + track[currentTrack] + audioType);
    $("#trackName").text(track[currentTrack]);
    $("#playButton").click();

    //set current track to localStorage
    localStorage.setItem("nowPlaying", currentTrack);
}