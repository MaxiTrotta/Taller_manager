FROM php:8.2-apache

# Instalamos dependencias necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Copiar proyecto al servidor
COPY . /var/www/html/

# Permisos
RUN chown -R www-data:www-data /var/www/html

# Configuración para permitir .htaccess
RUN printf "<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom
