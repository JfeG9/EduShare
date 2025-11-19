document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const userName = document.querySelector("#userName");
  const fechaDisplay = document.querySelector("#fechaDisplay");
  const fechaPicker = document.querySelector("#fechaPicker");
  const btnHoy = document.querySelector("#btnHoy");
  const notaEl = document.querySelector("#nota");
  const listaEl = document.querySelector("#listaMateriales");
  const btnAgregar = document.querySelector("#btnAgregar");
  const btnGuardar = document.querySelector("#btnGuardar");
  const btnReset = document.querySelector("#btnReset");
  const btnSalir = document.querySelector("#btnSalir");
  const previewTitle = document.querySelector("#materialPreviewTitle");
  const previewDesc = document.querySelector("#materialPreviewDesc");

  const modal = document.querySelector("#modal");
  const modalTitle = document.querySelector("#modalTitle");
  const matTitulo = document.querySelector("#matTitulo");
  const matDesc = document.querySelector("#matDesc");
  const modalSave = document.querySelector("#modalSave");
  const modalCancel = document.querySelector("#modalCancel");
  const toast = document.querySelector("#toast");

  let editingIndex = -1;
  let state = { nota: "", materiales: [] };

  const today = new Date();
  function isoFromDateObj(d){ const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `${yyyy}-${mm}-${dd}`; }
  function normalFromISO(iso){ const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; }
  function isoFromNormal(norm){ const [d,m,y]=norm.split('/'); return `${y}-${m}-${d}`; }
  function getKeyForISO(iso){ return `cal_${iso}`; }

  function setDateByISO(iso){
    fechaDisplay.value = normalFromISO(iso);
    fechaPicker.value = iso;
  }
  setDateByISO(isoFromDateObj(today));

  userName.textContent = localStorage.getItem("usuario") || userName.textContent;

  function showToast(msg, ms=1400){
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(()=> toast.classList.add("hidden"), ms);
  }

  function loadForCurrentDate(){
    const iso = fechaPicker.value;
    const key = getKeyForISO(iso);
    const raw = localStorage.getItem(key);
    state = raw ? JSON.parse(raw) : { nota: "", materiales: [] };
    notaEl.value = state.nota || "";
    renderList();
    clearPreview();
  }

  function saveForCurrentDate(){
    const iso = fechaPicker.value;
    const key = getKeyForISO(iso);
    state.nota = notaEl.value;
    localStorage.setItem(key, JSON.stringify(state));
    showToast("Guardado ✔");
  }

  function renderList(){
    listaEl.innerHTML = "";
    state.materiales.forEach((m, i) => {
      const item = document.createElement("div");
      item.className = "item-material";
      item.innerHTML = `
        <div class="thumb"><i data-lucide="image"></i></div>
        <div class="texto">
          <h4>${escapeHtml(m.titulo)}</h4>
          <p title="${escapeHtml(m.descripcion)}">${escapeHtml(m.descripcion)}</p>
        </div>
        <div class="actions">
          <button class="menu-btn" data-i="${i}" title="Más"><i data-lucide="more-vertical"></i></button>
        </div>
      `;
      listaEl.appendChild(item);
    });
    lucide.createIcons();
 
    listaEl.querySelectorAll(".menu-btn").forEach(btn=>{
      btn.addEventListener("click", (e)=>{
        const idx = Number(btn.dataset.i);
        openMenuFor(idx, btn);
      });
    });

    listaEl.querySelectorAll(".item-material").forEach((el, idx)=>{
      el.addEventListener("click", (ev)=>{

        if (ev.target.closest('.menu-btn')) return;
        setPreviewFromIndex(idx);
      });
    });
  }

  function setPreviewFromIndex(i){
    const m = state.materiales[i];
    if(!m) return;
    previewTitle.textContent = m.titulo;
    previewDesc.textContent = m.descripcion;
  }

  function clearPreview(){
    previewTitle.textContent = "Selecciona un material";
    previewDesc.textContent = "Vista previa del material seleccionado.";
  }


  function openMenuFor(idx, anchorBtn){

    const action = prompt("Acción para el material:\n1 = Editar\n2 = Eliminar\n(Escribe 1 o 2)");
    if(action === "1"){
      openModalForEdit(idx);
    } else if(action === "2"){
      if(confirm("Eliminar material?")) {
        state.materiales.splice(idx,1);
        saveForCurrentDate();
        renderList();
        showToast("Eliminado");
      }
    }
  }

  function openModalForCreate(){
    editingIndex = -1;
    modalTitle.textContent = "Agregar material";
    matTitulo.value = "";
    matDesc.value = "";
    modal.classList.remove("hidden");
    matTitulo.focus();
  }
  function openModalForEdit(idx){
    editingIndex = idx;
    modalTitle.textContent = "Editar material";
    const m = state.materiales[idx] || {titulo:"", descripcion:""};
    matTitulo.value = m.titulo;
    matDesc.value = m.descripcion;
    modal.classList.remove("hidden");
    matTitulo.focus();
  }
  function closeModal(){
    modal.classList.add("hidden");
    editingIndex = -1;
  }


  modalSave.addEventListener("click", ()=>{
    const t = matTitulo.value.trim();
    const d = matDesc.value.trim();
    if(!t){ alert("Escribe un título"); matTitulo.focus(); return; }
    if(editingIndex >= 0){
      state.materiales[editingIndex] = { titulo: t, descripcion: d };
      showToast("Material editado");
    } else {
      state.materiales.unshift({ titulo: t, descripcion: d }); // push to top
      showToast("Material agregado");
    }
    saveForCurrentDate();
    renderList();
    closeModal();
  });
  modalCancel.addEventListener("click", closeModal);


  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });


  btnAgregar.addEventListener("click", openModalForCreate);
  btnGuardar.addEventListener("click", saveForCurrentDate);
  btnReset.addEventListener("click", ()=>{
    if(!confirm("Borrar nota y materiales de esta fecha?")) return;
    state = { nota: "", materiales: [] };
    saveForCurrentDate();
    renderList();
    notaEl.value = "";
    clearPreview();
    showToast("Fecha reiniciada");
  });

  btnSalir.addEventListener("click", ()=>{
    if(confirm("¿Quieres salir?")) window.location.href = "../../index.html";
  });

  fechaPicker.addEventListener("change", ()=>{
    if(!fechaPicker.value) return;
    setDateByISO(fechaPicker.value);
    loadForCurrentDate();
  });

  btnHoy.addEventListener("click", ()=>{
    const iso = isoFromDateObj(new Date());
    fechaPicker.value = iso;
    setDateByISO(iso);
    loadForCurrentDate();
  });

  function setDateByISO(iso){
    fechaPicker.value = iso;
    fechaDisplay.value = normalFromISO(iso);
  }

  function isoFromDateObj(d){ const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `${yyyy}-${mm}-${dd}`; }
  function normalFromISO(iso){ const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  loadForCurrentDate();

  function loadForCurrentDate(){
    const iso = fechaPicker.value || isoFromDateObj(new Date());
    setDateByISO(iso);
    const key = getKeyForISO(iso);
    const raw = localStorage.getItem(key);
    state = raw ? JSON.parse(raw) : { nota: "", materiales: [] };
    notaEl.value = state.nota || "";
    renderList();
    clearPreview();
  }
  function getKeyForISO(iso){ return `cal_${iso}`; }

});