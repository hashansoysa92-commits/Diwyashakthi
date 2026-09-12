/* Completes translations for dynamically generated service detail content. */
(function(){
  'use strict';
  const originals=new WeakMap();let busy=false;
  const D={
    'ආයුර්වේද ප්‍රවේශය':{si:'ආයුර්වේද ප්‍රවේශය',ta:'ஆயுர்வேத அணுகுமுறை',en:'Ayurvedic approach'},
    'මෙම කොටසට අදාළ වෛද්‍ය උපදෙස් සහ වෘත්තීයමය ප්‍රතිකාර තොරතුරු පසුව එක් කළ හැක.':{si:'මෙම කොටසට අදාළ වෛද්‍ය උපදෙස් සහ වෘත්තීයමය ප්‍රතිකාර තොරතුරු පසුව එක් කළ හැක.',ta:'இந்தப் பகுதியில் தொடர்புடைய மருத்துவ வழிகாட்டல் மற்றும் தொழில்முறை சிகிச்சைத் தகவல்களை பின்னர் சேர்க்கலாம்.',en:'Relevant medical guidance and professional treatment information can be added here later.'},
    'ආහාර හා ජීවන රටාව':{si:'ආහාර හා ජීවන රටාව',ta:'உணவு மற்றும் வாழ்க்கைமுறை',en:'Diet and lifestyle'},
    'අදාළ ආහාර, දෛනික චර්යා සහ follow-up උපදෙස් පසුව edit කළ හැක.':{si:'අදාළ ආහාර, දෛනික චර්යා සහ පසු විමසුම් උපදෙස් පසුව සංස්කරණය කළ හැක.',ta:'தொடர்புடைய உணவு, தினசரி பழக்கங்கள் மற்றும் பின்தொடர்பு வழிகாட்டலை பின்னர் திருத்தலாம்.',en:'Relevant diet, daily routine and follow-up guidance can be edited later.'},
    'කාණ්ඩය යටතේ දක්වා ඇත. මෙහි නිවැරදි වෘත්තීය විස්තරය පසුව update කළ හැක.':{si:'කාණ්ඩය යටතේ දක්වා ඇත. මෙහි නිවැරදි වෘත්තීය විස්තරය පසුව යාවත්කාලීන කළ හැක.',ta:'பிரிவின் கீழ் பட்டியலிடப்பட்டுள்ளது. துல்லியமான தொழில்முறை விளக்கத்தை பின்னர் புதுப்பிக்கலாம்.',en:'category. A precise professional description can be added later.'},
    'Direct':{si:'සෘජු',ta:'நேரடி',en:'Direct'},
    'Ayurveda':{si:'ආයුර්වේදය',ta:'ஆயுர்வேதம்',en:'Ayurveda'},
    'All rights reserved.':{si:'සියලු හිමිකම් ඇවිරිණි.',ta:'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',en:'All rights reserved.'}
  };
  function lang(){return localStorage.getItem('diwyashakthi-language')||document.documentElement.lang||'en'}
  function apply(root=document.body){if(!root||busy)return;busy=true;try{const l=lang();const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const arr=[];while((n=w.nextNode()))arr.push(n);arr.forEach(node=>{const p=node.parentElement;if(!p||p.closest('.language-switcher')||['SCRIPT','STYLE'].includes(p.tagName))return;if(!originals.has(node))originals.set(node,node.nodeValue);const original=originals.get(node),core=original.trim();if(!core)return;let tr=D[core]?.[l];if(!tr&&core.endsWith('මෙම වෙබ් අඩවියේ')){const h=p.closest('.disease-detail')?.querySelector('h3')?.textContent?.trim()||core.replace(' මෙම වෙබ් අඩවියේ','');if(l==='si')tr=`${h} මෙම වෙබ් අඩවියේ`;else if(l==='ta')tr=`${h} இந்த இணையதளத்தில்`;else tr=`${h} is listed on this website under the`;}if(!tr)return;const lead=original.match(/^\s*/)?.[0]||'',trail=original.match(/\s*$/)?.[0]||'';node.nodeValue=lead+tr+trail;});}finally{busy=false;}}
  function init(){apply();new MutationObserver(ms=>{if(busy)return;ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)apply(n);else if(n.nodeType===3&&n.parentElement)apply(n.parentElement)}));}).observe(document.body,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest('.language-switcher'))setTimeout(()=>apply(),40)});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
