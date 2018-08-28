
FROM sdelrio/docker-minimal-nginx
COPY . /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
