# SmartRockets
Modifying Daniel Shiffman's Smart Rockets

Daniel Shiffman is an awesome youtuber who has a channel called "The Coding Train"  ( https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw ) where he provides wonderful javascript tutorials using the p5 library ( https://p5.js ).

From Daniel I have learned a lot about the p5 library and basic Javascript programming, but in my day job I work with another fantastic developer, Scott Burch ( https://github.com/scottburch ), who has shown me how to apply functional programming to Javascript. 

What I want to do here is take what Daniel has done and see if I can apply what Scott has taught me. I'll take Daniel's code, which is easy for a new developer to understand and turn it into code that is a more functional style, and is still easy to understand, but may use bits of Javascript that new users are unfamiliar with. 

I want to use a functional style to reduce the size of the code, speed things up a little and make things a bit more readable.


Smart Rockets

My first project will start with Coding Challenge #29: Smart Rockets in p5.js ( https://www.youtube.com/watch?v=bGz7mv2vD6g ). Use Brackets ( http://brackets.io ) to open the SmartRockets folder and run the app. If you'd like to follow along, I suggest, after cloning the repo, using Brackets to open the folder, then open source/index.html and use the start node button to get things going.

You'll see a population of rockets (long lines) start at the bottom of the screen and make thier way to the top target. Rockets that hit the side or the obstacle die and are assigned an appropriate fitness, rockets that get closer to the target without colliding get better fitness values. Each population gets 400 updates to solve the problem. Please watch Daniel's video for a better explanation.


GOALS:
- profile the code to make sure that the changes I make are helping.
- produce reports on how the application is solving the problem.
- reduce the size of the code base
- remove global variables
- increase the efficiency of the code (reduce the time that it takes to do it's job.)

STRETCH GOALS:
- add unit tests
- change the behaviour of the rockets to be more realistic. 
    - use the rocket equation to take into account gravity, and fuel use.
    - apply realistic forces to change the direction of the rocket smoothly.

Sunday July 23: see master fd564c8
Let's start our profiling by displaying the time for the p5 draw function to do it's job, or more specifically the time for the rocket related code inside the draw function. My dev computer is a mid 2012 15-inch MacBook Pro, with 2.7 GHz Intel Cor i7 and 16 GB 1333 MHz DDR3 memory. So you will probably get better results than I do. The simulation has 25 rockets, so each draw call moves 25 rockets one step. Here are the stats with code based on what I learned from Daniel:

- population,Average Draw Time(ms), min Draw Time(ms), max Draw Time(ms)
-  10, 0.92, 0.58, 6.31
-  20, 0.88, 0.58, 6.31
-  30, 0.85, 0.58, 6.31
-  40, 0.87, 0.58, 6.31
-  50, 0.88, 0.58, 6.31

So our baseline draw time to beat is 0.88ms.

The other basline we need is the number of lines of code in the application, I'll use the wc utility on the commandline like this:

    wc -l source/*.js
    
which returns:

     242 source/sketch.js


[master 70d0a7f] - broke out the classes in sketch.js into their own modules. Re-running

    wc -l source/*.js
    
gives us
      33 source/DNA.js
      53 source/Population.js
      70 source/Rocket.js
      14 source/Statistics.js
      64 source/sketch.js
     234 total
     
and the the draw call time is now:

- population,Average Draw Time(ms), min Draw Time(ms), max Draw Time(ms)
- 10, 0.86, 0.55, 5.25
- 20, 0.85, 0.55, 5.25

still about the same.

Wednesday, August 9, 2017
Did some really simple cleaning up of sketch.js, just some refactoring to make the draw function easier to read.
- Draw Time(ms), min, max
- 0.74, 0.55, 4.69

Source code size stats..
    wc -l source/*.js
      33 source/DNA.js
      53 source/Population.js
      70 source/Rocket.js
      14 source/Statistics.js
      68 source/sketch.js
     238 total
     
Friday, August 11 2017
More clean up: 
    - refactored code into smaller functions
    - Replaced 'if/else' blocks with '?:' where possible
    - Replaced for loops with forEach and map where possible
    
Not sure how to deal with this type of thing:
    var x = [];
    for (var i=0; i<10; ++i) {
        x.push(new Thing());
    }
So, I'll leave that alone for now.

- population,Average Draw Time(ms), min Draw Time(ms), max Draw Time(ms)
- 10, 0.88ms, 0.58ms, 4.87ms
- 20, 0.86ms, 0.58ms, 6.08ms
    
It seems that refactoring to a more functional style didn't really speed things up all that much.

Source code stats:
    wc -l source/*.js
      30 source/DNA.js
      65 source/Population.js
      67 source/Rocket.js
      14 source/Statistics.js
      68 source/sketch.js
     244 total

By breaking the code up into separate modules I haven't increased the size of the code too much. 

The next step will be to break out the target and obstacle into thier own classes/functions.
Or, I'd like to make the reporting a bit nicer, give it a nice dashboard instead of just popping up a line of text under the canvas.

# Acknowledgments
I started this repo by following [Daniel Shiffman's](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) Youtube video [Coding Challenge #29: Smart Rockets in p5.js](https://www.youtube.com/watch?v=bGz7mv2vD6g) very closely, you can find the repo associated with his video here [CC_029_SmartRockets](https://github.com/CodingTrain/website/tree/665d88d18fda2e7d02183709e0bbb7597d10debe/CodingChallenges/CC_029_SmartRockets).


