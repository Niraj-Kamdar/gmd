const fs = require('fs');
const rooms = require('./rooms');
const players = require('./players');

async function createCollection(identity, client, threadId, name){
    const writeValidatorString = `function writeValidator(writer, event, instance){
        var type = event.patch.type
        var patch = event.patch.json_patch
        var owner = ${identity.public.toString()}
        switch (type) {
            case "create":
                if (writer !== owner) {
                    return "permission denied" // writer must match new instance
                }
                break
            case "save":
                if (writer !== owner) {
                    return "permission denied"
                }
                break
            case "delete":
                if (writer !== owner) {
                    return "permission denied" // no owner access to delete instance
                }
                break
        }
        return true
    }`
    const writeValidator = new Function(writeValidatorString)
    const schema = JSON.parse(fs.readFileSync(`schemas/${name}.json`).toString())
    await client.newCollection(threadId, { name, schema, writeValidator})
}

async function initCollections(identity, client, threadId){
    const collections = await client.listCollections(threadId)
    const collectionSet = new Set(collections.map((collection) => (collection.name)))
    const expectedCollections = ["players", "rooms"]

    for(const collection of expectedCollections){
        if(!collectionSet.has(collection)){
            await createCollection(identity, client, threadId, collection)
        }
    }
}

module.exports = {
    initCollections,
    Rooms: rooms.Rooms,
    Players: players.Players
}