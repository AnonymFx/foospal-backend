#!/bin/bash
function put_game() {
    echo "posting game"
    curl -X PUT -H "Content Type: application/json" -d "{\"maxScore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
}

function post_game() {
    if [[ -z ${1+x} ]]; then
        echo "please enter a game id"
    fi
    curl -X POST -H "Content Type: application/json" -d "{\"maxScore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
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
    all )
        put_game
        ;;
    * )
        echo "invalid argument: $1"
        ;;
esac
