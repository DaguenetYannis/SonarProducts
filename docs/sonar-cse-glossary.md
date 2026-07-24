# Sonar CSE Glossary

Access date: 24 July 2026.

## Code Quality and Analysis

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| Static analysis | Automated inspection of source code without running the application. | Explains how Sonar finds issues early in development. | SAST | SAST is security-focused; static analysis also covers quality. | S1, S5 | stable |
| Rule | A coded check that identifies a specific quality or security pattern. | Helps explain why an issue was raised. | Quality Profile | A profile selects which rules are active. | S5 | stable |
| Issue | A finding created when code violates an active rule. | Central object in customer remediation workflows. | Issue status | Status tracks how the team handles the finding. | S5 | stable |
| Bug | A reliability issue that may cause incorrect behavior. | Maps Sonar findings to production risk. | Reliability | Bugs affect reliability ratings. | S4, S5 | stable |
| Code smell | A maintainability issue that makes code harder to understand or change. | Helps discuss technical debt without overstating security risk. | Technical debt | A code smell is a finding; debt is the remediation burden. | S4, S5 | stable |
| Cognitive complexity | A measure of how hard code is to understand because of control flow. | Useful for adoption discussions about maintainability. | Maintainability | Complexity is one driver, not the whole maintainability model. | S5 | stable |
| Duplication | Repeated code that can increase maintenance risk. | Common Quality Gate metric and adoption topic. | Quality Gate condition | Duplication can fail gates when thresholds are exceeded. | S6 | stable |
| Code coverage | Percentage of code exercised by tests. | Helps customers interpret quality gates and testing gaps. | Quality Gate | Coverage is a metric; gates enforce thresholds. | S1, S6 | stable |

## Sonar Governance

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| Quality Profile | Per-language set of active rules used during analysis. | Helps customers standardize what is checked. | Rule | A rule is one check; a profile is the selected rule set. | S5 | stable |
| Quality Gate | Pass/fail policy made of metric conditions after analysis. | Connects technical findings to merge/release governance. | Quality Gate condition | A gate is the policy; a condition is one threshold. | S6 | stable |
| Quality Gate condition | A metric threshold that can make a gate fail. | Explains why a pipeline or PR is blocked. | New code | Conditions may apply to new or overall code. | S6 | stable |
| Sonar way | Built-in default quality profile and quality gate. | Starting point for customers before customization. | Custom gate | Sonar way is default; enterprises may tune standards. | S5 | stable |
| New code | Code recently added or changed according to a configured definition. | Core to Clean as You Code adoption. | Overall code | New code is the immediate focus; overall code is the full codebase. | S4 | stable |
| New Code Definition | Configuration that determines what counts as new code. | Helps customers align standards with release style. | Reference branch | Reference branch can be one definition strategy. | S4 | stable |
| Clean as You Code | Method of preventing new issues while gradually improving existing code. | Key adoption narrative for customers with legacy debt. | Technical debt | It avoids demanding full historical cleanup upfront. | S4 | stable |
| Connected Mode | Binding between SonarQube for IDE and Cloud/Server/Community Build. | Shows how team standards reach developers locally. | SonarQube for IDE | The IDE extension can run standalone; Connected Mode syncs project standards. | S3 | stable |

## Application Security

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| Vulnerability | Security issue that can expose the application to attack. | Helps prioritize security risk with customers. | Security Hotspot | A vulnerability is confirmed; a hotspot needs review. | S1, S7 | stable |
| Security Hotspot | Security-sensitive code requiring human review. | Prevents overstating findings as proven vulnerabilities. | Vulnerability | Hotspots are not automatically vulnerabilities. | S6 | stable |
| SAST | Static application security testing for source-code security weaknesses. | Core Sonar security value proposition. | Taint analysis | Taint analysis is one technique used for data-flow security. | S1, S7 | stable |
| Taint analysis | Tracking untrusted data from sources to dangerous sinks. | Explains injection detection. | Source and sink | Sources and sinks are the endpoints in a taint flow. | S7 | stable |
| Secrets detection | Finding credentials, keys, or tokens in code. | Common quick-value security use case. | SAST | Secrets detection is distinct from code vulnerability analysis. | S1, S7 | stable |
| IaC scanning | Analysis of infrastructure configuration files for security problems. | Helps platform teams govern cloud-native assets. | DevOps integration | IaC scanning often runs in CI/CD. | S1, S7 | stable |
| SCA | Software Composition Analysis for open-source dependency risk. | Critical for Advanced Security positioning. | SAST | SCA analyzes dependencies; SAST analyzes code. | S7, S8 | slow-changing |
| SBOM | Software Bill of Materials listing components in software. | Supports compliance and supply-chain conversations. | License compliance | SBOM is inventory; license compliance is policy evaluation. | S7, S8 | slow-changing |

## DevOps and Platform Engineering

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| Pull-request analysis | Analysis focused on changes in a PR before merge. | Helps customers shift feedback into code review. | Pull-request decoration | Decoration displays results in the DevOps platform. | S6 | stable |
| Branch analysis | Analysis of branches to track quality outside the main branch. | Useful for release and enterprise workflows. | New code | Branches can use their own new-code context. | S4, S6 | stable |
| Pull-request decoration | Showing Sonar results in a repository platform PR. | Makes governance visible where developers work. | Quality Gate | PR decoration can show gate status. | S6 | stable |
| CI/CD | Automated build, test, and deployment workflow. | Sonar is commonly integrated as a quality/security check. | Quality Gate | Gates can fail a pipeline when standards are not met. | S1, S2 | stable |
| Organization | Administrative grouping in SonarQube Cloud. | Helps explain account and project structure. | Project | Projects are analyzed codebases within organizational context. | S4 | slow-changing |
| Portfolio | Enterprise grouping for project-level health and reporting. | Relevant for leadership and governance outcomes. | Project | Portfolio aggregates projects rather than analyzing code directly. | S2 | slow-changing |

## AI and Agentic Development

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| AI Code Assurance | SonarQube tools and standards for projects containing AI-generated code. | Links AI adoption to governance. | Quality Gate | AI Code Assurance can use stricter quality standards. | S1, S4 | time-sensitive |
| Agent-Centric Development Cycle | Sonar framework for Guide, Verify, and Solve in agentic coding. | Explains Sonar's AI-code strategy. | Sonar Vortex | Vortex supports Guide and Verify. | S9, S16 | time-sensitive |
| Guide | AC/DC stage that gives agents architecture, standards, and constraints before coding. | Helps position context before generation. | Context Augmentation | Context Augmentation/Vortex provides guide context. | S9, S16 | time-sensitive |
| Verify | AC/DC stage that independently checks agent output. | Core zero-trust message for AI code. | Deterministic analysis | Verification should be separate from generation. | S9 | time-sensitive |
| Solve | AC/DC stage that remediates issues. | Connects findings to fix workflows. | Remediation Agent | Remediation Agent supports Solve. | S9 | time-sensitive |
| Sonar Vortex | GA product for agent-loop context and verification. | Important advanced product positioning. | Context Augmentation | Context Augmentation is now described as included in Vortex. | S9, S11 | time-sensitive |
| SonarQube MCP Server | MCP integration exposing SonarQube context/actions to AI assistants. | Explains AI-native IDE integration. | SonarQube CLI | MCP is protocol integration; CLI configures workflows. | S15, S16 | time-sensitive |
| SonarSweep | Early-access/private-beta work on training data quality and embedded context. | Useful but risky to overstate in interviews. | Sonar Vortex | SonarSweep is not the same as Vortex. | S14, S16 | time-sensitive |

## Customer Success Engineering

| Term | Concise definition | Why a Sonar CSE needs it | Related term | Distinction or confusion | Source | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| Onboarding | Helping a customer start using Sonar successfully. | First stage of value realization. | Adoption | Onboarding starts usage; adoption expands sustained use. | S18 | time-sensitive |
| Adoption | Ongoing usage of Sonar workflows by teams. | Core CSE success metric. | Usage | Usage is activity; adoption is meaningful workflow integration. | S18 | time-sensitive |
| Customer health | View of risk, value, maturity, and engagement across an account. | CSEs act on health signals. | Risk signal | A risk signal contributes to health assessment. | S18 | time-sensitive |
| Maturity assessment | Structured review of how well a customer uses Sonar practices. | Helps identify next best actions. | Outcome review | Maturity looks at capability; outcome review proves impact. | S18 | time-sensitive |
| Value realization | Evidence that Sonar is delivering customer outcomes. | Supports renewal and expansion conversations. | Time to value | Time to value is how quickly value appears. | S18 | time-sensitive |
| Technical success plan | Plan translating business priorities into technical actions. | CSEs use it to guide adoption. | Success plan | Technical plan focuses on implementation and workflows. | S18 | time-sensitive |
| Technical champion | Customer stakeholder who advocates and helps drive adoption. | Helps CSEs scale change internally. | Executive sponsor | Champion is hands-on; sponsor owns executive priority. | S18 | time-sensitive |
| Qualified Sales handoff | Passing expansion or renewal insight with context to Sales. | Keeps CSE strategic without becoming a sales overlay. | Opportunity signal | A signal becomes a handoff when qualified. | S18 | time-sensitive |
