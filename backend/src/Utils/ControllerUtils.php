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
        $json = file_get_contents('php://input');
        
        if (empty($json)) {
            return [];
        }
        
        $postData = json_decode($json, true);
        return $postData;
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
