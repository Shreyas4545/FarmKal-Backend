#!/bin/bash
git pull origin master --rebase
npm install
npm run build
pm2 restart farmkal-api