/* Diwyashakthi public CMS runtime */
(function(){
'use strict';
const SB_URL='https://caxbhzgmwkhgdblotjvs.supabase.co';
const SB_KEY='sb_publishable_p6qXdrM6TF0ZW7Z5btj5jQ_-WP-ou6N';
const page=(location.pathname.split('/').pop()||'index.html').split('?')[0]||'index.html';
const preview=new URLSearchParams(location.search).get('cms-preview')==='1';
const currentLang=()=>localStorage.getItem('diwyashakthi-language')||document.documentElement.lang||'en';

function productsLabel(){return currentLang()==='si'?'නිෂ්පාදන':currentLang()==='ta'?'தயாரிப்புகள்':'Products'}
function addProductsNav(){
 const nav=document.querySelector('.links');
 if(nav&&!nav.querySelector('a[href="products.html"]')){
  const a=document.createElement('a');a.href='products.html';a.textContent=productsLabel();if(page==='products.html')a.classList.add('active');
  const before=nav.querySelector('a[href="gallery.html"]')||nav.querySelector('a[href="contact.html"]')||nav.querySelector('.btn');nav.insertBefore(a,before||null);
 }
 document.querySelectorAll('.links a[href="products.html"]').forEach(a=>{a.textContent=productsLabel();a.classList.toggle('active',page==='products.html')});
 document.querySelectorAll('footer').forEach(footer=>{const explore=[...footer.querySelectorAll('h4')].find(h=>/Explore|ගවේෂණය|ஆராய/i.test(h.textContent||''))?.parentElement;if(explore&&!explore.querySelector('a[href="products.html"]')){const a=document.createElement('a');a.href='products.html';a.textContent=productsLabel();const gallery=explore.querySelector('a[href="gallery.html"]');explore.insertBefore(a,gallery||null)}explore?.querySelectorAll('a[href="products.html"]').forEach(a=>a.textContent=productsLabel())});
}
function addAdminEntry(){
 const footer=document.querySelector('footer'); if(!footer||footer.querySelector('.admin-entry'))return;
 const a=document.createElement('a'); a.className='admin-entry'; a.href='admin-login.html'; a.title='Admin'; a.setAttribute('aria-label','Admin login');
 a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 8V6a5 5 0 0 0-10 0v2H5v13h14V8h-2Zm-8-2a3 3 0 1 1 6 0v2H9V6Zm8 13H7v-9h10v9Z" fill="currentColor"/></svg>';
 footer.appendChild(a);
 const s=document.createElement('style'); s.textContent='.admin-entry{position:absolute;right:18px;bottom:14px;width:25px;height:25px;display:grid;place-items:center;color:rgba(255,255,255,.18);opacity:.55;transition:.25s;text-decoration:none}.admin-entry:hover{opacity:.9;color:rgba(226,171,60,.7)}.admin-entry svg{width:13px;height:13px}footer{position:relative}'; document.head.appendChild(s);
}
async function loadEdits(){
 try{
  const q=new URL(SB_URL+'/rest/v1/site_edits'); q.searchParams.set('select','page,selector,language,edit_type,attribute_name,value,is_enabled'); q.searchParams.set('page','eq.'+page); q.searchParams.set('is_enabled','eq.true');
  const r=await fetch(q,{headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY}}); if(!r.ok)return; const edits=await r.json();
  const lang=currentLang();edits.filter(e=>e.language==='all'||e.language===lang).forEach(applyEdit);
 }catch(e){console.warn('CMS load skipped',e)}
}
function applyEdit(e){let nodes=[]; try{nodes=[...document.querySelectorAll(e.selector)]}catch{return}nodes.forEach(el=>{if(e.edit_type==='text') el.textContent=e.value;else if(e.edit_type==='attribute'&&e.attribute_name) el.setAttribute(e.attribute_name,e.value);else if(e.edit_type==='style') el.setAttribute('style',e.value);else el.innerHTML=e.value})}
function selectorFor(el){if(el.id)return '#'+CSS.escape(el.id);const path=[];let n=el;while(n&&n.nodeType===1&&n!==document.body){let part=n.tagName.toLowerCase();if(n.classList.length)part+='.'+[...n.classList].slice(0,2).map(CSS.escape).join('.');const parent=n.parentElement;if(parent){const same=[...parent.children].filter(x=>x.tagName===n.tagName);if(same.length>1)part+=`:nth-of-type(${same.indexOf(n)+1})`}path.unshift(part);n=parent;if(path.length>=5)break}return path.join(' > ')}
function enablePreview(){document.documentElement.classList.add('cms-preview-mode');const st=document.createElement('style');st.textContent='.cms-preview-mode body *{cursor:crosshair!important}.cms-preview-mode [data-cms-hover]{outline:2px solid #e2ab3c!important;outline-offset:2px}.admin-entry{display:none!important}';document.head.appendChild(st);document.addEventListener('mouseover',e=>{const t=e.target.closest('main *,header *,footer *');if(t)t.setAttribute('data-cms-hover','1')});document.addEventListener('mouseout',e=>{const t=e.target.closest('[data-cms-hover]');if(t)t.removeAttribute('data-cms-hover')});document.addEventListener('click',e=>{const t=e.target.closest('main *,header *,footer *');if(!t||t.closest('a,button')&&e.metaKey)return;e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-select',page,selector:selectorFor(t),tag:t.tagName.toLowerCase(),html:t.innerHTML,text:t.textContent.trim().slice(0,500),src:t.getAttribute('src')||'',href:t.getAttribute('href')||'',style:t.getAttribute('style')||''},location.origin)},true)}
addProductsNav();addAdminEntry();
window.addEventListener('DOMContentLoaded',()=>{addProductsNav();setTimeout(loadEdits,50)});
window.addEventListener('diwy-language-changed',()=>{addProductsNav();loadEdits()});
if(preview)window.addEventListener('DOMContentLoaded',enablePreview);
})();