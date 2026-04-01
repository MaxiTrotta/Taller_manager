#!/bin/bash
set -e

# Disable conflicting MPM modules at runtime
a2dismod mpm_event 2>/dev/null || true
a2dismod mpm_worker 2>/dev/null || true
a2dismod mpm_async 2>/dev/null || true
a2enmod mpm_prefork

# Start Apache
exec apache2-foreground
