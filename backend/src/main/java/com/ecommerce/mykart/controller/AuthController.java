package com.ecommerce.mykart.controller;

import com.ecommerce.mykart.dto.LoginRequest;
import com.ecommerce.mykart.dto.MessageResponse;
import com.ecommerce.mykart.dto.SignupRequest;
import com.ecommerce.mykart.model.User;
import com.ecommerce.mykart.repository.UserRepository;
import com.ecommerce.mykart.security.JwtUtils;
import com.ecommerce.mykart.security.UserDetailsImpl;
import com.ecommerce.mykart.dto.JwtResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            logger.info("User authenticated successfully: {}", userDetails.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getFirstName(),
                    userDetails.getLastName()));
        } catch (DataAccessException e) {
            logger.error("Database error during authentication: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred during authentication"));
        } catch (Exception e) {
            logger.error("Error during authentication: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid email or password"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            // Create new user's account
            User user = new User();
            user.setEmail(signUpRequest.getEmail());
            user.setUsername(signUpRequest.getEmail()); // Set username to email
            user.setPassword(encoder.encode(signUpRequest.getPassword()));
            user.setFirstName(signUpRequest.getFirstName());
            user.setLastName(signUpRequest.getLastName());

            userRepository.save(user);
            
            logger.info("User registered successfully: {}", user.getEmail());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (DataAccessException e) {
            logger.error("Database error during user registration: ", e);
            return ResponseEntity.status(500).body(new MessageResponse("Database error occurred during registration"));
        } catch (Exception e) {
            logger.error("Error during user registration: ", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error occurred during registration"));
        }
    }
}