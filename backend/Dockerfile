FROM php:8.2-apache

# Remove conflicting MPM modules completely - keep only mpm_prefork
# Disable first (while files still exist), then remove, then enable prefork
RUN a2dismod mpm_event mpm_worker \
    && rm -f /etc/apache2/mods-available/mpm_event.load \
    && rm -f /etc/apache2/mods-available/mpm_worker.load \
    && rm -f /etc/apache2/mods-available/mpm_async.load \
    && a2enmod mpm_prefork

# Instalar dependencias de sistema necesarias para compilar PDO y MySQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    default-libmysqlclient-dev \
    && docker-php-ext-install pdo pdo_mysql

# Activar mod_rewrite
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar backend
COPY . /var/www/html/

WORKDIR /var/www/html

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Asignar permisos correctos
RUN chown -R www-data:www-data /var/www/html

# Configuración Apache
RUN printf "<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

EXPOSE 80

CMD ["apache2-foreground"]
