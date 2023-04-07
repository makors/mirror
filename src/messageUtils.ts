import { Message, MessageFlags } from "discord.js-selfbot-v13";

export function isSystemMessage(message: Message): boolean {
   return message.system;
}

export function isDirectMessage(message: Message): boolean {
   return !message.guild;
}

export function isVisibleOnlyByClient(message: Message): boolean {
   return message.flags.has(MessageFlags.FLAGS.EPHEMERAL);
}

export function containsOnlyAttachments(message: Message): boolean {
   return message.attachments.size > 0 && !message.content.length && !message.embeds.length;
}