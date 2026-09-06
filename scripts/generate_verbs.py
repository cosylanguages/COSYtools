import json
import os

verbs = {}

def add_verb(base, past_simple, past_participle, third_person, pattern_group, level, definition, ex1, ex2, ex3):
    verbs[base] = {
        "base": base,
        "past_simple": past_simple,
        "past_participle": past_participle,
        "third_person_singular": third_person,
        "pattern_group": pattern_group,
        "level": level,
        "definition": definition,
        "examples": [ex1, ex2, ex3]
    }

# A1 VERBS (~50-55)
add_verb("be", "was/were", "been", "is", "totally_irregular", "A1",
         "To exist or live.",
         "She is a doctor at the city hospital.", "They were happy with the results.", "He has been to London twice.")

add_verb("become", "became", "become", "becomes", "vowel_change", "A1",
         "To begin to be or turn into something.",
         "He becomes angry when plans change.", "She became a lawyer last year.", "It has become very cold outside.")

add_verb("begin", "began", "begun", "begins", "vowel_change", "A1",
         "To start or initiate an action.",
         "The class begins at nine o'clock every morning.", "It began to rain heavily an hour ago.", "We have begun our new project.")

add_verb("break", "broke", "broken", "breaks", "add_en_or_n", "A1",
         "To separate into pieces or damage.",
         "He breaks a dish by accident sometimes.", "She broke her leg while skiing.", "The vase has broken into pieces.")

add_verb("bring", "brought", "brought", "brings", "same_past_participle", "A1",
         "To carry or convey something to a place.",
         "She brings delicious snacks to work.", "He brought a gift to the party.", "They have brought their homework.")

add_verb("build", "built", "built", "builds", "same_past_participle", "A1",
         "To construct or erect a building or structure.",
         "The company builds modern apartments.", "They built a new bridge over the river.", "They have built a strong house.")

add_verb("buy", "bought", "bought", "buys", "same_past_participle", "A1",
         "To obtain something in exchange for payment.",
         "She buys fresh vegetables every Saturday.", "He bought a new bicycle yesterday.", "We have bought tickets for the concert.")

add_verb("catch", "caught", "caught", "catches", "same_past_participle", "A1",
         "To capture or intercept something in motion.",
         "He catches the early bus every morning.", "She caught the ball with one hand.", "They have caught a cold this winter.")

add_verb("choose", "chose", "chosen", "chooses", "add_en_or_n", "A1",
         "To select or pick from options.",
         "She chooses her clothes carefully.", "He chose the blue shirt for the interview.", "They have chosen a new leader.")

add_verb("come", "came", "come", "comes", "vowel_change", "A1",
         "To move towards or arrive at a place.",
         "He comes home at six PM every day.", "She came to visit us last weekend.", "My parents have come to stay with us.")

add_verb("cost", "cost", "cost", "costs", "no_change", "A1",
         "To require payment or price.",
         "A cup of coffee costs three dollars.", "The ticket cost twenty euros yesterday.", "The repairs have cost a lot of money.")

add_verb("cut", "cut", "cut", "cuts", "no_change", "A1",
         "To slice or divide with a sharp tool.",
         "He cuts the bread into slices.", "She cut her finger while cooking.", "He has cut the grass in the garden.")

add_verb("do", "did", "done", "does", "totally_irregular", "A1",
         "To perform or carry out an action.",
         "She does her homework after dinner.", "He did a great job on the presentation.", "We have done all the work.")

add_verb("draw", "drew", "drawn", "draws", "add_en_or_n", "A1",
         "To produce a picture using a pen or pencil.",
         "He draws portraits in his free time.", "She drew a beautiful flower on paper.", "He has drawn a detailed map.")

add_verb("drink", "drank", "drunk", "drinks", "vowel_change", "A1",
         "To swallow liquid.",
         "She drinks two liters of water daily.", "He drank a glass of milk before bed.", "We have drunk all the orange juice.")

add_verb("drive", "drove", "driven", "drives", "add_en_or_n", "A1",
         "To operate and control a vehicle.",
         "He drives to work every morning.", "She drove to the beach last Sunday.", "They have driven across the country.")

add_verb("eat", "ate", "eaten", "eats", "totally_irregular", "A1",
         "To consume food through the mouth.",
         "She eats fruit for breakfast daily.", "He ate dinner at a restaurant last night.", "They have eaten all the cake.")

add_verb("fall", "fell", "fallen", "falls", "add_en_or_n", "A1",
         "To move downward quickly by force of gravity.",
         "Leaves fall from trees in autumn.", "He fell off his bike yesterday.", "The snow has fallen all night.")

add_verb("feel", "felt", "felt", "feels", "same_past_participle", "A1",
         "To experience an emotion or physical sensation.",
         "She feels happy when she listens to music.", "He felt tired after the long journey.", "They have felt better recently.")

add_verb("find", "found", "found", "finds", "vowel_change", "A1",
         "To discover or locate something.",
         "She finds good deals online.", "He found his missing keys under the sofa.", "We have found a solution to the problem.")

add_verb("fly", "flew", "flown", "flies", "add_en_or_n", "A1",
         "To move through the air with wings or aircraft.",
         "The bird flies over the trees.", "They flew to Paris last month.", "The pilot has flown this route many times.")

add_verb("forget", "forgot", "forgotten", "forgets", "add_en_or_n", "A1",
         "To fail to remember or recall.",
         "He forgets his password frequently.", "She forgot her umbrella on the bus.", "I have forgotten my umbrella.")

add_verb("get", "got", "gotten", "gets", "add_en_or_n", "A1",
         "To receive, obtain, or become.",
         "She gets good grades in school.", "He got a new job last month.", "They have gotten many presents.")

add_verb("give", "gave", "given", "gives", "add_en_or_n", "A1",
         "To present or bestow something to someone.",
         "She gives flowers to her mother.", "He gave me a useful advice yesterday.", "They have given us a warm welcome.")

add_verb("go", "went", "gone", "goes", "totally_irregular", "A1",
         "To move or travel from one place to another.",
         "She goes to school every day.", "He went home early yesterday.", "They have gone to the market.")

add_verb("grow", "grew", "grown", "grows", "add_en_or_n", "A1",
         "To increase in size or develop.",
         "The plant grows quickly in sunlight.", "He grew two inches over the summer.", "The city has grown significantly.")

add_verb("have", "had", "had", "has", "totally_irregular", "A1",
         "To possess or hold.",
         "She has two brothers and one sister.", "He had a cold last week.", "They have had a wonderful holiday.")

add_verb("hear", "heard", "heard", "hears", "same_past_participle", "A1",
         "To perceive sound with the ear.",
         "She hears music coming from next door.", "He heard a loud noise last night.", "We have heard the news already.")

add_verb("hide", "hid", "hidden", "hides", "add_en_or_n", "A1",
         "To put or keep out of sight.",
         "The cat hides under the bed during storms.", "He hid the money in a safe box.", "She has hidden the surprise present.")

add_verb("hit", "hit", "hit", "hits", "no_change", "A1",
         "To strike forcibly with hands or object.",
         "He hits the ball with the racket.", "The car hit a lamppost yesterday.", "The storm has hit the coast hard.")

add_verb("hold", "held", "held", "holds", "vowel_change", "A1",
         "To grasp or support with hands.",
         "She holds the baby gently.", "He held the door open for everyone.", "They have held the event annually.")

add_verb("hurt", "hurt", "hurt", "hurts", "no_change", "A1",
         "To cause physical pain or injury.",
         "His leg hurts after running.", "She hurt her wrist playing tennis.", "Nobody has hurt themselves.")

add_verb("keep", "kept", "kept", "keeps", "same_past_participle", "A1",
         "To retain or maintain possession of.",
         "She keeps her room clean and tidy.", "He kept his secret for many years.", "We have kept all our old photos.")

add_verb("know", "knew", "known", "knows", "add_en_or_n", "A1",
         "To be aware of or familiar with.",
         "He knows the answer to every question.", "She knew him when they were kids.", "I have known her for ten years.")

add_verb("learn", "learnt", "learnt", "learns", "same_past_participle", "A1",
         "To gain knowledge or skill.",
         "She learns English grammar every day.", "He learnt to ride a horse last year.", "They have learnt a lot in this course.")

add_verb("leave", "left", "left", "leaves", "same_past_participle", "A1",
         "To go away from or depart.",
         "The train leaves at eight sharp.", "He left his jacket at the office.", "She has left her keys on the table.")

add_verb("let", "let", "let", "lets", "no_change", "A1",
         "To allow or permit.",
         "She lets her children play outside.", "He let us borrow his car yesterday.", "They have let us stay at their apartment.")

add_verb("lose", "lost", "lost", "loses", "same_past_participle", "A1",
         "To fail to keep or be deprived of.",
         "He loses his glasses constantly.", "She lost her watch at the beach.", "We have lost our way in the fog.")

add_verb("make", "made", "made", "makes", "same_past_participle", "A1",
         "To create, construct, or produce.",
         "She makes delicious cakes.", "He made a wooden chair in workshop.", "They have made great progress.")

add_verb("mean", "meant", "meant", "means", "same_past_participle", "A1",
         "To signify or intend to express.",
         "What does this word mean in context?", "He meant to call you earlier today.", "She has meant well all along.")

add_verb("meet", "met", "met", "meets", "vowel_change", "A1",
         "To encounter or assemble with someone.",
         "She meets her friends every weekend.", "He met the director yesterday morning.", "We have met before at a conference.")

add_verb("pay", "paid", "paid", "pays", "same_past_participle", "A1",
         "To give money in exchange for goods/services.",
         "He pays his bills on time.", "She paid for the lunch bill yesterday.", "They have paid for the flight tickets.")

add_verb("put", "put", "put", "puts", "no_change", "A1",
         "To place or position something somewhere.",
         "She puts the book on the shelf.", "He put his coat in the closet.", "We have put the furniture in place.")

add_verb("read", "read", "read", "reads", "vowel_change", "A1",
         "To look at and comprehend written text.",
         "He reads the newspaper every morning.", "She read three books last month.", "I have read that novel twice.")

add_verb("ride", "rode", "ridden", "rides", "add_en_or_n", "A1",
         "To sit on and control a horse or bike.",
         "She rides her bike to work.", "He rode a horse across the field.", "They have ridden camels in Egypt.")

add_verb("ring", "rang", "rung", "rings", "vowel_change", "A1",
         "To make a clear resonant sound.",
         "The phone rings loudly in the hall.", "He rang the doorbell twice.", "The church bell has rung twelve times.")

add_verb("run", "ran", "run", "runs", "vowel_change", "A1",
         "To move swiftly on foot.",
         "He runs five kilometers every morning.", "She ran to catch the train.", "They have run two marathons this year.")

add_verb("say", "said", "said", "says", "same_past_participle", "A1",
         "To utter words or state aloud.",
         "She says hello to everyone she meets.", "He said he was feeling tired.", "They have said everything needed.")

add_verb("see", "saw", "seen", "sees", "totally_irregular", "A1",
         "To perceive with the eyes.",
         "He sees birds outside his window.", "She saw a great film last night.", "We have seen that movie already.")

add_verb("sell", "sold", "sold", "sells", "same_past_participle", "A1",
         "To transfer goods in exchange for money.",
         "He sells fresh bread at the bakery.", "She sold her old car last week.", "They have sold all the tickets.")

add_verb("send", "sent", "sent", "sends", "same_past_participle", "A1",
         "To dispatch or cause to go to a destination.",
         "She sends an email every day.", "He sent a letter to his friend.", "They have sent the package by mail.")

add_verb("set", "set", "set", "sets", "no_change", "A1",
         "To put or place in a specified state.",
         "The sun sets in the west.", "She set the table for four people.", "He has set the alarm for six AM.")

add_verb("sing", "sang", "sung", "sings", "vowel_change", "A1",
         "To produce musical sounds with the voice.",
         "She sings in the church choir.", "He sang a beautiful song at the party.", "They have sung that hymn together.")

add_verb("sit", "sat", "sat", "sits", "vowel_change", "A1",
         "To rest weight on buttocks or seat.",
         "He sits near the window in class.", "She sat on the bench in the park.", "We have sat here for an hour.")

add_verb("sleep", "slept", "slept", "sleeps", "same_past_participle", "A1",
         "To rest in state of natural unconsciousness.",
         "He sleeps eight hours every night.", "She slept deeply after the flight.", "They have slept soundly all night.")

add_verb("speak", "spoke", "spoken", "speaks", "add_en_or_n", "A1",
         "To express thoughts aloud in words.",
         "She speaks three languages fluently.", "He spoke at the conference yesterday.", "We have spoken about this issue.")

add_verb("spend", "spent", "spent", "spends", "same_past_participle", "A1",
         "To pay out money or pass time.",
         "He spends time with his family.", "She spent fifty dollars on books.", "They have spent all their savings.")

add_verb("stand", "stood", "stood", "stands", "same_past_participle", "A1",
         "To maintain an upright position on feet.",
         "A tall tree stands near the house.", "He stood up when the teacher entered.", "We have stood in line for hours.")

add_verb("steal", "stole", "stolen", "steals", "add_en_or_n", "A1",
         "To take property without permission.",
         "A thief steals valuable items.", "Someone stole his bicycle yesterday.", "The jewels have been stolen.")

add_verb("swim", "swam", "swum", "swims", "vowel_change", "A1",
         "To propel body through water.",
         "She swims in the pool every morning.", "He swam across the lake easily.", "They have swum in the ocean.")

add_verb("take", "took", "taken", "takes", "add_en_or_n", "A1",
         "To lay hold of, receive, or transport.",
         "He takes medicine after meals.", "She took a photo of the sunset.", "They have taken many photos.")

add_verb("teach", "taught", "taught", "teaches", "same_past_participle", "A1",
         "To impart knowledge or instruct.",
         "She teaches mathematics at university.", "He taught us history last semester.", "They have taught many students.")

add_verb("tell", "told", "told", "tells", "same_past_participle", "A1",
         "To relate or communicate information.",
         "He tells interesting stories.", "She told me the truth about the event.", "They have told everyone the good news.")

add_verb("think", "thought", "thought", "thinks", "same_past_participle", "A1",
         "To use the mind to consider.",
         "She thinks carefully before deciding.", "He thought about the question for a while.", "We have thought of a good plan.")

add_verb("throw", "threw", "thrown", "throws", "add_en_or_n", "A1",
         "To propel something through air.",
         "He throws the ball to his dog.", "She threw the paper into the trash.", "He has thrown away old papers.")

add_verb("understand", "understood", "understood", "understands", "same_past_participle", "A1",
         "To perceive meaning or comprehend.",
         "She understands complex ideas quickly.", "He understood the instructions clearly.", "They have understood the rules.")

add_verb("wake", "woke", "woken", "wakes", "add_en_or_n", "A1",
         "To emerge from sleep.",
         "He wakes up early every morning.", "She woke up at six today.", "They have woken up refreshed.")

add_verb("wear", "wore", "worn", "wears", "add_en_or_n", "A1",
         "To have clothes or accessories on body.",
         "She wears glasses for reading.", "He wore a black suit to the wedding.", "The coat has been worn out.")

add_verb("win", "won", "won", "wins", "vowel_change", "A1",
         "To achieve victory in a contest.",
         "He wins matches consistently.", "She won first prize in the competition.", "They have won three awards.")

add_verb("write", "wrote", "written", "writes", "add_en_or_n", "A1",
         "To form letters or words on a surface.",
         "She writes articles for a magazine.", "He wrote a long letter yesterday.", "I have written three chapters so far.")


# A2 VERBS (~45)
add_verb("awake", "awoke", "awoken", "awakes", "add_en_or_n", "A2",
         "To stop sleeping or cause to wake.",
         "He awakes at sunrise every morning.", "The thunder awoke the sleeping child.", "She has awoken from her long sleep.")

add_verb("bend", "bent", "bent", "bends", "same_past_participle", "A2",
         "To curve or incline from straight line.",
         "He bends down to pick up his keys.", "She bent the wire into a ring shape.", "The metal pole has bent under pressure.")

add_verb("bet", "bet", "bet", "bets", "no_change", "A2",
         "To wager money on an outcome.",
         "He bets on horse races occasionally.", "She bet ten dollars on the game.", "They have bet on the winning team.")

add_verb("bind", "bound", "bound", "binds", "vowel_change", "A2",
         "To tie or fasten tightly.",
         "The contract binds both parties legally.", "He bound the package with strong rope.", "They have bound the documents together.")

add_verb("bleed", "bled", "bled", "bleeds", "vowel_change", "A2",
         "To lose blood from body.",
         "A small cut bleeds slightly.", "His nose bled after he fell.", "The wound has bled through the bandage.")

add_verb("blow", "blew", "blown", "blows", "add_en_or_n", "A2",
         "To emit current of air or wind.",
         "A cold wind blows from the north.", "She blew out the candles on her cake.", "The strong gale has blown down trees.")

add_verb("breed", "bred", "bred", "breeds", "vowel_change", "A2",
         "To raise animals or reproduce.",
         "He breeds racehorses on his farm.", "They bred sheep for wool for generations.", "They have bred high-quality cattle.")

add_verb("burn", "burnt", "burnt", "burns", "same_past_participle", "A2",
         "To consume or destroy by fire.",
         "Fire burns wood rapidly.", "She burnt the toast this morning.", "The bonfire has burnt down completely.")

add_verb("burst", "burst", "burst", "bursts", "no_change", "A2",
         "To break open or split suddenly.",
         "The balloon bursts when poked.", "The pipe burst during the frost.", "The river has burst its banks.")

add_verb("cast", "cast", "cast", "casts", "no_change", "A2",
         "To throw or project light/shadow/vote.",
         "The statue casts a long shadow.", "He cast his vote in the election.", "She has cast a spell of enchantment.")

add_verb("cling", "clung", "clung", "clings", "vowel_change", "A2",
         "To hold on tightly or adhere.",
         "The wet shirt clings to his back.", "The child clung to her mother's coat.", "They have clung to old traditions.")

add_verb("deal", "dealt", "dealt", "deals", "same_past_participle", "A2",
         "To handle, distribute, or trade.",
         "He deals with customer complaints daily.", "She dealt the cards to the players.", "We have dealt with similar issues.")

add_verb("dig", "dug", "dug", "digs", "vowel_change", "A2",
         "To break up and turn earth.",
         "The dog digs holes in the garden.", "He dug a deep trench for the pipes.", "They have dug a new well.")

add_verb("dream", "dreamt", "dreamt", "dreams", "same_past_participle", "A2",
         "To experience thoughts while sleeping.",
         "She dreams of traveling the world.", "He dreamt about flying last night.", "I have dreamt of this moment.")

add_verb("feed", "fed", "fed", "feeds", "vowel_change", "A2",
         "To supply with food.",
         "She feeds her cat every morning.", "He fed the horses in the barn.", "They have fed the hungry visitors.")

add_verb("fight", "fought", "fought", "fights", "same_past_participle", "A2",
         "To engage in battle or struggle.",
         "The soldiers fight for freedom.", "They fought bravely against the odds.", "We have fought for our rights.")

add_verb("fit", "fit", "fit", "fits", "no_change", "A2",
         "To be of right size and shape.",
         "These shoes fit me perfectly.", "The key fit into the old lock.", "The piece has fit into the puzzle.")

add_verb("freeze", "froze", "frozen", "freezes", "add_en_or_n", "A2",
         "To turn into ice or harden with cold.",
         "Water freezes at zero degrees Celsius.", "The lake froze over last winter.", "The ice cream has frozen hard.")

add_verb("hang", "hung", "hung", "hangs", "vowel_change", "A2",
         "To suspend from above.",
         "She hangs her coat on the hook.", "He hung a painting on the living room wall.", "They have hung decorations outside.")

add_verb("kneel", "knelt", "knelt", "kneels", "same_past_participle", "A2",
         "To fall or rest on knees.",
         "He kneels to pray in church.", "She knelt down to tie her shoelace.", "They have knelt before the throne.")

add_verb("lay", "laid", "laid", "lays", "same_past_participle", "A2",
         "To place gently or lay down flat.",
         "The hen lays an egg every day.", "She laid the tablecloth on the table.", "He has laid out his clean clothes.")

add_verb("lead", "led", "led", "leads", "vowel_change", "A2",
         "To guide or conduct along a way.",
         "The tour guide leads the group.", "She led the team to a great victory.", "He has led the organization well.")

add_verb("leap", "leapt", "leapt", "leaps", "same_past_participle", "A2",
         "To spring or jump high in air.",
         "The frog leaps across the pond.", "He leapt over the fence easily.", "She has leapt at the opportunity.")

add_verb("lend", "lent", "lent", "lends", "same_past_participle", "A2",
         "To grant temporary use of something.",
         "She lends books to her classmates.", "He lent me twenty dollars yesterday.", "They have lent us their lawnmower.")

add_verb("lie", "lay", "lain", "lies", "totally_irregular", "A2",
         "To recline or rest in horizontal position.",
         "He lies on the sofa to rest.", "She lay in the sun for an hour.", "The cat has lain on the rug all day.")

add_verb("light", "lit", "lit", "lights", "vowel_change", "A2",
         "To ignite or illuminate.",
         "She lights a candle every evening.", "He lit the fireplace when it got cold.", "They have lit up the entire street.")

add_verb("mistake", "mistook", "mistaken", "mistakes", "add_en_or_n", "A2",
         "To misunderstand or identify wrongly.",
         "He mistakes kindness for weakness.", "She mistook him for her brother.", "I have mistaken the date of meeting.")

add_verb("overcome", "overcame", "overcome", "overcomes", "vowel_change", "A2",
         "To succeed in dealing with problem/fear.",
         "She overcomes obstacles with determination.", "He overcame his fear of heights.", "They have overcome great hardship.")

add_verb("quit", "quit", "quit", "quits", "no_change", "A2",
         "To stop doing something or resign.",
         "He quits smoking every New Year.", "She quit her job last month.", "They have quit the tournament.")

add_verb("rise", "rose", "risen", "rises", "add_en_or_n", "A2",
         "To move upward or increase.",
         "The sun rises in the east.", "Prices rose sharply last month.", "The river level has risen by two feet.")

add_verb("shake", "shook", "shaken", "shakes", "add_en_or_n", "A2",
         "To vibrate or move back and forth.",
         "He shakes hands when meeting people.", "She shook the bottle before drinking.", "An earthquake has shaken the city.")

add_verb("shine", "shone", "shone", "shines", "vowel_change", "A2",
         "To emit or reflect light.",
         "The sun shines brightly today.", "His flashlight shone through the dark.", "Her eyes have shone with joy.")

add_verb("shoot", "shot", "shot", "shoots", "vowel_change", "A2",
         "To fire a weapon or film a scene.",
         "He shoots arrows at the target.", "The photographer shot great pictures.", "They have shot a new documentary.")

add_verb("shut", "shut", "shut", "shuts", "no_change", "A2",
         "To close securely.",
         "She shuts the windows at night.", "He shut the door behind him.", "They have shut down the shop.")

add_verb("sink", "sank", "sunk", "sinks", "vowel_change", "A2",
         "To submerge or go beneath surface.",
         "A heavy stone sinks in water.", "The boat sank during the storm.", "The sun has sunk below the horizon.")

add_verb("slide", "slid", "slid", "slides", "vowel_change", "A2",
         "To glide smoothly along a surface.",
         "Children slide down the icy hill.", "The glass slid off the smooth table.", "He has slid into third base.")

add_verb("smell", "smelt", "smelt", "smells", "same_past_participle", "A2",
         "To perceive odor with nose.",
         "The fresh flower smells delightful.", "She smelt smoke coming from the kitchen.", "We have smelt something burning.")

add_verb("speed", "sped", "sped", "speeds", "vowel_change", "A2",
         "To move at high speed or hurry.",
         "The ambulance speeds through traffic.", "He sped past the radar checkpoint.", "The train has sped away.")

add_verb("spell", "spelt", "spelt", "spells", "same_past_participle", "A2",
         "To write or name letters in order.",
         "How do you spell your last name?", "She spelt her name clearly.", "He has spelt the difficult word correctly.")

add_verb("spill", "spilt", "spilt", "spills", "same_past_participle", "A2",
         "To cause liquid to flow accidentally.",
         "He spills coffee on his shirt often.", "She spilt milk on the kitchen floor.", "Someone has spilt water on papers.")

add_verb("spit", "spat", "spat", "spits", "vowel_change", "A2",
         "To eject saliva or liquid from mouth.",
         "The camel spits when annoyed.", "He spat out the bitter medicine.", "He has spat on the ground.")

add_verb("split", "split", "split", "splits", "no_change", "A2",
         "To divide into parts or share.",
         "He splits wood for the fireplace.", "They split the bill equally yesterday.", "We have split into two groups.")

add_verb("spread", "spread", "spread", "spreads", "no_change", "A2",
         "To expand over an area.",
         "She spreads butter on toast.", "News spread quickly through the town.", "The fire has spread to nearby trees.")

add_verb("spring", "sprang", "sprung", "springs", "vowel_change", "A2",
         "To leap, jump, or arise suddenly.",
         "Grass springs up after warm rain.", "He sprang up from his chair.", "A new idea has sprung to mind.")

add_verb("stick", "stuck", "stuck", "sticks", "vowel_change", "A2",
         "To adhere or attach firmly.",
         "Glue sticks paper together well.", "The key stuck in the old lock.", "We have stuck to our original plan.")

add_verb("sting", "stung", "stung", "stings", "vowel_change", "A2",
         "To wound with a sharp organ/stinger.",
         "A bee stings when threatened.", "A wasp stung him on his arm.", "The insect has stung her leg.")

add_verb("strike", "struck", "struck", "strikes", "vowel_change", "A2",
         "To hit sharply or deliver blow.",
         "Clock strikes twelve at midnight.", "Lightning struck the tall tower.", "Disaster has struck the small town.")

add_verb("swear", "swore", "sworn", "swears", "add_en_or_n", "A2",
         "To state solemnly or use profanity.",
         "He swears to tell the truth.", "She swore an oath in the courtroom.", "They have sworn to secrecy.")

add_verb("sweep", "swept", "swept", "sweeps", "same_past_participle", "A2",
         "To clean or clear with a broom.",
         "She sweeps the patio every morning.", "He swept the floor thoroughly.", "We have swept away the debris.")

add_verb("swing", "swung", "swung", "swings", "vowel_change", "A2",
         "To sway or move back and forth.",
         "The pendulum swings continuously.", "He swung the bat and hit the ball.", "The gate has swung wide open.")

add_verb("weep", "wept", "wept", "weeps", "same_past_participle", "A2",
         "To shed tears or cry deeply.",
         "She weeps when watching sad movies.", "He wept with relief upon hearing news.", "They have wept for their loss.")


# B1 VERBS (~48)
add_verb("arise", "arose", "arisen", "arises", "add_en_or_n", "B1",
         "To emerge or come into existence.",
         "New opportunities arise unexpected.", "A problem arose during the meeting.", "Complications have arisen unexpectedly.")

add_verb("bear", "bore", "borne", "bears", "add_en_or_n", "B1",
         "To carry, endure, or give birth to.",
         "She bears the responsibility bravely.", "He bore the pain without complaining.", "She has borne three children.")

add_verb("bid", "bid", "bid", "bids", "no_change", "B1",
         "To offer a price at auction.",
         "He bids generously at art auctions.", "She bid five hundred euros for painting.", "They have bid higher than competitors.")

add_verb("broadcast", "broadcast", "broadcast", "broadcasts", "no_change", "B1",
         "To transmit by radio or television.",
         "The station broadcasts sports live.", "They broadcast the speech nation-wide.", "The news has been broadcast globally.")

add_verb("creep", "crept", "crept", "creeps", "same_past_participle", "B1",
         "To move slowly and stealthily.",
         "A cat creeps towards a bird.", "He crept into the house late at night.", "Mist has crept over the valley.")

add_verb("dare", "dared", "dared", "dares", "same_past_participle", "B1",
         "To have courage or challenge someone.",
         "He dares to speak against injustice.", "She dared him to jump into lake.", "Nobody has dared to question him.")

add_verb("flee", "fled", "fled", "flees", "same_past_participle", "B1",
         "To run away from danger.",
         "Refugees flee from conflict zones.", "The suspect fled from police cars.", "Many inhabitants have fled the area.")

add_verb("forbid", "forbade", "forbidden", "forbids", "add_en_or_n", "B1",
         "To prohibit or order not to do.",
         "Law forbids driving without license.", "My doctor forbade me to drink coffee.", "Entry has been forbidden to public.")

add_verb("forgive", "forgave", "forgiven", "forgives", "add_en_or_n", "B1",
         "To pardon or stop feeling anger.",
         "She forgives minor mistakes easily.", "He forgave his friend after apology.", "We have forgiven their shortcomings.")

add_verb("forsake", "forsook", "forsaken", "forsakes", "add_en_or_n", "B1",
         "To abandon or renounce completely.",
         "He forsakes worldly ambitions.", "She forsook her career for family.", "They have forsaken their old habits.")

add_verb("grind", "ground", "ground", "grinds", "vowel_change", "B1",
         "To crush into small particles.",
         "The mill grinds wheat into flour.", "He ground coffee beans fresh morning.", "The pepper has been ground finely.")

add_verb("offset", "offset", "offset", "offsets", "no_change", "B1",
         "To balance or counteract effect.",
         "Gains offset losses in portfolio.", "Lower costs offset reduced revenues.", "Tax credits have offset the expense.")

add_verb("outdo", "outdid", "outdone", "outdoes", "totally_irregular", "B1",
         "To surpass or perform better than.",
         "She always outdoes expectations.", "He outdid himself in the final match.", "They have outdone all competitors.")

add_verb("outgrow", "outgrew", "outgrown", "outgrows", "add_en_or_n", "B1",
         "To grow too large for something.",
         "The child outgrows clothes quickly.", "He outgrew his fear of dark.", "She has outgrown her childhood toys.")

add_verb("outrun", "outran", "outrun", "outruns", "vowel_change", "B1",
         "To run faster or further than.",
         "The cheetah outruns its prey easily.", "He outran the defender to score.", "They have outrun the police car.")

add_verb("overeat", "overate", "overeaten", "overeats", "totally_irregular", "B1",
         "To eat excessively.",
         "He overeats when stressed out.", "She overate at the holiday buffet.", "We have overeaten at dinner party.")

add_verb("overhear", "overheard", "overheard", "overhears", "same_past_participle", "B1",
         "To hear unintentionally.",
         "She overhears conversations on bus.", "He overheard two colleagues arguing.", "I have overheard interesting news.")

add_verb("overlook", "overlooked", "overlooked", "overlooks", "same_past_participle", "B1",
         "To fail to notice or consider.",
         "He overlooks small spelling mistakes.", "She overlooked a crucial detail in text.", "We have overlooked these figures.")

add_verb("oversleep", "overslept", "overslept", "oversleeps", "same_past_participle", "B1",
         "To sleep past intended time.",
         "He oversleeps when alarm fails.", "She overslept and missed her train.", "I have overslept twice this week.")

add_verb("overtake", "overtook", "overtaken", "overtakes", "add_en_or_n", "B1",
         "To catch up with and pass.",
         "A fast car overtakes slow truck.", "She overtook her rival near finish line.", "Inflation has overtaken wage growth.")

add_verb("overthrow", "overthrew", "overthrown", "overthrows", "add_en_or_n", "B1",
         "To depose or remove from power.",
         "Rebels overthrow oppressive regime.", "The army overthrew government in coup.", "Dictators have been overthrown.")

add_verb("prove", "proved", "proven", "proves", "add_en_or_n", "B1",
         "To demonstrate truth by evidence.",
         "The experiment proves the hypothesis.", "The theory proved correct in lab.", "His loyalty has been proven.")

add_verb("saw", "sawed", "sawn", "saws", "add_en_or_n", "B1",
         "To cut wood with a saw tool.",
         "The carpenter saws wooden planks.", "He sawed log into firewood logs.", "The fallen tree has been sawn.")

add_verb("seek", "sought", "sought", "seeks", "same_past_participle", "B1",
         "To attempt to find or achieve.",
         "She seeks professional advice.", "He sought refuge from the rain storm.", "They have sought peace negotiations.")

add_verb("sew", "sewed", "sewn", "sews", "add_en_or_n", "B1",
         "To join or repair with needle/thread.",
         "She sews custom dresses at home.", "He sewed button back onto shirt.", "The quilt has been sewn by hand.")

add_verb("shave", "shaved", "shaven", "shaves", "add_en_or_n", "B1",
         "To cut hair off skin with razor.",
         "He shaves every morning before work.", "She shaved her legs for summer.", "He has shaved off his beard.")

add_verb("shear", "shore", "shorn", "shears", "add_en_or_n", "B1",
         "To cut wool from sheep.",
         "The farmer shears sheep in spring.", "They shorn flock in record time.", "All sheep have been shorn clean.")

add_verb("shrink", "shrank", "shrunk", "shrinks", "vowel_change", "B1",
         "To become or make smaller.",
         "Wool shrinks in hot water washes.", "The sweater shrank after washing.", "Market demand has shrunk lately.")

add_verb("sling", "slung", "slung", "slings", "vowel_change", "B1",
         "To throw or hurl forcefully.",
         "He slings backpack over shoulder.", "She slung stone across river bank.", "The hammock was slung between trees.")

add_verb("slink", "slunk", "slunk", "slinks", "vowel_change", "B1",
         "To move quietly or furtively.",
         "The fox slinks through shadows.", "He slunk away unnoticed from room.", "The intruder has slunk away into night.")

add_verb("slit", "slit", "slit", "slits", "no_change", "B1",
         "To make long narrow cut in.",
         "She slits open the envelope carefully.", "He slit the tape on package box.", "The curtain has been slit open.")

add_verb("sow", "sowed", "sown", "sows", "add_en_or_n", "B1",
         "To plant seed in ground.",
         "Farmers sow seeds in springtime.", "She sowed wildflower seeds in field.", "Generosity has sown good goodwill.")

add_verb("spoil", "spoilt", "spoilt", "spoils", "same_past_participle", "B1",
         "To ruin or diminish quality of.",
         "Rain spoils outdoor picnic plans.", "The bad news spoilt her weekend.", "The food has spoilt in heat.")

add_verb("stink", "stank", "stunk", "stinks", "vowel_change", "B1",
         "To emit strong foul odor.",
         "Garbage stinks in hot summer.", "The room stank of stale smoke.", "The sewer pipe has stunk all day.")

add_verb("stride", "strode", "stridden", "strides", "add_en_or_n", "B1",
         "To walk with long decisive steps.",
         "He strides confidently onto stage.", "She strode across room to speak.", "He has stridden into the room.")

add_verb("strive", "strove", "striven", "strives", "add_en_or_n", "B1",
         "To make great efforts to achieve.",
         "She strives for excellence always.", "He strove to overcome his limits.", "They have striven for equality.")

add_verb("swell", "swelled", "swollen", "swells", "add_en_or_n", "B1",
         "To expand or increase in size.",
         "An ankle swells after an injury.", "Her eye swelled after bee sting.", "His ankle has swollen noticeably.")

add_verb("tread", "trod", "trodden", "treads", "add_en_or_n", "B1",
         "To walk on or step upon.",
         "He treads carefully on slippery ice.", "She trod on a piece of glass.", "Many feet have trodden this path.")

add_verb("undergo", "underwent", "undergone", "undergoes", "totally_irregular", "B1",
         "To experience or endure process.",
         "The patient undergoes treatment.", "The building underwent major renovation.", "The company has undergone changes.")

add_verb("undo", "undid", "undone", "undoes", "totally_irregular", "B1",
         "To cancel or reverse action.",
         "She undoes her hair braid.", "He undid the knot with patience.", "Damage cannot be easily undone.")

add_verb("unwind", "unwound", "unwound", "unwinds", "vowel_change", "B1",
         "To relax or uncoil string.",
         "She unwinds by reading novels.", "He unwound long garden hose pipe.", "He has unwound after hard day.")

add_verb("withdraw", "withdrew", "withdrawn", "withdraws", "add_en_or_n", "B1",
         "To remove, take back, or retreat.",
         "He withdraws cash from ATM machine.", "Troops withdrew from border town.", "She has withdrawn her candidacy.")

add_verb("withhold", "withheld", "withheld", "withholds", "vowel_change", "B1",
         "To refuse to give or hold back.",
         "Company withhold tax from salary.", "He withheld vital information court.", "They have withheld payment details.")

add_verb("withstand", "withstood", "withstood", "withstands", "same_past_participle", "B1",
         "To resist or remain undamaged by.",
         "The bridge withstands heavy storms.", "Materials withstood extreme heat test.", "The fortress has withstood attacks.")


# B2 VERBS (~45)
add_verb("abide", "abode", "abode", "abides", "same_past_participle", "B2",
         "To accept, tolerate, or stay.",
         "She abides by rules of conduct.", "He abode in quiet cottage years.", "They have abode by agreement terms.")

add_verb("alight", "alit", "alit", "alights", "vowel_change", "B2",
         "To step down or land upon.",
         "A bird alights on tree branch.", "Passengers alit from train platform.", "The falcon has alit on roof.")

add_verb("befall", "befell", "befallen", "befalls", "add_en_or_n", "B2",
         "To happen to or occur to someone.",
         "Tragedy befalls unaware travelers.", "Misfortune befell the expedition team.", "Great luck has befallen them.")

add_verb("beseech", "besought", "besought", "beseeches", "same_past_participle", "B2",
         "To implore or beg urgently.",
         "He beseeches mercy from judge.", "She besought him to stay safe.", "They have besought aid from neighbors.")

add_verb("beset", "beset", "beset", "besets", "no_change", "B2",
         "To trouble or harass persistently.",
         "Doubts beset his restless mind.", "Problems beset project from start.", "Poverty has beset the village.")

add_verb("bestrew", "bestrewed", "bestrewn", "bestrews", "add_en_or_n", "B2",
         "To scatter over a surface.",
         "Wind bestrews autumn leaves ground.", "Petals bestrewed path before bride.", "Flowers have bestrewn the hall.")

add_verb("betide", "betid", "betid", "betides", "no_change", "B2",
         "To happen or occur to.",
         "Woe betides anyone who cheats.", "Whatever betid, they remained calm.", "Fate has betid them well.")

add_verb("blend", "blent", "blent", "blends", "same_past_participle", "B2",
         "To mix together smoothly.",
         "The artist blends colors harmoniously.", "He blent spices into curry powder.", "Flavors have blent together well.")

add_verb("browbeat", "browbeat", "browbeaten", "browbeats", "add_en_or_n", "B2",
         "To intimidate with stern words.",
         "He browbeats junior staff members.", "Lawyer browbeat witness into confession.", "Witnesses were browbeaten in court.")

add_verb("cleave", "clove", "cloven", "cleaves", "add_en_or_n", "B2",
         "To split or sever along grain.",
         "An axe cleaves wood logs easily.", "He clove stone block with chisel.", "Rock has been cloven in two.")

add_verb("dive", "dove", "dived", "dives", "vowel_change", "B2",
         "To plunge headfirst into water.",
         "She dives off high springboard.", "He dove into cold ocean waves.", "They have dived for sunken treasures.")

add_verb("dwell", "dwelt", "dwelt", "dwells", "same_past_participle", "B2",
         "To reside or live in a place.",
         "Monks dwell in remote monastery.", "She dwelt in mountain village years.", "They have dwelt in peace together.")

add_verb("foretell", "foretold", "foretold", "foretells", "same_past_participle", "B2",
         "To predict or prophesy future.",
         "Prophets foretell future events.", "Oracles foretold victory in battle.", "Signs have foretold economic shift.")

add_verb("gainsay", "gainsaid", "gainsaid", "gainsays", "same_past_participle", "B2",
         "To deny or contradict facts.",
         "No one gainsays facts presented.", "She gainsaid his claims in court.", "His integrity cannot be gainsaid.")

add_verb("hew", "hewed", "hewn", "hews", "add_en_or_n", "B2",
         "To chop or cut with axe.",
         "Lumberjacks hew timber in forest.", "He hewed statue from granite block.", "Columns were hewn from marble quarry.")

add_verb("inlay", "inlaid", "inlaid", "inlays", "same_past_participle", "B2",
         "To embed decorative material.",
         "Artisans inlay wood with ivory.", "Craftsman inlaid gold pattern table.", "Jewels have been inlaid in crown.")

add_verb("mislay", "mislaid", "mislaid", "mislays", "same_past_participle", "B2",
         "To lose temporarily or misplace.",
         "He mislays his glasses frequently.", "She mislaid important document folder.", "I have mislaid my house keys.")

add_verb("mislead", "misled", "misled", "misleads", "vowel_change", "B2",
         "To lead astray or deceive.",
         "False ads mislead consumers easily.", "The map misled hikers into woods.", "Public has been misled by claims.")

add_verb("misspell", "misspelt", "misspelt", "misspells", "same_past_participle", "B2",
         "To spell a word incorrectly.",
         "Students misspell difficult words.", "He misspelt surname on application.", "The word has been misspelt twice.")

add_verb("misspend", "misspent", "misspent", "misspends", "same_past_participle", "B2",
         "To spend wastefully or foolishly.",
         "He misspends money on gambling.", "She misspent youth on trivial pursuits.", "Funds have been misspent unwisely.")

add_verb("overdo", "overdid", "overdone", "overdoes", "totally_irregular", "B2",
         "To do to excess or exaggerate.",
         "He overdoes workout exercises.", "She overdid salt in soup dish.", "The meat has been overdone in oven.")

add_verb("overhang", "overhung", "overhung", "overhangs", "vowel_change", "B2",
         "To project or hang over.",
         "Cliff overhangs stormy sea below.", "Branches overhung narrow forest trail.", "Roof has overhung balcony deck.")

add_verb("override", "overrode", "overridden", "overrides", "add_en_or_n", "B2",
         "To set aside or overrule.",
         "Captain overrides automatic controls.", "Manager overrode previous decision.", "Veto has been overridden by board.")

add_verb("overrun", "overran", "overrun", "overruns", "vowel_change", "B2",
         "To swarm over or exceed limit.",
         "Weeds overrun neglected gardens.", "Enemy forces overran border post.", "Budget has overrun initial estimate.")

add_verb("overshadow", "overshadowed", "overshadowed", "overshadows", "same_past_participle", "B2",
         "To cast shadow over or eclipse.",
         "Tall tower overshadows small houses.", "Scandal overshadowed success story.", "His achievements were overshadowed.")

add_verb("overshoot", "overshot", "overshot", "overshoots", "vowel_change", "B2",
         "To shoot or pass beyond target.",
         "Plane overshoots runway landing.", "Pilot overshot runway in heavy fog.", "Target metrics have been overshot.")

add_verb("rebind", "rebound", "rebound", "rebinds", "vowel_change", "B2",
         "To bind again or bounce back.",
         "Prices rebound after drop.", "Stock market rebounded quickly today.", "Economy has rebound from slump.")

add_verb("rebuild", "rebuilt", "rebuilt", "rebuilds", "same_past_participle", "B2",
         "To construct again after damage.",
         "City rebuilds after earthquake disaster.", "They rebuilt bridge in six months.", "Community has rebuilt homes.")

add_verb("recast", "recast", "recast", "recasts", "no_change", "B2",
         "To cast again or reshape.",
         "Director recasts lead movie role.", "She recast proposal to fit budget.", "Script has been recast entirely.")

add_verb("redo", "redid", "redone", "redoes", "totally_irregular", "B2",
         "To do something again.",
         "He redoes task until perfect.", "She redid entire room interior decoration.", "We have redone electrical wiring.")

add_verb("remake", "remade", "remade", "remakes", "same_past_participle", "B2",
         "To make again or differently.",
         "Studio remakes classic film version.", "She remade dress for gala evening.", "Song has been remade in acoustic.")

add_verb("resell", "resold", "resold", "resells", "same_past_participle", "B2",
         "To sell again to another buyer.",
         "He resells vintage clothes online.", "She resold concert tickets at cost.", "Items have been resold at profit.")

add_verb("reset", "reset", "reset", "resets", "no_change", "B2",
         "To set again or restore default.",
         "System resets automatically overnight.", "He reset router to restore connection.", "Timer has been reset to zero.")

add_verb("rethink", "rethought", "rethought", "rethinks", "same_past_participle", "B2",
         "To reconsider or think again.",
         "Company rethinks marketing strategy.", "They rethought plans after review.", "We have rethought our approach.")

add_verb("rewind", "rewound", "rewound", "rewinds", "vowel_change", "B2",
         "To wind back to beginning.",
         "He rewinds video cassette tape.", "She rewound film to start scene.", "Tape has been rewound completely.")

add_verb("rewrite", "rewrote", "rewritten", "rewrites", "add_en_or_n", "B2",
         "To write again or revise text.",
         "Author rewrites draft story chapter.", "She rewrote essay to improve flow.", "Article has been rewritten cleanly.")

add_verb("slay", "slew", "slain", "slays", "add_en_or_n", "B2",
         "To kill in violent manner.",
         "Hero slays mythical dragon beast.", "David slew Goliath with sling.", "Monster has been slain by hero.")

add_verb("strew", "strewed", "strewn", "strews", "add_en_or_n", "B2",
         "To scatter or spread untidily.",
         "Wind strews autumn leaves lawn.", "Children strewed toys across room floor.", "Papers have been strewn everywhere.")

add_verb("string", "strung", "strung", "strings", "vowel_change", "B2",
         "To thread on cord or tune guitar.",
         "She strings beads into necklace.", "He strung guitar with new wire.", "Lights have been strung on trees.")

add_verb("sublet", "sublet", "sublet", "sublets", "no_change", "B2",
         "To lease property to tenant.",
         "Tenant sublets apartment summer.", "She sublet room while traveling abroad.", "Flat has been sublet for month.")

add_verb("thrust", "thrust", "thrust", "thrusts", "no_change", "B2",
         "To push or shove forcefully.",
         "He thrusts hands into pockets.", "She thrust letter into his hands.", "Sword was thrust through target.")

add_verb("undertake", "undertook", "undertaken", "undertakes", "add_en_or_n", "B2",
         "To commit oneself to task.",
         "Scientist undertakes complex study.", "Company undertook major expansion.", "We have undertaken new project.")

add_verb("upset", "upset", "upset", "upsets", "no_change", "B2",
         "To disturb, distress, or overturn.",
         "Bad news upsets her deeply.", "Cat upset glass of water table.", "Plans have been upset completely.")

add_verb("weave", "wove", "woven", "weaves", "add_en_or_n", "B2",
         "To form fabric by interlacing.",
         "Weaver weaves tapestry on loom.", "She wove colorful carpet pattern.", "Stories have been woven into myth.")

add_verb("wring", "wrung", "wrung", "wrings", "vowel_change", "B2",
         "To twist and squeeze liquid.",
         "She wrings wet towel out.", "He wrung clothes after washing them.", "Water was wrung out thoroughly.")


# B2+ VERBS (~12)
add_verb("cleave", "cleft", "cleft", "cleaves", "same_past_participle", "B2+",
         "To adhere firmly and loyally.",
         "He cleaves to his principles always.", "She cleft to faith through trial.", "They have cleft to ancient custom.")

add_verb("forecast", "forecast", "forecast", "forecasts", "no_change", "B2+",
         "To predict weather or trend.",
         "Meteorologist forecasts rain tomorrow.", "Analysts forecast economic growth.", "Traders have forecast market dip.")

add_verb("forswear", "forswore", "forsworn", "forswears", "add_en_or_n", "B2+",
         "To formally renounce or give up.",
         "He forswears alcohol for good.", "She forswore violence in protest.", "Monks have forsworn luxury items.")

add_verb("overbear", "overbore", "overborne", "overbears", "add_en_or_n", "B2+",
         "To overpower or dominate.",
         "His forceful personality overbears dissent.", "Evidence overbore defense arguments.", "Objections were overborne completely.")

add_verb("slink", "slunk", "slunk", "slinks", "vowel_change", "B2+",
         "To move guiltily or stealthily.",
         "Thief slinks through narrow alley.", "He slunk away from accusation scene.", "The shadow has slunk into alley.")

add_verb("smite", "smote", "smitten", "smites", "add_en_or_n", "B2+",
         "To strike down or afflict severely.",
         "Disaster smites the prideful king.", "Plague smote ancient empire city.", "He was smitten with sudden illness.")

add_verb("tread", "trod", "trodden", "treads", "add_en_or_n", "B2+",
         "To crush underfoot or walk on.",
         "Protesters tread on unjust laws.", "Marchers trod path through snow.", "Grass has been trodden down.")

add_verb("waylay", "waylaid", "waylaid", "waylays", "same_past_participle", "B2+",
         "To ambush or intercept someone.",
         "Bandits waylay travelers in forest.", "Reporters waylaid minister at exit.", "Delegates have been waylaid.")

add_verb("wring", "wrung", "wrung", "wrings", "vowel_change", "B2+",
         "To extract money or truth by force.",
         "Interrogator wrings confession from suspect.", "He wrung promise from reluctant partner.", "Truth was wrung from him.")

add_verb("recast", "recast", "recast", "recasts", "no_change", "B2+",
         "To reformulate arguments or roles.",
         "Philosopher recasts classic debate.", "Author recast narrative structure.", "Premise has been recast entirely.")

# Write to json file
output_path = os.path.join(os.path.dirname(__file__), "..", "en-irregular-verbs", "data", "verbs.json")
output_path = os.path.abspath(output_path)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(verbs, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(verbs)} verbs in {output_path}")

# Stats summary
level_counts = {}
pattern_counts = {}
for v in verbs.values():
    l = v["level"]
    p = v["pattern_group"]
    level_counts[l] = level_counts.get(l, 0) + 1
    pattern_counts[p] = pattern_counts.get(p, 0) + 1

print("\nLevel Distribution:")
for l, c in sorted(level_counts.items()):
    print(f"  {l}: {c}")

print("\nPattern Group Distribution:")
for p, c in sorted(pattern_counts.items()):
    print(f"  {p}: {c}")
