# Backend Appvideos

-  Backend: github.com/felippedesouza/backend-appvideos
-  Frontend: github.com/felippedesouza/frontned-appvideos
-  Backend que implementa o consumer no kafka: github.com/felippedesouza/backend-kafka

## Clonando os diretórios

Rode o script

```bash
mkdir appvideos \
 && cd appvideos \
 && git clone https://github.com/felippedesouza/frontend-appvideos.git \
 && git clone https://github.com/felippedesouza/backend-appvideos.git \
 && git clone https://github.com/felippedesouza/backend-kafka.git
```

## Usando Docker Composer

O docker compose usa uma rede externa já criada, ao invés de ele criar, então é preciso criar uma rede. O mesmo serve pro volume do mysql.

-  `docker create network --diver bridge appvideos`
-  `docker volume create --name=v_mysql`

**Espere terminar a criação dos containers de cada arquivo para executar os outros arquivos**

Ordem de execução:

1. docker-compose -f ./backend-appvideos/docker-compose.yaml up -d
1. docker-compose -f ./backend-appvideos/containers/kafka/docker-compose.yaml up -d
1. docker-compose -f ./backend-appvideos/containers/elastic/docker-compose.yaml up -d

1. docker-compose -f ./backend-kafka/docker-compose.yaml up -d

1. docker-compose -f ./frontned-appvideos/docker-compose.yaml up -d

## Usando Kubernetes

kubectl apply -f ./backend-appvideos/k8s/1_mysql.yaml
kubectl apply -f ./backend-appvideos/k8s/2_redis.yaml
kubectl apply -f ./backend-appvideos/k8s/3_backend.yaml

kubectl apply -f ./frontned-appvideos/k8s/frontend.yaml

elastic

kafka confluent

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

## Usando o SonarQube

docker run \
 --rm \
 -e SONAR_HOST_URL=http://localhost:9000 \
 -e SONAR_LOGIN=b966f0bf89b56317906880c5392f3ae36f1cc9aa \
 -v "$(pwd):/usr/src" \
 sonarsource/sonar-scanner-cli

sonar-scanner \
 -Dsonar.projectKey=backend-appvideos \
 -Dsonar.sources=. \
 -Dsonar.host.url=http://localhost:9000 \
 -Dsonar.login=b966f0bf89b56317906880c5392f3ae36f1cc9aa

## Kubernetes comandos

mysql e redis, espere o container ser criado pra depois cria o backend

kubectl port-forward svc/backend 3001:3001
kubectl port-forward svc/frontend 3000:3000

kubectl apply -f configmap.yaml
kubectl apply -f app.yaml
kubectl get po (ou 'pods')
kubectl get svc (ou 'services')
kubectl logs <nome-pod>
kubectl port-forward svc/<nome> <host-port>:<service-port>
kubectl port-forward svc/<nome> 8000:80 (funciona pra loadbalancer ou padrao)
kubectl describe deployment appvideos

### Explicando a rede no K8S

1. MySQL e Redis só serão usados dentro do cluster k8s, então o service é do tipo ClusterIP
1. O frontend precisa ter acesso externo ao cluster, por isso seu tipo é LoadBalancer.
1. O backend poderia ser do tipo ClusterIP, já que seu acesso seria so dentro do cluster, porem o frontend está sendo acessado fora do cluster (Browser) e quando haver uma requisição do tipo GET, ele precisa ter acesso ao cluster pra acessar o backend. Logo seu service é tipo LoadBalancer.
