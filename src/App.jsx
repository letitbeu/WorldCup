import React, { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Home,
  PlayCircle,
  Search,
  Settings,
  ShieldAlert,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

const TIME_ZONES = [
  { value: 'Asia/Shanghai', label: '北京时间', hint: 'UTC+8' },
  { value: 'Asia/Singapore', label: '新加坡', hint: 'UTC+8' },
  { value: 'Asia/Tokyo', label: '东京', hint: 'UTC+9' },
  { value: 'Asia/Seoul', label: '首尔', hint: 'UTC+9' },
  { value: 'Europe/London', label: '伦敦', hint: 'UK' },
  { value: 'Europe/Paris', label: '巴黎', hint: 'CET/CEST' },
  { value: 'America/New_York', label: '纽约', hint: 'ET' },
  { value: 'America/Toronto', label: '多伦多', hint: 'ET' },
  { value: 'America/Los_Angeles', label: '洛杉矶', hint: 'PT' },
  { value: 'America/Mexico_City', label: '墨西哥城', hint: 'CST' },
  { value: 'America/Sao_Paulo', label: '圣保罗', hint: 'BRT' },
  { value: 'Australia/Sydney', label: '悉尼', hint: 'AEST/AEDT' },
  { value: 'UTC', label: 'UTC', hint: 'UTC' },
];

const TEAMS = {
  MEX: { cn: '墨西哥', en: 'Mexico', flag: '🇲🇽', group: 'A', rank: 14, heat: 87, power: 93.8, color: 'cyan' },
  RSA: { cn: '南非', en: 'South Africa', flag: '🇿🇦', group: 'A', rank: 59, heat: 72, power: 76.2, color: 'green' },
  CAN: { cn: '加拿大', en: 'Canada', flag: '🇨🇦', group: 'F', rank: 31, heat: 78, power: 80.1, color: 'cyan' },
  PER: { cn: '秘鲁', en: 'Peru', flag: '🇵🇪', group: 'F', rank: 47, heat: 68, power: 72.8, color: 'red' },
  URU: { cn: '乌拉圭', en: 'Uruguay', flag: '🇺🇾', group: 'A', rank: 11, heat: 65, power: 85.4, color: 'blue' },
  KOR: { cn: '韩国', en: 'Korea', flag: '🇰🇷', group: 'A', rank: 22, heat: 69, power: 82.6, color: 'blue' },
  ENG: { cn: '英格兰', en: 'England', flag: '🏴', group: 'B', rank: 4, heat: 82, power: 88.3, color: 'red' },
  IRN: { cn: '伊朗', en: 'Iran', flag: '🇮🇷', group: 'B', rank: 21, heat: 63, power: 74.7, color: 'red' },
  USA: { cn: '美国', en: 'United States', flag: '🇺🇸', group: 'B', rank: 16, heat: 71, power: 82.4, color: 'blue' },
  WAL: { cn: '威尔士', en: 'Wales', flag: '🏴', group: 'B', rank: 29, heat: 66, power: 74.2, color: 'green' },
  ARG: { cn: '阿根廷', en: 'Argentina', flag: '🇦🇷', group: 'C', rank: 1, heat: 92, power: 94.2, color: 'red' },
  FRA: { cn: '法国', en: 'France', flag: '🇫🇷', group: 'D', rank: 2, heat: 88, power: 92.1, color: 'red' },
  BRA: { cn: '巴西', en: 'Brazil', flag: '🇧🇷', group: 'C', rank: 3, heat: 90, power: 90.7, color: 'red' },
  POR: { cn: '葡萄牙', en: 'Portugal', flag: '🇵🇹', group: 'F', rank: 6, heat: 75, power: 86.3, color: 'orange' },
  ESP: { cn: '西班牙', en: 'Spain', flag: '🇪🇸', group: 'E', rank: 8, heat: 72, power: 85.1, color: 'orange' },
  POL: { cn: '波兰', en: 'Poland', flag: '🇵🇱', group: 'C', rank: 27, heat: 63, power: 70.9, color: 'blue' },
  KSA: { cn: '沙特阿拉伯', en: 'Saudi Arabia', flag: '🇸🇦', group: 'C', rank: 58, heat: 91, power: 67.7, color: 'red' },
  DEN: { cn: '丹麦', en: 'Denmark', flag: '🇩🇰', group: 'D', rank: 18, heat: 70, power: 81.9, color: 'blue' },
  TUN: { cn: '突尼斯', en: 'Tunisia', flag: '🇹🇳', group: 'D', rank: 44, heat: 61, power: 69.5, color: 'green' },
  GER: { cn: '德国', en: 'Germany', flag: '🇩🇪', group: 'E', rank: 9, heat: 86, power: 87.4, color: 'cyan' },
  JPN: { cn: '日本', en: 'Japan', flag: '🇯🇵', group: 'E', rank: 18, heat: 82, power: 83.1, color: 'blue' },
  CRC: { cn: '哥斯达黎加', en: 'Costa Rica', flag: '🇨🇷', group: 'E', rank: 49, heat: 54, power: 68.2, color: 'green' },
  MAR: { cn: '摩洛哥', en: 'Morocco', flag: '🇲🇦', group: 'F', rank: 12, heat: 84, power: 82.7, color: 'red' },
  CRO: { cn: '克罗地亚', en: 'Croatia', flag: '🇭🇷', group: 'F', rank: 10, heat: 73, power: 84.1, color: 'blue' },
};

const MATCHES = [
  { id: 1, status: "进行中 38'", time: '2026-06-11T19:00:00Z', group: 'A组', home: 'CAN', away: 'PER', homeScore: 1, awayScore: 0, heat: 78, tag: 'LIVE', line: 'green' },
  { id: 2, status: '17:00', time: '2026-06-12T09:00:00Z', group: 'A组', home: 'URU', away: 'KOR', heat: 65, tag: '开幕日', line: 'blue' },
  { id: 3, status: '20:00', time: '2026-06-12T12:00:00Z', group: 'B组', home: 'ENG', away: 'IRN', heat: 82, tag: '焦点', line: 'red' },
  { id: 4, status: '23:00', time: '2026-06-12T15:00:00Z', group: 'B组', home: 'USA', away: 'WAL', heat: 71, tag: '关注', line: 'blue' },
  { id: 5, status: '明天 02:00', time: '2026-06-12T18:00:00Z', group: 'C组', home: 'ARG', away: 'KSA', heat: 91, tag: '高热', line: 'red' },
  { id: 6, status: '明天 05:00', time: '2026-06-12T21:00:00Z', group: 'C组', home: 'MEX', away: 'POL', heat: 63, tag: '小组', line: 'blue' },
];

const WATCH_TEAMS = ['ARG', 'FRA', 'BRA', 'POR', 'ESP', 'ENG'];
const ALL_TEAMS = Object.keys(TEAMS);

const GROUP_TABLES = [
  { group: 'A组', rows: [['MEX', 1, 1, 0, 0, '2/0', 3], ['URU', 0, 0, 0, 0, '0/0', 0], ['KOR', 0, 0, 0, 0, '0/0', 0], ['PER', 1, 0, 0, 1, '0/2', 0]] },
  { group: 'B组', rows: [['ENG', 0, 0, 0, 0, '0/0', 0], ['USA', 0, 0, 0, 0, '0/0', 0], ['IRN', 0, 0, 0, 0, '0/0', 0], ['WAL', 0, 0, 0, 0, '0/0', 0]] },
  { group: 'C组', rows: [['ARG', 0, 0, 0, 0, '0/0', 0], ['KSA', 0, 0, 0, 0, '0/0', 0], ['POL', 0, 0, 0, 0, '0/0', 0], ['MEX', 0, 0, 0, 0, '0/0', 0]] },
  { group: 'D组', rows: [['FRA', 0, 0, 0, 0, '0/0', 0], ['AUS', 0, 0, 0, 0, '0/0', 0], ['DEN', 0, 0, 0, 0, '0/0', 0], ['TUN', 0, 0, 0, 0, '0/0', 0]] },
  { group: 'E组', rows: [['ESP', 1, 1, 0, 0, '0/0', 3], ['CRC', 0, 0, 0, 0, '0/0', 0], ['JPN', 0, 0, 0, 0, '0/0', 0], ['GER', 0, 0, 0, 0, '0/0', 0]] },
  { group: 'F组', rows: [['POR', 0, 0, 0, 0, '0/0', 0], ['MAR', 0, 0, 0, 0, '0/0', 0], ['CRO', 0, 0, 0, 0, '0/0', 0], ['CAN', 1, 0, 0, 1, '0/0', 0]] },
];

const NAV_TOP = [
  { key: 'dashboard', en: 'Dashboard', cn: '总览' },
  { key: 'schedule', en: 'Schedule', cn: '赛程' },
  { key: 'teams', en: 'Teams', cn: '球队' },
  { key: 'groups', en: 'Groups', cn: '小组赛' },
  { key: 'knockout', en: 'Knockout', cn: '淘汰赛' },
  { key: 'watchlist', en: 'Watchlist', cn: '自选' },
];

const SIDE_NAV = [
  { key: 'dashboard', icon: Home, label: '首页' },
  { key: 'schedule', icon: Activity, label: '行情' },
  { key: 'data', icon: Database, label: '数据' },
  { key: 'news', icon: FileText, label: '资讯' },
  { key: 'video', icon: PlayCircle, label: '视频' },
  { key: 'alerts', icon: Bell, label: '预警' },
  { key: 'settings', icon: Settings, label: '设置' },
];

function cls(...parts) {
  return parts.filter(Boolean).join(' ');
}

function team(code) {
  return TEAMS[code] || { cn: code, en: code, flag: '🏳️', group: '-', rank: '-', heat: 50, power: 50, color: 'blue' };
}

function fmtTime(iso, timeZone) {
  return new Intl.DateTimeFormat('zh-CN', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
}

function zoneName(tz) {
  return TIME_ZONES.find((z) => z.value === tz)?.label || tz;
}

function Spark({ color = 'blue' }) {
  const map = { blue: '#38bdf8', red: '#ef4444', green: '#22c55e', orange: '#f59e0b', cyan: '#22d3ee' };
  const stroke = map[color] || map.blue;
  return (
    <svg viewBox="0 0 116 42" className="h-11 w-full opacity-95">
      <path d="M4 31 L16 28 L24 16 L34 25 L45 20 L56 27 L68 15 L80 20 L94 12 L112 6" fill="none" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 37 L112 37" stroke="rgba(255,255,255,.08)" />
    </svg>
  );
}

function HeatArc({ value = 87 }) {
  const deg = Math.max(0, Math.min(100, value)) * 2.7;
  return (
    <div className="relative mx-auto flex h-[126px] w-[126px] items-center justify-center rounded-full" style={{ background: `conic-gradient(#facc15 0deg, #22c55e ${deg}deg, rgba(255,255,255,.09) ${deg}deg 270deg, transparent 270deg 360deg)` }}>
      <div className="flex h-[96px] w-[96px] flex-col items-center justify-center rounded-full border border-white/10 bg-[#08111f] shadow-inner shadow-black">
        <div className="text-[34px] font-black leading-none text-white">{value}</div>
        <div className="mt-1 text-[12px] text-slate-400">/100</div>
      </div>
    </div>
  );
}

function TopHeader({ timezone, setTimezone, activePage, setActivePage }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[66px] border-b border-cyan-200/10 bg-[#030917]/95 backdrop-blur-xl">
      <div className="grid h-full grid-cols-[416px_1fr_390px] items-center">
        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-3 pl-7 text-left">
          <Trophy size={40} className="text-[#f7b733]" strokeWidth={1.8} />
          <div>
            <div className="text-xl font-black leading-5 text-white">World Cup Terminal</div>
            <div className="mt-1 text-sm font-black text-[#f7b733]">世界杯行情终端</div>
          </div>
        </button>
        <nav className="flex h-full items-stretch justify-center">
          {NAV_TOP.map((item) => {
            const active = activePage === item.key;
            return (
              <button key={item.key} onClick={() => setActivePage(item.key)} className={cls('relative flex min-w-[108px] flex-col items-center justify-center border-l border-white/[0.025] px-4 text-sm font-bold transition hover:bg-cyan-400/5', active ? 'text-cyan-300' : 'text-slate-300')}>
                <span>{item.en}</span>
                <span className="mt-1 text-[12px] text-slate-400">{item.cn}</span>
                {active && <span className="absolute bottom-0 h-[3px] w-16 rounded-t-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,.9)]" />}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-4 pr-5">
          <label className="flex h-9 w-[232px] items-center gap-2 rounded-md border border-slate-700/70 bg-[#07101f] px-3 text-slate-500">
            <Search size={17} />
            <input className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500" placeholder="搜索球队 / 比赛 / 数据" />
          </label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-9 rounded-md border border-cyan-400/20 bg-[#07101f] px-2 text-xs font-bold text-cyan-200 outline-none">
            {TIME_ZONES.map((z) => (
              <option key={z.value} value={z.value} className="bg-[#07101f] text-white">{z.label}</option>
            ))}
          </select>
          <button onClick={() => setActivePage('alerts')} className="relative text-slate-300 hover:text-cyan-300">
            <Bell size={21} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button onClick={() => setActivePage('settings')} className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-700 text-sm font-black text-white">W</button>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}

function SideBar({ activePage, setActivePage }) {
  return (
    <aside className="fixed bottom-0 left-0 top-[66px] z-30 w-[100px] border-r border-cyan-200/10 bg-[#04101e]/95">
      <div className="pt-5">
        {SIDE_NAV.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key;
          return (
            <button key={item.key} onClick={() => setActivePage(item.key)} className={cls('relative flex h-[70px] w-full flex-col items-center justify-center gap-1 text-[14px] font-bold transition', active ? 'bg-cyan-400/10 text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-cyan-200')}>
              {active && <span className="absolute left-0 top-0 h-full w-[4px] bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />}
              <Icon size={23} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={() => setActivePage('dashboard')} className="absolute bottom-5 left-2 right-2 rounded-lg border border-cyan-400/20 bg-[#06182a] p-3 text-center hover:border-cyan-300/60">
        <div className="text-lg font-black text-cyan-300">2026</div>
        <div className="mt-1 text-[9px] font-bold text-slate-400">FIFA WORLD CUP</div>
        <div className="text-[9px] text-slate-500">USA | CAN | MEX</div>
      </button>
    </aside>
  );
}

function Hero({ timezone }) {
  return (
    <section className="grid h-[220px] grid-cols-[1fr_246px_300px] overflow-hidden rounded-lg border border-cyan-400/30 bg-[#071322] shadow-[0_0_30px_rgba(8,145,178,.16)]">
      <div className="relative flex items-center justify-center overflow-hidden border-r border-cyan-400/15 bg-[radial-gradient(circle_at_28%_38%,rgba(251,191,36,.26),transparent_22%),linear-gradient(90deg,rgba(13,23,41,.7),rgba(4,13,26,.98))]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 45%, rgba(255,255,255,.08) 46%, transparent 47%), radial-gradient(circle at 28% 54%, rgba(251,191,36,.42), transparent 16%)' }} />
        <div className="absolute left-0 top-2 h-[54px] w-[150px] border-y border-r border-[#f5b333] bg-[#241b08]/80 px-4 py-2 [clip-path:polygon(0_0,86%_0,100%_50%,86%_100%,0_100%)]">
          <div className="text-sm font-black text-[#ffd65a]">OPENING MATCH</div>
          <div className="text-xs font-black text-[#ffd65a]">开幕战</div>
        </div>
        <div className="relative z-10 mt-2 text-center">
          <div className="text-sm font-black text-white">下一场比赛 / 开幕战</div>
          <div className="mt-1 flex items-center justify-center gap-9">
            <div className="text-right"><div className="text-[38px] font-black leading-none text-white">墨西哥</div><div className="mt-5 flex justify-end"><span className="rounded bg-black/20 px-1 text-[56px] leading-none">🇲🇽</span></div><div className="mt-2 text-xl font-bold text-slate-200">MEX</div></div>
            <div><div className="text-2xl font-black text-cyan-200">VS</div><div className="mt-5 font-mono text-[38px] font-black tracking-[8px] text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,.9)]">02:18:47</div><div className="mt-1 flex justify-center gap-11 text-sm font-bold text-slate-300"><span>时</span><span>分</span><span>秒</span></div></div>
            <div className="text-left"><div className="text-[38px] font-black leading-none text-white">南非</div><div className="mt-5 flex justify-start"><span className="rounded bg-black/20 px-1 text-[56px] leading-none">🇿🇦</span></div><div className="mt-2 text-xl font-bold text-slate-200">RSA</div></div>
          </div>
          <div className="mt-2 text-sm text-slate-300">📍 Estadio Azteca, Mexico City</div>
          <div className="text-xs text-slate-500">{zoneName(timezone)} · {fmtTime('2026-06-11T19:00:00Z', timezone)}</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center border-r border-cyan-400/15 bg-[#071322]/80"><div className="text-base font-black text-white">市场热度</div><div className="text-xs font-bold tracking-widest text-slate-400">MARKET HEAT</div><div className="mt-4"><HeatArc value={87} /></div><div className="mt-2 text-sm font-black text-red-400">极高</div></div>
      <div className="flex flex-col items-center justify-center bg-[#071322]/80"><div className="text-base font-black text-white">比赛重要性</div><div className="text-xs font-bold tracking-widest text-slate-400">IMPORTANCE</div><div className="mt-6 text-[32px] tracking-[7px] text-[#ffc344]">★★★★★</div><div className="mt-6 text-[28px] font-black text-white">5.0 <span className="text-base text-slate-400">/5</span></div><div className="mt-4 w-[150px] rounded-md border border-[#9a6b25] bg-[#2c210e]/70 py-1 text-center text-sm font-black text-[#ffd05a]">极高关注</div></div>
    </section>
  );
}

function StatCards() {
  const stats = [
    [CalendarDays, '64', '今日比赛场次', 'SAMPLE MATCHES', 'text-cyan-300'],
    [Users, '24', '已关注球队', 'WATCHED TEAMS', 'text-green-400'],
    [Star, '12', '收藏比赛', 'FAVORITE MATCHES', 'text-amber-300'],
    [Trophy, '29', '距离决赛还有', 'DAYS TO FINAL', 'text-purple-400'],
  ];
  return <div className="grid grid-cols-4 gap-3">{stats.map(([Icon, value, title, sub, color]) => <button key={title} className="flex h-[78px] items-center rounded-lg border border-cyan-400/20 bg-[#071322] px-5 text-left shadow-[inset_0_0_30px_rgba(14,165,233,.06)] transition hover:border-cyan-300/60"><div className={cls('mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/5', color)}><Icon size={29} /></div><div className={cls('mr-6 text-[36px] font-black leading-none', color)}>{value}</div><div><div className="text-base font-black text-white">{title}</div><div className="text-xs text-slate-500">{sub}</div></div></button>)}</div>;
}

function SectionTitle({ title, right, onRight }) {
  return <div className="mb-2 flex h-7 items-center justify-between"><div className="text-[20px] font-black text-white">{title} <span className="text-slate-500">ⓘ</span></div>{right && <button onClick={onRight} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-300">{right}<ChevronRight size={16} /></button>}</div>;
}

function MatchMiniCard({ match, timezone }) {
  const h = team(match.home); const a = team(match.away);
  return <button className="h-[126px] min-w-[238px] rounded-md border border-cyan-400/20 bg-[#071322] p-4 text-left shadow-[inset_0_0_28px_rgba(14,165,233,.05)] transition hover:-translate-y-0.5 hover:border-cyan-300/60"><div className="mb-2 flex items-center justify-between text-sm font-bold"><span className={match.status.includes('进行中') ? 'text-green-400' : 'text-slate-300'}>{match.status.includes(':') ? fmtTime(match.time, timezone) : match.status}</span><span className="text-slate-400">{match.group}</span></div><div className="grid grid-cols-[1fr_74px] gap-2"><div className="space-y-1 text-sm font-bold text-white"><div>{h.flag} {h.cn} {match.homeScore ?? ''}</div><div>{a.flag} {a.cn} {match.awayScore ?? ''}</div></div><Spark color={match.line} /></div><div className="mt-2 flex items-center gap-3 text-xs text-slate-400"><span>热度 {match.heat}</span><div className="h-1.5 flex-1 rounded-full bg-white/10"><div className={cls('h-full rounded-full', match.line === 'red' ? 'bg-red-500' : match.line === 'green' ? 'bg-green-500' : 'bg-cyan-400')} style={{ width: `${match.heat}%` }} /></div></div></button>;
}

function MatchTape({ timezone, setActivePage }) {
  return <section><SectionTitle title="Match Tape / 今日比赛行情带" right="查看全部" onRight={() => setActivePage('schedule')} /><div className="flex gap-3 overflow-hidden">{MATCHES.map((m) => <MatchMiniCard key={m.id} match={m} timezone={timezone} />)}<button onClick={() => setActivePage('schedule')} className="flex w-10 shrink-0 items-center justify-center rounded-md border border-cyan-400/20 bg-[#071322] text-slate-300 hover:border-cyan-300/70 hover:text-cyan-300"><ChevronRight size={30} /></button></div></section>;
}

function TeamCard({ code }) {
  const t = team(code);
  return <button className="h-[116px] min-w-[236px] rounded-md border border-cyan-400/20 bg-[#071322] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/60"><div className="flex items-start justify-between"><div className="flex gap-3"><div className="text-[34px] leading-none">{t.flag}</div><div><div className="text-base font-black text-white">{t.cn} <span className="text-xs text-slate-500">{code}</span></div><div className="mt-1 text-xs text-slate-500">FIFA排名 {t.rank}</div></div></div><Star size={18} className="fill-[#ffc344] text-[#ffc344]" /></div><div className="mt-2 grid grid-cols-[88px_1fr] gap-2"><div><div className="text-xs text-slate-400">热度 {t.heat}</div><div className="mt-1 h-1.5 rounded-full bg-white/10"><div className={cls('h-full rounded-full', t.color === 'orange' ? 'bg-orange-400' : 'bg-red-500')} style={{ width: `${t.heat}%` }} /></div></div><Spark color={t.color} /></div></button>;
}

function TeamWatchlist({ setActivePage }) {
  return <section><SectionTitle title="Team Watchlist / 球队自选池" right="管理自选" onRight={() => setActivePage('watchlist')} /><div className="flex gap-3 overflow-hidden">{WATCH_TEAMS.map((code) => <TeamCard key={code} code={code} />)}<button onClick={() => setActivePage('watchlist')} className="flex w-10 shrink-0 items-center justify-center rounded-md border border-cyan-400/20 bg-[#071322] text-slate-300 hover:border-cyan-300/70 hover:text-cyan-300"><ChevronRight size={30} /></button></div></section>;
}

function GroupTable({ table, idx }) {
  const colors = ['text-cyan-300', 'text-sky-300', 'text-green-300', 'text-yellow-300', 'text-purple-300', 'text-rose-300'];
  return <button className="h-[154px] rounded-md border border-cyan-400/20 bg-[#071322] p-3 text-left transition hover:border-cyan-300/60"><div className={cls('mb-2 text-base font-black', colors[idx % colors.length])}>{table.group}</div><table className="w-full text-[12px] text-slate-300"><thead className="text-slate-500"><tr><th className="text-left"> </th><th>赛</th><th>胜</th><th>平</th><th>负</th><th>进/失</th><th>积分</th></tr></thead><tbody>{table.rows.map((r, i) => <tr key={`${table.group}-${r[0]}`} className={i === 0 ? 'text-white' : 'text-slate-400'}><td className="max-w-[82px] truncate py-1 text-left">{team(r[0]).flag} {team(r[0]).cn}</td><td className="text-center">{r[1]}</td><td className="text-center">{r[2]}</td><td className="text-center">{r[3]}</td><td className="text-center">{r[4]}</td><td className="text-center">{r[5]}</td><td className="text-center">{r[6]}</td></tr>)}</tbody></table></button>;
}

function GroupHeatmap({ setActivePage }) {
  return <section><SectionTitle title="Group Heatmap / 小组热力图" right="查看全部小组" onRight={() => setActivePage('groups')} /><div className="grid grid-cols-6 gap-3">{GROUP_TABLES.map((g, idx) => <GroupTable key={g.group} table={g} idx={idx} />)}</div></section>;
}

function Dashboard({ timezone, setActivePage }) {
  return <><Hero timezone={timezone} /><div className="mt-3"><StatCards /></div><div className="mt-3"><MatchTape timezone={timezone} setActivePage={setActivePage} /></div><div className="mt-4"><TeamWatchlist setActivePage={setActivePage} /></div><div className="mt-4"><GroupHeatmap setActivePage={setActivePage} /></div></>;
}

function PageShell({ title, subtitle, children }) {
  return <section className="min-h-[720px] rounded-lg border border-cyan-400/20 bg-[#071322] p-5 shadow-[0_0_30px_rgba(8,145,178,.12)]"><div className="mb-5 flex items-center justify-between"><div><div className="text-2xl font-black text-white">{title}</div><div className="mt-1 text-sm text-slate-400">{subtitle}</div></div><div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-200">已切换</div></div>{children}</section>;
}

function SchedulePage({ timezone }) {
  return <PageShell title="Schedule / 赛程" subtitle={`当前时区：${zoneName(timezone)}。点击顶部或左侧按钮会切换页面。`}><div className="grid grid-cols-3 gap-3">{MATCHES.concat(MATCHES).map((m, idx) => <MatchMiniCard key={`${m.id}-${idx}`} match={m} timezone={timezone} />)}</div></PageShell>;
}

function TeamsPage() {
  return <PageShell title="Teams / 球队" subtitle="球队列表、热度、排名与自选状态。"><div className="grid grid-cols-6 gap-3">{ALL_TEAMS.slice(0, 24).map((code) => <TeamCard key={code} code={code} />)}</div></PageShell>;
}

function GroupsPage() {
  return <PageShell title="Groups / 小组赛" subtitle="小组积分、胜平负、进失球与积分。"><div className="grid grid-cols-3 gap-3">{GROUP_TABLES.concat(GROUP_TABLES).map((g, idx) => <GroupTable key={`${g.group}-${idx}`} table={g} idx={idx} />)}</div></PageShell>;
}

function KnockoutPage() {
  const stages = ['32强', '16强', '8强', '半决赛', '决赛'];
  return <PageShell title="Knockout / 淘汰赛" subtitle="晋级路径与阶段节点。"><div className="flex min-h-[480px] gap-5 overflow-x-auto">{stages.map((s, i) => <div key={s} className="flex w-[220px] shrink-0 flex-col gap-4"><div className="text-center text-sm font-black text-cyan-300">{s}</div>{Array.from({ length: Math.max(1, 5 - i) }).map((_, idx) => <div key={idx} className="relative rounded-md border border-cyan-400/20 bg-[#0a1828] p-4 text-center text-sm font-black text-white">{i === 4 ? '🏆 冠军' : `路径节点 ${idx + 1}`}{i < stages.length - 1 && <span className="absolute -right-5 top-1/2 h-px w-5 bg-cyan-300/50" />}</div>)}</div>)}</div></PageShell>;
}

function WatchlistPage() {
  return <PageShell title="Watchlist / 自选" subtitle="收藏球队与关注比赛。"><div className="grid grid-cols-6 gap-3">{WATCH_TEAMS.map((code) => <TeamCard key={code} code={code} />)}</div><div className="mt-6 grid grid-cols-3 gap-3">{MATCHES.slice(0, 6).map((m) => <MatchMiniCard key={m.id} match={m} timezone="Asia/Shanghai" />)}</div></PageShell>;
}

function PlaceholderPage({ title }) {
  return <PageShell title={title} subtitle="模块入口已接通，后续可继续扩展真实内容。"><div className="grid grid-cols-3 gap-3">{['核心摘要', '重点追踪', '实时提醒', '资料库', '推荐内容', '操作设置'].map((name) => <button key={name} className="h-[160px] rounded-md border border-cyan-400/20 bg-[#0a1828] p-5 text-left transition hover:border-cyan-300/60"><div className="text-lg font-black text-white">{name}</div><div className="mt-2 text-sm text-slate-400">点击反馈已开启，等待接入下一阶段功能。</div></button>)}</div></PageShell>;
}

function Content({ activePage, timezone, setActivePage }) {
  if (activePage === 'dashboard') return <Dashboard timezone={timezone} setActivePage={setActivePage} />;
  if (activePage === 'schedule') return <SchedulePage timezone={timezone} />;
  if (activePage === 'teams') return <TeamsPage />;
  if (activePage === 'groups') return <GroupsPage />;
  if (activePage === 'knockout') return <KnockoutPage />;
  if (activePage === 'watchlist') return <WatchlistPage />;
  if (activePage === 'data') return <PlaceholderPage title="Data / 数据" />;
  if (activePage === 'news') return <PlaceholderPage title="News / 资讯" />;
  if (activePage === 'video') return <PlaceholderPage title="Video / 视频" />;
  if (activePage === 'alerts') return <PlaceholderPage title="Alerts / 预警" />;
  if (activePage === 'settings') return <PlaceholderPage title="Settings / 设置" />;
  return <Dashboard timezone={timezone} setActivePage={setActivePage} />;
}

export default function App() {
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const savedTz = localStorage.getItem('wc:timezone');
    const savedPage = localStorage.getItem('wc:activePage');
    if (savedTz) setTimezone(savedTz);
    if (savedPage) setActivePage(savedPage);
  }, []);

  useEffect(() => { localStorage.setItem('wc:timezone', timezone); }, [timezone]);
  useEffect(() => { localStorage.setItem('wc:activePage', activePage); }, [activePage]);

  return (
    <div className="min-h-screen overflow-x-auto bg-[#020916] text-white [font-family:Inter,ui-sans-serif,system-ui,'PingFang_SC','Microsoft_YaHei',sans-serif]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_52%_0%,rgba(14,165,233,.11),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(245,158,11,.07),transparent_26%)]" />
      <TopHeader timezone={timezone} setTimezone={setTimezone} activePage={activePage} setActivePage={setActivePage} />
      <SideBar activePage={activePage} setActivePage={setActivePage} />
      <main className="ml-[100px] pt-[66px]">
        <div className="mx-auto max-w-[1480px] px-9 py-4">
          <Content activePage={activePage} timezone={timezone} setActivePage={setActivePage} />
        </div>
      </main>
      <button onClick={() => setActivePage('schedule')} className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-[#062033] text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,.25)] transition hover:scale-105 hover:border-cyan-200">
        <CalendarDays size={25} />
      </button>
    </div>
  );
}
