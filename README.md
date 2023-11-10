# Stalker Bot

> Bot for who need save log, server management and a music bot.

## Stalker

<h3 align="center">Stalker</h3>

<div align="center">
  <img src="https://github.com/khouwdevin/stalker-discord/blob/master/images/spy.png" height="300px"/>
</div>

<h3 align="center">Stalker's Presence</h3>

<div align="center">
  <img src="https://github.com/khouwdevin/stalker-discord/blob/master/images/stalker-presence.png"/>
</div>

## How to Use Stalker Bot

### 1. Clone This Repository

```sh
git clone https://github.com/khouwdevin/stalker-discord.git
```

### 2. Put The Code to Host Server / Host It Locally

#### Local hosting

```node
npm install
npm run build
npm run start
```

#### Host Server

> if the host support automatically deploy from github, then just let the provider access your repository then it's done.

> if not then follow this instruction.

1. Apply this commands.
```node
npm install
npm run build
```

2. Upload the /dist/ folder.
3. Set node start to index.js inside host server setting.

#### Set up Lavalink

> use Docker to make easier

#### Set Up Environment Variables

> (local hosting) put the environment variables inside working directory and name the file to .env <br/>
> (using hosting provider) put the environment variables inside setting for environment variables

```env
TOKEN=(Discord bot token)
CLIENT_ID=(Discord client id)
PREFIX_COMMAND=$ #default prefix is $
MONGO_URI=(Mongo DB url) #if you don't want to use mongo then let it empty
MONGO_DATABASE_NAME=(Mongo Database name) #if you don't want to use mongo then let it empty
STALKER_DATABASE=(DB name in Mongo DB) #if you don't want to use mongo then let it empty
LAVALINK_PASSWORD=(Lavalink password)
LAVALINK_PORT=(Lavalink port)
LAVALINK_HOST=(Lavalink host or domain that used by Lavalink server)
LAVALINK_IDENTIFIER=(Fill it same as lavalink host)
SPOTIFY_CLIENTID=(Spotify client id) #if you don't want to use spotify then let it empty
SPOTIFY_CLIENT_SECRET=(Spotify client secret) #if you don't want to use mongo then let it empty
```

> you can Spotify client id and client secret from https://developer.spotify.com

### 3. Finishing

> after all done, then Stalker Bot should be appear and can be used!
