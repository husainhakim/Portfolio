"use client";

import React from "react";
import { EXPERIENCE_DATA } from "@/data/experienceData";
import {
  Briefcase,
  Calendar,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  Server,
  Layers,
} from "lucide-react";
import styles from "./Views.module.css";

export function ExperienceView() {
  return (
    <div className={styles.viewContainer}>
      <div className={styles.projectHeader}>
        <div className={styles.badgeRow}>
          <span className="badge badge-experience">Professional Background</span>
          <span className="badge badge-default">Backend & Technical Leadership</span>
        </div>
        <h1 className={styles.projectTitle}>Experience & Engineering Impact</h1>
        <p className={styles.projectTagline}>
          Track record in architecting high-scale backend microservices, event-driven distributed systems, and leading technical developer hackathons.
        </p>
      </div>

      <div className={styles.experienceList}>
        {EXPERIENCE_DATA.map((exp) => (
          <div key={exp.id} className={styles.sectionCard}>
            <div className={styles.experienceTopRow}>
              <div>
                <div className={styles.badgeRow}>
                  <span className="badge badge-experience">{exp.type}</span>
                  <span className={styles.metaWithIcon}>
                    <Calendar size={12} />
                    {exp.period} ({exp.duration})
                  </span>
                  <span className={styles.metaWithIcon}>
                    <MapPin size={12} />
                    {exp.location}
                  </span>
                </div>
                <h2 className={styles.experienceRole}>{exp.role}</h2>
                <div className={styles.experienceOrg}>{exp.organization}</div>
              </div>
            </div>

            <p className={styles.bodyParagraph}>{exp.summary}</p>

            {/* Impact Metrics Banner */}
            <div className={styles.metricsGrid}>
              {exp.technicalImpact.map((metric, mIdx) => (
                <div key={mIdx} className={styles.metricCard}>
                  <div className={styles.metricValue}>{metric.metric}</div>
                  <div className={styles.metricDesc}>{metric.description}</div>
                </div>
              ))}
            </div>

            {/* Key Responsibilities */}
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Core Engineering Contributions:</h3>
              <ul className={styles.detailsList}>
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Technologies Utilized:</h3>
              <div className={styles.tagsFlex}>
                {exp.technologies.map((t, tIdx) => (
                  <span key={tIdx} className={styles.techTag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
