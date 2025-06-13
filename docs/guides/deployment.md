# Guide de déploiement

Ce guide explique comment construire et lancer l'application avec Docker.

## 1. Construire l'image

```bash
docker build -t postman-runner .
```

L'image compile l'application puis copie les fichiers dist dans Nginx.

## 2. Démarrer le conteneur

```bash
docker run -p 8080:80 postman-runner
```

Accédez à `http://localhost:8080` pour voir l'application.
