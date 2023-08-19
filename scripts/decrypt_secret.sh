#!/bin/sh

if [ -z "$1" ]
then
    echo "Decript failed. Host is empty!"
else
    echo "Decript with host: $1...";
    # --batch to prevent interactive command
    # --yes to assume "yes" for questions
    gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
    --output ./.env $1
    echo "Decript successfully";
fi
