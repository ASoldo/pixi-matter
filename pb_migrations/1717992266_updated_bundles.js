/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q5ade7ybf5zpqru")

  // remove
  collection.schema.removeField("j7s9bjn4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qvrvydf3",
    "name": "name",
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
  const collection = dao.findCollectionByNameOrId("q5ade7ybf5zpqru")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j7s9bjn4",
    "name": "name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("qvrvydf3")

  return dao.saveCollection(collection)
})
