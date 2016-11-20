#!/bin/bash
function put_game() {
    echo "posting game"
    curl -X PUT -H "Content Type: application/json" -d "{\"maxScrore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
}

function get_game() {
    if [[ "$#" -lt 1 ]]; then
        exit
    fi
    echo "getting game"
    curl -X GET "127.0.0.1:3000/api/games/$1"
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
    getGame )
        if [[ ! -v $2 ]]; then
            echo "you have to specify a game id"
        fi
        get_game $2
        ;;
    * )
        echo "invalid argument: $1"
        ;;
esac
