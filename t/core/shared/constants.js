const GAME = {
    IN_GAME: 'k-game-in_game',
    LEAVE_GAME: 'k-game-leave_game',
    BEGIN_GAME: 'k-game-begin_game',
    FINISH_GAME: 'k-game-finish_game',
    WIN_GAME: 'k-game-win_game',
    LOOSE_GAME: 'k-game-loose_game',
    CLOCK_TICK: 'k-game-clock_tick',

    KEYPRESS: 'k-game-keypress',
    NEXT_LETTER: 'k-game-next_letter',
    NEXT_DEATH_LETTER: 'k-game-next_death_letter',
    GOOD_ANSWER: 'k-game_good_answer',
    BAD_ANSWER: 'k-game-bad_answer',
    MAJ_POINTS: 'k-game-maj_points',
    MAJ_HISTORY: 'k-game-maj_history'
}
const MATCH = {
    IN_MATCH: 'k-match-in_match',
    ACCEPT_MATCH: 'k-match-accept_match',
    DECLINE_MATCH: 'k-match-decline_match',
    NO_ANSWER: 'k-match-no_answer',
    CLOCK_TICK: 'k-match-clock_tick',
    MAJ_COUNTER: 'k-match-maj_counter'
}

const ROOM = {
    IN_HALL: 'k-room-in_hall',
    IN_GAME: 'k-room-in_game',
    HALL: 'k-room-hall'
}

const CHAT = {
    HALL: 'k-chat-hall',
    GAME: 'k-chat-game',
    ALL: 'k-chat-all',
    SEND_MESSAGE: 'k-chat-send_message',
    RECEIVE_MESSAGE: 'k-chat-receive_message',
    MAJ_MESSAGES: 'k-chat-maj_messages',
    USER_MESSAGE: 'k-chat-user_message',
    SERVER_MESSAGE: 'k-chat-server_message'
}

const STATE = {
    IN_HALL: 'k-state-hall',
    IN_GAME: 'k-state-game',
    IN_MATCH: 'k-state-match',
    IN_SPECTATE: 'k-state-spectate',
    IN_QUEUE: 'k-state-queue'
}

const LETTER = {
    FONT: [
        'a',
        'b',
        'c',
        'd'
    ]
}

const SERVER = {
    MESSAGE: 'k-server-message'
}

const QUEUE = {
    SUBSCRIBE: 'k-queue-subs',
    UNSUBSCRIBE: 'k-queue-unsubs'
}


module.exports.game = GAME;
module.exports.match = MATCH;
module.exports.room = ROOM;
module.exports.chat = CHAT;
module.exports.state = STATE;
module.exports.letter = LETTER;
module.exports.server = SERVER;
module.exports.queue = QUEUE;