// --------------- Library ---------------

let library = {}

// Create an ID for a given file path + filename
function idForFileUrl(url) {
  const regex = /\//gi
  return url.replace(regex, '-')
}

// Create a new entry object
// Input should be: { url, labels, id3 }
function createEntry(data) {
  const id = idForFileUrl(data.url)
  return {
    id,
    url: data.url,
    labels: data.labels || [],
    id3: data.id3 || {},
  }
}

// Add enry to the library
function addLibraryEntry(entry) {
  library[entry.id] = entry
  status
}

// Retrieve an entry from the library by ID
function getLibraryEntry(id) {
  return library[id]
}

function getLibrary() {
  return library
}

// --------------- Playlist Queue Storage ---------------

const playlist = []
const status = {
  playing: false,
  paused: false,
  currentEntry: undefined,
  currentIndex: 0,
  quecount: 0,
}

// Place an entry on the play queue
function queueEntry(entry) {
  playlist.push(entry)
  status.quecount = playlist.length
}

// Place an entry on the play queue
function clearPlaylist() {
  playlist.length = 0
  status.quecount = 0
}

// Number of entries in the queue
function queueCount() {
  return playlist.length
}

// Get the currently playing entry
function getStatus() {
  return Object.assign({}, status)
}

// ------------ Playlist Queue Control -----------

function play() {
  if (playlist.length > 0) {
    // was stopped
    if (!status.playing && !status.paused) {
      status.currentEntry = playlist[status.currentIndex]
      status.playing = true
    } else if (status.paused) {
      // was paused
      status.paused = false
      status.playing = true
    }
  }
}

function stop() {
  status.playing = false
  status.paused = false
  status.currentIndex = 0
}

function pause() {
  status.paused = true
}

function advance() {
  if (playlist.length > status.currentIndex + 1) {
    status.currentIndex++
    status.currentEntry = playlist[status.currentIndex]
  } else {
    stop()
  }
}

module.exports = {
  idForFileUrl,
  library,
  createEntry,
  addLibraryEntry,
  getLibraryEntry,
  getLibrary,

  queueEntry,
  queueCount,
  getStatus,
  clearPlaylist,

  play,
  stop,
  pause,
  advance,
}
