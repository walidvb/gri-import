const url = 'http://localhost:8000'

module.exports = {
  getItems: `${url}/api/item`,
  createItem: `${url}/api/item`,
  createCategory: `${url}/api/category`,
  createProvider: `${url}/api/provider`,
  addItemToProvider: providerId => `${url}/api/provider/${providerId}/items`
}