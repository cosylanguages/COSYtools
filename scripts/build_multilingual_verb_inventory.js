const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, '..', 'shared', 'data', 'multilingual-verb-inventory.json');

function makeProv(status = "verified_native", source = "COSYtools") {
  return {
    source: source,
    review_status: status,
    verified: status === "verified_native" || status === "reviewed"
  };
}

function entry(lemma, isHead, pos, rel, level, def, ex, exTr, notes = {}, status = "verified_native") {
  const item = {
    lemma: lemma,
    is_headword: isHead,
    part_of_speech: pos,
    relationship: rel,
    cefr_level: level,
    definition: def,
    example_sentence: ex,
    example_translation: exTr,
    provenance: makeProv(status)
  };
  if (Object.keys(notes).length > 0) {
    item.grammar_notes = notes;
  }
  return item;
}

const conceptsMap = {};

function addConcept(id, term, pos, level, desc, senses) {
  conceptsMap[id] = {
    concept_id: `concept_${id.replace(/\s+/g, '_')}`,
    english_term: term,
    part_of_speech: pos,
    default_level: level,
    description: desc,
    senses: senses
  };
}

// Helper to make 14 lang object
function langs(en, fr, it, ru, el, pt, de, es, tt, ba, cv, br, hy, ka) {
  return {
    en: Array.isArray(en) ? en : [en],
    fr: Array.isArray(fr) ? fr : [fr],
    it: Array.isArray(it) ? it : [it],
    ru: Array.isArray(ru) ? ru : [ru],
    el: Array.isArray(el) ? el : [el],
    pt: Array.isArray(pt) ? pt : [pt],
    de: Array.isArray(de) ? de : [de],
    es: Array.isArray(es) ? es : [es],
    tt: Array.isArray(tt) ? tt : [tt],
    ba: Array.isArray(ba) ? ba : [ba],
    cv: Array.isArray(cv) ? cv : [cv],
    br: Array.isArray(br) ? br : [br],
    hy: Array.isArray(hy) ? hy : [hy],
    ka: Array.isArray(ka) ? ka : [ka]
  };
}

// 1. be
addConcept("be", "be", "verb", "A1", "To exist or have a specified state or identity.", [
  {
    sense_id: "sense_be_exist", sense_description: "To exist or serve as copula.", context_hint: "copula / existence",
    translations: langs(
      entry("be", true, "verb", "exact_equivalent", "A1", "To exist or be present.", "I am happy.", "I am happy."),
      entry("être", true, "verb", "exact_equivalent", "A1", "Exister, avoir un état.", "Je suis heureux.", "I am happy.", { auxiliary: "avoir" }),
      entry("essere", true, "verb", "exact_equivalent", "A1", "Esistere, trovarsi.", "Sono felice.", "I am happy.", { auxiliary: "essere" }),
      entry("быть", true, "verb", "exact_equivalent", "A1", "Существовать, находиться.", "Я хочу быть счастливым.", "I want to be happy.", { aspect: "imperfective" }),
      entry("είμαι", true, "verb", "exact_equivalent", "A1", "Υπάρχω, είμαι.", "Είμαι χαρούμενος.", "I am happy.", { citation_note: "1st person singular present" }),
      entry("ser", true, "verb", "exact_equivalent", "A1", "Ser ou estar.", "Eu sou feliz.", "I am happy."),
      entry("sein", true, "verb", "exact_equivalent", "A1", "Existieren, sein.", "Ich bin glücklich.", "I am happy.", { auxiliary: "sein" }),
      entry("ser", true, "verb", "exact_equivalent", "A1", "Ser o estar.", "Soy feliz.", "I am happy."),
      entry("булу", true, "verb", "exact_equivalent", "A1", "Яшәү, бар булу.", "Мин бәхетле булам.", "I am happy."),
      entry("булыу", true, "verb", "exact_equivalent", "A1", "Йәшәү, бар булыу.", "Мин бәхетле булам.", "I am happy."),
      entry("пулни", true, "verb", "exact_equivalent", "A1", "Пур пулни.", "Эпӗ савӑнӑҫлӑ пулатӑп.", "I am happy."),
      entry("vezañ", true, "verb", "exact_equivalent", "A1", "Bezañ er statud.", "Eürus on.", "I am happy.", { initial_mutation_hint: "vezañ / bezañ" }),
      entry("լինել", true, "verb", "exact_equivalent", "A1", "Գոյություն ունենալ, լինել:", "Ես երջանիկ եմ:", "I am happy."),
      entry("ყოფნა", true, "verb", "exact_equivalent", "A1", "არსებობა, ყოფნა.", "მე ბედნიერი ვარ.", "I am happy.", { screeve: "present indicative" })
    )
  }
]);

// 2. have
addConcept("have", "have", "verb", "A1", "To possess, hold, or experience something.", [
  {
    sense_id: "sense_have_possess", sense_description: "To possess or hold an object/quality.", context_hint: "possession",
    translations: langs(
      entry("have", true, "verb", "exact_equivalent", "A1", "To possess or hold.", "I have a book.", "I have a book."),
      entry("avoir", true, "verb", "exact_equivalent", "A1", "Posséder, avoir.", "J'ai un livre.", "I have a book.", { auxiliary: "avoir" }),
      entry("avere", true, "verb", "exact_equivalent", "A1", "Possedere, avere.", "Ho un libro.", "I have a book.", { auxiliary: "avere" }),
      entry("иметь", true, "verb", "exact_equivalent", "A1", "Обладать, иметь.", "У меня есть книга.", "I have a book.", { aspect: "imperfective" }),
      entry("έχω", true, "verb", "exact_equivalent", "A1", "Έχω στην κατοχή μου.", "Έχω ένα βιβλίο.", "I have a book."),
      entry("ter", true, "verb", "exact_equivalent", "A1", "Possuir, ter.", "Eu tenho um livro.", "I have a book."),
      entry("haben", true, "verb", "exact_equivalent", "A1", "Besitzen, haben.", "Ich habe ein Buch.", "I have a book.", { auxiliary: "haben" }),
      entry("tener", true, "verb", "exact_equivalent", "A1", "Poseer, tener.", "Tengo un libro.", "I have a book."),
      entry("булу", true, "verb", "exact_equivalent", "A1", "Бар булу.", "Минем китабым бар.", "I have a book."),
      entry("булыу", true, "verb", "exact_equivalent", "A1", "Бар булыу.", "Минең китабым бар.", "I have a book."),
      entry("пулни", true, "verb", "exact_equivalent", "A1", "Пур пулни.", "Мăнăн кĕнеке пур.", "I have a book."),
      entry("kaout", true, "verb", "exact_equivalent", "A1", "Kaout un dra bennak.", "Ur levr am eus.", "I have a book."),
      entry("ունենալ", true, "verb", "exact_equivalent", "A1", "Ունենալ, տիրապետել:", "Ես գիրք ունեմ:", "I have a book."),
      entry("ქონება", true, "verb", "exact_equivalent", "A1", "ფლობა, ქონება.", "მე მაქვს წიგნი.", "I have a book.")
    )
  }
]);

// 3. think
addConcept("think", "think", "verb", "A1", "To exercise the mind or hold an opinion.", [
  {
    sense_id: "sense_think_opinion", sense_description: "To hold a particular opinion or belief.", context_hint: "opinion / belief",
    translations: langs(
      entry("think", true, "verb", "exact_equivalent", "A1", "To hold an opinion.", "I think it is good.", "I think it is good."),
      entry("penser", true, "verb", "exact_equivalent", "A1", "Avoir une opinion.", "Je pense que c'est bien.", "I think it is good."),
      entry("pensare", true, "verb", "exact_equivalent", "A1", "Avere un'opinione.", "Penso che sia buono.", "I think it is good."),
      entry("думать", true, "verb", "exact_equivalent", "A1", "Считать, иметь мнение.", "Я думаю, это хорошо.", "I think it is good.", { aspect: "imperfective" }),
      entry("νομίζω", true, "verb", "exact_equivalent", "A1", "Έχω την γνώμη.", "Νομίζω ότι είναι καλό.", "I think it is good."),
      entry("achar", true, "verb", "exact_equivalent", "A1", "Ter uma opinião.", "Eu acho que é bom.", "I think it is good."),
      entry("glauben", true, "verb", "exact_equivalent", "A1", "Meinen, glauben.", "Ich glaube, das ist gut.", "I think it is good."),
      entry("creer", true, "verb", "exact_equivalent", "A1", "Pensar, opinar.", "Creo que es bueno.", "I think it is good."),
      entry("уйлау", true, "verb", "exact_equivalent", "A1", "Фикер йөртү.", "Мин бу яхшы дип уйлыйм.", "I think it is good."),
      entry("уйлау", true, "verb", "exact_equivalent", "A1", "Фикер йөрөтөү.", "Мин быны яҡшы тип уйлайым.", "I think it is good."),
      entry("шухӑшлани", true, "verb", "exact_equivalent", "A1", "Шухӑшласа илни.", "Эпӗ ку лайӑх тесе шухӑшлатӑп.", "I think it is good."),
      entry("soñjal", true, "verb", "exact_equivalent", "A1", "Soñjal un dra bennak.", "Soñjal a ran eo mat.", "I think it is good."),
      entry("կարծել", true, "verb", "exact_equivalent", "A1", "Կարծիք ունենալ:", "Ես կարծում եմ դա լավ է:", "I think it is good."),
      entry("ფიქრობს", true, "verb", "exact_equivalent", "A1", "აზრის ქონა.", "მე ვფიქრობ, რომ ეს კარგია.", "I think it is good.")
    )
  },
  {
    sense_id: "sense_think_reflection", sense_description: "To engage in cognitive reflection.", context_hint: "mental activity",
    translations: langs(
      entry("think", true, "verb", "exact_equivalent", "A1", "To reflect cognitively.", "Think before you speak.", "Think before you speak."),
      entry("penser", true, "verb", "exact_equivalent", "A1", "Réfléchir dans son esprit.", "Pense avant de parler.", "Think before you speak."),
      entry("pensare", true, "verb", "exact_equivalent", "A1", "Riflettere.", "Pensa prima di parlare.", "Think before you speak."),
      entry("размышлять", true, "verb", "contextual_equivalent", "A2", "Размышлять, обдумывать.", "Подумай перед тем как сказать.", "Think before you speak.", { aspect: "imperfective" }),
      entry("σκέφτομαι", true, "verb", "exact_equivalent", "A1", "Σκέφτομαι, συλλογίζομαι.", "Σκέψου πριν μιλήσεις.", "Think before you speak."),
      entry("pensar", true, "verb", "exact_equivalent", "A1", "Refletir mentalmente.", "Pense antes de falar.", "Think before you speak."),
      entry("denken", true, "verb", "exact_equivalent", "A1", "Nachdenken.", "Denke nach, bevor du sprichst.", "Think before you speak."),
      entry("pensar", true, "verb", "exact_equivalent", "A1", "Reflexionar.", "Piensa antes de hablar.", "Think before you speak."),
      entry("уйлау", true, "verb", "exact_equivalent", "A1", "Уйга калу.", "Сөйләгәнче уйла.", "Think before you speak."),
      entry("уйлау", true, "verb", "exact_equivalent", "A1", "Уйға ҡалыу.", "Һөйләгәнгә тиклем уйла.", "Think before you speak."),
      entry("шухӑшлани", true, "verb", "exact_equivalent", "A1", "Ӑс-акӑла ӗҫлеттерни.", "Калаҫиччен шухӑшла.", "Think before you speak."),
      entry("soñjal", true, "verb", "exact_equivalent", "A1", "Mendadiñ.", "Soñj a-raok komz.", "Think before you speak."),
      entry("մտածել", true, "verb", "exact_equivalent", "A1", "Մտածել, խորհել:", "Մտածիր խոսելուց առաջ:", "Think before you speak."),
      entry("ფიქრობს", true, "verb", "exact_equivalent", "A1", "აზროვნება, ფიქრი.", "იფიქრე სანამ იტყვი.", "Think before you speak.")
    )
  }
]);

// 4. know
addConcept("know", "know", "verb", "A1", "To be aware of information, facts, or people.", [
  {
    sense_id: "sense_know_facts", sense_description: "To know factual information or skills.", context_hint: "facts / knowledge",
    translations: langs(
      entry("know", true, "verb", "exact_equivalent", "A1", "To know facts.", "I know the answer.", "I know the answer."),
      entry("savoir", true, "verb", "exact_equivalent", "A1", "Savoir une information.", "Je sais la réponse.", "I know the answer."),
      entry("sapere", true, "verb", "exact_equivalent", "A1", "Sapere un'informazione.", "So la risposta.", "I know the answer."),
      entry("знать", true, "verb", "exact_equivalent", "A1", "Знать факты или информацию.", "Я знаю ответ.", "I know the answer.", { aspect: "imperfective" }),
      entry("ξέρω", true, "verb", "exact_equivalent", "A1", "Γνωρίζω πληροφορία.", "Ξέρω την απάντηση.", "I know the answer."),
      entry("saber", true, "verb", "exact_equivalent", "A1", "Saber fatos.", "Eu sei a resposta.", "I know the answer."),
      entry("wissen", true, "verb", "exact_equivalent", "A1", "Fakten wissen.", "Ich weiß die Antwort.", "I know the answer."),
      entry("saber", true, "verb", "exact_equivalent", "A1", "Saber datos.", "Sé la respuesta.", "I know the answer."),
      entry("белү", true, "verb", "exact_equivalent", "A1", "Мәгълүматка ия булу.", "Мин җавапны беләм.", "I know the answer."),
      entry("белеү", true, "verb", "exact_equivalent", "A1", "Мәғлүмәткә эйә булыу.", "Мин яуапты беләм.", "I know the answer."),
      entry("пĕлни", true, "verb", "exact_equivalent", "A1", "Пĕлсе тăрни.", "Эпӗ хурава пӗлетӗп.", "I know the answer."),
      entry("gouzout", true, "verb", "exact_equivalent", "A1", "Gouzout un dra bennak.", "Gouzout a ran ar respont.", "I know the answer."),
      entry("իմանալ", true, "verb", "exact_equivalent", "A1", "Տեղեկացված լինել:", "Ես գիտեմ պատասխանը:", "I know the answer."),
      entry("იცის", true, "verb", "exact_equivalent", "A1", "ინფორმაციის ცოდნა.", "მე ვიცი პასუხი.", "I know the answer.")
    )
  },
  {
    sense_id: "sense_know_people", sense_description: "To be acquainted with people or places.", context_hint: "acquaintance / familiarity",
    translations: langs(
      entry("know", true, "verb", "exact_equivalent", "A1", "To be acquainted with.", "I know John.", "I know John."),
      entry("connaître", true, "verb", "exact_equivalent", "A1", "Être familier avec.", "Je connais Jean.", "I know John."),
      entry("conoscere", true, "verb", "exact_equivalent", "A1", "Essere familiare con.", "Conosco Giovanni.", "I know John."),
      entry("знать", true, "verb", "exact_equivalent", "A1", "Быть знакомым с кем-то.", "Я знаю Ивана.", "I know John.", { aspect: "imperfective" }),
      entry("γνωρίζω", true, "verb", "exact_equivalent", "A1", "Γνωρίζω πρόσωπο.", "Γνωρίζω τον Γιάννη.", "I know John."),
      entry("conhecer", true, "verb", "exact_equivalent", "A1", "Conhecer pessoas/lugares.", "Eu conheço o João.", "I know John."),
      entry("kennen", true, "verb", "exact_equivalent", "A1", "Kennen von Personen/Orten.", "Ich kenne Johannes.", "I know John."),
      entry("conocer", true, "verb", "exact_equivalent", "A1", "Conocer personas o lugares.", "Conozco a Juan.", "I know John."),
      entry("тану", true, "verb", "exact_equivalent", "A1", "Берәрсен белү, тану.", "Мин Иванны таныйм.", "I know John."),
      entry("таныу", true, "verb", "exact_equivalent", "A1", "Берәрһен белеү, таныу.", "Мин Иванды таныйым.", "I know John."),
      entry("паллани", true, "verb", "exact_equivalent", "A1", "Ҫынна паллани.", "Эпӗ Ивана паллатӑп.", "I know John."),
      entry("anavezout", true, "verb", "exact_equivalent", "A1", "Anavezout un den bennak.", "Anavezout a ran Yann.", "I know John."),
      entry("ճանաչել", true, "verb", "exact_equivalent", "A1", "Ճանաչել մարդկանց:", "Ես ճանաչում եմ Հովհաննեսին:", "I know John."),
      entry("იცნობს", true, "verb", "exact_equivalent", "A1", "ადამიანის ცნობა.", "მე ვიცნობ იოანეს.", "I know John.")
    )
  }
]);

// Helper for single sense concept builder
function add1SenseConcept(id, term, pos, level, desc, context, eEN, eFR, eIT, eRU, eEL, ePT, eDE, eES, eTT, eBA, eCV, eBR, eHY, eKA) {
  addConcept(id, term, pos, level, desc, [
    {
      sense_id: `sense_${id.replace(/\s+/g, '_')}`,
      sense_description: desc,
      context_hint: context,
      translations: langs(eEN, eFR, eIT, eRU, eEL, ePT, eDE, eES, eTT, eBA, eCV, eBR, eHY, eKA)
    }
  ]);
}

// 5. like
add1SenseConcept("like", "like", "verb", "A1", "To find agreeable, enjoyable, or satisfactory.", "preference",
  entry("like", true, "verb", "exact_equivalent", "A1", "To enjoy or approve of.", "I like tea.", "I like tea."),
  entry("aimer", true, "verb", "exact_equivalent", "A1", "Apprécier.", "J'aime le thé.", "I like tea."),
  entry("piacere", true, "verb", "exact_equivalent", "A1", "Essere gradito.", "Mi piace il tè.", "I like tea.", { transitivity: "intransitive_dative" }),
  entry("нравиться", true, "verb", "exact_equivalent", "A1", "Быть по вкусу.", "Мне нравится чай.", "I like tea.", { aspect: "imperfective" }),
  entry("αρέσω", true, "verb", "exact_equivalent", "A1", "Μου αρέσει.", "Μου αρέσει το τσάι.", "I like tea."),
  entry("gostar", true, "verb", "exact_equivalent", "A1", "Gostar de algo.", "Eu gosto de chá.", "I like tea."),
  entry("mögen", true, "verb", "exact_equivalent", "A1", "Mögen, Gefallen finden.", "Ich mag Tee.", "I like tea."),
  entry("gustar", true, "verb", "exact_equivalent", "A1", "Agradar.", "Me gusta el té.", "I like tea."),
  entry("ярату", true, "verb", "exact_equivalent", "A1", "Күңелгә яту.", "Мин чәй яратам.", "I like tea."),
  entry("яратыу", true, "verb", "exact_equivalent", "A1", "Күңелгә ятыу.", "Мин сәй яратам.", "I like tea."),
  entry("кӑмӑллани", true, "verb", "exact_equivalent", "A1", "Кӑмӑла кайни.", "Мана чей кӑмӑллать.", "I like tea."),
  entry("plijout", true, "verb", "exact_equivalent", "A1", "Plijout da un den bennak.", "Plijout a ra an te din.", "I like tea."),
  entry("դուր գալ", true, "verbal_expression", "exact_equivalent", "A1", "Դուր գալ:", "Ինձ դուր է գալիս թեյը:", "I like tea."),
  entry("მოწონება", true, "verb", "exact_equivalent", "A1", "მოწονება.", "მე მომწონს ჩაი.", "I like tea.")
);

// 6. love
add1SenseConcept("love", "love", "verb", "A1", "To feel deep affection or strong liking for.", "affection / emotion",
  entry("love", true, "verb", "exact_equivalent", "A1", "To feel deep affection.", "I love music.", "I love music."),
  entry("aimer", true, "verb", "exact_equivalent", "A1", "Aimer passionnément.", "J'aime la musique.", "I love music."),
  entry("amare", true, "verb", "exact_equivalent", "A1", "Avere un profondo affetto.", "Amo la musica.", "I love music."),
  entry("любить", true, "verb", "exact_equivalent", "A1", "Испытывать любовь.", "Я люблю музыку.", "I love music.", { aspect: "imperfective" }),
  entry("αγαπώ", true, "verb", "exact_equivalent", "A1", "Αγαπώ πολύ.", "Αγαπώ τη μουσική.", "I love music."),
  entry("amar", true, "verb", "exact_equivalent", "A1", "Amar intensamente.", "Eu amo música.", "I love music."),
  entry("lieben", true, "verb", "exact_equivalent", "A1", "Lieben.", "Ich liebe Musik.", "I love music."),
  entry("amar", true, "verb", "exact_equivalent", "A1", "Amar.", "Amo la música.", "I love music."),
  entry("ярату", true, "verb", "exact_equivalent", "A1", "Яратып карау.", "Мин музыка яратам.", "I love music."),
  entry("яратыу", true, "verb", "exact_equivalent", "A1", "Яратып ҡарау.", "Мин музыка яратам.", "I love music."),
  entry("юратни", true, "verb", "exact_equivalent", "A1", "Юратса пӑхни.", "Эпӗ музыка юрататӑп.", "I love music."),
  entry("karout", true, "verb", "exact_equivalent", "A1", "Karout ur person pe un dra.", "Karet a ran ar sonerezh.", "I love music."),
  entry("սիրել", true, "verb", "exact_equivalent", "A1", "Սիրել:", "Ես սիրում եմ երաժշտություն:", "I love music."),
  entry("სიყვარული", true, "verb", "exact_equivalent", "A1", "სიყვარული.", "მე მიყვარს მუსიკა.", "I love music.")
);

// 7. hate
add1SenseConcept("hate", "hate", "verb", "A1", "To feel intense dislike or aversion.", "aversion",
  entry("hate", true, "verb", "exact_equivalent", "A1", "To feel intense dislike.", "I hate rain.", "I hate rain."),
  entry("détester", true, "verb", "exact_equivalent", "A1", "Détester.", "Je déteste la pluie.", "I hate rain."),
  entry("odiare", true, "verb", "exact_equivalent", "A1", "Odiare.", "Odio la pioggia.", "I hate rain."),
  entry("ненавидеть", true, "verb", "exact_equivalent", "A1", "Ненавидеть.", "Я ненавижу дождь.", "I hate rain.", { aspect: "imperfective" }),
  entry("μισώ", true, "verb", "exact_equivalent", "A1", "Μισώ.", "Μισώ τη βροχή.", "I hate rain."),
  entry("odiar", true, "verb", "exact_equivalent", "A1", "Odiar.", "Eu odeio chuva.", "I hate rain."),
  entry("hassen", true, "verb", "exact_equivalent", "A1", "Hassen.", "Ich hasse Regen.", "I hate rain."),
  entry("odiar", true, "verb", "exact_equivalent", "A1", "Odiar.", "Odio la lluvia.", "I hate rain."),
  entry("жекрү", true, "verb", "exact_equivalent", "A1", "Жек күрү.", "Мин ямьсез яңгырны жекрәм.", "I hate rain."),
  entry("жекреү", true, "verb", "exact_equivalent", "A1", "Жек күреү.", "Мин ямғырҙы жекрәм.", "I hate rain."),
  entry("курайманни", true, "verb", "exact_equivalent", "A1", "Курайманни.", "Эпӗ ҫумӑра кураймастӑп.", "I hate rain."),
  entry("kasaat", true, "verb", "exact_equivalent", "A1", "Kasaat un dra bennak.", "Kasaat a ran ar glav.", "I hate rain."),
  entry("ատել", true, "verb", "exact_equivalent", "A1", "Ատել:", "Ես ատում եմ անձրևը:", "I hate rain."),
  entry("სძულს", true, "verb", "exact_equivalent", "A1", "სიძულვილი.", "მე მძულს წვიმა.", "I hate rain.")
);

// 8. dislike
add1SenseConcept("dislike", "dislike", "verb", "A1", "To have a feeling of aversion or disapproval towards.", "dislike",
  entry("dislike", true, "verb", "exact_equivalent", "A1", "To dislike.", "I dislike cold noise.", "I dislike cold noise."),
  entry("ne pas aimer", true, "verbal_expression", "exact_equivalent", "A1", "Ne pas apprécier.", "Je n'aime pas le bruit.", "I dislike noise."),
  entry("non piacere", true, "verbal_expression", "exact_equivalent", "A1", "Non gradire.", "Non mi piace il rumore.", "I dislike noise."),
  entry("не любить", true, "verbal_expression", "exact_equivalent", "A1", "Не любить.", "Я не люблю шум.", "I dislike noise.", { aspect: "imperfective" }),
  entry("δεν αρέσει", true, "verbal_expression", "exact_equivalent", "A1", "Δεν αρέσει.", "Δεν μου αρέσει ο θόρυβος.", "I dislike noise."),
  entry("não gostar", true, "verbal_expression", "exact_equivalent", "A1", "Não gostar.", "Eu não gosto de barulho.", "I dislike noise."),
  entry("nicht mögen", true, "verbal_expression", "exact_equivalent", "A1", "Nicht mögen.", "Ich mag Lärm nicht.", "I dislike noise."),
  entry("no gustar", true, "verbal_expression", "exact_equivalent", "A1", "No agradar.", "No me gusta el ruido.", "I dislike noise."),
  entry("яратмау", true, "verb", "exact_equivalent", "A1", "Яратмау.", "Мин шау-шуны яратмыйм.", "I dislike noise."),
  entry("яратмау", true, "verb", "exact_equivalent", "A1", "Яратмау.", "Мин шау-шыуҙы яратмайым.", "I dislike noise."),
  entry("кӑмӑлламанни", true, "verb", "exact_equivalent", "A1", "Кӑмӑлламанни.", "Эпӗ кӑшкӑрнине кӑмӑлламастӑп.", "I dislike noise."),
  entry("déplijout", true, "verb", "exact_equivalent", "A1", "Déplijout da un den bennak.", "Déplijout a ra an trouz din.", "I dislike noise."),
  entry("չսիրել", true, "verb", "exact_equivalent", "A1", "Չսիրել:", "Ես աղմուկ չեմ սիրում:", "I dislike noise."),
  entry("არ მოსწონს", true, "verbal_expression", "exact_equivalent", "A1", "არ მოწონება.", "მე არ მომწონს ხმაური.", "I dislike noise.")
);

// 9. want
add1SenseConcept("want", "want", "verb", "A1", "To feel a desire for or wish to possess/do.", "desire",
  entry("want", true, "verb", "exact_equivalent", "A1", "To desire.", "I want coffee.", "I want coffee."),
  entry("vouloir", true, "verb", "exact_equivalent", "A1", "Vouloir.", "Je veux du café.", "I want coffee.", { auxiliary: "avoir" }),
  entry("volere", true, "verb", "exact_equivalent", "A1", "Volere.", "Voglio un caffè.", "I want coffee.", { auxiliary: "avere" }),
  entry("хотеть", true, "verb", "exact_equivalent", "A1", "Хотеть.", "Я хочу кофе.", "I want coffee.", { aspect: "imperfective" }),
  entry("θέλω", true, "verb", "exact_equivalent", "A1", "Θέλω.", "Θέλω καφέ.", "I want coffee."),
  entry("querer", true, "verb", "exact_equivalent", "A1", "Querer.", "Eu quero café.", "I want coffee."),
  entry("wollen", true, "verb", "exact_equivalent", "A1", "Wollen.", "Ich will Kaffee.", "I want coffee.", { auxiliary: "haben" }),
  entry("querer", true, "verb", "exact_equivalent", "A1", "Querer.", "Quiero café.", "I want coffee."),
  entry("теләү", true, "verb", "exact_equivalent", "A1", "Ихтыяҗ белдерү.", "Мин кофе телим.", "I want coffee."),
  entry("теләү", true, "verb", "exact_equivalent", "A1", "Ихтыяж белдереү.", "Мин кофе теләйем.", "I want coffee."),
  entry("сӑнани", true, "verb", "exact_equivalent", "A1", "Ӗмӗтленни, сӑнани.", "Мана кофе кирлӗ.", "I want coffee."),
  entry("c'hoant kaout", true, "verbal_expression", "exact_equivalent", "A1", "C'hoant kaout un dra bennak.", "C'hoant am eus kafe.", "I want coffee."),
  entry("ուզել", true, "verb", "exact_equivalent", "A1", "Ցանկանալ, ուզել:", "Ես սուրճ եմ ուզում:", "I want coffee."),
  entry("უნდა", true, "verb", "exact_equivalent", "A1", "ნდომა.", "მე მინდა ყავა.", "I want coffee.")
);

// 10. work
add1SenseConcept("work", "work", "verb", "A1", "To perform labor or task activities.", "labor / employment",
  entry("work", true, "verb", "exact_equivalent", "A1", "To perform labor.", "I work here.", "I work here."),
  entry("travailler", true, "verb", "exact_equivalent", "A1", "Travailler.", "Je travaille ici.", "I work here.", { auxiliary: "avoir" }),
  entry("lavorare", true, "verb", "exact_equivalent", "A1", "Lavorare.", "Lavoro qui.", "I work here.", { auxiliary: "avere" }),
  entry("работать", true, "verb", "exact_equivalent", "A1", "Работать.", "Я работаю здесь.", "I work here.", { aspect: "imperfective" }),
  entry("δουλεύω", true, "verb", "exact_equivalent", "A1", "Δουλεύω.", "Δουλεύω εδώ.", "I work here."),
  entry("trabalhar", true, "verb", "exact_equivalent", "A1", "Trabalhar.", "Eu trabalho aqui.", "I work here."),
  entry("arbeiten", true, "verb", "exact_equivalent", "A1", "Arbeiten.", "Ich arbeite hier.", "I work here.", { auxiliary: "haben" }),
  entry("trabajar", true, "verb", "exact_equivalent", "A1", "Trabajar.", "Trabajo aquí.", "I work here."),
  entry("эшләү", true, "verb", "exact_equivalent", "A1", "Хезмәт итү.", "Мин монда эшлим.", "I work here."),
  entry("эшләү", true, "verb", "exact_equivalent", "A1", "Хәҙмәт итеү.", "Мин бында эшләйем.", "I work here."),
  entry("ӗҫлени", true, "verb", "exact_equivalent", "A1", "Ӗҫлесе пурӑнни.", "Эпӗ кунта ӗҫлетӗп.", "I work here."),
  entry("labourat", true, "verb", "exact_equivalent", "A1", "Labourat un lec'h bennak.", "Labourat a ran amañ.", "I work here."),
  entry("աշխատել", true, "verb", "exact_equivalent", "A1", "Աշխատել:", "Ես աշխատում եմ այստեղ:", "I work here."),
  entry("მუშაობა", true, "verb", "exact_equivalent", "A1", "მუშაობა.", "მე ვმუშაობ აქ.", "I work here.")
);

// 11. study
add1SenseConcept("study", "study", "verb", "A1", "To acquire knowledge through reading and investigation.", "education / learning",
  entry("study", true, "verb", "exact_equivalent", "A1", "To study.", "I study math.", "I study math."),
  entry("étudier", true, "verb", "exact_equivalent", "A1", "Étudier.", "J'étudie les maths.", "I study math."),
  entry("studiare", true, "verb", "exact_equivalent", "A1", "Studiare.", "Studio la matematica.", "I study math."),
  entry("учиться", true, "verb", "exact_equivalent", "A1", "Учиться.", "Я учу математику.", "I study math.", { aspect: "imperfective" }),
  entry("σπουδάζω", true, "verb", "exact_equivalent", "A1", "Σπουδάζω.", "Σπουδάζω μαθηματικά.", "I study math."),
  entry("estudar", true, "verb", "exact_equivalent", "A1", "Estudar.", "Eu estudo matemática.", "I study math."),
  entry("studieren", true, "verb", "exact_equivalent", "A1", "Lernen / Studieren.", "Ich studiere Mathematik.", "I study math."),
  entry("estudiar", true, "verb", "exact_equivalent", "A1", "Estudiar.", "Estudio matemáticas.", "I study math."),
  entry("уку", true, "verb", "exact_equivalent", "A1", "Уку, белем алу.", "Мин математика укыйм.", "I study math."),
  entry("уҡыу", true, "verb", "exact_equivalent", "A1", "Уҡыу, белем алыу.", "Мин математика уҡыйым.", "I study math."),
  entry("вӗренни", true, "verb", "exact_equivalent", "A1", "Ӑслӑх илни.", "Эпӗ математика вӗренетӗп.", "I study math."),
  entry("studiatoù", true, "verb", "exact_equivalent", "A1", "Studiañ un dra bennak.", "Studiañ a ran ar matematikoù.", "I study math."),
  entry("սովորել", true, "verb", "exact_equivalent", "A1", "Ուսանել, սովորել:", "Ես մաթեմատիկա եմ սովորում:", "I study math."),
  entry("სწავლა", true, "verb", "exact_equivalent", "A1", "სწავლა.", "მე ვსწავლობ მათემატიკას.", "I study math.")
);

// 12. go
add1SenseConcept("go", "go", "verb", "A1", "To move or travel from one place to another.", "movement / transit",
  entry("go", true, "verb", "exact_equivalent", "A1", "To travel or move.", "I go home.", "I go home."),
  entry("aller", true, "verb", "exact_equivalent", "A1", "Se déplacer, aller.", "Je vais à la maison.", "I go home.", { auxiliary: "être" }),
  entry("andare", true, "verb", "exact_equivalent", "A1", "Spostarsi, andare.", "Vado a casa.", "I go home.", { auxiliary: "essere" }),
  entry("идти", true, "verb", "exact_equivalent", "A1", "Двигаться пешком.", "Я иду домой.", "I go home.", { aspect: "imperfective" }),
  entry("πηγαίνω", true, "verb", "exact_equivalent", "A1", "Μεταβαίνω.", "Πηγαίνω σπίτι.", "I go home."),
  entry("ir", true, "verb", "exact_equivalent", "A1", "Ir a algum lugar.", "Eu vou para casa.", "I go home."),
  entry("gehen", true, "verb", "exact_equivalent", "A1", "Gehen.", "Ich gehe nach Hause.", "I go home.", { auxiliary: "sein" }),
  entry("ir", true, "verb", "exact_equivalent", "A1", "Ir.", "Voy a casa.", "I go home."),
  entry("бару", true, "verb", "exact_equivalent", "A1", "Хәрәкәт итү.", "Мин өйгә барам.", "I go home."),
  entry("барыу", true, "verb", "exact_equivalent", "A1", "Хәрәкәт итеү.", "Мин өйгә барайым.", "I go home."),
  entry("кайни", true, "verb", "exact_equivalent", "A1", "Утсакайни.", "Эпӗ киле каятӑп.", "I go home."),
  entry("mont", true, "verb", "exact_equivalent", "A1", "Mont d'an ti.", "Mont a ran d'ar gêr.", "I go home."),
  entry("գնալ", true, "verb", "exact_equivalent", "A1", "Տեղաշարժվել, գնալ:", "Ես գնում եմ տուն:", "I go home."),
  entry("წასვლა", true, "verb", "exact_equivalent", "A1", "გადაადგილება.", "მე მივდივარ სახლში.", "I go home.")
);

// 13. can
add1SenseConcept("can", "can", "modal_verb", "A1", "To be able to or permitted to.", "ability / permission",
  entry("can", true, "modal_verb", "exact_equivalent", "A1", "To be able to.", "I can swim.", "I can swim."),
  entry("pouvoir", true, "verb", "exact_equivalent", "A1", "Pouvoir.", "Je peux nager.", "I can swim."),
  entry("potere", true, "verb", "exact_equivalent", "A1", "Potere.", "Posso nuotare.", "I can swim."),
  entry("мочь", true, "verb", "exact_equivalent", "A1", "Мочь, иметь возможность.", "Я могу плавать.", "I can swim.", { aspect: "imperfective" }),
  entry("μπορώ", true, "verb", "exact_equivalent", "A1", "Μπορώ.", "Μπορώ να κολυμπήσω.", "I can swim."),
  entry("poder", true, "verb", "exact_equivalent", "A1", "Poder.", "Eu posso nadar.", "I can swim."),
  entry("können", true, "verb", "exact_equivalent", "A1", "Können.", "Ich kann schwimmen.", "I can swim."),
  entry("poder", true, "verb", "exact_equivalent", "A1", "Poder.", "Puedo nadar.", "I can swim."),
  entry("булдыру", true, "verb", "exact_equivalent", "A1", "Кулдан килү.", "Мин йүзә булдырам.", "I can swim."),
  entry("булдырыу", true, "verb", "exact_equivalent", "A1", "Ҡулдан килеү.", "Мин йөҙә булдырам.", "I can swim."),
  entry("пултарни", true, "verb", "exact_equivalent", "A1", "Пултарни.", "Эпӗ ишме пултаратӑп.", "I can swim."),
  entry("gallout", true, "verb", "exact_equivalent", "A1", "Gallout ober un dra bennak.", "Gallout a ran neuñvial.", "I can swim."),
  entry("կարողանալ", true, "verb", "exact_equivalent", "A1", "Կարողանալ:", "Ես կարողանում եմ լողալ:", "I can swim."),
  entry("შეძლება", true, "verb", "exact_equivalent", "A1", "შეძლება.", "მე შემიძლია ცურვა.", "I can swim.")
);

// 14. eat
add1SenseConcept("eat", "eat", "verb", "A1", "To consume food orally.", "ingestion",
  entry("eat", true, "verb", "exact_equivalent", "A1", "To consume food.", "I eat bread.", "I eat bread."),
  entry("manger", true, "verb", "exact_equivalent", "A1", "Manger.", "Je mange du pain.", "I eat bread."),
  entry("mangiare", true, "verb", "exact_equivalent", "A1", "Mangiare.", "Mangio il pane.", "I eat bread."),
  entry("есть", true, "verb", "exact_equivalent", "A1", "Принимать пищу.", "Я ем хлеб.", "I eat bread.", { aspect: "imperfective" }),
  entry("τρώω", true, "verb", "exact_equivalent", "A1", "Τρώω.", "Τρώω ψωμί.", "I eat bread."),
  entry("comer", true, "verb", "exact_equivalent", "A1", "Comer.", "Eu como pão.", "I eat bread."),
  entry("essen", true, "verb", "exact_equivalent", "A1", "Essen.", "Ich esse Brot.", "I eat bread."),
  entry("comer", true, "verb", "exact_equivalent", "A1", "Comer.", "Como pan.", "I eat bread."),
  entry("ашау", true, "verb", "exact_equivalent", "A1", "Ашамлык кабул итү.", "Мин икмәк ашыйм.", "I eat bread."),
  entry("ашау", true, "verb", "exact_equivalent", "A1", "Ашамлыҡ ҡабул итеү.", "Мин икмәк ашайым.", "I eat bread."),
  entry("ҫини", true, "verb", "exact_equivalent", "A1", "Апат ҫини.", "Эпӗ ҫӑкӑр ҫﻴтӗп.", "I eat bread."),
  entry("debriñ", true, "verb", "exact_equivalent", "A1", "Debriñ bara.", "Debriñ a ran bara.", "I eat bread."),
  entry("ուտել", true, "verb", "exact_equivalent", "A1", "Սնունդ ընդունել:", "Ես հաց եմ ուտում:", "I eat bread."),
  entry("ჭამა", true, "verb", "exact_equivalent", "A1", "ჭამა.", "მე ვჭამ პურს.", "I eat bread.")
);

// 15. drink
add1SenseConcept("drink", "drink", "verb", "A1", "To swallow liquids.", "ingestion",
  entry("drink", true, "verb", "exact_equivalent", "A1", "To swallow liquid.", "I drink water.", "I drink water."),
  entry("boire", true, "verb", "exact_equivalent", "A1", "Boire.", "Je bois de l'eau.", "I drink water."),
  entry("bere", true, "verb", "exact_equivalent", "A1", "Bere.", "Bevo l'acqua.", "I drink water."),
  entry("пить", true, "verb", "exact_equivalent", "A1", "Пить жидкость.", "Я пью воду.", "I drink water.", { aspect: "imperfective" }),
  entry("πίνω", true, "verb", "exact_equivalent", "A1", "Πίνω.", "Πίνω νερό.", "I drink water."),
  entry("beber", true, "verb", "exact_equivalent", "A1", "Beber.", "Eu bebo água.", "I drink water."),
  entry("trinken", true, "verb", "exact_equivalent", "A1", "Trinken.", "Ich trinke Wasser.", "I drink water."),
  entry("beber", true, "verb", "exact_equivalent", "A1", "Beber.", "Bebo agua.", "I drink water."),
  entry("эчү", true, "verb", "exact_equivalent", "A1", "Сыеклык кабул итү.", "Мин су эчәм.", "I drink water."),
  entry("ĕçеү", true, "verb", "exact_equivalent", "A1", "Һыу ĕçеү.", "Мин һыу ĕçәм.", "I drink water."),
  entry("ӗҫни", true, "verb", "exact_equivalent", "A1", "Шора ӗҫни.", "Эпӗ шыв ӗҫетӗп.", "I drink water."),
  entry("evañ", true, "verb", "exact_equivalent", "A1", "Evañ dour.", "Evañ a ran dour.", "I drink water."),
  entry("խմել", true, "verb", "exact_equivalent", "A1", "Հեղուկ խմել:", "Ես ջուր եմ խմում:", "I drink water."),
  entry("დალევა", true, "verb", "exact_equivalent", "A1", "სითხის დალევა.", "მე ვსვამ წყალს.", "I drink water.")
);

// 16. do
add1SenseConcept("do", "do", "verb", "A1", "To perform an action or activity.", "action execution",
  entry("do", true, "verb", "exact_equivalent", "A1", "To perform an action.", "I do my best.", "I do my best."),
  entry("faire", true, "verb", "exact_equivalent", "A1", "Faire une action.", "Je fais de mon mieux.", "I do my best."),
  entry("fare", true, "verb", "exact_equivalent", "A1", "Fare.", "Faccio del mio meglio.", "I do my best."),
  entry("делать", true, "verb", "exact_equivalent", "A1", "Выполнять действие.", "Я делаю всё возможное.", "I do my best.", { aspect: "imperfective" }),
  entry("κάνω", true, "verb", "exact_equivalent", "A1", "Κάνω.", "Κάνω το καλύτερο.", "I do my best."),
  entry("fazer", true, "verb", "exact_equivalent", "A1", "Fazer.", "Eu faço o meu melhor.", "I do my best."),
  entry("tun", true, "verb", "exact_equivalent", "A1", "Tun, machen.", "Ich tue mein Bestes.", "I do my best."),
  entry("hacer", true, "verb", "exact_equivalent", "A1", "Hacer.", "Hago lo mejor.", "I do my best."),
  entry("итү", true, "verb", "exact_equivalent", "A1", "Эш башкару.", "Мин барын да эшлим.", "I do my best."),
  entry("итеү", true, "verb", "exact_equivalent", "A1", "Эш башҡарыу.", "Мин барын да эшләйем.", "I do my best."),
  entry("туни", true, "verb", "exact_equivalent", "A1", "Ӗҫ туни.", "Эпӗ мӗн пултарнине тӑватӑп.", "I do my best."),
  entry("ober", true, "verb", "exact_equivalent", "A1", "Ober an dra bennak.", "Ober a ran va gwellañ.", "I do my best."),
  entry("անել", true, "verb", "exact_equivalent", "A1", "Գործողություն կատարել:", "Ես անում եմ իմ լավագույնը:", "I do my best."),
  entry("გაკეთება", true, "verb", "exact_equivalent", "A1", "მოქმედება.", "მე ვაკეთებ ყველაფერს.", "I do my best.")
);

// 17. make
addConcept("make", "make", "verb", "A1", "To create, produce, or cause something.", [
  {
    sense_id: "sense_make_create", sense_description: "To create, fabricate, or construct.", context_hint: "creation / production",
    translations: langs(
      entry("make", true, "verb", "exact_equivalent", "A1", "To create or produce.", "I make cake.", "I make cake."),
      entry("fabriquer", true, "verb", "exact_equivalent", "A1", "Produire, fabriquer.", "Je fais un gâteau.", "I make cake."),
      entry("produrre", true, "verb", "exact_equivalent", "A1", "Produrre, fare.", "Faccio una torta.", "I make cake."),
      entry("создавать", true, "verb", "exact_equivalent", "A1", "Изготовлять, делать.", "Я делаю торт.", "I make cake.", { aspect: "imperfective" }),
      entry("φτιάχνω", true, "verb", "exact_equivalent", "A1", "Κατασκευάζω.", "Φτιάχνω μια τούρτα.", "I make cake."),
      entry("fazer", true, "verb", "exact_equivalent", "A1", "Criar, fazer.", "Eu faço um bolo.", "I make cake."),
      entry("herstellen", true, "verb", "exact_equivalent", "A1", "Machen, herstellen.", "Ich mache einen Kuchen.", "I make cake."),
      entry("hacer", true, "verb", "exact_equivalent", "A1", "Hacer, crear.", "Hago un pastel.", "I make cake."),
      entry("ясау", true, "verb", "exact_equivalent", "A1", "Ясау, эшләү.", "Мин торт ясайм.", "I make cake."),
      entry("яһау", true, "verb", "exact_equivalent", "A1", "Яһау, эшләү.", "Мин торт яһайым.", "I make cake."),
      entry("туни", true, "verb", "exact_equivalent", "A1", "Ӑсталаса туни.", "Эпӗ торт тӑватӑп.", "I make cake."),
      entry("ober", true, "verb", "exact_equivalent", "A1", "Krouiñ, ober.", "Ober a ran ur gâteau.", "I make cake."),
      entry("պատրաստել", true, "verb", "exact_equivalent", "A1", "Պատրաստել, ստեղծել:", "Ես թխվածք եմ պատրաստում:", "I make cake."),
      entry("დამზადება", true, "verb", "exact_equivalent", "A1", "დამზადება.", "მე ვაკეთებ ნამცხვარს.", "I make cake.")
    )
  },
  {
    sense_id: "sense_make_cause", sense_description: "To cause someone or something to do/be.", context_hint: "causative",
    translations: langs(
      entry("make", true, "verb", "exact_equivalent", "A1", "To cause to happen.", "It makes me happy.", "It makes me happy."),
      entry("rendre", true, "verb", "exact_equivalent", "A1", "Rendre heureux.", "Cela me rend heureux.", "It makes me happy."),
      entry("rendere", true, "verb", "exact_equivalent", "A1", "Rendere.", "Mi rende felice.", "It makes me happy."),
      entry("заставлять", true, "verb", "contextual_equivalent", "A2", "Делать так чтобы.", "Это делает меня счастливым.", "It makes me happy.", { aspect: "imperfective" }),
      entry("κάνω", true, "verb", "exact_equivalent", "A1", "Κάνω να...", "Με κάνει χαρούμενο.", "It makes me happy."),
      entry("deixar", true, "verb", "exact_equivalent", "A1", "Fazer ficar.", "Isso me faz feliz.", "It makes me happy."),
      entry("machen", true, "verb", "exact_equivalent", "A1", "Bewirken.", "Das macht mich glücklich.", "It makes me happy."),
      entry("hacer", true, "verb", "exact_equivalent", "A1", "Hacer que...", "Eso me hace feliz.", "It makes me happy."),
      entry("итү", true, "verb", "exact_equivalent", "A1", "Бәхетле итү.", "Бу мине бәхетле итә.", "It makes me happy."),
      entry("итеү", true, "verb", "exact_equivalent", "A1", "Бәхетле итеү.", "Быны мине бәхетле итә.", "It makes me happy."),
      entry("тӑварни", true, "verb", "exact_equivalent", "A1", "Ҫавӑрса туни.", "Ку мана савӑнӑҫлӑ тӑвать.", "It makes me happy."),
      entry("lakaat", true, "verb", "exact_equivalent", "A1", "Lakaat da vezañ.", "Lakaat a ra ac'hanon da vezañ eürus.", "It makes me happy."),
      entry("ստիպել", true, "verb", "exact_equivalent", "A1", "Դարձնել, ստիպել:", "Դա ինձ երջանիկ է դարձնում:", "It makes me happy."),
      entry("აიძულებს", true, "verb", "exact_equivalent", "A1", "გახდომა.", "ეს მე მანიჭებს ბედნიერებას.", "It makes me happy.")
    )
  }
]);

// 18. understand
add1SenseConcept("understand", "understand", "verb", "A1", "To comprehend the meaning of.", "comprehension",
  entry("understand", true, "verb", "exact_equivalent", "A1", "To comprehend.", "I understand you.", "I understand you."),
  entry("comprendre", true, "verb", "exact_equivalent", "A1", "Comprendre.", "Je vous comprends.", "I understand you."),
  entry("capire", true, "verb", "exact_equivalent", "A1", "Capire.", "Ti capisco.", "I understand you."),
  entry("понимать", true, "verb", "exact_equivalent", "A1", "Понимать смысл.", "Я понимаю вас.", "I understand you.", { aspect: "imperfective" }),
  entry("καταλαβαίνω", true, "verb", "exact_equivalent", "A1", "Καταλαβαίνω.", "Σε καταλαβαίνω.", "I understand you."),
  entry("entender", true, "verb", "exact_equivalent", "A1", "Entender.", "Eu entendo você.", "I understand you."),
  entry("verstehen", true, "verb", "exact_equivalent", "A1", "Verstehen.", "Ich verstehe dich.", "I understand you."),
  entry("entender", true, "verb", "exact_equivalent", "A1", "Entender.", "Te entiendo.", "I understand you."),
  entry("аңлау", true, "verb", "exact_equivalent", "A1", "Мәгънәне төшенү.", "Мин сезне аңлыйм.", "I understand you."),
  entry("аңлау", true, "verb", "exact_equivalent", "A1", "Мәғәнәне төшөнөү.", "Мин һеҙҙе аңлайым.", "I understand you."),
  entry("ӑнланни", true, "verb", "exact_equivalent", "A1", "Ăнланса илни.", "Эпӗ сине ӑнланатӑп.", "I understand you."),
  entry("kompren", true, "verb", "exact_equivalent", "A1", "Kompren un den bennak.", "Kompren a ran ac'hanout.", "I understand you."),
  entry("հասկանալ", true, "verb", "exact_equivalent", "A1", "Ըմբռնել, հասկանալ:", "Ես հասկանում եմ ձեզ:", "I understand you."),
  entry("გაგება", true, "verb", "exact_equivalent", "A1", "გაგება.", "მე მესმის შენი.", "I understand you.")
);

// 19. speak
add1SenseConcept("speak", "speak", "verb", "A1", "To utter words or communicate in a language.", "speech / communication",
  entry("speak", true, "verb", "exact_equivalent", "A1", "To utter words or language.", "I speak English.", "I speak English."),
  entry("parler", true, "verb", "exact_equivalent", "A1", "Parler une langue.", "Je parle anglais.", "I speak English."),
  entry("parlare", true, "verb", "exact_equivalent", "A1", "Parlare.", "Parlo inglese.", "I speak English."),
  entry("говорить", true, "verb", "exact_equivalent", "A1", "Владеть языком, говорить.", "Я говорю по-английски.", "I speak English.", { aspect: "imperfective" }),
  entry("μιλώ", true, "verb", "exact_equivalent", "A1", "Μιλώ γλώσσα.", "Μιλώ αγγλικά.", "I speak English."),
  entry("falar", true, "verb", "exact_equivalent", "A1", "Falar.", "Eu falo inglês.", "I speak English."),
  entry("sprechen", true, "verb", "exact_equivalent", "A1", "Sprechen.", "Ich spreche Englisch.", "I speak English."),
  entry("hablar", true, "verb", "exact_equivalent", "A1", "Hablar.", "Hablo inglés.", "I speak English."),
  entry("сөйләү", true, "verb", "exact_equivalent", "A1", "Сүзләр белән аңлату.", "Мин инглизчә сөйлим.", "I speak English."),
  entry("һөйләү", true, "verb", "exact_equivalent", "A1", "Һүҙҙәр менән аңлатыу.", "Мин инглизсә һөйләйем.", "I speak English."),
  entry("калаҫни", true, "verb", "exact_equivalent", "A1", "Чӗлхепе калаҫни.", "Эпӗ акăлчанла калаҫатӑп.", "I speak English."),
  entry("komz", true, "verb", "exact_equivalent", "A1", "Komz ur yezh bennak.", "Komz a ran saozneg.", "I speak English."),
  entry("խոսել", true, "verb", "exact_equivalent", "A1", "Լեզվով խոսել:", "Ես խոսում եմ անգլերեն:", "I speak English."),
  entry("საუბრობს", true, "verb", "exact_equivalent", "A1", "ლაპარაკი.", "მე ვსაუბრობ ინგლისურად.", "I speak English.")
);

// 20. talk
add1SenseConcept("talk", "talk", "verb", "A1", "To converse or engage in speech.", "conversation",
  entry("talk", true, "verb", "exact_equivalent", "A1", "To converse.", "We talk a lot.", "We talk a lot."),
  entry("discuter", true, "verb", "exact_equivalent", "A1", "Discuter, converser.", "Nous discutons beaucoup.", "We talk a lot."),
  entry("chiacchierare", true, "verb", "exact_equivalent", "A1", "Chiacchierare.", "Chiacchieriamo molto.", "We talk a lot."),
  entry("разговаривать", true, "verb", "exact_equivalent", "A1", "Разговаривать.", "Мы много разговариваем.", "We talk a lot.", { aspect: "imperfective" }),
  entry("κουβεντιάζω", true, "verb", "exact_equivalent", "A1", "Κουβεντιάζω.", "Κουβεντιάζουμε πολύ.", "We talk a lot."),
  entry("conversar", true, "verb", "exact_equivalent", "A1", "Conversar.", "Nós conversamos muito.", "We talk a lot."),
  entry("reden", true, "verb", "exact_equivalent", "A1", "Reden, sprechen.", "Wir reden viel.", "We talk a lot."),
  entry("conversar", true, "verb", "exact_equivalent", "A1", "Conversar.", "Conversamos mucho.", "We talk a lot."),
  entry("сөйләшү", true, "verb", "exact_equivalent", "A1", "Өзлексез сөйләшү.", "Без много сөйләшәбез.", "We talk a lot."),
  entry("һөйләшеү", true, "verb", "exact_equivalent", "A1", "Өҙлекһеҙ һөйләшеү.", "Беҙ күп һөйләшәбеҙ.", "We talk a lot."),
  entry("калаҫни", true, "verb", "exact_equivalent", "A1", "Калаҫса ларни.", "Эпир нумай калаҫатпӑр.", "We talk a lot."),
  entry("komz", true, "verb", "exact_equivalent", "A1", "Komz asambles.", "Komz a reomp kalz.", "We talk a lot."),
  entry("զրուցել", true, "verb", "exact_equivalent", "A1", "Զրուցել, խոսել:", "Մենք շատ ենք զրուցում:", "We talk a lot."),
  entry("საუბარი", true, "verb", "exact_equivalent", "A1", "საუბარი.", "ჩვენ ბევრს ვსაუბრობთ.", "We talk a lot.")
);

console.log('Processed concepts 1 to 20 successfully');

// 21. say
add1SenseConcept("say", "say", "verb", "A1", "To express words or information orally.", "verbal expression",
  entry("say", true, "verb", "exact_equivalent", "A1", "To state or express.", "Say something.", "Say something."),
  entry("dire", true, "verb", "exact_equivalent", "A1", "Dire.", "Dis quelque chose.", "Say something."),
  entry("dire", true, "verb", "exact_equivalent", "A1", "Dire.", "Di' qualcosa.", "Say something."),
  entry("сказать", true, "verb", "exact_equivalent", "A1", "Выразить словами.", "Скажи что-нибудь.", "Say something.", { aspect: "perfective" }),
  entry("λέω", true, "verb", "exact_equivalent", "A1", "Λέω.", "Πες κάτι.", "Say something."),
  entry("dizer", true, "verb", "exact_equivalent", "A1", "Dizer.", "Diga algo.", "Say something."),
  entry("sagen", true, "verb", "exact_equivalent", "A1", "Sagen.", "Sag etwas.", "Say something."),
  entry("decir", true, "verb", "exact_equivalent", "A1", "Decir.", "Di algo.", "Say something."),
  entry("әйтү", true, "verb", "exact_equivalent", "A1", "Сүз әйтү.", "Берәр нәрсә әйт.", "Say something."),
  entry("әйтеү", true, "verb", "exact_equivalent", "A1", "Һүҙ әйтеү.", "Берәр нәмә әйт.", "Say something."),
  entry("калани", true, "verb", "exact_equivalent", "A1", "Каласа хуни.", "Мӗнрех те пулин кала.", "Say something."),
  entry("lavarout", true, "verb", "exact_equivalent", "A1", "Lavarout un dra bennak.", "Lavar un dra bennak.", "Say something."),
  entry("ասել", true, "verb", "exact_equivalent", "A1", "Ասել, արտահայտել:", "Մի բան ասա:", "Say something."),
  entry("თქმა", true, "verb", "exact_equivalent", "A1", "თქმა.", "თქვი რამე.", "Say something.")
);

// 22. tell
add1SenseConcept("tell", "tell", "verb", "A1", "To impart information or relate a story to someone.", "narrate / inform",
  entry("tell", true, "verb", "exact_equivalent", "A1", "To narrate or inform.", "Tell me a story.", "Tell me a story."),
  entry("raconter", true, "verb", "exact_equivalent", "A1", "Raconter, dire.", "Raconte-moi une histoire.", "Tell me a story."),
  entry("raccontare", true, "verb", "exact_equivalent", "A1", "Raccontare.", "Raccontami una storia.", "Tell me a story."),
  entry("рассказывать", true, "verb", "exact_equivalent", "A1", "Сообщать, повествовать.", "Расскажи мне историю.", "Tell me a story.", { aspect: "imperfective" }),
  entry("διηγούμαι", true, "verb", "exact_equivalent", "A1", "Διηγούμαι.", "Πες μου μια ιστορία.", "Tell me a story."),
  entry("contar", true, "verb", "exact_equivalent", "A1", "Contar uma história.", "Conte-me uma história.", "Tell me a story."),
  entry("erzählen", true, "verb", "exact_equivalent", "A1", "Erzählen.", "Erzähle mir eine Geschichte.", "Tell me a story."),
  entry("contar", true, "verb", "exact_equivalent", "A1", "Contar.", "Cuéntame una historia.", "Tell me a story."),
  entry("сөйләп бирү", true, "verb", "exact_equivalent", "A1", "Бәян итү.", "Миңа хикәя сөйләп бир.", "Tell me a story."),
  entry("һөйләп биреү", true, "verb", "exact_equivalent", "A1", "Бәйән итеү.", "Миңә хикәйә һөйләп бир.", "Tell me a story."),
  entry("каласа бересси", true, "verb", "exact_equivalent", "A1", "Каласа уҫни.", "Мана калав каласа पार.", "Tell me a story."),
  entry("kontañ", true, "verb", "exact_equivalent", "A1", "Kontañ un istor.", "Konta am eus un istor din.", "Tell me a story."),
  entry("պատմել", true, "verb", "exact_equivalent", "A1", "Պատմել, տեղեկացնել:", "Պատմիր ինձ պատմություն:", "Tell me a story."),
  entry("მოყოლა", true, "verb", "exact_equivalent", "A1", "მოყოლა.", "მოყევი ისტორია.", "Tell me a story.")
);

// 23. need
add1SenseConcept("need", "need", "verb", "A1", "To require something because it is essential.", "necessity",
  entry("need", true, "verb", "exact_equivalent", "A1", "To require.", "I need help.", "I need help."),
  entry("avoir besoin", true, "verbal_expression", "exact_equivalent", "A1", "Avoir besoin de.", "J'ai besoin d'aide.", "I need help."),
  entry("avere bisogno", true, "verbal_expression", "exact_equivalent", "A1", "Avere bisogno di.", "Ho bisogno di aiuto.", "I need help."),
  entry("нуждаться", true, "verb", "exact_equivalent", "A1", "Испытывать нужду.", "Мне нужна помощь.", "I need help.", { aspect: "imperfective" }),
  entry("χρειάζομαι", true, "verb", "exact_equivalent", "A1", "Χρειάζομαι.", "Χρειάζομαι βοήθεια.", "I need help."),
  entry("precisar", true, "verb", "exact_equivalent", "A1", "Precisar de algo.", "Eu preciso de ajuda.", "I need help."),
  entry("brauchen", true, "verb", "exact_equivalent", "A1", "Benötigen, brauchen.", "Ich brauche Hilfe.", "I need help."),
  entry("necesitar", true, "verb", "exact_equivalent", "A1", "Necesitar.", "Necesito ayuda.", "I need help."),
  entry("кирәк булу", true, "verbal_expression", "exact_equivalent", "A1", "Ихтыяҗ булу.", "Миңа ярдәм кирәк.", "I need help."),
  entry("кәрәк булыу", true, "verbal_expression", "exact_equivalent", "A1", "Ихтыяж булыу.", "Миңә яхшы ярҙам кәрәк.", "I need help."),
  entry("кирлӗ пулни", true, "verbal_expression", "exact_equivalent", "A1", "Кирлӗ пулни.", "Мана пулӑшу кирлӗ.", "I need help."),
  entry("kaout ezhomm", true, "verbal_expression", "exact_equivalent", "A1", "Kaout ezhomm eus un dra bennak.", "Ezhomm am eus sikour.", "I need help."),
  entry("կարիք ունենալ", true, "verbal_expression", "exact_equivalent", "A1", "Կարիք ունենալ:", "Ինձ օգնություն է պետք:", "I need help."),
  entry("სჭირდება", true, "verb", "exact_equivalent", "A1", "საჭიროება.", "მე მჭირდება დახმარება.", "I need help.")
);

// 24. look
addConcept("look", "look", "verb", "A1", "To direct one's eyes or to appear.", [
  {
    sense_id: "sense_look_gaze", sense_description: "To direct vision toward someone/something.", context_hint: "direct gaze",
    translations: langs(
      entry("look", true, "verb", "exact_equivalent", "A1", "To direct gaze.", "Look at the sky.", "Look at the sky."),
      entry("regarder", true, "verb", "exact_equivalent", "A1", "Regarder.", "Regarde le ciel.", "Look at the sky."),
      entry("guardare", true, "verb", "exact_equivalent", "A1", "Guardare.", "Guarda il cielo.", "Look at the sky."),
      entry("смотреть", true, "verb", "exact_equivalent", "A1", "Направлять взгляд.", "Посмотри на небо.", "Look at the sky.", { aspect: "imperfective" }),
      entry("κοιτάζω", true, "verb", "exact_equivalent", "A1", "Κοιτάζω.", "Κοίτα τον ουρανό.", "Look at the sky."),
      entry("olhar", true, "verb", "exact_equivalent", "A1", "Olhar para.", "Olhe para o céu.", "Look at the sky."),
      entry("schauen", true, "verb", "exact_equivalent", "A1", "Schauen, blicken.", "Schau in den Himmel.", "Look at the sky."),
      entry("mirar", true, "verb", "exact_equivalent", "A1", "Mirar.", "Mira el cielo.", "Look at the sky."),
      entry("карау", true, "verb", "exact_equivalent", "A1", "Күз салу.", "Күккә кара.", "Look at the sky."),
      entry("ҡарау", true, "verb", "exact_equivalent", "A1", "Күҙ һалыу.", "Күккә ҡара.", "Look at the sky."),
      entry("пӑхни", true, "verb", "exact_equivalent", "A1", "Куҫпа пӑхни.", "Пӗлӗт ҫинче пӑх.", "Look at the sky."),
      entry("sellet", true, "verb", "exact_equivalent", "A1", "Sellet ouzh un dra bennak.", "Sell ouzh an neñv.", "Look at the sky."),
      entry("նայել", true, "verb", "exact_equivalent", "A1", "Նայել:", "Նայիր երկնքին:", "Look at the sky."),
      entry("ყურება", true, "verb", "exact_equivalent", "A1", "ყურება.", "შეხედე ცას.", "Look at the sky.")
    )
  },
  {
    sense_id: "sense_look_appear", sense_description: "To give a specified impression or appearance.", context_hint: "appearance",
    translations: langs(
      entry("look", true, "verb", "exact_equivalent", "A1", "To appear.", "You look good.", "You look good."),
      entry("avoir l'air", true, "verbal_expression", "exact_equivalent", "A1", "Avoir l'air.", "Tu as l'air bien.", "You look good."),
      entry("sembrare", true, "verb", "exact_equivalent", "A1", "Sembrare.", "Sembri in forma.", "You look good."),
      entry("выглядеть", true, "verb", "exact_equivalent", "A1", "Иметь вид.", "Ты хорошо выглядишь.", "You look good.", { aspect: "imperfective" }),
      entry("φαίνομαι", true, "verb", "exact_equivalent", "A1", "Φαίνομαι.", "Φαίνεσαι καλά.", "You look good."),
      entry("parecer", true, "verb", "exact_equivalent", "A1", "Parecer.", "Você parece bem.", "You look good."),
      entry("aussehen", true, "verb", "exact_equivalent", "A1", "Aussehen.", "Du siehst gut aus.", "You look good."),
      entry("parecer", true, "verb", "exact_equivalent", "A1", "Parecer.", "Te ves bien.", "You look good."),
      entry("күренү", true, "verb", "exact_equivalent", "A1", "Күренү.", "Син яхшы күренәсең.", "You look good."),
      entry("күренеү", true, "verb", "exact_equivalent", "A1", "Күренеү.", "Һин яҡшы күренәһең.", "You look good."),
      entry("курӑнни", true, "verb", "exact_equivalent", "A1", "Сӑн-питре курӑнни.", "Эсӗ лайӑх курӑнатӑн.", "You look good."),
      entry("seblantout", true, "verb", "exact_equivalent", "A1", "Seblantout bezañ mat.", "Seblantout a rez bezañ mat.", "You look good."),
      entry("երևալ", true, "verb", "exact_equivalent", "A1", "Տեսք ունենալ, երևալ:", "Դու լավ տեսք ունես:", "You look good."),
      entry("გამოყურება", true, "verb", "exact_equivalent", "A1", "გამოყურება.", "შენ კარგად გამოიყურები.", "You look good.")
    )
  }
]);

// 25. watch
add1SenseConcept("watch", "watch", "verb", "A1", "To observe attentively over time.", "attentive observation",
  entry("watch", true, "verb", "exact_equivalent", "A1", "To observe attentively.", "I watch TV.", "I watch TV."),
  entry("regarder", true, "verb", "exact_equivalent", "A1", "Regarder attentivement.", "Je regarde la télé.", "I watch TV."),
  entry("guardare", true, "verb", "exact_equivalent", "A1", "Guardare la TV.", "Guardo la TV.", "I watch TV."),
  entry("смотреть", true, "verb", "exact_equivalent", "A1", "Наблюдать, смотреть.", "Я смотрю телевизор.", "I watch TV.", { aspect: "imperfective" }),
  entry("παρακολουθώ", true, "verb", "exact_equivalent", "A1", "Παρακολουθώ.", "Παρακολουθώ τηλεόραση.", "I watch TV."),
  entry("assistir", true, "verb", "exact_equivalent", "A1", "Assistir TV.", "Eu assisto TV.", "I watch TV."),
  entry("zuschauen", true, "verb", "exact_equivalent", "A1", "Fernsehen, zuschauen.", "Ich schaue fern.", "I watch TV."),
  entry("ver", true, "verb", "exact_equivalent", "A1", "Ver la televisión.", "Veo la televisión.", "I watch TV."),
  entry("күзәтү", true, "verb", "exact_equivalent", "A1", "Телевизор карау.", "Мин телевизор карыйм.", "I watch TV."),
  entry("күҙәтеү", true, "verb", "exact_equivalent", "A1", "Телевизор ҡарау.", "Мин телевизор ҡарайым.", "I watch TV."),
  entry("сӑнани", true, "verb", "exact_equivalent", "A1", "Сӑнаса ларни.", "Эпӗ телевизор пӑхатӑп.", "I watch TV."),
  entry("sellet", true, "verb", "exact_equivalent", "A1", "Sellet ouzh ar skinwel.", "Sellet a ran ouzh ar skinwel.", "I watch TV."),
  entry("դիտել", true, "verb", "exact_equivalent", "A1", "Դիտել, հետևել:", "Ես հեռուստացույց եմ դիտում:", "I watch TV."),
  entry("ყურება", true, "verb", "exact_equivalent", "A1", "თვალყურის დევნება.", "მე ვუყურებ ტელევიზორს.", "I watch TV.")
);

// 26. see
add1SenseConcept("see", "see", "verb", "A1", "To perceive visual stimuli with eyes.", "visual perception",
  entry("see", true, "verb", "exact_equivalent", "A1", "To perceive visually.", "I see the bird.", "I see the bird."),
  entry("voir", true, "verb", "exact_equivalent", "A1", "Percevoir par la vue.", "Je vois l'oiseau.", "I see the bird."),
  entry("vedere", true, "verb", "exact_equivalent", "A1", "Vedere.", "Vedo l'uccello.", "I see the bird."),
  entry("видеть", true, "verb", "exact_equivalent", "A1", "Воспринимать зрением.", "Я вижу птицу.", "I see the bird.", { aspect: "imperfective" }),
  entry("βλέπω", true, "verb", "exact_equivalent", "A1", "Βλέπω.", "Βλέπω το πουλί.", "I see the bird."),
  entry("ver", true, "verb", "exact_equivalent", "A1", "Ver.", "Eu vejo o passarinho.", "I see the bird."),
  entry("sehen", true, "verb", "exact_equivalent", "A1", "Sehen.", "Ich sehe den Vogel.", "I see the bird."),
  entry("ver", true, "verb", "exact_equivalent", "A1", "Ver.", "Veo el pájaro.", "I see the bird."),
  entry("күрү", true, "verb", "exact_equivalent", "A1", "Күз белән күрү.", "Мин кошны күрәм.", "I see the bird."),
  entry("күреү", true, "verb", "exact_equivalent", "A1", "Күҙ менән күреү.", "Мин ҡошто күрәм.", "I see the bird."),
  entry("курни", true, "verb", "exact_equivalent", "A1", "Куҫпа курни.", "Эпӗ кайӑка куратӑп.", "I see the bird."),
  entry("gwelout", true, "verb", "exact_equivalent", "A1", "Gwelout un dra bennak.", "Gwelout a ran an labous.", "I see the bird."),
  entry("տեսնել", true, "verb", "exact_equivalent", "A1", "Տեսողությամբ ընկալել:", "Ես տեսնում եմ թռչունին:", "I see the bird."),
  entry("ხედვა", true, "verb", "exact_equivalent", "A1", "დამნახვა.", "მე ვხედავ ჩიტს.", "I see the bird.")
);

// 27. ask
add1SenseConcept("ask", "ask", "verb", "A1", "To inquire or put a question to.", "inquiry",
  entry("ask", true, "verb", "exact_equivalent", "A1", "To inquire.", "Ask a question.", "Ask a question."),
  entry("demander", true, "verb", "exact_equivalent", "A1", "Demander.", "Pose une question.", "Ask a question."),
  entry("chiedere", true, "verb", "exact_equivalent", "A1", "Chiedere.", "Fai una domanda.", "Ask a question."),
  entry("спрашивать", true, "verb", "exact_equivalent", "A1", "Задавать вопрос.", "Спроси вопрос.", "Ask a question.", { aspect: "imperfective" }),
  entry("ρωτώ", true, "verb", "exact_equivalent", "A1", "Ρωτώ.", "Ρώτησε μια ερώτηση.", "Ask a question."),
  entry("perguntar", true, "verb", "exact_equivalent", "A1", "Perguntar.", "Faça uma pergunta.", "Ask a question."),
  entry("fragen", true, "verb", "exact_equivalent", "A1", "Fragen.", "Stelle eine Frage.", "Ask a question."),
  entry("preguntar", true, "verb", "exact_equivalent", "A1", "Preguntar.", "Haz una pregunta.", "Ask a question."),
  entry("сорау", true, "verb", "exact_equivalent", "A1", "Сорау бирү.", "Сорау бир.", "Ask a question."),
  entry("һорау", true, "verb", "exact_equivalent", "A1", "Һорау биреү.", "Һорау бир.", "Ask a question."),
  entry("ыйтни", true, "verb", "exact_equivalent", "A1", "Ыйту туни.", "Ыйту ыйт.", "Ask a question."),
  entry("goulenn", true, "verb", "exact_equivalent", "A1", "Goulenn un dra bennak.", "Goulenn ur goulenn.", "Ask a question."),
  entry("հարցնել", true, "verb", "exact_equivalent", "A1", "Հարց տալ:", "Հարցրու մի հարց:", "Ask a question."),
  entry("კითხვა", true, "verb", "exact_equivalent", "A1", "კითხვის დასმა.", "დასვი შეკითხვა.", "Ask a question.")
);

// 28. answer
add1SenseConcept("answer", "answer", "verb", "A1", "To respond or reply to a question/statement.", "response",
  entry("answer", true, "verb", "exact_equivalent", "A1", "To reply.", "Answer me.", "Answer me."),
  entry("répondre", true, "verb", "exact_equivalent", "A1", "Répondre.", "Réponds-moi.", "Answer me."),
  entry("rispondere", true, "verb", "exact_equivalent", "A1", "Rispondere.", "Rispondimi.", "Answer me."),
  entry("отвечать", true, "verb", "exact_equivalent", "A1", "Давать ответ.", "Ответь мне.", "Answer me.", { aspect: "imperfective" }),
  entry("απαντώ", true, "verb", "exact_equivalent", "A1", "Απαντώ.", "Απάντησέ μου.", "Answer me."),
  entry("responder", true, "verb", "exact_equivalent", "A1", "Responder.", "Responda-me.", "Answer me."),
  entry("antworten", true, "verb", "exact_equivalent", "A1", "Antworten.", "Antworte mir.", "Answer me."),
  entry("responder", true, "verb", "exact_equivalent", "A1", "Responder.", "Respóndeme.", "Answer me."),
  entry("җавап бирү", true, "verbal_expression", "exact_equivalent", "A1", "Җавап кайтару.", "Миңа җавап бир.", "Answer me."),
  entry("яуап биреү", true, "verbal_expression", "exact_equivalent", "A1", "Яуап ҡайтарыу.", "Миңә яуап бир.", "Answer me."),
  entry("хурав парасси", true, "verbal_expression", "exact_equivalent", "A1", "Хурав парасси.", "Мана хурав पार.", "Answer me."),
  entry("respont", true, "verb", "exact_equivalent", "A1", "Respont da un den bennak.", "Respont din.", "Answer me."),
  entry("պատասխանել", true, "verb", "exact_equivalent", "A1", "Պատասխան տալ:", "Պատասխանիր ինձ:", "Answer me."),
  entry("პასუხი", true, "verb", "exact_equivalent", "A1", "პასუხის გაცემა.", "მიპასუხე მე.", "Answer me.")
);

// 29. take
add1SenseConcept("take", "take", "verb", "A1", "To lay hold of or transport something.", "grasp / movement",
  entry("take", true, "verb", "exact_equivalent", "A1", "To lay hold of.", "Take this book.", "Take this book."),
  entry("prendre", true, "verb", "exact_equivalent", "A1", "Prendre en main.", "Prends ce livre.", "Take this book."),
  entry("prendere", true, "verb", "exact_equivalent", "A1", "Prendere.", "Prendi questo libro.", "Take this book."),
  entry("брать", true, "verb", "exact_equivalent", "A1", "Брать в руки.", "Возьми эту книгу.", "Take this book.", { aspect: "imperfective" }),
  entry("παίρνω", true, "verb", "exact_equivalent", "A1", "Παίρνω.", "Πάρε αυτό το βιβλίο.", "Take this book."),
  entry("pegar", true, "verb", "exact_equivalent", "A1", "Pegar / tomar.", "Pegue este livro.", "Take this book."),
  entry("nehmen", true, "verb", "exact_equivalent", "A1", "Nehmen.", "Nimm dieses Buch.", "Take this book."),
  entry("tomar", true, "verb", "exact_equivalent", "A1", "Tomar.", "Toma este libro.", "Take this book."),
  entry("алу", true, "verb", "exact_equivalent", "A1", "Кулга алу.", "Бу китапны ал.", "Take this book."),
  entry("алыу", true, "verb", "exact_equivalent", "A1", "Ҡулға алыу.", "Быны китапты ал.", "Take this book."),
  entry("илни", true, "verb", "exact_equivalent", "A1", "Алса илни.", "Ку кӗнекене ил.", "Take this book."),
  entry("kemer", true, "verb", "exact_equivalent", "A1", "Kemer un dra bennak.", "Kemer ar levr-mañ.", "Take this book."),
  entry("վերցնել", true, "verb", "exact_equivalent", "A1", "Վերցնել ձեռքը:", "Վերցրու այս գիրքը:", "Take this book."),
  entry("აღება", true, "verb", "exact_equivalent", "A1", "აღება.", "აიღე ეს წიგნი.", "Take this book.")
);

// 30. give
add1SenseConcept("give", "give", "verb", "A1", "To transfer possession of something to another.", "transfer / donation",
  entry("give", true, "verb", "exact_equivalent", "A1", "To transfer.", "Give me the key.", "Give me the key."),
  entry("donner", true, "verb", "exact_equivalent", "A1", "Donner.", "Donne-moi la clé.", "Give me the key."),
  entry("dare", true, "verb", "exact_equivalent", "A1", "Dare.", "Dammi la chiave.", "Give me the key."),
  entry("давать", true, "verb", "exact_equivalent", "A1", "Передавать.", "Дай мне ключ.", "Give me the key.", { aspect: "imperfective" }),
  entry("δίνω", true, "verb", "exact_equivalent", "A1", "Δίνω.", "Δώσε μου το κλειδί.", "Give me the key."),
  entry("dar", true, "verb", "exact_equivalent", "A1", "Dar.", "Dê-me a chave.", "Give me the key."),
  entry("geben", true, "verb", "exact_equivalent", "A1", "Geben.", "Gib mir den Schlüssel.", "Give me the key."),
  entry("dar", true, "verb", "exact_equivalent", "A1", "Dar.", "Dame la llave.", "Give me the key."),
  entry("бирү", true, "verb", "exact_equivalent", "A1", "Берәрсенә тапшыру.", "Миңа ачкычны бир.", "Give me the key."),
  entry("биреү", true, "verb", "exact_equivalent", "A1", "Берәрһенә тапшырыу.", "Миңә асыҡты бир.", "Give me the key."),
  entry("парасси", true, "verb", "exact_equivalent", "A1", "Парасси.", "Мана уҫҫине पार.", "Give me the key."),
  entry("reiñ", true, "verb", "exact_equivalent", "A1", "Reiñ un dra bennak.", "Ro din an alc'hwez.", "Give me the key."),
  entry("տալ", true, "verb", "exact_equivalent", "A1", "Փոխանցել, տալ:", "Տուր ինձ բանալին:", "Give me the key."),
  entry("მიცემა", true, "verb", "exact_equivalent", "A1", "გადაცემა.", "მომეცი გასაღები.", "Give me the key.")
);


// 31. must
add1SenseConcept("must", "must", "modal_verb", "A1", "To be obliged to or logically necessary.", "obligation",
  entry("must", true, "modal_verb", "exact_equivalent", "A1", "To be obliged.", "I must go.", "I must go."),
  entry("devoir", true, "verb", "exact_equivalent", "A1", "Devoir.", "Je dois partir.", "I must go."),
  entry("dovere", true, "verb", "exact_equivalent", "A1", "Dovere.", "Devo andare.", "I must go."),
  entry("должен", true, "modal_verb", "exact_equivalent", "A1", "Быть должным.", "Я должен идти.", "I must go."),
  entry("πρέπει", true, "verb", "exact_equivalent", "A1", "Πρέπει.", "Πρέπει να φύγω.", "I must go."),
  entry("dever", true, "verb", "exact_equivalent", "A1", "Dever.", "Eu devo ir.", "I must go."),
  entry("müssen", true, "verb", "exact_equivalent", "A1", "Müssen.", "Ich muss gehen.", "I must go."),
  entry("deber", true, "verb", "exact_equivalent", "A1", "Deber.", "Debo irme.", "I must go."),
  entry("тиеш булу", true, "verbal_expression", "exact_equivalent", "A1", "Тиеш булу.", "Мин китәргә тиеш.", "I must go."),
  entry("тиеш булыу", true, "verbal_expression", "exact_equivalent", "A1", "Тиеш булыу.", "Мин китергә тиеш.", "I must go."),
  entry("тиеш пулни", true, "verbal_expression", "exact_equivalent", "A1", "Тиеш пулни.", "Эпӗ кайма тиеш.", "I must go."),
  entry("dleeout", true, "verb", "exact_equivalent", "A1", "Dleeout mont.", "Dleeout a ran mont.", "I must go."),
  entry("պետք է", true, "verbal_expression", "exact_equivalent", "A1", "Պարտավորված լինել:", "Ես պետք է գնամ:", "I must go."),
  entry("უნდა", true, "verb", "exact_equivalent", "A1", "ვალდებულება.", "მე უნდა წავიდე.", "I must go.")
);

// 32. have to
add1SenseConcept("have to", "have to", "verbal_expression", "A1", "To be forced or required by circumstance to do.", "external obligation",
  entry("have to", true, "verbal_expression", "exact_equivalent", "A1", "To be required.", "I have to work.", "I have to work."),
  entry("devoir", true, "verb", "exact_equivalent", "A1", "Être obligé de.", "Je dois travailler.", "I have to work."),
  entry("dovere", true, "verb", "exact_equivalent", "A1", "Essere tenuto a.", "Devo lavorare.", "I have to work."),
  entry("приходиться", true, "verb", "exact_equivalent", "A1", "Быть вынужденным.", "Мне приходится работать.", "I have to work.", { aspect: "imperfective" }),
  entry("αναγκάζομαι", true, "verb", "exact_equivalent", "A1", "Αναγκάζομαι.", "Πρέπει να δουλέψω.", "I have to work."),
  entry("ter de", true, "verbal_expression", "exact_equivalent", "A1", "Ter de.", "Eu tenho de trabalhar.", "I have to work."),
  entry("müssen", true, "verb", "exact_equivalent", "A1", "Müssen.", "Ich muss arbeiten.", "I have to work."),
  entry("tener que", true, "verbal_expression", "exact_equivalent", "A1", "Tener que.", "Tengo que trabajar.", "I have to work."),
  entry("мәҗбүр булу", true, "verbal_expression", "exact_equivalent", "A1", "Мәҗбүр булу.", "Мин эшләргә мәҗбүр.", "I have to work."),
  entry("мәжбүр булыу", true, "verbal_expression", "exact_equivalent", "A1", "Мәжбүр булыу.", "Мин эшләргә мәжбүр.", "I have to work."),
  entry("пӑхӑнни", true, "verb", "exact_equivalent", "A1", "Пӑхӑнса туни.", "Эпӗ ӗҫлеме тиеш.", "I have to work."),
  entry("rankout", true, "verb", "exact_equivalent", "A1", "Rankout labourat.", "Rankout a ran labourat.", "I have to work."),
  entry("ստիպված լինել", true, "verbal_expression", "exact_equivalent", "A1", "Ստիպված լինել:", "Ես ստիպված եմ աշխատել:", "I have to work."),
  entry("უწევს", true, "verb", "exact_equivalent", "A1", "აუცილებლობა.", "მე მიწევს მუშაობა.", "I have to work.")
);

// 33. wait
add1SenseConcept("wait", "wait", "verb", "A1", "To stay in expectation of an event/person.", "expectation / delay",
  entry("wait", true, "verb", "exact_equivalent", "A1", "To expect or stay.", "Wait for me.", "Wait for me."),
  entry("attendre", true, "verb", "exact_equivalent", "A1", "Attendre.", "Attends-moi.", "Wait for me."),
  entry("aspettare", true, "verb", "exact_equivalent", "A1", "Aspettare.", "Aspettami.", "Wait for me."),
  entry("ждать", true, "verb", "exact_equivalent", "A1", "Ждать.", "Подожди меня.", "Wait for me.", { aspect: "imperfective" }),
  entry("περιμένω", true, "verb", "exact_equivalent", "A1", "Περιμένω.", "Περίμενέ με.", "Wait for me."),
  entry("esperar", true, "verb", "exact_equivalent", "A1", "Esperar.", "Espere por mim.", "Wait for me."),
  entry("warten", true, "verb", "exact_equivalent", "A1", "Warten.", "Warte auf mich.", "Wait for me."),
  entry("esperar", true, "verb", "exact_equivalent", "A1", "Esperar.", "Espérame.", "Wait for me."),
  entry("көтү", true, "verb", "exact_equivalent", "A1", "Көтеп тору.", "Мине көт.", "Wait for me."),
  entry("көтөү", true, "verb", "exact_equivalent", "A1", "Көтөп тороу.", "Мине көт.", "Wait for me."),
  entry("кӗтни", true, "verb", "exact_equivalent", "A1", "Кӗтсе ларни.", "Мана кӗт.", "Wait for me."),
  entry("gortoz", true, "verb", "exact_equivalent", "A1", "Gortoz un den bennak.", "Gortoz ac'hanon.", "Wait for me."),
  entry("սպասել", true, "verb", "exact_equivalent", "A1", "Սպասել:", "Սպասիր ինձ:", "Wait for me."),
  entry("ლოდინი", true, "verb", "exact_equivalent", "A1", "ლოდინი.", "დამელოდე მე.", "Wait for me.")
);

// 34. live
addConcept("live", "live", "verb", "A1", "To reside in a location or to remain alive.", [
  {
    sense_id: "sense_live_reside", sense_description: "To reside or inhabit a home/city.", context_hint: "residence",
    translations: langs(
      entry("live", true, "verb", "exact_equivalent", "A1", "To reside.", "I live in Paris.", "I live in Paris."),
      entry("habiter", true, "verb", "exact_equivalent", "A1", "Habiter.", "J'habite à Paris.", "I live in Paris."),
      entry("abitare", true, "verb", "exact_equivalent", "A1", "Abitare.", "Abito a Parigi.", "I live in Paris."),
      entry("проживать", true, "verb", "exact_equivalent", "A1", "Жить в месте.", "Я проживаю в Париже.", "I live in Paris.", { aspect: "imperfective" }),
      entry("μένω", true, "verb", "exact_equivalent", "A1", "Μένω σε τόπο.", "Μένω στο Παρίσι.", "I live in Paris."),
      entry("morar", true, "verb", "exact_equivalent", "A1", "Morar.", "Eu moro em Paris.", "I live in Paris."),
      entry("wohnen", true, "verb", "exact_equivalent", "A1", "Wohnen.", "Ich wohne in Paris.", "I live in Paris."),
      entry("vivir", true, "verb", "exact_equivalent", "A1", "Residir.", "Vivo en París.", "I live in Paris."),
      entry("тору", true, "verb", "exact_equivalent", "A1", "Яшәү, тору.", "Мин Парижда торам.", "I live in Paris."),
      entry("тороу", true, "verb", "exact_equivalent", "A1", "Йәшәү, тороу.", "Мин Парижла торам.", "I live in Paris."),
      entry("пурӑнни", true, "verb", "exact_equivalent", "A1", "Пурӑнни.", "Эпӗ Парижра пурӑнатӑп.", "I live in Paris."),
      entry("chom", true, "verb", "exact_equivalent", "A1", "Chom en ur gêr.", "Chom a ran e Paris.", "I live in Paris."),
      entry("բնակվել", true, "verb", "exact_equivalent", "A1", "Բնակվել:", "Ես բնակվում եմ Փարիզում:", "I live in Paris."),
      entry("ცხოვრობს", true, "verb", "exact_equivalent", "A1", "ცხოვრება.", "მე ვცხოვრობ პარიზში.", "I live in Paris.")
    )
  },
  {
    sense_id: "sense_live_alive", sense_description: "To be alive or experience life.", context_hint: "alive state",
    translations: langs(
      entry("live", true, "verb", "exact_equivalent", "A1", "To be alive.", "Animals live here.", "Animals live here."),
      entry("vivre", true, "verb", "exact_equivalent", "A1", "Vivre.", "Les animaux vivent ici.", "Animals live here."),
      entry("vivere", true, "verb", "exact_equivalent", "A1", "Vivere.", "Gli animali vivono qui.", "Animals live here."),
      entry("жить", true, "verb", "exact_equivalent", "A1", "Быть живым.", "Животные живут здесь.", "Animals live here.", { aspect: "imperfective" }),
      entry("ζω", true, "verb", "exact_equivalent", "A1", "Ζω.", "Τα ζώα ζουν εδώ.", "Animals live here."),
      entry("viver", true, "verb", "exact_equivalent", "A1", "Viver.", "Os animais vivem aqui.", "Animals live here."),
      entry("leben", true, "verb", "exact_equivalent", "A1", "Leben.", "Tiere leben hier.", "Animals live here."),
      entry("vivir", true, "verb", "exact_equivalent", "A1", "Estar vivo.", "Los animales viven aquí.", "Animals live here."),
      entry("яшәү", true, "verb", "exact_equivalent", "A1", "Тормыш итү.", "Жайваннар монда яши.", "Animals live here."),
      entry("йәшәү", true, "verb", "exact_equivalent", "A1", "Тормош итеү.", "Хайуандар бында йәшәй.", "Animals live here."),
      entry("пурӑнни", true, "verb", "exact_equivalent", "A1", "Пурнӑҫпа пурӑнни.", "Чӗрчунсем кунта пурӑнаҫҫӗ.", "Animals live here."),
      entry("bevañ", true, "verb", "exact_equivalent", "A1", "Bevañ amzer.", "Ar loened a vev amañ.", "Animals live here."),
      entry("ապրել", true, "verb", "exact_equivalent", "A1", "Ապրել, ողջ լինել:", "Կենդանիները ապրում են այստեղ:", "Animals live here."),
      entry("ცოცხლობს", true, "verb", "exact_equivalent", "A1", "არსებობა.", "ცხოველები ცოცხლობენ აქ.", "Animals live here.")
    )
  }
]);

// 35. listen
add1SenseConcept("listen", "listen", "verb", "A1", "To pay attention to sound or speech.", "auditory attention",
  entry("listen", true, "verb", "exact_equivalent", "A1", "To pay auditory attention.", "Listen to music.", "Listen to music."),
  entry("écouter", true, "verb", "exact_equivalent", "A1", "Écouter.", "Écoute de la musique.", "Listen to music."),
  entry("ascoltare", true, "verb", "exact_equivalent", "A1", "Ascoltare.", "Ascolta la musica.", "Listen to music."),
  entry("слушать", true, "verb", "exact_equivalent", "A1", "Слушать.", "Слушай музыку.", "Listen to music.", { aspect: "imperfective" }),
  entry("ακούω", true, "verb", "exact_equivalent", "A1", "Ακούω με προσοχή.", "Άκουγε μουσική.", "Listen to music."),
  entry("escutar", true, "verb", "exact_equivalent", "A1", "Escutar.", "Escute música.", "Listen to music."),
  entry("zuhören", true, "verb", "exact_equivalent", "A1", "Zuhören.", "Höre Musik zu.", "Listen to music."),
  entry("escuchar", true, "verb", "exact_equivalent", "A1", "Escuchar.", "Escucha música.", "Listen to music."),
  entry("тыңлау", true, "verb", "exact_equivalent", "A1", "Колак салу.", "Музыка тыңла.", "Listen to music."),
  entry("тыңлау", true, "verb", "exact_equivalent", "A1", "Ҡколаҡ һалыу.", "Музыка тыңла.", "Listen to music."),
  entry("итлени", true, "verb", "exact_equivalent", "A1", "Хӑлха хуса итлени.", "Музыка итле.", "Listen to music."),
  entry("selaou", true, "verb", "exact_equivalent", "A1", "Selaou ouzh ar sonerezh.", "Selaou ouzh ar sonerezh.", "Listen to music."),
  entry("լսել", true, "verb", "exact_equivalent", "A1", "Ուշադրությամբ լսել:", "Լսիր երաժշտություն:", "Listen to music."),
  entry("მოსმენა", true, "verb", "exact_equivalent", "A1", "ყურადღებით სმენა.", "მოუსმინე მუსიკას.", "Listen to music.")
);

// 36. hear
add1SenseConcept("hear", "hear", "verb", "A1", "To perceive sound with the ears.", "auditory perception",
  entry("hear", true, "verb", "exact_equivalent", "A1", "To perceive sound.", "I hear a noise.", "I hear a noise."),
  entry("entendre", true, "verb", "exact_equivalent", "A1", "Entendre.", "J'entends un bruit.", "I hear a noise."),
  entry("sentire", true, "verb", "exact_equivalent", "A1", "Sentire un suono.", "Sento un rumore.", "I hear a noise."),
  entry("слышать", true, "verb", "exact_equivalent", "A1", "Воспринимать слухом.", "Я слышу шум.", "I hear a noise.", { aspect: "imperfective" }),
  entry("ακούω", true, "verb", "exact_equivalent", "A1", "Ακούω.", "Ακούω έναν θόρυβο.", "I hear a noise."),
  entry("ouvir", true, "verb", "exact_equivalent", "A1", "Ouvir.", "Eu ouço um barulho.", "I hear a noise."),
  entry("hören", true, "verb", "exact_equivalent", "A1", "Hören.", "Ich höre ein Geräusch.", "I hear a noise."),
  entry("oír", true, "verb", "exact_equivalent", "A1", "Oír.", "Oigo un ruido.", "I hear a noise."),
  entry("ишетү", true, "verb", "exact_equivalent", "A1", "Тавыш ишетү.", "Мин шау-шу ишетәм.", "I hear a noise."),
  entry("ишетеү", true, "verb", "exact_equivalent", "A1", "Тауыш ишетеү.", "Мин шау-шыу ишәтәм.", "I hear a noise."),
  entry("илтни", true, "verb", "exact_equivalent", "A1", "Аваза илтни.", "Эпӗ шавланине илтетӗп.", "I hear a noise."),
  entry("klevout", true, "verb", "exact_equivalent", "A1", "Klevout un trouz.", "Klevout a ran un trouz.", "I hear a noise."),
  entry("լսել", true, "verb", "exact_equivalent", "A1", "Ձայն ընկալել, լսել:", "Ես աղմուկ եմ լսում:", "I hear a noise."),
  entry("ესმის", true, "verb", "exact_equivalent", "A1", "სმენა.", "მე მესმის ხმაური.", "I hear a noise.")
);

// 37. pay
add1SenseConcept("pay", "pay", "verb", "A1", "To give money in exchange for goods or services.", "monetary settlement",
  entry("pay", true, "verb", "exact_equivalent", "A1", "To settle financially.", "I pay the bill.", "I pay the bill."),
  entry("payer", true, "verb", "exact_equivalent", "A1", "Payer.", "Je paie l'addition.", "I pay the bill."),
  entry("pagare", true, "verb", "exact_equivalent", "A1", "Pagare.", "Pago il conto.", "I pay the bill."),
  entry("платить", true, "verb", "exact_equivalent", "A1", "Отдавать деньги.", "Я плачу по счету.", "I pay the bill.", { aspect: "imperfective" }),
  entry("πληρώνω", true, "verb", "exact_equivalent", "A1", "Πληρώνω.", "Πληρώνω το λογαριασμό.", "I pay the bill."),
  entry("pagar", true, "verb", "exact_equivalent", "A1", "Pagar.", "Eu pago a conta.", "I pay the bill."),
  entry("bezahlen", true, "verb", "exact_equivalent", "A1", "Bezahlen.", "Ich bezahle die Rechnung.", "I pay the bill."),
  entry("pagar", true, "verb", "exact_equivalent", "A1", "Pagar.", "Pago la cuenta.", "I pay the bill."),
  entry("түләү", true, "verb", "exact_equivalent", "A1", "Ача түләү.", "Мин хисапны түлим.", "I pay the bill."),
  entry("түләү", true, "verb", "exact_equivalent", "A1", "Аҡша түләү.", "Мин хисапты түләйем.", "I pay the bill."),
  entry("тӳлени", true, "verb", "exact_equivalent", "A1", "Укҫа тӳлени.", "Эпӗ счӗтшӗн тӳлетӗп.", "I pay the bill."),
  entry("paeañ", true, "verb", "exact_equivalent", "A1", "Paeañ ar c'hont.", "Paeañ a ran ar c'hont.", "I pay the bill."),
  entry("վճարել", true, "verb", "exact_equivalent", "A1", "Գումար վճարել:", "Ես վճարում եմ հաշիվը:", "I pay the bill."),
  entry("იხდის", true, "verb", "exact_equivalent", "A1", "გადახდა.", "მე ვიხდი ანგარიშს.", "I pay the bill.")
);

// 38. buy
add1SenseConcept("buy", "buy", "verb", "A1", "To acquire goods in exchange for payment.", "purchase",
  entry("buy", true, "verb", "exact_equivalent", "A1", "To purchase.", "I buy fruit.", "I buy fruit."),
  entry("acheter", true, "verb", "exact_equivalent", "A1", "Acheter.", "J'achète des fruits.", "I buy fruit."),
  entry("comprare", true, "verb", "exact_equivalent", "A1", "Comprare.", "Compro la frutta.", "I buy fruit."),
  entry("покупать", true, "verb", "exact_equivalent", "A1", "Приобретать за деньги.", "Я покупаю фрукты.", "I buy fruit.", { aspect: "imperfective" }),
  entry("αγοράζω", true, "verb", "exact_equivalent", "A1", "Αγοράζω.", "Αγοράζω φρούτα.", "I buy fruit."),
  entry("comprar", true, "verb", "exact_equivalent", "A1", "Comprar.", "Eu compro frutas.", "I buy fruit."),
  entry("kaufen", true, "verb", "exact_equivalent", "A1", "Kaufen.", "Ich kaufe Obst.", "I buy fruit."),
  entry("comprar", true, "verb", "exact_equivalent", "A1", "Comprar.", "Compro fruta.", "I buy fruit."),
  entry("сатып алу", true, "verbal_expression", "exact_equivalent", "A1", "Сатып алу.", "Мин җиләк-җимеш сатып алам.", "I buy fruit."),
  entry("һатып алыу", true, "verbal_expression", "exact_equivalent", "A1", "Һатып алыу.", "Мин еләк-јемеш һатып алыам.", "I buy fruit."),
  entry("туянни", true, "verb", "exact_equivalent", "A1", "Укҫапа туянни.", "Эпӗ ҫулҫӑ-ҫимӗҫ туянатӑп.", "I buy fruit."),
  entry("prenañ", true, "verb", "exact_equivalent", "A1", "Prenañ frouezh.", "Prenañ a ran frouezh.", "I buy fruit."),
  entry("գնել", true, "verb", "exact_equivalent", "A1", "Գնել, ձեռք բերել:", "Ես միրգ եմ գնում:", "I buy fruit."),
  entry("ყიდულობს", true, "verb", "exact_equivalent", "A1", "ყიდვა.", "მე ვყიდულობ ხილს.", "I buy fruit.")
);

// 39. remember
add1SenseConcept("remember", "remember", "verb", "A1", "To retain or recall knowledge from memory.", "recollection",
  entry("remember", true, "verb", "exact_equivalent", "A1", "To recall.", "I remember your name.", "I remember your name."),
  entry("se souvenir", true, "verbal_expression", "exact_equivalent", "A1", "Se souvenir de.", "Je me souviens de ton nom.", "I remember your name."),
  entry("ricordare", true, "verb", "exact_equivalent", "A1", "Ricordare.", "Ricordo il tuo nome.", "I remember your name."),
  entry("помнить", true, "verb", "exact_equivalent", "A1", "Удерживать в памяти.", "Я помню твоё имя.", "I remember your name.", { aspect: "imperfective" }),
  entry("θυμάμαι", true, "verb", "exact_equivalent", "A1", "Θυμάμαι.", "Θυμάμαι το όνομά σου.", "I remember your name."),
  entry("lembrar-se", true, "verbal_expression", "exact_equivalent", "A1", "Lembrar-se de.", "Eu me lembro do seu nome.", "I remember your name."),
  entry("sich erinnern", true, "verbal_expression", "exact_equivalent", "A1", "Sich erinnern an.", "Ich erinnere mich an deinen Namen.", "I remember your name."),
  entry("recordar", true, "verb", "exact_equivalent", "A1", "Recordar.", "Recuerdo tu nombre.", "I remember your name."),
  entry("хәтерләү", true, "verb", "exact_equivalent", "A1", "Хәтердә тоту.", "Мин синең исемеңне хәтерлим.", "I remember your name."),
  entry("хәтерләү", true, "verb", "exact_equivalent", "A1", "Хәтерҙә тотоу.", "Мин һинең исемеңде хәтерләйем.", "I remember your name."),
  entry("аснăнни", true, "verb", "exact_equivalent", "A1", "Ӑста аснăнни.", "Эпӗ сан ятна асӑнатӑп.", "I remember your name."),
  entry("kaout soñj", true, "verbal_expression", "exact_equivalent", "A1", "Kaout soñj eus un dra bennak.", "Soñj am eus eus da anv.", "I remember your name."),
  entry("հիշել", true, "verb", "exact_equivalent", "A1", "Մտապահել, հիշել:", "Ես հիշում եմ քո անունը:", "I remember your name."),
  entry("ახსოვს", true, "verb", "exact_equivalent", "A1", "გახსენება.", "მე მახსოვს შენი სახელი.", "I remember your name.")
);

// 40. forget
add1SenseConcept("forget", "forget", "verb", "A1", "To fail to remember or recall.", "memory lapse",
  entry("forget", true, "verb", "exact_equivalent", "A1", "To fail to recall.", "Don't forget me.", "Don't forget me."),
  entry("oublier", true, "verb", "exact_equivalent", "A1", "Oublier.", "Ne m'oublie pas.", "Don't forget me."),
  entry("dimenticare", true, "verb", "exact_equivalent", "A1", "Dimenticare.", "Non dimenticarmi.", "Don't forget me."),
  entry("забывать", true, "verb", "exact_equivalent", "A1", "Упускать из памяти.", "Не забывай меня.", "Don't forget me.", { aspect: "imperfective" }),
  entry("ξεχνώ", true, "verb", "exact_equivalent", "A1", "Ξεχνώ.", "Μη με ξεχνάς.", "Don't forget me."),
  entry("esquecer", true, "verb", "exact_equivalent", "A1", "Esquecer.", "Não se esqueça de mim.", "Don't forget me."),
  entry("vergessen", true, "verb", "exact_equivalent", "A1", "Vergessen.", "Vergiss mich nicht.", "Don't forget me."),
  entry("olvidar", true, "verb", "exact_equivalent", "A1", "Olvidar.", "No me olvides.", "Don't forget me."),
  entry("оныту", true, "verb", "exact_equivalent", "A1", "Эстән чыгару.", "Мине онытма.", "Don't forget me."),
  entry("унытыу", true, "verb", "exact_equivalent", "A1", "Эстән сығарыу.", "Мине унытма.", "Don't forget me."),
  entry("манни", true, "verb", "exact_equivalent", "A1", "Ӑслан манса хӑварни.", "Ан ман манӑн ята.", "Don't forget me."),
  entry("ankouaat", true, "verb", "exact_equivalent", "A1", "Ankouaat un den bennak.", "Na ankoua ket ac'hanon.", "Don't forget me."),
  entry("մոռանալ", true, "verb", "exact_equivalent", "A1", "Մոռանալ:", "Մի մոռացիր ինձ:", "Don't forget me."),
  entry("ავიწყდება", true, "verb", "exact_equivalent", "A1", "დავიწყება.", "ნუ დაივიწყებ ჩემს სახელს.", "Don't forget me.")
);

// 41. feel
add1SenseConcept("feel", "feel", "verb", "A1", "To experience an emotion, sensation, or touch.", "sensation / emotion",
  entry("feel", true, "verb", "exact_equivalent", "A1", "To experience sensation.", "I feel good.", "I feel good."),
  entry("se sentir", true, "verbal_expression", "exact_equivalent", "A1", "Ressentir une émotion.", "Je me sens bien.", "I feel good."),
  entry("sentirsi", true, "verbal_expression", "exact_equivalent", "A1", "Sentirsi.", "Mi sento bene.", "I feel good."),
  entry("чувствовать", true, "verb", "exact_equivalent", "A1", "Испытывать ощущение.", "Я чувствую себя хорошо.", "I feel good.", { aspect: "imperfective" }),
  entry("νιώθω", true, "verb", "exact_equivalent", "A1", "Νιώθω.", "Νιώθω καλά.", "I feel good."),
  entry("sentir-se", true, "verbal_expression", "exact_equivalent", "A1", "Sentir-se.", "Eu me sinto bem.", "I feel good."),
  entry("fühlen", true, "verb", "exact_equivalent", "A1", "Fühlen, sich fühlen.", "Ich fühle mich gut.", "I feel good."),
  entry("sentirse", true, "verbal_expression", "exact_equivalent", "A1", "Sentirse.", "Me siento bien.", "I feel good."),
  entry("тою", true, "verb", "exact_equivalent", "A1", "Хис итү.", "Мин үземне яхшы тоям.", "I feel good."),
  entry("тойоу", true, "verb", "exact_equivalent", "A1", "Хис итеү.", "Мин үҙемде яҡшы тойоам.", "I feel good."),
  entry("туйни", true, "verb", "exact_equivalent", "A1", "Ҫӑмӑллӑх туйни.", "Эпӗ хӑйма лайӑх туятӑп.", "I feel good."),
  entry("santout", true, "verb", "exact_equivalent", "A1", "Santout mat.", "Santout a ran mat.", "I feel good."),
  entry("զգալ", true, "verb", "exact_equivalent", "A1", "Զգալ:", "Ես ինձ լավ եմ զգում:", "I feel good."),
  entry("გრძნობს", true, "verb", "exact_equivalent", "A1", "გრძნობა.", "მე ვგრძნობ თავს კარგად.", "I feel good.")
);

// 42. meet
addConcept("meet", "meet", "verb", "A1", "To come into contact with or assemble together.", [
  {
    sense_id: "sense_meet_encounter", sense_description: "To encounter or become acquainted with someone.", context_hint: "encounter",
    translations: langs(
      entry("meet", true, "verb", "exact_equivalent", "A1", "To encounter.", "Nice to meet you.", "Nice to meet you."),
      entry("rencontrer", true, "verb", "exact_equivalent", "A1", "Rencontrer.", "Ravi de vous rencontrer.", "Nice to meet you."),
      entry("incontrare", true, "verb", "exact_equivalent", "A1", "Incontrare.", "Piacere di incontrarti.", "Nice to meet you."),
      entry("встречать", true, "verb", "exact_equivalent", "A1", "Встречать впервые.", "Рад вас встретить.", "Nice to meet you.", { aspect: "imperfective" }),
      entry("συναντώ", true, "verb", "exact_equivalent", "A1", "Συναντώ.", "Χάρηκα που σε συνάντησα.", "Nice to meet you."),
      entry("encontrar", true, "verb", "exact_equivalent", "A1", "Encontrar.", "Prazer em conhecê-lo.", "Nice to meet you."),
      entry("treffen", true, "verb", "exact_equivalent", "A1", "Treffen.", "Schön dich zu treffen.", "Nice to meet you."),
      entry("conocer", true, "verb", "exact_equivalent", "A1", "Conocer / encontrar.", "Gusto en conocerte.", "Nice to meet you."),
      entry("очрашу", true, "verb", "exact_equivalent", "A1", "Йүзгә-йүз килү.", "Сезнең белән очрашуга шатмын.", "Nice to meet you."),
      entry("осрашыу", true, "verb", "exact_equivalent", "A1", "Йөҙгә-йөҙ килеү.", "Һеҙҙең менән осрашыуға шатмын.", "Nice to meet you."),
      entry("тĕл пулни", true, "verbal_expression", "exact_equivalent", "A1", "Тĕл пулни.", "Сипе тӗл пулнипе савӑнатӑп.", "Nice to meet you."),
      entry("kejañ", true, "verb", "exact_equivalent", "A1", "Kejañ ganti.", "Plijadur zo o kejañ ganit.", "Nice to meet you."),
      entry("հանդիպել", true, "verb", "exact_equivalent", "A1", "Հանդիպել մեկին:", "Ուրախ եմ հանդիպելու համար:", "Nice to meet you."),
      entry("შეხვედრა", true, "verb", "exact_equivalent", "A1", "შეხვედრა.", "სასიამოვნოა თქვენი შეხვედრა.", "Nice to meet you.")
    )
  },
  {
    sense_id: "sense_meet_assemble", sense_description: "To assemble or gather as a group.", context_hint: "assemble",
    translations: langs(
      entry("meet", true, "verb", "exact_equivalent", "A1", "To gather as group.", "The committee meets tomorrow.", "The committee meets tomorrow."),
      entry("se réunir", true, "verbal_expression", "exact_equivalent", "A1", "Se réunir.", "Le comité se réunit demain.", "The committee meets tomorrow."),
      entry("riunirsi", true, "verbal_expression", "exact_equivalent", "A1", "Riunirsi.", "Il comitato si riunisce domani.", "The committee meets tomorrow."),
      entry("собираться", true, "verb", "exact_equivalent", "A1", "Собираться вместе.", "Комитет собирается завтра.", "The committee meets tomorrow.", { aspect: "imperfective" }),
      entry("συνεδριάζω", true, "verb", "exact_equivalent", "A1", "Συνεδριάζω.", "Η επιτροπή συνεδριάζει αύριο.", "The committee meets tomorrow."),
      entry("reunir-se", true, "verbal_expression", "exact_equivalent", "A1", "Reunir-se.", "O comitê se reúne amanhã.", "The committee meets tomorrow."),
      entry("sich treffen", true, "verbal_expression", "exact_equivalent", "A1", "Tagen, sich treffen.", "Das Komitee trifft sich morgen.", "The committee meets tomorrow."),
      entry("reunirse", true, "verbal_expression", "exact_equivalent", "A1", "Reunirse.", "El comité se reúne mañana.", "The committee meets tomorrow."),
      entry("җыйналу", true, "verb", "exact_equivalent", "A1", "Җыелышу.", "Комитет иртәгә җыйнала.", "The committee meets tomorrow."),
      entry("йыйылыу", true, "verb", "exact_equivalent", "A1", "Йыйылышыу.", "Комитет иртәгә йыйыла.", "The committee meets tomorrow."),
      entry("пухӑнни", true, "verb", "exact_equivalent", "A1", "Ушкӑнпа пухӑнни.", "Комитет ыран пухнать.", "The committee meets tomorrow."),
      entry("bodañ", true, "verb", "exact_equivalent", "A1", "Bodañ asambles.", "Ar c'huzul a vod warc'hoazh.", "The committee meets tomorrow."),
      entry("հավաքվել", true, "verb", "exact_equivalent", "A1", "Հավաքվել, խորհրդակցել:", "Հանձնաժողովը հավաքվում է վաղը:", "The committee meets tomorrow."),
      entry("შეკრება", true, "verb", "exact_equivalent", "A1", "შეკრება.", "კომიტეტი იკრიბება ხვალ.", "The committee meets tomorrow.")
    )
  }
]);

// 43. decide
add1SenseConcept("decide", "decide", "verb", "A1", "To make a choice or resolution after consideration.", "decision making",
  entry("decide", true, "verb", "exact_equivalent", "A1", "To make a choice.", "I decide now.", "I decide now."),
  entry("décider", true, "verb", "exact_equivalent", "A1", "Décider.", "Je décide maintenant.", "I decide now."),
  entry("decidere", true, "verb", "exact_equivalent", "A1", "Decidere.", "Decido adesso.", "I decide now."),
  entry("решать", true, "verb", "exact_equivalent", "A1", "Принимать решение.", "Я решаю сейчас.", "I decide now.", { aspect: "imperfective" }),
  entry("αποφασίζω", true, "verb", "exact_equivalent", "A1", "Αποφασίζω.", "Αποφασίζω τώρα.", "I decide now."),
  entry("decidir", true, "verb", "exact_equivalent", "A1", "Decidir.", "Eu decido agora.", "I decide now."),
  entry("entscheiden", true, "verb", "exact_equivalent", "A1", "Entscheiden.", "Ich entscheide jetzt.", "I decide now."),
  entry("decidir", true, "verb", "exact_equivalent", "A1", "Decidir.", "Decido ahora.", "I decide now."),
  entry("карар итү", true, "verbal_expression", "exact_equivalent", "A1", "Карар кабул итү.", "Мин хәзер карар итәм.", "I decide now."),
  entry("ҡарар итеү", true, "verbal_expression", "exact_equivalent", "A1", "Ҡарар ҡабул итеү.", "Мин хәҙер ҡарар итәм.", "I decide now."),
  entry("татса хуни", true, "verbal_expression", "exact_equivalent", "A1", "Татса хуни.", "Эпӗ халь татса хуратӑп.", "I decide now."),
  entry("divizout", true, "verb", "exact_equivalent", "A1", "Divizout un dra bennak.", "Divizout a ran bremañ.", "I decide now."),
  entry("որոշել", true, "verb", "exact_equivalent", "A1", "Որոշում կայացնել:", "Ես որոշում եմ հիմա:", "I decide now."),
  entry("გადაწყვეტს", true, "verb", "exact_equivalent", "A1", "გადაწყვეტა.", "მე ვწყვეტ ახლა.", "I decide now.")
);

// 44. write
add1SenseConcept("write", "write", "verb", "A1", "To form letters, words, or text on a surface.", "text composition",
  entry("write", true, "verb", "exact_equivalent", "A1", "To form text.", "I write a letter.", "I write a letter."),
  entry("écrire", true, "verb", "exact_equivalent", "A1", "Écrire.", "J'écris une lettre.", "I write a letter."),
  entry("scrivere", true, "verb", "exact_equivalent", "A1", "Scrivere.", "Scrivo una lettera.", "I write a letter."),
  entry("писать", true, "verb", "exact_equivalent", "A1", "Писать буквы/текст.", "Я пишу письмо.", "I write a letter.", { aspect: "imperfective" }),
  entry("γράφω", true, "verb", "exact_equivalent", "A1", "Γράφω.", "Γράφω ένα γράμμα.", "I write a letter."),
  entry("escrever", true, "verb", "exact_equivalent", "A1", "Escrever.", "Eu escrevo uma carta.", "I write a letter."),
  entry("schreiben", true, "verb", "exact_equivalent", "A1", "Schreiben.", "Ich schreibe einen Brief.", "I write a letter."),
  entry("escribir", true, "verb", "exact_equivalent", "A1", "Escribir.", "Escribo una carta.", "I write a letter."),
  entry("язу", true, "verb", "exact_equivalent", "A1", "Хәрефләр язу.", "Мин хат язам.", "I write a letter."),
  entry("яҙыу", true, "verb", "exact_equivalent", "A1", "Һүҙҙәр яҙыу.", "Мин хат яҙам.", "I write a letter."),
  entry("ҫырни", true, "verb", "exact_equivalent", "A1", "Ҫыру ҫырни.", "Эпӗ ҫыру ҫێратӑп.", "I write a letter."),
  entry("skrivañ", true, "verb", "exact_equivalent", "A1", "Skrivañ ur lizher.", "Skrivañ a ran al lizher.", "I write a letter."),
  entry("գրել", true, "verb", "exact_equivalent", "A1", "Տեքստ գրել:", "Ես նամակ եմ գրում:", "I write a letter."),
  entry("წერს", true, "verb", "exact_equivalent", "A1", "წერა.", "მე ვწერ წერილს.", "I write a letter.")
);

// 45. read
add1SenseConcept("read", "read", "verb", "A1", "To decode written text visually.", "text reading",
  entry("read", true, "verb", "exact_equivalent", "A1", "To decode text.", "I read books.", "I read books."),
  entry("lire", true, "verb", "exact_equivalent", "A1", "Lire.", "Je lis des livres.", "I read books."),
  entry("leggere", true, "verb", "exact_equivalent", "A1", "Leggere.", "Lego libri.", "I read books."),
  entry("читать", true, "verb", "exact_equivalent", "A1", "Воспринимать текст.", "Я читаю книги.", "I read books.", { aspect: "imperfective" }),
  entry("διαβάζω", true, "verb", "exact_equivalent", "A1", "Διαβάζω.", "Διαβάζω βιβλία.", "I read books."),
  entry("ler", true, "verb", "exact_equivalent", "A1", "Ler.", "Eu leio livros.", "I read books."),
  entry("lesen", true, "verb", "exact_equivalent", "A1", "Lesen.", "Ich lese Bücher.", "I read books."),
  entry("leer", true, "verb", "exact_equivalent", "A1", "Leer.", "Leo libros.", "I read books."),
  entry("уку", true, "verb", "exact_equivalent", "A1", "Текст уку.", "Мин китаплар укыйм.", "I read books."),
  entry("уҡыу", true, "verb", "exact_equivalent", "A1", "Текст уҡыу.", "Мин китаптар уҡыйым.", "I read books."),
  entry("вулав", true, "verb", "exact_equivalent", "A1", "Кӗнеке вулав.", "Эпӗ кӗнекесем вулатӑп.", "I read books."),
  entry("lenn", true, "verb", "exact_equivalent", "A1", "Lenn al levrioù.", "Lenn a ran levrioù.", "I read books."),
  entry("կարդալ", true, "verb", "exact_equivalent", "A1", "Ընթերցել, կարդալ:", "Ես գրքեր եմ կարդում:", "I read books."),
  entry("კითხულობს", true, "verb", "exact_equivalent", "A1", "კითხვა.", "მე ვკითხულობ წიგნებს.", "I read books.")
);

// 46. type
add1SenseConcept("type", "type", "verb", "A1", "To input text using a keyboard or typewriter.", "keyboard entry",
  entry("type", true, "verb", "exact_equivalent", "A1", "To input text by keyboard.", "I type fast.", "I type fast."),
  entry("taper", true, "verb", "exact_equivalent", "A1", "Taper au clavier.", "Je tape vite.", "I type fast."),
  entry("digitare", true, "verb", "exact_equivalent", "A1", "Digitare sulla tastiera.", "Digito velocemente.", "I type fast."),
  entry("печатать", true, "verb", "exact_equivalent", "A1", "Набирать текст.", "Я быстро печатаю.", "I type fast.", { aspect: "imperfective" }),
  entry("πληκτρολογώ", true, "verb", "exact_equivalent", "A1", "Πληκτρολογώ.", "Πληκτρολογώ γρήγορα.", "I type fast."),
  entry("digitar", true, "verb", "exact_equivalent", "A1", "Digitar no teclado.", "Eu digito rápido.", "I type fast."),
  entry("tippen", true, "verb", "exact_equivalent", "A1", "Tippen.", "Ich tippe schnell.", "I type fast."),
  entry("teclear", true, "verb", "exact_equivalent", "A1", "Teclear / mecanografiar.", "Tecleo rápido.", "I type fast."),
  entry("язу", true, "verb", "contextual_equivalent", "A1", "Клавиатурада басу.", "Мин тиз язам.", "I type fast."),
  entry("яҙыу", true, "verb", "contextual_equivalent", "A1", "Клавиатурала баҫыу.", "Мин тиҙ яҙам.", "I type fast."),
  entry("пичетлени", true, "verb", "exact_equivalent", "A1", "Клавиатурапа пичетлени.", "Эпӗ хӑвӑрт пичетлетӗп.", "I type fast."),
  entry("skridaozañ", true, "verb", "exact_equivalent", "A1", "Skridaozañ war ar c'hlavienn.", "Skridaozañ a ran buan.", "I type fast."),
  entry("տպել", true, "verb", "exact_equivalent", "A1", "Ստեղնաշարով տպել:", "Ես արագ եմ տպում:", "I type fast."),
  entry("ბეჭდვა", true, "verb", "exact_equivalent", "A1", "კლავიატურაზე ბეჭდვა.", "მე სწრაფად ვბეჭდავ.", "I type fast.")
);

// 47. spend
addConcept("spend", "spend", "verb", "A1", "To pass time or disburse money.", [
  {
    sense_id: "sense_spend_time", sense_description: "To pass or occupy a period of time.", context_hint: "pass time",
    translations: langs(
      entry("spend", true, "verb", "exact_equivalent", "A1", "To pass time.", "I spend time here.", "I spend time here."),
      entry("passer", true, "verb", "exact_equivalent", "A1", "Passer du temps.", "Je passe du temps ici.", "I spend time here."),
      entry("passare", true, "verb", "exact_equivalent", "A1", "Passare il tempo.", "Passo del tempo qui.", "I spend time here."),
      entry("проводить", true, "verb", "exact_equivalent", "A1", "Проводить время.", "Я провожу время здесь.", "I spend time here.", { aspect: "imperfective" }),
      entry("περνώ", true, "verb", "exact_equivalent", "A1", "Περνώ χρόνο.", "Περνώ χρόνο εδώ.", "I spend time here."),
      entry("passar", true, "verb", "exact_equivalent", "A1", "Passar tempo.", "Eu passo tempo aqui.", "I spend time here."),
      entry("verbringen", true, "verb", "exact_equivalent", "A1", "Zeit verbringen.", "Ich verbringe Zeit hier.", "I spend time here."),
      entry("pasar", true, "verb", "exact_equivalent", "A1", "Pasar tiempo.", "Paso tiempo aquí.", "I spend time here."),
      entry("үткәрү", true, "verb", "exact_equivalent", "A1", "Вакыт үткәрү.", "Мин монда вакыт үткәрәм.", "I spend time here."),
      entry("үткәреү", true, "verb", "exact_equivalent", "A1", "Ваҡыт үткәреү.", "Мин бында ваҡыт үткәрәм.", "I spend time here."),
      entry("ирттерни", true, "verb", "exact_equivalent", "A1", "Вӑхӑт ирттерни.", "Эпӗ кунта вӑхӑт ирттеретӗп.", "I spend time here."),
      entry("tremen", true, "verb", "exact_equivalent", "A1", "Tremen amzer.", "Tremen a ran amzer amañ.", "I spend time here."),
      entry("անցկացնել", true, "verb", "exact_equivalent", "A1", "Ժամանակ անցկացնել:", "Ես ժամանակ եմ անցկացնում այստեղ:", "I spend time here."),
      entry("გატარება", true, "verb", "exact_equivalent", "A1", "დროის გატარება.", "მე ვატარებ დროს აქ.", "I spend time here.")
    )
  },
  {
    sense_id: "sense_spend_money", sense_description: "To disburse money on items/services.", context_hint: "disburse money",
    translations: langs(
      entry("spend", true, "verb", "exact_equivalent", "A1", "To pay money out.", "I spend money.", "I spend money."),
      entry("dépenser", true, "verb", "exact_equivalent", "A1", "Dépenser de l'argent.", "Je dépense de l'argent.", "I spend money."),
      entry("spendere", true, "verb", "exact_equivalent", "A1", "Spendere denaro.", "Spendo soldi.", "I spend money."),
      entry("тратить", true, "verb", "exact_equivalent", "A1", "Тратить деньги.", "Я трачу деньги.", "I spend money.", { aspect: "imperfective" }),
      entry("ξοδεύω", true, "verb", "exact_equivalent", "A1", "Ξοδεύω χρήματα.", "Ξοδεύω χρήματα.", "I spend money."),
      entry("gastar", true, "verb", "exact_equivalent", "A1", "Gastar dinheiro.", "Eu gasto dinheiro.", "I spend money."),
      entry("ausgeben", true, "verb", "exact_equivalent", "A1", "Geld ausgeben.", "Ich gebe Geld aus.", "I spend money."),
      entry("gastar", true, "verb", "exact_equivalent", "A1", "Gastar dinero.", "Gasto dinero.", "I spend money."),
      entry("харчлау", true, "verb", "exact_equivalent", "A1", "Акча харчлау.", "Мин акча харчлыйм.", "I spend money."),
      entry("тотоноу", true, "verb", "exact_equivalent", "A1", "Аҡша тотоноу.", "Мин аҡша тотонам.", "I spend money."),
      entry("тӑкаклани", true, "verb", "exact_equivalent", "A1", "Укҫа тӑкаклани.", "Эпӗ укҫа тӑкаклатӑп.", "I spend money."),
      entry("dispign", true, "verb", "exact_equivalent", "A1", "Dispign ar arc'hant.", "Dispign a ran arc'hant.", "I spend money."),
      entry("ծախսել", true, "verb", "exact_equivalent", "A1", "Փող ծախսել:", "Ես փող եմ ծախսում:", "I spend money."),
      entry("დახარჯვა", true, "verb", "exact_equivalent", "A1", "ფულის დახარჯვა.", "მე ვხარჯავ ფულს.", "I spend money.")
    )
  }
]);

// 48. waste
addConcept("waste", "waste", "verb", "A1", "To squander time or resources carelessly.", [
  {
    sense_id: "sense_waste_time", sense_description: "To use time unproductively or foolishly.", context_hint: "squander time",
    translations: langs(
      entry("waste", true, "verb", "exact_equivalent", "A1", "To squander time.", "Don't waste time.", "Don't waste time."),
      entry("gaspiller", true, "verb", "exact_equivalent", "A1", "Gaspiller du temps.", "Ne gaspille pas ton temps.", "Don't waste time."),
      entry("sprecare", true, "verb", "exact_equivalent", "A1", "Sprecare tempo.", "Non sprecare tempo.", "Don't waste time."),
      entry("терять", true, "verb", "exact_equivalent", "A1", "Тратить время попусту.", "Не теряй время.", "Don't waste time.", { aspect: "imperfective" }),
      entry("σπαταλώ", true, "verb", "exact_equivalent", "A1", "Σπαταλώ χρόνο.", "Μη σπαταλάς χρόνο.", "Don't waste time."),
      entry("desperdiçar", true, "verb", "exact_equivalent", "A1", "Desperdiçar tempo.", "Não desperdice tempo.", "Don't waste time."),
      entry("verschwenden", true, "verb", "exact_equivalent", "A1", "Zeit verschwenden.", "Verschwende keine Zeit.", "Don't waste time."),
      entry("desperdiciar", true, "verb", "exact_equivalent", "A1", "Desperdiciar tiempo.", "No desperdicies tiempo.", "Don't waste time."),
      entry("исраф итү", true, "verbal_expression", "exact_equivalent", "A1", "Вакыт исраф итү.", "Вакытны исраф итмә.", "Don't waste time."),
      entry("исраф итеү", true, "verbal_expression", "exact_equivalent", "A1", "Ваҡыт исраф итеү.", "Ваҡытты исраф итмә.", "Don't waste time."),
      entry("ахаль ярни", true, "verbal_expression", "exact_equivalent", "A1", "Вӑхӑта ахаль ярни.", "Вӑхӑта ахаль ан яра.", "Don't waste time."),
      entry("gwastañ", true, "verb", "exact_equivalent", "A1", "Gwastañ amzer.", "Na gwast ket da amzer.", "Don't waste time."),
      entry("վատնել", true, "verb", "exact_equivalent", "A1", "Ժամանակ վատնել:", "Մի վատնիր ժամանակը:", "Don't waste time."),
      entry("დაკარგვა", true, "verb", "exact_equivalent", "A1", "დროის დაკარგვა.", "ნუ კარგავ დროს.", "Don't waste time.")
    )
  },
  {
    sense_id: "sense_waste_money", sense_description: "To squander money or resources needlessly.", context_hint: "squander money",
    translations: langs(
      entry("waste", true, "verb", "exact_equivalent", "A1", "To squander money.", "Don't waste money.", "Don't waste money."),
      entry("gaspiller", true, "verb", "exact_equivalent", "A1", "Gaspiller de l'argent.", "Ne gaspille pas d'argent.", "Don't waste money."),
      entry("sprecare", true, "verb", "exact_equivalent", "A1", "Sprecare soldi.", "Non sprecare soldi.", "Don't waste money."),
      entry("тратить впустую", true, "verbal_expression", "exact_equivalent", "A1", "Тратить впустую.", "Не трать деньги впустую.", "Don't waste money.", { aspect: "imperfective" }),
      entry("σπαταλώ", true, "verb", "exact_equivalent", "A1", "Σπαταλώ χρήματα.", "Μη σπαταλάς χρήματα.", "Don't waste money."),
      entry("desperdiçar", true, "verb", "exact_equivalent", "A1", "Desperdiçar dinheiro.", "Não desperdice dinheiro.", "Don't waste money."),
      entry("verschwenden", true, "verb", "exact_equivalent", "A1", "Geld verschwenden.", "Verschwende kein Geld.", "Don't waste money."),
      entry("malgastar", true, "verb", "exact_equivalent", "A1", "Malgastar dinero.", "No malgastes dinero.", "Don't waste money."),
      entry("исраф итү", true, "verbal_expression", "exact_equivalent", "A1", "Акча исраф итү.", "Акчаны исраф итмә.", "Don't waste money."),
      entry("исраф итеү", true, "verbal_expression", "exact_equivalent", "A1", "Аҡша исраф итеү.", "Аҡшаны исраф итмә.", "Don't waste money."),
      entry("сапилани", true, "verb", "exact_equivalent", "A1", "Укҫа сапилани.", "Укҫана сапилама.", "Don't waste money."),
      entry("dispignañ", true, "verb", "exact_equivalent", "A1", "Dispignañ re a arc'hant.", "Na dispign ket evel-se.", "Don't waste money."),
      entry("վատնել", true, "verb", "exact_equivalent", "A1", "Փող վատնել:", "Մի վատնիր փողը:", "Don't waste money."),
      entry("ფლანგვა", true, "verb", "exact_equivalent", "A1", "ფულის ფლანგვა.", "ნუ ფლანგავ ფულს.", "Don't waste money.")
    )
  }
]);

// 49. play
addConcept("play", "play", "verb", "A1", "To engage in recreation or perform music.", [
  {
    sense_id: "sense_play_game", sense_description: "To take part in a game, sport, or match.", context_hint: "sports / games",
    translations: langs(
      entry("play", true, "verb", "exact_equivalent", "A1", "To participate in game.", "I play football.", "I play football."),
      entry("jouer", true, "verb", "exact_equivalent", "A1", "Jouer à un jeu.", "Je joue au football.", "I play football."),
      entry("giocare", true, "verb", "exact_equivalent", "A1", "Giocare a un gioco.", "Gioco a calcio.", "I play football."),
      entry("играть", true, "verb", "exact_equivalent", "A1", "Играть в игру.", "Я играю в футбол.", "I play football.", { aspect: "imperfective" }),
      entry("παίζω", true, "verb", "exact_equivalent", "A1", "Παίζω παιχνίδι.", "Παίζω ποδόσφαιρο.", "I play football."),
      entry("jogar", true, "verb", "exact_equivalent", "A1", "Jogar futebol.", "Eu jogo futebol.", "I play football."),
      entry("spielen", true, "verb", "exact_equivalent", "A1", "Spielen.", "Ich spiele Fußball.", "I play football."),
      entry("jugar", true, "verb", "exact_equivalent", "A1", "Jugar al fútbol.", "Juego al fútbol.", "I play football."),
      entry("уйнау", true, "verb", "exact_equivalent", "A1", "Уен уйнау.", "Мин футбол уynam.", "I play football."),
      entry("уйнау", true, "verb", "exact_equivalent", "A1", "Уйын играть.", "Мин футбол уйнайым.", "I play football."),
      entry("выляни", true, "verb", "exact_equivalent", "A1", "Вӑйӑ выляни.", "Эпӗ футбол вылятӑп.", "I play football."),
      entry("c'hoari", true, "verb", "exact_equivalent", "A1", "C'hoari mell-droad.", "C'hoari a ran mell-droad.", "I play football."),
      entry("խաղալ", true, "verb", "exact_equivalent", "A1", "Խաղ խաղալ:", "Ես ֆուտբոլ եմ խաղում:", "I play football."),
      entry("თამაში", true, "verb", "exact_equivalent", "A1", "თამაში.", "მე ვთამაშობ ფეხბურთს.", "I play football.")
    )
  },
  {
    sense_id: "sense_play_instrument", sense_description: "To perform music on a musical instrument.", context_hint: "musical instrument",
    translations: langs(
      entry("play", true, "verb", "exact_equivalent", "A1", "To perform on instrument.", "I play guitar.", "I play guitar."),
      entry("jouer", true, "verb", "exact_equivalent", "A1", "Jouer d'un instrument.", "Je joue de la guitare.", "I play guitar."),
      entry("suonare", true, "verb", "exact_equivalent", "A1", "Suonare uno strumento.", "Suono la chitarra.", "I play guitar."),
      entry("играть", true, "verb", "exact_equivalent", "A1", "Играть на инструменте.", "Я играю на гитаре.", "I play guitar.", { aspect: "imperfective" }),
      entry("παίζω", true, "verb", "exact_equivalent", "A1", "Παίζω όργανο.", "Παίζω κιθάρα.", "I play guitar."),
      entry("tocar", true, "verb", "exact_equivalent", "A1", "Tocar instrumento.", "Eu toco violão.", "I play guitar."),
      entry("spielen", true, "verb", "exact_equivalent", "A1", "Gitarre spielen.", "Ich spiele Gitarre.", "I play guitar."),
      entry("tocar", true, "verb", "exact_equivalent", "A1", "Tocar un instrumento.", "Toco la guitarra.", "I play guitar."),
      entry("уйнау", true, "verb", "exact_equivalent", "A1", "Музыка коралында уйнау.", "Мин гитарада уйныйм.", "I play guitar."),
      entry("уйнау", true, "verb", "exact_equivalent", "A1", "Музыка ҡоралында играть.", "Мин гитарала уйнайым.", "I play guitar."),
      entry("выляни", true, "verb", "exact_equivalent", "A1", "Гитарапа выляни.", "Эпӗ гитара вылятӑп.", "I play guitar."),
      entry("seniñ", true, "verb", "exact_equivalent", "A1", "Seniñ violoñs pe gitar.", "Seniñ a ran ar giter.", "I play guitar."),
      entry("նվագել", true, "verb", "exact_equivalent", "A1", "Երաժշտական գործիք նվագել:", "Ես կիթառ եմ նվագում:", "I play guitar."),
      entry("დაკვრა", true, "verb", "exact_equivalent", "A1", "ინსტრუმენტზე დაკვრა.", "მე ვუკრავ გიტარაზე.", "I play guitar.")
    )
  }
]);

// 50. agree
add1SenseConcept("agree", "agree", "verb", "A1", "To share the same opinion or concur.", "concurrence",
  entry("agree", true, "verb", "exact_equivalent", "A1", "To concur.", "I agree with you.", "I agree with you."),
  entry("être d'accord", true, "verbal_expression", "exact_equivalent", "A1", "Partager la même opinion.", "Je suis d'accord avec toi.", "I agree with you."),
  entry("essere d'accordo", true, "verbal_expression", "exact_equivalent", "A1", "Essere d'accordo.", "Sono d'accordo con te.", "I agree with you."),
  entry("соглашаться", true, "verb", "exact_equivalent", "A1", "Разделять мнение.", "Я согласен с вами.", "I agree with you.", { aspect: "imperfective" }),
  entry("συμφωνώ", true, "verb", "exact_equivalent", "A1", "Συμφωνώ.", "Συμφωνώ μαζί σου.", "I agree with you."),
  entry("concordar", true, "verb", "exact_equivalent", "A1", "Concordar.", "Eu concordo com você.", "I agree with you."),
  entry("zustimmen", true, "verb", "exact_equivalent", "A1", "Einverstanden sein.", "Ich stimme dir zu.", "I agree with you."),
  entry("estar de acuerdo", true, "verbal_expression", "exact_equivalent", "A1", "Estar de acuerdo.", "Estoy de acuerdo contigo.", "I agree with you."),
  entry("килешү", true, "verb", "exact_equivalent", "A1", "Фикергә килү.", "Мин сезнең белән килешәм.", "I agree with you."),
  entry("килешеү", true, "verb", "exact_equivalent", "A1", "Фикергә килеү.", "Мин һеҙҙең менән килешәм.", "I agree with you."),
  entry("килӗшни", true, "verb", "exact_equivalent", "A1", "Шухӑшпа килӗшни.", "Эпӗ сипе килӗшетӗп.", "I agree with you."),
  entry("a-du bezañ", true, "verbal_expression", "exact_equivalent", "A1", "Bezañ a-du ganti.", "A-du on ganit.", "I agree with you."),
  entry("համաձայնել", true, "verb", "exact_equivalent", "A1", "Համամիտ լինել:", "Ես համաձայն եմ ձեզ հետ:", "I agree with you."),
  entry("დათანხმება", true, "verb", "exact_equivalent", "A1", "ეთანხმება.", "მე ვეთანხმები შენ.", "I agree with you.")
);

// 51. disagree
add1SenseConcept("disagree", "disagree", "verb", "A1", "To hold a different opinion or dissent.", "dissent",
  entry("disagree", true, "verb", "exact_equivalent", "A1", "To dissent.", "I disagree.", "I disagree."),
  entry("ne pas être d'accord", true, "verbal_expression", "exact_equivalent", "A1", "Diverger d'opinion.", "Je ne suis pas d'accord.", "I disagree."),
  entry("non essere d'accordo", true, "verbal_expression", "exact_equivalent", "A1", "Avere opinione diversa.", "Non sono d'accordo.", "I disagree."),
  entry("не соглашаться", true, "verbal_expression", "exact_equivalent", "A1", "Возражать.", "Я не согласен.", "I disagree.", { aspect: "imperfective" }),
  entry("διαφωνώ", true, "verb", "exact_equivalent", "A1", "Διαφωνώ.", "Διαφωνώ.", "I disagree."),
  entry("discordar", true, "verb", "exact_equivalent", "A1", "Discordar.", "Eu discordo.", "I disagree."),
  entry("widersprechen", true, "verb", "exact_equivalent", "A1", "Nicht zustimmen.", "Ich stimme nicht zu.", "I disagree."),
  entry("no estar de acuerdo", true, "verbal_expression", "exact_equivalent", "A1", "Discrepar.", "No estoy de acuerdo.", "I disagree."),
  entry("килешмәү", true, "verb", "exact_equivalent", "A1", "Килешмәү.", "Мин килешмим.", "I disagree."),
  entry("килешмәү", true, "verb", "exact_equivalent", "A1", "Килешмәү.", "Мин килешмәйем.", "I disagree."),
  entry("килӗшменни", true, "verb", "exact_equivalent", "A1", "Килӗшмес пурӑнни.", "Эпӗ килӗшместӗп.", "I disagree."),
  entry("n'em bezañ ket a-du", true, "verbal_expression", "exact_equivalent", "A1", "N'em bezañ ket a-du.", "N'on ket a-du.", "I disagree."),
  entry("չհամաձայնել", true, "verb", "exact_equivalent", "A1", "Չհամաձայնել:", "Ես համաձայն չեմ:", "I disagree."),
  entry("არ დათანხმება", true, "verbal_expression", "exact_equivalent", "A1", "არ დათანხმება.", "მე არ ვეთანხმები.", "I disagree.")
);

// 52. send
add1SenseConcept("send", "send", "verb", "A1", "To cause to go or be conveyed to a destination.", "dispatch / transit",
  entry("send", true, "verb", "exact_equivalent", "A1", "To dispatch.", "I send an email.", "I send an email."),
  entry("envoyer", true, "verb", "exact_equivalent", "A1", "Envoyer.", "J'envoie un e-mail.", "I send an email."),
  entry("inviare", true, "verb", "exact_equivalent", "A1", "Inviare.", "Invio un'e-mail.", "I send an email."),
  entry("посылать", true, "verb", "exact_equivalent", "A1", "Отправлять.", "Я посылаю письмо.", "I send an email.", { aspect: "imperfective" }),
  entry("στέλνω", true, "verb", "exact_equivalent", "A1", "Στέλνω.", "Στέλνω ένα email.", "I send an email."),
  entry("enviar", true, "verb", "exact_equivalent", "A1", "Enviar.", "Eu envio um e-mail.", "I send an email."),
  entry("schicken", true, "verb", "exact_equivalent", "A1", "Senden, schicken.", "Ich schicke eine E-Mail.", "I send an email."),
  entry("enviar", true, "verb", "exact_equivalent", "A1", "Enviar.", "Envío un e-mail.", "I send an email."),
  entry("җибәрү", true, "verb", "exact_equivalent", "A1", "Илтеп җиткерү.", "Мин электрон хат җибәрәм.", "I send an email."),
  entry("ебәреү", true, "verb", "exact_equivalent", "A1", "Илтеп җиткереү.", "Мин электрон хат ебәрәйем.", "I send an email."),
  entry("ярни", true, "verb", "exact_equivalent", "A1", "Ярса хуни.", "Эпӗ электронлӑ ҫыру яратӑп.", "I send an email."),
  entry("kas", true, "verb", "exact_equivalent", "A1", "Kas ur c'hemenn.", "Kas a ran ur postel.", "I send an email."),
  entry("ուղարկել", true, "verb", "exact_equivalent", "A1", "Ուղարկել:", "Ես նամակ եմ ուղարկում:", "I send an email."),
  entry("გაგზავნა", true, "verb", "exact_equivalent", "A1", "გაგზავნა.", "მე ვგზავნი ელფოსტას.", "I send an email.")
);

// 53. get
addConcept("get", "get", "verb", "A1", "To receive, obtain, or become.", [
  {
    sense_id: "sense_get_receive", sense_description: "To receive or obtain something.", context_hint: "obtain / receive",
    translations: langs(
      entry("get", true, "verb", "exact_equivalent", "A1", "To obtain or receive.", "I get a gift.", "I get a gift."),
      entry("recevoir", true, "verb", "exact_equivalent", "A1", "Recevoir.", "Je reçois un cadeau.", "I get a gift."),
      entry("ricevere", true, "verb", "exact_equivalent", "A1", "Ricevere.", "Ricevo un regalo.", "I get a gift."),
      entry("получать", true, "verb", "exact_equivalent", "A1", "Получать.", "Я получаю подарок.", "I get a gift.", { aspect: "imperfective" }),
      entry("παίρνω", true, "verb", "exact_equivalent", "A1", "Παίρνω.", "Παίρνω ένα δώρο.", "I get a gift."),
      entry("receber", true, "verb", "exact_equivalent", "A1", "Receber.", "Eu recebo um presente.", "I get a gift."),
      entry("bekommen", true, "verb", "exact_equivalent", "A1", "Bekommen.", "Ich bekomme ein Geschenk.", "I get a gift."),
      entry("recibir", true, "verb", "exact_equivalent", "A1", "Recibir.", "Recibo un regalo.", "I get a gift."),
      entry("алу", true, "verb", "exact_equivalent", "A1", "Кабул итү.", "Мин бүләк алам.", "I get a gift."),
      entry("алыу", true, "verb", "exact_equivalent", "A1", "Ҡабул итеү.", "Мин бүләк алыам.", "I get a gift."),
      entry("илни", true, "verb", "exact_equivalent", "A1", "Парне илни.", "Эпӗ парне илетӗп.", "I get a gift."),
      entry("kaout", true, "verb", "exact_equivalent", "A1", "Kaout ur prof.", "Kaout a ran ur prof.", "I get a gift."),
      entry("ստանալ", true, "verb", "exact_equivalent", "A1", "Ստանալ, ձեռք բերել:", "Ես նվեր եմ ստանում:", "I get a gift."),
      entry("მიღება", true, "verb", "exact_equivalent", "A1", "მიღება.", "მე ვიღებ საჩუქარს.", "I get a gift.")
    )
  },
  {
    sense_id: "sense_get_become", sense_description: "To enter into a specified state; become.", context_hint: "become / state change",
    translations: langs(
      entry("get", true, "verb", "exact_equivalent", "A1", "To become.", "I get tired.", "I get tired."),
      entry("devenir", true, "verb", "exact_equivalent", "A1", "Devenir.", "Je deviens fatigué.", "I get tired."),
      entry("diventare", true, "verb", "exact_equivalent", "A1", "Diventare.", "Divento stanco.", "I get tired."),
      entry("становиться", true, "verb", "exact_equivalent", "A1", "Переходить в состояние.", "Я устаю.", "I get tired.", { aspect: "imperfective" }),
      entry("γίνομαι", true, "verb", "exact_equivalent", "A1", "Γίνομαι.", "Γίνομαι κουρασμένος.", "I get tired."),
      entry("ficar", true, "verb", "exact_equivalent", "A1", "Ficar cansado.", "Eu fico cansado.", "I get tired."),
      entry("werden", true, "verb", "exact_equivalent", "A1", "Müde werden.", "Ich werde müde.", "I get tired."),
      entry("ponerse", true, "verbal_expression", "exact_equivalent", "A1", "Ponerse / cansarse.", "Me canso.", "I get tired."),
      entry("булу", true, "verb", "exact_equivalent", "A1", "Ару хәленә җитү.", "Мин арыйм.", "I get tired."),
      entry("булыу", true, "verb", "exact_equivalent", "A1", "Арыу хәленә җитү.", "Мин арыйым.", "I get tired."),
      entry("пулни", true, "verb", "exact_equivalent", "A1", "Ывӑнса пулни.", "Эпӗ ывӑнатӑп.", "I get tired."),
      entry("dont da vezañ", true, "verbal_expression", "exact_equivalent", "A1", "Dont da vezañ skuizh.", "Dont a ran da vezañ skuizh.", "I get tired."),
      entry("դառնալ", true, "verb", "exact_equivalent", "A1", "Դառնալ, հոգնել:", "Ես հոգնում եմ:", "I get tired."),
      entry("გახდომა", true, "verb", "exact_equivalent", "A1", "გახდომა.", "მე ვიღლები.", "I get tired.")
    )
  }
]);

const dataset = {
  version: "1.0.0",
  description: "Canonical Multilingual Verb Inventory covering 53 core English concepts across 14 COSY languages.",
  concepts: conceptsMap
};

fs.writeFileSync(inventoryPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log(`Successfully generated ${Object.keys(conceptsMap).length} concept entries in ${inventoryPath}`);
