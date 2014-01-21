#!/bin/bash
rm -rf demo ../../demo
./grao generate:app --name demo --description demo --author-name Synack --author-email int@synack.com.br --server-ports 8015,8016,8017,8018,8019,8020,8021,8022 --template-engine jade --theme graojs --mongodb-host localhost --mongodb-db grao
ls -laht demo/node_modules/graojs/
mv demo ../../
cd ../../demo
# User
./../graojs/bin/grao generate:schema --schema user --force
cp ./../graojs/bin/UserSchemaFull.js gen/UserSchema.js
./../graojs/bin/grao generate:schemabundle --schema user --force
cat ./bundles/user/view/form_fields.jade
# ActivitySchema
./../graojs/bin/grao generate:schema --schema activity --force
cp ./../graojs/bin/ActivitySchema.js gen/ActivitySchema.js
./../graojs/bin/grao generate:schemabundle --schema activity --force
cat ./bundles/activity/view/form_fields.jade
# PersonSchema
./../graojs/bin/grao generate:schema --schema person --force
cp ./../graojs/bin/PersonSchema.js gen/PersonSchema.js
./../graojs/bin/grao generate:schemabundle --schema person --force
cat ./bundles/person/view/form_fields.jade


node index.js
