const logger = require('pino')({name: "gmd"})
const Config = require("./config")
const models = require("./models")

async function main(){
    const config = await Config.getOrCreateConfig()
    logger.info(`Your public identity is: ${config.identity.public.toString()}`)
    logger.info(`Thread ID for game is: ${config.gameThread}`)
    await models.initCollections(config.identity, config.client, config.gameThread)
    // const rooms = new models.Rooms(config.client, config.gameThread)
    // const roomList = await rooms.listRooms()
    // console.log(roomList)
}

main().then().catch((err) => {logger.error(err)})


