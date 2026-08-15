/**
 * IEDC-CETLY History Page
 *
 * Cinematic scroll system.
 *
 * Animation layers:
 * 1. Opening sequence
 * 2. Timeline progress
 * 3. Chapter reveals
 * 4. Chapter node activation
 * 5. Closing sequence
 *
 * GSAP + ScrollTrigger
 */

document.addEventListener("DOMContentLoaded", () => {

  /*
   * ------------------------------------------------------------
   * GSAP INITIALIZATION
   * ------------------------------------------------------------
   */

  if (typeof gsap === "undefined") {
    console.error("GSAP failed to load.");
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    console.error("GSAP ScrollTrigger failed to load.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);


  /*
   * ------------------------------------------------------------
   * ACCESSIBILITY
   * ------------------------------------------------------------
   *
   * Respect users who prefer reduced motion.
   */

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /*
   * ------------------------------------------------------------
   * OPENING SEQUENCE
   * ------------------------------------------------------------
   */

  if (!prefersReducedMotion) {

    const openingTimeline = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    openingTimeline
      .from(".history-intro-meta", {
        opacity: 0,
        y: -20,
        duration: 0.8
      })

      .from(".history-kicker", {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.4")

      .from(".history-intro h1", {
        opacity: 0,
        y: 60,
        scale: 0.96,
        duration: 1.1
      }, "-=0.3")

      .from(".history-intro-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.5")

      .from(".history-scroll-cue", {
        opacity: 0,
        y: 20,
        duration: 0.6
      }, "-=0.3");

  }


  /*
   * ------------------------------------------------------------
   * TIMELINE PROGRESS
   * ------------------------------------------------------------
   */

  const timelineProgress =
    document.querySelector(".timeline-progress");

  if (timelineProgress) {

    gsap.to(timelineProgress, {

      height: "100%",

      ease: "none",

      scrollTrigger: {

        trigger: ".history-timeline",

        start: "top center",

        end: "bottom center",

        scrub: true

      }

    });

  }


  /*
   * ------------------------------------------------------------
   * CHAPTER REVEALS
   * ------------------------------------------------------------
   */

  const chapters =
    document.querySelectorAll(".history-chapter");


  chapters.forEach((chapter) => {

    const year =
      chapter.querySelector(".chapter-year");

    const label =
      chapter.querySelector(".chapter-label");

    const title =
      chapter.querySelector(".chapter-title");

    const description =
      chapter.querySelector(".chapter-description");

    const media =
      chapter.querySelector(".chapter-image-frame");

    const node =
      chapter.querySelector(".chapter-node");


    /*
     * Skip complex entrance animation when
     * reduced motion is enabled.
     */

    if (!prefersReducedMotion) {

      const chapterTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: chapter,

          start: "top 75%",

          end: "center 35%",

          toggleActions:
            "play reverse play reverse"

        }

      });


      if (year) {
        chapterTimeline.from(year, {
          opacity: 0,
          y: 50,
          scale: 0.92,
          duration: 0.8
        });
      }


      if (label) {
        chapterTimeline.from(label, {
          opacity: 0,
          x: -30,
          duration: 0.5
        }, "-=0.5");
      }


      if (title) {
        chapterTimeline.from(title, {
          opacity: 0,
          y: 40,
          duration: 0.7
        }, "-=0.3");
      }


      if (description) {
        chapterTimeline.from(description, {
          opacity: 0,
          y: 25,
          duration: 0.6
        }, "-=0.4");
      }


      if (media) {
        chapterTimeline.from(media, {
          opacity: 0,
          scale: 0.92,
          duration: 0.9
        }, "-=0.6");
      }

    }


    /*
     * --------------------------------------------------------
     * CHAPTER NODE ACTIVATION
     * --------------------------------------------------------
     */

    if (node && !prefersReducedMotion) {

      ScrollTrigger.create({

        trigger: chapter,

        start: "top center",

        end: "bottom center",


        onEnter: () => {

          gsap.to(node, {
            scale: 1.5,
            backgroundColor: "#72B01D",
            duration: 0.3
          });

        },


        onLeave: () => {

          gsap.to(node, {
            scale: 1,
            duration: 0.3
          });

        },


        onEnterBack: () => {

          gsap.to(node, {
            scale: 1.5,
            backgroundColor: "#72B01D",
            duration: 0.3
          });

        },


        onLeaveBack: () => {

          gsap.to(node, {
            scale: 1,
            backgroundColor: "#0D0A0B",
            duration: 0.3
          });

        }

      });

    }

  });


  /*
   * ------------------------------------------------------------
   * CINEMATIC CLOSING
   * ------------------------------------------------------------
   *
   * The ending is treated as the conclusion of the story,
   * rather than just another section.
   */

  const closingSection =
    document.querySelector(".history-closing");


  if (closingSection) {

    const closingLabel =
      closingSection.querySelector(".closing-label");

    const closingTitle =
      closingSection.querySelector("h2");

    const closingAccent =
      closingSection.querySelector("h2 span");

    const closingDescription =
      closingSection.querySelector(".closing-description");

    const closingLink =
      closingSection.querySelector(".history-home-link");


    /*
     * Reduced-motion users still get a readable
     * static closing section.
     */

    if (!prefersReducedMotion) {

      /*
       * Prepare the elements.
       */

      gsap.set(closingLabel, {
        opacity: 0,
        y: 20
      });

      gsap.set(closingTitle, {
        opacity: 0,
        y: 60,
        scale: 0.96
      });

      gsap.set(closingAccent, {
        opacity: 0,
        y: 35,
        display: "inline-block"
      });

      gsap.set(closingDescription, {
        opacity: 0,
        y: 25
      });

      gsap.set(closingLink, {
        opacity: 0,
        y: 20
      });


      /*
       * Create the cinematic closing timeline.
       */

      const closingTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: closingSection,

          start: "top 70%",

          end: "center 35%",

          toggleActions:
            "play reverse play reverse"

        }

      });


      /*
       * PRESENT marker
       */

      closingTimeline.to(closingLabel, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      });


      /*
       * Main title.
       */

      closingTimeline.to(closingTitle, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.25");


      /*
       * Green CONTINUES. arrives separately.
       */

      closingTimeline.to(closingAccent, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out"
      }, "-=0.45");


      /*
       * Supporting message.
       */

      closingTimeline.to(closingDescription, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.25");


      /*
       * Return-home action.
       */

      closingTimeline.to(closingLink, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2");


      /*
       * Subtle accent pulse on the final word.
       */

      closingTimeline.to(closingAccent, {
        textShadow:
          "0 0 18px rgba(114, 176, 29, 0.35)",
        duration: 0.7,
        ease: "power2.out"
      }, "-=0.25");

    }

  }


  /*
   * ------------------------------------------------------------
   * REFRESH SCROLLTRIGGER
   * ------------------------------------------------------------
   */

  window.addEventListener("load", () => {

    ScrollTrigger.refresh();

  });

});