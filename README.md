# SyncStream

Ever wanted to watch a YouTube video with someone across the world as if they were right next to you? We can't do teleportation, but we can sync a video across many browser sessions!

## Overview

This is a prototype/proof of concept. To start a session all you need to do is copy and paste the URL you get when watching a YouTube video. Any users with the same URL will share a session. If one user pauses, resumes, or skips to a different time the video will sync across all users. A chat is also integrated into the website, allowing users to communicate with each other while watching a video. 

## Setup

1. Clone repo.
2. Open a terminal in the directory where you cloned the repo.
3. Install [node.js] (https://nodejs.org/en/).
4. Type `npm install`.
5. Type `node app.js`.
6. Open your favorite browser and go to [`localhost:3000`] (http://localhost:3000/).

## Notes

* Sometimes the middle of the screen (the video section) will remain blank when changing a video. This is a weird bug that happens due to unknown reasons. If this happens to you a simple page refresh should solve it.
* Sessions are not private - anyone who happens to choose the same video as you becomes a guest in your session! Beware the trolls!
* The YouTube API doesn't really let you capture *seek* events so we had to work around it to stop an infinite loop of craziness and video play-pause looping back and forth. AKA we had to implement a post-event timeout during which any action on the video player will not propogate to the other clients.

## Credit

SyncStream was built over a weekend at the 2016 Facebook London Hackathon by Alessandro Fael, Adi Mukherjee, Evgeny Roskach and Jawwad Farid.
