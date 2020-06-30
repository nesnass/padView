const router = require('express').Router()
const audioStore = require('../utilities/audioStore')
const audioProcess = require('../utilities/audioProcess')

/** Queue an audio entry
 * Supply: request.body { entry, control }
 *    control: { immediate: boolean }
 *    entry: { id, url, labels, id3 }
 */
router.put('/queue', (request, response, next) => {
  // const control = request.body.control || {}
  if (!request.body.entry) return response.error('No audio URL supplied')
  //const entry = audioStore.getEntry[request.body.entry.id]
  const entry = audioStore.createEntry(request.body.entry)
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

  response.ok()
})

router.put('/playpause', (request, response) => {
  audioProcess.playpause()
  response.ok()
})

module.exports = router
