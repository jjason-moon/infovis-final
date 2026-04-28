export const GEO_CATS = [
  { id: 'Music',         color: '#F05A7E' },
  { id: 'Entertainment', color: '#F0A050' },
  { id: 'Gaming',        color: '#50C8F0' },
  { id: 'Sports',        color: '#50F0A0' },
  { id: 'News',          color: '#A078F0' },
  { id: 'People',        color: '#F0D850' },
  { id: 'Comedy',        color: '#F07850' },
  { id: 'Science',       color: '#78C8F0' },
  { id: 'Education',     color: '#C8F090' },
  { id: 'Film',          color: '#F090C8' },
]

export const CAT_COLOR = Object.fromEntries(GEO_CATS.map(c => [c.id, c.color]))

export const COUNTRIES = [
  { code: 'US', name: 'United States',  flag: '🇺🇸', top: 'Music',         lat: 38,  lng: -97,  eng: 7.53, views: 2376, vids: 891 },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦', top: 'Music',         lat: 56,  lng: -96,  eng: 7.89, views: 3443, vids: 287 },
  { code: 'MX', name: 'Mexico',         flag: '🇲🇽', top: 'Music',         lat: 23,  lng: -102, eng: 7.55, views: 3667, vids: 312 },
  { code: 'BR', name: 'Brazil',         flag: '🇧🇷', top: 'Music',         lat: -10, lng: -53,  eng: 7.89, views: 3769, vids: 791 },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷', top: 'Music',         lat: -34, lng: -64,  eng: 7.78, views: 2948, vids: 97  },
  { code: 'CO', name: 'Colombia',       flag: '🇨🇴', top: 'Entertainment', lat: 4,   lng: -74,  eng: 7.82, views: 1304, vids: 88  },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', top: 'Music',         lat: 54,  lng: -2,   eng: 7.46, views: 2900, vids: 412 },
  { code: 'FR', name: 'France',         flag: '🇫🇷', top: 'Music',         lat: 46,  lng: 2,    eng: 7.72, views: 2108, vids: 323 },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪', top: 'Music',         lat: 51,  lng: 10,   eng: 7.66, views: 2082, vids: 298 },
  { code: 'RU', name: 'Russia',         flag: '🇷🇺', top: 'Music',         lat: 61,  lng: 105,  eng: 7.50, views: 8405, vids: 344 },
  { code: 'TR', name: 'Turkey',         flag: '🇹🇷', top: 'Music',         lat: 39,  lng: 35,   eng: 7.43, views: 7997, vids: 278 },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬', top: 'People',        lat: 27,  lng: 31,   eng: 7.46, views: 728,  vids: 156 },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬', top: 'Entertainment', lat: 9,   lng: 8,    eng: 7.02, views: 2719, vids: 178 },
  { code: 'SA', name: 'Saudi Arabia',   flag: '🇸🇦', top: 'Entertainment', lat: 24,  lng: 45,   eng: 7.50, views: 1563, vids: 203 },
  { code: 'PK', name: 'Pakistan',       flag: '🇵🇰', top: 'People',        lat: 30,  lng: 69,   eng: 7.30, views: 1842, vids: 189 },
  { code: 'IN', name: 'India',          flag: '🇮🇳', top: 'Music',         lat: 20,  lng: 78,   eng: 7.50, views: 4052, vids: 892 },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵', top: 'Music',         lat: 36,  lng: 138,  eng: 7.79, views: 3759, vids: 487 },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷', top: 'Entertainment', lat: 36,  lng: 128,  eng: 7.48, views: 1656, vids: 234 },
  { code: 'ID', name: 'Indonesia',      flag: '🇮🇩', top: 'Music',         lat: -5,  lng: 120,  eng: 7.40, views: 2733, vids: 312 },
  { code: 'PH', name: 'Philippines',    flag: '🇵🇭', top: 'Music',         lat: 13,  lng: 122,  eng: 8.27, views: 886,  vids: 198 },
  { code: 'TH', name: 'Thailand',       flag: '🇹🇭', top: 'Entertainment', lat: 15,  lng: 101,  eng: 7.20, views: 4454, vids: 267 },
  { code: 'VN', name: 'Vietnam',        flag: '🇻🇳', top: 'Entertainment', lat: 16,  lng: 106,  eng: 7.26, views: 1170, vids: 143 },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺', top: 'Entertainment', lat: -27, lng: 133,  eng: 7.91, views: 2193, vids: 197 },
]

export const COUNTRY_CATS = {
  US: [22,18,14,12,11,7,6,5,3,2], CA: [28,16,12,10,10,8,7,4,3,2], MX: [32,20,10,8,10,8,5,4,2,1],
  BR: [35,18,9,8,9,8,6,4,2,1],   AR: [30,15,10,12,9,9,7,4,2,2],  CO: [28,22,9,8,10,8,6,5,2,2],
  GB: [24,17,13,12,10,7,7,5,3,2], FR: [30,16,11,10,11,7,7,4,2,2], DE: [26,15,14,11,12,7,6,5,2,2],
  RU: [25,18,12,10,13,8,6,4,2,2], TR: [34,18,8,9,10,8,6,4,2,1],   EG: [20,20,8,8,12,16,7,4,3,2],
  NG: [22,28,5,6,14,12,7,3,2,1],  SA: [18,26,8,7,13,12,7,4,3,2],  PK: [20,18,9,7,12,18,7,4,3,2],
  IN: [38,16,8,7,10,9,5,4,2,1],   JP: [28,12,20,8,8,7,7,6,2,2],   KR: [22,24,16,8,8,7,7,4,2,2],
  ID: [30,18,12,8,10,9,6,4,2,1],  PH: [35,16,10,7,9,10,7,3,2,1],  TH: [20,30,10,8,10,8,7,4,2,1],
  VN: [22,28,12,8,9,8,7,3,2,1],   AU: [24,22,14,12,8,7,6,4,2,1],
}

export const CAT_VIEWS = {
  Music:         { US:2100,CA:3100,MX:3400,BR:4200,AR:2600,CO:1800,GB:2600,FR:2300,DE:2100,RU:7200,TR:6800,EG:900, NG:2400,SA:1100,PK:1300,IN:4800,JP:3200,KR:1900,ID:2400,PH:1100,TH:3200,VN:1400,AU:2000 },
  Entertainment: { US:2200,CA:2800,MX:3100,BR:3400,AR:2200,CO:2100,GB:2900,FR:2100,DE:1900,RU:5400,TR:5200,EG:1800,NG:3200,SA:2400,PK:2100,IN:3200,JP:2800,KR:2600,ID:2800,PH:1200,TH:5800,VN:2400,AU:2900 },
  Gaming:        { US:5200,CA:4800,MX:3800,BR:3200,AR:2900,CO:2600,GB:4600,FR:3800,DE:4200,RU:4800,TR:3800,EG:1200,NG:1100,SA:1600,PK:1400,IN:2800,JP:5800,KR:4900,ID:3200,PH:2100,TH:2900,VN:2400,AU:4400 },
  Sports:        { US:4800,CA:4200,MX:3600,BR:5200,AR:3900,CO:2800,GB:5400,FR:4600,DE:3900,RU:4200,TR:4800,EG:1900,NG:2200,SA:2100,PK:1800,IN:3600,JP:3800,KR:2900,ID:2600,PH:1800,TH:3400,VN:2100,AU:5100 },
  News:          { US:3600,CA:3200,MX:2800,BR:2400,AR:2100,CO:1900,GB:3800,FR:3400,DE:3600,RU:6800,TR:5400,EG:2400,NG:3600,SA:2800,PK:2400,IN:2800,JP:2400,KR:2200,ID:2400,PH:1600,TH:2800,VN:1800,AU:2800 },
  People:        { US:1800,CA:2000,MX:2200,BR:2600,AR:2100,CO:1900,GB:2000,FR:1800,DE:1700,RU:3200,TR:3400,EG:2100,NG:2800,SA:2200,PK:2600,IN:2400,JP:1900,KR:1800,ID:2100,PH:1400,TH:2200,VN:1700,AU:1900 },
  Comedy:        { US:2400,CA:2200,MX:2000,BR:2800,AR:2100,CO:1800,GB:2600,FR:2200,DE:1900,RU:3200,TR:2800,EG:1600,NG:2400,SA:1800,PK:1600,IN:2200,JP:2400,KR:2200,ID:2000,PH:1600,TH:2200,VN:1800,AU:2200 },
  Science:       { US:3200,CA:2800,MX:2200,BR:2400,AR:2000,CO:1800,GB:3000,FR:2600,DE:3000,RU:3600,TR:2600,EG:1400,NG:1200,SA:1600,PK:1400,IN:2400,JP:3200,KR:2800,ID:2000,PH:1400,TH:2000,VN:1600,AU:2600 },
  Education:     { US:1800,CA:1600,MX:1400,BR:1400,AR:1200,CO:1200,GB:1800,FR:1600,DE:1600,RU:2000,TR:1600,EG:1200,NG:1000,SA:1200,PK:1200,IN:1600,JP:1800,KR:1600,ID:1400,PH:1000,TH:1400,VN:1200,AU:1600 },
  Film:          { US:2200,CA:2000,MX:1800,BR:1800,AR:1600,CO:1400,GB:2200,FR:2000,DE:1800,RU:2400,TR:1800,EG:1200,NG:1200,SA:1400,PK:1200,IN:1800,JP:2400,KR:2200,ID:1600,PH:1200,TH:1600,VN:1400,AU:1800 },
}

export const CAT_ENG = {
  Music:         { US:7.5,CA:7.9,MX:7.6,BR:8.0,AR:7.8,CO:7.9,GB:7.5,FR:7.7,DE:7.7,RU:7.5,TR:7.4,EG:7.5,NG:7.1,SA:7.5,PK:7.3,IN:7.6,JP:7.8,KR:7.5,ID:7.4,PH:8.3,TH:7.2,VN:7.3,AU:7.9 },
  Entertainment: { US:7.4,CA:7.8,MX:7.5,BR:7.8,AR:7.7,CO:7.8,GB:7.4,FR:7.6,DE:7.6,RU:7.4,TR:7.4,EG:7.4,NG:7.0,SA:7.4,PK:7.2,IN:7.4,JP:7.1,KR:7.4,ID:7.3,PH:8.1,TH:7.2,VN:7.2,AU:8.0 },
  Gaming:        { US:7.6,CA:7.9,MX:7.5,BR:7.7,AR:7.7,CO:7.6,GB:7.6,FR:7.5,DE:7.6,RU:7.5,TR:7.4,EG:7.2,NG:6.9,SA:7.2,PK:7.1,IN:7.4,JP:7.7,KR:7.6,ID:7.4,PH:8.0,TH:7.1,VN:7.2,AU:7.7 },
  Sports:        { US:7.7,CA:8.0,MX:7.6,BR:8.1,AR:7.9,CO:7.8,GB:7.7,FR:7.8,DE:7.7,RU:7.5,TR:7.5,EG:7.4,NG:7.1,SA:7.3,PK:7.2,IN:7.5,JP:7.6,KR:7.5,ID:7.4,PH:8.1,TH:7.2,VN:7.2,AU:8.0 },
  News:          { US:7.5,CA:7.7,MX:7.4,BR:7.6,AR:7.6,CO:7.5,GB:7.5,FR:7.6,DE:7.6,RU:7.5,TR:7.4,EG:7.4,NG:7.0,SA:7.4,PK:7.2,IN:7.4,JP:7.4,KR:7.3,ID:7.3,PH:7.9,TH:7.1,VN:7.1,AU:7.6 },
}

// ── AREA CHART DATA ──
export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

export const AREA_CATS = [
  { id: 'Music',         color: '#F05A7E' },
  { id: 'Entertainment', color: '#F0A050' },
  { id: 'Gaming',        color: '#50C8F0' },
  { id: 'Sports',        color: '#50F0A0' },
  { id: 'News',          color: '#A078F0' },
  { id: 'People',        color: '#F0D850' },
  { id: 'Others',        color: '#888899' },
]

export const AREA_GLOBAL = {
  Music:         [28,27,26,27,28,27,26],
  Entertainment: [17,18,19,18,17,19,20],
  Gaming:        [12,13,14,13,15,14,13],
  Sports:        [11,11,10,11,12,11,11],
  News:          [10,10,11,10,9,10,10],
  People:        [8, 8, 8, 8, 7, 8, 8],
  Others:        [14,13,12,13,12,11,12],
}

export const AREA_COUNTRY = {
  JP: { Music:[28,27,26,27,28,27,26], Entertainment:[12,12,11,11,12,12,11], Gaming:[18,19,21,22,20,21,22], Sports:[8,8,7,7,8,8,7],   News:[8,8,8,8,8,8,8],   People:[7,7,7,7,7,7,7], Others:[19,19,20,18,17,17,19] },
  US: { Music:[22,22,21,22,23,22,21], Entertainment:[18,18,19,18,17,18,19], Gaming:[14,14,15,14,15,15,14], Sports:[12,12,11,12,13,12,12], News:[11,11,12,11,10,11,11], People:[7,7,7,7,7,7,7], Others:[16,16,15,16,15,15,16] },
  BR: { Music:[35,34,33,34,36,35,34], Entertainment:[18,18,19,18,17,18,19], Gaming:[9,9,10,9,10,10,9],   Sports:[8,8,7,8,8,8,8],   News:[9,9,9,9,8,9,9],   People:[8,8,8,8,8,8,8], Others:[13,14,14,14,13,12,13] },
  KR: { Music:[22,22,21,22,23,22,21], Entertainment:[24,24,25,24,23,24,25], Gaming:[16,16,17,16,17,17,16], Sports:[8,8,7,8,8,8,7],   News:[8,8,8,8,8,8,8],   People:[7,7,7,7,7,7,7], Others:[15,15,15,15,14,14,16] },
  IN: { Music:[38,37,36,37,39,38,37], Entertainment:[16,16,17,16,15,16,17], Gaming:[8,8,9,8,9,9,8],    Sports:[7,7,6,7,7,7,7],   News:[10,10,10,10,9,10,10], People:[9,9,9,9,9,9,9], Others:[12,13,13,13,12,11,12] },
  GB: { Music:[24,24,23,23,24,24,23], Entertainment:[17,17,18,17,16,17,18], Gaming:[13,13,14,13,14,14,13], Sports:[12,12,11,12,13,12,12], News:[10,10,11,10,9,10,10],  People:[7,7,7,7,7,7,7], Others:[17,17,16,18,17,16,17] },
  AU: { Music:[24,24,23,23,24,24,23], Entertainment:[22,22,23,22,21,22,23], Gaming:[14,14,15,14,15,15,14], Sports:[12,12,11,12,13,12,12], News:[8,8,9,8,7,8,9],    People:[7,7,7,7,7,7,7], Others:[13,13,12,14,13,12,12] },
  CA: { Music:[28,27,26,27,29,28,27], Entertainment:[16,16,17,16,15,16,17], Gaming:[12,12,13,12,13,13,12], Sports:[10,10,9,10,11,10,10], News:[10,10,11,10,9,10,10], People:[8,8,8,8,8,8,8], Others:[16,17,16,17,15,15,16] },
  MX: { Music:[32,31,30,31,33,32,31], Entertainment:[20,20,21,20,19,20,21], Gaming:[10,10,11,10,11,11,10], Sports:[8,8,7,8,8,8,8],   News:[10,10,11,10,9,10,11], People:[8,8,8,8,8,8,8], Others:[12,13,12,13,12,11,11] },
  AR: { Music:[30,29,28,29,31,30,29], Entertainment:[15,15,16,15,14,15,16], Gaming:[10,10,11,10,11,11,10], Sports:[12,12,11,12,13,12,12], News:[9,9,10,9,8,9,10],  People:[9,9,9,9,9,9,9], Others:[15,16,15,16,14,14,14] },
  CO: { Music:[28,27,26,27,29,28,27], Entertainment:[22,22,23,22,21,22,23], Gaming:[9,9,10,9,10,10,9],   Sports:[8,8,7,8,8,8,8],   News:[10,10,11,10,9,10,11], People:[8,8,8,8,8,8,8], Others:[15,16,15,16,15,14,14] },
  FR: { Music:[30,29,28,29,31,30,29], Entertainment:[16,16,17,16,15,16,17], Gaming:[11,11,12,11,12,12,11], Sports:[10,10,9,10,11,10,10], News:[11,11,12,11,10,11,12], People:[7,7,7,7,7,7,7], Others:[15,16,15,16,14,14,14] },
  DE: { Music:[26,25,24,25,27,26,25], Entertainment:[15,15,16,15,14,15,16], Gaming:[14,14,15,14,15,15,14], Sports:[11,11,10,11,12,11,11], News:[12,12,13,12,11,12,13], People:[7,7,7,7,7,7,7], Others:[15,16,15,16,14,14,14] },
  RU: { Music:[25,24,23,24,26,25,24], Entertainment:[18,18,19,18,17,18,19], Gaming:[12,12,13,12,13,13,12], Sports:[10,10,9,10,11,10,10], News:[13,13,14,13,12,13,14], People:[8,8,8,8,8,8,8], Others:[14,15,14,15,13,13,13] },
  TR: { Music:[34,33,32,33,35,34,33], Entertainment:[18,18,19,18,17,18,19], Gaming:[8,8,9,8,9,9,8],    Sports:[9,9,8,9,10,9,9],   News:[10,10,11,10,9,10,11], People:[8,8,8,8,8,8,8], Others:[13,14,13,14,12,12,12] },
  EG: { Music:[20,20,19,20,21,20,19], Entertainment:[20,20,21,20,19,20,21], Gaming:[8,8,9,8,9,9,8],    Sports:[8,8,7,8,8,8,8],   News:[12,12,13,12,11,12,13], People:[16,16,17,16,15,16,17], Others:[16,16,14,16,17,15,14] },
  NG: { Music:[22,21,20,21,23,22,21], Entertainment:[28,28,29,28,27,28,29], Gaming:[5,5,6,5,6,6,5],    Sports:[6,6,5,6,7,6,6],   News:[14,14,15,14,13,14,15], People:[12,12,13,12,11,12,13], Others:[13,14,12,14,13,12,11] },
  SA: { Music:[18,18,17,18,19,18,17], Entertainment:[26,26,27,26,25,26,27], Gaming:[8,8,9,8,9,9,8],    Sports:[7,7,6,7,8,7,7],   News:[13,13,14,13,12,13,14], People:[12,12,13,12,11,12,13], Others:[16,16,14,16,16,15,14] },
  PK: { Music:[20,20,19,20,21,20,19], Entertainment:[18,18,19,18,17,18,19], Gaming:[9,9,10,9,10,10,9],  Sports:[7,7,6,7,8,7,7],   News:[12,12,13,12,11,12,13], People:[18,18,19,18,17,18,19], Others:[16,16,14,16,16,15,14] },
  ID: { Music:[30,29,28,29,31,30,29], Entertainment:[18,18,19,18,17,18,19], Gaming:[12,12,13,12,13,13,12], Sports:[8,8,7,8,8,8,8],  News:[10,10,11,10,9,10,11], People:[9,9,10,9,9,9,9], Others:[13,14,12,14,13,12,12] },
  PH: { Music:[35,34,33,34,36,35,34], Entertainment:[16,16,17,16,15,16,17], Gaming:[10,10,11,10,11,11,10], Sports:[7,7,6,7,8,7,7],  News:[9,9,10,9,8,9,10],   People:[10,10,11,10,9,10,11], Others:[13,14,12,14,13,12,11] },
  TH: { Music:[20,20,19,20,21,20,19], Entertainment:[30,30,31,30,29,30,31], Gaming:[10,10,11,10,11,11,10], Sports:[8,8,7,8,8,8,8],  News:[10,10,11,10,9,10,11], People:[8,8,9,8,8,8,9], Others:[14,14,12,14,14,13,12] },
  VN: { Music:[22,22,21,22,23,22,21], Entertainment:[28,28,29,28,27,28,29], Gaming:[12,12,13,12,13,13,12], Sports:[8,8,7,8,8,8,8],  News:[9,9,10,9,8,9,10],   People:[8,8,9,8,8,8,9], Others:[13,13,11,13,13,12,11] },
}