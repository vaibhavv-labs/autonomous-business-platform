"""
Premium Theme Injector - 10/10 Professional UI
Complete glassmorphism dark theme with animations, typography, and polish.
"""
import streamlit as st


def inject_premium_css():
    """Inject comprehensive premium CSS for a 10/10 professional UI."""
    st.markdown(
        """
    <style>
    /* ============================================================
       FONT IMPORT
    ============================================================ */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    /* ============================================================
       ROOT & GLOBAL RESET
    ============================================================ */
    :root {
        --primary:       #6366f1;
        --primary-dark:  #4f46e5;
        --primary-light: #818cf8;
        --accent:        #a78bfa;
        --success:       #10b981;
        --warning:       #f59e0b;
        --danger:        #ef4444;
        --bg-deep:       #070b14;
        --bg-main:       #0d1117;
        --bg-card:       rgba(22, 28, 45, 0.80);
        --bg-hover:      rgba(40, 50, 74, 0.90);
        --border:        rgba(99, 102, 241, 0.15);
        --border-hover:  rgba(99, 102, 241, 0.40);
        --text-primary:  #f1f5f9;
        --text-secondary:#94a3b8;
        --text-muted:    #64748b;
        --glow:          0 0 20px rgba(99, 102, 241, 0.35);
        --shadow-card:   0 4px 24px rgba(0, 0, 0, 0.4);
        --radius:        12px;
        --radius-sm:     8px;
        --radius-lg:     16px;
        --transition:    all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
    }

    /* ============================================================
       APP BACKGROUND
    ============================================================ */
    .stApp {
        background: radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 80%, rgba(167, 139, 250, 0.05) 0%, transparent 60%),
                    var(--bg-main) !important;
        min-height: 100vh;
    }

    /* ============================================================
       SIDEBAR - GLASSMORPHISM
    ============================================================ */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, rgba(13, 17, 27, 0.97) 0%, rgba(10, 14, 23, 0.99) 100%) !important;
        border-right: 1px solid var(--border) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
    }

    [data-testid="stSidebar"] > div:first-child {
        padding-top: 1rem !important;
    }

    /* ============================================================
       MAIN CONTENT CONTAINER
    ============================================================ */
    .block-container {
        padding: 1.5rem 2rem !important;
        max-width: 100% !important;
    }

    /* ============================================================
       TYPOGRAPHY
    ============================================================ */
    h1, h2, h3, h4, h5, h6,
    .stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {
        font-family: 'Inter', sans-serif !important;
        color: var(--text-primary) !important;
        letter-spacing: -0.03em !important;
        line-height: 1.25 !important;
    }

    h1, .stMarkdown h1 { font-size: 2rem !important; font-weight: 800 !important; }
    h2, .stMarkdown h2 { font-size: 1.5rem !important; font-weight: 700 !important; }
    h3, .stMarkdown h3 { font-size: 1.2rem !important; font-weight: 600 !important; }

    p, li, .stMarkdown p {
        color: var(--text-secondary) !important;
        line-height: 1.7 !important;
        font-size: 0.95rem !important;
    }

    /* Main header brand */
    .main-header {
        font-size: 2rem !important;
        font-weight: 800 !important;
        background: linear-gradient(135deg, #f1f5f9 0%, var(--accent) 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        margin-bottom: 0.25rem !important;
        letter-spacing: -0.04em;
    }

    /* ============================================================
       BUTTONS - PREMIUM GRADIENT STYLE
    ============================================================ */
    /* Primary buttons */
    .stButton > button[kind="primary"],
    .stButton > button[data-baseweb="button"][kind="primary"] {
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%) !important;
        color: #fff !important;
        border: none !important;
        border-radius: var(--radius-sm) !important;
        font-weight: 600 !important;
        font-size: 0.875rem !important;
        letter-spacing: 0.02em !important;
        padding: 0.55rem 1.1rem !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35) !important;
        transition: var(--transition) !important;
        width: 100% !important;
    }
    .stButton > button[kind="primary"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.50) !important;
        filter: brightness(1.1) !important;
    }
    .stButton > button[kind="primary"]:active {
        transform: translateY(0px) !important;
    }

    /* Secondary buttons */
    .stButton > button[kind="secondary"],
    .stButton > button {
        background: var(--bg-card) !important;
        color: var(--text-primary) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        padding: 0.5rem 1rem !important;
        transition: var(--transition) !important;
        width: 100% !important;
    }
    .stButton > button[kind="secondary"]:hover,
    .stButton > button:hover {
        border-color: var(--border-hover) !important;
        background: var(--bg-hover) !important;
        color: #fff !important;
        transform: translateY(-1px) !important;
        box-shadow: var(--shadow-card) !important;
    }
    .stButton > button:active {
        transform: translateY(0px) !important;
    }

    /* ============================================================
       QUICK NAV EMOJI BUTTONS (top navigation strip)
    ============================================================ */
    div[data-testid="column"] .stButton > button {
        border-radius: 8px !important;
        padding: 0.5rem 0.3rem !important;
        font-size: 1.1rem !important;
        min-height: 42px !important;
        line-height: 1 !important;
    }

    /* ============================================================
       INPUT FIELDS
    ============================================================ */
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea,
    .stNumberInput > div > div > input {
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.9rem !important;
        transition: var(--transition) !important;
    }
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus,
    .stNumberInput > div > div > input:focus {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
        background: rgba(22, 28, 45, 0.95) !important;
        outline: none !important;
    }
    .stTextInput label, .stTextArea label, .stNumberInput label,
    .stSelectbox label, .stMultiSelect label, .stSlider label,
    .stCheckbox label, .stRadio label {
        color: var(--text-secondary) !important;
        font-size: 0.85rem !important;
        font-weight: 500 !important;
        letter-spacing: 0.02em !important;
    }

    /* ============================================================
       SELECT / MULTISELECT / DROPDOWNS
    ============================================================ */
    .stSelectbox > div > div,
    .stMultiSelect > div > div {
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
    }
    .stSelectbox > div > div:focus-within,
    .stMultiSelect > div > div:focus-within {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
    }

    /* ============================================================
       EXPANDERS / ACCORDIONS
    ============================================================ */
    .streamlit-expanderHeader {
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
        padding: 0.75rem 1rem !important;
        transition: var(--transition) !important;
    }
    .streamlit-expanderHeader:hover {
        background: var(--bg-hover) !important;
        border-color: var(--border-hover) !important;
        box-shadow: var(--shadow-card) !important;
    }
    .streamlit-expanderContent {
        background: rgba(13, 17, 27, 0.6) !important;
        border: 1px solid var(--border) !important;
        border-top: none !important;
        border-radius: 0 0 var(--radius-sm) var(--radius-sm) !important;
        padding: 1rem !important;
    }

    /* ============================================================
       TABS (Horizontal Tabs)
    ============================================================ */
    .stTabs [data-baseweb="tab-list"] {
        background: transparent !important;
        border-bottom: 1px solid var(--border) !important;
        gap: 0.25rem !important;
    }
    .stTabs [data-baseweb="tab"] {
        background: transparent !important;
        color: var(--text-muted) !important;
        border: none !important;
        border-radius: var(--radius-sm) var(--radius-sm) 0 0 !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        padding: 0.5rem 1rem !important;
        transition: var(--transition) !important;
    }
    .stTabs [data-baseweb="tab"]:hover {
        color: var(--text-primary) !important;
        background: var(--bg-card) !important;
    }
    .stTabs [aria-selected="true"] {
        color: var(--primary-light) !important;
        background: rgba(99, 102, 241, 0.1) !important;
        border-bottom: 2px solid var(--primary) !important;
        font-weight: 600 !important;
    }
    .stTabs [data-baseweb="tab-panel"] {
        background: transparent !important;
        padding: 1rem 0 !important;
    }

    /* ============================================================
       METRICS
    ============================================================ */
    [data-testid="stMetricContainer"] {
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        padding: 1.25rem !important;
        transition: var(--transition) !important;
    }
    [data-testid="stMetricContainer"]:hover {
        border-color: var(--border-hover) !important;
        box-shadow: var(--glow) !important;
    }
    [data-testid="stMetricValue"] {
        font-size: 2rem !important;
        font-weight: 800 !important;
        color: var(--text-primary) !important;
        letter-spacing: -0.03em !important;
    }
    [data-testid="stMetricLabel"] {
        color: var(--text-secondary) !important;
        font-size: 0.8rem !important;
        font-weight: 500 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
    }
    [data-testid="stMetricDelta"] {
        font-size: 0.8rem !important;
        font-weight: 600 !important;
    }

    /* ============================================================
       ALERTS / INFO BOXES
    ============================================================ */
    .stInfo, [data-testid="stInfo"] {
        background: rgba(99, 102, 241, 0.08) !important;
        border: 1px solid rgba(99, 102, 241, 0.25) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
    }
    .stSuccess, [data-testid="stSuccess"] {
        background: rgba(16, 185, 129, 0.08) !important;
        border: 1px solid rgba(16, 185, 129, 0.25) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
    }
    .stWarning, [data-testid="stWarning"] {
        background: rgba(245, 158, 11, 0.08) !important;
        border: 1px solid rgba(245, 158, 11, 0.25) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
    }
    .stError, [data-testid="stError"] {
        background: rgba(239, 68, 68, 0.08) !important;
        border: 1px solid rgba(239, 68, 68, 0.25) !important;
        border-radius: var(--radius-sm) !important;
        color: var(--text-primary) !important;
    }

    /* ============================================================
       SPINNER / PROGRESS
    ============================================================ */
    .stSpinner > div {
        border-top-color: var(--primary) !important;
    }
    .stProgress > div > div {
        background: linear-gradient(90deg, var(--primary), var(--accent)) !important;
        border-radius: 999px !important;
    }

    /* ============================================================
       DATAFRAMES / TABLES
    ============================================================ */
    [data-testid="stDataFrameContainer"] {
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
    }

    /* ============================================================
       FILE UPLOADER
    ============================================================ */
    [data-testid="stFileUploader"] {
        background: var(--bg-card) !important;
        border: 2px dashed var(--border) !important;
        border-radius: var(--radius) !important;
        transition: var(--transition) !important;
    }
    [data-testid="stFileUploader"]:hover {
        border-color: var(--primary) !important;
        background: rgba(99, 102, 241, 0.05) !important;
    }

    /* ============================================================
       SLIDERS
    ============================================================ */
    [data-testid="stSlider"] > div > div > div > div {
        background: linear-gradient(90deg, var(--primary), var(--accent)) !important;
    }
    [data-testid="stSlider"] [role="slider"] {
        background: var(--primary) !important;
        box-shadow: 0 0 8px rgba(99, 102, 241, 0.5) !important;
        border: 2px solid #fff !important;
    }

    /* ============================================================
       CHECKBOXES & RADIO
    ============================================================ */
    [data-testid="stCheckbox"] > div > div > div {
        border-color: var(--border-hover) !important;
    }
    [data-testid="stCheckbox"] > div > div > div[data-checked="true"] {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
    }

    /* ============================================================
       CODE BLOCKS
    ============================================================ */
    code, .stCode pre {
        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
        background: rgba(0, 0, 0, 0.35) !important;
        border-radius: 6px !important;
        font-size: 0.82rem !important;
    }

    /* ============================================================
       DIVIDER
    ============================================================ */
    hr, .stMarkdown hr {
        border: none !important;
        height: 1px !important;
        background: linear-gradient(90deg, transparent, var(--border), transparent) !important;
        margin: 1.5rem 0 !important;
    }

    /* ============================================================
       TOASTS / NOTIFICATIONS
    ============================================================ */
    [data-testid="stToast"] {
        background: rgba(13, 17, 27, 0.95) !important;
        border: 1px solid var(--border-hover) !important;
        border-left: 4px solid var(--primary) !important;
        border-radius: var(--radius-sm) !important;
        backdrop-filter: blur(12px) !important;
        color: var(--text-primary) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
    }

    /* ============================================================
       CAPTION / FOOTER TEXT
    ============================================================ */
    .stCaption, [data-testid="stCaption"] {
        color: var(--text-muted) !important;
        font-size: 0.78rem !important;
    }

    /* ============================================================
       SCROLLBARS
    ============================================================ */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.25);
        border-radius: 999px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.5);
    }

    /* ============================================================
       TOP TOOLBAR HIDE (clean look)
    ============================================================ */
    #MainMenu, footer, header { visibility: hidden; }
    [data-testid="stDeployButton"] { display: none; }
    [data-testid="stDecoration"] { display: none !important; }

    /* ============================================================
       CARD HELPER CLASS (used with st.markdown)
    ============================================================ */
    .premium-card {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: var(--transition);
        box-shadow: var(--shadow-card);
    }
    .premium-card:hover {
        border-color: var(--border-hover);
        box-shadow: var(--glow), var(--shadow-card);
        transform: translateY(-2px);
    }

    /* Gradient badge */
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.04em;
    }
    .badge-primary {
        background: rgba(99, 102, 241, 0.15);
        color: var(--primary-light);
        border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .badge-success {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge-warning {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }

    /* ============================================================
       ANIMATED GRADIENT SECTION HEADER
    ============================================================ */
    .section-header {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.03em;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
    }
    .section-subtext {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: -0.5rem;
        margin-bottom: 1rem;
    }

    /* ============================================================
       IMAGE DISPLAY
    ============================================================ */
    [data-testid="stImage"] img {
        border-radius: var(--radius) !important;
        border: 1px solid var(--border) !important;
        transition: var(--transition) !important;
    }
    [data-testid="stImage"] img:hover {
        border-color: var(--border-hover) !important;
        box-shadow: var(--glow) !important;
    }

    /* ============================================================
       SELECTBOX DROPDOWN POPUP
    ============================================================ */
    [data-baseweb="popover"],
    [data-baseweb="select"] ul {
        background: rgba(13, 17, 27, 0.98) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        backdrop-filter: blur(20px) !important;
    }
    [data-baseweb="option"]:hover {
        background: rgba(99, 102, 241, 0.1) !important;
    }
    [data-baseweb="option"][aria-selected="true"] {
        background: rgba(99, 102, 241, 0.2) !important;
        color: var(--primary-light) !important;
    }

    /* ============================================================
       QUICK-NAV BUTTON STRIP SPECIAL STYLING
    ============================================================ */
    .nav-pill-selected > .stButton > button {
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%) !important;
        color: #fff !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
    }

    /* ============================================================
       PREMIUM FOOTER BAR
    ============================================================ */
    .premium-footer {
        text-align: center;
        padding: 1.5rem 0 0.5rem;
        color: var(--text-muted);
        font-size: 0.8rem;
        border-top: 1px solid var(--border);
        margin-top: 2rem;
    }
    .premium-footer span {
        background: linear-gradient(90deg, var(--primary-light), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
    }

    </style>
    """,
        unsafe_allow_html=True,
    )


def inject_premium_footer():
    """Inject a beautiful footer."""
    st.markdown(
        """
    <div class="premium-footer">
        <span>Autonomous Business Platform Pro v2.1</span> &nbsp;·&nbsp;
        Powered by Multi-Agent AI &amp; Browser-Use
    </div>
    """,
        unsafe_allow_html=True,
    )
