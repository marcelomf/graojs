RUN like a root:

service mongodb start 

grao generate:app demo --name demo --description demo --author-name Synack --author-email int@synack.com.br --server-ports 8015,8016 --template-engine jade --theme graojs --mongodb-host localhost --mongodb-db grao

cd demo

grao main:create:admin --username admin --name Admin --email admin@admin.localhost --password admin123
