# 🚀 Kubernetes Task Manager

Projet Full Stack et DevOps permettant de gérer des tâches et de mettre en pratique Docker, Kubernetes, CI/CD, Prometheus, Grafana et Alertmanager.

## 🎯 Objectif

L’objectif est de construire une application CRUD puis de mettre en place toute sa chaîne DevOps :

```text
Développement
    ↓
Docker
    ↓
GitHub Actions
    ↓
GHCR
    ↓
Kubernetes
    ↓
Prometheus
    ↓
Grafana
    ↓
Alertmanager
```

## 🛠️ Technologies

### Application
- Frontend : HTML, CSS, JavaScript, Nginx
- Backend : Node.js, Express
- Base de données : MySQL

### DevOps
- Docker
- Docker Compose
- Kubernetes
- Minikube
- GitHub Actions
- GitHub Container Registry
- Self-hosted Runner

### Monitoring
- Prometheus
- Grafana
- Alertmanager
- prom-client

## 📂 Structure du projet

```text
k8s-task-manager/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── k8s/
│   ├── backend/
│   ├── frontend/
│   ├── mysql/
│   ├── ingress/
│   └── monitoring/
│
├── .github/workflows/
│   ├── ci.yml
│   ├── cd.yml
│   └── deploy.yml
│
├── docker-compose.yml
└── README.md
```

## ⚙️ API Backend

Le backend fonctionne sur le port `3000`.

Principales routes :

```text
GET    /health
GET    /metrics

GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

`/health` est utilisé par Kubernetes pour les probes.

`/metrics` expose les métriques Prometheus.

## 🐳 Docker

Lancer le projet avec Docker Compose :

```bash
docker compose up -d --build
```

Vérifier :

```bash
docker compose ps
```

Arrêter :

```bash
docker compose down
```

## ☸️ Kubernetes

Le projet utilise Minikube pour exécuter Kubernetes localement.

Démarrer le cluster :

```bash
minikube start
```

Déployer les ressources :

```bash
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/
```

Vérifier :

```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

Le projet utilise notamment :

- Deployments
- Services
- ConfigMap
- Secrets
- PersistentVolumeClaim
- Readiness Probe
- Liveness Probe
- Ingress

## 💾 Persistance MySQL

MySQL utilise un `PersistentVolumeClaim`.

```text
MySQL
  ↓
/var/lib/mysql
  ↓
mysql-pvc
  ↓
PersistentVolume
```

Cela permet de conserver les données même si le Pod MySQL est recréé.

## ♻️ Self-Healing et Scaling

Kubernetes recrée automatiquement un Pod supprimé.

Exemple de scaling :

```bash
kubectl scale deployment backend --replicas=2
```

Retour à une instance :

```bash
kubectl scale deployment backend --replicas=1
```

## 🔄 CI/CD

Le projet utilise GitHub Actions.

```text
git push
   ↓
CI
   ↓
Build Docker
   ↓
GHCR
   ↓
Deploy Workflow
   ↓
Self-hosted Runner
   ↓
Kubernetes
```

Les images sont publiées dans GitHub Container Registry :

```text
ghcr.io/dazibfh/k8s-task-manager-backend:latest

ghcr.io/dazibfh/k8s-task-manager-frontend:latest
```

## 📊 Monitoring

Prometheus collecte les métriques de Kubernetes et du backend Node.js.

Le backend expose :

```text
/metrics
```

Un `ServiceMonitor` permet à Prometheus de récupérer automatiquement ces métriques.

```text
Backend
   ↓
/metrics
   ↓
ServiceMonitor
   ↓
Prometheus
   ↓
Grafana
```

## 📈 Dashboard Grafana

Le dashboard permet notamment de surveiller :

- CPU des Pods
- RAM des Pods
- Redémarrages des Pods
- État des Pods
- Nombre de Pods actifs
- État du backend
- Mémoire Node.js
- CPU Node.js
- Requêtes HTTP
- Erreurs HTTP 5xx
- Temps de réponse moyen
- Temps de réponse P95

Accès à Grafana :

```bash
kubectl port-forward \
  -n monitoring \
  service/my-grafana \
  3001:80
```

Puis :

```text
http://localhost:3001
```

## 🚨 Alerting

Une règle Prometheus surveille la disponibilité du backend.

Si le backend devient indisponible :

```text
Backend DOWN
     ↓
Prometheus
     ↓
BackendDown
     ↓
Alertmanager
     ↓
Notification Email
```

La règle est définie dans :

```text
k8s/monitoring/backend-alert-rules.yaml
```

La configuration Alertmanager :

```text
k8s/monitoring/backend-alertmanager-config.yaml
```

## 🔐 Sécurité

Les données sensibles ne sont pas stockées dans GitHub.

Les mots de passe MySQL et Gmail sont stockés dans des Kubernetes Secrets.

Les fichiers contenant de vrais secrets doivent rester exclus avec `.gitignore`.

## 🧪 Tester l'alerte BackendDown

Arrêter temporairement le backend :

```bash
kubectl scale deployment backend --replicas=0
```

Après environ une minute, l’alerte `BackendDown` passe en `FIRING`.

Remettre ensuite le backend :

```bash
kubectl scale deployment backend --replicas=1
kubectl rollout status deployment/backend
```

## 🔁 Après redémarrage de la VM

```bash
minikube start

kubectl get nodes
kubectl get pods
kubectl get pods -n monitoring
```

Pour relancer le GitHub Runner :

```bash
cd ~/actions-runner
./run.sh
```

## 🚀 Améliorations futures

- Export du dashboard Grafana en JSON
- HTTPS / TLS
- Horizontal Pod Autoscaler
- Resource requests / limits
- Loki pour les logs
- OpenTelemetry
- Déploiement sur un Kubernetes Cloud

## 👨‍💻 Auteur

**Ismail**

GitHub :

```text
https://github.com/dazibfh
```

Repository :

```text
https://github.com/dazibfh/k8s-task-manager
```
