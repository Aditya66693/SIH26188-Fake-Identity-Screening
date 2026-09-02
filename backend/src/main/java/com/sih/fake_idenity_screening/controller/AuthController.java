package com.sih.fake_idenity_screening.controller;

import com.sih.fake_idenity_screening.entity.User;
import com.sih.fake_idenity_screening.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return authService.login(user.getEmail(), user.getPassword());
    }

    @GetMapping("/test")
    public String testAuth() {
        return "Auth API is working!";
    }
}