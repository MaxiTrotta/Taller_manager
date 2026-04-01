FROM php:8.2-apache

# ================================
# Instalar dependencias del sistema
# ================================
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
    && docker-php-ext-install pdo pdo_mysql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ================================
# Configuración de Apache
# ================================
# Activar mod_rewrite
RUN a2enmod rewrite

# 🔧 FIX CRÍTICO: evitar error "More than one MPM loaded"
RUN a2dismod mpm_event && \
    a2dismod mpm_worker && \
    a2enmod mpm_prefork

# ================================
# Instalar Composer
# ================================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ================================
# Copiar proyecto
# ================================
COPY . /var/www/html/
WORKDIR /var/www/html

# ================================
# Instalar dependencias PHP
# ================================
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ================================
# Permisos
# ================================
RUN chown -R www-data:www-data /var/www/html

# ================================
# Configuración de Apache (AllowOverride para .htaccess)
# ================================
RUN printf "<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

# ================================
# Puerto
# ================================
EXPOSE 80

# ================================
# Comando de inicio
# ================================
CMD ["apache2-foreground"]
