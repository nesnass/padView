var spawn = require('child_process').spawn
const fs = require('fs')
const audioStore = require('./audioStore')

const ffplayOptions = {
  play: '-autoexit',
}

function playpause() {
  let subprocess, err
  const entryUrl = audioStore.getStatus().currentEntry.url
  const args = [ffplayOptions.play, entryUrl]
  try {
    subprocess = spawn('ffplay', args)
  } catch (ex) {
    err += ex.stdout
  }
  subprocess.on('error', err => {
    console.log(`Failed to start player. Error: ${err}`)
  })
  subprocess.stderr.on('data', data => {
    err += data
    console.log(err)
  })
  subprocess.on('close', code => {
    console.log(
      `player process exited with code ${code}. ${
        err ? 'Error data: ' + err : ''
      }`
    )
  })
}

function stop() {
  // Stop child process playing
  // Mark status as stopped
  return
}

async function readFiles(path) {
  const dir = await fs.promises.opendir(path)
  for await (const dirent of dir) {
    console.log(dirent.name)
    if (dirent.isDirectory()) {
      readFiles(dirent.path)
    }
  }
}

module.exports = {
  playpause,
  stop,
  readFiles,
}
