NODE__START
Alex: There is no where to be but the present.
Wato: Indeed you are correct.
NODE__END

NODE__START
Alex: I'm quenching for a coffee right now.
Wato: As am I.
NODE__END

QUESTION__START #Alex
Wato: Shall we go down to the cafe at the end of the road?
+ Why that is a mighty fine idea.
    -> CAFE
+ How dreadful.
    -> NOT_CAFE

===CAFE===
Alex: Why this is a fine evening
NODE__END

INTERACTION__FOLLOW_UP
-> END

===NOT_CAFE===
Alex: Let's go to the beach instead.
Wato: Very well
NODE__END


INTERACTION__FOLLOW_UP


-> END