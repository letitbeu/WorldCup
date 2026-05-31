import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  GitBranch,
  Heart,
  MapPin,
  Moon,
  Search,
  ShieldAlert,
  Star,
  Sun,
  Trophy,
  Users,
  Zap,
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

const GROUPS = [
  { id: 'A', tag: '开幕小组', pressure: '竞争偏高', level: 82, teams: ['Mexico', 'South Africa', 'Korea Republic', 'European Play-off D'] },
  { id: 'B', tag: '东道主关注', pressure: '竞争偏高', level: 74, teams: ['Canada', 'Qatar', 'Switzerland', 'European Play-off A'] },
  { id: 'C', tag: '强队领跑', pressure: '中等', level: 68, teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D', tag: '美国主场', pressure: '竞争偏高', level: 79, teams: ['United States', 'Paraguay', 'Australia', 'European Play-off C'] },
  { id: 'E', tag: '欧洲核心', pressure: '中等', level: 71, teams: ['Germany', 'Curaçao', "Côte d'Ivoire", 'Ecuador'] },
  { id: 'F', tag: '攻防对比', pressure: '竞争偏高', level: 77, teams: ['Netherlands', 'Japan', 'Tunisia', 'European Play-off B'] },
  { id: 'G', tag: '多队拉扯', pressure: '激烈', level: 84, teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  { id: 'H', tag: '西语对决', pressure: '中等', level: 69, teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I', tag: '球星聚焦', pressure: '竞争偏高', level: 73, teams: ['France', 'Senegal', 'Norway', 'Intercontinental Play-off A'] },
  { id: 'J', tag: '南美焦点', pressure: '中等', level: 66, teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', tag: '新军观察', pressure: '中等', level: 70, teams: ['Portugal', 'Colombia', 'Uzbekistan', 'Intercontinental Play-off B'] },
  { id: 'L', tag: '强强同组', pressure: '激烈', level: 88, teams: ['England', 'Croatia', 'Ghana', 'Panama'] },
];

const TEAM_META = {
  Mexico: { cn: '墨西哥', flag: '🇲🇽', rank: 14, qualify: 68, heat: 91, form: '主场关注', group: 'A' },
  'South Africa': { cn: '南非', flag: '🇿🇦', rank: 59, qualify: 34, heat: 72, form: '开幕挑战', group: 'A' },
  'Korea Republic': { cn: '韩国', flag: '🇰🇷', rank: 22, qualify: 55, heat: 76, form: '稳定推进', group: 'A' },
  'European Play-off D': { cn: '欧洲附加赛 D', flag: '🏳️', rank: 40, qualify: 45, heat: 62, form: '待定席位', group: 'A' },
  Canada: { cn: '加拿大', flag: '🇨🇦', rank: 31, qualify: 61, heat: 84, form: '主场关注', group: 'B' },
  Qatar: { cn: '卡塔尔', flag: '🇶🇦', rank: 53, qualify: 38, heat: 57, form: '需要抢分', group: 'B' },
  Switzerland: { cn: '瑞士', flag: '🇨🇭', rank: 19, qualify: 64, heat: 71, form: '稳定型', group: 'B' },
  'European Play-off A': { cn: '欧洲附加赛 A', flag: '🏳️', rank: 36, qualify: 48, heat: 60, form: '待定席位', group: 'B' },
  Brazil: { cn: '巴西', flag: '🇧🇷', rank: 5, qualify: 86, heat: 95, form: '夺冠热门', group: 'C' },
  Morocco: { cn: '摩洛哥', flag: '🇲🇦', rank: 12, qualify: 70, heat: 88, form: '上升势头', group: 'C' },
  Haiti: { cn: '海地', flag: '🇭🇹', rank: 82, qualify: 22, heat: 48, form: '出线压力', group: 'C' },
  Scotland: { cn: '苏格兰', flag: '🏴', rank: 39, qualify: 47, heat: 66, form: '韧性球队', group: 'C' },
  'United States': { cn: '美国', flag: '🇺🇸', rank: 16, qualify: 72, heat: 94, form: '主场关注', group: 'D' },
  Paraguay: { cn: '巴拉圭', flag: '🇵🇾', rank: 47, qualify: 42, heat: 65, form: '防守反击', group: 'D' },
  Australia: { cn: '澳大利亚', flag: '🇦🇺', rank: 26, qualify: 51, heat: 69, form: '稳定型', group: 'D' },
  'European Play-off C': { cn: '欧洲附加赛 C', flag: '🏳️', rank: 43, qualify: 44, heat: 58, form: '待定席位', group: 'D' },
  Germany: { cn: '德国', flag: '🇩🇪', rank: 9, qualify: 81, heat: 89, form: '强队状态', group: 'E' },
  Curaçao: { cn: '库拉索', flag: '🇨🇼', rank: 85, qualify: 18, heat: 52, form: '新鲜面孔', group: 'E' },
  "Côte d'Ivoire": { cn: '科特迪瓦', flag: '🇨🇮', rank: 41, qualify: 49, heat: 67, form: '身体优势', group: 'E' },
  Ecuador: { cn: '厄瓜多尔', flag: '🇪🇨', rank: 23, qualify: 58, heat: 73, form: '潜力球队', group: 'E' },
  Netherlands: { cn: '荷兰', flag: '🇳🇱', rank: 7, qualify: 80, heat: 87, form: '强队状态', group: 'F' },
  Japan: { cn: '日本', flag: '🇯🇵', rank: 18, qualify: 63, heat: 82, form: '上升势头', group: 'F' },
  Tunisia: { cn: '突尼斯', flag: '🇹🇳', rank: 44, qualify: 46, heat: 64, form: '防守稳固', group: 'F' },
  'European Play-off B': { cn: '欧洲附加赛 B', flag: '🏳️', rank: 45, qualify: 43, heat: 56, form: '待定席位', group: 'F' },
  Belgium: { cn: '比利时', flag: '🇧🇪', rank: 8, qualify: 76, heat: 78, form: '换代观察', group: 'G' },
  Egypt: { cn: '埃及', flag: '🇪🇬', rank: 32, qualify: 57, heat: 79, form: '球星带动', group: 'G' },
  Iran: { cn: '伊朗', flag: '🇮🇷', rank: 21, qualify: 54, heat: 70, form: '防守稳固', group: 'G' },
  'New Zealand': { cn: '新西兰', flag: '🇳🇿', rank: 89, qualify: 20, heat: 45, form: '出线压力', group: 'G' },
  Spain: { cn: '西班牙', flag: '🇪🇸', rank: 3, qualify: 88, heat: 90, form: '夺冠热门', group: 'H' },
  'Cape Verde': { cn: '佛得角', flag: '🇨🇻', rank: 65, qualify: 27, heat: 54, form: '新鲜面孔', group: 'H' },
  'Saudi Arabia': { cn: '沙特阿拉伯', flag: '🇸🇦', rank: 58, qualify: 35, heat: 63, form: '爆点观察', group: 'H' },
  Uruguay: { cn: '乌拉圭', flag: '🇺🇾', rank: 11, qualify: 73, heat: 81, form: '上升势头', group: 'H' },
  France: { cn: '法国', flag: '🇫🇷', rank: 2, qualify: 91, heat: 96, form: '夺冠热门', group: 'I' },
  Senegal: { cn: '塞内加尔', flag: '🇸🇳', rank: 17, qualify: 67, heat: 77, form: '潜力球队', group: 'I' },
  Norway: { cn: '挪威', flag: '🇳🇴', rank: 28, qualify: 59, heat: 83, form: '球星带动', group: 'I' },
  'Intercontinental Play-off A': { cn: '洲际附加赛 A', flag: '🏳️', rank: 55, qualify: 33, heat: 50, form: '待定席位', group: 'I' },
  Argentina: { cn: '阿根廷', flag: '🇦🇷', rank: 1, qualify: 90, heat: 97, form: '夺冠热门', group: 'J' },
  Algeria: { cn: '阿尔及利亚', flag: '🇩🇿', rank: 36, qualify: 50, heat: 68, form: '对抗强度', group: 'J' },
  Austria: { cn: '奥地利', flag: '🇦🇹', rank: 25, qualify: 60, heat: 72, form: '上升势头', group: 'J' },
  Jordan: { cn: '约旦', flag: '🇯🇴', rank: 69, qualify: 28, heat: 51, form: '出线压力', group: 'J' },
  Portugal: { cn: '葡萄牙', flag: '🇵🇹', rank: 4, qualify: 87, heat: 93, form: '夺冠热门', group: 'K' },
  Colombia: { cn: '哥伦比亚', flag: '🇨🇴', rank: 13, qualify: 69, heat: 80, form: '上升势头', group: 'K' },
  Uzbekistan: { cn: '乌兹别克斯坦', flag: '🇺🇿', rank: 49, qualify: 40, heat: 61, form: '新鲜面孔', group: 'K' },
  'Intercontinental Play-off B': { cn: '洲际附加赛 B', flag: '🏳️', rank: 60, qualify: 31, heat: 47, form: '待定席位', group: 'K' },
  England: { cn: '英格兰', flag: '🏴', rank: 6, qualify: 84, heat: 92, form: '夺冠热门', group: 'L' },
  Croatia: { cn: '克罗地亚', flag: '🇭🇷', rank: 10, qualify: 74, heat: 78, form: '大赛经验', group: 'L' },
  Ghana: { cn: '加纳', flag: '🇬🇭', rank: 61, qualify: 37, heat: 62, form: '爆点观察', group: 'L' },
  Panama: { cn: '巴拿马', flag: '🇵🇦', rank: 48, qualify: 39, heat: 59, form: '防守韧性', group: 'L' },
};

const MATCHES = [
  { id: 'm1', no: 1, date: '2026-06-11', kickoffUTC: '2026-06-11T19:00:00Z', group: 'A', round: '小组赛第1轮', home: 'Mexico', away: 'South Africa', city: 'Mexico City', stadium: 'Mexico City Stadium', importance: 98, heat: 96, keyPoint: '开幕战', tags: ['开幕战', '高关注'] },
  { id: 'm2', no: 2, date: '2026-06-12', kickoffUTC: '2026-06-12T19:00:00Z', group: 'B', round: '小组赛第1轮', home: 'Canada', away: 'European Play-off A', city: 'Toronto', stadium: 'Toronto Stadium', importance: 90, heat: 87, keyPoint: '东道主首战', tags: ['东道主', '关注战'] },
  { id: 'm4', no: 4, date: '2026-06-13', kickoffUTC: '2026-06-13T01:00:00Z', group: 'D', round: '小组赛第1轮', home: 'United States', away: 'Paraguay', city: 'Los Angeles', stadium: 'Los Angeles Stadium', importance: 93, heat: 94, keyPoint: '主场首战', tags: ['美国首战', '焦点'] },
  { id: 'm7', no: 7, date: '2026-06-13', kickoffUTC: '2026-06-13T22:00:00Z', group: 'C', round: '小组赛第1轮', home: 'Brazil', away: 'Morocco', city: 'New York/New Jersey', stadium: 'New York New Jersey Stadium', importance: 95, heat: 97, keyPoint: '强强对话', tags: ['焦点战', '强强对话'] },
  { id: 'm8', no: 8, date: '2026-06-13', kickoffUTC: '2026-06-13T19:00:00Z', group: 'B', round: '小组赛第1轮', home: 'Qatar', away: 'Switzerland', city: 'San Francisco Bay Area', stadium: 'San Francisco Bay Area Stadium', importance: 71, heat: 66, keyPoint: '小组观察', tags: ['小组观察'] },
  { id: 'm10', no: 10, date: '2026-06-14', kickoffUTC: '2026-06-14T20:00:00Z', group: 'E', round: '小组赛第1轮', home: 'Germany', away: 'Curaçao', city: 'Houston', stadium: 'Houston Stadium', importance: 82, heat: 83, keyPoint: '新军挑战', tags: ['新军', '强队'] },
  { id: 'm11', no: 11, date: '2026-06-14', kickoffUTC: '2026-06-14T20:00:00Z', group: 'F', round: '小组赛第1轮', home: 'Netherlands', away: 'Japan', city: 'Dallas', stadium: 'Dallas Stadium', importance: 91, heat: 89, keyPoint: '技战术对决', tags: ['战术看点', '亚洲球队'] },
  { id: 'm21', no: 21, date: '2026-06-17', kickoffUTC: '2026-06-17T20:00:00Z', group: 'L', round: '小组赛第1轮', home: 'England', away: 'Croatia', city: 'Dallas', stadium: 'Dallas Stadium', importance: 96, heat: 95, keyPoint: '强强对话', tags: ['强强对话', '高关注'] },
  { id: 'm38', no: 38, date: '2026-06-20', kickoffUTC: '2026-06-21T03:00:00Z', group: 'F', round: '小组赛第2轮', home: 'Tunisia', away: 'Japan', city: 'Monterrey', stadium: 'Monterrey Stadium', importance: 89, heat: 84, keyPoint: '历史节点', tags: ['历史节点', '亚洲球队'] },
  { id: 'm60', no: 60, date: '2026-06-24', kickoffUTC: '2026-06-24T22:00:00Z', group: 'J', round: '小组赛第3轮', home: 'Argentina', away: 'Austria', city: 'Kansas City', stadium: 'Kansas City Stadium', importance: 91, heat: 92, keyPoint: '出线关键战', tags: ['出线关键战'] },
  { id: 'm72', no: 72, date: '2026-06-26', kickoffUTC: '2026-06-26T22:00:00Z', group: 'K', round: '小组赛第3轮', home: 'Portugal', away: 'Colombia', city: 'Miami', stadium: 'Miami Stadium', importance: 94, heat: 93, keyPoint: '种子队对话', tags: ['焦点战', '出线形势'] },
];

const KNOCKOUT = [
  { stage: '32强', nodes: ['A组第一', 'B组第二', 'C组第一', '成绩较好第三名', 'L组第一', 'K组第二'] },
  { stage: '16强', nodes: ['A/B路径', 'C/D路径', 'E/F路径', 'K/L路径'] },
  { stage: '8强', nodes: ['北区路径', '中区路径', '南区路径', '大西洋路径'] },
  { stage: '半决赛', nodes: ['半决赛 1', '半决赛 2'] },
  { stage: '决赛', nodes: ['冠军归属'] },
];

const NAV = [
  { id: 'dashboard', label: 'Dashboard', cn: '总览', icon: Activity },
  { id: 'schedule', label: 'Schedule', cn: '赛程', icon: CalendarDays },
  { id: 'teams', label: 'Teams', cn: '球队', icon: Users },
  { id: 'groups', label: 'Groups', cn: '小组', icon: BarChart3 },
  { id: 'knockout', label: 'Knockout', cn: '晋级', icon: GitBranch },
  { id: 'watchlist', label: 'Watchlist', cn: '关注', icon: Heart },
];

function cls(...parts) {
  return parts.filter(Boolean).join(' ');
}

function getTeam(name) {
  return TEAM_META[name] || { cn: name, flag: '🏳️', rank: 50, qualify: 40, heat: 50, form: '待定', group: '?' };
}

function formatInZone(iso, timeZone, options = {}) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    month: options.month ?? 'short',
    day: options.day ?? 'numeric',
    weekday: options.weekday ? 'short' : undefined,
    hour: options.time ? '2-digit' : undefined,
    minute: options.time ? '2-digit' : undefined,
    hour12: false,
  }).format(new Date(iso));
}

function formatTimeOnly(iso, timeZone) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

function getZoneLabel(timeZone) {
  return TIME_ZONES.find((z) => z.value === timeZone)?.label || timeZone;
}

function getMatchStatus(kickoffUTC) {
  const now = Date.now();
  const start = new Date(kickoffUTC).getTime();
  const end = start + 110 * 60 * 1000;
  if (now < start) return 'scheduled';
  if (now >= start && now <= end) return 'live';
  return 'ended';
}

function StatusPill({ status }) {
  const map = { scheduled: '待开赛', live: '进行中', ended: '已结束' };
  return (
    <span
      className={cls(
        'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold',
        status === 'live' && 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300',
        status === 'scheduled' && 'border-sky-400/40 bg-sky-400/10 text-sky-300',
        status === 'ended' && 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400',
      )}
    >
      {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />}
      {map[status]}
    </span>
  );
}

function Gauge({ value, label, tone = 'cyan' }) {
  const color =
    tone === 'gold'
      ? 'from-amber-300 to-yellow-500'
      : tone === 'red'
        ? 'from-rose-400 to-orange-500'
        : 'from-cyan-300 to-emerald-300';
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-400">
        <span>{label}</span>
        <span className="font-semibold text-zinc-100">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={cls('h-full rounded-full bg-gradient-to-r', color)} style={{ width: `${Math.max(3, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function Sparkline({ tone = 'cyan' }) {
  const stroke = tone === 'gold' ? '#fbbf24' : tone === 'rose' ? '#fb7185' : '#22d3ee';
  return (
    <svg viewBox="0 0 120 36" className="h-9 w-full">
      <defs>
        <linearGradient id={`spark-${tone}`} x1="0" x2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d="M2 26 C18 10, 28 18, 40 15 S62 5, 78 14 S98 30, 118 8" fill="none" stroke={`url(#spark-${tone})`} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TimeZoneSelector({ timeZone, setTimeZone, compact = false }) {
  return (
    <label
      className={cls(
        'flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2',
        compact ? 'w-full' : 'min-w-[250px]',
      )}
    >
      <Clock3 size={16} className="text-cyan-200" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Time Zone / 时区</div>
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="mt-1 w-full bg-transparent text-sm font-bold text-white outline-none">
          {TIME_ZONES.map((zone) => (
            <option key={zone.value} value={zone.value} className="bg-slate-950 text-white">
              {zone.label} · {zone.hint}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function TeamName({ name, small = false }) {
  const team = getTeam(name);
  return (
    <div className="min-w-0">
      <div className={cls('truncate font-black text-white', small ? 'text-sm' : 'text-lg')}>{team.cn}</div>
      <div className="truncate text-[11px] text-zinc-500">{name}</div>
    </div>
  );
}

function HeroMatch({ match, favMatches, onToggleFavorite, timeZone, setTimeZone }) {
  const [now, setNow] = useState(Date.now());
  const home = getTeam(match.home);
  const away = getTeam(match.away);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, new Date(match.kickoffUTC).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return (
    <section className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_15%_10%,rgba(251,191,36,.22),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(34,211,238,.18),transparent_30%),linear-gradient(135deg,rgba(15,23,42,.98),rgba(2,6,23,.94))] p-5 shadow-2xl shadow-cyan-950/20">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,.18),transparent)]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-200">
              <Zap size={14} /> OPENING MATCH · 开幕战
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-6xl">世界杯赛事终端</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">赛程、球队关注、小组出线形势与晋级路径，一屏掌握。</p>
          </div>
          <TimeZoneSelector timeZone={timeZone} setTimeZone={setTimeZone} />
        </div>

        <div className="mt-8 grid flex-1 gap-5 xl:grid-cols-[1fr_280px]">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5 backdrop-blur">
            <div className="mb-5 flex items-center justify-between text-xs text-zinc-400">
              <span>M{match.no} · Group {match.group} · {match.round}</span>
              <span>{formatInZone(match.kickoffUTC, timeZone, { weekday: true, time: true })} · {getZoneLabel(timeZone)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-6xl md:text-7xl">{home.flag}</div>
                <div className="mt-3 text-3xl font-black text-white">{home.cn}</div>
                <div className="mt-1 text-sm text-zinc-500">{match.home}</div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">versus</div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-lg font-black text-white shadow-glow">VS</div>
              </div>
              <div className="min-w-0 flex-1 text-right">
                <div className="text-6xl md:text-7xl">{away.flag}</div>
                <div className="mt-3 text-3xl font-black text-white">{away.cn}</div>
                <div className="mt-1 text-sm text-zinc-500">{match.away}</div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <MapPin size={15} className="text-cyan-300" /> {match.city} · {match.stadium}
              </span>
              <span className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-amber-200">{match.keyPoint}</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Countdown</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[[days, 'DAYS'], [hours, 'HOURS'], [mins, 'MIN'], [secs, 'SEC']].map(([v, unit]) => (
                <div key={unit} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-center">
                  <div className="text-3xl font-black text-white">{String(v).padStart(2, '0')}</div>
                  <div className="mt-1 text-[10px] font-bold text-zinc-500">{unit}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Gauge value={match.heat} label="赛事热度" tone="gold" />
              <Gauge value={match.importance} label="关注等级" />
            </div>
            <button
              onClick={() => onToggleFavorite(match.id)}
              className={cls(
                'mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition',
                favMatches.includes(match.id) ? 'bg-amber-300 text-slate-950' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
              )}
            >
              <Star size={17} fill={favMatches.includes(match.id) ? 'currentColor' : 'none'} />
              {favMatches.includes(match.id) ? '已收藏' : '收藏这场比赛'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewPanel({ matches, timeZone, favTeams, favMatches }) {
  const focusMatches = matches.filter((m) => m.importance >= 90);
  const highHeat = matches.filter((m) => m.heat >= 90);
  const nextThree = matches.slice(0, 3);
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-white">今日概览</div>
          <div className="text-xs text-zinc-500">按 {getZoneLabel(timeZone)} 显示</div>
        </div>
        <Bell size={18} className="text-amber-300" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          ['比赛样本', matches.length, 'text-cyan-200'],
          ['焦点比赛', focusMatches.length, 'text-amber-200'],
          ['高热比赛', highHeat.length, 'text-rose-200'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <div className={cls('text-2xl font-black', color)}>{value}</div>
            <div className="mt-1 text-[10px] text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-300/10 bg-cyan-300/5 p-4">
        <div className="mb-3 text-sm font-black text-white">下一批比赛</div>
        <div className="space-y-3">
          {nextThree.map((m, idx) => (
            <div key={m.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-cyan-200">{formatTimeOnly(m.kickoffUTC, timeZone)} · Group {m.group}</div>
                <div className="mt-1 truncate text-sm font-bold text-white">
                  {getTeam(m.home).cn} vs {getTeam(m.away).cn}
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-amber-200">#{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <Heart size={17} className="text-rose-300" />
          <div className="mt-3 text-2xl font-black text-white">{favTeams.length}</div>
          <div className="text-xs text-zinc-500">关注球队</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <Star size={17} className="text-amber-300" />
          <div className="mt-3 text-2xl font-black text-white">{favMatches.length}</div>
          <div className="text-xs text-zinc-500">收藏比赛</div>
        </div>
      </div>
    </aside>
  );
}

function MetricCards({ matches, favTeams, favMatches }) {
  const finalDate = new Date('2026-07-19T19:00:00Z').getTime();
  const daysToFinal = Math.max(0, Math.ceil((finalDate - Date.now()) / 86400000));
  const stats = [
    { label: '比赛样本', hint: 'MATCHES', value: matches.length, icon: CalendarDays, color: 'text-cyan-300' },
    { label: '关注球队', hint: 'TEAMS', value: favTeams.length, icon: Users, color: 'text-emerald-300' },
    { label: '收藏比赛', hint: 'SAVED', value: favMatches.length, icon: Star, color: 'text-amber-300' },
    { label: '距离决赛', hint: 'DAYS', value: daysToFinal, icon: Trophy, color: 'text-violet-300' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between">
            <s.icon size={20} className={s.color} />
            <span className="text-[10px] font-black tracking-[0.18em] text-zinc-600">{s.hint}</span>
          </div>
          <div className="mt-4 text-3xl font-black text-white">{s.value}</div>
          <div className="mt-1 text-xs text-zinc-400">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, onOpen, favMatches, onToggleFavorite, timeZone, compact = false }) {
  const status = getMatchStatus(match.kickoffUTC);
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  return (
    <article className={cls('group rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/30', compact ? '' : 'min-w-[330px]')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>M{match.no}</span>
            <span>·</span>
            <span>Group {match.group}</span>
            <span>·</span>
            <span>{formatTimeOnly(match.kickoffUTC, timeZone)}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusPill status={status} />
            {match.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[11px] text-amber-200">{tag}</span>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(match.id);
          }}
          className={cls('rounded-xl p-2', favMatches.includes(match.id) ? 'bg-amber-300/20 text-amber-200' : 'bg-white/5 text-zinc-500')}
          aria-label="收藏比赛"
        >
          <Star size={17} fill={favMatches.includes(match.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      <button onClick={() => onOpen(match)} className="mt-5 w-full text-left">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-3xl">{home.flag}</div>
            <TeamName name={match.home} small />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-black text-zinc-300">VS</div>
          <div className="min-w-0 text-right">
            <div className="text-3xl">{away.flag}</div>
            <TeamName name={match.away} small />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <MapPin size={14} />
          <span className="truncate">{match.city} · {match.stadium}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Gauge value={match.heat} label="热度" tone="gold" />
          <Gauge value={match.importance} label="关注等级" />
        </div>
      </button>
    </article>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
          <Icon size={15} /> {title}
        </div>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function MatchPulse({ matches, onOpen, favMatches, onToggleFavorite, timeZone }) {
  return (
    <section>
      <SectionHeader
        icon={Activity}
        title="Match Pulse / 今日赛程动态"
        subtitle="比赛按时间滚动展示，焦点战、开幕战和关键出线战会自动高亮。"
        action={<button className="hidden items-center gap-1 text-xs font-bold text-cyan-200 md:flex">查看全部 <ChevronRight size={14} /></button>}
      />
      <div className="flex gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} onOpen={onOpen} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ name, favTeams, onToggleTeam }) {
  const team = getTeam(name);
  const isFav = favTeams.includes(name);
  const tone = team.qualify >= 75 ? 'gold' : team.qualify < 40 ? 'red' : 'cyan';
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="text-4xl">{team.flag}</div>
          <div className="min-w-0">
            <div className="truncate text-base font-black text-white">{team.cn}</div>
            <div className="mt-1 text-xs text-zinc-500">{name} · Group {team.group}</div>
          </div>
        </div>
        <button
          onClick={() => onToggleTeam(name)}
          className={cls('rounded-xl p-2 transition', isFav ? 'bg-rose-400/15 text-rose-200' : 'bg-white/5 text-zinc-500 hover:text-white')}
          aria-label="关注球队"
        >
          <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="mt-4">
        <Sparkline tone={team.heat >= 90 ? 'gold' : team.qualify < 40 ? 'rose' : 'cyan'} />
      </div>
      <div className="mt-4 grid gap-3">
        <Gauge value={team.qualify} label="出线可能性" tone={tone} />
        <Gauge value={team.heat} label="赛事热度" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs">
        <span className="text-zinc-500">近期状态</span>
        <span className="font-bold text-cyan-200">{team.form}</span>
      </div>
    </div>
  );
}

function TeamWatchlist({ teams, favTeams, onToggleTeam }) {
  const display = favTeams.length ? favTeams : teams.slice(0, 6);
  return (
    <section>
      <SectionHeader icon={Users} title="Team Watchlist / 我的关注球队" subtitle="球队像关注列表一样管理：赛事热度、出线形势、近期状态一屏显示。" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {display.map((name) => (
          <TeamCard key={name} name={name} favTeams={favTeams} onToggleTeam={onToggleTeam} />
        ))}
      </div>
    </section>
  );
}

function GroupHeatmap() {
  return (
    <section>
      <SectionHeader icon={BarChart3} title="Group Heatmap / 小组热力图" subtitle="用竞争激烈程度、出线压力和焦点标签表达小组赛形势。" />
      <div className="grid gap-3 md:grid-cols-3 2xl:grid-cols-4">
        {GROUPS.map((g) => {
          const high = g.level >= 80;
          return (
            <div key={g.id} className={cls('rounded-3xl border p-4', high ? 'border-rose-400/25 bg-rose-400/10' : 'border-white/10 bg-white/[0.04]')}>
              <div className="flex items-center justify-between">
                <div className="text-xl font-black text-white">Group {g.id}</div>
                <span className={cls('rounded-full px-2 py-1 text-[11px] font-bold', high ? 'bg-rose-400/20 text-rose-200' : 'bg-emerald-400/10 text-emerald-200')}>{g.pressure}</span>
              </div>
              <div className="mt-2 text-xs text-zinc-400">{g.tag}</div>
              <div className="mt-4 space-y-2">
                {g.teams.map((t) => (
                  <div key={t} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
                    <span className="truncate text-zinc-200">{getTeam(t).flag} {getTeam(t).cn}</span>
                    <span className="text-xs text-zinc-500">{getTeam(t).qualify}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Gauge value={g.level} label="竞争激烈程度" tone={high ? 'red' : 'cyan'} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Dashboard({ matches, nextMatch, favMatches, favTeams, onToggleFavorite, onToggleTeam, onOpen, timeZone, setTimeZone }) {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <HeroMatch match={nextMatch} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} setTimeZone={setTimeZone} />
        <OverviewPanel matches={matches} timeZone={timeZone} favTeams={favTeams} favMatches={favMatches} />
      </div>
      <MetricCards matches={matches} favTeams={favTeams} favMatches={favMatches} />
      <MatchPulse matches={matches.slice(0, 10)} onOpen={onOpen} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} />
      <TeamWatchlist teams={['Argentina', 'France', 'Brazil', 'Portugal', 'Spain', 'England', 'United States', 'Mexico', 'Japan']} favTeams={favTeams} onToggleTeam={onToggleTeam} />
      <GroupHeatmap />
    </div>
  );
}

function SchedulePage({ matches, onOpen, favMatches, onToggleFavorite, timeZone }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const filtered = matches.filter((m) => {
    const q = query.trim().toLowerCase();
    const hitQ = !q || [m.home, m.away, getTeam(m.home).cn, getTeam(m.away).cn, m.city, m.stadium, ...m.tags].join(' ').toLowerCase().includes(q);
    return hitQ && (group === 'All' || m.group === group);
  });
  const byDate = filtered.reduce((acc, m) => {
    const key = formatInZone(m.kickoffUTC, timeZone, { weekday: true });
    acc[key] = acc[key] || [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionHeader icon={CalendarDays} title="Schedule Pulse / 赛程动态" subtitle={`当前使用 ${getZoneLabel(timeZone)} 显示比赛时间。`} />
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <Search size={18} className="text-zinc-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索球队 / 城市 / 标签" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" />
        </label>
        <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
          <option>All</option>
          {GROUPS.map((g) => (
            <option key={g.id}>{g.id}</option>
          ))}
        </select>
      </div>
      <div className="space-y-6">
        {Object.entries(byDate).map(([date, list]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-300">
              <Clock3 size={16} className="text-amber-300" /> {date}
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              {list.map((m) => (
                <MatchCard key={m.id} match={m} onOpen={onOpen} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} compact />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsPage({ teams, favTeams, onToggleTeam }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('heat');
  const filtered = teams
    .filter((name) => `${name} ${getTeam(name).cn}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const ta = getTeam(a);
      const tb = getTeam(b);
      if (sort === 'qualify') return tb.qualify - ta.qualify;
      if (sort === 'rank') return ta.rank - tb.rank;
      return tb.heat - ta.heat;
    });
  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title="Team Tracker / 球队关注榜" subtitle="把 48 支球队做成可搜索、可关注、可排序的球队追踪列表。" />
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <Search size={18} className="text-zinc-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索球队" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none">
          <option value="heat">按热度排序</option>
          <option value="qualify">按出线可能性排序</option>
          <option value="rank">按排名排序</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((name) => (
          <TeamCard key={name} name={name} favTeams={favTeams} onToggleTeam={onToggleTeam} />
        ))}
      </div>
    </div>
  );
}

function GroupBoard() {
  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart3} title="Group Board / 小组积分榜" subtitle="小组前二直接晋级，第三名进入横向比较池。" />
      <div className="grid gap-4 xl:grid-cols-2">
        {GROUPS.map((g) => {
          const ranked = [...g.teams].sort((a, b) => getTeam(b).qualify - getTeam(a).qualify);
          return (
            <div key={g.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-white">Group {g.id}</div>
                  <div className="text-xs text-zinc-500">{g.tag} · {g.pressure}</div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300">强度 {g.level}</div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">球队</th>
                      <th className="px-3 py-2 text-right">出线可能性</th>
                      <th className="px-3 py-2 text-right">区域</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((t, idx) => (
                      <tr key={t} className="border-t border-white/10">
                        <td className="px-3 py-3 text-zinc-500">{idx + 1}</td>
                        <td className="px-3 py-3 font-semibold text-zinc-100">{getTeam(t).flag} {getTeam(t).cn}</td>
                        <td className="px-3 py-3 text-right text-zinc-300">{getTeam(t).qualify}%</td>
                        <td className="px-3 py-3 text-right">
                          <span className={cls('rounded-full px-2 py-1 text-[11px] font-bold', idx < 2 ? 'bg-emerald-400/15 text-emerald-200' : idx === 2 ? 'bg-amber-400/15 text-amber-200' : 'bg-rose-400/15 text-rose-200')}>
                            {idx < 2 ? '直接晋级区' : idx === 2 ? '第三名观察' : '压力区'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      <BestThirdRanking />
    </div>
  );
}

function BestThirdRanking() {
  const thirds = GROUPS.map((g) => [...g.teams].sort((a, b) => getTeam(b).qualify - getTeam(a).qualify)[2]);
  return (
    <div className="rounded-3xl border border-amber-300/20 bg-amber-300/5 p-4">
      <SectionHeader icon={ShieldAlert} title="Best Third Ranking / 最佳第三名排名" subtitle="用示例出线可能性模拟第三名横向比较。" />
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {thirds.sort((a, b) => getTeam(b).qualify - getTeam(a).qualify).map((t, idx) => (
          <div key={t} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="text-2xl">{getTeam(t).flag}</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">{getTeam(t).cn}</div>
                <div className="text-xs text-zinc-500">Group {getTeam(t).group}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-amber-200">#{idx + 1}</div>
              <div className="text-xs text-zinc-500">{getTeam(t).qualify}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnockoutPath() {
  return (
    <div className="space-y-6">
      <SectionHeader icon={GitBranch} title="Knockout Path / 晋级路径图" subtitle="用横向路径图展示晋级路线、阶段节点和决赛方向。" />
      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,.12),transparent_30%),rgba(255,255,255,.04)] p-5">
        <div className="flex min-w-[920px] items-stretch gap-4">
          {KNOCKOUT.map((col, colIdx) => (
            <div key={col.stage} className="flex w-48 shrink-0 flex-col gap-4">
              <div className="text-center text-xs font-black uppercase tracking-[0.22em] text-amber-300">{col.stage}</div>
              <div className="flex flex-1 flex-col justify-around gap-4">
                {col.nodes.map((n, idx) => (
                  <div key={n} className={cls('relative rounded-3xl border p-4 text-center', col.stage === '决赛' ? 'border-amber-300/40 bg-amber-300/15 shadow-xl shadow-amber-950/30' : 'border-white/10 bg-black/25')}>
                    {colIdx < KNOCKOUT.length - 1 && <div className="absolute -right-5 top-1/2 h-px w-5 bg-gradient-to-r from-cyan-300/70 to-transparent" />}
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-lg">{col.stage === '决赛' ? '🏆' : '⚽'}</div>
                    <div className="text-sm font-black text-white">{n}</div>
                    <div className="mt-1 text-[11px] text-zinc-500">路径节点 {idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WatchlistPage({ favTeams, favMatches, matches, onToggleTeam, onToggleFavorite, onOpen, timeZone }) {
  const favoriteMatches = matches.filter((m) => favMatches.includes(m.id));
  return (
    <div className="space-y-8">
      <section>
        <SectionHeader icon={Heart} title="My Watchlist / 我的赛事关注" subtitle="本地 localStorage 保存，不需要登录。" />
        {favTeams.length === 0 && favMatches.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-zinc-400">还没有关注内容。去 Teams 或 Schedule 添加球队和比赛。</div>
        ) : null}
        {favTeams.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {favTeams.map((name) => (
              <TeamCard key={name} name={name} favTeams={favTeams} onToggleTeam={onToggleTeam} />
            ))}
          </div>
        )}
      </section>
      {favoriteMatches.length > 0 && (
        <section>
          <SectionHeader icon={Star} title="Favorite Matches / 收藏比赛" />
          <div className="grid gap-3 xl:grid-cols-2">
            {favoriteMatches.map((m) => (
              <MatchCard key={m.id} match={m} onOpen={onOpen} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <Icon size={18} className="text-cyan-300" />
      <div className="mt-3 text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function MatchDetailModal({ match, onClose, favMatches, onToggleFavorite, timeZone }) {
  if (!match) return null;
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const status = getMatchStatus(match.kickoffUTC);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusPill status={status} />
              {match.tags.map((t) => (
                <span key={t} className="rounded-full bg-amber-300/10 px-2 py-1 text-[11px] text-amber-200">{t}</span>
              ))}
            </div>
            <h2 className="text-2xl font-black text-white">Match Preview / 比赛看点</h2>
            <p className="mt-1 text-sm text-zinc-400">
              M{match.no} · Group {match.group} · {formatInZone(match.kickoffUTC, timeZone, { weekday: true, time: true })}
            </p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-zinc-300">关闭</button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-5xl">{home.flag}</div>
              <TeamName name={match.home} />
            </div>
            <div className="text-center">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-lg font-black text-white">VS</div>
              <div className="mt-2 text-xs text-zinc-500">{getZoneLabel(timeZone)}</div>
            </div>
            <div className="min-w-0 flex-1 text-right">
              <div className="text-5xl">{away.flag}</div>
              <TeamName name={match.away} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <InfoCard icon={MapPin} label="球场" value={`${match.city} · ${match.stadium}`} />
          <InfoCard icon={Flame} label="赛事热度" value={`${match.heat}/100`} />
          <InfoCard icon={ShieldAlert} label="比赛看点" value={match.keyPoint} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-sm font-black text-white">赛前看点</div>
            <ul className="space-y-2 text-sm leading-6 text-zinc-300">
              <li>• {home.cn} 当前赛事热度 {home.heat}，近期状态：{home.form}。</li>
              <li>• {away.cn} 出线可能性 {away.qualify}%，本场关键在于开局节奏和定位球质量。</li>
              <li>• 这场比赛会影响 Group {match.group} 的出线形势和第三名比较区间。</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-sm font-black text-white">比赛指标</div>
            <div className="space-y-3">
              <Gauge value={match.importance} label="关注等级" tone="gold" />
              <Gauge value={Math.round((home.qualify + away.qualify) / 2)} label="出线影响" />
              <Gauge value={match.heat} label="赛事热度" />
            </div>
            <button onClick={() => onToggleFavorite(match.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-slate-950">
              <Star size={17} fill="currentColor" /> {favMatches.includes(match.id) ? '取消收藏' : '收藏这场比赛'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ tab, setTab }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:flex">
      <button onClick={() => setTab('dashboard')} className="flex items-center gap-3 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-3 text-left">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-cyan-300 text-2xl">⚽</div>
        <div>
          <div className="text-sm font-black text-white">World Cup</div>
          <div className="text-[11px] text-amber-200">赛事终端</div>
        </div>
      </button>

      <div className="mt-6 space-y-2">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cls(
              'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition',
              tab === item.id ? 'bg-cyan-300 text-slate-950' : 'text-zinc-400 hover:bg-white/10 hover:text-white',
            )}
          >
            <item.icon size={18} />
            <span>{item.cn}</span>
            <span className="ml-auto text-[10px] opacity-60">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-4">
        <div className="text-3xl font-black text-cyan-200">2026</div>
        <div className="mt-1 text-xs font-black text-white">FIFA WORLD CUP</div>
        <div className="mt-1 text-[11px] text-zinc-400">USA · CANADA · MEXICO</div>
      </div>
    </aside>
  );
}

function TopHeader({ tab, setTab, theme, setTheme, timeZone, setTimeZone }) {
  const isLight = theme === 'light';
  return (
    <header className="sticky top-3 z-40 mb-5 rounded-[1.6rem] border border-white/10 bg-slate-950/75 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => setTab('dashboard')} className="flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-cyan-300 text-xl">⚽</div>
          <div className="text-left">
            <div className="text-sm font-black text-white">World Cup Match Terminal</div>
            <div className="text-[11px] text-zinc-500">世界杯赛事终端</div>
          </div>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={cls('rounded-2xl px-3 py-2 text-sm font-semibold transition', tab === n.id ? 'bg-white text-slate-950' : 'text-zinc-400 hover:bg-white/10 hover:text-white')}>
              {n.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <label className="hidden min-w-[220px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
            <Search size={16} className="text-zinc-500" />
            <input placeholder="搜索球队 / 比赛 / 城市" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600" />
          </label>
          <div className="hidden xl:block">
            <TimeZoneSelector timeZone={timeZone} setTimeZone={setTimeZone} compact />
          </div>
          <button onClick={() => setTheme(isLight ? 'dark' : 'light')} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-zinc-300">
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
      <div className="mt-3 xl:hidden">
        <TimeZoneSelector timeZone={timeZone} setTimeZone={setTimeZone} compact />
      </div>
    </header>
  );
}

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [timeZone, setTimeZone] = useState('Asia/Shanghai');
  const [favTeams, setFavTeams] = useState([]);
  const [favMatches, setFavMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const allTeams = useMemo(() => GROUPS.flatMap((g) => g.teams), []);
  const matches = useMemo(() => [...MATCHES].sort((a, b) => new Date(a.kickoffUTC) - new Date(b.kickoffUTC)), []);
  const nextMatch = useMemo(() => matches.find((m) => getMatchStatus(m.kickoffUTC) !== 'ended') || matches[0], [matches]);

  useEffect(() => {
    try {
      setFavTeams(JSON.parse(localStorage.getItem('wc:favTeams') || '[]'));
      setFavMatches(JSON.parse(localStorage.getItem('wc:favMatches') || '[]'));
      setTimeZone(localStorage.getItem('wc:timeZone') || 'Asia/Shanghai');
    } catch {
      setFavTeams([]);
      setFavMatches([]);
      setTimeZone('Asia/Shanghai');
    }
  }, []);

  useEffect(() => localStorage.setItem('wc:favTeams', JSON.stringify(favTeams)), [favTeams]);
  useEffect(() => localStorage.setItem('wc:favMatches', JSON.stringify(favMatches)), [favMatches]);
  useEffect(() => localStorage.setItem('wc:timeZone', timeZone), [timeZone]);

  const onToggleTeam = (name) => setFavTeams((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  const onToggleFavorite = (id) => setFavMatches((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const isLight = theme === 'light';

  return (
    <div className={cls('min-h-screen font-sans', isLight ? 'bg-zinc-100 text-slate-950' : 'bg-[#030712] text-white')}>
      <div className={cls('fixed inset-0 pointer-events-none', !isLight && 'bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(245,158,11,.12),transparent_28%)]')} />
      <Sidebar tab={tab} setTab={setTab} />

      <div className="relative mx-auto max-w-[1720px] px-3 pb-28 pt-4 md:px-6 md:pb-8 lg:ml-64">
        <TopHeader tab={tab} setTab={setTab} theme={theme} setTheme={setTheme} timeZone={timeZone} setTimeZone={setTimeZone} />

        <main className="space-y-8">
          {tab === 'dashboard' && (
            <Dashboard
              matches={matches}
              nextMatch={nextMatch}
              favMatches={favMatches}
              favTeams={favTeams}
              onToggleFavorite={onToggleFavorite}
              onToggleTeam={onToggleTeam}
              onOpen={setSelectedMatch}
              timeZone={timeZone}
              setTimeZone={setTimeZone}
            />
          )}
          {tab === 'schedule' && <SchedulePage matches={matches} onOpen={setSelectedMatch} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} />}
          {tab === 'teams' && <TeamsPage teams={allTeams} favTeams={favTeams} onToggleTeam={onToggleTeam} />}
          {tab === 'groups' && <GroupBoard />}
          {tab === 'knockout' && <KnockoutPath />}
          {tab === 'watchlist' && <WatchlistPage favTeams={favTeams} favMatches={favMatches} matches={matches} onToggleTeam={onToggleTeam} onToggleFavorite={onToggleFavorite} onOpen={setSelectedMatch} timeZone={timeZone} />}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex max-w-[720px] justify-center px-3 lg:hidden">
        <div className="grid w-full grid-cols-6 gap-1 rounded-[1.4rem] border border-white/10 bg-slate-950/90 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={cls('flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition', tab === n.id ? 'bg-amber-300 text-slate-950' : 'text-zinc-500')}>
              <n.icon size={17} />
              <span className="hidden sm:inline">{n.cn}</span>
            </button>
          ))}
        </div>
      </nav>

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} favMatches={favMatches} onToggleFavorite={onToggleFavorite} timeZone={timeZone} />
    </div>
  );
}
