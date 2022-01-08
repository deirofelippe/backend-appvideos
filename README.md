#

## Checklist

Usuario: id, email, password, nome

Vídeo: id_usuario, id, titulo, url, descricao

-  frontend: handlebars
-  outros servicos usados: kafka, s3, terraform, k8s, pagseguro
-  middleware: estaAutenticado, estaAutorizado, estaValidado
-  service: se atualizar o cpf ou email, tem q verificar se outra pessoa que n seja ela mesma esteja usando

## Docker Composer

O docker compose usa uma rede externa já criada, ao invés de ele criar, então é preciso criar uma rede. O mesmo serve pro volume do mysql.

-  `docker create network --diver bridge appvideos`
-  `docker volume create --name=v_mysql`

**Espere terminar a criação dos containers de daca arquivo para executar os outros arquivos**

Ordem de execução:

1. docker-compose up -d
1. docker-compose -f ./docker-compose.elastic.yaml up -d

## Comandos usados

npx express-generator
npx sequelize-cli init

docker-compose -f compose-api.yaml up
docker-compose -f compose-api.yaml down
docker-compose -f compose-api.yaml logs -f backend-appvideos

docker-compose -f compose-db.yaml up -d
docker-compose -f compose-db.yaml down
docker-compose -f compose-db.yaml logs -f mysql
docker-compose -f compose-db.yaml logs -f phpmyadmin
