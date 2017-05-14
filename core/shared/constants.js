const GAME = {
    LEAVE_GAME: 'k-game-leave_game',
    ENTER_GAME: 'k-game-enter_game',

    FINISH_GAME: 'k-game-finish_game',

    WIN_GAME: 'k-game-win_game',
    LOOSE_GAME: 'k-game-loose_game',

    CLOCK_TICK: 'k-game-clock_tick',

    NEXT_LETTER: 'k-game-next_letter',
    NEXT_DEATH_LETTER: 'k-game-next_death_letter',

    GOOD_ANSWER: 'k-game_good_answer',
    BAD_ANSWER: 'k-game-bad_answer',

    MAJ_POINTS: 'k-game-maj_points',
    MAJ_HISTORY: 'k-game-maj_history'
}

const USER  = {
    KEYPRESS: 'k-user-keypress',
    SEND_MESSAGE: 'k-user-message',
    RECONCILE: 'k-user-reconcile',
    SYNCHRONIZE: 'k-user-sync',
    NEED_SYNC: 'k-front-sync'
}

const MATCH = {
    ENTER_MATCH: 'k-match-enter_match',
    LEAVE_MATCH: 'k-match-leave_match',

    ACCEPT_MATCH: 'k-match-accept_match',
    DECLINE_MATCH: 'k-match-decline_match',
    NO_ANSWER: 'k-match-no_answer',

    CLOCK_TICK: 'k-match-clock_tick',
    MAJ_COUNTER: 'k-match-maj_counter'
}

const ROOM = {
    HALL: 'k-room-hall'
}

const CHAT = {
    //basics
    NEW_MESSAGE: 'k-chat-message',

    //all messages
    MAJ_MESSAGES: 'k-chat-maj_messages',

    //types
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

const QUEUE = {
    ENTER_QUEUE: 'k-queue-subs',
    LEAVE_QUEUE: 'k-queue-unsubs',
    TRIGGERED: 'k-queue-triggered'
}

const SPECTATE = {
    ENTER_SPECTATE: 'k-spec-enter_spec',
    LEAVE_SPECATE: 'k-spec-leave_spec'
}

const HALL = {
    ENTER_HALL: 'k-hall-enter',
    LEAVE_HALL: 'k-hall-leave'
}


module.exports.game = GAME;
module.exports.match = MATCH;
module.exports.room = ROOM;
module.exports.chat = CHAT;
module.exports.state = STATE;
module.exports.letter = LETTER;
module.exports.user = USER;
module.exports.queue = QUEUE;
module.exports.spectate = SPECTATE;
module.exports.hall = HALL;