FROM node:18
COPY .docker.env .env
COPY . .
EXPOSE 3000
ENV PORT 3000
CMD [ "npm", "start" ]