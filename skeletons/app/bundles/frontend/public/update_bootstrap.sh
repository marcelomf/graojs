#!/bin/sh

cd public/css
rm *.css

wget https://raw.github.com/synackbr/graojs-visual/master/theme/graojs/bootstrap.min.css -O graojs.min.css
wget http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.no-icons.min.csss -O bootstrap.min.css

for theme in amelia cerulean cosmo cyborg flatly journal readable simplex slate spacelab united
do
    wget http://netdna.bootstrapcdn.com/bootswatch/3.0.0/${theme}/bootstrap.min.css -O ${theme}.min.css
done
