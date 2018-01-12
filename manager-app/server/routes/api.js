const express = require('express');
const OC = require('../models/oc');
const Validator = require('../models/validator');
const Configuration = require('../models/configuration');
const Encryptor = require('../models/encryptor');

const router = express.Router();

router.post('/break', (req, res) => {
  try {
    OC.run(Configuration.getBreakConfig(req.body.level, req.body.key),
      () => {
        res.send({
          level: req.query.level,
          status: 'broken'
        });
      },
      (error) => {
        res.status(500).send({
          level: req.query.level,
          error: error
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({error: error.message});
  }
});

router.post('/fix', (req, res) => {
  try {
    OC.run(Configuration.getFixConfig(req.body.level, req.body.key),
      () => {
        res.send({
          level: req.query.level,
          status: 'fixed'
        });
      },
      (error) => {
        res.status(500).send({
          level: req.query.level,
          error: error
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({error: error.message});
  }
});

router.get('/check', (req, res) => {
  Validator.check(req.query.level, (passed) => {
    res.send({
      level: req.query.level,
      passed: passed
    });
  });
});

router.get('/encrypt', (req, res) => {
  const commands = JSON.parse(req.query.commands).join('\n');
  const ciphertext = Encryptor.encrypt(commands, req.query.key);
  res.send(ciphertext.toString());
});

router.post('/encrypt', (req, res) => {
  const config = JSON.parse(req.body.config);
  res.send(Encryptor.encryptFile(config, req.body.key));
});

router.post('/validatePassword', (req, res) => {
  if(Configuration.validatePassword(req.body.password)) {
    res.send('');
  } else {
    res.status(400).send('');
  }
});

router.get('/game', (req, res) => {
  res.send(Configuration.getGame());
});

module.exports = router;
