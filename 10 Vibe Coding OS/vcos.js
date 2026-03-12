/* VCOS — Shared Engine JS */
'use strict';

// ── Storage ──────────────────────────────────────
const LS_KEY = 'vcosProject';

function saveProject(data) {
  localStorage.setItem(LS_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
}
function loadProject() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; }
  catch { return null; }
}
function clearProject() { localStorage.removeItem(LS_KEY); }

// ── Feature Labels ────────────────────────────────
const FEATURE_LABELS = {
  user_auth:'사용자 인증/로그인', ai_chat:'AI 채팅/대화',
  ai_recommend:'AI 추천 시스템', payment:'결제/구독',
  dashboard:'대시보드/분석', content:'콘텐츠 관리',
  search:'검색 기능', realtime:'실시간 기능',
  notification:'알림/Push', file_upload:'파일/이미지 업로드',
  map:'지도/위치', external_api:'외부 API 연동',
  mobile:'모바일 반응형', multilang:'다국어 지원',
  rag:'RAG/지식베이스', video:'영상/미디어'
};

// ── Complexity Engine ─────────────────────────────
function calcComplexity(p) {
  const feats = p.features || [];
  const aiLevel = parseInt(p.aiLevel) || 0;
  const scale = parseInt(p.scale) || 1;

  const ui = Math.min(5, 1
    + (feats.includes('dashboard') ? 2 : 0)
    + (feats.includes('mobile') ? 1 : 0)
    + (feats.includes('multilang') ? 1 : 0)
    + (feats.includes('video') ? 1 : 0));
  const backend = Math.min(5, 1
    + (feats.includes('user_auth') ? 1 : 0)
    + (feats.includes('payment') ? 2 : 0)
    + (feats.includes('realtime') ? 1 : 0)
    + (feats.includes('notification') ? 1 : 0));
  const ai = Math.min(5, aiLevel
    + (feats.includes('rag') ? 1 : 0)
    + (feats.includes('ai_recommend') ? 1 : 0));
  const integration = Math.min(5, 1
    + (feats.includes('external_api') ? 2 : 0)
    + (feats.includes('map') ? 1 : 0)
    + (feats.includes('payment') ? 1 : 0));
  const data = Math.min(5, 1
    + (feats.includes('rag') ? 2 : 0)
    + (feats.includes('file_upload') ? 1 : 0)
    + (feats.includes('search') ? 1 : 0));
  const security = Math.min(5, 1
    + (feats.includes('user_auth') ? 1 : 0)
    + (feats.includes('payment') ? 2 : 0)
    + (feats.includes('rag') ? 1 : 0));

  const total = ui + backend + ai + integration + data + security + (scale - 1);
  return { ui, backend, ai, integration, data, security, total, featureCount: feats.length };
}

function getProjectType(total) {
  if (total <= 6)  return { type:'Small',      label:'Small Project',      cls:'badge-green',  color:'#15803d' };
  if (total <= 14) return { type:'Medium',     label:'Medium Project',     cls:'badge-yellow', color:'#b45309' };
  if (total <= 22) return { type:'Large',      label:'Large Project',      cls:'badge-orange', color:'#c2410c' };
  return             { type:'Enterprise',  label:'Enterprise Project', cls:'badge-red',    color:'#b91c1c' };
}

// ── Squad Engine ──────────────────────────────────
function buildSquads(p, c) {
  const feats = p.features || [];
  const aiLevel = parseInt(p.aiLevel) || 0;
  const type = getProjectType(c.total);
  const squads = [];

  // HQ always
  squads.push({
    id:'hq', name:'HQ 본부', emoji:'🏛️', cls:'squad-hq',
    color:'#6d28d9', colorBg:'rgba(124,58,237,.08)', colorBorder:'rgba(124,58,237,.25)',
    role:'소대장(Orchestrator) + 연락병',
    agents:[
      { name:'team-lead (소대장)', model:'opus' },
      { name:'chatbot (연락병)', model:'-' }
    ]
  });

  // Alpha — medium+
  if (type.type !== 'Small') {
    squads.push({
      id:'alpha', name:'Alpha 분대', emoji:'🔴', cls:'squad-alpha',
      color:'#b91c1c', colorBg:'rgba(220,38,38,.07)', colorBorder:'rgba(220,38,38,.25)',
      role:'아키텍처 설계 & 시스템 분석',
      agents:[
        { name:'architect-agent', model:'sonnet' },
        { name:'database-developer', model:'sonnet' },
        ...(aiLevel >= 2 ? [{ name:'ai-integration-specialist', model:'sonnet' }] : [])
      ]
    });
  }

  // Bravo — always
  const bravoAgents = [
    { name:'backend-developer', model:'sonnet' },
    { name:'frontend-developer', model:'sonnet' },
    { name:'ui-designer', model:'haiku' }
  ];
  if (c.featureCount >= 6) { bravoAgents.push({ name:'backend-developer #2', model:'sonnet' }); bravoAgents.push({ name:'frontend-developer #2', model:'haiku' }); }
  squads.push({
    id:'bravo', name:'Bravo 분대', emoji:'🔵', cls:'squad-bravo',
    color:'#1d4ed8', colorBg:'rgba(29,78,216,.07)', colorBorder:'rgba(29,78,216,.25)',
    role:'핵심 개발 & 구현',
    agents: bravoAgents
  });

  // Charlie — always
  squads.push({
    id:'charlie', name:'Charlie 분대', emoji:'🟢', cls:'squad-charlie',
    color:'#15803d', colorBg:'rgba(21,128,61,.07)', colorBorder:'rgba(21,128,61,.25)',
    role:'QA & 테스트 & 문서화',
    agents:[
      { name:'test-runner', model:'haiku' },
      { name:'code-reviewer', model:'sonnet' },
      { name:'documentation-writer', model:'haiku' },
      ...(c.total > 10 ? [{ name:'security-specialist', model:'sonnet' }] : [])
    ]
  });

  // Delta — large+
  if (type.type === 'Large' || type.type === 'Enterprise') {
    squads.push({
      id:'delta', name:'Delta 분대', emoji:'🟠', cls:'squad-delta',
      color:'#c2410c', colorBg:'rgba(234,88,12,.07)', colorBorder:'rgba(234,88,12,.25)',
      role:'성능 최적화 & 보안 강화',
      agents:[
        { name:'performance-optimizer', model:'sonnet' },
        { name:'security-specialist', model:'sonnet' },
        { name:'devops-troubleshooter', model:'sonnet' }
      ]
    });
  }

  // Echo — large+ with AI/RAG
  if ((type.type === 'Large' || type.type === 'Enterprise') && (aiLevel >= 2 || feats.includes('rag'))) {
    squads.push({
      id:'echo', name:'Echo 분대', emoji:'🟡', cls:'squad-echo',
      color:'#0d9488', colorBg:'rgba(13,148,136,.07)', colorBorder:'rgba(13,148,136,.25)',
      role:'지식 수집 & AI 리서치 & RAG',
      agents:[
        { name:'research-agent (Perplexity)', model:'-' },
        { name:'knowledge-curator', model:'haiku' },
        ...(feats.includes('rag') ? [{ name:'rag-specialist', model:'sonnet' }] : [])
      ]
    });
  }

  return squads;
}

// ── Skills Database (21 Skills) ───────────────────
const SKILLS = [
  {
    id:'platoon-v1', name:'/platoon-formation-v1', emoji:'🪖',
    eBg:'rgba(188,140,255,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'opus', cmd:'/platoon-formation-v1',
    short:'소대 편제 (3분대)',
    desc:'소대장+연락병+3분대(Alpha/Bravo/Charlie) 편성. 표준 정규병 10명 자동 배치. 프로젝트 시작의 첫 번째 실행 스킬.',
    when:'프로젝트 시작 시 기본 팀 편성',
    trigger:['always']
  },
  {
    id:'platoon-v2', name:'/platoon-formation-v2', emoji:'⚔️',
    eBg:'rgba(248,81,73,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'opus', cmd:'/platoon-formation-v2',
    short:'소대 편제 풀패키지 (42명)',
    desc:'3분대+용병4+18 Skills 풀 패키지(42명). 고도화된 분대 운영 체계. 대규모 프로젝트 전용.',
    when:'대규모 프로젝트 또는 18 스킬 전체 활용 시',
    trigger:['large','enterprise']
  },
  {
    id:'deploy-subagent', name:'/deploy-subagent', emoji:'🤖',
    eBg:'rgba(88,166,255,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'sonnet', cmd:'/deploy-subagent',
    short:'서브에이전트 투입 전략',
    desc:'최정예 서브에이전트 편성 및 복합 투입 전략. 전문성 부족·병렬 처리·대량 반복 작업 시 투입.',
    when:'전문 분야 에이전트 투입이 필요할 때',
    trigger:['always']
  },
  {
    id:'deploy-skill', name:'/deploy-skill', emoji:'🔧',
    eBg:'rgba(240,136,62,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'sonnet', cmd:'/deploy-skill',
    short:'스킬 조합 편성 전략',
    desc:'최강 스킬 조합 편성 및 장착 전략. 스킬 탐색→선발→장착→실행 전 과정 자동화.',
    when:'복잡한 다단계 작업 또는 특수 스킬 필요 시',
    trigger:['always']
  },
  {
    id:'find-skills', name:'/find-skills', emoji:'🔍',
    eBg:'rgba(57,211,83,.2)', phase:'STRATEGY', phaseColor:'#58a6ff',
    model:'haiku', cmd:'/find-skills "검색어"',
    short:'스킬 검색 및 설치',
    desc:'AI 에이전트 스킬 검색 및 설치 (skills.sh 오픈 생태계). 필요 스킬을 자동 탐색하고 설치.',
    when:'새 기능을 위한 스킬이 필요할 때',
    trigger:['always']
  },
  {
    id:'review-evaluate', name:'/review-evaluate', emoji:'⭐',
    eBg:'rgba(227,179,65,.2)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'sonnet', cmd:'/review-evaluate',
    short:'검토 및 97점 평가 루프',
    desc:'5기준 품질 평가 — 97점 도달까지 순환 루프(최소 3회). 아키텍처·코드·보안·성능·유지보수성 통합 평가.',
    when:'개발 완료 후 품질 검증 및 고도화',
    trigger:['always']
  },
  {
    id:'api-builder', name:'/api-builder', emoji:'🔌',
    eBg:'rgba(88,166,255,.2)', phase:'EXECUTION', phaseColor:'#3fb950',
    model:'sonnet', cmd:'/api-builder',
    short:'RESTful API 설계 및 구현',
    desc:'RESTful API 엔드포인트 설계 및 구현. CRUD 자동 생성, 데이터 검증(Zod), 에러 핸들링, API 문서화.',
    when:'API 엔드포인트 신규 설계 또는 CRUD 추가 시',
    trigger:['user_auth','ai_chat','ai_recommend','payment','dashboard','realtime','external_api','rag']
  },
  {
    id:'api-test', name:'/api-test', emoji:'🧪',
    eBg:'rgba(63,185,80,.2)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'haiku', cmd:'/api-test',
    short:'API 기능/보안 테스트',
    desc:'API 엔드포인트 기능/성능/보안 테스트. Jest + Supertest 기반 자동화 테스트 생성 및 실행.',
    when:'API 구현 후 기능 검증 및 보안 테스트',
    trigger:['user_auth','ai_chat','payment','external_api','rag']
  },
  {
    id:'cicd-setup', name:'/cicd-setup', emoji:'⚙️',
    eBg:'rgba(240,136,62,.2)', phase:'DEVOPS', phaseColor:'#d29922',
    model:'sonnet', cmd:'/cicd-setup',
    short:'GitHub Actions CI/CD',
    desc:'GitHub Actions 기반 CI/CD 파이프라인 구성. PR 자동 테스트, 브랜치 배포, 코드 품질 게이트 설정.',
    when:'프로덕션 배포 파이프라인 구축 시',
    trigger:['large','enterprise','payment']
  },
  {
    id:'create-image', name:'/create-image', emoji:'🎨',
    eBg:'rgba(188,140,255,.2)', phase:'EXECUTION', phaseColor:'#3fb950',
    model:'haiku', cmd:'/create-image "설명"',
    short:'이미지 생성 (SVG/HTML/Mermaid)',
    desc:'이미지 생성 종합 시스템 (SVG/HTML/Mermaid/Pillow). 다이어그램, UI 목업, 아키텍처 시각화.',
    when:'UI 목업, 시스템 다이어그램, 아키텍처 이미지 생성 시',
    trigger:['dashboard','content','video']
  },
  {
    id:'db-schema', name:'/db-schema', emoji:'🗃️',
    eBg:'rgba(57,211,83,.2)', phase:'EXECUTION', phaseColor:'#3fb950',
    model:'sonnet', cmd:'/db-schema',
    short:'DB 스키마 & 마이그레이션',
    desc:'Supabase(PostgreSQL) 데이터베이스 스키마 설계 및 마이그레이션. ERD, RLS 정책, 인덱스 최적화.',
    when:'DB 테이블 설계, 마이그레이션 파일 작성 시',
    trigger:['user_auth','ai_chat','ai_recommend','payment','dashboard','content','rag','search']
  },
  {
    id:'doc-generator', name:'/doc-generator', emoji:'📄',
    eBg:'rgba(88,166,255,.15)', phase:'EXECUTION', phaseColor:'#3fb950',
    model:'haiku', cmd:'/doc-generator "설명"',
    short:'문서 생성 (PDF/DOCX/PPTX)',
    desc:'문서 생성기 (PDF/DOCX/PPTX/XLSX/HWP). 기술 문서, API 문서, 발표자료 자동 생성.',
    when:'개발 문서, 사용자 가이드, 발표자료 생성 시',
    trigger:['always']
  },
  {
    id:'e2e-test', name:'/e2e-test', emoji:'🎭',
    eBg:'rgba(248,81,73,.15)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'haiku', cmd:'/e2e-test',
    short:'Playwright E2E 테스트',
    desc:'Playwright 기반 End-to-End 테스트. 사용자 플로우, 크로스 브라우저, 시각적 회귀, 접근성 테스트.',
    when:'주요 사용자 플로우 구현 완료 후, 배포 전 회귀 테스트',
    trigger:['user_auth','payment','ai_chat','dashboard','realtime']
  },
  {
    id:'performance-check', name:'/performance-check', emoji:'⚡',
    eBg:'rgba(227,179,65,.2)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'sonnet', cmd:'/performance-check',
    short:'성능 분석 & 최적화',
    desc:'프론트엔드/백엔드 성능 분석. Core Web Vitals, DB 쿼리 최적화, 번들 크기 분석, API 응답 개선.',
    when:'서비스 출시 전 성능 최적화, 속도 저하 문제 발생 시',
    trigger:['realtime','dashboard','ai_recommend','rag','search']
  },
  {
    id:'security-audit', name:'/security-audit', emoji:'🛡️',
    eBg:'rgba(248,81,73,.2)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'sonnet', cmd:'/security-audit',
    short:'OWASP 보안 감사',
    desc:'OWASP Top 10 기반 보안 취약점 검사. 인증/인가, RLS 검증, 민감 정보 보호, 의존성 취약점 탐지.',
    when:'프로젝트 배포 전, 인증 구현 후, 보안 점검 필요 시',
    trigger:['user_auth','payment','realtime','rag']
  },
  {
    id:'troubleshoot', name:'/troubleshoot', emoji:'🔬',
    eBg:'rgba(88,166,255,.15)', phase:'QUALITY', phaseColor:'#f0883e',
    model:'sonnet', cmd:'/troubleshoot',
    short:'문제 진단 & 긴급 대응',
    desc:'문제 진단, 로그 분석, 근본 원인 분석(RCA) 및 긴급 대응. 에러 발생 시 즉시 투입.',
    when:'에러 발생, 서비스 장애, 원인 불명 버그 추적 시',
    trigger:['always']
  },
  {
    id:'ui-ux-builder', name:'/ui-ux-builder', emoji:'🖥️',
    eBg:'rgba(188,140,255,.15)', phase:'EXECUTION', phaseColor:'#3fb950',
    model:'sonnet', cmd:'/ui-ux-builder',
    short:'UX 설계 + UI 구현',
    desc:'UX 경험 설계 + UI 컴포넌트 구현 통합. 페르소나, 저니맵, 와이어프레임, Tailwind CSS 컴포넌트.',
    when:'화면 설계, 사용자 흐름, 컴포넌트 개발 시',
    trigger:['always']
  },
  {
    id:'youtube-generate', name:'/youtube-generate', emoji:'📹',
    eBg:'rgba(248,81,73,.2)', phase:'CONTENT', phaseColor:'#e3b341',
    model:'haiku', cmd:'/youtube-generate <파일>',
    short:'유튜브 영상 자동화',
    desc:'유튜브 영상 올인원 자동화 — 소재 파일 → 리서치 → 대본 → 재료 생성 → 블로그 포스트.',
    when:'유튜브 콘텐츠 제작, 마케팅 영상 생성 시',
    trigger:['content','video']
  },
  {
    id:'cpc-setup', name:'/cpc-setup', emoji:'🏗️',
    eBg:'rgba(57,211,83,.2)', phase:'DEVOPS', phaseColor:'#d29922',
    model:'sonnet', cmd:'/cpc-setup',
    short:'CPC 인프라 구축',
    desc:'CPC(Claude Platoons Control) 인프라 구축. Supabase DB + Vercel 배포 + 소대 등록 + 연락병 배포.',
    when:'CPC 시스템을 처음 구축하거나 복구할 때',
    trigger:['large','enterprise']
  },
  {
    id:'cpc-engage', name:'/cpc-engage', emoji:'📡',
    eBg:'rgba(88,166,255,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'-', cmd:'/cpc-engage',
    short:'CPC 소대장 자동 인식',
    desc:'Claude Code 세션에 소대장 역할 자동 배정 + Agent Server 가동. 세션 시작 시 최초 1회 실행.',
    when:'CPC 기반 소대 운영 시 세션 시작 때',
    trigger:['large','enterprise']
  },
  {
    id:'cpc-add-project', name:'/cpc-add-project', emoji:'➕',
    eBg:'rgba(240,136,62,.2)', phase:'ORCHESTRATION', phaseColor:'#bc8cff',
    model:'sonnet', cmd:'/cpc-add-project',
    short:'CPC 프로젝트 추가',
    desc:'새 프로젝트를 CPC에 연결. 소대 등록 → Agent Server 폴더 생성 → 바로 실행 가능 상태.',
    when:'CPC에 새 프로젝트를 추가할 때',
    trigger:['large','enterprise']
  }
];

function getRelevantSkills(p, c) {
  const feats = p.features || [];
  const type = getProjectType(c.total);
  return SKILLS.map(s => {
    let active = false;
    if (s.trigger.includes('always')) active = true;
    if (s.trigger.includes('large') && (type.type==='Large'||type.type==='Enterprise')) active = true;
    if (s.trigger.includes('enterprise') && type.type==='Enterprise') active = true;
    s.trigger.forEach(t => { if (feats.includes(t)) active = true; });
    return { ...s, active };
  });
}

// ── Token Estimate ────────────────────────────────
function calcTokenEstimate(c) {
  const base = c.total * 80000;
  const haiku = Math.round(base * 0.60);
  const sonnet = Math.round(base * 0.35);
  const opus = Math.round(base * 0.05);
  return {
    haiku, sonnet, opus,
    haikuCost: (haiku/1e6 * 0.25).toFixed(2),
    sonnetCost: (sonnet/1e6 * 3).toFixed(2),
    opusCost: (opus/1e6 * 15).toFixed(2),
    total: ((haiku/1e6*0.25)+(sonnet/1e6*3)+(opus/1e6*15)).toFixed(2)
  };
}

// ── Refinement Scores ─────────────────────────────
function calcRefineScores(c) {
  const base = Math.min(82, 65 + c.featureCount * 1.5);
  const v1 = Math.round(base);
  const v2 = Math.min(90, v1 + 9);
  const v3 = Math.min(95, v2 + 6);
  const v4 = Math.min(98, v3 + 3);
  return [v1, v2, v3, v4];
}

// ── Command Generator ─────────────────────────────
function generateCommand(p, c) {
  const type = getProjectType(c.total);
  const relSkills = getRelevantSkills(p, c).filter(s => s.active);
  const squads = buildSquads(p, c);
  const feats = p.features || [];
  const tech = p.techStack || 'Next.js + FastAPI';
  const fe = tech.split('+')[0]?.trim() || 'Next.js';
  const be = tech.split('+')[1]?.trim() || 'FastAPI';
  const aiEngine = tech.toLowerCase().includes('gemini')
    ? 'Gemini API (gemini-2.0-flash 기본)'
    : 'Claude API (claude-haiku-4-5-20251001 기본)';

  const squadDesc = squads.filter(s=>s.id!=='hq').map(s => `- ${s.name}: ${s.role}`).join('\n');
  const skillList = relSkills.slice(0, 12).map(s => `  ${s.name}: ${s.when}`).join('\n');
  const featList = feats.map(f => `- ${FEATURE_LABELS[f] || f}`).join('\n') || '- (기능 목록)';
  const refSection = (p.refPaths && p.refPaths.length > 0)
    ? `\n## 📂 참고 자료 분석\n\n개발 시작 전 아래 폴더의 자료를 분석하여 요구사항 및 설계에 반영하라:\n\n${p.refPaths.map(r => `  폴더: ${r}\n  → 파일 목록 파악 후 주요 문서/데이터 내용 분석\n  → 분석 결과를 기능 설계 및 콘텐츠 구성에 반영`).join('\n\n')}\n`
    : '';

  return `# ${p.name || '프로젝트'} — VCOS Vibe Coding Command
# Generated by VCOS (Vibe Coding Operating System)
# ══════════════════════════════════════════════

## 📋 PROJECT INTENT

Project  : ${p.name || '(프로젝트명)'}
Purpose  : ${p.purpose || '(목적)'}
Users    : ${Array.isArray(p.users) ? p.users.join(', ') : p.users || '(타겟 사용자)'}
Type     : ${type.label} (Complexity Score: ${c.total})
Stack    : ${tech}

${refSection}## 🎯 MISSION

다음 플랫폼을 완전히 구현하라.

${p.purpose || p.name + ' 플랫폼'}

핵심 기능:
${featList}

## 🏗️ SYSTEM ARCHITECTURE

Frontend : ${fe}
Backend  : ${be}
Database : Supabase (PostgreSQL)
AI Engine: ${aiEngine}
Infra    : Vercel

## 👥 AI DEVELOPMENT ORGANIZATION

소대 편성: /platoon-formation-v2 실행
투입 분대: ${squads.length}개

${squadDesc}

## ⚡ SKILL EXECUTION STRATEGY

순서대로 실행:

${skillList}

## 🤖 AI MODEL POLICY (Haiku First)

기본 모델 (Haiku) : 단순 코드, 반복 작업, 문서 작성
  → claude-haiku-4-5-20251001

복잡 작업 (Sonnet): API 설계, 아키텍처, 알고리즘
  → claude-sonnet-4-6

오케스트레이션 (Opus): 소대장 역할만 — 직접 코딩 금지
  → claude-opus-4-6

## 🪖 MERCENARY AI (외부 용병)

대용량 코드 분석 → Gemini
  gemini -p "코드베이스 전체 분석 및 구조 개선 제안"

최신 기술 리서치 → Perplexity
  perplexity_ask "최신 ${tech} 배포 베스트프랙티스"

빠른 프로토타입 → Grok
  grok -p "UI 컴포넌트 구조 초안 생성"

코드 보일러플레이트 → ChatGPT
  openai "${be} CRUD 보일러플레이트 생성"

## 🔄 REFINEMENT ENGINE

목표 품질: 95점 이상
실행 명령: /review-evaluate

평가 기준:
- 아키텍처 품질 (20점)
- 코드 품질     (20점)
- 보안          (20점)
- 성능          (20점)
- 유지보수성    (20점)

고도화 루프: 97점 도달까지 자동 반복 (최소 3회)

## 🚀 EXECUTE NOW

1. cd <프로젝트_폴더>
2. claude
3. /platoon-formation-v2
4. (위 MISSION 전달)
5. (개발 완료 후) /review-evaluate

## ✅ DONE WHEN

[ ] 전체 기능 구현 완료
[ ] /review-evaluate 최종 점수 95점 이상
[ ] 배포 가능한 프로덕션 수준
[ ] README 및 기술 문서 완비`;
}

// ── Nav Builder ───────────────────────────────────
const NAV_PAGES = [
  { num:'1', label:'인텐트 입력',  href:'../pages/01-intent.html' },
  { num:'2', label:'복잡도 분석', href:'../pages/02-complexity.html' },
  { num:'3', label:'분대 편성',   href:'../pages/03-squad.html' },
  { num:'4', label:'스킬 전략',   href:'../pages/04-skills.html' },
  { num:'5', label:'토큰 최적화', href:'../pages/05-token.html' },
  { num:'6', label:'고도화 엔진', href:'../pages/06-refinement.html' },
  { num:'7', label:'명령어 생성', href:'../pages/07-command.html' }
];
// For index.html (no ../)
const NAV_PAGES_ROOT = [
  { num:'1', label:'인텐트 입력',  href:'pages/01-intent.html' },
  { num:'2', label:'복잡도 분석', href:'pages/02-complexity.html' },
  { num:'3', label:'분대 편성',   href:'pages/03-squad.html' },
  { num:'4', label:'스킬 전략',   href:'pages/04-skills.html' },
  { num:'5', label:'토큰 최적화', href:'pages/05-token.html' },
  { num:'6', label:'고도화 엔진', href:'pages/06-refinement.html' },
  { num:'7', label:'명령어 생성', href:'pages/07-command.html' }
];

function buildNav(activeNum, fromRoot) {
  const pages = fromRoot ? NAV_PAGES_ROOT : NAV_PAGES;
  const homeHref = fromRoot ? '#' : '../index.html';
  const sitemapHref = fromRoot ? 'pages/sitemap.html' : '../pages/sitemap.html';
  return `<div class="header-inner">
    <div>
      <div class="logo-mark">V<span>C</span>OS</div>
      <div class="logo-sub">Vibe Coding OS</div>
    </div>
    <div class="nav-links">
      <a href="${homeHref}" class="home-link">🏠 허브</a>
      ${pages.map(p=>`<a href="${p.href}" class="nav-link${p.num===activeNum?' active':''}"><span class="nav-num">${p.num}</span>${p.label}</a>`).join('')}
      <a href="${sitemapHref}" class="nav-link${activeNum==='map'?' active':''}" style="border-color:rgba(255,255,255,${activeNum==='map'?'.3':'.12'})">🗺 구조도</a>
    </div>
  </div>`;
}

function buildProgress(activeNum) {
  const labels = ['인텐트 입력','복잡도 분석','분대 편성','스킬 전략','토큰 최적화','고도화 엔진','명령어 생성'];
  return labels.map((l,i)=>{
    const n = String(i+1);
    const cls = n < activeNum ? 'done' : n === activeNum ? 'active' : '';
    return `<div class="ps ${cls}"><span class="ps-num">${n}</span>${l}</div>`;
  }).join('');
}

function requireProject(redirectTo) {
  const p = loadProject();
  if (!p || !p.name) {
    alert('⚠️ 먼저 프로젝트 정보를 입력해 주세요.');
    location.href = redirectTo || '../pages/01-intent.html';
    return null;
  }
  return p;
}

// ── Footer Builder ────────────────────────────────
function buildFooter(fromRoot) {
  const base = fromRoot ? 'pages/' : '../pages/';
  const home = fromRoot ? 'index.html' : '../index.html';
  const sections = [
    { n:'1', label:'프로젝트 인텐트 입력', href: base+'01-intent.html' },
    { n:'2', label:'복잡도 분석',          href: base+'02-complexity.html' },
    { n:'3', label:'분대 편성',            href: base+'03-squad.html' },
    { n:'4', label:'스킬 전략',            href: base+'04-skills.html' },
    { n:'5', label:'토큰 최적화 전략',     href: base+'05-token.html' },
    { n:'6', label:'고도화 엔진',          href: base+'06-refinement.html' },
    { n:'7', label:'명령어 생성',          href: base+'07-command.html' }
  ];
  return `<footer class="vcos-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">V<span>C</span>OS</div>
        <div class="footer-tagline">Vibe Coding Operating System<br>AI 개발 전략을 7단계로 자동 설계</div>
        <div class="footer-badge"><span style="width:6px;height:6px;border-radius:50%;background:#4ade80;flex-shrink:0"></span>Claude Code 전용</div>
      </div>
      <div>
        <div class="footer-col-title">7-Section Wizard</div>
        <ul class="footer-links">
          ${sections.map(s=>`<li><a href="${s.href}"><span class="fn">${s.n}</span>${s.label}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <div class="footer-col-title">바로가기</div>
        <div class="footer-actions">
          <a href="${home}" class="footer-btn footer-btn-primary">🏠 VCOS 허브</a>
          <a href="${base}01-intent.html" class="footer-btn footer-btn-ghost">✏️ 새 프로젝트 시작</a>
          <a href="${base}07-command.html" class="footer-btn footer-btn-ghost">🚀 명령어 생성</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2025 VCOS — Vibe Coding Operating System. Generated by Claude Code.</div>
      <div class="footer-chips">
        <span class="footer-chip">Claude API</span>
        <span class="footer-chip">Haiku First</span>
        <span class="footer-chip">Platoon Formation</span>
        <span class="footer-chip">Review-Evaluate</span>
      </div>
    </div>
  </div>
</footer>`;
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ 복사됨!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}
