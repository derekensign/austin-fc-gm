'use client';

import { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Filter,
  ArrowUpDown,
  Globe,
  Trophy,
  Calendar,
  Building2,
} from 'lucide-react';

// Complete transfer data with MLS team and year
interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  sourceCountry: string;
  sourceClub: string;
  mlsTeam: string;
  fee: number;
  transferType: 'permanent' | 'loan' | 'free';
  year: number;
}

// Comprehensive transfer data
const ALL_TRANSFERS: TransferRecord[] = [
  // ============ 2025 Season ============
  // Austin FC 2025
  { playerName: 'Myrto Uzuni', age: 29, position: 'ST', sourceCountry: 'Spain', sourceClub: 'Granada CF', mlsTeam: 'Austin FC', fee: 6000000, transferType: 'permanent', year: 2025 },
  { playerName: 'Brandon Vazquez', age: 26, position: 'ST', sourceCountry: 'Mexico', sourceClub: 'CF Monterrey', mlsTeam: 'Austin FC', fee: 4000000, transferType: 'permanent', year: 2025 },
  { playerName: 'Joseph Rosales', age: 25, position: 'LB', sourceCountry: 'United States', sourceClub: 'Minnesota United', mlsTeam: 'Austin FC', fee: 1500000, transferType: 'permanent', year: 2025 },
  { playerName: 'Jayden Nelson', age: 22, position: 'RW', sourceCountry: 'Canada', sourceClub: 'Vancouver Whitecaps', mlsTeam: 'Austin FC', fee: 1250000, transferType: 'permanent', year: 2025 },
  { playerName: 'Jon Bell', age: 26, position: 'CB', sourceCountry: 'United States', sourceClub: 'Seattle Sounders', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2025 },
  
  // ============ 2024 Season ============
  // Atlanta United
  { playerName: 'Emmanuel Latte Lath', age: 26, position: 'CF', sourceCountry: 'England', sourceClub: 'Middlesbrough', mlsTeam: 'Atlanta United', fee: 21250000, transferType: 'permanent', year: 2024 },
  { playerName: 'Aleksey Miranchuk', age: 28, position: 'AM', sourceCountry: 'Italy', sourceClub: 'Atalanta', mlsTeam: 'Atlanta United', fee: 11800000, transferType: 'permanent', year: 2024 },
  { playerName: 'Miguel Almirón', age: 30, position: 'RW', sourceCountry: 'England', sourceClub: 'Newcastle', mlsTeam: 'Atlanta United', fee: 9550000, transferType: 'permanent', year: 2024 },
  // Chicago Fire
  { playerName: "Djé D'Avilla", age: 21, position: 'DM', sourceCountry: 'Portugal', sourceClub: 'UD Leiria', mlsTeam: 'Chicago Fire', fee: 4000000, transferType: 'permanent', year: 2024 },
  { playerName: 'Xherdan Shaqiri', age: 32, position: 'AM', sourceCountry: 'Switzerland', sourceClub: 'Basel', mlsTeam: 'Chicago Fire', fee: 0, transferType: 'free', year: 2024 },
  // LA Galaxy  
  { playerName: 'Marco Reus', age: 35, position: 'AM', sourceCountry: 'Germany', sourceClub: 'Dortmund', mlsTeam: 'LA Galaxy', fee: 0, transferType: 'free', year: 2024 },
  { playerName: 'Gabriel Pec', age: 23, position: 'RW', sourceCountry: 'Brazil', sourceClub: 'Vasco', mlsTeam: 'LA Galaxy', fee: 10000000, transferType: 'permanent', year: 2024 },
  // LAFC
  { playerName: 'Olivier Giroud', age: 37, position: 'CF', sourceCountry: 'Italy', sourceClub: 'AC Milan', mlsTeam: 'LAFC', fee: 0, transferType: 'free', year: 2024 },
  // San Diego FC
  { playerName: 'Hirving Lozano', age: 28, position: 'RW', sourceCountry: 'Netherlands', sourceClub: 'PSV', mlsTeam: 'San Diego FC', fee: 12000000, transferType: 'permanent', year: 2024 },
  // NY Red Bulls
  { playerName: 'Emil Forsberg', age: 32, position: 'AM', sourceCountry: 'Germany', sourceClub: 'RB Leipzig', mlsTeam: 'NY Red Bulls', fee: 0, transferType: 'free', year: 2024 },
  // Seattle
  { playerName: 'Pedro de la Vega', age: 23, position: 'LW', sourceCountry: 'Argentina', sourceClub: 'Lanús', mlsTeam: 'Seattle Sounders', fee: 9000000, transferType: 'permanent', year: 2024 },
  // Cincinnati
  { playerName: 'Kévin Denkey', age: 23, position: 'CF', sourceCountry: 'Belgium', sourceClub: 'Cercle Brugge', mlsTeam: 'Cincinnati', fee: 15300000, transferType: 'permanent', year: 2024 },
  // Austin FC 2024
  { playerName: 'Mateja Djordjević', age: 21, position: 'CB', sourceCountry: 'Serbia', sourceClub: 'FK Radnički Niš', mlsTeam: 'Austin FC', fee: 800000, transferType: 'permanent', year: 2024 },
  { playerName: 'Guilherme Biro', age: 22, position: 'LB', sourceCountry: 'Brazil', sourceClub: 'Corinthians', mlsTeam: 'Austin FC', fee: 1500000, transferType: 'permanent', year: 2024 },
  { playerName: 'Nicolás Dubersarsky', age: 22, position: 'CM', sourceCountry: 'Argentina', sourceClub: 'Racing Club', mlsTeam: 'Austin FC', fee: 1200000, transferType: 'permanent', year: 2024 },
  
  // ============ 2023 Season ============
  // Inter Miami
  { playerName: 'Lionel Messi', age: 36, position: 'RW', sourceCountry: 'France', sourceClub: 'PSG', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2023 },
  { playerName: 'Sergio Busquets', age: 35, position: 'DM', sourceCountry: 'Spain', sourceClub: 'Barcelona', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2023 },
  { playerName: 'Jordi Alba', age: 34, position: 'LB', sourceCountry: 'Spain', sourceClub: 'Barcelona', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2023 },
  { playerName: 'Luis Suárez', age: 36, position: 'CF', sourceCountry: 'Brazil', sourceClub: 'Grêmio', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2023 },
  // LAFC
  { playerName: 'Hugo Lloris', age: 36, position: 'GK', sourceCountry: 'England', sourceClub: 'Tottenham', mlsTeam: 'LAFC', fee: 0, transferType: 'free', year: 2023 },
  { playerName: 'Denis Bouanga', age: 28, position: 'LW', sourceCountry: 'France', sourceClub: 'Saint-Étienne', mlsTeam: 'LAFC', fee: 5000000, transferType: 'permanent', year: 2023 },
  // Atlanta United
  { playerName: 'Giorgos Giakoumakis', age: 28, position: 'CF', sourceCountry: 'Scotland', sourceClub: 'Celtic', mlsTeam: 'Atlanta United', fee: 5000000, transferType: 'permanent', year: 2023 },
  // NY Red Bulls
  { playerName: 'Dante Vanzeir', age: 25, position: 'CF', sourceCountry: 'Belgium', sourceClub: 'Union SG', mlsTeam: 'NY Red Bulls', fee: 8000000, transferType: 'permanent', year: 2023 },
  // Orlando City
  { playerName: 'Martín Ojeda', age: 26, position: 'AM', sourceCountry: 'Argentina', sourceClub: 'Godoy Cruz', mlsTeam: 'Orlando City', fee: 6500000, transferType: 'permanent', year: 2023 },
  // Columbus Crew
  { playerName: 'Diego Rossi', age: 25, position: 'LW', sourceCountry: 'Turkey', sourceClub: 'Fenerbahçe', mlsTeam: 'Columbus Crew', fee: 6000000, transferType: 'permanent', year: 2023 },
  // Colorado Rapids
  { playerName: 'Moïse Bombito', age: 23, position: 'CB', sourceCountry: 'France', sourceClub: 'Nice', mlsTeam: 'Colorado Rapids', fee: 7000000, transferType: 'permanent', year: 2023 },
  // NYCFC
  { playerName: 'Santiago Rodríguez', age: 23, position: 'AM', sourceCountry: 'Brazil', sourceClub: 'Botafogo', mlsTeam: 'NYCFC', fee: 14300000, transferType: 'permanent', year: 2023 },
  // Austin FC 2023
  { playerName: 'Owen Wolff', age: 19, position: 'CAM', sourceCountry: 'United States', sourceClub: 'Austin FC Academy', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2023 },
  { playerName: 'Jáder Obrian', age: 28, position: 'RW', sourceCountry: 'Colombia', sourceClub: 'FC Dallas', mlsTeam: 'Austin FC', fee: 500000, transferType: 'permanent', year: 2023 },
  
  // ============ 2022 Season ============
  // Atlanta United
  { playerName: 'Thiago Almada', age: 21, position: 'AM', sourceCountry: 'Argentina', sourceClub: 'Vélez', mlsTeam: 'Atlanta United', fee: 16000000, transferType: 'permanent', year: 2022 },
  // LA Galaxy
  { playerName: 'Riqui Puig', age: 23, position: 'CM', sourceCountry: 'Spain', sourceClub: 'Barcelona', mlsTeam: 'LA Galaxy', fee: 0, transferType: 'free', year: 2022 },
  // Toronto FC
  { playerName: 'Federico Bernardeschi', age: 28, position: 'AM', sourceCountry: 'Italy', sourceClub: 'Juventus', mlsTeam: 'Toronto FC', fee: 0, transferType: 'free', year: 2022 },
  { playerName: 'Lorenzo Insigne', age: 31, position: 'LW', sourceCountry: 'Italy', sourceClub: 'Napoli', mlsTeam: 'Toronto FC', fee: 0, transferType: 'free', year: 2022 },
  // Columbus Crew
  { playerName: 'Cucho Hernández', age: 23, position: 'CF', sourceCountry: 'England', sourceClub: 'Watford', mlsTeam: 'Columbus Crew', fee: 9500000, transferType: 'permanent', year: 2022 },
  // Cincinnati
  { playerName: 'Luciano Acosta', age: 28, position: 'AM', sourceCountry: 'Mexico', sourceClub: 'Atlas', mlsTeam: 'Cincinnati', fee: 5000000, transferType: 'permanent', year: 2022 },
  // Orlando City
  { playerName: 'Facundo Torres', age: 22, position: 'LW', sourceCountry: 'Uruguay', sourceClub: 'Peñarol', mlsTeam: 'Orlando City', fee: 8500000, transferType: 'permanent', year: 2022 },
  // LAFC
  { playerName: 'Gareth Bale', age: 32, position: 'RW', sourceCountry: 'Spain', sourceClub: 'Real Madrid', mlsTeam: 'LAFC', fee: 0, transferType: 'free', year: 2022 },
  // Houston Dynamo
  { playerName: 'Héctor Herrera', age: 32, position: 'CM', sourceCountry: 'Spain', sourceClub: 'Atlético Madrid', mlsTeam: 'Houston Dynamo', fee: 0, transferType: 'free', year: 2022 },
  // Real Salt Lake
  { playerName: 'Chicho Arango', age: 27, position: 'CF', sourceCountry: 'Colombia', sourceClub: 'Millonarios', mlsTeam: 'Real Salt Lake', fee: 2500000, transferType: 'permanent', year: 2022 },
  // St. Louis City
  { playerName: 'João Klauss', age: 26, position: 'CF', sourceCountry: 'Belgium', sourceClub: 'Standard Liège', mlsTeam: 'St. Louis City', fee: 2500000, transferType: 'permanent', year: 2022 },
  { playerName: 'Roman Bürki', age: 32, position: 'GK', sourceCountry: 'Germany', sourceClub: 'Dortmund', mlsTeam: 'St. Louis City', fee: 0, transferType: 'free', year: 2022 },
  // DC United
  { playerName: 'Christian Benteke', age: 32, position: 'CF', sourceCountry: 'England', sourceClub: 'Crystal Palace', mlsTeam: 'DC United', fee: 0, transferType: 'free', year: 2022 },
  // Charlotte FC
  { playerName: 'Karol Świderski', age: 24, position: 'CF', sourceCountry: 'Greece', sourceClub: 'PAOK', mlsTeam: 'Charlotte FC', fee: 5000000, transferType: 'permanent', year: 2022 },
  // Austin FC 2022
  { playerName: 'Dani Pereira', age: 26, position: 'CM', sourceCountry: 'Venezuela', sourceClub: 'DC United', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2022 },
  { playerName: 'Oleksandr Svatok', age: 25, position: 'CB', sourceCountry: 'Ukraine', sourceClub: 'FC Metalist', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2022 },
  
  // ============ 2021 Season (Austin FC Founding Year) ============
  // Atlanta United
  { playerName: 'Luiz Araújo', age: 25, position: 'RW', sourceCountry: 'France', sourceClub: 'Lille', mlsTeam: 'Atlanta United', fee: 11500000, transferType: 'permanent', year: 2021 },
  // Philadelphia Union
  { playerName: 'Dániel Gazdag', age: 25, position: 'AM', sourceCountry: 'Hungary', sourceClub: 'Honvéd', mlsTeam: 'Philadelphia Union', fee: 2000000, transferType: 'permanent', year: 2021 },
  // FC Dallas
  { playerName: 'Alan Velasco', age: 19, position: 'LW', sourceCountry: 'Argentina', sourceClub: 'Independiente', mlsTeam: 'FC Dallas', fee: 7000000, transferType: 'permanent', year: 2021 },
  // NYCFC
  { playerName: 'Talles Magno', age: 19, position: 'LW', sourceCountry: 'Brazil', sourceClub: 'Vasco', mlsTeam: 'NYCFC', fee: 8000000, transferType: 'permanent', year: 2021 },
  // Vancouver Whitecaps
  { playerName: 'Ryan Gauld', age: 25, position: 'AM', sourceCountry: 'Portugal', sourceClub: 'Farense', mlsTeam: 'Vancouver Whitecaps', fee: 0, transferType: 'free', year: 2021 },
  // New England
  { playerName: 'Giacomo Vrioni', age: 23, position: 'CF', sourceCountry: 'Italy', sourceClub: 'Juventus', mlsTeam: 'New England', fee: 3000000, transferType: 'permanent', year: 2021 },
  // Austin FC 2021 (Expansion Draft + International Signings)
  { playerName: 'Sebastián Driussi', age: 25, position: 'AM', sourceCountry: 'Russia', sourceClub: 'Zenit St. Petersburg', mlsTeam: 'Austin FC', fee: 5500000, transferType: 'permanent', year: 2021 },
  { playerName: 'Tomás Pochettino', age: 25, position: 'CM', sourceCountry: 'Argentina', sourceClub: 'Boca Juniors', mlsTeam: 'Austin FC', fee: 2500000, transferType: 'permanent', year: 2021 },
  { playerName: 'Cecilio Domínguez', age: 26, position: 'LW', sourceCountry: 'Paraguay', sourceClub: 'Club América', mlsTeam: 'Austin FC', fee: 4000000, transferType: 'permanent', year: 2021 },
  { playerName: 'Žan Kolmanič', age: 22, position: 'LB', sourceCountry: 'Slovenia', sourceClub: 'NK Maribor', mlsTeam: 'Austin FC', fee: 500000, transferType: 'permanent', year: 2021 },
  { playerName: 'Mikkel Desler', age: 26, position: 'RB', sourceCountry: 'Denmark', sourceClub: 'Toulouse FC', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2021 },
  { playerName: 'Ilie Sánchez', age: 31, position: 'CDM', sourceCountry: 'Spain', sourceClub: 'Sporting Kansas City', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2021 },
  { playerName: 'Robert Taylor', age: 26, position: 'LW', sourceCountry: 'Finland', sourceClub: 'HJK Helsinki', mlsTeam: 'Austin FC', fee: 300000, transferType: 'permanent', year: 2021 },
  { playerName: 'Besard Sabovic', age: 25, position: 'CM', sourceCountry: 'Sweden', sourceClub: 'AIK', mlsTeam: 'Austin FC', fee: 200000, transferType: 'permanent', year: 2021 },
  { playerName: 'Jon Gallagher', age: 26, position: 'CB', sourceCountry: 'Ireland', sourceClub: 'Aberdeen FC', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2021 },
  { playerName: 'Brad Stuver', age: 30, position: 'GK', sourceCountry: 'United States', sourceClub: 'Columbus Crew', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2021 },
  { playerName: 'Brendan Hines-Ike', age: 24, position: 'CB', sourceCountry: 'United States', sourceClub: 'Kortrijk', mlsTeam: 'Austin FC', fee: 0, transferType: 'free', year: 2021 },
  
  // ============ 2020 Season ============
  // Inter Miami
  { playerName: 'Gonzalo Higuaín', age: 32, position: 'CF', sourceCountry: 'Italy', sourceClub: 'Juventus', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2020 },
  { playerName: 'Blaise Matuidi', age: 33, position: 'CM', sourceCountry: 'Italy', sourceClub: 'Juventus', mlsTeam: 'Inter Miami', fee: 0, transferType: 'free', year: 2020 },
  // Columbus Crew
  { playerName: 'Lucas Zelarayán', age: 27, position: 'AM', sourceCountry: 'Mexico', sourceClub: 'Tigres', mlsTeam: 'Columbus Crew', fee: 7000000, transferType: 'permanent', year: 2020 },
  // Minnesota United
  { playerName: 'Emanuel Reynoso', age: 24, position: 'AM', sourceCountry: 'Argentina', sourceClub: 'Boca Juniors', mlsTeam: 'Minnesota United', fee: 5000000, transferType: 'permanent', year: 2020 },
  // Nashville SC
  { playerName: 'Hany Mukhtar', age: 25, position: 'AM', sourceCountry: 'Denmark', sourceClub: 'Brøndby', mlsTeam: 'Nashville SC', fee: 1500000, transferType: 'permanent', year: 2020 },
  // Portland Timbers
  { playerName: 'Yimmi Chará', age: 29, position: 'RW', sourceCountry: 'Brazil', sourceClub: 'Atlético Mineiro', mlsTeam: 'Portland Timbers', fee: 2800000, transferType: 'permanent', year: 2020 },
];

// All MLS teams
const MLS_TEAMS = [
  'All Teams',
  'Atlanta United',
  'Austin FC',
  'Charlotte FC',
  'Chicago Fire',
  'Cincinnati',
  'Colorado Rapids',
  'Columbus Crew',
  'DC United',
  'FC Dallas',
  'Houston Dynamo',
  'Inter Miami',
  'LA Galaxy',
  'LAFC',
  'Minnesota United',
  'Nashville SC',
  'New England',
  'NY Red Bulls',
  'NYCFC',
  'Orlando City',
  'Philadelphia Union',
  'Portland Timbers',
  'Real Salt Lake',
  'San Diego FC',
  'Seattle Sounders',
  'Sporting KC',
  'St. Louis City',
  'Toronto FC',
  'Vancouver Whitecaps',
];

// Years available
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

// Colors for charts
const COLORS = [
  '#00b140', // verde
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#a855f7', // violet
];

type SortKey = 'transfers' | 'totalSpend' | 'avgFee';
type SortDirection = 'asc' | 'desc';

export default function TransferSourcesPage() {
  const [sortKey, setSortKey] = useState<SortKey>('transfers');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('All Teams');
  const [showTop, setShowTop] = useState(15);

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
      return `€${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `€${(amount / 1_000).toFixed(0)}K`;
    }
    return amount > 0 ? `€${amount}` : 'Free';
  };

  // Filter transfers based on selections
  const filteredTransfers = useMemo(() => {
    return ALL_TRANSFERS.filter(t => {
      const yearMatch = selectedYear === 'all' || t.year === selectedYear;
      const teamMatch = selectedTeam === 'All Teams' || t.mlsTeam === selectedTeam;
      return yearMatch && teamMatch;
    });
  }, [selectedYear, selectedTeam]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalSpend = filteredTransfers.reduce((sum, t) => sum + t.fee, 0);
    const paidTransfers = filteredTransfers.filter(t => t.fee > 0);
    const freeTransfers = filteredTransfers.filter(t => t.transferType === 'free');
    const loanTransfers = filteredTransfers.filter(t => t.transferType === 'loan');
    
    return {
      totalTransfers: filteredTransfers.length,
      totalSpend,
      paidTransfers: paidTransfers.length,
      freeTransfers: freeTransfers.length,
      loanTransfers: loanTransfers.length,
      avgFee: paidTransfers.length > 0 ? totalSpend / paidTransfers.length : 0,
    };
  }, [filteredTransfers]);

  // Aggregate by country
  const countryData = useMemo(() => {
    const countryMap = new Map<string, { 
      transfers: number; 
      totalSpend: number; 
      notableSignings: string[];
    }>();
    
    filteredTransfers.forEach(t => {
      const existing = countryMap.get(t.sourceCountry) || { 
        transfers: 0, 
        totalSpend: 0, 
        notableSignings: [] 
      };
      existing.transfers++;
      existing.totalSpend += t.fee;
      if (t.fee >= 5000000) {
        existing.notableSignings.push(`${t.playerName} (${formatCurrency(t.fee)})`);
      }
      countryMap.set(t.sourceCountry, existing);
    });
    
    return Array.from(countryMap.entries())
      .map(([country, data]) => ({
        country,
        transfers: data.transfers,
        totalSpend: data.totalSpend,
        avgFee: data.transfers > 0 ? data.totalSpend / data.transfers : 0,
        notableSignings: data.notableSignings,
      }))
      .sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? -1 : 1;
        return (a[sortKey] - b[sortKey]) * multiplier;
      })
      .slice(0, showTop);
  }, [filteredTransfers, sortKey, sortDirection, showTop]);

  // Yearly trend data
  const yearlyTrend = useMemo(() => {
    const teamFilter = selectedTeam === 'All Teams' ? ALL_TRANSFERS : ALL_TRANSFERS.filter(t => t.mlsTeam === selectedTeam);
    
    return YEARS.map(year => {
      const yearTransfers = teamFilter.filter(t => t.year === year);
      const totalSpend = yearTransfers.reduce((sum, t) => sum + t.fee, 0);
      return {
        year: year.toString(),
        transfers: yearTransfers.length,
        spend: totalSpend / 1_000_000,
      };
    }).reverse();
  }, [selectedTeam]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Prepare bar chart data
  const barChartData = countryData.map(d => ({
    name: d.country,
    transfers: d.transfers,
    spend: d.totalSpend / 1_000_000,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--obsidian)] via-[var(--obsidian-light)] to-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-[var(--verde)]" />
            <h1 className="text-3xl font-display font-bold text-white">
              MLS Transfer Sources
            </h1>
          </div>
          <p className="text-white/60">
            Analyze where MLS acquires players from — by country, year, and team
          </p>
          <p className="text-xs text-white/40 mt-1">
            Source: <a href="https://www.transfermarkt.us/major-league-soccer/transfers/wettbewerb/MLS1" target="_blank" rel="noopener noreferrer" className="text-[var(--verde)] hover:underline">Transfermarkt</a>
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--verde)]" />
              <span className="text-sm font-medium text-white">Filters:</span>
            </div>
            
            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)] min-w-[120px]"
              >
                <option value="all">All Years</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-white/60" />
              <select 
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)] min-w-[180px]"
              >
                {MLS_TEAMS.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Show Top Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-white/60">Show top:</span>
              <select 
                value={showTop}
                onChange={(e) => setShowTop(Number(e.target.value))}
                className="bg-[var(--obsidian)] border border-[var(--verde)]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--verde)]"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Total Transfers</span>
            </div>
            <p className="text-3xl font-bold text-white">{summaryStats.totalTransfers}</p>
            <p className="text-xs text-white/50">
              {selectedYear === 'all' ? '2020-2025' : selectedYear}
              {selectedTeam !== 'All Teams' && ` • ${selectedTeam}`}
            </p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Total Spend</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summaryStats.totalSpend)}</p>
            <p className="text-xs text-white/50">{summaryStats.paidTransfers} paid transfers</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Avg. Fee</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(summaryStats.avgFee)}</p>
            <p className="text-xs text-white/50">Paid transfers only</p>
          </div>

          <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-4">
            <div className="flex items-center gap-2 text-[var(--verde)] mb-2">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Free Transfers</span>
            </div>
            <p className="text-3xl font-bold text-white">{summaryStats.freeTransfers}</p>
            <p className="text-xs text-white/50">
              {summaryStats.totalTransfers > 0 
                ? `${((summaryStats.freeTransfers / summaryStats.totalTransfers) * 100).toFixed(0)}% of total`
                : '0%'}
            </p>
          </div>
        </div>

        {/* Yearly Trend Chart */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Transfer Trend (2020-2025)
            {selectedTeam !== 'All Teams' && <span className="text-[var(--verde)] ml-2">• {selectedTeam}</span>}
          </h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--obsidian)', 
                    border: '1px solid var(--verde)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'spend' ? `€${value.toFixed(1)}M` : value,
                    name === 'spend' ? 'Total Spend' : 'Transfers'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="transfers" 
                  name="Transfers" 
                  stroke="var(--verde)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--verde)', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="spend" 
                  name="Spend (€M)" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-white/60 py-2">Sort by:</span>
          {(['transfers', 'totalSpend', 'avgFee'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                sortKey === key 
                  ? 'bg-[var(--verde)] text-black' 
                  : 'bg-[var(--obsidian-light)] text-white/70 hover:text-white border border-[var(--verde)]/30'
              }`}
            >
              {key === 'transfers' ? 'Count' : key === 'totalSpend' ? 'Total Spend' : 'Avg Fee'}
              {sortKey === key && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>

        {/* Bar Chart - Source Countries */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Source Countries
            {selectedYear !== 'all' && <span className="text-[var(--verde)] ml-2">• {selectedYear}</span>}
            {selectedTeam !== 'All Teams' && <span className="text-[var(--verde)] ml-2">• {selectedTeam}</span>}
          </h2>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={barChartData} 
                layout="vertical"
                margin={{ left: 100, right: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  width={90} 
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--obsidian)', 
                    border: '1px solid var(--verde)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'spend' ? `€${value.toFixed(1)}M` : value,
                    name === 'spend' ? 'Total Spend' : 'Transfers'
                  ]}
                />
                <Bar 
                  dataKey={sortKey === 'totalSpend' ? 'spend' : 'transfers'} 
                  fill="var(--verde)" 
                  radius={[0, 4, 4, 0]}
                  name={sortKey === 'totalSpend' ? 'spend' : 'transfers'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--verde)]/20">
            <h2 className="text-xl font-bold text-white">
              Source Countries Detail
              {countryData.length > 0 && (
                <span className="text-sm font-normal text-white/50 ml-2">
                  ({countryData.length} countries)
                </span>
              )}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--obsidian)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Country</th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('transfers')}
                  >
                    Transfers {sortKey === 'transfers' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('totalSpend')}
                  >
                    Total Spend {sortKey === 'totalSpend' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer hover:text-[var(--verde)] transition-colors"
                    onClick={() => handleSort('avgFee')}
                  >
                    Avg Fee {sortKey === 'avgFee' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Notable Signings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--obsidian-lighter)]">
                {countryData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                      No transfers found for the selected filters
                    </td>
                  </tr>
                ) : (
                  countryData.map((row, index) => (
                    <tr 
                      key={row.country} 
                      className="hover:bg-[var(--obsidian)] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">{row.country}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'transfers' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.transfers}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'totalSpend' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.totalSpend > 0 ? formatCurrency(row.totalSpend) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${sortKey === 'avgFee' ? 'text-[var(--verde)]' : 'text-white'}`}>
                          {row.avgFee > 0 ? formatCurrency(row.avgFee) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60 max-w-xs">
                        {row.notableSignings.length > 0 
                          ? row.notableSignings.slice(0, 2).join(', ') 
                          : <span className="text-white/30">-</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transfers List */}
        {filteredTransfers.length > 0 && (
          <div className="mt-8 bg-[var(--obsidian-light)] rounded-xl border border-[var(--verde)]/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--verde)]/20">
              <h2 className="text-xl font-bold text-white">
                Individual Transfers
                <span className="text-sm font-normal text-white/50 ml-2">
                  ({filteredTransfers.length} total)
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--obsidian)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase">To (MLS)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase">Fee</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white/60 uppercase">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--obsidian-lighter)]">
                  {filteredTransfers
                    .sort((a, b) => b.fee - a.fee)
                    .map((t, i) => (
                    <tr key={`${t.playerName}-${i}`} className="hover:bg-[var(--obsidian)] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{t.playerName}</span>
                          <span className="text-xs text-white/40">{t.position}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white/70">{t.sourceClub}</div>
                        <div className="text-xs text-white/40">{t.sourceCountry}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/70">{t.mlsTeam}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-semibold ${t.fee > 0 ? 'text-[var(--verde)]' : 'text-white/50'}`}>
                          {formatCurrency(t.fee)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-white/60">{t.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
