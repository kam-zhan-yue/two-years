VAR food_1 = ""
VAR food_2 = ""
VAR fuckups = 0
VAR correct = 0

-> START

===DEBUG==
QUESTION__START #Alex
Alex: Pick an entry point
+ Introduction
    NODE__END
    -> START
+ Picnic
    NODE__END
    -> A1_D2
+ Trivia
    NODE__END
    -> A2_D1
+ Gift Giving
    NODE__END
    -> A3_D1

===START===
-> A1_D1

// INTRODUCTION
===A1_D1===
NODE__START
Alex: Wow what a hilarious conversation we just had! I'm just so naturally funny and amazing.
Alex: This totally isn't a lazy way to kickstart into a dialogue because I didn't have time to think of a good introduction.
Wato: What?
Alex: Isn't Kamogawa lovely at this time of the year?
Wato: It's absolutely beautiful. It almost makes me want to live in Japan if it weren't for everything else.
Alex: Always feels like our little backyard, even though there's always people around.
Alex: Anyway's let's start our picnic.
Wato:  Did you bring the food?
NODE__END
-> A1_Q1

===A1_Q1===
QUESTION__START #Wato
Alex: No... I thought you had it.
+ WHAT! Are you kidding me?
    Alex: GOTCHA! The picnic basket and everything was already setup! You must seem like an absolute fool.
    Wato: Screw you.
    Alex: Much obliged.
    -> A1_Q1_RESUME
+ Ah, it's okay, don't worry about it
    Alex: Such a lukewarm response.
    Alex: Anyways, I've already prepared it, it's just right there.
    Wato: That's soooo sweeeeet (I already saw it though)
    -> A1_Q1_RESUME
+ I'll eat you.
    Alex: Please do.
    Alex: Hahaha, anyways I've already prepared it, it's just right there.
    Wato: That's soooo sweeeeet (I already saw it though)
    -> A1_Q1_RESUME

===A1_Q1_RESUME===
Alex: Shall we start then?
Wato: I'm faminishing. I've only had a sandwich today.
Alex: I expected that. You always never feed yourself well :(
Alex: But look no further! Today is going to be the most perfect date! I've prepared every single detail.
Alex: Every situation, every choice, every food item has been carefully curated for today.
Wato: Even if anything goes wrong, don't blame yourself yeah.
Alex: Nonsense! How could anything go wrong? (sneaky foreshadowing)
Wato: Uh oh.
Alex: Anyways, do me a favour and pull some food out of the picnic basket, amor. I've got a bunch of options, so choose two things that you wanna eat.
NODE__END

-> A1_D2

===A1_D2===
INTERACTION__PICNIC_BASKET

NODE__START
Wato: Uhh, let's see what's in here...
All: Wato opens the basket to reveal her truest nightmare
All: Mint chocolate ice cream.
Wato: Oh my fucking god
Alex: What's going on back there? Everything alright?
Wato: Everything's fine!
All: Wato turns back to the picnic basket, and sees an assortment of food and teas.
Wato: What, I could've sworn I saw...
All: Nope, the basket was full of perfectly normal food.
All: That isn't to imply that mint chocolate ice cream isn't a perfectly normal food. In fact, it's the most normal-est of foods.
All: "But it tastes like toothpaste!"... I hear you say in your head, YEAH WELL MAYBE SOME OF US LIKE THE TASTE OF TOOTPASTE AND WE'RE NOT ASHAME-
Wato: Ok enough of that.
All: Wato silences the voice in the sky.
Wato: OK, decisions, decisions. What should I bring out first?
NODE__END

->A1_Q2

===A1_Q2===
QUESTION__START #Wato
Wato: Let's start with something light. There's not much to choose from
+ [Salad]
    ~food_1 = "salad"
    Wato: Funny, I haven't been craving Misdo recently
    Wato: Also, best to be healthy. We've been snacking too much...
    All: Wato shudders at the memory of over-snacking late at night, only to suffer the consequences in the following morning.
    -> A1_Q2_RESUME
+ [Baumkuchen]
    ~food_1 = "baumkuchen"
    Wato: Oooo, I've missed these. Such a comfort food.
    -> A1_Q2_RESUME
+ [Pon de Ring]
    ~food_1 = "pon de ring"
    Wato: Smells like a blast from the past.
    Wato: Wait, the past? It's only been two years since we starting eating these though?
    Wato: Oh my god it's been two years.
    All: Wato reminisces on the fleetingly beautiful, yet cruel nature of the passage of time, doughnut in hand.
    -> A1_Q2_RESUME

===A1_Q2_RESUME===
Wato: Ok let's move on. I'm starving and that isn't enough.
NODE__END

-> A1_Q3


===A1_Q3===
QUESTION__START #Wato
Wato: Now for the main course.
+ [Oyakodon]
    ~food_2 = "oyakodon"
    Wato: Aw, how sweet. I always love eating this.
    Wato: ...
    Wato: (It's all cold now though)
    Wato: I'm sure it'll work out fine!
    -> A1_Q3_RESUME
+ [Spaghetti Bolognese]
    ~food_2 = "pasta"
    Wato: I'VE BEEN CRAVING THIS ALL DAY.
    Wato: Into my stomach you will go.
    -> A1_Q3_RESUME
+ [Pon de Ring]
    ~food_2 = "pon de ring"
    { food_1 == "pon de ring":
        Wato: ... a second one can't hurt right...?
        Wato: I mean, if you think about it, the human body just needs energy
        Wato: And carbs are just energy. We don't need anything else!
        Wato: .................
        Wato: i'm hungry don't blame me.
    - else:
        Wato: Can't help but have another sweet treat!
        Wato: Having two light food items feels a bit weird, but let's go with it!
    }
    -> A1_Q3_RESUME
    

===A1_Q3_RESUME===
Wato: Ok that seems good enough on the food side.
Wato: Ah! Can't forget the mate! It isn't a picnic without one.
NODE__END

-> A1_D3

===A1_D3===
INTERACTION__PICNIC_CONTINUE

NODE__START
Alex: Show me what you got!
All: Wato dumps the food on the mat.
{
    - food_1 == "salad":
        ~fuckups += 1
        Alex: I see we're going healthy today
        Wato: I mean, we have been eating wayyyy too many snacks late at night.
        Alex: And our stomachs really hurt the next morning
        Wato: Right
        Alex: So worth it
        Wato: ... I don't think so
        Alex: Nope, you're wrong, it's totally worth it.
        Alex: Anyways, I'm digging the salad.
        Alex: Wait, did I forget the olive oil?
        Wato: Ah. It doesn't seem like anything's on it
        Alex: NOOOOOOOOOOO... how could i mess up the salad D:
        Wato: It's okay!! We'll just eat it as it is
        Alex: I'm sorry...
        Wato: Don't be sorry, it's just salad
    - food_1 == "baumkuchen":
        Alex: Oh nice, I got that from Muji
        Wato: It's always from there hahaha
        Alex: They make the best bamkuchen, it's not even close.
        Alex: I don't get how it's wrapped in plastic AND it's still so moist.
        Wato: So true.
        Alex: Truly an enigma.
    - else:
        Alex: I haven't had these in ages! To be honest, I brought a couple but I thought you might not want to eat them.
        Wato: It's been a while and I thought we might as well have them again.
        Alex: Good call.
}

Alex: Ok, let's see what's next.

All: Wato brings out the second choice.

{
    - food_1 == "oyakodon":
        ~ fuckups += 1
        Alex: Oh no. Is this cold?
        Wato: It's really okay, don't worry about it!
        Alex: I took so long to make it too...
        Alex: This is going terribly...
        Wato: Don't worry at all, amor, I'm going to love eating it anyways.
        Alex: If it's okay with you...
        Wato: It's definitely okay with me.
    - food_1 == "pasta":
        Alex: Muahaha, a classic dish. You always love pasta.
        Wato: I know... It's my comfort food.
        Alex: I ran out of time, so I had to use the packet sauces, it won't be amazing...
        Wato: That's okay! I like those too
    - else:
        { food_1 == "pon de ring":
            Alex: Ah there's two of them now. I see.
            Wato: Hehe
            Alex: Is this all we're gonna eat?
            Wato: Yes.
            Alex: Very well then, doughtnut time!
        - else:
            Alex: I haven't had one of these in ages!
            Wato: I thought we should have them again, seeing as it's been a while.
            Alex: Sounds lovely
        }
}

Alex: Let's not wait anymore! EAT TIME

NODE__END

-> A2_D1

===A2_D1===
NODE__START

Alex: So good
Wato: Really good
Alex: This reminds me of the time you cooked me a huge meal for my birthday.
Wato: Ah that was a disaster...
Alex: It was amazing!!! And the cake was handmade and beatiful.
Wato: It really wasn't...
Alex: I loved every single bite. I didn't make a cake for you this time around though...
Wato: Don't worry amor.
Alex: I'll do it for you next time on your birthday on the 1st of August.
Wato: What did you say?
Alex: I'll make you a cake next time.
Wato: Not that, what did you say my birthday was?
Alex: The 3rd of August.
Wato: That's not what you said.
Alex: I definitely said the 2nd of July.
Wato: Fuck you.
Alex: Hahaha, I totally remember it, don't worry.
Wato: I at least remember your birthday...
Alex: Oh yeah? If you know so much about us, let's play a quiz.
Wato: What, no I didn't agree to this.
Alex: Too bad, the dialogue tree is linear at this point and there's no stopping it.
Wato: What?
All: QUIZ TIME!!!

NODE__END

-> A2_Q1

===A2_Q1===
QUESTION__START #Wato
Alex: Let's start easy... What's the name of the beach we visited twice when in Melbourne together?
+ Brighton Beach
    Alex: BZZT, INCORRECT!
    Alex: We've never been to this beach together. Brighton has the colourful beach boxes.
    Alex: I can't believe you forgot the easiest question...
    Wato: I  have no excuse for that.
    -> A2_Q1_RESUME
+ Frankston Beach
    Alex: BZZT, INCORRECT!
    Alex: We've been here once, but with Daniel, Eden, and Ben and only once.
    Wato: Ahh, it was a misclick, I swear!
    Alex: Sureeee.
    -> A2_Q1_RESUME
+ St. Kilda Beach
    ~correct += 1
    Alex: Correct! That was a freebie. I know you love that beach.
    Wato: I do, actually
    -> A2_Q1_RESUME

===A2_Q1_RESUME===
Alex: OK NEXT QUESTION!
NODE__END
-> A2_Q2

===A2_Q2===
QUESTION__START #Wato
Alex: What was my first birthday gift to you?
+ Earrings
    ~correct += 1
    Alex: Correct! They're not being used anymore though...
    Wato: I still love them! They're just a bit hard to wear...
    Alex: Yeah, that's my fault honestly.
    -> A2_Q2_RESUME
+ A Shark Plushie
    Alex: BZZT, INCORRECT! That was your first birthday gift to me! You dummy.
    Wato: That was definitely a misclick.
    Alex: Suuureeee
    -> A2_Q2_RESUME
+ A Bracelet
    Alex: BZZT, INCORRECT! I've never given you a bracelet before.
    Wato: Damn, why did I select that?
    Alex: I have no idea.
    -> A2_Q2_RESUME
    
===A2_Q2_RESUME===
Alex: Let's move onto the next question! It's gonna get harder from now on...
NODE__END
-> A2_Q3

===A2_Q3===
QUESTION__START #Wato
Alex: This is a bit hard now. What date did we first meet in that astronomy class?
+ 10th April 2023
    Alex: Hahahaha STOOOPIIIIIIDDDD! That's incorrect! How could you not know that 😂
    -> A2_Q3_RESUME
+ 13th April 2023
    ~correct += 1
    Alex: Correct! I'm... surprised you got that.
    Wato: How dare you doubt me.
    Alex: That's my fault.
    -> A2_Q3_RESUME
+ 15th April 2023
    Alex: Hahahaha STOOOPIIIIIIDDDD! That's incorrect! How could you not know that 😂
    -> A2_Q3_RESUME

===A2_Q3_RESUME===
Alex: Ok well, that's on me for making it too hard. My bad.
Wato: That qusetion was hard, no matter how you look at it.
Alex: Ok, next question!
NODE__END

-> A2_Q4

===A2_Q4===
QUESTION__START #Wato
Alex: Where was the location of our fourth date / time we spent together?
+ Kamogawa
    ~correct += 1
    Alex: Correct! That was where we had the 肉まん you brought back from 大阪. Technically isn't a date, but it is a significant moment we spent together.
    Wato: I remember that! The 肉まん were so stale because I left them in my room for so long...
    Alex: Yeah...
    Alex: I still enjoyed them though!
    Wato: 🥰
    -> A2_Q4_RESUME
+ Mizuki Dorm
    Alex: BZZT, INCORRECT! We spent a lot of time in みずき寮 but the time we spent (failing) to bake a cafe was in our later dates.
    Wato: That's not fair! How am I expected to remember that?
    Alex: You're meant to be the expert here, I just made the game.
    -> A2_Q4_RESUME
+ Gion Matsuri
    Alex: BZZT, INCORRECT! This happened in July! Much later in the timeline.
    Wato: Argh! I should have known that.
    -> A2_Q4_RESUME

===A2_Q4_RESUME===
Alex: Ok, bonus round! Answer this for a chance at another point!
NODE__END

-> A2_Q5

===A2_Q5===
QUESTION__START #Wato
Alex: What is my second favourite ice cream flavour?
+ Mint Chocolate Chip
    Alex: BZZT, INCORRECT! No second place for the GOAT
    Wato: I should've seen that coming...
    Alex: Yeah, you should have.
    -> A2_Q5_RESUME
+ Matcha
    Alex: BZZT, INCORRECT! I love matcha ice cream sometimes, but it's not one of the all-time greats.
    Wato: Even though you went to Uji so much...
    -> A2_Q5_RESUME
+ Rum & Raisin
    ~correct += 1
    Alex: Correct! I was technically intoxicated during a school trip.
    Wato: Nerd.
    Alex: That's me.
    -> A2_Q5_RESUME


===A2_Q5_RESUME===
Alex: This is the final question. It's gonna be the hardest one so far. Make sure to use all of your brain power.
Wato: I was born ready for this.
NODE__END
-> A2_Q6

===A2_Q6===
QUESTION__START #Wato
Alex: How many full size cakes have we eaten together so far?
+ 4
    Alex: BZZT, Incorrect!
    -> A2_Q6_RESUME
+ 5
    ~correct += 1
    Alex: Correct!
    -> A2_Q6_RESUME
+ 6
    Alex: BZZT, Incorrect!
    -> A2_Q6_RESUME

===A2_Q6_RESUME===
Alex: We had our first one on your birthday in 2023.
Alex: Our second one that you made for me in 2023.
Alex: Our third one on Christmas of 2023.
Alex: Our fourth one before I left Gojo in 2024.
Alex: Our fifth one when I came back in July 2024, but I honestly can't remember why.
Wato: That was really hard. Did we really eat that many cakes?
Alex: Actually, I'm surprised we haven't eaten any in 2025.
Wato: For now.
Alex: Nice.
Alex: Anways, that concludes the trivia! You scored...
Alex: {correct} out of 6!
{ correct:
    - 0:
        Alex: I can't belive you got 0 points... I literally have no words.
    - 1: 
        Alex: A pitiful score. I expected more from you.
    - 2:
        Alex: Really? After all that talk about the birthdays.
    - 3:
        Alex: Eh, a passing mark, not amazing, not bad.
    - 4:
        Alex: Not a bad score at all, there were some curveballs in there, I'll admit.
    - 5:
        Alex: I actually can't believe you got that many right. I spent hours checking some of these.
    - 6:
        Alex: A PERFECT SCORE!!! My baby is a genius!!!
}
Wato: Alright enough of that, let's finish our food.
All: The couple scarf down their meal like their live depended on it.
Alex: Could you help return these to the basket?
NODE__END

-> A3_D1


===A3_D1===
INTERACTION__BASKET_RETURN

NODE__START
Alex: Thanks for that, it was getting messy.
Alex: Anyways... I have some thing to show you.

NODE__END

NODE__START
Alex: Close your eyes... 
Wato: Ok...
NODE__END
-> A3_Q1

===A3_Q1===
QUESTION__START #Alex
Alex: (where did I put that gift?)
+ [A Giant Water Bottle]
    Alex: Here's your gift! #action:WATER_BOTTLE
    Wato: WHY IS IT SO BIG.
    Wato: Why did you get me another one?
    Alex: Because you need to stay hydrated.
    Wato: THAT WON'T FIT IN MY BAG!
    Alex: hahahaha, i know right
    Wato: hahahahaha
    Wato: I love it, thank you
    Alex: I'm happy you enjoy it
    -> A3_Q1_RESUME
+ [A Shark Plushie]
    Alex: Here's your gift! #action:SHARK
    Wato: Sharkie?!
    Alex: Actually, it's his sister.
    Wato: Aw, that's adorable.
    Alex: Now we can have two sharkies when we sleep together, instead of fighting for just one.
    Wato: I really need that.
    Wato: Thank you baby, I love it.
    -> A3_Q1_RESUME

===A3_Q1_RESUME===
Wato: I love everything you get me, really
Alex: That means the world to me.
Wato: I actually have something for you too!
Alex: Yayyyy!
NODE__END

->A3_Q2


===A3_Q2===
QUESTION__START #Wato
Wato: Ok, my turn. I've been keeping this in my pocket all day.
+ [Mint Chocolate Ice Cream Cone]
    Wato: Tada! #action:ICE_CREAM
    Alex: I LOVE IT
    Wato: I knew you would. I'm surprised it's not melted by now.
    Alex: Temperature doesn't exist in this world.
    Wato: What?
    Alex: What?
    Wato: Anyways, let's eat it together.
    Alex: Wait, really?!
    Wato: Absolutely not, I'm not an animal.
    Alex: I fell straight for that.
    -> A3_Q2_RESUME
+ [Handmade Bracelet]
    Wato: Tada! #action:BRACELET
    Alex: OMG
    Wato: I know you lost the other one (maybe), so I made another.
    Alex: I'm so sorry for misplacing the other one even though I promised not to lose it...
    Alex: But this is all I could ever ask for. This is the absolute best gift.
    Alex: Thank you so much baby.
    Wato: There's two cats on the bracelet this time.
    Alex: MY BABIESSS!
    Alex: I love you.
    Wato: I love you too.
    -> A3_Q2_RESUME

===A3_Q2_RESUME===
Alex: Thank you for the gift, I also love you no matter what you get me.
Wato: Thank you amor.
NODE__END

NODE__START
Alex: Now it's time for the final surprise.
Wato: What do you mean?

Alex: TADAAAA! #action:FLOWERS
Wato: AHHH THEY'RE BEAUTIFUL!!!
Alex: Happy Two Year Anniversary!
Wato: Thank you so much amor, I love these
Alex: These past two years have been absolutely incredible and I can't imagine my life without you.
Alex: I know I said I planned every part of this date, but honestly I've just prepared a few things and let everything flow together.
Alex: I know that even if this date went poorly, or if whatever I gave you was mediocre, you would still have loved it as much as if it were perfect.
Alex: And that's what I love the most about you. I love that we can do whatever and say whatever, but at the end of the day, it has meaning because we're doing it together.
Alex: I love you with all of my heart and I can't wait to spend even more years with you.
Alex: Te amo, mi amor
Wato: Te amo. I love you so much.
All: It's awkward to pretend to write for someone else, so here is a slot for Wato to say whatever when she actually plays the game.
Alex: That was lovely baby, everything you said means the world to me.
Wato: Let's just enjoy the rest of the day together yeah.
Alex: That sounds amazing.
-> DONE