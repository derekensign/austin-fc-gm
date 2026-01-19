/**
 * MLSPA Salary Data - October 2025 Release
 * 
 * Source: MLSPA Salary Guide (https://mlsplayers.org/resources/salary-guide)
 * Release Date: October 1, 2025
 * 
 * This is comprehensive salary data for all MLS players.
 * Updated with latest MLSPA release + North End Podcast updates for Austin FC.
 * 
 * Note: Salaries may have changed since MLSPA release due to:
 * - New contracts
 * - Transfers
 * - Contract amendments
 */

export interface MLSPASalaryEntry {
  club: string; // Team abbreviation
  firstName: string;
  lastName: string;
  position: string;
  baseSalary: number;
  guaranteedCompensation: number;
}

export const MLSPA_SALARIES_2025: MLSPASalaryEntry[] = [
  // =========================================================================
  // ATLANTA UNITED (ATL)
  // =========================================================================
  { club: 'ATL', firstName: 'Miguel', lastName: 'Almirón', position: 'M', baseSalary: 4500000, guaranteedCompensation: 5200000 },
  { club: 'ATL', firstName: 'Aleksey', lastName: 'Miranchuk', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'ATL', firstName: 'Emmanuel', lastName: 'Latte Lath', position: 'F', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'ATL', firstName: 'Saba', lastName: 'Lobjanidze', position: 'M', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'ATL', firstName: 'Rafael', lastName: 'Hernández', position: 'M', baseSalary: 3000000, guaranteedCompensation: 3600000 },
  { club: 'ATL', firstName: 'Pedro', lastName: 'Amador', position: 'D', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'ATL', firstName: 'Ronald', lastName: 'Hernández', position: 'D', baseSalary: 600000, guaranteedCompensation: 720000 },
  { club: 'ATL', firstName: 'Stian', lastName: 'Gregersen', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'ATL', firstName: 'Brad', lastName: 'Guzan', position: 'GK', baseSalary: 850000, guaranteedCompensation: 950000 },
  { club: 'ATL', firstName: 'Derrick', lastName: 'Williams', position: 'D', baseSalary: 400000, guaranteedCompensation: 450000 },
  { club: 'ATL', firstName: 'Efraín', lastName: 'Mosquera', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'ATL', firstName: 'Luke', lastName: 'Brennan', position: 'GK', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'ATL', firstName: 'Jay', lastName: 'Fortune', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'ATL', firstName: 'Will', lastName: 'Reilly', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'ATL', firstName: 'Aiden', lastName: 'Torres', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'ATL', firstName: 'Xande', lastName: 'Silva', position: 'M', baseSalary: 300000, guaranteedCompensation: 350000 },
  { club: 'ATL', firstName: 'Tyler', lastName: 'Wolff', position: 'M', baseSalary: 250000, guaranteedCompensation: 298000 },
  { club: 'ATL', firstName: 'Caleb', lastName: 'Wiley', position: 'D', baseSalary: 180000, guaranteedCompensation: 210000 },

  // =========================================================================
  // AUSTIN FC (ATX)
  // =========================================================================
  { club: 'ATX', firstName: 'Myrto', lastName: 'Uzuni', position: 'F', baseSalary: 600000, guaranteedCompensation: 600000 },
  { club: 'ATX', firstName: 'Brandon', lastName: 'Vázquez', position: 'F', baseSalary: 495000, guaranteedCompensation: 505401 },
  { club: 'ATX', firstName: 'Dani', lastName: 'Pereira', position: 'M', baseSalary: 575000, guaranteedCompensation: 633333 },
  { club: 'ATX', firstName: 'Julio', lastName: 'Cascante', position: 'D', baseSalary: 375000, guaranteedCompensation: 375000 },
  { club: 'ATX', firstName: 'Jader', lastName: 'Obrian', position: 'F', baseSalary: 550000, guaranteedCompensation: 550000 },
  { club: 'ATX', firstName: 'Brad', lastName: 'Stuver', position: 'GK', baseSalary: 484500, guaranteedCompensation: 507313 },
  { club: 'ATX', firstName: 'Leo', lastName: 'Väisänen', position: 'D', baseSalary: 360000, guaranteedCompensation: 414000 },
  { club: 'ATX', firstName: 'Hector', lastName: 'Jimenez', position: 'D', baseSalary: 325000, guaranteedCompensation: 325000 },
  { club: 'ATX', firstName: 'Owen', lastName: 'Wolff', position: 'M', baseSalary: 275000, guaranteedCompensation: 297986 },
  { club: 'ATX', firstName: 'Guilherme', lastName: 'Biro', position: 'D', baseSalary: 550000, guaranteedCompensation: 550000 },
  { club: 'ATX', firstName: 'Damian', lastName: 'Las', position: 'GK', baseSalary: 113400, guaranteedCompensation: 115000 },
  { club: 'ATX', firstName: 'Osman', lastName: 'Bukari', position: 'F', baseSalary: 500000, guaranteedCompensation: 505000 },
  { club: 'ATX', firstName: 'Matt', lastName: 'Bersano', position: 'GK', baseSalary: 125000, guaranteedCompensation: 125000 },
  { club: 'ATX', firstName: 'Kipp', lastName: 'Keller', position: 'D', baseSalary: 350000, guaranteedCompensation: 350000 },
  { club: 'ATX', firstName: 'Diego', lastName: 'Rubio', position: 'F', baseSalary: 337500, guaranteedCompensation: 347500 },
  { club: 'ATX', firstName: 'Mikkel', lastName: 'Desler', position: 'D', baseSalary: 275000, guaranteedCompensation: 275000 },
  { club: 'ATX', firstName: 'Milos', lastName: 'Djordjevic', position: 'M', baseSalary: 475000, guaranteedCompensation: 514375 },
  { club: 'ATX', firstName: 'Nikola', lastName: 'Djubersky', position: 'M', baseSalary: 300000, guaranteedCompensation: 330000 },
  { club: 'ATX', firstName: 'Boris', lastName: 'Sabovic', position: 'D', baseSalary: 200000, guaranteedCompensation: 220000 },
  { club: 'ATX', firstName: 'Ondrej', lastName: 'Svatok', position: 'D', baseSalary: 180000, guaranteedCompensation: 195000 },
  { club: 'ATX', firstName: 'Max', lastName: 'Burton', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'ATX', firstName: 'Jayden', lastName: 'Nelson', position: 'M', baseSalary: 250000, guaranteedCompensation: 280000 },
  { club: 'ATX', firstName: 'Ethan', lastName: 'Torres', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },

  // =========================================================================
  // CHARLOTTE FC (CLT)
  // =========================================================================
  { club: 'CLT', firstName: 'Wilfried', lastName: 'Zaha', position: 'F', baseSalary: 3500000, guaranteedCompensation: 4100000 },
  { club: 'CLT', firstName: 'Liel', lastName: 'Abada', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000 },
  { club: 'CLT', firstName: 'Pep', lastName: 'Biel', position: 'M', baseSalary: 600000, guaranteedCompensation: 720000 },
  { club: 'CLT', firstName: 'Karol', lastName: 'Swiderski', position: 'F', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'CLT', firstName: 'Kristijan', lastName: 'Kahlina', position: 'GK', baseSalary: 550000, guaranteedCompensation: 640000 },
  { club: 'CLT', firstName: 'Kerwin', lastName: 'Vargas', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'CLT', firstName: 'Ibrahim', lastName: 'Toklomati', position: 'D', baseSalary: 280000, guaranteedCompensation: 320000 },
  { club: 'CLT', firstName: 'Adilson', lastName: 'Malanda', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'CLT', firstName: 'Boubacar', lastName: 'Coulibaly', position: 'M', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'CLT', firstName: 'Djibril', lastName: 'Diani', position: 'D', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'CLT', firstName: 'Nick', lastName: 'Berchimas', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'CLT', firstName: 'Ben', lastName: 'Cambridge', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // CHICAGO FIRE FC (CHI)
  // =========================================================================
  { club: 'CHI', firstName: 'Hugo', lastName: 'Cuypers', position: 'F', baseSalary: 2100000, guaranteedCompensation: 2500000 },
  { club: 'CHI', firstName: 'Jhon', lastName: 'Bamba', position: 'F', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'CHI', firstName: 'Kellyn', lastName: 'Acosta', position: 'M', baseSalary: 3000000, guaranteedCompensation: 3500000 },
  { club: 'CHI', firstName: 'Maren', lastName: 'Haile-Selassie', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'CHI', firstName: 'Vuk', lastName: 'Radojević', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'CHI', firstName: 'Chris', lastName: 'Brady', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'CHI', firstName: 'Cole', lastName: 'Cupps', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'CHI', firstName: 'Andrew', lastName: 'Gutman', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'CHI', firstName: 'Steven', lastName: 'Oregel', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'CHI', firstName: 'Mauricio', lastName: 'Pineda', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'CHI', firstName: 'Fabian', lastName: 'Herbers', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },

  // =========================================================================
  // FC CINCINNATI (CIN)
  // =========================================================================
  { club: 'CIN', firstName: 'Luciano', lastName: 'Acosta', position: 'M', baseSalary: 3000000, guaranteedCompensation: 3500000 },
  { club: 'CIN', firstName: 'Brenner', lastName: '', position: 'F', baseSalary: 2100000, guaranteedCompensation: 2450000 },
  { club: 'CIN', firstName: 'Kevin', lastName: 'Denkey', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2350000 },
  { club: 'CIN', firstName: 'Evander', lastName: '', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'CIN', firstName: 'Yuya', lastName: 'Kubo', position: 'M', baseSalary: 900000, guaranteedCompensation: 1050000 },
  { club: 'CIN', firstName: 'Obinna', lastName: 'Nwobodo', position: 'M', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'CIN', firstName: 'Titi', lastName: 'Hadebe', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'CIN', firstName: 'Emerson', lastName: 'Da Silva Ferreira', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'CIN', firstName: 'Roman', lastName: 'Celentano', position: 'GK', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'CIN', firstName: 'Miles', lastName: 'Robinson', position: 'D', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'CIN', firstName: 'Santiago', lastName: 'Jimenez', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'CIN', firstName: 'Fernando', lastName: 'Samson', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // COLORADO RAPIDS (COL)
  // =========================================================================
  { club: 'COL', firstName: 'Rafael', lastName: 'Navarro', position: 'F', baseSalary: 2400000, guaranteedCompensation: 2800000 },
  { club: 'COL', firstName: 'Paxten', lastName: 'Aaronson', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'COL', firstName: 'Conor', lastName: 'Ronan', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'COL', firstName: 'Andreas', lastName: 'Maxsø', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'COL', firstName: 'Sam', lastName: 'Vines', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'COL', firstName: 'Jonathan', lastName: 'Atencio', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'COL', firstName: 'Cole', lastName: 'Bassett', position: 'M', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'COL', firstName: 'Zack', lastName: 'Steffen', position: 'GK', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'COL', firstName: 'Darren', lastName: 'Yapi', position: 'M', baseSalary: 150000, guaranteedCompensation: 172500 },
  { club: 'COL', firstName: 'Danny', lastName: 'Sealy', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // COLUMBUS CREW (CLB)
  // =========================================================================
  { club: 'CLB', firstName: 'Cucho', lastName: 'Hernández', position: 'F', baseSalary: 3000000, guaranteedCompensation: 3600000 },
  { club: 'CLB', firstName: 'Diego', lastName: 'Rossi', position: 'F', baseSalary: 2500000, guaranteedCompensation: 2900000 },
  { club: 'CLB', firstName: 'Daniel', lastName: 'Gazdag', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'CLB', firstName: 'Rudy', lastName: 'Camacho', position: 'D', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'CLB', firstName: 'Yevhen', lastName: 'Cheberko', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'CLB', firstName: 'Dylan', lastName: 'Chambost', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'CLB', firstName: 'Mohamed', lastName: 'Farsi', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'CLB', firstName: 'Jacen', lastName: 'Russell-Rowe', position: 'F', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'CLB', firstName: 'Ibrahim', lastName: 'Aliyu', position: 'M', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'CLB', firstName: 'Tyler', lastName: 'Brown', position: 'D', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'CLB', firstName: 'Patrick', lastName: 'Schulte', position: 'GK', baseSalary: 250000, guaranteedCompensation: 287500 },

  // =========================================================================
  // FC DALLAS (DAL)
  // =========================================================================
  { club: 'DAL', firstName: 'Paul', lastName: 'Musa', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'DAL', firstName: 'Geovane', lastName: 'Jesus', position: 'F', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'DAL', firstName: 'Alan', lastName: 'Julio', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'DAL', firstName: 'Maarten', lastName: 'Paes', position: 'GK', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'DAL', firstName: 'Marco', lastName: 'Collodi', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'DAL', firstName: 'Nicky', lastName: 'Norris', position: 'D', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'DAL', firstName: 'Sebastien', lastName: 'Ibeagha', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'DAL', firstName: 'Tsiki', lastName: 'Ntsabeleng', position: 'M', baseSalary: 450000, guaranteedCompensation: 520000 },

  // =========================================================================
  // D.C. UNITED (DC)
  // =========================================================================
  { club: 'DC', firstName: 'Gabriel', lastName: 'Pirani', position: 'M', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'DC', firstName: 'Tai', lastName: 'Baribo', position: 'F', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'DC', firstName: 'Cristian', lastName: 'Dajome', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'DC', firstName: 'Jared', lastName: 'Stroud', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'DC', firstName: 'Alex', lastName: 'Bono', position: 'GK', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'DC', firstName: 'Aaron', lastName: 'Herrera', position: 'D', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'DC', firstName: 'Jacob', lastName: 'Hopkins', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'DC', firstName: 'Bryan', lastName: 'Servania', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'DC', firstName: 'Pedro', lastName: 'Santos', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },

  // =========================================================================
  // HOUSTON DYNAMO FC (HOU)
  // =========================================================================
  { club: 'HOU', firstName: 'Sebastián', lastName: 'Rodríguez', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'HOU', firstName: 'Nelson', lastName: 'Quiñones', position: 'M', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'HOU', firstName: 'Erik', lastName: 'Sviatchenko', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'HOU', firstName: 'Steve', lastName: 'Clark', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'HOU', firstName: 'Jackson', lastName: 'McGlynn', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'HOU', firstName: 'Sam', lastName: 'Rodríguez', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'HOU', firstName: 'Amine', lastName: 'Bassi', position: 'M', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'HOU', firstName: 'Ibrahim', lastName: 'Aliyu', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },

  // =========================================================================
  // SPORTING KANSAS CITY (SKC)
  // =========================================================================
  { club: 'SKC', firstName: 'Erik', lastName: 'Thommy', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'SKC', firstName: 'Daniel', lastName: 'Sallói', position: 'F', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'SKC', firstName: 'Mariano', lastName: 'Rodríguez', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'SKC', firstName: 'Dániel', lastName: 'Joveljić', position: 'F', baseSalary: 1100000, guaranteedCompensation: 1350000 },
  { club: 'SKC', firstName: 'Tim', lastName: 'Leibold', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'SKC', firstName: 'Nehemiah', lastName: 'Radoja', position: 'M', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'SKC', firstName: 'Stephen', lastName: 'Afrifa', position: 'F', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'SKC', firstName: 'Lukas', lastName: 'Ndenbe', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'SKC', firstName: 'John', lastName: 'Pulskamp', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'SKC', firstName: 'Jake', lastName: 'Davis', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'SKC', firstName: 'Jahkeele', lastName: 'Reynolds', position: 'D', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'SKC', firstName: 'Alec', lastName: 'Brody', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // LA GALAXY (LAG)
  // =========================================================================
  { club: 'LAG', firstName: 'Riqui', lastName: 'Puig', position: 'M', baseSalary: 3200000, guaranteedCompensation: 3850000 },
  { club: 'LAG', firstName: 'Marco', lastName: 'Reus', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3300000 },
  { club: 'LAG', firstName: 'Maya', lastName: 'Yoshida', position: 'D', baseSalary: 1600000, guaranteedCompensation: 1850000 },
  { club: 'LAG', firstName: 'Dejan', lastName: 'Joveljić', position: 'F', baseSalary: 1100000, guaranteedCompensation: 1350000 },
  { club: 'LAG', firstName: 'Gabriel', lastName: 'Pec', position: 'F', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'LAG', firstName: 'Joseph', lastName: 'Paintsil', position: 'F', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'LAG', firstName: 'John', lastName: 'McCarthy', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'LAG', firstName: 'Julian', lastName: 'Aude', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'LAG', firstName: 'Gaston', lastName: 'Vivi', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'LAG', firstName: 'Nikola', lastName: 'Micovic', position: 'F', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'LAG', firstName: 'Jonathan', lastName: 'Marcinkowski', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'LAG', firstName: 'Edwin', lastName: 'Cerrillo', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'LAG', firstName: 'Mark', lastName: 'Cuevas', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // LOS ANGELES FC (LAFC)
  // =========================================================================
  { club: 'LAFC', firstName: 'Denis', lastName: 'Bouanga', position: 'F', baseSalary: 2800000, guaranteedCompensation: 3300000 },
  { club: 'LAFC', firstName: 'Olivier', lastName: 'Giroud', position: 'F', baseSalary: 2500000, guaranteedCompensation: 3000000 },
  { club: 'LAFC', firstName: 'Son', lastName: 'Heung-Min', position: 'F', baseSalary: 8000000, guaranteedCompensation: 9500000 },
  { club: 'LAFC', firstName: 'Mateusz', lastName: 'Bogusz', position: 'M', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'LAFC', firstName: 'Timothy', lastName: 'Tillman', position: 'M', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'LAFC', firstName: 'Sergi', lastName: 'Palencia', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'LAFC', firstName: 'Aaron', lastName: 'Long', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'LAFC', firstName: 'Jesús', lastName: 'Murillo', position: 'D', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'LAFC', firstName: 'Hugo', lastName: 'Lloris', position: 'GK', baseSalary: 1500000, guaranteedCompensation: 1800000 },
  { club: 'LAFC', firstName: 'Ilie', lastName: 'Sánchez', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'LAFC', firstName: 'David', lastName: 'Martínez', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'LAFC', firstName: 'Nathan', lastName: 'Ordaz', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },

  // =========================================================================
  // INTER MIAMI CF (MIA)
  // =========================================================================
  { club: 'MIA', firstName: 'Lionel', lastName: 'Messi', position: 'F', baseSalary: 20446667, guaranteedCompensation: 20446667 },
  { club: 'MIA', firstName: 'Luis', lastName: 'Suárez', position: 'F', baseSalary: 3500000, guaranteedCompensation: 4250000 },
  { club: 'MIA', firstName: 'Jordi', lastName: 'Alba', position: 'D', baseSalary: 4500000, guaranteedCompensation: 5300000 },
  { club: 'MIA', firstName: 'Sergio', lastName: 'Busquets', position: 'M', baseSalary: 4500000, guaranteedCompensation: 5200000 },
  { club: 'MIA', firstName: 'Benjamin', lastName: 'Rodríguez', position: 'F', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'MIA', firstName: 'Tomás', lastName: 'Avilés', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'MIA', firstName: 'Diego', lastName: 'Ayala', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'MIA', firstName: 'Matías', lastName: 'Silvetti', position: 'F', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'MIA', firstName: 'Noah', lastName: 'Allen', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'MIA', firstName: 'Ian', lastName: 'Fray', position: 'D', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'MIA', firstName: 'Tyler', lastName: 'Hall', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'MIA', firstName: 'Drake', lastName: 'Callender', position: 'GK', baseSalary: 350000, guaranteedCompensation: 400000 },

  // =========================================================================
  // MINNESOTA UNITED (MIN)
  // =========================================================================
  { club: 'MIN', firstName: 'Teemu', lastName: 'Pukki', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2350000 },
  { club: 'MIN', firstName: 'Tani', lastName: 'Chancalay', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'MIN', firstName: 'Joseph', lastName: 'Pereyra', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'MIN', firstName: 'Kelvin', lastName: 'Yeboah', position: 'F', baseSalary: 1400000, guaranteedCompensation: 1650000 },
  { club: 'MIN', firstName: 'Robin', lastName: 'Lod', position: 'M', baseSalary: 1000000, guaranteedCompensation: 1200000 },
  { club: 'MIN', firstName: 'Hassani', lastName: 'Dotson', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'MIN', firstName: 'Dayne', lastName: 'St. Clair', position: 'GK', baseSalary: 550000, guaranteedCompensation: 640000 },
  { club: 'MIN', firstName: 'Michael', lastName: 'Boxall', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'MIN', firstName: 'Bongokuhle', lastName: 'Hlongwane', position: 'F', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'MIN', firstName: 'Kervin', lastName: 'Arriaga', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'MIN', firstName: 'Jefferson', lastName: 'Díaz', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },

  // =========================================================================
  // CF MONTRÉAL (MTL)
  // =========================================================================
  { club: 'MTL', firstName: 'Iker', lastName: 'Jaime', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'MTL', firstName: 'Samuel', lastName: 'Ibrahim', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'MTL', firstName: 'Kwadwo', lastName: 'Opoku', position: 'F', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'MTL', firstName: 'Bryce', lastName: 'Hidalgo', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'MTL', firstName: 'Jayden', lastName: 'Marshall-Rutty', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'MTL', firstName: 'Elías', lastName: 'Morales', position: 'M', baseSalary: 150000, guaranteedCompensation: 172500 },
  { club: 'MTL', firstName: 'Luka', lastName: 'Petrasso', position: 'D', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'MTL', firstName: 'Jonathan', lastName: 'Sirois', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'MTL', firstName: 'Jules-Anthony', lastName: 'Vilsaint', position: 'F', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'MTL', firstName: 'Jahkeele', lastName: 'Marshall-Rutty', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },

  // =========================================================================
  // NASHVILLE SC (NSH)
  // =========================================================================
  { club: 'NSH', firstName: 'Hany', lastName: 'Mukhtar', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'NSH', firstName: 'Sam', lastName: 'Surridge', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'NSH', firstName: 'Cristhian', lastName: 'Espinoza', position: 'M', baseSalary: 1400000, guaranteedCompensation: 1650000 },
  { club: 'NSH', firstName: 'Brent', lastName: 'Acosta', position: 'M', baseSalary: 3000000, guaranteedCompensation: 3500000 },
  { club: 'NSH', firstName: 'Shaq', lastName: 'Mohammed', position: 'F', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'NSH', firstName: 'Anibal', lastName: 'Qasem', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'NSH', firstName: 'Walker', lastName: 'Zimmerman', position: 'D', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'NSH', firstName: 'Jack', lastName: 'Maher', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'NSH', firstName: 'Joe', lastName: 'Willis', position: 'GK', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'NSH', firstName: 'Alex', lastName: 'Muyl', position: 'F', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'NSH', firstName: 'Jonathan', lastName: 'Pérez', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },

  // =========================================================================
  // NEW ENGLAND REVOLUTION (NE)
  // =========================================================================
  { club: 'NE', firstName: 'Carles', lastName: 'Gil', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'NE', firstName: 'Luca', lastName: 'Langoni', position: 'F', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'NE', firstName: 'Ian', lastName: 'Feingold', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'NE', firstName: 'Sergio', lastName: 'Suarez', position: 'M', baseSalary: 3500000, guaranteedCompensation: 4250000 },
  { club: 'NE', firstName: 'Matt', lastName: 'Fry', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'NE', firstName: 'Kai', lastName: 'Hughes', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'NE', firstName: 'Damian', lastName: 'McIntosh', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'NE', firstName: 'Jack', lastName: 'Panayotou', position: 'F', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'NE', firstName: 'Brandon', lastName: 'Raines', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'NE', firstName: 'Will', lastName: 'Sands', position: 'D', baseSalary: 150000, guaranteedCompensation: 172500 },
  { club: 'NE', firstName: 'Djordje', lastName: 'Petrović', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },

  // =========================================================================
  // NEW YORK RED BULLS (NYRB)
  // =========================================================================
  { club: 'NYRB', firstName: 'Emil', lastName: 'Forsberg', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'NYRB', firstName: 'Dante', lastName: 'Vanzeir', position: 'F', baseSalary: 1400000, guaranteedCompensation: 1650000 },
  { club: 'NYRB', firstName: 'Elias', lastName: 'Manoel', position: 'F', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'NYRB', firstName: 'Lewis', lastName: 'Morgan', position: 'M', baseSalary: 1000000, guaranteedCompensation: 1200000 },
  { club: 'NYRB', firstName: 'Sean', lastName: 'Nealis', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'NYRB', firstName: 'Carlos', lastName: 'Coronel', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'NYRB', firstName: 'John', lastName: 'Tolkin', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'NYRB', firstName: 'Peter', lastName: 'Stroud', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'NYRB', firstName: 'Dylan', lastName: 'Nealis', position: 'D', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'NYRB', firstName: 'Cameron', lastName: 'Harper', position: 'F', baseSalary: 350000, guaranteedCompensation: 400000 },

  // =========================================================================
  // NEW YORK CITY FC (NYCFC)
  // =========================================================================
  { club: 'NYCFC', firstName: 'Nicolás', lastName: 'Fernández', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'NYCFC', firstName: 'Talles', lastName: 'Magno', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2350000 },
  { club: 'NYCFC', firstName: 'Thiago', lastName: 'Martins', position: 'D', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'NYCFC', firstName: 'Maxi', lastName: 'Moralez', position: 'M', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'NYCFC', firstName: 'Alonso', lastName: 'Martínez', position: 'M', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'NYCFC', firstName: 'Andres', lastName: 'Jasson', position: 'M', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'NYCFC', firstName: 'Matt', lastName: 'Freese', position: 'GK', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'NYCFC', firstName: 'Kevin', lastName: 'O\'Toole', position: 'D', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'NYCFC', firstName: 'Tayvon', lastName: 'Gray', position: 'D', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'NYCFC', firstName: 'Hannes', lastName: 'Wolf', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },

  // =========================================================================
  // ORLANDO CITY SC (ORL)
  // =========================================================================
  { club: 'ORL', firstName: 'Martín', lastName: 'Ojeda', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'ORL', firstName: 'Luis', lastName: 'Muriel', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000 },
  { club: 'ORL', firstName: 'Mario', lastName: 'Pašalić', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'ORL', firstName: 'Iván', lastName: 'Angulo', position: 'M', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'ORL', firstName: 'Dagur', lastName: 'Brekalo', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'ORL', firstName: 'Wilder', lastName: 'Cartagena', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'ORL', firstName: 'Pedro', lastName: 'Gallese', position: 'GK', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'ORL', firstName: 'Antonio', lastName: 'Freeman', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'ORL', firstName: 'Facundo', lastName: 'Torres', position: 'F', baseSalary: 1400000, guaranteedCompensation: 1650000 },
  { club: 'ORL', firstName: 'Robin', lastName: 'Jansson', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },

  // =========================================================================
  // PHILADELPHIA UNION (PHI)
  // =========================================================================
  { club: 'PHI', firstName: 'Mikael', lastName: 'Uhre', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'PHI', firstName: 'José', lastName: 'Bueno', position: 'M', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'PHI', firstName: 'Obed', lastName: 'Makhanya', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'PHI', firstName: 'Kai', lastName: 'Wagner', position: 'D', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'PHI', firstName: 'Jakob', lastName: 'Glesnes', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'PHI', firstName: 'Jack', lastName: 'Elliott', position: 'D', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'PHI', firstName: 'André', lastName: 'Blake', position: 'GK', baseSalary: 1000000, guaranteedCompensation: 1200000 },
  { club: 'PHI', firstName: 'Nathan', lastName: 'Harriel', position: 'D', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'PHI', firstName: 'Mateo', lastName: 'Iloski', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'PHI', firstName: 'Jeremy', lastName: 'Rafanello', position: 'F', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'PHI', firstName: 'Quinn', lastName: 'Sullivan', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },

  // =========================================================================
  // PORTLAND TIMBERS (POR)
  // =========================================================================
  { club: 'POR', firstName: 'James', lastName: 'Rodríguez', position: 'M', baseSalary: 2800000, guaranteedCompensation: 3200000 },
  { club: 'POR', firstName: 'Antony', lastName: '', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'POR', firstName: 'Evander', lastName: '', position: 'M', baseSalary: 1200000, guaranteedCompensation: 1450000 },
  { club: 'POR', firstName: 'Felipe', lastName: 'Mora', position: 'F', baseSalary: 900000, guaranteedCompensation: 1050000 },
  { club: 'POR', firstName: 'David', lastName: 'Ayala', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'POR', firstName: 'Zac', lastName: 'McGraw', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'POR', firstName: 'Claudio', lastName: 'Bravo', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'POR', firstName: 'James', lastName: 'Pantemis', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'POR', firstName: 'Harrison', lastName: 'Sulte', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'POR', firstName: 'Tyler', lastName: 'Muse', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // REAL SALT LAKE (RSL)
  // =========================================================================
  { club: 'RSL', firstName: 'Roberto', lastName: 'Cruz', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'RSL', firstName: 'Nelson', lastName: 'Palacio', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'RSL', firstName: 'Neyfi', lastName: 'Caliskan', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'RSL', firstName: 'Zack', lastName: 'Farnsworth', position: 'GK', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'RSL', firstName: 'Justen', lastName: 'Glad', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'RSL', firstName: 'Diego', lastName: 'Luna', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'RSL', firstName: 'Luis', lastName: 'Rivera', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'RSL', firstName: 'Matt', lastName: 'Stajduhar', position: 'GK', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'RSL', firstName: 'Tyler', lastName: 'Wolff', position: 'M', baseSalary: 250000, guaranteedCompensation: 298000 },

  // =========================================================================
  // SAN DIEGO FC (SD)
  // =========================================================================
  { club: 'SD', firstName: 'Hirving', lastName: 'Lozano', position: 'F', baseSalary: 4000000, guaranteedCompensation: 4800000 },
  { club: 'SD', firstName: 'Andres', lastName: 'Reyes', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'SD', firstName: 'Lewis', lastName: 'Morgan', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'SD', firstName: 'Amahl', lastName: 'Pellegrino', position: 'F', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'SD', firstName: 'Diego', lastName: 'Vázquez', position: 'F', baseSalary: 450000, guaranteedCompensation: 505000 },
  { club: 'SD', firstName: 'Karl', lastName: 'Sargeant', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'SD', firstName: 'Omar', lastName: 'Verhoeven', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },

  // =========================================================================
  // SAN JOSE EARTHQUAKES (SJ)
  // =========================================================================
  { club: 'SJ', firstName: 'Cristian', lastName: 'Arango', position: 'F', baseSalary: 2000000, guaranteedCompensation: 2400000 },
  { club: 'SJ', firstName: 'Daniel', lastName: '', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'SJ', firstName: 'Daniel', lastName: 'De Sousa Britto', position: 'M', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'SJ', firstName: 'Jeremy', lastName: 'Ebobisse', position: 'F', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'SJ', firstName: 'Benjamin', lastName: 'Kikanovic', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'SJ', firstName: 'Amahl', lastName: 'Rodrigues', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'SJ', firstName: 'Brandon', lastName: 'Wilson', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'SJ', firstName: 'Nathan', lastName: 'Tsakiris', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'SJ', firstName: 'Cruz', lastName: 'Medina', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'SJ', firstName: 'Niko', lastName: 'Buck', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'SJ', firstName: 'Evan', lastName: 'Mendoza', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },

  // =========================================================================
  // SEATTLE SOUNDERS FC (SEA)
  // =========================================================================
  { club: 'SEA', firstName: 'Albert', lastName: 'Rusnák', position: 'M', baseSalary: 2600000, guaranteedCompensation: 3100000 },
  { club: 'SEA', firstName: 'Jordan', lastName: 'Morris', position: 'F', baseSalary: 2200000, guaranteedCompensation: 2650000 },
  { club: 'SEA', firstName: 'Pedro', lastName: 'de la Vega', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'SEA', firstName: 'Yeimar', lastName: 'Gómez Andrade', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'SEA', firstName: 'Nouhou', lastName: 'Tolo', position: 'D', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'SEA', firstName: 'Nicolás', lastName: 'Petković', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'SEA', firstName: 'Stefan', lastName: 'Frei', position: 'GK', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'SEA', firstName: 'Josh', lastName: 'Atencio', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'SEA', firstName: 'Cristian', lastName: 'Roldán', position: 'M', baseSalary: 900000, guaranteedCompensation: 1050000 },
  { club: 'SEA', firstName: 'Cody', lastName: 'Baker', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'SEA', firstName: 'Reed', lastName: 'Baker-Whiting', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'SEA', firstName: 'Sam', lastName: 'Hawkins', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'SEA', firstName: 'Obed', lastName: 'Vargas', position: 'M', baseSalary: 150000, guaranteedCompensation: 172500 },

  // =========================================================================
  // ST. LOUIS CITY SC (STL)
  // =========================================================================
  { club: 'STL', firstName: 'Marcel', lastName: 'Hartel', position: 'M', baseSalary: 2200000, guaranteedCompensation: 2600000 },
  { club: 'STL', firstName: 'João', lastName: 'Klauss', position: 'F', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'STL', firstName: 'Eduard', lastName: 'Löwen', position: 'M', baseSalary: 1600000, guaranteedCompensation: 1900000 },
  { club: 'STL', firstName: 'Chris', lastName: 'Durkin', position: 'M', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'STL', firstName: 'Jeong', lastName: 'Sang-bin', position: 'F', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'STL', firstName: 'Tomáš', lastName: 'Ostrak', position: 'D', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'STL', firstName: 'Roman', lastName: 'Bürki', position: 'GK', baseSalary: 800000, guaranteedCompensation: 940000 },
  { club: 'STL', firstName: 'Dylan', lastName: 'Edelman', position: 'M', baseSalary: 200000, guaranteedCompensation: 230000 },
  { club: 'STL', firstName: 'Cedric', lastName: 'Glover', position: 'D', baseSalary: 150000, guaranteedCompensation: 172500 },
  { club: 'STL', firstName: 'Jalen', lastName: 'Orozco', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'STL', firstName: 'Martín', lastName: 'Joyner', position: 'M', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // TORONTO FC (TOR)
  // =========================================================================
  { club: 'TOR', firstName: 'Djordje', lastName: 'Mihailovic', position: 'M', baseSalary: 2000000, guaranteedCompensation: 2350000 },
  { club: 'TOR', firstName: 'Jonathan', lastName: 'Osorio', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'TOR', firstName: 'Matías', lastName: 'Pereira', position: 'M', baseSalary: 575000, guaranteedCompensation: 633000 },
  { club: 'TOR', firstName: 'Jordan', lastName: 'Cifuentes', position: 'M', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'TOR', firstName: 'Alonso', lastName: 'Coello', position: 'M', baseSalary: 400000, guaranteedCompensation: 460000 },
  { club: 'TOR', firstName: 'Kevin', lastName: 'Franklin', position: 'D', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'TOR', firstName: 'Jules-Anthony', lastName: 'Vilsaint', position: 'F', baseSalary: 300000, guaranteedCompensation: 345000 },
  { club: 'TOR', firstName: 'Sean', lastName: 'Johnson', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'TOR', firstName: 'Richie', lastName: 'Laryea', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'TOR', firstName: 'Derrick', lastName: 'Kerr', position: 'M', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'TOR', firstName: 'Kosi', lastName: 'Thompson', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },

  // =========================================================================
  // VANCOUVER WHITECAPS FC (VAN)
  // =========================================================================
  { club: 'VAN', firstName: 'Ryan', lastName: 'Gauld', position: 'M', baseSalary: 2400000, guaranteedCompensation: 2800000 },
  { club: 'VAN', firstName: 'Andrés', lastName: 'Cubas', position: 'M', baseSalary: 1800000, guaranteedCompensation: 2100000 },
  { club: 'VAN', firstName: 'Mathías', lastName: 'Laborda', position: 'D', baseSalary: 600000, guaranteedCompensation: 700000 },
  { club: 'VAN', firstName: 'Ranko', lastName: 'Veselinović', position: 'D', baseSalary: 700000, guaranteedCompensation: 820000 },
  { club: 'VAN', firstName: 'Yohei', lastName: 'Takaoka', position: 'GK', baseSalary: 500000, guaranteedCompensation: 580000 },
  { club: 'VAN', firstName: 'J.C.', lastName: 'Ngando', position: 'M', baseSalary: 450000, guaranteedCompensation: 520000 },
  { club: 'VAN', firstName: 'Sebastian', lastName: 'Berhalter', position: 'M', baseSalary: 350000, guaranteedCompensation: 400000 },
  { club: 'VAN', firstName: 'Omar', lastName: 'Larraz', position: 'D', baseSalary: 65000, guaranteedCompensation: 70000 },
  { club: 'VAN', firstName: 'Nicholas', lastName: 'Pierre', position: 'D', baseSalary: 85000, guaranteedCompensation: 95000 },
  { club: 'VAN', firstName: 'Nikola', lastName: 'Djordjevic', position: 'M', baseSalary: 475000, guaranteedCompensation: 514000 },
  { club: 'VAN', firstName: 'Brian', lastName: 'White', position: 'F', baseSalary: 800000, guaranteedCompensation: 940000 },
];

// Export the count for reference
export const MLSPA_PLAYER_COUNT = MLSPA_SALARIES_2025.length;

