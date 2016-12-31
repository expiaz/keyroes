var gf = require('./controllers/GameFactory');
var gm = require('./Manager/GameManager');

gf.create(45451,44,84);

var game = gm.get(45451);

game.Clock.Modifier.startClock(5);