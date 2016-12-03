#!/bin/bash
function put_game() {
    echo "posting game"
    curl -X PUT -H "Content-Type: application/json" -d "{\"maxScore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
}

function post_game() {
    if [[ -z ${1+x} ]]; then
        echo "please enter a game id"
    fi
    curl -X POST -H "Content-Type: application/json" -d "{\"maxScore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
}

function post_player_add() {
    echo "==== Adding new player ===="
    # extract sample player id for other test calls
    res=`curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"testname\",\"elo\":12345}" 127.0.0.1:3000/api/players/add -s`
    echo $res
    playerId=`perl -e '$ARGV[0] =~ /(?<=\"_id\":\")\w{24}/; print $&;' $res`
}

function post_player() {
    echo "==== Editing player ===="
    if [[ -z $playerId ]]; then
        echo "make sure a valid player id was extracted by calling post_player_add before"
    else
        curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"newTestName\",\"elo\":54321}" 127.0.0.1:3000/api/players/$playerId -s
    fi
}

function delete_player() {
    echo ''
    echo "==== Deleting player ===="
    if [[ -z $playerId ]]; then
        echo "make sure a valid player id was extracted by calling post_player_add before"
    else
        curl -X DELETE 127.0.0.1:3000/api/players/$playerId
    fi
}


# Check the number of arguments
if [[ "$#" -lt 1 ]]; then
    echo "Please specify what to execute"
    exit 1
fi

case "$1" in
    putGame )
        put_game
        ;;
    post_player )
        post_player_add
        post_player $playerId
        delete_player $playerId
        ;;
    all )
        put_game
        ;;
    * )
        echo "invalid argument: $1"
        ;;
esac
