"use client";

import React, { useState, useMemo } from "react";
import { BLOGS_DATA } from "@/data/blogsData";
import { BookOpen, ExternalLink, Calendar, Clock, ArrowUpRight, Filter } from "lucide-react";
import styles from "./Views.module.css";
import { useFilesystem } from "@/context/FilesystemContext";

export function BlogView() {
  const { navigate } = useFilesystem();
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  // Extract all unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    BLOGS_DATA.forEach(blog => {
      blog.topics.forEach(t => topics.add(t));
    });
    return ["All", ...Array.from(topics)];
  }, []);

  // Filter blogs based on selected topic
  const filteredBlogs = useMemo(() => {
    if (selectedTopic === "All") return BLOGS_DATA;
    return BLOGS_DATA.filter(blog => blog.topics.includes(selectedTopic));
  }, [selectedTopic]);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.projectHeader}>
        <div className={styles.badgeRow}>
          <span className="badge badge-blog">Technical Articles</span>
          <span className="badge badge-default">Platform: Local</span>
        </div>
        <h1 className={styles.projectTitle}>Technical Publications & Engineering Notes</h1>
        <p className={styles.projectTagline}>
          Deep dives into network protocol mechanics, Linux privilege escalation methodologies, and architectural lessons from scaling backend microservices. Click on any article below to read it directly in this workspace.
        </p>
      </div>

      {/* Category Filter */}
      {allTopics.length > 1 && (
        <div className={styles.sectionCard} style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Filter size={14} />
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Filter by Category:</span>
          </div>
          <div className={styles.tagsFlex}>
            {allTopics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={selectedTopic === topic ? styles.securityTag : styles.techTag}
                style={{ cursor: 'pointer', borderStyle: selectedTopic === topic ? 'solid' : 'dashed', fontSize: '10px' }}
              >
                [{topic.toUpperCase()}]
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.blogsGrid}>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className={styles.blogCard} 
              onClick={() => navigate(`/home/husain/blogs/${blog.slug + '.md'}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.blogCardHeader}>
                <div className={styles.badgeRow}>
                  <span className="badge badge-blog">{blog.publication}</span>
                  <span className={styles.metaWithIcon}>
                    <Calendar size={12} />
                    {blog.date}
                  </span>
                  <span className={styles.metaWithIcon}>
                    <Clock size={12} />
                    {blog.readTime}
                  </span>
                </div>
              </div>

              <h2 className={styles.blogCardTitle}>{blog.title}</h2>
              <p className={styles.blogCardSummary}>{blog.summary}</p>

              <div className={styles.tagsFlex} style={{ marginTop: "12px" }}>
                {blog.topics.map((t, idx) => (
                  <span key={idx} className={styles.securityTag} style={{ fontSize: '10px' }}>
                    [{t.toUpperCase()}]
                  </span>
                ))}
              </div>

              {blog.mediumUrl && (
                <div className={styles.blogCardFooter} onClick={(e) => e.stopPropagation()}>
                  <a
                    href={blog.mediumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.blogReadLink}
                  >
                    <span>View Original Post on Medium</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              )}

              <div className={styles.blogCardFooter} style={{ borderTop: "1px dashed var(--border-color)", marginTop: "16px", paddingTop: "12px" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500' }}>
                  <span>Read Blog</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No articles found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
