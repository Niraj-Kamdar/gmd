const hub = require('@textile/hub')
const fs = require('fs')
const KEY = {key: 'bwkrt36qlemdl2zfvgkp6dthvjy'}

async function initClient(identity){
    const client = await hub.Client.withKeyInfo(KEY)
    await client.getToken(identity)
    return client
}

async function initUsers(identity){
    const users = await hub.Users.withKeyInfo(KEY)
    await users.getToken(identity)
    return users
}

async function getOrCreateConfig() {
    let rawConfig
    try {
        const configJSON = fs.readFileSync('config.json').toString()
        rawConfig = JSON.parse(configJSON)
        if(!rawConfig.hasOwnProperty("identityString") || !rawConfig.hasOwnProperty("gameRoomsThread")){
            throw new Error("Config files doesn't have all necessary properties")
        }
    } catch (err) {
        // Create Identity
        const identity = await hub.PrivateKey.fromRandom()
        const identityString = identity.toString()

        // Create database
        const client = await initClient(identity)
        const gameRoomsThread = await client.newDB(undefined, 'gameMaster')
        rawConfig = {identityString, gameRoomsThread}

        // write config to config.json
        fs.writeFile("config.json", JSON.stringify(rawConfig), (err) => {logger.error(err)})
    }
    const identity = hub.PrivateKey.fromString(rawConfig["identityString"])
    const client = await initClient(identity)
    const users = await initUsers(identity)
    const gameThread = hub.ThreadID.fromString(rawConfig["gameRoomsThread"])
    const config = {
        identity,
        client,
        users,
        gameThread
    }
    return config
}

module.exports = {getOrCreateConfig}
