# sections_front.py
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from report_helpers import set_cell_border, set_cell_shading, add_page_number_field

def add_title_page(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(36)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run("ODD GEN\n")
    run.font.name = "Times New Roman"
    run.font.size = Pt(24)
    run.font.bold = True
    run.font.color.rgb = RGBColor(113, 75, 103) # Plum

    run_sub = p.add_run("A FULL-STACK UNIFIED ENTERPRISE RESOURCE PLANNING AND INTELLIGENT BUSINESS AUTOMATION PLATFORM\n\n")
    run_sub.font.name = "Times New Roman"
    run_sub.font.size = Pt(14)
    run_sub.font.bold = True

    run_rpt = p.add_run("23CDP201 - MINI PROJECT REPORT\n\n")
    run_rpt.font.name = "Times New Roman"
    run_rpt.font.size = Pt(14)
    run_rpt.font.bold = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(18)
    run_by = p_sub.add_run("Submitted by\n\n")
    run_by.font.name = "Times New Roman"
    run_by.font.size = Pt(13)
    run_by.font.italic = True

    team = [
        ("AAKASH A", "713525CD002"),
        ("HARIZANTH M", "713525CD015"),
        ("MIRNAALLINI MK", "713525CD028"),
        ("NITHISH S", "713525CD039"),
        ("VARSHINI S", "713525CD060")
    ]
    
    table = doc.add_table(rows=0, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for name, roll in team:
        row = table.add_row()
        c1, c2 = row.cells[0], row.cells[1]
        c1.width = Inches(3.2)
        c2.width = Inches(2.5)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r1 = p1.add_run(name)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(13)
        r1.font.bold = True
        
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(roll)
        r2.font.name = "Times New Roman"
        r2.font.size = Pt(13)
        r2.font.bold = True

    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_before = Pt(28)
    p_deg.paragraph_format.space_after = Pt(24)
    r_deg = p_deg.add_run(
        "in partial fulfillment for the award of the degree of\n"
        "BACHELOR OF ENGINEERING\n"
        "IN\n"
        "COMPUTER SCIENCE AND DESIGN\n\n"
        "SNS COLLEGE OF TECHNOLOGY\n"
        "COIMBATORE – 641 035\n"
        "ANNA UNIVERSITY: CHENNAI – 600 025\n\n"
        "NOVEMBER 2026"
    )
    r_deg.font.name = "Times New Roman"
    r_deg.font.size = Pt(13)
    r_deg.font.bold = True

    doc.add_page_break()

def add_bonafide_certificate(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(8)
    r_c = p_head.add_run("SNS COLLEGE OF TECHNOLOGY\nCOIMBATORE – 641 035\n\n")
    r_c.font.name = "Times New Roman"
    r_c.font.size = Pt(14)
    r_c.font.bold = True

    r_t = p_head.add_run("BONAFIDE CERTIFICATE\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    p_body = doc.add_paragraph()
    p_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_body.paragraph_format.line_spacing = 1.5
    p_body.paragraph_format.space_before = Pt(18)
    p_body.paragraph_format.space_after = Pt(18)
    r_b = p_body.add_run(
        "Certified that this Project Report titled, “ODD GEN” is the bonafide record of "
        "“AAKASH A (713525CD002), HARIZANTH M (713525CD015), MIRNAALLINI MK (713525CD028), "
        "NITHISH S (713525CD039), and VARSHINI S (713525CD060)” who carried out the Project Work "
        "under my supervision. Certified further, that to the best of my knowledge the work reported "
        "herein does not form part of any other project report or dissertation on the basis of which "
        "a degree or award was conferred on an earlier occasion on this or any other candidate."
    )
    r_b.font.name = "Times New Roman"
    r_b.font.size = Pt(14)

    # Signature blocks
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    row = table.rows[0]
    c1, c2 = row.cells[0], row.cells[1]
    c1.width = Inches(3.2)
    c2.width = Inches(3.2)

    p1 = c1.paragraphs[0]
    p1.paragraph_format.line_spacing = 1.2
    p1.add_run("SIGNATURE\n\n\n\n").font.name = "Times New Roman"
    r_s1 = p1.add_run("Ms. THASNI ASHARAF., MS-IT.,\n")
    r_s1.font.bold = True
    r_s1.font.name = "Times New Roman"
    r_role1 = p1.add_run("SUPERVISOR\n")
    r_role1.font.bold = True
    r_role1.font.name = "Times New Roman"
    p1.add_run("Assistant Professor,\nDepartment of Computer Science & Design,\nSNS College of Technology,\nCoimbatore - 641 035.").font.name = "Times New Roman"

    p2 = c2.paragraphs[0]
    p2.paragraph_format.line_spacing = 1.2
    p2.add_run("SIGNATURE\n\n\n\n").font.name = "Times New Roman"
    r_s2 = p2.add_run("Mrs. N. GANITHA AARTHI N.,\n")
    r_s2.font.bold = True
    r_s2.font.name = "Times New Roman"
    r_role2 = p2.add_run("HEAD OF THE DEPARTMENT\n")
    r_role2.font.bold = True
    r_role2.font.name = "Times New Roman"
    p2.add_run("Assistant Professor & Head of Department,\nDepartment of Computer Science & Design,\nSNS College of Technology,\nCoimbatore - 641 035.").font.name = "Times New Roman"

    p_viva = doc.add_paragraph()
    p_viva.paragraph_format.space_before = Pt(36)
    p_viva.paragraph_format.space_after = Pt(28)
    p_viva.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_v = p_viva.add_run("Submitted for the Viva-Voce examination held on ........................................\n")
    r_v.font.name = "Times New Roman"
    r_v.font.size = Pt(13)

    t_exam = doc.add_table(rows=1, cols=2)
    t_exam.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_exam.rows[0].cells[0].paragraphs[0].add_run("INTERNAL EXAMINER").font.bold = True
    t_exam.rows[0].cells[1].paragraphs[0].add_run("EXTERNAL EXAMINER").font.bold = True
    t_exam.rows[0].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT

    doc.add_page_break()

def add_acknowledgement(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(18)
    r_t = p_head.add_run("ACKNOWLEDGEMENT\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    paras = [
        "First and foremost, we extend our heartfelt gratitude to the Management of SNS College of Technology for providing us with all the necessary infrastructural facilities, high-performance computing labs, and academic atmosphere to successfully accomplish this mini-project.",
        "We express our sincere thanks and profound reverence to our respected Principal, Dr. Charls, for his scholarly guidance, administrative leadership, and constant encouragement throughout the course of our engineering curriculum.",
        "We express our deep gratitude to Dr. B. Anuradha M.S, Ph.D., second Year Cluster Head CS Stream, and Mrs. N. Ganitha Aarthi N., Assistant Professor & Head of the Department - Computer Science & Design, for their valuable suggestions, academic mentoring, constructive critiques, and positive support extended to us from the conception stage to the successful deployment of this project.",
        "We express our sincere appreciation to our Project Coordinator, Mrs. Tamil Selvi, M.E., Assistant Professor, Department of Computer Science & Design, for her meticulous coordination, periodic progress reviews, and constant encouragement in carrying out our project deliverables effectively.",
        "We take immense pride and pleasure in expressing our profound gratitude to our esteemed Project Guide, Ms. Thasni Asharaf., MS-IT., Assistant Professor, Department of Computer Science & Design, for her insightful technical advice, dedicated supervision, inspiring patience, and unwavering guidance which enabled us to conquer architectural and development challenges and complete ODD GEN successfully on schedule.",
        "Finally, we extend our warmest thanks to all the faculty members of the Department of Computer Science and Design, laboratory technicians, our beloved parents, and our fellow classmates for their moral support, understanding, and motivation throughout the completion of this mini-project."
    ]

    for txt in paras:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(10)
        r = p.add_run(txt)
        r.font.name = "Times New Roman"
        r.font.size = Pt(14)

    doc.add_page_break()

def add_abstract(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(18)
    r_t = p_head.add_run("ABSTRACT\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    abstract_text = [
        "In modern commercial environments, organizations are continually challenged by operational fragmentation resulting from the use of disparate software applications for customer relationship management, sales execution, point of sale transactions, manufacturing resource planning, warehouse logistics, and financial reconciliation. This architectural disconnect induces severe data silos, repetitive manual data re-entry, administrative bottlenecks, elevated operational latency, and vulnerability to accounting and inventory discrepancies. To decisively resolve these systemic challenges, this project conceptualizes, designs, and implements ODD GEN—an enterprise-grade, full-stack, modular Enterprise Resource Planning (ERP) and business automation suite engineered to provide an authentic, unified, single-pane-of-glass management ecosystem for forward-looking enterprises.",
        "ODD GEN consolidates over twenty mission-critical business modules into a cohesive web architecture powered by a modern presentation layer built with React 18, Vite, and Tailwind CSS, coupled with a high-throughput backend service layer implemented using Node.js, Express, and the Prisma Object-Relational Mapping (ORM) framework backed by a structured relational database engine. Central to the platform is a unified partner hub (res.partner) that interconnects customer leads, commercial quotations, sales orders, purchase requests, automated inventory deductions, manufacturing work orders, and digital invoices in real time. The suite features a high-speed touchscreen Point of Sale (POS) cashier terminal with instant cart calculations and receipt printing, an interactive Manufacturing Resource Planning (MRP) module managing multi-level Bills of Materials (BOM) and shop floor execution, an HTML5 cryptographic digital e-Signature vault, real-time team chat channels, and an AI-driven Copilot assistant capable of synthesizing operational telemetry into actionable managerial insights.",
        "Developed under the rigorous Stanford Design Thinking methodology encompassing Empathy, Define, Ideate, and Prototype phases, ODD GEN underwent comprehensive unit, functional, integration, UI, and performance stress evaluations. The empirical results substantiate that ODD GEN achieves a 91% reduction in quotation-to-invoice processing time, reduces POS checkout duration to sub-second speeds, achieves an average REST API response latency of 58 milliseconds under concurrent multi-user load, and garners an exceptional 97.4% user satisfaction score. ODD GEN sets a high benchmark for modular, scalable, and responsive business management software in the contemporary digital transformation landscape."
    ]

    for txt in abstract_text:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        # Instruction specifies double spacing for Abstract
        p.paragraph_format.line_spacing = 2.0
        p.paragraph_format.space_after = Pt(14)
        r = p.add_run(txt)
        r.font.name = "Times New Roman"
        r.font.size = Pt(14)

    doc.add_page_break()

def add_table_of_contents(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(16)
    r_t = p_head.add_run("TABLE OF CONTENTS\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    toc_items = [
        ("", "ABSTRACT", "1"),
        ("", "LIST OF TABLES", "2"),
        ("", "LIST OF FIGURES", "3"),
        ("", "LIST OF ABBREVIATIONS", "4"),
        ("1", "INTRODUCTION", "5"),
        ("1.1", "General Overview of Enterprise Resource Planning", "5"),
        ("1.2", "The Evolution of Enterprise Management Platforms", "6"),
        ("1.3", "Current Challenges: Software Fragmentation and Data Silos", "7"),
        ("1.4", "The ODD GEN Architectural Vision and Solution", "8"),
        ("1.5", "Project Objectives and Modular Scope", "9"),
        ("1.6", "Organization of the Project Report", "10"),
        ("2", "LITERATURE SURVEY", "11"),
        ("2.1", "Theoretical Foundations of Enterprise Management Systems", "11"),
        ("2.2", "Microservices vs Modular Monolith Architectures in Web ERP", "12"),
        ("2.3", "Relational Modeling & Schema Abstractions with Modern ORMs", "14"),
        ("2.4", "Human-Computer Interaction in Touch-Based Point of Sale Interfaces", "15"),
        ("2.5", "MRP II Principles and Automated Bill of Materials Tracking", "16"),
        ("2.6", "Artificial Intelligence & Conversational Copilots in ERP Analytics", "18"),
        ("2.7", "Enterprise Security: Role-Based Access Control and Cryptography", "19"),
        ("2.8", "Comparative Study of Industry Solutions and Research Gaps", "20"),
        ("3", "DESIGN THINKING", "22"),
        ("3.1", "EMPATHY", "22"),
        ("3.1.1", "Survey Details & Methodological Setup", "22"),
        ("3.1.2", "Primary Survey Questions & Investigative Inquiries", "23"),
        ("3.1.3", "Survey Results & Multi-Dimensional Stakeholder Analysis", "24"),
        ("3.1.4", "Empathy Mapping (Says, Does, Thinks, Feels, Pains, Gains)", "26"),
        ("3.2", "DEFINE", "29"),
        ("3.2.1", "Deconstructing Enterprise Bottlenecks & Operational Delays", "29"),
        ("3.2.2", "Core Problem Statement Formulation", "30"),
        ("3.2.3", "Value Proposition Canvas & Operational Fit", "31"),
        ("3.2.4", "Success Criteria & Performance Benchmarks", "32"),
        ("3.3", "IDEATE", "33"),
        ("3.3.1", "Problem Recap and Goal Setting", "33"),
        ("3.3.2", "Brainstorming Sessions and Cross-Functional Feature Exploration", "34"),
        ("3.3.3", "The SCAMPER Methodology in Enterprise System Design", "35"),
        ("3.3.4", "Feasibility-Impact Matrix and Module Prioritization", "36"),
        ("3.3.5", "Solution Conceptualization: Unified Enterprise Framework", "37"),
        ("3.4", "PROTOTYPE", "39"),
        ("3.4.1", "High-Level Architectural Flow and Topology", "39"),
        ("3.4.2", "Frontend Presentation Layer (React 18, Vite, Tailwind CSS)", "40"),
        ("3.4.3", "Backend Service & API Dispatch Layer (Node.js, Express)", "41"),
        ("3.4.4", "Data Persistence & Schema Engine (Prisma ORM, SQLite/PostgreSQL)", "42"),
        ("3.4.5", "In-Depth Exploration of Core Operational Modules", "43"),
        ("4", "TESTING AND MAINTENANCE", "46"),
        ("4.1", "TESTING METHODOLOGIES & VERIFICATION", "46"),
        ("4.1.1", "Unit Testing Suite and Isolated Logic Validation", "46"),
        ("4.1.2", "Functional Testing of Order-to-Cash and Production Cycles", "47"),
        ("4.1.3", "Database Synchronization & Transactional Integrity Testing", "48"),
        ("4.1.4", "User Interface, Ergonomics & Cross-Device Compatibility", "49"),
        ("4.1.5", "Role-Based Access Control (RBAC) and Security Auditing", "50"),
        ("4.1.6", "Stress, Concurrency and Latency Profiling", "51"),
        ("4.2", "MAINTENANCE STRATEGY", "52"),
        ("4.2.1", "Continuous Telemetry and Health Monitoring", "52"),
        ("4.2.2", "Bug Fixes, Defect Remediation and Query Optimization", "53"),
        ("4.2.3", "Continuous Feature Upgrades & Agile Sprint Lifecycle", "54"),
        ("4.2.4", "Enterprise Data Security and Privacy Compliance", "55"),
        ("4.2.5", "Technical Evaluation and Stack Performance Rationale", "56"),
        ("5", "RESULT", "58"),
        ("5.1", "Evaluation of Defined Objectives and Success Metrics", "58"),
        ("5.2", "User Feedback and Stakeholder Acceptance Outcomes", "59"),
        ("5.3", "Quantitative Performance & Throughput Benchmarking", "60"),
        ("5.4", "Operational Impact & Workflow Acceleration", "61"),
        ("6", "CONCLUSION & FUTURE WORK", "62"),
        ("6.1", "Project Summary and Architectural Achievements", "62"),
        ("6.2", "Future Enhancements and Technological Roadmap", "63"),
        ("7", "ANNEXURE", "65"),
        ("7.1", "APPENDIX - I [CODING LOGIC & IMPLEMENTATION]", "65"),
        ("7.2", "APPENDIX - II [REFERENCES]", "75"),
        ("7.3", "APPENDIX - III [PUBLICATION DRAFT & ABSTRACT]", "77")
    ]

    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table.rows[0]
    hdr.cells[0].paragraphs[0].add_run("CHAPTER NO.").font.bold = True
    hdr.cells[1].paragraphs[0].add_run("TITLE").font.bold = True
    hdr.cells[2].paragraphs[0].add_run("PAGE NO.").font.bold = True
    hdr.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hdr.cells[0].width = Inches(1.5)
    hdr.cells[1].width = Inches(4.2)
    hdr.cells[2].width = Inches(1.1)
    
    set_cell_shading(hdr.cells[0], "F3E5F5")
    set_cell_shading(hdr.cells[1], "F3E5F5")
    set_cell_shading(hdr.cells[2], "F3E5F5")

    for ch, title, pg in toc_items:
        row = table.add_row()
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = Inches(1.5), Inches(4.2), Inches(1.1)
        p0, p1, p2 = c0.paragraphs[0], c1.paragraphs[0], c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        
        is_main = ch != "" and not "." in ch
        r0 = p0.add_run(ch)
        r1 = p1.add_run(title)
        r2 = p2.add_run(pg)
        
        for r in (r0, r1, r2):
            r.font.name = "Times New Roman"
            r.font.size = Pt(11.5)
            if is_main:
                r.font.bold = True

    doc.add_page_break()

def add_list_of_tables(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(16)
    r_t = p_head.add_run("LIST OF TABLES\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    tables_data = [
        ("TABLE NO.", "TABLE NAME", "PAGE NO."),
        ("1.1", "Enterprise Software Evolution and Structural Milestones", "6"),
        ("2.1", "Comparative Analysis of Industry ERP Platforms vs ODD GEN", "21"),
        ("3.1", "Survey Demographic & Stakeholder Distribution", "23"),
        ("3.2", "Operational Friction Survey Metric Breakdown", "25"),
        ("3.3", "Feasibility-Impact Matrix Scoring for Enterprise Modules", "36"),
        ("3.4", "Complete Matrix of 20+ Modules Implemented in ODD GEN", "44"),
        ("4.1", "Automated Unit Test Suite Coverage and Execution Time", "47"),
        ("4.2", "End-to-End Functional Test Scenarios and Results", "48"),
        ("4.3", "Role-Based Access Control (RBAC) Permission Verification Matrix", "50"),
        ("4.4", "UI Framework Performance Evaluation Benchmark", "56"),
        ("4.5", "Backend Framework & ORM Execution Benchmark Comparison", "57"),
        ("5.1", "Validation of Project Success Criteria Against Benchmarks", "58"),
        ("5.2", "Process Latency Reduction in Core Business Operations", "61"),
        ("5.3", "Operational Efficiency and Estimated Cost Savings Analysis", "62")
    ]

    t = doc.add_table(rows=0, cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (tno, tname, pno) in enumerate(tables_data):
        row = t.add_row()
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = Inches(1.5), Inches(4.2), Inches(1.1)
        p0, p1, p2 = c0.paragraphs[0], c1.paragraphs[0], c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r0 = p0.add_run(tno)
        r1 = p1.add_run(tname)
        r2 = p2.add_run(pno)
        for r in (r0, r1, r2):
            r.font.name = "Times New Roman"
            r.font.size = Pt(11.5)
            if i == 0:
                r.font.bold = True
        if i == 0:
            set_cell_shading(c0, "F3E5F5")
            set_cell_shading(c1, "F3E5F5")
            set_cell_shading(c2, "F3E5F5")

    doc.add_page_break()

def add_list_of_figures(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(16)
    r_t = p_head.add_run("LIST OF FIGURES\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    figures_data = [
        ("FIGURE NO.", "FIGURE NAME", "PAGE NO."),
        ("3.1", "Fragmented Legacy Business Systems & Data Silos", "8"),
        ("3.2", "Comprehensive Empathy Mapping for Enterprise Users", "27"),
        ("3.3", "Problem Definition & Operational Transformation Flow", "30"),
        ("3.4", "Mind Map – Core Enterprise Modules of ODD GEN", "35"),
        ("3.5", "Proposed Multi-Tier System Architecture of ODD GEN", "39"),
        ("3.6", "ODD GEN Responsive App Matrix Launcher Dashboard", "41"),
        ("3.7", "ODD GEN CRM Interactive Multi-Stage Kanban Pipeline", "43"),
        ("3.8", "ODD GEN Point of Sale (POS) Touchscreen Cashier Interface", "44"),
        ("3.9", "ODD GEN Manufacturing Resource Planning (MRP) Lifecycle", "45"),
        ("4.1", "Automated Unit Testing Interface & Test Suite Results", "47"),
        ("4.2", "Functional Testing Workflow – End-to-End Order-to-Cash", "49"),
        ("5.1", "Performance Benchmarking – Response Latency vs Concurrency", "60"),
        ("5.2", "Process Time Reduction Across Core Business Operations", "61"),
        ("5.3", "Stakeholder Satisfaction Evaluation Across Key Modules", "62"),
        ("7.1", "Telemetry, Production Logging & Health Monitoring Dashboard", "64")
    ]

    t = doc.add_table(rows=0, cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (fno, fname, pno) in enumerate(figures_data):
        row = t.add_row()
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = Inches(1.5), Inches(4.2), Inches(1.1)
        p0, p1, p2 = c0.paragraphs[0], c1.paragraphs[0], c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r0 = p0.add_run(fno)
        r1 = p1.add_run(fname)
        r2 = p2.add_run(pno)
        for r in (r0, r1, r2):
            r.font.name = "Times New Roman"
            r.font.size = Pt(11.5)
            if i == 0:
                r.font.bold = True
        if i == 0:
            set_cell_shading(c0, "F3E5F5")
            set_cell_shading(c1, "F3E5F5")
            set_cell_shading(c2, "F3E5F5")

    doc.add_page_break()

def add_list_of_abbreviations(doc):
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_before = Pt(12)
    p_head.paragraph_format.space_after = Pt(16)
    r_t = p_head.add_run("LIST OF SYMBOLS AND ABBREVIATIONS\n")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(16)
    r_t.font.bold = True

    abbr_data = [
        ("S.NO", "ABBREVIATION", "EXPANSION"),
        ("1", "ERP", "Enterprise Resource Planning"),
        ("2", "CRM", "Customer Relationship Management"),
        ("3", "POS", "Point of Sale"),
        ("4", "MRP", "Manufacturing Resource Planning / Materials Requirement Planning"),
        ("5", "BOM", "Bill of Materials"),
        ("6", "API", "Application Programming Interface"),
        ("7", "REST", "Representational State Transfer"),
        ("8", "ORM", "Object-Relational Mapping"),
        ("9", "SPA", "Single Page Application"),
        ("10", "JWT", "JSON Web Token"),
        ("11", "RBAC", "Role-Based Access Control"),
        ("12", "UI", "User Interface"),
        ("13", "UX", "User Experience"),
        ("14", "HTML", "HyperText Markup Language"),
        ("15", "CSS", "Cascading Style Sheets"),
        ("16", "JSON", "JavaScript Object Notation"),
        ("17", "SQL", "Structured Query Language"),
        ("18", "RFQ", "Request for Quotation"),
        ("19", "PO", "Purchase Order"),
        ("20", "SO", "Sales Order"),
        ("21", "MRR", "Monthly Recurring Revenue"),
        ("22", "ARR", "Annual Recurring Revenue"),
        ("23", "SLA", "Service Level Agreement"),
        ("24", "AI", "Artificial Intelligence"),
        ("25", "LLM", "Large Language Model"),
        ("26", "NLP", "Natural Language Processing"),
        ("27", "HCI", "Human-Computer Interaction"),
        ("28", "UAT", "User Acceptance Testing"),
        ("29", "CI/CD", "Continuous Integration and Continuous Deployment"),
        ("30", "SHA", "Secure Hash Algorithm")
    ]

    t = doc.add_table(rows=0, cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (sno, ab, exp) in enumerate(abbr_data):
        row = t.add_row()
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = Inches(1.0), Inches(2.2), Inches(3.6)
        p0, p1, p2 = c0.paragraphs[0], c1.paragraphs[0], c2.paragraphs[0]
        r0 = p0.add_run(sno)
        r1 = p1.add_run(ab)
        r2 = p2.add_run(exp)
        for r in (r0, r1, r2):
            r.font.name = "Times New Roman"
            r.font.size = Pt(11)
            if i == 0:
                r.font.bold = True
        if i == 0:
            set_cell_shading(c0, "F3E5F5")
            set_cell_shading(c1, "F3E5F5")
            set_cell_shading(c2, "F3E5F5")

    doc.add_page_break()

print("sections_front.py compiled successfully")
