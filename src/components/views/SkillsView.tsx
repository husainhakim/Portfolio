import React from "react";
import styles from "./Views.module.css";
import { SKILLS_DATA } from "@/data/skillsData";

export function SkillsView() {
  return (
    <div className={styles.viewContainer}>
      <div className={styles.viewHeader}>
        <h1 className={styles.viewTitle}>Skills Overview</h1>
        <div className={styles.viewMeta}>
          <span>Type: Directory</span>
          <span>•</span>
          <span className="badge badge-skills">
            {SKILLS_DATA.reduce((acc, cat) => acc + cat.skills.length, 0)} Skills
          </span>
        </div>
      </div>

      <div className={styles.viewContent}>
        <p className={styles.leadText}>
          A comprehensive overview of my technical proficiencies, tools, and soft skills, organized by category.
        </p>

        <div className={styles.skillsContainer}>
          {SKILLS_DATA.map((category) => (
            <div key={category.id} className={styles.skillsSection}>
              <h2 className={styles.skillsCategoryTitle}>{category.category}</h2>
              <div className={styles.skillsBadgeGroup}>
                {category.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-skills">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
