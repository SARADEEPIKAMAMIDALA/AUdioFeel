from os import listdir
from os import getcwd
from os import chdir

imagesList = []

def extractDirectories(l):
    return list(filter(lambda x: '.' not in x,l))

def divideFiles(files):
    global imagesList
    images = []
    music = []
    for file in files:
        extension = file.split(".")[-1]
        if extension in ["mp3","ma4"]:
            music.append(file)
        else:
            images.append(file)
            imagesList.append(".".join(file.split(".")[:-1]))
    return (music,images)

def getImage(name):
    try:
        return imagesList.index(name)
    except:
        return -1

def getMusicFilesList(rootFolder,folder):
    chdir(rootFolder + "\\" + folder)
    filesList = listdir()
    musics,images = divideFiles(filesList)
    musicList = []
    for music in musics:
        name = ".".join(music.split(".")[:-1])
        imageIndex = getImage(name)
        if imageIndex != -1:
            musicList.append( [music,images[imageIndex]] )
        else:
            musicList.append( [music,"DEFAULT_IMAGE"] )
    print(musicList)
    return musicList

# Main Execution
homePath = getcwd() # Root Path
filesList = listdir() # List of files
directories = extractDirectories(filesList) # getting directories
requiredDirectory = None
for i in directories:
    if 'MusicFiles' in i:
        requiredDirectory = i
        break
musicPath = homePath + "\\" + requiredDirectory # Music Folder
chdir(musicPath) # Changing Path
filesList = listdir() # getting folders
directories = extractDirectories(filesList) # Extracting
musicList = list() # creating files list
for folder in directories:
    musicFiles = getMusicFilesList(musicPath,folder) # Extracting Music files
    musicList.append( [folder,musicFiles] ) # Generating Files
chdir(homePath) # Root Folder
with open("AudioFeelMusicList.js","w") as f: # Connecting JavaScript
    f.write(f"musicFilesList = {musicList}")
print("Completed")

