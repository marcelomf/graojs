#!/bin/bash
rm -rf politify ../../politify
./grao generate:app --name politify --description politify --author-name Walter --author-email walter@synack.com.br --server-ports 8015,8016,8017,8018,8019,8020,8021,8022 --template-engine jade --theme graojs --mongodb-host localhost --mongodb-db grao
ls -laht politify/node_modules/graojs/
mv politify ../../
cd ../../politify
./../graojs/bin/grao generate:schema --schema politico --force
cp ./../graojs/bin/PoliticoSchema.js bundles/politico/
./../graojs/bin/grao generate:schemabundle --schema politico --force
cat ./bundles/politico/view/form.jade
node index.js
