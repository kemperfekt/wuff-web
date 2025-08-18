# DogBot – Tech Strategy

Dieser Leitfaden beschreibt die technische Strategie für die Weiterentwicklung von DogBot zu einem agentischen System. Er richtet sich an Entwickler:innen mit Erfahrung in modernen Web- und KI-Projekten, ohne Senior-Entwicklungs-Expertise vorauszusetzen.

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Architektur](#architektur)
3. [Modulstruktur](#modulstruktur)
4. [Migrationsstrategie](#migrationsstrategie)
5. [Implementierungsschritte](#implementierungsschritte)
6. [Zukünftige Erweiterungen](#zukünftige-erweiterungen)

---

## Projektübersicht

- Eine Mensch beschreibt ein beobachtbares Verhaltenssymptom (z. B. „Warum ziehst Du an der Leine?“)
- Der Hund (DogAgent) fragt GPT und Weaviate und gibt seine Perspektive des Verhaltens zurück und fragt den Menschen, ob er mehr darüber wissen will. 
- Der Coach (CoachAgent) analysiert mithilfe von GPT & RAG, welche Ursachen das Verhalten hat. Falls er weitere Informationen braucht, fragt er beim Menschen nach.
- Sobald der Coach die Diagnose stellen kann, teilt er diese dem Menschen mit und bietet die Erstellung einer Erziehungsaufgabe an.
- Bei Bedarf erstellt der Coach mithilfe von GPT & Weaviate die Erziehungsaufgabe.
(- Der Companion wacht im Hintergund und erkennt Emotionen und Widerstände und spricht diese an.)

🐾 Hund (Perspektivewechsel)
🛠 Coach (Brückenbauer zwischen Mensch und Hund)
(💛 Companion (Beziehung und Bindung))

Dieser strukturierte, mehrstufige Agenten-Ansatz unterstützt den Perspektivwechsel des Menschen, um Verhaltensänderung durch Einsicht zu ermöglichen. Mit dem Ziel, die Bedürfnisse der Hundes zu lernen und Kommunikation und Beziehung aufzubauen.

**Technologien:** FastAPI, Python, OpenAI API, Weaviate (Vector Store), `transitions` (FSM), GitHub Actions, Clever Cloud Deployment.

---

## Architektur

1. **FastAPI (Web Layer):**
   - `routers/flow_router.py` mit Endpoints `/flow_start` und `/flow_continue`.
   - Validation via Pydantic-DTOs.

2. **Orchestrator (Use-Case Layer):**
   - `orchestrator/FlowOrchestrator` steuert Sessions und Zustandsübergänge.
   - FSM-Definition in `orchestrator/states.py`.

3. **Agents (Business Logic):**
   - `agents/BaseAgent` (Abstraktion für alle Agents).
   - `agents/DogAgent` und `agents/CoachAgent` implementieren spezifische Logik.

4. **Services (Infrastructure Layer):**
   - `services/weaviate_client.py`: Singleton/Factory für Weaviate-Client.
   - `services/retrieval.py`: Funktionen `get_symptom_info`, `get_breed_info` etc.

5. **Utilities:**
   - `utils/prompt_builder.py`: Zusammenbau der System-Prompts mit Fact-Blocks.
   - `utils/termination_checker.py`: Heuristiken oder Intent-Checks zur Flow-Beendigung.

---

## Migrationsstrategie (abgeschlossen)

Wir behalten das aktuelle System lauffähig und migrieren in sechs Phasen:

| Phase | Ziel                                 | Ergebnis               |
|------:|--------------------------------------|------------------------|
| 1     | Scaffold & Adapter                   | Paralleles Gerüst      |
| 2     | Weaviate-Retrieval extrahieren       | Service-Layer steht    |
| 3     | Orchestrator integrieren             | Flow-Controller live   |
| 4     | Agents aufteilen (Intake/Diagnose)   | SRP und Testbarkeit    |
| 5     | FSM-Logik & dynamische Fragen        | Adaptiver Flow         |
| 6     | Cleanup & Legacy entfernen           | Sauberer Code-Stand    |

Jede Phase liefert ein lauffähiges Release.

---
## Modulstruktur

[Modulstruktur](assets/modules.png)


## Implementierungsschritte

1. **Scaffold & Adapter:**
   - Ordnerstruktur anlegen, Skeleton-Klassen definieren.
   - CI/CD unberührt lassen; Feature-Branch nutzen.

2. **Weaviate-Service:**
   - `get_symptom_info` und `get_breed_info` in `services/retrieval.py`.
   - Factory für Weaviate-Client in `weaviate_client.py`.

3. **Orchestrator:**
   - `FlowOrchestrator.start_flow` & `next_step` implementieren.
   - Sessions und FSM initialisieren.

4. **Agents:**
   - `BaseAgent` definieren (Interface).
   - `IntakeAgent` und `DiagnoseAgent` implementieren; interne Calls auf bisherigen Code.

5. **FSM & dynamische Fragen:**
   - Zustände (init → intake → diagnose → final) mit `transitions` abbilden.
   - `ask_next` & `finalize` dynamisch via Chat-API.

6. **Tests:**
   - Unit-Tests für Retrieval-Funktionen.
   - Integrationstests für Orchestrator und Agents.

---

## Zukünftige Erweiterungen

- **Therapie-Phase & Companion-Agent**: Weitere States und Agents in FSM.
- **Structured Output**: JSON-Schemas (Function-Calling) und Outlines.
- **Infrastruktur as Code**: Terraform-Module für Weaviate, Hosting, VPC.
- **Multimodale Daten**: Bilder/Videos als zusätzlicher Fact-Block.

