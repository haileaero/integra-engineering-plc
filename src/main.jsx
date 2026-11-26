import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { Menu, X, ArrowRight, Users, ShieldCheck, Lightbulb, MapPin, Mail, Phone, Linkedin, Facebook, Youtube, Send, LogOut, Plus, Save, Image as ImageIcon, Trash2 } from 'lucide-react'
import './styles.css'

const defaultContent = {
  settings:{companyName:'INTEGRA Engineering PLC',email:'info@integra-eng.com',phone:'+251 9XX XXX XXX',address:'Addis Ababa, Ethiopia',linkedin:'',facebook:'',youtube:'',telegram:''},
  hero:{eyebrow:'MULTI-DISCIPLINARY ENGINEERING',title:'Engineering Different Disciplines. One Integrated Solution.',description:'INTEGRA Engineering PLC brings together multidisciplinary engineering expertise to deliver practical and innovative solutions in Ethiopia.',image:'/assets/hero.svg'},
  about:{title:'About INTEGRA',description:'INTEGRA Engineering PLC is an Ethiopian multidisciplinary engineering company that brings together professionals from different engineering fields to develop, implement, and maintain practical solutions.',image:'/assets/civil.svg'},
  services:[
    {id:'s1',name:'Mechanical Engineering',description:'Design, fabrication, maintenance and mechanical systems.',image:'/assets/mechanical.svg'},
    {id:'s2',name:'Electrical Engineering',description:'Power, electrical systems, installation and technical support.',image:'/assets/electrical.svg'},
    {id:'s3',name:'Civil & Structural Engineering',description:'Building, structural, infrastructure and site engineering.',image:'/assets/civil.svg'},
    {id:'s4',name:'Aerospace & Aviation',description:'Aerospace design, analysis, aviation and technical solutions.',image:'/assets/aerospace.svg'},
    {id:'s5',name:'Industrial & Manufacturing',description:'Industrial systems, production support and manufacturing solutions.',image:'/assets/industrial.svg'},
    {id:'s6',name:'Engineering Consultancy',description:'Integrated technical studies, design review and engineering advice.',image:'/assets/consulting.svg'}
  ],
  projects:[
    {id:'p1',name:'Workshop & Fabrication Facility',tag:'Mechanical',place:'Addis Ababa',image:'/assets/project-1.svg'},
    {id:'p2',name:'Academic Building Construction',tag:'Civil/Structural',place:'Bishoftu',image:'/assets/project-2.svg'},
    {id:'p3',name:'Solar Power Installation',tag:'Electrical',place:'Adama',image:'/assets/project-3.svg'}
  ]
}
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey=import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl,supabaseAnonKey) : null
const localKey='integra-site-content-v2'
function loadLocal(){try{return JSON.parse(localStorage.getItem(localKey))||defaultContent}catch{return defaultContent}}
async function loadContent(){
  if(!supabase)return loadLocal();
  const {data,error}=await supabase.from('site_content').select('content').eq('id',1).maybeSingle();
  if(error||!data?.content)return loadLocal();

  const saved=data.content;

  return {
    ...defaultContent,
    ...saved,
    settings:{...defaultContent.settings,...(saved.settings||{})},
    hero:{...defaultContent.hero,...(saved.hero||{})},
    about:{...defaultContent.about,...(saved.about||{})},
    services:Array.isArray(saved.services)&&saved.services.length?saved.services:defaultContent.services,
    projects:Array.isArray(saved.projects)&&saved.projects.length?saved.projects:defaultContent.projects
  };
}
async function saveContent(content){localStorage.setItem(localKey,JSON.stringify(content)); if(supabase){const {error}=await supabase.from('site_content').upsert({id:1,content}); if(error) throw error}}

function App(){
 const [content,setContent]=useState(defaultContent); const [open,setOpen]=useState(false); const [activeSection,setActiveSection]=useState('home')
 useEffect(()=>{loadContent().then(setContent)},[])
 useEffect(()=>{
  const ids=['home','about','services','projects','team','news','contact']
  const updateActive=()=>{
   const headerOffset=96
   let current='home'
   for(const id of ids){
    const el=document.getElementById(id)
    if(!el) continue
    const top=el.getBoundingClientRect().top
    if(top <= headerOffset + 24) current=id
   }
   setActiveSection(current)
  }
  const onHash=()=>{
   const id=location.hash.replace('#','')
   if(ids.includes(id)) setActiveSection(id)
   updateActive()
  }
  updateActive()
  window.addEventListener('scroll',updateActive,{passive:true})
  window.addEventListener('resize',updateActive)
  window.addEventListener('hashchange',onHash)
  return ()=>{
   window.removeEventListener('scroll',updateActive)
   window.removeEventListener('resize',updateActive)
   window.removeEventListener('hashchange',onHash)
  }
 },[])
 const close=()=>setOpen(false); const nav=id=>{
  close();
  setActiveSection(id);
  const el=document.getElementById(id);
  if(el){
   const headerOffset=92;
   const y=el.getBoundingClientRect().top + window.scrollY - headerOffset;
   window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
  history.replaceState(null,'',`#${id}`)
 }
 const c=content
 return <div className="site">
 <header className="header"><div className="container navwrap"><a className="brand" onClick={()=>nav('home')}><img src="/assets/logo.png"/></a><nav className={open?'nav open':'nav'}>{['home','about','services','projects','team','news','contact'].map(x=><a key={x} className={activeSection===x?'active':''} onClick={()=>nav(x)}>{x[0].toUpperCase()+x.slice(1)}</a>)}<button className="topcta" onClick={()=>nav('contact')}>Get in Touch <ArrowRight size={16}/></button></nav><button className="menubtn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button></div></header>
 <main>
 <section id="home" className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span></span>{c.hero.eyebrow}</div><h1>{c.hero.title.split('One Integrated Solution.')[0]}<em>One<br/>Integrated Solution.</em></h1><p>{c.hero.description}</p><div className="actions"><button onClick={()=>nav('services')}>Explore Our Services <ArrowRight size={18}/></button><button className="outline" onClick={()=>nav('contact')}>Contact Us</button></div></div><div className="hero-art"><img src={c.hero.image} onError={e=>{if(e.currentTarget.dataset.fallback!="1"){e.currentTarget.dataset.fallback="1";e.currentTarget.src="/assets/hero.svg"}}}/></div></div></section>
 <section id="about" className="section about"><div className="container about-grid"><div className="about-image"><img src={c.about.image} onError={e=>{if(e.currentTarget.dataset.fallback!="1"){e.currentTarget.dataset.fallback="1";e.currentTarget.src="/assets/civil.svg"}}}/></div><div className="about-copy"><div className="section-title"><span></span><h2>{c.about.title}</h2></div><p>{c.about.description}</p><div className="values"><div><Users/><b>Multi-Disciplinary</b><small>Experts from different engineering fields working together.</small></div><div><ShieldCheck/><b>Professional</b><small>Quality, safety and responsible engineering practice.</small></div><div><Lightbulb/><b>Innovative</b><small>Practical and modern approaches to real challenges.</small></div><div><MapPin/><b>Ethiopian</b><small>Solutions designed around local needs and opportunities.</small></div></div><button className="learn" onClick={()=>nav('contact')}>Learn More <ArrowRight size={16}/></button></div></div></section>
 <section id="services" className="section services"><div className="container"><div className="center-title"><div className="section-title center"><span></span><h2>Our Engineering Services</h2></div><p>Integrated engineering services across multiple disciplines.</p></div><div className="service-grid">{c.services.map(s=><article className="service-card" key={s.id}><img src={s.image} onError={e=>{if(e.currentTarget.dataset.fallback!="1"){e.currentTarget.dataset.fallback="1";e.currentTarget.src="/assets/mechanical.svg"}}}/><div className="service-overlay"><h3>{s.name}</h3><p>{s.description}</p><ArrowRight className="arrow"/></div></article>)}</div></div></section>
 <section id="projects" className="section projects"><div className="container"><div className="section-row"><div><div className="section-title"><span></span><h2>Featured Projects</h2></div><p>Some of our key engineering projects and solutions.</p></div><a onClick={()=>nav('contact')}>View All Projects <ArrowRight size={16}/></a></div><div className="project-grid">{c.projects.map(p=><article className="project" key={p.id}><img src={p.image} onError={e=>{if(e.currentTarget.dataset.fallback!="1"){e.currentTarget.dataset.fallback="1";e.currentTarget.src="/assets/project-1.svg"}}}/><div className="project-body"><h3>{p.name}</h3><div><span>{p.tag}</span><small><MapPin size={13}/>{p.place}</small></div><ArrowRight className="project-arrow"/></div></article>)}</div></div></section>
 <section id="team" className="section why"><div className="container"><div className="section-title"><span></span><h2>Why Choose INTEGRA?</h2></div><div className="why-grid"><div><Users/><h3>Multidisciplinary</h3><p>Experts from different engineering fields working together.</p></div><div><ShieldCheck/><h3>Reliable & Professional</h3><p>Quality, safety, and responsible engineering practice.</p></div><div><Lightbulb/><h3>Innovative Solutions</h3><p>Practical and modern approaches to real challenges.</p></div><div><MapPin/><h3>Built for Ethiopia</h3><p>Engineering solutions tailored to local needs and opportunities.</p></div></div></div></section>
 <section id="news" className="newsband"><div className="container"><div><div className="section-title light"><span></span><h2>Engineering Updates</h2></div><p>News, announcements and project updates from INTEGRA Engineering PLC.</p></div><button onClick={()=>nav('contact')}>Get in Touch <ArrowRight size={16}/></button></div></section>
 <section id="contact" className="section contact"><div className="container contact-grid"><div><div className="section-title"><span></span><h2>Let's Work Together</h2></div><p>Have an engineering challenge? Tell us about it and our multidisciplinary team will help identify the right approach.</p><div className="contact-info"><div><Phone/><span>{c.settings.phone}</span></div><div><Mail/><span>{c.settings.email}</span></div><div><MapPin/><span>{c.settings.address}</span></div></div></div><form onSubmit={e=>{e.preventDefault();alert('Thank you. Your message has been received.')}}><input placeholder="Full name" required/><input type="email" placeholder="Email address" required/><input placeholder="Subject"/><textarea rows="5" placeholder="Tell us about your engineering need"></textarea><button>Send Message <Send size={16}/></button></form></div></section>
 </main>
 <footer className="footer"><div className="container footer-grid"><div><img src="/assets/logo.png" className="footerlogo"/><p>A multidisciplinary engineering company delivering practical and innovative solutions in Ethiopia.</p></div><div><h4>Quick Links</h4><a onClick={()=>nav('home')}>Home</a><a onClick={()=>nav('about')}>About</a><a onClick={()=>nav('services')}>Services</a><a onClick={()=>nav('projects')}>Projects</a></div><div><h4>Company</h4><a onClick={()=>nav('team')}>Team</a><a onClick={()=>nav('news')}>News & Updates</a><a>Careers</a><a onClick={()=>nav('contact')}>Contact</a></div><div><h4>Contact Us</h4><p>📍 {c.settings.address}</p><p>☎ {c.settings.phone}</p><p>✉ {c.settings.email}</p><div className="social"><Linkedin/><Facebook/><Youtube/></div></div></div><div className="copyright"><div>© 2026 INTEGRA Engineering PLC. All Rights Reserved.</div><div>Privacy Policy&nbsp;&nbsp;|&nbsp;&nbsp;Terms of Use</div></div></footer>
 </div>
}
async function uploadImage(file){
 if(!supabase) return URL.createObjectURL(file)
 const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'-')
 const path=`${Date.now()}-${safe}`
 const {error}=await supabase.storage.from('site-assets').upload(path,file,{upsert:false,contentType:file.type})
 if(error) throw error
 const {data}=supabase.storage.from('site-assets').getPublicUrl(path)
 return data.publicUrl
}
function Admin(){
 const [content,setContent]=useState(defaultContent),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[logged,setLogged]=useState(false),[tab,setTab]=useState('hero'),[msg,setMsg]=useState('')
 useEffect(()=>{loadContent().then(setContent);setLogged(sessionStorage.getItem('integra-admin')==='1')},[])
 const login=async e=>{e.preventDefault(); if(supabase){const {error}=await supabase.auth.signInWithPassword({email,password}); if(error){setMsg(error.message);return}} else if(!email||!password){return} sessionStorage.setItem('integra-admin','1');setLogged(true)}
 const save=async()=>{try{await saveContent(content);setMsg('Saved successfully.')}catch(e){setMsg('Saved locally. Configure Supabase to sync public content.')}setTimeout(()=>setMsg(''),2500)}
 const set=(path,val)=>setContent(prev=>{const n=structuredClone(prev);let o=n;for(let i=0;i<path.length-1;i++)o=o[path[i]];o[path[path.length-1]]=val;return n})
 if(!logged)return <div className="admin-auth"><form onSubmit={login}><img src="/assets/logo.png"/><h1>INTEGRA Admin</h1><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin email"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/><button>Sign In</button><p>Admin authentication is connected to your Supabase project after configuration.</p></form></div>
 return <div className="admin"><aside><img src="/assets/logo.png"/><h2>Website Admin</h2>{['hero','about','services','projects','settings'].map(t=><button className={tab===t?'sel':''} onClick={()=>setTab(t)} key={t}>{t[0].toUpperCase()+t.slice(1)}</button>)}<button onClick={()=>{sessionStorage.removeItem('integra-admin');setLogged(false)}}><LogOut/> Log out</button></aside><main><div className="adminbar"><div><h1>Edit Website</h1><p>Manage content without changing the design.</p></div><button onClick={save}><Save/> Save Changes</button></div>{msg&&<div className="saved">{msg}</div>}{tab==='hero'&&<Editor title="Hero Section"><Field label="Eyebrow" value={content.hero.eyebrow} onChange={v=>set(['hero','eyebrow'],v)}/><Field label="Title" value={content.hero.title} onChange={v=>set(['hero','title'],v)}/><Field label="Description" value={content.hero.description} onChange={v=>set(['hero','description'],v)}/><ImageField label="Hero image" value={content.hero.image} onChange={v=>set(['hero','image'],v)}/></Editor>}{tab==='about'&&<Editor title="About Section"><Field label="Title" value={content.about.title} onChange={v=>set(['about','title'],v)}/><Field label="Description" value={content.about.description} onChange={v=>set(['about','description'],v)}/><ImageField label="About image" value={content.about.image} onChange={v=>set(['about','image'],v)}/></Editor>}{tab==='services'&&<Editor title="Engineering Services">{content.services.map((s,i)=><div className="admin-card" key={s.id}><Field label="Service name" value={s.name} onChange={v=>set(['services',i,'name'],v)}/><Field label="Description" value={s.description} onChange={v=>set(['services',i,'description'],v)}/><ImageField label="Service image" value={s.image} onChange={v=>set(['services',i,'image'],v)}/></div>)}<button className="add" onClick={()=>setContent(p=>({...p,services:[...p.services,{id:'s'+Date.now(),name:'New Engineering Service',description:'Service description.',image:'/assets/mechanical.svg'}]}))}><Plus/> Add service</button></Editor>}{tab==='projects'&&<Editor title="Featured Projects">{content.projects.map((p,i)=><div className="admin-card" key={p.id}><Field label="Project name" value={p.name} onChange={v=>set(['projects',i,'name'],v)}/><Field label="Category" value={p.tag} onChange={v=>set(['projects',i,'tag'],v)}/><Field label="Location" value={p.place} onChange={v=>set(['projects',i,'place'],v)}/><ImageField label="Project image" value={p.image} onChange={v=>set(['projects',i,'image'],v)}/><button className="delete" onClick={()=>setContent(q=>({...q,projects:q.projects.filter((_,j)=>j!==i)}))}><Trash2/> Remove</button></div>)}<button className="add" onClick={()=>setContent(p=>({...p,projects:[...p.projects,{id:'p'+Date.now(),name:'New Project',tag:'Engineering',place:'Ethiopia',image:'/assets/project-1.svg'}]}))}><Plus/> Add project</button></Editor>}{tab==='settings'&&<Editor title="Company & Contact"><Field label="Company name" value={content.settings.companyName} onChange={v=>set(['settings','companyName'],v)}/><Field label="Email" value={content.settings.email} onChange={v=>set(['settings','email'],v)}/><Field label="Phone" value={content.settings.phone} onChange={v=>set(['settings','phone'],v)}/><Field label="Address" value={content.settings.address} onChange={v=>set(['settings','address'],v)}/><Field label="LinkedIn URL" value={content.settings.linkedin} onChange={v=>set(['settings','linkedin'],v)}/><Field label="Facebook URL" value={content.settings.facebook} onChange={v=>set(['settings','facebook'],v)}/><Field label="YouTube URL" value={content.settings.youtube} onChange={v=>set(['settings','youtube'],v)}/><Field label="Telegram URL" value={content.settings.telegram} onChange={v=>set(['settings','telegram'],v)}/></Editor>}</main></div>
}
function Editor({title,children}){return <section className="editor"><h2>{title}</h2>{children}</section>}
function ImageField({label,value,onChange}){
 const [busy,setBusy]=useState(false),[err,setErr]=useState('')
 const choose=async e=>{const file=e.target.files?.[0];if(!file)return;setBusy(true);setErr('');try{onChange(await uploadImage(file))}catch(x){setErr(x.message||'Upload failed')}finally{setBusy(false)}}
 return <div className="field image-field"><span>{label}</span>{value&&<img src={value} alt="" className="admin-preview"/>}<input type="file" accept="image/*" onChange={choose}/><small>{busy?'Uploading...':'Choose a new image, or leave the current image.'}</small>{err&&<em>{err}</em>}</div>
}
function Field({label,value,onChange}){return <label className="field"><span>{label}</span><textarea rows={value.length>90?4:2} value={value} onChange={e=>onChange(e.target.value)}/></label>}
const root=createRoot(document.getElementById('root')); root.render(location.hash==='#admin'?<Admin/>:<App/>)
