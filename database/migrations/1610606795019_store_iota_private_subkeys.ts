import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('private_key').nullable()
    })
  }

  public async down () {
    // @ts-ignore
    this.schema.table(this.tableName, (table) => {
    })
  }
}
