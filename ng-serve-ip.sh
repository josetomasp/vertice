#!/usr/bin/env bash


HOST=$( ifconfig en0 | awk '{if($1 == "inet"){print $2}}')
PORT=4200
HOSTED=0
DIR=./
while getopts "h:p:d:" opt; do
    case "$opt" in
    h)
        HOST=${OPTARG}
        ;;
    p)  PORT=$OPTARG
        ;;
    d)
        DIR=$OPTARG
        ;;
    \?)
        echo "Usage: ng-serve-ip [:h] [:p]"
        exit 0
        ;;
    esac
done

sleep 5 && open -a "Google Chrome" http://$HOST:$PORT &
ng serve --host=$HOST --port=$PORT
