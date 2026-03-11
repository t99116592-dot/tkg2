export const USERS = [
  { id:1, name:'Айбек Маматов',     email:'aibek@mail.kg',   password:'aibek123',  av:'AM' },
  { id:2, name:'Зарина Асанова',    email:'zarina@mail.kg',  password:'zarina456', av:'ZA' },
  { id:3, name:'Тимур Бакытов',     email:'timur@gmail.com', password:'timur789',  av:'TB' },
  { id:4, name:'Нурия Сейткалиева', email:'nuria@mail.kg',   password:'nuria321',  av:'NS' },
]

export const CITIES = [
  'Стамбул','Дубай','Москва','Бангкок','Алматы',
  'Бишкек','Берлин','Барселона','Токио','Париж',
]

export const HOTELS = [
  { id:1,  name:'Grand Palace Hotel',    city:'Стамбул',   stars:5, price:180, rating:4.8, ico:'🏰', am:['WiFi','Бассейн','SPA','Ресторан'] },
  { id:2,  name:'Бутик Отель Босфор',   city:'Стамбул',   stars:4, price:95,  rating:4.5, ico:'🏩', am:['WiFi','Ресторан','Деңиз виды'] },
  { id:3,  name:'Burj Al Arab',          city:'Дубай',     stars:5, price:900, rating:4.9, ico:'🏗️', am:['WiFi','Бассейн','SPA','Вертолет'] },
  { id:4,  name:'Dubai Marina Hotel',    city:'Дубай',     stars:4, price:220, rating:4.4, ico:'🌇', am:['WiFi','Бассейн','Паркинг'] },
  { id:5,  name:'Москва Премиум',        city:'Москва',    stars:5, price:250, rating:4.7, ico:'⛪', am:['WiFi','SPA','Ресторан'] },
  { id:6,  name:'Mandarin Oriental',     city:'Бангкок',   stars:5, price:320, rating:4.9, ico:'🌸', am:['WiFi','Бассейн','SPA','Терраса'] },
  { id:7,  name:'Алматы Гранд',          city:'Алматы',    stars:4, price:85,  rating:4.3, ico:'🏨', am:['WiFi','Ресторан','Паркинг'] },
  { id:8,  name:'Hyatt Regency Bishkek', city:'Бишкек',    stars:5, price:120, rating:4.6, ico:'🦅', am:['WiFi','Бассейн','SPA'] },
  { id:9,  name:'Hotel Adlon',           city:'Берлин',    stars:5, price:380, rating:4.8, ico:'🏰', am:['WiFi','SPA','Ресторан','Бар'] },
  { id:10, name:'W Barcelona',           city:'Барселона', stars:5, price:350, rating:4.7, ico:'⛵', am:['WiFi','Бассейн','Чатыр бар'] },
]

export const FLIGHTS = [
  { id:1, from:'Бишкек',fC:'FRU', to:'Стамбул',  tC:'IST', al:'Air Manas',       dep:'08:30',arr:'13:45',dur:'7ч 15м',price:450,seats:12 },
  { id:2, from:'Бишкек',fC:'FRU', to:'Дубай',    tC:'DXB', al:'FlyDubai',        dep:'22:00',arr:'02:30',dur:'5ч 30м',price:380,seats:5  },
  { id:3, from:'Бишкек',fC:'FRU', to:'Москва',   tC:'SVO', al:'Aeroflot',        dep:'06:15',arr:'09:30',dur:'5ч 15м',price:280,seats:24 },
  { id:4, from:'Бишкек',fC:'FRU', to:'Алматы',   tC:'ALA', al:'Air Manas',       dep:'10:00',arr:'11:00',dur:'1ч 00м',price:80, seats:30 },
  { id:5, from:'Алматы',fC:'ALA', to:'Бангкок',  tC:'BKK', al:'Turkish Airlines',dep:'14:20',arr:'05:50',dur:'8ч 30м',price:520,seats:8  },
  { id:6, from:'Бишкек',fC:'FRU', to:'Берлин',   tC:'BER', al:'Lufthansa',       dep:'11:30',arr:'16:45',dur:'9ч 15м',price:680,seats:15 },
  { id:7, from:'Бишкек',fC:'FRU', to:'Барселона',tC:'BCN', al:'Turkish Airlines',dep:'09:00',arr:'15:30',dur:'9ч 30м',price:720,seats:7  },
]

export const BAG_RULES = {
  economy:  { cabin:{kg:10,dim:'55x40x20'}, hold:{kg:23}, fee:15 },
  business: { cabin:{kg:15,dim:'55x40x25'}, hold:{kg:32}, fee:0  },
  first:    { cabin:{kg:20,dim:'55x40x25'}, hold:{kg:40}, fee:0  },
}
