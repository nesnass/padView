/* eslint-disable no-undef */
const audioStore = require('../../utilities/audioStore')

const testFileUrl = '../../../files/audio/testing.mp3'

let testEntry

describe('Set up an audio test entry', () => {
  it('should create an Entry from an object with a url attribute', () => {
    testEntry = audioStore.createEntry({ url: testFileUrl })
    expect(testEntry.url).toMatch(testFileUrl)
    expect(testEntry.id).toMatch(audioStore.idForFileUrl(testFileUrl))
  })

  it('should adds an entry to the library', () => {
    audioStore.addLibraryEntry(testEntry)
    expect(audioStore.getLibraryEntry(testEntry.id).url).toMatch(testFileUrl)
  })

  it('should queue an entry on the playlist locally', () => {
    expect(audioStore.getStatus().quecount).toEqual(0)
    audioStore.queueEntry(testEntry)
    expect(audioStore.getStatus().quecount).toEqual(1)
  })
})
