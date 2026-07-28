package com.dietplanner.controller;

import com.dietplanner.model.UserProfile;
import com.dietplanner.repository.UserProfileRepository;
import com.dietplanner.service.GeminiService;
import com.dietplanner.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/diet")
public class AiDietController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/recommend")
    public ResponseEntity<?> getRecommendation(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserProfile profile = userProfileRepository.findByUserId(userPrincipal.getId())
                .orElse(null);

        if (profile == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Please complete your profile details first to generate custom AI recommendations.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        try {
            String planJson = geminiService.getDietRecommendation(profile);
            return ResponseEntity.ok(planJson);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to generate AI recommendations: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
