#!/bin/bash
function put_game() {
    echo "posting game"
    curl -X PUT -H "Content Type: application/json" -d "{\"maxScrore\": 2, \"score1\": 2, \"score2\": 1}" 127.0.0.1:3000/api/games
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
    * )
        echo "invalid argument: $1"
        ;;
esac
