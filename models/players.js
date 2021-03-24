class Players{
    constructor(client, threadId){
        this.client = client;
        this.threadId = threadId;
    }

    createPlayer = async(name, publicAddress) => {
        await this.client.create(this.threadId, 'players', {name, publicAddress})
    }

    updatePlayer = async(playerId, name) => {
        const player = await this.client.findById(this.threadId, 'players', playerId)
        player.name = name
        await this.client.save(this.threadId, "players", [player])
    }
}

module.exports = {Players}