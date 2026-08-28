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
  },
  {
    id: "silly-authentication-mistakes",
    slug: "silly-authentication-mistakes",
    title: "The Devil is in the Details: How Silly Authentication Mistakes Lead to Full Compromise",
    publication: "Portfolio",
    date: "2026-08-28",
    readTime: "6 min read",
    bannerImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop",
    content: `Authentication is supposed to be the front door of your application. You ask for a username, you check the password, and you let the user in. It sounds simple, but authentication is arguably the most critical and easily botched part of modern web applications. 

Recently, I’ve been spending time in the PortSwigger Web Security Academy, firing up Burp Suite to actively break authentication mechanisms. What surprised me most wasn't the complexity of the attacks, but how simple, seemingly harmless developer mistakes can lead to complete Account Takeover (ATO). 

You don't always need a highly sophisticated zero-day exploit to cause massive harm. Sometimes, all you need is a poorly implemented login page.

## The Attacks: Exploiting "Silly" Mistakes

When you look at authentication through the lens of an attacker using tools like Burp Suite, the flaws become glaringly obvious. Here are three common mistakes that I exploited in the labs:

### Mistake 1: Helpful Error Messages (Username Enumeration)
Developers love to be helpful. If a user forgets their email, the login page might say, *"User does not exist"*. If they get the password wrong, it says, *"Incorrect password"*. 

As an attacker, this is a goldmine. Using Burp Intruder, I can load a massive wordlist of common usernames and blast the login endpoint. Any response that says *"Incorrect password"* tells me that the username is valid. I have just harvested half of the credentials I need for a brute-force attack, all because the application was trying to be "helpful."

### Mistake 2: Missing Rate Limiting on 2FA
Imagine an application requires a 4-digit Two-Factor Authentication (2FA) code sent to your email. 4 digits means there are only 10,000 possible combinations (0000 to 9999). 

If the developer fails to implement rate limiting or temporary lockouts on this endpoint, an attacker doesn't need your email account. I simply intercepted the 2FA request in Burp Suite, sent it to Intruder, set my payload to iterate from 0000 to 9999, and walked away. A few minutes later, the correct code returned a \`302 Found\` redirect instead of a \`200 OK\` error. I bypassed the 2FA entirely.

### Mistake 3: Flawed Password Reset Logic
Password reset functionality is notoriously difficult to get right. In one lab, the application generated a secure reset token and emailed it to the user. However, the application used the HTTP \`Host\` header from my request to build the reset link inside the email.

By intercepting the password reset request and changing the \`Host\` header to an attacker-controlled server (e.g., \`Host: attacker-server.com\`), the application generated a valid reset token but sent the user a link pointing to *my* server. When the victim clicked the link in their email, their browser sent the secret token to my logs. I then used that token on the real site to reset their password and take over their account.

## The Impact

None of these attacks require memory corruption or advanced reverse engineering. They are logical flaws—the system doing exactly what the code told it to do, but in a way the developer never anticipated. 

The impact is devastating. By chaining Username Enumeration to harvest accounts, and then exploiting a lack of rate limiting or flawed reset logic, an attacker can systematically compromise user accounts across the entire platform. If one of those accounts happens to be an administrator, it's game over.

## How to Defend Your Application

Security isn't just about defending against elite nation-state hackers; it's about getting the absolute basics right. If you are building authentication systems, you must think offensively.

1. **Use Generic Error Messages:** Always use ambiguous messages like *"Invalid username or password"*. Never confirm whether an account exists on the login screen.
2. **Implement Strict Rate Limiting:** You must enforce rate limiting and account lockouts (or progressive delays/CAPTCHAs) on all authentication endpoints, including login, password reset, and 2FA verification.
3. **Never Trust the Client:** Do not use client-controlled inputs (like the \`Host\` header) to generate sensitive links or tokens. Build complete URLs using a hardcoded configuration variable on the backend.
4. **Validate Everything Server-Side:** Never rely on the frontend (client-side) JavaScript to verify if a login attempt or token is valid. Attackers bypass the frontend entirely using tools like Burp Suite.

I highly encourage developers to install Burp Suite Community Edition, intercept their own application's traffic, and try to break their own login pages. You will be amazed at what you find when you stop thinking like a builder and start thinking like an attacker.`,
    topics: ["Offensive Security", "Burp Suite", "Web Security"],
    summary: "Breaking down common authentication flaws and how simple developer mistakes can lead to Account Takeover, based on real-world testing with Burp Suite.",
    keyTakeaways: [
      "Helpful error messages facilitate username enumeration.",
      "A lack of rate limiting makes 2FA brute-forcing trivial.",
      "Client-side headers should never be trusted for generating reset links."
    ],
  }
];
