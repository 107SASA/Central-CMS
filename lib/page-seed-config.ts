// Shared config used by the "Add Section" dialog AND the "Initialize Pages" seed feature.
// default_value = current live content so marketing sees real text immediately, not blank fields.

const SERVICES_DEFAULT = JSON.stringify([
  { title: "Trade Marks", slug: "trademarks", pain: "Someone may already be using your brand name.", description: "We register and defend your trademark across India and internationally. Our trademark services cover availability searches, application filing, examination response, opposition and appeal proceedings.", features: ["Trademark Search & Clearance", "Application Filing (Classes 1–45)", "Examination Response", "Opposition Proceedings", "International Filing (Madrid Protocol)", "Trademark Renewal"] },
  { title: "Patents", slug: "patents", pain: "A competitor could file your invention before you do.", description: "Protect your invention before a competitor files it. We handle patent applications, prosecution, opposition and enforcement for inventors and businesses across all industries.", features: ["Patent Drafting & Filing", "Prior Art Search", "Examination Response", "PCT International Filing", "Patent Opposition", "Licensing & Assignment"] },
  { title: "Copyright", slug: "copyright", pain: "Your creative work can be copied without registration.", description: "Your creative work is your property. We register and enforce copyright for artists, authors, software companies and businesses across India.", features: ["Copyright Registration", "Infringement Notices", "DMCA & Online Enforcement", "Licensing Agreements", "Software Copyright", "Content Protection"] },
  { title: "IP Litigation", slug: "litigation", pain: "Infringers are counting on you not fighting back.", description: "When someone steals your IP, we fight back. From district courts to the Supreme Court of India, our litigation team has the expertise to protect your rights.", features: ["Injunction Applications", "District & High Court", "Supreme Court Appearances", "IP Infringement Cases", "Passing Off Actions", "Domain Disputes"] },
  { title: "Business Law", slug: "business-law", pain: "Contracts and compliance issues can derail your business.", description: "Company formation, MSME registration, ISO compliance, franchising and startup law — all under one roof. We make the legal side of running a business simple.", features: ["Company Incorporation", "MSME Registration", "Startup Legal Pack", "Franchise Agreements", "ISO Compliance", "Contract Drafting"] },
  { title: "Designs & GI", slug: "designs-gi", pain: "Your product's distinctive look deserves protection.", description: "Your product's look and geographical origin are just as protectable as its name. We handle industrial design registration and Geographical Indication applications.", features: ["Industrial Design Registration", "Design Infringement", "GI Application Filing", "GI Tag Protection", "Product Design Audit", "International Design"] },
], null, 2);

const TEAM_DEFAULT = JSON.stringify([
  { photo: "/shalini-arora.png", badge: "Founder & Director", name: "Adv. Shalini Arora", title: "B.A.LL.B · Intellectual Property Law Specialist", quote: "Every small business deserves the same IP protection that large corporates get. We built VS Arora & Co. to make that possible.", tags: ["Trademarks", "Patents", "Copyright", "15+ Yrs Exp"] },
  { photo: "/vimesh-arora.jpg", badge: "Co-Founder & Managing Partner", name: "Adv. Vimesh Arora", title: "LL.B · Corporate & Litigation Specialist", quote: "In India's fast-growing economy, your brand is your most valuable asset. Protecting it from day one is not optional — it is essential.", tags: ["Litigation", "Business Law", "Corporate Law", "High Court"] },
], null, 2);

// ─── ANSPL-specific defaults ──────────────────────────────────────────────────

const ANSPL_SLIDES_DEFAULT = JSON.stringify([
  { img: "https://anspl.co.in/assets/TMTRollingMills2-CFNQYEss.jpg", badge: "Steel & Rolling Mills", pre: "One Stop Solution", heading: "For Electrical &\nAutomation Projects", body: "Turnkey design, manufacturing and commissioning of electrical & industrial automation systems across India and South Asia.", pill: "Spirit of Innovation — Since 1997" },
  { img: "https://anspl.co.in/assets/ACDrive2-Otp3Yuwc.jpg", badge: "VFD Drive Systems", pre: "Complete Drive Solutions", heading: "0.37kW to 1200kW\nAC & DC Drives", body: "Supply, panel integration and on-site commissioning. Sectional drives for wire drawing, rolling mills and paper plants.", pill: "ABB System House · Authorised Distributor" },
  { img: "https://anspl.co.in/assets/Panel0-D3e2k-is.jpg", badge: "Panel Manufacturing", pre: "6,000 Sq.ft. Factory", heading: "100 Panel Doors\nEvery Month", body: "In-house panel factory at Ramchandrapur with the only automatic busbar bending machine in East India.", pill: "ISO 9001:2015 Certified · East India" },
], null, 2);

const ANSPL_BLOCKS_DEFAULT = JSON.stringify([
  { label: "In-House", title: "Panel Manufacturing", img: "https://anspl.co.in/assets/Panel0-D3e2k-is.jpg", desc: "6,000 sq.ft. Kolkata factory — 100 doors/month. Automatic busbar bending machine (only one in East India).", points: ["33kV / 11kV HT VCB Panels", "LT Busduct & PCC / PDB Panels", "VFD Panels & PLC Panels", "DG Synchronization Panels", "Control Desks & Junction Boxes"] },
  { label: "Drives", title: "VFD & Drive Systems", img: "https://anspl.co.in/assets/ACDrive2-Otp3Yuwc.jpg", desc: "Supply & commissioning from 0.37kW to 1200kW — all industrial motor applications.", points: ["AC VFD (VVVF) drives up to 1200kW", "DC drives for retrofit & new installations", "Sectional drive systems for wire drawing & rolling mills", "Complete motor packages with panel integration", "On-site commissioning & operator training"] },
  { label: "Automation", title: "PLC, SCADA & DCS", img: "https://anspl.co.in/assets/SoftwareSCADA1-DfJZpc-G.jpg", desc: "IIT Delhi & REC-trained engineers — delivered for L&T, Danieli and Tenova.", points: ["PLC-based automation — design to commissioning", "DCS for paper & pulp and process industries", "SCADA software development & energy dashboards", "HMI design and cloud-based data acquisition"] },
  { label: "Consulting & After-Sales", title: "Energy Audit, Consultancy & AMC", img: "https://anspl.co.in/assets/EMS0-DQTTRtlR.png", desc: "Project engineering consulting, energy reports and annual maintenance contracts.", points: ["Energy audit & power utilization reports", "HT & LT system design, SLD, cable scheduling", "Supervision of erection & commissioning", "AMC, AC/DC drive repair & CNC machine servicing"] },
], null, 2);

const ANSPL_PRODUCTS_DEFAULT = JSON.stringify([
  { badge: "Authorised Distributor", title: "VFD Drives (0.37kW – 1200kW)", img: "https://anspl.co.in/assets/ACDrive0-87i251cT.png", desc: "Complete range of Variable Frequency Drives — selection, supply, panel integration and commissioning.", points: ["AC drives (VVVF) and DC drives for all applications", "0.37kW to 1200kW — covers every motor load", "On-site commissioning, parameter setting and training", "After-sales repair, spares and AMC support"] },
  { badge: "System Integrator", title: "PLC & Automation Controllers", img: "https://anspl.co.in/assets/SoftwareSCADA0-j6zzjK_i.jpg", desc: "25+ years PLC integration — hardware selection, programming, commissioning and operator training.", points: ["PLC hardware selection and panel design", "Custom programming for process & sequence control", "Servo controllers for machine tools & SPMs", "DCS packages for continuous process industries"] },
  { badge: "Balluff India — East India SI", title: "Balluff Industrial Sensors", img: "https://anspl.co.in/assets/BalluffSiemens0-DhIy0x2s.jpg", desc: "Authorised SI for Balluff India covering East India, Bangladesh & Nepal — full sensor range.", points: ["Inductive, capacitive and magnetic proximity sensors", "Photoelectric sensors and linear position systems", "RFID for industrial track & trace", "IO-Link smart sensor technology"] },
  { badge: "IPA India SI", title: "IPA Weigh Feeders & Load Cells", img: "https://anspl.co.in/assets/IPA1-CuAJbc8b.jpg", desc: "Authorised SI for IPA India, Bangalore — specialist weighing automation.", points: ["Load cells for industrial weighing & force measurement", "Gravimetric and volumetric weigh feeders", "Belt weighers and conveyor weighing systems", "Complete PLC integration and commissioning"] },
], null, 2);

const ANSPL_PROJECTS_DEFAULT = JSON.stringify([
  { tag: "Electrification", title: "Sand Plant Electrification", client: "L&T", loc: "East India", type: "Turnkey EPC", img: "https://anspl.co.in/assets/SiteErection2-CZuJ0WN6.jpg" },
  { tag: "Wire Drawing", title: "8-Block Wire Drawing Automation", client: "Miki Wire", loc: "West Bengal", type: "Drives + PLC + SCADA", img: "https://anspl.co.in/assets/WireDrawingPlants1-Cx0gL6WJ.jpg" },
  { tag: "Rolling Mill", title: "Danieli Rolling Mill — SCADA & PLC", client: "Danieli Group", loc: "East India", type: "PLC + MCC + SCADA", img: "https://anspl.co.in/assets/TMTRollingMills3-D5h3I46v.jpg" },
  { tag: "Panel Mfg.", title: "PCC Panel — Bengal Tools", client: "Bengal Tools", loc: "Kolkata", type: "Panel Manufacturing", img: "https://anspl.co.in/assets/BoltedPanels0-DoAsP7Dl.jpg" },
  { tag: "Building Auto.", title: "BMS & HVAC Automation", client: "Commercial Developer", loc: "Kolkata", type: "BMS + HVAC + Fire", img: "https://anspl.co.in/assets/BuildingAutomation2-B5qBP5yI.jpg" },
], null, 2);

const ANSPL_INDUSTRIES_DEFAULT = JSON.stringify([
  { n: "01", title: "Rolling Mills", sub: "Flying shear, SCADA, coil lines", img: "https://anspl.co.in/assets/TMTRollingMills2-CFNQYEss.jpg" },
  { n: "02", title: "Paper & Pulp", sub: "DCS, rewinder, PCC/MCC", img: "https://anspl.co.in/assets/PulpPaper2-BZMfCP6t.jpg" },
  { n: "03", title: "Building Automation", sub: "HVAC, BMS, fire panels", img: "https://anspl.co.in/assets/BuildingAutomation0-CIw5a8aZ.jpg" },
  { n: "04", title: "Wire Drawing", sub: "Multi-block drives, PLC", img: "https://anspl.co.in/assets/WireDrawingPlants0-CPzQ96lK.jpg" },
  { n: "05", title: "Steel Processing", sub: "Coil processing, slitters", img: "https://anspl.co.in/assets/CoilProcessingLines2-BSmvAot-.jpg" },
  { n: "06", title: "Machinery & CNC", sub: "Retrofitment, SPM automation", img: "https://anspl.co.in/assets/FurnacesCCM1-38eKbwjF.jpg" },
], null, 2);

const MILESTONES_DEFAULT = JSON.stringify([
  { year: "1997–98", title: "Foundation", desc: "Formed for sales & services of Kirloskar Electric machine tool products." },
  { year: "2004–05", title: "ABB System House", desc: "Appointed ABB System House for drives & automation." },
  { year: "2010–11", title: "Factory Commissioned", desc: "6,000 sq.ft. panel building unit at Ramchandrapur." },
  { year: "2012–13", title: "Siemens Integrator", desc: "Appointed SI for Siemens drives & automation." },
  { year: "2022–24", title: "Balluff India SI", desc: "Authorised SI for East India, Bangladesh & Nepal." },
  { year: "2025–26", title: "IPA India Partner", desc: "SI for load cells, weigh feeders & weighing automation." },
], null, 2);

const CERTIFICATIONS_DEFAULT = JSON.stringify([
  { icon: "🏆", title: "ISO 9001:2015", desc: "Quality Management System for design, manufacturing & commissioning" },
  { icon: "🔬", title: "Balluff India SI", desc: "Authorised SI for East India, Bangladesh & Nepal (2022)" },
  { icon: "⚖️", title: "IPA India SI", desc: "Load cell, weigh feeder & weighing automation partner (2025)" },
  { icon: "⚙️", title: "ABB System House", desc: "Drives & automation system house since 2004" },
], null, 2);

const PARTNERS_DEFAULT = JSON.stringify([
  { name: "ABB", role: "System House — Drives & Automation" },
  { name: "Siemens", role: "System Integrator — Drives (2012–13)" },
  { name: "Balluff India", role: "Authorised SI — East India, BD & Nepal" },
  { name: "IPA India", role: "SI — Load Cells & Weigh Feeders" },
  { name: "Bosch Rexroth", role: "SI — Servo Motors & Controllers" },
  { name: "Rittal", role: "Collaboration — PMCC & PLC Panels" },
], null, 2);

const OFFICES_DEFAULT = JSON.stringify([
  { title: "Head Office & Works", lines: ["Ramchandrapur, Narendrapur", "P.S. Sonarpur, Kolkata – 700 103", "West Bengal, India"], map: "https://maps.google.com/?q=Ramchandrapur+Narendrapur+Kolkata" },
  { title: "Marketing Office", lines: ["3rd Floor, 44A, Shyama Pally", "Jadavpur, Kolkata – 700 032", "West Bengal, India"], map: "https://maps.google.com/?q=44A+Shyama+Pally+Jadavpur+Kolkata" },
  { title: "Patna Office", lines: ["Omsai Villa, #302, 3rd Floor", "Kankarbagh, Patna – 800 020", "Bihar, India"], map: null },
  { title: "Dhaka Office", lines: ["Mr. Alok Kumar — +880 1933 168401", "College Gate, Tongi, Dhaka", "Bangladesh"], map: null },
], null, 2);

const ANSPL_TEAM_DEFAULT = JSON.stringify([
  { init: "RS", name: "Raj Kumar Srivastava", role: "Software & Engineering Head", edu: "M.Tech IIT Delhi · B.E. REC Durgapur", exp: "Ex-Tata Motors Jamshedpur (1984–97)" },
  { init: "KK", name: "Kiran Kumar Kasaragod", role: "Marketing, Production & Accounts", edu: "B.E. SJCE Mysore", exp: "Ex-Kirloskar Electric (1991–97)" },
  { init: "TG", name: "Tapan Ghosh", role: "Software Dev & Project Execution", edu: "Diploma — Electrical & Electronics", exp: "ANSPL since 2010" },
  { init: "SN", name: "Subhadeep Nej", role: "Design, Engineering & Drawings", edu: "Diploma — Electrical & Electronics", exp: "ANSPL since 2014" },
], null, 2);

const STAFF_DEFAULT = JSON.stringify([
  { name: "Dr. Priti Tayade",      title: "Patent Attorney",                  role: "Senior Associate" },
  { name: "Mr. Abhilash Shukla",   title: "Advocate & Trademark Attorney",    role: "Senior Associate" },
  { name: "Mr. Soumya Palo",       title: "Advocate & Trademark Attorney",    role: "Senior Associate" },
  { name: "Mr. G. Ramji",          title: "Advocate & Trademark Attorney",    role: "Senior Associate" },
  { name: "Mr. Kapil Jain",        title: "Advocate & Trademark Attorney",    role: "Senior Associate" },
  { name: "Mr. Jay D. Shah",       title: "Advocate & Trademark Attorney",    role: "Associate" },
  { name: "Mr. Pankaj Kedia",      title: "CA, Advocate & Trademark Attorney",role: "Associate" },
  { name: "Mr. Arkadyuti Sarkar",  title: "Advocate & Trademark Attorney",    role: "Associate" },
  { name: "Mr. J. Patel",          title: "Paralegal",                        role: "Paralegal" },
  { name: "Mrs. S. Sarkar",        title: "Paralegal",                        role: "Paralegal" },
], null, 2);

const TESTIMONIALS_DEFAULT = JSON.stringify([
  { name: "Usha Sharma", business: "Usha's Frosting Cakes", location: "Kolkata", service: "Trademark", quote: "I launched my bakery brand and VS Arora filed my trademark within days. When a competitor tried to copy my name, we had full legal protection to fight back.", initial: "U", rating: 5 },
  { name: "Naacho Kids", business: "Children's Brand", location: "West Bengal", service: "Trademark", quote: "Filing trademarks for our kids brand was surprisingly easy with VS Arora & Co. The whole procedure went smoothly and I can now rest knowing our brand is safe and protected.", initial: "N", rating: 5 },
  { name: "Rohit Agarwal", business: "Tech Startup Founder", location: "Kolkata", service: "Business Law", quote: "Adv. Vimesh guided us through the entire company registration and IP filing process. Professional, prompt, and always available to explain what was happening.", initial: "R", rating: 5 },
  { name: "Priya Mehta", business: "Fashion Label", location: "Mumbai", service: "Trademark", quote: "We approached VS Arora & Co. for international trademark filing. They handled the Madrid Protocol application seamlessly. The team is knowledgeable and truly client-first.", initial: "P", rating: 5 },
  { name: "Sandeep Joshi", business: "Software Startup", location: "Bangalore", service: "Copyright", quote: "Our software copyright registration was handled efficiently and on time. VS Arora & Co. explained every step clearly — I always knew exactly where things stood.", initial: "S", rating: 5 },
  { name: "Amit Bose", business: "Manufacturing Co.", location: "Kolkata", service: "Patent", quote: "We had a unique industrial design we needed to protect quickly. The team filed our design application promptly and got us the protection we needed before our product launch.", initial: "A", rating: 5 },
], null, 2);

export type FieldDef = {
  key: string;
  label: string;
  type: string;
  default_value?: string;
};

export const DEFAULT_FIELDS: Record<string, FieldDef[]> = {
  hero: [
    { key: "headline",         label: "Headline",          type: "text",     default_value: "Your Brand Is Worth Protecting. We Make Sure It Is." },
    { key: "subheadline",      label: "Subheadline",       type: "textarea", default_value: "VS Arora & Co. helps entrepreneurs, startups and businesses across India register and defend their trademarks, patents, and copyrights — before someone else takes what's rightfully yours." },
    { key: "cta_text",         label: "CTA Button Text",   type: "text",     default_value: "Book Free Consultation" },
    { key: "cta_url",          label: "CTA Button URL",    type: "url",      default_value: "/contact" },
    { key: "background_image", label: "Background Image",  type: "image" },
  ],
  about: [
    { key: "title",            label: "Section Heading",                    type: "text",     default_value: "IP Protection Should Not Be a Privilege" },
    { key: "content",          label: "Body Text",                          type: "richtext", default_value: "<p>VS Arora &amp; Co. was founded on the belief that every entrepreneur and small business deserves world-class intellectual property protection — not just large corporations with deep pockets.</p><p>Since our founding, we have helped hundreds of businesses across India register and defend their trademarks, patents, and copyrights. We operate with full transparency: no hidden fees, no legal jargon, and no obligation consultations.</p>" },
    { key: "credentials_json", label: "Credentials List (JSON array)",      type: "textarea", default_value: JSON.stringify(["Bar Council of India", "PAN India Filing Network", "Madrid Protocol Registered", "SAARC Regional Network", "IPAB Registered Practitioners", "High Court Appearances"], null, 2) },
    { key: "image",            label: "Image",                              type: "image" },
  ],
  services: [
    { key: "title",         label: "Section Title",      type: "text",     default_value: "Our Practice Areas" },
    { key: "subtitle",      label: "Subtitle",           type: "textarea", default_value: "Comprehensive IP protection — from registration to enforcement." },
    { key: "services_json", label: "Services (JSON)",    type: "textarea", default_value: SERVICES_DEFAULT },
  ],
  team: [
    { key: "title",     label: "Section Title",          type: "text",     default_value: "Meet the People Behind VS Arora & Co." },
    { key: "team_json", label: "Team Members (JSON)",    type: "textarea", default_value: TEAM_DEFAULT },
  ],
  staff: [
    { key: "title",       label: "Section Title",        type: "text",     default_value: "Associates & Legal Professionals" },
    { key: "description", label: "Description",          type: "textarea", default_value: "Our team of experienced advocates, patent attorneys, trademark specialists and paralegals work together to deliver comprehensive IP protection for every client." },
    { key: "staff_json",  label: "Staff Members (JSON)", type: "textarea", default_value: STAFF_DEFAULT },
  ],
  testimonials: [
    { key: "title",               label: "Section Title",       type: "text",     default_value: "What Our Clients Say" },
    { key: "testimonials_json",   label: "Testimonials (JSON)", type: "textarea", default_value: TESTIMONIALS_DEFAULT },
  ],
  stats: [
    { key: "s1_num",   label: "Stat 1 — Number", type: "text", default_value: "500+" },
    { key: "s1_label", label: "Stat 1 — Label",  type: "text", default_value: "Trademarks Filed" },
    { key: "s2_num",   label: "Stat 2 — Number", type: "text", default_value: "15+" },
    { key: "s2_label", label: "Stat 2 — Label",  type: "text", default_value: "Years Experience" },
    { key: "s3_num",   label: "Stat 3 — Number", type: "text", default_value: "8+" },
    { key: "s3_label", label: "Stat 3 — Label",  type: "text", default_value: "Countries Covered" },
    { key: "s4_num",   label: "Stat 4 — Number", type: "text", default_value: "100%" },
    { key: "s4_label", label: "Stat 4 — Label",  type: "text", default_value: "Free First Consult" },
  ],
  cta: [
    { key: "headline",    label: "Headline",     type: "text",     default_value: "Is Your Brand Protected? Let's Find Out — Free." },
    { key: "description", label: "Description",  type: "textarea", default_value: "No obligation. No legal jargon. Just a clear conversation about protecting what you've built." },
    { key: "button_text", label: "Button Text",  type: "text",     default_value: "Book Free Consultation" },
    { key: "button_url",  label: "Button URL",   type: "url",      default_value: "/contact" },
  ],
  contact: [
    { key: "title",   label: "Title",   type: "text",     default_value: "Contact Us" },
    { key: "email",   label: "Email",   type: "text",     default_value: "trademarks@vsarora.com" },
    { key: "phone",   label: "Phone",   type: "text",     default_value: "+91 9123650220" },
    { key: "address", label: "Address", type: "textarea", default_value: "43/C Sri Gopal Mullick Lane, Kolkata – 700012, West Bengal, India" },
  ],
  footer: [
    { key: "copyright",  label: "Copyright Text",     type: "text" },
    { key: "links_json", label: "Footer Links (JSON)", type: "textarea" },
  ],
  gallery: [
    { key: "title",       label: "Title",          type: "text" },
    { key: "images_json", label: "Images (JSON)",  type: "textarea" },
  ],
  faq: [
    { key: "title",     label: "Title",       type: "text" },
    { key: "faqs_json", label: "FAQs (JSON)", type: "textarea" },
  ],
  custom: [
    { key: "title",   label: "Title",   type: "text" },
    { key: "content", label: "Content", type: "richtext" },
  ],
  // ── ANSPL-specific section types ────────────────────────────────────────────
  slides: [
    { key: "slides_json", label: "Hero Slides (JSON)", type: "textarea", default_value: ANSPL_SLIDES_DEFAULT },
  ],
  blocks: [
    { key: "title",      label: "Section Title",        type: "text",     default_value: "Our Services" },
    { key: "blocks_json", label: "Service Blocks (JSON)", type: "textarea", default_value: ANSPL_BLOCKS_DEFAULT },
  ],
  products: [
    { key: "title",        label: "Section Title",    type: "text",     default_value: "Products We Offer" },
    { key: "products_json", label: "Products (JSON)",  type: "textarea", default_value: ANSPL_PRODUCTS_DEFAULT },
  ],
  projects_list: [
    { key: "title",        label: "Section Title",    type: "text",     default_value: "Project Portfolio" },
    { key: "projects_json", label: "Projects (JSON)",  type: "textarea", default_value: ANSPL_PROJECTS_DEFAULT },
  ],
  industries_list: [
    { key: "title",           label: "Section Title",      type: "text",     default_value: "Industries We Serve" },
    { key: "industries_json",  label: "Industries (JSON)",   type: "textarea", default_value: ANSPL_INDUSTRIES_DEFAULT },
  ],
  milestones: [
    { key: "title",           label: "Section Title",      type: "text",     default_value: "Our Journey" },
    { key: "milestones_json",  label: "Milestones (JSON)",   type: "textarea", default_value: MILESTONES_DEFAULT },
  ],
  certifications: [
    { key: "title",      label: "Section Title",           type: "text",     default_value: "Certifications & Partnerships" },
    { key: "certs_json",  label: "Certifications (JSON)",   type: "textarea", default_value: CERTIFICATIONS_DEFAULT },
  ],
  partners: [
    { key: "title",         label: "Section Title",       type: "text",     default_value: "Technology Partners" },
    { key: "partners_json",  label: "Partners (JSON)",     type: "textarea", default_value: PARTNERS_DEFAULT },
  ],
  offices: [
    { key: "phone_1",        label: "Phone 1",              type: "text",     default_value: "+91 98305 05000" },
    { key: "phone_2",        label: "Phone 2",              type: "text",     default_value: "+91 93395 05012" },
    { key: "email_primary",  label: "Primary Email",        type: "text",     default_value: "kiran@automationnetwork.net" },
    { key: "email_support",  label: "Support Email",        type: "text",     default_value: "msupport@automationnetwork.net" },
    { key: "offices_json",   label: "Office Locations (JSON)", type: "textarea", default_value: OFFICES_DEFAULT },
  ],
  anspl_team: [
    { key: "title",           label: "Section Title",       type: "text",     default_value: "Our Team" },
    { key: "anspl_team_json", label: "Team Members (JSON)", type: "textarea", default_value: ANSPL_TEAM_DEFAULT },
  ],
};

// Standard pages for ANSPL website — used by "Initialize Pages" when websiteSlug = "anspl"
export const ANSPL_STANDARD_PAGES = [
  {
    title: "Home", slug: "home",
    sections: [
      { type: "slides",         label: "Hero Slider" },
      { type: "stats",          label: "Stats Strip" },
      { type: "blocks",         label: "Services" },
      { type: "industries_list",label: "Industries" },
      { type: "testimonials",   label: "Testimonials" },
      { type: "partners",       label: "Technology Partners" },
      { type: "cta",            label: "CTA Banner" },
    ],
  },
  {
    title: "About Us", slug: "about",
    sections: [
      { type: "hero",          label: "Hero" },
      { type: "about",         label: "Our Story" },
      { type: "stats",         label: "Stats" },
      { type: "milestones",    label: "Milestones" },
      { type: "anspl_team",    label: "Team" },
      { type: "certifications",label: "Certifications" },
      { type: "cta",           label: "CTA" },
    ],
  },
  {
    title: "Services", slug: "services",
    sections: [
      { type: "hero",   label: "Hero" },
      { type: "blocks", label: "Service Blocks" },
      { type: "cta",    label: "CTA" },
    ],
  },
  {
    title: "Products", slug: "products",
    sections: [
      { type: "hero",     label: "Hero" },
      { type: "products", label: "Products" },
      { type: "cta",      label: "CTA" },
    ],
  },
  {
    title: "Projects", slug: "projects",
    sections: [
      { type: "hero",          label: "Hero" },
      { type: "projects_list", label: "Projects" },
      { type: "cta",           label: "CTA" },
    ],
  },
  {
    title: "Contact", slug: "contact",
    sections: [
      { type: "hero",    label: "Hero" },
      { type: "offices", label: "Offices & Contact" },
    ],
  },
];

// Standard pages created by the "Initialize Pages" button.
// Each page gets its sections and fields pre-filled with the default values above.
export const STANDARD_PAGES = [
  {
    title: "Home",
    slug: "home",
    sections: [
      { type: "hero",  label: "Hero" },
      { type: "stats", label: "Stats Strip" },
      { type: "cta",   label: "CTA Banner" },
    ],
  },
  {
    title: "About Us",
    slug: "about",
    sections: [
      { type: "hero",         label: "Hero" },
      { type: "about",        label: "Mission" },
      { type: "stats",        label: "Stats" },
      { type: "team",         label: "Team" },
      { type: "staff",        label: "Staff" },
      { type: "cta",          label: "CTA" },
    ],
  },
  {
    title: "Practice Areas",
    slug: "services",
    sections: [
      { type: "hero",     label: "Hero" },
      { type: "services", label: "Services" },
    ],
  },
  {
    title: "Testimonials",
    slug: "testimonials",
    sections: [
      { type: "hero",         label: "Hero" },
      { type: "testimonials", label: "Testimonials" },
      { type: "cta",          label: "CTA" },
    ],
  },
  {
    title: "Contact",
    slug: "contact",
    sections: [
      { type: "hero",    label: "Hero" },
      { type: "contact", label: "Contact Info" },
    ],
  },
];
