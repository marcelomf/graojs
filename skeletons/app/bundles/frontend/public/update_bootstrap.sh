#!/bin/sh
rm *.css

wget https://raw.github.com/synackbr/graojs-visual/master/theme/graojs/bootstrap.min.css -O graojs.min.css
wget http://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css -O bootstrap.min.css

for theme in cerulean cosmo cyborg flatly journal readable simplex slate spacelab united darkly lumen paper sandstone superhero yeti
do
    wget http://netdna.bootstrapcdn.com/bootswatch/3.3.7/${theme}/bootstrap.min.css -O ${theme}.min.css
done
