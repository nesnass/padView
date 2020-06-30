// --------------- Library ---------------

let library = {}

// Create an ID for a given file path + filename
function idForFileUrl(url) {
  return url.replace('/', '-')
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
function addEntry(entry) {
  library[entry.id] = entry
  status
}

// Retrieve an entry from the library by ID
function getEntry(id) {
  return library[id]
}

// --------------- Playlist ---------------

const playlist = []
const status = {
  playing: false,
  currentEntry: undefined,
  currentIndex: -1,
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

module.exports = {
  idForFileUrl,
  library,
  createEntry,
  addEntry,
  getEntry,

  queueEntry,
  queueCount,
  getStatus,
  clearPlaylist,
}
