const GAME = {
    IN_GAME: 'k-game-in_game',
    LEAVE_GAME: 'k-game-leave_game',
    FINISH_GAME: 'k-game-finish_game',
    WIN_GAME: 'k-game-win_game',
    LOOSE_GAME: 'k-game-loose_game',
    CLOCK_TICK: 'k-game-clock_tick',

    KEYPRESS: 'k-game-keypress',
    NEXT_LETTER: 'k-game-next_letter',
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
    CLOCK_TICK: 'k-match-clock_tick'
}

const ROOM = {
    IN_HALL: 'k-room-in_hall',
    IN_GAME: 'k-room-in_game'
}

const CHAT = {
    HALL: 'k-chat-hall',
    GAME: 'k-chat-game',
    ALL: 'k-chat-all',
    SEND_MESSAGE: 'k-chat-send_message',
    RECEIVE_MESSAGE: 'k-chat-receive_message',
    MAJ_MESSAGES: 'k-chat-maj_messages'
}

const STATE = {
    IN_HALL: 'k-state-hall',
    IN_GAME: 'k-state-game'
}


module.exports.game = GAME;
module.exports.match = MATCH;
module.exports.room = ROOM;
module.exports.chat = CHAT;
module.exports.state = STATE;