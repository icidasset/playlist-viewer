import { lookup } from "webnative/data-root"
import { getLinks } from "webnative/fs/protocol/basic"
import { PublicTree } from "webnative/fs/v1/PublicTree"
import * as path from "webnative/path"


const node = document.querySelector("#root")


// 🚀


;(async function() {
  const playlist = await loadPlaylist()

  console.log(playlist)
})()



// 🛠


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
