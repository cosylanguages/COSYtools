const fs = require('fs');
const path = require('path');

const ptVerbsPath = path.join(__dirname, '..', 'tools', 'pt', 'conjugeur', 'data', 'verbs.json');
const verbs = JSON.parse(fs.readFileSync(ptVerbsPath, 'utf8'));

const irregulars = {
  'ser': {
    'preterito_imperfeito': ['era', 'eras', 'era', 'éramos', 'éreis', 'eram'],
    'futuro_do_presente': ['serei', 'serás', 'será', 'seremos', 'sereis', 'serão'],
    'futuro_do_preterito': ['seria', 'serias', 'seria', 'seríamos', 'seríeis', 'seriam'],
    'presente_subjuntivo': ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'],
    'imperativo': ['-', 'sê', 'seja', 'sejamos', 'sede', 'sejam']
  },
  'estar': {
    'preterito_imperfeito': ['estava', 'estavas', 'estava', 'estávamos', 'estáveis', 'estavam'],
    'futuro_do_presente': ['estarei', 'estarás', 'estará', 'estaremos', 'estareis', 'estarão'],
    'futuro_do_preterito': ['estaria', 'estarias', 'estaria', 'estaríamos', 'estaríeis', 'estariam'],
    'presente_subjuntivo': ['esteja', 'estejas', 'esteja', 'estejamos', 'estejais', 'estejam'],
    'imperativo': ['-', 'está', 'esteja', 'estejamos', 'estai', 'estejam']
  },
  'ter': {
    'preterito_imperfeito': ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'],
    'futuro_do_presente': ['terei', 'terás', 'terá', 'teremos', 'tereis', 'terão'],
    'futuro_do_preterito': ['teria', 'terias', 'teria', 'teríamos', 'teríeis', 'teriam'],
    'presente_subjuntivo': ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham'],
    'imperativo': ['-', 'tem', 'tenha', 'tenhamos', 'tende', 'tenham']
  },
  'ir': {
    'preterito_imperfeito': ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
    'futuro_do_presente': ['irei', 'irás', 'irá', 'iremos', 'ireis', 'irão'],
    'futuro_do_preterito': ['iria', 'irias', 'iria', 'iríamos', 'iríeis', 'iriam'],
    'presente_subjuntivo': ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão'],
    'imperativo': ['-', 'vai', 'vá', 'vamos', 'ide', 'vão']
  },
  'fazer': {
    'preterito_imperfeito': ['fazia', 'fazias', 'fazia', 'fazíamos', 'fazíeis', 'faziam'],
    'futuro_do_presente': ['farei', 'farás', 'fará', 'faremos', 'fareis', 'farão'],
    'futuro_do_preterito': ['faria', 'farias', 'faria', 'faríamos', 'faríeis', 'fariam'],
    'presente_subjuntivo': ['faça', 'faças', 'faça', 'façamos', 'façais', 'façam'],
    'imperativo': ['-', 'faz', 'faça', 'façamos', 'fazei', 'façam']
  },
  'dar': {
    'preterito_imperfeito': ['dava', 'davas', 'dava', 'dávamos', 'dáveis', 'davam'],
    'futuro_do_presente': ['darei', 'darás', 'dará', 'daremos', 'dareis', 'darão'],
    'futuro_do_preterito': ['daria', 'darias', 'daria', 'daríamos', 'daríeis', 'dariam'],
    'presente_subjuntivo': ['dê', 'dês', 'dê', 'demos', 'deis', 'deem'],
    'imperativo': ['-', 'dá', 'dê', 'demos', 'dai', 'deem']
  },
  'trazer': {
    'preterito_imperfeito': ['trazia', 'trazias', 'trazia', 'trazíamos', 'trazíeis', 'traziam'],
    'futuro_do_presente': ['trarei', 'trarás', 'trará', 'traremos', 'trareis', 'trarão'],
    'futuro_do_preterito': ['traria', 'trarias', 'traria', 'traríamos', 'traríeis', 'trariam'],
    'presente_subjuntivo': ['traga', 'tragas', 'traga', 'tragamos', 'tragais', 'tragam'],
    'imperativo': ['-', 'traz', 'traga', 'tragamos', 'trazei', 'tragam']
  },
  'pôr': {
    'preterito_imperfeito': ['punha', 'punhas', 'punha', 'púnhamos', 'púnheis', 'punham'],
    'futuro_do_presente': ['porei', 'porás', 'porá', 'poremos', 'poreis', 'porão'],
    'futuro_do_preterito': ['poria', 'porias', 'poria', 'poríamos', 'poríeis', 'poriam'],
    'presente_subjuntivo': ['ponha', 'ponhas', 'ponha', 'ponhamos', 'ponhais', 'ponham'],
    'imperativo': ['-', 'põe', 'ponha', 'ponhamos', 'ponde', 'ponham']
  },
  'sair': {
    'preterito_imperfeito': ['saía', 'saías', 'saía', 'saíamos', 'saíeis', 'saíam'],
    'futuro_do_presente': ['sairei', 'sairás', 'sairá', 'sairemos', 'saireis', 'sairão'],
    'futuro_do_preterito': ['sairia', 'sairias', 'sairia', 'sairíamos', 'sairíeis', 'sairiam'],
    'presente_subjuntivo': ['saia', 'saias', 'saia', 'saiamos', 'saiais', 'saiam'],
    'imperativo': ['-', 'sai', 'saia', 'saiamos', 'saí', 'saiam']
  },
  'dizer': {
    'preterito_imperfeito': ['dizia', 'dizias', 'dizia', 'dizíamos', 'dizíeis', 'diziam'],
    'futuro_do_presente': ['direi', 'dirás', 'dirá', 'diremos', 'direis', 'dirão'],
    'futuro_do_preterito': ['diria', 'dirias', 'diria', 'diríamos', 'diríeis', 'diriam'],
    'presente_subjuntivo': ['diga', 'digas', 'diga', 'digamos', 'digais', 'digam'],
    'imperativo': ['-', 'diz', 'diga', 'digamos', 'dizei', 'digam']
  },
  'rir': {
    'preterito_imperfeito': ['ria', 'rias', 'ria', 'ríamos', 'ríeis', 'riam'],
    'futuro_do_presente': ['rirei', 'rirás', 'rirá', 'riremos', 'rireis', 'rirão'],
    'futuro_do_preterito': ['riria', 'ririas', 'riria', 'riríamos', 'riríeis', 'ririam'],
    'presente_subjuntivo': ['ria', 'rias', 'ria', 'riamos', 'riais', 'riam'],
    'imperativo': ['-', 'ri', 'ria', 'riamos', 'ride', 'riam']
  },
  'sentir': {
    'preterito_imperfeito': ['sentia', 'sentias', 'sentia', 'sentíamos', 'sentíeis', 'sentiam'],
    'futuro_do_presente': ['sentirei', 'sentirás', 'sentirá', 'sentiremos', 'sentireis', 'sentirão'],
    'futuro_do_preterito': ['sentiria', 'sentirias', 'sentiria', 'sentiríamos', 'sentiríeis', 'sentiriam'],
    'presente_subjuntivo': ['sinta', 'sintas', 'sinta', 'sintamos', 'sintais', 'sintam'],
    'imperativo': ['-', 'sente', 'sinta', 'sintamos', 'senti', 'sintam']
  },
  'perder': {
    'preterito_imperfeito': ['perdia', 'perdias', 'perdia', 'perdíamos', 'perdíeis', 'perdiam'],
    'futuro_do_presente': ['perderei', 'perderás', 'perderá', 'perderemos', 'perdereis', 'perderão'],
    'futuro_do_preterito': ['perderia', 'perderias', 'perderia', 'perderíamos', 'perderíeis', 'perderiam'],
    'presente_subjuntivo': ['perca', 'percas', 'perca', 'percamos', 'percais', 'percam'],
    'imperativo': ['-', 'perde', 'perca', 'percamos', 'perdei', 'percam']
  },
  'pedir': {
    'preterito_imperfeito': ['pedia', 'pedias', 'pedia', 'pedíamos', 'pedíeis', 'pediam'],
    'futuro_do_presente': ['pedirei', 'pedirás', 'pedirá', 'pediremos', 'pedireis', 'pedirão'],
    'futuro_do_preterito': ['pediria', 'pedirias', 'pediria', 'pediríamos', 'pediríeis', 'pediriam'],
    'presente_subjuntivo': ['peça', 'peças', 'peça', 'peçamos', 'peçais', 'peçam'],
    'imperativo': ['-', 'pede', 'peça', 'peçamos', 'pedi', 'peçam']
  }
};

function generateTenses(verbKey, record) {
  if (irregulars[verbKey]) {
    return irregulars[verbKey];
  }

  const group = record.group;
  const presForms = record.tenses.presente;
  const passForms = record.tenses.passado;

  let stem = verbKey.endsWith('ar') || verbKey.endsWith('er') || verbKey.endsWith('ir') ? verbKey.slice(0, -2) : verbKey;

  // 1. preterito_imperfeito
  let imperfeito;
  if (group.includes('1ª') || verbKey.endsWith('ar')) {
    imperfeito = [
      stem + 'ava',
      stem + 'avas',
      stem + 'ava',
      stem + 'ávamos',
      stem + 'áveis',
      stem + 'avam'
    ];
  } else {
    // 2nd and 3rd conjugations (-er, -ir)
    imperfeito = [
      stem + 'ia',
      stem + 'ias',
      stem + 'ia',
      stem + 'íamos',
      stem + 'íeis',
      stem + 'iam'
    ];
  }

  // 2. futuro_do_presente
  const futuroPresente = [
    verbKey + 'ei',
    verbKey + 'ás',
    verbKey + 'á',
    verbKey + 'emos',
    verbKey + 'eis',
    verbKey + 'ão'
  ];

  // 3. futuro_do_preterito
  const futuroPreterito = [
    verbKey + 'ia',
    verbKey + 'ias',
    verbKey + 'ia',
    verbKey + 'íamos',
    verbKey + 'íeis',
    verbKey + 'iam'
  ];

  // 4. presente_subjuntivo
  let subjuntivo;
  if (group.includes('1ª') || verbKey.endsWith('ar')) {
    let subjStem = stem;
    if (verbKey.endsWith('car')) subjStem = verbKey.slice(0, -3) + 'qu';
    else if (verbKey.endsWith('gar')) subjStem = verbKey.slice(0, -3) + 'gu';
    else if (verbKey.endsWith('çar')) subjStem = verbKey.slice(0, -3) + 'c';

    subjuntivo = [
      subjStem + 'e',
      subjStem + 'es',
      subjStem + 'e',
      subjStem + 'emos',
      subjStem + 'eis',
      subjStem + 'em'
    ];
  } else {
    // -er or -ir
    let subjStem = presForms[0].endsWith('o') ? presForms[0].slice(0, -1) : stem;
    subjuntivo = [
      subjStem + 'a',
      subjStem + 'as',
      subjStem + 'a',
      subjStem + 'amos',
      subjStem + 'ais',
      subjStem + 'am'
    ];
  }

  // 5. imperativo
  // [ '-', tu, você, nós, vós, vocês ]
  const imperativo = [
    '-',
    presForms[2],
    subjuntivo[2],
    subjuntivo[3],
    presForms[4].slice(0, -1),
    subjuntivo[5]
  ];

  return {
    preterito_imperfeito: imperfeito,
    futuro_do_presente: futuroPresente,
    futuro_do_preterito: futuroPreterito,
    presente_subjuntivo: subjuntivo,
    imperativo: imperativo
  };
}

let updatedCount = 0;
for (const [verbKey, record] of Object.entries(verbs)) {
  const newTenses = generateTenses(verbKey, record);
  // Preserving presente and passado
  record.tenses = {
    presente: record.tenses.presente,
    passado: record.tenses.passado,
    preterito_imperfeito: newTenses.preterito_imperfeito,
    futuro_do_presente: newTenses.futuro_do_presente,
    futuro_do_preterito: newTenses.futuro_do_preterito,
    presente_subjuntivo: newTenses.presente_subjuntivo,
    imperativo: newTenses.imperativo
  };
  updatedCount++;
}

fs.writeFileSync(ptVerbsPath, JSON.stringify(verbs, null, 2) + '\n', 'utf8');
console.log(`Successfully updated ${updatedCount} verbs in ${ptVerbsPath}`);
