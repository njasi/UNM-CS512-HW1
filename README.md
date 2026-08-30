# CS 512 HW 1
Fall 2026

## Note to viewers
This repository is public as required by github pages (with a free github account). Future viewers are encouraged to actually do the assignment themselves... My actual webgl code isn't good anyway so...


## TODO:
- [x] Investigate the full code in HW1.html (renamed to index.html)
- [x] Implement shattering 'algorithm'
- [x] Link the shattered shapes into index.html
    - [x] figure out how to apply the shaders to each shape
        - [x] color
        - [x] vertex
    - [x] apply the update function to move the shapes
        - [ ] give shards initial speed in shatter
        - [ ] actually run the update function
    - [ ] add random spin to the shards
- [ ] add shatter button to index.html
- [ ] clean up the unneeded parts of index.html
- [ ] reset the scene after the shards are all gone
    - [ ] ensure shatter button is locked until shards are gone
- [x] add freeze frame to the shatter so its clear what happens
    - ended up making a shake effect before shatter for this instead
    - like a heartbeat effect -> could use vertex shaders to make
    - shards shrink and grow in place very quickly once for this 
