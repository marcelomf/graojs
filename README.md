graoJS
======

graoJS - A full stack MVC NodeJS framework
------------------------------------------

Today, this project is a scaffolding, based on angularjs, twitter bootstrap, jade, express 3.x, mongoose and mongoose-validator.

If you like this project, put your hands in the code and evaluate somethings

-	On schemas, change JSON to FIELDS(it's a literal object).
-	Remove the big injection container by named paramenters. Use modules, is more natural for nodejs community.i
-	Remove express encapsulated code and turn on middlewares.
-	Add ejs template, jade is very slow.
-	Update all packages(express 4 or koa ? :)).

#### RoadMap
-	Fork and tell to us :).

#### INSTALL

##### Debian like:
-	aptitude install nodejs mongodb npm 

##### RedHat like:
-	yum install nodejs mongodb npm

##### Install FIX
You need last version of NodeJS, so if you are having problems, go to:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

##### graoJS install and run:
-	sudo npm install -g graojs
-	grao generate:app demo
-	node demo/index.js 

##### Other command options
-	grao
