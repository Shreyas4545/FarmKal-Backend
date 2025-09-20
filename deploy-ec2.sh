#!/bin/bash
cd /var/www/farmkal || exit
git pull origin master --rebase
npm install
npm run build
pm2 restart farmkal