# Étape 1: Construction de l'application
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration de package et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Serveur pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire de NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
