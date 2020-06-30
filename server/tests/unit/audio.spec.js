/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../../app')
const audioStore = require('../../utilities/audioStore')

const server = request.agent(app)
const testFileUrl = '../../../files/audio/testing.mp3'

let testEntry

describe('Set up an audio test entry', () => {
  it('should create an Entry from an object with a url attribute', () => {
    testEntry = audioStore.createEntry({ url: testFileUrl })
    expect(testEntry.url).toMatch(testFileUrl)
    expect(testEntry.id).toMatch(audioStore.idForFileUrl(testFileUrl))
  })

  it('should adds an entry to the library', () => {
    audioStore.addEntry(testEntry)
    expect(audioStore.getEntry(testEntry.id).url).toMatch(testFileUrl)
  })

  it('should queue an entry on the playlist locally', () => {
    expect(audioStore.getStatus().quecount).toEqual(0)
    audioStore.queueEntry(testEntry)
    expect(audioStore.getStatus().quecount).toEqual(1)
  })

  it('should queue the same audio file again from an API call', async () => {
    const quecount = audioStore.getStatus().quecount
    const response = await server
      .put(`/api/queue`, testEntry)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ entry: testEntry })
    console.log(response.body)
    expect(response.body.status.quecount).toBe(quecount + 1)
  })
})
