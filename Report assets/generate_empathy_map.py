import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import textwrap

os.makedirs('report_assets', exist_ok=True)

# High-resolution figure
fig, ax = plt.subplots(figsize=(15, 9.5), dpi=300)
fig.patch.set_facecolor('#F8FAFC')
ax.set_facecolor('#F8FAFC')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# 1. Top Header Banner
header_box = patches.FancyBboxPatch(
    (3, 88), 94, 9.5,
    boxstyle='round,pad=0.6,rounding_size=2',
    fc='#0F172A', ec='none'
)
ax.add_patch(header_box)
ax.text(50, 94.2, 'ODD GEN – Empathy Map', ha='center', va='center',
        fontsize=17, weight='bold', color='#FFFFFF')
ax.text(50, 90.2, 'Understanding the needs, pains, and operational expectations of enterprise users across CRM, POS, Inventory, and ERP workflows',
        ha='center', va='center', fontsize=9.5, color='#94A3B8')

def draw_card(x, y, w, h, title, icon_text, items, bg_color, header_color, text_color='#1E293B'):
    # Card Background
    card = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle='round,pad=0.5,rounding_size=1.8',
        fc=bg_color, ec='#CBD5E1', lw=1.2
    )
    ax.add_patch(card)
    
    # Header tag
    badge = patches.FancyBboxPatch(
        (x + 2.5, y + h - 5.5), 16, 4.2,
        boxstyle='round,pad=0.3,rounding_size=1',
        fc=header_color, ec='none'
    )
    ax.add_patch(badge)
    ax.text(x + 10.5, y + h - 3.4, f"{icon_text}  {title}", ha='center', va='center',
            fontsize=11, weight='bold', color='#FFFFFF')
    
    # Bullet points
    cur_y = y + h - 8.5
    for item in items:
        wrapped = textwrap.fill(item, width=44)
        lines = wrapped.split('\n')
        # Bullet dot
        ax.text(x + 3.8, cur_y, '●', ha='right', va='top', fontsize=7.5, color=header_color)
        # Text
        ax.text(x + 5.2, cur_y, wrapped, ha='left', va='top', fontsize=9.0, color=text_color, linespacing=1.25)
        cur_y -= (len(lines) * 2.5 + 1.6)

# 2. SAYS (Top-Left)
draw_card(3, 58, 42, 27, 'SAYS', 'SPEECH', [
    '"Why do I have to input customer details 3 times in 3 different systems?"',
    '"Is our warehouse inventory count actually up-to-date in real-time?"',
    '"Waiting days for month-end invoices delays our cash flow decisions."',
    '"I need one single dashboard for sales, POS, and accounting."'
], '#F0F9FF', '#0284C7')

# 3. THINKS (Top-Right)
draw_card(55, 58, 42, 27, 'THINKS', 'MIND', [
    '"Our competitors fulfill orders in minutes because their software is unified."',
    '"One manual typo in this spreadsheet can collapse our production schedule."',
    '"Can an AI Copilot automate our stock reorders and invoice parsing?"',
    '"Will a modern web ERP eliminate human transcription errors?"'
], '#FAF5FF', '#7E22CE')

# 4. DOES (Middle-Left)
draw_card(3, 28, 42, 27, 'DOES', 'ACTION', [
    'Manually copies data between CRM, POS, and accounting spreadsheets.',
    'Walks to the warehouse to physically verify component availability.',
    'Constantly toggles between 10+ browser windows and Excel sheets.',
    'Prints physical documents for manual pen-and-paper signatures.'
], '#F0FDF4', '#15803D')

# 5. FEELS (Middle-Right)
draw_card(55, 28, 42, 27, 'FEELS', 'HEART', [
    'Overwhelmed during month-end financial audits and tax reconciliation.',
    'Frustrated when checkout queues slow down at POS cashier counters.',
    'Anxious when ghost inventory discrepancies lead to cancelled client orders.',
    'Helpless and fatigued by clunky legacy software interfaces.'
], '#FFFBEB', '#B45309')

# 6. PAINS (Bottom-Left)
draw_card(3, 3, 46, 22, 'PAINS', 'ALERT', [
    'Severe software fragmentation and data silos across departments.',
    'High human transcription error rate during manual data re-entry.',
    'Ghost stock and inventory discrepancies from delayed batch updates.',
    'Excessive licensing and maintenance costs for legacy ERP solutions.'
], '#FEF2F2', '#DC2626')

# 7. GAINS (Bottom-Right)
draw_card(51, 3, 46, 22, 'GAINS', 'GOAL', [
    'Single unified platform: CRM, Sales, POS, MRP, Invoicing, & Inventory.',
    'Instantaneous real-time data synchronization across all modules.',
    'Sub-second POS transactions with touch-friendly responsive interface.',
    'Embedded AI Copilot for smart analytics, voice queries & auto-reordering.'
], '#ECFDF5', '#047857')

# 8. Center Avatar & Target Persona Badge
center_circ = patches.Circle((49, 56), 5.2, fc='#FFFFFF', ec='#3B82F6', lw=2.5, zorder=5)
ax.add_patch(center_circ)

# Silhouette / Avatar drawing
head = patches.Circle((49, 57.5), 1.8, fc='#3B82F6', ec='none', zorder=6)
body = patches.Ellipse((49, 53.5), 5.0, 3.5, fc='#3B82F6', ec='none', zorder=6)
ax.add_patch(head)
ax.add_patch(body)

# Target persona badge
target_badge = patches.FancyBboxPatch(
    (38.5, 43.5), 21, 6.8,
    boxstyle='round,pad=0.4,rounding_size=1.2',
    fc='#0F172A', ec='#38BDF8', lw=1.2, zorder=5
)
ax.add_patch(target_badge)
ax.text(49, 47.8, 'Target Persona', ha='center', va='center',
        fontsize=9.5, weight='bold', color='#38BDF8', zorder=6)
ax.text(49, 45.0, 'Operations, Cashiers, Sales, Accountants', ha='center', va='center',
        fontsize=7.2, color='#E2E8F0', zorder=6)

plt.subplots_adjust(left=0.01, right=0.99, top=0.99, bottom=0.01)
output_path = os.path.join('report_assets', 'fig_3_2_empathy_map.png')
plt.savefig(output_path, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f'Successfully generated {output_path}')
