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
for schema in activity address phone person user system collection field
#for schema in system collection field
do
  ./../graojs/bin/grao generate:schema --schema $schema --force
  ./../graojs/bin/grao generate:schemabundle --schema $schema --force
  echo $?
  echo "Resultado"
done;
# PhoneSchema
#./../graojs/bin/grao generate:schema --schema phone --force
#./../graojs/bin/grao generate:schemabundle --schema phone --force
# AddressSchema
#./../graojs/bin/grao generate:schema --schema address --force
#./../graojs/bin/grao generate:schemabundle --schema address --force
# User
#./../graojs/bin/grao generate:schema --schema user --force
#./../graojs/bin/grao generate:schemabundle --schema user --force
# ActivitySchema
#./../graojs/bin/grao generate:schema --schema activity --force
#./../graojs/bin/grao generate:schemabundle --schema activity --force
# PersonSchema
#./../graojs/bin/grao generate:schema --schema person --force
#./../graojs/bin/grao generate:schemabundle --schema person --force
#cat bundles/system/public/js/SystemPublicController.js
supervisor index.js
