/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dmmayaglednbdnw")

  collection.name = "assets"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dmmayaglednbdnw")

  collection.name = "asset"

  return dao.saveCollection(collection)
})
