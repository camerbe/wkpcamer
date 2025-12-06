

export const CONFIG= {
  apiUrl: 'http://localhost:8000/api',
  appUrl: 'http://localhost:4200',
  siteUrl: 'http://localhost:8000',
  cacheTTL: {
    short: 1000 * 60 * 15,  // 15 minutes
    medium: 1000 * 60 * 60, // 1 heure
    long: 1000 * 60 * 60 * 24 // 1 jour
  },
  siteKeyRecaptcha: '6LdiCBssAAAAAKgLhbv8Nyviwoqkc0lpejfOIwrB' // Clé de test fournie par Google
  ,
  siteKeyRecaptchaDev: '6LdvbR8sAAAAAHeC4JmU4VqB9Vb9PvdnyueHGt79'
  // Clé de test fournie par Google
}
