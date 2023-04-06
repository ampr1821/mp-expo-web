FROM node:18-slim

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

RUN apt update --quiet && apt install -y --quiet python3-venv

# setup virtual env and install dependencies
COPY requirements.txt /app
RUN mkdir venv/
RUN python3 -m venv venv/
RUN venv/bin/pip install -r requirements.txt

# download graph
COPY download_graph.py /app
RUN venv/bin/python3 download_graph.py

COPY package.json /app

RUN npm install --production

COPY . /app
RUN chmod +x run.sh

ENTRYPOINT ["./run.sh"]