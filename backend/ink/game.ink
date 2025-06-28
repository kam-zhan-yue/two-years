INTERACTION__GAME_START

-> A1

// INTRODUCTION
===A1===
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
    -> A1_Q1_RESUME
+ Ah, it's okay, don't worry about it
    -> A1_Q1_RESUME
+ I'll eat you.
    -> A1_Q1_EAT_RESPONSE
 

===A1_Q1_EAT_RESPONSE===
Alex: Please do.
-> A1_Q1_RESUME

===A1_Q1_RESUME===
Alex: Hahaha, anyways I've already prepared it, look behind you.
NODE__END



-> DONE