const axios = require('axios')
const slugify = require('slugify')

const csv = require('./csv')
const routes = require('./routes')

const createProvider = async (name) => {
  const res = await axios.post(routes.createProvider, {
    name
  }).catch((e) => console.error(`Error posting to ${routes.createProvider}`, e.response.data))
  const { data: { data: provider } } = res
  return provider
}

const createCategory = async (title) => {
  const res = await axios.post(routes.createCategory, {
    title,
    description: title,
    slug: slugify(title),
  }).catch((e) => console.error(`Error posting to ${routes.createCategory}`, e.response.data))
  try{
    const { data: { data: category } } = res
    return category
  }
  catch(e){
    console.log(res)
  }
}

const createItem = async (row, categoryId) => {
  const res = await axios.post(routes.createItem, {
    ...row,
    unit_price: parseFloat(row.unit_price),
    category_id: categoryId,
  }).catch((e) => console.error(`Error posting to ${routes.createItem}`, e.response.data.message))
  try{
    const { data: { data: item } } = res
    return item
  } catch(e) {
    console.log('Creating Item', e)
  }
}

const addItemToProvider = async (options, pId, item_id) => {
  const res = await axios.post(routes.addItemToProvider(pId), {
    ...options,
    item_id
  }).catch((e) => console.error(`Error posting to ${routes.addItemToProvider(pId)}`, e.response.data.message))
}

const processRow = async (row, provider_id) => {
  // don't process rows that aren't items
  // ie that don't have an ID
  if (!row.No || 
    !row.No.length ||
    !row.category ||
    !row.description ||
    !row.unit_price
  ){
    return
  }
  const { id: categoryId } = await createCategory(row.category)
  const item = await createItem(row, categoryId)
  const { unit_price } = row
  await addItemToProvider({
    unit_price: parseFloat(unit_price),
    provider_id,
    item_id: item.id,
    price: parseFloat(unit_price)/2,
  }, provider_id, item.id)
  console.log(`${item.id} created: ${item.description.slice(20)}`)
}

const main = async () => {
  const { id: providerId } = await createProvider('Smurf')
  csv((r) => processRow(r, providerId))
}

main()