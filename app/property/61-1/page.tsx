<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Sub-Tenancy Agreement — Flat 1, 61 Caledonian Crescent, Edinburgh</title>
<meta name="color-scheme" content="light" />
<style>
  :root{
    --ink:#0b0c0c; --muted:#505a5f; --line:#b1b4b6; --line-strong:#505a5f; --accent:#1d70b8;
    --bg:#ffffff; --radius:8px; --container: 960px; --danger:#d4351c; --success:#00703c;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0; font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; background:#fff; color:var(--ink); line-height:1.5}
  .container{max-width:var(--container); margin:24px auto 64px; padding:0 16px}
  .header{padding:8px 0 16px; border-bottom:4px solid var(--ink); position:sticky; top:0; background:#fff; z-index:2}
  .header h1{margin:0 0 4px; font-size:26px; font-weight:800}
  .subtitle{margin:0; color:var(--muted); font-size:14px}

  .banner{border:1px solid var(--line); border-left:6px solid var(--accent); padding:12px 14px; margin:16px 0 20px; background:#f8f8f8; border-radius:6px; font-size:14px}
  .tip{background:#fff3cd; border-color:#856404; color:#4d3b00}
  .save-indicator{font-size:12px; color:var(--muted); margin-left:auto}
  .save-indicator[data-state="saved"]{ color:var(--success) }
  .save-indicator[data-state="error"]{ color:var(--danger) }

  .grid{display:grid; gap:16px; grid-template-columns:1fr 1fr}
  @media (max-width: 900px){ .grid{grid-template-columns:1fr} }
  .card{border:1px solid var(--line); border-radius:var(--radius); background:#fff; padding:16px}
  .card h2{margin:0 0 8px; font-size:18px}
  .hr{height:1px;background:var(--line); margin:12px 0}

  label{display:block; font-size:14px; margin:10px 0 6px}
  .required::after{content:" *"; color:var(--danger)}
  .hint{display:block; font-size:12px; color:var(--muted); margin-top:2px}
  .error{font-size:12px; color:#fff; background:var(--danger); padding:6px 8px; border-radius:4px; margin-top:6px; display:none}

  input, select, textarea{width:100%; padding:10px 12px; border-radius:6px; border:1px solid var(--line); background:#fff; color:var(--ink); outline:none}
  input[readonly]{background:#f3f2f1}
  textarea{min-height:110px; resize:vertical}
  .row{display:grid; gap:12px; grid-template-columns:1fr 1fr}
  @media (max-width:640px){ .row{grid-template-columns:1fr} }

  .toolbar{display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; align-items:center; margin-top:14px}
  .btn{appearance:none; border:1px solid var(--line); background:#fff; color:var(--ink); cursor:pointer; padding:10px 14px; border-radius:6px; font-weight:700}
  .btn.primary{background:var(--accent); color:#fff; border-color:var(--accent)}
  .btn.link{background:transparent; border-color:transparent; color:var(--accent); text-decoration:underline}
  .btn.ghost{background:#f8f8f8}

  .agreement{margin-top:20px; padding:22px; background:#fff; color:#000; border:1px solid var(--line); border-radius:var(--radius)}
  .agreement h3{margin:0 0 8px; font-size:22px}
  .agreement h4{margin:16px 0 8px; font-size:18px}
  .agreement p,.agreement li{font-size:14px}
  .divider{height:2px; background:var(--line-strong); margin:14px 0}

  .signing{display:grid; gap:16px; grid-template-columns:1fr 1fr; margin-top:8px}
  @media (max-width: 900px){ .signing{grid-template-columns:1fr} }
  .sig-block{border:1px solid var(--line); border-radius:6px; padding:12px; background:#fff}
  .sig-line{height:1px; background:#111; margin:18px 0 6px}
  .stamp{font-size:12px; color:#333}
  .printed-name{font-size:13px}

  .sig-pad{background:#fff; border:1px dashed var(--line); border-radius:6px; position:relative}
  canvas{width:100%; height:160px; display:block}
  .sig-tools{display:flex; gap:8px; margin-top:8px; flex-wrap:wrap}
  .upload{display:flex; gap:8px; align-items:center; margin-top:8px; flex-wrap:wrap}
  .sig-img{max-width:100%; max-height:120px; display:none; border:1px solid var(--line); border-radius:4px; padding:4px; background:#fff}

  .party-list li + li{margin-top:6px}

  @media print{
    .banner,.grid,.toolbar,.card,.hr,.header{display:none!important}
    .agreement{border:none; margin:0; border-radius:0}
    .container{margin:0; padding:0; max-width:none}
    .sig-img{display:block!important}
    .signing{page-break-inside:avoid}
  }
</style>
</head>
<body>
<div class="container">
  <header class="header" role="banner">
    <div style="display:flex; align-items:flex-end; gap:12px">
      <div>
        <h1>Sub-Tenancy Agreement</h1>
        <p class="subtitle">Property: Flat 1, 61 Caledonian Crescent, Edinburgh • Lead tenant/occupier: David Martin • Managing agent: Milard’s Property Management</p>
      </div>
      <span id="saveIndicator" class="save-indicator" aria-live="polite"></span>
    </div>
  </header>

  <div class="banner tip" role="note">
    💡 Tip: Use “Export as PDF” and choose “Save as PDF” in your print dialog. Then click “Email David” to open a prefilled email.
  </div>

  <div class="grid" aria-label="Form sections">
    <!-- Left: Parties & tenancy -->
    <section class="card">
      <h2>Parties and Tenancy Details</h2>
      <div class="hr"></div>

      <div class="row">
        <div>
          <label for="agreeDate" class="required">Date of Agreement</label>
          <input id="agreeDate" type="date" aria-required="true" />
          <div id="errAgreeDate" class="error" role="alert">Please provide the agreement date.</div>
        </div>
        <div>
          <label for="startDate" class="required">Start Date</label>
          <input id="startDate" type="date" aria-required="true" />
          <div id="errStartDate" class="error" role="alert">Please provide a start date.</div>
        </div>
      </div>

      <div class="row">
        <div>
          <label for="tenantName">Lead Tenant (fixed)</label>
          <input id="tenantName" type="text" value="David Martin" readonly aria-readonly="true" />
          <span class="hint">This cannot be changed.</span>
        </div>
        <div>
          <label for="agent">Managing Agent (fixed)</label>
          <input id="agent" type="text" value="Milard’s Property Management" readonly aria-readonly="true" />
        </div>
      </div>

      <!-- Sub-tenant manager -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <h3 style="margin:0;font-size:16px">Sub-Tenant(s)</h3>
        <div>
          <button class="btn ghost" id="btnAddSub" type="button">Add sub-tenant</button>
          <button class="btn ghost" id="btnRemoveSub" type="button">Remove last</button>
        </div>
      </div>
      <span class="hint">You can have one or two people. The first sub-tenant is required; the second is optional.</span>

      <!-- Sub-tenant list (first required) -->
      <div id="subsContainer"></div>

      <div class="row" style="margin-top:8px">
        <div>
          <label for="rent" class="required">Monthly Rent (£)</label>
          <input id="rent" type="number" value="750" min="0" step="1" aria-required="true" />
          <div id="errRent" class="error" role="alert">Rent must be at least £1.</div>
        </div>
        <div>
          <label for="rentDay" class="required">Rent Due Day</label>
          <select id="rentDay" aria-required="true">
            <option value="14" selected>14</option>
            <option value="1">1</option><option value="2">2</option><option value="3">3</option>
            <option value="4">4</option><option value="5">5</option><option value="6">6</option>
            <option value="7">7</option><option value="8">8</option><option value="9">9</option>
            <option value="10">10</option><option value="11">11</option><option value="12">12</option>
            <option value="13">13</option><option value="15">15</option><option value="16">16</option>
            <option value="17">17</option><option value="18">18</option><option value="19">19</option>
            <option value="20">20</option><option value="21">21</option><option value="22">22</option>
            <option value="23">23</option><option value="24">24</option><option value="25">25</option>
            <option value="26">26</option><option value="27">27</option><option value="28">28</option>
          </select>
        </div>
      </div>

      <div class="toolbar">
        <button class="btn primary" id="btnGenerate" type="button">Generate Agreement</button>
        <button class="btn" id="btnEmail" type="button">Email David</button>
        <button class="btn" id="btnClear" type="button">Clear Form</button>
        <button class="btn" id="btnClearSigs" type="button">Reset Signatures</button>
      </div>
    </section>

    <!-- Right: Signatures -->
    <section class="card">
      <h2>Signatures</h2>
      <div class="hr"></div>
      <p class="hint">Each sub-tenant gets their own signature pad. Draw slowly for quality or upload a PNG/JPG. Use “Stamp time” to add a UK timestamp.</p>

      <div id="sigContainer"><!-- sub-tenant signature pads inserted here --></div>

      <div class="hr"></div>

      <!-- Lead Tenant -->
      <label>Lead Tenant Signature (David Martin)</label>
      <div class="sig-pad"><canvas id="sigTenant" aria-label="Signature pad for Lead Tenant, David Martin"></canvas></div>
      <div class="sig-tools">
        <button class="btn" id="sigTenantClear" type="button">Clear</button>
        <button class="btn" id="sigTenantStamp" type="button">Stamp time</button>
        <span id="sigTenantTime" class="hint" aria-live="polite">No timestamp yet</span>
      </div>
      <div class="upload">
        <input id="sigTenantUpload" type="file" accept="image/*" aria-label="Upload lead tenant signature image" />
        <span class="hint">Upload PNG or JPG</span>
      </div>

      <div class="hr"></div>

      <!-- Witness -->
      <div class="row">
        <div>
          <label for="witName">Witness name (optional)</label>
          <input id="witName" type="text" />
        </div>
        <div>
          <label>Witness Signature (optional)</label>
          <div class="sig-pad"><canvas id="sigWitness" aria-label="Signature pad for Witness"></canvas></div>
          <div class="sig-tools">
            <button class="btn" id="sigWitClear" type="button">Clear</button>
            <button class="btn" id="sigWitStamp" type="button">Stamp time</button>
            <span id="sigWitTime" class="hint" aria-live="polite">No timestamp yet</span>
          </div>
          <div class="upload">
            <input id="sigWitUpload" type="file" accept="image/*" aria-label="Upload witness signature image" />
            <span class="hint">Upload PNG or JPG</span>
          </div>
        </div>
      </div>

      <div class="toolbar">
        <button class="btn primary" id="btnPrint" type="button">Export as PDF</button>
      </div>
    </section>
  </div>

  <!-- AGREEMENT (print area) -->
  <section class="agreement" id="agreement" aria-label="Agreement Preview">
    <h3>Sub-Tenancy Agreement for Room Rental</h3>
    <p><strong>Property:</strong> Flat 1, 61 Caledonian Crescent, Edinburgh</p>
    <div class="divider"></div>

    <p>This Sub-Tenancy Agreement (“the Agreement”) is made on <span data-bind="agreeDate">[Date]</span> between:</p>
    <ol class="party-list">
      <li><strong><span data-bind="tenantName">David Martin</span></strong> (“the Tenant” or “lead tenant”), the primary tenant and current occupier who rents the property from the landlord through <span data-bind="agent">Milard’s Property Management</span> and has written permission to sub-let one room in the property; and</li>
      <li><strong><span data-bind="subTenant0">[Sub-Tenant Name]</span></strong> (“the Sub-Tenant”), of <span data-bind="subTenantAddr0">[Sub-Tenant Address]</span>.<br>
          <span data-if="hasSub1"><strong><span data-bind="subTenant1">[Co-Sub-Tenant Name]</span></strong> (“the Co-Sub-Tenant”), of <span data-bind="subTenantAddr1">[Co-Sub-Tenant Address]</span>.</span>
      </li>
    </ol>
    <p>Where a Co-Sub-Tenant resides with the Sub-Tenant, both individuals agree to comply with all terms of this Agreement and are jointly responsible for conduct, care of the property and any damage caused by them or their guests (fair wear and tear excepted).</p>

    <h4>1. Property and Facilities</h4>
    <p>The property is a two-bedroom ground-floor flat. The Sub-Tenant rents one private bedroom for exclusive use. Shared areas with the Tenant: kitchen, living room, shower/toilet and garden. Communal facilities include the central garden, heated pool, gym and sauna (access via factor fee included in rent).</p>

    <h4>2. Term</h4>
    <p>The Agreement begins on <span data-bind="startDate">[Start Date]</span> and continues monthly until ended under Section 12.</p>

    <h4>3. Rent and Payments</h4>
    <ul>
      <li>Monthly rent: <strong>£<span data-bind="rent">750</span></strong> for the private room and shared/communal access.</li>
      <li>Due on the <strong><span data-bind="rentDay">14</span></strong> of each month, payable to <span data-bind="tenantName">David Martin</span>. Standing order recommended.</li>
      <li>The rent includes the factor fee for communal facilities and estate maintenance. The lead tenant continues to pay the full property rent to the landlord/agent.</li>
      <li>If rent is unpaid when due, the Tenant may issue notice requiring payment or removal and may apply to court for payment or removal.</li>
    </ul>

    <h4>4. Initial Payments (in place of a deposit)</h4>
    <p>The Sub-Tenant(s) pay the first and last month’s rent upfront (total £<span data-bind="initTotal">1500</span>) on signing. The last month’s rent is held to cover the final month of the tenancy. Following the Sub-Tenant’s departure, reasonable charges for any damage beyond fair wear and tear, professional cleaning if the property is not left in a clean state, or unpaid utilities may be recovered. The Tenant will provide receipts or other reasonable evidence for any such deductions. Any remaining balance will be returned to the Sub-Tenant(s).</p>

    <h4>5. Utilities and Council Tax</h4>
    <p>Electricity and council tax are split equally between the Tenant and the Sub-Tenant(s). These costs are additional to rent and must be paid promptly when billed.</p>

    <h4>6. Access and Privacy</h4>
    <p>The Tenant will not access a Sub-Tenant’s private room without consent and at least 24 hours’ notice, except in emergencies (e.g. fire, flood, gas leak). The Sub-Tenant(s) will permit reasonable access for safety checks and repairs with at least 24 hours’ notice (emergencies excepted).</p>

    <h4>7. Inventory and Condition</h4>
    <p>An inventory for the room and shared areas will be completed at the start. The Sub-Tenant(s) have 7 days to raise discrepancies. On leaving, the room and shared areas must be clean and undamaged (fair wear and tear accepted).</p>

    <h4>8. House Rules</h4>
    <ul>
      <li>Be respectful towards the Tenant, neighbours and residents. No antisocial behaviour.</li>
      <li>Keep shared areas tidy after use and dispose of rubbish/recycling correctly.</li>
      <li>No large gatherings or parties; keep noise to reasonable levels, especially 22:00–07:00.</li>
      <li>No illegal drugs or criminal behaviour on the premises.</li>
      <li>No smoking or vaping inside the flat or common areas.</li>
      <li>No pets without prior written consent from the Tenant.</li>
      <li>Guests are permitted; please communicate plans to the Tenant in advance for awareness. No additional long-term occupiers without agreement.</li>
      <li>Use the Wi-Fi/Internet for lawful purposes only. Do not download or share illegal or indecent content.</li>
    </ul>

    <h4>9. Repairs and Safety</h4>
    <ul>
      <li>Report maintenance issues promptly to the Tenant (David Martin). Do not contact the landlord or managing agent directly.</li>
      <li>Do not tamper with smoke/heat alarms or safety devices. Report faults immediately.</li>
    </ul>

    <h4>10. Parking, Mail and Storage</h4>
    <ul>
      <li>Follow estate rules for parking, bike storage and communal spaces.</li>
      <li>Do not obstruct fire exits, hallways or shared access.</li>
      <li>Collect mail promptly; do not interfere with others’ mail.</li>
    </ul>

    <h4>11. Insurance</h4>
    <p>Sub-Tenant(s) are responsible for insuring their personal belongings.</p>

    <h4>12. Ending the Agreement</h4>
    <ul>
      <li>Either party may end this Agreement by giving at least <span data-bind="notice">28 days</span> written notice. 4–6 weeks’ notice preferred.</li>
      <li>On leaving, return all keys/fobs and leave the room/shared areas clean and undamaged (fair wear and tear accepted).</li>
    </ul>

    <h4>13. Data Protection</h4>
    <p>Basic contact and tenancy details will be held by the Tenant and shared with the landlord/agent only for legitimate tenancy purposes. Documents are stored securely and retained only as necessary.</p>

    <h4>14. General</h4>
    <p>This Agreement is the entire agreement and supersedes prior understandings. Changes must be in writing and signed. Governed by the law of Scotland. Parties will try to resolve disputes amicably before formal action.</p>

    <div class="divider"></div>

    <h4>Acceptance</h4>
    <p>By signing below, the Sub-Tenant(s) confirm they have read and understood this Agreement, agree to pay £<span data-bind="initTotal">1500</span> upfront (first and last month’s rent), then £<span data-bind="rent">750</span> on the <span data-bind="rentDay">14</span> of each month, agree to split utilities and council tax equally, follow the house rules, and give the required notice.</p>

    <div class="signing" id="signingSubs"><!-- sub-tenant signature blocks inserted here --></div>

    <div class="signing">
      <div class="sig-block">
        <p><strong>Lead Tenant:</strong> <span data-bind="tenantName">David Martin</span></p>
        <img id="imgTenant" class="sig-img" alt="Tenant signature" />
        <div class="sig-line"></div>
        <div class="printed-name">Printed name: <span data-bind="tenantName">David Martin</span></div>
        <p class="stamp">Signed and dated: <span id="stampTenant">[Signature and UK timestamp]</span></p>
      </div>
      <div class="sig-block">
        <p><strong>Witness (optional):</strong> <span id="bindWitName">[Witness]</span></p>
        <img id="imgWit" class="sig-img" alt="Witness signature" />
        <div class="sig-line"></div>
        <div class="printed-name">Printed name: <span id="bindWitName2">[Witness]</span></div>
        <p class="stamp">Signed and dated: <span id="stampWit">[Signature and UK timestamp]</span></p>
      </div>
    </div>
  </section>

  <div class="toolbar" style="margin-top:12px">
    <button class="btn link" id="btnScrollTop" type="button">Back to form</button>
    <button class="btn" id="btnEmailBottom" type="button">Email David</button>
    <button class="btn primary" id="btnPrint2" type="button">Export as PDF</button>
  </div>
</div>

<script>
(function(){
  // ---------- Utilities ----------
  const gbNow = () => new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour12:false });
  const $ = (id) => document.getElementById(id);
  const saveIndicator = $('saveIndicator');
  const setBind = (key, val) => document.querySelectorAll('[data-bind="'+key+'"]').forEach(el => el.textContent = val || '');
  const formatUkDate = (value, fallback) => {
    if(!value) return fallback;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallback : parsed.toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
  };
  function debounce(fn, ms){
    let t;
    return (...args)=>{
      clearTimeout(t);
      t = setTimeout(()=>fn.apply(this,args), ms);
    };
  }

  // ---------- Elements ----------
  const els = {
    agreeDate: $('agreeDate'),
    startDate: $('startDate'),
    tenantName: $('tenantName'),
    agent: $('agent'),
    rent: $('rent'),
    rentDay: $('rentDay'),
    witName: $('witName'),
    imgTenant: $('imgTenant'),
    imgWit: $('imgWit'),
    stampTenant: $('stampTenant'),
    stampWit: $('stampWit'),
    errAgreeDate: $('errAgreeDate'),
    errStartDate: $('errStartDate'),
    errRent: $('errRent'),
    subsContainer: $('subsContainer'),
    sigContainer: $('sigContainer'),
    signingSubs: $('signingSubs'),
  };

  // ---------- Defaults ----------
  const today = new Date();
  els.agreeDate.value = today.toISOString().slice(0,10);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate()+7);
  els.startDate.value = nextWeek.toISOString().slice(0,10);

  // ---------- Sub-tenant model (max 2) ----------
  const MAX_SUBS = 2;
  let subs = []; // [{name, addr}]
  const FORM_KEY = 'tenancyForm_v3';
  const SIG_KEYS = { tenant:'sig_tenant', witness:'sig_witness' };

  function newSub(i){
    return { name:'', addr:'', sigKey:`sig_sub_${i}`, tsId:`stampSub${i}` };
  }

  function syncSubsFromDom(){
    subs.forEach((s,i)=>{
      const nameEl = document.getElementById(`subName_${i}`);
      const addrEl = document.getElementById(`subAddr_${i}`);
      if(nameEl) s.name = nameEl.value;
      if(addrEl) s.addr = addrEl.value;
    });
  }

  function renderSubs(){
    syncSubsFromDom();
    // ensure at least one sub
    if(subs.length === 0) subs.push(newSub(0));
    if(subs.length > MAX_SUBS) subs = subs.slice(0, MAX_SUBS);

    // Build form blocks
    els.subsContainer.innerHTML = '';
    subs.forEach((s, i)=>{
      const block = document.createElement('div');
      block.className = 'card';
      block.style.border='1px dashed var(--line)';
      block.style.padding='12px';
      block.style.marginTop='8px';
      block.innerHTML = `
        <h4 style="margin:0 0 6px; font-size:16px">Sub-Tenant ${i+1}${i===0?' (required)':''}</h4>
        <label class="required">Full Name</label>
        <input type="text" id="subName_${i}" placeholder="Full legal name" aria-required="${i===0?'true':'false'}" />
        <div id="errSubName_${i}" class="error" role="alert">Please enter the sub-tenant’s full name.</div>
        <label class="required">Current Address</label>
        <textarea id="subAddr_${i}" placeholder="Address" aria-required="${i===0?'true':'false'}"></textarea>
        <div id="errSubAddr_${i}" class="error" role="alert">Please enter the sub-tenant’s address.</div>
      `;
      els.subsContainer.appendChild(block);
    });

    // Build signature pads
    els.sigContainer.innerHTML = '';
    subs.forEach((s, i)=>{
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <label>Sub-Tenant ${i+1} Signature</label>
        <div class="sig-pad"><canvas id="sigSub_${i}" aria-label="Signature pad for Sub-Tenant ${i+1}"></canvas></div>
        <div class="sig-tools">
          <button class="btn" id="sigSubClear_${i}" type="button">Clear</button>
          <button class="btn" id="sigSubStamp_${i}" type="button">Stamp time</button>
          <span id="sigSubTime_${i}" class="hint" aria-live="polite">No timestamp yet</span>
        </div>
        <div class="upload">
          <input id="sigSubUpload_${i}" type="file" accept="image/*" />
          <span class="hint">Upload PNG or JPG</span>
        </div>
        <div class="hr"></div>
      `;
      els.sigContainer.appendChild(wrap);
    });

    // Build signing blocks in agreement
    els.signingSubs.innerHTML = '';
    subs.forEach((s, i)=>{
      const sb = document.createElement('div');
      sb.className = 'sig-block';
      sb.innerHTML = `
        <p><strong>${i===0?'Sub-Tenant':'Co-Sub-Tenant'}:</strong> <span data-bind="subTenant${i}">[Name]</span></p>
        <img id="imgSub_${i}" class="sig-img" alt="Sub-Tenant signature ${i+1}" />
        <div class="sig-line"></div>
        <div class="printed-name">Printed name: <span data-bind="subTenant${i}">[Name]</span></div>
        <p class="stamp">Signed and dated: <span id="stampSub${i}">[Signature and UK timestamp]</span></p>
      `;
      els.signingSubs.appendChild(sb);
    });

    // Attach inputs & autosave for new sub fields
    subs.forEach((s,i)=>{
      const n = $('subName_'+i), a = $('subAddr_'+i);
      n.value = s.name || ''; a.value = s.addr || '';
      n.addEventListener('input', debounce(saveForm,500));
      a.addEventListener('input', debounce(saveForm,500));
      n.addEventListener('blur', ()=> showError(n, $('errSubName_'+i), i===0 && !n.value.trim()));
      a.addEventListener('blur', ()=> showError(a, $('errSubAddr_'+i), i===0 && !a.value.trim()));
    });

    // Create signature pads for each sub
    subs.forEach((s,i)=>{
      s.sig = makeSig(`sigSub_${i}`, `sigSubTime_${i}`, s.tsId, s.sigKey, `imgSub_${i}`);
      $('sigSubClear_'+i).addEventListener('click', s.sig.clearSig);
      $('sigSubStamp_'+i).addEventListener('click', s.sig.stamp);
      handleUpload($('sigSubUpload_'+i), $('imgSub_'+i), s.sigKey);
    });

    // Load saved sub signatures
    subs.forEach((s,i)=>{ loadSigImage(s.sigKey, $('imgSub_'+i)); });

    bindAgreement();
  }

  // ---------- Buttons to add/remove sub-tenant ----------
  $('btnAddSub').addEventListener('click', ()=>{
    if(subs.length>=MAX_SUBS){ alert('You can add up to two sub-tenants.'); return; }
    subs.push(newSub(subs.length));
    renderSubs(); saveForm();
  });
  $('btnRemoveSub').addEventListener('click', ()=>{
    if(subs.length<=1){ alert('At least one sub-tenant is required.'); return; }
    const removed = subs.pop();
    try{ localStorage.removeItem(removed.sigKey); }catch(e){}
    renderSubs(); saveForm();
  });

  // ---------- Validation ----------
  function showError(el, errEl, cond){
    if(cond){ errEl.style.display='block'; el.setAttribute('aria-invalid','true'); el.style.borderColor='var(--danger)'; return false; }
    errEl.style.display='none'; el.removeAttribute('aria-invalid'); el.style.borderColor=''; return true;
  }
  function validate(){
    const v1 = showError(els.agreeDate, els.errAgreeDate, !els.agreeDate.value);
    const v2 = showError(els.startDate, els.errStartDate, !els.startDate.value);
    const rentVal = Number(els.rent.value||0);
    const v3 = showError(els.rent, els.errRent, !(rentVal>=1));
    // sub 0 required
    const n0 = $('subName_0'), a0 = $('subAddr_0');
    const v4 = showError(n0, $('errSubName_0'), !n0.value.trim());
    const v5 = showError(a0, $('errSubAddr_0'), !a0.value.trim());
    return v1 && v2 && v3 && v4 && v5;
  }

  // ---------- Binding into Agreement ----------
  function bindAgreement(){
    setBind('agreeDate', formatUkDate(els.agreeDate.value, '[Date]'));
    setBind('startDate', formatUkDate(els.startDate.value, '[Start Date]'));
    const tenantName = (els.tenantName.value || '').trim() || '[Lead tenant]';
    const agentName = (els.agent.value || '').trim() || '[Managing agent]';
    setBind('tenantName', tenantName);
    setBind('agent', agentName);
    const rentVal = Number(els.rent.value);
    const rentValid = Number.isFinite(rentVal) && rentVal > 0;
    setBind('rent', rentValid ? rentVal.toString() : '[Rent]');
    setBind('rentDay', els.rentDay.value || '[day]');
    setBind('notice', '28 days');
    setBind('initTotal', rentValid ? (rentVal*2).toString() : '[Total]');

    // subs
    subs.forEach((s,i)=>{
      const nameInput = $('subName_'+i);
      const addrInput = $('subAddr_'+i);
      const n = (nameInput?.value || s.name || '').trim();
      const a = (addrInput?.value || s.addr || '').trim();
      setBind('subTenant'+i, n || `[Sub-Tenant ${i+1}]`);
      setBind('subTenantAddr'+i, a || `[Address ${i+1}]`);
    });
    for(let i=subs.length;i<MAX_SUBS;i++){
      setBind('subTenant'+i, `[Sub-Tenant ${i+1}]`);
      setBind('subTenantAddr'+i, `[Address ${i+1}]`);
    }

    // show/hide co-sub paragraph
    document.querySelectorAll('[data-if="hasSub1"]').forEach(el=>{
      el.style.display = subs.length>1 ? 'inline' : 'none';
    });

    // witness name
    const wn = (els.witName.value || '').trim() || '[Witness]';
    $('bindWitName').textContent = wn;
    $('bindWitName2').textContent = wn;
  }

  // ---------- Print / PDF ----------
  function applyCanvasToImage(sigObj, imgEl){
    if(sigObj && sigObj.hasInk && sigObj.canvas){
      const b64 = sigObj.canvas.toDataURL('image/png'); imgEl.src=b64; imgEl.style.display='block';
    }
  }
  function printNow(){
    bindAgreement();
    subs.forEach(s=> s.sig && s.sig.persist());
    sigTenant.persist();
    sigWit.persist();
    
    subs.forEach((s,i)=>{
      const img = $('imgSub_'+i);
      if(s.sig) applyCanvasToImage(s.sig, img);
    });
    applyCanvasToImage(sigTenant, els.imgTenant);
    applyCanvasToImage(sigWit, els.imgWit);
    window.print();
  }
  $('btnPrint').addEventListener('click', printNow);
  $('btnPrint2').addEventListener('click', printNow);
  $('btnScrollTop').addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // ---------- Email (mailto) ----------
  function emailDavid(){
    const names = subs.map((_,i)=> $('subName_'+i).value.trim() || `Sub-Tenant ${i+1}`).join(' & ');
    const subject = encodeURIComponent(`Sub-Tenancy Agreement — ${names}`);
    const body = encodeURIComponent(
`Hi David,

The sub-tenancy agreement is completed for ${names}.
Start Date: ${els.startDate.value || '[date]'}
Monthly Rent: £${els.rent.value || '750'}
Due Day: ${els.rentDay.value}

I’ve attached the PDF (or will send it next). 

Thanks.`
    );
    window.location.href = `mailto:david.martin.1296@gmail.com?subject=${subject}&body=${body}`;
  }
  $('btnEmail').addEventListener('click', emailDavid);
  $('btnEmailBottom').addEventListener('click', emailDavid);

  // ---------- Signature pads / uploads ----------
  function makeSig(canvasId, timeSpanId, stampOutputId, storageKey, imgId){
    const canvas = $(canvasId), ctx = canvas.getContext('2d');
    const timeEl = $(timeSpanId);
    const stampOut = $(stampOutputId);
    const imgEl = imgId ? $(imgId) : null;
    let drawing=false, hasInk=false, last={x:0,y:0};

    function resize(){
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio||1,1);
      const hCSS = 160;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(hCSS * ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
      ctx.lineWidth=2; ctx.lineCap='round'; ctx.strokeStyle='#111';
      ctx.clearRect(0,0,rect.width,hCSS);
    }
    resize(); new ResizeObserver(resize).observe(canvas);

    function pos(e){ const r=canvas.getBoundingClientRect(); const t=e.touches&&e.touches[0]; const x=(t?t.clientX:e.clientX)-r.left; const y=(t?t.clientY:e.clientY)-r.top; return {x,y}; }
    function down(e){ e.preventDefault(); drawing=true; hasInk=true; last=pos(e); }
    function move(e){ if(!drawing) return; const p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; }
    function up(){ drawing=false; }

    canvas.addEventListener('mousedown',down);
    canvas.addEventListener('mousemove',move);
    window.addEventListener('mouseup',up);
    canvas.addEventListener('touchstart',down,{passive:false});
    canvas.addEventListener('touchmove',move,{passive:false});
    canvas.addEventListener('touchend',up);

    function clearSig(){
      if(hasInk && !confirm('Clear this signature?')) return;
      const rect=canvas.getBoundingClientRect();
      ctx.clearRect(0,0,rect.width,rect.height);
      ctx.lineWidth=2; ctx.lineCap='round'; ctx.strokeStyle='#111';
      hasInk=false;
      if(timeEl) timeEl.textContent='No timestamp yet';
      if(stampOut) stampOut.textContent='[Signature and UK timestamp]';
      try{ localStorage.removeItem(storageKey); }catch(e){}
      if(imgEl){ imgEl.removeAttribute('src'); imgEl.style.display='none'; }
      indicateSaved();
    }
    function stamp(){ const ts=gbNow(); if(timeEl) timeEl.textContent=`Signed ${ts} (UK)`; if(stampOut) stampOut.textContent=ts+' (UK)'; }
    function persist(){
      try{
        if(hasInk){
          const b64=canvas.toDataURL('image/png');
          localStorage.setItem(storageKey, b64);
          if(imgEl){ imgEl.src=b64; imgEl.style.display='block'; }
          indicateSaved();
        }
      }catch(e){ indicateError(); }
    }
    return { canvas, clearSig, stamp, persist, get hasInk(){return hasInk;} };
  }

  function handleUpload(inputEl, imgEl, storageKey){
    inputEl.addEventListener('change', ()=>{
      const f=inputEl.files && inputEl.files[0]; if(!f) return;
      const reader=new FileReader();
      reader.onload=()=>{ imgEl.src=reader.result; imgEl.style.display='block'; try{ localStorage.setItem(storageKey, reader.result); indicateSaved(); }catch(e){ indicateError(); } };
      reader.readAsDataURL(f);
    });
  }
  function loadSigImage(key, imgEl){
    try{ const b64=localStorage.getItem(key); if(b64){ imgEl.src=b64; imgEl.style.display='block'; } }catch(e){}
  }

  // Lead tenant & witness signatures
  const sigTenant = makeSig('sigTenant','sigTenantTime','stampTenant',SIG_KEYS.tenant,'imgTenant');
  const sigWit = makeSig('sigWitness','sigWitTime','stampWit',SIG_KEYS.witness,'imgWit');
  $('sigTenantClear').addEventListener('click', sigTenant.clearSig);
  $('sigTenantStamp').addEventListener('click', sigTenant.stamp);
  $('sigWitClear').addEventListener('click', sigWit.clearSig);
  $('sigWitStamp').addEventListener('click', sigWit.stamp);
  handleUpload($('sigTenantUpload'), els.imgTenant, SIG_KEYS.tenant);
  handleUpload($('sigWitUpload'), els.imgWit, SIG_KEYS.witness);
  loadSigImage(SIG_KEYS.tenant, els.imgTenant);
  loadSigImage(SIG_KEYS.witness, els.imgWit);

  // ---------- Save / Load ----------
  function indicateSaved(){ saveIndicator.textContent='Saved'; saveIndicator.setAttribute('data-state','saved'); setTimeout(()=>{saveIndicator.textContent=''; saveIndicator.removeAttribute('data-state');},1200); }
  function indicateError(){ saveIndicator.textContent='Save failed'; saveIndicator.setAttribute('data-state','error'); setTimeout(()=>{saveIndicator.textContent=''; saveIndicator.removeAttribute('data-state');},1500); }

  function saveForm(){
    try{
      subs.forEach((s,i)=>{
        s.name = $('subName_'+i)?.value || '';
        s.addr = $('subAddr_'+i)?.value || '';
      });
      bindAgreement();
      const data = {
        agreeDate: els.agreeDate.value,
        startDate: els.startDate.value,
        rent: els.rent.value,
        rentDay: els.rentDay.value,
        witName: els.witName.value,
        subs: subs.map(s=>({ name: s.name || '', addr: s.addr || '', sigKey: s.sigKey, tsId:s.tsId }))
      };
      localStorage.setItem(FORM_KEY, JSON.stringify(data));
      indicateSaved();
    }catch(e){ indicateError(); }
  }
  function loadForm(){
    try{
      const saved = localStorage.getItem(FORM_KEY);
      if(saved){
        const d=JSON.parse(saved);
        if(d.subs && Array.isArray(d.subs) && d.subs.length>=1){
          subs = d.subs.map((x,idx)=>({ name:x.name||'', addr:x.addr||'', sigKey:x.sigKey||`sig_sub_${idx}`, tsId:x.tsId||`stampSub${idx}` }));
        }else{
          subs = [newSub(0)];
        }
      }else{
        subs = [newSub(0)];
      }
      renderSubs();

      if(saved){
        const d=JSON.parse(saved);
        els.agreeDate.value = d.agreeDate || els.agreeDate.value;
        els.startDate.value = d.startDate || els.startDate.value;
        els.rent.value = d.rent || els.rent.value;
        els.rentDay.value = d.rentDay || els.rentDay.value;
        els.witName.value = d.witName || '';
        // fill names/addresses
        (d.subs||[]).forEach((s,i)=>{ const n=$('subName_'+i), a=$('subAddr_'+i); if(n) n.value = s.name||''; if(a) a.value = s.addr||''; });
      }
    }catch(e){ subs=[newSub(0)]; renderSubs(); }
  }

  // Autosave fields
  ['agreeDate','startDate','rent','rentDay','witName'].forEach(id=>{
    const el = $(id);
    if(!el) return;
    const handler = debounce(saveForm,500);
    ['input','change'].forEach(evt=> el.addEventListener(evt, handler));
    el.addEventListener('blur', saveForm);
  });

  // ---------- Generate ----------
  $('btnGenerate').addEventListener('click', ()=>{
    if(!validate()) return;
    saveForm();
    // persist signatures to images so they print
    subs.forEach(s=> s.sig && s.sig.persist());
    sigTenant.persist(); sigWit.persist();
    const a = $('agreement'); window.scrollTo({ top: a.offsetTop - 8, behavior:'smooth' });
  });

  // Clear
  $('btnClear').addEventListener('click', ()=>{
    if(!confirm('Clear all form fields (signatures are kept unless you clear them individually)?')) return;
    localStorage.removeItem(FORM_KEY);
    els.agreeDate.value = today.toISOString().slice(0,10);
    els.startDate.value = nextWeek.toISOString().slice(0,10);
    els.rent.value = 750;
    els.rentDay.value = '14';
    els.witName.value = '';
    subs = [newSub(0)];
    renderSubs();
    saveForm();
  });

  $('btnClearSigs').addEventListener('click', ()=>{
    if(!confirm('Are you sure you want to clear all signatures? This cannot be undone.')) return;
    try {
      // Clear sub-tenant signatures
      subs.forEach(s => {
        if (s.sigKey) localStorage.removeItem(s.sigKey);
      });
      // Clear lead tenant and witness signatures
      localStorage.removeItem(SIG_KEYS.tenant);
      localStorage.removeItem(SIG_KEYS.witness);

      // Re-render the signature pads and blocks
      renderSubs();
      
      // Clear the main signature pads manually
      sigTenant.clearSig();
      sigWit.clearSig();

      alert('All signatures have been cleared.');
    } catch (e) {
      alert('An error occurred while clearing signatures.');
    }
  });

  // Live witness binding
  els.witName.addEventListener('input', bindAgreement);

  // Load + initial render
  loadForm(); bindAgreement();

  // Extra email option (client-side send) — OPTIONAL:
  // If you want to send directly without opening the mail app, use EmailJS.
  // 1) Sign up at emailjs.com
  // 2) Create a service + template
  // 3) Include EmailJS SDK: <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
  // 4) Initialize: emailjs.init('YOUR_PUBLIC_KEY');
  // 5) Then call emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{ ...fields... })
  // NOTE: Attaching the generated PDF from the browser is possible by generating a Blob and converting to base64,
  // but some mail providers block large base64 payloads. For robust sending with attachments, use a tiny server function (e.g., Vercel + Resend).
})();
</script>
</body>
</html>
