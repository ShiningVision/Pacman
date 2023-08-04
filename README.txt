
Claims: Graphical Aspects, Shear View, Continuous movement, camera centers pacman, Jump, walls solid, dots to eat, 2 enemies, counting points
The controls are as described in the Task.

Notes: Pacman looks odd when he faces anywhere except east. That is probably because I messed up the center of gravity in Blender.
	 His mouth moves just fine though. And it is not much of a inconvenience. I call it a FEATURE and not a bug.

Tested OS: Windows 11

Tested Browser: Firefox latest version as of December 2022.

!!!!IMPORTANT!!!!
In order to use the obj-files, I had to install node.js on my windows10 Computer and then run the command "http-server -p 8000 --cors" in a shell 
while in the right directory to create a local server from which my code fetches the obj's. 

I used the parseOBJ from https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html, same as in previous assignments
I used d3js to display and change point counter in the bottom left corner.

The webgl code is in ShaderProgram.js


