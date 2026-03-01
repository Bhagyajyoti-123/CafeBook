package com.cafebook.cafebook_backend.controller;

import com.cafebook.cafebook_backend.model.User;
import com.cafebook.cafebook_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered!");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Signup success");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }
    }

    @PostMapping("/recharge/{userId}")
    public ResponseEntity<String> rechargeWallet(@PathVariable Long userId, @RequestParam double amount) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        user.setWalletBalance(user.getWalletBalance() + amount);
        userRepository.save(user);
        return ResponseEntity.ok("Wallet recharged successfully!");
    }

    @PostMapping("/activate/{userId}")
    public ResponseEntity<String> activateMembership(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        user.setMembershipStatus(true);
        userRepository.save(user);
        return ResponseEntity.ok("Membership activated!");
    }

    @PostMapping("/deactivate/{userId}")
    public ResponseEntity<String> deactivateMembership(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        user.setMembershipStatus(false);
        userRepository.save(user);
        return ResponseEntity.ok("Membership deactivated!");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(user);
    }
}