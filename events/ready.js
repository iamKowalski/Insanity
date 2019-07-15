module.exports = function onReady() {
    this.user.setPresence({
        game: {
            name: `com ${this.users.size} Insanos(as)!`,
            type: 'PLAYING'
        }
    })
}