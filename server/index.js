const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const url="mongodb+srv://michaell19:Mikepop40@superlatives.ghv9x.mongodb.net/?retryWrites=true&w=majority"
const { MongoClient } = require("mongodb");
const client = new MongoClient(url);
const dbName = "superlatives";

var players={};
app.use(cors());

//SOCKET IO SERVER
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["PUT", "GET", "POST"]
  },
});


var db;
var col;
client.connect().then(() => {
  console.log("connected");
  db = client.db(dbName);
  col = db.collection("questions");
  db.collection("rooms").createIndex({"createdAt": 1}, {expireAfterSeconds: 172800})

  io.on("connection", (socket) => {

    async function getData(roomCode){

      await col.aggregate(
        [ { $sample: { size: 1 } } ]
    ).toArray(function(err, result) {
        if (err) throw err;
        socket.to(roomCode).emit("change-question", result[0].question);
      });
    }

    console.log(`User Connected: ${socket.id}`);
  
    socket.on("disconnect", () => {
      db.collection("users").find( {"socket": socket.id} ).toArray(function(err, result) {
        if (err){
          throw err;
        }
        if (result.length>0){
          const roomCode = result[0].room;
          db.collection("rooms").find( {"room": roomCode} ).toArray(function(err, result2) {
            if (err){
              throw err;
            }
            const size=result2[0].size-1;
            db.collection("rooms").updateOne({"room": roomCode},
              {
                $set: {"size": size}
              })
          });
        }
        
      });

      

      db.collection("users").deleteOne( { socket: socket.id } );
    })

    socket.on("send-question", question => {
      for (let i=0; i<question.length; i++){
        // Construct a document                                                                                                                                                              
        let questionDoc = {
          "question": question[i],
          "date": new Date()
        } 
        col.insertOne(questionDoc);
      }
    })

    //Informs client of a new question
    socket.on("set-question", roomCode => {
      getData(roomCode)
    })
    
    //When a user joins a room
    socket.on("join-room", (data) => {

      db.collection("rooms").find( {"room": data.newRoom} ).toArray(function(err, result) {
        if (err){
          throw err;
        }
        if (result.length==0){
          //leaves old room and joins new room
          socket.leaveAll();
          socket.join(data.newRoom);

          db.collection("users").updateOne({socket: socket.id}, {
            $set: {"room": data.newRoom },
            $currentDate: {lastModified: true }
          })
          socket.to(data.newRoom).emit("user_joined_room", data.name);
        }else{
          socket.to(data.roomCode).emit("failed-room-join");
        }
      });
      
    })

    //Informs client of the other players in the room
    socket.on("other-players-in-room", (data) => {
      socket.to(data.room).emit("update-players", data.roomPlayersConst);
    })

    //Informs clients when game starts for a room
    socket.on("start-game", (data) => {
      const roomDoc ={
        "room": data.room,
        "question": [],
        "response": [], 
        "createdAt": new Date(),
        "size": data.size
      }

      db.collection("rooms").insertOne(roomDoc);

      socket.to(data.room).emit("redirect-page", [data.toSend, data.question]);
    })

    //Lets other sockets know when a player disconnects
    socket.on("player-disconnected", room => {
    
      socket.to(room).emit("player-disconnect", socket.id);
    })

    socket.on("to-showcase", room => {
      db.collection("rooms").find( {"room": room} ).toArray(function(err, result) {
        if (err){
          throw err;
        }
        socket.to(room).emit("to-showcase");
        socket.to(room).emit("final-result", result[0]);
      });
    })

    socket.on("new-user", (data) => {
      socket.leaveAll();
      socket.join(data.roomC);
      //Adds a user to the database
      let userDoc = {
        "socket": socket.id,
        "name": data.name,
        "room": data.roomC
      } 

      db.collection("users").insertOne(userDoc);
    })


    //Votes for a player
    socket.on("vote-player", (data) => {
      //[the person who voted, who they voted for]
      
      if (!(data.roomCode in players)){
        players[data.roomCode] = [];
        players[data.roomCode].push([data.name, data.toVotePlayerSid]);
      }else{
        if (!players[data.roomCode].includes([data.name, data.toVotePlayerSid])){
          players[data.roomCode].push([data.name, data.toVotePlayerSid]);
        }
      }
      
      db.collection("rooms").find( {"room": data.roomCode} ).toArray(function(err, result) {
        if (err){
          throw err;
        }
        
        if (players[data.roomCode].length>=result[0].size){

          db.collection("rooms").updateOne({room: data.roomCode}, 
          {
            $push: { question: data.question, response: players[data.roomCode] }
          });

          delete players[data.roomCode];
          getData(data.roomCode);
        }
      });


      
    })
});


}).catch(error => {
  console.log(error);
})



//for production

server.listen(process.env.PORT || "https://superlatives1.herokuapp.com/", () => {
  console.log("SERVER IS RUNNING");
});

//for testing
/*
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});*/