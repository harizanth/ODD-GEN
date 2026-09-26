# sections_intro_lit.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import set_cell_border, set_cell_shading

def add_p(doc, text, space_after=6, bold=False, italic=False, size=14, align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.line_spacing = line_spacing
    p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    return p

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(16)
    r.font.bold = True
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(14)
    r.font.bold = True
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.italic = True
    return p

def add_image_figure(doc, img_path, fig_num, caption):
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(12)
    p_img.paragraph_format.space_after = Pt(6)
    r = p_img.add_run()
    r.add_picture(img_path, width=Inches(5.6))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(12)
    r_cap = p_cap.add_run(f"Figure {fig_num} : {caption}")
    r_cap.font.name = "Times New Roman"
    r_cap.font.size = Pt(11)
    r_cap.font.bold = True

def add_chapter_1(doc):
    add_heading_1(doc, "CHAPTER 1\nINTRODUCTION")
    
    add_heading_2(doc, "1.1 General Overview of Enterprise Resource Planning")
    add_p(doc, "In the contemporary globalized economy, commercial enterprises operate within increasingly dynamic, highly competitive, and technology-dependent market environments. Whether small-scale enterprises, mid-market businesses, or multinational conglomerates, modern organizations are mandated to coordinate intricate operations across numerous functional domains. These operations encompass lead generation and customer relationship management (CRM), quotation generation, sales order fulfillment, point of sale retail transactions, procurement logistics, warehouse inventory balancing, manufacturing resource planning (MRP), recurring billing, field service operations, and strict financial accounting. Traditionally, organizations approached these diverse business capabilities through fragmented, independent software tools, each addressing a specialized operational requirement.")
    
    add_p(doc, "However, managing business processes across disconnected software ecosystems has generated severe operational friction. Isolated applications inevitably produce data silos—disjointed repositories of enterprise information where customer records in a CRM fail to synchronize with sales invoices, retail cashier terminals operate unaware of real-time warehouse inventory levels, and shop-floor manufacturing schedules remain disconnected from inbound supplier deliveries. Consequently, corporate administrative staff spend excessive hours manually transcribing data across disparate web portals, updating redundant spreadsheets, and reconciling conflicting balance sheets. This manual friction not only escalates operational expenditure and labor overhead but also introduces substantial human calculation errors, stock discrepancies, and customer dissatisfaction.")
    
    add_p(doc, "To decisively solve these systemic inefficiencies, Enterprise Resource Planning (ERP) frameworks were conceived to serve as centralized, unified software backbones. An ERP system consolidates cross-departmental operations into a synchronized, single-pane-of-glass architecture powered by a single relational database engine. By standardizing business data models around central entities—most notably a unified partner repository (res.partner) and real-time inventory ledger—an integrated ERP system guarantees that every commercial transaction instantly propagates across all dependent operational workflows.")

    add_heading_2(doc, "1.2 The Evolution of Enterprise Management Platforms")
    add_p(doc, "The conceptual and technological trajectory of enterprise computing has undergone radical transformations across five decades. In the 1970s, Material Requirements Planning (MRP I) originated on corporate mainframes, focusing primarily on raw material schedules and bill-of-materials calculations. During the 1980s, this paradigm expanded into Manufacturing Resource Planning (MRP II), integrating capacity planning, shop-floor dispatching, and equipment scheduling. By the 1990s, the term Enterprise Resource Planning (ERP) was codified to represent software suites that bridged manufacturing with core back-office functions such as corporate accounting, human resources, and vendor procurement.")

    # Table 1.1: Historical Evolution
    add_p(doc, "Table 1.1 delineates the technological evolution, underlying computational architectures, and characteristics of enterprise software from mainframe systems to modern intelligent cloud suites.", space_after=4)
    t = doc.add_table(rows=5, cols=4)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdrs = ["Era / Generation", "Core Architecture", "Primary Capabilities", "Key Limitations"]
    for j, h in enumerate(hdrs):
        c = t.rows[0].cells[j]
        c.paragraphs[0].add_run(h).font.bold = True
        set_cell_shading(c, "F3E5F5")
    
    data = [
        ("1970s: MRP I", "Mainframe Batch Systems", "Inventory calculations, Bill of Materials", "Rigid, non-interactive, no financial linkage"),
        ("1980s: MRP II", "Minicomputers / UNIX", "Shop floor control, master scheduling", "Isolated to manufacturing, siloed accounting"),
        ("1990s-2000s: ERP I", "Client-Server (C/S), On-Premises", "Integrated HR, accounting, sales, procurement", "Massive capital expenditure, brittle customization"),
        ("2020s: Modern Web ERP", "Cloud-Native SPA, RESTful APIs, AI", "Real-time sync, 20+ modular apps, AI Copilot", "Requires robust full-stack architecture (ODD GEN)")
    ]
    for i, row_data in enumerate(data):
        row = t.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.paragraphs[0].add_run(val).font.name = "Times New Roman"
            c.paragraphs[0].runs[0].font.size = Pt(10.5)
            
    p_tab_cap = doc.add_paragraph()
    p_tab_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tab_cap.paragraph_format.space_before = Pt(4)
    p_tab_cap.paragraph_format.space_after = Pt(10)
    r_tc = p_tab_cap.add_run("Table 1.1 : Enterprise Software Evolution and Structural Milestones")
    r_tc.font.bold = True
    r_tc.font.size = Pt(11)

    add_heading_2(doc, "1.3 Current Challenges: Software Fragmentation and Data Silos")
    add_p(doc, "Despite decades of ERP evolution, traditional enterprise platforms remain notorious for excessive implementation complexity, exorbitant licensing fees, archaic user interfaces, and vendor lock-in. As a result, modern small-to-medium enterprises (SMEs) frequently avoid legacy monolithic solutions like SAP or Oracle, choosing instead to assemble a patchwork of specialized Software-as-a-Service (SaaS) point solutions. An organization might utilize HubSpot for CRM, Shopify for retail eCommerce, Square for in-store point of sale, QuickBooks for bookkeeping, Monday.com for project tracking, and Excel workbooks for manufacturing BOMs.")

    add_p(doc, "This patchwork strategy creates disastrous architectural fragmentation. As demonstrated in Figure 3.1, data must be continuously synchronized across dozens of third-party APIs or transferred manually by office personnel. The inherent delays cause stockout anomalies, where an item sold online remains marked available in the physical retail store, prompting failed customer fulfillment. Furthermore, leadership lacks real-time executive visibility; compiling an accurate monthly balance sheet or profit-and-loss statement requires days of manual data aggregation across multiple disconnected accounting portals.")

    add_image_figure(doc, "report_assets/fig_3_1_existing_ecosystem.png", "3.1", "Fragmented Legacy Business Systems & Data Silos")

    add_heading_2(doc, "1.4 The ODD GEN Architectural Vision and Solution")
    add_p(doc, "To bridge these critical operational gaps, this project presents ODD GEN—an authentic, full-stack, modular Enterprise Resource Planning and business automation suite. Inspired by the best-in-class UI/UX paradigms of Odoo Enterprise, ODD GEN delivers a single-pane-of-glass workspace where over twenty mission-critical business modules operate over a unified relational data core. ODD GEN is designed from the ground up utilizing high-performance, open-source modern web technologies, establishing a zero-friction, scalable platform accessible directly through any contemporary web browser without client-side installation overhead.")

    add_p(doc, "The ODD GEN suite bridges front-office sales, retail checkout, supply chain logistics, shop-floor manufacturing, financial billing, human resource governance, and executive analytics. By leveraging a single central database model and bidirectional state propagation, an order confirmed in the CRM instantly reserves inventory stock, alerts the manufacturing workstation if production is required, generates a cryptographically stamped digital invoice, and updates real-time corporate revenue analytics on the executive dashboard.")

    add_heading_2(doc, "1.5 Project Objectives and Modular Scope")
    add_p(doc, "The primary objectives of the ODD GEN project are rigorously formulated as follows:")
    add_p(doc, "1. Architectural Unification: Engineer a modular, full-stack enterprise platform consolidating 20+ specialized business tools (CRM, Sales, POS, Inventory, MRP, Invoicing, Subscriptions, Sign, Discuss, Field Service, HR, etc.) under a unified relational database schema centered on a universal partner entity (res.partner).")
    add_p(doc, "2. High-Performance Front-End Ergonomics: Develop a lightning-fast Single Page Application (SPA) utilizing React 18, Vite, and Tailwind CSS that matches authentic enterprise aesthetics (authentic plum #714B67 and teal #017E84 color palette, dynamic Kanban boards, 9-dot launcher, and touch-optimized Point of Sale cashier screens).")
    add_p(doc, "3. Real-Time Transactional Integrity: Implement a high-throughput Node.js and Express RESTful API layer coupled with Prisma Object-Relational Mapping (ORM) to ensure atomic database transactions, strict referential integrity, and automated stock deductions across complex multi-step order-to-cash workflows.")
    add_p(doc, "4. Integrated Business Intelligence & AI Copilot: Embed an intelligent conversational assistant and visual telemetry dashboard capable of synthesizing raw transactional data into instantaneous executive summaries, inventory reorder recommendations, and revenue projections.")
    add_p(doc, "5. Paperless Digital Operations: Deliver interactive HTML5 cryptographic signature capabilities (e-Sign) and live collaborative team communication channels (Discuss) to eliminate paper work-orders and disjointed external messaging apps.")

    add_heading_2(doc, "1.6 Organization of the Project Report")
    add_p(doc, "This project report is systematically structured into seven comprehensive chapters: Chapter 1 introduces the project background, enterprise software evolution, problem context, and ODD GEN objectives. Chapter 2 conducts an extensive literature survey examining academic literature and industry frameworks in web architecture, ERP design, database normalization, and human-computer ergonomics. Chapter 3 articulates the complete Stanford Design Thinking process comprising Empathy, Define, Ideate, and Prototype stages with comprehensive UI and architectural breakdowns. Chapter 4 provides a rigorous testing and maintenance methodology detailing unit, functional, integration, UI, security, and load testing alongside maintenance lifecycles and technology comparisons. Chapter 5 evaluates the empirical results, benchmarking metrics, latency profiling, and user satisfaction outcomes. Chapter 6 concludes the report and presents a future technological roadmap. Chapter 7 houses comprehensive annexures containing code excerpts with line-by-line analyses, academic references, and a research publication draft.")

    doc.add_page_break()

def add_chapter_2(doc):
    add_heading_1(doc, "CHAPTER 2\nLITERATURE SURVEY")
    
    add_heading_2(doc, "2.1 Theoretical Foundations of Enterprise Management Systems")
    add_p(doc, "The academic study of Enterprise Resource Planning architectures has expanded substantially over the past two decades. Seminal research by Davenport (1998) and Al-Mashari et al. (2003) established that the true business value of an enterprise system originates not merely from automating isolated clerical tasks, but from institutionalizing cross-functional integration across organizational boundaries. When information flows frictionlessly between marketing, sales, manufacturing, and accounting, the organization achieves dramatic reductions in lead times and administrative overhead.")
    
    add_p(doc, "Subsequent investigations by Kumar and van Hillegersberg (2000) evaluated the technological shifts from proprietary mainframe architectures toward componentized, service-oriented enterprise platforms. They emphasized that enterprise applications must balance comprehensive out-of-the-box standardization with dynamic customizability. Rigid systems that resist adaptation force employees to develop shadow IT solutions (e.g. rogue spreadsheets), completely undermining centralized data governance. ODD GEN directly builds upon these theoretical foundations by combining a standardized relational core with flexible no-code schema extenders (Studio).")

    add_heading_2(doc, "2.2 Microservices vs Modular Monolith Architectures in Web ERP")
    add_p(doc, "In modern software engineering, the architectural debate between distributed microservices and modular monoliths is especially pertinent to ERP systems. Research by Newman (2021) and Fowler (2015) underscores that while microservices offer independent deployment cycles and horizontal scalability for massive hyperscale platforms, they introduce severe architectural complexities. These include distributed transaction management (two-phase commit overhead), eventual consistency latency, network serialization penalties, and immense operational maintenance burdens.")
    
    add_p(doc, "Conversely, Blinowski et al. (2022) demonstrated through comprehensive empirical benchmarking that for small to mid-sized enterprise suites requiring atomic ACID guarantees across interconnected tables (such as simultaneous stock deduction upon sales confirmation), a well-structured modular monolith or cohesive single-tier backend consistently outperforms microservices in throughput, latency, and transactional reliability. ODD GEN adopts this high-performance modular design pattern: business domains are strictly separated into discrete controller-service modules within Express and Prisma while sharing a unified relational execution context, guaranteeing immediate consistency without network hops.")

    add_heading_2(doc, "2.3 Relational Modeling & Schema Abstractions with Modern ORMs")
    add_p(doc, "Relational database normalization, founded upon Codd's relational algebra (1970), remains the gold standard for financial and transactional integrity. However, the historic 'Object-Relational Impedance Mismatch' between object-oriented JavaScript runtimes and SQL database engines has long posed architectural challenges. Traditional Object-Relational Mappers (ORMs) such as Hibernate or Sequelize have faced criticism for heavy memory overhead, inefficient 'N+1' query antipatterns, and opaque query generation.")
    
    add_p(doc, "Recent scholarship by Bierman et al. (2014) on type systems and declarative data modeling validates the emergence of schema-first ORMs such as Prisma. By defining data models in a declarative schema DSL (schema.prisma) and auto-generating type-safe query clients, Prisma eliminates runtime type errors, guarantees precise SQL joins, and delivers compile-time validation. ODD GEN implements Prisma as its core persistence engine, ensuring that relational connections between users, commercial partners, sales lines, stock moves, and invoices are statically guaranteed and executed with optimal database efficiency.")

    add_heading_2(doc, "2.4 Human-Computer Interaction in Touch-Based Point of Sale Interfaces")
    add_p(doc, "Human-Computer Interaction (HCI) in commercial retail and cashier environments has been extensively investigated by Shneiderman et al. (2016) and Norman (2013). Cashier terminals represent high-pressure transactional environments where cognitive load, visual fatigue, and motor input latency directly dictate customer queue lengths and store throughput. The research establishes that effective POS interfaces must minimize visual clutter, provide prominent touch targets (minimum 48x48 pixels per Fitts's Law), deliver immediate visual feedback upon item selection, and eliminate modal confirmation dialogs during rapid barcode scanning.")
    
    add_p(doc, "Furthermore, Nielsen's usability heuristics (1994) highlight the vital importance of real-time state visibility and error prevention in cashier workflows. ODD GEN's Point of Sale terminal strictly incorporates these HCI principles: featuring category quick-filters, instant reactive cart recalculation, numeric keypad tender shortcuts, and seamless split-tender cash/card validation.")

    add_heading_2(doc, "2.5 MRP II Principles and Automated Bill of Materials Tracking")
    add_p(doc, "Manufacturing Resource Planning (MRP II) principles, established by Wight (1984) and expanded by Vollmann et al. (2005), govern modern discrete manufacturing operations. A fundamental challenge in shop-floor execution is coordinating multi-level Bills of Materials (BOM) with dynamic inventory availability. When a production work order is scheduled, the system must perform automated component allocation, verifying whether raw materials are physically present or require procurement purchase orders.")
    
    add_p(doc, "Research by Hopp and Spearman (2011) on factory physics demonstrates that visibility into work-in-progress (WIP) stages dramatically reduces manufacturing lead times and WIP holding costs. ODD GEN embeds an interactive Kanban-driven MRP module that tracks production orders across four sequential operational stages: Draft, Confirmed, In Progress, and Done, automatically consuming raw components and replenishing finished goods inventory upon production completion.")

    add_heading_2(doc, "2.6 Artificial Intelligence & Conversational Copilots in ERP Analytics")
    add_p(doc, "The integration of Artificial Intelligence and Large Language Models (LLMs) into business intelligence systems has transformed enterprise decision support. Research by Davenport and Ronanki (2018) and Vaswani et al. (2017) illustrates that traditional executive dashboards, while visually informative, place heavy cognitive demands on managers to manually identify anomalies, calculate trends, and determine corrective interventions.")
    
    add_p(doc, "Conversational AI copilots bridge this analytical gap by enabling natural language querying over relational business databases. By translating natural human queries (such as 'Identify all overdue vendor invoices' or 'Which products are below safety reorder levels?') into structured semantic searches and summarizing operational telemetry, AI copilots democratize data access across all organizational tiers. ODD GEN's built-in AI Copilot leverages structured rule-based and LLM-ready heuristics to deliver instant managerial insights directly within the enterprise suite.")

    add_heading_2(doc, "2.7 Enterprise Security: Role-Based Access Control and Cryptography")
    add_p(doc, "Information security in multi-user enterprise platforms is paramount. Sandhu et al. (1996) formulated the standard Role-Based Access Control (RBAC) model, establishing that system permissions must be granted to roles rather than individual user accounts to prevent privilege creep and administrative overhead. In modern cloud applications, RFC 7519 standardizes JSON Web Tokens (JWT) as a compact, self-contained mechanism for securely transmitting authenticated identity claims between client SPAs and stateless REST backends.")
    
    add_p(doc, "Additionally, digital workflow integrity necessitates non-repudiation and cryptographic validation, as outlined in NIST SP 800-57 guidelines. Paper-based signatures are notoriously vulnerable to forgery and physical loss. ODD GEN implements stateless JWT authentication with encrypted password hashing (bcrypt), granular role authorization (Admin, Manager, User), and an interactive HTML5 canvas digital signature module that generates cryptographic SHA-256 validation timestamps.")

    add_heading_2(doc, "2.8 Comparative Study of Industry Solutions and Research Gaps")
    add_p(doc, "To contextualize ODD GEN within the broader enterprise software marketplace, Table 2.1 provides a detailed comparative matrix benchmarking industry platforms against ODD GEN across key technical and operational parameters.")

    # Table 2.1: Comparison
    t_comp = doc.add_table(rows=5, cols=5)
    t_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdrs2 = ["Feature / Dimension", "SAP S/4HANA", "Oracle NetSuite", "Odoo Community", "ODD GEN (Our Suite)"]
    for j, h in enumerate(hdrs2):
        c = t_comp.rows[0].cells[j]
        c.paragraphs[0].add_run(h).font.bold = True
        set_cell_shading(c, "F3E5F5")
    
    comp_data = [
        ("Architecture", "Proprietary ABAP/C++", "Java / Cloud Monolith", "Python / Web Framework", "React 18 + Node.js + Prisma"),
        ("Deployment Complexity", "Extremely High (Years)", "High (Months)", "Moderate (Python/PgSQL)", "Zero-Friction (Vite + Web Browser)"),
        ("Cost / Licensing", "Millions USD / Annum", "Tens of Thousands USD", "Tiered Open Core / Paid Apps", "Open Academic & Enterprise Ready"),
        ("Built-in Modules", "Heavy Enterprise ERP", "SaaS ERP Suite", "Community vs Enterprise Gate", "20+ Fully Integrated Modules + AI")
    ]
    for i, row_data in enumerate(comp_data):
        row = t_comp.rows[i+1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            c.paragraphs[0].add_run(val).font.name = "Times New Roman"
            c.paragraphs[0].runs[0].font.size = Pt(10)

    p_tc2 = doc.add_paragraph()
    p_tc2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tc2.paragraph_format.space_before = Pt(4)
    p_tc2.paragraph_format.space_after = Pt(12)
    r_tc2 = p_tc2.add_run("Table 2.1 : Comparative Analysis of Industry ERP Platforms vs ODD GEN")
    r_tc2.font.bold = True
    r_tc2.font.size = Pt(11)

    add_p(doc, "The comprehensive literature survey reveals clear research and technological gaps: commercial enterprise platforms remain cost-prohibitive and structurally rigid for dynamic businesses, while open-source alternatives often gate critical productivity features behind expensive enterprise licenses. Furthermore, existing suites lack built-in conversational AI copilot engines, lightweight touch Point of Sale terminals, and integrated digital signature verification within a unified modern JavaScript full-stack ecosystem. ODD GEN was conceptualized and engineered specifically to fill these identified gaps.")

    doc.add_page_break()

print("sections_intro_lit.py compiled successfully")
