const { WebhookClient } = require('discord.js-selfbot-v13');

module.exports = class MirrorWebhook extends WebhookClient {
   constructor(webhook) {
      super(webhook.data, webhook.options);
      this.useCustomProfile = webhook.useCustomProfile;
      this.messageMustContainEmbeds = webhook.messageMustContainEmbeds;

      if (!this.useCustomProfile) {
         return;
      }

      this.name = null;
      this.avatar = null;
      this.avatarUrl = null;
      this.fillWebhookData();
   }

   fillWebhookData() {
      this.fetchData('fillData');
   }

   fetchData(postFetchCallback) {
      fetch(this.url)
         .then(response => response.json())
         .then(data => this[postFetchCallback](data));
   }

   fillData(data) {
      this.name = data['name'];
      this.avatar = data['avatar'];
      this.avatarUrl = this.avatarURL();
   }

   avatarURL() {
      if (this.avatarUrl) {
         return this.avatarUrl;
      }
      
      if (!this.avatar) {
         return null;
      }

      return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.webp`;
   }
}