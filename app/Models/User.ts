import { DateTime } from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import Env from "@ioc:Adonis/Core/Env";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public privateKey: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
    user.privateKey = await Hash.make(this.generateIOTASeed())
  }

  public static generateIOTASeed(){
    const length = 81;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';

    var randomstring = require("randomstring");

    const seed = randomstring.generate({
      length:length,
      charset: charset
    })

    const Iota = require('@iota/core');
    const Converter = require('@iota/converter');

    const iota = Iota.composeAPI({
      provider: 'https://nodes.thetangle.org:443'
    })

    // Define a message to send.
// This message must include only ASCII characters.
    const message = JSON.stringify({"message": "Hello world"});

// Convert the message to trytes
    const messageInTrytes = Converter.asciiToTrytes(message);

// Define a zero-value transaction object
// that sends the message to the address
    const transfers = [
      {
        value: 0,
        address: Env.get('PUBLIC_IOTA_ADDRESS'),
        message: messageInTrytes
      }
    ];

    const depth = 3;
    const minimumWeightMagnitude = 14;

// Create a bundle from the `transfers` array
// and send the transaction to the node
    iota
      .prepareTransfers(seed, transfers)
      .then(trytes => {
        return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
      })
      .then(bundle => {
        console.log(bundle[0].hash);
      })
      .catch(err => {
        console.error(err)
      });


    return seed

  }
}
