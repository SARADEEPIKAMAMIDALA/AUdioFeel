var musicList = []
var songPlaying = false
var songElement = null
var previousSongElement = null
var currentSongDiv = document.getElementById("currentSong")
var playControlElement = document.getElementById("play_pause_button")
var songProgressPoint = document.getElementById("songProgressPoint")
var songProgressBar = document.getElementById("songBarPoint")
var songIntervalController = null
var songWritingDataTime = 500
var songVolume = 1
var songMuted = false
var modes = {
    order: 0,
    random: 1
}
var loops = {
    noRepeat: 0,
    loopCurrentSong: 1,
    loopPlaylist: 2
}
var isPlaylistPlaying = false
var playMode = modes.order
var loopSong = loops.noRepeat
var playIndex = -1

window.onload = (()=>{
    setTimeout(createPlayList,100)
    var musicPlayList = document.getElementById("musicPlayList")
    musicPlayList.innerHTML = `<div class='yourPlaylistTitle'>Your Playlist${icons['dot']}0 Songs</div>`
})

// All the Icons Details will be stored in this variable
var icons = {
    "play":"<i class=\"bi bi-play\">",
    "pause":"<i class=\"bi bi-pause\"></i>",
    "playFill":"<i class=\"bi bi-play-fill\">",
    "pauseFill":"<i class=\"bi bi-pause-fill\"></i>",
    "forward":"<i class=\"bi bi-skip-forward\"></i>",
    "backward":"<i class=\"bi bi-skip-backward\"></i>",
    "forwardFill":"<i class=\"bi bi-skip-forward-fill\"></i>",
    "backwardFill":"<i class=\"bi bi-skip-backward-fill\"></i>",
    "dot":"<i class=\"bi bi-dot\"></i>",
    "setting":"<i class=\"bi bi-gear\"></i>",
    "customization":"<i class=\"bi bi-sliders\"></i>",
    "volumeUp":"<i class=\"bi bi-volume-up\"></i>",
    "volumeUpFill":"<i class=\"bi bi-volume-up-fill\"></i>",
    "volumeDown":"<i class=\"bi bi-volume-down\"></i>",
    "volumeDownFill":"<i class=\"bi bi-volume-down-fill\"></i>",
    "volumeMute":"<i class=\"bi bi-volume-mute\"></i>",
    "volumeMuteFill":"<i class=\"bi bi-volume-mute-fill\"></i>",
    "shuffle":"<i class=\"bi bi-shuffle\"></i>",
    "repeat":"<i class=\"bi bi-repeat\"></i>",
    "repeat-one":"<i class=\"bi bi-repeat-1\"></i>",
    "stop":"<i class=\"bi bi-stop\"></i>",
    "stopFill":"<i class=\"bi bi-stop-fill\"></i>",
}

// This function is mainly to make dynamic frontend display
function changeHoverIcon(element,type,fill){
    switch (type) {
        case 0:
            // Play Pause Button
            if(songPlaying) {
                // image will be pause
                if(fill) element.innerHTML = icons["pauseFill"]
                else element.innerHTML = icons["pause"]
            } else {
                // image will be play
                if(fill) element.innerHTML = icons["playFill"]
                else element.innerHTML = icons["play"]
            }
            break;
        case 1:
            // Forward Button
            if(fill) element.innerHTML = icons["forwardFill"]
            else element.innerHTML = icons["forward"]
            break;
        case -1:
            // Backward Button
            if(fill) element.innerHTML = icons["backwardFill"]
            else element.innerHTML = icons["backward"]
            break;
        default:
            break;
    }
}

// removing the extension from the song name
function getSongName(song){
    console.log("Song Name before modifying {getSongName}: "+song)
    song = song.split(".")
    song.pop()
    song = song.join(".")
    // console.log("Song Name after modifying {getSongName}: "+song)
    return song
}

// while adding songs to playlist we will give the entire address of the song
// This function will extract only song name to display on screen
function removeGenere(song){
    console.log("Genere of Song Before Splitting {removeGenere}: "+song)
    song = song.split("/")
    console.log("Genere of Song After Splitting {removeGenere}[we will use index 2]: "+song)
    return getSongName(song[1])
}

// Creates the element in HTML for selected song
function createSongElement(genere,song){
    // console.log("Song Details: "+song)
    var songName = song[0]
    var songImage = song[1]
    var songElement = ""
    songElement += "<div class=\"songElement\">"
    // Adding Image of the song
    var imageAddress = "./music.jpeg"
    if(songImage != "DEFAULT_IMAGE") {
        imageAddress = `./MusicFiles/${genere}/${songImage}`
    }
    songElement += `<span class=\"songImage\"><img src="${imageAddress}"></span>`
    // Adding Play button with complete address of the Song
    songElement += `<span class=\"circle bi bi-play\" onclick="playThisSong(\'./${genere}/${songName}\',\'${imageAddress}',this)"></span>`
    // Adding playlist button with complete address of song
    songElement += `<span class=\"plus bi bi-plus\" image="${imageAddress}" path="${genere}/${songName}" onclick="createMusicList(this)" ></span>`
    songElement += `<span class=\"songName\">${songName}</span>`
    songElement += "</div>"
    // console.log("Song Element: \n"+songElement)
    return songElement
}

function createPlayList(){
    var playListElement = document.getElementById("playList")
    // Iterating in all the geners from the array taken from "AudioFeelMusicList.js"
    for (let genere = 0; genere < musicFilesList.length; genere++) {
        const currentGenere = musicFilesList[genere];
        const genereName = currentGenere[0] // Index 0 has name of genere
        const genereSongs = currentGenere[1] // Index 1 has list of songs in that genere
        console.log("Creating Playlist for Genere: "+genereName)
        var genereElement = ""
        // Starting of genere element
        genereElement += `<div class=\"genere\" id=\"genere${genere}\">`
        genereElement += `<div class=\"genereTitle\">${genereName}${icons['dot']}${genereSongs.length} Songs</div><div style=\"overflow:scroll;height:20vh;\" >`
        for (let song = 0; song < genereSongs.length; song++) {
            const songTitle = genereSongs[song]; // Getting each song and creating an element
            genereElement += `${createSongElement(genereName,songTitle)}`
        }
        // Ending genere element
        genereElement += "</div></div>"
        playListElement.innerHTML += genereElement // Adding the genere list to the playlist
        console.log("Created Playlist for: "+genereName)
    }   
}

function changeCurrentSongImage(image){
    document.getElementById("currentImage").src = `${image}`
}

function playThisSong(songDetails,imageDetails,element){
    console.log("Play This Song: "+songDetails)
    console.log("Image Details: "+imageDetails)
    song = songDetails
    isPlaylistPlaying = false
    if(songPlaying){
        // pause the song
        console.log(songElement)
        songElement.pause()
        if (previousSongElement) {
            previousSongElement.setAttribute('class','circle bi bi-play')
        }
        songPlaying = false
        changeHoverIcon(playControlElement,0,true)
        stopSongInterval()
        if(previousSongElement == element){
            previousSongElement = null
            return
        }
    }
    element.setAttribute('class','circle bi bi-pause')
    previousSongElement = element
    songElement = new Audio(`./MusicFiles/${song}`)
    if(songMuted) songElement.volume = 0
    else songElement.volume = songVolume
    songElement.play()
    currentSongDiv.innerText = song.split("/")[2].split(".")[0]
    songPlaying = true
    changeCurrentSongImage(imageDetails)
    changeHoverIcon(playControlElement,0,true)
    startSongInterval()
}

// backend Search function for finding the song to play
function searchSong(song){
    console.log("Searching for song: "+song)
    for (let index = 0; index < musicList.length; index++) {
        const element = musicList[index];
        // console.log(element.getAttribute('path') + " <====>" + song)
        if(element.getAttribute('path') == song) return [true,index]
    }
    return false
}

// Manual plylist function
function createMusicList(element){
    var song = element.getAttribute('path')
    // console.log("Song To Add : "+song)
    var songFound = searchSong(song)
    // console.log("Song Found : "+songFound)
    if(songFound){
        removeFromMusicList(element,songFound[1])
        element.setAttribute("class","plus bi bi-plus")
    } else {
        addToMusicList(element)
        element.setAttribute("class","dash bi bi-dash")
    }
    writePlayList()
}

// Removing the song from playlist
function removeFromMusicList(song,removeIndex){
    var tempList = []
    for (let index = 0; index < musicList.length; index++) {
        const element = musicList[index];
        if(index != removeIndex)
            tempList.push(element)
    }
    console.log(musicList[removeIndex] + "  " + song)
    musicList = tempList
} // Removing needs a lot of code as we need to check for the location

// Adding to playlist
function addToMusicList(song){
    musicList.push(song)
} // Adding not need much code

// Showing the playlist
function writePlayList(){
    var musicPlayList = document.getElementById("musicPlayList")
    var playData = ""
    console.log(musicList)
    if(musicList.length != 0){
        playData += `| ${icons['playFill']}`
    }
    musicPlayList.innerHTML = `<div class='yourPlaylistTitle' onclick="playPlayList()">Your Playlist${icons['dot']}${musicList.length} Songs ${playData}</div>`
    for (let index = 0; index < musicList.length; index++) {
        const element = musicList[index];
        musicPlayList.innerHTML += `<div class="songSelected" image="${element.getAttribute('image')}" path="${element.getAttribute('path')}">${removeGenere(element.getAttribute('path'))}</div>`
    }
}

// Controlling the playing menu
function playControl(){
    if(songElement == null){
        return
    }
    if(songPlaying){
        songElement.pause()
        songPlaying = false
        changeHoverIcon(playControlElement,0,true)
        if(previousSongElement != null){
            previousSongElement.setAttribute('class','circle bi bi-play')
        }
        stopSongInterval()
        return
    }
    if(songElement != null){
        songElement.play()
        songPlaying = true
        changeHoverIcon(playControlElement,0,true)
        startSongInterval()
        return
    }
}

function playPlayList(){
    if(musicList.length == 0){
        console.log("No Songs In The List")
        return
    }
    isPlaylistPlaying = true
    if(songPlaying){
        songElement.pause()
        songPlaying = false
    }
    console.log("Selecting Song")
    var currentSongElement = getSong()
    if(currentSongElement == null){
        changeCurrentSongImage("music.jpeg")
        return
    }
    console.log(currentSongElement)
    songElement = new Audio("./MusicFiles/"+currentSongElement.getAttribute("path"))
    writeSongData()
    changeCurrentSongImage(currentSongElement.getAttribute('image'))
    songElement.play()
    songPlaying = true
    startSongInterval()
}

// This function will get the song based on the selected setting 
// Play Songs in Sequence || Play in Random Mode
function getSong(){
    var musicIndex = -1
    if(loopSong == loops.noRepeat){
        // return order or random
        if(playMode == modes.order) {
            playIndex += 1
            if(playIndex >= musicList.length) {
                playIndex = -1
                return null
            }
            musicIndex = playIndex
        } else {
            musicIndex = parseInt(Math.random() * 100) % musicList.length
            playIndex = musicIndex
        }
    } else if(loopSong == loops.loopCurrentSong){
        musicIndex = playIndex
    } else {
        // return order or random and reinitialize the song
        /* Editing Required for this mode */
    }
    return musicList[musicIndex]
}

// This function is for making good looking Frontend Display
function addZeros(data){
    if(data < 10) return `0${data}`
    return data
}

function convertTimeToArray(time){
    if (isNaN(time)) {
        time = 0
    }
    let seconds = parseInt(time % 60)
    time = (time / 60)
    let minutes = parseInt(time % 60)
    time = (time / 60)
    let hours = parseInt(time)
    seconds = addZeros(seconds)
    minutes = addZeros(minutes)
    hours = addZeros(hours)
    var timeArray = [hours,minutes,seconds]
    return timeArray
}

function writeProgressBarData(currentTime,totalTime){
    var percent = currentTime / totalTime
    percent = percent * 100 - 1 // -1 is for CSS Interface
    songProgressPoint.style.left = `${percent}%`
}

function writeSongData(){
    var currentTime = songElement.currentTime
    var totalTime = songElement.duration
    var remainingTime = totalTime - currentTime
    if(remainingTime <= 0.01) {
        stopSongInterval()
        document.getElementById("songCurrentTime").innerText = `00:00:00`
        document.getElementById("songLeftTime").innerText = `-00:00:00`
        document.getElementById("songTotalTime").innerText = `00:00:00`
        if(isPlaylistPlaying) setTimeout(playPlayList,1000)
        return
    }
    writeProgressBarData(currentTime,totalTime)
    currentTime = convertTimeToArray(currentTime)
    totalTime = convertTimeToArray(totalTime)
    remainingTime = convertTimeToArray(remainingTime)
    document.getElementById("songCurrentTime").innerText = `${currentTime[0]}:${currentTime[1]}:${currentTime[2]}`
    document.getElementById("songLeftTime").innerText = `-${remainingTime[0]}:${remainingTime[1]}:${remainingTime[2]}`
    document.getElementById("songTotalTime").innerText = `${totalTime[0]}:${totalTime[1]}:${totalTime[2]}`
}

function startSongInterval(){
    if(songIntervalController != null){
        clearInterval(songIntervalController)
        songIntervalController = null
    }
    songIntervalController = setInterval(writeSongData,songWritingDataTime)
    songPlaying = true
    startWaves()
}

function stopSongInterval(){
    if(songIntervalController != null){
        clearInterval(songIntervalController)
        songIntervalController = null
    }
    songPlaying = false
    changeHoverIcon(playControlElement,0,false)
    stopWaves()
}

function seekForwardSong(){
    if(!songPlaying){
        return
    }
    if(songElement.currentTime + 5 <= songElement.duration)
        songElement.currentTime += 5
    else 
        songElement.currentTime = songElement.duration
    console.log("Seeking Forward")
}

function seekBackwardSong(){
    if(!songPlaying){
        return
    }
    if(songElement.currentTime - 5 >= 0)
        songElement.currentTime -= 5
    else
        songElement.currentTime = 0
    console.log("Seeking Back")
}

function seekSongByNumber(num){
    if(!songPlaying){
        return
    }
    num = parseInt(num)
    time = (num * songElement.duration) / 10
    songElement.currentTime = time
}

function changeVolumeBars(vol){
    let num = parseInt(vol * 10)
    document.getElementById("volume-indicator").innerText = `${num*10}%`
    for (let index = 0; index < num; index++) {
        const element = document.getElementById(`volume-bar-${index}`);
        element.style.backgroundColor = element.getAttribute("color")
    }
    for (let index = num; index < 10; index++) {
        const element = document.getElementById(`volume-bar-${index}`);
        element.style.backgroundColor = "white"
    }
}

function updateSongVolume(volume){
    changeVolumeBars(volume)
    if(!songPlaying || songMuted){
        return
    }
    songElement.volume = volume
    console.log("Song Volume Changed: "+(volume))
}

function decreaseVolume(){
    if(songVolume - 0.1 >= 0) {
        songVolume -= 0.1
        updateSongVolume(songVolume)
    } else {
        songVolume = 0
        updateSongVolume(songVolume)
    }
}

function increaseVolume(){
    if(songVolume + 0.09 < 1) {
        songVolume += 0.1
        updateSongVolume(songVolume)
    }
}

function MuteSong(){
    songMuted = !songMuted
    if(songMuted) {
        updateSongVolume(0)
        if(songPlaying){
            songElement.volume = 0
        }
    }
    else {
        updateSongVolume(songVolume)
        if(songPlaying){
            songElement.volume = songVolume
        }
    }
}

function openSettings(){
    let customization = document.getElementById('customization-container')
    let settings = document.getElementById('settings-container')
    if(customization.getAttribute('opened') == 'true'){
        customization.setAttribute('opened','false')
        customization.setAttribute('hidden','')
    }
    if(settings.getAttribute('opened') == 'true'){
        settings.setAttribute('opened','false')
        settings.setAttribute('hidden','')
    } else {
        settings.setAttribute('opened','true')
        settings.removeAttribute('hidden')
    }
}

function openCustomization(){
    let customization = document.getElementById('customization-container')
    let settings = document.getElementById('settings-container')
    if(settings.getAttribute('opened') == 'true'){
        settings.setAttribute('opened','false')
        settings.setAttribute('hidden','')
    }
    if(customization.getAttribute('opened') == 'true'){
        customization.setAttribute('opened','false')
        customization.setAttribute('hidden','')
    } else {
        customization.setAttribute('opened','true')
        customization.removeAttribute('hidden')
    }
}

function enableLoopCurrentSong(){
    loopSong = loops.loopCurrentSong
}

function enableLoopPlayList(){
    loopSong = loops.loopPlaylist
}

function disableLoop(){
    loopSong = loops.noRepeat
}

function startWaves(){
    for (let index = 0; index < 10; index++) {
        const element = document.getElementById(`wave-${index}`);
        element.setAttribute('class','waveIt')
    }
}

function stopWaves(){
    for (let index = 0; index < 10; index++) {
        const element = document.getElementById(`wave-${index}`);
        element.removeAttribute('class')
    }
}

/* Key Board Shortcuts */

document.addEventListener('keydown',(e)=>{
    let key = e.key
    switch(key){
        case " ":
            playControl()
            break
        case 'ArrowRight':
            seekForwardSong()
            break
        case 'ArrowLeft':
            seekBackwardSong()
            break
        case 'ArrowUp':
            increaseVolume()
            break
        case 'ArrowDown':
            decreaseVolume()
            break
        case 'm':
        case 'M':
            MuteSong()
            break
        case '0': case '1': case '2':
        case '3': case '4': case '5':
        case '6': case '7': case '8':
        case '9':
            seekSongByNumber(key)
    }
})


