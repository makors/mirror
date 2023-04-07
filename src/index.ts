import { MirrorClient } from "./client";
import config from '../config.json';

const client = new MirrorClient({checkUpdate: false});

client.start();
client.login(config.token);