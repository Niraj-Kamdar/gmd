const logger = require('pino')({name: "gmd"})
const Config = require("./config")

async function main(){
    const config = await Config.getOrCreateConfig()
    logger.info(`Your public identity is: ${config.identity.public.toString()}`)
    logger.info(`Thread ID for game is: ${config.gameThread}`)
}

main().then().catch((err) => {logger.error(err)})


