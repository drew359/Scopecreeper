export const FIXED_QUESTIONS = {
  epic: [
    { id: 'title', label: 'Feature / Epic Name', question: "What's the name of this feature or initiative?" },
    { id: 'overview', label: 'Overview', question: 'Give me a 2-3 sentence overview of what this is and why we\'re building it.' },
    { id: 'objectives', label: 'Objectives', question: 'What are the main business objectives? What does success look like?' },
    { id: 'scope_in', label: 'In Scope', question: "What's explicitly IN scope for this work?" },
    { id: 'scope_out', label: 'Out of Scope', question: "What's explicitly OUT of scope? (things people might assume are included but aren't)" },
    { id: 'users', label: 'Affected Users / Brands', question: 'Who are the affected users, clients, or brands?' },
    { id: 'requirements', label: 'Key Requirements', question: 'Walk me through the key functional requirements or features. List as many as you can.' },
    { id: 'dependencies', label: 'Dependencies / Constraints', question: 'Any dependencies on other teams, systems, or tickets? Any technical constraints?' },
    { id: 'deliverables', label: 'Deliverables', question: 'What are the concrete deliverables — what does "done" look like?' },
    { id: 'priority', label: 'Priority / Timeline', question: 'What\'s the priority and is there a timeline or deadline?' },
    { id: 'contributors', label: 'Contributors', question: 'Who are the key contributors or stakeholders? (names / roles)' },
  ],

  story: [
    { id: 'user_role', label: 'User Role', question: 'Who is this for? What type of user or persona?' },
    { id: 'goal', label: 'Goal', question: 'What does that user want to do or achieve?' },
    { id: 'reason', label: 'Business Value', question: 'Why do they want it? What\'s the business value or benefit?' },
    { id: 'acceptance', label: 'Acceptance Criteria', question: 'List the acceptance criteria — what must be true for this to be "done"?' },
    { id: 'edge_cases', label: 'Edge Cases', question: 'Any edge cases, error states, or things that could go wrong?' },
    { id: 'ui', label: 'UI / UX Notes', question: 'Any UI or UX considerations? Designs, mockups, or specific behaviour?' },
    { id: 'dependencies', label: 'Dependencies', question: 'Any dependencies on other stories, APIs, or systems?' },
    { id: 'priority', label: 'Priority', question: 'What\'s the priority? (Critical / High / Medium / Low)' },
  ],

  bug: [
    { id: 'summary', label: 'Bug Summary', question: 'Describe the bug in one sentence — what\'s wrong?' },
    { id: 'steps', label: 'Steps to Reproduce', question: 'What are the steps to reproduce this? Be as specific as possible.' },
    { id: 'expected', label: 'Expected Behaviour', question: 'What should happen?' },
    { id: 'actual', label: 'Actual Behaviour', question: 'What actually happens instead?' },
    { id: 'environment', label: 'Environment', question: 'What environment is this in? (browser, device, version, brand/client)' },
    { id: 'impact', label: 'Impact', question: 'Who is affected and what\'s the business impact or severity?' },
    { id: 'frequency', label: 'Frequency', question: 'Is this always reproducible or intermittent?' },
    { id: 'evidence', label: 'Evidence', question: 'Any screenshots, logs, or error messages you can describe or paste?' },
  ],

  task: [
    { id: 'what', label: 'What needs doing', question: 'What is the task? Describe it in a sentence.' },
    { id: 'why', label: 'Why / Context', question: 'Why is this needed? What\'s the context or business reason?' },
    { id: 'approach', label: 'Technical Approach', question: 'How should this be approached? Any specific implementation notes?' },
    { id: 'checklist', label: 'Checklist', question: 'List the specific sub-tasks or steps involved.' },
    { id: 'dod', label: 'Definition of Done', question: 'What does done look like? How will we know it\'s complete?' },
    { id: 'dependencies', label: 'Dependencies', question: 'Any dependencies or blockers?' },
    { id: 'priority', label: 'Priority', question: 'Priority level? (Critical / High / Medium / Low)' },
  ],

  spike: [
    { id: 'question', label: 'Research Question', question: 'What is the core question or problem you\'re investigating?' },
    { id: 'background', label: 'Background / Context', question: 'Why is this research needed? What\'s driving it?' },
    { id: 'timebox', label: 'Timebox', question: 'How long should be spent on this? (e.g. 2 days, 1 sprint)' },
    { id: 'outputs', label: 'Expected Outputs', question: 'What should the output be? (document, prototype, recommendation, ADR...)' },
    { id: 'success', label: 'Success Criteria', question: 'How will you know the spike was successful?' },
    { id: 'constraints', label: 'Constraints', question: 'Any constraints, things to avoid, or out-of-scope areas?' },
  ],

  template: [
    { id: 'template_name', label: 'Template Name', question: 'Which template or component is being changed?' },
    { id: 'current_state', label: 'Current State', question: 'What does it currently look like or do?' },
    { id: 'change', label: 'Desired Change', question: 'What exactly needs to change? Be specific.' },
    { id: 'brands', label: 'Brands / Variants', question: 'Which brands or variants are affected? (Highland, Place, Morton, all...)' },
    { id: 'obp', label: 'OBP / Config', question: 'Are there any OBP settings or config toggles involved?' },
    { id: 'reference', label: 'Reference', question: 'Any design references, Canva links, or examples to point to?' },
    { id: 'impact', label: 'Impact / Risk', question: 'Any risk or impact to other parts of the system?' },
    { id: 'priority', label: 'Priority', question: 'Priority level? (Critical / High / Medium / Low)' },
  ],
}
