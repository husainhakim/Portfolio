export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  publication: string;
  date: string;
  readTime: string;
  mediumUrl?: string;
  bannerImage?: string;
  content?: string;
  topics: string[];
  summary: string;
  keyTakeaways: string[];
}

export const BLOGS_DATA: BlogItem[] = [
  {
    id: "clean-code-was-never-the-hard-part",
    slug: "clean-code-was-never-the-hard-part",
    title: "Clean Code Was Never the Hard Part",
    publication: "Portfolio",
    date: "2026-08-25",
    readTime: "5 min read",
    bannerImage: "https://pbs.twimg.com/media/HPTQM8zacAA7PYT.jpg",
    content: `Before working on real company projects, I used to think good engineering was mostly about writing pristine, perfectly-architected code. Pick the right tech stack, use the latest design patterns, maintain a flawless commit history, and move fast. I genuinely believed that if the code worked locally and looked beautiful in a pull request, the job was essentially done.

Then I spent 10 months building and scaling production systems at [LetsUpgrade](https://letsupgrade.in). 

That earlier mindset didn't just feel naive—it felt completely disconnected from reality.

## The Myth of Code in Isolation

What I quickly learned is that real engineering problems are almost never purely technical. They aren't solved in a vacuum. Instead, they are continuous, exhausting negotiations: trade-offs between speed and stability, simplicity and flexibility, shipping a short-term hotfix versus investing in long-term maintainability.

When I was building personal projects, I was optimizing purely for learning and experimentation. If I didn't like how a module was structured, I could aggressively refactor it over the weekend. I could break things without consequences. I prioritized whatever interested me at that exact moment.

Company projects do not afford you that luxury. Every single line of code you write carries heavy, invisible context. 
- You have existing active users who will immediately notice if something breaks.
- You have strict deadlines tied to business metrics.
- You have legacy dependencies that you didn't write but absolutely must maintain.

You are forced to think beyond your IDE and start thinking about the ecosystem.

## Working Code Is Not Safe Code

One of the hardest lessons was realizing that "working code" is not synonymous with "safe code." 

A feature might pass all its unit tests and look completely correct today. But what happens two weeks later when a database table grows to millions of rows? What happens when a third-party API goes down? If you ignore edge cases, infrastructure bottlenecks, or how your feature integrates into the broader microservice architecture, your "working" code becomes a ticking time bomb.

I realized that writing the actual code was never the hardest part of the job. The real challenge was debugging obscure production issues at 3 AM. It was reading through undocumented legacy decisions trying to understand *why* something was built a certain way. It was the soft skills: explaining complex technical limitations to non-technical stakeholders clearly and effectively.

Over time, I stopped asking the junior engineer question: *"Can this be built?"* 
I started asking the senior engineer question: *"Should this be built this way, right now, given our current constraints?"*

That single shift in perspective completely revolutionized how I approach software engineering.

## Finding the Balance

Personal projects gave me my foundation. They helped me build confidence, technical depth, and an insatiable curiosity for breaking things apart to see how they work. 

But it was company projects that taught me the hard lessons: responsibility, restraint, and architectural judgment. 

You absolutely need both. One without the other leaves massive blind spots in your skill set—gaps you usually only notice when a critical system crashes in production.

I'm still learning. I'm still building. But now, I do it with a much deeper, battle-tested understanding of what actually matters when the code hits the real world.`,
    topics: ["Software Engineering", "Career Growth", "Backend Development"],
    summary: "Reflecting on the transition from personal projects to production systems and why writing working code is only a small piece of the engineering puzzle.",
    keyTakeaways: [
      "Engineering is about trade-offs between speed and maintainability.",
      "Working code is not synonymous with safe code.",
      "Context and constraints matter more than clean code in isolation."
    ],
  }
];
