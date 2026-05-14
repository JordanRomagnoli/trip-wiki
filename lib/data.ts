export type POI = {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: 'our-places' | 'culture' | 'nature' | 'food' | 'disco';
  visited?: boolean;
};

export type City = {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  pois: POI[];
};

export const CITIES: City[] = [
  {
    id: 'valencia',
    name: 'Valencia',
    center: [39.4699, -0.3763],
    zoom: 13,
    pois: [
      {
        id: 'v1',
        name: 'Casa',
        description: "Apartamentos Valencia Home Alfahuir",
        coordinates: [39.49346057566648, -0.36109578132498904],
        category: 'our-places',
      },

      // Benimaclet 
      {
        id: 'v2',
        name: 'Kaf Café',
        description: "Café/bar culturale di quartiere, carino per bere qualcosa, eventi e atmosfera local.",
        coordinates: [39.49042, -0.35390],
        category: 'food',
      },
      {
        id: 'v3',
        name: 'Torre Miramar',
        description: "Torre panoramica per vedere Valencia dall’alto e la zona huerta/università.",
        coordinates: [39.481452616013115, -0.35143620320885127],
        category: 'culture',
      },
      {
        id: 'v4',
        name: '46zero20',
        description: "Bistrot/localino a Benimaclet. Si mangia.",
        coordinates: [39.481452616013115, -0.35143620320885127],
        category: 'culture',
      },
      {
        id: 'v5',
        name: 'Teatro Círculo',
        description: "Spazio teatrale e culturale indipendente con programmazione locale.",
        coordinates: [39.485329563122995, -0.35479637434392297],
        category: 'culture',
      },
      {
        id: 'v6',
        name: 'Falla Mistral-Murta',
        description: "Strada con murales e baretti Commissione fallera di quartiere: utile per respirare cultura valenciana vera.",
        coordinates: [39.48600580540185, -0.3574957042707483],
        category: 'culture',
      },
      {
        id: 'v7',
        name: 'Glop, Plaça Benimaclet',
        description: "Bar/pub in piazza, comodo per aperitivo easy nel quartiere.",
        coordinates: [39.486304419176044, -0.3589821779311981],
        category: 'food',
      },
      {
        id: 'v8',
        name: 'Università / campus Tarongers-UPV',
        description: "Zona universitaria, giovane, piena di studenti e locali semplici. Ci sono molti locali e ristoranti. Non li metto tutti poi ce li vediamo se Andiamo lì. Tipo TKO tacos volendo anche burgher king e taco bell.",
        coordinates: [39.476208125609475, -0.3479683400471817],
        category: 'food',
      },
      {
        id: 'v9',
        name: 'Giardini Reali / Viveros',
        description: "Questi sono I Giardini reali le vecchie porte per entrare a Valencia. Grande parco elegante e storico, bello per passeggiare prima del museo. Dentro ci sono musei achi e labirinti.",
        coordinates: [39.480745941823564, -0.36616727838022994],
        category: 'culture',
      },
      {
        id: 'v10',
        name: 'Museo Belle Arti di Valencia',
        description: "Museo importante per arte valenciana e collezioni storiche.",
        coordinates: [39.4791239763351, -0.3700056569264265],
        category: 'culture',
      },
      {
        id: 'v11',
        name: 'Ponte dei Fiori',
        description: "Ponte scenografico sempre pieno di fiori, perfetto per foto e passeggiata verso il centro. Vicino c’è il museo di storia militare.",
        coordinates: [39.47161071175673, -0.36247311690139905],
        category: 'culture',
      },
      {
        id: 'v12',
        name: 'Espai de Circ',
        description: "Spazio dedicato ad allenamento, creazione, circo sociale e arti circensi, verso Alboraia. (x Giulia)",
        coordinates: [39.5000056578579, -0.34458399763982167],
        category: 'culture',
      },
      {
        id: 'v13',
        name: 'Alqueria Patach',
        description: "Mi sembra un ristorante buono recensioni google 4,7. Punti di riferimento storici tipo alqueria de ca serra…",
        coordinates: [39.5000056578579, -0.34458399763982167],
        category: 'food',
      },

      //Ciutat Vella 
      {
        id: 'v14',
        name: 'Antiguo Tramo Fluvial del Río Turia',
        description: "Ex letto del fiume trasformato in parco lineare: perfetto in bici o a piedi.",
        coordinates: [39.47915889802897, -0.38669054724222435],
        category: 'nature',
      },
      {
        id: 'v15',
        name: 'Torri de serrans',
        description: "Imponenti torri in stile gotico Porte della città Vecchia di Valencia parte delle vecchie mura della citta con vista su Valencia e sul turia.",
        coordinates: [39.47982928583604, -0.3730792225735015],
        category: 'culture',
      },
      {
        id: 'v16',
        name: 'Orto Botanico di Valencia',
        description: "Giardino botanico storico dell’Università, in zona Quart.",
        coordinates: [39.4780, -0.3843],
        category: 'nature',
      },
      {
        id: 'v17',
        name: 'Barrio del Carmen',
        description: "Quartiere storico, street art, localini, piazzette e vibe notturna.",
        coordinates: [39.4785, -0.3775],
        category: 'culture',
      },
      {
        id: 'v18',
        name: 'Chiesa di San Nicola di Bari',
        description: "Chiesa barocca super decorata, spesso chiamata “Cappella Sistina valenciana”.",
        coordinates: [39.4769, -0.3793],
        category: 'culture',
      },
      {
        id: 'v19',
        name: 'L’Ermita Café',
        description: "Café in zona San Nicolás, buono come pausa nel centro storico.",
        coordinates: [39.4770, -0.3790],
        category: 'food',
      },
      {
        id: 'v20',
        name: 'Plaza redonda',
        description: "Piazza rotonda con mercatini e negozzietti.",
        coordinates: [39.474264207390085, -0.3742379368402519],
        category: 'culture',
      },
      {
        id: 'v21',
        name: 'Cattedrale di Valencia',
        description: "Cattedrale principale della città, tra Plaza de la Reina e Plaza de la Virgen. Stile gotico considerate la sede del santo graal con campanile storico con vita sulla città.",
        coordinates: [39.475854275233225, -0.37247840776851987],
        category: 'culture',
      },
      {
        id: 'v22',
        name: 'Taberna La Samorra',
        description: "Taberna tradizionale valenciana vicino alla Cattedrale. 4,7 su google.",
        coordinates: [39.476456569171496, -0.37395358090374353],
        category: 'food',
      },
      {
        id: 'v23',
        name: 'Loggia della Seta / Lonja de la Seda',
        description: "Capolavoro gotico civile e sito UNESCO, vicino al Mercato Centrale.",
        coordinates: [39.47454767171369, -0.3778696060813789],
        category: 'culture',
      },
      {
        id: 'v24',
        name: 'Casco antiguo de valencia',
        description: "Il centro storico nel suo insieme: Carmen, Seu, Mercat, piazze principali.",
        coordinates: [39.47454767171369, -0.37840604789257704],
        category: 'culture',
      },
      {
        id: 'v25',
        name: 'Mercat central de valencia',
        description: "Mercato storico coperto: perfetto per mangiare e vedere prodotti locali.",
        coordinates: [39.47362840090847, -0.37863135344444515],
        category: 'food',
      },
      {
        id: 'v26',
        name: 'Radio City',
        description: "Locale notturno storico in El Carmen, spesso musica/live/DJ.",
        coordinates: [39.47482968626019, -0.3807313927287753],
        category: 'disco',
      },
      {
        id: 'v27',
        name: 'Horchatería Santa Catalina',
        description: "Classica horchatería storica per horchata e fartons. Dimenticavo un’altra cosa tipica di Valencia è l’hochata tipo un latte strano a me non è piaciuta ma dovete provarla questo è un bar storico dove la fanno.",
        coordinates: [39.473914131328684, -0.3736092775565987],
        category: 'food',
      },
      {
        id: 'v28',
        name: 'Secret Restaurant',
        description: "Nome da verificare su Maps: segnato come posto per paella in zona centro/Plaza Redonda.",
        coordinates: [39.47343880434172, -0.37387855692460525],
        category: 'food',
      },
      {
        id: 'v29',
        name: 'Museo nazionale della ceramica',
        description: "Museo in palazzo con esterni sontuosi del XVIII secolo, che ospita ampie collezioni di ceramiche e oggetti d'arte.",
        coordinates: [39.47280110310773, -0.37372835322335984],
        category: 'culture',
      },
      {
        id: 'v30',
        name: 'Centro d’Arte Hortensia Herrero',
        description: "Centro d’arte contemporanea in un palazzo storico restaurato.",
        coordinates: [39.473917186093445, -0.3721812894590763],
        category: 'culture',
      },
      {
        id: 'v31',
        name: 'CCCC Centro del Carmen',
        description: "Centro di cultura contemporanea nel Carmen, spesso mostre belle e ingresso facile. Centro espositivo e culturale in ex convento del XIII secolo con campanile e chiostro gotico. Vicino c’è la casa dei gatti",
        coordinates: [39.47975871386094, -0.37825584418669117],
        category: 'culture',
      },
      {
        id: 'v32',
        name: 'Casa dels gats',
        description: "È tipo una porta di una casa in miniaturadove entrano I gatti attrazione un po turistica ma carina.",
        coordinates: [39.4798008562207, -0.37909976555293945],
        category: 'culture',
      },
      {
        id: 'v33',
        name: 'IVAM',
        description: "Sarebbe ISTITUTO VALENCIANO D’ARTE MODERNA Museo di arte moderna/contemporanea, molto utile per una Valencia più culturale.",
        coordinates: [39.4798008562207, -0.37909976555293945],
        category: 'culture',
      },
      {
        id: 'v34',
        name: 'Tasca El Botijo',
        description: "Tasca/tapas bar in El Carmen, vicino al Mercado Central.",
        coordinates: [39.4778, -0.3809],
        category: 'food',
      },
      {
        id: 'v35',
        name: 'Casa vani',
        description: "Tascas e tapas vicino il marcato centrale 4,7 su google.",
        coordinates: [39.47671080383604, -0.3788275648658518],
        category: 'food',
      },
      {
        id: 'v36',
        name: 'Plaza de la Reina',
        description: "Piazza centralissima davanti alla Cattedrale.",
        coordinates: [39.4748, -0.3756],
        category: 'culture',
      },
      {
        id: 'v37',
        name: 'Plaza Ayuntamiento',
        description: "Piazza monumentale del Municipio, perfetta come punto base.",
        coordinates: [39.4699, -0.3764],
        category: 'culture',
      },
      {
        id: 'v38',
        name: 'Barecito Ayuntamiento',
        description: "Bar moderno vicino al Municipio, in Calle Cotanda.",
        coordinates: [39.4702, -0.3761],
        category: 'food',
      },
      {
        id: 'v39',
        name: 'Only YOU Rooftop / El Mirador',
        description: "Rooftop elegante per drink con vista centro.",
        coordinates: [39.4709, -0.3746],
        category: 'food',
      },
      {
        id: 'v40',
        name: 'Stazione del Nord',
        description: "Stazione storica modernista, accanto a Plaza de Toros.",
        coordinates: [39.4674, -0.3772],
        category: 'our-places',
      },



      {
        id: '',
        name: 'Parco Naturale di Albufera',
        description: "Il Parco Naturale de L’Albufera è una vera oasi urbana a soli 10 chilometri da Valencia. Perditi tra i suoi boschi, passeggia lungo le dune naturali e lasciati sorprendere dalle centinaia di uccelli che lo frequentano durante tutto l’anno.",
        coordinates: [39.4862321187499, -0.35459252646245526],
        category: 'food',
      },
      // {
      //   id: 'v2',
      //   name: 'Catedral de Valencia',
      //   description: 'Stunning cathedral, home to the Holy Grail.',
      //   coordinates: [39.4753, -0.3755],
      //   category: 'culture',
      // },
      // {
      //   id: 'v3',
      //   name: 'Mercado Central',
      //   description: 'One of the oldest running food markets in Europe.',
      //   coordinates: [39.4735, -0.3790],
      //   category: 'food',
      // },
      // {
      //   id: 'v4',
      //   name: 'Torres de Serranos',
      //   description: 'Historic city gates offering panoramic views.',
      //   coordinates: [39.4792, -0.3760],
      //   category: 'culture',
      // },
      // {
      //   id: 'v5',
      //   name: 'Bioparc Valencia',
      //   description: 'Immersive zoo with naturalistic animal habitats.',
      //   coordinates: [39.4780, -0.4071],
      //   category: 'nature',
      // },
    ],
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    center: [38.9067, 1.4358],
    zoom: 12,
    pois: [
      {
        id: 'i1',
        name: 'Ushuaïa Ibiza',
        description: 'Best night club in Ibiza.',
        coordinates: [38.886127865025074, 1.4048454030280642],
        category: 'disco',
      },
      {
        id: 'i2',
        name: 'Pacha Ibiza',
        description: 'World-famous nightclub and icon of the island.',
        coordinates: [38.9141, 1.4429],
        category: 'disco',
      },
      {
        id: 'i3',
        name: 'Platja d\'en Bossa',
        description: 'The longest beach on the island, famous for its beach clubs.',
        coordinates: [38.8850, 1.4050],
        category: 'nature',
      },
      {
        id: 'i4',
        name: 'Es Vedrà Viewpoint',
        description: 'Breathtaking view of the mythical limestone island.',
        coordinates: [38.8703, 1.2231],
        category: 'nature',
      },
      {
        id: 'i5',
        name: 'Ses Salines',
        description: 'Stunning salt flats and crystal-clear turquoise waters.',
        coordinates: [38.8431, 1.3995],
        category: 'nature',
      },
      {
        id: 'i6',
        name: 'Amnesia',
        description: 'Stunning salt flats and crystal-clear turquoise waters.',
        coordinates: [38.948399920588855, 1.408131510456178],
        category: 'disco',
      },
    ],
  },
];
