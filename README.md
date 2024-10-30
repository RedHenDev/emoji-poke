# emoji-poke
A 2D world with Pokemon-style aesthetics and emojis
![Screenshot 2024-10-26 at 21 01 16](https://github.com/user-attachments/assets/cb752698-3377-4f67-bef8-a3cc15aeb316)

To Do:-

bug - image of area 0,0 no ready at start; objs themselves ready, however (e.g. player collides with solid objects)

add solidity property to relevant features of procedural areas.

bug - editor no longer drawing rect for solid objs, nor behaving correctly with new emoji selected.

add default solidity and order for specific emojis. Needs to be for editor as well as procedural area generator.

bug - game no longer recognising new areas from file? Recognises 0,0, but seemingly nothing else (not even ghosting in solid objects -- as happens still with 0,0 routinely). NB editor does not have the problem with area 1,0.

logical bug - prevent situation of player spawning in new area trapped in midst of solid objects.