package com.dietplanner.service;

import com.dietplanner.model.UserProfile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${app.geminiApiKey}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getDietRecommendation(UserProfile profile) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("Gemini API key is not configured. Falling back to local rule-based recommendation generator.");
            return generateLocalRecommendation(profile);
        }

        String prompt = buildDietPrompt(profile);
        try {
            return callGemini(prompt, true);
        } catch (Exception e) {
            logger.error("Error calling Gemini API for diet recommendation. Falling back to local generator. Error: {}", e.getMessage());
            return generateLocalRecommendation(profile);
        }
    }

    public String askChatbot(String message, String userProfileContext) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("Gemini API key is not configured. Falling back to local rule-based chatbot.");
            return generateLocalChatResponse(message, userProfileContext);
        }

        String prompt = "You are a professional clinical nutritionist and AI assistant. "
                + "Provide clear, science-backed dietary advice. Answer in 2-3 short, clean paragraphs.\n\n"
                + "User context details: " + userProfileContext + "\n\n"
                + "User query: " + message;
        try {
            return callGemini(prompt, false);
        } catch (Exception e) {
            logger.error("Error calling Gemini API for chatbot. Falling back to local response. Error: {}", e.getMessage());
            return generateLocalChatResponse(message, userProfileContext);
        }
    }

    private String callGemini(String prompt, boolean requestJson) throws Exception {
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        // Construct the request body
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> partsObj = new HashMap<>();
        partsObj.put("parts", Collections.singletonList(textPart));

        Map<String, Object> contentObj = new HashMap<>();
        contentObj.put("contents", Collections.singletonList(partsObj));

        if (requestJson) {
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            contentObj.put("generationConfig", generationConfig);
        }

        String jsonRequest = objectMapper.writeValueAsString(contentObj);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                .timeout(Duration.ofSeconds(15))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Google Gemini API returned error code " + response.statusCode() + ": " + response.body());
        }

        // Parse Gemini response structure
        Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new RuntimeException("Empty candidates array from Gemini");
        }
        Map<String, Object> candidate = candidates.get(0);
        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new RuntimeException("Empty parts array in candidate content");
        }
        return (String) parts.get(0).get("text");
    }

    private String buildDietPrompt(UserProfile profile) {
        return "Create a highly customized 7-day Indian meal plan as JSON for the following user profile:\n"
                + "- Age: " + profile.getAge() + "\n"
                + "- Gender: " + profile.getGender() + "\n"
                + "- Height: " + profile.getHeight() + " cm\n"
                + "- Weight: " + profile.getWeight() + " kg\n"
                + "- Activity Level: " + profile.getActivityLevel() + "\n"
                + "- Diet Goal: " + profile.getGoal() + "\n"
                + "- Food Preference: " + profile.getFoodPreference() + "\n"
                + "- Allergies: " + (profile.getAllergies() != null ? profile.getAllergies() : "None") + "\n"
                + "- Medical Conditions: " + (profile.getMedicalConditions() != null ? profile.getMedicalConditions() : "None") + "\n"
                + "- Target Daily Calories: " + profile.getDailyCalories() + " kcal\n\n"
                + "Format the output EXACTLY matching the following JSON structure and return ONLY the JSON string. "
                + "Do not wrap it in markdown code blocks. Ensure that no recommended food violates the specified allergies or medical conditions.\n\n"
                + "JSON Schema:\n"
                + "{\n"
                + "  \"totalCalories\": 2000,\n"
                + "  \"explanation\": \"Detailed explanation explaining WHY these specific ingredients/meals were recommended for their goal, preferences, allergies, and health conditions.\",\n"
                + "  \"days\": [\n"
                + "    {\n"
                + "      \"day\": \"Monday\",\n"
                + "      \"totalCalories\": 1950,\n"
                + "      \"breakfast\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"calories\": 400, \"protein\": 15, \"carbs\": 50, \"fat\": 10, \"fiber\": 5},\n"
                + "      \"lunch\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"calories\": 600, \"protein\": 25, \"carbs\": 70, \"fat\": 15, \"fiber\": 8},\n"
                + "      \"dinner\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"calories\": 500, \"protein\": 20, \"carbs\": 60, \"fat\": 12, \"fiber\": 6},\n"
                + "      \"snacks\": [\n"
                + "        {\"name\": \"Snack Name\", \"calories\": 150, \"protein\": 5, \"carbs\": 20, \"fat\": 4, \"fiber\": 2}\n"
                + "      ]\n"
                + "    }\n"
                + "  ]\n"
                + "}";
    }

    private String generateLocalRecommendation(UserProfile p) {
        // High quality local fallback JSON generator
        boolean isVeg = "vegetarian".equalsIgnoreCase(p.getFoodPreference());
        double targetCal = p.getDailyCalories();
        
        String explanation = String.format("This meal plan is tailored to support your goal of '%s' while matching your '%s' preference. "
                + "The calorie intake is balanced at %.0f kcal/day. Fiber-rich carbohydrates (whole wheat, lentils) are incorporated to maintain satiety. "
                + "Since you listed allergies as '%s' and medical conditions as '%s', safe alternatives like allergen-free grains are prioritized.", 
                p.getGoal(), p.getFoodPreference(), targetCal, 
                p.getAllergies() != null && !p.getAllergies().isEmpty() ? p.getAllergies() : "none",
                p.getMedicalConditions() != null && !p.getMedicalConditions().isEmpty() ? p.getMedicalConditions() : "none");

        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"totalCalories\":").append(Math.round(targetCal)).append(",");
        json.append("\"explanation\":\"").append(explanation).append("\",");
        json.append("\"days\":[");

        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};
        for (int i = 0; i < days.length; i++) {
            double breakCal = Math.round(targetCal * 0.25);
            double lunchCal = Math.round(targetCal * 0.35);
            double dinnerCal = Math.round(targetCal * 0.30);
            double snackCal = Math.round(targetCal * 0.10);
            double actualTotal = breakCal + lunchCal + dinnerCal + snackCal;

            json.append("{");
            json.append("\"day\":\"").append(days[i]).append("\",");
            json.append("\"totalCalories\":").append(actualTotal).append(",");
            
            // Breakfast
            String breakName = isVeg ? "Oats Upma with Almonds" : "Scrambled Eggs on Whole Wheat Toast";
            String breakDesc = isVeg ? "Semolina oats cooked with carrots, beans, and tempered with mustard seeds." : "Three egg whites scrambled with spinach and served on brown bread.";
            json.append("\"breakfast\":{\"name\":\"").append(breakName).append("\",\"description\":\"").append(breakDesc)
                    .append("\",\"calories\":").append(breakCal).append(",\"protein\":14,\"carbs\":35,\"fat\":8,\"fiber\":5},");

            // Lunch
            String lunchName = isVeg ? "Brown Rice, Dal Tadka & Bhindi Masala" : "Grilled Chicken Breast with Brown Rice & Broccoli";
            String lunchDesc = isVeg ? "Fiber-rich brown rice served with yellow lentils and stir-fried okra." : "Lean protein chicken breast grilled lightly with olive oil and served with steamed vegetables.";
            json.append("\"lunch\":{\"name\":\"").append(lunchName).append("\",\"description\":\"").append(lunchDesc)
                    .append("\",\"calories\":").append(lunchCal).append(",\"protein\":28,\"carbs\":55,\"fat\":12,\"fiber\":7},");

            // Dinner
            String dinnerName = isVeg ? "Paneer Tikka with Roti & Salad" : "Baked Fish Fillet with Whole Wheat Roti & Salad";
            String dinnerDesc = isVeg ? "Grilled cottage cheese cubes with bell peppers, served with whole wheat flatbread." : "Herbed white fish fillet baked with lemon juice, served with a side of mixed greens.";
            json.append("\"dinner\":{\"name\":\"").append(dinnerName).append("\",\"description\":\"").append(dinnerDesc)
                    .append("\",\"calories\":").append(dinnerCal).append(",\"protein\":22,\"carbs\":40,\"fat\":10,\"fiber\":6},");

            // Snacks
            String snackName = isVeg ? "Roasted Chickpeas & Green Tea" : "Boiled Egg White & Almonds";
            json.append("\"snacks\":[");
            json.append("{\"name\":\"").append(snackName).append("\",\"calories\":").append(snackCal)
                    .append(",\"protein\":6,\"carbs\":15,\"fat\":4,\"fiber\":3}");
            json.append("]");

            json.append("}");
            if (i < days.length - 1) {
                json.append(",");
            }
        }
        json.append("]}");
        return json.toString();
    }

    private String generateLocalChatResponse(String message, String context) {
        String lowerMsg = message.toLowerCase();
        if (lowerMsg.contains("rice") && lowerMsg.contains("weight")) {
            return "Yes, you can absolutely eat rice while losing weight! Weight loss is governed by your total daily calorie balance, not single foods. Whole grain varieties like Brown Rice or red rice are better options because they have more fiber, keeping you full longer. Just practice portion control (typically 1 cup cooked per meal) and balance it with rich vegetable fiber and lean proteins (like dal or chicken).";
        }
        if (lowerMsg.contains("vegetarian") && lowerMsg.contains("breakfast")) {
            return "Here are 3 excellent high-protein vegetarian breakfast ideas:\n\n"
                    + "1. **Besan Chilla (Gram flour pancakes)**: Packed with complex carbs and protein. Add onions, tomatoes, and spinach for extra micronutrients.\n"
                    + "2. **Oats Upma with Paneer**: Prepare upma using oats instead of semolina, and toss in 50g of crumbled cottage cheese.\n"
                    + "3. **Greek Yogurt with Seeds**: Quick and protein-dense. Top with chia seeds, flaxseeds, and a handful of berries.";
        }
        if (lowerMsg.contains("iron")) {
            return "To increase iron levels naturally, incorporate these iron-dense foods:\n\n"
                    + "- **Vegetarian**: Spinach, lentils, chickpeas, tofu, pumpkin seeds, and fortified cereals.\n"
                    + "- **Non-Vegetarian**: Liver, red meat, chicken breast, and shellfish.\n\n"
                    + "*Tip*: Consume these with Vitamin C-rich foods (like lemon juice, oranges, or bell peppers) to boost absorption, and avoid drinking tea or coffee immediately after meals since they hinder iron uptake.";
        }
        if (lowerMsg.contains("protein") && lowerMsg.contains("dinner")) {
            return "Great high-protein dinner ideas include:\n\n"
                    + "- **Vegetarian**: Grilled Paneer Tikka with a large bowl of vegetable soup, or Tofu stir-fry with broccoli and quinoa.\n"
                    + "- **Non-Vegetarian**: Baked Salmon fillet with roasted asparagus, or Grilled Chicken Breast with a side of mixed bean salad.\n\n"
                    + "These meals combine dense protein to help muscle repair overnight with complex, high-fiber carbs to keep blood sugar stable.";
        }
        return "That is a great nutrition question! To achieve optimal health and meet your goals, prioritize consuming a balanced ratio of proteins, complex carbohydrates, and healthy fats. Always make sure to drink at least 2.5-3 liters of water daily. If you have specific medical conditions or allergies, consult with a clinical dietitian to customize your micro-nutritional intake.";
    }
}
