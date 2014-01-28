#!/bin/bash
rm -rf demo ../../demo
./grao generate:app --name demo --description demo --author-name Synack --author-email int@synack.com.br --server-ports 8015,8016,8017,8018,8019,8020,8021,8022 --template-engine jade --theme graojs --mongodb-host localhost --mongodb-db grao
ls -laht demo/node_modules/graojs/
mv demo ../../
cd ../../demo
cp ./../graojs/bin/PhoneSchema.js gen/PhoneSchema.js
cp ./../graojs/bin/AddressSchema.js gen/AddressSchema.js
cp ./../graojs/bin/UserSchemaFull.js gen/UserSchema.js
cp ./../graojs/bin/ActivitySchema.js gen/ActivitySchema.js
cp ./../graojs/bin/PersonSchema.js gen/PersonSchema.js
# PhoneSchema
./../graojs/bin/grao generate:schema --schema phone --force
./../graojs/bin/grao generate:schemabundle --schema phone --force
# AddressSchema
./../graojs/bin/grao generate:schema --schema address --force
./../graojs/bin/grao generate:schemabundle --schema address --force
# User
./../graojs/bin/grao generate:schema --schema user --force
./../graojs/bin/grao generate:schemabundle --schema user --force
cat ./bundles/user/view/form_fields.jade
# ActivitySchema
./../graojs/bin/grao generate:schema --schema activity --force
./../graojs/bin/grao generate:schemabundle --schema activity --force
# PersonSchema
./../graojs/bin/grao generate:schema --schema person --force
./../graojs/bin/grao generate:schemabundle --schema person --force
node index.js
