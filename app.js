const STORAGE_KEY = "eventsync:state:v1";
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const categories = ["Todos", "Música", "Tecnologia", "Cultura", "Educação", "Outros"];
let state;
let activeCategory = "Todos";
let activeTab = "participando";
let detailMap;
let toastTimer;
let selectedCover = "";
let editingId = null;
let channel;

function futureDate(days, hour = 19) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}
function seedState() {
  const records = [
    ["festival","Festival de Música","Música","Praça Cultural · Teresina, PI",14,19,"Uma noite especial com música, cultura e muita energia! Reúna os amigos e venha viver uma experiência inesquecível.",-5.0892,-42.8016],
    ["tech","Tech Meetup","Tecnologia","Campus Central",21,14,"Troque ideias, conheça projetos e encontre pessoas apaixonadas por tecnologia.",-5.0648,-42.7897],
    ["cultural","Encontro Cultural","Cultura","Centro Cultural",29,17,"Arte, conversas e apresentações para celebrar a criatividade da nossa cidade.",null,null],
    ["workshop","Workshop Criativo","Educação","Espaço Aprender",35,15,"Um encontro prático para compartilhar técnicas e descobrir novas ideias.",null,null],
    ["feira","Feira de Ideias","Outros","Praça da Liberdade",42,10,"Projetos, encontros e boas histórias em uma manhã para toda a comunidade.",null,null],
    ["som","Noite de Música","Música","Auditório Aberto",49,20,"Artistas locais em uma noite para cantar junto e descobrir novos sons.",null,null]
  ];
  return {
    events: records.map(([id,title,category,venue,days,hour,description,lat,lng]) => ({id,title,category,venue,date:futureDate(days,hour),description,lat,lng,visibility:"public",createdByDemo:false,cover:""})),
    rsvps: [],
    notifications: [{id:"welcome",eventId:"festival",title:"Novo evento disponível!",message:"O Festival de Música está na agenda. Confira os detalhes.",createdAt:new Date().toISOString(),read:false}]
  };
}
function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.events) && Array.isArray(parsed.rsvps) && Array.isArray(parsed.notifications)) return parsed;
    }
  } catch (error) { console.warn("Dados locais indisponíveis:", error); }
  const initial = seedState();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch (error) { console.warn("Não foi possível salvar os dados de demonstração:", error); }
  return initial;
}
function saveState(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = next;
    channel?.postMessage("update");
    renderCurrent();
    return true;
  } catch (error) {
    showToast("Não foi possível salvar. Verifique o espaço deste navegador.");
    console.error(error);
    return false;
  }
}
function categoryClass(event) {
  if (event.cover) return "custom";
  if (event.id === "festival") return "photo-music";
  if (event.id === "tech") return "photo-tech";
  return {Cultura:"culture",Educação:"education",Outros:"other",Música:"other",Tecnologia:"education"}[event.category] || "other";
}
function coverStyle(event) { return event.cover ? ` style="background-image:url('${esc(event.cover)}')"` : ""; }
function dateLabel(value) { return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(value)); }
function longDate(value) { return new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long",year:"numeric"}).format(new Date(value)); }
function hourLabel(value) { return new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(new Date(value)); }
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.hidden = true, 3500);
}
function getRoute() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const [view, id] = hash.split("/");
  return {view: ["explorar","detalhes","criar","meus","sobre"].includes(view) ? view : "explorar", id};
}
function route() {
  const {view,id} = getRoute();
  document.querySelectorAll(".view").forEach(section => section.hidden = section.id !== `view-${view}`);
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = link.dataset.nav === view || (view === "detalhes" && link.dataset.nav === "explorar");
    if (active) link.setAttribute("aria-current","page"); else link.removeAttribute("aria-current");
  });
  closeNotifications();
  if (view === "explorar") renderExplore();
  if (view === "detalhes") renderDetail(id);
  if (view === "criar") prepareForm(id);
  if (view === "meus") renderMy();
  window.scrollTo({top:0,behavior:"instant"});
}
function renderCurrent() {
  const {view,id} = getRoute();
  if (view === "explorar") renderExplore();
  if (view === "detalhes") renderDetail(id);
  if (view === "meus") renderMy();
  renderNotifications();
}
function renderChips() {
  $("#category-chips").innerHTML = categories.map(category => `<button type="button" class="chip" data-category="${category}" aria-pressed="${activeCategory === category}">${category}</button>`).join("");
}
function card(event) {
  return `<article class="event-card"><a href="#detalhes/${encodeURIComponent(event.id)}" aria-label="Ver detalhes de ${esc(event.title)}"><div class="event-cover ${categoryClass(event)}"${coverStyle(event)}></div><div class="event-body"><time class="event-date" datetime="${esc(event.date)}">${esc(dateLabel(event.date))}</time><h3>${esc(event.title)}</h3><p>${esc(event.venue)}</p><span class="card-action">Ver detalhes →</span></div></a></article>`;
}
function renderExplore() {
  renderChips();
  const query = $("#search").value.trim().toLocaleLowerCase("pt-BR");
  const now = Date.now();
  const filtered = state.events.filter(event => event.visibility === "public" && new Date(event.date).getTime() > now && (activeCategory === "Todos" || event.category === activeCategory) && (!query || `${event.title} ${event.venue} ${event.category} ${event.description}`.toLocaleLowerCase("pt-BR").includes(query))).sort((a,b) => new Date(a.date)-new Date(b.date));
  $("#result-count").textContent = `${filtered.length} ${filtered.length === 1 ? "evento" : "eventos"}`;
  $("#event-list").innerHTML = filtered.length ? filtered.map(card).join("") : '<div class="empty-state"><h3>Nenhum evento encontrado</h3><p>Tente outro termo ou escolha uma categoria diferente.</p><button class="button button-outline" id="clear-filters" type="button">Limpar filtros</button></div>';
}
function renderDetail(id) {
  detailMap?.remove(); detailMap = null;
  const event = state.events.find(item => item.id === id);
  if (!event) { $("#detail-content").innerHTML = '<div class="empty-state"><h1 id="detail-title">Evento não encontrado</h1><p>O link pode estar incorreto ou os dados de demonstração foram restaurados.</p><a href="#explorar">Explorar eventos</a></div>'; return; }
  const joined = state.rsvps.includes(id);
  const canMap = Number.isFinite(event.lat) && Number.isFinite(event.lng);
  $("#detail-content").innerHTML = `<article class="detail-panel"><div class="detail-cover ${categoryClass(event)}"${coverStyle(event)}></div><div class="detail-body"><div class="detail-meta"><span class="detail-tag">${esc(event.category)}</span><span>${event.visibility === "private" ? "Evento privado · link local de demonstração" : "Evento público"}</span></div><h1 id="detail-title">${esc(event.title)}</h1><div class="detail-facts"><span><b aria-hidden="true">▦</b>${esc(longDate(event.date))}</span><span><b aria-hidden="true">◷</b>${esc(hourLabel(event.date))}</span><span><b aria-hidden="true">⌖</b>${esc(event.venue)}</span></div><hr><h2>Sobre o evento</h2><p>${esc(event.description)}</p>${canMap ? `<section class="detail-map-wrap" aria-label="Localização do evento"><h2>⌖ Localização do evento</h2><div id="detail-map" class="detail-map"><div class="map-fallback">Mapa indisponível. Local: ${esc(event.venue)}</div></div></section>` : ""}${joined ? '<p class="confirmed-note">✓ Presença confirmada neste navegador</p>' : ""}<div class="detail-actions">${joined ? `<button class="button button-outline" type="button" data-rsvp="${esc(id)}">Cancelar participação</button>` : `<button class="button button-primary" type="button" data-rsvp="${esc(id)}">✓ Confirmar minha presença</button>`}${event.createdByDemo ? `<a class="button button-outline" href="#criar/${encodeURIComponent(id)}">Editar evento</a>` : ""}</div>${event.visibility === "private" ? '<p class="private-note">O link de convite funciona somente com os dados deste navegador; não há controle de acesso real.</p>' : ""}</div></article>`;
  if (canMap) initDetailMap(event);
}
function initDetailMap(event) {
  if (!window.L) return;
  try {
    const container = $("#detail-map");
    container.innerHTML = "";
    detailMap = L.map(container,{scrollWheelZoom:false}).setView([event.lat,event.lng],14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(detailMap);
    L.marker([event.lat,event.lng],{keyboard:true,title:event.venue}).addTo(detailMap).bindPopup(esc(event.venue));
    setTimeout(() => detailMap?.invalidateSize(),100);
  } catch (error) { console.warn("Mapa indisponível:",error); $("#detail-map").innerHTML = `<div class="map-fallback">Mapa indisponível. Local: ${esc(event.venue)}</div>`; }
}
function renderMy() {
  $("#tab-participando").setAttribute("aria-selected",String(activeTab === "participando"));
  $("#tab-organizando").setAttribute("aria-selected",String(activeTab === "organizando"));
  const items = (activeTab === "participando" ? state.events.filter(item => state.rsvps.includes(item.id)) : state.events.filter(item => item.createdByDemo)).sort((a,b) => new Date(a.date)-new Date(b.date));
  $("#my-list").innerHTML = items.length ? items.map(event => `<a class="compact-card" href="#detalhes/${encodeURIComponent(event.id)}"><div class="compact-cover ${categoryClass(event)}"${coverStyle(event)}></div><div class="compact-info"><time class="event-date" datetime="${esc(event.date)}">${esc(dateLabel(event.date))}</time><strong>${esc(event.title)}</strong><p>${esc(event.venue)}</p><small>${activeTab === "participando" ? "✓ Presença confirmada" : "Evento organizado por você · abrir para editar"}</small></div></a>`).join("") : `<div class="empty-state"><h3>${activeTab === "participando" ? "Você ainda não confirmou presença" : "Você ainda não criou eventos"}</h3><p>${activeTab === "participando" ? "Explore a agenda e escolha um evento." : "Crie um evento para começar a organizar."}</p><a class="button button-outline" href="#${activeTab === "participando" ? "explorar" : "criar"}">${activeTab === "participando" ? "Explorar eventos" : "Criar evento"}</a></div>`;
}
function addNotification(next, event, title, message) {
  next.notifications.unshift({id:crypto.randomUUID(),eventId:event.id,title,message,createdAt:new Date().toISOString(),read:false});
}
function renderNotifications() {
  const unread = state.notifications.filter(note => !note.read).length;
  $("#bell-count").textContent = unread;
  $("#bell-count").hidden = !unread;
  $("#bell-button").setAttribute("aria-label",`Notificações, ${unread} não lidas`);
  $("#notification-list").innerHTML = state.notifications.length ? state.notifications.slice(0,12).map(note => `<a class="notification-item ${note.read ? "" : "unread"}" href="#detalhes/${encodeURIComponent(note.eventId)}" data-note="${esc(note.id)}"><span class="notification-symbol" aria-hidden="true">✦</span><span><strong>${esc(note.title)}</strong><span>${esc(note.message)}</span><small>${esc(new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(note.createdAt)))}</small></span></a>`).join("") : '<p class="notification-empty">Nenhuma notificação por enquanto.</p>';
  $("#mark-read").hidden = unread === 0;
}
function closeNotifications() { $("#notification-panel").hidden = true; $("#bell-button").setAttribute("aria-expanded","false"); }
function prepareForm(id) {
  const event = id ? state.events.find(item => item.id === id && item.createdByDemo) : null;
  editingId = event?.id || null;
  const form = $("#event-form");
  const fields = form.elements;
  form.reset(); selectedCover = event?.cover || "";
  $("#form-status").textContent = "";
  $("#create-heading").innerHTML = event ? "Editar evento <span>✦</span>" : "Criar novo evento <span>✦</span>";
  $(".submit-button").textContent = event ? "Salvar alterações" : "Publicar evento";
  if (event) {
    fields.namedItem("title").value = event.title;
    fields.namedItem("description").value = event.description;
    const date = new Date(event.date);
    fields.namedItem("date").value = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    fields.namedItem("time").value = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
    fields.namedItem("venue").value = event.venue;
    fields.namedItem("category").value = event.category;
    fields.namedItem("visibility").value = event.visibility;
    fields.namedItem("lat").value = event.lat ?? "";
    fields.namedItem("lng").value = event.lng ?? "";
  }
  $("#cover-preview").hidden = !selectedCover;
  $("#cover-preview").style.backgroundImage = selectedCover ? `url("${selectedCover}")` : "";
}
async function readCover(file) {
  if (!file) return "";
  if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 1024*1024) throw new Error("Escolha uma imagem JPG, PNG ou WebP de até 1 MB.");
  return await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("Não foi possível ler a imagem.")); reader.readAsDataURL(file); });
}
function submitEvent(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = form.elements;
  const status = $("#form-status");
  status.textContent = "";
  const date = new Date(`${fields.namedItem("date").value}T${fields.namedItem("time").value}:00`);
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) { status.textContent = "Escolha uma data e horário futuros."; fields.namedItem("date").focus(); return; }
  if ((fields.namedItem("lat").value && !fields.namedItem("lng").value) || (!fields.namedItem("lat").value && fields.namedItem("lng").value)) { status.textContent = "Preencha latitude e longitude juntas ou deixe ambas vazias."; fields.namedItem("lat").focus(); return; }
  const prior = editingId ? state.events.find(item => item.id === editingId) : null;
  const record = {
    id: prior?.id || crypto.randomUUID(),
    title: fields.namedItem("title").value.trim(), description: fields.namedItem("description").value.trim(),
    date: date.toISOString(), venue: fields.namedItem("venue").value.trim(), category: fields.namedItem("category").value || "Outros",
    visibility: fields.namedItem("visibility").value, lat: fields.namedItem("lat").value ? Number(fields.namedItem("lat").value) : null,
    lng: fields.namedItem("lng").value ? Number(fields.namedItem("lng").value) : null, cover: selectedCover,
    createdByDemo: true
  };
  if (!record.title || !record.description || !record.venue) { status.textContent = "Preencha nome, descrição e local."; return; }
  const next = structuredClone(state);
  if (prior) {
    next.events = next.events.map(item => item.id === record.id ? record : item);
    if (next.rsvps.includes(record.id) && (prior.date !== record.date || prior.venue !== record.venue)) addNotification(next,record,"Evento atualizado",`Data ou local de ${record.title} foi alterado.`);
    if (prior.visibility === "private" && record.visibility === "public") addNotification(next,record,"Novo evento disponível!",`${record.title} agora está público.`);
  } else {
    next.events.push(record);
    if (record.visibility === "public") addNotification(next,record,"Novo evento disponível!",`${record.title} foi publicado. Confira os detalhes.`);
  }
  if (saveState(next)) { location.hash = `#detalhes/${encodeURIComponent(record.id)}`; showToast(prior ? "Evento atualizado neste navegador." : "Evento criado neste navegador."); }
}
function init() {
  state = readState();
  renderNotifications();
  $("#search").addEventListener("input",renderExplore);
  $("#category-chips").addEventListener("click",event => { const button = event.target.closest("[data-category]"); if (!button) return; activeCategory = button.dataset.category; renderExplore(); });
  $("#event-list").addEventListener("click",event => { if (event.target.id === "clear-filters") { $("#search").value = ""; activeCategory = "Todos"; renderExplore(); $("#search").focus(); } });
  $("#detail-content").addEventListener("click",event => {
    const button = event.target.closest("[data-rsvp]"); if (!button) return;
    const id = button.dataset.rsvp; const next = structuredClone(state);
    next.rsvps = next.rsvps.includes(id) ? next.rsvps.filter(item => item !== id) : [...next.rsvps,id];
    if (saveState(next)) showToast(next.rsvps.includes(id) ? "Presença confirmada neste navegador." : "Participação cancelada.");
  });
  $("#tab-participando").addEventListener("click",() => { activeTab = "participando"; renderMy(); });
  $("#tab-organizando").addEventListener("click",() => { activeTab = "organizando"; renderMy(); });
  $("#cover").addEventListener("change",async event => { try { selectedCover = await readCover(event.target.files[0]); $("#cover-preview").hidden = !selectedCover; $("#cover-preview").style.backgroundImage = selectedCover ? `url("${selectedCover}")` : ""; $("#form-status").textContent = ""; } catch(error) { selectedCover = ""; event.target.value = ""; $("#form-status").textContent = error.message; } });
  $("#event-form").addEventListener("submit",submitEvent);
  $("#bell-button").addEventListener("click",() => { const panel = $("#notification-panel"); panel.hidden = !panel.hidden; $("#bell-button").setAttribute("aria-expanded",String(!panel.hidden)); if (!panel.hidden) $("#close-notifications").focus(); });
  $("#close-notifications").addEventListener("click",() => { closeNotifications(); $("#bell-button").focus(); });
  $("#notification-list").addEventListener("click",event => { const link = event.target.closest("[data-note]"); if (!link) return; const next = structuredClone(state); const note = next.notifications.find(item => item.id === link.dataset.note); if (note) { note.read = true; saveState(next); } closeNotifications(); });
  $("#mark-read").addEventListener("click",() => { const next = structuredClone(state); next.notifications.forEach(note => note.read = true); saveState(next); });
  document.addEventListener("keydown",event => { if (event.key === "Escape" && !$("#notification-panel").hidden) { closeNotifications(); $("#bell-button").focus(); } });
  document.addEventListener("click",event => { if (!$("#notification-panel").hidden && !event.target.closest(".notification-panel, #bell-button")) closeNotifications(); });
  $("#reset-demo").addEventListener("click",() => { if (!confirm("Restaurar eventos, presenças e notificações desta demonstração neste navegador?")) return; saveState(seedState()); location.hash = "#explorar"; showToast("Dados de demonstração restaurados."); });
  window.addEventListener("hashchange",route);
  window.addEventListener("storage",event => { if (event.key === STORAGE_KEY) { state = readState(); renderCurrent(); } });
  try { channel = new BroadcastChannel("eventsync:updates"); channel.onmessage = () => { state = readState(); renderCurrent(); }; } catch { /* canal indisponível; evento storage ainda sincroniza abas */ }
  route();
}
init();
