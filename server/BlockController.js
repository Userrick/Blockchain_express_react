import Block from './Block.js';
import Blockchain from './simpleChain.js';
import path from 'path';
import Mempool from './mempool.js';
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.mempool = new Mempool();
    this.requestValidation();
    this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */

   requestValidation() {
     this.app.post('/requestValidation', (req, res) => {
       let address = '1CBC8hDRV8PYt4Z95To3dhmCzmXgfbFG3m';
       this.mempool.functionWichWillPutRequestInMempool(address).then((responseFromMempool) => {
         console.log(responseFromMempool);
         res.send(responseFromMempool);
       });
     });
   }


  getBlockByIndex() {
    this.app.get('/api/block/:index', (req, res) => {
      let myBlockchain = new Blockchain();
      myBlockchain.getChain()
        .then((chain) => {
          if (req.params.index < chain.length) {
            myBlockchain.getBlock(req.params.index).then((block) => {
              console.log(block);
              return res.send(block);
            });
          } else {
            return res.send('Block not found');
          }
        });
    });
  }
  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post('/api/block', (req, res) => {
      let myBlockchain = new Blockchain();
      let message = req.body.body;
      if (req.body.body === undefined || req.body.body.length === 0) {
        return res.send('No Body -> No Block Added');
      } else {
        console.log(message);
        let blockToAdd = new Block(message);
        myBlockchain.addBlock(blockToAdd)
          .then((blockToAdd) => {
            console.log(blockToAdd);
            return res.send(blockToAdd);
          });
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 1 genesis block to levelDB
   */
  initializeMockData() {
    this.app.get('/', (req, res) => {
      return res.sendFile(path.join(__dirname + '/../README.md'));
    });
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app) => {
  return new BlockController(app);
};
