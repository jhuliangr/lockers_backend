const { lockersHardcodedDatabase } = require("../database/hardcoded_data");
const path = require("path");
const fs = require("fs");

module.exports = {
  checkState(req, res) {
    lockersHardcodedDatabase[0].actualPin++;
    return res
      .status(200)
      .send("Working " + lockersHardcodedDatabase[0].actualPin);
  },
  requestOpenLocker(req, res) {
    const { id } = req.params;
    const locker = lockersHardcodedDatabase.find((locker) => locker.id === id);
    if (!locker) {
      return res
        .status(400)
        .sendFile(path.join(__dirname, "../public", "not-found.html"));
    }
    if (locker.free) {
      const filePath = path.join(__dirname, "../public", "enter-pin.html");
      return fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error reading data from disk" });
        }
        const htmlConId = data.replace("{id}", req.params.id);
        return res.status(200).send(htmlConId);
      });
    }
    return res
      .status(503)
      .sendFile(path.join(__dirname, "../public", "not-available.html"));
  },
  setPasswordAndLock(req, res) {
    const { id } = req.params;
    const { pin } = req.body;
    const lockerIndex = lockersHardcodedDatabase.findIndex(
      (locker) => locker.id === id
    );
    lockersHardcodedDatabase[lockerIndex].actualPin = pin;
    lockersHardcodedDatabase[lockerIndex].free = false;
    lockersHardcodedDatabase[lockerIndex].canOpen = true;
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../public", "success.html"));
  },
  unlock(req, res) {
    const { id } = req.params;
    const { pin } = req.body;
    const lockerIndex = lockersHardcodedDatabase.findIndex(
      (locker) => locker.id === id
    );
    if (pin === lockersHardcodedDatabase[lockerIndex].actualPin) {
      lockersHardcodedDatabase[lockerIndex].free = true;
      lockersHardcodedDatabase[lockerIndex].actualPin = 1234;
      return res.status(200).json({ message: "unlocked successfully" });
    }
    return res.status(400).json({ message: "Incorrect PIN" });
  },
  checkIfCanBeOpened(req, res) {
    const { id } = req.params;
    const lockerIndex = lockersHardcodedDatabase.findIndex(
      (locker) => locker.id === id
    );
    if (lockersHardcodedDatabase[lockerIndex].canOpen) {
      lockersHardcodedDatabase[lockerIndex].canOpen = false;
      return res.status(200).json({ message: "open" });
    }
    return res.status(400).json({ message: "Not possible to open" });
  },
};
