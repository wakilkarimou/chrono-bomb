FROM node:20-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/src ./src/
COPY --from=client-build /app/client/dist ../client/dist/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["npx", "tsx", "src/index.ts"]
