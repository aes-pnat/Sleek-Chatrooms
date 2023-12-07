import App from "./src/Sleek";
import { messageCallback, wait } from "./utils";
import readline from "readline";

App.setOutputChannel(messageCallback);
//App.setServerDebug();

const main = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (input) => {
    const queue = input.split("|");
    for (const e of queue) {
      await wait(500 * (1 + Math.random()));
      App.acceptMessage(e.trim());
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
};

main();
