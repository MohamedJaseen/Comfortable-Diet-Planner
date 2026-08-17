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
                + "CRITICAL REQUIREMENTS:\n"
                + "1. Each day (Monday to Sunday) MUST have DIFFERENT, UNIQUE meals. Do not repeat the same breakfast, lunch, dinner, or snack across days.\n"
                + "2. EVERY meal item (breakfast, lunch, dinner, and snacks) MUST include a detailed step-by-step cooking instruction string in the 'instructions' field.\n\n"
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
                + "      \"breakfast\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"instructions\": \"1. Heat oil in pan... 2. Add mustard seeds... 3. Cook for 5 mins.\", \"calories\": 400, \"protein\": 15, \"carbs\": 50, \"fat\": 10, \"fiber\": 5},\n"
                + "      \"lunch\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"instructions\": \"1. Wash rice and dal... 2. Pressure cook... 3. Temper with cumin.\", \"calories\": 600, \"protein\": 25, \"carbs\": 70, \"fat\": 15, \"fiber\": 8},\n"
                + "      \"dinner\": {\"name\": \"Meal Name\", \"description\": \"Description\", \"instructions\": \"1. Marinate main ingredient... 2. Pan grill... 3. Serve hot.\", \"calories\": 500, \"protein\": 20, \"carbs\": 60, \"fat\": 12, \"fiber\": 6},\n"
                + "      \"snacks\": [\n"
                + "        {\"name\": \"Snack Name\", \"description\": \"Description\", \"instructions\": \"1. Dry roast in pan... 2. Toss with spices.\", \"calories\": 150, \"protein\": 5, \"carbs\": 20, \"fat\": 4, \"fiber\": 2}\n"
                + "      ]\n"
                + "    }\n"
                + "  ]\n"
                + "}";
    }

    private String generateLocalRecommendation(UserProfile p) {
        boolean isVeg = "vegetarian".equalsIgnoreCase(p.getFoodPreference());
        double targetCal = p.getDailyCalories();
        
        String explanation = String.format("This 7-day customized meal plan is tailored to support your goal of '%s' while strictly adhering to your '%s' dietary preference. "
                + "Each day features a completely unique set of nutrient-dense meals averaging %.0f kcal/day. Fiber-rich grains, lean proteins, and micro-nutrients are balanced. "
                + "Considerations for your listed allergies ('%s') and medical conditions ('%s') have been integrated into every recipe.", 
                p.getGoal(), p.getFoodPreference(), targetCal, 
                p.getAllergies() != null && !p.getAllergies().isEmpty() ? p.getAllergies() : "none",
                p.getMedicalConditions() != null && !p.getMedicalConditions().isEmpty() ? p.getMedicalConditions() : "none");

        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"totalCalories\":").append(Math.round(targetCal)).append(",");
        json.append("\"explanation\":\"").append(explanation).append("\",");
        json.append("\"days\":[");

        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

        // 7 unique Vegetarian Meal sets
        String[] vegBreakfastNames = {
            "Oats Upma with Almonds", "Poha with Vegetables", "Besan Chilla with Mint Chutney",
            "Idli with Vegetable Sambar", "Vegetable Rava Upma", "Stuffed Paneer Paratha with Curd", "Moong Dal Sprouts Salad & Toast"
        };
        String[] vegBreakfastDescs = {
            "Semolina oats cooked with carrots, beans, and tempered with mustard seeds.",
            "Flattened rice sautéed with onions, potatoes, green peas, and turmeric.",
            "Gram flour savory pancakes loaded with chopped spinach and onions.",
            "Steamed rice cakes served with lentil and vegetable stew.",
            "Semolina porridge cooked with diced vegetables and Indian spices.",
            "Whole wheat flatbread stuffed with spiced cottage cheese.",
            "Sprouted green gram salad with lemon juice, cucumber, and brown toast."
        };
        String[] vegBreakfastInstruct = {
            "1. Heat 1 tsp oil in a pan and add mustard seeds and curry leaves.\\n2. Add chopped vegetables and sauté for 3 mins.\\n3. Add 1 cup water, salt, and oats. Cook until soft (5 mins).\\n4. Top with sliced almonds.",
            "1. Rinse poha in water and drain completely.\\n2. Sauté mustard seeds, curry leaves, onions, and peas in 1 tsp oil.\\n3. Add turmeric, salt, and poha. Toss gently for 3 mins.\\n4. Garnish with lemon juice.",
            "1. Mix 1 cup besan with water, green chillies, chopped spinach, and salt to form a batter.\\n2. Heat a non-stick skillet and pour a ladle of batter.\\n3. Cook both sides until golden brown with minimal oil.",
            "1. Pour idli batter into oiled molds and steam for 10-12 mins.\\n2. Simmer cooked lentils with diced tamarind, vegetables, and sambar powder.\\n3. Serve hot idlis dipped in sambar.",
            "1. Dry roast rava (semolina) until fragrant.\\n2. In a pan, sauté mustard seeds, ginger, chillies, and mixed veggies.\\n3. Add 2.5 cups boiling water and fold in rava gradually. Cover and cook 4 mins.",
            "1. Knead whole wheat dough. Grate paneer and mix with coriander, green chillies, and salt.\\n2. Stuff dough ball with paneer and roll into paratha.\\n3. Cook on tava with 1/2 tsp ghee per side.",
            "1. Toss sprouted moong dal with diced cucumber, tomatoes, lemon juice, and chaat masala.\\n2. Toast brown bread slices.\\n3. Serve salad fresh alongside warm toast."
        };

        String[] vegLunchNames = {
            "Brown Rice, Dal Tadka & Bhindi Masala", "Rajma Chawal (Kidney Beans Curry)", "Paneer Butter Masala with Roti",
            "Chole with Cumin Jeera Rice", "Palak Paneer with Brown Rice", "Aloo Gobi Matar with Chapati & Curd", "Vegetable Biryani with Cucumber Raita"
        };
        String[] vegLunchDescs = {
            "Fiber-rich brown rice served with yellow tempered lentils and stir-fried okra.",
            "Red kidney beans cooked in tomato ginger curry served with basmati rice.",
            "Cottage cheese cubes in mild tomato gravy with 2 whole wheat rotis.",
            "Spiced chickpea curry paired with fragrant cumin-infused rice.",
            "Fresh spinach puree with cottage cheese cubes served over brown rice.",
            "Potato, cauliflower, and green peas stir-fry with wheat flatbread and fresh curd.",
            "Aromatic rice layered with vegetables and spices, served with fresh yogurt raita."
        };
        String[] vegLunchInstruct = {
            "1. Boil brown rice. Pressure cook yellow dal with turmeric and salt.\\n2. Heat ghee, sauté cumin, garlic, and red chillies, then pour over dal.\\n3. Stir-fry sliced bhindi with spices in a separate pan until crisp.",
            "1. Soak rajma overnight and pressure cook until tender.\\n2. Prepare gravy with sautéed onions, ginger-garlic paste, and tomato puree.\\n3. Simmer rajma in gravy for 15 mins. Serve hot with steamed rice.",
            "1. Sauté onion-tomato paste with spices and cashew cream.\\n2. Add paneer cubes and simmer for 5 mins.\\n3. Roll and cook 2 whole wheat rotis on a tava.",
            "1. Pressure cook soaked chickpeas with tea bag for color.\\n2. Sauté spices, onions, and tomato puree; simmer chickpeas in gravy for 20 mins.\\n3. Sauté cumin seeds in ghee and toss with cooked rice.",
            "1. Blanch spinach leaves and blend into a smooth puree.\\n2. Sauté garlic and onions, add spinach puree and spices.\\n3. Toss in paneer cubes and simmer 5 mins. Serve over brown rice.",
            "1. Sauté cumin, chopped potatoes, cauliflower florets, and peas with turmeric and coriander powder.\\n2. Cover and cook on low heat until tender.\\n3. Serve with whole wheat chapati and fresh curd.",
            "1. Parboil basmati rice with whole spices.\\n2. Sauté carrots, beans, peas, and paneer with biryani masala.\\n3. Layer rice and veggies in a heavy pot, cover and dum cook for 15 mins."
        };

        String[] vegDinnerNames = {
            "Paneer Tikka with Roti & Salad", "Moong Dal Khichdi with Curd", "Baingan Bharta with Whole Wheat Roti",
            "Mixed Vegetable Curry with Phulka", "Lauki Chana Dal with Roti", "Stuffed Capsicum with Brown Rice", "Dal Palak with Jeera Rice"
        };
        String[] vegDinnerDescs = {
            "Grilled spiced cottage cheese and bell peppers served with flatbread.",
            "Soothing rice and yellow lentil porridge with fresh yogurt.",
            "Smokey roasted eggplant curry with whole wheat rotis.",
            "Assorted vegetable curry served with soft air-puffed phulkas.",
            "Bottle gourd cooked with Bengal gram lentils and rotis.",
            "Bell peppers stuffed with spiced paneer and brown rice.",
            "Spinach and lentil curry paired with light cumin rice."
        };
        String[] vegDinnerInstruct = {
            "1. Marinate paneer cubes and bell peppers in curd, tikka masala, and lemon juice for 20 mins.\\n2. Thread onto skewers or pan-grill until edges char.\\n3. Serve with 1 whole wheat roti and sliced onions.",
            "1. Wash equal parts moong dal and rice.\\n2. Pressure cook with 4 cups water, turmeric, salt, and cumin seeds for 4 whistles.\\n3. Serve warm topped with 1/2 tsp ghee and curd.",
            "1. Roast whole eggplant over open flame until charred. Peel and mash.\\n2. Sauté ginger, garlic, onions, tomatoes, and green chillies in 1 tsp oil.\\n3. Add mashed eggplant, spices, and cilantro. Cook 8 mins.",
            "1. Chop beans, carrots, capsicum, and peas.\\n2. Cook in onion-tomato gravy with curry spices for 12 mins.\\n3. Serve warm with 2 thin phulkas.",
            "1. Peel and cube bottle gourd (lauki). Soak chana dal for 30 mins.\\n2. Pressure cook together with turmeric, salt, and ginger.\\n3. Temper with cumin seeds and asafoetida in ghee.",
            "1. Slice tops off bell peppers and scoop seeds.\\n2. Fill with mixture of cooked brown rice, grated paneer, and Indian spices.\\n3. Bake at 180°C (350°F) for 20 mins until tender.",
            "1. Cook yellow dal. Sauté garlic, cumin, and chopped spinach until wilted.\\n2. Combine dal and spinach; simmer for 5 mins.\\n3. Temper with dry red chilli and serve over jeera rice."
        };

        String[] vegSnackNames = {
            "Roasted Chickpeas & Green Tea", "Fruit Chaat with Flaxseeds", "Steamed Dhokla with Mint Chutney",
            "Spiced Roasted Makhana", "Roasted Peanuts & Masala Tea", "Fresh Banana & Almonds", "Murmura Bhel Chaat"
        };
        String[] vegSnackDescs = {
            "Dry roasted chickpeas seasoned with chaat masala.",
            "Diced apple, papaya, and guava tossed with spices.",
            "Steamed spongy gram flour cakes with herb chutney.",
            "Crispy roasted fox nuts seasoned with sea salt.",
            "Healthy dry roasted groundnuts with ginger tea.",
            "Fresh ripe banana served with soaked almonds.",
            "Puffed rice mixed with onions, tomatoes, and herbs."
        };
        String[] vegSnackInstruct = {
            "1. Drain canned or boiled chickpeas and pat dry.\\n2. Toss with 1/2 tsp oil, cumin, and chaat masala.\\n3. Roast in pan or oven for 15 mins until crunchy. Pair with hot green tea.",
            "1. Chop fresh apple, papaya, and guava into bite-sized cubes.\\n2. Sprinkle chaat masala, roasted cumin powder, and lemon juice.\\n3. Top with 1 tbsp roasted flaxseeds.",
            "1. Whisk besan, water, turmeric, and lemon juice into smooth batter.\\n2. Add fruit salt, pour into tin, and steam 15 mins.\\n3. Temper with mustard seeds and curry leaves.",
            "1. Heat 1/2 tsp ghee in a pan.\\n2. Add 1 cup makhana (fox nuts) and roast on low flame for 8-10 mins until crunchy.\\n3. Sprinkle black pepper and sea salt.",
            "1. Dry roast raw peanuts in skin until fragrant.\\n2. Brew hot tea with fresh ginger, cardamom, and low-fat milk.",
            "1. Peel 1 ripe banana.\\n2. Serve with 5-6 almonds soaked overnight in water.",
            "1. Take 1.5 cups puffed rice (murmura).\\n2. Toss with finely chopped onion, tomato, green chillies, lemon juice, and coriander leaves."
        };

        // 7 unique Non-Vegetarian Meal sets
        String[] nonVegBreakfastNames = {
            "Scrambled Eggs on Whole Wheat Toast", "Chicken Sandwich on Whole Wheat Bread", "Egg Bhurji with Chapati",
            "Boiled Eggs with Avocado Toast", "Chicken & Egg Protein Omelette", "Egg Paratha with Yogurt", "Grilled Chicken Sausage & Boiled Eggs"
        };
        String[] nonVegBreakfastDescs = {
            "Three egg whites scrambled with spinach and served on brown bread.",
            "Boiled chicken breast tossed with Greek yogurt inside brown toast.",
            "Spiced Indian style scrambled eggs served with flatbread.",
            "Sliced hard-boiled eggs over mashed avocado on toast.",
            "Fluffy 2-egg omelette stuffed with shredded chicken breast.",
            "Flatbread cooked with a layered spiced egg wash inside.",
            "Lean chicken sausages paired with boiled egg whites."
        };
        String[] nonVegBreakfastInstruct = {
            "1. Whisk 3 egg whites and 1 whole egg with salt and pepper.\\n2. Sauté chopped spinach in a pan, pour eggs, and scramble gently.\\n3. Toast 2 whole wheat bread slices and serve.",
            "1. Shred 80g boiled chicken breast.\\n2. Mix with 2 tbsp Greek yogurt, black pepper, and diced cucumber.\\n3. Stuff inside 2 toasted whole wheat bread slices.",
            "1. Sauté chopped onions, tomatoes, and green chillies in 1 tsp oil.\\n2. Add turmeric, red chilli powder, and crack 2 eggs into pan.\\n3. Scramble until cooked through. Serve with 1 chapati.",
            "1. Hard boil 2 eggs for 9 mins; peel and slice.\\n2. Mash 1/2 avocado with lemon juice, salt, and red pepper flakes.\\n3. Spread over toast and top with egg slices.",
            "1. Whisk 2 eggs with salt, pepper, and chopped cilantro.\\n2. Sauté 50g cooked shredded chicken breast in a skillet.\\n3. Pour egg mixture over chicken and cook until folded and set.",
            "1. Roll out wheat dough on tava. Pour whisked spiced egg onto top.\\n2. Flip paratha so egg cooks directly on hot tava with minimal oil.\\n3. Serve warm with low-fat plain curd.",
            "1. Pan sear 2 lean chicken sausages for 6 mins.\\n2. Boil 2 egg whites for 9 mins.\\n3. Serve hot alongside fresh sliced tomatoes."
        };

        String[] nonVegLunchNames = {
            "Grilled Chicken Breast with Brown Rice", "Bengali Fish Curry with Steamed Rice", "Chicken Curry with Whole Wheat Roti",
            "Egg Curry with Basmati Rice", "Mutton Sukka with Chapati", "Grilled Salmon Fillet with Quinoa", "Chicken Biryani with Cucumber Raita"
        };
        String[] nonVegLunchDescs = {
            "Lean protein chicken breast grilled lightly with olive oil and brown rice.",
            "White fish fillet cooked in mustard tomato gravy with rice.",
            "Home style chicken curry served with whole wheat flatbreads.",
            "Boiled eggs simmered in spiced onion gravy with basmati rice.",
            "Slow cooked tender lean mutton with roasted spices and chapati.",
            "Pan-grilled salmon fillet served over fluffy cooked quinoa.",
            "Aromatic chicken biryani served with refreshing cucumber raita."
        };
        String[] nonVegLunchInstruct = {
            "1. Marinate chicken breast with lemon juice, garlic, oregano, and salt.\\n2. Grill in pan with 1 tsp olive oil for 6 mins per side.\\n3. Serve with 1 cup cooked brown rice and steamed broccoli.",
            "1. Marinate fish fillet with turmeric and salt. Lightly pan fry.\\n2. Prepare gravy with mustard paste, tomato, cumin, and green chillies.\\n3. Simmer fish in gravy for 5 mins. Serve hot over steamed rice.",
            "1. Sauté onions, ginger-garlic paste, tomatoes, and chicken curry powder.\\n2. Add chicken pieces and 1 cup water; simmer for 20 mins until cooked.\\n3. Serve with 2 whole wheat rotis.",
            "1. Hard boil 2 eggs and peel skin.\\n2. Sauté onions, garlic, and tomato puree with garam masala.\\n3. Add eggs to gravy and simmer 8 mins. Serve with warm basmati rice.",
            "1. Marinate mutton with yogurt and dark roasted spice powder.\\n2. Pressure cook for 6-7 whistles until tender.\\n3. Reduce liquid in open pan to create dry sukka coating. Serve with chapati.",
            "1. Season salmon fillet with lemon, dill, garlic powder, and olive oil.\\n2. Sear on skin side for 4 mins, flip and cook 3 mins.\\n3. Serve over 1 cup cooked warm quinoa.",
            "1. Marinate chicken with yogurt, ginger, and biryani spices for 1 hour.\\n2. Layer parboiled basmati rice over cooked chicken gravy.\\n3. Cover tightly and cook on low dum heat for 20 mins. Serve with raita."
        };

        String[] nonVegDinnerNames = {
            "Baked Fish Fillet with Whole Wheat Roti", "Chicken Tikka with Mint Salad", "Pan-Seared Fish with Stir-Fried Veggies",
            "Egg Curry with Whole Wheat Chapati", "Chicken & Vegetable Soup with Rice", "Grilled Chicken Salad with Olive Oil", "Grilled Fish Tacos with Roti & Salsa"
        };
        String[] nonVegDinnerDescs = {
            "Herbed white fish fillet baked with lemon juice and roti.",
            "Char-grilled marinated chicken breast pieces with mint chutney.",
            "Fish fillet pan seared in olive oil with sautéed zucchini and peppers.",
            "Hard-boiled eggs cooked in light ginger tomato sauce with chapati.",
            "Hearty soup made with chicken breast, carrots, and brown rice.",
            "Sliced grilled chicken breast over mixed greens and olive oil dressing.",
            "Flaked pan-grilled fish wrapped in flatbread with fresh tomato salsa."
        };
        String[] nonVegDinnerInstruct = {
            "1. Place fish fillet on baking sheet; season with lemon juice, olive oil, and herbs.\\n2. Bake at 200°C (400°F) for 12-15 mins until flaky.\\n3. Serve with 1 whole wheat roti and side green salad.",
            "1. Cut chicken breast into cubes. Marinate in yogurt, red chilli, and tikka masala.\\n2. Grill in oven or stovetop grill pan for 10-12 mins.\\n3. Serve with homemade mint-coriander chutney and sliced onions.",
            "1. Season fish fillet with garlic powder, black pepper, and salt.\\n2. Pan-sear in 1 tsp olive oil for 4 mins each side.\\n3. In same pan, stir-fry zucchini, bell peppers, and carrots for 5 mins.",
            "1. Boil 2 eggs, peel, and prick with fork.\\n2. Sauté chopped onions, tomato puree, and light spices in pan.\\n3. Simmer eggs in gravy for 6 mins. Serve hot with 2 chapatis.",
            "1. Simmer 100g chicken breast in 4 cups water with ginger, carrots, and celery for 20 mins.\\n2. Shred chicken and return to broth.\\n3. Stir in 1/2 cup cooked brown rice and season with black pepper.",
            "1. Grill seasoned chicken breast; slice thinly.\\n2. Combine romaine lettuce, cherry tomatoes, and cucumber in bowl.\\n3. Top with chicken and drizzle 1 tbsp olive oil and lemon dressing.",
            "1. Grill fish fillet until tender and flake with fork.\\n2. Dice fresh tomatoes, onions, green chillies, and cilantro for salsa.\\n3. Place fish and salsa inside warm whole wheat roti."
        };

        String[] nonVegSnackNames = {
            "Boiled Egg Whites & Almonds", "Chicken Tikka Bites", "Boiled Eggs with Chaat Masala",
            "Roasted Chickpeas & Green Tea", "Chicken Clear Broth", "Roasted Almonds & Masala Chai", "Fruit Bowl with Pumpkin Seeds"
        };
        String[] nonVegSnackDescs = {
            "Hard-boiled egg whites seasoned with pepper and almonds.",
            "Small marinated chicken breast bites pan seared.",
            "Hard boiled eggs sliced and sprinkled with tangy spices.",
            "Crunchy dry roasted chickpeas served with hot tea.",
            "Warm chicken broth cooked with ginger and black pepper.",
            "Sea salt roasted almonds paired with ginger tea.",
            "Mixed fresh fruit bowl topped with crunchy seeds."
        };
        String[] nonVegSnackInstruct = {
            "1. Boil 2 eggs for 9 mins. Remove shell and yolks.\\n2. Sprinkle whites with salt and black pepper.\\n3. Eat alongside 5 almonds.",
            "1. Slice 60g chicken breast into small cubes.\\n2. Sauté with lemon juice, salt, and black pepper for 6 mins until fully cooked.",
            "1. Boil 2 eggs, peel, and slice into halves.\\n2. Sprinkle chaat masala and black pepper over yolks and whites.",
            "1. Roast dry chickpeas in pan with chaat masala until crunchy.\\n2. Sip hot brewed green tea.",
            "1. Simmer chicken bones or chicken meat with ginger, garlic, and pepper for 25 mins.\\n2. Strain broth and drink warm.",
            "1. Dry roast 10 almonds in pan with a pinch of sea salt.\\n2. Serve with hot brewed ginger masala tea.",
            "1. Chop fresh apple and pomegranate seeds.\\n2. Sprinkle 1 tbsp roasted pumpkin seeds on top."
        };

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
            String breakName = isVeg ? vegBreakfastNames[i] : nonVegBreakfastNames[i];
            String breakDesc = isVeg ? vegBreakfastDescs[i] : nonVegBreakfastDescs[i];
            String breakInst = isVeg ? vegBreakfastInstruct[i] : nonVegBreakfastInstruct[i];
            json.append("\"breakfast\":{\"name\":\"").append(breakName)
                    .append("\",\"description\":\"").append(breakDesc)
                    .append("\",\"instructions\":\"").append(breakInst)
                    .append("\",\"calories\":").append(breakCal).append(",\"protein\":15,\"carbs\":40,\"fat\":8,\"fiber\":5},");

            // Lunch
            String lunchName = isVeg ? vegLunchNames[i] : nonVegLunchNames[i];
            String lunchDesc = isVeg ? vegLunchDescs[i] : nonVegLunchDescs[i];
            String lunchInst = isVeg ? vegLunchInstruct[i] : nonVegLunchInstruct[i];
            json.append("\"lunch\":{\"name\":\"").append(lunchName)
                    .append("\",\"description\":\"").append(lunchDesc)
                    .append("\",\"instructions\":\"").append(lunchInst)
                    .append("\",\"calories\":").append(lunchCal).append(",\"protein\":30,\"carbs\":60,\"fat\":12,\"fiber\":7},");

            // Dinner
            String dinnerName = isVeg ? vegDinnerNames[i] : nonVegDinnerNames[i];
            String dinnerDesc = isVeg ? vegDinnerDescs[i] : nonVegDinnerDescs[i];
            String dinnerInst = isVeg ? vegDinnerInstruct[i] : nonVegDinnerInstruct[i];
            json.append("\"dinner\":{\"name\":\"").append(dinnerName)
                    .append("\",\"description\":\"").append(dinnerDesc)
                    .append("\",\"instructions\":\"").append(dinnerInst)
                    .append("\",\"calories\":").append(dinnerCal).append(",\"protein\":25,\"carbs\":45,\"fat\":10,\"fiber\":6},");

            // Snacks
            String snackName = isVeg ? vegSnackNames[i] : nonVegSnackNames[i];
            String snackDesc = isVeg ? vegSnackDescs[i] : nonVegSnackDescs[i];
            String snackInst = isVeg ? vegSnackInstruct[i] : nonVegSnackInstruct[i];
            json.append("\"snacks\":[");
            json.append("{\"name\":\"").append(snackName)
                    .append("\",\"description\":\"").append(snackDesc)
                    .append("\",\"instructions\":\"").append(snackInst)
                    .append("\",\"calories\":").append(snackCal)
                    .append(",\"protein\":8,\"carbs\":15,\"fat\":4,\"fiber\":3}");
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
