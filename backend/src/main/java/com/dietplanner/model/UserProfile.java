package com.dietplanner.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    private Integer age;

    @NotBlank
    private String gender;

    @NotNull
    private Double height; // cm

    @NotNull
    private Double weight; // kg

    @NotBlank
    @Column(name = "activity_level")
    private String activityLevel; // sedentary, moderate, active

    @NotBlank
    private String goal; // weight-loss, muscle-gain, maintain-weight

    @NotBlank
    @Column(name = "food_preference")
    private String foodPreference; // vegetarian, non-vegetarian

    private String allergies; // Comma separated values or descriptive text
    
    @Column(name = "medical_conditions")
    private String medicalConditions; // Comma separated values or descriptive text

    // Calculated metrics
    private Double bmi;
    private Double bmr;
    private Double tdee;
    
    @Column(name = "daily_calories")
    private Double dailyCalories;

    public UserProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getFoodPreference() { return foodPreference; }
    public void setFoodPreference(String foodPreference) { this.foodPreference = foodPreference; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }
    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public Double getBmr() { return bmr; }
    public void setBmr(Double bmr) { this.bmr = bmr; }
    public Double getTdee() { return tdee; }
    public void setTdee(Double tdee) { this.tdee = tdee; }
    public Double getDailyCalories() { return dailyCalories; }
    public void setDailyCalories(Double dailyCalories) { this.dailyCalories = dailyCalories; }
}
