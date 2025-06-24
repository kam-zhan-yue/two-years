NODE__START
P1: There is no where to be but the present.
P2: Indeed you are correct.
NODE__END

NODE__START
P1: I'm quenching for a coffee right now.
P2: As am I.
NODE__END

QUESTION__START #P1
P2: Shall we go down to the cafe at the end of the road?
+ Why that is a mighty fine idea.
    -> CAFE
+ How dreadful.

===CAFE===
P1: Why this is a fine evening
NODE__END
-> END

===NOT_CAFE===
P1: Let's go to the beach instead.
P2: Very well
NODE__END
-> END