const router = require('express').Router()
const audioStore = require('../utilities/audioStore')
const audioProcess = require('../utilities/audioProcess')

/** Queue an audio entry
 * Supply: request.body { entry, control }
 *    control: { immediate: boolean }
 *    entry: { id, url, labels, id3 }
 */
router.put('/queue', (request, response, next) => {
  if (!request.body.entry) return next('No audio URL supplied')
  // Create an entry object for this file
  const entry = audioStore.getLibraryEntry(request.body.entry.id)
  if (!entry) return next('Audio entry not found')

  audioStore.queueEntry(entry)
  const status = audioStore.getStatus()
  response
    .status(200)
    .send({ status })
    .end()
})

router.delete('/queue', (request, response) => {
  audioProcess.stop()
  console.log('Queue delete called')
  response.ok()
})

router.get('/playpause', (request, response) => {
  audioProcess.playpause()
  const status = audioStore.getStatus()
  response
    .status(200)
    .send({ status })
    .end()
})

router.get('/library', (request, response) => {
  const library = audioStore.getLibrary()
  response
    .status(200)
    .send(library)
    .end()
})

// TODO: Remove after testing complete
if (process.env.NODE_ENV !== 'production') {
  const testFileUrl = 'files/audio/testing2.mp3'
  const testItem = audioStore.createEntry({ url: testFileUrl })
  audioStore.addLibraryEntry(testItem)
  console.log(`Created item with ID: ${testItem.id}`)
}

module.exports = router
