const { Client } = require('discord.js-selfbot-v13');
const MirrorWebhook = require('./webhook');
const { isEphemeral, replaceMentions, isDirectMessage } = require('./utils');
const config = require('../config.json'); 

module.exports = class MirrorClient extends Client {
   constructor(options) {
      super(options);
      this.mirrors = this.loadMirrors();
      this.ignoredUsers = this.loadIgnoredUsers();
      this.bindEvents();
   }

   loadMirrors() {
      const mirrors = {};

      for (const mirror of config['mirrors']) {
         const webhooks = mirror['webhook_urls'].map(webhookUrl => {
            return new MirrorWebhook({ 
               data: { url: webhookUrl },
               useCustomProfile: mirror['use_webhook_profile'],
               messageMustContainEmbeds: mirror['message_to_mirror_must_contain_embeds']
            });
         });

         for (const channelId of mirror['channel_ids']) {
            mirrors[channelId] = webhooks;
         }
      }

      return mirrors;
   }

   loadIgnoredUsers() {
      return new Set([...config['ignored_user_ids']]);
   }

   isIgnoredUser(user) {
      return this.ignoredUsers.has(user.id);
   }

   bindEvents() {
      this.on('ready', this.onReady);
      this.on('messageCreate', this.onMessage);
   }

   onReady() {
      console.log(`${this.user.tag} is now mirroring >:)`);
      this.user.setPresence({ status: config['status'] });
   }

   onMessage(message) {
      if (message.system || isDirectMessage(message) || isEphemeral(message)) {
         return;
      }

      if (this.isIgnoredUser(message.author)) {
         return;
      }

      const webhooks = this.mirrors[message.channelId];

      if (!webhooks) {
         return;
      }

      const mentionLength = '<*000000000000000000>'.length;

      if (message.content.length >= mentionLength) {
         replaceMentions(message);
      }

      for (const webhook of webhooks) {
         if (webhook.messageMustContainEmbeds && !message.embeds.length) {
            continue;
         }

         webhook.send({
            content: message.content.length ? message.content : null,
            files: [...message.attachments.values()],
            username: webhook.useCustomProfile ? webhook.name : message.author.username,
            avatarURL: webhook.useCustomProfile ? webhook.avatarUrl : message.author.displayAvatarURL(),
            embeds: message.embeds
         }).catch(console.error);
      }
   }
}