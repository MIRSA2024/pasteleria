# Sistema de Ventas para Pastelería

![Java](https://img.shields.io/badge/Java-21-007396?logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![H2](https://img.shields.io/badge/H2%20Database-003B57)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

## Descripción

Aplicación web para la gestión de pedidos de una pastelería, con catálogo de productos, carrito de compras, seguimiento de pedidos y panel de administración para gestionar productos, pedidos y entregas.

## Contexto del negocio

La organización objeto de estudio es una pastelería de tamaño pequeño–mediano ubicada en San Isidro, Lima, dedicada a la elaboración y venta de tortas, postres personalizados y productos de pastelería fina. Atiende tanto pedidos presenciales como pedidos por redes sociales y teléfono.

## Tecnologías utilizadas

### Frontend

- Next.js 16 (App Router, carpeta `app/`)
- React 19 con componentes funcionales en TypeScript (`.tsx`)
- CSS global (`app/globals.css`) para estilos de la interfaz
- Axios para el consumo de la API REST del backend
- jwt-decode para decodificar tokens JWT en el cliente
- lucide-react para iconos en la interfaz

### Backend

- Java 21
- Spring Boot 3.2
- Spring Web para la exposición de la API REST
- Spring Data JPA para el acceso a datos
- Spring Security para autenticación y autorización
- Bean Validation para validaciones de entrada
- JSON Web Tokens (jjwt 0.12.3) para autenticación basada en tokens
- MySQL como base de datos principal
- H2 Database para desarrollo/pruebas
- Lombok para reducir código boilerplate
- Maven como gestor de dependencias y build
- Juan Carlos Huaman Calle
- Kevin Fabian Vargas Arroyo
