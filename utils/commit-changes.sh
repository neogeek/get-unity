#!/bin/bash

git diff --quiet data/editor-installers.json

if [[ $? -eq 0 ]]; then

    exit 0

fi

git config --global user.email "$GITHUB_USER_EMAIL"
git config --global user.name "$GITHUB_USER_NAME"

git add data/editor-installers.json
git commit -m "Updated editor-installers.json [skip ci]"
git remote add github "https://$GITHUB_TOKEN@github.com/neogeek/get-unity"
git push github HEAD:"$TRAVIS_BRANCH"
