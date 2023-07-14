const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Editor = require("./models/editor")


const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspace');


app.use('/auth', authRoutes);
app.use('/workspace', workspaceRoutes);


app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({message: message});
})


const io = require("socket.io")(3001, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  })

  const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async draftId => {
    const draft = await findOrCreateDocument(draftId)
    socket.join(draftId)
    socket.emit("load-document", draft.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(draftId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Editor.findByIdAndUpdate(draftId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const draft = await Editor.findById(id)
  if (draft) return draft
  return await Editor.create({ _id: id, data: defaultValue })
}


mongoose.connect('mongodb+srv://ukdwiwedi1796:Cju8jPX9c1yvCSmE@cluster0.vakvxjl.mongodb.net/?retryWrites=true&w=majority', 
{ 
    useUnifiedTopology: true, 
    useNewUrlParser: true 
})
.then(result => {
    app.listen(process.env.PORT || 5000);
    console.log("Server started at port 5000");
    console.log("http://localhost:5000");
})
.catch(err => {
    console.log(err);
})

// https://localhost:5000/auth/login -> post
// https://localhost:5000/auth/signup -> put