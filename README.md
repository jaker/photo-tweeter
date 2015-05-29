# photo-tweeter

This (rather crude) gulp script automatically tweets photos that are put in a specific folder.
It was designed to work in conjunction with an FTP server that would add photos to a specified folder.

There are two tasks that need to be run at the same time:

```shell
gulp resize-watch
gulp tweet-watch
```

Out of the box, the script requires the following structure (you can configure the folders easily in the script):

```shell
gulpfile.js      # gulpfile goes here
config.js        # configuration with Twitter creds
uploads/         # this is where the photos arrive <resize-watch: resize and copy to resized dir>
|--resized/      # photos are tweeted once they arrive here <tweet-watch>
```

`resize-watch`: watches `uploads` folder for images. When one arrives, do the following:
 - resizes the image (twitter has a 5mb limit) and copies it to `resized` folder

`tweet-watch`: watches `resized` folder for images. When one arrives, do the following:
 - tweet the image

 ### Twitter

 You'll need a registered twitter app with the following credentials. Put them in a separate file `config.js` that looks like this:

 ```javascript
 module.exports = {
   "consumer_key": "...",
   "consumer_secret": "...",
   "access_token": "...",
   "access_token_secret": "..."
 }
 ```
