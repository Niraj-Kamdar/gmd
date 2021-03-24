class Rooms{
    constructor(client, threadId){
        this.client = client;
        this.threadId = threadId;
    }

    listRooms = async() => {
        const rooms = await this.client.find(this.threadId, 'rooms', {})
        return rooms
    }

    createRoom = async(playerId) => {
        await this.client.create(this.threadId, 'rooms', {players: [playerId]})
    }

    joinRoom = async(roomId, playerId) => {
        const room = await this.client.findById(this.threadId, 'rooms', roomId)
        room.players.push(playerId)
        await this.client.save(this.threadId, "rooms", [room])
    }
}

module.exports = {Rooms}
