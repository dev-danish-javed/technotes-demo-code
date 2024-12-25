# Bring base image
FROM node:20

# Set work directory
WORKDIR /app/school-app/accounts-ms

# copy files json
COPY . /app/school-app/accounts-ms

# install dependencies
RUN npm install

# expose port
EXPOSE 8080

CMD ["node", "index.js", "8080"]

