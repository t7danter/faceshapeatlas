export default function StyleIllustration({ kind, glasses = false }: { kind: string; glasses?: boolean }) {
  return <div className={`style-illustration ${glasses ? 'glasses' : ''}`} aria-hidden="true"><svg viewBox={glasses ? '0 0 200 110' : '0 0 120 130'} fill="none">
    {glasses ? <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      {kind === 'round' ? <><circle cx="52" cy="57" r="30"/><circle cx="148" cy="57" r="30"/></> : kind === 'oval' ? <><ellipse cx="52" cy="57" rx="34" ry="25"/><ellipse cx="148" cy="57" rx="34" ry="25"/></> : kind === 'geometric' ? <><path d="m20 42 19-16 37 5 10 28-20 25-35-4-16-22Z"/><path d="m180 42-19-16-37 5-10 28 20 25 35-4 16-22Z"/></> : kind === 'cat-eye' ? <><path d="M14 30 84 43Q91 84 54 85 22 83 14 30Z"/><path d="m186 30-70 13q-7 41 30 42 32-2 40-55Z"/></> : kind === 'aviator' ? <><path d="M20 41q26-24 62 0 5 55-23 46Q15 75 20 41Z"/><path d="M180 41q-26-24-62 0-5 55 23 46 44-12 39-46Z"/></> : <><path d="M18 35h67l-5 40q-29 18-57 0Z"/><path d="M115 35h67l-5 40q-29 18-57 0Z"/>{kind==='browline'&&<path d="M18 35h67m30 0h67" strokeWidth="7"/>}</>}
      <path d="M85 48q15-12 30 0M7 35l13 9m160 0 13-9"/></g> : <>
      <path d="M37 52q0-29 23-29t23 29v25q-5 24-23 28-18-4-23-28Z" fill="#f0dfd1" stroke="currentColor" strokeWidth="1.4"/><path d="M44 67h8m16 0h8M59 70l-3 12h6m-9 10q7 3 14 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {kind==='crop'?<path d="M31 61Q15 27 41 22q12-20 27-5 30 0 22 42L74 37Q61 62 31 61Z" fill="currentColor"/>:kind==='bob'?<path d="M29 92Q11 15 59 13q49-1 33 79L78 95l2-43Q60 38 49 32 42 55 39 95Z" fill="currentColor"/>:kind==='long'?<path d="M18 126q13-32 8-66-4-49 34-48 40-1 35 48-4 35 8 66H79q-9-30-1-74-16-5-26-21-13 17-13 40l2 55Z" fill="currentColor"/>:<path d="M22 113q-7-22 3-50-6-48 35-51 42 4 35 51 11 30 2 50L77 107q-8-27 4-57-12-4-23-19-19 17-18 41l5 35Z" fill="currentColor"/>}
      <path d="M48 103v9l-15 7m39-16v9l15 7" stroke="currentColor" strokeWidth="1.5"/>
    </>}
  </svg></div>;
}
