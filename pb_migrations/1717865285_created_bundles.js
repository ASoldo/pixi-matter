/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "y3zhgcgw6luy1o1",
    "created": "2024-06-08 16:48:05.918Z",
    "updated": "2024-06-08 16:48:05.918Z",
    "name": "bundles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lbnibiaj",
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
        "id": "s52rlfqy",
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
  const collection = dao.findCollectionByNameOrId("y3zhgcgw6luy1o1");

  return dao.deleteCollection(collection);
})
