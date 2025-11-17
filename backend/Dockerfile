FROM php:8.2-apache

# Extensiones necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

# Apache rewrite
RUN a2enmod rewrite

# Copiar backend al webroot
COPY . /var/www/html

# Permisos
RUN chown -R www-data:www-data /var/www/html

# Configuración Apache
RUN echo "<Directory /var/www/html>
    AllowOverride All
    Require all granted
</Directory>" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom
