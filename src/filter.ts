import { Message, MessageEmbed, ThreadChannel } from "discord.js-selfbot-v13";
import { getParentChannel } from "./utils";

enum FilterType {
  NONE = "none",
  WHITELIST = "whitelist",
  BLACKLIST = "blacklist",
}

enum FilterLocation {
  MESSAGE = "message",
  POST_TAG = "post_tag",
}

export interface FilterConfig {
  type: FilterType;
  keywords: string[];
  where: FilterLocation;
}

export class Filter {
  private type: FilterType;
  private location: FilterLocation;
  private keywords: string[];

  public constructor({ type, keywords, where }: FilterConfig) {
    if (!Object.values(FilterType).includes(type)) {
      throw new Error(`Invalid filter type: ${type}`);
    }
    if (!Object.values(FilterLocation).includes(where)) {
      throw new Error(`Invalid filter location: ${where}`);
    }
    this.type = type;
    this.location = where;
    this.keywords = keywords.map((keyword) => keyword.toLowerCase());
  }

  public doesMatchFilter(message: Message): boolean {
    if (this.type == FilterType.NONE) {
      return true;
    }

    return this.location == FilterLocation.MESSAGE
      ? this.doesMessageMatchFilter(message)
      : this.doesTagMatchFilter(message);
  }

  private doesMessageMatchFilter(message: Message): boolean {
    return (
      this.doesContentMatchFilter(message) || this.doEmbedsMatchFilter(message)
    );
  }

  private doesContentMatchFilter(message: Message): boolean {
    const content = message.content.toLowerCase();

    return this.type == FilterType.WHITELIST
      ? this.keywords.some((keyword) => content.includes(keyword))
      : !this.keywords.some((keyword) => content.includes(keyword));
  }

  private doEmbedsMatchFilter(message: Message): boolean {
    return (
      message.embeds.length > 0 &&
      message.embeds.every((embed) => this.passesEmbedFilter(embed))
    );
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
}
