npx express-generator
npx sequelize-cli init

docker-compose -f compose-api.yaml up
docker-compose -f compose-api.yaml down
docker-compose -f compose-api.yaml logs -f backend-appvideos

docker-compose -f compose-db.yaml up -d
docker-compose -f compose-db.yaml down
docker-compose -f compose-db.yaml logs -f mysql
docker-compose -f compose-db.yaml logs -f phpmyadmin

## Checklist

Usuario: id, email, password, nome,
Vídeo: id_usuario, id, titulo, url, descricao

Usuarios

-  create
   -  campos validos
   -  nao existe o email
-  update
   -  campos validos
   -  id é o mesmo
   -  se email for igual, entao tem que ser do proprio usuario
   -  se email for diferente, so aceita se nao existir
-  read
-  delete
   -  se id for igual
-  login
   -  email e senha sao iguais

jest, handlebars, hamlet, passport,jwt, bcrypt, aws

-  [ ] usuario: controller, service, dao, models
-  [ ] usuario: validacao
-  [ ] usuario: crud
-  [ ] middleware: estaAutenticado, estaAutorizado, estaValidado
-  [ ] unit test: validacao, autorizacao, autenticacao, service, dao, erros, middleware,
-  [ ] integration test: request, banco de dados, request e banco de dados
       segredos de salao decapagem de cabelo saiba o que e como fazer o servico e manter a cor nos fios
