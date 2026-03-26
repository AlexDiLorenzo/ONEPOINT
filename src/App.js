import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, PieChart, Pie
} from 'recharts';

/* ═══════════════════════════════════════════════════════════════════
   DONNÉES FICTIVES — Café Altaïr · 180 PdV · 6 pays · CA ~310 M€
   ═══════════════════════════════════════════════════════════════════ */

const COUNTRIES = {
  FR: { name: 'France', flag: '🇫🇷', stores: 62, avgRevPerStore: 1.85 },
  ES: { name: 'Espagne', flag: '🇪🇸', stores: 34, avgRevPerStore: 1.55 },
  BE: { name: 'Belgique', flag: '🇧🇪', stores: 18, avgRevPerStore: 1.65 },
  UK: { name: 'Royaume-Uni', flag: '🇬🇧', stores: 28, avgRevPerStore: 1.95 },
  IT: { name: 'Italie', flag: '🇮🇹', stores: 22, avgRevPerStore: 1.50 },
  DE: { name: 'Allemagne', flag: '🇩🇪', stores: 16, avgRevPerStore: 1.90 },
};

const CITIES = {
  FR: ['Paris 1er','Paris 11e','Paris 6e','Lyon Part-Dieu','Lyon Confluence',
       'Marseille Vieux-Port','Marseille Prado','Bordeaux Chartrons','Bordeaux Victoire',
       'Toulouse Capitole','Toulouse St-Cyprien','Nantes Graslin','Lille Grand-Place',
       'Lille Vauban','Strasbourg Petite France','Montpellier Comédie','Rennes République',
       'Nice Masséna','Grenoble Alsace-Lorraine','Aix-en-Provence Rotonde',
       'Paris 3e','Paris 15e','Paris Bastille','Paris Opéra','Paris Nation',
       'Lyon Bellecour','Marseille Joliette','Bordeaux Mériadeck','Toulouse Jean-Jaurès',
       'Nantes Commerce','Lille Euralille','Strasbourg Kléber','Nice Libération',
       'Rouen Cathédrale','Tours Jean-Jaurès','Dijon Darcy','Clermont-Ferrand Jaude',
       'Angers Ralliement','Le Havre Centre','Reims Centre','Paris La Défense',
       'Paris Montmartre','Paris Batignolles','Paris Oberkampf','Paris Marais',
       'Lyon Presqu\'île','Lyon Brotteaux','Marseille Castellane','Bordeaux St-Pierre',
       'Toulouse Compans','Nantes Bouffay','Lille Wazemmes','Nice Port','Rennes Lices',
       'Montpellier Antigone','Grenoble Championnet','Strasbourg Gare','Aix Cours Mirabeau',
       'Cannes Croisette','Avignon Centre','Perpignan Centre','Brest Centre'],
  ES: ['Madrid Sol','Madrid Salamanca','Madrid Malasaña','Barcelona Gràcia',
       'Barcelona Born','Barcelona Eixample','Valencia Carmen','Valencia Ruzafa',
       'Sevilla Centro','Sevilla Triana','Bilbao Casco Viejo','Bilbao Ensanche',
       'Málaga Centro','San Sebastián Centro','Zaragoza Centro','Palma de Mallorca Centro',
       'Granada Centro','Córdoba Centro','Alicante Centro','Valladolid Centro',
       'Madrid Chamberí','Madrid Retiro','Barcelona Poblenou','Barcelona Sarrià',
       'Valencia Ensanche','Sevilla Nervión','Bilbao Indautxu','Málaga Soho',
       'Madrid Lavapiés','Madrid Chueca','Barcelona Raval','Murcia Centro',
       'A Coruña Centro','Gijón Centro'],
  BE: ['Bruxelles Grand-Place','Bruxelles Ixelles','Bruxelles Sablon',
       'Anvers Centre','Anvers Zuid','Gand Centre','Gand Sint-Pieters',
       'Liège Carré','Liège Guillemins','Namur Centre','Bruges Centre',
       'Louvain Centre','Bruxelles Flagey','Bruxelles Uccle','Anvers Eilandje',
       'Gand Korenmarkt','Charleroi Centre','Mons Centre'],
  UK: ['London Soho','London Shoreditch','London Covent Garden','London Camden',
       'London Notting Hill','London South Bank','London Canary Wharf',
       'Manchester Northern Quarter','Manchester Deansgate','Birmingham Centre',
       'Edinburgh Royal Mile','Edinburgh New Town','Glasgow West End','Glasgow Centre',
       'Bristol Harbourside','Bristol Clifton','Leeds Centre','Liverpool Bold Street',
       'Cambridge Centre','Oxford Centre','Brighton Lanes','Bath Centre',
       'London Islington','London Hackney','London King\'s Cross','Manchester Ancoats',
       'Birmingham Jewellery Quarter','Newcastle Centre'],
  IT: ['Milano Duomo','Milano Brera','Milano Navigli','Roma Trastevere',
       'Roma Centro','Roma Monti','Firenze Centro','Firenze Oltrarno',
       'Torino Centro','Torino San Salvario','Bologna Centro','Bologna Universitaria',
       'Napoli Centro','Napoli Chiaia','Venezia Dorsoduro','Padova Centro',
       'Genova Centro','Verona Centro','Palermo Centro','Catania Centro',
       'Milano Porta Venezia','Roma Prati'],
  DE: ['Berlin Mitte','Berlin Kreuzberg','Berlin Prenzlauer Berg',
       'München Schwabing','München Glockenbachviertel','Hamburg Altona',
       'Hamburg Schanze','Köln Ehrenfeld','Köln Südstadt','Frankfurt Nordend',
       'Frankfurt Sachsenhausen','Düsseldorf Altstadt','Stuttgart Centre',
       'Leipzig Centre','Dresde Neustadt','Heidelberg Altstadt'],
};

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateStores() {
  const rng = seededRandom(42);
  const stores = [];
  let id = 1;

  Object.entries(COUNTRIES).forEach(([code, info]) => {
    const cities = CITIES[code];
    for (let i = 0; i < info.stores; i++) {
      const city = cities[i % cities.length];
      const isFranchise = rng() > 0.55;
      const baseRev = info.avgRevPerStore * (0.7 + rng() * 0.6);
      const margin = isFranchise ? 0.08 + rng() * 0.10 : 0.12 + rng() * 0.14;
      const rating = 3.6 + rng() * 1.35;
      const reviews = Math.floor(150 + rng() * 1800);
      const monthlyRev = baseRev / 12;
      const prevMonthRev = monthlyRev * (0.85 + rng() * 0.3);
      const basket = 5.5 + rng() * 4.5;

      stores.push({
        id: id++,
        name: `Café Altaïr — ${city}`,
        city,
        country: code,
        countryName: info.name,
        flag: info.flag,
        status: isFranchise ? 'Franchise' : 'Succursale',
        annualRev: baseRev,
        monthlyRev,
        prevMonthRev,
        margin: Math.round(margin * 1000) / 10,
        rating: Math.round(rating * 10) / 10,
        reviews,
        basket: Math.round(basket * 100) / 100,
        digitalPct: Math.round((8 + rng() * 22) * 10) / 10,
      });
    }
  });
  return stores;
}

const ALL_STORES = generateStores();

function generateMonthlyData() {
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  const rng = seededRandom(99);
  const seasonality = [0.85,0.88,0.95,1.0,1.05,1.10,1.12,0.92,1.02,1.05,1.0,1.15];

  return months.map((m, i) => {
    const base = 310 / 12;
    const row = { month: m, objectif: base * 1.05 };
    row['Global'] = Math.round((base * seasonality[i] * (0.96 + rng() * 0.08)) * 100) / 100;
    Object.entries(COUNTRIES).forEach(([code, info]) => {
      const countryBase = info.stores * info.avgRevPerStore / 12;
      row[info.name] = Math.round((countryBase * seasonality[i] * (0.90 + rng() * 0.20)) * 100) / 100;
    });
    return row;
  });
}

const MONTHLY_DATA = generateMonthlyData();
const COUNTRY_COLORS = {
  France: '#2563eb', Espagne: '#dc2626', Belgique: '#eab308',
  'Royaume-Uni': '#7c3aed', Italie: '#16a34a', Allemagne: '#f97316'
};

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS UTILITAIRES
   ═══════════════════════════════════════════════════════════════ */

function KPI({ label, value, trend, unit = '' }) {
  const isPositive = trend >= 0;
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}{unit && <span style={styles.kpiUnit}>{unit}</span>}</div>
      <div style={{ ...styles.kpiTrend, color: isPositive ? '#16a34a' : '#dc2626' }}>
        {isPositive ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs N-1
      </div>
    </div>
  );
}

function Badge({ type, children }) {
  const colors = {
    green: { bg: '#dcfce7', fg: '#166534' },
    orange: { bg: '#fef3c7', fg: '#92400e' },
    red: { bg: '#fee2e2', fg: '#991b1b' },
    blue: { bg: '#dbeafe', fg: '#1e40af' },
    gray: { bg: '#f3f4f6', fg: '#374151' },
  };
  const c = colors[type] || colors.gray;
  return (
    <span style={{ ...styles.badge, backgroundColor: c.bg, color: c.fg }}>{children}</span>
  );
}

function SectionTitle({ children }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
}

function performanceLevel(store) {
  if (store.rating >= 4.5 && store.margin >= 15) return 'green';
  if (store.rating < 4.2 || store.margin < 10) return 'red';
  return 'orange';
}

/* ═══════════════════════════════════════════════════════════════
   APPLICATION PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

export default function App() {
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('annualRev');
  const [sortDir, setSortDir] = useState('desc');
  const [chartView, setChartView] = useState('Global');
  const [activeTab, setActiveTab] = useState(0);

  /* ---------- KPIs globaux ---------- */
  const totalRev = useMemo(() => ALL_STORES.reduce((s, st) => s + st.annualRev, 0), []);
  const avgBasket = useMemo(() => ALL_STORES.reduce((s, st) => s + st.basket, 0) / ALL_STORES.length, []);
  const avgRating = useMemo(() => ALL_STORES.reduce((s, st) => s + st.rating, 0) / ALL_STORES.length, []);
  const avgDigital = useMemo(() => ALL_STORES.reduce((s, st) => s + st.digitalPct, 0) / ALL_STORES.length, []);

  /* ---------- Données par pays ---------- */
  const countryData = useMemo(() => {
    return Object.entries(COUNTRIES).map(([code, info]) => {
      const stores = ALL_STORES.filter(s => s.country === code);
      const rev = stores.reduce((s, st) => s + st.annualRev, 0);
      const avgMargin = stores.reduce((s, st) => s + st.margin, 0) / stores.length;
      const avgR = stores.reduce((s, st) => s + st.rating, 0) / stores.length;
      const franchises = stores.filter(s => s.status === 'Franchise').length;
      return {
        code, name: info.name, flag: info.flag,
        stores: info.stores, rev,
        revPerStore: rev / info.stores,
        margin: Math.round(avgMargin * 10) / 10,
        rating: Math.round(avgR * 10) / 10,
        franchiseRatio: `${franchises}/${info.stores - franchises}`,
      };
    });
  }, []);

  /* ---------- Liste filtrée & triée ---------- */
  const filteredStores = useMemo(() => {
    let list = [...ALL_STORES];
    if (countryFilter !== 'ALL') list = list.filter(s => s.country === countryFilter);
    if (statusFilter !== 'ALL') list = list.filter(s => s.status === statusFilter);
    list.sort((a, b) => sortDir === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
    return list;
  }, [countryFilter, statusFilter, sortField, sortDir]);

  /* ---------- Alertes ---------- */
  const alerts = useMemo(() => {
    const lowRating = ALL_STORES.filter(s => s.rating < 4.2);
    const revDrop = ALL_STORES.filter(s => ((s.monthlyRev - s.prevMonthRev) / s.prevMonthRev) < -0.10);
    const lowMargin = ALL_STORES.filter(s => s.margin < 10);
    return { lowRating, revDrop, lowMargin };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return <span>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  const tabs = [
    'Vue d\'ensemble',
    'Comparaison pays',
    'Classement PdV',
    'Évolution CA',
    'Alertes'
  ];

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.logo}>☕</div>
            <div>
              <h1 style={styles.headerTitle}>Café Altaïr</h1>
              <p style={styles.headerSub}>Tableau de bord de pilotage — 180 points de vente · 6 pays</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.headerDate}>Mars 2026</span>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              style={activeTab === i ? { ...styles.tab, ...styles.tabActive } : styles.tab}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main style={styles.main}>

        {/* ═══════ 1. VUE D'ENSEMBLE ═══════ */}
        {activeTab === 0 && (
          <section>
            <SectionTitle>Vue d'ensemble réseau</SectionTitle>
            <div style={styles.kpiGrid}>
              <KPI label="CA Total" value={`${totalRev.toFixed(1)}`} unit=" M€" trend={4.2} />
              <KPI label="Nombre de PdV" value="180" trend={8.4} />
              <KPI label="Panier moyen" value={`${avgBasket.toFixed(2)}`} unit=" €" trend={2.1} />
              <KPI label="Note Google Maps" value={avgRating.toFixed(1)} unit=" /5" trend={0.8} />
              <KPI label="CA Digital" value={`${avgDigital.toFixed(1)}`} unit=" %" trend={18.5} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Répartition du CA par pays</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={countryData} dataKey="rev" nameKey="name" cx="50%" cy="50%"
                      outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {countryData.map((entry) => (
                        <Cell key={entry.code} fill={COUNTRY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v.toFixed(1)} M€`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Nombre de PdV par pays</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stores" name="Points de vente">
                      {countryData.map((entry) => (
                        <Cell key={entry.code} fill={COUNTRY_COLORS[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ 2. COMPARAISON PAR PAYS ═══════ */}
        {activeTab === 1 && (
          <section>
            <SectionTitle>Comparaison par pays</SectionTitle>
            <div style={styles.card}>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Pays</th>
                      <th style={styles.thR}>CA (M€)</th>
                      <th style={styles.thR}>PdV</th>
                      <th style={styles.thR}>CA / PdV (M€)</th>
                      <th style={styles.thR}>Marge op. (%)</th>
                      <th style={styles.thR}>Note Google</th>
                      <th style={styles.thR}>Franchise / Succursale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryData.map(c => (
                      <tr key={c.code} style={styles.tr}>
                        <td style={styles.td}>{c.flag} {c.name}</td>
                        <td style={styles.tdR}>{c.rev.toFixed(1)}</td>
                        <td style={styles.tdR}>{c.stores}</td>
                        <td style={styles.tdR}>{c.revPerStore.toFixed(2)}</td>
                        <td style={styles.tdR}>{c.margin}%</td>
                        <td style={styles.tdR}>{c.rating}</td>
                        <td style={styles.tdR}>{c.franchiseRatio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ ...styles.card, marginTop: 24 }}>
              <h3 style={styles.cardTitle}>CA moyen par PdV (M€)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={countryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v.toFixed(2)} M€`} />
                  <Bar dataKey="revPerStore" name="CA / PdV">
                    {countryData.map((entry) => (
                      <Cell key={entry.code} fill={COUNTRY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ═══════ 3. CLASSEMENT PdV ═══════ */}
        {activeTab === 2 && (
          <section>
            <SectionTitle>Classement des points de vente</SectionTitle>
            <div style={styles.filterBar}>
              <label style={styles.filterLabel}>
                Pays :
                <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={styles.select}>
                  <option value="ALL">Tous</option>
                  {Object.entries(COUNTRIES).map(([c, info]) => (
                    <option key={c} value={c}>{info.flag} {info.name}</option>
                  ))}
                </select>
              </label>
              <label style={styles.filterLabel}>
                Statut :
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={styles.select}>
                  <option value="ALL">Tous</option>
                  <option value="Succursale">Succursale</option>
                  <option value="Franchise">Franchise</option>
                </select>
              </label>
              <span style={styles.filterCount}>{filteredStores.length} point(s) de vente</span>
            </div>

            <div style={{ ...styles.card, maxHeight: 600, overflowY: 'auto' }}>
              <table style={styles.table}>
                <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                  <tr>
                    <th style={styles.th}>Perf.</th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                      Nom <SortIcon field="name" /></th>
                    <th style={styles.th}>Pays</th>
                    <th style={styles.th}>Statut</th>
                    <th style={{ ...styles.thR, cursor: 'pointer' }} onClick={() => handleSort('monthlyRev')}>
                      CA mensuel (k€) <SortIcon field="monthlyRev" /></th>
                    <th style={{ ...styles.thR, cursor: 'pointer' }} onClick={() => handleSort('margin')}>
                      Marge (%) <SortIcon field="margin" /></th>
                    <th style={{ ...styles.thR, cursor: 'pointer' }} onClick={() => handleSort('rating')}>
                      Note <SortIcon field="rating" /></th>
                    <th style={{ ...styles.thR, cursor: 'pointer' }} onClick={() => handleSort('reviews')}>
                      Avis <SortIcon field="reviews" /></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map(s => {
                    const perf = performanceLevel(s);
                    const perfColors = { green: '#22c55e', orange: '#f59e0b', red: '#ef4444' };
                    return (
                      <tr key={s.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={{
                            display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
                            backgroundColor: perfColors[perf]
                          }} />
                        </td>
                        <td style={{ ...styles.td, fontWeight: 500, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name}
                        </td>
                        <td style={styles.td}>{s.flag}</td>
                        <td style={styles.td}>
                          <Badge type={s.status === 'Franchise' ? 'blue' : 'gray'}>{s.status}</Badge>
                        </td>
                        <td style={styles.tdR}>{(s.monthlyRev * 1000 / 12).toFixed(0)}</td>
                        <td style={styles.tdR}>
                          <span style={{ color: s.margin < 10 ? '#dc2626' : s.margin > 18 ? '#16a34a' : '#374151' }}>
                            {s.margin}%
                          </span>
                        </td>
                        <td style={styles.tdR}>
                          <span style={{ color: s.rating < 4.2 ? '#dc2626' : s.rating >= 4.5 ? '#16a34a' : '#374151' }}>
                            {s.rating}
                          </span>
                        </td>
                        <td style={styles.tdR}>{s.reviews.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ═══════ 4. ÉVOLUTION CA ═══════ */}
        {activeTab === 3 && (
          <section>
            <SectionTitle>Évolution mensuelle du CA (M€)</SectionTitle>
            <div style={styles.filterBar}>
              <label style={styles.filterLabel}>
                Vue :
                <select value={chartView} onChange={e => setChartView(e.target.value)} style={styles.select}>
                  <option value="Global">Global</option>
                  {Object.values(COUNTRIES).map(c => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                  <option value="ALL_COUNTRIES">Tous les pays</option>
                </select>
              </label>
            </div>

            <div style={styles.card}>
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip formatter={(v) => `${typeof v === 'number' ? v.toFixed(2) : v} M€`} />
                  <Legend />
                  <ReferenceLine y={310 / 12 * 1.05} stroke="#94a3b8" strokeDasharray="8 4"
                    label={{ value: 'Objectif', position: 'insideTopRight', fill: '#64748b', fontSize: 12 }} />
                  {chartView === 'ALL_COUNTRIES' ? (
                    Object.values(COUNTRIES).map(c => (
                      <Line key={c.name} type="monotone" dataKey={c.name}
                        stroke={COUNTRY_COLORS[c.name]} strokeWidth={2} dot={{ r: 3 }} />
                    ))
                  ) : (
                    <Line type="monotone" dataKey={chartView}
                      stroke={COUNTRY_COLORS[chartView] || '#2563eb'} strokeWidth={3} dot={{ r: 4 }}
                      activeDot={{ r: 6 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ═══════ 5. ALERTES ═══════ */}
        {activeTab === 4 && (
          <section>
            <SectionTitle>Alertes et signaux faibles</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

              {/* Note Google < 4.2 */}
              <div style={{ ...styles.card, borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ ...styles.cardTitle, color: '#dc2626' }}>
                  Note Google Maps &lt; 4.2 ({alerts.lowRating.length})
                </h3>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {alerts.lowRating.map(s => (
                    <div key={s.id} style={styles.alertItem}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{s.flag} {s.city}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Note : <span style={{ color: '#dc2626', fontWeight: 600 }}>{s.rating}</span> · {s.reviews} avis
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CA en baisse > 10% */}
              <div style={{ ...styles.card, borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ ...styles.cardTitle, color: '#92400e' }}>
                  CA en baisse &gt; 10% vs M-1 ({alerts.revDrop.length})
                </h3>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {alerts.revDrop.map(s => {
                    const drop = ((s.monthlyRev - s.prevMonthRev) / s.prevMonthRev * 100);
                    return (
                      <div key={s.id} style={styles.alertItem}>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{s.flag} {s.city}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          Variation : <span style={{ color: '#dc2626', fontWeight: 600 }}>{drop.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Marge sous seuil */}
              <div style={{ ...styles.card, borderLeft: '4px solid #8b5cf6' }}>
                <h3 style={{ ...styles.cardTitle, color: '#6d28d9' }}>
                  Marge op. &lt; 10% ({alerts.lowMargin.length})
                </h3>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {alerts.lowMargin.map(s => (
                    <div key={s.id} style={styles.alertItem}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{s.flag} {s.city}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Marge : <span style={{ color: '#dc2626', fontWeight: 600 }}>{s.margin}%</span> · {s.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

      </main>

      <footer style={styles.footer}>
        Café Altaïr — Données de pilotage (simulation) · Mars 2026
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */

const styles = {
  root: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    color: '#1e293b',
  },
  header: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: '#fff',
    padding: '20px 0',
    borderBottom: '3px solid #c9a96e',
  },
  headerInner: {
    maxWidth: 1400, margin: '0 auto', padding: '0 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { fontSize: 36 },
  headerTitle: { margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' },
  headerSub: { margin: '4px 0 0', fontSize: 14, color: '#94a3b8' },
  headerRight: { textAlign: 'right' },
  headerDate: {
    background: 'rgba(255,255,255,0.1)', padding: '6px 16px',
    borderRadius: 8, fontSize: 14, fontWeight: 500,
  },
  nav: {
    background: '#fff', borderBottom: '1px solid #e2e8f0',
    position: 'sticky', top: 0, zIndex: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  navInner: {
    maxWidth: 1400, margin: '0 auto', padding: '0 24px',
    display: 'flex', gap: 0,
  },
  tab: {
    padding: '14px 20px', border: 'none', background: 'none',
    cursor: 'pointer', fontSize: 14, fontWeight: 500,
    color: '#64748b', borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#1e293b', borderBottomColor: '#c9a96e',
  },
  main: { maxWidth: 1400, margin: '0 auto', padding: '24px 24px 60px' },
  sectionTitle: {
    fontSize: 20, fontWeight: 700, color: '#1e293b',
    marginBottom: 20, paddingBottom: 10,
    borderBottom: '2px solid #e2e8f0',
  },
  kpiGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16,
  },
  kpiCard: {
    background: '#fff', borderRadius: 12, padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderTop: '3px solid #c9a96e',
  },
  kpiLabel: { fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 6 },
  kpiValue: { fontSize: 28, fontWeight: 700, color: '#1e293b' },
  kpiUnit: { fontSize: 16, fontWeight: 400, color: '#64748b', marginLeft: 2 },
  kpiTrend: { fontSize: 13, fontWeight: 600, marginTop: 8 },
  card: {
    background: '#fff', borderRadius: 12, padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardTitle: { fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 16, color: '#334155' },
  filterBar: {
    display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 14, fontWeight: 500, color: '#475569',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  select: {
    padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db',
    fontSize: 14, background: '#fff', cursor: 'pointer',
    outline: 'none',
  },
  filterCount: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
  table: {
    width: '100%', borderCollapse: 'collapse', fontSize: 13,
  },
  th: {
    textAlign: 'left', padding: '10px 12px', fontWeight: 600,
    borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  thR: {
    textAlign: 'right', padding: '10px 12px', fontWeight: 600,
    borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '10px 12px' },
  tdR: { padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
  badge: {
    display: 'inline-block', padding: '2px 10px', borderRadius: 12,
    fontSize: 12, fontWeight: 600,
  },
  alertItem: {
    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
  },
  footer: {
    textAlign: 'center', padding: 20, fontSize: 13, color: '#94a3b8',
    borderTop: '1px solid #e2e8f0', background: '#fff',
  },
};
