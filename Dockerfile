# FROM node:24-alpine3.20
# ADD ./app /app
# WORKDIR /app

# RUN npm install \ 
#     && npx playwright install \
#     && npm install -g tsx

# RUN npx tsc
# RUN npx playwright install chromium

# EXPOSE 3000


FROM ubuntu:24.04

# Set Timezone
ENV TZ=America/Los_Angeles

# Install system dependencies and Node.js 20.x (adjust if you need a different version)
RUN apt-get update && \
    apt-get install -y curl wget gnupg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs cron && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy your app files
ADD ./app /app
# ADD .env /app/.env
ADD crontab /etc/cron.d/crontab
RUN service cron start

# Install npm dependencies
RUN npm install

# Install Playwright and its browser dependencies
RUN npx playwright install --with-deps chromium

# Install tsx globally
RUN npm install -g tsx

# Compile TypeScript
RUN npx tsc