package com.dietplanner.controller;

import com.dietplanner.dto.UserProfileRequest;
import com.dietplanner.dto.UserProfileResponse;
import com.dietplanner.model.User;
import com.dietplanner.model.UserProfile;
import com.dietplanner.repository.UserProfileRepository;
import com.dietplanner.repository.UserRepository;
import com.dietplanner.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserProfile profile = userProfileRepository.findByUserId(userPrincipal.getId())
                .orElse(null);

        if (profile == null) {
            return ResponseEntity.ok(new UserProfileResponse()); // Return empty profile
        }

        return ResponseEntity.ok(convertToResponse(profile));
    }

    @PostMapping
    public ResponseEntity<?> saveUserProfile(Authentication authentication, @Valid @RequestBody UserProfileRequest request) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(userPrincipal.getId())
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());
        profile.setActivityLevel(request.getActivityLevel());
        profile.setGoal(request.getGoal());
        profile.setFoodPreference(request.getFoodPreference());
        profile.setAllergies(request.getAllergies());
        profile.setMedicalConditions(request.getMedicalConditions());

        // Perform calculations
        calculateMetrics(profile);

        userProfileRepository.save(profile);

        return ResponseEntity.ok(convertToResponse(profile));
    }

    private void calculateMetrics(UserProfile profile) {
        // Calculate BMI
        double heightInMeters = profile.getHeight() / 100.0;
        double bmi = profile.getWeight() / (heightInMeters * heightInMeters);
        profile.setBmi(Math.round(bmi * 10.0) / 10.0);

        // Calculate BMR using Mifflin-St Jeor Formula
        double bmr = 0;
        if ("male".equalsIgnoreCase(profile.getGender())) {
            bmr = (10 * profile.getWeight()) + (6.25 * profile.getHeight()) - (5 * profile.getAge()) + 5;
        } else {
            bmr = (10 * profile.getWeight()) + (6.25 * profile.getHeight()) - (5 * profile.getAge()) - 161;
        }
        profile.setBmr(Math.round(bmr * 10.0) / 10.0);

        // Calculate TDEE based on activity level
        double activityMultiplier = 1.2; // sedentary
        if ("moderate".equalsIgnoreCase(profile.getActivityLevel())) {
            activityMultiplier = 1.55;
        } else if ("active".equalsIgnoreCase(profile.getActivityLevel())) {
            activityMultiplier = 1.725;
        }
        double tdee = bmr * activityMultiplier;
        profile.setTdee(Math.round(tdee * 10.0) / 10.0);

        // Adjust calories based on goal
        double dailyCalories = tdee;
        if ("weight-loss".equalsIgnoreCase(profile.getGoal())) {
            dailyCalories -= 500;
        } else if ("muscle-gain".equalsIgnoreCase(profile.getGoal())) {
            dailyCalories += 300;
        }
        profile.setDailyCalories(Math.round(dailyCalories * 10.0) / 10.0);
    }

    private UserProfileResponse convertToResponse(UserProfile profile) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(profile.getId());
        response.setAge(profile.getAge());
        response.setGender(profile.getGender());
        response.setHeight(profile.getHeight());
        response.setWeight(profile.getWeight());
        response.setActivityLevel(profile.getActivityLevel());
        response.setGoal(profile.getGoal());
        response.setFoodPreference(profile.getFoodPreference());
        response.setAllergies(profile.getAllergies());
        response.setMedicalConditions(profile.getMedicalConditions());
        response.setBmi(profile.getBmi());
        response.setBmr(profile.getBmr());
        response.setTdee(profile.getTdee());
        response.setDailyCalories(profile.getDailyCalories());
        return response;
    }
}
