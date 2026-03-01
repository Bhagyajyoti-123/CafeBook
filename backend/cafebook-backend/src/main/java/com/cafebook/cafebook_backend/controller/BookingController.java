package com.cafebook.cafebook_backend.controller;

import com.cafebook.cafebook_backend.model.Booking;
import com.cafebook.cafebook_backend.model.User;
import com.cafebook.cafebook_backend.repository.BookingRepository;
import com.cafebook.cafebook_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Book a café
    @PostMapping("/book")
    public ResponseEntity<String> bookCafe(@RequestBody Booking bookingRequest) {
        User user = userRepository.findById(bookingRequest.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }

        if (user.getWalletBalance() < bookingRequest.getAmount()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient balance!");
        }

        // Deduct amount from wallet
        user.setWalletBalance(user.getWalletBalance() - bookingRequest.getAmount());
        userRepository.save(user);

        // Save booking
        bookingRepository.save(bookingRequest);

        return ResponseEntity.ok("Booking successful!");
    }

    // ✅ Get all bookings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
        }
        List<Booking> bookings = bookingRepository.findAll()
                .stream()
                .filter(b -> b.getUserId().equals(userId))
                .toList();
        return ResponseEntity.ok(bookings);
    }
}