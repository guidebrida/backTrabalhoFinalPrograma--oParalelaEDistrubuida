const proto = "./proto/filmes.proto"
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const {v4:uuidv4} = require('uuid')

const packageDefinition = protoLoader.loadSync(proto,{
    keepCase:true,
    longs:String,
    enums:String,
    arrays:true
})

const filmesProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()
//banco
const filmes = [
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        nome:"Vingadores: Guerra infinita",
        diretor: "irmões russo",
        dataDeEstreia: "2018-05-04"
    },
    {
        id:"a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        nome: "Renan Coral",
        diretor: "teste",
        dataDeEstreia:"1999-05-26"
    }
]

server.addService(filmesProto.FilmeService.service,{
    getAll:(_,callback)=>{
        callback(null, { Filmes })
        console.log(Filmes)
    },
    get:(call,callback)=>{
        let filmes = filmes.find(n=>n.id==call.request.id)

        if(filmes){
            callback(null,filmes)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Filme não Encontrado"
            })
        }
    },

    insert:(call,callback)=>{
        let filme = call.request

        filme.id = uuidv4()
        filme.push(filme)
        callback(null,filme)
    },

    update:(call, callback)=>{
        let novoFilme = filme.find(n=>n.id == call.request.id)

        if(novoFilme){
            novoFilme.nome = call.request.nome
            novoFilme.diretor = call.request.diretor
            novoFilme.dataDeEstreia = call.request.dataDeEstreia
            callback(null, novoFilme)
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Filme não encontrado"
            })
        }
    },
    remove: (call,callback)=>{
        let id = filmes.findIndex(n=> n.id ==call.request.id)

        if(id !=-1){
            filmes.splice(id,1)
            callback(null,{})
        } else {
            callback({
                code:grpc.status.NOT_FOUND,
                details:"Filme não encontrado"
            })
        }
    }
})
server.bind("127.0.0.1:8080",grpc.ServerCredentials.createInsecure())
console.log("Servidor rodando na porta 8080")
server.start();
