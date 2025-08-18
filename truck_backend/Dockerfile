FROM node:20-bullseye

WORKDIR /app

# ติดตั้ง dependencies สำหรับ node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# คัดลอก package.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code
COPY . .

EXPOSE 3333

CMD ["npm", "start"]

