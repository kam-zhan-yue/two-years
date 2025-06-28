INTERACTION__GAME_START

VAR food_1 = ""
VAR food_2 = ""
VAR fuckups = 0

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
Wato: Did you bring the food?
NODE__END
-> A1_Q1

===A1_Q1===
QUESTION__START #Wato
Alex: No... I thought you had it.
+ WHAT! Are you kidding me?
    Alex: GOTCHA! The picnic basket and everything was already setup! You must seem like an absolute fool.
    Wato: Screw you.
    Alex: Much obligued.
    -> A1_Q1_RESUME
+ Ah, it's okay, don't worry about it
    Alex: Such a lukewarm response.
    Alex: Anyways, I've already prepared it, it's just behind us.
    Wato: That's soooo sweeeeet (I already saw it though)
    -> A1_Q1_RESUME
+ I'll eat you.
    Alex: Please do.
    Alex: Hahaha, anyways I've already prepared it, look behind you.
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
+ サラダ
    ~food_1 = "salad"
    Wato: Funny, I haven't been craving Misdo recently
    Wato: Also, best to be healthy. We've been snacking too much...
    All: Wato shudders at the memory of over-snacking late at night, only to suffer the consequences in the following morning.
    -> A1_Q2_RESUME
+ バムクーヘン
    ~food_1 = "baumkuchen"
    Wato: Oooo, I've missed these. Such a comfort food.
    -> A1_Q2_RESUME
+ ポン・デ・リング
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
+ 手作り親子丼
    ~food_2 = "oyakodon"
    Wato: Aw, how sweet. I always love eating this.
    Wato: ...
    Wato: (It's all cold now though)
    Wato: I'm sure it'll work out fine!
    -> A1_Q3_RESUME
+ ミートソースパスタ
    ~food_2 = "pasta"
    Wato: I'VE BEEN CRAVING THIS ALL DAY.
    Wato: Into my stomach you will go.
    -> A1_Q3_RESUME
    
+ ポン・デ・リング
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
All: Wato returns to the riverside.
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

ALL: Wato brings out the second choice.

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
What: What?
All: QUIZ TIME!!!

NODE__END

-> A2_Q1

===A2_Q1===


-> DONE