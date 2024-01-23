const fs = require("fs").promises;
const minimist = require("minimist");

(async () => {
  try {
    // Fix links to /static resources to point to the demo's unique static directory.
    const args = minimist(process.argv.slice(2));
    const appDirectoryName = args.appDirectoryName;
    const demoIndexPath = args.demoIndexPath;
    const data = await fs.readFile(demoIndexPath, "utf8");
    const newData = data.replace(/\/static/g, `./${appDirectoryName}Static`);
    await fs.writeFile(demoIndexPath, newData);
  } catch (err) {
    console.error(err);
  }
})();
