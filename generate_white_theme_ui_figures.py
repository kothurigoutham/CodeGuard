import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch

os.makedirs("figures", exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# -----------------------------------------------------------------------------
# HELPER: Window Chrome in Modern White Theme
# -----------------------------------------------------------------------------
def draw_window_chrome(ax, title="CodeGuard Enterprise Static Analysis Platform", x=2, y=2, w=96, h=96):
    # Window container
    win = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.2)
    ax.add_patch(win)
    # Title bar
    tbar = patches.Rectangle((x, y + h - 5.5), w, 5.5, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(tbar)
    # Traffic lights
    ax.plot(x + 2.5, y + h - 2.8, 'o', color='#EF4444', markersize=5)
    ax.plot(x + 4.5, y + h - 2.8, 'o', color='#F59E0B', markersize=5)
    ax.plot(x + 6.5, y + h - 2.8, 'o', color='#10B981', markersize=5)
    # Title
    ax.text(x + w/2, y + h - 3.2, title, fontsize=8, color='#334155', ha='center', fontweight='bold')

def draw_navbar(ax, active_tab="Dashboard", x=2, y=86, w=96, h=6.5):
    nav = patches.Rectangle((x, y), w, h, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(nav)
    # Shield icon + Logo
    ax.plot(x + 3.2, y + 3.2, 's', color='#2563EB', markersize=10)
    ax.text(x + 3.2, y + 2.6, "C", fontsize=7.5, fontweight='bold', color='#FFFFFF', ha='center')
    ax.text(x + 6.2, y + 2.7, "CodeGuard", fontsize=10, fontweight='bold', color='#0F172A')
    
    # Engine tag
    tag = FancyBboxPatch((x + 18, y + 1.8), 12, 3.2, boxstyle="round,pad=0.2", facecolor='#ECFDF5', edgecolor='#A7F3D0', lw=0.8)
    ax.add_patch(tag)
    ax.text(x + 24, y + 2.7, "• Engine v2.4 Active", fontsize=6.2, fontweight='bold', color='#059669', ha='center')

    # Tabs
    tabs = ["Dashboard", "Audit History", "Workspaces", "New Scan"]
    tx = x + 34
    for t in tabs:
        if t == active_tab:
            ax.text(tx + 6, y + 2.7, t, fontsize=7.8, fontweight='bold', color='#2563EB', ha='center')
            ax.plot([tx + 1, tx + 11], [y + 0.3, y + 0.3], color='#2563EB', lw=2)
        else:
            ax.text(tx + 6, y + 2.7, t, fontsize=7.8, color='#64748B', ha='center')
        tx += 13.5

    # User pill
    upill = FancyBboxPatch((x + w - 16, y + 1.6), 14, 3.5, boxstyle="round,pad=0.2", facecolor='#F1F5F9', edgecolor='#E2E8F0', lw=0.8)
    ax.add_patch(upill)
    ax.plot(x + w - 14.2, y + 3.3, 'o', color='#3B82F6', markersize=6)
    ax.text(x + w - 14.2, y + 2.7, "A", fontsize=5.8, fontweight='bold', color='#FFFFFF', ha='center')
    ax.text(x + w - 8, y + 2.7, "aravind@cbit", fontsize=6.5, color='#334155', ha='center')

# -----------------------------------------------------------------------------
# FIGURE 7: Responsive Mobile Layout
# -----------------------------------------------------------------------------
def create_fig7_mobile_layout():
    fig, ax = plt.subplots(figsize=(6, 10.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Phone outer frame
    phone = FancyBboxPatch((10, 2), 80, 96, boxstyle="round,pad=1.5", facecolor='#FFFFFF', edgecolor='#64748B', lw=2.5)
    ax.add_patch(phone)

    # Notch / Dynamic Island
    notch = FancyBboxPatch((38, 93.5), 24, 3, boxstyle="round,pad=0.3", facecolor='#0F172A')
    ax.add_patch(notch)
    ax.text(20, 94.5, "09:41", fontsize=7.5, fontweight='bold', color='#0F172A')
    ax.text(78, 94.5, "5G • 100%", fontsize=6.8, color='#0F172A')

    # Mobile Header
    mhead = patches.Rectangle((10, 85), 80, 6.5, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(mhead)
    ax.plot(16, 88.2, 's', color='#2563EB', markersize=9)
    ax.text(16, 87.6, "C", fontsize=7, fontweight='bold', color='#FFFFFF', ha='center')
    ax.text(19, 87.7, "CodeGuard", fontsize=9.5, fontweight='bold', color='#0F172A')
    # Hamburger
    for hy in [89.5, 88.2, 86.9]:
        ax.plot([82, 86], [hy, hy], color='#334155', lw=1.5)

    # Project context
    ax.text(15, 81.5, "Project: e-commerce-api", fontsize=8.5, fontweight='bold', color='#0F172A')
    ax.text(15, 79, "Scan #4 • Completed 2m ago", fontsize=7, color='#64748B')

    # 2x2 Metric Cards
    m_cards = [
        (15, 68, "CRITICAL", "2", "#FEF2F2", "#EF4444", "#991B1B"),
        (52, 68, "HIGH", "5", "#FFF7ED", "#F97316", "#9A3412"),
        (15, 56, "MEDIUM", "11", "#FEFCE8", "#EAB308", "#854D0E"),
        (52, 56, "LOW", "24", "#EFF6FF", "#3B82F6", "#1E40AF")
    ]
    for mx, my, mtitle, mval, mbg, medge, mtxt in m_cards:
        c_box = FancyBboxPatch((mx, my), 33, 10, boxstyle="round,pad=0.3", facecolor=mbg, edgecolor=medge, lw=1)
        ax.add_patch(c_box)
        ax.plot(mx + 4, my + 6.8, 'o', color=medge, markersize=4)
        ax.text(mx + 7, my + 6.5, mtitle, fontsize=6.8, fontweight='bold', color=mtxt)
        ax.text(mx + 26, my + 3.2, mval, fontsize=12, fontweight='bold', color=mtxt, ha='center')

    # Mobile Findings Section Title
    ax.text(15, 51, "Vulnerability Stream (42)", fontsize=8, fontweight='bold', color='#0F172A')

    # Mobile finding cards
    f_cards = [
        ("CRITICAL", "#EF4444", "#FEF2F2", "B608: SQL Injection via f-string", "app/auth/routes.py:84", "Bandit"),
        ("CRITICAL", "#EF4444", "#FEF2F2", "AST-EVAL: Untrusted eval() execution", "utils/calc.py:23", "Python AST"),
        ("HIGH", "#F97316", "#FFF7ED", "B105: Hardcoded database password", "config/settings.py:12", "Bandit"),
        ("HIGH", "#F97316", "#FFF7ED", "B602: Subprocess with shell=True", "tasks/worker.py:45", "Bandit"),
        ("MEDIUM", "#EAB308", "#FEFCE8", "C901: High Cyclomatic Complexity", "services/order.py:102", "Ruff Linter")
    ]
    fy = 42
    for s_txt, s_col, s_bg, title, path, tool in f_cards:
        fc = FancyBboxPatch((15, fy), 70, 7.5, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=0.9)
        ax.add_patch(fc)
        # Severity pill
        spill = FancyBboxPatch((17, fy + 4.2), 16, 2.4, boxstyle="round,pad=0.15", facecolor=s_bg, edgecolor=s_col, lw=0.6)
        ax.add_patch(spill)
        ax.plot(18.5, fy + 5.4, 'o', color=s_col, markersize=3)
        ax.text(25, fy + 4.9, s_txt, fontsize=5.5, fontweight='bold', color=s_col, ha='center')
        ax.text(35, fy + 4.9, f"• {tool}", fontsize=5.8, color='#64748B')

        ax.text(17, fy + 2.2, title[:34], fontsize=6.5, fontweight='bold', color='#0F172A')
        ax.text(17, fy + 0.6, path, fontsize=5.8, color='#2563EB')
        ax.text(81, fy + 3.2, ">", fontsize=9, color='#94A3B8')
        fy -= 8.5

    # Bottom Mobile Nav
    bnav = patches.Rectangle((10, 2), 80, 6, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(bnav)
    ax.text(22, 5, "Dashboard", fontsize=6.5, fontweight='bold', color='#2563EB', ha='center')
    ax.text(42, 5, "Audits", fontsize=6.5, color='#64748B', ha='center')
    ax.text(60, 5, "Workspaces", fontsize=6.5, color='#64748B', ha='center')
    ax.text(78, 5, "Settings", fontsize=6.5, color='#64748B', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig7_mobile_layout.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig7_mobile_layout.png")

# -----------------------------------------------------------------------------
# FIGURE 8: Login and Registration Screen
# -----------------------------------------------------------------------------
def create_fig8_login_screen():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — User Authentication & Session Gateway")

    # Background subtle pattern
    for x in range(10, 95, 8):
        for y in range(10, 90, 8):
            ax.plot(x, y, '.', color='#E2E8F0', markersize=2)

    # Auth Card Center
    card = FancyBboxPatch((28, 14), 44, 70, boxstyle="round,pad=0.5", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.2)
    ax.add_patch(card)

    # Logo + Header
    ax.plot(50, 77, 's', color='#2563EB', markersize=14)
    ax.text(50, 76.2, "C", fontsize=10, fontweight='bold', color='#FFFFFF', ha='center')
    ax.text(50, 71.5, "CodeGuard Enterprise", fontsize=12, fontweight='bold', color='#0F172A', ha='center')
    ax.text(50, 68, "Static Code Analysis & Security Assurance", fontsize=7.5, color='#64748B', ha='center')

    # Segmented Toggle
    toggle_bg = FancyBboxPatch((32, 60.5), 36, 4.5, boxstyle="round,pad=0.2", facecolor='#F1F5F9', edgecolor='#E2E8F0')
    ax.add_patch(toggle_bg)
    t_active = FancyBboxPatch((32.5, 61), 17.5, 3.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=0.8)
    ax.add_patch(t_active)
    ax.text(41.2, 62.3, "Sign In", fontsize=7.5, fontweight='bold', color='#2563EB', ha='center')
    ax.text(59, 62.3, "Register", fontsize=7.5, color='#64748B', ha='center')

    # Input 1: Email
    ax.text(32, 56.5, "Email Address", fontsize=7, fontweight='bold', color='#334155')
    in1 = FancyBboxPatch((32, 50.5), 36, 4.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#94A3B8', lw=1)
    ax.add_patch(in1)
    ax.text(34, 52.3, "aravind.portheti@cbit.ac.in", fontsize=7.2, color='#0F172A')

    # Input 2: Password
    ax.text(32, 46.5, "Master Password", fontsize=7, fontweight='bold', color='#334155')
    in2 = FancyBboxPatch((32, 40.5), 36, 4.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(in2)
    ax.text(34, 42.3, "••••••••••••••••••••", fontsize=8, color='#0F172A')

    # Checkbox & Forgot
    chk = patches.Rectangle((32, 36.2), 2.5, 2.5, facecolor='#2563EB', edgecolor='#2563EB')
    ax.add_patch(chk)
    ax.text(33.2, 36.8, "✓", fontsize=6, color='#FFFFFF', ha='center', fontweight='bold')
    ax.text(36, 36.8, "Remember session on this device", fontsize=6.5, color='#475569')
    ax.text(68, 36.8, "Forgot password?", fontsize=6.5, color='#2563EB', ha='right')

    # Submit Button
    btn = FancyBboxPatch((32, 28), 36, 5.2, boxstyle="round,pad=0.2", facecolor='#2563EB', edgecolor='#1D4ED8', lw=1)
    ax.add_patch(btn)
    ax.text(50, 30.2, "Authenticate & Access Workspaces", fontsize=8, fontweight='bold', color='#FFFFFF', ha='center')

    # Security Footnote
    ax.text(50, 21.5, "Protected by Bcrypt Password Hashing, JWT Sessions\nand Role-Based Multi-Tenant Isolation.", 
            fontsize=6.2, color='#64748B', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig8_login_screen.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig8_login_screen.png")

# -----------------------------------------------------------------------------
# FIGURE 9 & ui_mockup_dashboard: Project Dashboard
# -----------------------------------------------------------------------------
def create_fig9_and_mockup_dashboard():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — Centralized Executive Security Dashboard")
    draw_navbar(ax, active_tab="Dashboard")

    # Project Context Bar
    pbar = FancyBboxPatch((5, 78), 90, 6.5, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(pbar)
    ax.text(7, 82.2, "Active Project: E-Commerce Backend API", fontsize=9.5, fontweight='bold', color='#0F172A')
    ax.text(7, 79.5, "Scan Ref: #SCN-2026-084  •  Engine: Bandit + Ruff + AST  •  Duration: 1.42s  •  38 Files Scanned", fontsize=7, color='#64748B')
    
    # Upload CTA Button
    btn_up = FancyBboxPatch((76, 79.2), 17, 4.2, boxstyle="round,pad=0.2", facecolor='#2563EB', edgecolor='#1D4ED8')
    ax.add_patch(btn_up)
    ax.text(84.5, 81, "+ Run New Scan", fontsize=7.2, fontweight='bold', color='#FFFFFF', ha='center')

    # Metric Cards (White theme with pastel badges)
    cards = [
        ("CRITICAL", "2", "#FEF2F2", "#EF4444", "#991B1B"),
        ("HIGH", "5", "#FFF7ED", "#F97316", "#9A3412"),
        ("MEDIUM", "11", "#FEFCE8", "#EAB308", "#854D0E"),
        ("LOW", "24", "#EFF6FF", "#3B82F6", "#1E40AF")
    ]
    cx = 5
    for title, val, bg, edge, txt in cards:
        c_box = FancyBboxPatch((cx, 64), 21, 11.5, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
        ax.add_patch(c_box)
        # Severity tag inside card
        tag = FancyBboxPatch((cx + 1.8, 71.5), 10, 3, boxstyle="round,pad=0.2", facecolor=bg, edgecolor=edge, lw=0.7)
        ax.add_patch(tag)
        ax.plot(cx + 3.2, 73, 'o', color=edge, markersize=3.5)
        ax.text(cx + 6.8, 72.4, title, fontsize=6.2, fontweight='bold', color=txt, ha='center')

        ax.text(cx + 17, 67, val, fontsize=15, fontweight='bold', color='#0F172A', ha='center')
        ax.text(cx + 2, 65.5, "Requires attention", fontsize=6, color='#64748B')
        cx += 23

    # Table Header & Search
    ax.text(5, 60, "Detected Security Vulnerabilities & Quality Issues (42 Total)", fontsize=9, fontweight='bold', color='#0F172A')

    # Findings Table Header
    tbl_hdr = patches.Rectangle((5, 52.5), 90, 4.5, facecolor='#F1F5F9', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(tbl_hdr)
    ax.text(7, 54.2, "SEVERITY", fontsize=7, fontweight='bold', color='#475569')
    ax.text(17, 54.2, "RULE ID", fontsize=7, fontweight='bold', color='#475569')
    ax.text(27, 54.2, "TOOL", fontsize=7, fontweight='bold', color='#475569')
    ax.text(37, 54.2, "FILE LOCATION", fontsize=7, fontweight='bold', color='#475569')
    ax.text(58, 54.2, "VULNERABILITY DESCRIPTION", fontsize=7, fontweight='bold', color='#475569')
    ax.text(86, 54.2, "STATUS", fontsize=7, fontweight='bold', color='#475569')

    # Findings Rows
    rows = [
        ("CRITICAL", "#EF4444", "#FEF2F2", "B608", "Bandit", "app/auth/routes.py : 84", "Hardcoded SQL string formatting / SQL Injection", "OPEN"),
        ("CRITICAL", "#EF4444", "#FEF2F2", "AST-EVAL", "Python AST", "utils/calc.py : 23", "Dangerous execution of untrusted input via eval()", "OPEN"),
        ("HIGH", "#F97316", "#FFF7ED", "B105", "Bandit", "config/settings.py : 12", "Hardcoded password string in variable 'DB_PASS'", "OPEN"),
        ("HIGH", "#F97316", "#FFF7ED", "B602", "Bandit", "tasks/worker.py : 45", "Subprocess execution with shell=True parameter", "OPEN"),
        ("MEDIUM", "#EAB308", "#FEFCE8", "B303", "Bandit", "security/hash.py : 19", "Insecure MD5 hashing algorithm detected", "RESOLVED"),
        ("MEDIUM", "#EAB308", "#FEFCE8", "C901", "Ruff", "services/order.py : 102", "Function 'process_order' complexity score 14 (>10)", "OPEN"),
        ("LOW", "#3B82F6", "#EFF6FF", "F401", "Ruff", "models/base.py : 4", "Module imported but unused: 'sys'", "OPEN")
    ]
    ry = 47.5
    for sev, scol, sbg, rid, tool, fline, desc, st in rows:
        row_box = patches.Rectangle((5, ry), 90, 4.8, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=0.6)
        ax.add_patch(row_box)
        
        # Severity Badge
        b_box = FancyBboxPatch((6.5, ry + 1), 8.5, 2.8, boxstyle="round,pad=0.2", facecolor=sbg, edgecolor=scol, lw=0.7)
        ax.add_patch(b_box)
        ax.plot(7.7, ry + 2.4, 'o', color=scol, markersize=3)
        ax.text(11, ry + 1.9, sev[:4], fontsize=5.8, fontweight='bold', color=scol, ha='center')

        ax.text(17, ry + 1.8, rid, fontsize=6.8, fontweight='bold', color='#0F172A')
        ax.text(27, ry + 1.8, tool, fontsize=6.5, color='#475569')
        ax.text(37, ry + 1.8, fline, fontsize=6.5, color='#2563EB')
        ax.text(58, ry + 1.8, desc[:42] + "...", fontsize=6.5, color='#334155')

        st_bg = '#DCFCE7' if st == 'RESOLVED' else '#FEE2E2'
        st_fg = '#15803D' if st == 'RESOLVED' else '#B91C1C'
        st_box = FancyBboxPatch((85, ry + 1), 8.5, 2.8, boxstyle="round,pad=0.2", facecolor=st_bg, edgecolor=st_fg, lw=0.6)
        ax.add_patch(st_box)
        ax.text(89.2, ry + 1.9, st, fontsize=5.8, fontweight='bold', color=st_fg, ha='center')
        ry -= 5

    # Bottom Actions Bar
    btn1 = FancyBboxPatch((5, 6), 24, 4.8, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(btn1)
    ax.text(17, 8.2, "⬇ Download PDF Report", fontsize=7.2, fontweight='bold', color='#0F172A', ha='center')

    btn2 = FancyBboxPatch((31, 6), 22, 4.8, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(btn2)
    ax.text(42, 8.2, "⬇ Export JSON Payload", fontsize=7.2, fontweight='bold', color='#0F172A', ha='center')

    btn3 = FancyBboxPatch((55, 6), 22, 4.8, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(btn3)
    ax.text(66, 8.2, "⇄ Compare with Baseline", fontsize=7.2, fontweight='bold', color='#2563EB', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig9_project_dashboard.png", bbox_inches='tight', dpi=300)
    plt.savefig("figures/ui_mockup_dashboard.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig9_project_dashboard.png & ui_mockup_dashboard.png")

# -----------------------------------------------------------------------------
# FIGURE 10: Upload and Scan Progress Modal
# -----------------------------------------------------------------------------
def create_fig10_upload_progress():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — Source Code Ingestion & Scan Orchestration")
    draw_navbar(ax, active_tab="New Scan")

    # Dimmed background overlay
    dim = patches.Rectangle((2, 2), 96, 90, facecolor='#0F172A', alpha=0.15)
    ax.add_patch(dim)

    # Modal Dialog Window
    modal = FancyBboxPatch((24, 15), 52, 68, boxstyle="round,pad=0.5", facecolor='#FFFFFF', edgecolor='#94A3B8', lw=1.5)
    ax.add_patch(modal)

    # Modal Title Bar
    ax.text(28, 77.5, "Initiate New Security & Quality Scan", fontsize=10.5, fontweight='bold', color='#0F172A')
    ax.text(28, 74.5, "Select workspace repository or drop zipped source archive", fontsize=7.2, color='#64748B')
    ax.plot([28, 72], [72, 72], color='#E2E8F0', lw=1)

    # Workspace field
    ax.text(28, 68.5, "Target Workspace / Project", fontsize=7.2, fontweight='bold', color='#334155')
    ws_box = FancyBboxPatch((28, 62.5), 44, 4.5, boxstyle="round,pad=0.2", facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(ws_box)
    ax.text(30, 64.5, "Production-Services / e-commerce-api", fontsize=7.2, color='#0F172A')
    ax.text(70, 64.5, "▼", fontsize=6.5, color='#64748B', ha='right')

    # Dropzone Area
    dz = FancyBboxPatch((28, 43), 44, 16.5, boxstyle="round,pad=0.3", facecolor='#F8FAFC', edgecolor='#3B82F6', lw=1.2, linestyle='--')
    ax.add_patch(dz)
    ax.text(50, 54, "⬆", fontsize=16, color='#2563EB', ha='center')
    ax.text(50, 49.5, "archive-source-2026.zip selected (4.2 MB)", fontsize=7.5, fontweight='bold', color='#1E40AF', ha='center')
    ax.text(50, 46, "Sanitized & verified against Zip-Slip path traversals", fontsize=6.5, color='#059669', ha='center')

    # Progress bar section
    ax.text(28, 38.5, "Scan Execution Progress", fontsize=7.2, fontweight='bold', color='#0F172A')
    ax.text(72, 38.5, "78% Completed", fontsize=7.2, fontweight='bold', color='#2563EB', ha='right')

    # Progress Track & Fill
    p_track = FancyBboxPatch((28, 33), 44, 3.5, boxstyle="round,pad=0.2", facecolor='#E2E8F0')
    ax.add_patch(p_track)
    p_fill = FancyBboxPatch((28, 33), 34.3, 3.5, boxstyle="round,pad=0.2", facecolor='#2563EB')
    ax.add_patch(p_fill)

    # Status message
    ax.text(28, 28.5, "Phase: Running Bandit SAST & Ruff Quality Linters across 38 files...", fontsize=6.8, color='#475569')

    # Modal Action Buttons
    btn_cancel = FancyBboxPatch((46, 18), 12, 4.5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(btn_cancel)
    ax.text(52, 20.2, "Cancel", fontsize=7.2, color='#64748B', ha='center')

    btn_run = FancyBboxPatch((60, 18), 12, 4.5, boxstyle="round,pad=0.2", facecolor='#2563EB', edgecolor='#1D4ED8', lw=1)
    ax.add_patch(btn_run)
    ax.text(66, 20.2, "Analyzing...", fontsize=7.2, fontweight='bold', color='#FFFFFF', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig10_upload_progress.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig10_upload_progress.png")

# -----------------------------------------------------------------------------
# FIGURE 11: Findings Dashboard
# -----------------------------------------------------------------------------
def create_fig11_findings_dashboard():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — Findings Matrix & Multi-Facet Vulnerability Filters")
    draw_navbar(ax, active_tab="Audit History")

    # Filter Strip
    f_bar = FancyBboxPatch((5, 78), 90, 6.5, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(f_bar)
    
    # Filter Tabs
    ftabs = [
        ("All Findings (42)", True, '#2563EB', '#EFF6FF'),
        ("Critical (2)", False, '#EF4444', '#FEF2F2'),
        ("High (5)", False, '#F97316', '#FFF7ED'),
        ("Medium (11)", False, '#EAB308', '#FEFCE8'),
        ("Low (24)", False, '#3B82F6', '#EFF6FF')
    ]
    fx = 7
    for ftitle, is_act, fcol, fbg in ftabs:
        if is_act:
            ft = FancyBboxPatch((fx, 79.2), 15, 4.2, boxstyle="round,pad=0.2", facecolor='#2563EB', edgecolor='#1D4ED8')
            ax.add_patch(ft)
            ax.text(fx + 7.5, 81.2, ftitle, fontsize=6.8, fontweight='bold', color='#FFFFFF', ha='center')
        else:
            ft = FancyBboxPatch((fx, 79.2), 13, 4.2, boxstyle="round,pad=0.2", facecolor=fbg, edgecolor=fcol, lw=0.7)
            ax.add_patch(ft)
            ax.text(fx + 6.5, 81.2, ftitle, fontsize=6.8, fontweight='bold', color=fcol, ha='center')
        fx += 15.5

    # Search & Tool Filter Bar
    s_box = FancyBboxPatch((5, 70), 55, 5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(s_box)
    ax.text(7, 72.3, "Filter by keyword, rule ID (e.g. B608), file path, or CWE...", fontsize=7, color='#64748B')

    t_box1 = FancyBboxPatch((62, 70), 16, 5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(t_box1)
    ax.text(70, 72.3, "Tool: All (3) ▼", fontsize=7, color='#334155', ha='center')

    t_box2 = FancyBboxPatch((80, 70), 15, 5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(t_box2)
    ax.text(87.5, 72.3, "Status: Open ▼", fontsize=7, color='#334155', ha='center')

    # Table Header
    tbl_hdr = patches.Rectangle((5, 62), 90, 4.5, facecolor='#F1F5F9', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(tbl_hdr)
    ax.text(7, 63.8, "SEVERITY", fontsize=7, fontweight='bold', color='#475569')
    ax.text(17, 63.8, "RULE ID", fontsize=7, fontweight='bold', color='#475569')
    ax.text(27, 63.8, "TOOL", fontsize=7, fontweight='bold', color='#475569')
    ax.text(37, 63.8, "SOURCE FILE & LINE", fontsize=7, fontweight='bold', color='#475569')
    ax.text(60, 63.8, "DIAGNOSTIC DESCRIPTION", fontsize=7, fontweight='bold', color='#475569')
    ax.text(86, 63.8, "STATUS", fontsize=7, fontweight='bold', color='#475569')

    # Rows
    rows = [
        ("CRITICAL", "#EF4444", "#FEF2F2", "B608", "Bandit", "app/auth/routes.py:84", "SQL Injection vector in authenticate_user()", "OPEN"),
        ("CRITICAL", "#EF4444", "#FEF2F2", "AST-EVAL", "Python AST", "utils/calc.py:23", "Untrusted string passed directly to eval()", "OPEN"),
        ("HIGH", "#F97316", "#FFF7ED", "B105", "Bandit", "config/settings.py:12", "Hardcoded database password credential", "OPEN"),
        ("HIGH", "#F97316", "#FFF7ED", "B602", "Bandit", "tasks/worker.py:45", "Subprocess call with shell=True parameter", "OPEN"),
        ("HIGH", "#F97316", "#FFF7ED", "B506", "Bandit", "data/importer.py:67", "Use of unsafe yaml.load without SafeLoader", "OPEN"),
        ("MEDIUM", "#EAB308", "#FEFCE8", "B303", "Bandit", "security/hash.py:19", "MD5 weak cryptographic hash function", "RESOLVED"),
        ("MEDIUM", "#EAB308", "#FEFCE8", "C901", "Ruff", "services/order.py:102", "High cyclomatic complexity score (14 > 10)", "OPEN"),
        ("LOW", "#3B82F6", "#EFF6FF", "F401", "Ruff", "models/base.py:4", "Module imported but unused: 'sys'", "OPEN"),
        ("LOW", "#3B82F6", "#EFF6FF", "E501", "Ruff", "controllers/api.py:55", "Line exceeds 88 character limit (94 chars)", "OPEN")
    ]
    ry = 57
    for sev, scol, sbg, rid, tool, fline, desc, st in rows:
        row_box = patches.Rectangle((5, ry), 90, 4.6, facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=0.6)
        ax.add_patch(row_box)
        
        b_box = FancyBboxPatch((6.5, ry + 0.9), 8.5, 2.8, boxstyle="round,pad=0.2", facecolor=sbg, edgecolor=scol, lw=0.7)
        ax.add_patch(b_box)
        ax.plot(7.7, ry + 2.3, 'o', color=scol, markersize=3)
        ax.text(11, ry + 1.8, sev[:4], fontsize=5.8, fontweight='bold', color=scol, ha='center')

        ax.text(17, ry + 1.8, rid, fontsize=6.8, fontweight='bold', color='#0F172A')
        ax.text(27, ry + 1.8, tool, fontsize=6.5, color='#475569')
        ax.text(37, ry + 1.8, fline, fontsize=6.5, color='#2563EB')
        ax.text(60, ry + 1.8, desc[:42], fontsize=6.5, color='#334155')

        st_bg = '#DCFCE7' if st == 'RESOLVED' else '#FEE2E2'
        st_fg = '#15803D' if st == 'RESOLVED' else '#B91C1C'
        st_box = FancyBboxPatch((85, ry + 0.9), 8.5, 2.8, boxstyle="round,pad=0.2", facecolor=st_bg, edgecolor=st_fg, lw=0.6)
        ax.add_patch(st_box)
        ax.text(89.2, ry + 1.8, st, fontsize=5.8, fontweight='bold', color=st_fg, ha='center')
        ry -= 4.8

    # Pagination footer
    ax.text(7, 10, "Showing 1 to 9 of 42 vulnerabilities  |  Page 1 of 5", fontsize=6.8, color='#64748B')
    ax.text(93, 10, "First   < Previous   [1]   2   3   Next >   Last", fontsize=6.8, color='#2563EB', ha='right')

    plt.tight_layout()
    plt.savefig("figures/fig11_findings_dashboard.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig11_findings_dashboard.png")

# -----------------------------------------------------------------------------
# FIGURE 12 & ui_mockup_findings: Finding Detail & AI Remediation
# -----------------------------------------------------------------------------
def create_fig12_and_mockup_findings():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — Contextual Code Inspection & AI Remediation Engine")
    draw_navbar(ax, active_tab="Dashboard")

    # Header Card for Selected Vulnerability
    head_card = FancyBboxPatch((5, 75), 90, 9.5, boxstyle="round,pad=0.3", facecolor='#FEF2F2', edgecolor='#EF4444', lw=1)
    ax.add_patch(head_card)
    
    badge = FancyBboxPatch((7, 80), 10, 3.2, boxstyle="round,pad=0.2", facecolor='#EF4444')
    ax.add_patch(badge)
    ax.text(12, 81.2, "CRITICAL", fontsize=6.5, fontweight='bold', color='#FFFFFF', ha='center')

    ax.text(19, 82, "Rule: B608 — Possible SQL Injection vector via string formatting", fontsize=9, fontweight='bold', color='#991B1B')
    ax.text(19, 78.5, "File: app/auth/routes.py  |  Line: 84  |  Tool: Bandit SAST  |  CWE: CWE-89 (Improper Neutralization)", fontsize=6.8, color='#7F1D1D')
    ax.text(19, 76, "Status: OPEN  |  Confidence: HIGH  |  Detected: 2026-11-02 14:22 UTC", fontsize=6.5, color='#991B1B')

    # Left: Code Snippet Viewer in Light IDE Theme
    code_box = FancyBboxPatch((5, 12), 44, 60, boxstyle="round,pad=0.4", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.2)
    ax.add_patch(code_box)
    
    # Code viewer header
    c_head = patches.Rectangle((5, 67), 44, 5, facecolor='#F8FAFC', edgecolor='#E2E8F0', lw=1)
    ax.add_patch(c_head)
    ax.text(7, 69, "SOURCE CODE CONTEXT (± 2 Lines)", fontsize=7.2, fontweight='bold', color='#0F172A')
    ax.text(47, 69, "app/auth/routes.py", fontsize=6.5, color='#64748B', ha='right')

    lines = [
        ("81", "def authenticate_user(username, password):", '#475569', False),
        ("82", "    # Fetch user record from database", '#94A3B8', False),
        ("83", "    cursor = db.get_cursor()", '#475569', False),
        ("84", ">>> query = f\"SELECT * FROM users WHERE u='{username}'\"", '#DC2626', True),
        ("85", "    cursor.execute(query)", '#475569', False),
        ("86", "    user = cursor.fetchone()", '#475569', False),
        ("87", "    if not user:", '#475569', False),
        ("88", "        return None", '#475569', False)
    ]
    cy = 60
    for lno, ctext, ccol, is_vuln in lines:
        if is_vuln:
            ax.add_patch(patches.Rectangle((5.5, cy - 2), 43, 5, facecolor='#FEE2E2', edgecolor='#EF4444', lw=0.6))
        ax.text(8, cy, lno, fontsize=6.8, fontweight='bold', color='#94A3B8')
        ax.text(12, cy, ctext, fontsize=6.5, fontfamily='monospace', fontweight='bold' if is_vuln else 'normal', color=ccol)
        cy -= 5.5

    # Right: AI Remediation & Fix Advice (Light Green Card)
    ai_box = FancyBboxPatch((51, 12), 44, 60, boxstyle="round,pad=0.4", facecolor='#F0FDF4', edgecolor='#86EFAC', lw=1.2)
    ax.add_patch(ai_box)

    ax.text(53, 68, "AI-ASSISTED ROOT CAUSE & SECURE REMEDIATION", fontsize=7.5, fontweight='bold', color='#14532D')

    ax.text(53, 63.5, "Root Cause Analysis:", fontsize=7.2, fontweight='bold', color='#166534')
    ax.text(53, 56.5, "Direct f-string concatenation in SQL statements permits an attacker\n"
                      "to inject arbitrary SQL payloads (e.g., ' OR '1'='1), completely\n"
                      "bypassing authentication or dumping sensitive password hashes.", 
            fontsize=6.5, color='#14532D')

    ax.text(53, 51.5, "Secure Recommended Fix (Parameterized Query):", fontsize=7.2, fontweight='bold', color='#166534')

    # White Code Fix Box
    fix_box = FancyBboxPatch((53, 29), 40, 20, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#BBF7D0', lw=1)
    ax.add_patch(fix_box)
    
    fix_lines = [
        ("# 1. Use bind parameter placeholder (:u)", '#64748B'),
        ("query = \"\"\"", '#0F172A'),
        ("    SELECT id, username, hashed_pw", '#0F172A'),
        ("    FROM users WHERE username = :u", '#16A34A'),
        ("\"\"\"", '#0F172A'),
        ("cursor.execute(query, {'u': username})", '#16A34A')
    ]
    fy = 45
    for fl, fc in fix_lines:
        ax.text(55, fy, fl, fontsize=6.2, fontfamily='monospace', color=fc, fontweight='bold' if ':u' in fl else 'normal')
        fy -= 2.8

    ax.text(53, 24, "OWASP Reference: A03:2021 — Injection", fontsize=6.5, fontweight='bold', color='#15803D')
    ax.text(53, 21, "CWE Reference: CWE-89 SQL Command Neutralization", fontsize=6.5, color='#15803D')

    # Action Buttons
    btn_res = FancyBboxPatch((53, 14), 18, 5, boxstyle="round,pad=0.2", facecolor='#16A34A', edgecolor='#15803D')
    ax.add_patch(btn_res)
    ax.text(62, 16.2, "✓ Mark as Resolved", fontsize=7, fontweight='bold', color='#FFFFFF', ha='center')

    btn_fp = FancyBboxPatch((73, 14), 20, 5, boxstyle="round,pad=0.2", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(btn_fp)
    ax.text(83, 16.2, "Mark as False Positive", fontsize=7, color='#64748B', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig12_finding_detail.png", bbox_inches='tight', dpi=300)
    plt.savefig("figures/ui_mockup_findings.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig12_finding_detail.png & ui_mockup_findings.png")

# -----------------------------------------------------------------------------
# FIGURE 13: Report Preview & PDF Download
# -----------------------------------------------------------------------------
def create_fig13_report_export():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    draw_window_chrome(ax, "CodeGuard Enterprise — Audit Report Generation & PDF Preview")
    draw_navbar(ax, active_tab="Dashboard")

    # Dim overlay
    dim = patches.Rectangle((2, 2), 96, 90, facecolor='#0F172A', alpha=0.12)
    ax.add_patch(dim)

    # Modal Dialog
    modal = FancyBboxPatch((18, 10), 64, 76, boxstyle="round,pad=0.5", facecolor='#FFFFFF', edgecolor='#94A3B8', lw=1.5)
    ax.add_patch(modal)

    # Modal Title
    ax.text(22, 81.5, "Export Formal Security Audit Report", fontsize=10.5, fontweight='bold', color='#0F172A')
    ax.text(22, 78.5, "Generate publication-grade PDF or structured SARIF / JSON artifacts", fontsize=7, color='#64748B')
    ax.plot([22, 78], [76, 76], color='#E2E8F0', lw=1)

    # Left: PDF Document Preview Thumbnail
    p_thumb = FancyBboxPatch((22, 24), 26, 48, boxstyle="round,pad=0.3", facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.2)
    ax.add_patch(p_thumb)

    # Preview header banner
    t_hdr = patches.Rectangle((22, 66), 26, 6, facecolor='#1E3A8A')
    ax.add_patch(t_hdr)
    ax.text(35, 68.8, "CodeGuard Audit Report", fontsize=6.8, fontweight='bold', color='#FFFFFF', ha='center')

    ax.text(24, 61, "Target: e-commerce-api", fontsize=6.2, fontweight='bold', color='#0F172A')
    ax.text(24, 58, "Scan Date: 2026-11-02", fontsize=5.5, color='#64748B')
    ax.text(24, 55, "Security Grade: Elevated Risk", fontsize=5.8, fontweight='bold', color='#DC2626')

    # Mini chart placeholder
    chart_bg = patches.Rectangle((24, 42), 22, 10, facecolor='#F8FAFC', edgecolor='#E2E8F0')
    ax.add_patch(chart_bg)
    ax.text(35, 46.5, "[ Severity Distribution ]\n2 Crit • 5 High • 11 Med", fontsize=5.5, color='#475569', ha='center')

    # Mini table lines
    for ly in [38, 35, 32, 29]:
        ax.plot([24, 46], [ly, ly], color='#E2E8F0', lw=1)
    ax.text(35, 26, "Page 1 of 8 (Executive Summary)", fontsize=5, color='#94A3B8', ha='center')

    # Right: Export Options & Controls
    ax.text(52, 71, "Select Export Format:", fontsize=7.5, fontweight='bold', color='#0F172A')

    # Radio 1: PDF
    ax.plot(53, 65, 'o', color='#2563EB', markersize=6)
    ax.plot(53, 65, 'o', color='#FFFFFF', markersize=2.5)
    ax.text(56, 65.5, "Formal PDF Report (Vector Tables & Visuals)", fontsize=7.2, fontweight='bold', color='#0F172A')
    ax.text(56, 63, "Standard for academic submission and stakeholder sign-off", fontsize=6.2, color='#64748B')

    # Radio 2: JSON
    ax.plot(53, 56, 'o', color='#94A3B8', markersize=6)
    ax.text(56, 56.5, "Raw JSON Findings Payload", fontsize=7.2, fontweight='bold', color='#334155')
    ax.text(56, 54, "Programmatic ingestion into CI/CD pipelines & SIEM tools", fontsize=6.2, color='#64748B')

    # Radio 3: SARIF
    ax.plot(53, 47, 'o', color='#94A3B8', markersize=6)
    ax.text(56, 47.5, "OASIS SARIF v2.1.0 Standard", fontsize=7.2, fontweight='bold', color='#334155')
    ax.text(56, 45, "Direct integration with GitHub Advanced Security & Sonar", fontsize=6.2, color='#64748B')

    # Report Sections checklist
    ax.text(52, 38, "Included Sections:", fontsize=7.2, fontweight='bold', color='#0F172A')
    ax.text(52, 33.5, "☑ Executive Summary & KPIs\n☑ Complete Finding Matrix Table\n☑ Contextual Code & AI Remediation\n☑ Historical Scan Diff Comparison", 
            fontsize=6.5, color='#334155')

    # Action Buttons
    btn_dl = FancyBboxPatch((52, 16), 26, 5.2, boxstyle="round,pad=0.2", facecolor='#2563EB', edgecolor='#1D4ED8')
    ax.add_patch(btn_dl)
    ax.text(65, 18.2, "⬇ Download PDF Report", fontsize=7.5, fontweight='bold', color='#FFFFFF', ha='center')

    plt.tight_layout()
    plt.savefig("figures/fig13_report_export.png", bbox_inches='tight', dpi=300)
    plt.close()
    print("Created fig13_report_export.png")

if __name__ == "__main__":
    create_fig7_mobile_layout()
    create_fig8_login_screen()
    create_fig9_and_mockup_dashboard()
    create_fig10_upload_progress()
    create_fig11_findings_dashboard()
    create_fig12_and_mockup_findings()
    create_fig13_report_export()
    print("Successfully created all 7 white theme UI figures + 2 updated mockups!")
