FROM node:12.14.0-alpine as buildPhase
RUN mkdir app
WORKDIR app
COPY package.json .
COPY package-lock.json .
COPY /src ./src
RUN npm install --only=prod

FROM node:12.14.0-alpine as app
COPY --from=buildPhase /app/node_modules /app/node_modules
COPY --from=buildPhase /app/src /app/src
ENV PGHOST default
ENV PGPORT default
ENV PGUSER default
ENV PGPASSWORD default
ENV PGDATABASE default
CMD ["node", "/app/src/server.js"]