const fs = require('fs');
const path = require('path');

const verbsPath = path.join(__dirname, '..', 'tools', 'es', 'conjugeur', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));

// Conjugation data map for all 87 verbs in Spanish
const participios = {
    "hablar": "hablado",
    "comer": "comido",
    "vivir": "vivido",
    "ser": "sido",
    "estar": "estado",
    "tener": "tenido",
    "ir": "ido",
    "hacer": "hecho",
    "querer": "querido",
    "poder": "podido",
    "escribir": "escrito",
    "escuchar": "escuchado",
    "leer": "leído",
    "saber": "sabido",
    "ver": "visto",
    "trabajar": "trabajado",
    "aprender": "aprendido",
    "comprar": "comprado",
    "vender": "vendido",
    "jugar": "jugado",
    "cocinar": "cocinado",
    "necesitar": "necesitado",
    "buscar": "buscado",
    "encontrar": "encontrado",
    "tomar": "tomado",
    "dar": "dado",
    "llevar": "llevado",
    "traer": "traído",
    "pensar": "pensado",
    "conocer": "conocido",
    "poner": "puesto",
    "salir": "salido",
    "llegar": "llegado",
    "entrar": "entrado",
    "volver": "vuelto",
    "viajar": "viajado",
    "caminar": "caminado",
    "correr": "corrido",
    "nadar": "nadado",
    "llamar": "llamado",
    "recordar": "recordado",
    "olvidar": "olvidado",
    "intentar": "intentado",
    "usar": "usado",
    "elegir": "elegido",
    "decidir": "decidido",
    "sentir": "sentido",
    "gustar": "gustado",
    "encantar": "encantado",
    "pasar": "pasado",
    "durar": "durado",
    "parar": "parado",
    "seguir": "seguido",
    "empezar": "empezado",
    "terminar": "terminado",
    "ganar": "ganado",
    "perder": "perdido",
    "regalar": "regalado",
    "recibir": "recibido",
    "enviar": "enviado",
    "alquilar": "alquilado",
    "quedar": "quedado",
    "parecer": "parecido",
    "romper": "roto",
    "abrir": "abierto",
    "cerrar": "cerrado",
    "tocar": "tocado",
    "mirar": "mirado",
    "estudiar": "estudiado",
    "explicar": "explicado",
    "significar": "significado",
    "preguntar": "preguntado",
    "responder": "respondido",
    "agradecer": "agradecido",
    "pedir": "pedido",
    "decir": "dicho",
    "contar": "contado",
    "creer": "creído",
    "esperar": "esperado",
    "reír": "reído",
    "llorar": "llorado",
    "bailar": "bailado",
    "cantar": "cantado",
    "pintar": "pintado",
    "dibujar": "dibujado",
    "visitar": "visitado",
    "invitar": "invitado"
};

const preteritoImperfecto = {
    "ser": ["era", "eras", "era", "éramos", "erais", "eran"],
    "ir": ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
    "ver": ["veía", "veías", "veía", "veíamos", "veíais", "veían"]
};

const futCondStems = {
    "tener": "tendr",
    "hacer": "har",
    "querer": "querr",
    "poder": "podr",
    "saber": "sabr",
    "poner": "pondr",
    "salir": "saldr",
    "decir": "dir",
    "reír": "reir"
};

const subjuntivoPresenteOverridden = {
    "ser": ["sea", "seas", "sea", "seamos", "seáis", "sean"],
    "estar": ["esté", "estés", "esté", "estemos", "estéis", "estén"],
    "ir": ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"],
    "saber": ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"],
    "dar": ["dé", "des", "dé", "demos", "deis", "den"],
    "ver": ["vea", "veas", "vea", "veamos", "veáis", "vean"],
    "pensar": ["piense", "pienses", "piense", "pensemos", "penséis", "piensen"],
    "querer": ["quiera", "quieras", "quiera", "queramos", "queráis", "quieran"],
    "poder": ["pueda", "puedas", "pueda", "podamos", "podáis", "puedan"],
    "jugar": ["juegue", "juegues", "juegue", "juguemos", "juguéis", "jueguen"],
    "encontrar": ["encuentre", "encuentres", "encuentre", "encontremos", "encontréis", "encuentren"],
    "recordar": ["recuerde", "recuerdes", "recuerde", "recordemos", "recordéis", "recuerden"],
    "volver": ["vuelva", "vuelvas", "vuelva", "volvamos", "volváis", "vuelvan"],
    "perder": ["pierda", "pierdas", "pierda", "perdamos", "perdáis", "pierdan"],
    "empezar": ["empiece", "empieces", "empiece", "empecemos", "empecéis", "empiecen"],
    "cerrar": ["cierre", "cierres", "cierre", "cerremos", "cerréis", "cierren"],
    "contar": ["cuente", "cuentes", "cuente", "contemos", "contéis", "cuenten"],
    "sentir": ["sienta", "sientas", "sienta", "sintamos", "sintáis", "sientan"],
    "elegir": ["elija", "elijas", "elija", "elijamos", "elijáis", "elijan"],
    "seguir": ["siga", "sigas", "siga", "sigamos", "sigáis", "sigan"],
    "pedir": ["pida", "pidas", "pida", "pidamos", "pidáis", "pidan"],
    "decir": ["diga", "digas", "diga", "digamos", "digáis", "digan"],
    "hacer": ["haga", "hagas", "haga", "hagamos", "hagáis", "hagan"],
    "tener": ["tenga", "tengas", "tenga", "tengamos", "tengáis", "tengan"],
    "poner": ["ponga", "pongas", "ponga", "pongamos", "pongáis", "pongan"],
    "salir": ["salga", "salgas", "salga", "salgamos", "salgáis", "salgan"],
    "traer": ["traiga", "traigas", "traiga", "traigamos", "traigáis", "traigan"],
    "conocer": ["conozca", "conozcas", "conozca", "conozcamos", "conozcáis", "conozcan"],
    "parecer": ["parezca", "parezcas", "parezca", "parezcamos", "parezcáis", "parezcan"],
    "agradecer": ["agradezca", "agradezcas", "agradezca", "agradezcamos", "agradezcáis", "agradezcan"],
    "reír": ["ría", "rías", "ría", "riamos", "riáis", "rían"],
    "enviar": ["envíe", "envíes", "envíe", "enviemos", "enviéis", "envíen"],
    "buscar": ["busque", "busques", "busque", "busquemos", "busquéis", "busquen"],
    "llegar": ["llegue", "llegues", "llegue", "lleguemos", "lleguéis", "lleguen"],
    "tocar": ["toque", "toques", "toque", "toquemos", "toquéis", "toquen"],
    "explicar": ["explique", "expliques", "explique", "expliquemos", "expliquéis", "expliquen"],
    "significar": ["signifique", "signifiques", "signifique", "signifiquemos", "signifiquéis", "signifiquen"]
};

const imperativoTu = {
    "decir": "di",
    "hacer": "haz",
    "ir": "ve",
    "poner": "pon",
    "salir": "sal",
    "tener": "ten",
    "ser": "sé",
    "estar": "está",
    "ver": "ve"
};

function getPreteritoImperfecto(verb, group) {
    if (preteritoImperfecto[verb]) return preteritoImperfecto[verb];
    const stem = verb.slice(0, -2);
    if (verb.endsWith('ar')) {
        return [
            stem + 'aba',
            stem + 'abas',
            stem + 'aba',
            stem + 'ábamos',
            stem + 'abais',
            stem + 'aban'
        ];
    } else {
        return [
            stem + 'ía',
            stem + 'ías',
            stem + 'ía',
            stem + 'íamos',
            stem + 'íais',
            stem + 'ían'
        ];
    }
}

function getPreteritoPerfectoCompuesto(verb) {
    const part = participios[verb];
    if (!part) throw new Error(`Missing participio for ${verb}`);
    return [
        `he ${part}`,
        `has ${part}`,
        `ha ${part}`,
        `hemos ${part}`,
        `habéis ${part}`,
        `han ${part}`
    ];
}

function getFuturoSimple(verb) {
    const stem = futCondStems[verb] || verb;
    return [
        stem + 'é',
        stem + 'ás',
        stem + 'á',
        stem + 'emos',
        stem + 'éis',
        stem + 'án'
    ];
}

function getCondicionalSimple(verb) {
    const stem = futCondStems[verb] || verb;
    return [
        stem + 'ía',
        stem + 'ías',
        stem + 'ía',
        stem + 'íamos',
        stem + 'íais',
        stem + 'ían'
    ];
}

function getSubjuntivoPresente(verb, presenteArr) {
    if (subjuntivoPresenteOverridden[verb]) return subjuntivoPresenteOverridden[verb];
    const yoForm = presenteArr[0];
    let stem = yoForm;
    if (yoForm.endsWith('o')) {
        stem = yoForm.slice(0, -1);
    }
    if (verb.endsWith('ar')) {
        return [
            stem + 'e',
            stem + 'es',
            stem + 'e',
            stem + 'emos',
            stem + 'éis',
            stem + 'en'
        ];
    } else {
        return [
            stem + 'a',
            stem + 'as',
            stem + 'a',
            stem + 'amos',
            stem + 'áis',
            stem + 'an'
        ];
    }
}

function getImperativo(verb, presenteArr, subjuntivoArr) {
    let tuForm;
    if (imperativoTu[verb]) {
        tuForm = imperativoTu[verb];
    } else {
        tuForm = presenteArr[2];
    }

    const ustedForm = subjuntivoArr[2];

    let vosotrosForm;
    if (verb === 'ir') {
        vosotrosForm = 'id';
    } else if (verb === 'reír') {
        vosotrosForm = 'reíd';
    } else {
        vosotrosForm = verb.slice(0, -1) + 'd';
    }

    const ustedesForm = subjuntivoArr[5];

    return [
        `${tuForm}!`,
        `${ustedForm}!`,
        `${vosotrosForm}!`,
        `${ustedesForm}!`
    ];
}

let countUpdated = 0;
let countFlagged = 0;

for (const [verbKey, verbData] of Object.entries(verbs)) {
    const presente = verbData.tenses.presente;
    const group = verbData.group;

    const imperfecto = getPreteritoImperfecto(verbKey, group);
    const perfectoCompuesto = getPreteritoPerfectoCompuesto(verbKey);
    const futuro = getFuturoSimple(verbKey);
    const condicional = getCondicionalSimple(verbKey);
    const subjuntivo = getSubjuntivoPresente(verbKey, presente);
    const imperativo = getImperativo(verbKey, presente, subjuntivo);

    verbData.tenses.preterito_imperfecto = imperfecto;
    verbData.tenses.preterito_perfecto_compuesto = perfectoCompuesto;
    verbData.tenses.futuro_simple = futuro;
    verbData.tenses.condicional_simple = condicional;
    verbData.tenses.subjuntivo_presente = subjuntivo;
    verbData.tenses.imperativo = imperativo;

    countUpdated++;
}

console.log(`Updated ${countUpdated} verbs.`);
console.log(`Flagged ${countFlagged} verbs for review.`);

fs.writeFileSync(verbsPath, JSON.stringify(verbs, null, 2) + '\n', 'utf8');
console.log('Saved to', verbsPath);
