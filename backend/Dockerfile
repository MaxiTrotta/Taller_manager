FROM php:8.2-apache

# Instalar dependencias necesarias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql

# Habilitar mod_rewrite (necesario para rutas)
RUN a2enmod rewrite

# Instalar Composer oficial dentro de la imagen
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar el backend
COPY . /var/www/html/

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Instalar las dependencias de PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos
RUN chown -R www-data:www-data /var/www/html

# Configurar Apache
RUN echo "<Directory /var/www/html>
    AllowOverride All
    Require all granted
</Directory>" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

EXPOSE 80

CMD ["apache2-foreground"]
