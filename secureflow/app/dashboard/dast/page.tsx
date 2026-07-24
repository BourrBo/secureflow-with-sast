'use client'
import { useState } from 'react'
import Link from 'next/link'
const sevConfig = {
  critical: { color: '#FF6B6B', bg: 'rgba(192,55,42,0.15)' },
  high:     { color: '#FFB020', bg: 'rgba(184,106,0,0.15)' },
  medium:   { color: '#4D9FFF', bg: 'rgba(27,127,255,0.15)' },
  low:      { color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.07)' },
  informational: { color: '#7C8AA5', bg: 'rgba(124,138,165,0.12)' },
  info:          { color: '#7C8AA5', bg: 'rgba(124,138,165,0.12)' },
}

const tabs = [{key:'all',label:'All',count:12},{key:'critical',label:'Critical',count:3},{key:'high',label:'High',count:5},{key:'resolved',label:'Resolved',count:2}]

export default function DASTPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [targetUrl, setTargetUrl] = useState("http://localhost:3000")
  const [scanMode, setScanMode] = useState("standard")
  const [findings, setFindings] = useState<any[]>([])

  const handleScan = async () => {
    try {
      setFindings([]); 
      setScanning(true)

      const response = await fetch("http://127.0.0.1:8000/api/dast/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_url: targetUrl,
          scan_mode: scanMode,
        }),
      })

      if (!response.ok) {
        throw new Error("Scan failed")
      }

      const data = await response.json()
      console.log(data);

      setFindings(data)
    } catch (err) {
      setFindings([]); 
      console.error(err)
      alert("DAST scan failed.")
    } finally {
      setScanning(false)
    }
  }

  const filtered = findings.filter((e: any) => {
    if (activeTab === "critical")
      return e.severity?.toLowerCase() === "critical";

    if (activeTab === "high")
      return e.severity?.toLowerCase() === "high";

    if (activeTab === "resolved")
      return false; // DAST findings don't have a resolved status yet

    return true;
  });

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',fontFamily:'var(--body)'}}>
      {/* TOP BAR */}
      <div style={{height:56,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'var(--bg)'}}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,0.35)'}}>
          <Link href="/dashboard" style={{color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Dashboard</Link>
          <span>/</span>
          <span style={{color:'#F0F4FF',fontWeight:500}}>DAST</span>
          <span style={{fontSize:9,padding:'1px 6px',borderRadius:4,background:'rgba(27,127,255,0.15)',color:'#4D9FFF',marginLeft:4}}>Phase 3</span>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <select style={{padding:'6px 10px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.05)',color:'#F0F4FF',fontSize:12,outline:'none',cursor:'pointer',fontFamily:'var(--body)'}}>
            <option style={{background:'#0D1B2E'}}>https://api.acmecorp.com</option>
            <option style={{background:'#0D1B2E'}}>https://staging.acmecorp.com</option>
          </select>
          <button style={{padding:'7px 12px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer'}}>Export</button>
          <button onClick={handleScan} disabled={scanning}
            style={{padding:'7px 16px',borderRadius:7,border:'none',background:scanning?'rgba(27,127,255,0.5)':'#1B7FFF',color:'#fff',fontSize:12,fontWeight:600,cursor:scanning?'not-allowed':'pointer',fontFamily:'var(--font)',display:'flex',alignItems:'center',gap:6}}>
            {scanning?<><span style={{display:'inline-block',width:12,height:12,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/> Scanning...</>:'▶ Start Scan'}
          </button>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:20,background:'rgba(6,13,24,0.8)'}}>

        {/* Scan progress bar */}
        {scanning && (
          <div style={{marginBottom:16,padding:'12px 16px',background:'rgba(27,127,255,0.08)',border:'1px solid rgba(27,127,255,0.2)',borderRadius:10}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
              <span style={{color:'#4D9FFF',fontWeight:500}}>🔍 OWASP ZAP scanning https://api.acmecorp.com...</span>
              <span style={{color:'rgba(255,255,255,0.4)',fontFamily:'var(--mono)'}}>{scanProgress}%</span>
            </div>
            <div style={{height:4,background:'rgba(255,255,255,0.07)',borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${scanProgress}%`,background:'#1B7FFF',borderRadius:2,transition:'width .3s'}}/>
            </div>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:6,fontFamily:'var(--mono)'}}>
              Crawling endpoints → Testing SQL injection → Testing XSS → Testing CSRF...
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
          {[
            {label:'Endpoints Tested', value:'47',  color:'#F0F4FF',sub:'100% coverage'},
            {label:'Critical Issues',  value:'3',   color:'#FF6B6B',sub:'need immediate fix'},
            {label:'High Issues',      value:'5',   color:'#FFB020',sub:'fix this sprint'},
            {label:'Scan Duration',    value:'4.2m', color:'#4D9FFF',sub:'last scan'},
          ].map(s=>(
            <div key={s.label} style={{background:'rgba(13,27,46,0.8)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'14px 16px'}}>
              <div style={{fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.6px',color:'rgba(255,255,255,0.35)',marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:28,fontWeight:300,color:s.color,letterSpacing:'-1px',lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginTop:5}}>{s.sub}</div>
              <div style={{marginTop:10,height:3,borderRadius:2,background:s.color,width:28}}/>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8,marginBottom:16}}>
          {[
            {cat:'Injection',      count:1,color:'#FF6B6B'},
            {cat:'Access Control', count:2,color:'#FF6B6B'},
            {cat:'XSS',           count:2,color:'#FFB020'},
            {cat:'CSRF',          count:1,color:'#FFB020'},
            {cat:'Path Traversal', count:1,color:'#FFB020'},
            {cat:'Misc',          count:2,color:'#4D9FFF'},
          ].map(c=>(
            <div key={c.cat} style={{background:'rgba(13,27,46,0.8)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'10px 12px',textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:700,color:c.color,marginBottom:3}}>{c.count}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{c.cat}</div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div style={{background:'rgba(13,27,46,0.8)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,overflow:'hidden'}}>
          {/* Tabs */}
          <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'0 16px'}}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{padding:'12px 14px',fontSize:12,fontWeight:activeTab===t.key?500:400,color:activeTab===t.key?'#F0F4FF':'rgba(255,255,255,0.35)',background:'none',border:'none',borderBottom:`2px solid ${activeTab===t.key?'#1B7FFF':'transparent'}`,cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontFamily:'var(--body)'}}>
                {t.label}
                <span style={{fontSize:10,padding:'1px 6px',borderRadius:8,background:activeTab===t.key?'rgba(27,127,255,0.2)':'rgba(255,255,255,0.07)',color:activeTab===t.key?'#4D9FFF':'rgba(255,255,255,0.3)'}}>{t.count}</span>
              </button>
            ))}
          </div>
          {/* Header */}
          <div style={{display:'grid',gridTemplateColumns:'120px 2fr 2fr 120px 120px 3fr',padding:'9px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)'}}>
            {[
              'Severity',
              'Title',
              'Target',
              'CWE',
              'OWASP',
              'Description'
            ].map(h=>(
              <div key={h} style={{fontSize:10,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.5px',color:'rgba(255,255,255,0.3)'}}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
              }}
            >
              {scanning
                ? "Scanning..."
                : "No scan results available. Click 'Start Scan' to begin."}
            </div>
          ) : (
            filtered.map((e, i) => {

              const severity = (e.severity || "low").toLowerCase();
              const sev =
                sevConfig[severity as keyof typeof sevConfig] || sevConfig.low;
return (
  <div
    key={`${e.rule}-${i}`}
    style={{
      display: "grid",
      gridTemplateColumns: "120px 2fr 2fr 120px 120px 3fr",
      padding: "11px 16px",
      alignItems: "center",
      borderBottom:
        i < filtered.length - 1
          ? "1px solid rgba(255,255,255,0.04)"
          : "none",
      transition: "background .12s",
    }}
    onMouseEnter={(el) =>
      (el.currentTarget.style.background = "rgba(255,255,255,0.02)")
    }
    onMouseLeave={(el) =>
      (el.currentTarget.style.background = "transparent")
    }
  >
    <div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 7px",
          borderRadius: 4,
          background: sev.bg,
          color: sev.color,
          fontFamily: "var(--mono)",
        }}
      >
        {e.severity}
      </span>
    </div>

    <div
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "#F0F4FF",
      }}
    >
      {e.title}
    </div>

    <div
      style={{
        fontSize: 11,
        fontFamily: "var(--mono)",
        color: "#4D9FFF",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {e.file}
    </div>

    <div
      style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {e.cwe}
    </div>

    <div
      style={{
        fontSize: 10,
        fontFamily: "var(--mono)",
        color: "rgba(255,255,255,0.4)",
      }}
    >
      {e.owasp}
    </div>

    <div
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.6)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      title={e.description}
    >
      {e.description}
    </div>
  </div>
);
            })
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
