graoJS
======

graoJS - A full stack MVC NodeJS framework
------------------------------------------

Today, this project is a scaffolding generator, based on angularjs, twitter bootstrap, pug, express, mongoose and mongoose-validator.

#### INSTALL DEPENDS
- https://nodejs.org/en/download/package-manager/
- https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

#### graoJS install and run:
- sudo npm install -g graojs
- service mongodb start
- grao generate:app demo --name demo --description demo --author-name Marcelo --author-email marcelomf@gmail.com --server-ports 8015,8016 --template-engine pug --theme graojs --mongodb-host localhost --mongodb-db grao
- cd demo
- grao main:create:admin --username admin --name Admin --email admin@admin.localhost --password admin123
- node index.js

#### Create your schemas

- Create gen/Person.json
{
    "bundle": "cadastre",
    "label": "Persons",
    "description": "All people",
    "refLabel": "name",
    "fields": {
        "id": {
            "label": "Id",
            "type": "primary"
        },
        "name": {
            "label": "Name",
            "type": "input",
            "required": true,
            "isList": true,
            "isFilter": true
        },
        "email": {
            "label": "Email",
            "type": "email",
            "unique": true,
            "required": true,
            "isList": true,
            "isFilter": true
        },
        "born": {
            "label": "Born",
            "type": "date"
        },
        "sex": {
            "label": "Sex",
            "type": "radio",
            "options": { "marculine": "Masculine", "feminine": "Feminine" }
        },
        "news": {
            "label": "Receive newsletter ?",
            "type": "checkbox",
            "value": "IS_NEWS",
            "attr": {"multiple": true}
        },
        "address": [{
            "type": {
               "label": "Type",
               "type": "select",
               "options": { "residence": "Residence", "comercial": "comercial" },
               "required": "true"
            },
            "principal": {
               "label": "Principal",
               "type": "checkbox",
               "required": "true"
            },
            "address": {
               "label": "Address",
               "type": "textarea",
               "required": "true"
            }
        }]
    }
}

- Others examples(with relashionships): https://github.com/marcelomf/graojs/tree/master/gen_examples

- Generate scaffolding(CRUD):
- grao generate:bundle --schemas Person --force

- RUN:
- node index.js