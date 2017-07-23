# smart_rockets
Modifying Daniel Shiffman's Smart Rockets

Daniel Shiffman is an awesome youtuber who has a channel called "The Coding Train"  ( https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw ) where he provides wonderful javascript tutorials using the p5 library ( https://p5.js ).

From Daniel I have learned a lot about the p5 library and basic Javascript programming, but in my day job I work with another fantastic developer, Scott Burch ( https://github.com/scottburch ), who has shown me how to apply functional programming to Javascript. 

What I want to do here is take what Daniel has done and see if I can apply what Scott has taught me. I would like to take Daniel's code, which is easy for a new developer to understand and turn it into code that is "production" ready, that is still easy to understand, but may use bits of Javascript that new users are unfamiliar with. I want to use a functional style to reduce the size of the code and speed things up a little and make things a bit more readable.


Smart Rockets

My first project will start with Coding Challenge #29: Smart Rockets in p5.js ( https://www.youtube.com/watch?v=bGz7mv2vD6g ). Use Brackets ( http://brackets.io ) to open the SmartRockets folder and run the app. If you'd like to follow along, I suggest, after cloning the repo, using Brackets to open the folder, then open source/index.html and use the start node button to get things going.

You'll see a population of rockets (long lines) start at the bottom of the screen and make thier way to the top target. Rockets that hit the side or the obstacle die and are assigned an appropriate fitness, rockets that get closer to the target without colliding get better fitness values. Each population gets 400 updates to solve the problem. Please watch Daniel's video for a better explanation.


GOALS:
- profile the code to make sure that the changes I make are helping.
- produce reports on how the application is solving the problem.
- add unit tests
- reduce the size of the code base
- remove global variables
- increase the efficiency of the code (reduce the time that it takes to do it's job.)

Sunday July 23: see master fd564c8
Let's start our profiling by displaying the time for the p5 draw function to do it's job, or more specifically the time for the rocket related code inside the draw function. My dev computer is a mid 2012 15-inch MacBook Pro, with 2.7 GHz Intel Cor i7 and 16 GB 1333 MHz DDR3 memory. So you will probably get better results than I do. The simulation has 25 rockets, so each draw call moves 25 rockets one step. Here are the stats with code based on what I learned from Daniel:

- population,Average Draw Time(ms), min Draw Time(ms), max Draw Time(ms)
-  10, 0.92, 0.58, 6.31
-  20, 0.88, 0.58, 6.31
-  30, 0.85, 0.58, 6.31
-  40, 0.87, 0.58, 6.31
-  50, 0.88, 0.58, 6.31

So our baseline draw time to beat is 0.88ms.
