/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "q5ade7ybf5zpqru",
    "created": "2024-06-08 18:39:27.229Z",
    "updated": "2024-06-08 18:39:27.229Z",
    "name": "bundles",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
        "system": false,
        "id": "0un8eldp",
        "name": "assets",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "dmmayaglednbdnw",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("q5ade7ybf5zpqru");

  return dao.deleteCollection(collection);
})
