"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BlogItem } from "@/data/blogsData";
import { findNodeByPath, FSFile } from "@/data/filesystemData";
import { useFilesystem } from "@/context/FilesystemContext";
import {
  Calendar,
  Clock,
  ArrowUpRight,
  BookOpen,
  User,
  ArrowRight
} from "lucide-react";
import styles from "./Views.module.css";

interface BlogDetailViewProps {
  blog: BlogItem;
}

export function BlogDetailView({ blog }: BlogDetailViewProps) {
  const { navigate, openFile } = useFilesystem();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic read time calculation
  const getDynamicReadTime = (content: string) => {
    if (!content) return "1 min read";
    const textOnly = content.replace(/[#*`_\[\]()]/g, '');
    const wordCount = textOnly.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const dynamicReadTime = blog.content ? getDynamicReadTime(blog.content) : blog.readTime;

  useEffect(() => {
    const scrollContainer = document.getElementById("modal-scroll-container");
    
    const handleScroll = () => {
      if (!scrollContainer) return;
      
      const totalScroll = scrollContainer.scrollTop;
      const windowHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      
      if (windowHeight === 0) {
        setScrollProgress(0);
        return;
      }
      
      const scroll = (totalScroll / windowHeight) * 100;
      setScrollProgress(scroll);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Trigger once on mount to handle initial state
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [blog.id]); // re-run if blog changes

  return (
    <>
      <div className={styles.readProgressBarContainer}>
        <div 
          className={styles.readProgressBar} 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={styles.viewContainer}>
        {blog.bannerImage && (
          <img src={blog.bannerImage} alt={blog.title} className={styles.blogBanner} />
        )}
        <div className={styles.projectHeader}>
          <div className={styles.badgeRow}>
            <span className="badge badge-blog">{blog.publication}</span>
            <span className={styles.metaWithIcon}>
              <Calendar size={13} />
              {blog.date}
            </span>
            <span className={styles.metaWithIcon}>
              <Clock size={13} />
              {dynamicReadTime}
            </span>
          </div>

          <h1 className={styles.projectTitle}>{blog.title}</h1>
          <p className={styles.projectTagline}>{blog.summary}</p>

          <div className={styles.tagsFlex} style={{ marginTop: "12px" }}>
            {blog.topics.map((t, idx) => (
              <span key={idx} className={styles.securityTag} style={{ fontSize: '10px' }}>
                [{t.toUpperCase()}]
              </span>
            ))}
          </div>
        </div>

        <div className={styles.sectionCard} style={{ border: 'none', background: 'transparent', padding: '0' }}>
          {blog.content ? (
            <div className={styles.markdownBody}>
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          ) : (
            <div className={styles.bodyParagraphMuted}>
              Content is not available locally.
            </div>
          )}
        </div>

        {/* Author Block CTA */}
        {blog.content && (
          <div className={styles.authorBlock}>
            <div className={styles.authorInfo}>
              <span className={styles.authorRole}>Written by</span>
              <span className={styles.authorName}>Husain Hakim</span>
            </div>
            <button 
              className={styles.primaryActionButton}
              onClick={() => {
                const aboutNode = findNodeByPath("/home/husain/about.md");
                if (aboutNode && aboutNode.type === "file") {
                  openFile(aboutNode as FSFile);
                }
              }}
            >
              <User size={14} />
              <span>View Profile</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {blog.mediumUrl && (
          <div className={styles.sectionCard} style={{ marginTop: "24px" }}>
            <a
              href={blog.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.blogReadLink}
            >
              <span>View Original Cross-Post on Medium</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        )}
      </div>
    </>
  );
}
