# ==========================================
# Dockerfile para Backend (Node.js + Express)
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente y esquemas
COPY . .

# Exponer el puerto del servidor API
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Comando de inicio
CMD ["npm", "start"]
