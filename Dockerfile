FROM node:lts AS dist

# Copy package files first
COPY package.json yarn.lock ./

# Install dependencies using npm (more reliable in Docker)
RUN npm install --ignore-scripts

# Copy source code
COPY . ./

# Build the application
RUN npm run build:prod

FROM node:lts AS node_modules

# Copy package files for production install
COPY package.json yarn.lock ./

# Install only production dependencies using npm (skip prepare script)
RUN npm install --omit=dev --ignore-scripts

FROM node:lts

ARG PORT=3000

ENV NODE_ENV=production
ENV PROD=true

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Copy built application and production node_modules
COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

# Copy necessary files for runtime
COPY package.json ./

# Rebuild native modules for the target platform
RUN npm rebuild bcrypt

EXPOSE $PORT

CMD [ "node", "dist/main.js" ]
