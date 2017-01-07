var constants = {
    User:{
        State:{
            IN_HALL: 'IN_HALL',
            IN_MATCH: 'IN_MATCH',
            IN_GAME: 'IN_GAME',
            IN_SPECTATE: 'IN_SPECTATE'
        },
        Answer:{
            BASE: -1,
            YES: 1,
            NO: 0
        }
    },
    Chat:{
        Room:{
            HALL: 'HALL'
        },
        Message:{
            GREET: '{{username}} has joined',
            BYE: '{{username}} has quit',
            GAME: '{{username}} goes to game'
        },
        Type:{
            USER: 'USER',
            SERVER: 'SERVER'
        }
    },
    Letter:{
        Font:['a','b','c','d']
    }
}

module.exports = constants;