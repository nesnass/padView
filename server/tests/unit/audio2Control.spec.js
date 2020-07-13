/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../../app')
const audioStore = require('../../utilities/audioStore')

const server = request.agent(app)

const testFileUrl = '../../../files/audio/testing.mp3'
let testEntry = audioStore.createEntry({ url: testFileUrl })

describe('Set up an audio test entry', () => {
  it('should queue the same audio file again from an API call', async () => {
    const quecount = audioStore.getStatus().quecount
    const response = await server
      .put(`/api/queue`, testEntry)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ entry: testEntry })
    console.log(response.body)
    expect(response.body.status.quecount).toBe(quecount + 1)

    /*     const response2 = await server
      .get(`/api/playpause`, testEntry)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
    expect(response2.body.status.playing).toBe(true) */
  })
})
