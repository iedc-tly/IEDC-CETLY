/**
 * IEDC-CETLY Leads Data & Profile Loader
 * Single source of truth for executive and departmental leads.
 */

const LEADS_DATA = {
  "ceo": {
    "id": "ceo",
    "badge": "01 // EXEC",
    "name": "Savanth S Joy",
    "role": "Chief Executive Officer (CEO)",
    "shortRole": "CEO",
    "photo": "iedclogo.jpeg",
    "about": "Savanth S Joy leads IEDC CETLY with a strategic vision to cultivate an industry-grade innovation ecosystem at College of Engineering Thalassery. As Chief Executive Officer, he oversees overall operations, student startup incubation pipelines, government & KSUM relations, and strategic partnerships with industry leaders.",
    "responsibilities": [
      "Strategic direction & organizational vision",
      "KSUM & Government incubator liaison",
      "Seed funding & student venture acceleration",
      "Cross-departmental leadership & governance"
    ],
    "contact": {
      "email": "ceo@iedc-cetly.org",
      "officialEmail": "savanth@cethalassery.ac.in",
      "phone": "+91 94001 23401",
      "location": "IEDC Incubator Suite, CET Thalassery",
      "linkedin": "https://linkedin.com/in/savanth-s-joy",
      "github": "https://github.com/savanth-joy"
    }
  },
  "coo": {
    "id": "coo",
    "badge": "02 // EXEC",
    "name": "Shanin Raj M",
    "role": "Chief Operating Officer (COO)",
    "shortRole": "COO",
    "photo": "iedclogo.jpeg",
    "about": "Shanin Raj M manages the execution roadmap and operational workflows of IEDC CETLY. Responsible for event logistics, Maker Lab infrastructure, resource allocation, and program scheduling, ensuring seamless delivery of hackathons, workshops, and innovation bootcamps.",
    "responsibilities": [
      "Operational strategy & event execution",
      "Resource & Maker Lab facility management",
      "Inter-departmental workflow coordination",
      "Student engagement & event logistics"
    ],
    "contact": {
      "email": "coo@iedc-cetly.org",
      "officialEmail": "shanin@cethalassery.ac.in",
      "phone": "+91 94001 23402",
      "location": "Operations Desk, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/shanin-raj",
      "github": "https://github.com/shaninraj"
    }
  },
  "tech": {
    "id": "tech",
    "badge": "03 // DEPT",
    "name": "Sreerudran P",
    "role": "Technology Lead",
    "shortRole": "Tech Lead",
    "photo": "iedclogo.jpeg",
    "about": "Sreerudran P heads the technical division at IEDC CETLY. Driving web development, software architecture, technical hackathons like Hackatly, hardware tinkering labs, and mentorship for student technical projects.",
    "responsibilities": [
      "Technical architecture & web platform maintenance",
      "Hackatly Hackathon tech track organization",
      "Open-source & developer workshop coordination",
      "Technical mentorship for student prototypes"
    ],
    "contact": {
      "email": "tech@iedc-cetly.org",
      "officialEmail": "sreerudran@cethalassery.ac.in",
      "phone": "+91 94001 23403",
      "location": "Tech Stack Lab, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/sreerudran-p",
      "github": "https://github.com/sreerudran"
    }
  },
  "marketing": {
    "id": "marketing",
    "badge": "04 // DEPT",
    "name": "Sabarinath R Nambiar",
    "role": "Marketing Lead",
    "shortRole": "Marketing Lead",
    "photo": "iedclogo.jpeg",
    "about": "Sabarinath R Nambiar leads marketing initiatives, brand outreach, and campaign strategy for IEDC CETLY. He drives public relations, sponsor outreach, social media presence, and event promotions across regional and national channels.",
    "responsibilities": [
      "Brand strategy & campaign management",
      "Public relations & sponsorship acquisition",
      "Digital marketing & social media growth",
      "Outreach campaigns for Hackatly and Bootcamps"
    ],
    "contact": {
      "email": "marketing@iedc-cetly.org",
      "officialEmail": "sabarinath@cethalassery.ac.in",
      "phone": "+91 94001 23404",
      "location": "Marketing & Outreach Wing, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/sabarinath-nambiar",
      "github": "https://github.com/sabarinath"
    }
  },
  "finance": {
    "id": "finance",
    "badge": "05 // DEPT",
    "name": "Vaishnav Dev M",
    "role": "Finance Lead",
    "shortRole": "Finance Lead",
    "photo": "iedclogo.jpeg",
    "about": "Vaishnav Dev M manages financial planning, budget allocation, grant disbursement, and seed funding administration at IEDC CETLY. He ensures transparent auditing, financial accountability, and grant applications under KSUM guidelines.",
    "responsibilities": [
      "Financial budgeting & expenditure tracking",
      "KSUM grant application & documentation",
      "Seed support disbursement for student startups",
      "Event budget audits & financial compliance"
    ],
    "contact": {
      "email": "finance@iedc-cetly.org",
      "officialEmail": "vaishnav@cethalassery.ac.in",
      "phone": "+91 94001 23405",
      "location": "Finance & Audit Desk, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/vaishnav-dev",
      "github": "https://github.com/vaishnavdev"
    }
  },
  "design": {
    "id": "design",
    "badge": "06 // DEPT",
    "name": "Nihara",
    "role": "Design Lead",
    "shortRole": "Design Lead",
    "photo": "iedclogo.jpeg",
    "about": "Nihara leads visual design, UI/UX aesthetics, and creative branding across IEDC CETLY web assets, event posters, merchandise, and digital UI design systems.",
    "responsibilities": [
      "UI/UX design & visual identity systems",
      "Event poster design & digital branding",
      "Merchandise & print media design",
      "Design workshops & creative mentorship"
    ],
    "contact": {
      "email": "design@iedc-cetly.org",
      "officialEmail": "nihara@cethalassery.ac.in",
      "phone": "+91 94001 23406",
      "location": "Design Studio, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/nihara-design",
      "github": "https://github.com/nihara"
    }
  },
  "media-1": {
    "id": "media-1",
    "badge": "07 // DEPT",
    "name": "Aman Nambiar",
    "role": "Media Lead",
    "shortRole": "Media Lead",
    "photo": "iedclogo.jpeg",
    "about": "Aman Nambiar coordinates event coverage, videography, photography, and multimedia production for IEDC CETLY events, capturing moments from workshops, hackathons, and speaker sessions.",
    "responsibilities": [
      "Event photography & video production",
      "Media archive & digital asset management",
      "Aftermovie creation for major events",
      "Press releases & media coverage"
    ],
    "contact": {
      "email": "media@iedc-cetly.org",
      "officialEmail": "aman@cethalassery.ac.in",
      "phone": "+91 94001 23407",
      "location": "Media Production Studio, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/aman-nambiar",
      "github": "https://github.com/amannambiar"
    }
  },
  "media-2": {
    "id": "media-2",
    "badge": "08 // DEPT",
    "name": "Sandra N",
    "role": "Media Lead",
    "shortRole": "Media Lead",
    "photo": "iedclogo.jpeg",
    "about": "Sandra N co-leads media strategy, social media video reels, live event broadcasting, and digital media publishing for IEDC CETLY.",
    "responsibilities": [
      "Social media video reels & shorts production",
      "Live streaming & event broadcast management",
      "Content publishing schedules & media campaigns",
      "Student media team supervision"
    ],
    "contact": {
      "email": "media@iedc-cetly.org",
      "officialEmail": "sandra@cethalassery.ac.in",
      "phone": "+91 94001 23408",
      "location": "Media Lab, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/sandra-n",
      "github": "https://github.com/sandran"
    }
  },
  "content": {
    "id": "content",
    "badge": "09 // DEPT",
    "name": "Niveditha Manoharan",
    "role": "Content Lead",
    "shortRole": "Content Lead",
    "photo": "iedclogo.jpeg",
    "about": "Niveditha Manoharan oversees content creation, editorial writing, event descriptions, press releases, newsletters, and official documentation at IEDC CETLY.",
    "responsibilities": [
      "Editorial writing & official announcements",
      "Monthly newsletter publication",
      "Event copy & documentation writing",
      "Proposal & grant report proofreading"
    ],
    "contact": {
      "email": "content@iedc-cetly.org",
      "officialEmail": "niveditha@cethalassery.ac.in",
      "phone": "+91 94001 23409",
      "location": "Editorial Office, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/niveditha-manoharan",
      "github": "https://github.com/niveditha"
    }
  },
  "community": {
    "id": "community",
    "badge": "10 // DEPT",
    "name": "Abhikshitha S S",
    "role": "Community Lead",
    "shortRole": "Community Lead",
    "photo": "iedclogo.jpeg",
    "about": "Abhikshitha S S fosters student involvement, community engagement, departmental networking, and peer mentorship across all batches and engineering departments at CETLY.",
    "responsibilities": [
      "Student community onboarding & engagement",
      "Inter-departmental liaison & student clubs network",
      "Peer learning circles & study groups",
      "Community feedback & member wellness"
    ],
    "contact": {
      "email": "community@iedc-cetly.org",
      "officialEmail": "abhikshitha@cethalassery.ac.in",
      "phone": "+91 94001 23410",
      "location": "Community Hub, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/abhikshitha-ss",
      "github": "https://github.com/abhikshitha"
    }
  },
  "creative": {
    "id": "creative",
    "badge": "11 // DEPT",
    "name": "Abhinav vk",
    "role": "Creative Lead",
    "shortRole": "Creative Lead",
    "photo": "iedclogo.jpeg",
    "about": "Abhinav vk directs creative concepts, event stage setups, theme design, and artistic execution for major flagship programs like Hackatly and Innovation Expos.",
    "responsibilities": [
      "Creative direction & theme conceptualization",
      "Stage & venue setup design for flagship events",
      "Creative storytelling & promotional ideation",
      "Artistic branding assets creation"
    ],
    "contact": {
      "email": "creative@iedc-cetly.org",
      "officialEmail": "abhinav@cethalassery.ac.in",
      "phone": "+91 94001 23411",
      "location": "Creative Lab, IEDC CETLY",
      "linkedin": "https://linkedin.com/in/abhinav-vk",
      "github": "https://github.com/abhinavvk"
    }
  }
};

/**
 * Loads profile information into profile.html based on URL parameter ?id=...
 */
document.addEventListener('DOMContentLoaded', () => {
  const profileContainer = document.getElementById('profile-container');
  const profileNotFound = document.getElementById('profile-not-found');
  
  if (!profileContainer) return; // Not on profile.html page

  const params = new URLSearchParams(window.location.search);
  const leadId = params.get('id') || 'ceo';
  const lead = LEADS_DATA[leadId];

  if (!lead) {
    if (profileContainer) profileContainer.style.display = 'none';
    if (profileNotFound) profileNotFound.style.display = 'block';
    document.title = "Lead Not Found | IEDC-CETLY";
    return;
  }

  // Update page title
  document.title = `${lead.name} (${lead.shortRole}) | IEDC-CETLY Profile`;

  // Inject Lead Details
  document.getElementById('lead-name').textContent = lead.name;
  document.getElementById('lead-role').textContent = lead.role;
  document.getElementById('lead-badge').textContent = lead.badge;
  document.getElementById('lead-about').textContent = lead.about;
  
  // Set Lead Photo
  const photoEl = document.getElementById('lead-photo');
  if (photoEl) {
    photoEl.src = lead.photo;
    photoEl.alt = `${lead.name} Profile Photo`;
  }

  // Inject Initials Badge fallback
  const initialsEl = document.getElementById('lead-initials');
  if (initialsEl) {
    const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();
    initialsEl.textContent = initials;
  }

  // Responsibilities List
  const respListEl = document.getElementById('lead-responsibilities');
  if (respListEl && lead.responsibilities) {
    respListEl.innerHTML = lead.responsibilities.map(r => `<li>${r}</li>`).join('');
  }

  // Contact Details
  document.getElementById('contact-email').textContent = lead.contact.email;
  document.getElementById('contact-email').href = `mailto:${lead.contact.email}`;

  document.getElementById('contact-official-email').textContent = lead.contact.officialEmail;
  document.getElementById('contact-official-email').href = `mailto:${lead.contact.officialEmail}`;

  document.getElementById('contact-phone').textContent = lead.contact.phone;
  document.getElementById('contact-phone').href = `tel:${lead.contact.phone.replace(/\s+/g, '')}`;

  document.getElementById('contact-location').textContent = lead.contact.location;

  const linkedinEl = document.getElementById('contact-linkedin');
  if (linkedinEl) {
    linkedinEl.href = lead.contact.linkedin;
    linkedinEl.textContent = lead.contact.linkedin.replace('https://', '');
  }

  const githubEl = document.getElementById('contact-github');
  if (githubEl) {
    githubEl.href = lead.contact.github;
    githubEl.textContent = lead.contact.github.replace('https://', '');
  }

  // Setup Previous & Next Lead Navigation
  const leadKeys = Object.keys(LEADS_DATA);
  const currentIndex = leadKeys.indexOf(leadId);
  
  const prevIndex = (currentIndex - 1 + leadKeys.length) % leadKeys.length;
  const nextIndex = (currentIndex + 1) % leadKeys.length;

  const prevLead = LEADS_DATA[leadKeys[prevIndex]];
  const nextLead = LEADS_DATA[leadKeys[nextIndex]];

  const prevBtn = document.getElementById('prev-lead-btn');
  const nextBtn = document.getElementById('next-lead-btn');

  if (prevBtn) {
    prevBtn.href = `profile.html?id=${prevLead.id}`;
    prevBtn.innerHTML = `← ${prevLead.shortRole}: ${prevLead.name.split(' ')[0]}`;
  }

  if (nextBtn) {
    nextBtn.href = `profile.html?id=${nextLead.id}`;
    nextBtn.innerHTML = `${nextLead.shortRole}: ${nextLead.name.split(' ')[0]} →`;
  }
});
