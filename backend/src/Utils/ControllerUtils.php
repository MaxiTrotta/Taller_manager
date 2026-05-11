<?php 

declare(strict_types = 1);

namespace Src\Utils;

use Exception;

final readonly class ControllerUtils {
    
    public static function getGet(string $name, bool $required = true, mixed $default = null): mixed 
    {
        $postData = self::getGetData();
        
        $value = $postData[$name] ?? null;

        if ($required && $value === null) {
            throw new Exception(sprintf("Parameter %s not found", $name));
        } 

        return $value ?? $default;
    }

    private static function getGetData(): array
    {
        $data = $_GET;
        
        if (empty($data)) {
            return [];
        }
        
        return $data;
    }


    public static function getPost(string $name, bool $required = true, mixed $default = null): mixed 
    {
        $postData = self::getPostData();
        
        $value = $postData[$name] ?? null;

        if ($required && $value === null) {
            throw new Exception(sprintf("Parameter %s not found", $name));
        } 

        return $value ?? $default;
    }

    private static function getPostData(): array
    {
        // Read raw request body
        $input = file_get_contents('php://input');

        // If there's no raw body, rely on PHP's parsed $_POST (typical for form submissions)
        if ($input === false || $input === null || $input === '') {
            return $_POST ?? [];
        }

        // Try parse as JSON first
        $postData = json_decode($input, true);
        if (is_array($postData)) {
            return $postData;
        }

        // If not JSON, try form-encoded body (e.g. "a=1&b=2")
        parse_str($input, $parsed);
        if (is_array($parsed) && !empty($parsed)) {
            return $parsed;
        }

        // Fallback to $_POST if available
        return $_POST ?? [];
    }

    public static function getFile(string $name, bool $required = true, mixed $default = null): mixed 
    {
        $fileData = self::getFileData();
        
        $value = $fileData[$name] ?? null;

        if ($required && $value === null) {
            throw new Exception(sprintf("Parameter %s not found", $name));
        } 

        return $value ?? $default;
    }

    private static function getFileData(): array
    {
        return $_FILES;
    }

    public static function getHeader(string $name): string
    {
        $headers = getallheaders();
        $header = $headers[$name];
        if ($header === null) {
            throw new Exception(sprintf("Header %s not found", $name));
        }
        return $header;
    }

    public static function getHeaderToken(): string
    {
        return self::getHeader("x-api-key");
    }
}
