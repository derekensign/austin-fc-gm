// MLS Transfer Data scraped from Transfermarkt
// Converted from EUR to USD (rate: 1.10)

export interface TransferRecord {
  playerName: string;
  age: number;
  position: string;
  sourceCountry: string;
  sourceClub: string;
  mlsTeam: string;
  fee: number; // in USD
  marketValue: number; // in USD
  transferType: 'permanent' | 'loan' | 'free';
  year: number;
}

// EUR to USD conversion rate
const EUR_TO_USD = 1.10;

// Raw scraped data from Transfermarkt (2024/25 season)
const rawTransfers = [
  // Chicago Fire FC
  { playerName: "Djé D'Avilla", age: 21, position: "DM", marketValue: 500000, sourceClub: "Leiria", fee: 4000000, mlsTeam: "Chicago Fire", year: 2024 },
  { playerName: "Jonathan Bamba", age: 28, position: "LW", marketValue: 4000000, sourceClub: "Celta de Vigo", fee: 3500000, mlsTeam: "Chicago Fire", year: 2024 },
  { playerName: "Philip Zinckernagel", age: 30, position: "RW", marketValue: 2800000, sourceClub: "Club Brugge", fee: 850000, mlsTeam: "Chicago Fire", year: 2024 },
  { playerName: "Sam Roger", age: 25, position: "CB", marketValue: 400000, sourceClub: "Lillestrom", fee: 170000, mlsTeam: "Chicago Fire", year: 2024 },
  { playerName: "Tobias Salquist", age: 29, position: "CB", marketValue: 800000, sourceClub: "Nordsjaelland", fee: 270000, mlsTeam: "Chicago Fire", year: 2024 },
  
  // Atlanta United FC
  { playerName: "Emmanuel Latte Lath", age: 26, position: "CF", marketValue: 10000000, sourceClub: "Middlesbrough", fee: 21250000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Aleksey Miranchuk", age: 28, position: "AM", marketValue: 10000000, sourceClub: "Atalanta", fee: 11800000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Miguel Almirón", age: 30, position: "RW", marketValue: 16000000, sourceClub: "Newcastle", fee: 9550000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Thiago Almada", age: 23, position: "LW", marketValue: 27000000, sourceClub: "Botafogo", fee: 24150000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Caleb Wiley", age: 19, position: "LB", marketValue: 5000000, sourceClub: "Chelsea", fee: 10100000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Giorgos Giakoumakis", age: 29, position: "CF", marketValue: 8000000, sourceClub: "Cruz Azul", fee: 9330000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Santiago Sosa", age: 25, position: "CB", marketValue: 7000000, sourceClub: "Racing Club", fee: 3800000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Xande Silva", age: 28, position: "LW", marketValue: 1000000, sourceClub: "St. Louis CITY", fee: 88000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Tyler Wolff", age: 21, position: "RW", marketValue: 800000, sourceClub: "Real Salt Lake", fee: 47000, mlsTeam: "Atlanta United", year: 2024 },
  { playerName: "Aiden McFadden", age: 25, position: "RB", marketValue: 175000, sourceClub: "Louisville City", fee: 15000, mlsTeam: "Atlanta United", year: 2024 },
  
  // Orlando City SC
  { playerName: "Marco Pašalić", age: 24, position: "RW", marketValue: 4000000, sourceClub: "HNK Rijeka", fee: 4800000, mlsTeam: "Orlando City", year: 2024 },
  { playerName: "Nicolás Rodríguez", age: 20, position: "RW", marketValue: 1400000, sourceClub: "Fortaleza CEIF", fee: 1500000, mlsTeam: "Orlando City", year: 2024 },
  { playerName: "Heine Gikling Bruseth", age: 20, position: "CM", marketValue: 450000, sourceClub: "Kristiansund", fee: 1500000, mlsTeam: "Orlando City", year: 2024 },
  { playerName: "Facundo Torres", age: 24, position: "RW", marketValue: 14000000, sourceClub: "Palmeiras", fee: 11500000, mlsTeam: "Orlando City", year: 2024 },
  { playerName: "Mason Stajduhar", age: 27, position: "GK", marketValue: 175000, sourceClub: "Real Salt Lake", fee: 49000, mlsTeam: "Orlando City", year: 2024 },
  
  // New York City FC
  { playerName: "Aiden O'Neill", age: 26, position: "DM", marketValue: 3000000, sourceClub: "Standard Liège", fee: 2000000, mlsTeam: "NYCFC", year: 2024 },
  { playerName: "Santiago Rodríguez", age: 25, position: "AM", marketValue: 4500000, sourceClub: "Botafogo", fee: 14300000, mlsTeam: "NYCFC", year: 2024 },
  { playerName: "Nicolás Acevedo", age: 25, position: "DM", marketValue: 4000000, sourceClub: "EC Bahia", fee: 2850000, mlsTeam: "NYCFC", year: 2024 },
  { playerName: "Luis Barraza", age: 28, position: "GK", marketValue: 200000, sourceClub: "D.C. United", fee: 142000, mlsTeam: "NYCFC", year: 2024 },
  
  // Philadelphia Union
  { playerName: "Bruno Damiani", age: 22, position: "CF", marketValue: 800000, sourceClub: "Nacional", fee: 3250000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Danley Jean Jacques", age: 24, position: "DM", marketValue: 2000000, sourceClub: "FC Metz", fee: 1400000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Indiana Vassilev", age: 24, position: "RW", marketValue: 2000000, sourceClub: "St. Louis CITY", fee: 955000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Jovan Lukić", age: 23, position: "CM", marketValue: 600000, sourceClub: "Spartak", fee: 600000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Samuel Adeniran", age: 25, position: "CF", marketValue: 1500000, sourceClub: "St. Louis CITY", fee: 138000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Dániel Gazdag", age: 29, position: "AM", marketValue: 9000000, sourceClub: "Columbus", fee: 3550000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Jack McGlynn", age: 21, position: "CM", marketValue: 4500000, sourceClub: "Houston", fee: 2040000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "José Martínez", age: 30, position: "DM", marketValue: 3000000, sourceClub: "Corinthians", fee: 1800000, mlsTeam: "Philadelphia Union", year: 2024 },
  { playerName: "Damion Lowe", age: 31, position: "CB", marketValue: 600000, sourceClub: "Al-Okhdood", fee: 179000, mlsTeam: "Philadelphia Union", year: 2024 },
  
  // Toronto FC
  { playerName: "Thiago Andrade", age: 24, position: "LW", marketValue: 1000000, sourceClub: "San Diego", fee: 240000, mlsTeam: "Toronto FC", year: 2024 },
  { playerName: "Jahkeele Marshall-Rutty", age: 20, position: "RB", marketValue: 1500000, sourceClub: "Montréal", fee: 780000, mlsTeam: "Toronto FC", year: 2024 },
  { playerName: "Prince Owusu", age: 28, position: "CF", marketValue: 2000000, sourceClub: "Montréal", fee: 245000, mlsTeam: "Toronto FC", year: 2024 },
  
  // FC Cincinnati
  { playerName: "Kévin Denkey", age: 24, position: "CF", marketValue: 14000000, sourceClub: "Cercle Brugge", fee: 15300000, mlsTeam: "Cincinnati", year: 2024 },
  { playerName: "Evander", age: 26, position: "AM", marketValue: 14000000, sourceClub: "Portland", fee: 11500000, mlsTeam: "Cincinnati", year: 2024 },
  { playerName: "Luca Orellano", age: 24, position: "RW", marketValue: 5000000, sourceClub: "Vasco da Gama", fee: 2500000, mlsTeam: "Cincinnati", year: 2024 },
  { playerName: "Chidozie Awaziem", age: 27, position: "CB", marketValue: 3000000, sourceClub: "Boavista", fee: 500000, mlsTeam: "Cincinnati", year: 2024 },
  { playerName: "Luciano Acosta", age: 30, position: "AM", marketValue: 8000000, sourceClub: "Dallas", fee: 5650000, mlsTeam: "Cincinnati", year: 2024 },
  { playerName: "Ian Murphy", age: 24, position: "CB", marketValue: 1200000, sourceClub: "Colorado", fee: 475000, mlsTeam: "Cincinnati", year: 2024 },
  
  // Nashville SC
  { playerName: "Ahmed Qasem", age: 21, position: "RW", marketValue: 3000000, sourceClub: "Elfsborg", fee: 4000000, mlsTeam: "Nashville SC", year: 2024 },
  { playerName: "Patrick Yazbek", age: 22, position: "CM", marketValue: 2500000, sourceClub: "Viking", fee: 3000000, mlsTeam: "Nashville SC", year: 2024 },
  { playerName: "Matthew Corcoran", age: 18, position: "DM", marketValue: 300000, sourceClub: "Legion FC", fee: 100000, mlsTeam: "Nashville SC", year: 2024 },
  { playerName: "Lucas MacNaughton", age: 29, position: "CB", marketValue: 1500000, sourceClub: "D.C. United", fee: 192000, mlsTeam: "Nashville SC", year: 2024 },
  { playerName: "Sean Davis", age: 31, position: "CM", marketValue: 1200000, sourceClub: "LA Galaxy", fee: 96000, mlsTeam: "Nashville SC", year: 2024 },
  { playerName: "Shaq Moore", age: 28, position: "RB", marketValue: 1200000, sourceClub: "Dallas", fee: 48000, mlsTeam: "Nashville SC", year: 2024 },
  
  // Inter Miami CF
  { playerName: "Telasco Segovia", age: 21, position: "CM", marketValue: 1000000, sourceClub: "Casa Pia", fee: 2500000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Maximiliano Falcón", age: 27, position: "CB", marketValue: 900000, sourceClub: "Colo-Colo", fee: 1950000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Gonzalo Luján", age: 23, position: "CB", marketValue: 3000000, sourceClub: "San Lorenzo", fee: 775000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Diego Gómez", age: 21, position: "CM", marketValue: 12000000, sourceClub: "Brighton", fee: 13000000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Facundo Farías", age: 22, position: "AM", marketValue: 4000000, sourceClub: "Estudiantes LP", fee: 4340000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Leonardo Campana", age: 24, position: "CF", marketValue: 3500000, sourceClub: "New England", fee: 2400000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Emerson Rodríguez", age: 24, position: "LW", marketValue: 2000000, sourceClub: "Ludogorets", fee: 1110000, mlsTeam: "Inter Miami", year: 2024 },
  { playerName: "Robert Taylor", age: 30, position: "LW", marketValue: 2000000, sourceClub: "Austin", fee: 615000, mlsTeam: "Inter Miami", year: 2024 },
  
  // Charlotte FC
  { playerName: "Wilfried Zaha", age: 32, position: "LW", marketValue: 8000000, sourceClub: "Galatasaray", fee: 3850000, mlsTeam: "Charlotte FC", year: 2024 },
  { playerName: "Eryk Williamson", age: 27, position: "CM", marketValue: 1200000, sourceClub: "Portland", fee: 97000, mlsTeam: "Charlotte FC", year: 2024 },
  { playerName: "Karol Swiderski", age: 28, position: "CF", marketValue: 5000000, sourceClub: "Panathinaikos", fee: 1900000, mlsTeam: "Charlotte FC", year: 2024 },
  
  // CF Montréal
  { playerName: "Gennadiy Synchuk", age: 18, position: "RW", marketValue: 400000, sourceClub: "Metalist", fee: 3400000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Jalen Neal", age: 21, position: "CB", marketValue: 800000, sourceClub: "LA Galaxy", fee: 625000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Prince Owusu", age: 28, position: "CF", marketValue: 2000000, sourceClub: "Toronto", fee: 245000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Emil Gazdov", age: 21, position: "GK", marketValue: 200000, sourceClub: "Pacific FC", fee: 135000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Caden Clark", age: 21, position: "AM", marketValue: 1700000, sourceClub: "Minnesota", fee: 130000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Giacomo Vrioni", age: 26, position: "CF", marketValue: 2000000, sourceClub: "New England", fee: 50000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Mathieu Choinière", age: 25, position: "CM", marketValue: 3500000, sourceClub: "Grasshopper", fee: 900000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Chinonso Offor", age: 24, position: "CF", marketValue: 650000, sourceClub: "Arda Kardzhali", fee: 225000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Mason Toye", age: 25, position: "CF", marketValue: 1000000, sourceClub: "Portland", fee: 185000, mlsTeam: "CF Montréal", year: 2024 },
  { playerName: "Ariel Lassiter", age: 29, position: "LW", marketValue: 800000, sourceClub: "Chicago", fee: 68000, mlsTeam: "CF Montréal", year: 2024 },
  
  // D.C. United
  { playerName: "Boris Enow", age: 24, position: "CM", marketValue: 700000, sourceClub: "Maccabi Netanya", fee: 2250000, mlsTeam: "DC United", year: 2024 },
  { playerName: "David Schnegg", age: 25, position: "LB", marketValue: 1500000, sourceClub: "Sturm Graz", fee: 1850000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Kye Rowles", age: 26, position: "CB", marketValue: 1000000, sourceClub: "Heart of Midl.", fee: 715000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Peglow", age: 23, position: "LW", marketValue: 600000, sourceClub: "Radomiak", fee: 600000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Joon-hong Kim", age: 21, position: "GK", marketValue: 550000, sourceClub: "Jeonbuk Hyundai", fee: 480000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Hosei Kijima", age: 22, position: "CM", marketValue: 400000, sourceClub: "San Diego", fee: 380000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Matai Akinmboni", age: 18, position: "CB", marketValue: 1000000, sourceClub: "Bournemouth", fee: 1500000, mlsTeam: "DC United", year: 2024 },
  { playerName: "Theodore Ku-DiPietro", age: 23, position: "AM", marketValue: 2500000, sourceClub: "Colorado", fee: 1100000, mlsTeam: "DC United", year: 2024 },
  
  // Columbus Crew
  { playerName: "Dániel Gazdag", age: 29, position: "AM", marketValue: 9000000, sourceClub: "Philadelphia", fee: 3550000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "AZ Jackson", age: 22, position: "AM", marketValue: 2000000, sourceClub: "St. Louis CITY", fee: 606000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "DeJuan Jones", age: 27, position: "LB", marketValue: 4500000, sourceClub: "New England", fee: 550000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Ibrahim Aliyu", age: 23, position: "CF", marketValue: 3000000, sourceClub: "Houston", fee: 395000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Abraham Romero", age: 26, position: "GK", marketValue: 175000, sourceClub: "LAFC", fee: 45000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Cucho Hernández", age: 25, position: "CF", marketValue: 18000000, sourceClub: "Real Betis", fee: 13000000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Aidan Morris", age: 22, position: "CM", marketValue: 3000000, sourceClub: "Middlesbrough", fee: 3730000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Marino Hinestroza", age: 22, position: "RW", marketValue: 2800000, sourceClub: "Atl. Nacional", fee: 1400000, mlsTeam: "Columbus Crew", year: 2024 },
  { playerName: "Christian Ramirez", age: 33, position: "CF", marketValue: 500000, sourceClub: "LA Galaxy", fee: 240000, mlsTeam: "Columbus Crew", year: 2024 },
  
  // New England Revolution
  { playerName: "Lucas Langoni", age: 22, position: "RW", marketValue: 4500000, sourceClub: "Boca Juniors", fee: 6200000, mlsTeam: "New England", year: 2024 },
  { playerName: "Ilay Feingold", age: 20, position: "RB", marketValue: 1200000, sourceClub: "Maccabi Haifa", fee: 2600000, mlsTeam: "New England", year: 2024 },
  { playerName: "Leonardo Campana", age: 24, position: "CF", marketValue: 3500000, sourceClub: "Miami", fee: 2400000, mlsTeam: "New England", year: 2024 },
  { playerName: "Alhasan Yusuf", age: 24, position: "CM", marketValue: 5000000, sourceClub: "Royal Antwerp", fee: 2300000, mlsTeam: "New England", year: 2024 },
  { playerName: "Mamadou Fofana", age: 27, position: "CB", marketValue: 1800000, sourceClub: "Amiens SC", fee: 1700000, mlsTeam: "New England", year: 2024 },
  { playerName: "Brayan Ceballos", age: 23, position: "CB", marketValue: 800000, sourceClub: "Fortaleza", fee: 1700000, mlsTeam: "New England", year: 2024 },
  { playerName: "Esmir Bajraktarevic", age: 19, position: "RW", marketValue: 3500000, sourceClub: "PSV", fee: 3000000, mlsTeam: "New England", year: 2024 },
  { playerName: "DeJuan Jones", age: 27, position: "LB", marketValue: 4500000, sourceClub: "Columbus", fee: 550000, mlsTeam: "New England", year: 2024 },
  { playerName: "Henry Kessler", age: 26, position: "CB", marketValue: 2500000, sourceClub: "St. Louis CITY", fee: 549000, mlsTeam: "New England", year: 2024 },
  { playerName: "Noel Buck", age: 20, position: "CM", marketValue: 2000000, sourceClub: "SJ Earthquakes", fee: 530000, mlsTeam: "New England", year: 2024 },
  { playerName: "Emmanuel Boateng", age: 30, position: "LM", marketValue: 300000, sourceClub: "San Diego", fee: 193000, mlsTeam: "New England", year: 2024 },
  { playerName: "Mark-Anthony Kaye", age: 30, position: "CM", marketValue: 1800000, sourceClub: "SJ Earthquakes", fee: 157000, mlsTeam: "New England", year: 2024 },
  { playerName: "Ian Harkes", age: 29, position: "CM", marketValue: 500000, sourceClub: "SJ Earthquakes", fee: 157000, mlsTeam: "New England", year: 2024 },
  { playerName: "Dave Romney", age: 31, position: "CB", marketValue: 1200000, sourceClub: "SJ Earthquakes", fee: 157000, mlsTeam: "New England", year: 2024 },
  { playerName: "Giacomo Vrioni", age: 26, position: "CF", marketValue: 2000000, sourceClub: "Montréal", fee: 50000, mlsTeam: "New England", year: 2024 },
  
  // New York Red Bulls
  { playerName: "Wiktor Bogacz", age: 20, position: "CF", marketValue: 2000000, sourceClub: "Miedz Legnica", fee: 2000000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "Felipe Carballo", age: 27, position: "CM", marketValue: 5000000, sourceClub: "Grêmio", fee: 455000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "Frankie Amaya", age: 23, position: "CM", marketValue: 2500000, sourceClub: "Toluca", fee: 3750000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "John Tolkin", age: 22, position: "LB", marketValue: 4000000, sourceClub: "Holstein Kiel", fee: 2500000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "Dante Vanzeir", age: 26, position: "CF", marketValue: 4000000, sourceClub: "KAA Gent", fee: 2350000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "Andrés Reyes", age: 25, position: "CB", marketValue: 1500000, sourceClub: "San Diego", fee: 764000, mlsTeam: "NY Red Bulls", year: 2024 },
  { playerName: "Elias Manoel", age: 23, position: "CF", marketValue: 2000000, sourceClub: "Real Salt Lake", fee: 671000, mlsTeam: "NY Red Bulls", year: 2024 },
  
  // Austin FC
  { playerName: "Myrto Uzuni", age: 29, position: "LW", marketValue: 5000000, sourceClub: "Granada CF", fee: 12000000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Brandon Vazquez", age: 26, position: "CF", marketValue: 6000000, sourceClub: "Monterrey", fee: 9600000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Osman Bukari", age: 25, position: "RW", marketValue: 7000000, sourceClub: "Red Star", fee: 7000000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Nicolás Dubersarsky", age: 20, position: "CM", marketValue: 1000000, sourceClub: "Instituto ACC", fee: 2900000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Oleksandr Svatok", age: 29, position: "CB", marketValue: 2000000, sourceClub: "SC Dnipro-1", fee: 1200000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Robert Taylor", age: 30, position: "LW", marketValue: 2000000, sourceClub: "Inter Miami", fee: 615000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Sebastián Driussi", age: 28, position: "CF", marketValue: 6000000, sourceClub: "River Plate", fee: 9750000, mlsTeam: "Austin FC", year: 2024 },
  { playerName: "Leo Väisänen", age: 27, position: "CB", marketValue: 1500000, sourceClub: "Häcken", fee: 450000, mlsTeam: "Austin FC", year: 2024 },
  
  // Minnesota United FC
  { playerName: "Kelvin Yeboah", age: 24, position: "CF", marketValue: 4000000, sourceClub: "Genoa", fee: 2500000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Joaquín Pereyra", age: 25, position: "CM", marketValue: 4500000, sourceClub: "Atl. Tucumán", fee: 2190000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Owen Gose", age: 21, position: "CM", marketValue: 1200000, sourceClub: "Amiens SC", fee: 2000000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Nicolás Romero", age: 21, position: "CB", marketValue: 3500000, sourceClub: "Atl. Tucumán", fee: 1950000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Ho-yeon Jung", age: 24, position: "CM", marketValue: 800000, sourceClub: "Gwangju FC", fee: 995000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Jefferson Díaz", age: 23, position: "CB", marketValue: 500000, sourceClub: "Deportivo Cali", fee: 645000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Miguel Tapia", age: 27, position: "CB", marketValue: 2000000, sourceClub: "Chivas", fee: 960000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Kervin Arriaga", age: 26, position: "DM", marketValue: 1500000, sourceClub: "Partizan", fee: 500000, mlsTeam: "Minnesota United", year: 2024 },
  { playerName: "Caden Clark", age: 21, position: "AM", marketValue: 1700000, sourceClub: "Montréal", fee: 130000, mlsTeam: "Minnesota United", year: 2024 },
  
  // Los Angeles FC
  { playerName: "Igor Jesu", age: 21, position: "DM", marketValue: 2000000, sourceClub: "Estrela Amadora", fee: 4000000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Artem Smolyakov", age: 21, position: "LB", marketValue: 900000, sourceClub: "Polissya", fee: 2000000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Cengiz Ünder", age: 27, position: "RW", marketValue: 7500000, sourceClub: "Fenerbahçe", fee: 1200000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Mark Delgado", age: 29, position: "CM", marketValue: 2000000, sourceClub: "LA Galaxy", fee: 385000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Nkosi Tafari", age: 27, position: "CB", marketValue: 1800000, sourceClub: "Dallas", fee: 290000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Mateusz Bogusz", age: 23, position: "AM", marketValue: 10000000, sourceClub: "Cruz Azul", fee: 8500000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Cristian Olivera", age: 22, position: "RW", marketValue: 6000000, sourceClub: "Grêmio", fee: 4300000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Stipe Biuk", age: 21, position: "LW", marketValue: 4000000, sourceClub: "Real Valladolid", fee: 4000000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Omar Campos", age: 22, position: "LB", marketValue: 4000000, sourceClub: "Cruz Azul", fee: 3800000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Mamadou Mbacke", age: 21, position: "CB", marketValue: 2000000, sourceClub: "Barça Atlètic", fee: 2000000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Bajung Darboe", age: 18, position: "RW", marketValue: 1000000, sourceClub: "FC Bayern II", fee: 1500000, mlsTeam: "LAFC", year: 2024 },
  { playerName: "Tomás Ángel", age: 21, position: "CF", marketValue: 450000, sourceClub: "San Diego", fee: 190000, mlsTeam: "LAFC", year: 2024 },
  
  // St. Louis CITY SC
  { playerName: "Jake Girdwood-Reich", age: 20, position: "CB", marketValue: 600000, sourceClub: "Sydney FC", fee: 795000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Henry Kessler", age: 26, position: "CB", marketValue: 2500000, sourceClub: "New England", fee: 549000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Xande Silva", age: 28, position: "LW", marketValue: 1000000, sourceClub: "Atlanta", fee: 88000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Indiana Vassilev", age: 24, position: "RW", marketValue: 2000000, sourceClub: "Philadelphia", fee: 955000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "AZ Jackson", age: 22, position: "AM", marketValue: 2000000, sourceClub: "Columbus", fee: 606000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Nikolas Dyhr", age: 23, position: "LB", marketValue: 1200000, sourceClub: "Randers FC", fee: 373000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Samuel Adeniran", age: 25, position: "CF", marketValue: 1500000, sourceClub: "Philadelphia", fee: 138000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Cristian Arango", age: 29, position: "CF", marketValue: 7500000, sourceClub: "Real Salt Lake", fee: 1350000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Noel Buck", age: 20, position: "CM", marketValue: 2000000, sourceClub: "New England", fee: 530000, mlsTeam: "St. Louis City", year: 2024 },
  { playerName: "Emmanuel Ochoa", age: 19, position: "GK", marketValue: 100000, sourceClub: "Cruz Azul U23", fee: 1900000, mlsTeam: "St. Louis City", year: 2024 },
  
  // San Diego FC
  { playerName: "Hirving Lozano", age: 29, position: "LW", marketValue: 12000000, sourceClub: "PSV", fee: 12000000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Anders Dreyer", age: 26, position: "RW", marketValue: 10000000, sourceClub: "RSC Anderlecht", fee: 5500000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Marcus Ingvartsen", age: 29, position: "CF", marketValue: 6000000, sourceClub: "Nordsjaelland", fee: 1500000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Andrés Reyes", age: 25, position: "CB", marketValue: 1500000, sourceClub: "NY Red Bulls", fee: 764000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Onni Valakari", age: 25, position: "AM", marketValue: 2000000, sourceClub: "Pafos", fee: 250000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Emmanuel Boateng", age: 30, position: "LM", marketValue: 300000, sourceClub: "New England", fee: 193000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Tomás Ángel", age: 21, position: "CF", marketValue: 450000, sourceClub: "LAFC", fee: 190000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Christopher McVey", age: 27, position: "CB", marketValue: 600000, sourceClub: "D.C. United", fee: 48000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Hosei Kijima", age: 22, position: "CM", marketValue: 400000, sourceClub: "D.C. United", fee: 380000, mlsTeam: "San Diego FC", year: 2024 },
  { playerName: "Thiago Andrade", age: 24, position: "LW", marketValue: 1000000, sourceClub: "Toronto", fee: 240000, mlsTeam: "San Diego FC", year: 2024 },
  
  // Seattle Sounders FC
  { playerName: "Jesús Ferreira", age: 24, position: "CF", marketValue: 5000000, sourceClub: "Dallas", fee: 1450000, mlsTeam: "Seattle Sounders", year: 2024 },
  { playerName: "Josh Atencio", age: 23, position: "DM", marketValue: 1500000, sourceClub: "Colorado", fee: 1250000, mlsTeam: "Seattle Sounders", year: 2024 },
  
  // Houston Dynamo FC
  { playerName: "Ezequiel Ponce", age: 27, position: "CF", marketValue: 5000000, sourceClub: "AEK Athens", fee: 9000000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Lawrence Ennali", age: 22, position: "LW", marketValue: 3000000, sourceClub: "Górnik Zabrze", fee: 2750000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Ondrej Lingr", age: 26, position: "AM", marketValue: 2700000, sourceClub: "Slavia Praha", fee: 2300000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Jack McGlynn", age: 21, position: "CM", marketValue: 4500000, sourceClub: "Philadelphia", fee: 2040000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Toyosi Olusanya", age: 27, position: "CF", marketValue: 800000, sourceClub: "St. Mirren", fee: 585000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Micael", age: 24, position: "CB", marketValue: 1000000, sourceClub: "Palmeiras", fee: 4800000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Adalberto Carrasquilla", age: 26, position: "CM", marketValue: 4500000, sourceClub: "UNAM Pumas", fee: 3400000, mlsTeam: "Houston Dynamo", year: 2024 },
  { playerName: "Ibrahim Aliyu", age: 23, position: "CF", marketValue: 3000000, sourceClub: "Columbus", fee: 395000, mlsTeam: "Houston Dynamo", year: 2024 },
  
  // FC Dallas
  { playerName: "Luciano Acosta", age: 30, position: "AM", marketValue: 8000000, sourceClub: "Cincinnati", fee: 5650000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Osaze Urhoghide", age: 24, position: "CB", marketValue: 600000, sourceClub: "Amiens SC", fee: 3000000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Patrickson Delgado", age: 21, position: "DM", marketValue: 800000, sourceClub: "Independiente", fee: 2500000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Anderson Julio", age: 28, position: "RW", marketValue: 3000000, sourceClub: "Real Salt Lake", fee: 384000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Shaq Moore", age: 28, position: "RB", marketValue: 1200000, sourceClub: "Nashville", fee: 48000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Alan Velasco", age: 22, position: "LW", marketValue: 4000000, sourceClub: "Boca Juniors", fee: 9600000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Jesús Ferreira", age: 24, position: "CF", marketValue: 5000000, sourceClub: "Seattle", fee: 1450000, mlsTeam: "FC Dallas", year: 2024 },
  { playerName: "Nkosi Tafari", age: 27, position: "CB", marketValue: 1800000, sourceClub: "LAFC", fee: 290000, mlsTeam: "FC Dallas", year: 2024 },
  
  // Real Salt Lake
  { playerName: "Diogo Gonçalves", age: 27, position: "LW", marketValue: 5500000, sourceClub: "Copenhagen", fee: 3000000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Dominik Marczuk", age: 20, position: "RW", marketValue: 3500000, sourceClub: "Jagiellonia", fee: 1500000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Elias Manoel", age: 23, position: "CF", marketValue: 2000000, sourceClub: "NY Red Bulls", fee: 671000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Lachlan Brook", age: 23, position: "RW", marketValue: 350000, sourceClub: "Western Sydney", fee: 450000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Ariath Piol", age: 20, position: "CF", marketValue: 250000, sourceClub: "Macarthur", fee: 450000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Willy Agada", age: 25, position: "CF", marketValue: 2000000, sourceClub: "Sporting KC", fee: 440000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Mason Stajduhar", age: 27, position: "GK", marketValue: 175000, sourceClub: "Orlando", fee: 49000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Tyler Wolff", age: 21, position: "RW", marketValue: 800000, sourceClub: "Atlanta", fee: 47000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Andrés Gómez", age: 21, position: "RW", marketValue: 5000000, sourceClub: "Stade Rennais", fee: 10000000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Fidel Barajas", age: 18, position: "RW", marketValue: 2000000, sourceClub: "Chivas", fee: 4000000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Cristian Arango", age: 29, position: "CF", marketValue: 7500000, sourceClub: "SJ Earthquakes", fee: 1350000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Elias Manoel", age: 23, position: "CF", marketValue: 2000000, sourceClub: "Botafogo", fee: 900000, mlsTeam: "Real Salt Lake", year: 2024 },
  { playerName: "Anderson Julio", age: 28, position: "RW", marketValue: 3000000, sourceClub: "Dallas", fee: 384000, mlsTeam: "Real Salt Lake", year: 2024 },
  
  // Vancouver Whitecaps FC
  { playerName: "Édier Ocampo", age: 20, position: "RB", marketValue: 1200000, sourceClub: "Atl. Nacional", fee: 1600000, mlsTeam: "Vancouver Whitecaps", year: 2024 },
  { playerName: "Emmanuel Sabbi", age: 27, position: "RW", marketValue: 2000000, sourceClub: "Le Havre AC", fee: 1000000, mlsTeam: "Vancouver Whitecaps", year: 2024 },
  { playerName: "Jayden Nelson", age: 22, position: "LW", marketValue: 1500000, sourceClub: "Rosenborg", fee: 350000, mlsTeam: "Vancouver Whitecaps", year: 2024 },
  { playerName: "Deiber Caicedo", age: 24, position: "LW", marketValue: 2000000, sourceClub: "Junior FC", fee: 975000, mlsTeam: "Vancouver Whitecaps", year: 2024 },
  { playerName: "Stuart Armstrong", age: 32, position: "CM", marketValue: 1500000, sourceClub: "Sheffield Wed", fee: 580000, mlsTeam: "Vancouver Whitecaps", year: 2024 },
  
  // Portland Timbers
  { playerName: "Kevin Kelsy", age: 20, position: "CF", marketValue: 2500000, sourceClub: "Shakhtar D.", fee: 6000000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "David Da Costa", age: 24, position: "AM", marketValue: 7000000, sourceClub: "Lens", fee: 5740000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Joao Ortiz", age: 28, position: "DM", marketValue: 2200000, sourceClub: "Independiente", fee: 1500000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Jimer Fory", age: 22, position: "LB", marketValue: 800000, sourceClub: "Indep. Medellín", fee: 1450000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Finn Surman", age: 20, position: "CB", marketValue: 400000, sourceClub: "Wellington", fee: 500000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Mason Toye", age: 25, position: "CF", marketValue: 1000000, sourceClub: "Montréal", fee: 185000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Omir Fernandez", age: 26, position: "RW", marketValue: 2500000, sourceClub: "Colorado", fee: 176000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Evander", age: 26, position: "AM", marketValue: 14000000, sourceClub: "Cincinnati", fee: 11500000, mlsTeam: "Portland Timbers", year: 2024 },
  { playerName: "Eryk Williamson", age: 27, position: "CM", marketValue: 1200000, sourceClub: "Charlotte", fee: 97000, mlsTeam: "Portland Timbers", year: 2024 },
  
  // Sporting Kansas City
  { playerName: "Dejan Joveljić", age: 25, position: "CF", marketValue: 6500000, sourceClub: "LA Galaxy", fee: 3850000, mlsTeam: "Sporting KC", year: 2024 },
  { playerName: "Manu García", age: 27, position: "AM", marketValue: 3000000, sourceClub: "Aris Saloniki", fee: 3600000, mlsTeam: "Sporting KC", year: 2024 },
  { playerName: "Shapi Suleymanov", age: 25, position: "RW", marketValue: 1800000, sourceClub: "Aris Saloniki", fee: 2400000, mlsTeam: "Sporting KC", year: 2024 },
  { playerName: "Alan Pulido", age: 33, position: "CF", marketValue: 1500000, sourceClub: "Chivas", fee: 1450000, mlsTeam: "Sporting KC", year: 2024 },
  { playerName: "Kayden Pierre", age: 21, position: "RB", marketValue: 800000, sourceClub: "Genk", fee: 1000000, mlsTeam: "Sporting KC", year: 2024 },
  { playerName: "Willy Agada", age: 25, position: "CF", marketValue: 2000000, sourceClub: "Real Salt Lake", fee: 440000, mlsTeam: "Sporting KC", year: 2024 },
  
  // Colorado Rapids
  { playerName: "Rafael Navarro", age: 24, position: "CF", marketValue: 5000000, sourceClub: "Palmeiras", fee: 4500000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Josh Atencio", age: 23, position: "DM", marketValue: 1500000, sourceClub: "Seattle", fee: 1250000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Theodore Ku-DiPietro", age: 23, position: "AM", marketValue: 2500000, sourceClub: "D.C. United", fee: 1100000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Chidozie Awaziem", age: 27, position: "CB", marketValue: 2000000, sourceClub: "Cincinnati", fee: 850000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Ian Murphy", age: 24, position: "CB", marketValue: 1200000, sourceClub: "Cincinnati", fee: 475000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Bryce Jamison", age: 19, position: "RW", marketValue: 450000, sourceClub: "Orange County", fee: 365000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Moïse Bombito", age: 24, position: "CB", marketValue: 4500000, sourceClub: "Nice", fee: 7000000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Miguel Navarro", age: 25, position: "LB", marketValue: 2200000, sourceClub: "CA Talleres", fee: 1750000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Marko Ilic", age: 26, position: "GK", marketValue: 800000, sourceClub: "Red Star", fee: 200000, mlsTeam: "Colorado Rapids", year: 2024 },
  { playerName: "Omir Fernandez", age: 26, position: "RW", marketValue: 2500000, sourceClub: "Portland", fee: 176000, mlsTeam: "Colorado Rapids", year: 2024 },
  
  // Los Angeles Galaxy
  { playerName: "Lucas Sanabria", age: 21, position: "DM", marketValue: 3000000, sourceClub: "Nacional", fee: 4800000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Elijah Wynder", age: 21, position: "CM", marketValue: 400000, sourceClub: "Louisville City", fee: 380000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Christian Ramirez", age: 33, position: "CF", marketValue: 500000, sourceClub: "Columbus", fee: 240000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Sean Davis", age: 31, position: "CM", marketValue: 1200000, sourceClub: "Nashville", fee: 96000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Dejan Joveljić", age: 25, position: "CF", marketValue: 6500000, sourceClub: "Sporting KC", fee: 3850000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Jalen Neal", age: 21, position: "CB", marketValue: 800000, sourceClub: "Montréal", fee: 625000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Mark Delgado", age: 29, position: "CM", marketValue: 2000000, sourceClub: "LAFC", fee: 385000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Daniel Aguirre", age: 24, position: "CM", marketValue: 300000, sourceClub: "Chivas", fee: 225000, mlsTeam: "LA Galaxy", year: 2024 },
  { playerName: "Aaron Bibout", age: 20, position: "CF", marketValue: 150000, sourceClub: "Västerås SK", fee: 100000, mlsTeam: "LA Galaxy", year: 2024 },
];

// Convert EUR to USD and create properly formatted transfer records
export const SCRAPED_TRANSFERS: TransferRecord[] = rawTransfers.map(t => ({
  playerName: t.playerName,
  age: t.age,
  position: t.position,
  sourceCountry: inferCountryFromClub(t.sourceClub),
  sourceClub: t.sourceClub,
  mlsTeam: t.mlsTeam,
  fee: Math.round(t.fee * EUR_TO_USD),
  marketValue: Math.round(t.marketValue * EUR_TO_USD),
  transferType: t.fee === 0 ? 'free' : 'permanent' as const,
  year: t.year,
}));

// Helper function to infer country from club name
function inferCountryFromClub(club: string): string {
  const clubToCountry: Record<string, string> = {
    // England
    'Middlesbrough': 'England', 'Newcastle': 'England', 'Chelsea': 'England',
    'Watford': 'England', 'Crystal Palace': 'England', 'Bournemouth': 'England',
    'Brighton': 'England', 'Tottenham': 'England', 'Sheffield Wed': 'England',
    
    // Spain
    'Granada CF': 'Spain', 'Celta de Vigo': 'Spain', 'Real Valladolid': 'Spain',
    'Real Betis': 'Spain', 'Barcelona': 'Spain', 'Real Madrid': 'Spain',
    'Atlético Madrid': 'Spain',
    
    // Italy
    'Atalanta': 'Italy', 'Genoa': 'Italy', 'AC Milan': 'Italy',
    'Juventus': 'Italy', 'Napoli': 'Italy',
    
    // Germany
    'Dortmund': 'Germany', 'RB Leipzig': 'Germany', 'FC Bayern II': 'Germany',
    'Holstein Kiel': 'Germany',
    
    // France
    'PSG': 'France', 'Nice': 'France', 'Saint-Étienne': 'France',
    'Lens': 'France', 'Amiens SC': 'France', 'FC Metz': 'France',
    'Le Havre AC': 'France', 'Stade Rennais': 'France',
    
    // Belgium
    'Club Brugge': 'Belgium', 'Cercle Brugge': 'Belgium', 'Standard Liège': 'Belgium',
    'Union SG': 'Belgium', 'KAA Gent': 'Belgium', 'Royal Antwerp': 'Belgium',
    'RSC Anderlecht': 'Belgium', 'Genk': 'Belgium',
    
    // Netherlands
    'PSV': 'Netherlands',
    
    // Portugal
    'Leiria': 'Portugal', 'Boavista': 'Portugal', 'Casa Pia': 'Portugal',
    'Farense': 'Portugal', 'Estrela Amadora': 'Portugal',
    
    // Brazil
    'Botafogo': 'Brazil', 'Vasco da Gama': 'Brazil', 'Palmeiras': 'Brazil',
    'Corinthians': 'Brazil', 'EC Bahia': 'Brazil', 'Fortaleza': 'Brazil',
    'Grêmio': 'Brazil', 'Atlético Mineiro': 'Brazil',
    
    // Argentina
    'Racing Club': 'Argentina', 'Boca Juniors': 'Argentina', 'River Plate': 'Argentina',
    'Vélez': 'Argentina', 'Independiente': 'Argentina', 'Godoy Cruz': 'Argentina',
    'Estudiantes LP': 'Argentina', 'San Lorenzo': 'Argentina', 'Lanús': 'Argentina',
    'Atl. Tucumán': 'Argentina', 'Instituto ACC': 'Argentina', 'CA Talleres': 'Argentina',
    
    // Mexico
    'Monterrey': 'Mexico', 'Cruz Azul': 'Mexico', 'Tigres': 'Mexico',
    'Atlas': 'Mexico', 'Chivas': 'Mexico', 'UNAM Pumas': 'Mexico',
    'Toluca': 'Mexico', 'Cruz Azul U23': 'Mexico',
    
    // Serbia
    'Red Star': 'Serbia', 'Partizan': 'Serbia', 'Spartak': 'Serbia',
    
    // Ukraine
    'SC Dnipro-1': 'Ukraine', 'Metalist': 'Ukraine', 'Shakhtar D.': 'Ukraine',
    'Polissya': 'Ukraine',
    
    // Denmark
    'Copenhagen': 'Denmark', 'Nordsjaelland': 'Denmark', 'Brøndby': 'Denmark',
    'Randers FC': 'Denmark',
    
    // Sweden
    'Häcken': 'Sweden', 'AIK': 'Sweden', 'Västerås SK': 'Sweden',
    'Elfsborg': 'Sweden', 'Djurgårdens IF': 'Sweden',
    
    // Norway
    'Lillestrom': 'Norway', 'Kristiansund': 'Norway', 'Rosenborg': 'Norway',
    'Viking': 'Norway',
    
    // Croatia
    'HNK Rijeka': 'Croatia',
    
    // Greece
    'PAOK': 'Greece', 'Panathinaikos': 'Greece', 'AEK Athens': 'Greece',
    'Aris Saloniki': 'Greece',
    
    // Poland
    'Miedz Legnica': 'Poland', 'Górnik Zabrze': 'Poland', 'Jagiellonia': 'Poland',
    'Radomiak': 'Poland',
    
    // Czech Republic
    'Slavia Praha': 'Czech Republic',
    
    // Scotland
    'Celtic': 'Scotland', 'Aberdeen FC': 'Scotland', 'Heart of Midl.': 'Scotland',
    'St. Mirren': 'Scotland',
    
    // Turkey
    'Fenerbahçe': 'Turkey', 'Galatasaray': 'Turkey',
    
    // Austria
    'Sturm Graz': 'Austria',
    
    // Switzerland
    'Basel': 'Switzerland', 'Grasshopper': 'Switzerland',
    
    // Colombia
    'Atl. Nacional': 'Colombia', 'Junior FC': 'Colombia', 'Deportivo Cali': 'Colombia',
    'Indep. Medellín': 'Colombia', 'Millonarios': 'Colombia',
    
    // Uruguay
    'Nacional': 'Uruguay', 'Peñarol': 'Uruguay',
    
    // Chile
    'Colo-Colo': 'Chile',
    
    // Paraguay
    'Club América': 'Paraguay',
    
    // Slovenia
    'NK Maribor': 'Slovenia',
    
    // Finland
    'HJK Helsinki': 'Finland',
    
    // Hungary
    'Honvéd': 'Hungary',
    
    // Israel
    'Maccabi Haifa': 'Israel', 'Maccabi Netanya': 'Israel',
    
    // Bulgaria
    'Ludogorets': 'Bulgaria', 'Arda Kardzhali': 'Bulgaria',
    
    // South Korea
    'Jeonbuk Hyundai': 'South Korea', 'Gwangju FC': 'South Korea',
    
    // Japan
    'Cerezo Osaka': 'Japan',
    
    // Australia
    'Sydney FC': 'Australia', 'Western Sydney': 'Australia', 'Macarthur': 'Australia',
    
    // New Zealand
    'Wellington': 'New Zealand',
    
    // Cyprus
    'Pafos': 'Cyprus',
    
    // Saudi Arabia
    'Al-Okhdood': 'Saudi Arabia',
    
    // Canada
    'Pacific FC': 'Canada',
    
    // MLS Internal
    'St. Louis CITY': 'USA (MLS)', 'Real Salt Lake': 'USA (MLS)', 'Louisville City': 'USA (MLS)',
    'Austin': 'USA (MLS)', 'Inter Miami': 'USA (MLS)', 'Miami': 'USA (MLS)',
    'Portland': 'USA (MLS)', 'Columbus': 'USA (MLS)', 'Dallas': 'USA (MLS)',
    'Houston': 'USA (MLS)', 'LA Galaxy': 'USA (MLS)', 'LAFC': 'USA (MLS)',
    'Cincinnati': 'USA (MLS)', 'Colorado': 'USA (MLS)', 'D.C. United': 'USA (MLS)',
    'Montréal': 'USA (MLS)', 'Toronto': 'USA (MLS)', 'San Diego': 'USA (MLS)',
    'Philadelphia': 'USA (MLS)', 'New England': 'USA (MLS)', 'SJ Earthquakes': 'USA (MLS)',
    'Charlotte': 'USA (MLS)', 'Chicago': 'USA (MLS)', 'Minnesota': 'USA (MLS)',
    'NY Red Bulls': 'USA (MLS)', 'Seattle': 'USA (MLS)', 'Nashville': 'USA (MLS)',
    'Atlanta': 'USA (MLS)', 'Orlando': 'USA (MLS)', 'Sporting KC': 'USA (MLS)',
    'Orange County': 'USA (USL)', 'Legion FC': 'USA (USL)', 'New Mexico Utd.': 'USA (USL)',
  };
  
  return clubToCountry[club] || 'International';
}

// Calculate totals
export function getTransferStats() {
  const totalSpend = SCRAPED_TRANSFERS.reduce((sum, t) => sum + t.fee, 0);
  const paidTransfers = SCRAPED_TRANSFERS.filter(t => t.fee > 0).length;
  const freeTransfers = SCRAPED_TRANSFERS.filter(t => t.fee === 0).length;
  
  return {
    totalTransfers: SCRAPED_TRANSFERS.length,
    totalSpend,
    paidTransfers,
    freeTransfers,
    avgFee: paidTransfers > 0 ? totalSpend / paidTransfers : 0,
  };
}

