# Sonar Question Review

Access date: 24 July 2026. This file is for human review only. Metadata here is intentionally excluded from `content/sonar-products-learning.json`.

Validation target:

- 3 levels
- 18 questions per level
- 10 quizzes and 8 flashcards per level
- 54 questions total
- no mind-map questions
- mixed question types within every level

Source shorthand: see `docs/sonar-research-dossier.md` source table.

## Duplication and Balance Check

The curriculum progresses from recognition to application to CSE reasoning. Quality Gate appears at Level 1 as a definition, Level 2 as workflow enforcement, and Level 3 as governance/risk reasoning. Product coverage includes for IDE, Cloud, Server, Community Build, Advanced Security, AI Code Assurance, Vortex, MCP Server, Gitar, SonarSweep, and Remediation Agent. Approximate balance is product/workflow heavy, with security, quality, AI governance, company strategy, and CSE reasoning distributed across levels.

## Level 1: Product and Vocabulary Foundations

Purpose: recognise Sonar's purpose, main products, and basic quality/security vocabulary.

| Key | Type | Learning objective | Content | Correct answer or back | Explanation and distractor rationale | Glossary dependencies | Primary source | Stability | Confidence | Review notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| l1-sonar-primary-purpose | quiz | Identify SonarQube's purpose. | What is SonarQube primarily used for? | Automated code quality and security verification. | Hosting and ticket routing are not SonarQube's core product purpose. | Static analysis, issue | S1, S2 | slow-changing | high | Company positioning is current. |
| l1-flash-sonar-in-one-sentence | flashcard | Describe Sonar succinctly. | How would you describe Sonar to a new customer? | Sonar helps teams verify code reliability, maintainability, and security before production. | Active recall of positioning; no distractors. | Reliability, maintainability, security | S1, S17 | slow-changing | high | Good interview opener. |
| l1-product-ide-feedback | quiz | Recognise IDE product. | Which product gives feedback inside the editor? | SonarQube for IDE. | Advanced Security is a security extension; SonarSweep is early-access AI/data work. | SonarQube for IDE | S3 | stable | high | Direct product recognition. |
| l1-flash-connected-mode | flashcard | Explain Connected Mode. | What does Connected Mode add to SonarQube for IDE? | It binds IDE workspace to SonarQube and syncs team rules/settings/statuses. | Active recall; no distractors. | Connected Mode, Quality Profile | S3 | stable | high | Uses current docs. |
| l1-cloud-operating-model | quiz | Distinguish SaaS product. | Which product is Sonar-managed SaaS? | SonarQube Cloud. | Server and Community Build are self-managed. | Cloud, Server | S1, S2 | slow-changing | high | Stable operating model. |
| l1-server-operating-model | quiz | Distinguish self-managed product. | Which product is self-managed by the customer? | SonarQube Server. | Cloud is SaaS; AI Code Assurance is a feature set. | Server, AI Code Assurance | S2, S4 | slow-changing | high | Stable. |
| l1-flash-community-build | flashcard | Define Community Build. | What is SonarQube Community Build? | Free, open-source self-managed SonarQube option. | Active recall; no distractors. | Community Build | S3 | slow-changing | high | Current naming may evolve. |
| l1-static-analysis-definition | quiz | Define static analysis. | What does static analysis inspect? | Source code without running the application. | Live traffic and sales data are different operational domains. | Static analysis | S1, S5 | stable | high | Foundational. |
| l1-flash-rules-and-issues | flashcard | Relate rules and issues. | What is the relationship between a rule and an issue? | Rule is a check; issue is a finding from a violated rule. | Active recall; no distractors. | Rule, issue | S5 | stable | high | Foundational. |
| l1-bug-category | quiz | Map bug to reliability. | Which issue category maps to reliability? | Bug. | Code smell maps to maintainability; hotspot requires review. | Bug, reliability | S4, S5 | stable | high | Clear. |
| l1-code-smell-category | quiz | Map code smell to maintainability. | Which issue category maps to maintainability? | Code smell. | Vulnerability maps to security; bug maps to reliability. | Code smell, maintainability | S4, S5 | stable | high | Clear. |
| l1-flash-vulnerability | flashcard | Define vulnerability. | What is a vulnerability in Sonar vocabulary? | A security issue that can expose software to attack. | Active recall; no distractors. | Vulnerability, Security Hotspot | S1, S7 | stable | high | Distinguishes hotspot. |
| l1-security-hotspot-purpose | quiz | Explain hotspot handling. | What does a Security Hotspot require? | Human review of security-sensitive code. | Automatic merge and dependency upgrade are not the hotspot workflow. | Security Hotspot | S6 | stable | high | Avoids overclaiming. |
| l1-flash-quality-gate | flashcard | Define Quality Gate. | What is a Quality Gate? | Pass/fail policy based on analysis conditions. | Active recall; no distractors. | Quality Gate, condition | S6 | stable | high | Foundational. |
| l1-quality-profile-purpose | quiz | Define Quality Profile. | What does a Quality Profile define? | Active rules for a language. | Gate thresholds belong to Quality Gates; hosting region is deployment. | Quality Profile, rule | S5 | stable | high | Clear distinction. |
| l1-flash-ai-code-verification | flashcard | Explain AI verification need. | Why does AI-generated code still need verification? | AI code can contain quality and security issues; independent review is needed. | Active recall; no distractors. | AI Code Assurance, zero-trust verification | S1, S9 | slow-changing | high | Strategic but stable concept. |
| l1-ai-code-assurance-basic | quiz | Recognise AI Code Assurance. | What is AI Code Assurance for? | Applying stronger standards to projects with AI code. | Model training and IDE themes are different product areas. | AI Code Assurance, Quality Gate | S4 | time-sensitive | high | Feature details may change. |
| l1-flash-sonar-way | flashcard | Define Sonar way. | What is Sonar way? | Built-in recommended default profiles and gates. | Active recall; no distractors. | Sonar way | S5 | stable | high | Stable. |

## Level 2: Development Workflow, Governance and Adoption

Purpose: apply Sonar across IDE, CI/CD, PR, branch, quality, and customer adoption workflows.

| Key | Type | Learning objective | Content | Correct answer or back | Explanation and distractor rationale | Glossary dependencies | Primary source | Stability | Confidence | Review notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| l2-connected-mode-benefit | quiz | Apply Connected Mode. | A team wants identical IDE and server rules. What helps? | Connected Mode. | NCD defines new code; SBOM lists components. | Connected Mode | S3 | stable | high | Workflow scenario. |
| l2-flash-ide-to-ci | flashcard | Compare IDE and CI feedback. | How should a CSE explain IDE feedback versus CI analysis? | IDE is early local feedback; CI is centralized enforceable verification. | Active recall; no distractors. | CI/CD, for IDE | S1, S3 | stable | high | CSE explanation. |
| l2-pr-analysis-purpose | quiz | Identify PR analysis focus. | What does pull-request analysis focus on? | Issues introduced by the pull request. | Company-wide repository and support-ticket analysis are not PR analysis. | PR analysis | S6 | stable | high | Clear. |
| l2-flash-pr-decoration | flashcard | Explain PR decoration value. | Why is pull-request decoration useful? | It shows Sonar findings and gate status in the repository platform. | Active recall; no distractors. | PR decoration, Quality Gate | S6 | stable | high | Workflow value. |
| l2-profile-versus-gate | quiz | Distinguish profile and gate. | Which pair is correctly distinguished? | Profile selects rules; gate checks thresholds. | Other choices conflate unrelated domains. | Quality Profile, Quality Gate | S5, S6 | stable | high | Core governance. |
| l2-new-code-definition-use | quiz | Apply NCD. | What does a New Code Definition configure? | Which changes count as new code. | Active rules belong to profiles; license policy belongs to SCA governance. | New Code Definition | S4 | stable | high | Clear. |
| l2-flash-clean-as-you-code | flashcard | Explain Clean as You Code. | Why is Clean as You Code practical for legacy codebases? | It focuses strict standards on new/changed code first. | Active recall; no distractors. | Clean as You Code, new code | S4 | stable | high | Adoption narrative. |
| l2-quality-gate-failure | quiz | Interpret gate failure. | A PR fails the Quality Gate. What happened? | At least one gate condition was not met. | Rules are not automatically disabled; server uninstall is unrelated. | Quality Gate condition | S6 | stable | high | Practical. |
| l2-flash-coverage | flashcard | Explain coverage. | How should a CSE explain code coverage? | Coverage estimates code exercised by tests; it is not proof of no bugs. | Active recall; no distractors. | Coverage | S1, S6 | stable | high | Avoids overclaiming. |
| l2-cloud-versus-server | quiz | Recommend deployment model. | A customer needs self-managed data control. Which fits best? | SonarQube Server. | Cloud is SaaS; IDE alone lacks central governance. | Cloud, Server | S1, S2 | slow-changing | high | Scenario. |
| l2-saas-fast-onboarding | quiz | Recommend SaaS. | A cloud-native team wants low operations. Which fits best? | SonarQube Cloud. | Community Build is self-managed; Foundation Agent is not SaaS platform choice. | SonarQube Cloud | S1, S2 | slow-changing | high | Scenario. |
| l2-flash-duplication | flashcard | Explain duplication metric. | Why does Sonar track duplication? | Duplication can increase maintenance cost. | Active recall; no distractors. | Duplication, maintainability | S6 | stable | high | Clear. |
| l2-adoption-signal | quiz | Recognise adoption progress. | Which signal best indicates adoption progress? | Teams consistently using PR analysis and gates. | One demo and page visit do not show sustained workflow adoption. | Adoption, PR analysis | S18 | time-sensitive | medium | CSE role source is mirrored. |
| l2-flash-technical-success-plan | flashcard | Define technical success plan. | What should a technical success plan connect? | Business priorities to concrete technical actions. | Active recall; no distractors. | Technical success plan | S18 | time-sensitive | medium | Mirrored role source. |
| l2-customer-health-risk | quiz | Identify risk signal. | Which is a likely customer-health risk signal? | Quality Gate failures ignored for releases. | Champion engagement and coverage improvement are healthier signals. | Customer health, risk signal | S18 | time-sensitive | medium | CSE reasoning. |
| l2-flash-time-to-value | flashcard | Define time to value. | What does time to value mean for Sonar adoption? | How quickly useful outcomes appear. | Active recall; no distractors. | Time to value | S18 | time-sensitive | medium | Mirrored role source. |
| l2-onboarding-priority | quiz | Choose onboarding priority. | What is the best early onboarding goal? | Analyze a real project and review actionable findings. | Customizing every rule delays value; delaying access harms adoption. | Onboarding, value realization | S18 | time-sensitive | medium | CSE scenario. |
| l2-flash-cse-versus-support | flashcard | Distinguish CSE and Support. | How is a Sonar CSE different from technical support? | CSE is proactive advisor; Support is reactive issue help. | Active recall; no distractors. | CSE, Support | S18 | time-sensitive | medium | Mirrored role source. |

## Level 3: Agentic Products and CSE Reasoning

Purpose: explain AI-code strategy and reason through realistic customer situations.

| Key | Type | Learning objective | Content | Correct answer or back | Explanation and distractor rationale | Glossary dependencies | Primary source | Stability | Confidence | Review notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| l3-acdc-stages | quiz | Identify AC/DC stages. | Which sequence matches Sonar's AC/DC framing? | Guide, Verify, Solve. | Other sequences are not Sonar's AC/DC model. | AC/DC | S9, S16 | time-sensitive | high | Current terminology. |
| l3-flash-zero-trust-verification | flashcard | Explain zero-trust verification. | What does zero-trust verification mean for AI-generated code? | Generator should not grade its own work; verification is independent. | Active recall; no distractors. | Zero-trust verification | S9 | time-sensitive | high | Strategic positioning. |
| l3-vortex-positioning | quiz | Position Vortex. | A customer wants agent-loop guidance and verification. Which product fits? | Sonar Vortex. | Profile is rules configuration; Community Build is core self-managed product. | Sonar Vortex | S9, S11 | time-sensitive | high | Emerging product. |
| l3-flash-sonar-vortex | flashcard | Explain Vortex value. | What customer problem does Sonar Vortex address? | Agent-loop context and verification before PR/CI. | Active recall; no distractors. | Sonar Vortex, Guide, Verify | S9 | time-sensitive | high | Current as of 2026-07-24. |
| l3-remediation-agent-stage | quiz | Map Remediation Agent. | Which AC/DC stage does Remediation Agent support? | Solve. | Guide is context; billing is not AC/DC. | Remediation Agent, Solve | S9 | time-sensitive | high | Current. |
| l3-mcp-server-purpose | quiz | Explain MCP Server. | What does the SonarQube MCP Server connect? | AI tools to SonarQube context and actions. | Other choices are unrelated integration domains. | MCP Server | S15 | time-sensitive | high | Current. |
| l3-flash-context-augmentation | flashcard | Handle terminology evolution. | How should you describe Context Augmentation in 2026? | It provides repo-aware context and is now described as included in Vortex. | Active recall; no distractors. | Context Augmentation, Vortex | S9, S11 | time-sensitive | high | Ambiguity highlighted. |
| l3-gitar-use-case | quiz | Position Gitar. | Which use case best fits Gitar? | AI-native PR review and fix suggestions. | SBOM belongs to SCA; database hosting belongs to Server operations. | Gitar | S13 | time-sensitive | medium | Acquisition details can evolve. |
| l3-flash-sonarsweep | flashcard | Avoid overclaiming SonarSweep. | Why should SonarSweep be discussed carefully? | It is early access/private beta around training data quality and embedded context. | Active recall; no distractors. | SonarSweep | S14, S16 | time-sensitive | medium | Very time-sensitive. |
| l3-advanced-security-sca | quiz | Identify Advanced Security capability. | Which capability is added by Advanced Security? | SCA for dependencies. | IDE themes and ticket routing are unrelated. | Advanced Security, SCA | S7, S8 | time-sensitive | high | Availability can change. |
| l3-sast-versus-sca | quiz | Distinguish SCA from SAST concepts. | A customer asks about vulnerable dependencies. Which concept fits? | SCA. | Quality Profile configures rules; cognitive complexity is maintainability. | SCA, dependency vulnerability | S7 | slow-changing | high | Stable concept. |
| l3-flash-advanced-sast | flashcard | Explain advanced SAST. | How does advanced SAST extend standard taint analysis? | It extends data-flow analysis across dependency boundaries. | Active recall; no distractors. | Advanced SAST, taint analysis | S7 | time-sensitive | high | Current product claim. |
| l3-risk-signal | quiz | Identify governance risk. | Which scenario is the strongest CSE risk signal? | AI-generated code bypasses quality gates before release. | Outcome review and broader PR analysis adoption are positive. | Risk signal, Quality Gate | S18, S9 | time-sensitive | medium | CSE + AI governance. |
| l3-flash-maturity-assessment | flashcard | Define maturity assessment. | What should a Sonar maturity assessment examine? | Consistent use across IDE, CI/CD, PR, gates, security, reporting. | Active recall; no distractors. | Maturity assessment | S18 | time-sensitive | medium | Mirrored role source. |
| l3-opportunity-signal | quiz | Identify expansion signal. | Which is the clearest expansion opportunity signal? | Need for dependency risk and SBOM visibility. | Single login is weak; accepted false positive is not expansion. | Opportunity signal, Advanced Security | S7, S18 | time-sensitive | medium | Qualified handoff. |
| l3-flash-sales-handoff | flashcard | Explain qualified handoff. | When should a CSE hand an opportunity to Sales? | When tied to need, stakeholder, value hypothesis, and commercial motion. | Active recall; no distractors. | Qualified Sales handoff | S18 | time-sensitive | medium | Role-specific. |
| l3-cse-best-follow-up | quiz | Choose CSE discovery question. | A VP worries AI code increases outages. Best CSE follow-up? | Ask how AI code is verified before merge today. | Promising zero defects is inaccurate; pricing-first ignores discovery. | Trusted advisor, AI verification | S9, S18 | time-sensitive | high | Good interview reasoning. |
| l3-flash-cse-sales-engineering | flashcard | Distinguish CSE from Sales Engineering. | How is CSE different from Sales Engineering after purchase? | SE supports pre-sale evaluation; CSE drives post-sale adoption and outcomes. | Active recall; no distractors. | CSE, Sales Engineering | S18 | time-sensitive | medium | Mirrored role source. |

## Time-Sensitive Questions

Time-sensitive questions are primarily Level 3 agentic product questions and CSE role questions that depend on 2026 product packaging or a current mirrored job listing. They should be rechecked before interview use if Sonar changes packaging, availability, or role definitions.

## Quality-Control Checklist

1. Every answer is supported by an identified source: yes, with S18 marked as a third-party mirrored Sonar job listing.
2. Current product names checked as of 24 July 2026: yes.
3. Emerging-product terminology treated cautiously: yes.
4. Every quiz has one correct answer: yes.
5. Distractors are plausible within the same category: yes.
6. Flashcards test retrieval rather than recognition: yes.
7. Level 3 is harder through reasoning and positioning: yes.
8. Customer scenarios reflect CSE responsibilities: yes.
9. Mind-map questions created: no.
10. Final JSON validation: see validator result.
11. Unsupported product claims invented: no known unsupported claims.
