const SB_URL='https://caxbhzgmwkhgdblotjvs.supabase.co';
const SB_KEY='sb_publishable_p6qXdrM6TF0ZW7Z5btj5jQ_-WP-ou6N';
const sb=supabase.createClient(SB_URL,SB_KEY);
const $=id=>document.getElementById(id);
let session=null,profile=null;

init();
async function init(){
 const {data}=await sb.auth.getSession(); session=data.session;
 if(!session){location.href='admin-login.html';return}
 const {data:p}=await sb.from('profiles').select('*').eq('id',session.user.id).single(); profile=p;
 if(!profile?.is_active||!['admin','super_admin'].includes(profile.role)){await sb.auth.signOut();location.href='admin-login.html';return}
 $('rolePill').textContent=profile.role==='super_admin'?'Super Admin':'Admin';
 $('userName').textContent=profile.display_name||'Admin'; $('userEmail').textContent=session.user.email||'';
 if(profile.role!=='super_admin'){ $('usersNav').classList.add('hidden'); $('auditNav').classList.add('hidden'); }
 bind(); loadPreview(); loadEdits(); if(profile.role==='super_admin'){loadUsers();loadAudit()}
}
function bind(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>openTab(b.dataset.tab,b));
 $('logoutBtn').onclick=async()=>{await sb.auth.signOut();location.href='admin-login.html'};
 $('openSite').onclick=()=>window.open('index.html','_blank');
 $('pageSelect').onchange=loadPreview; $('reloadPreview').onclick=loadPreview;
 $('typeSelect').onchange=()=>$('attrField').classList.toggle('hidden',$('typeSelect').value!=='attribute');
 $('saveEdit').onclick=saveEdit; $('refreshEdits').onclick=loadEdits;
 $('showCreateUser').onclick=()=>$('createUserBox').classList.toggle('hidden'); $('createUserBtn').onclick=createUser;
 $('refreshAudit').onclick=loadAudit;
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='cms-select')return;const d=e.data;$('selectorInput').value=d.selector||'';$('typeSelect').value='html';$('attrField').classList.add('hidden');$('valueInput').value=d.html||'';$('editorStatus').textContent=`Selected ${d.tag}: ${d.selector}`});
}
function openTab(name,button){if(name==='users'&&profile.role!=='super_admin')return;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));$('tab-'+name).classList.add('active');button?.classList.add('active')}
function loadPreview(){const p=$('pageSelect').value;const lang=$('langSelect').value==='all'?'en':$('langSelect').value;$('previewFrame').src=`${p}?cms-preview=1&lang=${encodeURIComponent(lang)}&t=${Date.now()}`}
async function saveEdit(){
 const page=$('pageSelect').value,selector=$('selectorInput').value.trim(),language=$('langSelect').value,edit_type=$('typeSelect').value,attribute_name=edit_type==='attribute'?$('attrInput').value.trim():null,value=$('valueInput').value;
 if(!selector){$('editorStatus').textContent='Select an element first.';return}
 $('editorStatus').textContent='Saving…';
 let q=sb.from('site_edits').select('id').eq('page',page).eq('selector',selector).eq('language',language).eq('edit_type',edit_type);
 if(attribute_name)q=q.eq('attribute_name',attribute_name);else q=q.is('attribute_name',null);
 const {data:existing}=await q.maybeSingle();
 let error;
 if(existing?.id)({error}=await sb.from('site_edits').update({value,attribute_name:attribute_name||null,is_enabled:true,updated_by:session.user.id,updated_at:new Date().toISOString()}).eq('id',existing.id));
 else ({error}=await sb.from('site_edits').insert({page,selector,language,edit_type,attribute_name:attribute_name||null,value,is_enabled:true,updated_by:session.user.id}));
 if(error){$('editorStatus').textContent=error.message;return}
 await sb.from('admin_audit_log').insert({user_id:session.user.id,action:'edit_site',target:`${page}:${selector}`,details:{language,edit_type,attribute_name}});
 $('editorStatus').textContent='Saved. Reloading preview…'; await loadEdits(); setTimeout(loadPreview,300);
}
async function loadEdits(){const {data,error}=await sb.from('site_edits').select('*').order('updated_at',{ascending:false}).limit(250);const body=$('editsBody');body.innerHTML='';if(error){body.innerHTML=`<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;return}(data||[]).forEach(e=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${e.page}</td><td><code>${escapeHtml(e.selector)}</code></td><td>${e.language}</td><td>${e.edit_type}</td><td>${new Date(e.updated_at).toLocaleString()}</td><td><button class="btn ghost" data-edit="${e.id}">Disable</button></td>`;tr.querySelector('button').onclick=()=>disableEdit(e.id);body.appendChild(tr)})}
async function disableEdit(id){await sb.from('site_edits').update({is_enabled:false,updated_by:session.user.id,updated_at:new Date().toISOString()}).eq('id',id);loadEdits();loadPreview()}
async function callAdmin(body){const {data}=await sb.auth.getSession();const token=data.session?.access_token;const r=await fetch(SB_URL+'/functions/v1/admin-users',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+token},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Request failed');return j}
async function loadUsers(){if(profile.role!=='super_admin')return;const body=$('usersBody');body.innerHTML='<tr><td colspan="5">Loading…</td></tr>';try{const j=await callAdmin({action:'list'});body.innerHTML='';j.users.forEach(u=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${escapeHtml(u.display_name||'')}</td><td>${escapeHtml(u.email||'')}</td><td>${u.role}</td><td>${u.is_active?'Active':'Disabled'}</td><td><div class="row"><button class="btn ghost act">${u.is_active?'Disable':'Enable'}</button><button class="btn ghost pass">Password</button></div></td>`;tr.querySelector('.act').onclick=async()=>{if(u.id===session.user.id)return alert('You cannot disable your own account.');await callAdmin({action:'set-active',user_id:u.id,is_active:!u.is_active});loadUsers()};tr.querySelector('.pass').onclick=async()=>{const pw=prompt('New password (8+ characters)');if(!pw)return;await callAdmin({action:'reset-password',user_id:u.id,password:pw});alert('Password updated.')};body.appendChild(tr)})}catch(e){body.innerHTML=`<tr><td colspan="5">${escapeHtml(e.message)}</td></tr>`}}
async function createUser(){const display_name=$('newName').value.trim(),email=$('newEmail').value.trim(),password=$('newPassword').value,role=$('newRole').value;$('userStatus').textContent='Creating…';try{await callAdmin({action:'create',display_name,email,password,role});$('userStatus').textContent='Account created.';$('newName').value=$('newEmail').value=$('newPassword').value='';loadUsers()}catch(e){$('userStatus').textContent=e.message}}
async function loadAudit(){if(profile.role!=='super_admin')return;const {data,error}=await sb.from('admin_audit_log').select('*').order('created_at',{ascending:false}).limit(200);const b=$('auditBody');b.innerHTML='';if(error){b.innerHTML=`<tr><td colspan="4">${escapeHtml(error.message)}</td></tr>`;return}(data||[]).forEach(a=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${new Date(a.created_at).toLocaleString()}</td><td>${escapeHtml(a.action)}</td><td>${escapeHtml(a.target||'')}</td><td>${a.user_id||''}</td>`;b.appendChild(tr)})}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
