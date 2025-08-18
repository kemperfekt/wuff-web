# DogBot – Product Strategy

## 1. Vision
"Giving your dog a voice."

DogBot is designed as an empathetic, interactive coach to strengthen the relationship between humans and their dogs by translating and supporting instinct-driven and bond-based behavior.

---

## 2. Core Principles
- **Agentic by design**: Natural, context-driven dialogue through specialized agents.
- **Relationship before obedience**: Focus on bonding, trust, and shared experiences.
- **Learning from interaction**: The system improves through real observations and user interactions.
- **Fostering perspective shifts**: Helping humans understand the world from their dog's point of view.

---

## 3. Key Components
### 3.1 Dog Model
- **Instinct profile**: (Hunting, Social, Territorial, Sexual instincts)
- **Emotional states**: (e.g., trust, stress, security)
- **Dynamic development**: The model evolves with experiences and reflections.

### 3.2 Agent Structure
- **Anamnesis Agent**: Gathers foundational and contextual information.
- **Diagnosis Agent**: Detects instinct patterns and behavioral problems.
- **Training Companion**: Supports daily activities and progress reflection.
- **Reflection Agent**: Helps humans consciously experience and deepen their relationship.

### 3.3 Learning Path for Humans
- From problem recognition to building emotional bonds
- Making motivational progress visible
- Supporting perspective shifts and need-oriented living

---

## 4. Differentiation (USP)
- **Instinct-based model instead of personality tests**
- **Making relationship development visible and tangible**
- **Self-improving system** through guided user inputs
- **Optional extension** with pictures/videos for emotional depth

---

## 5. Iterative Development
- First version: Text-based interaction + initial model building
- Future extensions:
  - Multimodal inputs (pictures, videos)
  - Visualization of bonding and emotional development
  - Community-supported knowledge growth (anonymized)

---

## 6. Open Questions and Hypotheses
- [ ] How can emotional bonding be represented through metrics?
- [ ] Which phases of the learning path are most motivating for users?
- [ ] At what point do picture/video uploads add real functional value?
- [ ] What are minimal but perceivable progress markers for dog and human?

---


# 💛 CompanionAgent

## Overview

The CompanionAgent is a quiet, empathic presence within the DogBot system. She sits metaphorically at the edge of the triad between human, dog, and coach – silently observing the emotional landscape.

She only speaks when something truly matters: a moment of tension, resistance, or emotional connection.

---

## 🎯 Purpose of the Role

- Create emotional safety
- Help the human recognize resistance as a sign of growth
- Highlight and honor moments of connection between human and dog

---

## 👥 Psychological Foundations

The CompanionAgent draws from:
- **Psychotherapy**: Resistance as a doorway to transformation
- **Group Dynamics**: Observer role in triadic constellations
- **Neuroeducation**: Safety as a foundation for learning and integration

She gently reflects inner emotional movement and provides reassurance when the human feels doubt or fear. She also strengthens positive bonding experiences by acknowledging them.

---

## 🧠 Behavioral Logic

| Trigger               | Example Input                             | Type of Response                    |
|----------------------|--------------------------------------------|-------------------------------------|
| Resistance            | “I don’t think this will work anyway...”   | Gentle mirroring, reframing         |
| Overwhelm             | “I don’t know if I can do this...”         | Soothing, restoring perspective     |
| Moment of connection  | “Today he leaned on me.”                  | Emotional affirmation               |
| Small success         | “He actually listened!”                    | Recognition, encouragement          |

---

## 🛠 Technical Implementation

### MVP Strategy

- **Reactive only**: Never initiates; responds to emotional triggers.
- **Easy to integrate**: Use `maybe_respond(session_history, user_input)` as a side-check in the orchestrator.
- **Optional output**: Only returns a message if an emotional reaction is needed.

### Prompt Principles

- No analysis, no advice
- Never assigns tasks
- Speaks like a mindful, supportive companion
- Offers resonance, not judgment

---

## 🧪 Example Outputs

```text
“That sounds like a moment where you really connected.”

“I can hear how hard that was – and you still showed up.”

“Maybe this resistance isn’t a wall, but a turning point.”

“You didn’t just understand – you felt it. And your dog probably did too.”