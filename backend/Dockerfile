FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Configurar Apache para permitir .htaccess
RUN printf "<Directory /var/www/html/>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

# Copiar backend al contenedor
COPY . /var/www/html

# Permisos recomendados
RUN chown -R www-data:www-data /var/www/html
