import { faker } from '@faker-js/faker';

/**
 * DYNAMIC GOAL GENERATOR
 * Generates realistic senior/GLP-1 fitness goals by mixing and matching 
 * motivations, actions, and Boise-specific context.
 */
export const generateDynamicGoal = () => {
  const openings = [
    "I've been on Wegovy for 4 months and",
    "As I'm entering my 70s, I've realized",
    "Since my doctor started me on Mounjaro,",
    "After my recent knee replacement,",
    "I've lost weight recently but",
    "My goal for my 'second mountain' is that",
    "I want to stay as independent as possible, so",
    "I'm a regular at the Boise climbing gym but",
    "I've spent years focused on my career, now",
    "My spouse and I want to travel, but",
    "I'm worried about sarcopenia and",
    "Since moving to the North End, I've wanted to",
    "I've tried every crazy diet out there, but",
    "My energy levels have been low lately and",
    "I want to feel 'Second Mountain Ready' because"
  ];

  const actions = [
    "I really need to prioritize",
    "I am looking for a trainer to help with",
    "my main focus needs to be",
    "I want to work alongside someone on",
    "I'm struggling with",
    "I want to build a foundation of",
    "I'm looking for behavior-based coaching for",
    "I need to reclaim my",
    "I want to stop guessing and start focusing on"
  ];

  const targets = [
    "functional core strength",
    "bone density and balance",
    "lean muscle preservation",
    "mobility for daily living",
    "grip strength and stability",
    "flexibility and joint health",
    "cardiovascular stamina",
    "sustainable nutrition habits",
    "posture and overall vitality"
  ];

  const contexts = [
    "to keep up with my grandkids this summer.",
    "so I can hike Camel's Back without pain.",
    "to avoid the health issues my parents had.",
    "after years of being sedentary.",
    "while I navigate these medical changes.",
    "so I can keep walking my dog on the Greenbelt.",
    "because consistency has always been my struggle.",
    "to ensure I stay out of assisted living.",
    "before my upcoming walking tour in Italy.",
    "to improve my quality of life in retirement."
  ];

  const closings = [
    "I've heard great things about your approach!",
    "No more quick fixes for me.",
    "I'm ready to build lasting habits.",
    "How can we get started?",
    "I need a pro who understands senior fitness.",
    "Looking forward to your help.",
    "Consistency is key, and I'm ready."
  ];

  const o = faker.helpers.arrayElement(openings);
  const a = faker.helpers.arrayElement(actions);
  const t = faker.helpers.arrayElement(targets);
  const c = faker.helpers.arrayElement(contexts);
  const cl = faker.helpers.arrayElement(closings);

  return `${o} ${a} ${t} ${c} ${cl}`;
};
