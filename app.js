const express = require("express")
const path = require("path")
const app = express()
const port = process.env.port || 4000
const server = app.listen(port, () => console.log('Server on port ' + port))

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

io.on("connection", onConnected)

function onConnected(socket) {
    socketsConnected.add(socket.id)
    io.emit("clients-total", socketsConnected.size)

    socket.on("disconnect", () => {
        socketsConnected.delete(socket.id)
        io.emit("clients-total", socketsConnected.size)
    })

    socket.on('message', (data) => {
        socket.broadcast.emit("message", data)
   })

   socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data)
   })
}
