package com.pasteleria.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Configuración de Spring Security
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Bean para codificar contraseñas con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Proveedor de autenticación
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Manager de autenticación
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Cadena de filtros de seguridad
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (no es necesario para APIs REST con JWT)
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")
                .disable())
            
            // Permitir frames para H2 Console
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            )

            // Configurar autorización de peticiones
            .authorizeHttpRequests(auth -> auth
                    // Rutas completamente públicas
                    .requestMatchers("/", "/api", "/error", "/health").permitAll()
                    .requestMatchers("/h2-console/**").permitAll()
                    .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/ping").permitAll()
                    .requestMatchers("/api/auth/dev/**").permitAll()
                    .requestMatchers("/api/products/public/**").permitAll()

                    // Específicos de ADMIN dentro de /delivery deben ir antes del patrón general
                    .requestMatchers("/api/delivery/admin/**").hasRole("ADMIN")

                    // Rutas protegidas por rol
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/delivery/**").hasRole("DELIVERY")
                    .requestMatchers("/api/orders/**").hasAnyRole("CLIENTE", "ADMIN")

                    // Cualquier otra petición requiere estar autenticado
                    .anyRequest().authenticated()
            )

            // Configurar manejo de excepciones
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No autorizado");
                    })
            )

            // Política de sesión: sin estado (stateless)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Agregar proveedor de autenticación
            .authenticationProvider(authenticationProvider())

            // Agregar filtro JWT antes del filtro de autenticación
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
