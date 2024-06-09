/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jmyh8q54zf0xeuv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zvqvj3tl",
    "name": "scene",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "GameScene1",
        "GameScene2",
        "GameScene3",
        "GameScene4",
        "GameScene5"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jmyh8q54zf0xeuv")

  // remove
  collection.schema.removeField("zvqvj3tl")

  return dao.saveCollection(collection)
})
