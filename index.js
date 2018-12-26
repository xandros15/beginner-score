function Player(name) {
    let score = 0;
    let correctAnswer = false;

    this.addPoints = points => {
        score += points;
    };

    this.getName = () => name;
    this.getScore = () => score;
    this.hasCorrectAnswer = () => correctAnswer;
    this.setCorrectAnswer = () => correctAnswer = true;
    this.resetAnswer = () => correctAnswer = false;

    this.toString = () => {
        return JSON.stringify({name, score})
    };
}

let players = [];

function createNewPlayer(name) {
    if (!players.find(player => player.getName() === name)) {
        players = players.slice(0);
        players.push(new Player(name));
    }
}

function removePlayer(name) {
    players = players.filter(player => player.getName() !== name);
}

function applyPoints() {
    //0-100%
    //0-25 = 7
    //26-50 = 5
    //51-75 = 3
    //76-100 = 2

    let max = 1;
    let min = 9999;

    //count max and min scores
    for (const player of players) {
        if (player.getScore() < min) {
            min = player.getScore();
        }
        if (player.getScore() > max) {
            max = player.getScore();
        }
    }

    for (const player of players) {
        if (player.hasCorrectAnswer()) {
            const scale = (player.getScore() - min) / (max - min);
            if (scale <= .25) {
                player.addPoints(7);
            }
            else if (scale <= .50) {
                player.addPoints(5);
            }
            else if (scale <= .75) {
                player.addPoints(3);
            }
            else {
                player.addPoints(2);
            }
        }
        player.resetAnswer();
    }
}

function renderPlayers() {
    const $playersList = $('#players-list');
    $playersList.html('');
    for (const player of players) {
        const $player = $(`<li class="player-element">
    ${player.getName()}: ${player.getScore()}
</li>`);
        if (player.hasCorrectAnswer()) {
            $player.css({color: '#009100'});
        }
        //add events
        $player.click(() => {
            if (player.hasCorrectAnswer()) {
                player.resetAnswer();
                $player.css({color: ''});
            } else {
                player.setCorrectAnswer();
                $player.css({color: '#009100'});
            }

        });
        $player.find('.add-points').click(() => player.addPoints(1));
        $playersList.append($player)
    }
}

const $addPlayerForm = $('#add-player-form');
const $removePlayerForm = $('#remove-player-form');
const $givePoints = $('#give-points');

$removePlayerForm.submit(e => {
    const $input = $removePlayerForm.find('input');
    e.preventDefault();
    removePlayer($input.val());
    renderPlayers();
    $input.val('');
});

$addPlayerForm.submit(e => {
    const $input = $addPlayerForm.find('input');
    e.preventDefault();
    createNewPlayer($input.val());
    renderPlayers();
    $input.val('');
});

$givePoints.click(e => {
    e.preventDefault();
    applyPoints();
    renderPlayers();
});
