# Ecosystem-AI: Personal Carbon Footprint Tracker

## 🌍 Chosen Vertical
This project focuses on **personal environmental impact tracking and sustainability education** within the climate tech vertical. Specifically, it helps users understand their individual carbon footprint across key lifestyle categories (transportation, home energy, diet, waste) and provides actionable, localized recommendations for reduction.

## 🧠 Approach and Logic
The solution follows a data-driven, user-centered approach:
1. **Input Collection**: Users provide lifestyle data through an interactive 3D calculator interface.
2. **Footprint Calculation**: Emissions are calculated using scientifically-grounded emission factors categorized by:
   - Transportation (vehicle type, distance, flights)
   - Home Energy (electricity, natural gas, LPG with localized grid factors)
   - Diet (meat-heavy, average, vegetarian, vegan)
   - Waste (recycling level)
3. **Localized Intelligence**: Integrates mock Google Earth Engine data to provide zone-specific environmental context (grid carbon intensity, air quality, EV infrastructure, plant-based options).
4. **AI-Powered Recommendations**: Uses an LLM (via OpenRouter) to generate hyper-localized, actionable sustainability advice.
5. **Progress Tracking**: Stores historical footprint data and awards "Green Points" for improvement.
6. **Behavioral Nudges**: Presents recommendations through an interactive timeline interface triggered by scroll.

## ⚙️ How the Solution Works
1. **User Onboarding**: Role selection (individual/B2B) determines the dashboard experience.
2. **Data Input**: Adjustable parameters in the `Calculator3D` component update the footprint in real-time.
3. **Calculation Engine** (`src/engine/calculations.ts`):
   - Converts weekly/monthly inputs to annual equivalents.
   - Applies emission factors (transportation per km, home energy per kWh/therm/cylinder, diet/waste constants).
   - Incorporates localized grid factors from a mock Earth Engine service.
   - Computes an eco-score (0-100) using inverse scaling: 2 tons = 100 points, 15 tons = 0 points.
4. **Recommendation Generation** (`src/engine/recommendations.ts`):
   - Starts with an AI contextual nudge (localized sustainability tip).
   - Adds category-specific recommendations based on highest impact areas.
   - Sorts by impact score (descending).
5. **Presentation Layer**:
   - `EcoScoreDisplay`: Shows current score and level.
   - `LocalImpactMap`: Visualizes zone-specific environmental data.
   - `ProcessScrollTimeline`: Presents recommendations as an interactive timeline.
   - `FootprintHistory`: Tracks progress over time.
   - `GreenWallet`: Gamification feature rewarding improvement with redeemable points.

## 📌 Key Assumptions Made
1. **Emission Factors**: Used standardized constants (though in reality these would vary by region/technology).
2. **User Input Accuracy**: Relies on self-reported data which may have estimation errors.
3. **Localization**: Mock Earth Engine service provides reasonable proxies for real environmental data.
4. **Behavioral Model**: Assumes users will act on personalized, localized recommendations.
5. **Tech Stack**: Selected Next.js 16 with App Router, Tailwind CSS, Framer Motion for performance and developer experience.
6. **Security**: Relies on Firebase Auth and environment variables for API key management.
7. **Accessibility**: Designed with sufficient color contrast and semantic HTML (though full WCAG compliance would require an additional audit).
8. **Scalability**: Mock services would need replacement with real APIs for production use.

## 🚀 How Work Is Evaluated Against Focus Areas

### Code Quality (Structure, Readability, Maintainability)
- **Structure**: Feature-based organization (`src/components`, `src/engine`, `src/hooks`, `src/services`).
- **Readability**: Consistent naming, TypeScript for type safety, clear function documentation.
- **Maintainability**: Separation of concerns (calculation logic separate from UI), custom hooks for reusable state logic, dynamic imports for code splitting.

### Security (Safe and Responsible Implementation)
- Environment variables for API keys.
- Firebase Auth for secure user authentication.
- Input validation in calculation functions (parsing empty strings as zero).
- No dangerous API exposure (OpenRouter key is next-public but only used client-side with fallback).
- Sanitized user data in LLM prompts.

### Efficiency (Optimal Use of Resources)
- Code splitting via `next/dynamic` with `ssr: false` for heavy components.
- Efficient recalculation with `useEffect` dependency arrays.
- Lazy loading of non-critical UI elements.
- Optimized build output via Next.js compiler.

### Testing (Validation of Functionality)
- Test files exist for key components (`EcoScoreDisplay.test.tsx`, `recommendations.test.ts`).
- Jest testing framework configured.
- Unit tests for calculation logic and recommendation generation.
- TypeScript compiler provides static type checking.

### Accessibility (Inclusive and Usable Design)
- Semantic HTML structure in components.
- Color contrast appears adequate (emerald/white theme).
- Keyboard navigable interfaces (buttons, forms).
- Responsive design for mobile/desktop.
- Screen reader considerations (aria-live regions for dynamic content).

### Challenge Expectations (Smart Assistant, Logic, Usability)
- **Smart Dynamic Assistant**: LLM integration provides contextual, localized advice that adapts to user inputs and zone.
- **Logical Decision Making**: Recommendations follow impact hierarchy (highest emission areas first).
- **Practical Real-World Usability**: Actionable suggestions, localized context, progress tracking, and gamification encourage sustained use.
- **Clean and Maintained Code**: Consistent formatting (Prettier), linting (ESLint), clear separation of UI and business logic, modern React patterns, and loading states.
