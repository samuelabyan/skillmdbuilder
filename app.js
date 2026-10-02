(function(){
const $=s=>document.querySelector(s);
const blank=()=>({title:"",description:"",purpose:"",license:"",compat:"",author:"",version:"1.0",
 when:"",does:"",avoid:"",steps:[""],rules:"",tools:"",edge:"",format:"",quality:"",exIn:"",exOut:""});
const sample=()=>({title:"Meeting Notes Summarizer",
 description:"Turns raw meeting notes or transcripts into a short summary with decisions and action items. Use when the user shares meeting notes, a transcript, or asks for a recap of a meeting.",
 purpose:"Help people quickly see what was decided and who needs to do what after a meeting.",license:"MIT",compat:"",author:"",version:"1.0",
 when:"The user pastes meeting notes or a transcript\nThe user asks for a recap, summary, or action items",
 does:"Summarize the main discussion in a few sentences\nList decisions that were made\nList action items with owner and due date",
 avoid:"Inventing owners or dates that are not in the notes\nSummarizing documents that are not about a meeting",
 steps:["Read the full notes before writing anything.","Identify the topics discussed and the decisions made.","Collect action items, including owner and due date when stated.","Write the summary using the output format below.","Check that nothing in the summary is missing from the notes."],
 rules:"Keep the summary under 200 words\nUse plain, neutral language\nQuote names exactly as written",tools:"No special tools needed. Work only with the text the user provides.",
 edge:"If no decisions were made, say so.\nIf an owner is unclear, write \"Owner: unassigned\".\nIf the notes are very short, ask the user for more detail.",
 format:"Use these headings: Summary, Decisions, Action items. Action items are a checklist.",quality:"Every action item has an owner or says unassigned\nNo information is added that is not in the notes",
 exIn:"Notes: Sam will send the budget by Friday. We agreed to launch in May.",exOut:"## Summary\nThe team confirmed a May launch.\n\n## Decisions\n- Launch in May\n\n## Action items\n- [ ] Sam: send the budget (due Friday)"});
let S=blank(),step=0,visited=new Set([0]),manual=false;
try{const j=localStorage.getItem("skillbuilder");if(j)S=Object.assign(blank(),JSON.parse(j))}catch(e){}

const steps=[
{n:"Basics",h:"Name your skill",l:"Give your skill a name and say what it is for. Keep it simple.",f:[
 {k:"title",t:"Skill name",i:"Short and clear. We turn it into a folder-safe name for you.",eg:"Meeting Notes Summarizer",one:1},
 {k:"description",t:"Description",i:"Say what the skill does and when to use it. The AI reads this to decide when to load the skill.",eg:"Turns meeting notes into a summary with action items. Use when the user shares meeting notes.",max:1024},
 {k:"purpose",t:"Purpose",i:"One or two sentences on the goal and who it helps.",eg:"Help people see what was decided after a meeting."}],adv:1},
{n:"Scope",h:"Set the scope",l:"Describe when the skill applies. Write one item per line.",f:[
 {k:"when",t:"When to use it",i:"Situations or requests that should trigger this skill.",eg:"The user pastes meeting notes\nThe user asks for action items"},
 {k:"does",t:"What it should do",i:"The main things the skill is responsible for.",eg:"Summarize the discussion\nList decisions"},
 {k:"avoid",t:"What to avoid",i:"Things the skill should not do or situations where it should stay out.",eg:"Do not invent names or dates"}]},
{n:"Workflow",h:"Plan the workflow",l:"List the steps the AI should follow, in order. Use the arrows to reorder.",wf:1},
{n:"Guidelines",h:"Add guidelines",l:"Rules help the AI stay consistent. One item per line.",f:[
 {k:"rules",t:"Rules",i:"Style, tone, limits, or things that must always be true.",eg:"Keep it under 200 words\nUse plain language"},
 {k:"tools",t:"Tool usage",i:"Which tools, files, or commands may be used. Say 'none' if the skill needs no tools.",eg:"No special tools. Use only the text the user provides."},
 {k:"edge",t:"Edge cases",i:"What to do when something is missing, unclear, or unusual.",eg:"If no owner is named, write 'unassigned'\nIf the notes are empty, ask for them"}]},
{n:"Output",h:"Define the output",l:"Describe what a good result looks like. An example is optional but helps a lot.",f:[
 {k:"format",t:"Output format",i:"Structure, headings, length, or file type of the result.",eg:"Headings: Summary, Decisions, Action items"},
 {k:"quality",t:"Quality checks (optional)",i:"What the AI should verify before replying. One per line.",eg:"Every action item has an owner"},
 {k:"exIn",t:"Example input (optional)",i:"A sample request a user might send.",eg:"Notes: Sam sends the budget Friday. Launch in May.",min:1},
 {k:"exOut",t:"Example output (optional)",i:"What the ideal answer looks like.",eg:"## Decisions\n- Launch in May",min:0}]},
{n:"Review",h:"Review and download",l:"Edit the Markdown on the right if you want. Then download or copy it.",rev:1}];

const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=t=>t.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,64).replace(/-+$/,"");
const lines=t=>t.split("\n").map(x=>x.trim()).filter(Boolean);
const bl=t=>lines(t).map(x=>"- "+x.replace(/^[-*•]\s+/,"")).join("\n");
const yq=v=>/[:#\n"'\[\]{}>|&*!%@`]/.test(v)||/^\s|\s$/.test(v)?'"'+v.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g," ")+'"':v;

function gen(){
 const s=S,nm=slug(s.title)||"my-skill",o=[];
 o.push("---","name: "+nm,"description: "+yq((s.description||"Describe what this skill does and when to use it.").replace(/\s+/g," ").trim()));
 if(s.license.trim())o.push("license: "+yq(s.license.trim()));
 if(s.compat.trim())o.push("compatibility: "+yq(s.compat.trim()));
 if(s.author.trim()||s.version.trim()){o.push("metadata:");if(s.author.trim())o.push("  author: "+yq(s.author.trim()));if(s.version.trim())o.push("  version: "+yq(s.version.trim()))}
 o.push("---","","# "+(s.title.trim()||"My Skill"));
 const sec=(h,b)=>{if(b&&b.trim())o.push("","## "+h,"",b.trim())};
 if(s.purpose.trim())o.push("",s.purpose.trim());
 sec("When to use",bl(s.when));
 sec("What this skill does",bl(s.does));
 sec("What to avoid",bl(s.avoid));
 const st=s.steps.map(x=>x.trim()).filter(Boolean);
 sec("Workflow",st.map((x,i)=>(i+1)+". "+x).join("\n"));
 if(s.rules.trim()||s.tools.trim()||s.edge.trim()){
  o.push("","## Guidelines");
  if(s.rules.trim())o.push("","### Rules","",bl(s.rules));
  if(s.tools.trim())o.push("","### Tool usage","",s.tools.trim());
  if(s.edge.trim())o.push("","### Edge cases","",bl(s.edge));
 }
 if(s.format.trim()||s.quality.trim()){
  o.push("","## Output");
  if(s.format.trim())o.push("",s.format.trim());
  if(s.quality.trim())o.push("","Before replying, check that:","",lines(s.quality).map(x=>"- [ ] "+x.replace(/^[-*•]\s+/,"")).join("\n"));
 }
 if(s.exIn.trim()||s.exOut.trim()){
  o.push("","## Example");
  if(s.exIn.trim())o.push("","**Input:**","","```text",s.exIn.trim(),"```");
  if(s.exOut.trim())o.push("","**Output:**","","```markdown",s.exOut.trim(),"```");
 }
 return o.join("\n")+"\n";
}

const md=$("#md");
function refresh(){
 if(!manual)md.value=gen();
 try{localStorage.setItem("skillbuilder",JSON.stringify(S))}catch(e){}
}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.remove("on"),1800)}

function nav(){
 $("#nav").innerHTML=steps.map((s,i)=>`<button type="button" data-i="${i}" class="${i==step?"on":""} ${i!=step&&visited.has(i)&&i<step?"done":""}" ${i==step?'aria-current="step"':""}><span class="dot">${i<step&&visited.has(i)?"✓":i+1}</span><span class="t">${s.n}</span></button>`).join("");
 $("#bar").style.width=((step+1)/steps.length*100)+"%";
 $("#back").disabled=step==0;$("#back").style.opacity=step==0?.4:1;
 $("#next").style.display=step==steps.length-1?"none":"";
}
function field(f){
 const v=esc(S[f.k]);let c="";
 if(f.one)c=`<input type="text" data-k="${f.k}" value="${v}" placeholder="${esc(f.eg)}" autocomplete="off">`;
 else c=`<textarea data-k="${f.k}" placeholder="${esc(f.eg)}" ${f.min===0?'style="min-height:130px"':""}>${v}</textarea>`;
 let extra="";
 if(f.k=="title")extra=`<div class="slug">File name: <code id="slug"></code></div>`;
 if(f.max)extra=`<div class="cnt" id="cnt"></div>`;
 return `<label for="">${f.t}</label><p class="hint">${f.i}</p>${c}${extra}<div class="eg">Example: ${esc(f.eg).replace(/\n/g,"<br>")}</div>`;
}
function wfRows(){
 const a=S.steps;
 $("#wf").innerHTML=a.map((x,i)=>`<div class="row"><span class="n">${i+1}.</span><input type="text" data-w="${i}" value="${esc(x)}" placeholder="Describe this step" aria-label="Step ${i+1}">
 <button class="ib" type="button" data-a="up" data-i="${i}" ${i==0?"disabled":""} aria-label="Move up">↑</button>
 <button class="ib" type="button" data-a="dn" data-i="${i}" ${i==a.length-1?"disabled":""} aria-label="Move down">↓</button>
 <button class="ib" type="button" data-a="rm" data-i="${i}" ${a.length==1?"disabled":""} aria-label="Remove">✕</button></div>`).join("");
}
function review(){
 const s=S,ck=[[slug(s.title),"Name is set"],[s.description.trim().length>=40,"Description explains what it does and when to use it"],[s.when.trim(),"Says when to use it"],[s.steps.some(x=>x.trim()),"Has at least one workflow step"],[s.format.trim(),"Describes the output"]];
 return `<ul class="chk">${ck.map(c=>`<li><span class="${c[0]?"y":"n2"}">${c[0]?"✓":"•"}</span>${c[1]}${c[0]?"":" (optional but recommended)"}</li>`).join("")}</ul>
 <div class="acts"><button class="btn pri" id="dl" type="button">Download SKILL.md</button><button class="btn" id="cp" type="button">Copy Markdown</button><button class="btn" id="rs" type="button">Reset edits</button></div>
 <div class="tip"><b>How to use it:</b> create a folder named <code>${esc(slug(s.title)||"my-skill")}</code>, put the downloaded <code>SKILL.md</code> inside, and add it to any assistant that supports Agent Skills. For other tools, paste the content into their instructions.</div>
 <p class="hint" style="margin-top:12px">Edits you make in the preview are kept. “Reset edits” rebuilds the file from your answers.</p>`;
}
function render(){
 const d=steps[step];let h=`<div class="kick">Step ${step+1} of ${steps.length}</div><h1>${d.h}</h1><p class="lead">${d.l}</p>`;
 if(d.f)h+=d.f.map(field).join("");
 if(d.adv)h+=`<details><summary>Optional details</summary>
  <label>License</label><input type="text" data-k="license" value="${esc(S.license)}" placeholder="MIT">
  <label>Compatibility</label><p class="hint">Only if the skill needs something special.</p><input type="text" data-k="compat" value="${esc(S.compat)}" placeholder="Needs internet access">
  <label>Author</label><input type="text" data-k="author" value="${esc(S.author)}">
  <label>Version</label><input type="text" data-k="version" value="${esc(S.version)}"></details>`;
 if(d.wf)h+=`<div id="wf"></div><button class="btn sm" id="add" type="button">+ Add step</button><div class="eg" style="margin-top:12px">Example: 1. Read the notes. 2. Find decisions. 3. List action items. 4. Write the summary.</div>`;
 if(d.rev)h+=review();
 $("#step").innerHTML=h;
 if(d.wf)wfRows();
 md.readOnly=!d.rev;$("#pmode").textContent=d.rev?"editable":"live preview";
 md.setAttribute("aria-readonly",!d.rev);
 upd();nav();refresh();$("#scroll").scrollTop=0;window.scrollTo(0,0);
}
function upd(){
 const sl=$("#slug");if(sl)sl.textContent=(slug(S.title)||"my-skill")+"/SKILL.md";
 const c=$("#cnt");if(c){const n=S.description.length;c.textContent=n+" / 1024";c.style.color=n>1024?"var(--warn)":""}
}
function go(i){step=Math.max(0,Math.min(steps.length-1,i));visited.add(step);render()}

$("#step").addEventListener("input",e=>{
 const t=e.target;
 if(t.dataset.k){S[t.dataset.k]=t.value;upd();refresh()}
 else if(t.dataset.w!==undefined){S.steps[+t.dataset.w]=t.value;refresh()}
});
$("#step").addEventListener("keydown",e=>{
 if(e.key=="Enter"&&e.target.dataset.w!==undefined){e.preventDefault();const i=+e.target.dataset.w;S.steps.splice(i+1,0,"");wfRows();$("#wf").querySelector(`[data-w="${i+1}"]`).focus();refresh()}
});
$("#step").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 const a=S.steps,i=+b.dataset.i;
 if(b.id=="add"){a.push("");wfRows();$("#wf").querySelector(`[data-w="${a.length-1}"]`).focus()}
 else if(b.dataset.a=="up"&&i>0){[a[i-1],a[i]]=[a[i],a[i-1]];wfRows()}
 else if(b.dataset.a=="dn"&&i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];wfRows()}
 else if(b.dataset.a=="rm"&&a.length>1){a.splice(i,1);wfRows()}
 else if(b.id=="dl")download();
 else if(b.id=="cp")copy();
 else if(b.id=="rs"){manual=false;refresh();toast("Rebuilt from your answers")}
 else return;
 refresh();
});
md.addEventListener("input",()=>{if(!md.readOnly)manual=true});
$("#nav").addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(+b.dataset.i)});
$("#next").onclick=()=>go(step+1);
$("#back").onclick=()=>go(step-1);
$("#showp").onclick=()=>$("#app").classList.add("showp");
$("#closep").onclick=()=>$("#app").classList.remove("showp");
$("#sample").onclick=()=>{if(confirm("Replace your answers with the example skill?")){S=sample();manual=false;render();toast("Example loaded")}};
$("#clear").onclick=()=>{if(confirm("Clear all answers and start over?")){S=blank();manual=false;visited=new Set([0]);go(0)}};

function download(){
 const blob=new Blob([md.value],{type:"text/markdown;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="SKILL.md";
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("Downloaded SKILL.md");
}
function copy(){
 const done=()=>toast("Copied to clipboard");
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(md.value).then(done,fb);else fb();
 function fb(){const ro=md.readOnly;md.readOnly=false;md.select();try{document.execCommand("copy");done()}catch(e){toast("Press Ctrl+C to copy")}md.readOnly=ro}
}
render();
})();
