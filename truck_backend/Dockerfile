FROM node:20-bullseye

WORKDIR /app

# ติดตั้ง dependencies สำหรับ node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    unixodbc-dev \
    wget \
    gnupg \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    && rm -rf /var/lib/apt/lists/*

# คัดลอก package.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code
COPY . .

EXPOSE 3333

CMD ["npm", "start"]

