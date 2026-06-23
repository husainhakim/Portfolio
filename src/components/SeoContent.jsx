/**
 * SeoContent.jsx
 *
 * Visually hidden but fully crawlable semantic HTML for Google's bot.
 * Terminal UIs render text via JS, so crawlers see an empty shell.
 * This component injects real text nodes into the DOM, making all
 * portfolio content visible to search engines without affecting the UI.
 *
 * Uses the .sr-only class (already defined in index.css) which hides
 * content visually while keeping it accessible and indexable.
 * NOTE: display:none or visibility:hidden would hide content from crawlers
 * too — sr-only uses position:absolute + clip which does NOT.
 */
export default function SeoContent() {
  return (
    <div className="sr-only" aria-hidden="true">
      {/* ── IDENTITY ──────────────────────────────────────────── */}
      <h1>Husain Hakim</h1>
      <h2>Husain Hakim — Backend Developer</h2>
      <p>
        Backend Developer at LetsUpgrade Edtech Pvt Ltd, India. Building REST
        APIs, event-driven microservices, and full-stack platforms with Node.js,
        Express.js, FastAPI, Django, MongoDB, and Python.
      </p>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section>
        <h2>About Husain Hakim</h2>
        <p>
          Backend Developer with 1 year of experience in EdTech, skilled in
          building REST APIs, comfortable in startup and enterprise environments.
          Strong team collaborator, independent worker, focused on continuous
          learning and reliable backend solutions.
        </p>
        <p>
          &quot;I build the things you never see — and that&apos;s the point.&quot;
        </p>
      </section>

      {/* ── SKILLS ────────────────────────────────────────────── */}
      <section>
        <h2>Skills &amp; Tech Stack</h2>

        <h3>Languages</h3>
        <ul>
          <li>Python</li>
          <li>JavaScript</li>
          <li>C++</li>
        </ul>

        <h3>Backend Frameworks</h3>
        <ul>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>Django</li>
          <li>FastAPI</li>
        </ul>

        <h3>Databases</h3>
        <ul>
          <li>MongoDB</li>
          <li>SQL</li>
          <li>Firebase</li>
        </ul>

        <h3>Testing &amp; Automation</h3>
        <ul>
          <li>Selenium</li>
          <li>Cypress</li>
          <li>JMeter</li>
          <li>Postman</li>
        </ul>

        <h3>Tools &amp; DevOps</h3>
        <ul>
          <li>Git</li>
          <li>GitHub</li>
          <li>Jenkins</li>
          <li>VS Code</li>
          <li>OpenCV</li>
        </ul>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────────── */}
      <section>
        <h2>Work Experience</h2>

        <article>
          <h3>Backend Developer — LetsUpgrade Edtech Pvt Ltd</h3>
          <p>September 2024 – Present · India</p>
          <ul>
            <li>
              Developed and maintained backend for a platform with 500+ REST APIs
              serving 10M+ MongoDB documents.
            </li>
            <li>
              Migrated 30+ MongoDB Atlas Triggers to Node.js event-driven
              services, cutting infrastructure costs by up to 95%.
            </li>
            <li>
              Worked directly with clients, translating requirements into
              actionable development tasks.
            </li>
          </ul>
        </article>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────── */}
      <section>
        <h2>Projects</h2>

        <article>
          <h3>SmartZone — Logistics Platform</h3>
          <p>
            Full-stack logistics platform that uses Union-Find (DSU) clustering
            for delivery zone optimization. Features interactive maps, analytics
            dashboard, and JWT + Google OAuth + OTP authentication.
          </p>
          <p>Tech Stack: React.js, Node.js, Express.js, MongoDB</p>
          <ul>
            <li>DSU clustering algorithm for intelligent delivery zone grouping</li>
            <li>Interactive map visualization of delivery clusters</li>
            <li>Analytics dashboard with real-time metrics</li>
            <li>Multi-auth: JWT, Google OAuth, OTP verification</li>
          </ul>
          <a href="https://delivery-clustering.vercel.app" target="_blank" rel="noopener noreferrer">
            SmartZone Live Demo
          </a>
        </article>

        <article>
          <h3>URL-Shortener — Secure Link Shortening Service</h3>
          <p>
            Secure URL shortener service with custom aliases, link expiration,
            rate limiting, and middleware-based authorization.
          </p>
          <p>Tech Stack: Node.js, Express.js, MongoDB, JWT</p>
          <ul>
            <li>Custom alias support for branded short links</li>
            <li>Link expiration with TTL configuration</li>
            <li>Rate limiting to prevent abuse</li>
            <li>JWT-based middleware authorization</li>
          </ul>
          <a href="https://github.com/husainhakim/URL-Shortener" target="_blank" rel="noopener noreferrer">
            URL-Shortener GitHub Repository
          </a>
        </article>

        <article>
          <h3>Food-Del — Full-Stack Food Delivery App</h3>
          <p>
            Full-stack food delivery application with real-time order tracking,
            admin dashboard, and a full automated testing suite wired into a
            Jenkins CI/CD pipeline.
          </p>
          <p>
            Tech Stack: MongoDB, Express.js, React.js, Node.js, JMeter, Cypress,
            Selenium, Jenkins
          </p>
          <ul>
            <li>Real-time order tracking with live status updates</li>
            <li>Admin dashboard for menu and order management</li>
            <li>End-to-end tests: Cypress + Selenium</li>
            <li>Performance tests: JMeter load testing</li>
            <li>Jenkins CI/CD pipeline integration</li>
          </ul>
          <a href="https://github.com/husainhakim/Food-Del" target="_blank" rel="noopener noreferrer">
            Food-Del GitHub Repository
          </a>
        </article>
      </section>

      {/* ── EDUCATION ─────────────────────────────────────────── */}
      <section>
        <h2>Education</h2>
        <article>
          <h3>B.Tech Computer Science — ITM Skills University</h3>
          <p>August 2023 – May 2027</p>
          <p>CGPA: 8.8 / 10</p>
        </article>
      </section>

      {/* ── ACHIEVEMENTS ──────────────────────────────────────── */}
      <section>
        <h2>Achievements &amp; Certifications</h2>
        <ul>
          <li>Solved 200+ LeetCode problems; HackerRank 5★ in Python &amp; Java</li>
          <li>
            Certifications: MongoDB University, Advanced Selenium (LambdaTest),
            Java Programming (Great Learning)
          </li>
          <li>Organized 2 hackathons with a combined prize pool of ₹6,00,000+</li>
          <li>Mentor @ ITM Buildathon 3.0</li>
          <li>Volunteer @ Swift Mumbai</li>
        </ul>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────── */}
      <section>
        <h2>Contact Husain Hakim</h2>
        <ul>
          <li>
            Email:{' '}
            <a href="mailto:husainh@letsupgrade.in">husainh@letsupgrade.in</a>
          </li>
          <li>
            GitHub:{' '}
            <a href="https://github.com/husainhakim" target="_blank" rel="noopener noreferrer">
              github.com/husainhakim
            </a>
          </li>
          <li>
            LinkedIn:{' '}
            <a href="https://linkedin.com/in/husainhakim" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/husainhakim
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
