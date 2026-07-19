# Lab 2: Introduction to Laravel and Environment Setup

---

## Scopes
* Install Laravel using Composer
* Create a new Laravel project
* Run the development server and view the default page
* Update content of default page view

---

## Check PHP Environment

### • Check PHP version
```bash
php --version
```

### • Check the list of enabled PHP extensions or Loaded Modules
```bash
php -m
```

### • Check specific extension
```bash
php -m | grep mysqli
php -m | grep pdo_mysql
```

### • Install PHP Extensions
#### Mac
```bash
brew install php-<extension_name>
```
>Example:
```bash
brew install php@8.2-mysql
```
#### Windows
```text
1. Locate the php.ini file and edit it using a text editor (e.g., Notepad).

2. Find the section for extensions (look for lines starting with extension=...).

3. Add or uncomment the line for the extension you want to enable.
```
>For example:

```
extension=php_mysql.dll
```

### • Check if Composer is Installed
```bash
composer --version
```

---

## Create New Laravel Project
### • Create Laravel project with the latest version
```bash
composer create-project laravel/laravel contact_app
```

### • Create Laravel project with a preferred version
```bash
composer create-project --prefer-dist laravel/laravel contact_app "10.*"
```

## Start Laravel's Local Development Server
```bash
php artisan serve
```

## Update Default Page
Update the default page layout to display the following information:
```
Your Image

Laravel

Your name: Sok Dara

Class: 

Documentation
```

### Sample Code 
>resources/views/welcome.blade.php

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel</title>
    <link href="[https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css](https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css)" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        
        <div class="text-center mb-8">
            <img src="{{ asset('images/logo.jpg') }}" alt="Laravel Logo" class="w-20 h-20 mx-auto">
            <h1 class="text-4xl font-bold mt-4">Laravel</h1>
        </div>

        <div class="bg-white text-center p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold mb-4">Your name: Sok Dara</h2>
            <h2 class="text-2xl font-semibold mb-4">Class: M1</h2>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold mb-4">Documentation</h2>
            <p class="text-gray-700">
                Laravel has wonderful documentation covering every aspect of the framework. Whether you are a newcomer or have prior experience with Laravel, we recommend reading our documentation from beginning to end.
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold mb-4">Laracasts</h2>
            <p class="text-gray-700">
                Laracasts offers thousands of video tutorials on Laravel, PHP, and JavaScript development. Check them out, see for yourself, and massively level up your development skills in the process.
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
            <h2 class="text-2xl font-semibold mb-4">Laravel News</h2>
            <p class="text-gray-700">
                Laravel News is a community-driven portal and newsletter aggregating all of the latest and most important news in the Laravel ecosystem, including new package releases and tutorials.
            </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <h2 class="text-2xl font-semibold mb-4">Vibrant Ecosystem</h2>
            <p class="text-gray-700">
                Laravel's robust library of first-party tools and libraries, such as Forge, Vapor, Nova, Envoyer, and Herd help you take your projects to the next level. Pair them with powerful open-source libraries like Cashier, Dusk, Echo, Horizon, Sanctum, Telescope, and more.
            </p>
        </div>

    </div>
</body>
</html>
```