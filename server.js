const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

const server = new grpc.Server()
const SERVER_ADDRESS = "0.0.0.0:5001"
 
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
)
 
let users = []
 
function join(call) {
  users.push(call)
  notifyChat({ user: "Server!!!", text: "new user joined ..." })
}
 
function send(call) {
  notifyChat(call.request)
}
 
function notifyChat(message) {
  users.forEach(user => {
    user.write(message)
  })
}
 
server.addService(proto.CH.Chat.service, { Join: join, Send: send })
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure())
server.start()
console.log('Start port 5001')