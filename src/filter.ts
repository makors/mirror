import { Message, MessageEmbed, ThreadChannel } from "discord.js-selfbot-v13";
import { getParentChannel } from "./utils";

enum FilterType {
   NONE,
   WHITELIST,
   BLACKLIST
}

enum FilterLocation {
   MESSAGE,
   POST_TAG
}

export interface FilterConfig {
   type: "none" | "whitelist" | "blacklist";
   keywords: string[];
   where: "message" | "post_tag";
}

export class Filter {
   private type: FilterType;
   private location: FilterLocation;
   private keywords: string[];

   public constructor({ type, keywords, where }: FilterConfig) {
      this.type = this.parseType(type);
      this.location = this.parseLocation(where);
      this.keywords = keywords.map((keyword) => keyword.toLowerCase());
   }

   public doesMatchFilter(message: Message): boolean {
      if (this.type == FilterType.NONE) {
         return true;
      }

      return this.location == FilterLocation.MESSAGE
         ? this.doesContentMatchFilter(message)
         : this.doesTagMatchFilter(message);
   }

   private doesContentMatchFilter(message: Message): boolean {
      return this.passesContentFilter(message) && this.passesEmbedsFilter(message);
   }

   private passesContentFilter(message: Message): boolean {
      const content = message.content.toLowerCase();
      
      return this.type == FilterType.WHITELIST
         ? this.keywords.some((keyword) => content.includes(keyword))
         : !this.keywords.some((keyword) => content.includes(keyword));
   }

   private passesEmbedsFilter(message: Message): boolean {
      return message.embeds.every((embed) => this.passesEmbedFilter(embed));
   }

   private passesEmbedFilter(embed: MessageEmbed): boolean {
      return this.type == FilterType.WHITELIST
         ? this.embedContainsSomeKeywords(embed)
         : !this.embedContainsSomeKeywords(embed);
   }

   private embedContainsSomeKeywords(embed: MessageEmbed): boolean {
      const content = [
         embed.title,
         embed.description,
         embed.fields.map((field) => field.name + field.value).join(""),
         embed.footer?.text,
         embed.author?.name,
      ]
         .join("")
         .toLowerCase();

      return this.keywords.some((keyword) => content.includes(keyword));
   }

   private doesTagMatchFilter(message: Message): boolean {
      const parent = getParentChannel(message);
      if (!parent) {
         return true;
      }

      if (parent.type !== "GUILD_FORUM") {
         return true;
      }

      const channel = message.channel as ThreadChannel;
      const tags = parent.availableTags
         .filter((tag) => channel.appliedTags.includes(tag.id))
         .map((tag) => tag.name.toLowerCase());

      return this.type == FilterType.WHITELIST
         ? this.keywords.some((keyword) => tags.includes(keyword))
         : !this.keywords.some((keyword) => tags.includes(keyword));
   }

   private parseType(type: FilterConfig["type"]): FilterType {
      switch (type) {
         case "none":
            return FilterType.NONE;
         case "whitelist":
            return FilterType.WHITELIST;
         case "blacklist":
            return FilterType.BLACKLIST;
         default:
            throw new Error(`Invalid filter type: ${type}`);
      }
   }

   private parseLocation(location: FilterConfig["where"]): FilterLocation {
      switch (location) {
         case "message":
            return FilterLocation.MESSAGE;
         case "post_tag":
            return FilterLocation.POST_TAG;
         default:
            throw new Error(`Invalid filter location: ${location}`);
      }
   }
}
