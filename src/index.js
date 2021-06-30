import { lookup } from "webnative/data-root"
import { getLinks } from "webnative/fs/protocol/basic"
import { PublicTree } from "webnative/fs/v1/PublicTree"
import * as path from "webnative/path"
import * as youtubeSearch from "youtube-search"
import YoutubePlayer from "yt-player"


const node = document.querySelector("#root")


// 🚀


renderPlaylist()
  .catch(renderError)


async function renderPlaylist() {
  const playlist = await loadPlaylist()
  if (!playlist) throw new Error("Couldn't find any playlist")

  const youtubeIds = await Promise.all(playlist.tracks.map(track => {
    return getYoutubeIdForTrack(track)
  }))

  node.innerHTML = ""

  youtubeIds.forEach(async youtubeId => {
    if (!youtubeId) return

    const element = document.createElement("div")
    node.appendChild(element)

    const player = new YoutubePlayer(element, {
      modestBranding: true
    })

    player.load(youtubeId)
    player.setVolume(100)
  })
}



// 🛠


function getYoutubeIdForTrack(track) {
  return new Promise((resolve, reject) => {
    youtubeSearch(
      `${track.artist} ${track.title}`,
      { maxResults: 1, key: "AIzaSyCUu5-dQwR72inQmEV6JK40qHNQC-G8Vl8" },
      (err, results) => {
        if (err) reject(err)
        if (!results[0]) reject("No videos found")
        resolve(results[0].id)
      })
  })
}


async function loadPlaylist() {
  const path = location.hash.substr(1).replace(/^\/+/, "").replace(/\/+$/, "")
  const pathPieces = path.split("/")

  const [username, ...pathToPlaylist] = pathPieces[0].length
    ? pathPieces
    : "icidasset/Audio/Music/Playlists/DNB.json".split("/")

  if (pathToPlaylist.length === 0) throw new Error(`For this experiment I need a path to a playlist`)

  const cid = await lookup(username)
  const publicCid = cid ? (await getLinks(cid)).public.cid : null

  if (!cid) throw new Error(`Failed to lookup data root for user: ${USERNAME}`)
  if (!publicCid) throw new Error(`Failed to find CID for public tree`)

  const publicTree = await PublicTree.fromCID(publicCid)
  const playlist = await publicTree.get(pathToPlaylist)

  return playlist ? JSON.parse(new TextDecoder().decode(playlist.content)) : null
}



// ⚠️


function renderError(error) {
  console.error(error)

  node.innerHTML = `
    <div class="inline-flex items-center text-red">
      <i class="material-icons md-error text-base mr-2"></i>
      ${error.message || error}
    </div>
  `
}
