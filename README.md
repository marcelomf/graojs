graoJS
======

graoJS - A full stack MVC NodeJS framework
------------------------------------------

We are working hard to launch the first stable release at November/December, 2013.

graoJS work with:

-	Micro-kernel architecture (graojs core)
-	IoC - Inversion of Control (graojs core)
-	DI - Dependency Injection (graojs core)
-	MVC - Model View Controller(graojs)
-	Scaffolding (graojs generator)
-	RAD - Rapid Application Developer(graojs  builder, it's a frontend for mongoose schemas and graojs generator, maybe we'll utilize fabric.js)
-	Authentication (nodejs passport)
-	RBAC - Role Based Access Control (mongoose rbac, we'll work to support activity based access control)
-	RestFUL and engine of static and controllers routes (nodejs express)
-	RIA - Rich Interface Application(angularjs, angular-ui, twitter bootstrap 3)
-	ODM - Object Document Mapping(nodejs mongoose, we'll work to support ORM)
-	Template Engine (swig, jade, but if you prefer others engines, it's very simple support it)
-	Internationalization (nodejs i18n)

http://graojs.org

#### RoadMap
-	??/??/???? – 1ª Beta Release
-	??/??/???? – 1ª Stable Release

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


License
-------
Copyright(c) 2013 graoJS Marcelo Machado Fleury <marcelo@synack.com.br>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
