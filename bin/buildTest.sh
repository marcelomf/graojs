#!/bin/bash
rm -rf demo ../../demo
./grao generate:app --name demo --description demo --author-name Synack --author-email int@synack.com.br --server-ports 8015,8016 --template-engine jade --theme graojs --mongodb-host localhost --mongodb-db grao
rm -rf demo/node_modules/graojs/bin/demo
mv demo ../../
rm -rf demo
app="tests"
cd ../../demo
ls -laht node_modules/graojs/
cp -rf ./../graojs/bin/builder/*Schema.js gen/
cp -rf ./../graojs/bin/$app/*Schema.js gen/
#for schema in activity address phone person user system collection field
#for schema in system collection field
#do
./../graojs/bin/grao generate:bundle --schemas user,activity --force
./../graojs/bin/grao generate:bundle --schemas phone,address,person --force
./../graojs/bin/grao generate:bundle --schemas system --force
./../graojs/bin/grao generate:bundle --schemas collection --force
./../graojs/bin/grao generate:bundle --schemas field --force
#done;
supervisor -i log,config index.js
