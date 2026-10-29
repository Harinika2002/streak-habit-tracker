export const INITIAL_HABITS = [
  {
    id: "h1",
    title: "Morning Cardio & Stretching",
    category: "Fitness",
    targetMins: 30,
    color: "#EF4444",
    icon: "Dumbbell",
    completedToday: true,
    trackProgress: true,
    streak: 7,
    completedDates: [
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ],
  },
  {
    id: "h2",
    title: "React & Node.js System Architecture",
    category: "Coding",
    targetMins: 45,
    color: "#3B82F6",
    icon: "Code",
    completedToday: true,
    streak: 9,
    completedDates: [
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
    ],
  },
  {
    id: "h3",
    title: "Read 20 Pages Non-Fiction",
    category: "Learning",
    targetMins: 25,
    color: "#10B981",
    icon: "BookOpen",
    completedToday: false,
    streak: 4,
    completedDates: ["2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17"],
  },
  {
    id: "h4",
    title: "Mindful Meditation & Journaling",
    category: "Mindset",
    targetMins: 15,
    color: "#8B5CF6",
    icon: "Brain",
    completedToday: false,
    streak: 6,
    completedDates: [
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
    ],
  },
];
// Helper to get past date strings in YYYY-MM-DD
const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

export const INITIAL_TASKS = [
  {
    id: "t1",
    title: "Design PostgreSQL relational schema & streak trigger",
    category: "Coding",
    priority: "high",
    status: "completed",
    estimatedMins: 40,
    durationSeconds: 2700,
    completedAt: new Date().toISOString(),
    trackProgress: true,
    // Days where the task was completed (peaks UP); missing days drop DOWN:
    completedHistory: [
      getPastDate(0), // Today (Done)
      getPastDate(1), // Yesterday (Done)
      // getPastDate(2), //was missed -> drops down
      getPastDate(3), // Done
      getPastDate(4), // Done
      getPastDate(5), // Done
      // getPastDate(6) was missed -> drops down
      getPastDate(7), // Done
      getPastDate(8),
      getPastDate(10),
      getPastDate(12),
      getPastDate(15),
    ],
    note: "Added stored procedure for consecutive streak calculation.",
  },
  {
    id: "t2",
    title: "Implement Express API endpoints with error handling",
    category: "Coding",
    priority: "high",
    status: "in_progress",
    estimatedMins: 45,
    durationSeconds: 1560,
    completedAt: null,
    trackProgress: true,
    completedHistory: [
      getPastDate(0),
      getPastDate(2),
      getPastDate(3),
      getPastDate(6),
      getPastDate(9),
    ],
    note: "Habit toggle controller working.",
  },
  {
    id: "t4",
    title: "High-intensity interval workout & cool-down",
    category: "Fitness",
    priority: "medium",
    status: "completed",
    estimatedMins: 30,
    durationSeconds: 1920,
    completedAt: new Date().toISOString(),
    trackProgress: true,
    completedHistory: [
      getPastDate(0),
      getPastDate(1),
      getPastDate(2),
      getPastDate(3),
      getPastDate(4),
      getPastDate(7),
      getPastDate(8),
      getPastDate(14),
    ],
    note: "Peak heart rate 180bpm.",
  },
];

export const INITIAL_NOTES = [
  {
    id: "n1",
    title: "Morning Momentum Win",
    content:
      "Completed the 30-minute workout before 8 AM. Energy was through the roof today!",
    tag: "Habit Win",
    createdAt: "2026-10-18T08:35:00Z",
    pinned: true,
  },
  {
    id: "n2",
    title: "PostgreSQL Streak Freeze Trigger",
    content:
      "Streak trigger checks yesterday vs 2 days ago for automatic freeze consumption. Clean SQL logic!",
    tag: "Coding",
    createdAt: "2026-10-18T10:45:00Z",
    pinned: false,
  },
  {
    id: "n3",
    title: "7-Day Streak Milestone Insight",
    content:
      "7 days streak milestone unlocked! Small daily actions compound exponentially into habits.",
    tag: "Motivation",
    createdAt: "2026-10-18T11:00:00Z",
    pinned: true,
  },
];

export const MILESTONES = [
  {
    days: 3,
    title: "Catalyst Spark",
    xp: 50,
    gems: 10,
    desc: "3 consecutive days active",
  },
  {
    days: 7,
    title: "Momentum Architect",
    xp: 150,
    gems: 25,
    desc: "A full week without breaking the chain",
  },
  {
    days: 14,
    title: "Fortnight Vanguard",
    xp: 350,
    gems: 50,
    desc: "14 consecutive days of mastery",
  },
  {
    days: 30,
    title: "Habit Titan",
    xp: 1000,
    gems: 100,
    desc: "30 days streak! In the top 1% of users",
  },
  {
    days: 100,
    title: "Century Sovereign",
    xp: 5000,
    gems: 500,
    desc: "100 days of relentless discipline",
  },
];

export const COACH_QUOTES = [
  {
    quote: "Consistency compounds exponentially. Small daily disciplines yield monumental breakthroughs.",
    author: "James Clear",
    tag: "Compounding",
  },
  {
    quote: "Discipline is choosing between what you want in the moment and what you want most.",
    author: "Abraham Lincoln",
    tag: "Self-Mastery",
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    tag: "Excellence",
  },
  {
    quote: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    tag: "Stoic Focus",
  },
  {
    quote: "Momentum is your greatest strategic advantage. Protect the unbroken chain at all costs.",
    author: "Jerry Seinfeld",
    tag: "Momentum",
  },
  {
    quote: "Don't count the days, make the days count. The standard is relentless execution.",
    author: "Muhammad Ali",
    tag: "Execution",
  },
  {
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    tag: "Resilience",
  },
  {
    quote: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
    tag: "Deep Work",
  },
  {
    quote: "Action isn't just the effect of motivation; it's also the cause of it.",
    author: "Mark Manson",
    tag: "Catalyst",
  },
  {
    quote: "If you don't find the time to do it right, when will you find the time to do it over?",
    author: "John Wooden",
    tag: "Standards",
  },
  {
    quote: "No person has a right to be an amateur in the matter of physical and mental discipline.",
    author: "Socrates",
    tag: "Protocols",
  },
  {
    quote: "Success is nothing more than a few simple disciplines, practiced every single day.",
    author: "Jim Rohn",
    tag: "Daily Practice",
  },
  {
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    tag: "Purpose",
  },
  {
    quote: "Every action you take is a vote for the type of person you wish to become.",
    author: "James Clear",
    tag: "Identity",
  },
  {
    quote: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    tag: "Intention",
  },
  {
    quote: "Streak freeze is your fail-safe armor, but ruthless consistency is your daily weapon.",
    author: "Streak Protocol",
    tag: "Defense",
  },
  {
    quote: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.",
    author: "Leo Babauta",
    tag: "Clarity",
  },
  {
    quote: "Motivation gets you going, but discipline keeps you growing.",
    author: "John C. Maxwell",
    tag: "Growth",
  },
  {
    quote: "The secret of getting ahead is getting started. Break complex tasks into small actions.",
    author: "Mark Twain",
    tag: "Initiation",
  },
  {
    quote: "Success isn't an isolated event; it's the inevitable byproduct of daily execution.",
    author: "Executive Wisdom",
    tag: "Compounding",
  },
  {
    quote: "The cost of discipline is always less than the price of regret.",
    author: "Nido Qubein",
    tag: "Commitment",
  },
  {
    quote: "Mastering others is strength. Mastering yourself is true power.",
    author: "Lao Tzu",
    tag: "Self-Control",
  },
  {
    quote: "What we do today matters most. The future is built in twenty-four hour increments.",
    author: "Ryan Holiday",
    tag: "Present Focus",
  },
  {
    quote: "Energy flows where attention goes. Direct your focus towards highest-leverage rituals.",
    author: "Tony Robbins",
    tag: "High Leverage",
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    tag: "Systems",
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements.",
    author: "John C. Maxwell",
    tag: "Micro-Wins",
  },
  {
    quote: "A year from now you will wish you had started today.",
    author: "Karen Lamb",
    tag: "Urgency",
  },
  {
    quote: "Do what you must do until you can do what you want to do.",
    author: "Oprah Winfrey",
    tag: "Grit",
  },
  {
    quote: "Discipline equals freedom. The more disciplined your habits, the freer your life.",
    author: "Jocko Willink",
    tag: "Freedom",
  },
  {
    quote: "Small daily improvements over time lead to stunning, long-term compound results.",
    author: "Robin Sharma",
    tag: "Compounding",
  },
  {
    quote: "The soul becomes dyed with the color of its daily thoughts and rituals.",
    author: "Marcus Aurelius",
    tag: "Mindset",
  },
];
