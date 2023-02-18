# Discord Mirror
Make your account behave like a bot and mirror messages from a server to another (through webhooks).\
I take no responsibility for using this bot against Discord TOS.

## Features
- Send mirrored messages disguised as the original sender or using the webhook profile.
- Replace mentions of mirrored messages to match a valid mention on your server.
- Allow customization of status for the mirroring account (online, invisible, idle, busy).
- Allow mirroring all types of files.
- Allow mirroring one or more channels to one or more webhooks.

## Showcase
> Original message (from server A):\
![](https://i.imgur.com/ogelJ23.png)\
Mirrored message (to server B):\
![](https://i.imgur.com/C42OT64.png)

## How to use
1. Install [NodeJS](https://nodejs.org/en/download/).
2. Clone this repository.
3. Enter the project folder and:
   - Run: `npm install` to install the dependencies.
   - Configure `config.json` (see below).
4. Run: `npm start` to start the bot.
5. You are now mirroring! >:)

## Configuration guide
```json
{
   "token": "INSERT_YOUR_DISCORD_TOKEN_HERE",
   "status": "online",
   "mirrors": [
      {
         "use_webhook_profile": false,
         "channel_ids": [
            "INSERT_CHANNEL_ID_TO_MIRROR_HERE"
         ],
         "webhook_urls": [
            "INSERT_DESTINATION_WEBHOOK_URL_HERE"
         ]
      }
   ],
   "mentions": {
      "INSERT_ORIGINAL_SERVER_ID_HERE": [
         {
            "original": "INSERT_ORIGINAL_MENTION_ID_HERE",
            "replaced": "INSERT_REPLACED_MENTION_ID_HERE"
         }
      ]
   }
}
```
`token:` token of the discord account that will mirror. Learn how to find your token [here](https://www.androidauthority.com/get-discord-token-3149920/).\
(Note that the token must be that of a personal discord account and not a bot).

`status:` status of the account that will mirror: `online`, `offline`, `idle` or `dnd`.\
(Note that you must not be logged in the account while the bot starts for this option to take place).

`mirrors:` list of mirrors. A mirror is a section containing the following options:
   - `use_webhook_profile`: whether to use the profile of the webhook instead of being disguised as the message author for this mirror.
   - `channel_ids:` list of channel IDs for this mirror. When a message is sent in one of this channels, it is mirrored to all the webhooks in this mirror. (You can get the ID of a channel by enabling the **Developer mode** in your discord settings and **Right-Click** -> **Copy ID** on a channel).
   - `webhook_urls:` list of webhook URLs for this mirror. (You can create a webhook for a channel in your discord server with **Right-Click** -> **Integrations** -> **Create webhook**).

You can add as many mirrors as you like, for example:
```json
"mirrors": [
   {
      "use_webhook_profile": false,
      "channel_ids": [],
      "webhook_urls": []
   },
   {
      "use_webhook_profile": false,
      "channel_ids": [],
      "webhook_urls": []
   }
]
```

`mentions:` is a section containing mappings of mentions that must be replaced in mirrored messages.
   - `"INSERT_ORIGINAL_SERVER_ID_HERE":` ID of the server where the mention to replace was sent.
      - `original:` ID of the role/channel in the original server.
      - `replaced:` ID of the role/channel in the destination server.

You can add as many servers and as many mappings per server as you like, for example:
```json
"mentions": {
   "SERVER_ID_1": [
      {
         "original": "MENTION_1",
         "replaced": "MENTION_2"
      },
      {
         "original": "MENTION_3",
         "replaced": "MENTION_4"
      }
   ],
   "SERVER_ID_2": [
      {
         "original": "MENTION_5",
         "replaced": "MENTION_6"
      }
   ]
}
```
If you're somehow still unsure how to configure the bot, check out the examples in `example_configs/`.
