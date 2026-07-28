package com.dietplanner.controller;

import com.dietplanner.model.UserProfile;
import com.dietplanner.repository.UserProfileRepository;
import com.dietplanner.service.GeminiService;
import com.dietplanner.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<?> askChatbot(Authentication authentication, @RequestBody Map<String, String> request) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String message = request.get("message");

        if (message == null || message.trim().isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Message content cannot be empty.");
            return ResponseEntity.badRequest().body(err);
        }

        // Retrieve user context for personalized responses
        UserProfile profile = userProfileRepository.findByUserId(userPrincipal.getId())
                .orElse(null);

        String context = "No user profile set up yet.";
        if (profile != null) {
            context = String.format("User age is %d, gender %s, height %.0f cm, weight %.0f kg, activity level %s, diet goal %s, preference %s, allergies '%s', medical conditions '%s'.",
                    profile.getAge(), profile.getGender(), profile.getHeight(), profile.getWeight(),
                    profile.getActivityLevel(), profile.getGoal(), profile.getFoodPreference(),
                    profile.getAllergies() != null ? profile.getAllergies() : "none",
                    profile.getMedicalConditions() != null ? profile.getMedicalConditions() : "none");
        }

        String responseText = geminiService.askChatbot(message, context);
        
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("response", responseText);
        
        return ResponseEntity.ok(responseBody);
    }
}
