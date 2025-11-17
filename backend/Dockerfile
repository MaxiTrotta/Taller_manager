FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    && docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Instalar Composer (sin usar multi-stage)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Copiar backend
COPY . /var/www/html/

# Directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html

# Configuración Apache
RUN echo "<Directory /var/www/html>
    AllowOverride All
    Require all granted
</Directory>" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

EXPOSE 80

CMD ["apache2-foreground"]
