# Discord Mirror

Make your account behave like a bot and mirror messages from a server to another (through webhooks).

## Showcase

> Original message (from server A):\
![](https://i.imgur.com/ogelJ23.png)\
Mirrored message (to server B):\
![](https://i.imgur.com/C42OT64.png)

## Main Features

- Replace mentions and other content in the message with the desired replacement.
- Disguise mirrored messages as the original sender or use a custom webhook profile.
- Prevent specific users from being mirrored.
- Support mirroring as many channels as you want to as many webhooks as you want.

## How To Use
1. Install [NodeJS](https://nodejs.org/en/download).
2. Clone this repository.
3. Navigate to the project folder and run `npm install` to install the dependencies.
4. Run `npm run compile` to compile the bot.
5. Configure `config.json` (see Configuration guide below).
5. Run `npm start` to start the bot.

## Configuration Guide

**Token**: The token of the personal Discord account that will mirror messages. Learn how to find your account token [here](https://www.androidauthority.com/get-discord-token-3149920/).
```json
"token": "INSERT_YOUR_DISCORD_TOKEN_HERE"
```

**Status**: The status of account that will mirror messages. The available options are: `online`, `offline`, `idle` or `dnd`.

```json
"status": "online"
```

**Log Message**: Message sent in the console when a message is mirrored. The following placeholders can be used:
- `<date>`: the date and time when the message was sent.
- `<author>`: the username and discriminator of the message author.
- `<server>`: the name of the server where the message was originally sent.

```json
"log_message": "[<date>] Mirrored <author>'s message from <server>."
```

**Mirrors**: List of mirror configurations. Each mirror configuration describes a set of channels to mirror and destination webhooks to send mirrored messages to. (A webhook can be created for a channel with: **Right-click** -> **Edit channel** -> **Integrations** -> **Create webhook**.)

```json
"mirrors": [
   {
      "channel_ids": [
         "INSERT_CHANNEL_ID_TO_MIRROR_HERE"
      ],
      "webhook_urls": [
         "INSERT_DESTINATION_WEBHOOK_URL_HERE"
      ]
   }
]
```

Each mirror can also contain additional options:

**Mirrors → Ignored users**: List of user IDs of users whose messages should not be mirrored.

```json
"ignored_user_ids": [
   "INSERT_USER_ID_NOT_TO_MIRROR_HERE"
]
```

**Mirrors → Requirements**: Requirements that a message must meet to be mirrored.

```json
"requirements": {
   "min_embeds_count": 0,
   "min_content_length": 0,
   "min_attachments_count": 0
}
```

**Mirrors → Options**: Options that control how the bot should mirror messages.
- `use_webhook_profile`: if true, the webhook's profile picture and name will be used for the mirrored message. If false, the message author's profile picture and name will be used.
- `remove_attachments`: if true, attachments will be removed from the mirrored message.
- `mirror_messages_from_bots`: if true, messages from bots will be mirrored. If false, they will not.
- `mirror_reply_messages`: if true, messages that are replies to another message will be mirrored. If false, they will not.

```json
"options": {
   "use_webhook_profile": false,
   "remove_attachments": false,
   "mirror_messages_from_bots": true,
   "mirror_reply_messages": true
}
```

**Mirrors → Replacements**: Replacements to perform in the mirrored message.
```json
"replacements": {
   "content": [
      {
         "replace": "INSERT_TEXT_TO_REPLACE_HERE",
         "with": "INSERT_REPLACEMENT_TEXT_HERE"
      }
   ]
}
```

To replace @mentions and ensure a valid reference on the mirrored server, you can define a content replacement like this:

```json
"replacements": {
   "content": [
      {
         "replace": "ORIGINAL_ROLE_OR_USER_OR_CHANNEL_ID",
         "with": "REPLACED_ROLE_OR_USER_OR_CHANNEL_ID"
      }
   ]
}
```

Check `config.json` for all the available replacements. Also, You can find valid config examples in the `example_configs/` folder.

## Disclaimer

Note that using a Discord Self Bot is against the [Discord TOS](https://discord.com/terms), and the creator of this bot takes no responsibility for any consequences that may arise from using it.
