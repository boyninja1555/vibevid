const http = require("http")
const path = require("path")
const express = require("express")
const socketIo = require("socket.io")
const bodyParser = require("body-parser")

// Database imports
const dboperations = require("./dbOperations.js")

const CONFIG = {
    port: 2342
}

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "../", "Client", "www")))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../", "Client", "Pages"))

// Route for home page
app.get("/", (req, res) => {
    res.render("index")
})

// Route for video player
app.get("/watch", (req, res) => {
    res.render("video_player")
})

// API route for fetching video details
app.get("/api/:api_parent/:api_name", async (req, res) => {
    const { api_parent, api_name } = req.params
    const videoId = Number(api_name)

    try {
        const result = await dboperations.getLoginDetails()
        let videoData = result.find(item => item.ID === videoId)

        switch (api_parent) {
            case "video":
                if (videoData) {
                    res.json(videoData)
                    return
                } else {
                    res.status(404).send(`Video not found with id ${videoId}`)
                    return
                }
            case "mp4":
                if (videoData) {
                    res.sendFile(path.join(__dirname, videoData.VideoP))
                } else {
                    res.status(404).send(`Video file with ID ${api_name} not found`)
                    return
                }
                break
            case "videos":
                res.send(JSON.stringify(result))
                break
            default:
                res.status(400).send(`Invalid API parent: ${api_parent}`)
                break
        }
    } catch (err) {
        res.status(500).send(`Error fetching video data: ${err.message}`)
    }
})

app.get("/upload", (req, res) => {
    res.render("upload")
})

app.post("/upload", (req, res) => {
    const { Title, Description, Tags, ThumbnailP, VideoP } = req.body

    dboperations.uploadVideo(Title, Description, Tags, ThumbnailP, VideoP)
       .then(() => {
            res.send("Video uploaded successfully")
        })
       .catch((err) => {
            res.status(500).send(`Error uploading video: ${err.message}`)
        })
})

// Create and start server
const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", (socket) => {
    console.log("New client connected")
})

server.listen(CONFIG.port, () => {
    console.log(`VibeVid server started on port ${CONFIG.port}`)
})
