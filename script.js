const menuButton = document.querySelector('.menu');
const nav = document.querySelector('.links');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuButton.setAttribute(
      'aria-expanded',
      nav.classList.contains('open') ? 'true' : 'false'
    );
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const el = document.querySelector(link.getAttribute('href'));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================
   Disease Services Browser
   ========================= */

const diseaseCatalog = {
  vatha: {
    label: "වාත",
    title: "වාත රෝග",
    intro: "වාත ගුණාංග සමඟ සම්බන්ධ රෝග වර්ග.",
    items: [
      { no: "01", name: "ස්නායු රෝග" },
      { no: "02", name: "හන්දි කැක්කුම" },
      { no: "03", name: "කොන්දේ කැක්කුම" },
      { no: "04", name: "වෙව්ලීම" },
      { no: "05", name: "සීතලට අකමැති වීම" },
      { no: "06", name: "ශරීරය කෙට්ටු වීම" },
      { no: "07", name: "ශරීරය රත් කට පහත වීම" },
      { no: "08", name: "මල බද්ධය" },
      { no: "09", name: "වාත කැක්කුම" },
      { no: "10", name: "අප්‍රාණිකත්වය / ක්ලාන්තික මෝචනය" },
      { no: "11", name: "නහර ගැට ගැසීම" },
      { no: "12", name: "සන්ධි ඉදිමීම හා කැක්කුම" },
      { no: "13", name: "හෘදයාබාධ" },
      { no: "14", name: "අංගභාගය" },
      { no: "15", name: "සයටිකා (ගුදසි)" },
      { no: "16", name: "විලුඹ කැක්කුම" },
      { no: "17", name: "අත - පය ඇඟිලි හිරි වැටීම" },
      { no: "18", name: "කොලෙස්ටරෝල්" },
      { no: "19", name: "අක්මාවේ රෝග" },
      { no: "20", name: "අඩි රැසර පීඩනය" }
    ]
  },

  pitha: {
    label: "පිත",
    title: "පිත රෝග",
    intro: "උෂ්ණත්වය, දාහය, අමිලතාව සහ ආහාරමය/ශරීරමය ගැටලු සම්බන්ධ රෝග වර්ග.",
    items: [
      { no: "21", name: "දිව පැලීම, කකුල් පැලීම" },
      { no: "22", name: "අමිල පිත්තය (ගැස්ට්‍රයිටීස්)" },
      { no: "23", name: "රක්ත පිත්තය (ලේ උෂ්ණ වීම)" },
      { no: "24", name: "කුරුලෑ ගෙඩි" },
      { no: "25", name: "රක්ත ප්‍රදරය (ආර්ථව චක්‍රයේ ගැටලු)" },
      { no: "26", name: "ස්වේත ප්‍රදරය (සුදු යාම)" },
      { no: "27", name: "ශරීර දාහය (ඇඟ දැවිල්ල)" },
      { no: "28", name: "වර්ණ රෝග / දද / කුෂ්ඨ" },
      { no: "29", name: "අර්ශස්" },
      { no: "30", name: "ගර්භාශයේ ගෙඩි, පැලෝපීය නාල වල ගෙඩි" },
      { no: "31", name: "අරුචිය, උද්ගාරය (බඩ පිපුම)" },
      { no: "32", name: "ආහාර අසාත්මිකතාව" },
      { no: "33", name: "තයිරොක්සින්" },
      { no: "34", name: "මලබද්ධය" },
      { no: "35", name: "අග්නි මාන්දය (කුසගිනි නොමැතිකම)" },
      { no: "36", name: "තට්ටය ඇති වීම" },
      { no: "37", name: "අස්වාභාවිකව හිසකෙස් ගැලවී යාම" },
      { no: "38", name: "හිසකෙස් තඹ වීම" },
      { no: "39", name: "හිස්හොරි" },
      { no: "40", name: "හර්නියා" },
      { no: "41", name: "පුරුස්මී ග්‍රන්ථි ප්‍රදාහය" },
      { no: "42", name: "මුත්‍ර පුදරය" }
    ]
  },

  kapha: {
    label: "කප",
    title: "කප (සෙම) රෝග",
    intro: "සෙම, හුස්ම ගැනීම, බර බව සහ නිදිමත සම්බන්ධ රෝග වර්ග.",
    items: [
      { no: "43", name: "ඇදුම" },
      { no: "44", name: "හතිය" },
      { no: "45", name: "පපුවේ මහන්සිය" },
      { no: "46", name: "කිවිසුම් යෑම" },
      { no: "47", name: "උගුර, කණ කැසීම" },
      { no: "48", name: "හොටු දියර ගැලීම" },
      { no: "49", name: "ඉරුවාරදය (මිග්‍රේන්)" },
      { no: "50", name: "සයනොසයිටීස් (කූටක ප්‍රදාහය)" },
      { no: "51", name: "අලස බව" },
      { no: "52", name: "අග්නි මාන්දය (කසගිනි නොමැතිකම)" },
      { no: "53", name: "නිද්‍රාව (නිදිමත බව)" },
      { no: "54", name: "ශරීරය තරබාරු වීම" },
      { no: "55", name: "මුහුණ හිස බර බව" },
      { no: "56", name: "ඇස් යට කළු වීම" },
      { no: "57", name: "ගඳ සුවඳ නොදැනීම" }
    ]
  }
};

function buildDiseaseDetail(categoryKey, item) {
  const category = diseaseCatalog[categoryKey];

  return `
    <span class="detail-chip">${category.label}</span>
    <h3>${item.name}</h3>
    <p>
      <strong>${item.name}</strong> සඳහා මෙම විස්තරය දැනට තාවකාලික editable ආකාරයෙන් සකස් කර ඇත.
      මෙම කොටස තුළ රෝගයේ හේතු, ලක්ෂණ, ප්‍රතිකාර ක්‍රම, ආහාර උපදෙස් සහ විශේෂ මාර්ගෝපදේශ
      පසුව ඔබට අවශ්‍ය පරිදි සංස්කරණය කර එක් කළ හැක.
    </p>

    <div class="detail-grid">
      <div class="detail-card">
        <h4>මූලික හැඳින්වීම</h4>
        <p>
          ${item.name} යනු <strong>${category.label}</strong> ගණයට අයත් තත්ත්වයක් ලෙස මෙම පිටුවේ වර්ගීකරණය කර ඇත.
          මෙහි රෝගය පිළිබඳ කෙටි professional description එකක් දැනට placeholder ආකාරයෙන් පෙන්වයි.
        </p>
      </div>

      <div class="detail-card">
        <h4>පසුව edit කළ හැකි කරුණු</h4>
        <p>
          රෝග ලක්ෂණ, හේතු, ප්‍රතිකාර සැලැස්ම, භාවිතා කරන ඖෂධ, පංචකර්ම ක්‍රම, සහ ආහාර/ජීවන රටා උපදෙස්
          මේ කොටසට පසුව එක් කළ හැක.
        </p>
      </div>

      <div class="detail-card">
        <h4>රෝගියාට දෙන උපදෙස්</h4>
        <p>
          අවශ්‍යනම් මෙම රෝගයට සම්බන්ධ විශේෂ උපදෙස්, ප්‍රතිකාර කාලය, සහ follow-up note එකක්ද මෙහි update කළ හැක.
        </p>
      </div>

      <div class="detail-card">
        <h4>Admin Edit Note</h4>
        <p>
          මෙම විස්තරය <strong>script.js</strong> තුළ ඇති <strong>diseaseCatalog</strong> object එකේ
          අදාල රෝගය යටතේ වෙන වෙනම update කළ හැක.
        </p>
      </div>
    </div>
  `;
}

function initDiseaseBrowser() {
  const doshaNav = document.getElementById("doshaNav");
  const diseaseList = document.getElementById("diseaseList");
  const diseaseDetail = document.getElementById("diseaseDetail");
  const activeCategoryTitle = document.getElementById("activeCategoryTitle");

  if (!doshaNav || !diseaseList || !diseaseDetail || !activeCategoryTitle) return;

  let activeCategory = "vatha";
  let activeIndex = 0;

  function renderTabs() {
    doshaNav.innerHTML = "";

    Object.keys(diseaseCatalog).forEach((key) => {
      const button = document.createElement("button");
      button.className = `dosha-tab ${activeCategory === key ? "active" : ""}`;
      button.textContent = `${diseaseCatalog[key].title}`;
      button.addEventListener("click", () => {
        activeCategory = key;
        activeIndex = 0;
        renderAll();
      });
      doshaNav.appendChild(button);
    });
  }

  function renderDiseaseList() {
    diseaseList.innerHTML = "";
    const currentGroup = diseaseCatalog[activeCategory];

    currentGroup.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = `disease-item ${activeIndex === index ? "active" : ""}`;
      button.type = "button";

      button.innerHTML = `
        <span class="disease-number">${item.no}</span>
        <span class="disease-name">${item.name}</span>
      `;

      button.addEventListener("click", () => {
        activeIndex = index;
        renderAll();
      });

      diseaseList.appendChild(button);
    });
  }

  function renderDetail() {
    const currentGroup = diseaseCatalog[activeCategory];
    const currentItem = currentGroup.items[activeIndex];
    activeCategoryTitle.textContent = currentGroup.title;
    diseaseDetail.innerHTML = buildDiseaseDetail(activeCategory, currentItem);
  }

  function renderAll() {
    renderTabs();
    renderDiseaseList();
    renderDetail();
  }

  renderAll();
}

document.addEventListener("DOMContentLoaded", initDiseaseBrowser);
