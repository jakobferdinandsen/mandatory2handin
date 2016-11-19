FROM nginx

RUN rm -f /etc/nginx/conf.d/*

RUN echo "deb http://httpredir.debian.org/debian stretch main\ndeb-src http://httpredir.debian.org/debian stretch main" > /etc/apt/sources.list.d/stretch.list
RUN apt-get update && apt-get install -my \
  supervisor \
  php7.0 \
  php7.0-fpm \
  php7.0-mysql \
  php7.0-xdebug \
  composer \
  zip \
  unzip

COPY nginx.conf /etc/nginx/
COPY supervisord.conf /etc/supervisor/conf.d/
COPY php.ini /etc/php/7.0/fpm/conf.d/40-custom.ini
COPY server.conf /etc/nginx/conf.d/

RUN service php7.0-fpm start

VOLUME ["/data/www"]

ENTRYPOINT ["usr/bin/supervisord"]
