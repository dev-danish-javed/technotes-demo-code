# Bring base image
FROM node:20

# Set work directory
WORKDIR /app/school-app/students-ms

# copy files json
COPY . /app/school-app/students-ms

# install dependencies
RUN npm install

# expose port
EXPOSE 8181

CMD ["node", "index.js", "8181"]

