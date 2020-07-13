var spawn = require('child_process').spawn
const fs = require('fs')
const dirPath = process.cwd()
const audioStore = require('./audioStore')

let subprocess
let err = ''
const player = 'vlc' // 'vlc' or 'ffplay'

const playerOptions = {
  ffplay: {
    executable: 'ffplay',
    args: ['-autoexit', '-loglevel', 'warning', '-vn', '-i'],
    pause: 'p',
  },
  vlc: {
    executable: '/Applications/VLC.app/Contents/MacOS/VLC',
    args: ['--control', 'rc'],
    pause: 'pause',
  },
}

function onAudioEnd() {
  audioStore.advance()
  const status = audioStore.getStatus()
  if (status.playing && !status.paused) {
    const entryUrl = `${dirPath}/${audioStore.getStatus().currentEntry.url}`
    spawnAudioPlayer(entryUrl)
  }
}

function spawnAudioPlayer(entryUrl) {
  const args = [...playerOptions[player].args, entryUrl]

  try {
    subprocess = spawn(playerOptions[player].executable, args)
    subprocess.stdin.setEncoding('utf-8')
    subprocess.on('error', err => {
      console.log(`Failed to start player. Error: ${err}`)
    })
    subprocess.stderr.on('data', data => {
      err += data
      console.log(err)
    })
    subprocess.on('close', code => {
      subprocess = undefined
      if (code > 0) {
        console.log(
          `player process exited with code ${code}. ${
            err ? 'Error data: ' + err : ''
          }`
        )
      } else onAudioEnd()
    })
  } catch (ex) {
    err += ex.stdout
  }
}

function playpause() {
  const status = audioStore.getStatus()
  if (status.playing && subprocess) {
    //subprocess.stdio[1].write('p\r\n')
    console.log('pause')
    subprocess.stdin.write(`${playerOptions[player].pause}\n`) // pause ffplay
    //subprocess.stdin.end()
    audioStore.pause()
  } else {
    audioStore.play()
    const entryUrl = `${dirPath}/${audioStore.getStatus().currentEntry.url}`
    spawnAudioPlayer(entryUrl)
  }
}

function stop() {
  // Stop child process playing
  // Mark status as stopped
  const stream = subprocess.stdin
  stream.write('q') // quit ffplay
  audioStore.stop()
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
